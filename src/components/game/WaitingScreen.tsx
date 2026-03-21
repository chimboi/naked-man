'use client';

import { motion } from 'framer-motion';
import type { Player } from '@/types/game';

interface WaitingScreenProps {
  message: string;
  showStartButton?: boolean;
  onStart?: () => void;
  players?: Player[];
}

export default function WaitingScreen({ message, showStartButton, onStart, players }: WaitingScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center w-full max-w-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-16 h-16 border-4 border-orange/30 border-t-orange rounded-full mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />

      <p className="text-xl font-medium text-gray-700 mb-8">{message}</p>

      {players && players.length > 0 && (
        <div className="w-full mb-8">
          <p className="text-sm text-gray-400 mb-3">{players.length} jugadores</p>
          <div className="flex flex-wrap justify-center gap-2">
            {players.map(p => (
              <span
                key={p.id}
                className="bg-orange/10 text-orange px-3 py-1 rounded-full text-sm font-medium"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {showStartButton && onStart && (
        <button
          onClick={onStart}
          className="w-full py-4 bg-orange text-white font-semibold text-lg rounded-xl hover:bg-orange-dark active:scale-95 transition-all duration-200"
        >
          Iniciar juego
        </button>
      )}
    </motion.div>
  );
}
