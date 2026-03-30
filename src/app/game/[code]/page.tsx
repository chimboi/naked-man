'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { pickRandomQuestion, calculateScore } from '@/lib/utils';
import { questions } from '@/data/questions';
import type { GameState } from '@/types/game';
import NakedManReveal from '@/components/game/NakedManReveal';
import QuestionDisplay from '@/components/game/QuestionDisplay';
import WaitingScreen from '@/components/game/WaitingScreen';
import AnswerReveal from '@/components/game/AnswerReveal';
import GuessScreen from '@/components/game/GuessScreen';
import DrawingCanvas from '@/components/game/DrawingCanvas';
import PersonalResult from '@/components/game/PersonalResult';
import Scoreboard from '@/components/game/Scoreboard';
import { motion } from 'framer-motion';

const POLL_INTERVAL = 1000;

export default function GamePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const playerId = searchParams.get('playerId') || '';
  const isHost = searchParams.get('host') === 'true';

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const lastSyncRef = useRef<string>('');
  const hasJoined = useRef(false);
  const writeCooldown = useRef(false);
  const isSubmittingAnswer = useRef(false);
  const isSubmittingGuess = useRef(false);
  const submittedAnswerRef = useRef<string | null>(null);
  const submittedGuessRef = useRef<string | null>(null);

  const playerName = typeof window !== 'undefined'
    ? localStorage.getItem('nakedman_player_name') || ''
    : '';

  const isNakedMan = gameState?.nakedManId === playerId;
  const phase = gameState?.phase || 'lobby';
  const isGameActive = phase !== 'lobby' && phase !== 'winner';

  // Protect against accidental exit (refresh / close tab)
  useEffect(() => {
    if (!isGameActive) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isGameActive]);

  // Protect against back button
  useEffect(() => {
    if (!isGameActive) return;
    window.history.pushState(null, '', window.location.href);
    const handler = () => {
      window.history.pushState(null, '', window.location.href);
      setShowExitModal(true);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [isGameActive]);

  // Poll DB for state changes + auto-join if needed
  useEffect(() => {
    if (!code || !playerId) return;

    const fetchState = async () => {
      const { data } = await supabase
        .from('game_sessions')
        .select('state')
        .eq('id', code)
        .single();

      if (!data?.state || JSON.stringify(data.state) === '{}') return;

      const state = data.state as GameState;

      // Auto-join: if this player is not in the list yet, add them
      if (!hasJoined.current && !isHost && playerName && state.players.length < 7 && !state.players.some(p => p.id === playerId)) {
        hasJoined.current = true;
        const updatedState = {
          ...state,
          players: [...state.players, {
            id: playerId,
            name: playerName,
            score: 0,
            isHost: false,
          }],
        };
        await supabase
          .from('game_sessions')
          .update({ state: updatedState })
          .eq('id', code);
        lastSyncRef.current = JSON.stringify(updatedState);
        setGameState(updatedState);
        return;
      }

      // Skip poll updates during write cooldown to prevent flickering
      if (writeCooldown.current) return;

      // Preserve local answer/guess if we already submitted but a concurrent
      // write from another player overwrote our data in the DB.
      // Uses refs (not state) because this effect closure doesn't track gameState.
      let needsRewrite = false;
      if (isSubmittingAnswer.current && state.phase === 'question' && !state.answers?.[playerId] && submittedAnswerRef.current !== null) {
        state.answers = { ...state.answers, [playerId]: submittedAnswerRef.current };
        needsRewrite = true;
      }
      if (isSubmittingGuess.current && state.phase === 'guess' && !state.guesses?.[playerId] && submittedGuessRef.current !== null) {
        state.guesses = { ...state.guesses, [playerId]: submittedGuessRef.current };
        needsRewrite = true;
      }
      if (needsRewrite) {
        // Re-persist our answer/guess that was lost to the race condition
        writeCooldown.current = true;
        await supabase
          .from('game_sessions')
          .update({ state })
          .eq('id', code);
        setTimeout(() => { writeCooldown.current = false; }, 300);
      }

      const stateStr = JSON.stringify(state);
      if (stateStr !== lastSyncRef.current) {
        lastSyncRef.current = stateStr;
        setGameState(state);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [code, playerId, isHost, playerName]);

  // Reset submission guards when a new round starts
  useEffect(() => {
    if (phase === 'question') {
      isSubmittingAnswer.current = false;
      isSubmittingGuess.current = false;
      submittedAnswerRef.current = null;
      submittedGuessRef.current = null;
    }
  }, [phase]);

  // Helper: save state to DB and update local
  const saveState = useCallback(async (newState: GameState) => {
    writeCooldown.current = true;

    const stateStr = JSON.stringify(newState);
    lastSyncRef.current = stateStr;
    setGameState(newState);

    await supabase
      .from('game_sessions')
      .update({ state: newState })
      .eq('id', code);

    setTimeout(() => { writeCooldown.current = false; }, 300);
  }, [code]);

  // Start round: everyone answers, no nakedMan selected yet
  const startRound = useCallback(() => {
    if (!gameState) return;
    const preferredType = Math.random() < 0.75 ? 'text' : 'drawing';
    const questionIndex = pickRandomQuestion(gameState.questionsUsed, questions, preferredType);
    saveState({
      ...gameState,
      nakedManId: null,
      currentQuestionIndex: questionIndex,
      questionsUsed: [...gameState.questionsUsed, questionIndex],
      phase: 'question',
      currentAnswer: '',
      answers: {},
      guesses: {},
      roundQuestionCount: gameState.currentRound + 1,
      currentRound: gameState.currentRound + 1,
    });
  }, [gameState, saveState]);

  // Player submits answer (concurrent-safe: reads latest state from DB)
  const handleAnswerSubmit = useCallback(async (answer: string) => {
    if (!gameState || gameState.phase !== 'question') return;
    if (isSubmittingAnswer.current) return;
    isSubmittingAnswer.current = true;
    submittedAnswerRef.current = answer;

    const { data } = await supabase
      .from('game_sessions')
      .select('state')
      .eq('id', code)
      .single();

    const latestState = (data?.state as GameState) || gameState;

    // Another player already triggered phase transition
    if (latestState.phase !== 'question') return;
    // This player already has an answer in DB (e.g. timeout + manual submit race)
    if (latestState.answers?.[playerId]) return;

    const newAnswers = { ...latestState.answers, [playerId]: answer };
    const totalPlayers = latestState.players.length;
    const allAnswered = Object.keys(newAnswers).length >= totalPlayers;

    if (allAnswered && latestState.phase === 'question') {
      // Pick nakedMan from players who actually answered (non-empty)
      const answeredIds = Object.entries(newAnswers)
        .filter(([, ans]) => ans && ans.trim() !== '')
        .map(([id]) => id);
      const pool = answeredIds.length > 0 ? answeredIds : latestState.players.map(p => p.id);
      const nakedManId = pool[Math.floor(Math.random() * pool.length)];

      saveState({
        ...latestState,
        answers: newAnswers,
        nakedManId,
        currentAnswer: newAnswers[nakedManId],
        phase: 'reveal',
      });
    } else {
      saveState({
        ...latestState,
        answers: newAnswers,
      });
    }
  }, [gameState, saveState, playerId, code]);

  // Timeout: auto-submit empty if not answered, host force-advances
  const handleTimeout = useCallback(async () => {
    if (!gameState) return;
    if (isSubmittingAnswer.current) return;

    // If this player hasn't answered, submit empty
    if (!gameState.answers?.[playerId]) {
      await handleAnswerSubmit('');
      return;
    }

    // If host, force-advance
    if (isHost) {
      const { data } = await supabase
        .from('game_sessions')
        .select('state')
        .eq('id', code)
        .single();
      const latestState = (data?.state as GameState) || gameState;

      if (latestState.phase === 'question') {
        const answeredIds = Object.entries(latestState.answers || {})
          .filter(([, ans]) => ans && ans.trim() !== '')
          .map(([id]) => id);

        if (answeredIds.length === 0) {
          // Nobody answered — skip round
          saveState({ ...latestState, phase: 'scoreboard', currentAnswer: '' });
          return;
        }

        const nakedManId = answeredIds[Math.floor(Math.random() * answeredIds.length)];
        saveState({
          ...latestState,
          nakedManId,
          currentAnswer: latestState.answers[nakedManId],
          phase: 'reveal',
        });
      }
    }
  }, [gameState, saveState, playerId, isHost, code, handleAnswerSubmit]);

  // Reveal done → answer-reveal
  const handleRevealDone = useCallback(() => {
    if (!gameState || gameState.phase !== 'reveal') return;
    saveState({ ...gameState, phase: 'answer-reveal' });
  }, [gameState, saveState]);

  const handleProceedToGuess = useCallback(() => {
    if (!gameState || gameState.phase !== 'answer-reveal') return;
    saveState({ ...gameState, phase: 'guess' });
  }, [gameState, saveState]);

  const handleGuessSubmit = useCallback(async (guessedId: string) => {
    if (!gameState || gameState.phase !== 'guess') return;
    if (isSubmittingGuess.current) return;
    isSubmittingGuess.current = true;
    submittedGuessRef.current = guessedId;

    const { data } = await supabase
      .from('game_sessions')
      .select('state')
      .eq('id', code)
      .single();

    const latestState = (data?.state as GameState) || gameState;

    // Another player already triggered phase transition
    if (latestState.phase !== 'guess') return;
    // This player already guessed in DB
    if (latestState.guesses?.[playerId]) return;

    const newGuesses = { ...latestState.guesses, [playerId]: guessedId };
    const totalGuessers = latestState.players.filter(p => p.id !== latestState.nakedManId).length;
    const allGuessed = Object.keys(newGuesses).length >= totalGuessers;

    if (allGuessed && latestState.phase === 'guess') {
      // Calculate scores immediately when all guesses are in
      const { nakedManPoints, correctGuessers } = calculateScore(newGuesses, latestState.nakedManId!);
      const updatedPlayers = latestState.players.map(p => {
        let bonus = 0;
        if (p.id === latestState.nakedManId) bonus = nakedManPoints;
        if (correctGuessers.includes(p.id)) bonus = 1;
        return { ...p, score: p.score + bonus };
      });

      saveState({
        ...latestState,
        guesses: newGuesses,
        players: updatedPlayers,
        phase: 'personal-result',
      });
    } else {
      saveState({
        ...latestState,
        guesses: newGuesses,
      });
    }
  }, [gameState, saveState, playerId, code]);

  // Host force-advances guess phase after 30s if not all guesses are in
  useEffect(() => {
    if (!isHost || phase !== 'guess' || !gameState) return;
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('game_sessions')
        .select('state')
        .eq('id', code)
        .single();
      const latestState = (data?.state as GameState) || gameState;
      if (latestState.phase !== 'guess') return;

      const guesses = latestState.guesses || {};
      const { nakedManPoints, correctGuessers } = calculateScore(guesses, latestState.nakedManId!);
      const updatedPlayers = latestState.players.map(p => {
        let bonus = 0;
        if (p.id === latestState.nakedManId) bonus = nakedManPoints;
        if (correctGuessers.includes(p.id)) bonus = 1;
        return { ...p, score: p.score + bonus };
      });

      saveState({
        ...latestState,
        guesses,
        players: updatedPlayers,
        phase: 'personal-result',
      });
    }, 30000);
    return () => clearTimeout(timer);
  }, [isHost, phase, gameState, code, saveState]);

  // personal-result → scoreboard, sudden death, or winner
  const handleShowScoreboard = useCallback(() => {
    if (!gameState) return;

    const playersAtOrAbove7 = gameState.players.filter(p => p.score >= 7);

    if (playersAtOrAbove7.length === 0) {
      // No one at 7 yet — normal scoreboard
      saveState({ ...gameState, phase: 'scoreboard' });
    } else if (playersAtOrAbove7.length === 1) {
      // Clear winner
      saveState({ ...gameState, phase: 'winner' });
    } else if (gameState.suddenDeath && gameState.preRoundScores) {
      // Already in sudden death — check who gained more this round
      const roundGains = playersAtOrAbove7.map(p => ({
        id: p.id,
        gain: p.score - (gameState.preRoundScores![p.id] || 0),
      }));
      const maxGain = Math.max(...roundGains.map(r => r.gain));
      const roundWinners = roundGains.filter(r => r.gain === maxGain);

      if (roundWinners.length === 1) {
        // Sudden death resolved
        saveState({ ...gameState, suddenDeath: false, suddenDeathPlayerIds: undefined, preRoundScores: undefined, phase: 'winner' });
      } else {
        // Still tied — another sudden death round
        const tiedIds = roundWinners.map(r => r.id);
        const scores: Record<string, number> = {};
        gameState.players.forEach(p => { scores[p.id] = p.score; });
        saveState({ ...gameState, suddenDeath: true, suddenDeathPlayerIds: tiedIds, preRoundScores: scores, phase: 'scoreboard' });
      }
    } else {
      // Multiple players at 7+ — enter sudden death
      const maxScore = Math.max(...playersAtOrAbove7.map(p => p.score));
      const tiedPlayers = gameState.players.filter(p => p.score === maxScore);

      if (tiedPlayers.length === 1) {
        saveState({ ...gameState, phase: 'winner' });
      } else {
        const tiedIds = tiedPlayers.map(p => p.id);
        const scores: Record<string, number> = {};
        gameState.players.forEach(p => { scores[p.id] = p.score; });
        saveState({ ...gameState, suddenDeath: true, suddenDeathPlayerIds: tiedIds, preRoundScores: scores, phase: 'scoreboard' });
      }
    }
  }, [gameState, saveState]);

  const handlePlayAgain = useCallback(() => {
    if (!gameState) return;
    saveState({
      ...gameState,
      players: gameState.players.map(p => ({ ...p, score: 0 })),
      currentRound: 0,
      questionsUsed: [],
      phase: 'lobby',
      nakedManId: null,
      currentAnswer: '',
      answers: {},
      guesses: {},
      roundQuestionCount: 0,
      suddenDeath: false,
      suddenDeathPlayerIds: undefined,
      preRoundScores: undefined,
    });
  }, [gameState, saveState]);

  // Exit confirmation modal
  const exitModal = showExitModal && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Salir del juego?</h3>
        <p className="text-gray-500 mb-6">Perderas tu progreso en esta partida.</p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExitModal(false)}
            className="flex-1 py-3 bg-orange text-white font-semibold rounded-xl active:scale-95 transition-all"
          >
            Quedarme
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-500 font-medium rounded-xl active:scale-95 transition-all"
          >
            Salir
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  // Loading state while fetching initial game state
  if (!gameState) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <motion.div
          className="w-12 h-12 border-4 border-gray-200 border-t-orange rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-gray-400 mt-4 text-sm">Conectando al juego...</p>
      </div>
    );
  }

  // Lobby / waiting for game to start
  if (phase === 'lobby') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 relative">
        <button
          onClick={() => router.push('/')}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <WaitingScreen
          message={isHost ? 'Presiona para iniciar' : 'Esperando a que el host inicie el juego...'}
          showStartButton={isHost}
          onStart={startRound}
          players={gameState?.players || []}
        />
      </div>
    );
  }

  const answeredCount = Object.keys(gameState.answers || {}).length;
  const totalPlayers = gameState.players.length;
  const hasAnswered = !!gameState.answers?.[playerId];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8">
      {exitModal}

      {phase === 'question' && !hasAnswered && questions[gameState.currentQuestionIndex].type === 'text' && (
        <QuestionDisplay
          question={questions[gameState.currentQuestionIndex].text}
          questionNumber={gameState.roundQuestionCount}
          onSubmit={handleAnswerSubmit}
          onTimeout={handleTimeout}
        />
      )}

      {phase === 'question' && !hasAnswered && questions[gameState.currentQuestionIndex].type === 'drawing' && (
        <DrawingCanvas
          question={questions[gameState.currentQuestionIndex].text}
          questionNumber={gameState.roundQuestionCount}
          onSubmit={handleAnswerSubmit}
          onTimeout={handleTimeout}
        />
      )}

      {phase === 'question' && hasAnswered && (
        <WaitingScreen message={`Esperando a los demas... (${answeredCount}/${totalPlayers})`} />
      )}

      {phase === 'reveal' && (
        <NakedManReveal
          isNakedMan={isNakedMan}
          nakedManName={gameState.players.find(p => p.id === gameState.nakedManId)?.name || ''}
          onDone={isHost ? handleRevealDone : () => {}}
        />
      )}

      {phase === 'answer-reveal' && (
        <AnswerReveal
          question={questions[gameState.currentQuestionIndex].text}
          answer={gameState.currentAnswer}
          questionNumber={gameState.roundQuestionCount}
          onProceed={handleProceedToGuess}
          isHost={isHost}
        />
      )}

      {phase === 'guess' && !isNakedMan && !gameState.guesses[playerId] && (
        <GuessScreen
          players={gameState.players.filter(p => p.id !== playerId)}
          question={questions[gameState.currentQuestionIndex].text}
          answer={gameState.currentAnswer}
          onGuess={handleGuessSubmit}
        />
      )}

      {phase === 'guess' && (isNakedMan || gameState.guesses[playerId]) && (
        <WaitingScreen message="Esperando a que todos adivinen..." />
      )}

      {phase === 'personal-result' && (
        <PersonalResult
          players={gameState.players}
          nakedManId={gameState.nakedManId!}
          playerId={playerId}
          guesses={gameState.guesses}
          autoAdvance={isHost}
          onNext={isHost ? handleShowScoreboard : undefined}
        />
      )}

      {phase === 'scoreboard' && (
        <Scoreboard
          players={gameState.players}
          suddenDeath={gameState.suddenDeath}
          suddenDeathPlayerIds={gameState.suddenDeathPlayerIds}
          onNextRound={isHost ? startRound : undefined}
        />
      )}

      {phase === 'winner' && (
        <Scoreboard
          players={gameState.players}
          winner={[...gameState.players].sort((a, b) => b.score - a.score)[0]}
          onPlayAgain={isHost ? handlePlayAgain : undefined}
        />
      )}
    </div>
  );
}
