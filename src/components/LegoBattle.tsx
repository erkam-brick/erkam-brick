"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Target, Heart, Zap, Crosshair } from 'lucide-react';

const PLAYER_SPEED = 4;
const ENEMY_SPEED = 1.5;
const BULLET_SPEED = 8;
const SPAWN_RATE = 2000;

type Entity = {
  id: number;
  x: number;
  y: number;
  hp: number;
  type: 'player' | 'enemy' | 'bullet';
  vx?: number;
  vy?: number;
};

export default function LegoBattle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState<Entity>({ id: 0, x: 300, y: 200, hp: 3, type: 'player' });
  const [enemies, setEnemies] = useState<Entity[]>([]);
  const [bullets, setBullets] = useState<Entity[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const requestRef = useRef<number>(null);
  const lastSpawnRef = useRef<number>(0);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setPlayer({ id: 0, x: 300, y: 200, hp: 3, type: 'player' });
    setEnemies([]);
    setBullets([]);
    lastSpawnRef.current = performance.now();
  };

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => keysRef.current[e.code] = true;
    const handleUp = (e: KeyboardEvent) => keysRef.current[e.code] = false;
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  const shoot = (e: React.MouseEvent) => {
    if (!isPlaying || isGameOver || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;
    
    const dx = targetX - player.x;
    const dy = targetY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const newBullet: Entity = {
      id: Date.now(),
      x: player.x,
      y: player.y,
      vx: (dx / distance) * BULLET_SPEED,
      vy: (dy / distance) * BULLET_SPEED,
      hp: 1,
      type: 'bullet'
    };
    
    setBullets(prev => [...prev, newBullet]);
  };

  const update = useCallback((time: number) => {
    if (!isPlaying || isGameOver) return;

    // Move Player
    setPlayer(p => {
      let nx = p.x;
      let ny = p.y;
      if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) ny -= PLAYER_SPEED;
      if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) ny += PLAYER_SPEED;
      if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) nx -= PLAYER_SPEED;
      if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) nx += PLAYER_SPEED;
      
      return { 
        ...p, 
        x: Math.max(20, Math.min(580, nx)), 
        y: Math.max(20, Math.min(380, ny)) 
      };
    });

    // Move Bullets
    setBullets(prev => prev
      .map(b => ({ ...b, x: b.x + (b.vx || 0), y: b.y + (b.vy || 0) }))
      .filter(b => b.x > 0 && b.x < 600 && b.y > 0 && b.y < 400)
    );

    // Spawn & Move Enemies
    if (time - lastSpawnRef.current > SPAWN_RATE) {
      const side = Math.floor(Math.random() * 4);
      let sx = 0, sy = 0;
      if (side === 0) { sx = Math.random() * 600; sy = -50; }
      else if (side === 1) { sx = 650; sy = Math.random() * 400; }
      else if (side === 2) { sx = Math.random() * 600; sy = 450; }
      else { sx = -50; sy = Math.random() * 400; }

      setEnemies(prev => [...prev, { id: Date.now(), x: sx, y: sy, hp: 1, type: 'enemy' }]);
      lastSpawnRef.current = time;
    }

    setEnemies(prev => {
      return prev.map(e => {
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return { ...e, x: e.x + (dx / dist) * ENEMY_SPEED, y: e.y + (dy / dist) * ENEMY_SPEED };
      });
    });

    // Collision Detection
    setBullets(prevB => {
      let nextB = [...prevB];
      setEnemies(prevE => {
        let nextE = [...prevE];
        
        nextB.forEach((b, bi) => {
          nextE.forEach((e, ei) => {
            const dist = Math.sqrt((b.x - e.x)**2 + (b.y - e.y)**2);
            if (dist < 25) {
              nextE.splice(ei, 1);
              nextB.splice(bi, 1);
              setScore(s => s + 50);
            }
          });
        });
        
        return nextE;
      });
      return nextB;
    });

    // Player Damage
    setEnemies(prev => {
       prev.forEach(e => {
          const dist = Math.sqrt((player.x - e.x)**2 + (player.y - e.y)**2);
          if (dist < 30) {
             setPlayer(p => {
                if (p.hp <= 1) {
                   setIsGameOver(true);
                   setIsPlaying(false);
                }
                return { ...p, hp: p.hp - 0.05 }; // Fast tick damage
             });
          }
       });
       return prev;
    });

    requestRef.current = requestAnimationFrame(update);
  }, [isPlaying, isGameOver, player.x, player.y]);

  useEffect(() => {
    if (isPlaying && !isGameOver) requestRef.current = requestAnimationFrame(update);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, isGameOver, update]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-zinc-950 rounded-[3rem] border-4 border-zinc-800 shadow-2xl relative overflow-hidden min-h-[500px]">
      <div className="flex items-center justify-between w-full max-w-2xl mb-6 relative z-10">
        <div className="flex flex-col">
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <Sword className="text-lego-red" /> LEGO ARENA
          </h3>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">Survival Mode</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-800">
             <Heart className="text-lego-red" fill="currentColor" size={16} />
             <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-lego-red transition-all" style={{ width: `${(player.hp / 3) * 100}%` }} />
             </div>
          </div>
          <div className="bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-800">
             <span className="text-xl font-black text-lego-yellow">{score}</span>
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        onClick={shoot}
        className="relative w-full max-w-2xl h-[400px] bg-zinc-900 rounded-3xl border-2 border-zinc-800 overflow-hidden cursor-crosshair shadow-inner"
      >
        {/* Dynamic Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Player */}
        <motion.div 
           animate={{ x: player.x - 20, y: player.y - 30 }}
           className="absolute w-10 h-14 z-20"
        >
           <div className="w-6 h-6 bg-lego-yellow rounded-md mx-auto relative border-2 border-black/20">
              <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full" />
              <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full" />
           </div>
           <div className="w-10 h-8 bg-lego-red rounded-sm border-2 border-black/20" />
           <div className="flex gap-0.5 justify-center">
              <div className="w-4 h-4 bg-zinc-800 rounded-sm" />
              <div className="w-4 h-4 bg-zinc-800 rounded-sm" />
           </div>
        </motion.div>

        {/* Enemies */}
        {enemies.map(e => (
          <div 
            key={e.id}
            className="absolute w-8 h-10 bg-zinc-700 rounded-sm flex flex-col items-center"
            style={{ left: e.x - 16, top: e.y - 20 }}
          >
             <div className="w-4 h-4 bg-lego-blue rounded-full border border-black/20" />
             <div className="w-8 h-6 bg-zinc-600 rounded-sm" />
          </div>
        ))}

        {/* Bullets */}
        {bullets.map(b => (
          <div 
            key={b.id}
            className="absolute w-3 h-3 bg-lego-yellow rounded-full shadow-lg shadow-lego-yellow/50 pointer-events-none"
            style={{ left: b.x - 6, top: b.y - 6 }}
          />
        ))}

        {/* Overlays */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center p-8">
               <div className="w-20 h-20 bg-lego-red rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 rotate-12">
                  <Target size={40} />
               </div>
               <h4 className="text-4xl font-black text-white mb-4">SAVAŞA HAZIR OL!</h4>
               <p className="text-zinc-400 mb-8 font-medium">Hareket: WASD | Ateş: Mouse</p>
               <button onClick={startGame} className="px-10 py-4 bg-lego-red text-white font-black rounded-2xl hover:bg-red-600 transition-all hover:scale-105 active:scale-95 shadow-xl">
                 BAŞLA
               </button>
            </motion.div>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-lego-red/30 backdrop-blur-md flex flex-col items-center justify-center z-30">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="bg-white p-10 rounded-[3rem] text-center shadow-2xl">
               <h4 className="text-5xl font-black text-lego-red mb-2 italic">ARENADA DÜŞTÜN!</h4>
               <p className="text-zinc-500 mb-8 font-bold">TOPLAM PUAN: {score}</p>
               <button onClick={startGame} className="w-full py-4 bg-zinc-950 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all shadow-xl">
                 TEKRAR DENE
               </button>
            </motion.div>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-2xl">
         <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
            <span className="p-2 bg-lego-blue rounded-lg text-white"><Zap size={20} /></span>
            <div>
               <p className="text-[10px] font-black text-zinc-500 uppercase">Cephane</p>
               <p className="text-lg font-black text-white">Sonsuz Stud</p>
            </div>
         </div>
         <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
            <span className="p-2 bg-lego-yellow rounded-lg text-black"><Crosshair size={20} /></span>
            <div>
               <p className="text-[10px] font-black text-zinc-500 uppercase">Zorluk</p>
               <p className="text-lg font-black text-white">Dinamik</p>
            </div>
         </div>
      </div>
    </div>
  );
}
