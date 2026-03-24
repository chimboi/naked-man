export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
}

export type GamePhase =
  | 'lobby'
  | 'reveal'
  | 'question'
  | 'waiting-for-answer'
  | 'answer-reveal'
  | 'guess'
  | 'waiting-for-guesses'
  | 'result'
  | 'personal-result'
  | 'scoreboard'
  | 'winner';

export interface GameState {
  sessionCode: string;
  players: Player[];
  currentRound: number;
  nakedManId: string | null;
  currentQuestionIndex: number;
  questionsUsed: number[];
  phase: GamePhase;
  currentAnswer: string;
  answers: Record<string, string>; // playerId -> answer (all players' answers)
  guesses: Record<string, string>; // guesserId -> guessedPlayerId
  roundQuestionCount: number; // 1, 2, or 3 within a round
  suddenDeath?: boolean; // true when players are tied at 7+
  suddenDeathPlayerIds?: string[]; // IDs of tied players in sudden death
  preRoundScores?: Record<string, number>; // scores before sudden death round
}

export type BroadcastEvent =
  | { type: 'player_joined'; player: Player }
  | { type: 'player_left'; playerId: string }
  | { type: 'game_started'; state: GameState }
  | { type: 'state_update'; state: GameState }
  | { type: 'answer_submitted'; answer: string }
  | { type: 'guess_submitted'; guesserId: string; guessedId: string };
