import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Target, Trophy, X } from 'lucide-react';
import { GameBoard } from './GameBoard';
import { Season, SeasonalChallenge } from '@/hooks/useSeasons';
import { Theme } from '@/hooks/useGame2048';

interface SeasonalChallengeGameProps {
  season: Season;
  challenge: SeasonalChallenge;
  onBack: () => void;
  onComplete: (seasonId: string, challengeId: string) => void;
}

// Mini game state
interface GameState {
  board: number[][];
  score: number;
  highestTile: number;
  gameOver: boolean;
  won: boolean;
  newTiles: Set<string>;
  mergedTiles: Set<string>;
}

const createEmptyBoard = (size: number): number[][] => 
  Array.from({ length: size }, () => Array(size).fill(0));

const getEmptyCells = (board: number[][]): [number, number][] => {
  const empty: [number, number][] = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 0) empty.push([r, c]);
    }
  }
  return empty;
};

const addRandomTile = (board: number[][]): [number, number] | null => {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return null;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.75 ? 2 : 4;
  return [r, c];
};

const slide = (row: number[]): { newRow: number[]; score: number; merged: number[] } => {
  let filtered = row.filter(v => v !== 0);
  let score = 0;
  const merged: number[] = [];
  
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      score += filtered[i];
      filtered[i + 1] = 0;
      merged.push(i);
    }
  }
  
  filtered = filtered.filter(v => v !== 0);
  const newRow = [...filtered, ...Array(row.length - filtered.length).fill(0)];
  return { newRow, score, merged };
};

const hasMoves = (board: number[][]): boolean => {
  const size = board.length;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) return true;
      if (c < size - 1 && board[r][c] === board[r][c + 1]) return true;
      if (r < size - 1 && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
};

const getHighestTile = (board: number[][]): number => {
  let max = 0;
  for (const row of board) {
    for (const val of row) {
      if (val > max) max = val;
    }
  }
  return max;
};

export const SeasonalChallengeGame = ({ 
  season, 
  challenge, 
  onBack, 
  onComplete 
}: SeasonalChallengeGameProps) => {
  const completedRef = useRef(false);
  const [showVictory, setShowVictory] = useState(false);
  
  const [state, setState] = useState<GameState>(() => {
    const board = createEmptyBoard(challenge.boardSize);
    const pos1 = addRandomTile(board);
    const pos2 = addRandomTile(board);
    const newTiles = new Set<string>();
    if (pos1) newTiles.add(`${pos1[0]}-${pos1[1]}`);
    if (pos2) newTiles.add(`${pos2[0]}-${pos2[1]}`);
    
    return {
      board,
      score: 0,
      highestTile: getHighestTile(board),
      gameOver: false,
      won: false,
      newTiles,
      mergedTiles: new Set(),
    };
  });

  // Check for challenge completion
  useEffect(() => {
    if (state.highestTile >= challenge.targetTile && !completedRef.current) {
      completedRef.current = true;
      setShowVictory(true);
      onComplete(season.id, challenge.id);
    }
  }, [state.highestTile, challenge.targetTile, season.id, challenge.id, onComplete]);

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setState(prev => {
      if (prev.gameOver || prev.won) return prev;

      const size = prev.board.length;
      const newBoard = prev.board.map(row => [...row]);
      let totalScore = 0;
      const mergedTiles = new Set<string>();

      const processRow = (row: number[], rowIdx: number, isCol: boolean, reverse: boolean) => {
        const input = reverse ? [...row].reverse() : row;
        const { newRow, score, merged } = slide(input);
        const result = reverse ? newRow.reverse() : newRow;
        totalScore += score;
        
        merged.forEach(idx => {
          const actualIdx = reverse ? row.length - 1 - idx : idx;
          if (isCol) {
            mergedTiles.add(`${actualIdx}-${rowIdx}`);
          } else {
            mergedTiles.add(`${rowIdx}-${actualIdx}`);
          }
        });
        
        return result;
      };

      if (direction === 'left') {
        for (let r = 0; r < size; r++) {
          newBoard[r] = processRow(newBoard[r], r, false, false);
        }
      } else if (direction === 'right') {
        for (let r = 0; r < size; r++) {
          newBoard[r] = processRow(newBoard[r], r, false, true);
        }
      } else if (direction === 'up') {
        for (let c = 0; c < size; c++) {
          const col = newBoard.map(row => row[c]);
          const newCol = processRow(col, c, true, false);
          newCol.forEach((v, r) => newBoard[r][c] = v);
        }
      } else if (direction === 'down') {
        for (let c = 0; c < size; c++) {
          const col = newBoard.map(row => row[c]);
          const newCol = processRow(col, c, true, true);
          newCol.forEach((v, r) => newBoard[r][c] = v);
        }
      }

      // Check if board changed
      if (JSON.stringify(newBoard) === JSON.stringify(prev.board)) {
        return prev;
      }

      const newTilePos = addRandomTile(newBoard);
      const newTiles = new Set<string>();
      if (newTilePos) newTiles.add(`${newTilePos[0]}-${newTilePos[1]}`);

      const highestTile = getHighestTile(newBoard);
      const won = highestTile >= challenge.targetTile;
      const gameOver = !hasMoves(newBoard);

      return {
        ...prev,
        board: newBoard,
        score: prev.score + totalScore,
        highestTile,
        gameOver,
        won,
        newTiles,
        mergedTiles,
      };
    });
  }, [challenge.targetTile]);

  const restart = () => {
    completedRef.current = false;
    setShowVictory(false);
    const board = createEmptyBoard(challenge.boardSize);
    const pos1 = addRandomTile(board);
    const pos2 = addRandomTile(board);
    const newTiles = new Set<string>();
    if (pos1) newTiles.add(`${pos1[0]}-${pos1[1]}`);
    if (pos2) newTiles.add(`${pos2[0]}-${pos2[1]}`);
    
    setState({
      board,
      score: 0,
      highestTile: getHighestTile(board),
      gameOver: false,
      won: false,
      newTiles,
      mergedTiles: new Set(),
    });
  };

  const baseTheme = season.themes[0]?.themeValue as Theme || 'classic';

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${season.gradientFrom}, ${season.gradientTo})`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white">{challenge.title}</h1>
          <p className="text-white/60 text-sm">{season.name}</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Challenge Goal */}
      <div className="px-4 py-3">
        <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-medium">Goal: Reach {challenge.targetTile}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">Best:</span>
            <span className={`font-bold ${
              state.highestTile >= challenge.targetTile ? 'text-green-400' : 'text-white'
            }`}>
              {state.highestTile}
            </span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="mb-4 text-white font-bold text-lg">
          Score: {state.score}
        </div>
        
        <GameBoard
          board={state.board}
          size={challenge.boardSize}
          theme={baseTheme}
          newTiles={state.newTiles}
          mergedTiles={state.mergedTiles}
          onMove={handleMove}
        />

        {/* Restart button */}
        {(state.gameOver && !state.won) && (
          <button
            onClick={restart}
            className="mt-6 bg-white text-gray-900 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Victory Overlay */}
      {showVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-br rounded-3xl p-8 text-center max-w-sm mx-4 animate-in zoom-in-95"
            style={{
              background: `linear-gradient(135deg, ${season.gradientFrom}, ${season.gradientTo})`
            }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <Trophy className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-2">Challenge Complete!</h2>
            <p className="text-white/80 mb-6">
              You reached {challenge.targetTile} and completed "{challenge.title}"!
            </p>
            <button
              onClick={onBack}
              className="bg-white text-gray-900 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Claim Reward
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
