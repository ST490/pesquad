import React from 'react';

interface PESquadLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  showText?: boolean;
  textClassName?: string;
  animate?: boolean;
}

export const PESquadLogo: React.FC<PESquadLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  textClassName = '',
  animate = false,
}) => {
  // Determine pixel size for the icon
  let iconPx = 38;
  if (typeof size === 'number') {
    iconPx = size;
  } else {
    switch (size) {
      case 'xs':
        iconPx = 24;
        break;
      case 'sm':
        iconPx = 30;
        break;
      case 'md':
        iconPx = 40;
        break;
      case 'lg':
        iconPx = 56;
        break;
      case 'xl':
        iconPx = 76;
        break;
      case '2xl':
        iconPx = 112;
        break;
    }
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Isometric Cybernetic Glowing Cube Logo */}
      <img
        src="/pesquad-logo.png"
        alt="PESquad 3D Cube Logo"
        width={iconPx}
        height={iconPx}
        style={{ width: `${iconPx}px`, height: `${iconPx}px` }}
        className={`object-contain shrink-0 filter drop-shadow-[0_0_14px_rgba(247,137,0,0.5)] ${
          animate ? 'transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(255,178,0,0.7)]' : ''
        }`}
      />

      {/* Typography: PES (White) + quad (Orange) */}
      {showText && (
        <div className={`flex items-baseline font-heading tracking-tight ${textClassName || 'text-xl font-extrabold'}`}>
          <span className="text-white">PES</span>
          <span className="text-[#f78900] ml-0.5">quad</span>
        </div>
      )}
    </div>
  );
};
