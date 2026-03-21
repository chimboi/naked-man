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

export default function AnswerReveal({ question, answer, questionNumber, onProceed, isHost }: AnswerRevealProps) {
  // Auto-advance to guess phase after 5 seconds (host only writes)
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
        className="w-full bg-orange/5 border-2 border-orange/20 rounded-2xl p-6 mb-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <p className="text-lg text-gray-800 leading-relaxed italic">
          &ldquo;{answer}&rdquo;
        </p>
      </motion.div>

      <p className="text-gray-500 text-sm mb-4">
        Preparense para adivinar...
      </p>

      {/* Countdown bar */}
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
