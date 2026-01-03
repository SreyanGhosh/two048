import { useState } from 'react';
import { useGame2048 } from '@/hooks/useGame2048';
import { GameHeader } from './GameHeader';
import { GameBoard } from './GameBoard';
import { GameOverlay } from './GameOverlay';

export const Game2048 = () => {
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

  // Show overlay when game is over
  if (gameOver && !showOverlay) {
    setShowOverlay(true);
  }

  return (
    <div className="game-container min-h-screen flex flex-col items-center justify-center py-8">
      <GameHeader
        score={score}
        bestScore={bestScore}
        size={size}
        theme={theme}
        onSizeChange={setSize}
        onThemeChange={setTheme}
        onNewGame={() => initGame()}
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
          onNewGame={() => initGame()}
          onClose={() => setShowOverlay(false)}
        />
      </div>

      <p className="text-muted-foreground text-sm mt-6 text-center px-4">
        Use arrow keys or swipe to move tiles. Combine matching numbers to reach 2048!
      </p>
    </div>
  );
};
