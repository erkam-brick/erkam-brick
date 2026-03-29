"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, RotateCw, Palette, Layers, Box, Download, Image as ImageIcon, Heart } from 'lucide-react';

// Constants
const GRID_SIZE = 12;
const BRICK_TYPES = [
  { id: '1x1', w: 1, h: 1, label: '1x1' },
  { id: '2x1', w: 2, h: 1, label: '2x1' },
  { id: '2x2', w: 2, h: 2, label: '2x2' },
  { id: '4x2', w: 4, h: 2, label: '4x2' },
  { id: '1x2', w: 1, h: 2, label: '1x2' },
];

const COLORS = [
  '#E3000B', // Red
  '#0055BF', // Blue
  '#F6D105', // Yellow
  '#237841', // Green
  '#FFFFFF', // White
  '#000000', // Black
  '#FFA500', // Orange
  '#808080', // Gray
];

type BrickInstance = {
  id: string;
  type: string;
  x: number;
  y: number;
  z: number;
  color: string;
  rotation: number;
};

type LegoBuilderProps = {
  user?: string | null;
  onRequireLogin?: () => void;
};

export default function LegoBuilder({ user, onRequireLogin }: LegoBuilderProps = {}) {
  const [bricks, setBricks] = useState<BrickInstance[]>([]);
  const [selectedBrickIndex, setSelectedBrickIndex] = useState<number | null>(null);
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [activeType, setActiveType] = useState(BRICK_TYPES[2]);
  const [viewRotation, setViewRotation] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('lego_builds');
    if (saved) setSavedBuilds(JSON.parse(saved));
  }, []);

  const addBrick = () => {
    const newBrick: BrickInstance = {
      id: Math.random().toString(36).substr(2, 9),
      type: activeType.id,
      x: 5,
      y: 5,
      z: getTopLayer(5, 5),
      color: activeColor,
      rotation: 0,
    };
    setBricks([...bricks, newBrick]);
    setSelectedBrickIndex(bricks.length);
  };

  const getTopLayer = (x: number, y: number) => {
    let maxZ = 0;
    bricks.forEach(b => {
      if (b.x === x && b.y === y) {
        maxZ = Math.max(maxZ, b.z + 1);
      }
    });
    return maxZ;
  };

  const moveBrick = (dx: number, dy: number) => {
    if (selectedBrickIndex === null) return;
    setBricks(prev => {
      const next = [...prev];
      const b = { ...next[selectedBrickIndex] };
      b.x = Math.max(0, Math.min(GRID_SIZE - 1, b.x + dx));
      b.y = Math.max(0, Math.min(GRID_SIZE - 1, b.y + dy));
      b.z = getTopLayer(b.x, b.y);
      next[selectedBrickIndex] = b;
      return next;
    });
  };

  const rotateBrick = () => {
    if (selectedBrickIndex === null) return;
    setBricks(prev => {
      const next = [...prev];
      next[selectedBrickIndex].rotation = (next[selectedBrickIndex].rotation + 90) % 360;
      return next;
    });
  };

  const deleteBrick = () => {
    if (selectedBrickIndex === null) return;
    setBricks(bricks.filter((_, i) => i !== selectedBrickIndex));
    setSelectedBrickIndex(null);
  };

  const saveBuild = () => {
    if (!user) {
      if (onRequireLogin) onRequireLogin();
      return;
    }
    const newBuild = {
      id: Date.now(),
      name: `Mükemmel Yapı #${savedBuilds.length + 1}`,
      data: bricks,
      likes: 0,
      timestamp: new Date().toISOString()
    };
    const newSaved = [...savedBuilds, newBuild];
    setSavedBuilds(newSaved);
    localStorage.setItem('lego_builds', JSON.stringify(newSaved));
    setMessage("Başarıyla kaydedildi! Galeride paylaşabilirsiniz.");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center h-full max-w-7xl mx-auto p-4">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl flex flex-col gap-6">
        <div>
          <h4 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Box size={16} /> Parça Seçimi
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {BRICK_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveType(type)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  activeType.id === type.id 
                    ? "border-lego-blue bg-lego-blue/5 text-lego-blue" 
                    : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200"
                }`}
              >
                <div className="w-8 h-4 bg-zinc-300 dark:bg-zinc-700 rounded-sm" style={{ width: type.w * 8, height: type.h * 8 }} />
                <span className="text-[10px] font-bold">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Palette size={16} /> Renkler
          </h4>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setActiveColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  activeColor === color ? "border-foreground scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-3">
          <button
            onClick={addBrick}
            className="w-full py-4 bg-lego-red text-white font-black rounded-2xl shadow-lg shadow-lego-red/20 flex items-center justify-center gap-2 hover:bg-red-600 active:scale-95 transition-all"
          >
            <Plus size={20} /> PARÇA EKLE
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={rotateBrick}
              disabled={selectedBrickIndex === null}
              className="py-3 bg-zinc-100 dark:bg-zinc-800 text-foreground font-bold rounded-xl disabled:opacity-50 hover:bg-zinc-200 flex items-center justify-center gap-2"
            >
              <RotateCw size={16} /> ÇEVİR
            </button>
            <button
              onClick={deleteBrick}
              disabled={selectedBrickIndex === null}
              className="py-3 bg-zinc-100 dark:bg-zinc-800 text-lego-red font-bold rounded-xl disabled:opacity-50 hover:bg-zinc-200 flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> SİL
            </button>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
           <button
             onClick={saveBuild}
             className="w-full py-3 border-2 border-lego-blue text-lego-blue font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-lego-blue/5 transition-colors"
           >
             <Save size={18} /> TASARIMI KAYDET
           </button>
           <button
             onClick={() => setIsGalleryOpen(true)}
             className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
           >
             <ImageIcon size={18} /> TOPLULUK GALERİSİ
           </button>
        </div>
      </div>

      {/* Builder Workspace */}
      <div className="flex-grow bg-zinc-200 dark:bg-zinc-950 rounded-[3rem] border-8 border-white dark:border-zinc-800 shadow-inner relative overflow-hidden min-h-[600px] flex flex-col">
        {message && (
          <motion.div 
            initial={{ y: -50 }} animate={{ y: 20 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-lego-green text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2"
          >
            <Download size={18} /> {message}
          </motion.div>
        )}

        {/* Viewport Controls */}
        <div className="absolute bottom-6 left-6 z-10 flex gap-2">
          <button 
            onClick={() => setBricks([])}
            className="p-3 bg-white dark:bg-zinc-900 rounded-full shadow-lg hover:text-lego-red transition-colors"
            title="Temizle"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* The Grid / Scene */}
        <div className="flex-grow relative flex items-center justify-center">
          <div 
            className="relative transform-gpu transition-transform duration-500"
            style={{ 
              width: GRID_SIZE * 40, 
              height: GRID_SIZE * 40,
              transform: `perspective(1000px) rotateX(60deg) rotateZ(45deg)`,
            }}
          >
            {/* Grid Helper */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 border border-black/5 pointer-events-none">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-black/10 dark:border-white/5" />
              ))}
            </div>

            {/* Bricks */}
            <AnimatePresence>
              {bricks.map((brick, index) => {
                const type = BRICK_TYPES.find(t => t.id === brick.type) || BRICK_TYPES[0];
                return (
                  <motion.div
                    key={brick.id}
                    initial={{ scale: 0, z: 100 }}
                    animate={{ scale: 1, z: 0 }}
                    onClick={() => setSelectedBrickIndex(index)}
                    className="absolute cursor-pointer transition-all preserve-3d"
                    style={{
                      left: brick.x * 40,
                      top: brick.y * 40,
                      width: type.w * 40 - 2,
                      height: type.h * 40 - 2,
                      zIndex: brick.z,
                      transform: `translateZ(${brick.z * 16}px) rotateZ(${brick.rotation}deg)`,
                    }}
                  >
                    {/* Shadow */}
                    <div className="absolute inset-0 bg-black/20 blur-sm translate-y-1 translate-x-1" />
                    
                    {/* Brick Body */}
                    <div 
                      className={`absolute inset-0 rounded-[2px] shadow-sm border border-black/10 ${selectedBrickIndex === index ? 'ring-4 ring-lego-blue ring-offset-2 ring-offset-transparent' : ''}`}
                      style={{ backgroundColor: brick.color }}
                    >
                      {/* Studs */}
                      <div className="grid grid-cols-2 grid-rows-2 h-full p-1 gap-1">
                        {Array.from({ length: type.w * type.h }).map((_, i) => (
                          <div key={i} className="w-4 h-4 rounded-full shadow-inner brightness-110 opacity-60 m-auto" style={{ backgroundColor: brick.color }} />
                        ))}
                      </div>
                      
                      {/* 3D Sides using CSS */}
                      <div className="absolute top-0 left-0 w-full h-full bg-black/10 rounded-[2px]" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Selected Brick Controls overlay */}
        {selectedBrickIndex !== null && (
          <div className="absolute top-6 right-6 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
             <div className="text-xs font-bold text-zinc-500">KONUM</div>
             <div className="flex gap-1">
                <button onClick={() => moveBrick(-1, 0)} className="w-8 h-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200">←</button>
                <div className="flex flex-col gap-1">
                   <button onClick={() => moveBrick(0, -1)} className="w-8 h-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200">↑</button>
                   <button onClick={() => moveBrick(0, 1)} className="w-8 h-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200">↓</button>
                </div>
                <button onClick={() => moveBrick(1, 0)} className="w-8 h-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200">→</button>
             </div>
             <button onClick={() => setSelectedBrickIndex(null)} className="ml-4 p-2 text-zinc-400 hover:text-foreground"><RotateCw size={18} /></button>
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
             className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
           >
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/50">
                <div>
                  <h3 className="text-3xl font-black tracking-tight">Topluluk Galerisi</h3>
                  <p className="text-zinc-500 font-medium">Usta Yapıcıların en iyi eserleri.</p>
                </div>
                <button onClick={() => setIsGalleryOpen(false)} className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-100">✕</button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-8">
                 {savedBuilds.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                       <Box size={64} className="mb-4 opacity-20" />
                       <p className="font-bold">Henüz paylaşılan bir eser yok.</p>
                       <p className="text-sm">İlk eseri sen oluştur!</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {savedBuilds.map((build, i) => (
                          <div key={i} className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 hover:shadow-xl transition-shadow flex flex-col">
                             <div className="aspect-square bg-zinc-200 dark:bg-zinc-900 rounded-2xl mb-4 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                                <Box size={40} className="text-lego-blue opacity-50" />
                             </div>
                             <h5 className="font-black mb-2">{build.name}</h5>
                             <div className="mt-auto flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-400">{new Date(build.timestamp).toLocaleDateString()}</span>
                                <button className="flex items-center gap-1.5 text-lego-red font-bold text-sm">
                                   <Heart size={16} /> {build.likes || 0}
                                </button>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
              
              <div className="p-6 bg-lego-blue text-white flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Layers size={24} />
                    <div>
                       <p className="font-black leading-none">Haftalık Challenge</p>
                       <p className="text-xs opacity-80">10 parça ile bir asma köprü inşa et!</p>
                    </div>
                 </div>
                 <button onClick={() => setIsGalleryOpen(false)} className="px-6 py-2 bg-white text-lego-blue font-black rounded-full hover:bg-zinc-100 transition-colors">YAPIMA BAŞLA</button>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
}
