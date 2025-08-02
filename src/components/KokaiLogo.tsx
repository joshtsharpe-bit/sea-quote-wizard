import React from 'react';

interface KokaiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'mark';
}

const KokaiLogo: React.FC<KokaiLogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'full'
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  if (variant === 'mark') {
    return (
      <div className={`font-elegant font-bold tracking-wider ${sizeClasses[size]} ${className}`}>
        <span className="text-primary">K</span>
        <span className="text-accent">Ō</span>
      </div>
    );
  }

  return (
    <div className={`font-elegant font-bold tracking-wider ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-primary">K</span>
        <span className="text-accent">Ō</span>
        <span className="text-primary">K</span>
        <span className="text-accent">A</span>
        <span className="text-primary">I</span>
      </div>
      <div className="text-xs font-sans font-medium tracking-[0.2em] text-muted-foreground mt-1 uppercase">
        Charters
      </div>
    </div>
  );
};

export default KokaiLogo;