import { useState, useEffect, useCallback } from 'react';
import { Theme } from './useGame2048';

// Theme ranks (gem levels)
export type ThemeRank = 'base' | 'green' | 'blue' | 'red' | 'orange';

export interface OwnedTheme {
  themeId: Theme;
  rank: ThemeRank;
  count: number; // how many of this theme at this rank you own
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  price: number; // in gems
  type: 'normal' | 'seasonal';
  seasonId?: string;
  possibleThemes: { theme: Theme; weight: number; minRank?: ThemeRank }[];
  guaranteed?: { rarity: 'rare' | 'epic' | 'legendary' }[];
}

export interface GemStore {
  gems: number;
  ownedThemes: OwnedTheme[];
  equippedTheme: Theme;
  equippedRank: ThemeRank;
}

const RANK_ORDER: ThemeRank[] = ['base', 'green', 'blue', 'red', 'orange'];

export const getRankMultiplier = (rank: ThemeRank): number => {
  switch (rank) {
    case 'base': return 1;
    case 'green': return 1.25;
    case 'blue': return 1.5;
    case 'red': return 1.75;
    case 'orange': return 2;
  }
};

export const getNextRank = (rank: ThemeRank): ThemeRank | null => {
  const idx = RANK_ORDER.indexOf(rank);
  return idx < RANK_ORDER.length - 1 ? RANK_ORDER[idx + 1] : null;
};

export const getRankColor = (rank: ThemeRank): string => {
  switch (rank) {
    case 'base': return '#888';
    case 'green': return '#22c55e';
    case 'blue': return '#3b82f6';
    case 'red': return '#ef4444';
    case 'orange': return '#f97316';
  }
};

export const getRankName = (rank: ThemeRank): string => {
  switch (rank) {
    case 'base': return 'Base';
    case 'green': return 'Green Gem';
    case 'blue': return 'Blue Gem';
    case 'red': return 'Red Gem';
    case 'orange': return 'Orange Gem';
  }
};

// Normal packs
export const NORMAL_PACKS: Pack[] = [
  {
    id: 'starter_pack',
    name: 'Starter Pack',
    description: '3 random themes',
    price: 50,
    type: 'normal',
    possibleThemes: [
      { theme: 'fire', weight: 20 },
      { theme: 'bubblegum', weight: 20 },
      { theme: 'blue', weight: 20 },
      { theme: 'forest', weight: 20 },
      { theme: 'dark', weight: 15 },
      { theme: 'sunset', weight: 15 },
      { theme: 'lavender', weight: 15 },
      { theme: 'mint', weight: 15 },
    ],
  },
  {
    id: 'rare_pack',
    name: 'Rare Pack',
    description: '3 themes, 1 guaranteed rare+',
    price: 100,
    type: 'normal',
    possibleThemes: [
      { theme: 'dark', weight: 15 },
      { theme: 'sunset', weight: 15 },
      { theme: 'lavender', weight: 15 },
      { theme: 'mint', weight: 15 },
      { theme: 'wood', weight: 12 },
      { theme: 'denim', weight: 12 },
      { theme: 'neon', weight: 8 },
      { theme: 'aurora', weight: 8 },
      { theme: 'cherry', weight: 8 },
    ],
    guaranteed: [{ rarity: 'rare' }],
  },
  {
    id: 'epic_pack',
    name: 'Epic Pack',
    description: '4 themes, 1 guaranteed epic+',
    price: 250,
    type: 'normal',
    possibleThemes: [
      { theme: 'neon', weight: 15 },
      { theme: 'aurora', weight: 15 },
      { theme: 'cherry', weight: 15 },
      { theme: 'gold', weight: 12 },
      { theme: 'leather', weight: 12 },
      { theme: 'velvet', weight: 12 },
      { theme: 'galaxy', weight: 6 },
      { theme: 'rainbow', weight: 6 },
    ],
    guaranteed: [{ rarity: 'epic' }],
  },
  {
    id: 'legendary_pack',
    name: 'Legendary Pack',
    description: '5 themes, 1 guaranteed legendary',
    price: 500,
    type: 'normal',
    possibleThemes: [
      { theme: 'galaxy', weight: 10 },
      { theme: 'rainbow', weight: 10 },
      { theme: 'diamond', weight: 8 },
      { theme: 'marble', weight: 8 },
      { theme: 'carbon', weight: 8 },
      { theme: 'crystal', weight: 6 },
      { theme: 'brushed_metal', weight: 6 },
    ],
    guaranteed: [{ rarity: 'legendary' }],
  },
];

