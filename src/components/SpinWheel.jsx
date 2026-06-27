import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ITEM_HEIGHT = 64;
const SPIN_DURATION = 2600;

function haptic(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

export default function SpinWheel({ candidates, result, onDone }) {
  const [done, setDone] = useState(false);
  const drumRef = useRef(null);

  const buildDrumList = () => {
    // Need enough items to scroll past — at least 20 before the result
    const pool = [];
    while (pool.length < 20) {
      const shuffled = [...candidates].sort(() => Math.random() - 0.5);
      pool.push(...shuffled);
    }
    pool.push(result); // result is always last
    return pool;
  };

  const drumList = useRef(buildDrumList());
  const resultIndex = drumList.current.length - 1;

  useEffect(() => {
    haptic(20);

    // Center the result in the highlight window:
    // highlight sits at top: ITEM_HEIGHT, so center = ITEM_HEIGHT + ITEM_HEIGHT/2
    // result top = resultIndex * ITEM_HEIGHT
    // after translateY(offset): resultIndex * ITEM_HEIGHT + offset = ITEM_HEIGHT (top of highlight)
    // → offset = ITEM_HEIGHT - resultIndex * ITEM_HEIGHT
    const targetOffset = ITEM_HEIGHT - resultIndex * ITEM_HEIGHT;

    // Double rAF: let the browser paint the element in its start state first,
    // THEN apply the transition + transform so the animation actually runs.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!drumRef.current) return;
        drumRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.02, 0.85, 0.1, 1)`;
        drumRef.current.style.transform = `translateY(${targetOffset}px)`;
      });
    });

    // Periodic haptic ticks while spinning
    let ticks = 0;
    const tickInterval = setInterval(() => {
      ticks++;
      haptic(6);
      if (ticks >= 12) clearInterval(tickInterval);
    }, 180);

    const timer = setTimeout(() => {
      clearInterval(tickInterval);
      haptic([40, 20, 80]);
      setDone(true);
      setTimeout(onDone, 650);
    }, SPIN_DURATION + 100);

    return () => {
      clearTimeout(timer);
      clearInterval(tickInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-5 pb-8 w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key="spinning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col items-center"
          >
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.1 }}
              className="text-white font-bold text-base mb-5 tracking-wide"
            >
              🎰 Tunggu sekejap...
            </motion.p>

            {/* Drum window */}
            <div
              className="relative w-full max-w-xs mx-auto overflow-hidden rounded-2xl bg-black/25 border-2 border-white/20"
              style={{ height: ITEM_HEIGHT * 3 }}
            >
              {/* Top & bottom fades */}
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />

              {/* Centre highlight slot */}
              <div
                className="absolute inset-x-0 bg-white/15 border-y-2 border-white/40 pointer-events-none z-10"
                style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
              />

              {/* Scrolling strip */}
              <div ref={drumRef} className="absolute inset-x-0 top-0 will-change-transform">
                {drumList.current.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center gap-3 px-5"
                    style={{ height: ITEM_HEIGHT }}
                  >
                    <span className="text-2xl leading-none">{item.emoji}</span>
                    <span className="text-white font-semibold text-sm truncate max-w-[180px]">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 360, damping: 20 }}
            className="flex flex-col items-center py-8"
          >
            <div className="relative flex items-center justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="absolute w-36 h-36 rounded-full bg-white/30 blur-xl"
              />
              <span className="relative text-8xl drop-shadow-xl">{result.emoji}</span>
            </div>
            <h2 className="text-white text-3xl font-black text-center drop-shadow">
              {result.name}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
