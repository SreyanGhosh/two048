import { useEffect, useRef, useCallback } from 'react';
import { AnimatedTile } from './GameTile';
import type { Theme } from '@/hooks/useGame2048';
import type { Tile } from '@/hooks/useTileAnimations';

interface GameBoardProps {
  board: number[][];
  size: number;
  theme: Theme;
  tiles: Tile[];
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const getGridColor = (theme: Theme): string => {
  const colors: Partial<Record<Theme, string>> = {
    classic: '#bbada0',
    dark: '#1a1a2e',
    neon: '#0a0a1a',
    blue: '#1a3a5c',
    fire: '#2d1b1b',
    bubblegum: '#ffb6c1',
    forest: '#2d5a27',
    sunset: '#4a2020',
    lavender: '#3d3d5c',
    mint: '#2d4a3d',
    aurora: '#1a2a3a',
    cherry: '#3d1a2a',
    gold: '#4a4020',
    galaxy: '#0b0b2a',
    rainbow: '#2a2a4a',
    diamond: '#1a2a3a',
    marble: '#e8e0d5',
    wood: '#3d2b1f',
    carbon: '#1a1a1a',
    crystal: '#1a2a3a',
    leather: '#2d1f1a',
    denim: '#1a2a3d',
    velvet: '#2a1a2a',
    brushed_metal: '#3a3a3a',
    christmas: '#1a2a1a',
    snow: '#4a5a6a',
    ice: '#1a3a4a',
    santa: '#3a1a1a',
    newyear: '#1a0a2e',
    firework: '#0a0a1a',
    champagne: '#3a3020',
    countdown: '#1a1a3a',
    hearts: '#3a1a2a',
    rose: '#3a1a1a',
    cupid: '#3a2a3a',
    eternal: '#2a1a3a',
    easter: '#2a3a2a',
    bunny: '#3a3a3a',
    bloom: '#2a3a2a',
    golden: '#3a3020',
    pumpkin: '#3a2a1a',
    ghost: '#2a2a3a',
    witch: '#1a1a2a',
    nightmare: '#0a0a1a',
    menorah: '#1a2a3a',
    dreidel: '#2a2a3a',
    gelt: '#3a3020',
    miracle: '#1a2a4a',
  };
  return colors[theme] || '#bbada0';
};

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

  const gridColor = getGridColor(theme);

  return (
    <div
      ref={containerRef}
      className="game-grid touch-none relative"
      style={{
        backgroundColor: gridColor,
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
