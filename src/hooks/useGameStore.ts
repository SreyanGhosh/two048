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
  isDaily?: boolean;
  expiresAt?: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'theme' | 'powerup';
  value: string;
  owned: boolean;
  tier?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GameStore {
  coins: number;
  unlockedThemes: Theme[];
  challenges: Challenge[];
  dailyChallenges: Challenge[];
  shopItems: ShopItem[];
  competitivePlays: number;
  gamesPlayed: number;
  highestTile: number;
  bestClassicScore: number;
  bestCompetitiveScore: number;
  lastDailyReset: number;
}

const DEFAULT_CHALLENGES: Challenge[] = [
  { id: 'score_1000', title: 'Getting Started', description: 'Score 1,000 points', target: 1000, current: 0, reward: 50, completed: false, claimed: false, type: 'score' },
  { id: 'score_5000', title: 'Rising Star', description: 'Score 5,000 points', target: 5000, current: 0, reward: 100, completed: false, claimed: false, type: 'score' },
  { id: 'score_10000', title: 'Point Master', description: 'Score 10,000 points', target: 10000, current: 0, reward: 200, completed: false, claimed: false, type: 'score' },
  { id: 'score_25000', title: 'Score Legend', description: 'Score 25,000 points', target: 25000, current: 0, reward: 500, completed: false, claimed: false, type: 'score' },
  { id: 'score_50000', title: 'Ultimate Scorer', description: 'Score 50,000 points', target: 50000, current: 0, reward: 1000, completed: false, claimed: false, type: 'score' },
  { id: 'competitive_3', title: 'Competitor', description: 'Play 3 competitive games', target: 3, current: 0, reward: 75, completed: false, claimed: false, type: 'competitive_plays' },
  { id: 'competitive_10', title: 'Speed Demon', description: 'Play 10 competitive games', target: 10, current: 0, reward: 150, completed: false, claimed: false, type: 'competitive_plays' },
  { id: 'competitive_25', title: 'Time Lord', description: 'Play 25 competitive games', target: 25, current: 0, reward: 400, completed: false, claimed: false, type: 'competitive_plays' },
  { id: 'games_5', title: 'Dedicated', description: 'Play 5 games total', target: 5, current: 0, reward: 50, completed: false, claimed: false, type: 'games_played' },
  { id: 'games_20', title: 'Addicted', description: 'Play 20 games total', target: 20, current: 0, reward: 200, completed: false, claimed: false, type: 'games_played' },
  { id: 'games_50', title: 'True Fan', description: 'Play 50 games total', target: 50, current: 0, reward: 500, completed: false, claimed: false, type: 'games_played' },
  { id: 'games_100', title: 'Legend', description: 'Play 100 games total', target: 100, current: 0, reward: 1000, completed: false, claimed: false, type: 'games_played' },
  { id: 'tile_512', title: 'Halfway There', description: 'Reach the 512 tile', target: 512, current: 0, reward: 100, completed: false, claimed: false, type: 'tile_reached' },
  { id: 'tile_1024', title: 'Almost There', description: 'Reach the 1024 tile', target: 1024, current: 0, reward: 250, completed: false, claimed: false, type: 'tile_reached' },
  { id: 'tile_2048', title: '2048 Champion', description: 'Reach the 2048 tile!', target: 2048, current: 0, reward: 500, completed: false, claimed: false, type: 'tile_reached' },
  { id: 'tile_4096', title: 'Beyond Limits', description: 'Reach the 4096 tile!', target: 4096, current: 0, reward: 1500, completed: false, claimed: false, type: 'tile_reached' },
];

