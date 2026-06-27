import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef } from 'react';
import ProgressBar from './ProgressBar';

const SWIPE_THRESHOLD = 100;

export default function QuestionCard({ question, step, total, onAnswer, categoryBg }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const yesOpacity = useTransform(x, [20, 100], [0, 1]);
  const noOpacity = useTransform(x, [-100, -20], [1, 0]);

  const isDragging = useRef(false);

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    if (offset > SWIPE_THRESHOLD) {
      animate(x, 500, { duration: 0.3 });
      setTimeout(() => { x.set(0); onAnswer('YES'); }, 300);
    } else if (offset < -SWIPE_THRESHOLD) {
      animate(x, -500, { duration: 0.3 });
      setTimeout(() => { x.set(0); onAnswer('NO'); }, 300);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  };

  return (
    <div className="flex flex-col items-center px-5 pb-8 w-full max-w-md mx-auto select-none">
      <ProgressBar current={step} total={total} />

      <div className="relative w-full flex justify-center items-center" style={{ height: 340 }}>
        {/* YES label */}
        <motion.div
          style={{ opacity: yesOpacity }}
          className="absolute left-4 top-8 z-10 border-4 border-emerald-400 rounded-xl px-4 py-1 rotate-[-20deg]"
        >
          <span className="text-emerald-400 font-black text-2xl tracking-wider">YES</span>
        </motion.div>

        {/* NO label */}
        <motion.div
          style={{ opacity: noOpacity }}
          className="absolute right-4 top-8 z-10 border-4 border-rose-400 rounded-xl px-4 py-1 rotate-[20deg]"
        >
          <span className="text-rose-400 font-black text-2xl tracking-wider">NO</span>
        </motion.div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          style={{ x, rotate, height: 300 }}
          onDragEnd={handleDragEnd}
          onDragStart={() => { isDragging.current = true; }}
          className="swipe-card absolute w-full bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center"
        >
          <p className="text-5xl mb-4">🤔</p>
          <h2 className="text-2xl font-black text-gray-800 text-center mb-2">
            {question.text}
          </h2>
          <p className="text-gray-400 text-sm text-center">{question.subtext}</p>
          <p className="text-gray-300 text-xs text-center mt-6">← swipe or tap below →</p>
        </motion.div>
      </div>

      {/* Tap buttons */}
      <div className="flex gap-4 w-full mt-2">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => onAnswer('NO')}
          className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-2xl py-4 border-2 border-white/30 transition-colors"
        >
          <span>👈</span> No
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => onAnswer('YES')}
          className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-2xl py-4 border-2 border-white/30 transition-colors"
        >
          Yes <span>👉</span>
        </motion.button>
      </div>
    </div>
  );
}
