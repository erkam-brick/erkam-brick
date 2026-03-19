"use client";

import { motion } from "framer-motion";
import { POWERED_UP_MOTORS } from "../../data/projects";
import Navbar from "../../components/Navbar";

export default function MotorlarPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lego-red to-orange-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-lego-red/30 flex-shrink-0">
                ⚡
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                LEGO Powered UP Motorları
              </h1>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-3xl ml-16">
              Yapılarıma hareket kazandıran güç kaynakları. Koleksiyonumda bulunan ve projelerimde aktif olarak kullandığım Powered UP motor serim.
            </p>
          </motion.div>

          {POWERED_UP_MOTORS.length === 0 ? (
            <div className="text-center py-32 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-700">
              <span className="text-6xl mb-6 block">⚡</span>
              <h3 className="text-2xl font-bold mb-2">Henüz Motor Eklenmedi</h3>
              <p className="text-zinc-500">Yakında koleksiyondan motorlar burada görünecek!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {POWERED_UP_MOTORS.map((motor, index) => (
                <motion.div
                  key={motor.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Top gradient banner */}
                  <div className={`h-36 bg-gradient-to-br ${motor.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    <span className="text-7xl relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {motor.icon}
                    </span>
                    <div className="absolute bottom-0 right-0 px-3 py-1 bg-black/30 backdrop-blur text-white text-xs font-mono font-bold rounded-tl-xl">
                      #{motor.subtitle}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-extrabold mb-2 tracking-tight">{motor.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed flex-grow">
                      {motor.description}
                    </p>

                    {/* Technical Specs */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex flex-col items-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Hız</span>
                        <span className="text-sm font-extrabold text-foreground">{motor.speed}</span>
                      </div>
                      <div className="flex flex-col items-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Tork</span>
                        <span className="text-sm font-extrabold text-foreground">{motor.torque}</span>
                      </div>
                      <div className="flex flex-col items-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Uyum</span>
                        <span className="text-[10px] font-extrabold text-foreground text-center leading-tight">{motor.compatible}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
