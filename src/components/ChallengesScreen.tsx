import { ArrowLeft, Coins, Check, Lock } from 'lucide-react';
import { Challenge } from '@/hooks/useGameStore';

interface ChallengesScreenProps {
  challenges: Challenge[];
  onClaimReward: (id: string) => void;
  onBack: () => void;
}

export const ChallengesScreen = ({ challenges, onClaimReward, onBack }: ChallengesScreenProps) => {
  const sortedChallenges = [...challenges].sort((a, b) => {
    if (a.claimed && !b.claimed) return 1;
    if (!a.claimed && b.claimed) return -1;
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="bg-white/20 p-3 rounded-xl text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-black text-white">Challenges</h1>
      </div>

      {/* Challenges list */}
      <div className="space-y-3 max-w-lg mx-auto">
        {sortedChallenges.map((challenge) => {
          const progress = Math.min((challenge.current / challenge.target) * 100, 100);
          
          return (
            <div
              key={challenge.id}
              className={`rounded-2xl p-4 transition-all ${
                challenge.claimed
                  ? 'bg-white/10 opacity-60'
                  : challenge.completed
                  ? 'bg-white/30 shadow-lg'
                  : 'bg-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{challenge.title}</h3>
                  <p className="text-white/70 text-sm">{challenge.description}</p>
                  
                  {/* Progress bar */}
                  <div className="mt-2">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-xs mt-1">
                      {challenge.current.toLocaleString()} / {challenge.target.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 bg-yellow-400/20 px-2 py-1 rounded-full">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">{challenge.reward}</span>
                  </div>

                  {challenge.claimed ? (
                    <div className="flex items-center gap-1 text-green-300">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-bold">Claimed</span>
                    </div>
                  ) : challenge.completed ? (
                    <button
                      onClick={() => onClaimReward(challenge.id)}
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform animate-pulse"
                    >
                      Claim!
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-white/40">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs">Locked</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