const DAILY_CHALLENGE_POOL: Omit<Challenge, 'expiresAt' | 'current' | 'completed' | 'claimed'>[] = [
  { id: 'daily_score_500', title: 'Quick Score', description: 'Score 500 points today', target: 500, reward: 25, type: 'score', isDaily: true },
  { id: 'daily_score_2000', title: 'Score Rush', description: 'Score 2,000 points today', target: 2000, reward: 50, type: 'score', isDaily: true },
  { id: 'daily_score_5000', title: 'Score Blitz', description: 'Score 5,000 points today', target: 5000, reward: 100, type: 'score', isDaily: true },
  { id: 'daily_competitive_1', title: 'Speed Run', description: 'Play 1 competitive game', target: 1, reward: 30, type: 'competitive_plays', isDaily: true },
  { id: 'daily_competitive_3', title: 'Triple Threat', description: 'Play 3 competitive games', target: 3, reward: 75, type: 'competitive_plays', isDaily: true },
  { id: 'daily_games_2', title: 'Warm Up', description: 'Play 2 games today', target: 2, reward: 20, type: 'games_played', isDaily: true },
  { id: 'daily_games_5', title: 'Daily Grind', description: 'Play 5 games today', target: 5, reward: 60, type: 'games_played', isDaily: true },
  { id: 'daily_tile_256', title: 'Reach 256', description: 'Reach the 256 tile', target: 256, reward: 40, type: 'tile_reached', isDaily: true },
  { id: 'daily_tile_512', title: 'Reach 512', description: 'Reach the 512 tile', target: 512, reward: 75, type: 'tile_reached', isDaily: true },
];

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  // Common themes (100-200 coins)
  { id: 'theme_fire', name: 'Fire Theme', description: 'Blazing hot colors', price: 100, type: 'theme', value: 'fire', owned: false, tier: 'common' },
  { id: 'theme_bubblegum', name: 'Bubblegum', description: 'Sweet pink vibes', price: 100, type: 'theme', value: 'bubblegum', owned: false, tier: 'common' },
  { id: 'theme_blue', name: 'Ocean', description: 'Cool blue waves', price: 100, type: 'theme', value: 'blue', owned: false, tier: 'common' },
  { id: 'theme_forest', name: 'Forest', description: 'Natural green tones', price: 150, type: 'theme', value: 'forest', owned: false, tier: 'common' },
  
  // Rare themes (250-400 coins)
  { id: 'theme_dark', name: 'Midnight', description: 'Sleek and mysterious', price: 250, type: 'theme', value: 'dark', owned: false, tier: 'rare' },
  { id: 'theme_sunset', name: 'Sunset', description: 'Warm evening glow', price: 300, type: 'theme', value: 'sunset', owned: false, tier: 'rare' },
  { id: 'theme_lavender', name: 'Lavender Dream', description: 'Calming purple hues', price: 300, type: 'theme', value: 'lavender', owned: false, tier: 'rare' },
  { id: 'theme_mint', name: 'Mint Fresh', description: 'Cool minty freshness', price: 350, type: 'theme', value: 'mint', owned: false, tier: 'rare' },
  
  // Epic themes (500-800 coins)
  { id: 'theme_neon', name: 'Neon Nights', description: 'Cyberpunk glow', price: 500, type: 'theme', value: 'neon', owned: false, tier: 'epic' },
  { id: 'theme_aurora', name: 'Aurora Borealis', description: 'Northern lights magic', price: 600, type: 'theme', value: 'aurora', owned: false, tier: 'epic' },
  { id: 'theme_cherry', name: 'Cherry Blossom', description: 'Japanese spring beauty', price: 650, type: 'theme', value: 'cherry', owned: false, tier: 'epic' },
  { id: 'theme_gold', name: 'Royal Gold', description: 'Luxurious golden shine', price: 750, type: 'theme', value: 'gold', owned: false, tier: 'epic' },
  
  // Legendary themes (1000+ coins)
  { id: 'theme_galaxy', name: 'Galaxy', description: 'Cosmic star clusters', price: 1000, type: 'theme', value: 'galaxy', owned: false, tier: 'legendary' },
  { id: 'theme_rainbow', name: 'Rainbow Prism', description: 'All colors combined', price: 1200, type: 'theme', value: 'rainbow', owned: false, tier: 'legendary' },
  { id: 'theme_diamond', name: 'Diamond', description: 'Ultimate brilliance', price: 1500, type: 'theme', value: 'diamond', owned: false, tier: 'legendary' },
];

