import React from 'react';
import {
  Package,
  Coins,
  ScrollText,
  BookOpen,
  Store,
  Hammer,
  Beer,
  ShieldCheck
} from 'lucide-react';

interface PixelIconProps {
  className?: string;
  size?: number;
}

const normalizeSize = (size: number = 24) => {
  if (size === 64) return 24;
  if (size === 96) return 40;
  if (size === 32) return 18;
  return size;
};

export const PixelCrate: React.FC<PixelIconProps> = ({ className = '', size = 24 }) => {
  const iconSize = normalizeSize(size);
  return <Package size={iconSize} className={`shrink-0 ${className}`} />;
};

export const PixelCoins: React.FC<PixelIconProps> = ({ className = '', size = 24 }) => {
  const iconSize = normalizeSize(size);
  return <Coins size={iconSize} className={`shrink-0 text-amber-500 ${className}`} />;
};

export const PixelQuest: React.FC<PixelIconProps> = ({ className = '', size = 24 }) => {
  const iconSize = normalizeSize(size);
  return <ScrollText size={iconSize} className={`shrink-0 ${className}`} />;
};

export const PixelBook: React.FC<PixelIconProps> = ({ className = '', size = 24 }) => {
  const iconSize = normalizeSize(size);
  return <BookOpen size={iconSize} className={`shrink-0 ${className}`} />;
};

export const PixelStore: React.FC<PixelIconProps> = ({ className = '', size = 24 }) => {
  const iconSize = normalizeSize(size);
  return <Store size={iconSize} className={`shrink-0 ${className}`} />;
};

export const PixelBlacksmith: React.FC<PixelIconProps> = ({ className = '', size = 24 }) => {
  const iconSize = normalizeSize(size);
  return <Hammer size={iconSize} className={`shrink-0 ${className}`} />;
};

export const PixelTavern: React.FC<PixelIconProps> = ({ className = '', size = 24 }) => {
  const iconSize = normalizeSize(size);
  return <Beer size={iconSize} className={`shrink-0 ${className}`} />;
};

export const PixelGuild: React.FC<PixelIconProps> = ({ className = '', size = 24 }) => {
  const iconSize = normalizeSize(size);
  return <ShieldCheck size={iconSize} className={`shrink-0 ${className}`} />;
};


