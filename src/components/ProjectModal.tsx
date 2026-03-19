"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Cuboid, Download, Play, Heart, ChevronRight, ChevronLeft, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Project } from "../data/projects";

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
  isFavorite: boolean;
  toggleFavorite: (e: React.MouseEvent) => void;
};

export default function ProjectModal({ project, onClose, isFavorite, toggleFavorite }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"genel" | "nasil-yaptim" | "yorumlar">("genel");
  const [guess, setGuess] = useState("");
  const [guessResult, setGuessResult] = useState<"idle" | "low" | "high" | "correct">("idle");

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(guess);
    if (isNaN(num)) return;

    if (num === project.piecesNumber) {
      setGuessResult("correct");
    } else if (num < project.piecesNumber) {
      setGuessResult("low");
    } else {
      setGuessResult("high");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          layoutId={`project-container-${project.id}`}
          className="relative w-full max-w-5xl bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Main Image Area */}
          <div className="w-full md:w-1/2 relative bg-zinc-100 dark:bg-zinc-900 min-h-[300px] md:min-h-full">
            <motion.img 
              layoutId={`project-image-${project.id}`}
              src={project.image} 
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient Overlay for Top Area */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/80 transition-colors md:hidden"
            >
              <X size={20} />
            </button>

            {/* Media controls mockup */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-white opacity-100 shadow-sm" />
                  <div className="w-2 h-2 rounded-full bg-white opacity-40 hover:opacity-100 cursor-pointer shadow-sm transition-opacity" />
                  <div className="w-2 h-2 rounded-full bg-white opacity-40 hover:opacity-100 cursor-pointer shadow-sm transition-opacity" />
               </div>
               <button className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur text-black rounded-full font-bold text-sm hover:bg-white hover:scale-105 transition-all shadow-lg">
                  <Play size={16} fill="currentColor" />
                  Timelapse İzle
               </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-1/2 flex flex-col h-full bg-white dark:bg-zinc-950 overflow-y-auto">
            <div className="p-8 pb-4 flex-grow">
               <div className="flex justify-between items-start mb-4">
                  <div>
                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3 shadow-md ${project.color}`}>
                        {project.category}
                     </span>
                     <motion.h2 layoutId={`project-title-${project.id}`} className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
                        {project.title}
                     </motion.h2>
                  </div>
                  <div className="flex gap-2">
                     <button 
                        onClick={toggleFavorite}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${isFavorite ? 'text-lego-red' : 'text-zinc-400'}`}
                     >
                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                     </button>
                     <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hidden md:flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-foreground transition-colors"
                     >
                        <X size={20} />
                     </button>
                  </div>
               </div>

               {/* Quick Stats Grid */}
               <div className="grid grid-cols-3 gap-4 mb-8 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div className="flex flex-col">
                     <span className="text-xs text-zinc-500 mb-1">Zorluk</span>
                     <span className="font-bold">{project.difficulty}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs text-zinc-500 mb-1">Parça</span>
                     <span className="font-bold flex items-center gap-1"><Cuboid size={14}/> {project.pieces}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs text-zinc-500 mb-1">Süre</span>
                     <span className="font-bold flex items-center gap-1"><Clock size={14}/> {project.buildTime}</span>
                  </div>
               </div>

               {/* Tabs */}
               <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 relative">
                  <button 
                     onClick={() => setActiveTab("genel")} 
                     className={`pb-3 px-4 text-sm font-semibold transition-colors ${activeTab === "genel" ? "text-foreground" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                  >
                     Hakkında
                  </button>
                  <button 
                     onClick={() => setActiveTab("nasil-yaptim")} 
                     className={`pb-3 px-4 text-sm font-semibold transition-colors ${activeTab === "nasil-yaptim" ? "text-foreground" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                  >
                     Nasıl Yaptım?
                  </button>
                  <button 
                     onClick={() => setActiveTab("yorumlar")} 
                     className={`pb-3 px-4 text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === "yorumlar" ? "text-foreground" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                  >
                     Topluluk <span className="bg-lego-red text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
                  </button>
                  
                  {/* Animated Tab Indicator */}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300" 
                     style={{ 
                        width: activeTab === "genel" ? "74px" : activeTab === "nasil-yaptim" ? "106px" : "104px",
                        transform: activeTab === "genel" ? "translateX(0)" : activeTab === "nasil-yaptim" ? "translateX(74px)" : "translateX(180px)"
                     }} 
                  />
               </div>

               {/* Tab Content Areas */}
               <div className="relative min-h-[250px]">
                  {/* Tab 1: About */}
                  {activeTab === "genel" && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 text-zinc-600 dark:text-zinc-400">
                        <p className="text-base leading-relaxed">
                           {project.description}
                        </p>
                        
                        {/* Mini-Game Box */}
                        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                           <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                              🎮 Mini Oyun: Kaç Parça?
                           </h4>
                           <p className="text-sm mb-4">Bu yapıda sence tam olarak kaç Lego parçası kullanılmıştır? Tahminini yaz!</p>
                           
                           <form onSubmit={handleGuess} className="flex gap-2 mb-3">
                              <input 
                                 type="number" 
                                 value={guess}
                                 onChange={(e) => setGuess(e.target.value)}
                                 placeholder="Örn: 1500"
                                 className="flex-grow bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 auto-focus focus:outline-none focus:border-lego-blue"
                              />
                              <button type="submit" className="bg-foreground text-background font-bold px-4 py-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                                 Tahmin Et
                              </button>
                           </form>
                           
                           {guessResult !== "idle" && (
                              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={`text-sm font-bold p-3 rounded-lg ${guessResult === "correct" ? "bg-lego-green/10 text-green-600 dark:text-green-400" : "bg-lego-red/10 text-red-600 dark:text-red-400"}`}>
                                 {guessResult === "correct" ? "🎯 TEBRİKLER! Tam isabet!" : guessResult === "low" ? "👇 Daha yüksek bir sayı düşün..." : "👆 Çok uçtun, biraz daha düşük..."}
                              </motion.div>
                           )}
                        </div>
                     </motion.div>
                  )}

                  {/* Tab 2: How I Built It (Mockup) */}
                  {activeTab === "nasil-yaptim" && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl">
                           <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                              <div className="absolute inset-0 flex items-center justify-center text-zinc-400 font-bold text-xs">Adım 1</div>
                           </div>
                           <div>
                              <h4 className="font-bold text-sm mb-1">Temel İskeletin Kurulumu</h4>
                              <p className="text-xs text-zinc-500">Öncelikle Technic parçalarıyla dayanıklı bir temel iskelet oluşturdum.</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl">
                           <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                              <div className="absolute inset-0 flex items-center justify-center text-zinc-400 font-bold text-xs">Adım 2</div>
                           </div>
                           <div>
                              <h4 className="font-bold text-sm mb-1">Dış Yüzey Kaplamaları (SNOT)</h4>
                              <p className="text-xs text-zinc-500">SNOT (Studs Not On Top) tekniği kullanarak dış yüzeyi pürüzsüzleştirdim.</p>
                           </div>
                        </div>
                        <button className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-zinc-500 hover:border-lego-blue hover:text-lego-blue transition-colors">
                           Tüm Aşamaları Gör (6 Fotoğraf)
                        </button>
                     </motion.div>
                  )}

                  {/* Tab 3: Comments (Mockup) */}
                  {activeTab === "yorumlar" && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex gap-4">
                           <div className="w-10 h-10 bg-lego-blue rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">M</div>
                           <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl rounded-tl-none p-4 flex-grow">
                              <div className="flex justify-between items-center mb-1">
                                 <span className="font-bold text-sm">Murat Yapıcı</span>
                                 <span className="text-xs text-zinc-400">2 gün önce</span>
                              </div>
                              <p className="text-sm text-zinc-600 dark:text-zinc-300">İnanılmaz detaylar! Özellikle çatı kısmında kullandığın o küçük gri parçaları nereden bulduğunu çok merak ettim.</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-10 h-10 bg-lego-yellow rounded-full flex items-center justify-center text-black font-bold text-sm flex-shrink-0">A</div>
                           <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl rounded-tl-none p-4 flex-grow">
                              <div className="flex justify-between items-center mb-1">
                                 <span className="font-bold text-sm">Ayşe LegoFan</span>
                                 <span className="text-xs text-zinc-400">1 hafta önce</span>
                              </div>
                              <p className="text-sm text-zinc-600 dark:text-zinc-300">Bu sergiyi canlı görmek isterdim, tek kelimeyle muazzam bir iş çıkartmışsın! 👏</p>
                           </div>
                        </div>
                        
                        <div className="mt-4 flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                           <input type="text" placeholder="Yorum yaz..." className="flex-grow bg-zinc-100 dark:bg-zinc-900/50 border border-transparent rounded-full px-4 text-sm focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-700" />
                           <button className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform">
                              <MessageSquare size={16} />
                           </button>
                        </div>
                     </motion.div>
                  )}
               </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex justify-between items-center mt-auto">
               <div className="flex gap-3">
                  <a href="#" className="flex items-center gap-2 px-5 py-3 bg-lego-blue text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-lego-blue/20">
                     <Download size={16} /> Talimatları İndir
                  </a>
               </div>
               <div className="flex gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                     <ChevronLeft size={20} />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
