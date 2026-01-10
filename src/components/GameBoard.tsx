import { useEffect, useRef, useCallback } from 'react';
import { AnimatedTile, getGridColor, getBoardTexture } from './GameTile';
import type { Theme } from '@/hooks/useGame2048';
import type { Tile } from '@/hooks/useTileAnimations';

interface GameBoardProps {
  board: number[][];
  size: number;
  theme: Theme;
  tiles: Tile[];
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const GameBoard = ({ board, size, theme, tiles, onMove }: GameBoardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const gap = 8;
  const maxWidth = Math.min(typeof window !== 'undefined' ? window.innerWidth - 32 : 400, 420);
  const tileSize = Math.floor((maxWidth - gap * (size + 1)) / size);
  const gridSize = tileSize * size + gap * (size + 1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
    };
    
    if (keyMap[e.key]) {
      e.preventDefault();
      onMove(keyMap[e.key]);
    }
  }, [onMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const minDist = 30;

    if (Math.abs(dx) < minDist && Math.abs(dy) < minDist) {
      touchStart.current = null;
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      onMove(dx > 0 ? 'right' : 'left');
    } else {
      onMove(dy > 0 ? 'down' : 'up');
    }
    
    touchStart.current = null;
  };

  const boardTexture = getBoardTexture(theme);

  return (
    <div
      ref={containerRef}
      className="game-grid touch-none relative"
      style={{
        backgroundColor: getGridColor(theme),
        backgroundImage: boardTexture,
        backgroundBlendMode: 'overlay',
        backgroundSize: '64px 64px',
        width: gridSize,
        height: gridSize,
        borderRadius: '8px',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background grid cells */}
      <div
        className="absolute inset-0"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: gap,
          padding: gap,
        }}
      >
        {Array.from({ length: size * size }).map((_, i) => (
          <div
            key={i}
            className="rounded-md"
            style={{
              backgroundColor: 'rgba(238, 228, 218, 0.35)',
              width: tileSize,
              height: tileSize,
            }}
          />
        ))}
      </div>

      {/* Animated tiles */}
      {tiles.map(tile => (
        <AnimatedTile
          key={tile.id}
          tile={tile}
          tileSize={tileSize}
          gap={gap}
          theme={theme}
        />
      ))}
    </div>
  );
};
