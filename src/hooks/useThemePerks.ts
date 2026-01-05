import { Theme } from './useGame2048';

export interface ThemePerk {
  id: string;
  name: string;
  description: string;
  effect: {
    type: 'spawn_chance_4' | 'spawn_chance_8' | 'bonus_score' | 'extra_undo';
    value: number; // percentage or multiplier
  };
}

// Theme perks - special advantages for certain themes
export const THEME_PERKS: Partial<Record<Theme, ThemePerk>> = {
  // Legendary perks (powerful)
  diamond: {
    id: 'diamond_perk',
    name: 'Diamond Fortune',
    description: '40% chance to spawn 4 instead of 2',
    effect: { type: 'spawn_chance_4', value: 40 },
  },
  galaxy: {
    id: 'galaxy_perk',
    name: 'Cosmic Power',
    description: '5% chance to spawn 8!',
    effect: { type: 'spawn_chance_8', value: 5 },
  },
  rainbow: {
    id: 'rainbow_perk',
    name: 'Rainbow Luck',
    description: '+10% bonus score on all merges',
    effect: { type: 'bonus_score', value: 10 },
  },
  
  // Epic perks (moderate)
  gold: {
    id: 'gold_perk',
    name: 'Golden Touch',
    description: '35% chance to spawn 4 instead of 2',
    effect: { type: 'spawn_chance_4', value: 35 },
  },
  neon: {
    id: 'neon_perk',
    name: 'Neon Surge',
    description: '+5% bonus score on all merges',
    effect: { type: 'bonus_score', value: 5 },
  },
  aurora: {
    id: 'aurora_perk',
    name: 'Northern Blessing',
    description: '30% chance to spawn 4 instead of 2',
    effect: { type: 'spawn_chance_4', value: 30 },
  },
  
  // Textured legendary perks
  marble: {
    id: 'marble_perk',
    name: 'Marble Precision',
    description: '45% chance to spawn 4 instead of 2',
    effect: { type: 'spawn_chance_4', value: 45 },
  },
  carbon: {
    id: 'carbon_perk',
    name: 'Carbon Efficiency',
    description: '8% chance to spawn 8!',
    effect: { type: 'spawn_chance_8', value: 8 },
  },
  crystal: {
    id: 'crystal_perk',
    name: 'Crystal Clarity',
    description: '+15% bonus score on all merges',
    effect: { type: 'bonus_score', value: 15 },
  },
  
  // Seasonal legendary perks
  santa: {
    id: 'santa_perk',
    name: "Santa's Gift",
    description: '50% chance to spawn 4 instead of 2',
    effect: { type: 'spawn_chance_4', value: 50 },
  },
  eternal: {
    id: 'eternal_perk',
    name: 'Eternal Bond',
    description: '10% chance to spawn 8!',
    effect: { type: 'spawn_chance_8', value: 10 },
  },
  golden: {
    id: 'golden_perk',
    name: 'Golden Miracle',
    description: '+20% bonus score on all merges',
    effect: { type: 'bonus_score', value: 20 },
  },
  nightmare: {
    id: 'nightmare_perk',
    name: 'Dark Power',
    description: '12% chance to spawn 8!',
    effect: { type: 'spawn_chance_8', value: 12 },
  },
  miracle: {
    id: 'miracle_perk',
    name: 'Divine Light',
    description: '55% chance to spawn 4 instead of 2',
    effect: { type: 'spawn_chance_4', value: 55 },
  },
};

export const getThemePerk = (theme: Theme): ThemePerk | null => {
  return THEME_PERKS[theme] || null;
};

// Calculate spawn value based on theme perk
export const calculateSpawnValue = (theme: Theme): number => {
  const perk = THEME_PERKS[theme];
  
  if (perk?.effect.type === 'spawn_chance_8') {
    if (Math.random() * 100 < perk.effect.value) {
      return 8;
    }
  }
  
  if (perk?.effect.type === 'spawn_chance_4') {
    if (Math.random() * 100 < perk.effect.value) {
      return 4;
    }
  }
  
  // Default: 75% chance for 2, 25% chance for 4
  return Math.random() < 0.75 ? 2 : 4;
};

// Calculate bonus score based on theme perk
export const calculateBonusScore = (theme: Theme, baseScore: number): number => {
  const perk = THEME_PERKS[theme];
  
  if (perk?.effect.type === 'bonus_score') {
    return Math.floor(baseScore * (1 + perk.effect.value / 100));
  }
  
  return baseScore;
};
