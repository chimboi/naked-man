'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Player, GameState } from '@/types/game';

interface JoinGameModalProps {
  onClose: () => void;
}

export default function JoinGameModal({ onClose }: JoinGameModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (!code.trim() || !name.trim()) {
      setError('Ingresa el codigo y tu nombre');
      return;
    }

    setLoading(true);
    setError('');

    const upperCode = code.trim().toUpperCase();

    // Fetch current game state
    const { data, error: dbError } = await supabase
      .from('game_sessions')
      .select('state')
      .eq('id', upperCode)
      .single();

    if (dbError || !data) {
      setError('No se encontro un juego con ese codigo');
      setLoading(false);
      return;
    }

    // Always generate a fresh ID for joining (avoids same-browser conflicts)
    const playerId = crypto.randomUUID();
    const currentState = (data.state || {}) as Partial<GameState>;
    const existingPlayers = currentState.players || [];

    // Add player to the state in DB
    const newPlayer: Player = {
      id: playerId,
      name: name.trim(),
      score: 0,
      isHost: false,
    };

    const updatedState = {
      ...currentState,
      players: [...existingPlayers, newPlayer],
    };

    const { error: updateError } = await supabase
      .from('game_sessions')
      .update({ state: updatedState })
      .eq('id', upperCode);

    if (updateError) {
      setError('Error al unirse al juego');
      setLoading(false);
      return;
    }

    localStorage.setItem('nakedman_player_name', name.trim());
    router.push(`/game/${upperCode}?playerId=${playerId}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-8 pb-10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 sm:hidden" />

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Unirme a juego
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Codigo del juego
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold tracking-widest text-gray-900 focus:border-orange focus:outline-none transition-colors uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tu nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como te llamas?"
                maxLength={20}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-orange focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <motion.p
                className="text-red-500 text-sm text-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full py-4 bg-orange text-white font-semibold text-lg rounded-xl hover:bg-orange-dark active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Unirme'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
