import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Timer, Trophy } from 'lucide-react';
import { useGame2048, Theme } from '@/hooks/useGame2048';
import { GameBoard } from './GameBoard';
import { getThemeBackground, getThemeName } from '@/hooks/useThemeData';
import { useTileAnimations } from '@/hooks/useTileAnimations';

interface CompetitiveGameProps {
  theme: Theme; // equipped theme (default)
  unlockedThemes: Theme[];
  onBack: () => void;
  onGameEnd: (score: number, highestTile: number) => void;
  bestScore: number;
}

const GAME_DURATION = 60; // seconds

type EndReason = 'time' | 'nomoves' | 'won';

export const CompetitiveGame = ({
  theme: equippedTheme,
  unlockedThemes,
  onBack,
  onGameEnd,
  bestScore,
}: CompetitiveGameProps) => {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [endReason, setEndReason] = useState<EndReason>('time');
  const [hasReportedEnd, setHasReportedEnd] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevBoardRef = useRef<number[][] | null>(null);
  const lastDirectionRef = useRef<'up' | 'down' | 'left' | 'right'>('up');

  const {
    board,
    score,
    size,
    theme,
    gameOver,
    won,
    newTiles,
    mergedTiles,
    move,
    initGame,
    setTheme,
  } = useGame2048(4);

  const { tiles, initializeTiles, updateTilesFromMove, resetTiles } = useTileAnimations(size);

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

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const endGame = useCallback(
    (reason: EndReason) => {
      stopTimer();
      setIsPlaying(false);
      setGameEnded(true);
      setEndReason(reason);
    },
    [stopTimer]
  );

  // Apply equipped theme as default on mount / when equipped changes
  useEffect(() => {
    setTheme(equippedTheme);
  }, [equippedTheme, setTheme]);

  const startGame = useCallback(() => {
    initGame();
    resetTiles();
    prevBoardRef.current = null;
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setGameEnded(false);
    setHasReportedEnd(false);
    setEndReason('time');
  }, [initGame, resetTiles]);

  // Re-init tiles after new game starts
  useEffect(() => {
    if (prevBoardRef.current === null && board.some(row => row.some(v => v > 0))) {
      initializeTiles(board);
      prevBoardRef.current = board.map(row => [...row]);
    }
  }, [board, initializeTiles]);

  // Timer
  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame('time');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => stopTimer();
  }, [isPlaying, endGame, stopTimer]);

  // End early if no moves / won (before the timer runs out)
  useEffect(() => {
    if (!isPlaying || gameEnded) return;
    if (won) {
      endGame('won');
      return;
    }
    if (gameOver) {
      endGame('nomoves');
    }
  }, [isPlaying, gameEnded, won, gameOver, endGame]);

  // Notify parent exactly once when game ends (fixes counter bugs)
  useEffect(() => {
    if (!gameEnded || hasReportedEnd) return;
    setHasReportedEnd(true);
    const highestTile = Math.max(...board.flat());
    onGameEnd(score, highestTile);
  }, [gameEnded, hasReportedEnd, board, score, onGameEnd]);

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!isPlaying) return;
    lastDirectionRef.current = direction;
    move(direction);
  }, [isPlaying, move]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-red-500 animate-pulse';
    if (timeLeft <= 20) return 'text-orange-400';
    return 'text-white';
  };

  const bgStyle = getThemeBackground(theme);

  const endTitle = endReason === 'time' ? "Time's Up!" : endReason === 'won' ? 'You Won!' : 'Game Over';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={bgStyle}>
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 mb-4">
        <button
          onClick={onBack}
          className="bg-white/20 p-2 rounded-xl text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className={`flex items-center gap-2 text-3xl font-black ${getTimerColor()}`}>
          <Timer className="w-8 h-8" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        <div className="bg-white/20 px-3 py-1 rounded-xl">
          <p className="text-white/60 text-xs">Best</p>
          <p className="text-white font-bold">{bestScore.toLocaleString()}</p>
        </div>
      </div>

      {/* Theme selector (Competitive only) */}
      <div className="w-full max-w-md mb-3">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="w-full bg-white/15 text-white rounded-xl px-3 py-2 font-bold"
        >
          {unlockedThemes.map((t) => (
            <option key={t} value={t} className="text-black">
              {getThemeName(t)}
            </option>
          ))}
        </select>
      </div>

      {/* Score */}
      <div className="bg-white/20 px-6 py-3 rounded-2xl mb-4">
        <p className="text-white/60 text-sm text-center">Score</p>
        <p className="text-white text-4xl font-black text-center">{score.toLocaleString()}</p>
      </div>

      {/* Game board */}
      <div className="relative">
        <GameBoard
          board={board}
          size={size}
          theme={theme}
          tiles={tiles}
          onMove={handleMove}
        />

        {/* Start overlay */}
        {!isPlaying && !gameEnded && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 px-8 py-4 rounded-2xl font-black text-2xl hover:scale-105 transition-transform"
            >
              START!
            </button>
          </div>
        )}

        {/* Game over overlay */}
        {gameEnded && (
          <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center p-6">
            <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
            <h2 className="text-white text-3xl font-black mb-2">{endTitle}</h2>
            <p className="text-white/70 mb-1">Final Score</p>
            <p className="text-yellow-400 text-4xl font-black mb-6">{score.toLocaleString()}</p>

            {score > bestScore && (
              <p className="text-green-400 font-bold mb-4 animate-bounce">🎉 New Record!</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-white/50 text-sm mt-6">Get the highest score in 60 seconds!</p>
    </div>
  );
};
