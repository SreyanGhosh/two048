import { useState, useCallback, useEffect } from 'react';
import { Theme } from '@/hooks/useGame2048';
import { useGameStore } from '@/hooks/useGameStore';
import { useSeasons, Season, SeasonalChallenge } from '@/hooks/useSeasons';
import { useGems, Pack, NORMAL_PACKS, ThemeRank } from '@/hooks/useGems';
import { FCHomeScreen } from './FCHomeScreen';
import { ClassicGame } from './ClassicGame';
import { CompetitiveGame } from './CompetitiveGame';
import { QuestsScreen } from './QuestsScreen';
import { MarketScreen } from './MarketScreen';
import { StoreScreen } from './StoreScreen';
import { InventoryScreen } from './InventoryScreen';
import { SeasonsScreen } from './SeasonsScreen';
import { SeasonShop } from './SeasonShop';
import { SeasonWelcomePopup } from './SeasonWelcomePopup';
import { SeasonalChallengeGame } from './SeasonalChallengeGame';
import { getThemeName } from '@/hooks/useThemeData';
import { toast } from 'sonner';

type Screen = 'home' | 'classic' | 'competitive' | 'quests' | 'market' | 'store' | 'inventory' | 'seasons' | 'season-shop' | 'season-challenge';

export const GameApp = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<SeasonalChallenge | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState<Season | null>(null);

  const store = useGameStore();
  const seasons = useSeasons();
  const gems = useGems();

  // Check for new season welcome popup
  useEffect(() => {
    for (const season of seasons.activeSeasons) {
      const progress = seasons.getSeasonProgress(season.id);
      if (!progress.welcomeShown) {
        setShowWelcomePopup(season);
        break;
      }
    }
  }, [seasons.activeSeasons]);

  const handleAcceptWelcome = useCallback(() => {
    if (showWelcomePopup) {
      seasons.initializeSeason(showWelcomePopup.id);
      // Also add the base theme to gems inventory
      const baseTheme = showWelcomePopup.themes[0];
      if (baseTheme) {
        gems.addTheme(baseTheme.themeValue, 'base');
      }
      toast.success(`Welcome to ${showWelcomePopup.name}!`, {
        description: `You received ${showWelcomePopup.starterCredits} season credits and the ${showWelcomePopup.themes[0]?.name} theme!`,
        icon: showWelcomePopup.emoji,
      });
      setShowWelcomePopup(null);
    }
  }, [showWelcomePopup, seasons, gems]);

  const handleGameEnd = useCallback((score: number, highestTile: number, isCompetitive: boolean) => {
    store.updateProgress(score, highestTile, isCompetitive);
    // Award gems based on score
    const gemsEarned = Math.floor(score / 500);
    if (gemsEarned > 0) {
      gems.addGems(gemsEarned);
      toast.success(`+${gemsEarned} gems earned!`, { icon: '💎' });
    }
  }, [store, gems]);

  const handleClaimReward = useCallback((id: string, isDaily: boolean = false) => {
    const reward = store.claimReward(id, isDaily);
    if (reward > 0) {
      toast.success(`+${reward} coins earned!`, { icon: '🪙' });
      // Also give some gems
      const gemsReward = Math.floor(reward / 10);
      if (gemsReward > 0) {
        gems.addGems(gemsReward);
      }
    }
  }, [store, gems]);

  const handlePurchase = useCallback((id: string, rank?: ThemeRank) => {
    const item = store.shopItems.find(i => i.id === id);
    if (!item) return false;
    
    const multiplier = rank === 'green' ? 2.5 : rank === 'blue' ? 6 : 1;
    const price = Math.floor(item.price * multiplier);
    
    if (store.coins < price) {
      toast.error('Not enough coins!');
      return false;
    }
    
    store.spendCoins(price);
    gems.addTheme(item.value as Theme, rank || 'base');
    toast.success('Theme purchased!', { icon: '🎉' });
    return true;
  }, [store, gems]);

  const handleOpenPack = useCallback((pack: Pack): Theme[] => {
    if (!gems.spendGems(pack.price)) {
      toast.error('Not enough gems!');
      return [];
    }

    // Generate random themes from pack
    const themes: Theme[] = [];
    const numThemes = pack.id.includes('legendary') ? 5 : pack.id.includes('epic') ? 4 : 3;
    
    for (let i = 0; i < numThemes; i++) {
      const totalWeight = pack.possibleThemes.reduce((sum, t) => sum + t.weight, 0);
      let random = Math.random() * totalWeight;
      
      for (const themeOption of pack.possibleThemes) {
        random -= themeOption.weight;
        if (random <= 0) {
          themes.push(themeOption.theme);
          gems.addTheme(themeOption.theme, 'base');
          break;
        }
      }
    }

    return themes;
  }, [gems]);

  const handlePlayChallenge = useCallback((season: Season, challenge: SeasonalChallenge) => {
    if (!seasons.canPlayChallengeToday(season.id)) {
      toast.error('Daily challenge limit reached!', {
        description: 'Come back tomorrow for more challenges.',
      });
      return;
    }
    setSelectedSeason(season);
    setSelectedChallenge(challenge);
    setCurrentScreen('season-challenge');
  }, [seasons]);

  const handleCompleteChallenge = useCallback((seasonId: string, challengeId: string) => {
    seasons.completeChallenge(seasonId, challengeId);
  }, [seasons]);

  const handleClaimSeasonReward = useCallback((seasonId: string, challengeId: string) => {
    const rewards = seasons.claimChallengeReward(seasonId, challengeId);
    if (rewards) {
      if (rewards.coins > 0) store.addCoins(rewards.coins);
      if (rewards.seasonCredits > 0) gems.addGems(Math.floor(rewards.seasonCredits / 5));
      if (rewards.themeId) {
        const season = seasons.allSeasons.find(s => s.id === seasonId);
        const theme = season?.themes.find(t => t.id === rewards.themeId);
        if (theme) gems.addTheme(theme.themeValue, 'base');
      }
      toast.success('Rewards claimed!', { icon: '🎁' });
    }
  }, [seasons, store, gems]);

  const handleSeasonPurchase = useCallback((seasonId: string, themeId: string) => {
    const success = seasons.purchaseSeasonTheme(seasonId, themeId);
    if (success) {
      const season = seasons.allSeasons.find(s => s.id === seasonId);
      const theme = season?.themes.find(t => t.id === themeId);
      if (theme) gems.addTheme(theme.themeValue, 'base');
      toast.success('Theme purchased!', { icon: '🎨' });
    } else {
      toast.error('Not enough season credits!');
    }
    return success;
  }, [seasons, gems]);

  const handleOpenSeasonShop = useCallback((season: Season) => {
    setSelectedSeason(season);
    setCurrentScreen('season-shop');
  }, []);

  // Get seasonal packs for store
  const seasonalPacks: Pack[] = seasons.activeSeasons.map(season => ({
    id: `${season.id}_pack`,
    name: `${season.name} Pack`,
    description: `3 ${season.name} themes`,
    price: 150,
    type: 'seasonal' as const,
    seasonId: season.id,
    possibleThemes: season.themes.map(t => ({ theme: t.themeValue, weight: t.tier === 'legendary' ? 5 : t.tier === 'epic' ? 10 : 20 })),
  }));

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <FCHomeScreen
            coins={store.coins}
            gems={gems.gems}
            hasActiveSeasons={seasons.activeSeasons.length > 0}
            activeSeason={seasons.activeSeasons[0]}
            equippedThemeName={getThemeName(gems.equippedTheme)}
            onPlayClassic={() => setCurrentScreen('classic')}
            onPlayCompetitive={() => setCurrentScreen('competitive')}
            onOpenQuests={() => setCurrentScreen('quests')}
            onOpenMarket={() => setCurrentScreen('market')}
            onOpenStore={() => setCurrentScreen('store')}
            onOpenSeasons={() => setCurrentScreen('seasons')}
            onOpenInventory={() => setCurrentScreen('inventory')}
          />
        );
      case 'classic':
        return (
          <ClassicGame
            initialTheme={gems.equippedTheme}
            unlockedThemes={gems.ownedThemes.map(t => t.themeId)}
            onBack={() => setCurrentScreen('home')}
            onGameEnd={(score, tile) => handleGameEnd(score, tile, false)}
          />
        );
      case 'competitive':
        return (
          <CompetitiveGame
            theme={gems.equippedTheme}
            unlockedThemes={gems.ownedThemes.map(t => t.themeId)}
            onBack={() => setCurrentScreen('home')}
            onGameEnd={(score, tile) => handleGameEnd(score, tile, true)}
            bestScore={store.bestCompetitiveScore}
          />
        );
      case 'quests':
        return (
          <QuestsScreen
            challenges={store.challenges}
            dailyChallenges={store.dailyChallenges}
            onClaimReward={handleClaimReward}
            onBack={() => setCurrentScreen('home')}
            onResetProgress={store.resetProgress}
          />
        );
      case 'market':
        return (
          <MarketScreen
            coins={store.coins}
            items={store.shopItems}
            onPurchase={handlePurchase}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'store':
        return (
          <StoreScreen
            gems={gems.gems}
            seasonalPacks={seasonalPacks}
            onBack={() => setCurrentScreen('home')}
            onOpenPack={handleOpenPack}
          />
        );
      case 'inventory':
        return (
          <InventoryScreen
            ownedThemes={gems.ownedThemes}
            equippedTheme={gems.equippedTheme}
            equippedRank={gems.equippedRank}
            onBack={() => setCurrentScreen('home')}
            onEquip={gems.equipTheme}
            onMerge={gems.mergeThemes}
          />
        );
      case 'seasons':
        return (
          <SeasonsScreen
            activeSeasons={seasons.activeSeasons}
            allSeasons={seasons.allSeasons}
            getSeasonProgress={seasons.getSeasonProgress}
            canPlayChallengeToday={seasons.canPlayChallengeToday}
            onBack={() => setCurrentScreen('home')}
            onPlayChallenge={handlePlayChallenge}
            onClaimReward={handleClaimSeasonReward}
            onOpenSeasonShop={handleOpenSeasonShop}
          />
        );
      case 'season-shop':
        if (!selectedSeason) {
          setCurrentScreen('seasons');
          return null;
        }
        return (
          <SeasonShop
            season={selectedSeason}
            progress={seasons.getSeasonProgress(selectedSeason.id)}
            onBack={() => setCurrentScreen('seasons')}
            onPurchase={handleSeasonPurchase}
          />
        );
      case 'season-challenge':
        if (!selectedSeason || !selectedChallenge) {
          setCurrentScreen('seasons');
          return null;
        }
        return (
          <SeasonalChallengeGame
            season={selectedSeason}
            challenge={selectedChallenge}
            onBack={() => {
              setSelectedChallenge(null);
              setCurrentScreen('seasons');
            }}
            onComplete={handleCompleteChallenge}
          />
        );
    }
  };

  return (
    <>
      {renderScreen()}
      {showWelcomePopup && (
        <SeasonWelcomePopup
          season={showWelcomePopup}
          onAccept={handleAcceptWelcome}
          onClose={() => setShowWelcomePopup(null)}
        />
      )}
    </>
  );
};
