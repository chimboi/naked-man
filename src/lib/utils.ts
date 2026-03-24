export function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getPlayerId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('nakedman_player_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('nakedman_player_id', id);
  }
  return id;
}

export function pickRandomQuestion(usedIndices: number[], totalQuestions: number): number {
  const available = Array.from({ length: totalQuestions }, (_, i) => i)
    .filter(i => !usedIndices.includes(i));
  if (available.length === 0) return Math.floor(Math.random() * totalQuestions);
  return available[Math.floor(Math.random() * available.length)];
}

export function pickRandomPlayer(playerIds: string[], excludeIds: string[] = []): string {
  const available = playerIds.filter(id => !excludeIds.includes(id));
  return available[Math.floor(Math.random() * available.length)];
}

export function calculateScore(
  guesses: Record<string, string>,
  nakedManId: string,
): { nakedManPoints: number; correctGuessers: string[] } {
  const correctGuessers = Object.entries(guesses)
    .filter(([guesserId, guessedId]) => guesserId !== nakedManId && guessedId === nakedManId)
    .map(([guesserId]) => guesserId);

  return {
    nakedManPoints: Math.min(correctGuessers.length, 3), // max 3 points
    correctGuessers, // each correct guesser gets 1 point
  };
}
