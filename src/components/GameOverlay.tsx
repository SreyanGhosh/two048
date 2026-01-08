import type { Theme } from '@/hooks/useGame2048';
import { getThemeButtonStyle } from '@/hooks/useThemeData';

interface GameOverlayProps {
  show: boolean;
  score: number;
  won: boolean;
  theme: Theme;
  onNewGame: () => void;
  onClose: () => void;
}

export const GameOverlay = ({ show, score, won, theme, onNewGame, onClose }: GameOverlayProps) => {
  if (!show) return null;

  const buttonStyle = getThemeButtonStyle(theme);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl z-10">
      <div className="bg-card text-card-foreground p-8 rounded-xl text-center min-w-[280px] relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-xl text-muted-foreground hover:text-foreground transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-black mb-2">
          {won ? '🎉 You Won!' : 'Game Over'}
        </h2>
        
        <p className="text-muted-foreground mb-4">
          Your score: <span className="font-black text-foreground text-xl">{score}</span>
        </p>
        
        <button
          onClick={() => {
            onNewGame();
          }}
          className="game-button px-8"
          style={{ backgroundColor: buttonStyle.bg, color: buttonStyle.text }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
