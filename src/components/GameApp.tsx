import { useState, useCallback, useEffect } from 'react';
import { Theme } from '@/hooks/useGame2048';
import { useGameStore } from '@/hooks/useGameStore';
import { useSeasons, Season, SeasonalChallenge } from '@/hooks/useSeasons';
import { HomeScreen } from './HomeScreen';
import { ClassicGame } from './ClassicGame';
import { CompetitiveGame } from './CompetitiveGame';
import { ChallengesScreen } from './ChallengesScreen';
import { ShopScreen } from './ShopScreen';
import { SeasonsScreen } from './SeasonsScreen';
import { SeasonShop } from './SeasonShop';
import { SeasonWelcomePopup } from './SeasonWelcomePopup';
import { SeasonalChallengeGame } from './SeasonalChallengeGame';
import { toast } from 'sonner';

type Screen = 'home' | 'classic' | 'competitive' | 'challenges' | 'shop' | 'seasons' | 'season-shop' | 'season-challenge';

export const GameApp = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('classic');
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<SeasonalChallenge | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState<Season | null>(null);

  const store = useGameStore();
  const seasons = useSeasons();

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
      toast.success(`Welcome to ${showWelcomePopup.name}!`, {
        description: `You received ${showWelcomePopup.starterCredits} season credits and the ${showWelcomePopup.themes[0]?.name} theme!`,
        icon: showWelcomePopup.emoji,
      });
      setShowWelcomePopup(null);
    }
  }, [showWelcomePopup, seasons]);

  const handleGameEnd = useCallback((score: number, highestTile: number, isCompetitive: boolean) => {
    store.updateProgress(score, highestTile, isCompetitive);
  }, [store]);

  const handleClaimReward = useCallback((id: string, isDaily: boolean = false) => {
    const reward = store.claimReward(id, isDaily);
    if (reward > 0) {
      toast.success(`+${reward} coins earned!`, {
        icon: '🪙',
      });
    }
  }, [store]);

  const handlePurchase = useCallback((id: string) => {
    const success = store.purchaseItem(id);
    if (success) {
      toast.success('Item purchased!', {
        icon: '🎉',
      });
    } else {
      toast.error('Not enough coins!');
    }
    return success;
  }, [store]);

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
      if (rewards.coins > 0) {
        store.addCoins(rewards.coins);
      }
      const messages = [];
      if (rewards.seasonCredits > 0) messages.push(`+${rewards.seasonCredits} season credits`);
      if (rewards.coins > 0) messages.push(`+${rewards.coins} coins`);
      if (rewards.themeId) messages.push('New theme unlocked!');
      
      toast.success('Rewards claimed!', {
        description: messages.join(' • '),
        icon: '🎁',
      });
    }
  }, [seasons, store]);

  const handleSeasonPurchase = useCallback((seasonId: string, themeId: string) => {
    const success = seasons.purchaseSeasonTheme(seasonId, themeId);
    if (success) {
      toast.success('Theme purchased!', {
        icon: '🎨',
      });
    } else {
      toast.error('Not enough season credits!');
    }
    return success;
  }, [seasons]);

  const handleOpenSeasonShop = useCallback((season: Season) => {
    setSelectedSeason(season);
    setCurrentScreen('season-shop');
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            coins={store.coins}
            hasActiveSeasons={seasons.activeSeasons.length > 0}
            onPlayClassic={() => setCurrentScreen('classic')}
            onPlayCompetitive={() => setCurrentScreen('competitive')}
            onOpenChallenges={() => setCurrentScreen('challenges')}
            onOpenShop={() => setCurrentScreen('shop')}
            onOpenSeasons={() => setCurrentScreen('seasons')}
          />
        );
      case 'classic':
        return (
          <ClassicGame
            initialTheme={selectedTheme}
            unlockedThemes={store.unlockedThemes}
            onBack={() => setCurrentScreen('home')}
            onGameEnd={(score, tile) => handleGameEnd(score, tile, false)}
          />
        );
      case 'competitive':
        return (
          <CompetitiveGame
            theme={selectedTheme}
            unlockedThemes={store.unlockedThemes}
            onBack={() => setCurrentScreen('home')}
            onGameEnd={(score, tile) => handleGameEnd(score, tile, true)}
            bestScore={store.bestCompetitiveScore}
          />
        );
      case 'challenges':
        return (
          <ChallengesScreen
            challenges={store.challenges}
            dailyChallenges={store.dailyChallenges}
            onClaimReward={handleClaimReward}
            onBack={() => setCurrentScreen('home')}
            onResetProgress={store.resetProgress}
          />
        );
      case 'shop':
        return (
          <ShopScreen
            coins={store.coins}
            items={store.shopItems}
            onPurchase={handlePurchase}
            onBack={() => setCurrentScreen('home')}
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
      
      {/* Season Welcome Popup */}
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
