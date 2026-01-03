import type { Theme } from '@/hooks/useGame2048';

interface GameOverlayProps {
  show: boolean;
  score: number;
  won: boolean;
  theme: Theme;
  onNewGame: () => void;
  onClose: () => void;
}

const themeButtonStyles: Record<Theme, { bg: string; text: string }> = {
  classic: { bg: '#8f7a66', text: '#f9f6f2' },
  blue: { bg: '#44445e', text: '#ffffff' },
  fire: { bg: '#ff1a1a', text: '#f9f6f2' },
  bubblegum: { bg: '#ff4da6', text: '#ffffff' },
  dark: { bg: '#111', text: '#ffffff' },
};

export const GameOverlay = ({ show, score, won, theme, onNewGame, onClose }: GameOverlayProps) => {
  if (!show) return null;

  const buttonStyle = themeButtonStyles[theme];

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl z-10">
      <div className="bg-card text-card-foreground p-8 rounded-xl text-center min-w-[280px] relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-muted-foreground hover:text-foreground transition-colors"
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
            onClose();
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
