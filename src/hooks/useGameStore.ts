import { useState, useEffect, useCallback } from 'react';
import { Theme } from './useGame2048';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
  type: 'score' | 'competitive_plays' | 'games_played' | 'tile_reached';
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'theme' | 'powerup';
  value: string;
  owned: boolean;
}

export interface GameStore {
  coins: number;
  unlockedThemes: Theme[];
  challenges: Challenge[];
  shopItems: ShopItem[];
  competitivePlays: number;
  gamesPlayed: number;
  highestTile: number;
  bestClassicScore: number;
  bestCompetitiveScore: number;
}

const DEFAULT_CHALLENGES: Challenge[] = [
  { id: 'score_1000', title: 'Getting Started', description: 'Score 1,000 points', target: 1000, current: 0, reward: 50, completed: false, claimed: false, type: 'score' },
  { id: 'score_5000', title: 'Rising Star', description: 'Score 5,000 points', target: 5000, current: 0, reward: 100, completed: false, claimed: false, type: 'score' },
  { id: 'score_10000', title: 'Point Master', description: 'Score 10,000 points', target: 10000, current: 0, reward: 200, completed: false, claimed: false, type: 'score' },
  { id: 'score_25000', title: 'Score Legend', description: 'Score 25,000 points', target: 25000, current: 0, reward: 500, completed: false, claimed: false, type: 'score' },
  { id: 'competitive_3', title: 'Competitor', description: 'Play 3 competitive games', target: 3, current: 0, reward: 75, completed: false, claimed: false, type: 'competitive_plays' },
  { id: 'competitive_10', title: 'Speed Demon', description: 'Play 10 competitive games', target: 10, current: 0, reward: 150, completed: false, claimed: false, type: 'competitive_plays' },
  { id: 'games_5', title: 'Dedicated', description: 'Play 5 games total', target: 5, current: 0, reward: 50, completed: false, claimed: false, type: 'games_played' },
  { id: 'games_20', title: 'Addicted', description: 'Play 20 games total', target: 20, current: 0, reward: 200, completed: false, claimed: false, type: 'games_played' },
  { id: 'tile_512', title: 'Halfway There', description: 'Reach the 512 tile', target: 512, current: 0, reward: 100, completed: false, claimed: false, type: 'tile_reached' },
  { id: 'tile_1024', title: 'Almost There', description: 'Reach the 1024 tile', target: 1024, current: 0, reward: 250, completed: false, claimed: false, type: 'tile_reached' },
  { id: 'tile_2048', title: '2048 Champion', description: 'Reach the 2048 tile!', target: 2048, current: 0, reward: 500, completed: false, claimed: false, type: 'tile_reached' },
];

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  { id: 'theme_fire', name: 'Fire Theme', description: 'Blazing hot colors', price: 100, type: 'theme', value: 'fire', owned: false },
  { id: 'theme_bubblegum', name: 'Bubblegum Theme', description: 'Sweet pink vibes', price: 100, type: 'theme', value: 'bubblegum', owned: false },
  { id: 'theme_dark', name: 'Dark Theme', description: 'Sleek and mysterious', price: 150, type: 'theme', value: 'dark', owned: false },
  { id: 'theme_blue', name: 'Ocean Theme', description: 'Cool blue waves', price: 100, type: 'theme', value: 'blue', owned: false },
];

const STORAGE_KEY = '2048-game-store';

export const useGameStore = () => {
  const [store, setStore] = useState<GameStore>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to handle new challenges
      return {
        ...parsed,
        challenges: DEFAULT_CHALLENGES.map(dc => {
          const existing = parsed.challenges?.find((c: Challenge) => c.id === dc.id);
          return existing || dc;
        }),
        shopItems: DEFAULT_SHOP_ITEMS.map(di => {
          const existing = parsed.shopItems?.find((i: ShopItem) => i.id === di.id);
          return existing || di;
        }),
      };
    }
    return {
      coins: 0,
      unlockedThemes: ['classic'] as Theme[],
      challenges: DEFAULT_CHALLENGES,
      shopItems: DEFAULT_SHOP_ITEMS,
      competitivePlays: 0,
      gamesPlayed: 0,
      highestTile: 0,
      bestClassicScore: 0,
      bestCompetitiveScore: 0,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const addCoins = useCallback((amount: number) => {
    setStore(prev => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    if (store.coins < amount) return false;
    setStore(prev => ({ ...prev, coins: prev.coins - amount }));
    return true;
  }, [store.coins]);

  const unlockTheme = useCallback((theme: Theme) => {
    setStore(prev => ({
      ...prev,
      unlockedThemes: [...prev.unlockedThemes, theme],
    }));
  }, []);

  const purchaseItem = useCallback((itemId: string): boolean => {
    const item = store.shopItems.find(i => i.id === itemId);
    if (!item || item.owned || store.coins < item.price) return false;

    setStore(prev => ({
      ...prev,
      coins: prev.coins - item.price,
      shopItems: prev.shopItems.map(i => 
        i.id === itemId ? { ...i, owned: true } : i
      ),
      unlockedThemes: item.type === 'theme' 
        ? [...prev.unlockedThemes, item.value as Theme]
        : prev.unlockedThemes,
    }));
    return true;
  }, [store.coins, store.shopItems]);

  const updateProgress = useCallback((score: number, highestTile: number, isCompetitive: boolean) => {
    setStore(prev => {
      const newGamesPlayed = prev.gamesPlayed + 1;
      const newCompetitivePlays = isCompetitive ? prev.competitivePlays + 1 : prev.competitivePlays;
      const newHighestTile = Math.max(prev.highestTile, highestTile);
      const newBestClassic = !isCompetitive ? Math.max(prev.bestClassicScore, score) : prev.bestClassicScore;
      const newBestCompetitive = isCompetitive ? Math.max(prev.bestCompetitiveScore, score) : prev.bestCompetitiveScore;

      const updatedChallenges = prev.challenges.map(c => {
        if (c.claimed) return c;
        
        let newCurrent = c.current;
        switch (c.type) {
          case 'score':
            newCurrent = Math.max(c.current, score);
            break;
          case 'competitive_plays':
            newCurrent = newCompetitivePlays;
            break;
          case 'games_played':
            newCurrent = newGamesPlayed;
            break;
          case 'tile_reached':
            newCurrent = Math.max(c.current, newHighestTile);
            break;
        }

        return {
          ...c,
          current: newCurrent,
          completed: newCurrent >= c.target,
        };
      });

      return {
        ...prev,
        gamesPlayed: newGamesPlayed,
        competitivePlays: newCompetitivePlays,
        highestTile: newHighestTile,
        bestClassicScore: newBestClassic,
        bestCompetitiveScore: newBestCompetitive,
        challenges: updatedChallenges,
      };
    });
  }, []);

  const claimReward = useCallback((challengeId: string): number => {
    const challenge = store.challenges.find(c => c.id === challengeId);
    if (!challenge || !challenge.completed || challenge.claimed) return 0;

    setStore(prev => ({
      ...prev,
      coins: prev.coins + challenge.reward,
      challenges: prev.challenges.map(c =>
        c.id === challengeId ? { ...c, claimed: true } : c
      ),
    }));

    return challenge.reward;
  }, [store.challenges]);

  return {
    ...store,
    addCoins,
    spendCoins,
    unlockTheme,
    purchaseItem,
    updateProgress,
    claimReward,
  };
};
