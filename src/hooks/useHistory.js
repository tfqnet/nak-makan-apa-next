import { useState, useCallback } from 'react';

const STORAGE_KEY = 'nmapa_history';
const MAX_HISTORY = 50;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useHistory() {
  const [history, setHistory] = useState(loadHistory);

  const addPick = useCallback((food, categoryId, categoryLabel) => {
    const entry = {
      id: Date.now(),
      food,
      categoryId,
      categoryLabel,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addPick, clearHistory };
}
