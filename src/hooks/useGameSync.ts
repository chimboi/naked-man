'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { GameState } from '@/types/game';

const POLL_INTERVAL = 2000;

export function useGameSync(sessionCode: string | null) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastStateRef = useRef<string>('');

  // Poll the DB for state changes
  const fetchState = useCallback(async () => {
    if (!sessionCode) return;
    const { data, error } = await supabase
      .from('game_sessions')
      .select('state')
      .eq('id', sessionCode)
      .single();

    if (error || !data) return;

    const stateStr = JSON.stringify(data.state);
    if (stateStr !== lastStateRef.current && stateStr !== '{}') {
      lastStateRef.current = stateStr;
      setGameState(data.state as GameState);
    }
  }, [sessionCode]);

  // Start polling
  useEffect(() => {
    if (!sessionCode) return;

    fetchState();
    intervalRef.current = setInterval(fetchState, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionCode, fetchState]);

  // Write state to DB (host calls this)
  const syncState = useCallback(async (state: GameState) => {
    if (!sessionCode) return;
    const stateStr = JSON.stringify(state);
    if (stateStr === lastStateRef.current) return;
    lastStateRef.current = stateStr;
    setGameState(state);

    await supabase
      .from('game_sessions')
      .update({ state })
      .eq('id', sessionCode);
  }, [sessionCode]);

  return { gameState, setGameState, syncState, fetchState };
}
