"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, RefreshCw, Cuboid, Clock } from "lucide-react";

const SURPRISE_BUILDS = [
  {
    id: 1,
    title: "Uzay Roketi",
    emoji: "🚀",
    category: "Uzay",
    pieces: "1,247",
    buildTime: "8 saat",
    difficulty: "Usta",
    description: "Detaylı egzoz nozulları, katlanabilir kanatlar ve gerçekçi yakıt tankları ile donatılmış bu uzay roketi, Technic mekanik sistemi kullanılarak tamamen fonksiyonel yapılmıştır.",
    color: "from-slate-800 to-blue-900",
    accent: "#3B82F6",
    fun_fact: "Gerçek Apollo roketinin 1/100 ölçeğinde!",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&q=80",
  },
  {
    id: 2,
    title: "Orta Çağ Kalesi",
    emoji: "🏰",
    category: "Tarih",
    pieces: "3,482",
    buildTime: "24 saat",
    difficulty: "Usta",
    description: "İşlevsel köprü kapısı, gizli tünel geçitleri ve çelik kapılar içeren bu Orta Çağ kalesi, SNOT tekniğiyle inşa edilmiş granit doku detaylarıyla şaşırtıcı derecede gerçekçidir.",
    color: "from-stone-700 to-stone-900",
    accent: "#D97706",
    fun_fact: "Tüm duvarlarda SNOT tekniği kullanıldı!",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80",
  },
  {
    id: 3,
    title: "Neon Şehir",
    emoji: "🌆",
    category: "Şehir",
    pieces: "2,156",
    buildTime: "18 saat",
    difficulty: "Orta",
    description: "Siberpunk estetiğiyle inşa edilmiş bu fütüristik şehir modeli, Powered UP LED modülleriyle parlayan tabelalar, işlek sokaklarda hareket eden araçlar ve çok katlı binalara sahiptir.",
    color: "from-purple-900 to-pink-900",
    accent: "#EC4899",
    fun_fact: "44 adet Powered UP LED ışık kullanıldı!",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80",
  },
  {
    id: 4,
    title: "Dev T-Rex",
    emoji: "🦕",
    category: "Hayvanlar",
    pieces: "1,893",
    buildTime: "14 saat",
    difficulty: "Orta",
    description: "Hareket eden çene, birleştirilebilir kuyruk ve şaşırtıcı doku detayları ile tam eklemli T-Rex. Technic iç iskeleti sayesinde birçok pozisyonda sabitlenebilir.",
    color: "from-green-800 to-emerald-950",
    accent: "#10B981",
    fun_fact: "Çenesi gerçekten kapanıp açılıyor!",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: 5,
    title: "Yelkenli Gemi",
    emoji: "⛵",
    category: "Deniz",
    pieces: "987",
    buildTime: "6 saat",
    difficulty: "Kolay",
    description: "17. yüzyıl ticaret gemilerinden ilham alınan bu yelkenli, el yapımı kumaş yelkenleri, ip halatları ve gerçekçi güverte mobilyaları ile tamamlanmış bir deniz şaheseridir.",
    color: "from-sky-700 to-sky-950",
    accent: "#0EA5E9",
    fun_fact: "Yelkenler gerçek kumaştan yapılmış!",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
  },
  {
    id: 6,
    title: "Micro Japonya Köyü",
    emoji: "🏯",
    category: "Mikro",
    pieces: "612",
    buildTime: "4 saat",
    difficulty: "Kolay",
    description: "Mikro ölçekte bir Japon köyü: pagoda tapınakları, kiraz çiçeği bahçeleri, köprüler ve geleneksel çatı detayları. Küçük ama inanılmaz detay zenginliğine sahip bir eser.",
    color: "from-rose-800 to-red-950",
    accent: "#F43F5E",
    fun_fact: "En küçük parça sadece 1x1 tile!",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80",
  },
  {
    id: 7,
    title: "Yolcu Uçağı",
    emoji: "✈️",
    category: "Havacılık",
    pieces: "2,646",
    buildTime: "20 saat",
    difficulty: "Usta",
    description: "Geri çekilebilir iniş takımları, açılır kapılar ve detaylı kokpit ile Boeing 747'den ilham alınan bu yolcu uçağı, Technic dişli sistemiyle çalışan motor kanatçıklarına sahiptir.",
    color: "from-sky-600 to-indigo-900",
    accent: "#6366F1",
    fun_fact: "Kanatlar gerçekten eğim yapabiliyor (flap)!",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
  },
  {
    id: 8,
    title: "Askeri Helikopter",
    emoji: "🚁",
    category: "Havacılık",
    pieces: "1,342",
    buildTime: "10 saat",
    difficulty: "Orta",
    description: "Dönen ana rotor, kuyruk rotoru ve açılır kapı ile tam donanımlı askeri helikopter. Altında taşınabilir yük kancası ve arama feneri mekanizması bulunuyor.",
    color: "from-lime-800 to-zinc-900",
    accent: "#84CC16",
    fun_fact: "Rotorlar gerçekten dönüyor — elle çevirince!",
    image: "https://images.unsplash.com/photo-1608236465202-878897ddc84c?w=600&q=80",
  },
  {
    id: 9,
    title: "Spor Araba",
    emoji: "🏎️",
    category: "Technic",
    pieces: "1,580",
    buildTime: "12 saat",
    difficulty: "Orta",
    description: "8 silindirli boxer motor, çalışan süspansiyon sistemi ve gerçek direksiyon mekanizması ile donatılmış bu spor araba, Technic'in en ayrıntılı modellerinden biri.",
    color: "from-red-700 to-red-950",
    accent: "#EF4444",
    fun_fact: "Direksiyonu çevirince ön tekerlekler dönüyor!",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
  },
  {
    id: 10,
    title: "Çift Katlı Otobüs",
    emoji: "🚌",
    category: "Şehir",
    pieces: "893",
    buildTime: "7 saat",
    difficulty: "Kolay",
    description: "Londra'nın ikonik kırmızı çift katlı otobüsünden ilham alınan bu model; açılır arka kapı, detaylı iç mekan koltukları ve şoför kamarası ile tamamlanmış bir şehir klasiği.",
    color: "from-red-600 to-red-900",
    accent: "#DC2626",
    fun_fact: "İçi tamamen döşenmiş — 12 yolcu koltuğu var!",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
  },
  {
    id: 11,
    title: "Hidrolik Kepçe",
    emoji: "🚜",
    category: "İnşaat",
    pieces: "1,124",
    buildTime: "9 saat",
    difficulty: "Orta",
    description: "Tam hareketli hidrolik kol, 360° dönen kule ve gerçekçi paletli taban ile inşaat sahnesinin vazgeçilmezi kepçe. Technic dişli mekanizmasıyla kepçe kolu yukarı aşağı hareket eder.",
    color: "from-amber-600 to-yellow-900",
    accent: "#F59E0B",
    fun_fact: "Kepçe kolu 6 farklı pozisyonda kilitlenebiliyor!",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
  },
  {
    id: 12,
    title: "Haul Kamyonu",
    emoji: "🚛",
    category: "İnşaat",
    pieces: "2,038",
    buildTime: "16 saat",
    difficulty: "Usta",
    description: "Devasa lastikleri, yükselen damper kasası ve detaylı V8 motoru ile bu haul kamyonu, maden ocağı sahnelerinin yıldızı. Powered UP motoruyla uzaktan kumanda edilebilir!",
    color: "from-zinc-700 to-zinc-950",
    accent: "#71717A",
    fun_fact: "Gerçek boyutuna göre 1/24 ölçek!",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
  },
  {
    id: 13,
    title: "Depo Forklifti",
    emoji: "🏗️",
    category: "İnşaat",
    pieces: "742",
    buildTime: "5 saat",
    difficulty: "Kolay",
    description: "Yükselen çatal mekanizması, dönen direksiyon ve gerçekçi ağırlık dengesi sistemi ile tam işlevsel forklift. Çatalları elle kaldırıp indirebilirsiniz.",
    color: "from-orange-600 to-orange-950",
    accent: "#F97316",
    fun_fact: "Çatallar 30 cm yüksekliğe kadar kalkabiliyor!",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80",
  },
  {
    id: 14,
    title: "Turuncu Kedi",
    emoji: "🐱",
    category: "Hayvanlar",
    pieces: "458",
    buildTime: "3 saat",
    difficulty: "Kolay",
    description: "Yumuşak turuncu rengi, büyük yeşil gözleri ve kıvrık kuyruğuyla hazırlanmış bu sevimli LEGO kedisi, oyuncak değil — bir sanat eseri. Pati eklemleri birden fazla pozisyon alıyor.",
    color: "from-orange-500 to-amber-700",
    accent: "#FB923C",
    fun_fact: "Her patisi ayrı ayrı 3 farklı açıya ayarlanabiliyor!",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=600&q=80",
  },
  {
    id: 15,
    title: "Buharlı Tren",
    emoji: "🚂",
    category: "Tren",
    pieces: "1,765",
    buildTime: "13 saat",
    difficulty: "Orta",
    description: "19. yüzyıldan fırlamış bir buharlı lokomotif: dönen çarklar, piston kolları ve gerçek buharlı kazan detaylarıyla tamamlanmış. Arkasında iki yolcu vagonu ve bir yük vagonu var.",
    color: "from-zinc-800 to-red-950",
    accent: "#B91C1C",
    fun_fact: "3 vagonlu tam bir tren takımı!",
    image: "https://images.unsplash.com/photo-1474487548417-781cb6d646d8?w=600&q=80",
  },
  {
    id: 16,
    title: "Konteyner Gemisi",
    emoji: "🚢",
    category: "Deniz",
    pieces: "3,210",
    buildTime: "26 saat",
    difficulty: "Usta",
    description: "Yüzlerce renkli konteyner, çalışan vinç mekanizması ve detaylı kaptan köprüsü ile bu dev konteyner gemisi, Technic'in en büyük deniz yapılarından biri. Su üzerinde yüzüyor!",
    color: "from-teal-700 to-cyan-950",
    accent: "#0D9488",
    fun_fact: "Gerçekten suya atınca batmıyor — test edildi! 🌊",
    image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&q=80",
  },
];

