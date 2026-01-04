import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Timer, Trophy } from 'lucide-react';
import { useGame2048, Theme } from '@/hooks/useGame2048';
import { GameBoard } from './GameBoard';

interface CompetitiveGameProps {
  theme: Theme;
  unlockedThemes: Theme[];
  onBack: () => void;
  onGameEnd: (score: number, highestTile: number) => void;
  bestScore: number;
}

const GAME_DURATION = 60; // seconds

export const CompetitiveGame = ({ 
  theme, 
  unlockedThemes,
  onBack, 
  onGameEnd,
  bestScore 
}: CompetitiveGameProps) => {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    board,
    score,
    size,
    newTiles,
    mergedTiles,
    move,
    initGame,
    setTheme,
  } = useGame2048(4);

  // Set theme on mount
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  // Start the game
  const startGame = useCallback(() => {
    initGame();
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setGameEnded(false);
  }, [initGame]);

  // Timer logic
  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setGameEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Notify parent when game ends
  useEffect(() => {
    if (gameEnded) {
      const highestTile = Math.max(...board.flat());
      onGameEnd(score, highestTile);
    }
  }, [gameEnded, score, board, onGameEnd]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
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
          newTiles={newTiles}
          mergedTiles={mergedTiles}
          onMove={isPlaying ? move : () => {}}
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
            <h2 className="text-white text-3xl font-black mb-2">Time's Up!</h2>
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

      <p className="text-white/50 text-sm mt-6">
        Get the highest score in 60 seconds!
      </p>
    </div>
  );
};
