import { useState, useEffect, useRef } from 'react';
import { Coins, Gem, Trophy, ShoppingBag, Gamepad2, Timer, Package, Layers, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { Season } from '@/hooks/useSeasons';

interface FCHomeScreenProps {
  coins: number;
  gems: number;
  activeSeasons: Season[];
  equippedThemeName: string;
  onPlayClassic: () => void;
  onPlayCompetitive: () => void;
  onOpenQuests: () => void;
  onOpenMarket: () => void;
  onOpenStore: () => void;
  onOpenSeasons: () => void;
  onOpenInventory: () => void;
}

export const FCHomeScreen = ({
  coins,
  gems,
  activeSeasons,
  equippedThemeName,
  onPlayClassic,
  onPlayCompetitive,
  onOpenQuests,
  onOpenMarket,
  onOpenStore,
  onOpenSeasons,
  onOpenInventory,
}: FCHomeScreenProps) => {
  const [floatingTiles, setFloatingTiles] = useState<{ id: number; value: number; x: number; delay: number }[]>([]);
  const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0);
  const bottomNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tiles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      value: [2, 4, 8, 16, 32, 64][Math.floor(Math.random() * 6)],
      x: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setFloatingTiles(tiles);
  }, []);

  // Get the "main" season (first one for background)
  const mainSeason = activeSeasons[0];
  const currentSeason = activeSeasons[currentSeasonIndex] || mainSeason;

  // Dynamic background based on main season
  const bgGradient = mainSeason
    ? `linear-gradient(135deg, ${mainSeason.gradientFrom} 0%, ${mainSeason.gradientTo} 100%)`
    : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';

  const handlePrevSeason = () => {
    setCurrentSeasonIndex((prev) => (prev > 0 ? prev - 1 : activeSeasons.length - 1));
  };

  const handleNextSeason = () => {
    setCurrentSeasonIndex((prev) => (prev < activeSeasons.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bgGradient }}>
      {/* Floating tiles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {floatingTiles.map((tile) => (
          <div
            key={tile.id}
            className="absolute w-12 h-12 rounded bg-white/20 flex items-center justify-center font-black text-white/50 text-sm animate-float"
            style={{
              left: `${tile.x}%`,
              animationDelay: `${tile.delay}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
            }}
          >
            {tile.value}
          </div>
        ))}
      </div>

      {/* Top bar - FC Mobile style - No plus buttons, no settings */}
      <div className="relative z-10 flex items-center justify-between p-3 bg-black/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-black text-white text-lg">
            2K
          </div>
          <div>
            <p className="text-white font-bold text-sm">2048</p>
            <p className="text-white/60 text-xs">Ultimate</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Coins - No plus button */}
          <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-bold text-sm">{coins.toLocaleString()}</span>
          </div>
          {/* Gems - No plus button */}
          <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full">
            <Gem className="w-4 h-4 text-purple-400" />
            <span className="text-white font-bold text-sm">{gems.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative z-10 flex flex-col md:flex-row gap-4 p-4">
        {/* Left sidebar - Quick actions */}
        <div className="hidden md:flex flex-col gap-2 w-14">
          <button
            onClick={onOpenSeasons}
            className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
          >
            <Calendar className="w-6 h-6" />
          </button>
          <button
            onClick={onOpenInventory}
            className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
          >
            <Layers className="w-6 h-6" />
          </button>
          <button
            onClick={onOpenStore}
            className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
          >
            <Package className="w-6 h-6" />
          </button>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Season banner with navigation for multiple seasons */}
          {activeSeasons.length > 0 && currentSeason && (
            <div className="relative">
              {activeSeasons.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSeason}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextSeason}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={onOpenSeasons}
                className="w-full relative overflow-hidden rounded-lg p-4 border border-white/10 hover:border-white/30 transition-colors group"
                style={{
                  background: `linear-gradient(135deg, ${currentSeason.gradientFrom}80, ${currentSeason.gradientTo}80)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white/60 text-xs uppercase tracking-wider">Active Season</p>
                      {activeSeasons.length > 1 && (
                        <span className="text-white/40 text-xs">
                          {currentSeasonIndex + 1}/{activeSeasons.length}
                        </span>
                      )}
                    </div>
                    <h2 className="text-white font-black text-2xl">{currentSeason.name} {currentSeason.emoji}</h2>
                    <p className="text-white/70 text-sm">{currentSeason.description}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </div>
                {/* Decorative elements */}
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />
              </button>
              
              {/* Season dots indicator */}
              {activeSeasons.length > 1 && (
                <div className="flex justify-center gap-1 mt-2">
                  {activeSeasons.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentSeasonIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Play cards - FC Mobile style */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onPlayClassic}
              className="relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 p-4 text-left group hover:scale-[1.02] transition-transform"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
              <Gamepad2 className="w-8 h-8 text-white/80 mb-2" />
              <h3 className="text-white font-black text-xl">CLASSIC</h3>
              <p className="text-white/60 text-xs">Endless mode</p>
              <div className="mt-2 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span className="text-white/80 text-xs">Theme: {equippedThemeName}</span>
              </div>
            </button>

            <button
              onClick={onPlayCompetitive}
              className="relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-4 text-left group hover:scale-[1.02] transition-transform"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
              <Timer className="w-8 h-8 text-white/80 mb-2" />
              <h3 className="text-white font-black text-xl">PLAY</h3>
              <p className="text-white/60 text-xs">60 second rush</p>
              <div className="mt-2 bg-white/20 px-2 py-0.5 rounded text-white text-xs font-bold inline-block">
                60s
              </div>
            </button>
          </div>

          {/* Inventory preview */}
          <button
            onClick={onOpenInventory}
            className="rounded-lg bg-black/30 p-4 border border-white/10 hover:border-white/20 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">INVENTORY</h3>
                  <p className="text-white/60 text-xs">Manage & merge themes</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/50" />
            </div>
          </button>
        </div>
      </div>

      {/* Bottom navigation - FC Mobile style - Scrollable */}
      <div className="relative z-10 bg-black/50 backdrop-blur border-t border-white/10">
        <div
          ref={bottomNavRef}
          className="flex items-center overflow-x-auto scrollbar-hide py-2 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            onClick={onOpenQuests}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white text-xs font-bold">QUESTS</span>
          </button>

          <button
            onClick={onOpenSeasons}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5 text-red-400" />
            <span className="text-white text-xs font-bold">SEASONS</span>
          </button>

          <button
            onClick={onOpenMarket}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-green-400" />
            <span className="text-white text-xs font-bold">MARKET</span>
          </button>

          <button
            onClick={onOpenInventory}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Layers className="w-5 h-5 text-purple-400" />
            <span className="text-white text-xs font-bold">INVENTORY</span>
          </button>

          <button
            onClick={onOpenStore}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Package className="w-5 h-5 text-orange-400" />
            <span className="text-white text-xs font-bold">STORE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
