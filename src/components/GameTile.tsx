import { memo, useEffect, useState } from 'react';
import type { Theme } from '@/hooks/useGame2048';
import type { Tile } from '@/hooks/useTileAnimations';
import { getThemeStyles, getGridColor, getBoardTexture, baseTileStyles } from '@/hooks/useThemeData';

export { getGridColor, getBoardTexture };

interface AnimatedTileProps {
  tile: Tile;
  tileSize: number;
  gap: number;
  theme: Theme;
}

export const AnimatedTile = memo(({ tile, tileSize, gap, theme }: AnimatedTileProps) => {
  const [position, setPosition] = useState({ row: tile.prevRow ?? tile.row, col: tile.prevCol ?? tile.col });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // If tile has previous position, start from there and animate to new position
    if (tile.prevRow !== undefined && tile.prevCol !== undefined) {
      setPosition({ row: tile.prevRow, col: tile.prevCol });
      setIsAnimating(true);
      // Use requestAnimationFrame to ensure the initial position is rendered before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPosition({ row: tile.row, col: tile.col });
        });
      });
    } else {
      setPosition({ row: tile.row, col: tile.col });
    }
  }, [tile.row, tile.col, tile.prevRow, tile.prevCol]);

  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => setIsAnimating(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating]);

  const themeStyles = getThemeStyles(theme);
  const styles = themeStyles[tile.value] || themeStyles[4096] || baseTileStyles[tile.value] || baseTileStyles[4096];
  const fontSize = Math.max(12, Math.floor(tileSize * 0.38));

  const x = gap + position.col * (tileSize + gap);
  const y = gap + position.row * (tileSize + gap);

  let animationClass = '';
  if (tile.isNew) {
    animationClass = 'animate-spawn';
  } else if (tile.isMerged) {
    animationClass = 'animate-pop';
  }

  return (
    <div
      className={`absolute rounded-md flex items-center justify-center font-bold ${animationClass}`}
      style={{
        width: tileSize,
        height: tileSize,
        backgroundColor: styles.bg,
        backgroundImage: tile.value > 0 ? getBoardTexture(theme) : undefined,
        backgroundBlendMode: 'overlay',
        backgroundSize: '48px 48px',
        color: styles.text,
        fontSize: tile.value > 512 ? fontSize * 0.8 : fontSize,
        transform: `translate(${x}px, ${y}px)`,
        transition: isAnimating || tile.prevRow !== undefined ? 'transform 120ms ease-out' : 'none',
        zIndex: tile.isMerged ? 10 : 1,
      }}
    >
      {tile.value > 0 && tile.value}
    </div>
  );
});

AnimatedTile.displayName = 'AnimatedTile';

// Legacy GameTile for backwards compatibility
interface GameTileProps {
  value: number;
  size: number;
  theme: Theme;
  isNew: boolean;
  isMerged: boolean;
}

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
