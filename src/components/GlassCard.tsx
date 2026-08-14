import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  glow?: 'none' | 'orange' | 'amber' | 'maroon';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  interactive = false,
  className = '',
  glow = 'none',
  id,
  ...props
}) => {
  const glowStyles = {
    none: '',
    orange: 'border-orange-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(247,137,0,0.2)]',
    amber: 'border-amber-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(255,178,0,0.2)]',
    maroon: 'border-red-700/30 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(155,1,3,0.25)]',
  };

  return (
    <div
      id={id}
      className={`
        relative overflow-hidden
        ${interactive ? 'glass-panel-interactive cursor-pointer' : 'glass-panel'}
        ${glowStyles[glow]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
