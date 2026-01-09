import type { Theme } from '@/hooks/useGame2048';
import { getThemeButtonStyle, getThemeName, THEME_BUTTON_STYLES } from '@/hooks/useThemeData';

interface GameHeaderProps {
  score: number;
  bestScore: number;
  size: number;
  theme: Theme;
  onSizeChange: (size: number) => void;
  onThemeChange: (theme: Theme) => void;
  onNewGame: () => void;
  unlockedThemes?: Theme[];
  hideThemeSelector?: boolean;
}

// Base themes always available in the dropdown
const BASE_THEMES: Theme[] = ['classic', 'blue', 'fire', 'bubblegum', 'dark', 'forest', 'sunset', 'lavender', 'mint', 'neon', 'aurora', 'cherry', 'gold', 'galaxy', 'rainbow', 'diamond'];

export const GameHeader = ({
  score,
  bestScore,
  size,
  theme,
  onSizeChange,
  onThemeChange,
  onNewGame,
  unlockedThemes,
  hideThemeSelector,
}: GameHeaderProps) => {
  const buttonStyle = getThemeButtonStyle(theme);
  const boxStyle = getThemeButtonStyle(theme);

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

        {!hideThemeSelector && (
          <select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as Theme)}
            className="game-select"
            style={{ backgroundColor: boxStyle.bg, color: boxStyle.text }}
          >
            {(unlockedThemes || BASE_THEMES).map((t) => (
              <option key={t} value={t}>
                {getThemeName(t)}
              </option>
            ))}
          </select>
        )}

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
