'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Player } from '@/types/game';

interface GuessScreenProps {
  players: Player[];
  question: string;
  answer: string;
  onGuess: (guessedId: string) => void;
}

export default function GuessScreen({ players, question, answer, onGuess }: GuessScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    onGuess(selected);
  };

  if (confirmed) {
    return (
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-5xl mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5 }}
        >
          👀
        </motion.div>
        <p className="text-xl font-medium text-gray-700">Respuesta enviada!</p>
        <p className="text-gray-400 mt-2">Esperando a los demas...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center w-full max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Show question + answer for context */}
      <div className="w-full bg-gray-50 rounded-xl p-4 mb-2">
        <p className="text-sm font-medium text-gray-500 mb-1">Pregunta:</p>
        <p className="text-sm text-gray-700">{question}</p>
      </div>
      <div className="w-full bg-orange/5 border border-orange/20 rounded-xl p-4 mb-6">
        <p className="text-sm font-medium text-orange/70 mb-1">Respuesta:</p>
        <p className="text-sm text-gray-800 italic">&ldquo;{answer}&rdquo;</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Quien es el Naked Man?
      </h2>
      <p className="text-gray-500 text-sm mb-6 text-center">
        Selecciona quien crees que respondio
      </p>

      <div className="grid grid-cols-2 gap-3 w-full mb-6">
        {players.map((player, i) => (
          <motion.button
            key={player.id}
            onClick={() => setSelected(player.id)}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
              selected === player.id
                ? 'border-orange bg-orange/10'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-2 ${
                selected === player.id
                  ? 'bg-orange text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {player.name[0].toUpperCase()}
            </div>
            <span className={`text-sm font-medium ${
              selected === player.id ? 'text-orange' : 'text-gray-700'
            }`}>
              {player.name}
            </span>
          </motion.button>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!selected}
        className="w-full py-4 bg-orange text-white font-semibold text-lg rounded-xl active:scale-95 transition-all disabled:opacity-40"
      >
        Confirmar
      </button>
    </motion.div>
  );
}
