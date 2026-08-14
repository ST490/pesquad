import React from 'react';
import DotField from './DotField';

export const BackgroundBlobs: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep Obsidian Black Base Gradient with warm ember undertones */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(247, 137, 0, 0.08) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(155, 1, 3, 0.12) 0%, transparent 45%), linear-gradient(to bottom, #000000, #060608)',
        }}
      />

      {/* Burning Warm Radial Ambient Accents */}
      <div
        className="absolute -top-[10%] -left-[5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[150px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #f78900 0%, #9b0103 60%, transparent 100%)',
        }}
      />

      <div
        className="absolute top-[35%] -right-[10%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full blur-[140px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #ffb200 0%, #f78900 50%, transparent 100%)',
        }}
      />

      <div
        className="absolute -bottom-[15%] left-[20%] w-[50vw] h-[40vw] max-w-[650px] max-h-[500px] rounded-full blur-[160px] opacity-18"
        style={{
          background: 'radial-gradient(circle, #9b0103 0%, #f78900 40%, transparent 80%)',
        }}
      />

      {/* Global Interactive React-Bits DotField (Applied throughout the entire app) */}
      <div className="absolute inset-0 pointer-events-none opacity-85">
        <DotField
          dotRadius={1.5}
          dotSpacing={16}
          cursorRadius={450}
          bulgeStrength={65}
          glowRadius={170}
          sparkle={true}
          waveAmplitude={0}
          gradientFrom="rgba(247, 137, 0, 0.4)"
          gradientTo="rgba(255, 178, 0, 0.2)"
          glowColor="rgba(247, 137, 0, 0.18)"
        />
      </div>
    </div>
  );
};
