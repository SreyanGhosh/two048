import { memo, useEffect, useState, useRef } from 'react';
import type { Theme } from '@/hooks/useGame2048';
import type { Tile } from '@/hooks/useTileAnimations';
import { getThemeStyles, baseTileStyles } from '@/hooks/useThemeData';

interface AnimatedTileProps {
  tile: Tile;
  tileSize: number;
  gap: number;
  theme: Theme;
}

export const AnimatedTile = memo(({ tile, tileSize, gap, theme }: AnimatedTileProps) => {
  const [position, setPosition] = useState({ row: tile.row, col: tile.col });
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // On first render or when tile is new, don't animate - just set position
    if (isFirstRender.current || tile.isNew) {
      isFirstRender.current = false;
      setPosition({ row: tile.row, col: tile.col });
      setShouldAnimate(false);
      return;
    }

    // If tile has previous position different from current, animate
    if (tile.prevRow !== undefined && tile.prevCol !== undefined && 
        (tile.prevRow !== tile.row || tile.prevCol !== tile.col)) {
      // Start from previous position
      setPosition({ row: tile.prevRow, col: tile.prevCol });
      setShouldAnimate(true);
      
      // Animate to new position
      requestAnimationFrame(() => {
        setPosition({ row: tile.row, col: tile.col });
      });
    } else {
      setPosition({ row: tile.row, col: tile.col });
    }
  }, [tile.row, tile.col, tile.prevRow, tile.prevCol, tile.isNew, tile.id]);

  // Clear animation flag after transition
  useEffect(() => {
    if (shouldAnimate) {
      const timeout = setTimeout(() => setShouldAnimate(false), 80);
      return () => clearTimeout(timeout);
    }
  }, [shouldAnimate]);

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
        color: styles.text,
        fontSize: tile.value > 512 ? fontSize * 0.8 : fontSize,
        transform: `translate(${x}px, ${y}px)`,
        transition: shouldAnimate ? 'transform 80ms ease-out' : 'none',
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
        color: styles.text,
        fontSize: value > 512 ? fontSize * 0.8 : fontSize,
      }}
    >
      {value > 0 && value}
    </div>
  );
});

GameTile.displayName = 'GameTile';
