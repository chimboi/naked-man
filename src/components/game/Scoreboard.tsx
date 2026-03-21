'use client';

import { motion } from 'framer-motion';
import type { Player } from '@/types/game';

interface ScoreboardProps {
  players: Player[];
  winner?: Player;
  onNextRound?: () => void;
  onPlayAgain?: () => void;
}

export default function Scoreboard({ players, winner, onNextRound, onPlayAgain }: ScoreboardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <motion.div
      className="flex flex-col items-center w-full max-w-sm text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {winner ? (
        <>
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            🏆
          </motion.div>
          <motion.h1
            className="text-3xl font-extrabold text-orange mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.5 }}
          >
            {winner.name} gana!
          </motion.h1>
          <p className="text-gray-500 mb-8">
            La persona mas vulnerable y autentica
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tabla de posiciones</h2>
          <p className="text-gray-500 text-sm mb-6">Primer jugador en llegar a 5 puntos gana</p>
        </>
      )}

      <div className="w-full space-y-3 mb-8">
        {sorted.map((player, i) => (
          <motion.div
            key={player.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
              winner?.id === player.id ? 'bg-orange/10 border-2 border-orange' : 'bg-gray-50'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="text-lg font-bold text-gray-400 w-6">{i + 1}</span>
            <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center text-white font-bold">
              {player.name[0].toUpperCase()}
            </div>
            <span className="font-medium text-gray-900 flex-1 text-left">{player.name}</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-orange rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(player.score / 5) * 100}%` }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                />
              </div>
              <span className="font-bold text-orange text-sm w-8">{player.score}/5</span>
            </div>
          </motion.div>
        ))}
      </div>

      {onNextRound && (
        <button
          onClick={onNextRound}
          className="w-full py-4 bg-orange text-white font-semibold text-lg rounded-xl active:scale-95 transition-all"
        >
          Siguiente ronda
        </button>
      )}

      {onPlayAgain && (
        <button
          onClick={onPlayAgain}
          className="w-full py-4 bg-orange text-white font-semibold text-lg rounded-xl active:scale-95 transition-all"
        >
          Jugar de nuevo
        </button>
      )}
    </motion.div>
  );
}
