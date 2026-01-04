import { useState, useCallback } from 'react';
import { Theme } from '@/hooks/useGame2048';
import { useGameStore } from '@/hooks/useGameStore';
import { HomeScreen } from './HomeScreen';
import { ClassicGame } from './ClassicGame';
import { CompetitiveGame } from './CompetitiveGame';
import { ChallengesScreen } from './ChallengesScreen';
import { ShopScreen } from './ShopScreen';
import { toast } from 'sonner';

type Screen = 'home' | 'classic' | 'competitive' | 'challenges' | 'shop';

export const GameApp = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('classic');

  const store = useGameStore();

  const handleGameEnd = useCallback((score: number, highestTile: number, isCompetitive: boolean) => {
    store.updateProgress(score, highestTile, isCompetitive);
  }, [store]);

  const handleClaimReward = useCallback((id: string) => {
    const reward = store.claimReward(id);
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

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            coins={store.coins}
            onPlayClassic={() => setCurrentScreen('classic')}
            onPlayCompetitive={() => setCurrentScreen('competitive')}
            onOpenChallenges={() => setCurrentScreen('challenges')}
            onOpenShop={() => setCurrentScreen('shop')}
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
            onClaimReward={handleClaimReward}
            onBack={() => setCurrentScreen('home')}
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
    }
  };

  return <>{renderScreen()}</>;
};
