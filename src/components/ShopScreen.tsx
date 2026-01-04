import { ArrowLeft, Coins, Check, Palette, Sparkles, Crown, Gem, Star } from 'lucide-react';
import { ShopItem } from '@/hooks/useGameStore';

interface ShopScreenProps {
  coins: number;
  items: ShopItem[];
  onPurchase: (id: string) => boolean;
  onBack: () => void;
}

export const ShopScreen = ({ coins, items, onPurchase, onBack }: ShopScreenProps) => {
  const themeItems = items.filter(i => i.type === 'theme');
  
  const tierConfig = {
    common: { label: 'Common', icon: Star, color: 'from-gray-400 to-gray-500', border: 'border-gray-400/50' },
    rare: { label: 'Rare', icon: Sparkles, color: 'from-blue-400 to-blue-600', border: 'border-blue-400/50' },
    epic: { label: 'Epic', icon: Crown, color: 'from-purple-400 to-purple-600', border: 'border-purple-400/50' },
    legendary: { label: 'Legendary', icon: Gem, color: 'from-amber-400 to-orange-500', border: 'border-amber-400/50' },
  };

  const getThemeGradient = (value: string) => {
    switch (value) {
      case 'fire': return 'from-orange-400 to-red-600';
      case 'bubblegum': return 'from-pink-400 to-rose-500';
      case 'dark': return 'from-gray-600 to-gray-900';
      case 'blue': return 'from-blue-400 to-cyan-500';
      case 'forest': return 'from-green-400 to-emerald-600';
      case 'sunset': return 'from-orange-400 via-pink-500 to-purple-600';
      case 'lavender': return 'from-purple-300 to-indigo-500';
      case 'mint': return 'from-teal-300 to-green-400';
      case 'neon': return 'from-pink-500 via-purple-500 to-cyan-400';
      case 'aurora': return 'from-green-400 via-blue-500 to-purple-500';
      case 'cherry': return 'from-pink-300 via-pink-400 to-rose-500';
      case 'gold': return 'from-yellow-300 via-amber-400 to-yellow-600';
      case 'galaxy': return 'from-indigo-900 via-purple-700 to-pink-600';
      case 'rainbow': return 'from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400';
      case 'diamond': return 'from-cyan-200 via-white to-cyan-300';
      default: return 'from-amber-400 to-orange-500';
    }
  };

  const groupedByTier = {
    common: themeItems.filter(i => i.tier === 'common'),
    rare: themeItems.filter(i => i.tier === 'rare'),
    epic: themeItems.filter(i => i.tier === 'epic'),
    legendary: themeItems.filter(i => i.tier === 'legendary'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-white/20 p-3 rounded-xl text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-black text-white">Shop</h1>
        </div>
        <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black flex items-center gap-2">
          <Coins className="w-5 h-5" />
          <span>{coins.toLocaleString()}</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto space-y-8">
        {/* Tier sections */}
        {(['legendary', 'epic', 'rare', 'common'] as const).map((tier) => {
          const config = tierConfig[tier];
          const tierItems = groupedByTier[tier];
          if (tierItems.length === 0) return null;
          
          const TierIcon = config.icon;
          
          return (
            <div key={tier}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color}`}>
                  <TierIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">{config.label} Themes</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {tierItems.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl overflow-hidden transition-all border-2 ${config.border} ${
                      item.owned ? 'opacity-75' : 'hover:scale-105'
                    }`}
                  >
                    {/* Theme preview */}
                    <div className={`h-24 bg-gradient-to-br ${getThemeGradient(item.value)} flex items-center justify-center relative`}>
                      {tier === 'legendary' && (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)] animate-pulse" />
                      )}
                      <div className="grid grid-cols-2 gap-1 relative z-10">
                        {[2, 4, 8, 16].map((v) => (
                          <div
                            key={v}
                            className="w-8 h-8 bg-white/30 rounded flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm"
                          >
                            {v}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Item info */}
                    <div className="bg-white/20 backdrop-blur-sm p-3">
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-white">{item.name}</h3>
                        {tier === 'legendary' && <Gem className="w-4 h-4 text-amber-300" />}
                        {tier === 'epic' && <Crown className="w-4 h-4 text-purple-300" />}
                      </div>
                      <p className="text-white/60 text-xs mb-2">{item.description}</p>

                      {item.owned ? (
                        <div className="flex items-center gap-1 text-green-300">
                          <Check className="w-5 h-5" />
                          <span className="font-bold">Owned</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onPurchase(item.id)}
                          disabled={coins < item.price}
                          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-bold transition-all ${
                            coins >= item.price
                              ? `bg-gradient-to-r ${config.color} text-white hover:scale-105 shadow-lg`
                              : 'bg-white/10 text-white/40 cursor-not-allowed'
                          }`}
                        >
                          <Coins className="w-4 h-4" />
                          <span>{item.price.toLocaleString()}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Coming soon */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">Power-ups coming soon...</p>
        </div>
      </div>
    </div>
  );
};
