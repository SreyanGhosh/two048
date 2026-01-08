import { useState, useEffect, useCallback } from 'react';
import { Theme } from './useGame2048';

export interface SeasonTheme {
  id: string;
  name: string;
  description: string;
  price: number; // in season credits
  tier: 'base' | 'rare' | 'epic' | 'legendary';
  themeValue: Theme;
}

export interface SeasonalChallenge {
  id: string;
  title: string;
  description: string;
  targetTile: number;
  boardSize: 3 | 4 | 5;
  order: number; // sequential order
  rewards: {
    seasonCredits?: number;
    coins?: number;
    gems?: number;
    themeId?: string;
  };
  completed: boolean;
  claimed: boolean;
}

export interface Season {
  id: string;
  name: string;
  emoji: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  description: string;
  themes: SeasonTheme[];
  challenges: SeasonalChallenge[];
  baseThemeId: string; // free theme given at start
  starterCredits: number;
  gradientFrom: string;
  gradientTo: string;
}

export interface SeasonProgress {
  seasonId: string;
  seasonCredits: number;
  unlockedThemes: string[];
  completedChallenges: string[];
  claimedChallenges: string[];
  lastChallengeDate: string | null; // ISO date - for 1 per day limit
  welcomeShown: boolean;
}

// Define all seasons - seasons can overlap!
export const ALL_SEASONS: Season[] = [
  // New Year's 2026 - overlaps with Christmas
  {
    id: 'newyear_2026',
    name: 'New Year Celebration',
    emoji: '🎆',
    startDate: '2025-12-28',
    endDate: '2026-01-15',
    description: 'Ring in the new year with sparkly themes and fresh starts!',
    gradientFrom: '#1a1a3e',
    gradientTo: '#ffd700',
    baseThemeId: 'newyear_base',
    starterCredits: 60,
    themes: [
      { id: 'newyear_base', name: 'Midnight Glow', description: 'New year sparkles', price: 0, tier: 'base', themeValue: 'newyear' as Theme },
      { id: 'newyear_firework', name: 'Fireworks', description: 'Explosive colors', price: 100, tier: 'rare', themeValue: 'firework' as Theme },
      { id: 'newyear_champagne', name: 'Champagne Pop', description: 'Bubbly celebration', price: 250, tier: 'epic', themeValue: 'champagne' as Theme },
      { id: 'newyear_countdown', name: 'Countdown', description: 'The final moments', price: 500, tier: 'legendary', themeValue: 'countdown' as Theme },
    ],
    challenges: [
      { id: 'ny_1', title: 'Fresh Start', description: 'Reach 64 on a 4x4 board', targetTile: 64, boardSize: 4, order: 1, rewards: { seasonCredits: 25, coins: 50, gems: 5 }, completed: false, claimed: false },
      { id: 'ny_2', title: 'Resolution', description: 'Reach 128 on a 4x4 board', targetTile: 128, boardSize: 4, order: 2, rewards: { seasonCredits: 50, gems: 10 }, completed: false, claimed: false },
      { id: 'ny_3', title: 'First Steps', description: 'Reach 64 on a 3x3 board', targetTile: 64, boardSize: 3, order: 3, rewards: { seasonCredits: 75, coins: 100, gems: 15 }, completed: false, claimed: false },
      { id: 'ny_4', title: 'Momentum', description: 'Reach 128 on a 3x3 board', targetTile: 128, boardSize: 3, order: 4, rewards: { seasonCredits: 100, themeId: 'newyear_firework', gems: 20 }, completed: false, claimed: false },
      { id: 'ny_5', title: 'Sparks Fly', description: 'Reach 256 on a 4x4 board', targetTile: 256, boardSize: 4, order: 5, rewards: { seasonCredits: 100, coins: 150, gems: 25 }, completed: false, claimed: false },
      { id: 'ny_6', title: 'Champagne', description: 'Reach 256 on a 3x3 board', targetTile: 256, boardSize: 3, order: 6, rewards: { seasonCredits: 150, gems: 30 }, completed: false, claimed: false },
      { id: 'ny_7', title: 'Fireworks', description: 'Reach 512 on a 4x4 board', targetTile: 512, boardSize: 4, order: 7, rewards: { seasonCredits: 200, themeId: 'newyear_champagne', gems: 40 }, completed: false, claimed: false },
      { id: 'ny_8', title: 'Midnight', description: 'Reach 512 on a 3x3 board', targetTile: 512, boardSize: 3, order: 8, rewards: { seasonCredits: 300, coins: 500, gems: 50 }, completed: false, claimed: false },
      { id: 'ny_9', title: 'Countdown', description: 'Reach 1024 on a 4x4 board', targetTile: 1024, boardSize: 4, order: 9, rewards: { seasonCredits: 500, gems: 75 }, completed: false, claimed: false },
      { id: 'ny_10', title: 'Happy 2026!', description: 'Reach 2048 on a 4x4 board', targetTile: 2048, boardSize: 4, order: 10, rewards: { themeId: 'newyear_countdown', coins: 1000, gems: 100 }, completed: false, claimed: false },
    ],
  },
  {
    id: 'christmas_2025',
    name: 'Winter Wonderland',
    emoji: '🎄',
    startDate: '2025-12-15',
    endDate: '2026-01-10',
    description: 'Celebrate the holidays with festive themes and snowy challenges!',
    gradientFrom: '#1e3a5f',
    gradientTo: '#7b1e34',
    baseThemeId: 'christmas_base',
    starterCredits: 50,
    themes: [
      { id: 'christmas_base', name: 'Cozy Christmas', description: 'Warm holiday colors', price: 0, tier: 'base', themeValue: 'christmas' as Theme },
      { id: 'christmas_snow', name: 'Snowy Night', description: 'Peaceful winter snow', price: 100, tier: 'rare', themeValue: 'snow' as Theme },
      { id: 'christmas_ice', name: 'Ice Crystal', description: 'Frozen elegance', price: 250, tier: 'epic', themeValue: 'ice' as Theme },
      { id: 'christmas_santa', name: 'Santa\'s Workshop', description: 'North Pole magic', price: 500, tier: 'legendary', themeValue: 'santa' as Theme },
    ],
    challenges: [
      { id: 'xmas_1', title: 'Warm Up', description: 'Reach 64 on a 4x4 board', targetTile: 64, boardSize: 4, order: 1, rewards: { seasonCredits: 25, coins: 50, gems: 5 }, completed: false, claimed: false },
      { id: 'xmas_2', title: 'Cozy Fire', description: 'Reach 128 on a 4x4 board', targetTile: 128, boardSize: 4, order: 2, rewards: { seasonCredits: 50, gems: 10 }, completed: false, claimed: false },
      { id: 'xmas_3', title: 'Snow Flurry', description: 'Reach 64 on a 3x3 board', targetTile: 64, boardSize: 3, order: 3, rewards: { seasonCredits: 75, coins: 100, gems: 15 }, completed: false, claimed: false },
      { id: 'xmas_4', title: 'Ice Storm', description: 'Reach 128 on a 3x3 board', targetTile: 128, boardSize: 3, order: 4, rewards: { seasonCredits: 100, themeId: 'christmas_snow', gems: 20 }, completed: false, claimed: false },
      { id: 'xmas_5', title: 'Blizzard', description: 'Reach 256 on a 4x4 board', targetTile: 256, boardSize: 4, order: 5, rewards: { seasonCredits: 100, coins: 150, gems: 25 }, completed: false, claimed: false },
      { id: 'xmas_6', title: 'Frozen Lake', description: 'Reach 256 on a 3x3 board', targetTile: 256, boardSize: 3, order: 6, rewards: { seasonCredits: 150, gems: 30 }, completed: false, claimed: false },
      { id: 'xmas_7', title: 'North Star', description: 'Reach 512 on a 4x4 board', targetTile: 512, boardSize: 4, order: 7, rewards: { seasonCredits: 200, themeId: 'christmas_ice', gems: 40 }, completed: false, claimed: false },
      { id: 'xmas_8', title: 'Miracle', description: 'Reach 512 on a 3x3 board', targetTile: 512, boardSize: 3, order: 8, rewards: { seasonCredits: 300, coins: 500, gems: 50 }, completed: false, claimed: false },
      { id: 'xmas_9', title: 'Holiday Magic', description: 'Reach 1024 on a 4x4 board', targetTile: 1024, boardSize: 4, order: 9, rewards: { seasonCredits: 500, gems: 75 }, completed: false, claimed: false },
      { id: 'xmas_10', title: 'Santa\'s Gift', description: 'Reach 2048 on a 4x4 board', targetTile: 2048, boardSize: 4, order: 10, rewards: { themeId: 'christmas_santa', coins: 1000, gems: 100 }, completed: false, claimed: false },
    ],
  },
  {
    id: 'valentines_2026',
    name: 'Love Season',
    emoji: '💕',
    startDate: '2026-02-07',
    endDate: '2026-02-21',
    description: 'Share the love with romantic themes and heartfelt challenges!',
    gradientFrom: '#ff6b6b',
    gradientTo: '#ee5a5a',
    baseThemeId: 'valentines_base',
    starterCredits: 50,
    themes: [
      { id: 'valentines_base', name: 'Sweet Heart', description: 'Soft pink love', price: 0, tier: 'base', themeValue: 'hearts' as Theme },
      { id: 'valentines_rose', name: 'Rose Garden', description: 'Romantic roses', price: 100, tier: 'rare', themeValue: 'rose' as Theme },
      { id: 'valentines_cupid', name: 'Cupid\'s Arrow', description: 'Love strikes', price: 250, tier: 'epic', themeValue: 'cupid' as Theme },
      { id: 'valentines_eternal', name: 'Eternal Love', description: 'Everlasting passion', price: 500, tier: 'legendary', themeValue: 'eternal' as Theme },
    ],
    challenges: [
      { id: 'val_1', title: 'First Crush', description: 'Reach 64 on a 4x4 board', targetTile: 64, boardSize: 4, order: 1, rewards: { seasonCredits: 25, coins: 50, gems: 5 }, completed: false, claimed: false },
      { id: 'val_2', title: 'Sweet Kiss', description: 'Reach 128 on a 4x4 board', targetTile: 128, boardSize: 4, order: 2, rewards: { seasonCredits: 50, gems: 10 }, completed: false, claimed: false },
      { id: 'val_3', title: 'Love Letter', description: 'Reach 64 on a 3x3 board', targetTile: 64, boardSize: 3, order: 3, rewards: { seasonCredits: 75, coins: 100, gems: 15 }, completed: false, claimed: false },
      { id: 'val_4', title: 'Heartbeat', description: 'Reach 128 on a 3x3 board', targetTile: 128, boardSize: 3, order: 4, rewards: { seasonCredits: 100, themeId: 'valentines_rose', gems: 20 }, completed: false, claimed: false },
      { id: 'val_5', title: 'Roses', description: 'Reach 256 on a 4x4 board', targetTile: 256, boardSize: 4, order: 5, rewards: { seasonCredits: 100, coins: 150, gems: 25 }, completed: false, claimed: false },
      { id: 'val_6', title: 'Chocolate', description: 'Reach 256 on a 3x3 board', targetTile: 256, boardSize: 3, order: 6, rewards: { seasonCredits: 150, gems: 30 }, completed: false, claimed: false },
      { id: 'val_7', title: 'Cupid', description: 'Reach 512 on a 4x4 board', targetTile: 512, boardSize: 4, order: 7, rewards: { seasonCredits: 200, themeId: 'valentines_cupid', gems: 40 }, completed: false, claimed: false },
      { id: 'val_8', title: 'Proposal', description: 'Reach 512 on a 3x3 board', targetTile: 512, boardSize: 3, order: 8, rewards: { seasonCredits: 300, coins: 500, gems: 50 }, completed: false, claimed: false },
      { id: 'val_9', title: 'Wedding', description: 'Reach 1024 on a 4x4 board', targetTile: 1024, boardSize: 4, order: 9, rewards: { seasonCredits: 500, gems: 75 }, completed: false, claimed: false },
      { id: 'val_10', title: 'Forever', description: 'Reach 2048 on a 4x4 board', targetTile: 2048, boardSize: 4, order: 10, rewards: { themeId: 'valentines_eternal', coins: 1000, gems: 100 }, completed: false, claimed: false },
    ],
  },
  {
    id: 'easter_2026',
    name: 'Spring Bloom',
    emoji: '🐣',
    startDate: '2026-03-29',
    endDate: '2026-04-12',
    description: 'Hunt for eggs and unlock spring-themed rewards!',
    gradientFrom: '#98d8aa',
    gradientTo: '#f7dc6f',
    baseThemeId: 'easter_base',
    starterCredits: 50,
    themes: [
      { id: 'easter_base', name: 'Easter Eggs', description: 'Colorful spring eggs', price: 0, tier: 'base', themeValue: 'easter' as Theme },
      { id: 'easter_bunny', name: 'Bunny Hop', description: 'Fluffy bunny fun', price: 100, tier: 'rare', themeValue: 'bunny' as Theme },
      { id: 'easter_bloom', name: 'Spring Bloom', description: 'Flowers everywhere', price: 250, tier: 'epic', themeValue: 'bloom' as Theme },
      { id: 'easter_golden', name: 'Golden Egg', description: 'The legendary prize', price: 500, tier: 'legendary', themeValue: 'golden' as Theme },
    ],
    challenges: [
      { id: 'easter_1', title: 'Egg Hunt', description: 'Reach 64 on a 4x4 board', targetTile: 64, boardSize: 4, order: 1, rewards: { seasonCredits: 25, coins: 50, gems: 5 }, completed: false, claimed: false },
      { id: 'easter_2', title: 'Basket', description: 'Reach 128 on a 4x4 board', targetTile: 128, boardSize: 4, order: 2, rewards: { seasonCredits: 50, gems: 10 }, completed: false, claimed: false },
      { id: 'easter_3', title: 'Bunny Trail', description: 'Reach 64 on a 3x3 board', targetTile: 64, boardSize: 3, order: 3, rewards: { seasonCredits: 75, coins: 100, gems: 15 }, completed: false, claimed: false },
      { id: 'easter_4', title: 'Chocolate Egg', description: 'Reach 128 on a 3x3 board', targetTile: 128, boardSize: 3, order: 4, rewards: { seasonCredits: 100, themeId: 'easter_bunny', gems: 20 }, completed: false, claimed: false },
      { id: 'easter_5', title: 'Spring Rain', description: 'Reach 256 on a 4x4 board', targetTile: 256, boardSize: 4, order: 5, rewards: { seasonCredits: 100, coins: 150, gems: 25 }, completed: false, claimed: false },
      { id: 'easter_6', title: 'Flower Field', description: 'Reach 256 on a 3x3 board', targetTile: 256, boardSize: 3, order: 6, rewards: { seasonCredits: 150, gems: 30 }, completed: false, claimed: false },
      { id: 'easter_7', title: 'Bloom', description: 'Reach 512 on a 4x4 board', targetTile: 512, boardSize: 4, order: 7, rewards: { seasonCredits: 200, themeId: 'easter_bloom', gems: 40 }, completed: false, claimed: false },
      { id: 'easter_8', title: 'Rainbow', description: 'Reach 512 on a 3x3 board', targetTile: 512, boardSize: 3, order: 8, rewards: { seasonCredits: 300, coins: 500, gems: 50 }, completed: false, claimed: false },
      { id: 'easter_9', title: 'Miracle', description: 'Reach 1024 on a 4x4 board', targetTile: 1024, boardSize: 4, order: 9, rewards: { seasonCredits: 500, gems: 75 }, completed: false, claimed: false },
      { id: 'easter_10', title: 'Golden Egg', description: 'Reach 2048 on a 4x4 board', targetTile: 2048, boardSize: 4, order: 10, rewards: { themeId: 'easter_golden', coins: 1000, gems: 100 }, completed: false, claimed: false },
    ],
  },
  {
    id: 'halloween_2026',
    name: 'Spooky Season',
    emoji: '🎃',
    startDate: '2026-10-20',
    endDate: '2026-11-03',
    description: 'Face your fears in spooky tile-matching terror!',
    gradientFrom: '#2d1b4e',
    gradientTo: '#ff6b35',
    baseThemeId: 'halloween_base',
    starterCredits: 50,
    themes: [
      { id: 'halloween_base', name: 'Pumpkin Patch', description: 'Classic Halloween', price: 0, tier: 'base', themeValue: 'pumpkin' as Theme },
      { id: 'halloween_ghost', name: 'Ghostly Glow', description: 'Eerie spirits', price: 100, tier: 'rare', themeValue: 'ghost' as Theme },
      { id: 'halloween_witch', name: 'Witch\'s Brew', description: 'Magical potions', price: 250, tier: 'epic', themeValue: 'witch' as Theme },
      { id: 'halloween_nightmare', name: 'Nightmare', description: 'True terror', price: 500, tier: 'legendary', themeValue: 'nightmare' as Theme },
    ],
    challenges: [
      { id: 'hw_1', title: 'Trick', description: 'Reach 64 on a 4x4 board', targetTile: 64, boardSize: 4, order: 1, rewards: { seasonCredits: 25, coins: 50, gems: 5 }, completed: false, claimed: false },
      { id: 'hw_2', title: 'Treat', description: 'Reach 128 on a 4x4 board', targetTile: 128, boardSize: 4, order: 2, rewards: { seasonCredits: 50, gems: 10 }, completed: false, claimed: false },
      { id: 'hw_3', title: 'Haunted', description: 'Reach 64 on a 3x3 board', targetTile: 64, boardSize: 3, order: 3, rewards: { seasonCredits: 75, coins: 100, gems: 15 }, completed: false, claimed: false },
      { id: 'hw_4', title: 'Ghost', description: 'Reach 128 on a 3x3 board', targetTile: 128, boardSize: 3, order: 4, rewards: { seasonCredits: 100, themeId: 'halloween_ghost', gems: 20 }, completed: false, claimed: false },
      { id: 'hw_5', title: 'Skeleton', description: 'Reach 256 on a 4x4 board', targetTile: 256, boardSize: 4, order: 5, rewards: { seasonCredits: 100, coins: 150, gems: 25 }, completed: false, claimed: false },
      { id: 'hw_6', title: 'Vampire', description: 'Reach 256 on a 3x3 board', targetTile: 256, boardSize: 3, order: 6, rewards: { seasonCredits: 150, gems: 30 }, completed: false, claimed: false },
      { id: 'hw_7', title: 'Witch', description: 'Reach 512 on a 4x4 board', targetTile: 512, boardSize: 4, order: 7, rewards: { seasonCredits: 200, themeId: 'halloween_witch', gems: 40 }, completed: false, claimed: false },
      { id: 'hw_8', title: 'Werewolf', description: 'Reach 512 on a 3x3 board', targetTile: 512, boardSize: 3, order: 8, rewards: { seasonCredits: 300, coins: 500, gems: 50 }, completed: false, claimed: false },
      { id: 'hw_9', title: 'Demon', description: 'Reach 1024 on a 4x4 board', targetTile: 1024, boardSize: 4, order: 9, rewards: { seasonCredits: 500, gems: 75 }, completed: false, claimed: false },
      { id: 'hw_10', title: 'Nightmare', description: 'Reach 2048 on a 4x4 board', targetTile: 2048, boardSize: 4, order: 10, rewards: { themeId: 'halloween_nightmare', coins: 1000, gems: 100 }, completed: false, claimed: false },
    ],
  },
  {
    id: 'hanukkah_2026',
    name: 'Festival of Lights',
    emoji: '🕎',
    startDate: '2026-12-05',
    endDate: '2026-12-20',
    description: 'Light the menorah and celebrate 8 nights of gaming!',
    gradientFrom: '#1a4b8c',
    gradientTo: '#ffd700',
    baseThemeId: 'hanukkah_base',
    starterCredits: 50,
    themes: [
      { id: 'hanukkah_base', name: 'Menorah Light', description: 'Golden candlelight', price: 0, tier: 'base', themeValue: 'menorah' as Theme },
      { id: 'hanukkah_dreidel', name: 'Dreidel Spin', description: 'Spinning fortune', price: 100, tier: 'rare', themeValue: 'dreidel' as Theme },
      { id: 'hanukkah_gelt', name: 'Gelt Glory', description: 'Chocolate coins', price: 250, tier: 'epic', themeValue: 'gelt' as Theme },
      { id: 'hanukkah_miracle', name: 'Miracle Light', description: 'Divine radiance', price: 500, tier: 'legendary', themeValue: 'miracle' as Theme },
    ],
    challenges: [
      { id: 'han_1', title: 'First Light', description: 'Reach 64 on a 4x4 board', targetTile: 64, boardSize: 4, order: 1, rewards: { seasonCredits: 25, coins: 50, gems: 5 }, completed: false, claimed: false },
      { id: 'han_2', title: 'Second Night', description: 'Reach 128 on a 4x4 board', targetTile: 128, boardSize: 4, order: 2, rewards: { seasonCredits: 50, gems: 10 }, completed: false, claimed: false },
      { id: 'han_3', title: 'Third Flame', description: 'Reach 64 on a 3x3 board', targetTile: 64, boardSize: 3, order: 3, rewards: { seasonCredits: 75, coins: 100, gems: 15 }, completed: false, claimed: false },
      { id: 'han_4', title: 'Fourth Glow', description: 'Reach 128 on a 3x3 board', targetTile: 128, boardSize: 3, order: 4, rewards: { seasonCredits: 100, themeId: 'hanukkah_dreidel', gems: 20 }, completed: false, claimed: false },
      { id: 'han_5', title: 'Fifth Shine', description: 'Reach 256 on a 4x4 board', targetTile: 256, boardSize: 4, order: 5, rewards: { seasonCredits: 100, coins: 150, gems: 25 }, completed: false, claimed: false },
      { id: 'han_6', title: 'Sixth Star', description: 'Reach 256 on a 3x3 board', targetTile: 256, boardSize: 3, order: 6, rewards: { seasonCredits: 150, gems: 30 }, completed: false, claimed: false },
      { id: 'han_7', title: 'Seventh Wonder', description: 'Reach 512 on a 4x4 board', targetTile: 512, boardSize: 4, order: 7, rewards: { seasonCredits: 200, themeId: 'hanukkah_gelt', gems: 40 }, completed: false, claimed: false },
      { id: 'han_8', title: 'Eighth Miracle', description: 'Reach 2048 on a 4x4 board', targetTile: 2048, boardSize: 4, order: 8, rewards: { themeId: 'hanukkah_miracle', coins: 1000, gems: 100 }, completed: false, claimed: false },
    ],
  },
];

