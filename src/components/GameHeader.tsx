import type { Theme } from '@/hooks/useGame2048';

interface GameHeaderProps {
  score: number;
  bestScore: number;
  size: number;
  theme: Theme;
  onSizeChange: (size: number) => void;
  onThemeChange: (theme: Theme) => void;
  onNewGame: () => void;
}

const themeButtonStyles: Record<Theme, { bg: string; text: string }> = {
  classic: { bg: '#8f7a66', text: '#f9f6f2' },
  blue: { bg: '#44445e', text: '#ffffff' },
  fire: { bg: '#ff1a1a', text: '#f9f6f2' },
  bubblegum: { bg: '#ff4da6', text: '#ffffff' },
  dark: { bg: '#111', text: '#ffffff' },
};

const themeBoxStyles: Record<Theme, { bg: string; text: string }> = {
  classic: { bg: '#bbada0', text: '#f9f6f2' },
  blue: { bg: '#66668f', text: '#ffffff' },
  fire: { bg: '#ff1a1a', text: '#f9f6f2' },
  bubblegum: { bg: '#ff77c2', text: '#ffffff' },
  dark: { bg: '#222', text: '#ffffff' },
};

export const GameHeader = ({
  score,
  bestScore,
  size,
  theme,
  onSizeChange,
  onThemeChange,
  onNewGame,
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
          <option value="classic">Classic</option>
          <option value="blue">Blue</option>
          <option value="fire">Fire</option>
          <option value="bubblegum">Bubblegum</option>
          <option value="dark">Dark</option>
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
