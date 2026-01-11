import { useState, useCallback, useRef } from 'react';

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  prevRow?: number;
  prevCol?: number;
  isNew: boolean;
  isMerged: boolean;
}

let tileIdCounter = 0;
const generateTileId = () => ++tileIdCounter;

export const useTileAnimations = (size: number) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializeTiles = useCallback((board: number[][]) => {
    const newTiles: Tile[] = [];
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] !== 0) {
          newTiles.push({
            id: generateTileId(),
            value: board[r][c],
            row: r,
            col: c,
            isNew: false, // Don't animate initial tiles
            isMerged: false,
          });
        }
      }
    }
    setTiles(newTiles);
  }, []);

  const updateTilesFromMove = useCallback((
    oldBoard: number[][],
    newBoard: number[][],
    direction: 'up' | 'down' | 'left' | 'right',
    newTilePos: [number, number] | null,
    mergedPositions: Set<string>
  ) => {
    // Clear previous animation flags after animation completes
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    setTiles(prevTiles => {
      // Create a map of current positions to tiles
      const tileMap = new Map<string, Tile>();
      prevTiles.forEach(tile => {
        tileMap.set(`${tile.row}-${tile.col}`, { ...tile, isNew: false, isMerged: false });
      });

      const newTiles: Tile[] = [];
      const usedPositions = new Set<string>();

      // Process movement based on direction
      const processLine = (indices: number[], isRow: boolean) => {
        const movingTiles: Tile[] = [];
        
        // Collect tiles in this line
        indices.forEach(idx => {
          for (let i = 0; i < size; i++) {
            const r = isRow ? idx : i;
            const c = isRow ? i : idx;
            const key = `${r}-${c}`;
            const tile = tileMap.get(key);
            if (tile) {
              movingTiles.push(tile);
            }
          }
        });

        return movingTiles;
      };

      // For each position in new board, find or create tiles
      for (let r = 0; r < newBoard.length; r++) {
        for (let c = 0; c < newBoard[r].length; c++) {
          const value = newBoard[r][c];
          if (value === 0) continue;

          const posKey = `${r}-${c}`;
          const isMerged = mergedPositions.has(posKey);
          const isNewTile = newTilePos && newTilePos[0] === r && newTilePos[1] === c;

          if (isNewTile) {
            // This is a newly spawned tile
            newTiles.push({
              id: generateTileId(),
              value,
              row: r,
              col: c,
              isNew: true,
              isMerged: false,
            });
          } else {
            // Find the best matching tile to move here
            let bestTile: Tile | null = null;
            let bestDistance = Infinity;

            // Search for tiles that could have moved to this position
            const searchTile = (searchValue: number) => {
              prevTiles.forEach(tile => {
                if (usedPositions.has(`prev-${tile.id}`)) return;
                
                const tileValue = isMerged ? searchValue / 2 : searchValue;
                if (tile.value !== tileValue && tile.value !== searchValue) return;

                // Calculate if this tile could have moved to this position
                let canMove = false;
                let distance = 0;

                if (direction === 'left' && tile.row === r && tile.col >= c) {
                  canMove = true;
                  distance = tile.col - c;
                } else if (direction === 'right' && tile.row === r && tile.col <= c) {
                  canMove = true;
                  distance = c - tile.col;
                } else if (direction === 'up' && tile.col === c && tile.row >= r) {
                  canMove = true;
                  distance = tile.row - r;
                } else if (direction === 'down' && tile.col === c && tile.row <= r) {
                  canMove = true;
                  distance = r - tile.row;
                }

                if (canMove && distance < bestDistance) {
                  bestDistance = distance;
                  bestTile = tile;
                }
              });
            };

            searchTile(value);

            if (bestTile) {
              usedPositions.add(`prev-${bestTile.id}`);
              newTiles.push({
                id: isMerged ? generateTileId() : bestTile.id,
                value,
                row: r,
                col: c,
                prevRow: bestTile.row,
                prevCol: bestTile.col,
                isNew: false,
                isMerged,
              });
            } else {
              // Fallback: create new tile
              newTiles.push({
                id: generateTileId(),
                value,
                row: r,
                col: c,
                isNew: false,
                isMerged,
              });
            }
          }
        }
      }

      return newTiles;
    });

    // Clear animation flags after animation completes
    animationTimeoutRef.current = setTimeout(() => {
      setTiles(prev => prev.map(tile => ({
        ...tile,
        prevRow: undefined,
        prevCol: undefined,
        isNew: false,
        isMerged: false,
      })));
    }, 100);
  }, [size]);

  const resetTiles = useCallback(() => {
    tileIdCounter = 0;
    setTiles([]);
  }, []);

  return {
    tiles,
    initializeTiles,
    updateTilesFromMove,
    resetTiles,
  };
};
