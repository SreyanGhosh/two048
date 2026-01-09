import { memo } from 'react';
import type { Theme } from '@/hooks/useGame2048';
import { getThemeStyles, getGridColor, getBoardTexture, baseTileStyles } from '@/hooks/useThemeData';

interface GameTileProps {
  value: number;
  size: number;
  theme: Theme;
  isNew: boolean;
  isMerged: boolean;
}

export { getGridColor, getBoardTexture };

export const GameTile = memo(({ value, size, theme, isNew, isMerged }: GameTileProps) => {
  const themeStyles = getThemeStyles(theme);
  const styles = themeStyles[value] || themeStyles[4096] || baseTileStyles[value] || baseTileStyles[4096];
  const fontSize = Math.max(12, Math.floor(size * 0.38));
  
  const animationClass = isNew ? 'animate-spawn' : isMerged ? 'animate-pop' : '';

  return (
      <div
        className={`game-cell ${animationClass}`}
        style={{
          width: size,
          height: size,
          backgroundColor: styles.bg,
          backgroundImage: value > 0 ? getBoardTexture(theme) : undefined,
          backgroundBlendMode: 'overlay',
          backgroundSize: '48px 48px',
          color: styles.text,
          fontSize: value > 512 ? fontSize * 0.8 : fontSize,
        }}
      >
        {value > 0 && value}
      </div>
  );
});

GameTile.displayName = 'GameTile';