const SEASON_STORAGE_KEY = '2048-seasons';

export const useSeasons = () => {
  const [seasonProgress, setSeasonProgress] = useState<SeasonProgress[]>(() => {
    const saved = localStorage.getItem(SEASON_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(SEASON_STORAGE_KEY, JSON.stringify(seasonProgress));
  }, [seasonProgress]);

  // Get currently active seasons (can be multiple overlapping!)
  const getActiveSeasons = useCallback((): Season[] => {
    const now = new Date();
    return ALL_SEASONS.filter(season => {
      const start = new Date(season.startDate);
      const end = new Date(season.endDate);
      end.setHours(23, 59, 59, 999);
      return now >= start && now <= end;
    }).sort((a, b) => {
      // Sort by end date (longest running first for "main" season)
      const aEnd = new Date(a.endDate).getTime();
      const bEnd = new Date(b.endDate).getTime();
      return bEnd - aEnd;
    });
  }, []);

  // Get or create progress for a season
  const getSeasonProgress = useCallback((seasonId: string): SeasonProgress => {
    const existing = seasonProgress.find(p => p.seasonId === seasonId);
    if (existing) return existing;
    
    return {
      seasonId,
      seasonCredits: 0,
      unlockedThemes: [],
      completedChallenges: [],
      claimedChallenges: [],
      lastChallengeDate: null,
      welcomeShown: false,
    };
  }, [seasonProgress]);

  // Initialize season with welcome bonus
  const initializeSeason = useCallback((seasonId: string) => {
    setSeasonProgress(prev => {
      const existing = prev.find(p => p.seasonId === seasonId);
      if (existing?.welcomeShown) return prev;

      const season = ALL_SEASONS.find(s => s.id === seasonId);
      if (!season) return prev;

      const newProgress: SeasonProgress = {
        seasonId,
        seasonCredits: season.starterCredits,
        unlockedThemes: [season.baseThemeId],
        completedChallenges: [],
        claimedChallenges: [],
        lastChallengeDate: null,
        welcomeShown: true,
      };

      return [...prev.filter(p => p.seasonId !== seasonId), newProgress];
    });
  }, []);

  // Check if can play challenge today
  const canPlayChallengeToday = useCallback((seasonId: string): boolean => {
    const progress = getSeasonProgress(seasonId);
    if (!progress.lastChallengeDate) return true;
    
    const lastDate = new Date(progress.lastChallengeDate);
    const today = new Date();
    return lastDate.toDateString() !== today.toDateString();
  }, [getSeasonProgress]);

  // Complete a challenge
  const completeChallenge = useCallback((seasonId: string, challengeId: string) => {
    setSeasonProgress(prev => {
      const existing = prev.find(p => p.seasonId === seasonId);
      if (!existing) return prev;

      if (existing.completedChallenges.includes(challengeId)) return prev;

      return prev.map(p => 
        p.seasonId === seasonId
          ? {
              ...p,
              completedChallenges: [...p.completedChallenges, challengeId],
              lastChallengeDate: new Date().toISOString(),
            }
          : p
      );
    });
  }, []);

  // Claim challenge rewards
  const claimChallengeReward = useCallback((seasonId: string, challengeId: string): { coins: number; seasonCredits: number; gems: number; themeId?: string } | null => {
    const progress = getSeasonProgress(seasonId);
    const season = ALL_SEASONS.find(s => s.id === seasonId);
    const challenge = season?.challenges.find(c => c.id === challengeId);

    if (!challenge || !progress.completedChallenges.includes(challengeId) || progress.claimedChallenges.includes(challengeId)) {
      return null;
    }

    setSeasonProgress(prev => 
      prev.map(p => 
        p.seasonId === seasonId
          ? {
              ...p,
              seasonCredits: p.seasonCredits + (challenge.rewards.seasonCredits || 0),
              claimedChallenges: [...p.claimedChallenges, challengeId],
              unlockedThemes: challenge.rewards.themeId 
                ? [...p.unlockedThemes, challenge.rewards.themeId]
                : p.unlockedThemes,
            }
          : p
      )
    );

    return {
      coins: challenge.rewards.coins || 0,
      seasonCredits: challenge.rewards.seasonCredits || 0,
      gems: challenge.rewards.gems || 0,
      themeId: challenge.rewards.themeId,
    };
  }, [getSeasonProgress]);

  // Purchase seasonal theme
  const purchaseSeasonTheme = useCallback((seasonId: string, themeId: string): boolean => {
    const progress = getSeasonProgress(seasonId);
    const season = ALL_SEASONS.find(s => s.id === seasonId);
    const theme = season?.themes.find(t => t.id === themeId);

    if (!theme || progress.unlockedThemes.includes(themeId) || progress.seasonCredits < theme.price) {
      return false;
    }

    setSeasonProgress(prev => 
      prev.map(p => 
        p.seasonId === seasonId
          ? {
              ...p,
              seasonCredits: p.seasonCredits - theme.price,
              unlockedThemes: [...p.unlockedThemes, themeId],
            }
          : p
      )
    );

    return true;
  }, [getSeasonProgress]);

  // Get next available challenge
  const getNextChallenge = useCallback((seasonId: string): SeasonalChallenge | null => {
    const progress = getSeasonProgress(seasonId);
    const season = ALL_SEASONS.find(s => s.id === seasonId);
    if (!season) return null;

    const sortedChallenges = [...season.challenges].sort((a, b) => a.order - b.order);
    
    for (const challenge of sortedChallenges) {
      if (!progress.completedChallenges.includes(challenge.id)) {
        return challenge;
      }
    }
    return null;
  }, [getSeasonProgress]);

  return {
    activeSeasons: getActiveSeasons(),
    allSeasons: ALL_SEASONS,
    seasonProgress,
    getSeasonProgress,
    initializeSeason,
    canPlayChallengeToday,
    completeChallenge,
    claimChallengeReward,
    purchaseSeasonTheme,
    getNextChallenge,
  };
};
