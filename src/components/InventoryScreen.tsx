import { useState } from 'react';
import { ArrowLeft, Layers, Check, Merge, Sparkles } from 'lucide-react';
import { Theme } from '@/hooks/useGame2048';
import { OwnedTheme, ThemeRank, getRankColor, getRankName, getNextRank, getRankMultiplier } from '@/hooks/useGems';
import { getThemeName, getThemeButtonStyle } from '@/hooks/useThemeData';
import { getThemePerk } from '@/hooks/useThemePerks';

interface InventoryScreenProps {
  ownedThemes: OwnedTheme[];
  equippedTheme: Theme;
  equippedRank: ThemeRank;
  onBack: () => void;
  onEquip: (theme: Theme, rank: ThemeRank) => void;
  onMerge: (theme: Theme, rank: ThemeRank) => boolean;
}

export const InventoryScreen = ({
  ownedThemes,
  equippedTheme,
  equippedRank,
  onBack,
  onEquip,
  onMerge,
}: InventoryScreenProps) => {
  const [mergeAnimation, setMergeAnimation] = useState<string | null>(null);
  const [selectedForMerge, setSelectedForMerge] = useState<{ theme: Theme; rank: ThemeRank } | null>(null);

  // Group themes by theme ID
  const groupedThemes = ownedThemes.reduce((acc, t) => {
    if (!acc[t.themeId]) acc[t.themeId] = [];
    acc[t.themeId].push(t);
    return acc;
  }, {} as Record<Theme, OwnedTheme[]>);

  const handleMerge = (theme: Theme, rank: ThemeRank) => {
    setMergeAnimation(`${theme}-${rank}`);
    setTimeout(() => {
      const success = onMerge(theme, rank);
      if (success) {
        setMergeAnimation(null);
      } else {
        setMergeAnimation(null);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/30 backdrop-blur border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span className="text-white font-black text-lg">INVENTORY</span>
          </div>
          <div className="w-20" />
        </div>
      </div>

      {/* Current equipped */}
      <div className="p-4">
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-2">Currently Equipped</p>
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center font-black text-xl"
              style={{
                backgroundColor: getThemeButtonStyle(equippedTheme).bg,
                color: getThemeButtonStyle(equippedTheme).text,
                boxShadow: `0 0 20px ${getRankColor(equippedRank)}40`,
                border: `3px solid ${getRankColor(equippedRank)}`,
              }}
            >
              2048
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{getThemeName(equippedTheme)}</h3>
              <p style={{ color: getRankColor(equippedRank) }} className="font-bold text-sm">
                {getRankName(equippedRank)}
              </p>
              <p className="text-white/50 text-xs">
                Perk boost: {Math.round((getRankMultiplier(equippedRank) - 1) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Merge info */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-3 border border-green-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Merge className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-bold text-sm">MERGE SYSTEM</span>
          </div>
          <p className="text-white/70 text-xs">
            2 of same rank → Next rank. Ranks: Base → Green → Blue → Red → Orange (max)
          </p>
        </div>
      </div>

      {/* Themes grid */}
      <div className="px-4 pb-24">
        <h2 className="text-white font-bold mb-3">Your Themes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(groupedThemes).map(([themeId, variants]) => {
            const theme = themeId as Theme;
            const style = getThemeButtonStyle(theme);
            const perk = getThemePerk(theme);

            return variants.map((variant) => {
              const isEquipped = equippedTheme === theme && equippedRank === variant.rank;
              const canMerge = variant.count >= 2 && getNextRank(variant.rank) !== null;
              const isMerging = mergeAnimation === `${theme}-${variant.rank}`;

              return (
                <div
                  key={`${theme}-${variant.rank}`}
                  className={`relative rounded-xl p-3 border-2 transition-all ${
                    isEquipped
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-white/20 bg-black/30 hover:border-white/40'
                  } ${isMerging ? 'animate-pulse scale-105' : ''}`}
                >
                  {/* Rank badge */}
                  <div
                    className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: getRankColor(variant.rank), color: '#fff' }}
                  >
                    {getRankName(variant.rank).split(' ')[0]}
                  </div>

                  {/* Count badge */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-black">
                    {variant.count}
                  </div>

                  {/* Theme preview */}
                  <div
                    className="w-full aspect-square rounded-lg flex items-center justify-center font-black text-lg mb-2"
                    style={{ backgroundColor: style.bg, color: style.text }}
                  >
                    2048
                  </div>

                  <h4 className="text-white font-bold text-sm truncate">{getThemeName(theme)}</h4>
                  
                  {perk && (
                    <p className="text-yellow-400 text-xs flex items-center gap-1 mt-1">
                      <Sparkles className="w-3 h-3" />
                      {perk.name}
                    </p>
                  )}

                  {/* Boost from rank */}
                  {variant.rank !== 'base' && (
                    <p className="text-green-400 text-xs mt-1">
                      +{Math.round((getRankMultiplier(variant.rank) - 1) * 100)}% boost
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => onEquip(theme, variant.rank)}
                      disabled={isEquipped}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isEquipped
                          ? 'bg-yellow-400 text-yellow-900'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {isEquipped ? <Check className="w-4 h-4 mx-auto" /> : 'Equip'}
                    </button>
                    {canMerge && (
                      <button
                        onClick={() => handleMerge(theme, variant.rank)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                      >
                        <Merge className="w-3 h-3" />
                        Merge
                      </button>
                    )}
                  </div>
                </div>
              );
            });
          })}
        </div>

        {ownedThemes.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/50">No themes yet!</p>
            <p className="text-white/30 text-sm">Open packs in the Store to get themes</p>
          </div>
        )}
      </div>
    </div>
  );
};
