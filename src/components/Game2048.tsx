import { useState, useEffect, useRef, useCallback } from 'react';
import { useGame2048 } from '@/hooks/useGame2048';
import { GameHeader } from './GameHeader';
import { GameBoard } from './GameBoard';
import { GameOverlay } from './GameOverlay';
import { useTileAnimations } from '@/hooks/useTileAnimations';

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

  const { tiles, initializeTiles, updateTilesFromMove, resetTiles } = useTileAnimations(size);
  const prevBoardRef = useRef<number[][] | null>(null);
  const lastDirectionRef = useRef<'up' | 'down' | 'left' | 'right'>('up');

  const [showOverlay, setShowOverlay] = useState(false);

  // Initialize tiles on first render
  useEffect(() => {
    if (tiles.length === 0 && board.some(row => row.some(v => v > 0))) {
      initializeTiles(board);
      prevBoardRef.current = board.map(row => [...row]);
    }
  }, [board, tiles.length, initializeTiles]);

  // Update tiles when board changes from move
  useEffect(() => {
    if (prevBoardRef.current && JSON.stringify(prevBoardRef.current) !== JSON.stringify(board)) {
      let newTilePos: [number, number] | null = null;
      newTiles.forEach(key => {
        const [r, c] = key.split('-').map(Number);
        newTilePos = [r, c];
      });

      updateTilesFromMove(prevBoardRef.current, board, lastDirectionRef.current, newTilePos, mergedTiles);
      prevBoardRef.current = board.map(row => [...row]);
    }
  }, [board, newTiles, mergedTiles, updateTilesFromMove]);

  // Show overlay when game is over
  if (gameOver && !showOverlay) {
    setShowOverlay(true);
  }

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    lastDirectionRef.current = direction;
    move(direction);
  }, [move]);

  const handleNewGame = useCallback(() => {
    initGame();
    resetTiles();
    prevBoardRef.current = null;
    setShowOverlay(false);
  }, [initGame, resetTiles]);

  // Re-init tiles after new game
  useEffect(() => {
    if (prevBoardRef.current === null && board.some(row => row.some(v => v > 0))) {
      initializeTiles(board);
      prevBoardRef.current = board.map(row => [...row]);
    }
  }, [board, initializeTiles]);

  return (
    <div className="game-container min-h-screen flex flex-col items-center justify-center py-8">
      <GameHeader
        score={score}
        bestScore={bestScore}
        size={size}
        theme={theme}
        onSizeChange={setSize}
        onThemeChange={setTheme}
        onNewGame={handleNewGame}
      />

      <div className="relative">
        <GameBoard
          board={board}
          size={size}
          theme={theme}
          tiles={tiles}
          onMove={handleMove}
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

      <p className="text-muted-foreground text-sm mt-6 text-center px-4">
        Use arrow keys or swipe to move tiles. Combine matching numbers to reach 2048!
      </p>
    </div>
  );
};
