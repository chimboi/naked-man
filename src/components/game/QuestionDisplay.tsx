'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

const TIME_LIMIT = 40;

interface QuestionDisplayProps {
  question: string;
  questionNumber: number;
  onSubmit: (answer: string) => void;
  onTimeout: () => void;
}

export default function QuestionDisplay({ question, questionNumber, onSubmit, onTimeout }: QuestionDisplayProps) {
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeout]);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onSubmit(answer.trim());
  };

  return (
    <motion.div
      className="flex flex-col items-center w-full max-w-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-medium text-orange bg-orange/10 px-3 py-1 rounded-full">
          Ronda {questionNumber}
        </span>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
          timeLeft <= 5 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {timeLeft}s
        </span>
      </div>

      {/* Timer bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-6">
        <motion.div
          className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-orange'}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: TIME_LIMIT, ease: 'linear' }}
        />
      </div>

      <motion.div
        className="w-full bg-orange/10 border-2 border-orange/30 rounded-2xl p-5 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-extrabold text-gray-900 text-center leading-relaxed">
          {question}
        </h2>
      </motion.div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Escribe tu respuesta..."
        rows={3}
        maxLength={300}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-orange focus:outline-none transition-colors resize-none mb-2"
        autoFocus
      />

      <p className="text-xs text-gray-400 mb-4 self-end">{answer.length}/300</p>

      <button
        onClick={handleSubmit}
        disabled={!answer.trim()}
        className="w-full py-4 bg-orange text-white font-semibold text-lg rounded-xl hover:bg-orange-dark active:scale-95 transition-all duration-200 disabled:opacity-40"
      >
        Enviar respuesta
      </button>
    </motion.div>
  );
}
