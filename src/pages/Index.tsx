import { LightningBackground } from '@/components/LightningBackground';
import { WaveBackground } from '@/components/WaveBackground';
import { ThreatAnalyzer } from '@/components/ThreatAnalyzer';
import { Shield, Zap, Eye, Lock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <LightningBackground />
      <WaveBackground />
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-primary electric-glow">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Lightning Guard
            </h1>
          </div>
          
          <h2 className="text-2xl text-muted-foreground mb-4">
            Advanced Misinformation & Threat Detection
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Protect yourself from phishing, malware, and misinformation with our AI-powered analysis engine. 
            Get real-time threat assessment and security recommendations.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { icon: Shield, label: 'Threat Detection' },
              { icon: Eye, label: 'Real-time Analysis' },
              { icon: Lock, label: 'Security Reports' },
              { icon: Zap, label: 'Instant Results' }
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-electric/20">
                <Icon className="w-4 h-4 text-electric" />
                <span className="text-sm text-electric">{label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Analyzer */}
        <ThreatAnalyzer />
        
        {/* Footer spacing for waves */}
        <div className="h-32" />
      </div>
    </div>
  );
};

export default Index;