const GEMS_STORAGE_KEY = '2048-gems-store';

export const useGems = () => {
  const [store, setStore] = useState<GemStore>(() => {
    const saved = localStorage.getItem(GEMS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      gems: 100, // Starter gems
      ownedThemes: [{ themeId: 'classic' as Theme, rank: 'base' as ThemeRank, count: 1 }],
      equippedTheme: 'classic' as Theme,
      equippedRank: 'base' as ThemeRank,
    };
  });

  useEffect(() => {
    localStorage.setItem(GEMS_STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const addGems = useCallback((amount: number) => {
    setStore(prev => ({ ...prev, gems: prev.gems + amount }));
  }, []);

  const spendGems = useCallback((amount: number): boolean => {
    if (store.gems < amount) return false;
    setStore(prev => ({ ...prev, gems: prev.gems - amount }));
    return true;
  }, [store.gems]);

  const addTheme = useCallback((theme: Theme, rank: ThemeRank = 'base') => {
    setStore(prev => {
      const existing = prev.ownedThemes.find(t => t.themeId === theme && t.rank === rank);
      if (existing) {
        return {
          ...prev,
          ownedThemes: prev.ownedThemes.map(t =>
            t.themeId === theme && t.rank === rank
              ? { ...t, count: t.count + 1 }
              : t
          ),
        };
      }
      return {
        ...prev,
        ownedThemes: [...prev.ownedThemes, { themeId: theme, rank, count: 1 }],
      };
    });
  }, []);

  const mergeThemes = useCallback((theme: Theme, currentRank: ThemeRank): boolean => {
    const nextRank = getNextRank(currentRank);
    if (!nextRank) return false;

    const owned = store.ownedThemes.find(t => t.themeId === theme && t.rank === currentRank);
    if (!owned || owned.count < 2) return false;

    setStore(prev => {
      // Remove 2 of current rank
      const updatedThemes = prev.ownedThemes.map(t => {
        if (t.themeId === theme && t.rank === currentRank) {
          return { ...t, count: t.count - 2 };
        }
        return t;
      }).filter(t => t.count > 0);

      // Add 1 of next rank
      const existingNext = updatedThemes.find(t => t.themeId === theme && t.rank === nextRank);
      if (existingNext) {
        return {
          ...prev,
          ownedThemes: updatedThemes.map(t =>
            t.themeId === theme && t.rank === nextRank
              ? { ...t, count: t.count + 1 }
              : t
          ),
        };
      }
      return {
        ...prev,
        ownedThemes: [...updatedThemes, { themeId: theme, rank: nextRank, count: 1 }],
      };
    });
    return true;
  }, [store.ownedThemes]);

  const equipTheme = useCallback((theme: Theme, rank: ThemeRank) => {
    const owned = store.ownedThemes.find(t => t.themeId === theme && t.rank === rank);
    if (!owned || owned.count < 1) return false;
    setStore(prev => ({ ...prev, equippedTheme: theme, equippedRank: rank }));
    return true;
  }, [store.ownedThemes]);

  const hasTheme = useCallback((theme: Theme, rank?: ThemeRank): boolean => {
    if (rank) {
      return store.ownedThemes.some(t => t.themeId === theme && t.rank === rank && t.count > 0);
    }
    return store.ownedThemes.some(t => t.themeId === theme && t.count > 0);
  }, [store.ownedThemes]);

  const getThemeCount = useCallback((theme: Theme, rank: ThemeRank): number => {
    const owned = store.ownedThemes.find(t => t.themeId === theme && t.rank === rank);
    return owned?.count || 0;
  }, [store.ownedThemes]);

  return {
    ...store,
    addGems,
    spendGems,
    addTheme,
    mergeThemes,
    equipTheme,
    hasTheme,
    getThemeCount,
  };
};
