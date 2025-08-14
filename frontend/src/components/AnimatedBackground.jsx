import React, { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Criar partículas animadas
    const particleCount = 50;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 15,
        size: Math.random() * 3 + 2
      });
    }
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradiente de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card opacity-90" />
      
      {/* Mapa do mundo como fundo */}
      <div className="absolute inset-0 opacity-10">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-cover"
          style={{ filter: 'blur(1px)' }}
        >
          {/* Continentes simplificados */}
          <path
            d="M150 200 Q200 180 250 200 Q300 220 350 200 Q400 180 450 200 L450 250 Q400 270 350 250 Q300 270 250 250 Q200 270 150 250 Z"
            fill="currentColor"
            className="text-primary/20"
          />
          <path
            d="M500 150 Q550 130 600 150 Q650 170 700 150 Q750 130 800 150 L800 200 Q750 220 700 200 Q650 220 600 200 Q550 220 500 200 Z"
            fill="currentColor"
            className="text-primary/20"
          />
          <path
            d="M100 300 Q150 280 200 300 Q250 320 300 300 L300 350 Q250 370 200 350 Q150 370 100 350 Z"
            fill="currentColor"
            className="text-primary/20"
          />
          <path
            d="M600 250 Q650 230 700 250 Q750 270 800 250 Q850 230 900 250 L900 300 Q850 320 800 300 Q750 320 700 300 Q650 320 600 300 Z"
            fill="currentColor"
            className="text-primary/20"
          />
        </svg>
      </div>
      
      {/* Partículas animadas */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.animationDelay}s`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
      </div>
      
      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
    </div>
  );
};

export default AnimatedBackground;

