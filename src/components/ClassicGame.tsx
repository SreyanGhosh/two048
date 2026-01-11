import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useGame2048, Theme } from '@/hooks/useGame2048';
import { GameHeader } from './GameHeader';
import { GameBoard } from './GameBoard';
import { GameOverlay } from './GameOverlay';
import { getThemeBackground } from '@/hooks/useThemeData';

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
  const [hasReportedEnd, setHasReportedEnd] = useState(false);

  // Set initial theme from equipped theme
  useEffect(() => {
    if (initialTheme && initialTheme !== theme) {
      setTheme(initialTheme);
    }
  }, [initialTheme, setTheme, theme]);

  // Report game end exactly once per run (prevents free-gem loop)
  useEffect(() => {
    if (!(gameOver || won)) return;

    if (!showOverlay) setShowOverlay(true);

    if (!hasReportedEnd) {
      setHasReportedEnd(true);
      const highestTile = Math.max(...board.flat());
      onGameEnd(score, highestTile);
    }
  }, [gameOver, won, showOverlay, hasReportedEnd, board, score, onGameEnd]);

  const handleNewGame = () => {
    initGame();
    setShowOverlay(false);
    setHasReportedEnd(false);
  };

  // Get theme-based background
  const bgStyle = getThemeBackground(theme);

  return (
    <div className="game-container min-h-screen flex flex-col items-center justify-center py-8" style={bgStyle}>
      {/* Back button */}
      <div className="w-full max-w-md px-4 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Home</span>
        </button>
      </div>

      {/* Header without theme selector - theme is set via inventory equip */}
      <GameHeader
        score={score}
        bestScore={bestScore}
        size={size}
        theme={theme}
        onSizeChange={setSize}
        onThemeChange={() => {}} // No-op, theme changes via inventory
        onNewGame={handleNewGame}
        unlockedThemes={unlockedThemes}
        hideThemeSelector={true}
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
          onNewGame={handleNewGame}
          onClose={() => setShowOverlay(false)}
        />
      </div>

      <p className="text-white/60 text-sm mt-6 text-center px-4">
        Use arrow keys or swipe to move tiles. Combine matching numbers to reach 2048!
      </p>
    </div>
  );
};
