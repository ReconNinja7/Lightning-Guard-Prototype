// src/components/ThreatAnalyzer.tsx
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, FileText, Zap, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  threatLevel: "safe" | "warning" | "danger";
  confidence: number;
  category: string;
  details: string;
  recommendations: string[];
  securityRecommendations?: string;
  services?: string;
}

type FileWithPreview = {
  id: string;
  file: File;
  preview?: string | null;
};

export const ThreatAnalyzer: React.FC = () => {
  const { toast } = useToast();

  // states
  const [input, setInput] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // keep ref for cleanup on unmount
  const filesRef = useRef<FileWithPreview[]>([]);
  filesRef.current = files;

  // clean up object URLs on unmount
  useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => {
        if (f.preview) try { URL.revokeObjectURL(f.preview); } catch (e) {}
      });
    };
  }, []);

  // helpers
  const normalizeList = (v: any): string[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
    if (typeof v === "string") {
      return String(v)
        .split(/\r?\n|-\s+|•|\*+/)
        .map((s) => s.replace(/^\s*[-•\*]+\s*/, "").trim())
        .filter(Boolean);
    }
    return [String(v)];
  };

  // add selected files (multiple)
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fl = e.target.files;
    if (!fl || fl.length === 0) return;
    const next: FileWithPreview[] = [];
    for (let i = 0; i < fl.length; i++) {
      const f = fl[i];
      const id = `${Date.now()}_${i}_${f.name}`;
      const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : null;
      next.push({ id, file: f, preview });
    }
    setFiles((prev) => {
      const merged = [...prev, ...next];
      const MAX_KEEP = 8;
      if (merged.length > MAX_KEEP) {
        // revoke extras
        merged.slice(MAX_KEEP).forEach((m) => m.preview && URL.revokeObjectURL(m.preview));
        return merged.slice(0, MAX_KEEP);
      }
      return merged;
    });
    // reset native input to allow re-selecting same file
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // remove file (revokes preview)
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const toRemove = prev.find((p) => p.id === id);
      if (toRemove?.preview) try { URL.revokeObjectURL(toRemove.preview); } catch (e) {}
      return prev.filter((p) => p.id !== id);
    });
  };

  // main analyze
  const handleAnalyze = async () => {
    const text = input || "";
    if (!text.trim() && files.length === 0) {
      toast({
        title: "Input Required",
        description: "Please enter text or attach files to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      let resp: Response;

      if (files.length > 0) {
        const fd = new FormData();
        if (input.trim()) fd.append("text", input.trim());
        files.forEach(f => fd.append("files", f.file)); 

        // append as 'files' array
        files.forEach((f) => fd.append("files", f.file));

        const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
        resp = await fetch(`${base}/api/analyze-file`, { method: "POST", body: fd });

      } else {
        const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
        resp = await fetch(`${base}/api/analyze-text`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.trim() }),
        });
      }

      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(txt || `Server returned ${resp.status}`);
      }
      const data = await resp.json();

      // normalize response safely
      const recommendations = normalizeList(data.recommendations);
      const securityRecommendations = Array.isArray(data.securityRecommendations)
        ? (data.securityRecommendations as string[]).join("\n")
        : data.securityRecommendations ?? "";
      const services = Array.isArray(data.services) ? (data.services as string[]).join("\n") : data.services ?? "";

      const analysisResult: AnalysisResult = {
        threatLevel: (data.threatLevel as AnalysisResult["threatLevel"]) || "warning",
        confidence: typeof data.confidence === "number" ? data.confidence : Number(data.confidence) || 70,
        category: data.category || "Uncategorized",
        details: data.details || data.explanation || "No details provided by AI.",
        recommendations: recommendations.length ? recommendations : ["Stay cautious."],
        securityRecommendations: securityRecommendations || undefined,
        services: services || undefined,
      };

      setResult(analysisResult);

      toast({
        title: "Analysis Complete",
        description: `Threat level: ${analysisResult.threatLevel.toUpperCase()}`,
        variant: analysisResult.threatLevel === "danger" ? "destructive" : "default",
      });

      // optional: clear files after successful analyze (comment/uncomment as you prefer)
      // files.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
      // setFiles([]);
    } catch (err: any) {
      console.error("Analyze error:", err);
      toast({
        title: "Error",
        description: String(err?.message || "Something went wrong"),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case "safe":
        return "threat-safe";
      case "warning":
        return "threat-warning";
      case "danger":
        return "threat-danger";
      default:
        return "bg-muted";
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case "safe":
        return <Shield className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "danger":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <Card className="electric-glow border-electric/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-electric">
            <Zap className="w-6 h-6" />
            Lightning Guard Threat Analyzer
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="text" className="w-full justify-center gap-2">
                <FileText className="w-4 h-4" />
                Threat Analyzer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-4">
              <div className="relative">
                <Textarea
                  placeholder="Paste suspicious text, email content, or message here..."
                  className="min-h-[120px] bg-secondary/50 border-electric/20"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />

                {/* paperclip at bottom-left (opens OS file picker) */}
                <label
                  htmlFor="lg-file"
                  className="cursor-pointer absolute left-3 bottom-3 z-20 p-1"
                  title="Attach files"
                >
                  <Paperclip className="w-4 h-4 text-cyan-50" />
                </label>

                <input
                  ref={fileInputRef}
                  id="lg-file"
                  type="file"
                  accept=".pdf,.txt,.png,.jpg,.jpeg,.apk"
                  multiple
                  className="hidden"
                  onChange={handleFilesSelected}
                />
              </div>

              {/* previews (small thumbnails / file cards) */}
              {files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="relative group rounded-md overflow-hidden border border-electric/20"
                      style={{ width: 96 }}
                    >
                      {f.preview ? (
                        <img
                          src={f.preview}
                          alt={f.file.name}
                          className="h-16 w-full object-cover block"
                          // clicking the image removes as requested
                          onClick={() => removeFile(f.id)}
                        />
                      ) : (
                        <div
                          className="flex items-center gap-2 p-2 bg-secondary/30 cursor-pointer"
                          onClick={() => removeFile(f.id)}
                        >
                          <FileText className="w-4 h-4 text-cyber" />
                          <div className="flex-1">
                            <div className="text-xs font-medium truncate">{f.file.name}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {(f.file.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                      )}

                      {/* cross button on hover (also removes) */}
                      <button
                        onClick={() => removeFile(f.id)}
                        aria-label="Remove file"
                        title="Remove file"
                        className="absolute top-1 right-1 bg-destructive/90 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="mt-4 w-full bg-gradient-primary hover:opacity-90 text-primary-foreground electric-glow"
          >
            {isAnalyzing ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Threats...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Analyze for Threats
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card className="cyber-glow border-cyber/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-cyber">Analysis Results</span>
              <Badge variant="outline" className={`${getThreatColor(result.threatLevel)} text-white border-none`}>
                {getThreatIcon(result.threatLevel)}
                {result.threatLevel.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Confidence */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Confidence Score</span>
                <span className="text-sm text-muted-foreground">{Math.round(result.confidence)}%</span>
              </div>
              <Progress value={result.confidence} className="h-2" />
            </div>

            {/* Category */}
            <div>
              <h4 className="font-semibold mb-2 text-electric">Threat Category</h4>
              <Badge variant="secondary" className="text-sm">
                {result.category}
              </Badge>
            </div>

            {/* Details */}
            <div>
              <h4 className="font-semibold mb-2 text-electric">Analysis Details</h4>
              <p className="text-muted-foreground">{result.details}</p>
            </div>

            {/* Key Findings */}
            <div>
              <h4 className="font-semibold mb-3 text-electric">Key Findings</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 text-cyber shrink-0" />
                    <span className="text-sm text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Recommendations */}
            <div className="mt-4">
              <h2 className="font-semibold mb-3 text-electric">Security Recommendations</h2>
              {result.securityRecommendations ? (
                <ul className="text-sm text-muted-foreground space-y-2">
                  {normalizeList(result.securityRecommendations).map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Shield className="w-4 h-4 mt-0.5 text-cyber shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">None</p>
              )}
            </div>

            {/* Services */}
            <div className="mt-4">
              <h2 className="font-semibold mb-3 text-electric">Services</h2>
              {result.services ? (
                <ul className="text-sm text-muted-foreground space-y-2">
                  {normalizeList(result.services).map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Shield className="w-4 h-4 mt-0.5 text-cyber shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">None</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
