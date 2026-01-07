import { ArrowLeft, ShoppingBag, Coins, Sparkles } from 'lucide-react';
import { ShopItem } from '@/hooks/useGameStore';
import { getThemeButtonStyle, getThemeName } from '@/hooks/useThemeData';
import { getThemePerk } from '@/hooks/useThemePerks';
import { ThemeRank, getRankColor, getRankName } from '@/hooks/useGems';
import { Theme } from '@/hooks/useGame2048';

interface MarketScreenProps {
  coins: number;
  items: ShopItem[];
  onPurchase: (itemId: string, rank?: ThemeRank) => boolean;
  onBack: () => void;
}

// Rank price multipliers
const RANK_PRICE_MULTIPLIER: Record<ThemeRank, number> = {
  base: 1,
  green: 2.5,
  blue: 6,
  red: 15,
  orange: 40,
};

export const MarketScreen = ({
  coins,
  items,
  onPurchase,
  onBack,
}: MarketScreenProps) => {
  const groupedItems = {
    common: items.filter((i) => i.tier === 'common'),
    rare: items.filter((i) => i.tier === 'rare'),
    epic: items.filter((i) => i.tier === 'epic'),
    legendary: items.filter((i) => i.tier === 'legendary'),
  };

  const tierColors = {
    common: { bg: 'from-gray-600 to-gray-700', text: 'text-gray-300', badge: 'bg-gray-500' },
    rare: { bg: 'from-blue-600 to-blue-700', text: 'text-blue-300', badge: 'bg-blue-500' },
    epic: { bg: 'from-purple-600 to-purple-700', text: 'text-purple-300', badge: 'bg-purple-500' },
    legendary: { bg: 'from-yellow-600 to-amber-600', text: 'text-yellow-300', badge: 'bg-yellow-500' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
            <ShoppingBag className="w-5 h-5 text-green-400" />
            <span className="text-white font-black text-lg">MARKET</span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1.5 rounded-full">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Items by tier */}
      <div className="p-4 pb-24 space-y-6">
        {(['legendary', 'epic', 'rare', 'common'] as const).map((tier) => {
          const tierItems = groupedItems[tier];
          if (tierItems.length === 0) return null;

          const colors = tierColors[tier];

          return (
            <div key={tier}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`px-2 py-0.5 rounded text-xs font-bold text-white ${colors.badge}`}>
                  {tier.toUpperCase()}
                </div>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tierItems.map((item) => {
                  const themeStyle = getThemeButtonStyle(item.value as Theme);
                  const perk = getThemePerk(item.value as Theme);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl overflow-hidden border border-white/10 bg-black/30 ${
                        item.owned ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Theme preview */}
                      <div
                        className="h-20 flex items-center justify-center relative"
                        style={{ backgroundColor: themeStyle.bg }}
                      >
                        <span className="font-black text-3xl" style={{ color: themeStyle.text }}>
                          2048
                        </span>
                        {perk && (
                          <div className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded text-xs text-yellow-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {perk.name}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h3 className="text-white font-bold">{item.name}</h3>
                        <p className="text-white/60 text-xs mb-3">{item.description}</p>

                        {/* Rank purchase options */}
                        {!item.owned ? (
                          <div className="space-y-2">
                            {(['base', 'green', 'blue'] as ThemeRank[]).map((rank) => {
                              const price = Math.floor(item.price * RANK_PRICE_MULTIPLIER[rank]);
                              const canAfford = coins >= price;

                              return (
                                <button
                                  key={rank}
                                  onClick={() => onPurchase(item.id, rank)}
                                  disabled={!canAfford}
                                  className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-between px-3 transition-colors ${
                                    canAfford
                                      ? 'bg-white/10 hover:bg-white/20 text-white'
                                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                                  }`}
                                >
                                  <span
                                    className="flex items-center gap-2"
                                    style={{ color: getRankColor(rank) }}
                                  >
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: getRankColor(rank) }}
                                    />
                                    {getRankName(rank)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Coins className="w-4 h-4 text-yellow-400" />
                                    {price.toLocaleString()}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-2 text-center text-green-400 font-bold">
                            ✓ Owned
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
