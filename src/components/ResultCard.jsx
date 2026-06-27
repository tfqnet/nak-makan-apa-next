import { motion } from 'framer-motion';
import { useState } from 'react';
import { shareResult, whatsappShare } from '../utils/share';

export default function ResultCard({ food, category, onRestart, onFullRestart, onHistoryClick }) {
  const [shareStatus, setShareStatus] = useState(null); // null | 'copied' | 'shared'

  const handleShare = async () => {
    const status = await shareResult(food.name, category.label);
    if (status === 'copied') {
      setShareStatus('copied');
      setTimeout(() => setShareStatus(null), 2500);
    } else if (status === 'shared') {
      setShareStatus('shared');
      setTimeout(() => setShareStatus(null), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="flex flex-col items-center px-5 pb-10 w-full max-w-md mx-auto"
    >
      {/* Result card */}
      <div className="w-full bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
          className="text-7xl mb-4"
        >
          {food.emoji}
        </motion.div>

        <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-widest">
          {category.label}
        </p>
        <h2 className="text-3xl font-black text-gray-800 text-center mb-2">
          {food.name}
        </h2>
        <p className="text-gray-400 text-sm text-center">Cuba la makan ni! 😋</p>

        {/* Tags */}
        <div className="flex gap-2 mt-4 flex-wrap justify-center">
          {food.hungry === 'YES' && (
            <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
              Filling 🍚
            </span>
          )}
          {food.spicy === 'YES' && (
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
              Spicy 🌶️
            </span>
          )}
          {food.expensive === 'YES' ? (
            <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
              Premium 💎
            </span>
          ) : (
            <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
              Budget 💚
            </span>
          )}
        </div>
      </div>

      {/* Share button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleShare}
        className="w-full bg-white/20 hover:bg-white/30 border-2 border-white/30 text-white font-bold text-base rounded-2xl py-4 mb-3 transition-colors flex items-center justify-center gap-2"
      >
        {shareStatus === 'copied' ? '✅ Copied to clipboard!' :
         shareStatus === 'shared' ? '✅ Shared!' :
         <><span>📤</span> Share dengan member</>}
      </motion.button>

      {/* WhatsApp share */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => whatsappShare(food.name)}
        className="w-full bg-[#25D366]/80 hover:bg-[#25D366] text-white font-bold text-base rounded-2xl py-4 mb-3 transition-colors flex items-center justify-center gap-2"
      >
        <span>💬</span> Share via WhatsApp
      </motion.button>

      {/* Action buttons */}
      <div className="flex gap-3 w-full">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={onRestart}
          className="flex-1 bg-white/20 hover:bg-white/30 border-2 border-white/30 text-white font-semibold text-sm rounded-2xl py-3.5 transition-colors"
        >
          🔄 Cuba lagi
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={onFullRestart}
          className="flex-1 bg-white/20 hover:bg-white/30 border-2 border-white/30 text-white font-semibold text-sm rounded-2xl py-3.5 transition-colors"
        >
          🏠 Tukar kategori
        </motion.button>
      </div>

      <button
        onClick={onHistoryClick}
        className="mt-4 text-white/60 hover:text-white/90 text-sm underline underline-offset-2 transition-colors"
      >
        📋 Tengok history pilihan
      </button>
    </motion.div>
  );
}
