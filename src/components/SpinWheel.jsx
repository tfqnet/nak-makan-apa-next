import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ITEM_HEIGHT = 56; // px per item in the drum roll
const SPIN_DURATION = 2200; // ms

export default function SpinWheel({ candidates, result, onDone }) {
  const [done, setDone] = useState(false);
  const drumRef = useRef(null);

  // Build a long list ending with the result for the scroll stop effect
  const buildDrumList = () => {
    const items = [];
    // Fill with random shuffled items to make it look like it's spinning
    const pool = [...candidates, ...candidates, ...candidates];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    items.push(...pool.slice(0, 12));
    items.push(result); // always lands on result
    return items;
  };

  const drumList = useRef(buildDrumList());
  const resultIndex = drumList.current.length - 1;

  useEffect(() => {
    const targetOffset = -(resultIndex * ITEM_HEIGHT - ITEM_HEIGHT * 2);

    // Animate the drum strip upward
    if (drumRef.current) {
      drumRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.1, 0.8, 0.2, 1)`;
      drumRef.current.style.transform = `translateY(${targetOffset}px)`;
    }

    const timer = setTimeout(() => {
      setDone(true);
      setTimeout(onDone, 600);
    }, SPIN_DURATION);

    return () => clearTimeout(timer);
  }, []);

  if (done) {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="flex flex-col items-center justify-center px-5 py-12"
      >
        <span className="text-7xl mb-4">{result.emoji}</span>
        <h2 className="text-white text-3xl font-black text-center">{result.name}</h2>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-5 pb-8 w-full max-w-md mx-auto">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white/80 font-semibold text-base mb-6 text-center"
      >
        🎰 Tunggu sekejap...
      </motion.p>

      {/* Drum window */}
      <div className="relative w-full max-w-xs mx-auto overflow-hidden rounded-2xl bg-black/20 border-2 border-white/20"
        style={{ height: ITEM_HEIGHT * 3 }}>

        {/* Highlight strip for the selected item */}
        <div
          className="absolute inset-x-0 bg-white/20 border-y-2 border-white/40 pointer-events-none z-10"
          style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
        />

        <div ref={drumRef} className="absolute inset-x-0 top-0">
          {drumList.current.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-3 px-4"
              style={{ height: ITEM_HEIGHT }}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-white font-semibold text-base truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
