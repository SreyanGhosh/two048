import { useState } from 'react';
import { ArrowLeft, Package, Gem, Sparkles, Gift } from 'lucide-react';
import { Pack, NORMAL_PACKS, ThemeRank } from '@/hooks/useGems';
import { Theme } from '@/hooks/useGame2048';
import { getThemeName, getThemeButtonStyle } from '@/hooks/useThemeData';

interface StoreScreenProps {
  gems: number;
  seasonalPacks: Pack[];
  onBack: () => void;
  onOpenPack: (pack: Pack) => Theme[];
}

export const StoreScreen = ({
  gems,
  seasonalPacks,
  onBack,
  onOpenPack,
}: StoreScreenProps) => {
  const [openingPack, setOpeningPack] = useState<Pack | null>(null);
  const [revealedThemes, setRevealedThemes] = useState<Theme[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleOpenPack = (pack: Pack) => {
    if (gems < pack.price) return;

    setOpeningPack(pack);
    
    // Simulate pack opening animation
    setTimeout(() => {
      const themes = onOpenPack(pack);
      setRevealedThemes(themes);
      setShowResults(true);
    }, 1500);
  };

  const handleCloseResults = () => {
    setOpeningPack(null);
    setRevealedThemes([]);
    setShowResults(false);
  };

  const allPacks = [...NORMAL_PACKS, ...seasonalPacks];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
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
            <Package className="w-5 h-5 text-orange-400" />
            <span className="text-white font-black text-lg">STORE</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full">
            <Gem className="w-4 h-4 text-purple-400" />
            <span className="text-white font-bold text-sm">{gems.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Packs grid */}
      <div className="p-4 pb-24">
        {/* Seasonal packs */}
        {seasonalPacks.length > 0 && (
          <>
            <h2 className="text-white font-black text-lg mb-3 flex items-center gap-2">
              <Gift className="w-5 h-5 text-red-400" />
              SEASONAL PACKS
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {seasonalPacks.map((pack) => (
                <PackCard
                  key={pack.id}
                  pack={pack}
                  gems={gems}
                  onOpen={() => handleOpenPack(pack)}
                  isSeasonal
                />
              ))}
            </div>
          </>
        )}

        {/* Normal packs */}
        <h2 className="text-white font-black text-lg mb-3 flex items-center gap-2">
          <Package className="w-5 h-5 text-green-400" />
          PACKS
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {NORMAL_PACKS.map((pack) => (
            <PackCard
              key={pack.id}
              pack={pack}
              gems={gems}
              onOpen={() => handleOpenPack(pack)}
            />
          ))}
        </div>
      </div>

      {/* Pack opening overlay */}
      {openingPack && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          {!showResults ? (
            // Opening animation
            <div className="relative">
              <div className="w-48 h-64 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 animate-pulse flex items-center justify-center">
                <Package className="w-16 h-16 text-white animate-bounce" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-32 h-32 text-yellow-300 animate-spin" style={{ animationDuration: '2s' }} />
              </div>
            </div>
          ) : (
            // Results
            <div className="w-full max-w-md">
              <h2 className="text-white font-black text-2xl text-center mb-4">
                Pack Opened! 🎉
              </h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {revealedThemes.map((theme, idx) => {
                  const style = getThemeButtonStyle(theme);
                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl flex flex-col items-center justify-center animate-scale-in"
                      style={{
                        backgroundColor: style.bg,
                        color: style.text,
                        animationDelay: `${idx * 100}ms`,
                      }}
                    >
                      <span className="font-black text-xl">2048</span>
                      <span className="text-xs font-bold mt-1 opacity-80">
                        {getThemeName(theme)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={handleCloseResults}
                className="w-full py-3 rounded-xl bg-white text-black font-black hover:bg-white/90 transition-colors"
              >
                AWESOME!
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PackCard = ({
  pack,
  gems,
  onOpen,
  isSeasonal = false,
}: {
  pack: Pack;
  gems: number;
  onOpen: () => void;
  isSeasonal?: boolean;
}) => {
  const canAfford = gems >= pack.price;

  return (
    <div
      className={`rounded-xl overflow-hidden border-2 transition-all ${
        isSeasonal
          ? 'border-red-500/50 bg-gradient-to-br from-red-900/50 to-orange-900/50'
          : 'border-white/20 bg-black/30'
      } ${canAfford ? 'hover:scale-[1.02] hover:border-white/40' : 'opacity-50'}`}
    >
      {/* Pack visual */}
      <div
        className={`h-24 flex items-center justify-center ${
          isSeasonal
            ? 'bg-gradient-to-br from-red-500 to-orange-500'
            : 'bg-gradient-to-br from-purple-500 to-indigo-600'
        }`}
      >
        <Package className="w-12 h-12 text-white/80" />
      </div>

      {/* Pack info */}
      <div className="p-3">
        <h3 className="text-white font-bold text-sm">{pack.name}</h3>
        <p className="text-white/60 text-xs mb-2">{pack.description}</p>

        {pack.guaranteed && pack.guaranteed.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {pack.guaranteed.map((g, i) => (
              <span
                key={i}
                className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                  g.rarity === 'legendary'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : g.rarity === 'epic'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                1 {g.rarity}+
              </span>
            ))}
          </div>
        )}

        <button
          onClick={onOpen}
          disabled={!canAfford}
          className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            canAfford
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          <Gem className="w-4 h-4" />
          {pack.price}
        </button>
      </div>
    </div>
  );
};
