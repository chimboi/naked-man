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
      className="fixed inset-0 flex flex-col w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4">
        <div className="max-w-sm mx-auto flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Quien es el Naked Man?
          </h2>
          <p className="text-gray-500 text-sm mb-6 text-center">
            Selecciona quien crees que respondio
          </p>

          {/* Question with orange background */}
          <div className="w-full bg-orange rounded-2xl p-5 mb-3">
            <p className="text-base font-bold text-white leading-relaxed">{question}</p>
          </div>

          {/* Answer */}
          <div className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden mb-6">
            {answer.startsWith('data:image') ? (
              <img src={answer} alt="Dibujo" className="w-full" />
            ) : (
              <p className="text-lg font-medium text-gray-900 italic p-5">&ldquo;{answer}&rdquo;</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
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
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="px-6 pb-8 pt-3 bg-white max-w-sm mx-auto w-full">
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full py-4 bg-orange text-white font-semibold text-lg rounded-xl active:scale-95 transition-all disabled:opacity-40"
        >
          Confirmar
        </button>
      </div>
    </motion.div>
  );
}
