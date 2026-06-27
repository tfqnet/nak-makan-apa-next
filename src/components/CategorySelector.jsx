import { motion } from 'framer-motion';
import { CATEGORIES } from '../data/categories';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function CategorySelector({ onSelect }) {
  return (
    <div className="flex flex-col items-center px-5 pb-8 w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-black text-white mb-2">Nak Makan Apa?</h1>
        <p className="text-white/70 text-base">Pilih jenis makanan dulu</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 w-full"
      >
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            variants={item}
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => onSelect(cat)}
            className={`${cat.bg} rounded-2xl p-4 flex flex-col items-start shadow-lg text-left active:opacity-90 transition-opacity`}
          >
            <span className="text-3xl mb-2">{cat.emoji}</span>
            <span className="text-white font-bold text-base leading-tight">{cat.label}</span>
            <span className="text-white/70 text-xs mt-0.5 leading-snug">{cat.description}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
