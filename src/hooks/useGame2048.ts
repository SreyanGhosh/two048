import { useState, useCallback, useEffect } from 'react';

export type Theme = 'classic' | 'blue' | 'fire' | 'bubblegum' | 'dark' | 'forest' | 'sunset' | 'lavender' | 'mint' | 'neon' | 'aurora' | 'cherry' | 'gold' | 'galaxy' | 'rainbow' | 'diamond';

interface GameState {
  board: number[][];
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  size: number;
  theme: Theme;
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

const hasWon = (board: number[][]): boolean => {
  for (const row of board) {
    if (row.includes(2048)) return true;
  }
  return false;
};

export const useGame2048 = (initialSize: number = 4) => {
  const [state, setState] = useState<GameState>(() => {
    const bestScore = Number(localStorage.getItem('2048-best') || 0);
    const savedTheme = (localStorage.getItem('2048-theme') as Theme) || 'classic';
    const board = createEmptyBoard(initialSize);
    addRandomTile(board);
    addRandomTile(board);
    return {
      board,
      score: 0,
      bestScore,
      gameOver: false,
      won: false,
      size: initialSize,
      theme: savedTheme,
      newTiles: new Set(),
      mergedTiles: new Set(),
    };
  });

  const initGame = useCallback((newSize?: number) => {
    setState(prev => {
      const gameSize = newSize ?? prev.size;
      const board = createEmptyBoard(gameSize);
      const pos1 = addRandomTile(board);
      const pos2 = addRandomTile(board);
      const newTiles = new Set<string>();
      if (pos1) newTiles.add(`${pos1[0]}-${pos1[1]}`);
      if (pos2) newTiles.add(`${pos2[0]}-${pos2[1]}`);
      
      return {
        ...prev,
        board,
        score: 0,
        gameOver: false,
        won: false,
        size: gameSize,
        newTiles,
        mergedTiles: new Set(),
      };
    });
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    localStorage.setItem('2048-theme', theme);
    setState(prev => ({ ...prev, theme }));
  }, []);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setState(prev => {
      if (prev.gameOver) return prev;

      const size = prev.size;
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

      const newScore = prev.score + totalScore;
      const newBestScore = Math.max(prev.bestScore, newScore);
      
      if (newBestScore > prev.bestScore) {
        localStorage.setItem('2048-best', String(newBestScore));
      }

      const gameOver = !hasMoves(newBoard);
      const won = hasWon(newBoard);

      return {
        ...prev,
        board: newBoard,
        score: newScore,
        bestScore: newBestScore,
        gameOver,
        won: prev.won || won,
        newTiles,
        mergedTiles,
      };
    });
  }, []);

  return {
    ...state,
    initGame,
    move,
    setTheme,
    setSize: (size: number) => initGame(size),
  };
};
