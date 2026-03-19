import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Brick = {
  id: number;
  x: number;
  y: number;
  color: string;
  width: number;
};

const COLORS = [
  'bg-lego-red',
  'bg-lego-blue',
  'bg-lego-yellow',
  'bg-lego-green',
  'bg-zinc-800',
  'bg-orange-500',
];

const BRICK_HEIGHT = 24;
const BRICK_WIDTHS = [2, 3, 4]; // In grid units (1 unit = 24px)
const GRID_UNIT = 24;
const BOARD_WIDTH = 300;
const BOARD_HEIGHT = 400;

export default function LegoGame() {
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [currentBrick, setCurrentBrick] = useState<Brick | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setBricks([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    spawnBrick();
  };

  const spawnBrick = () => {
    const widthUnit = BRICK_WIDTHS[Math.floor(Math.random() * BRICK_WIDTHS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const width = widthUnit * GRID_UNIT;
    
    // Start at top center
    const startX = Math.floor((BOARD_WIDTH - width) / 2 / GRID_UNIT) * GRID_UNIT;

    setCurrentBrick({
      id: Date.now(),
      x: startX,
      y: 0,
      color,
      width,
    });
  };

  useEffect(() => {
    if (!isPlaying || gameOver || !currentBrick) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (e.key === 'ArrowLeft') {
        setCurrentBrick(prev => {
          if (!prev) return prev;
          const newX = Math.max(0, prev.x - GRID_UNIT);
          // Check collision with other bricks
          if (checkCollision(newX, prev.y, prev.width, bricks)) return prev;
          return { ...prev, x: newX };
        });
      } else if (e.key === 'ArrowRight') {
        setCurrentBrick(prev => {
          if (!prev) return prev;
          const newX = Math.min(BOARD_WIDTH - prev.width, prev.x + GRID_UNIT);
          // Check collision
          if (checkCollision(newX, prev.y, prev.width, bricks)) return prev;
          return { ...prev, x: newX };
        });
      } else if (e.key === 'ArrowDown') {
         dropBrick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, currentBrick, bricks]);

  const checkCollision = (x: number, y: number, width: number, existingBricks: Brick[]) => {
    // Check floor
    if (y + BRICK_HEIGHT > BOARD_HEIGHT) return true;
    
    // Check other bricks
    for (const b of existingBricks) {
      if (
        x < b.x + b.width &&
        x + width > b.x &&
        y + BRICK_HEIGHT > b.y &&
        y < b.y + BRICK_HEIGHT
      ) {
        return true;
      }
    }
    return false;
  };

  const dropBrick = () => {
     setCurrentBrick(prev => {
         if(!prev) return prev;
         let newY = prev.y;
         while(!checkCollision(prev.x, newY + GRID_UNIT, prev.width, bricks)) {
             newY += GRID_UNIT;
         }

         if (newY <= 0) {
            setGameOver(true);
            setIsPlaying(false);
            return prev;
         }

         setBricks(old => [...old, { ...prev, y: newY }]);
         setScore(s => s + 10);
         spawnBrick();
         return null;
     });
  };

  // Automatic falling
  useEffect(() => {
    if (!isPlaying || gameOver || !currentBrick) return;

    const fallInterval = setInterval(() => {
      setCurrentBrick(prev => {
        if (!prev) return prev;
        
        const newY = prev.y + GRID_UNIT;
        
        if (checkCollision(prev.x, newY, prev.width, bricks)) {
          // Locked in place
          if (prev.y <= 0) {
            setGameOver(true);
            setIsPlaying(false);
            return prev;
          }
          
          setBricks(old => [...old, { ...prev, y: prev.y }]);
          setScore(s => s + 10);
          setTimeout(spawnBrick, 50);
          return null;
        }
        
        return { ...prev, y: newY };
      });
    }, 500);

    return () => clearInterval(fallInterval);
  }, [isPlaying, gameOver, currentBrick, bricks]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
      <div className="flex items-center justify-between w-full max-w-[300px] mb-4 px-2">
        <h3 className="font-extrabold text-xl text-foreground tracking-tight">Brick Drop</h3>
        <div className="bg-foreground text-background font-mono px-3 py-1 rounded-lg font-bold">
          {score.toString().padStart(4, '0')}
        </div>
      </div>

      <div 
        ref={gameBoardRef}
        className="relative bg-zinc-200 dark:bg-zinc-900 overflow-hidden rounded-xl border-4 border-zinc-300 dark:border-zinc-800"
        style={{ width: BOARD_WIDTH + 8, height: BOARD_HEIGHT + 8 }}
      >
        {/* Grid Background */}
        <div 
           className="absolute inset-0 opacity-10 pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)',
             backgroundSize: `${GRID_UNIT}px ${GRID_UNIT}px`
           }}
        />

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-6 text-center">
            <div className="w-16 h-16 bg-lego-blue rounded-xl flex items-center justify-center mb-4 transform -rotate-12">
               <span className="text-white font-bold text-2xl">L</span>
            </div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-6">Blokları yön tuşlarıyla hareket ettirin ve düşürün.</p>
            <button 
              onClick={startGame}
              className="px-6 py-3 bg-lego-green text-white font-bold rounded-full hover:bg-green-600 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Oyuna Başla
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md p-6 text-center">
            <h4 className="text-3xl font-extrabold text-lego-red mb-2">Eyvah Yıkıldı!</h4>
            <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400 mb-6">Skor: {score}</p>
            <button 
              onClick={startGame}
              className="px-6 py-3 bg-lego-blue text-white font-bold rounded-full hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Tekrar Oyna
            </button>
          </div>
        )}

        {/* Existing Bricks */}
        {bricks.map((brick) => (
          <div
            key={brick.id}
            className={`absolute ${brick.color} rounded-sm shadow-sm border border-black/10`}
            style={{
              left: brick.x,
              top: brick.y,
              width: brick.width,
              height: BRICK_HEIGHT - 2,
            }}
          >
            {/* Studs */}
            <div className="absolute top-0 left-0 right-0 h-[4px] -mt-[4px] flex justify-around px-1">
              {Array.from({ length: brick.width / GRID_UNIT }).map((_, i) => (
                <div key={i} className={`w-[12px] h-[4px] ${brick.color} rounded-t-sm shadow-inner brightness-110`} />
              ))}
            </div>
          </div>
        ))}

        {/* Current Falling Brick */}
        {currentBrick && (
          <div
            className={`absolute ${currentBrick.color} rounded-sm shadow-md border border-black/20 z-20 transition-all duration-75`}
            style={{
              left: currentBrick.x,
              top: currentBrick.y,
              width: currentBrick.width,
              height: BRICK_HEIGHT - 2,
            }}
          >
            {/* Studs */}
            <div className="absolute top-0 left-0 right-0 h-[4px] -mt-[4px] flex justify-around px-1">
              {Array.from({ length: currentBrick.width / GRID_UNIT }).map((_, i) => (
                <div key={i} className={`w-[12px] h-[4px] ${currentBrick.color} rounded-t-sm shadow-inner brightness-110`} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {isPlaying && (
         <div className="mt-6 flex gap-4 md:hidden">
            <button onClick={() => {
                setCurrentBrick(prev => {
                    if (!prev) return prev;
                    const newX = Math.max(0, prev.x - GRID_UNIT);
                    if (checkCollision(newX, prev.y, prev.width, bricks)) return prev;
                    return { ...prev, x: newX };
                });
            }} className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center active:bg-zinc-300 dark:active:bg-zinc-700 text-2xl font-bold transition-colors">
              ←
            </button>
            <button onClick={dropBrick} className="w-16 h-16 bg-lego-blue text-white rounded-full flex items-center justify-center active:bg-blue-600 text-2xl font-bold transition-colors">
              ↓
            </button>
            <button onClick={() => {
                setCurrentBrick(prev => {
                    if (!prev) return prev;
                    const newX = Math.min(BOARD_WIDTH - prev.width, prev.x + GRID_UNIT);
                    if (checkCollision(newX, prev.y, prev.width, bricks)) return prev;
                    return { ...prev, x: newX };
                });
            }} className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center active:bg-zinc-300 dark:active:bg-zinc-700 text-2xl font-bold transition-colors">
              →
            </button>
         </div>
      )}
    </div>
  );
}
