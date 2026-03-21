'use client';

import { motion } from 'framer-motion';
import type { Player } from '@/types/game';

interface RoundResultProps {
  players: Player[];
  nakedManId: string;
  guesses: Record<string, string>;
  onNext?: () => void;
}

export default function RoundResult({ players, nakedManId, guesses, onNext }: RoundResultProps) {
  const nakedMan = players.find(p => p.id === nakedManId);
  const correctGuessers = Object.entries(guesses)
    .filter(([, guessedId]) => guessedId === nakedManId)
    .map(([guesserId]) => guesserId);

  const totalGuessers = players.filter(p => p.id !== nakedManId).length;

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
        className="text-2xl font-bold text-gray-900 mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        El Naked Man era {nakedMan?.name}!
      </motion.h2>

      <motion.p
        className="text-gray-500 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {correctGuessers.length} de {totalGuessers} adivinaron
      </motion.p>

      <motion.div
        className="w-full bg-green-50 border border-green-200 rounded-xl p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {correctGuessers.length > 0 ? (
          <>
            <p className="text-green-700 font-medium">
              {nakedMan?.name} gana +{correctGuessers.length} pt{correctGuessers.length > 1 ? 's' : ''}
            </p>
            <p className="text-green-600 text-sm mt-1">
              {correctGuessers
                .map(id => players.find(p => p.id === id)?.name)
                .join(', ')}{' '}
              ganan +1 pt cada uno
            </p>
          </>
        ) : (
          <p className="text-green-700 font-medium">
            Nadie adivino! No hay puntos esta ronda.
          </p>
        )}
      </motion.div>

      {/* Mini scoreboard */}
      <motion.div
        className="w-full space-y-2 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {[...players].sort((a, b) => b.score - a.score).map(p => (
          <div key={p.id} className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">{p.name}</span>
            <span className="font-bold text-orange">{p.score} pts</span>
          </div>
        ))}
      </motion.div>

      {onNext && (
        <button
          onClick={onNext}
          className="w-full py-4 bg-orange text-white font-semibold text-lg rounded-xl active:scale-95 transition-all"
        >
          Siguiente ronda
        </button>
      )}
    </motion.div>
  );
}
