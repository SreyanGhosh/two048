import { useState } from 'react';
import { ArrowLeft, Coins, Check, Lock, Clock, Star, Trophy, RotateCcw } from 'lucide-react';
import { Challenge } from '@/hooks/useGameStore';

interface ChallengesScreenProps {
  challenges: Challenge[];
  dailyChallenges: Challenge[];
  onClaimReward: (id: string, isDaily: boolean) => void;
  onBack: () => void;
  onResetProgress?: () => void;
}

export const ChallengesScreen = ({ challenges, dailyChallenges, onClaimReward, onBack, onResetProgress }: ChallengesScreenProps) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const sortChallenges = (list: Challenge[]) => [...list].sort((a, b) => {
    if (a.claimed && !b.claimed) return 1;
    if (!a.claimed && b.claimed) return -1;
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    return 0;
  });

  const getTimeRemaining = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const ChallengeCard = ({ challenge, isDaily }: { challenge: Challenge; isDaily: boolean }) => {
    const progress = Math.min((challenge.current / challenge.target) * 100, 100);
    
    return (
      <div
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
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-lg">{challenge.title}</h3>
              {isDaily && (
                <span className="bg-amber-400/30 text-amber-200 text-xs px-2 py-0.5 rounded-full font-bold">
                  DAILY
                </span>
              )}
            </div>
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
                onClick={() => onClaimReward(challenge.id, isDaily)}
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
  };

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

      <div className="max-w-lg mx-auto space-y-6">
        {/* Daily Challenges Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-300" />
              <h2 className="text-xl font-bold text-white">Daily Challenges</h2>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-white/80 text-sm">
              <Clock className="w-4 h-4" />
              <span>{getTimeRemaining()}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {sortChallenges(dailyChallenges).map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} isDaily={true} />
            ))}
          </div>
        </div>

        {/* Regular Challenges Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-6 h-6 text-amber-300" />
            <h2 className="text-xl font-bold text-white">Lifetime Challenges</h2>
          </div>
          
          <div className="space-y-3">
            {sortChallenges(challenges).map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} isDaily={false} />
            ))}
          </div>
        </div>

        {/* Reset Progress */}
        {onResetProgress && (
          <div className="mt-8 pt-6 border-t border-white/20">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 py-3 rounded-xl font-bold transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset All Progress
            </button>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Reset Progress?</h3>
            <p className="text-white/70 mb-6">
              This will erase all coins, unlocked themes, and challenge progress. This cannot be undone!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-white/20 text-white py-3 rounded-xl font-bold hover:bg-white/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
