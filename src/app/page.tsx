'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import JoinGameModal from '@/components/home/JoinGameModal';
import Logo from '@/components/home/Logo';

export default function Home() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
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
            onClick={() => setShowRules(true)}
            className="text-white/70 text-sm font-medium hover:text-white transition-colors"
          >
            Como se juega?
          </button>
        </motion.div>

        {/* Credits */}
        <motion.button
          onClick={() => setShowCredits(true)}
          className="mt-16 text-white/70 text-sm font-medium hover:text-white transition-colors underline underline-offset-4 decoration-white/40 hover:decoration-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Hecho con 🧡
        </motion.button>
      </motion.div>

      {/* Credits Modal */}
      {showCredits && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowCredits(false)}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 max-w-sm w-full relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCredits(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
              Personas construyendo Naked Man
            </h2>

            <div className="flex justify-center gap-4 mb-8">
              {/* Chimboy Card */}
              <a
                href="https://www.instagram.com/eliashuarte/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center bg-white border border-black/7 rounded-2xl px-5 py-6 w-40 text-center shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#EDE9E0] mb-4 shrink-0">
                  <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <rect width="200" height="230" fill="#EDE9E0"/>
                    <rect x="0" y="196" width="200" height="60" fill="#111111"/>
                    <ellipse cx="100" cy="248" rx="98" ry="62" fill="#111111"/>
                    <path d="M 70 200 Q 100 212 130 200 L 130 230 L 70 230 Z" fill="#0D0D0D"/>
                    <rect x="83" y="168" width="34" height="32" fill="#C4885C" rx="9"/>
                    <path d="M 54 134 C 45 114, 39 88, 42 65 C 44 50, 53 35, 61 27 C 65 21, 74 15, 82 12 Q 88 3, 95 12 Q 100 3, 107 12 Q 114 4, 120 13 C 128 16, 137 23, 143 31 C 151 42, 159 58, 160 74 C 163 95, 156 118, 148 134 Z" fill="#151515"/>
                    <ellipse cx="50" cy="134" rx="13" ry="17" fill="#C4885C"/>
                    <ellipse cx="150" cy="134" rx="13" ry="17" fill="#C4885C"/>
                    <ellipse cx="50" cy="134" rx="8" ry="11" fill="#A8703C" opacity="0.35"/>
                    <ellipse cx="150" cy="134" rx="8" ry="11" fill="#A8703C" opacity="0.35"/>
                    <ellipse cx="100" cy="130" rx="53" ry="59" fill="#C4885C"/>
                    <ellipse cx="100" cy="166" rx="34" ry="18" fill="#8A5A2C" opacity="0.22"/>
                    <ellipse cx="82" cy="121" rx="11" ry="10" fill="#FAFAF9"/>
                    <ellipse cx="118" cy="121" rx="11" ry="10" fill="#FAFAF9"/>
                    <circle cx="83" cy="121" r="7" fill="#1C0D00"/>
                    <circle cx="119" cy="121" r="7" fill="#1C0D00"/>
                    <circle cx="85.5" cy="118.5" r="2.4" fill="white"/>
                    <circle cx="121.5" cy="118.5" r="2.4" fill="white"/>
                    <path d="M 72 110 Q 82 104 94 107" stroke="#180800" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
                    <path d="M 106 107 Q 118 104 128 110" stroke="#180800" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
                    <path d="M 100 133 C 95 144, 92 151, 95 154 C 97 156, 103 156, 105 154 C 108 151, 105 144, 100 133" fill="#9A5C28" opacity="0.55"/>
                    <path d="M 89 159 Q 100 170 111 159" stroke="#7A4220" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
                    <circle cx="82" cy="121" r="19" fill="rgba(195,215,245,0.10)" stroke="#C2CDE0" strokeWidth="2.4"/>
                    <circle cx="118" cy="121" r="19" fill="rgba(195,215,245,0.10)" stroke="#C2CDE0" strokeWidth="2.4"/>
                    <path d="M 101 120 L 99 120" stroke="#C2CDE0" strokeWidth="2.2" strokeLinecap="round"/>
                    <line x1="63" y1="114" x2="49" y2="110" stroke="#C2CDE0" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="137" y1="114" x2="151" y2="110" stroke="#C2CDE0" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="75" cy="53" r="15" fill="#151515" opacity="0.55"/>
                    <circle cx="100" cy="44" r="17" fill="#151515" opacity="0.55"/>
                    <circle cx="125" cy="53" r="15" fill="#151515" opacity="0.55"/>
                    <circle cx="60" cy="70" r="12" fill="#151515" opacity="0.45"/>
                    <circle cx="140" cy="70" r="12" fill="#151515" opacity="0.45"/>
                    <circle cx="88" cy="40" r="10" fill="#151515" opacity="0.35"/>
                    <circle cx="112" cy="40" r="10" fill="#151515" opacity="0.35"/>
                  </svg>
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}>chimboy</div>
                <div className="w-full h-px bg-gray-100 mb-3" />
                <div className="inline-flex items-center gap-1.5 text-gray-500 text-[11px] font-mono bg-gray-50 rounded-lg px-2.5 py-1.5 group-hover:bg-gray-100 group-hover:text-gray-900 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor"/>
                  </svg>
                  @eliashuarte
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </div>
              </a>

              {/* Dui Card */}
              <a
                href="https://www.instagram.com/duilio.js/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center bg-white border border-black/7 rounded-2xl px-5 py-6 w-40 text-center shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#F4F0EB] mb-4 shrink-0">
                  <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <pattern id="shirt-check" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <rect width="10" height="10" fill="#F2D0D0"/>
                        <rect width="5" height="5" fill="#C44060" opacity="0.55"/>
                        <rect x="5" y="5" width="5" height="5" fill="#C44060" opacity="0.55"/>
                        <line x1="0" y1="0" x2="0" y2="10" stroke="#B03050" strokeWidth="0.6" opacity="0.4"/>
                        <line x1="5" y1="0" x2="5" y2="10" stroke="#B03050" strokeWidth="0.6" opacity="0.4"/>
                        <line x1="0" y1="0" x2="10" y2="0" stroke="#B03050" strokeWidth="0.6" opacity="0.4"/>
                        <line x1="0" y1="5" x2="10" y2="5" stroke="#B03050" strokeWidth="0.6" opacity="0.4"/>
                      </pattern>
                    </defs>
                    <rect width="200" height="230" fill="#F4F0EB"/>
                    <ellipse cx="100" cy="250" rx="110" ry="75" fill="url(#shirt-check)"/>
                    <rect x="0" y="192" width="200" height="60" fill="url(#shirt-check)"/>
                    <path d="M 78 196 L 100 220 L 122 196" stroke="#B03050" strokeWidth="1.5" fill="none" opacity="0.6"/>
                    <circle cx="100" cy="208" r="2.5" fill="#E8C8C8" opacity="0.8"/>
                    <rect x="82" y="168" width="36" height="32" fill="#C8905E" rx="10"/>
                    <path d="M 50 136 C 42 118, 37 94, 40 72 C 42 56, 50 40, 58 30 C 64 22, 74 14, 84 10 C 90 7, 96 6, 100 6 C 104 6, 110 7, 116 10 C 126 14, 136 22, 143 32 C 150 42, 158 58, 160 76 C 163 96, 157 120, 150 136 Z" fill="#181818"/>
                    <ellipse cx="48" cy="136" rx="13" ry="17" fill="#C8905E"/>
                    <ellipse cx="152" cy="136" rx="13" ry="17" fill="#C8905E"/>
                    <ellipse cx="48" cy="136" rx="8" ry="11" fill="#A87040" opacity="0.35"/>
                    <ellipse cx="152" cy="136" rx="8" ry="11" fill="#A87040" opacity="0.35"/>
                    <ellipse cx="100" cy="132" rx="57" ry="63" fill="#C8905E"/>
                    <circle cx="70" cy="148" r="16" fill="#D4785E" opacity="0.18"/>
                    <circle cx="130" cy="148" r="16" fill="#D4785E" opacity="0.18"/>
                    <ellipse cx="82" cy="122" rx="11" ry="10" fill="#FAFAF9"/>
                    <ellipse cx="118" cy="122" rx="11" ry="10" fill="#FAFAF9"/>
                    <circle cx="83" cy="122" r="7" fill="#1C0D00"/>
                    <circle cx="119" cy="122" r="7" fill="#1C0D00"/>
                    <circle cx="85.5" cy="119.5" r="2.4" fill="white"/>
                    <circle cx="121.5" cy="119.5" r="2.4" fill="white"/>
                    <path d="M 71 111 Q 82 105 95 108" stroke="#1a0800" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                    <path d="M 105 108 Q 118 105 129 111" stroke="#1a0800" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                    <path d="M 100 135 C 94 146, 90 154, 94 157 C 97 160, 103 160, 106 157 C 110 154, 106 146, 100 135" fill="#9A5C28" opacity="0.50"/>
                    <path d="M 83 158 Q 100 180 117 158 Q 100 166 83 158 Z" fill="#C0404A"/>
                    <path d="M 85 159 Q 100 174 115 159 Q 100 166 85 159 Z" fill="white"/>
                    <path d="M 86 163 Q 100 168 114 163" stroke="#E8C0C0" strokeWidth="1" fill="none" opacity="0.6"/>
                    <line x1="95" y1="160" x2="95" y2="166" stroke="#E0D0D0" strokeWidth="0.7" opacity="0.5"/>
                    <line x1="100" y1="160" x2="100" y2="167" stroke="#E0D0D0" strokeWidth="0.7" opacity="0.5"/>
                    <line x1="105" y1="160" x2="105" y2="166" stroke="#E0D0D0" strokeWidth="0.7" opacity="0.5"/>
                    <path d="M 83 158 Q 100 180 117 158" stroke="#8B3028" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
                    <path d="M 83 158 Q 100 164 117 158" stroke="#8B3028" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                    <path d="M 72 48 Q 85 38 100 42 Q 115 38 128 48" stroke="#181818" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.6"/>
                    <path d="M 65 62 Q 82 50 100 54 Q 118 50 135 62" stroke="#181818" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.5"/>
                    <path d="M 58 52 C 52 60, 50 72, 52 80" stroke="#181818" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.55"/>
                    <circle cx="80" cy="42" r="10" fill="#181818" opacity="0.4"/>
                    <circle cx="100" cy="36" r="12" fill="#181818" opacity="0.4"/>
                    <circle cx="120" cy="42" r="10" fill="#181818" opacity="0.4"/>
                  </svg>
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}>Dui</div>
                <div className="w-full h-px bg-gray-100 mb-3" />
                <div className="inline-flex items-center gap-1.5 text-gray-500 text-[11px] font-mono bg-gray-50 rounded-lg px-2.5 py-1.5 group-hover:bg-gray-100 group-hover:text-gray-900 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor"/>
                  </svg>
                  @duilio.js
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </div>
              </a>
            </div>

            <button
              onClick={() => setShowCredits(false)}
              className="w-full py-3 bg-orange text-white font-semibold rounded-xl active:scale-95 transition-all"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Rules Modal */}
      {showRules && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowRules(false)}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 max-w-sm w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
              Como se juega?
            </h2>

            <div className="space-y-5 mb-8">
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-orange text-white font-bold text-sm flex items-center justify-center shrink-0">1</span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Crea un juego e invita a tus amigos <strong>(3 a 7 jugadores)</strong>. Comparte el codigo para que se unan.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-orange text-white font-bold text-sm flex items-center justify-center shrink-0">2</span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Cada ronda, <strong>todos responden</strong> la misma pregunta personal. Se vale ser vulnerable y autentico.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-orange text-white font-bold text-sm flex items-center justify-center shrink-0">3</span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Se elige una respuesta al azar como la del <strong>Naked Man</strong>. Solo el sabe que fue elegido.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-orange text-white font-bold text-sm flex items-center justify-center shrink-0">4</span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Todos ven la respuesta y adivinan quien la escribio. Si adivinan, <strong>ganan 1 punto</strong>. El Naked Man gana 1 punto por cada persona que lo adivine <strong>(max 3)</strong>.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-orange text-white font-bold text-sm flex items-center justify-center shrink-0">5</span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  El primero en llegar a <strong>7 puntos</strong> gana. Gana el mas vulnerable y autentico.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full py-3 bg-orange text-white font-semibold rounded-xl active:scale-95 transition-all"
            >
              Entendido!
            </button>
          </motion.div>
        </motion.div>
      )}

      {showJoinModal && (
        <JoinGameModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  );
}
