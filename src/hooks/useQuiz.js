import { useState, useCallback } from 'react';
import { generateSuggestion } from '../utils/generateSuggestion';

// phases: 'select' → 'quiz' → 'spinning' → 'result'
export function useQuiz() {
  const [phase, setPhase] = useState('select');
  const [category, setCategory] = useState(null);
  const [step, setStep] = useState(0); // 0-2 (question index)
  const [answers, setAnswers] = useState({ hungry: '', spicy: '', expensive: '' });
  const [result, setResult] = useState(null); // { food, candidates }

  const QUESTIONS = [
    { key: 'hungry', text: 'Lapar gila tak?', subtext: 'Are you very hungry?' },
    { key: 'spicy', text: 'Nak pedas?', subtext: 'Feeling spicy today?' },
    { key: 'expensive', text: 'Bajet ke splurge?', subtext: 'Budget or willing to spend?' },
  ];

  const selectCategory = useCallback((cat) => {
    setCategory(cat);
    setPhase('quiz');
    setStep(0);
    setAnswers({ hungry: '', spicy: '', expensive: '' });
    setResult(null);
  }, []);

  const answerQuestion = useCallback((answer) => {
    const currentKey = QUESTIONS[step].key;
    const newAnswers = { ...answers, [currentKey]: answer };
    setAnswers(newAnswers);

    if (step === QUESTIONS.length - 1) {
      // All questions answered — generate result and go to spinning
      const suggestion = generateSuggestion(category.id, newAnswers);
      setResult(suggestion);
      setPhase('spinning');
    } else {
      setStep((s) => s + 1);
    }
  }, [step, answers, category]);

  const finishSpinning = useCallback(() => {
    setPhase('result');
  }, []);

  const restart = useCallback(() => {
    // Keep same category, restart quiz
    setPhase('quiz');
    setStep(0);
    setAnswers({ hungry: '', spicy: '', expensive: '' });
    setResult(null);
  }, []);

  const fullRestart = useCallback(() => {
    setPhase('select');
    setCategory(null);
    setStep(0);
    setAnswers({ hungry: '', spicy: '', expensive: '' });
    setResult(null);
  }, []);

  return {
    phase,
    category,
    step,
    answers,
    result,
    questions: QUESTIONS,
    selectCategory,
    answerQuestion,
    finishSpinning,
    restart,
    fullRestart,
  };
}