const difficultyColors: Record<string, string> = {
  Kolay: "bg-emerald-500",
  Orta: "bg-amber-500",
  Usta: "bg-red-500",
};

type SurpriseBoxProps = {
  onClose: () => void;
};

export default function SurpriseBox({ onClose }: SurpriseBoxProps) {
  const [phase, setPhase] = useState<"idle" | "shaking" | "opening" | "revealed">("idle");
  const [currentBuild, setCurrentBuild] = useState(SURPRISE_BUILDS[0]);
  const [spinCount, setSpinCount] = useState(0);

  const handleOpenBox = () => {
    if (phase === "shaking" || phase === "opening") return;
    setPhase("shaking");

    setTimeout(() => {
      setPhase("opening");
      const random = SURPRISE_BUILDS[Math.floor(Math.random() * SURPRISE_BUILDS.length)];
      setCurrentBuild(random);
      setTimeout(() => setPhase("revealed"), 600);
    }, 1200);
  };

  const handleTryAgain = () => {
    setPhase("idle");
    setSpinCount((c) => c + 1);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-colors shadow"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center flex-shrink-0">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Sürpriz</p>
          <h2 className="text-3xl font-black tracking-tight">🎁 Kutu Aç!</h2>
          <p className="text-sm text-zinc-500 mt-1">Her açılışta farklı bir LEGO yapısı seni bekliyor</p>
        </div>

        <div className="overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {phase !== "revealed" ? (
              /* Box Phase */
              <motion.div
                key="box-phase"
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex flex-col items-center px-8 py-6"
              >
                {/* The Box */}
                <div className="relative flex items-center justify-center mb-8 select-none">
                  {/* Glow effect */}
                  <motion.div
                    animate={phase === "shaking" ? { scale: [1, 1.3, 1, 1.4, 1], opacity: [0.4, 0.8, 0.4, 0.9, 0.4] } : { opacity: 0.2 }}
                    transition={{ duration: 1, repeat: phase === "shaking" ? Infinity : 0 }}
                    className="absolute w-48 h-48 rounded-full bg-lego-yellow/40 blur-3xl"
                  />

                  <motion.div
                    key={spinCount}
                    animate={
                      phase === "shaking"
                        ? { rotate: [-6, 6, -8, 8, -5, 5, -4, 4, 0], scale: [1, 1.05, 1, 1.07, 1] }
                        : phase === "opening"
                        ? { scale: [1, 1.2, 0], rotate: [0, 15, -15], opacity: [1, 1, 0] }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{
                      duration: phase === "shaking" ? 1 : 0.5,
                      repeat: phase === "shaking" ? Infinity : 0,
                    }}
                    className="relative z-10 cursor-pointer"
                    onClick={handleOpenBox}
                    whileHover={phase === "idle" ? { scale: 1.1, rotate: [-2, 2, -2] } : {}}
                  >
                    <span style={{ fontSize: "8rem", lineHeight: 1, display: "block" }}>🎁</span>
                  </motion.div>

                  {/* Sparkles during shaking */}
                  {phase === "shaking" && (
                    <>
                      {["✨", "⭐", "💫", "🌟"].map((star, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.2, 0],
                            x: [(i % 2 === 0 ? 1 : -1) * 20, (i % 2 === 0 ? 1 : -1) * 80],
                            y: [0, -60 - i * 15],
                          }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                          className="absolute text-2xl"
                          style={{ top: "50%", left: "50%" }}
                        >
                          {star}
                        </motion.span>
                      ))}
                    </>
                  )}
                </div>

                <motion.button
                  onClick={handleOpenBox}
                  disabled={phase === "shaking" || phase === "opening"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-5 bg-gradient-to-r from-lego-red to-red-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-lego-red/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                >
                  {phase === "idle" && <><span>🎁</span> KUTUYU AÇ!</>}
                  {phase === "shaking" && <><span className="animate-bounce">⏳</span> Açılıyor...</>}
                  {phase === "opening" && <><span>🎊</span> Sürpriz!</>}
                </motion.button>

                <p className="text-xs text-zinc-400 mt-4 font-medium">
                  {SURPRISE_BUILDS.length} farklı yapıdan biri seni bekliyor 🧱
                </p>
              </motion.div>
            ) : (
              /* Revealed Phase */
              <motion.div
                key="revealed-phase"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 160 }}
                className="flex flex-col"
              >
                {/* Photo Banner */}
                <div className="relative h-52 overflow-hidden">
                  <motion.img
                    initial={{ scale: 1.15, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    src={currentBuild.image}
                    alt={currentBuild.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${currentBuild.color} opacity-60`} />

                  {/* Emoji + title over photo */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.4, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-6xl drop-shadow-2xl mb-2"
                    >
                      {currentBuild.emoji}
                    </motion.span>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center"
                    >
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black text-white mb-2 ${difficultyColors[currentBuild.difficulty]}`}>
                        {currentBuild.difficulty} Seviye
                      </span>
                      <h3 className="text-2xl font-black drop-shadow-lg">{currentBuild.title}</h3>
                      <p className="text-white/80 text-xs font-bold tracking-widest uppercase mt-0.5">{currentBuild.category}</p>
                    </motion.div>
                  </div>

                  {/* Stats bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-3 left-0 right-0 flex justify-center gap-3 z-10"
                  >
                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold">
                      <Cuboid size={12} /> {currentBuild.pieces} parça
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold">
                      <Clock size={12} /> {currentBuild.buildTime}
                    </div>
                  </motion.div>
                </div>

                {/* Details */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="px-7 py-5"
                >
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                    {currentBuild.description}
                  </p>

                  {/* Fun fact */}
                  <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3 mb-5">
                    <span className="text-xl flex-shrink-0">💡</span>
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                      {currentBuild.fun_fact}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleTryAgain}
                      className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 font-black rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <RefreshCw size={16} /> Tekrar Dene
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 bg-foreground text-background font-black rounded-2xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink size={16} /> Galeriyi Gör
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
