import { motion } from 'framer-motion';
import { CATEGORIES } from '../data/categories';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

// Decorative floating circles per category for visual texture
const DECOR = {
  mamak:    { circles: ['top-2 right-3', 'bottom-4 right-10', 'top-8 right-16'], color: 'bg-white/10' },
  western:  { circles: ['top-3 right-4', 'bottom-3 right-12', 'top-10 right-20'], color: 'bg-white/10' },
  thai:     { circles: ['top-2 right-5', 'bottom-5 right-8', 'top-6 right-18'], color: 'bg-white/10' },
  chinese:  { circles: ['top-3 right-3', 'bottom-4 right-14', 'top-9 right-20'], color: 'bg-white/10' },
  japanese: { circles: ['top-2 right-6', 'bottom-3 right-10', 'top-8 right-22'], color: 'bg-white/10' },
  fastfood: { circles: ['top-3 right-2', 'bottom-5 right-12', 'top-7 right-18'], color: 'bg-white/10' },
  indian:   { circles: ['top-2 right-4', 'bottom-4 right-9', 'top-9 right-17'], color: 'bg-white/10' },
};

const SIZES = ['w-16 h-16', 'w-10 h-10', 'w-7 h-7'];

export default function CategorySelector({ onSelect }) {
  return (
    <div className="flex flex-col items-center px-5 pb-8 w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-5xl mb-3"
        >
          🍽️
        </motion.div>
        <h1 className="text-4xl font-black text-white drop-shadow-md mb-1">Nak Makan Apa?</h1>
        <p className="text-white/60 text-sm font-medium">Pilih jenis makanan dulu 👇</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 w-full"
      >
        {CATEGORIES.map((cat) => {
          const decor = DECOR[cat.id];
          return (
            <motion.button
              key={cat.id}
              variants={item}
              whileTap={{ scale: 0.91 }}
              whileHover={{ scale: 1.04, y: -2 }}
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(8);
                onSelect(cat);
              }}
              className={`${cat.bg} relative overflow-hidden rounded-2xl p-4 flex flex-col items-start text-left shadow-lg`}
            >
              {/* Decorative circles */}
              {decor.circles.map((pos, i) => (
                <span
                  key={i}
                  className={`absolute rounded-full ${decor.color} ${pos} ${SIZES[i]} pointer-events-none`}
                />
              ))}

              {/* Emoji with float animation */}
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.4 + Math.random(), ease: 'easeInOut' }}
                className="text-4xl mb-3 relative z-10 drop-shadow"
              >
                {cat.emoji}
              </motion.span>

              <span className="text-white font-black text-base leading-tight relative z-10 drop-shadow">
                {cat.label}
              </span>
              <span className="text-white/70 text-xs mt-0.5 leading-snug relative z-10">
                {cat.description}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
