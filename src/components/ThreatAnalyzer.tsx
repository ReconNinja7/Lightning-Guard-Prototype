import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, Globe, FileText, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  threatLevel: 'safe' | 'warning' | 'danger';
  confidence: number;
  category: string;
  details: string;
  recommendations: string[];
}

export const ThreatAnalyzer = () => {
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const mockAnalysis = (content: string): AnalysisResult => {
    // Mock analysis logic - in real app, this would call your AI service
    const hasPhishingKeywords = /login|password|verify|urgent|suspended/i.test(content);
    const hasUrls = /https?:\/\/[^\s]+/i.test(content);
    
    if (hasPhishingKeywords && hasUrls) {
      return {
        threatLevel: 'danger',
        confidence: 85 + Math.random() * 10,
        category: 'Phishing Attempt',
        details: 'Contains suspicious language and external links commonly used in phishing attacks.',
        recommendations: [
          'Do not click any links in this content',
          'Verify sender through official channels',
          'Report as phishing to your security team'
        ]
      };
    } else if (hasPhishingKeywords || hasUrls) {
      return {
        threatLevel: 'warning',
        confidence: 60 + Math.random() * 20,
        category: 'Potentially Suspicious',
        details: 'Contains elements that could indicate misinformation or security risks.',
        recommendations: [
          'Exercise caution with any links or requests',
          'Verify information through trusted sources',
          'Consider reporting if suspicious'
        ]
      };
    } else {
      return {
        threatLevel: 'safe',
        confidence: 90 + Math.random() * 10,
        category: 'Content Appears Safe',
        details: 'No obvious security threats or misinformation patterns detected.',
        recommendations: [
          'Content appears to be legitimate',
          'Continue normal interaction',
          'Stay vigilant for future communications'
        ]
      };
    }
  };

  const handleAnalyze = async () => {
    const content = input || url;
    if (!content.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text or URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const analysisResult = mockAnalysis(content);
      setResult(analysisResult);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Threat level: ${analysisResult.threatLevel.toUpperCase()}`,
        variant: analysisResult.threatLevel === 'danger' ? 'destructive' : 'default',
      });
    }, 2000);
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'safe': return 'threat-safe';
      case 'warning': return 'threat-warning';
      case 'danger': return 'threat-danger';
      default: return 'bg-muted';
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'safe': return <Shield className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'danger': return <AlertTriangle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Text Analysis
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                URL Analysis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="mt-4">
              <Textarea
                placeholder="Paste suspicious text, email content, or message here..."
                className="min-h-[120px] bg-secondary/50 border-electric/20"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </TabsContent>
            
            <TabsContent value="url" className="mt-4">
              <Input
                placeholder="Enter suspicious URL or website link..."
                className="bg-secondary/50 border-electric/20"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
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
            {/* Confidence Score */}
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

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold mb-3 text-electric">Security Recommendations</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 text-cyber shrink-0" />
                    <span className="text-sm text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};