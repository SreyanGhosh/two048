import { ArrowLeft, Star, Check, Lock, Sparkles } from 'lucide-react';
import { Season, SeasonProgress } from '@/hooks/useSeasons';
import { getThemePerk } from '@/hooks/useThemePerks';
import { Theme } from '@/hooks/useGame2048';

interface SeasonShopProps {
  season: Season;
  progress: SeasonProgress;
  onBack: () => void;
  onPurchase: (seasonId: string, themeId: string) => boolean;
}

const getTierStyles = (tier: 'base' | 'rare' | 'epic' | 'legendary') => {
  switch (tier) {
    case 'base': return { 
      gradient: 'from-gray-400 to-gray-600', 
      border: 'border-gray-400',
      bg: 'bg-gray-500/20',
      label: 'Base'
    };
    case 'rare': return { 
      gradient: 'from-blue-400 to-blue-600', 
      border: 'border-blue-400',
      bg: 'bg-blue-500/20',
      label: 'Rare'
    };
    case 'epic': return { 
      gradient: 'from-purple-400 to-purple-600', 
      border: 'border-purple-400',
      bg: 'bg-purple-500/20',
      label: 'Epic'
    };
    case 'legendary': return { 
      gradient: 'from-yellow-400 to-orange-500', 
      border: 'border-yellow-400',
      bg: 'bg-yellow-500/20',
      label: 'Legendary'
    };
  }
};

export const SeasonShop = ({ season, progress, onBack, onPurchase }: SeasonShopProps) => {
  const handlePurchase = (themeId: string) => {
    onPurchase(season.id, themeId);
  };

  return (
    <div 
      className="min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${season.gradientFrom}, ${season.gradientTo})`
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-black/30 border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <span className="text-2xl">{season.emoji}</span>
            Season Shop
          </h1>
          <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-yellow-300 font-bold">{progress.seasonCredits}</span>
          </div>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="p-4 pb-8">
        <div className="space-y-4">
          {season.themes.map(theme => {
            const isOwned = progress.unlockedThemes.includes(theme.id);
            const canAfford = progress.seasonCredits >= theme.price;
            const styles = getTierStyles(theme.tier);
            const perk = getThemePerk(theme.themeValue as Theme);

            return (
              <div
                key={theme.id}
                className={`rounded-2xl border-2 overflow-hidden transition-all ${
                  isOwned 
                    ? 'border-green-400' 
                    : canAfford 
                    ? styles.border 
                    : 'border-white/20 opacity-60'
                }`}
              >
                {/* Theme Header */}
                <div className={`bg-gradient-to-r ${styles.gradient} p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${styles.bg} text-white`}>
                        {styles.label}
                      </div>
                      <h3 className="text-xl font-black text-white">{theme.name}</h3>
                      <p className="text-white/80 text-sm">{theme.description}</p>
                    </div>
                    {isOwned && (
                      <div className="bg-green-500 p-2 rounded-full">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Theme Details */}
                <div className="bg-black/30 p-4">
                  {/* Perk Display */}
                  {perk && (
                    <div className="bg-white/10 rounded-lg p-3 mb-3 flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-yellow-300 font-bold text-sm">{perk.name}</div>
                        <div className="text-white/70 text-xs">{perk.description}</div>
                      </div>
                    </div>
                  )}

                  {/* Price/Action */}
                  {isOwned ? (
                    <div className="text-green-400 font-bold text-center py-2">
                      ✓ Owned
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(theme.id)}
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        canAfford
                          ? 'bg-white text-gray-900 hover:scale-[1.02]'
                          : 'bg-white/20 text-white/50 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <Star className="w-5 h-5" />
                          {theme.price} Credits
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Need {theme.price - progress.seasonCredits} more
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
