'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface AnswerRevealProps {
  question: string;
  answer: string;
  questionNumber: number;
  onProceed: () => void;
  isHost: boolean;
}

const isDrawing = (answer: string) => answer.startsWith('data:image');

export default function AnswerReveal({ question, answer, questionNumber, onProceed, isHost }: AnswerRevealProps) {
  useEffect(() => {
    if (!isHost) return;
    const timer = setTimeout(onProceed, 5000);
    return () => clearTimeout(timer);
  }, [isHost, onProceed]);

  return (
    <motion.div
      className="flex flex-col items-center w-full max-w-sm text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <span className="text-sm font-medium text-orange bg-orange/10 px-3 py-1 rounded-full mb-6">
        Ronda {questionNumber}
      </span>

      {/* Question with colored background */}
      <motion.div
        className="w-full bg-orange rounded-2xl p-6 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xl font-bold text-white leading-relaxed">
          {question}
        </p>
      </motion.div>

      <h2 className="text-lg font-bold text-gray-900 mb-3">
        Alguien respondio:
      </h2>

      {/* Answer prominently displayed */}
      <motion.div
        className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden mb-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        {isDrawing(answer) ? (
          <img src={answer} alt="Dibujo" className="w-full" />
        ) : (
          <p className="text-2xl text-gray-900 leading-relaxed font-medium italic p-8">
            &ldquo;{answer}&rdquo;
          </p>
        )}
      </motion.div>

      <p className="text-gray-400 text-sm mb-4">
        Preparense para adivinar...
      </p>

      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-orange rounded-full"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
