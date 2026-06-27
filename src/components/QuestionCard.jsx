import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef } from 'react';
import ProgressBar from './ProgressBar';

const SWIPE_THRESHOLD = 100;

const QUESTION_META = {
  hungry: { emoji: '🍽️', color: 'from-orange-400 to-amber-400', hint: 'Swipe kanan = Yes, kiri = No' },
  spicy:  { emoji: '🌶️', color: 'from-red-400 to-rose-500',    hint: 'Swipe kanan = Yes, kiri = No' },
  expensive: { emoji: '💸', color: 'from-violet-400 to-purple-500', hint: 'Swipe kanan = Splurge, kiri = Bajet' },
};

function haptic(ms = 10) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

export default function QuestionCard({ question, step, total, onAnswer }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-28, 28]);

  // Card background tint as it drags
  const yesOpacity = useTransform(x, [30, 120], [0, 1]);
  const noOpacity  = useTransform(x, [-120, -30], [1, 0]);
  const greenTint  = useTransform(x, [0, 120], [0, 0.18]);
  const redTint    = useTransform(x, [-120, 0], [0.18, 0]);

  const meta = QUESTION_META[question.key] || { emoji: '🤔', color: 'from-gray-400 to-gray-500', hint: '' };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    if (offset > SWIPE_THRESHOLD) {
      haptic(12);
      animate(x, 600, { duration: 0.28 });
      setTimeout(() => { x.set(0); onAnswer('YES'); }, 280);
    } else if (offset < -SWIPE_THRESHOLD) {
      haptic(12);
      animate(x, -600, { duration: 0.28 });
      setTimeout(() => { x.set(0); onAnswer('NO'); }, 280);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 420, damping: 30 });
    }
  };

  const handleTap = (answer) => {
    haptic(8);
    onAnswer(answer);
  };

  return (
    <div className="flex flex-col items-center px-5 pb-8 w-full max-w-md mx-auto select-none">
      <ProgressBar current={step} total={total} />

      <div className="relative w-full flex justify-center items-center mb-4" style={{ height: 320 }}>

        {/* YES stamp */}
        <motion.div
          style={{ opacity: yesOpacity }}
          className="absolute left-3 top-6 z-20 border-[3px] border-emerald-400 rounded-xl px-3 py-1 rotate-[-18deg] pointer-events-none"
        >
          <span className="text-emerald-400 font-black text-xl tracking-widest">YES!</span>
        </motion.div>

        {/* NO stamp */}
        <motion.div
          style={{ opacity: noOpacity }}
          className="absolute right-3 top-6 z-20 border-[3px] border-rose-400 rounded-xl px-3 py-1 rotate-[18deg] pointer-events-none"
        >
          <span className="text-rose-400 font-black text-xl tracking-widest">NOPE</span>
        </motion.div>

        {/* Card */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.65}
          style={{ x, rotate, height: 290 }}
          onDragEnd={handleDragEnd}
          className="swipe-card absolute w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Green tint overlay */}
          <motion.div
            style={{ opacity: greenTint }}
            className="absolute inset-0 bg-emerald-400 pointer-events-none z-10"
          />
          {/* Red tint overlay */}
          <motion.div
            style={{ opacity: redTint }}
            className="absolute inset-0 bg-rose-400 pointer-events-none z-10"
          />

          {/* Gradient top strip */}
          <div className={`bg-gradient-to-r ${meta.color} h-2 w-full flex-shrink-0`} />

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 pb-4 relative z-0">
            <motion.span
              key={question.key}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-6xl mb-5 block drop-shadow"
            >
              {meta.emoji}
            </motion.span>

            <h2 className="text-2xl font-black text-gray-800 text-center mb-2 leading-tight">
              {question.text}
            </h2>
            <p className="text-gray-400 text-sm text-center leading-snug">{question.subtext}</p>

            <p className="text-gray-300 text-[11px] text-center mt-5 font-medium tracking-wide">
              {meta.hint}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Tap buttons */}
      <div className="flex gap-3 w-full">
        <motion.button
          whileTap={{ scale: 0.91 }}
          onClick={() => handleTap('NO')}
          className="flex-1 flex items-center justify-center gap-2 bg-white/15 active:bg-white/25 text-white font-bold text-base rounded-2xl py-4 border-2 border-white/25 transition-colors backdrop-blur-sm"
        >
          <span className="text-xl">👈</span>
          <span>No</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.91 }}
          onClick={() => handleTap('YES')}
          className="flex-1 flex items-center justify-center gap-2 bg-white/15 active:bg-white/25 text-white font-bold text-base rounded-2xl py-4 border-2 border-white/25 transition-colors backdrop-blur-sm"
        >
          <span>Yes</span>
          <span className="text-xl">👉</span>
        </motion.button>
      </div>
    </div>
  );
}
