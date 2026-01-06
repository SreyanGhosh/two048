import { X, Gift, Star, Sparkles, ChevronRight } from 'lucide-react';
import { Season } from '@/hooks/useSeasons';

interface SeasonWelcomePopupProps {
  season: Season;
  onAccept: () => void;
  onClose: () => void;
}

const getTierStyles = (tier: 'base' | 'rare' | 'epic' | 'legendary') => {
  switch (tier) {
    case 'base': return { gradient: 'from-gray-400 to-gray-600', border: 'border-gray-400' };
    case 'rare': return { gradient: 'from-blue-400 to-blue-600', border: 'border-blue-400' };
    case 'epic': return { gradient: 'from-purple-400 to-purple-600', border: 'border-purple-400' };
    case 'legendary': return { gradient: 'from-yellow-400 to-orange-500', border: 'border-yellow-400' };
  }
};

export const SeasonWelcomePopup = ({ season, onAccept, onClose }: SeasonWelcomePopupProps) => {
  const baseTheme = season.themes.find(t => t.id === season.baseThemeId);
  const premiumThemes = season.themes.filter(t => t.id !== season.baseThemeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div 
        className="relative w-full max-w-md rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300"
        style={{
          background: `linear-gradient(135deg, ${season.gradientFrom}, ${season.gradientTo})`
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">
            {season.emoji}
          </div>
          <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-pulse">
            {season.emoji}
          </div>
        </div>

        <div className="relative p-6 text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1 text-white text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              NEW SEASON
            </div>
            <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-2">
              <span className="text-4xl">{season.emoji}</span>
              {season.name}
            </h2>
            <p className="text-white/80">{season.description}</p>
          </div>

          {/* Free Theme Gift */}
          {baseTheme && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4 border border-white/20">
              <div className="flex items-center gap-2 text-yellow-300 font-bold mb-3">
                <Gift className="w-5 h-5" />
                FREE WELCOME GIFT
              </div>
              <div className={`bg-gradient-to-r ${getTierStyles(baseTheme.tier).gradient} rounded-xl p-4`}>
                <h3 className="text-white font-bold text-lg">{baseTheme.name}</h3>
                <p className="text-white/80 text-sm">{baseTheme.description}</p>
              </div>
            </div>
          )}

          {/* Starter Credits */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4 border border-white/20">
            <div className="flex items-center justify-center gap-3">
              <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
              <div>
                <div className="text-3xl font-black text-white">{season.starterCredits}</div>
                <div className="text-white/60 text-sm">Season Credits</div>
              </div>
            </div>
          </div>

          {/* Premium Themes Preview */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20">
            <h4 className="text-white font-bold mb-3">Exclusive Themes Await</h4>
            <div className="grid grid-cols-3 gap-2">
              {premiumThemes.map(theme => {
                const styles = getTierStyles(theme.tier);
                return (
                  <div 
                    key={theme.id}
                    className={`bg-gradient-to-br ${styles.gradient} rounded-lg p-2 border ${styles.border}`}
                  >
                    <div className="text-white font-bold text-xs truncate">{theme.name}</div>
                    <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
                      <Star className="w-3 h-3" />
                      {theme.price}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onAccept}
            className="w-full bg-white text-gray-900 font-black text-lg py-4 rounded-2xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Gift className="w-6 h-6" />
            Claim Your Gifts!
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