const STORAGE_KEY = '2048-game-store';

const toSafeInt = (value: unknown, fallback = 0) => {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
};
const generateDailyChallenges = (): Challenge[] => {
  const shuffled = [...DAILY_CHALLENGE_POOL].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);
  
  return selected.map(c => ({
    ...c,
    current: 0,
    completed: false,
    claimed: false,
    expiresAt: tomorrow.getTime(),
  }));
};

const syncChallengeProgress = (
  challenges: Challenge[], 
  gamesPlayed: number, 
  competitivePlays: number, 
  highestTile: number,
  bestScore: number
): Challenge[] => {
  return challenges.map(c => {
    if (c.claimed) return c;
    
    let newCurrent = c.current;
    switch (c.type) {
      case 'score':
        newCurrent = Math.max(c.current, bestScore);
        break;
      case 'competitive_plays':
        newCurrent = competitivePlays;
        break;
      case 'games_played':
        newCurrent = gamesPlayed;
        break;
      case 'tile_reached':
        newCurrent = Math.max(c.current, highestTile);
        break;
    }
    
    return {
      ...c,
      current: newCurrent,
      completed: newCurrent >= c.target,
    };
  });
};

export const useGameStore = () => {
  const [store, setStore] = useState<GameStore>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (saved) {
      const parsed = JSON.parse(saved);

      const parsedCoins = toSafeInt(parsed.coins, 0);
      const parsedCompetitivePlays = toSafeInt(parsed.competitivePlays, 0);
      const parsedGamesPlayed = toSafeInt(parsed.gamesPlayed, 0);
      const parsedHighestTile = toSafeInt(parsed.highestTile, 0);
      const parsedBestClassicScore = toSafeInt(parsed.bestClassicScore, 0);
      const parsedBestCompetitiveScore = toSafeInt(parsed.bestCompetitiveScore, 0);
      const parsedLastDailyReset = toSafeInt(parsed.lastDailyReset, now);

      // Check if daily challenges need reset
      const needsDailyReset =
        !parsedLastDailyReset ||
        new Date(parsedLastDailyReset).toDateString() !== new Date().toDateString();

      const dailyChallenges = needsDailyReset
        ? generateDailyChallenges()
        : (parsed.dailyChallenges || generateDailyChallenges());

      // Merge with defaults to handle new challenges and sync progress
      const mergedChallenges = DEFAULT_CHALLENGES.map((dc) => {
        const existing = parsed.challenges?.find((c: Challenge) => c.id === dc.id);
        return existing || dc;
      });

      // Sync challenge progress with actual counters
      const syncedChallenges = syncChallengeProgress(
        mergedChallenges,
        parsedGamesPlayed,
        parsedCompetitivePlays,
        parsedHighestTile,
        Math.max(parsedBestClassicScore, parsedBestCompetitiveScore)
      );

      const mergedShopItems = DEFAULT_SHOP_ITEMS.map((di) => {
        const existing = parsed.shopItems?.find((i: ShopItem) => i.id === di.id);
        return existing ? { ...di, owned: existing.owned } : di;
      });

      return {
        ...parsed,
        coins: parsedCoins,
        competitivePlays: parsedCompetitivePlays,
        gamesPlayed: parsedGamesPlayed,
        highestTile: parsedHighestTile,
        bestClassicScore: parsedBestClassicScore,
        bestCompetitiveScore: parsedBestCompetitiveScore,
        challenges: syncedChallenges,
        dailyChallenges,
        shopItems: mergedShopItems,
        lastDailyReset: needsDailyReset ? now : parsedLastDailyReset,
      };
    }

    return {
      coins: 0,
      unlockedThemes: ['classic'] as Theme[],
      challenges: DEFAULT_CHALLENGES,
      dailyChallenges: generateDailyChallenges(),
      shopItems: DEFAULT_SHOP_ITEMS,
      competitivePlays: 0,
      gamesPlayed: 0,
      highestTile: 0,
      bestClassicScore: 0,
      bestCompetitiveScore: 0,
      lastDailyReset: Date.now(),
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  // Check for daily reset
  useEffect(() => {
    const checkDailyReset = () => {
      const now = new Date();
      const lastReset = new Date(store.lastDailyReset);
      
      if (now.toDateString() !== lastReset.toDateString()) {
        setStore(prev => ({
          ...prev,
          dailyChallenges: generateDailyChallenges(),
          lastDailyReset: Date.now(),
        }));
      }
    };
    
    checkDailyReset();
    const interval = setInterval(checkDailyReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [store.lastDailyReset]);

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
      const prevGamesPlayed = toSafeInt(prev.gamesPlayed, 0);
      const prevCompetitivePlays = toSafeInt(prev.competitivePlays, 0);

      const newGamesPlayed = prevGamesPlayed + 1;
      const newCompetitivePlays = isCompetitive ? prevCompetitivePlays + 1 : prevCompetitivePlays;
      const newHighestTile = Math.max(toSafeInt(prev.highestTile, 0), highestTile);
      const newBestClassic = !isCompetitive ? Math.max(toSafeInt(prev.bestClassicScore, 0), score) : toSafeInt(prev.bestClassicScore, 0);
      const newBestCompetitive = isCompetitive ? Math.max(toSafeInt(prev.bestCompetitiveScore, 0), score) : toSafeInt(prev.bestCompetitiveScore, 0);
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

      // Update daily challenges too
      const updatedDailyChallenges = prev.dailyChallenges.map(c => {
        if (c.claimed) return c;
        
        let newCurrent = c.current;
        switch (c.type) {
          case 'score':
            newCurrent = Math.max(c.current, score);
            break;
          case 'competitive_plays':
            if (isCompetitive) newCurrent = c.current + 1;
            break;
          case 'games_played':
            newCurrent = c.current + 1;
            break;
          case 'tile_reached':
            newCurrent = Math.max(c.current, highestTile);
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
        dailyChallenges: updatedDailyChallenges,
      };
    });
  }, []);

  const claimReward = useCallback((challengeId: string, isDaily: boolean = false): number => {
    const challengeList = isDaily ? store.dailyChallenges : store.challenges;
    const challenge = challengeList.find(c => c.id === challengeId);
    if (!challenge || !challenge.completed || challenge.claimed) return 0;

    setStore(prev => ({
      ...prev,
      coins: prev.coins + challenge.reward,
      challenges: isDaily ? prev.challenges : prev.challenges.map(c =>
        c.id === challengeId ? { ...c, claimed: true } : c
      ),
      dailyChallenges: isDaily ? prev.dailyChallenges.map(c =>
        c.id === challengeId ? { ...c, claimed: true } : c
      ) : prev.dailyChallenges,
    }));

    return challenge.reward;
  }, [store.challenges, store.dailyChallenges]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStore({
      coins: 0,
      unlockedThemes: ['classic'] as Theme[],
      challenges: DEFAULT_CHALLENGES,
      dailyChallenges: generateDailyChallenges(),
      shopItems: DEFAULT_SHOP_ITEMS,
      competitivePlays: 0,
      gamesPlayed: 0,
      highestTile: 0,
      bestClassicScore: 0,
      bestCompetitiveScore: 0,
      lastDailyReset: Date.now(),
    });
  }, []);

  return {
    ...store,
    addCoins,
    spendCoins,
    unlockTheme,
    purchaseItem,
    updateProgress,
    claimReward,
    resetProgress,
  };
};
