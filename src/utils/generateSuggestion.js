import { foodData } from '../data/foodData';

export function generateSuggestion(categoryId, answers) {
  const list = foodData[categoryId] || [];

  const matches = list.filter(
    (f) =>
      f.hungry === answers.hungry &&
      f.spicy === answers.spicy &&
      f.expensive === answers.expensive
  );

  // Fallback: relax the expensive constraint if no exact match
  const candidates = matches.length > 0
    ? matches
    : list.filter(
        (f) => f.hungry === answers.hungry && f.spicy === answers.spicy
      );

  // Final fallback: just use entire category
  const pool = candidates.length > 0 ? candidates : list;

  const food = pool[Math.floor(Math.random() * pool.length)];
  return { food, candidates: pool };
}
