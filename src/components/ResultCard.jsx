import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { shareResult, whatsappShare } from '../utils/share';

const TAGS = [
  { key: 'hungry',   yes: { label: 'Mengenyangkan 🍚', bg: 'bg-orange-100 text-orange-600' },   no: null },
  { key: 'spicy',    yes: { label: 'Pedas 🌶️',         bg: 'bg-red-100 text-red-600' },          no: null },
  { key: 'expensive',yes: { label: 'Premium 💎',        bg: 'bg-purple-100 text-purple-600' },
                      no:  { label: 'Budget 💚',         bg: 'bg-green-100 text-green-600' } },
];

function fireConfetti() {
  const opts = { particleCount: 90, spread: 80, startVelocity: 45, origin: { y: 0.55 } };
  confetti({ ...opts, angle: 60,  colors: ['#f59e0b','#ef4444','#10b981','#6366f1','#ec4899'] });
  confetti({ ...opts, angle: 120, colors: ['#f59e0b','#ef4444','#10b981','#6366f1','#ec4899'] });
}

export default function ResultCard({ food, category, onRestart, onFullRestart, onHistoryClick }) {
  const [shareStatus, setShareStatus] = useState(null);
  const [tagIndex, setTagIndex] = useState(-1);

  useEffect(() => {
    fireConfetti();
    if (navigator.vibrate) navigator.vibrate([50, 30, 80]);

    // Stagger tags in one by one
    const activeTags = TAGS.filter(t => t.yes && food[t.key] === 'YES' || t.no && food[t.key] === 'NO');
    activeTags.forEach((_, i) => {
      setTimeout(() => setTagIndex(i), 400 + i * 150);
    });
  }, []);

  const handleShare = async () => {
    const status = await shareResult(food.name, category.label);
    if (status === 'copied' || status === 'shared') {
      setShareStatus(status);
      setTimeout(() => setShareStatus(null), 2500);
    }
  };

  const visibleTags = TAGS.filter((t) => {
    if (food[t.key] === 'YES' && t.yes) return true;
    if (food[t.key] === 'NO' && t.no) return true;
    return false;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="flex flex-col items-center px-5 pb-10 w-full max-w-md mx-auto"
    >
      {/* Main result card */}
      <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden mb-4">
        {/* Top accent bar */}
        <div className={`h-1.5 w-full ${category.bg}`} />

        <div className="p-7 flex flex-col items-center">
          {/* Emoji with pulsing glow */}
          <div className="relative flex items-center justify-center mb-5">
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className={`absolute w-28 h-28 rounded-full blur-xl ${category.bg} opacity-40`}
            />
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 360, damping: 16, delay: 0.1 }}
              className="relative text-8xl drop-shadow-lg"
            >
              {food.emoji}
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1"
          >
            {category.label}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 300 }}
            className="text-4xl font-black text-gray-800 text-center leading-tight mb-1"
          >
            {food.name}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-gray-400 text-sm mb-5"
          >
            Cuba la makan ni! 😋
          </motion.p>

          {/* Tags — staggered fly-in */}
          <div className="flex flex-wrap gap-2 justify-center">
            {visibleTags.map((t, i) => {
              const tag = food[t.key] === 'YES' ? t.yes : t.no;
              return (
                <motion.span
                  key={t.key}
                  initial={{ opacity: 0, scale: 0.6, y: 8 }}
                  animate={i <= tagIndex ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`${tag.bg} text-xs font-bold px-3 py-1.5 rounded-full`}
                >
                  {tag.label}
                </motion.span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleShare}
        className="w-full bg-white/20 hover:bg-white/30 border-2 border-white/30 text-white font-bold text-sm rounded-2xl py-3.5 mb-2.5 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
      >
        {shareStatus === 'copied' ? '✅ Copied!' :
         shareStatus === 'shared' ? '✅ Shared!' :
         <><span>📤</span> Share dengan member</>}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => whatsappShare(food.name)}
        className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm rounded-2xl py-3.5 mb-4 transition-colors flex items-center justify-center gap-2 shadow-lg"
      >
        <span>💬</span> Share via WhatsApp
      </motion.button>

      {/* Action row */}
      <div className="flex gap-3 w-full">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onRestart}
          className="flex-1 bg-white/15 hover:bg-white/25 border-2 border-white/25 text-white font-semibold text-sm rounded-2xl py-3.5 transition-colors backdrop-blur-sm"
        >
          🔄 Cuba lagi
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onFullRestart}
          className="flex-1 bg-white/15 hover:bg-white/25 border-2 border-white/25 text-white font-semibold text-sm rounded-2xl py-3.5 transition-colors backdrop-blur-sm"
        >
          🏠 Tukar kategori
        </motion.button>
      </div>

      <button
        onClick={onHistoryClick}
        className="mt-4 text-white/50 hover:text-white/80 text-xs font-medium underline underline-offset-2 transition-colors"
      >
        📋 Tengok history pilihan
      </button>
    </motion.div>
  );
}
