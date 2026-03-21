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
    const timer = setTimeout(onProceed, 4000);
    return () => clearTimeout(timer);
  }, [isHost, onProceed]);

  return (
    <motion.div
      className="flex flex-col items-center w-full max-w-sm text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <span className="text-sm font-medium text-orange bg-orange/10 px-3 py-1 rounded-full mb-4">
        Ronda {questionNumber}
      </span>

      <motion.div
        className="w-full bg-gray-50 rounded-2xl p-5 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-base font-medium text-gray-700 leading-relaxed">
          {question}
        </p>
      </motion.div>

      <h2 className="text-lg font-bold text-gray-900 mb-3">
        El Naked Man respondio:
      </h2>

      <motion.div
        className="w-full bg-orange/5 border-2 border-orange/20 rounded-2xl overflow-hidden mb-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        {isDrawing(answer) ? (
          <img src={answer} alt="Dibujo del Naked Man" className="w-full" />
        ) : (
          <p className="text-lg text-gray-800 leading-relaxed italic p-6">
            &ldquo;{answer}&rdquo;
          </p>
        )}
      </motion.div>

      <p className="text-gray-500 text-sm mb-4">
        Preparense para adivinar...
      </p>

      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-orange rounded-full"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 4, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
