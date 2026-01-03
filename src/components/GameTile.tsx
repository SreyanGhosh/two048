import { memo } from 'react';
import type { Theme } from '@/hooks/useGame2048';

interface GameTileProps {
  value: number;
  size: number;
  theme: Theme;
  isNew: boolean;
  isMerged: boolean;
}

const themeStyles: Record<Theme, Record<number, { bg: string; text: string }>> = {
  classic: {
    0: { bg: '#cdc1b4', text: '#776e65' },
    2: { bg: '#eee4da', text: '#776e65' },
    4: { bg: '#ede0c8', text: '#776e65' },
    8: { bg: '#f2b179', text: '#f9f6f2' },
    16: { bg: '#f59563', text: '#f9f6f2' },
    32: { bg: '#f67c5f', text: '#f9f6f2' },
    64: { bg: '#f65e3b', text: '#f9f6f2' },
    128: { bg: '#edcf72', text: '#f9f6f2' },
    256: { bg: '#edcc61', text: '#f9f6f2' },
    512: { bg: '#edc850', text: '#f9f6f2' },
    1024: { bg: '#edc53f', text: '#f9f6f2' },
    2048: { bg: '#edc22e', text: '#f9f6f2' },
    4096: { bg: '#3c3a32', text: '#f9f6f2' },
  },
  blue: {
    0: { bg: '#8dc8ea', text: '#5babe9' },
    2: { bg: '#9cbde9', text: '#0a3854' },
    4: { bg: '#6591ca', text: '#0a3854' },
    8: { bg: '#0567e8', text: '#bee2f8' },
    16: { bg: '#05469b', text: '#bee2f8' },
    32: { bg: '#033b83', text: '#bee2f8' },
    64: { bg: '#03224b', text: '#bee2f8' },
    128: { bg: '#5906d6', text: '#bee2f8' },
    256: { bg: '#9308e3', text: '#bee2f8' },
    512: { bg: '#e107e8', text: '#2e0049' },
    1024: { bg: '#9e0570', text: '#bee2f8' },
    2048: { bg: '#0c0059', text: '#bee2f8' },
    4096: { bg: '#0c0059', text: '#bee2f8' },
  },
  fire: {
    0: { bg: '#ffc18f', text: '#776e65' },
    2: { bg: '#ffc7c7', text: '#510303' },
    4: { bg: '#ffa1a1', text: '#510303' },
    8: { bg: '#ff7b00', text: '#f9f6f2' },
    16: { bg: '#ffa600', text: '#f9f6f2' },
    32: { bg: '#ffd500', text: '#1a1a1a' },
    64: { bg: '#f2ff00', text: '#1a1a1a' },
    128: { bg: '#ff0000', text: '#f9f6f2' },
    256: { bg: '#bd0000', text: '#f9f6f2' },
    512: { bg: '#bf4600', text: '#f9f6f2' },
    1024: { bg: '#8a003e', text: '#f9f6f2' },
    2048: { bg: '#000000', text: '#f9f6f2' },
    4096: { bg: '#000000', text: '#f9f6f2' },
  },
  bubblegum: {
    0: { bg: '#ffb3d9', text: '#fff' },
    2: { bg: '#ffe0f0', text: '#000' },
    4: { bg: '#ffc0e0', text: '#000' },
    8: { bg: '#ff99cc', text: '#fff' },
    16: { bg: '#ff66b2', text: '#fff' },
    32: { bg: '#ff3385', text: '#fff' },
    64: { bg: '#ff007f', text: '#fff' },
    128: { bg: '#e60073', text: '#fff' },
    256: { bg: '#cc0066', text: '#fff' },
    512: { bg: '#b30059', text: '#fff' },
    1024: { bg: '#99004d', text: '#fff' },
    2048: { bg: '#660033', text: '#fff' },
    4096: { bg: '#660033', text: '#fff' },
  },
  dark: {
    0: { bg: '#555', text: '#fff' },
    2: { bg: '#666', text: '#fff' },
    4: { bg: '#777', text: '#fff' },
    8: { bg: '#888', text: '#fff' },
    16: { bg: '#999', text: '#fff' },
    32: { bg: '#aaa', text: '#fff' },
    64: { bg: '#bbb', text: '#fff' },
    128: { bg: '#ccc', text: '#000' },
    256: { bg: '#ddd', text: '#000' },
    512: { bg: '#eee', text: '#000' },
    1024: { bg: '#fff', text: '#000' },
    2048: { bg: '#000', text: '#fff' },
    4096: { bg: '#000', text: '#fff' },
  },
};

const gridColors: Record<Theme, string> = {
  classic: '#bbada0',
  blue: '#5babe9',
  fire: '#ff9c4b',
  bubblegum: '#ffd6eb',
  dark: '#333',
};

export const getGridColor = (theme: Theme) => gridColors[theme];

export const GameTile = memo(({ value, size, theme, isNew, isMerged }: GameTileProps) => {
  const styles = themeStyles[theme][value] || themeStyles[theme][4096];
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
