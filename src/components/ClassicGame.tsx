import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useGame2048, Theme } from '@/hooks/useGame2048';
import { GameHeader } from './GameHeader';
import { GameBoard } from './GameBoard';
import { GameOverlay } from './GameOverlay';
import { getThemeBackground } from '@/hooks/useThemeData';
import { useTileAnimations } from '@/hooks/useTileAnimations';

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

  const { tiles, initializeTiles, updateTilesFromMove } = useTileAnimations(size);
  const prevBoardRef = useRef<number[][] | null>(null);
  const lastDirectionRef = useRef<'up' | 'down' | 'left' | 'right'>('up');

  const [showOverlay, setShowOverlay] = useState(false);
  const [hasReportedEnd, setHasReportedEnd] = useState(false);

  // Initialize tiles on first render
  useEffect(() => {
    if (tiles.length === 0) {
      initializeTiles(board);
      prevBoardRef.current = board.map(row => [...row]);
    }
  }, [board, tiles.length, initializeTiles]);

  // Update tiles when board changes from move
  useEffect(() => {
    if (prevBoardRef.current && JSON.stringify(prevBoardRef.current) !== JSON.stringify(board)) {
      // Find new tile position
      let newTilePos: [number, number] | null = null;
      newTiles.forEach(key => {
        const [r, c] = key.split('-').map(Number);
        newTilePos = [r, c];
      });

      updateTilesFromMove(prevBoardRef.current, board, lastDirectionRef.current, newTilePos, mergedTiles);
      prevBoardRef.current = board.map(row => [...row]);
    }
  }, [board, newTiles, mergedTiles, updateTilesFromMove]);

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

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    lastDirectionRef.current = direction;
    move(direction);
  }, [move]);

  const handleNewGame = useCallback(() => {
    initGame();
    prevBoardRef.current = null;
    setShowOverlay(false);
    setHasReportedEnd(false);
  }, [initGame]);

  // Re-init tiles after new game
  useEffect(() => {
    if (prevBoardRef.current === null && board.some(row => row.some(v => v > 0))) {
      initializeTiles(board);
      prevBoardRef.current = board.map(row => [...row]);
    }
  }, [board, initializeTiles]);

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

      <p className="text-white/60 text-sm mt-6 text-center px-4">
        Use arrow keys or swipe to move tiles. Combine matching numbers to reach 2048!
      </p>
    </div>
  );
};
