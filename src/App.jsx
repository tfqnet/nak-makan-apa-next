import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useQuiz } from './hooks/useQuiz';
import { useHistory } from './hooks/useHistory';

import Navbar from './components/Navbar';
import CategorySelector from './components/CategorySelector';
import QuestionCard from './components/QuestionCard';
import SpinWheel from './components/SpinWheel';
import ResultCard from './components/ResultCard';
import HistoryDrawer from './components/HistoryDrawer';
import AboutPage from './pages/AboutPage';

// Background gradient per category
const CATEGORY_GRADIENTS = {
  mamak: 'from-amber-400 to-orange-500',
  western: 'from-indigo-500 to-purple-600',
  thai: 'from-green-400 to-teal-500',
  chinese: 'from-red-500 to-rose-600',
  japanese: 'from-pink-400 to-fuchsia-500',
  fastfood: 'from-yellow-400 to-orange-400',
  indian: 'from-orange-500 to-amber-600',
  default: 'from-violet-500 to-purple-700',
};

export default function App() {
  const quiz = useQuiz();
  const { history, addPick, clearHistory } = useHistory();
  const [page, setPage] = useState('main'); // 'main' | 'about'
  const [historyOpen, setHistoryOpen] = useState(false);

  const bgGradient = quiz.category
    ? CATEGORY_GRADIENTS[quiz.category.id] || CATEGORY_GRADIENTS.default
    : CATEGORY_GRADIENTS.default;

  // Save result to history when spinning finishes and result is shown
  useEffect(() => {
    if (quiz.phase === 'result' && quiz.result) {
      addPick(quiz.result.food, quiz.category.id, quiz.category.label);
    }
  }, [quiz.phase]);

  if (page === 'about') {
    return <AboutPage onBack={() => setPage('main')} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-700 flex flex-col`}>
      <Navbar
        onHistoryClick={() => setHistoryOpen(true)}
        onAboutClick={() => setPage('about')}
        historyCount={history.length}
        history={history}
      />

      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {quiz.phase === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <CategorySelector onSelect={quiz.selectCategory} />
            </motion.div>
          )}

          {quiz.phase === 'quiz' && (
            <motion.div
              key={`quiz-${quiz.step}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            >
              <QuestionCard
                question={quiz.questions[quiz.step]}
                step={quiz.step}
                total={quiz.questions.length}
                onAnswer={quiz.answerQuestion}
                categoryBg={bgGradient}
              />
            </motion.div>
          )}

          {quiz.phase === 'spinning' && (
            <motion.div
              key="spinning"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SpinWheel
                candidates={quiz.result.candidates}
                result={quiz.result.food}
                onDone={quiz.finishSpinning}
              />
            </motion.div>
          )}

          {quiz.phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResultCard
                food={quiz.result.food}
                category={quiz.category}
                onRestart={quiz.restart}
                onFullRestart={quiz.fullRestart}
                onHistoryClick={() => setHistoryOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <HistoryDrawer
        isOpen={historyOpen}
        history={history}
        onClose={() => setHistoryOpen(false)}
        onClear={clearHistory}
      />
    </div>
  );
}
