import { useEffect, useState } from 'react';

export const LightningBackground = () => {
  const [bolts, setBolts] = useState<Array<{ id: number; left: string; delay: string }>>([]);

  useEffect(() => {
    // Create random lightning bolts
    const createBolts = () => {
      const newBolts = Array.from({ length: 3 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`
      }));
      setBolts(newBolts);
    };

    createBolts();
    // Recreate bolts every 10 seconds for variety
    const interval = setInterval(createBolts, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Lightning flash overlay */}
      <div className="lightning-strike absolute inset-0" />
      
      {/* Lightning bolts */}
      {bolts.map((bolt) => (
        <div
          key={bolt.id}
          className="lightning-bolt"
          style={{
            left: bolt.left,
            animationDelay: bolt.delay,
          }}
        />
      ))}
      
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-electric/5 via-transparent to-cyber/5 animate-pulse-electric" />
    </div>
  );
};