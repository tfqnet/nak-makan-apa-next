import { motion, AnimatePresence } from 'framer-motion';

function todayStreak(history) {
  const today = new Date().toDateString();
  return history.filter((h) => new Date(h.timestamp).toDateString() === today).length;
}

export default function Navbar({ onHistoryClick, onAboutClick, historyCount, history = [] }) {
  const streak = todayStreak(history);

  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-2 w-full max-w-md mx-auto">
      <button
        onClick={onAboutClick}
        className="text-white/60 hover:text-white transition-colors text-sm font-semibold"
      >
        About
      </button>

      {/* Centre: streak badge */}
      <AnimatePresence>
        {streak > 0 ? (
          <motion.button
            key="streak"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            onClick={onHistoryClick}
            className="flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3 py-1 backdrop-blur-sm"
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
              className="text-sm"
            >
              🔥
            </motion.span>
            <span className="text-white text-xs font-bold">{streak} hari ini</span>
          </motion.button>
        ) : (
          <span key="brand" className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
            Nak Makan Apa?
          </span>
        )}
      </AnimatePresence>

      <button
        onClick={onHistoryClick}
        className="relative text-white/60 hover:text-white transition-colors"
        aria-label="View history"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <AnimatePresence>
          {historyCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-white text-gray-800 text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center"
            >
              {historyCount > 9 ? '9+' : historyCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
