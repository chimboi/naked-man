'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface QuestionDisplayProps {
  question: string;
  questionNumber: number;
  onSubmit: (answer: string) => void;
}

export default function QuestionDisplay({ question, questionNumber, onSubmit }: QuestionDisplayProps) {
  const [answer, setAnswer] = useState('');

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
      <span className="text-sm font-medium text-orange bg-orange/10 px-3 py-1 rounded-full mb-4">
        Ronda {questionNumber}
      </span>

      <motion.h2
        className="text-2xl font-bold text-gray-900 text-center mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {question}
      </motion.h2>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Escribe tu respuesta..."
        rows={4}
        maxLength={300}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-orange focus:outline-none transition-colors resize-none mb-4"
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
