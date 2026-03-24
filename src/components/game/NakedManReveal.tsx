'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface NakedManRevealProps {
  isNakedMan: boolean;
  nakedManName: string;
  onDone: () => void;
}

export default function NakedManReveal({ isNakedMan, nakedManName, onDone }: NakedManRevealProps) {
  const [showReveal, setShowReveal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowReveal(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance after reveal is shown (no button needed)
  useEffect(() => {
    if (!showReveal) return;
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [showReveal, onDone]);

  return (
    <motion.div
      className="flex flex-col items-center text-center w-full max-w-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        {!showReveal ? (
          <motion.div
            key="countdown"
            className="flex flex-col items-center"
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              className="text-6xl font-extrabold text-orange"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              ?
            </motion.div>
            <p className="text-xl text-gray-600 mt-4">Eligiendo al Naked Man...</p>
          </motion.div>
        ) : isNakedMan ? (
          <motion.div
            key="you-are"
            className="flex flex-col items-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          >
            <motion.div
              className="w-32 h-32 rounded-full bg-orange flex items-center justify-center mb-6"
              animate={{ boxShadow: ['0 0 0 0 rgba(215,124,36,0.4)', '0 0 0 30px rgba(215,124,36,0)', '0 0 0 0 rgba(215,124,36,0.4)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-5xl text-white font-extrabold">
                {nakedManName[0].toUpperCase()}
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl font-extrabold text-orange mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Tu eres el Naked Man!
            </motion.h1>

            <motion.p
              className="text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Nadie sabra que eres tu...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="not-you"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-6xl mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              🤔
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              El Naked Man ha sido elegido
            </h2>
            <p className="text-gray-500">
              Presta atencion a las respuestas para adivinar quien es...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
