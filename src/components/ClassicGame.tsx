import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useGame2048, Theme } from '@/hooks/useGame2048';
import { GameHeader } from './GameHeader';
import { GameBoard } from './GameBoard';
import { GameOverlay } from './GameOverlay';

interface ClassicGameProps {
  initialTheme: Theme;
  unlockedThemes: Theme[];
  onBack: () => void;
  onGameEnd: (score: number, highestTile: number) => void;
}

export const ClassicGame = ({ 
  initialTheme, 
  unlockedThemes, 
  onBack, 
  onGameEnd 
}: ClassicGameProps) => {
  const {
    board,
    score,
    bestScore,
    gameOver,
    won,
    size,
    theme,
    newTiles,
    mergedTiles,
    initGame,
    move,
    setTheme,
    setSize,
  } = useGame2048(4);

  const [showOverlay, setShowOverlay] = useState(false);

  // Report game end exactly once per run (avoid render-side effects / double increments)
  useEffect(() => {
    if (!(gameOver || won) || showOverlay) return;

    setShowOverlay(true);
    const highestTile = Math.max(...board.flat());
    onGameEnd(score, highestTile);
  }, [gameOver, won, showOverlay, board, score, onGameEnd]);
  // Filter themes to only show unlocked ones
  const handleThemeChange = useCallback((newTheme: Theme) => {
    if (unlockedThemes.includes(newTheme)) {
      setTheme(newTheme);
    }
  }, [unlockedThemes, setTheme]);

  return (
    <div className="game-container min-h-screen flex flex-col items-center justify-center py-8 bg-background">
      {/* Back button */}
      <div className="w-full max-w-md px-4 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Home</span>
        </button>
      </div>

      <GameHeader
        score={score}
        bestScore={bestScore}
        size={size}
        theme={theme}
        onSizeChange={setSize}
        onThemeChange={handleThemeChange}
        onNewGame={() => initGame()}
        unlockedThemes={unlockedThemes}
      />

      <div className="relative">
        <GameBoard
          board={board}
          size={size}
          theme={theme}
          newTiles={newTiles}
          mergedTiles={mergedTiles}
          onMove={move}
        />

        <GameOverlay
          show={showOverlay}
          score={score}
          won={won}
          theme={theme}
          onNewGame={() => {
            initGame();
            setShowOverlay(false);
          }}
          onClose={() => setShowOverlay(false)}
        />
      </div>

      <p className="text-muted-foreground text-sm mt-6 text-center px-4">
        Use arrow keys or swipe to move tiles. Combine matching numbers to reach 2048!
      </p>
    </div>
  );
};
