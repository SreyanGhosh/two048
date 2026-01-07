import { useState, useEffect } from 'react';
import { Coins, Gem, Trophy, ShoppingBag, Gamepad2, Timer, Package, Layers, Calendar, Settings, ChevronRight } from 'lucide-react';
import { Season } from '@/hooks/useSeasons';

interface FCHomeScreenProps {
  coins: number;
  gems: number;
  hasActiveSeasons: boolean;
  activeSeason?: Season;
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
  hasActiveSeasons,
  activeSeason,
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

  useEffect(() => {
    const tiles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      value: [2, 4, 8, 16, 32, 64][Math.floor(Math.random() * 6)],
      x: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setFloatingTiles(tiles);
  }, []);

  // Dynamic background based on season
  const bgGradient = activeSeason
    ? `linear-gradient(135deg, ${activeSeason.gradientFrom} 0%, ${activeSeason.gradientTo} 100%)`
    : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';

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

      {/* Top bar - FC Mobile style */}
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
          {/* Coins */}
          <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-bold text-sm">{coins.toLocaleString()}</span>
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">+</div>
          </div>
          {/* Gems */}
          <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full">
            <Gem className="w-4 h-4 text-purple-400" />
            <span className="text-white font-bold text-sm">{gems.toLocaleString()}</span>
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">+</div>
          </div>
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
            <Settings className="w-4 h-4 text-white/70" />
          </button>
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
          {/* Season banner */}
          {hasActiveSeasons && activeSeason && (
            <button
              onClick={onOpenSeasons}
              className="relative overflow-hidden rounded-lg bg-gradient-to-r from-black/40 to-transparent p-4 border border-white/10 hover:border-white/30 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Active Season</p>
                  <h2 className="text-white font-black text-2xl">{activeSeason.name} {activeSeason.emoji}</h2>
                  <p className="text-white/70 text-sm">{activeSeason.description}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />
            </button>
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

      {/* Bottom navigation - FC Mobile style */}
      <div className="relative z-10 bg-black/50 backdrop-blur border-t border-white/10">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={onOpenQuests}
            className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white text-xs font-bold">QUESTS</span>
          </button>

          <button
            onClick={onOpenSeasons}
            className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5 text-red-400" />
            <span className="text-white text-xs font-bold">SEASONS</span>
          </button>

          <button
            onClick={onOpenMarket}
            className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-green-400" />
            <span className="text-white text-xs font-bold">MARKET</span>
          </button>

          <button
            onClick={onOpenInventory}
            className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Layers className="w-5 h-5 text-purple-400" />
            <span className="text-white text-xs font-bold">INVENTORY</span>
          </button>

          <button
            onClick={onOpenStore}
            className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Package className="w-5 h-5 text-orange-400" />
            <span className="text-white text-xs font-bold">STORE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
