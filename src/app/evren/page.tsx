"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Map, Users, Car, BookOpen, Globe2, Sparkles, Navigation, MapPin } from "lucide-react";
import { useState } from "react";

const UNIVERSE_DATA = {
  cities: [
    {
      id: "neo-brick",
      name: "Neo-Brick Şehri",
      type: "Metropol",
      description: "Teknoloji ve dev binaların yükseldiği ana merkez. Uçan arabalar ve devasa enerji reaktörleri bulunur.",
      color: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000" // Placeholder, will be replaced with LEGO later
    },
    {
      id: "crystal-mines",
      name: "Kristal Madenleri",
      type: "Yer Altı",
      description: "Nadir parlayan tuğlaların çıkarıldığı tehlikeli yeraltı tesisleri. Dev matkaplar ve taşıyıcı robotlar çalışır.",
      color: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1000"
    },
    {
      id: "desert-outpost",
      name: "Kum Fırtınası Karakolu",
      type: "Çöl Üssü",
      description: "Eski kalıntıların araştırıldığı, ağır zırhlı araçların devriye gezdiği çöl sınırı.",
      color: "bg-yellow-500",
      image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1000"
    }
  ],
  characters: [
    {
      id: "commander-red",
      name: "Komutan Kırmızı",
      role: "Neo-Brick Savunma Lideri",
      description: "Sibernetik kolu ve özel zırhıyla şehri koruyan usta savaşçı ve stratejist.",
      icon: "🦸‍♂️"
    },
    {
      id: "dr-gear",
      name: "Dr. Dişli",
      role: "Baş Mühendis",
      description: "İmkansız mekanizmaları icat eden dahi. Kristal madenlerindeki matkapların mucidi.",
      icon: "🧑‍🔬"
    },
    {
      id: "shadow-racer",
      name: "Gölge Yarışçısı",
      role: "Bağımsız Pilot",
      description: "Çöl karakolunda en hızlı araçları modifiye eden gizemli pilot.",
      icon: "🥷"
    }
  ],
  vehicles: [
    {
      name: "Titan-X Matkabı",
      owner: "Dr. Dişli",
      type: "Ağır İş Makinesi",
      pieces: 1250,
      color: "bg-yellow-600"
    },
    {
      name: "Gök-Yırtan Jeti",
      owner: "Komutan Kırmızı",
      type: "Savaş Uçağı",
      pieces: 840,
      color: "bg-red-600"
    },
    {
      name: "Kum Fırtınası Buggy",
      owner: "Gölge Yarışçısı",
      type: "Hızlı Arazi Aracı",
      pieces: 320,
      color: "bg-orange-500"
    }
  ],
  stories: [
    {
      title: "Kristal Krizinin Başlangıcı",
      chapter: 1,
      excerpt: "Madenlerin derinliklerinde bulunan antik yapı, Neo-Brick şehrinin tüm enerjisini kestiğinde, Dr. Dişli gerçeği araştırmaya karar verdi..."
    },
    {
      title: "Kızıl Gökyüzü Operasyonu",
      chapter: 2,
      excerpt: "Bilinmeyen düşmanlar çöl karakoluna saldırdığında, Komutan Kırmızı Gök-Yırtan jetiyle zamanında yetişmek zorundaydı."
    }
  ]
};

