"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, CheckCircle2, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

const PUZZLE_MODELS = [
  {
    name: "Küçük Ev",
    pieces: [
      { id: 1, type: '2x2', x: 2, y: 2, color: '#E3000B' },
      { id: 2, type: '2x2', x: 4, y: 2, color: '#E3000B' },
      { id: 3, type: '4x2', x: 2, y: 4, color: '#0055BF' },
    ]
  },
  {
    name: "LEGO Kulesi",
    pieces: [
      { id: 1, type: '2x2', x: 3, y: 3, color: '#F6D105' },
      { id: 2, type: '2x2', x: 3, y: 3, color: '#0055BF', z: 1 },
      { id: 3, type: '2x2', x: 3, y: 3, color: '#E3000B', z: 2 },
    ]
  }
];

export default function LegoPuzzle() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [placedPieces, setPlacedPieces] = useState<number[]>([]);
  const [isWin, setIsWin] = useState(false);
  const [score, setScore] = useState(0);

  const model = PUZZLE_MODELS[currentLevel];

  const placePiece = (id: number) => {
    if (placedPieces.includes(id)) return;
    const newPlaced = [...placedPieces, id];
    setPlacedPieces(newPlaced);
    setScore(s => s + 100);

    if (newPlaced.length === model.pieces.length) {
      setIsWin(true);
    }
  };

  const nextLevel = () => {
    if (currentLevel < PUZZLE_MODELS.length - 1) {
      setCurrentLevel(l => l + 1);
      setPlacedPieces([]);
      setIsWin(false);
    }
  };

  const resetLevel = () => {
    setPlacedPieces([]);
    setIsWin(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative min-h-[500px]">
      <div className="flex items-center justify-between w-full max-w-2xl mb-8">
        <div>
          <h3 className="text-2xl font-black flex items-center gap-2">
            <Puzzle className="text-lego-yellow" /> LEGO PUZZLE
          </h3>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-tighter">Model: {model.name}</p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-700">
           <span className="text-xs font-bold text-zinc-400 block">PUAN</span>
           <span className="text-xl font-black text-lego-blue">{score}</span>
        </div>
      </div>

      <div className="relative w-full max-w-2xl h-[300px] bg-zinc-50 dark:bg-zinc-950 rounded-3xl border-4 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
        {/* The target silhouette - isometric-ish */}
        <div 
          className="relative transform-gpu"
          style={{ transform: `perspective(1000px) rotateX(45deg) rotateZ(45deg)` }}
        >
          {model.pieces.map((p: any) => (
            <div
              key={p.id}
              onClick={() => placePiece(p.id)}
              className={`absolute transition-all duration-500 cursor-pointer ${
                placedPieces.includes(p.id) 
                  ? "opacity-100 scale-100" 
                  : "opacity-20 scale-110 grayscale blur-[2px] hover:opacity-40"
              }`}
              style={{
                left: p.x * 30,
                top: p.y * 30,
                width: 30 * (p.type === '4x2' ? 4 : 2),
                height: 30 * (p.type === '2x2' ? 2 : 2),
                backgroundColor: p.color,
                zIndex: p.z || 0,
                transform: `translateZ(${(p.z || 0) * 15}px)`,
                borderRadius: '4px',
                border: '2px solid rgba(0,0,0,0.1)'
              }}
            >
               {/* Studs */}
               <div className="grid grid-cols-2 grid-rows-2 h-full p-0.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white/20 m-auto" />
                  ))}
               </div>
            </div>
          ))}
        </div>

        {!isWin && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-bold">
            Eksik parçaların üzerine tıklayarak modeli tamamla!
          </div>
        )}
      </div>

      {isWin && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-50 bg-lego-green/10 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] shadow-2xl border-4 border-lego-green max-w-xs w-full">
            <div className="w-20 h-20 bg-lego-green rounded-full flex items-center justify-center text-white mx-auto mb-4">
              <Trophy size={40} />
            </div>
            <h4 className="text-3xl font-black mb-2 leading-tight">HARİKA İŞ!</h4>
            <p className="text-zinc-500 mb-8 font-medium">Modeli kusursuz bir şekilde tamamladın.</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={nextLevel}
                className="w-full py-4 bg-lego-blue text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
              >
                SONRAKİ SEVİYE <ArrowRight size={20} />
              </button>
              <button 
                onClick={resetLevel}
                className="w-full py-3 text-zinc-500 font-bold hover:text-foreground transition-colors"
              >
                TEKRAR OYNA
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Level Info */}
      <div className="mt-8 flex gap-2">
         {PUZZLE_MODELS.map((_, i) => (
           <div key={i} className={`w-12 h-2 rounded-full transition-all ${currentLevel === i ? 'bg-lego-blue w-20' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
         ))}
      </div>
    </div>
  );
}
