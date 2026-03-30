'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const TIME_LIMIT = 40;

interface DrawingCanvasProps {
  question: string;
  questionNumber: number;
  onSubmit: (dataUrl: string) => void;
  onTimeout: () => void;
}

export default function DrawingCanvas({ question, questionNumber, onSubmit, onTimeout }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeout]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for retina
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.strokeStyle = '#D77C24';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  }, []);

  const startDraw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    lastPos.current = getPos(e);
    setHasDrawn(true);
  }, [getPos]);

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  }, [getPos]);

  const stopDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn || submitted) return;
    setSubmitted(true);
    const dataUrl = canvas.toDataURL('image/webp', 0.6);
    onSubmit(dataUrl);
  }, [hasDrawn, onSubmit, submitted]);

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
        <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
          Dibujo
        </span>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
          timeLeft <= 5 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {timeLeft}s
        </span>
      </div>

      {/* Timer bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
        <motion.div
          className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-orange'}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: TIME_LIMIT, ease: 'linear' }}
        />
      </div>

      <div className="w-full bg-orange/10 border-2 border-orange/30 rounded-2xl p-4 mb-4">
        <h2 className="text-xl font-extrabold text-gray-900 text-center leading-relaxed">
          {question}
        </h2>
      </div>

      {/* Canvas */}
      <div className="w-full aspect-square bg-white border-2 border-gray-200 rounded-2xl overflow-hidden mb-3 touch-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      <div className="flex gap-3 w-full mb-2">
        <button
          onClick={clearCanvas}
          className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl active:scale-95 transition-all"
        >
          Borrar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!hasDrawn || submitted}
          className="flex-1 py-3 bg-orange text-white font-semibold rounded-xl active:scale-95 transition-all disabled:opacity-40"
        >
          Enviar dibujo
        </button>
      </div>
    </motion.div>
  );
}
