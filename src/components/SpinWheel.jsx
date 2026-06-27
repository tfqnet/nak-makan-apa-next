import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ITEM_HEIGHT = 60;
const SPIN_DURATION = 2400;

function haptic(ms = 15) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

export default function SpinWheel({ candidates, result, onDone }) {
  const [done, setDone] = useState(false);
  const drumRef = useRef(null);

  const buildDrumList = () => {
    const pool = [...candidates, ...candidates, ...candidates, ...candidates];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const items = pool.slice(0, 16);
    items.push(result);
    return items;
  };

  const drumList = useRef(buildDrumList());
  const resultIndex = drumList.current.length - 1;

  useEffect(() => {
    haptic(20);
    const targetOffset = -(resultIndex * ITEM_HEIGHT - ITEM_HEIGHT * 2);

    if (drumRef.current) {
      drumRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.05, 0.9, 0.1, 1)`;
      drumRef.current.style.transform = `translateY(${targetOffset}px)`;
    }

    // Tick haptics every ~200ms while spinning
    let ticks = 0;
    const tickInterval = setInterval(() => {
      ticks++;
      haptic(6);
      if (ticks > 10) clearInterval(tickInterval);
    }, 200);

    const timer = setTimeout(() => {
      clearInterval(tickInterval);
      haptic([30, 30, 60]); // landing thud
      setDone(true);
      setTimeout(onDone, 700);
    }, SPIN_DURATION);

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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center"
          >
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="text-white font-bold text-base mb-5 tracking-wide"
            >
              🎰 Tunggu sekejap...
            </motion.p>

            {/* Drum window */}
            <div
              className="relative w-full max-w-xs mx-auto overflow-hidden rounded-2xl bg-black/25 border-2 border-white/20 shadow-inner"
              style={{ height: ITEM_HEIGHT * 3 }}
            >
              {/* Top fade */}
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none" />
              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />

              {/* Selection highlight */}
              <div
                className="absolute inset-x-0 bg-white/20 border-y-2 border-white/50 pointer-events-none z-10"
                style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
              />

              <div ref={drumRef} className="absolute inset-x-0 top-0">
                {drumList.current.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center gap-3 px-5"
                    style={{ height: ITEM_HEIGHT }}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-white font-semibold text-sm truncate max-w-[180px]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            className="flex flex-col items-center py-8"
          >
            {/* Pulsing glow ring */}
            <div className="relative flex items-center justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute w-32 h-32 rounded-full bg-white/30 blur-md"
              />
              <span className="relative text-8xl drop-shadow-xl">{result.emoji}</span>
            </div>
            <h2 className="text-white text-3xl font-black text-center drop-shadow">{result.name}</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
