'use client';

import { motion } from 'framer-motion';
import type { Player } from '@/types/game';

interface PersonalResultProps {
  players: Player[];
  nakedManId: string;
  playerId: string;
  guesses: Record<string, string>;
  onNext?: () => void;
}

export default function PersonalResult({ players, nakedManId, playerId, guesses, onNext }: PersonalResultProps) {
  const nakedMan = players.find(p => p.id === nakedManId);
  const isNakedMan = playerId === nakedManId;

  const correctGuessers = Object.entries(guesses)
    .filter(([, guessedId]) => guessedId === nakedManId)
    .map(([guesserId]) => guesserId);

  const playerGuessedCorrectly = correctGuessers.includes(playerId);
  const nakedManPoints = Math.min(correctGuessers.length, 2);

  return (
    <motion.div
      className="flex flex-col items-center w-full max-w-sm text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-orange flex items-center justify-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, delay: 0.2 }}
      >
        <span className="text-4xl text-white font-extrabold">
          {nakedMan?.name[0].toUpperCase()}
        </span>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-900 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        El Naked Man era {nakedMan?.name}!
      </motion.h2>

      {/* Personal result */}
      <motion.div
        className="w-full mt-6 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {isNakedMan ? (
          <div className={`rounded-2xl p-6 ${nakedManPoints > 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <motion.p
              className={`text-4xl font-extrabold mb-2 ${nakedManPoints > 0 ? 'text-green-600' : 'text-gray-400'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
            >
              +{nakedManPoints}
            </motion.p>
            <p className={`font-medium ${nakedManPoints > 0 ? 'text-green-700' : 'text-gray-500'}`}>
              {nakedManPoints > 0
                ? `${correctGuessers.length} persona${correctGuessers.length > 1 ? 's' : ''} te adivino${correctGuessers.length > 1 ? 'aron' : ''}`
                : 'Nadie te adivino. 0 puntos esta ronda.'}
            </p>
          </div>
        ) : (
          <div className={`rounded-2xl p-6 ${playerGuessedCorrectly ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <motion.p
              className={`text-4xl font-extrabold mb-2 ${playerGuessedCorrectly ? 'text-green-600' : 'text-red-400'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
            >
              {playerGuessedCorrectly ? '+1' : '+0'}
            </motion.p>
            <p className={`font-medium ${playerGuessedCorrectly ? 'text-green-700' : 'text-red-500'}`}>
              {playerGuessedCorrectly
                ? 'Adivinaste correctamente!'
                : 'No adivinaste esta vez'}
            </p>
          </div>
        )}
      </motion.div>

      {onNext && (
        <button
          onClick={onNext}
          className="w-full py-4 bg-orange text-white font-semibold text-lg rounded-xl active:scale-95 transition-all"
        >
          Ver resultados
        </button>
      )}
    </motion.div>
  );
}
