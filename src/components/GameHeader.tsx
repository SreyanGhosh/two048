import type { Theme } from '@/hooks/useGame2048';

interface GameHeaderProps {
  score: number;
  bestScore: number;
  size: number;
  theme: Theme;
  onSizeChange: (size: number) => void;
  onThemeChange: (theme: Theme) => void;
  onNewGame: () => void;
  unlockedThemes?: Theme[];
}

const ALL_THEMES: Theme[] = ['classic', 'blue', 'fire', 'bubblegum', 'dark', 'forest', 'sunset', 'lavender', 'mint', 'neon', 'aurora', 'cherry', 'gold', 'galaxy', 'rainbow', 'diamond'];

const themeButtonStyles: Record<Theme, { bg: string; text: string }> = {
  classic: { bg: '#8f7a66', text: '#f9f6f2' },
  blue: { bg: '#44445e', text: '#ffffff' },
  fire: { bg: '#ff1a1a', text: '#f9f6f2' },
  bubblegum: { bg: '#ff4da6', text: '#ffffff' },
  dark: { bg: '#111', text: '#ffffff' },
  forest: { bg: '#228b22', text: '#ffffff' },
  sunset: { bg: '#ff6b35', text: '#ffffff' },
  lavender: { bg: '#9b59b6', text: '#ffffff' },
  mint: { bg: '#3eb489', text: '#ffffff' },
  neon: { bg: '#ff00ff', text: '#00ffff' },
  aurora: { bg: '#2ecc71', text: '#ffffff' },
  cherry: { bg: '#ff69b4', text: '#ffffff' },
  gold: { bg: '#ffd700', text: '#1a1a1a' },
  galaxy: { bg: '#2c1654', text: '#ffffff' },
  rainbow: { bg: '#ff0000', text: '#ffffff' },
  diamond: { bg: '#b9f2ff', text: '#1a1a1a' },
};

const themeBoxStyles: Record<Theme, { bg: string; text: string }> = {
  classic: { bg: '#bbada0', text: '#f9f6f2' },
  blue: { bg: '#66668f', text: '#ffffff' },
  fire: { bg: '#ff1a1a', text: '#f9f6f2' },
  bubblegum: { bg: '#ff77c2', text: '#ffffff' },
  dark: { bg: '#222', text: '#ffffff' },
  forest: { bg: '#2e8b57', text: '#ffffff' },
  sunset: { bg: '#ff8c5a', text: '#ffffff' },
  lavender: { bg: '#a569bd', text: '#ffffff' },
  mint: { bg: '#48d1a9', text: '#ffffff' },
  neon: { bg: '#8b00ff', text: '#00ffff' },
  aurora: { bg: '#45b39d', text: '#ffffff' },
  cherry: { bg: '#ff85a2', text: '#ffffff' },
  gold: { bg: '#ffdf00', text: '#1a1a1a' },
  galaxy: { bg: '#4a1c7a', text: '#ffffff' },
  rainbow: { bg: '#ffa500', text: '#ffffff' },
  diamond: { bg: '#e0ffff', text: '#1a1a1a' },
};

const themeNames: Record<Theme, string> = {
  classic: 'Classic',
  blue: 'Ocean',
  fire: 'Fire',
  bubblegum: 'Bubblegum',
  dark: 'Midnight',
  forest: 'Forest',
  sunset: 'Sunset',
  lavender: 'Lavender',
  mint: 'Mint',
  neon: 'Neon',
  aurora: 'Aurora',
  cherry: 'Cherry',
  gold: 'Gold',
  galaxy: 'Galaxy',
  rainbow: 'Rainbow',
  diamond: 'Diamond',
};

export const GameHeader = ({
  score,
  bestScore,
  size,
  theme,
  onSizeChange,
  onThemeChange,
  onNewGame,
  unlockedThemes,
}: GameHeaderProps) => {
  const buttonStyle = themeButtonStyles[theme];
  const boxStyle = themeBoxStyles[theme];

  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <h1 
        className="text-5xl md:text-6xl font-black text-center mb-4"
        style={{ color: buttonStyle.bg }}
      >
        2048+
      </h1>
      
      <div className="flex flex-wrap justify-center items-center gap-2">
        <div 
          className="score-box"
          style={{ backgroundColor: boxStyle.bg, color: boxStyle.text }}
        >
          <div className="text-xs uppercase opacity-80">Score</div>
          <div className="text-xl font-black">{score}</div>
        </div>
        
        <div 
          className="score-box"
          style={{ backgroundColor: boxStyle.bg, color: boxStyle.text }}
        >
          <div className="text-xs uppercase opacity-80">Best</div>
          <div className="text-xl font-black">{bestScore}</div>
        </div>

        <select
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="game-select"
          style={{ backgroundColor: boxStyle.bg, color: boxStyle.text }}
        >
          {[3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
            <option key={s} value={s}>
              {s}×{s}
            </option>
          ))}
        </select>

        <select
          value={theme}
          onChange={(e) => onThemeChange(e.target.value as Theme)}
          className="game-select"
          style={{ backgroundColor: boxStyle.bg, color: boxStyle.text }}
        >
          {(unlockedThemes || ALL_THEMES).map((t) => (
            <option key={t} value={t}>
              {themeNames[t]}
            </option>
          ))}
        </select>

        <button
          onClick={onNewGame}
          className="game-button"
          style={{ backgroundColor: buttonStyle.bg, color: buttonStyle.text }}
        >
          New Game
        </button>
      </div>
    </div>
  );
};
