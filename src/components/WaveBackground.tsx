import { Shield, Lock, Eye, Zap } from 'lucide-react';

export const WaveBackground = () => {
  const securityIcons = [
    { Icon: Shield, delay: '0s' },
    { Icon: Lock, delay: '2s' },
    { Icon: Eye, delay: '4s' },
    { Icon: Zap, delay: '6s' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full pointer-events-none overflow-hidden">
      {/* Animated waves */}
      <div className="relative h-32">
        <div className="wave absolute bottom-0 w-full h-20 bg-gradient-to-r from-electric/10 via-cyber/20 to-electric/10 animate-wave-flow" />
        <div className="wave absolute bottom-0 w-full h-16 bg-gradient-to-r from-cyber/15 via-electric/25 to-cyber/15" style={{ animationDelay: '-2s', animationDuration: '6s' }} />
        <div className="wave absolute bottom-0 w-full h-12 bg-gradient-to-r from-electric/20 via-cyber/30 to-electric/20" style={{ animationDelay: '-4s', animationDuration: '10s' }} />
      </div>
      
      {/* Floating security icons */}
      <div className="absolute bottom-8 left-0 w-full">
        <div className="flex justify-around items-center px-8">
          {securityIcons.map(({ Icon, delay }, index) => (
            <div
              key={index}
              className="animate-pulse-electric opacity-30"
              style={{ animationDelay: delay }}
            >
              <Icon className="w-8 h-8 text-electric" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};