'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateSessionCode, getPlayerId } from '@/lib/utils';
import type { Player, GameState } from '@/types/game';

const POLL_INTERVAL = 2000;

export default function CreateGame() {
  const router = useRouter();
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [copied, setCopied] = useState(false);
  const [hostId, setHostId] = useState('');
  const [hostName, setHostName] = useState('');
  const [nameSet, setNameSet] = useState(false);

  useEffect(() => {
    setHostId(getPlayerId());
  }, []);

  // Poll DB for new players joining
  useEffect(() => {
    if (!sessionCode) return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('game_sessions')
        .select('state')
        .eq('id', sessionCode)
        .single();

      if (data?.state?.players) {
        setPlayers(data.state.players);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [sessionCode]);

  const createSession = async () => {
    if (!hostName.trim()) return;

    const code = generateSessionCode();
    const playerId = hostId;

    const host: Player = {
      id: playerId,
      name: hostName.trim(),
      score: 0,
      isHost: true,
    };

    const initialState: GameState = {
      sessionCode: code,
      players: [host],
      currentRound: 0,
      nakedManId: null,
      currentQuestionIndex: -1,
      questionsUsed: [],
      phase: 'lobby',
      currentAnswer: '',
      answers: {},
      guesses: {},
      roundQuestionCount: 0,
    };

    const { error } = await supabase
      .from('game_sessions')
      .insert({ id: code, host_id: playerId, state: initialState });

    if (error) {
      console.error('Error creating session:', error);
      return;
    }

    setSessionCode(code);
    setPlayers([host]);
    setNameSet(true);
    localStorage.setItem('nakedman_player_name', hostName.trim());
  };

  const copyCode = async () => {
    if (!sessionCode) return;
    await navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startGame = () => {
    if (players.length < 3 || !sessionCode) return;
    router.push(`/game/${sessionCode}?playerId=${hostId}&host=true`);
  };

  if (!nameSet) {
    return (
      <div className="min-h-screen bg-orange flex flex-col items-center justify-center px-6 relative">
        <button
          onClick={() => router.push('/')}
          className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <motion.div
          className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Como te llamas?
          </h2>
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="Tu nombre"
            maxLength={20}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-orange focus:outline-none transition-colors mb-4"
            onKeyDown={(e) => e.key === 'Enter' && createSession()}
            autoFocus
          />
          <button
            onClick={createSession}
            disabled={!hostName.trim()}
            className="w-full py-4 bg-orange text-white font-semibold text-lg rounded-xl hover:bg-orange-dark active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            Crear juego
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12 relative">
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Comparte este codigo con tus amigos
        </h1>
        <p className="text-gray-500 text-center mb-8">
          De 3 a 5 jugadores para iniciar
        </p>

        {/* Session Code */}
        <motion.button
          onClick={copyCode}
          className="w-full bg-orange/10 border-2 border-orange border-dashed rounded-2xl p-6 mb-8 text-center hover:bg-orange/15 transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          <p className="text-4xl font-extrabold text-orange tracking-[0.3em] mb-1">
            {sessionCode}
          </p>
          <p className="text-sm text-orange/70">
            {copied ? 'Copiado!' : 'Toca para copiar'}
          </p>
        </motion.button>

        {/* Player List */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Jugadores ({players.length})
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {players.map((player, i) => (
                <motion.div
                  key={player.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center text-white font-bold text-lg">
                    {player.name[0].toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">{player.name}</span>
                  {player.isHost && (
                    <span className="ml-auto text-xs bg-orange/10 text-orange px-2 py-1 rounded-full font-medium">
                      Host
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={startGame}
          disabled={players.length < 3 || players.length > 5}
          className="w-full py-4 bg-orange text-white font-semibold text-lg rounded-xl hover:bg-orange-dark active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {players.length < 3
            ? `Faltan ${3 - players.length} jugador${3 - players.length > 1 ? 'es' : ''}`
            : players.length > 5
            ? 'Maximo 5 jugadores'
            : 'Iniciar juego'}
        </button>
      </motion.div>
    </div>
  );
}
