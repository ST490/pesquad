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
  let iconPx = 36;
  if (typeof size === 'number') {
    iconPx = size;
  } else {
    switch (size) {
      case 'xs':
        iconPx = 22;
        break;
      case 'sm':
        iconPx = 28;
        break;
      case 'md':
        iconPx = 38;
        break;
      case 'lg':
        iconPx = 52;
        break;
      case 'xl':
        iconPx = 72;
        break;
      case '2xl':
        iconPx = 110;
        break;
    }
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Isometric Cybernetic Glowing Cube Icon */}
      <svg
        width={iconPx}
        height={iconPx}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${animate ? 'transition-transform duration-300 hover:scale-105 hover:rotate-1' : ''}`}
      >
        <defs>
          {/* Orange Neon Edge Glow */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Core Trace Glow */}
          <filter id="coreGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.97   0 0.5 0 0 0.54   0 0 0 0 0   0 0 0 1 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="neonOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb200" />
            <stop offset="50%" stopColor="#f78900" />
            <stop offset="100%" stopColor="#ff4500" />
          </linearGradient>

          <linearGradient id="plateTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#252528" />
            <stop offset="100%" stopColor="#141416" />
          </linearGradient>

          <linearGradient id="plateLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1c1c1f" />
            <stop offset="100%" stopColor="#0c0c0e" />
          </linearGradient>

          <linearGradient id="plateRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#151518" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          <linearGradient id="whitePlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffeabb" />
            <stop offset="50%" stopColor="#ffb200" />
            <stop offset="100%" stopColor="#f78900" />
          </linearGradient>
        </defs>

        {/* Ambient Dark Backplate Shadow */}
        <polygon
          points="100,20 170,60 170,140 100,180 30,140 30,60"
          fill="#08080a"
          opacity="0.9"
        />

        {/* Outer Isometric Wireframe Cube Box (Glowing Orange Edges) */}
        <g filter="url(#neonGlow)" stroke="url(#neonOrangeGrad)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          {/* Top Face Outer Outline */}
          <polygon points="100,22 168,60 100,98 32,60" fill="none" opacity="0.95" />
          
          {/* Left Face Outer Outline */}
          <polygon points="32,60 100,98 100,178 32,140" fill="none" opacity="0.95" />

          {/* Right Face Outer Outline */}
          <polygon points="100,98 168,60 168,140 100,178" fill="none" opacity="0.95" />

          {/* Front Center Vertical Edge */}
          <line x1="100" y1="98" x2="100" y2="178" strokeWidth="3.8" stroke="#ffb200" />
        </g>

        {/* --- Top Face Floating Modular Plates --- */}
        {/* Left-top plate with white under-ledge */}
        <polygon points="68,43 96,28 80,18 52,33" fill="url(#whitePlateGrad)" />
        <polygon points="66,41 94,26 78,16 50,31" fill="url(#plateTopGrad)" stroke="#ffb200" strokeWidth="1" />
        
        {/* Right-top plate with white under-ledge */}
        <polygon points="132,43 148,33 120,18 104,28" fill="url(#whitePlateGrad)" />
        <polygon points="134,41 150,31 122,16 106,26" fill="url(#plateTopGrad)" stroke="#ffb200" strokeWidth="1" />

        {/* --- Left Face Floating Modular Plates --- */}
        {/* Upper Left Plate */}
        <polygon points="40,68 84,92 84,116 40,92" fill="url(#plateLeftGrad)" stroke="#f78900" strokeWidth="1.2" />
        {/* Lower Left Plate */}
        <polygon points="40,104 84,128 84,148 40,124" fill="url(#plateLeftGrad)" stroke="#f78900" strokeWidth="1.2" />

        {/* White Edge Highlights on Left Face */}
        <line x1="84" y1="92" x2="84" y2="116" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
        <line x1="84" y1="128" x2="84" y2="148" stroke="#ffffff" strokeWidth="2" opacity="0.85" />

        {/* --- Right Face Floating Modular Plates --- */}
        {/* Upper Right Plate */}
        <polygon points="116,92 160,68 160,92 116,116" fill="url(#plateRightGrad)" stroke="#f78900" strokeWidth="1.2" />
        {/* Lower Right Plate */}
        <polygon points="116,128 160,104 160,124 116,148" fill="url(#plateRightGrad)" stroke="#f78900" strokeWidth="1.2" />

        {/* White Edge Highlights on Right Face */}
        <line x1="116" y1="92" x2="116" y2="116" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
        <line x1="116" y1="128" x2="116" y2="148" stroke="#ffffff" strokeWidth="2" opacity="0.85" />

        {/* --- Center Isometric Circuit Traces & Core Motherboard --- */}
        <g filter="url(#coreGlow)">
          {/* Top-to-center Bus lines */}
          <path
            d="M 100,42 L 100,62 L 90,68 L 90,82 L 100,88 L 100,108"
            stroke="url(#circuitGrad)"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Core Circuit Branches */}
          <path
            d="M 100,115 L 88,122 L 88,142 L 96,147 L 96,165"
            stroke="url(#circuitGrad)"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 88,122 L 72,113 L 72,130"
            stroke="#ffb200"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Core Circuit Branches */}
          <path
            d="M 100,115 L 112,122 L 112,142 L 104,147 L 104,165"
            stroke="url(#circuitGrad)"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 112,122 L 128,113 L 128,130"
            stroke="#ffb200"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Top Face Loop Trace */}
          <path
            d="M 82,50 L 100,60 L 118,50 L 100,40 Z"
            stroke="#ffeabb"
            strokeWidth="1.8"
            fill="none"
          />

          {/* Circuit Contact Nodes (Pins / Micro-dots) */}
          <circle cx="100" cy="42" r="2.5" fill="#ffffff" />
          <circle cx="90" cy="82" r="2" fill="#ffeabb" />
          <circle cx="100" cy="108" r="3" fill="#ffffff" />
          <circle cx="72" cy="130" r="2" fill="#ffb200" />
          <circle cx="128" cy="130" r="2" fill="#ffb200" />
          <circle cx="96" cy="165" r="2.5" fill="#ffeabb" />
          <circle cx="104" cy="165" r="2.5" fill="#ffeabb" />
        </g>
      </svg>

      {/* Typography: PES (White) + quad (Orange) matching the logo artwork */}
      {showText && (
        <div className={`flex items-baseline font-heading tracking-tight ${textClassName || 'text-xl font-extrabold'}`}>
          <span className="text-white">PES</span>
          <span className="text-[#f78900] ml-0.5">quad</span>
        </div>
      )}
    </div>
  );
};
