'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import type { GameState } from '@/types/game';

const PASSWORD = 'nakedwoman';

interface KPIs {
  totalGamesCreated: number;
  totalGamesPlayed: number;
  totalPlayers: number;
  avgPlayersPerGame: number;
  totalRoundsPlayed: number;
  avgRoundsPerGame: number;
}

export default function KPIsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (password === PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Contrasena incorrecta');
    }
  };

  const fetchKPIs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('game_sessions')
      .select('state');

    if (!data) {
      setLoading(false);
      return;
    }

    const sessions = data
      .map(d => d.state as GameState)
      .filter(s => s && s.players);

    const gamesPlayed = sessions.filter(s => s.currentRound > 0);

    const totalPlayers = gamesPlayed.reduce((sum, s) => sum + s.players.length, 0);
    const totalRounds = gamesPlayed.reduce((sum, s) => sum + s.currentRound, 0);

    setKpis({
      totalGamesCreated: sessions.length,
      totalGamesPlayed: gamesPlayed.length,
      totalPlayers,
      avgPlayersPerGame: gamesPlayed.length > 0 ? Math.round((totalPlayers / gamesPlayed.length) * 10) / 10 : 0,
      totalRoundsPlayed: totalRounds,
      avgRoundsPerGame: gamesPlayed.length > 0 ? Math.round((totalRounds / gamesPlayed.length) * 10) / 10 : 0,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchKPIs();
  }, [authenticated, fetchKPIs]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <motion.div
          className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Naked Man KPIs</h1>
          <p className="text-gray-500 text-sm text-center mb-6">Ingresa la contrasena para ver los datos</p>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Contrasena"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-orange focus:outline-none transition-colors mb-3"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-orange text-white font-semibold rounded-xl active:scale-95 transition-all"
          >
            Entrar
          </button>
        </motion.div>
      </div>
    );
  }

  if (loading || !kpis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Cargando datos...</p>
      </div>
    );
  }

  const cards = [
    { label: 'Juegos creados', value: kpis.totalGamesCreated, color: 'bg-blue-500' },
    { label: 'Juegos jugados', value: kpis.totalGamesPlayed, color: 'bg-orange' },
    { label: 'Total jugadores', value: kpis.totalPlayers, color: 'bg-green-500' },
    { label: 'Promedio jugadores/juego', value: kpis.avgPlayersPerGame, color: 'bg-purple-500' },
    { label: 'Total rondas jugadas', value: kpis.totalRoundsPlayed, color: 'bg-pink-500' },
    { label: 'Promedio rondas/juego', value: kpis.avgRoundsPerGame, color: 'bg-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Naked Man KPIs</h1>
            <p className="text-gray-500 text-sm mt-1">Estadisticas en tiempo real</p>
          </div>
          <button
            onClick={fetchKPIs}
            className="px-4 py-2 bg-orange text-white text-sm font-semibold rounded-xl active:scale-95 transition-all"
          >
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              className="bg-white rounded-2xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`w-3 h-3 rounded-full ${card.color} mb-3`} />
              <p className="text-3xl font-extrabold text-gray-900 mb-1">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
