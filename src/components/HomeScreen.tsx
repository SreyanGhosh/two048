import { useState, useEffect } from 'react';
import { Coins, Trophy, ShoppingBag, Gamepad2, Timer, Sparkles, Calendar } from 'lucide-react';

interface HomeScreenProps {
  coins: number;
  hasActiveSeasons: boolean;
  onPlayClassic: () => void;
  onPlayCompetitive: () => void;
  onOpenChallenges: () => void;
  onOpenShop: () => void;
  onOpenSeasons: () => void;
}

export const HomeScreen = ({ 
  coins,
  hasActiveSeasons,
  onPlayClassic, 
  onPlayCompetitive, 
  onOpenChallenges, 
  onOpenShop,
  onOpenSeasons,
}: HomeScreenProps) => {
  const [floatingTiles, setFloatingTiles] = useState<{ id: number; value: number; x: number; delay: number }[]>([]);

  useEffect(() => {
    const tiles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      value: [2, 4, 8, 16, 32, 64, 128, 256][Math.floor(Math.random() * 8)],
      x: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setFloatingTiles(tiles);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-home-primary via-home-secondary to-home-accent overflow-hidden relative">
      {/* Floating background tiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingTiles.map((tile) => (
          <div
            key={tile.id}
            className="absolute w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center font-black text-white/30 text-xl animate-float"
            style={{
              left: `${tile.x}%`,
              animationDelay: `${tile.delay}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            {tile.value}
          </div>
        ))}
      </div>

      {/* Coins display */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black flex items-center gap-2 shadow-lg animate-pulse-subtle">
          <Coins className="w-5 h-5" />
          <span>{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="text-7xl md:text-8xl font-black text-white drop-shadow-2xl mb-2 animate-bounce-subtle">
            2048
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-spin-slow" />
            <p className="text-white/80 text-xl font-bold">Ultimate Edition</p>
            <Sparkles className="w-6 h-6 text-yellow-300 animate-spin-slow" />
          </div>
        </div>

        {/* Menu buttons */}
        <div className="w-full max-w-md space-y-4">
          {/* Classic Mode */}
          <button
            onClick={onPlayClassic}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 p-1 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-5">
              <div className="bg-white/20 p-3 rounded-xl">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-2xl font-black text-white">Classic</h3>
                <p className="text-white/70 text-sm">The original 2048 experience</p>
              </div>
              <div className="w-3 h-3 bg-white rounded-full animate-ping" />
            </div>
          </button>

          {/* Competitive Mode */}
          <button
            onClick={onPlayCompetitive}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 p-1 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-5">
              <div className="bg-white/20 p-3 rounded-xl">
                <Timer className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-2xl font-black text-white">Competitive</h3>
                <p className="text-white/70 text-sm">Race against time!</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-white font-bold text-sm">60s</span>
              </div>
            </div>
          </button>

          {/* Seasons - Only show if active */}
          {hasActiveSeasons && (
            <button
              onClick={onOpenSeasons}
              className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-red-500 to-pink-500 p-1 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-pulse-subtle"
            >
              <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-amber-400 via-red-500 to-pink-500 px-6 py-5">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-black text-white">Seasons</h3>
                  <p className="text-white/70 text-sm">Limited-time events & themes!</p>
                </div>
                <div className="bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                  NEW!
                </div>
              </div>
            </button>
          )}

          {/* Challenges */}
          <button
            onClick={onOpenChallenges}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 p-1 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 px-6 py-5">
              <div className="bg-white/20 p-3 rounded-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-2xl font-black text-white">Challenges</h3>
                <p className="text-white/70 text-sm">Complete tasks, earn coins!</p>
              </div>
              <Coins className="w-6 h-6 text-yellow-300 animate-bounce" />
            </div>
          </button>

          {/* Shop */}
          <button
            onClick={onOpenShop}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-500 p-1 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-500 px-6 py-5">
              <div className="bg-white/20 p-3 rounded-xl">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-2xl font-black text-white">Shop</h3>
                <p className="text-white/70 text-sm">Unlock themes & power-ups</p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-white/50 text-sm">
          Swipe or use arrow keys to play
        </p>
      </div>
    </div>
  );
};
