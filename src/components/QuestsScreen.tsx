import { useState } from 'react';
import { ArrowLeft, Trophy, Coins, Clock, RotateCcw, Gem, ChevronRight } from 'lucide-react';
import { Challenge } from '@/hooks/useGameStore';
import { Progress } from '@/components/ui/progress';

interface QuestsScreenProps {
  challenges: Challenge[];
  dailyChallenges: Challenge[];
  onClaimReward: (id: string, isDaily: boolean) => void;
  onBack: () => void;
  onResetProgress: () => void;
}

export const QuestsScreen = ({
  challenges,
  dailyChallenges,
  onClaimReward,
  onBack,
  onResetProgress,
}: QuestsScreenProps) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'main'>('daily');

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const renderChallenge = (challenge: Challenge, isDaily: boolean = false) => {
    const progress = Math.min((challenge.current / challenge.target) * 100, 100);

    return (
      <div
        key={challenge.id}
        className={`rounded-xl border transition-all ${
          challenge.completed && !challenge.claimed
            ? 'border-yellow-500/50 bg-yellow-500/10'
            : challenge.claimed
            ? 'border-green-500/30 bg-green-500/5 opacity-60'
            : 'border-white/10 bg-black/30'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-white font-bold">{challenge.title}</h3>
              <p className="text-white/60 text-sm">{challenge.description}</p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm">{challenge.reward}</span>
            </div>
          </div>

          <div className="mb-2">
            <Progress value={progress} className="h-2 bg-white/10" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm">
              {challenge.current.toLocaleString()} / {challenge.target.toLocaleString()}
            </span>
            {challenge.completed && !challenge.claimed ? (
              <button
                onClick={() => onClaimReward(challenge.id, isDaily)}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 px-4 py-1.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                CLAIM
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : challenge.claimed ? (
              <span className="text-green-400 font-bold text-sm">✓ Claimed</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900">
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
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-black text-lg">QUESTS</span>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-3 font-bold text-sm transition-colors ${
            activeTab === 'daily'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          DAILY
        </button>
        <button
          onClick={() => setActiveTab('main')}
          className={`flex-1 py-3 font-bold text-sm transition-colors ${
            activeTab === 'main'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          MAIN QUESTS
        </button>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {activeTab === 'daily' ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Daily Quests</h2>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Clock className="w-4 h-4" />
                <span>Resets in {getTimeUntilReset()}</span>
              </div>
            </div>
            <div className="space-y-3">
              {dailyChallenges.map((c) => renderChallenge(c, true))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-white font-bold mb-4">Main Quests</h2>
            <div className="space-y-3">
              {challenges
                .sort((a, b) => {
                  // Show unclaimed completed first, then incomplete, then claimed
                  if (a.completed && !a.claimed && !(b.completed && !b.claimed)) return -1;
                  if (b.completed && !b.claimed && !(a.completed && !a.claimed)) return 1;
                  if (a.claimed && !b.claimed) return 1;
                  if (b.claimed && !a.claimed) return -1;
                  return 0;
                })
                .map((c) => renderChallenge(c))}
            </div>
          </>
        )}
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-red-500/30">
            <h3 className="text-white font-black text-xl mb-2">Reset All Progress?</h3>
            <p className="text-white/60 text-sm mb-6">
              This will reset ALL your coins, themes, and progress. This action cannot be undone!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
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