export default function UniversePage() {
  const [activeTab, setActiveTab] = useState<"map" | "characters" | "vehicles" | "lore">("map");

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 selection:bg-lego-blue">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-black to-black -z-10" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-24 h-24 bg-gradient-to-br from-lego-blue to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(37,99,235,0.5)] border-4 border-white/10"
        >
          <Globe2 size={48} className="text-white drop-shadow-lg" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase"
        >
          Erkam Brick <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lego-blue via-purple-500 to-lego-red">
            Universe
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-medium"
        >
          Sadece parçalardan ibaret değil. Bir dünya, hikayeler, kahramanlar ve efsanevi makineler. Bağlantılı yapıların destanına hoş geldin.
        </motion.p>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-4 bg-zinc-900/50 backdrop-blur-md p-2 rounded-full border border-zinc-800">
          {[
            { id: "map", label: "Dünya Haritası", icon: Map },
            { id: "characters", label: "Karakterler", icon: Users },
            { id: "vehicles", label: "Araç Filosu", icon: Car },
            { id: "lore", label: "Hikaye Kayıtları", icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-black shadow-lg scale-105"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6">
        
        {/* MAP TAB */}
        {activeTab === "map" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-4 flex items-center justify-center gap-3">
                <Navigation className="text-lego-blue" />
                Bağlantılı Şehirler Ağı
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">Tüm yapılarımız bu geniş haritanın bir parçasıdır. Her diorama, bu evrende bir konumu temsil eder.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {UNIVERSE_DATA.cities.map((city, idx) => (
                <div key={idx} className="group relative bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all">
                  <div className="h-48 relative overflow-hidden bg-zinc-800">
                    <img src={city.image} alt={city.name} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                    <div className={`absolute top-4 left-4 w-3 h-3 rounded-full ${city.color} animate-pulse shadow-[0_0_10px_currentColor]`} />
                  </div>
                  <div className="p-6 relative">
                    <div className="absolute -top-6 right-6 bg-zinc-800 px-3 py-1 rounded-full text-xs font-bold border border-zinc-700 text-zinc-300 backdrop-blur-md">
                      {city.type}
                    </div>
                    <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                      <MapPin size={20} className={city.color.replace('bg-', 'text-')} />
                      {city.name}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {city.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 p-10 rounded-[3rem] text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-lego-red/10 rounded-full blur-3xl" />
               <Sparkles className="mx-auto text-lego-yellow mb-6" size={40} />
               <h3 className="text-3xl font-black mb-4">Sıradaki Yapı Nereye Kurulsun?</h3>
               <p className="text-zinc-400 mb-8 max-w-xl mx-auto">Evrenimiz genişlemeye devam ediyor. Ziyaretçi oylarıyla yeni dioramaların evrendeki yerini belirliyoruz.</p>
               <a href="/oyunlar" className="px-8 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform inline-block">
                 Ankete Katıl
               </a>
            </div>
          </motion.div>
        )}

        {/* CHARACTERS TAB */}
        {activeTab === "characters" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {UNIVERSE_DATA.characters.map((char, idx) => (
                <div key={idx} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] hover:-translate-y-2 transition-transform">
                  <div className="text-6xl mb-6 bg-zinc-800 w-24 h-24 rounded-full flex items-center justify-center border-4 border-zinc-700 shadow-inner">
                    {char.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-1">{char.name}</h3>
                  <div className="text-lego-blue font-bold text-sm mb-4 uppercase tracking-wider">{char.role}</div>
                  <p className="text-zinc-400 leading-relaxed">
                    {char.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* VEHICLES TAB */}
        {activeTab === "vehicles" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {UNIVERSE_DATA.vehicles.map((vehicle, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center gap-8 bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] hover:bg-zinc-800/50 transition-colors">
                <div className={`w-full md:w-48 h-32 rounded-2xl ${vehicle.color} flex items-center justify-center relative overflow-hidden`}>
                   <div className="absolute inset-0 bg-black/20" />
                   <Car size={48} className="text-white drop-shadow-lg relative z-10" />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-2xl font-black mb-2">{vehicle.name}</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-zinc-400">
                    <span className="bg-zinc-800 px-3 py-1 rounded-full text-white">Pilot: {vehicle.owner}</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded-full">{vehicle.type}</span>
                    <span className="bg-zinc-800 px-3 py-1 rounded-full text-lego-yellow">{vehicle.pieces} Parça</span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-white text-black font-black rounded-full hover:scale-105 transition-transform whitespace-nowrap">
                  İncele
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* LORE TAB */}
        {activeTab === "lore" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-12">
            {UNIVERSE_DATA.stories.map((story, idx) => (
              <div key={idx} className="relative pl-12 md:pl-0">
                <div className="hidden md:block absolute left-[-40px] top-2 text-6xl font-black text-zinc-800 opacity-50 select-none">
                  0{story.chapter}
                </div>
                <div className="md:hidden absolute left-0 top-0 bottom-0 w-1 bg-zinc-800" />
                <div className="md:hidden absolute left-[-4px] top-2 w-3 h-3 rounded-full bg-lego-blue" />
                
                <h3 className="text-3xl font-black mb-4 text-white">
                  {story.title}
                </h3>
                <p className="text-xl text-zinc-400 leading-relaxed font-medium italic">
                  "{story.excerpt}"
                </p>
                <button className="mt-6 text-lego-blue font-bold hover:text-white transition-colors flex items-center gap-2">
                  Tüm hikayeyi oku <span className="text-xl">&rarr;</span>
                </button>
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
