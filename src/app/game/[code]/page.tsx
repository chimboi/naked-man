'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { pickRandomQuestion, pickRandomPlayer, calculateScore } from '@/lib/utils';
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

const POLL_INTERVAL = 1000;

function ResultAutoAdvance({ isHost, onAdvance }: { isHost: boolean; onAdvance: () => void }) {
  useEffect(() => {
    if (!isHost) return;
    // Immediate — no delay needed, just trigger on next tick
    const timer = setTimeout(onAdvance, 100);
    return () => clearTimeout(timer);
  }, [isHost, onAdvance]);

  return null;
}

export default function GamePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const playerId = searchParams.get('playerId') || '';
  const isHost = searchParams.get('host') === 'true';

  const [gameState, setGameState] = useState<GameState | null>(null);
  const lastSyncRef = useRef<string>('');
  const hasJoined = useRef(false);
  const writeCooldown = useRef(false);

  const playerName = typeof window !== 'undefined'
    ? localStorage.getItem('nakedman_player_name') || ''
    : '';

  const isNakedMan = gameState?.nakedManId === playerId;
  const phase = gameState?.phase || 'lobby';

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
      if (!hasJoined.current && !isHost && playerName && state.players.length < 5 && !state.players.some(p => p.id === playerId)) {
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

    // Short cooldown — just enough for the write to propagate
    setTimeout(() => { writeCooldown.current = false; }, 300);
  }, [code]);

  const startRound = useCallback(() => {
    if (!gameState) return;
    const nakedManId = pickRandomPlayer(
      gameState.players.map(p => p.id),
      gameState.nakedManId ? [gameState.nakedManId] : []
    );
    const questionIndex = pickRandomQuestion(gameState.questionsUsed, questions.length);
    saveState({
      ...gameState,
      nakedManId,
      currentQuestionIndex: questionIndex,
      questionsUsed: [...gameState.questionsUsed, questionIndex],
      phase: 'reveal',
      currentAnswer: '',
      guesses: {},
      roundQuestionCount: gameState.currentRound + 1,
      currentRound: gameState.currentRound + 1,
    });
  }, [gameState, saveState]);

  const handleRevealDone = useCallback(() => {
    if (!gameState) return;
    saveState({ ...gameState, phase: 'question' });
  }, [gameState, saveState]);

  const handleAnswerSubmit = useCallback((answer: string) => {
    if (!gameState) return;
    saveState({ ...gameState, currentAnswer: answer, phase: 'answer-reveal' });
  }, [gameState, saveState]);

  const handleTimeout = useCallback(() => {
    if (!gameState || !isNakedMan) return;
    // Skip this round — go directly to next round
    saveState({ ...gameState, phase: 'scoreboard', currentAnswer: '' });
  }, [gameState, saveState, isNakedMan]);

  const handleProceedToGuess = useCallback(() => {
    if (!gameState) return;
    saveState({ ...gameState, phase: 'guess' });
  }, [gameState, saveState]);

  const handleGuessSubmit = useCallback(async (guessedId: string) => {
    if (!gameState) return;

    // Read latest state from DB to avoid overwriting other players' guesses
    const { data } = await supabase
      .from('game_sessions')
      .select('state')
      .eq('id', code)
      .single();

    const latestState = (data?.state as GameState) || gameState;
    const newGuesses = { ...latestState.guesses, [playerId]: guessedId };
    const totalGuessers = latestState.players.filter(p => p.id !== latestState.nakedManId).length;
    const allGuessed = Object.keys(newGuesses).length >= totalGuessers;

    saveState({
      ...latestState,
      guesses: newGuesses,
      phase: allGuessed ? 'result' : 'guess',
    });
  }, [gameState, saveState, playerId, code]);

  // result → personal-result (calculate scores first)
  const handleShowPersonalResult = useCallback(() => {
    if (!gameState) return;

    const { nakedManPoints, correctGuessers } = calculateScore(gameState.guesses, gameState.nakedManId!);

    const updatedPlayers = gameState.players.map(p => {
      let bonus = 0;
      if (p.id === gameState.nakedManId) bonus = nakedManPoints;
      if (correctGuessers.includes(p.id)) bonus = 1;
      return { ...p, score: p.score + bonus };
    });

    saveState({ ...gameState, players: updatedPlayers, phase: 'personal-result' });
  }, [gameState, saveState]);

  // personal-result → scoreboard or winner
  const handleShowScoreboard = useCallback(() => {
    if (!gameState) return;
    const winner = gameState.players.find(p => p.score >= 5);
    if (winner) {
      saveState({ ...gameState, phase: 'winner' });
    } else {
      saveState({ ...gameState, phase: 'scoreboard' });
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
      guesses: {},
      roundQuestionCount: 0,
    });
  }, [gameState, saveState]);

  // Lobby / waiting for game to start
  if (!gameState || phase === 'lobby') {
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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8">
      {phase === 'reveal' && (
        <NakedManReveal
          isNakedMan={isNakedMan}
          nakedManName={gameState.players.find(p => p.id === gameState.nakedManId)?.name || ''}
          onDone={isNakedMan ? handleRevealDone : () => {}}
        />
      )}

      {phase === 'question' && isNakedMan && questions[gameState.currentQuestionIndex].type === 'text' && (
        <QuestionDisplay
          question={questions[gameState.currentQuestionIndex].text}
          questionNumber={gameState.roundQuestionCount}
          onSubmit={handleAnswerSubmit}
          onTimeout={handleTimeout}
        />
      )}

      {phase === 'question' && isNakedMan && questions[gameState.currentQuestionIndex].type === 'drawing' && (
        <DrawingCanvas
          question={questions[gameState.currentQuestionIndex].text}
          questionNumber={gameState.roundQuestionCount}
          onSubmit={handleAnswerSubmit}
          onTimeout={handleTimeout}
        />
      )}

      {phase === 'question' && !isNakedMan && (
        <WaitingScreen message="El Naked Man esta respondiendo..." />
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

      {phase === 'result' && (
        <ResultAutoAdvance isHost={isHost} onAdvance={handleShowPersonalResult} />
      )}

      {phase === 'personal-result' && (
        <PersonalResult
          players={gameState.players}
          nakedManId={gameState.nakedManId!}
          playerId={playerId}
          guesses={gameState.guesses}
          onNext={isHost ? handleShowScoreboard : undefined}
        />
      )}

      {phase === 'scoreboard' && (
        <Scoreboard
          players={gameState.players}
          onNextRound={isHost ? startRound : undefined}
        />
      )}

      {phase === 'winner' && (
        <Scoreboard
          players={gameState.players}
          winner={gameState.players.find(p => p.score >= 5)}
          onPlayAgain={isHost ? handlePlayAgain : undefined}
        />
      )}
    </div>
  );
}
