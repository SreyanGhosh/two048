import { ArrowLeft, Coins, Check, Palette } from 'lucide-react';
import { ShopItem } from '@/hooks/useGameStore';

interface ShopScreenProps {
  coins: number;
  items: ShopItem[];
  onPurchase: (id: string) => boolean;
  onBack: () => void;
}

export const ShopScreen = ({ coins, items, onPurchase, onBack }: ShopScreenProps) => {
  const themeItems = items.filter(i => i.type === 'theme');

  const getThemeGradient = (value: string) => {
    switch (value) {
      case 'fire': return 'from-orange-400 to-red-600';
      case 'bubblegum': return 'from-pink-400 to-rose-500';
      case 'dark': return 'from-gray-600 to-gray-900';
      case 'blue': return 'from-blue-400 to-cyan-500';
      default: return 'from-amber-400 to-orange-500';
    }
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

      {/* Themes section */}
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">Themes</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {themeItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl overflow-hidden transition-all ${
                item.owned ? 'opacity-75' : 'hover:scale-105'
              }`}
            >
              {/* Theme preview */}
              <div className={`h-24 bg-gradient-to-br ${getThemeGradient(item.value)} flex items-center justify-center`}>
                <div className="grid grid-cols-2 gap-1">
                  {[2, 4, 8, 16].map((v) => (
                    <div
                      key={v}
                      className="w-8 h-8 bg-white/30 rounded flex items-center justify-center text-white font-bold text-xs"
                    >
                      {v}
                    </div>
                  ))}
                </div>
              </div>

              {/* Item info */}
              <div className="bg-white/20 backdrop-blur-sm p-3">
                <h3 className="font-bold text-white">{item.name}</h3>
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
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 hover:scale-105'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>{item.price}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">More items coming soon...</p>
        </div>
      </div>
    </div>
  );
};
