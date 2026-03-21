'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import JoinGameModal from '@/components/home/JoinGameModal';
import Logo from '@/components/home/Logo';

export default function Home() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-orange flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-sm w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', damping: 15 }}
        >
          <Logo className="w-36 h-36 mb-2" />
        </motion.div>

        <motion.h1
          className="text-5xl font-extrabold text-white mb-2 tracking-tight"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
        >
          Naked Man
        </motion.h1>

        <motion.p
          className="text-lg text-white/90 font-light mb-8 leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Diviertete y conoce mas a tus amigos
        </motion.p>

        <motion.div
          className="flex flex-col gap-3 w-full mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            onClick={() => router.push('/create')}
            className="w-full py-4 px-8 bg-white text-orange font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            Crear juego
          </button>

          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full py-4 px-8 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-2xl hover:bg-white/10 active:scale-95 transition-all duration-200"
          >
            Unirme a juego
          </button>
        </motion.div>

        {/* How to play */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => setShowRules(!showRules)}
            className="text-white/70 text-sm font-medium hover:text-white transition-colors mb-4"
          >
            {showRules ? 'Ocultar instrucciones' : 'Como se juega?'}
          </button>

          {showRules && (
            <motion.div
              className="w-full bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-left space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-3">
                <span className="text-white/90 font-bold text-lg shrink-0">1.</span>
                <p className="text-white/90 text-sm">
                  Crea un juego e invita a tus amigos (3 a 5 jugadores). Comparte el codigo para que se unan.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-white/90 font-bold text-lg shrink-0">2.</span>
                <p className="text-white/90 text-sm">
                  Cada ronda se elige un <strong>Naked Man</strong> al azar. Solo el sabe que fue elegido.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-white/90 font-bold text-lg shrink-0">3.</span>
                <p className="text-white/90 text-sm">
                  El Naked Man responde una pregunta personal de forma anonima. Se vale ser vulnerable y autentico.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-white/90 font-bold text-lg shrink-0">4.</span>
                <p className="text-white/90 text-sm">
                  Todos ven la respuesta y adivinan quien es el Naked Man. Si adivinan, ganan 1 punto. El Naked Man gana 1 punto por cada persona que lo adivine (max 2).
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-white/90 font-bold text-lg shrink-0">5.</span>
                <p className="text-white/90 text-sm">
                  El primero en llegar a <strong>5 puntos</strong> gana. Gana el mas vulnerable y autentico.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {showJoinModal && (
        <JoinGameModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  );
}
