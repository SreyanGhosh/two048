import { useState } from 'react';
import { ArrowLeft, Calendar, Gift, Lock, Star, Sparkles, ChevronRight, Check, Clock } from 'lucide-react';
import { Season, SeasonProgress, SeasonalChallenge, ALL_SEASONS } from '@/hooks/useSeasons';

interface SeasonsScreenProps {
  activeSeasons: Season[];
  allSeasons: Season[];
  getSeasonProgress: (seasonId: string) => SeasonProgress;
  canPlayChallengeToday: (seasonId: string) => boolean;
  onBack: () => void;
  onPlayChallenge: (season: Season, challenge: SeasonalChallenge) => void;
  onClaimReward: (seasonId: string, challengeId: string) => void;
  onOpenSeasonShop: (season: Season) => void;
}

const getTierColor = (tier: 'base' | 'rare' | 'epic' | 'legendary') => {
  switch (tier) {
    case 'base': return 'from-gray-400 to-gray-500';
    case 'rare': return 'from-blue-400 to-blue-600';
    case 'epic': return 'from-purple-400 to-purple-600';
    case 'legendary': return 'from-yellow-400 to-orange-500';
  }
};

export const SeasonsScreen = ({
  activeSeasons,
  allSeasons,
  getSeasonProgress,
  canPlayChallengeToday,
  onBack,
  onPlayChallenge,
  onClaimReward,
  onOpenSeasonShop,
}: SeasonsScreenProps) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(
    activeSeasons.length > 0 ? activeSeasons[0].id : null
  );

  const selectedSeason = allSeasons.find(s => s.id === selectedSeasonId);
  const progress = selectedSeason ? getSeasonProgress(selectedSeason.id) : null;
  const canPlayToday = selectedSeason ? canPlayChallengeToday(selectedSeason.id) : false;

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getChallengeStatus = (challenge: SeasonalChallenge, progress: SeasonProgress | null) => {
    if (!progress) return 'locked';
    if (progress.claimedChallenges.includes(challenge.id)) return 'claimed';
    if (progress.completedChallenges.includes(challenge.id)) return 'completed';
    
    // Check if previous challenge is completed
    const sortedChallenges = [...(selectedSeason?.challenges || [])].sort((a, b) => a.order - b.order);
    const prevChallenge = sortedChallenges.find(c => c.order === challenge.order - 1);
    
    if (challenge.order === 1) return 'available';
    if (prevChallenge && progress.completedChallenges.includes(prevChallenge.id)) return 'available';
    
    return 'locked';
  };

  return (
    <div 
      className="min-h-screen overflow-hidden relative"
      style={{
        background: selectedSeason 
          ? `linear-gradient(135deg, ${selectedSeason.gradientFrom}, ${selectedSeason.gradientTo})`
          : 'linear-gradient(135deg, #1a1a2e, #16213e)'
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-black/30 border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Seasons
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {activeSeasons.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-6xl mb-4">🎄</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Active Seasons</h2>
          <p className="text-white/60 text-center">
            Check back later for seasonal events with exclusive themes and challenges!
          </p>
        </div>
      ) : (
        <>
          {/* Season Tabs */}
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {activeSeasons.map(season => (
              <button
                key={season.id}
                onClick={() => setSelectedSeasonId(season.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-bold transition-all ${
                  selectedSeasonId === season.id
                    ? 'bg-white text-gray-900 scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span className="mr-2">{season.emoji}</span>
                {season.name}
              </button>
            ))}
          </div>

          {selectedSeason && progress && (
            <>
              {/* Season Banner */}
              <div className="px-4 py-4">
                <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <span className="text-2xl">{selectedSeason.emoji}</span>
                        {selectedSeason.name}
                      </h2>
                      <p className="text-white/60 text-sm">{selectedSeason.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-300 font-bold">
                        <Star className="w-4 h-4 fill-yellow-300" />
                        {progress.seasonCredits}
                      </div>
                      <div className="text-white/60 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeRemaining(selectedSeason.endDate)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Progress</span>
                      <span>{progress.completedChallenges.length}/{selectedSeason.challenges.length}</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                        style={{ width: `${(progress.completedChallenges.length / selectedSeason.challenges.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Daily Limit Indicator */}
                  {!canPlayToday && (
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-2 text-center">
                      <p className="text-orange-300 text-sm font-medium flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" />
                        Daily challenge completed! Come back tomorrow.
                      </p>
                    </div>
                  )}

                  {/* Season Shop Button */}
                  <button
                    onClick={() => onOpenSeasonShop(selectedSeason)}
                    className="w-full mt-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-3 px-4 rounded-xl flex items-center justify-between hover:scale-[1.02] transition-transform"
                  >
                    <span className="flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      Season Shop
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Challenges List */}
              <div className="px-4 pb-8">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  Season Challenges
                </h3>
                <div className="space-y-3">
                  {[...selectedSeason.challenges]
                    .sort((a, b) => a.order - b.order)
                    .map((challenge, idx) => {
                      const status = getChallengeStatus(challenge, progress);
                      
                      return (
                        <div
                          key={challenge.id}
                          className={`rounded-xl border p-4 transition-all ${
                            status === 'locked' 
                              ? 'bg-black/20 border-white/10 opacity-60'
                              : status === 'claimed'
                              ? 'bg-green-500/20 border-green-500/30'
                              : status === 'completed'
                              ? 'bg-yellow-500/20 border-yellow-500/30'
                              : 'bg-white/10 border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                              status === 'claimed' 
                                ? 'bg-green-500 text-white'
                                : status === 'completed'
                                ? 'bg-yellow-500 text-gray-900'
                                : status === 'locked'
                                ? 'bg-gray-600 text-gray-400'
                                : 'bg-white text-gray-900'
                            }`}>
                              {status === 'claimed' ? <Check className="w-5 h-5" /> : 
                               status === 'locked' ? <Lock className="w-4 h-4" /> : 
                               idx + 1}
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-bold text-white">{challenge.title}</h4>
                              <p className="text-white/60 text-sm">{challenge.description}</p>
                              
                              {/* Rewards Preview */}
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {challenge.rewards.seasonCredits && (
                                  <span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-300" />
                                    {challenge.rewards.seasonCredits}
                                  </span>
                                )}
                                {challenge.rewards.coins && (
                                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-xs font-medium">
                                    🪙 {challenge.rewards.coins}
                                  </span>
                                )}
                                {challenge.rewards.themeId && (
                                  <span className={`bg-gradient-to-r ${getTierColor(
                                    selectedSeason.themes.find(t => t.id === challenge.rewards.themeId)?.tier || 'base'
                                  )} text-white px-2 py-0.5 rounded-full text-xs font-medium`}>
                                    🎨 Theme
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action Button */}
                            <div>
                              {status === 'completed' && (
                                <button
                                  onClick={() => onClaimReward(selectedSeason.id, challenge.id)}
                                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm hover:scale-105 transition-transform animate-pulse"
                                >
                                  Claim
                                </button>
                              )}
                              {status === 'available' && canPlayToday && (
                                <button
                                  onClick={() => onPlayChallenge(selectedSeason, challenge)}
                                  className="bg-white text-gray-900 font-bold px-4 py-2 rounded-lg text-sm hover:scale-105 transition-transform"
                                >
                                  Play
                                </button>
                              )}
                              {status === 'claimed' && (
                                <div className="text-green-400 font-bold text-sm">Done</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
