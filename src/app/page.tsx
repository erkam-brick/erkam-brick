"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Menu, X, ExternalLink, Github, Instagram, Twitter, Search, Heart, Shield, Clock, Cuboid, Play, Download, MessageSquare, User, LogOut, Trophy } from "lucide-react";
import { useState, useMemo } from "react";
import { PROJECTS, CATEGORIES, POWERED_UP_MOTORS } from "../data/projects";
import ProjectModal from "../components/ProjectModal";
import LegoGame from "../components/LegoGame";
import LegoBuilder from "../components/LegoBuilder";
import LegoPuzzle from "../components/LegoPuzzle";
import LegoBattle from "../components/LegoBattle";
import SurpriseBox from "../components/SurpriseBox";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Gallery State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  // Authentication State
  const [user, setUser] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareName, setShareName] = useState("");
  const [shareCategory, setShareCategory] = useState("Şehir");
  const [shareImageUrl, setShareImageUrl] = useState("");

  // Surprise Box State
  const [isSurpriseBoxOpen, setIsSurpriseBoxOpen] = useState(false);

  // Game State
  const [activeGame, setActiveGame] = useState<"builder" | "puzzle" | "battle" | "drop">("builder");
  const [communityBuilds, setCommunityBuilds] = useState<Array<{id: number, name: string, author: string, likes: number, category: string, color: string, imageUrl?: string}>>([
    { id: 1, name: "Modern Villa", author: "LegoMaster_99", likes: 124, category: "Şehir", color: "bg-lego-blue" },
    { id: 2, name: "Hızlı Yarışçı", author: "BrickBuilder", likes: 89, category: "Technic", color: "bg-lego-red" },
    { id: 3, name: "Uzay İstasyonu", author: "GalaksyLego", likes: 210, category: "Uzay", color: "bg-lego-yellow" },
  ]);

  // Secret Quest State
  const [foundSecrets, setFoundSecrets] = useState<string[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const handleSecretFound = (secretId: string) => {
    if (!foundSecrets.includes(secretId)) {
      const newSecrets = [...foundSecrets, secretId];
      setFoundSecrets(newSecrets);
      if (newSecrets.length === 3) {
        setTimeout(() => setShowRewardModal(true), 500);
      }
    }
  };

  const isPoweredUpActive = activeCategory === "Powered UP";
  const isTechnicCityActive = activeCategory === "Technic-City";
  const isTechnicActive = activeCategory === "Technic";
  const isCityActive = activeCategory === "Şehir";
  const isAllActive = activeCategory === "Tümü";

  const allVideos = useMemo(() => [
    { id: 'v1', category: 'Technic', ytId: 'BDMHLyiJV2Q', title: 'LEGO Technic Yapım Videosu', desc: '' },
    { id: 'v2', category: 'Technic', ytId: '4SjliMMeQrU', title: 'LEGO Technic Yapım Videosu 2', desc: '' },
    { id: 'v3', category: 'Technic', ytId: 'XifPz19k2WU', title: 'LEGO Technic Yapım Videosu 3', desc: '' },
    { id: 'v4', category: 'Technic-City', ytId: 'HTO5Vivy2GU', title: 'LEGO Technic-City Yapım Videosu', desc: '' },
    { id: 'v5', category: 'Technic-City', ytId: 'whb44aYbLFI', title: 'LEGO Technic-City Yapım Videosu 2', desc: '' },
    { id: 'v6', category: 'Şehir', ytId: '_hsjRHSKTiM', title: 'LEGO Şehir Kurma Videosu', desc: 'LEGO Şehir parçalarıyla yapı inşa süreci.' },
    { id: 'v7', category: 'Powered UP', ytId: '_kQbTovns-I', title: 'LEGO Powered UP Uygulama Videosu', desc: 'Motorların ve mekanizmaların çalışması.' },
  ], []);

  const filteredVideos = useMemo(() => {
    return allVideos.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = isAllActive || v.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, isAllActive, allVideos]);

  // Filter projects based on search and category
  const filteredProjects = useMemo(() => {
    if (isPoweredUpActive || isTechnicActive || isTechnicCityActive || isCityActive) return [];
    return PROJECTS.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "Tümü" || project.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, isPoweredUpActive]);

  // Filter motors based on search
  const filteredMotors = useMemo(() => {
    if (!isPoweredUpActive && !isAllActive) return [];
    return POWERED_UP_MOTORS.filter(motor =>
      motor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motor.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, isPoweredUpActive, isAllActive]);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleRandomBuild = () => {
    const randomProject = PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
    setSelectedProject(randomProject);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim() && loginPassword.trim()) {
      // Just extract the part before @ for display purposes
      const displayName = loginEmail.split('@')[0];
      setUser(displayName);
      setIsLoginModalOpen(false);
      setLoginEmail("");
      setLoginPassword("");
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (shareName.trim() && shareImageUrl.trim()) {
      const newBuild = {
        id: Date.now(),
        name: shareName,
        author: user || "Misafir",
        likes: 0,
        category: shareCategory,
        color: "bg-zinc-800",
        imageUrl: shareImageUrl
      };
      setCommunityBuilds([newBuild, ...communityBuilds]);
      setIsShareModalOpen(false);
      setShareName("");
      setShareImageUrl("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-lego-red selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <Image
              src="/logo.png"
              alt="ERKAM BRICK Logo"
              width={200}
              height={64}
              className="h-16 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-xl tracking-tight text-foreground">ERKAM</span>
              <span className="font-extrabold text-xl tracking-tight text-lego-red">BRİCK</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <a href="#gallery" className="hover:text-lego-blue transition-colors">Galeri</a>
            <a href="#knowledge" className="hover:text-lego-red transition-colors">Bilgi Köşesi</a>
            <a href="#games" className="hover:text-lego-purple px-3 py-1 bg-lego-red/10 rounded-full transition-colors animate-pulse">Oyunlar 🎮</a>
            <a href="#about" className="hover:text-lego-yellow transition-colors">Hakkımda</a>
            <a href="#contact" className="hover:text-lego-green transition-colors">İletişim</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
             {user ? (
               <div className="flex items-center gap-3">
                 <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Hoş geldin, <strong className="text-foreground">{user}</strong></span>
                 <button onClick={handleLogout} className="p-2 text-zinc-400 hover:text-lego-red transition-colors" title="Çıkış Yap">
                   <LogOut size={20} />
                 </button>
               </div>
             ) : (
               <button onClick={() => setIsLoginModalOpen(true)} className="px-5 py-2 text-sm font-bold rounded-full bg-lego-blue text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-md flex items-center gap-2">
                 <User size={16} />
                 Oturum Aç
               </button>
             )}
             <button onClick={handleRandomBuild} className="px-4 py-2 text-sm font-semibold rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2">
                🎲 Bugün ne görsem?
             </button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden"
        >
          <div className="flex flex-col gap-6 text-2xl font-semibold">
            {user ? (
              <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-xl">Hoş geldin, <span className="text-lego-blue">{user}</span></span>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-sm text-lego-red flex items-center gap-2">
                  <LogOut size={20} /> Çıkış
                </button>
              </div>
            ) : (
              <button onClick={() => { setIsLoginModalOpen(true); setIsMenuOpen(false); }} className="w-full pb-6 border-b border-zinc-200 dark:border-zinc-800 text-left hover:text-lego-blue flex items-center gap-3">
                <User size={28} /> Oturum Aç
              </button>
            )}
            <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="hover:text-lego-blue">Galeri</a>
            <a href="#knowledge" onClick={() => setIsMenuOpen(false)} className="hover:text-lego-red">Bilgi Köşesi</a>
            <a href="#games" onClick={() => setIsMenuOpen(false)} className="hover:text-lego-red flex items-center gap-2">Oyunlar <span className="text-sm bg-lego-red text-white px-2 py-0.5 rounded-full">Yeni</span></a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-lego-yellow">Hakkımda</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-lego-green">İletişim</a>
            <button onClick={() => { handleRandomBuild(); setIsMenuOpen(false) }} className="w-full mt-4 px-4 py-3 text-lg font-semibold rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 transition-colors flex items-center justify-center gap-2">
                🎲 Rastgele Yapı
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        
        {/* Hidden Secret Item 1: Golden Brick */}
        <motion.button 
          whileHover={{ scale: 1.2 }}
          onClick={() => handleSecretFound("golden_brick")}
          className={`absolute top-40 left-[15%] w-8 h-4 rounded-sm bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)] z-20 transition-all duration-500 ${foundSecrets.includes("golden_brick") ? "opacity-0 scale-150 pointer-events-none" : "opacity-10 hover:opacity-100 cursor-pointer"}`}
          title="Gizli Altın Tuğla"
        />

        {/* Decorative Blocks */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-20 left-[10%] w-24 h-16 bg-lego-blue rounded-md opacity-20 dark:opacity-40 blur-2xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 20 }}
          animate={{ opacity: 1, scale: 1, rotate: 10 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-40 right-[15%] w-32 h-32 bg-lego-red rounded-md opacity-20 dark:opacity-40 blur-2xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="absolute top-40 right-[25%] w-16 h-16 bg-lego-yellow rounded-md opacity-20 dark:opacity-40 blur-2xl"
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium mb-8 border border-zinc-200 dark:border-zinc-700"
          >
            <span className="w-2 h-2 rounded-full bg-lego-green animate-pulse" />
            Yeni diorama eklendi!
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Hayal Gücünü İnşa Etmek,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lego-blue via-lego-red to-lego-yellow">
              Her Seferinde Bir Parça İle
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto"
          >
            Özel Lego tasarımlarımın dijital vitrinine hoş geldiniz. Tutkuyla hazırlanmış karmaşık modelleri, yaratıcı mini yapıları ve devasa dioramaları keşfedin.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href="#gallery" 
              className="px-8 py-4 rounded-full bg-foreground text-background font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Galeriyi Keşfet
              <ArrowDown size={18} />
            </a>
            <a 
              href="#about" 
              className="px-8 py-4 rounded-full border-2 border-zinc-200 dark:border-zinc-800 font-semibold hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all w-full sm:w-auto justify-center flex"
            >
              Usta Yapıcı Hakkında
            </a>
            <button
              onClick={() => setIsSurpriseBoxOpen(true)}
              className="relative px-8 py-4 rounded-full font-bold bg-gradient-to-r from-lego-yellow to-amber-400 text-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-300/30 w-full sm:w-auto justify-center flex items-center gap-2 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              🎁 Sürpriz Kutu
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-lego-red rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-lego-red rounded-full" />
            </button>
          </motion.div>
        </div>
      </main>

      {/* Interactive Gallery Section */}
      <section id="gallery" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
               <div>
                   <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 flex items-center gap-3">
                      {isPoweredUpActive ? "⚡ Powered UP Koleksiyonu" : isTechnicActive ? "🔧 Technic Videoları" : isTechnicCityActive ? "🏙️ Technic-City Videoları" : isCityActive ? "🏙️ Şehir Videoları" : "Başyapıt Galerisi"}
                      <span className="text-xl text-zinc-400 font-medium bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full">{isPoweredUpActive ? `${filteredMotors.length} Bileşen` : isTechnicActive || isTechnicCityActive || isCityActive ? `${filteredVideos.length} Video` : `${filteredProjects.length + filteredVideos.length + filteredMotors.length} Eser`}</span>
                   </h2>
                   <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">{isPoweredUpActive ? "Yapılarına hareket kazandıran güç kaynakları. Koleksiyonumda bulunan ve projelerimde aktif olarak kullandığım Powered UP serim." : isTechnicActive ? "LEGO Technic yapılarımın video kayıtları ve yapım süreçleri." : isTechnicCityActive ? "Çalışmalarım çeşitli topluluk sergilerinde yer aldı ve sık sık küresel yapım yarışmalarına katılıyorum. İnşa etmediğim zamanlarda parça ayıklıyorum. Her zaman. Parça. Ayıklıyorum." : isCityActive ? "LEGO Şehir kurma temalı yapımlarımın videoları." : "En karmaşık ve yaratıcı yapılarımın özenle seçilmiş bir koleksiyonu."}</p>
               </div>
               
               {/* Search Bar */}
               <div className="relative w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Search className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                     type="text"
                     placeholder="Model veya tema ara..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="block w-full pl-10 pr-3 py-3 border border-zinc-200 dark:border-zinc-800 rounded-full bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-lego-blue transition-all"
                  />
               </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
               {CATEGORIES.map(category => (
                  <button
                     key={category}
                     onClick={() => setActiveCategory(category)}
                     className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        activeCategory === category 
                        ? "bg-foreground text-background shadow-md" 
                        : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                     }`}
                  >
                     {category}
                  </button>
               ))}
            </div>
          </motion.div>

          {filteredProjects.length === 0 && filteredVideos.length === 0 && filteredMotors.length === 0 ? (
             <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <Cuboid size={48} className="mx-auto text-zinc-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">İçerik Bulunamadı</h3>
                <p className="text-zinc-500">Aramanızla eşleşen bir içerik bulamadık.</p>
                <button onClick={() => {setSearchQuery(""); setActiveCategory("Tümü")}} className="mt-4 px-6 py-2 bg-lego-blue text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
                   Aramayı Temizle
                </button>
             </div>
          ) : (
             <div className="flex flex-col gap-16">
               {/* Projects Grid */}
               {filteredProjects.length > 0 && (
                 <div>
                   {isAllActive && <h3 className="text-2xl font-bold mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">Brick Projeleri</h3>}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredProjects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          layoutId={`project-container-${project.id}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
                          onClick={() => setSelectedProject(project)}
                          className="group relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
                        >
                          <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${project.color}`}>
                               {project.difficulty} Seviye
                            </div>
                            <button 
                               onClick={(e) => toggleFavorite(project.id, e)}
                               className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white hover:bg-zinc-50 transition-colors ${favorites.includes(project.id) ? 'text-lego-red' : 'text-zinc-400 hover:text-lego-red'}`}
                            >
                               <Heart size={20} fill={favorites.includes(project.id) ? "currentColor" : "none"} />
                            </button>
                            <motion.img 
                              layoutId={`project-image-${project.id}`}
                              src={project.image} 
                              alt={project.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
                              <div className="bg-white/90 backdrop-blur text-black px-6 py-3 rounded-full font-bold shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-lego-green animate-pulse" />
                                İncele
                              </div>
                            </div>
                          </div>
                          <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                                {project.category}
                              </span>
                            </div>
                            <motion.h3 layoutId={`project-title-${project.id}`} className="text-2xl font-bold mb-2">{project.title}</motion.h3>
                            <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 text-sm mb-6 flex-grow">{project.description}</p>
                            <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                               <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                  <Cuboid size={16} className="text-zinc-400" />
                                  <span className="font-semibold">{project.pieces}</span>
                               </div>
                               <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                  <Clock size={16} className="text-zinc-400" />
                                  <span className="font-medium">{project.buildTime}</span>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                   </div>
                 </div>
               )}

               {/* Video Grid */}
               {filteredVideos.length > 0 && (
                 <div>
                   {isAllActive && <h3 className="text-2xl font-bold mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">Videolar</h3>}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {filteredVideos.map((video, index) => (
                       <motion.div
                         key={video.id}
                         initial={{ opacity: 0, y: 30 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.5, delay: index * 0.1 }}
                         className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                       >
                         <div className="aspect-video w-full">
                           <iframe
                             src={`https://www.youtube.com/embed/${video.ytId}`}
                             title={video.title}
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                             allowFullScreen
                             className="w-full h-full"
                           />
                         </div>
                         <div className="p-6">
                           <span className="text-xs font-bold tracking-wider uppercase text-lego-red mb-2 block">{video.category}</span>
                           <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                           {video.desc && <p className="text-zinc-600 dark:text-zinc-400 text-sm">{video.desc}</p>}
                         </div>
                       </motion.div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Powered UP Motors Grid */}
               {filteredMotors.length > 0 && (
                 <div>
                   {isAllActive && <h3 className="text-2xl font-bold mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">⚡ Powered UP Bileşenleri</h3>}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {filteredMotors.map((motor, index) => (
                       <motion.div
                         key={motor.id}
                         initial={{ opacity: 0, y: 30 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.5, delay: index * 0.08 }}
                         className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                       >
                         <div className={`h-28 bg-gradient-to-br ${motor.color} flex items-center justify-center relative overflow-hidden`}>
                           <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                           <span className="text-6xl relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{motor.icon}</span>
                           <div className="absolute bottom-0 right-0 px-3 py-1 bg-black/30 backdrop-blur text-white text-xs font-mono font-bold rounded-tl-xl">
                             #{motor.subtitle}
                           </div>
                         </div>
                         <div className="p-6 flex flex-col flex-grow">
                           <h3 className="text-lg font-extrabold mb-1 tracking-tight">{motor.title}</h3>
                           <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5 leading-relaxed flex-grow">{motor.description}</p>
                           <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                             <div className="flex flex-col items-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2">
                               <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Hız</span>
                               <span className="text-sm font-extrabold text-foreground">{motor.speed}</span>
                             </div>
                             <div className="flex flex-col items-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2">
                               <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Tork</span>
                               <span className="text-sm font-extrabold text-foreground">{motor.torque}</span>
                             </div>
                             <div className="flex flex-col items-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2 col-span-1">
                               <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Uyum</span>
                               <span className="text-[10px] font-extrabold text-foreground text-center leading-tight">{motor.compatible}</span>
                             </div>
                           </div>
                         </div>
                       </motion.div>
                     ))}
                   </div>
                 </div>
               )}
             </div>
          )}
        </div>
      </section>



      {/* Mini Games & Social Section */}
      <section id="games" className="py-24 px-6 bg-zinc-100 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">LEGO UNIVERSE 🚀</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
               Bir yapıcı ol, bir savaşçı ol veya bir bulmaca dehası ol. LEGO Dünyası senin elinde!
            </p>
            
            <div className="flex flex-wrap items-center justify-center bg-white dark:bg-black p-1.5 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 mt-10 gap-1 lg:inline-flex">
              {[
                { id: "builder", label: "🏗️ Builder", color: "bg-lego-blue" },
                { id: "puzzle", label: "🧩 Puzzle", color: "bg-lego-yellow text-black" },
                { id: "battle", label: "⚔️ Savaş", color: "bg-zinc-800" },
                { id: "drop", label: "🧱 Drop", color: "bg-lego-green" }
              ].map(game => (
                <button
                  key={game.id}
                  onClick={() => setActiveGame(game.id as any)}
                  className={`px-6 py-3 rounded-2xl text-sm font-black transition-all ${
                    activeGame === game.id 
                    ? `${game.color} ${game.color.includes('yellow') ? 'text-black' : 'text-white'} shadow-xl scale-105` 
                    : "text-zinc-500 hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  {game.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            key={activeGame}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            {activeGame === "builder" && <LegoBuilder user={user} onRequireLogin={() => setIsLoginModalOpen(true)} />}
            {activeGame === "puzzle" && <LegoPuzzle />}
            {activeGame === "battle" && <LegoBattle />}
            {activeGame === "drop" && <LegoGame />}
          </motion.div>

          {/* Social Features */}
          <div className="w-full mt-24">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
               <div>
                  <h3 className="text-3xl font-black mb-2">Topluluk Galerisi</h3>
                  <p className="text-zinc-500 font-medium">Usta Yapıcıların en çok beğenilen tasarımları.</p>
               </div>
               <div className="flex bg-lego-red text-white px-6 py-4 rounded-3xl items-center gap-4 shadow-xl shadow-lego-red/10 animate-pulse cursor-pointer">
                  <div className="p-2 bg-white/20 rounded-xl"><Trophy size={24} /></div>
                  <div>
                     <p className="font-black leading-none text-sm uppercase tracking-wider text-red-100">Haftalık Challenge</p>
                     <p className="font-bold">🚀 10 Parça ile En Yüksek Kuleyi İnşa Et!</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {communityBuilds.map(build => (
                  <motion.div 
                    key={build.id}
                    whileHover={{ y: -10 }}
                    className="bg-white dark:bg-black rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all"
                  >
                     <div className={`aspect-square rounded-[2rem] ${build.color} mb-6 flex items-center justify-center relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                        {build.imageUrl ? (
                           <img src={build.imageUrl} alt={build.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                           <Cuboid size={80} className="text-white drop-shadow-2xl group-hover:scale-110 transition-transform z-0" />
                        )}
                        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-white uppercase z-20">{build.category}</div>
                     </div>
                     <h4 className="text-xl font-black mb-1">{build.name}</h4>
                     <p className="text-sm text-zinc-500 font-bold mb-6">Yazar: <span className="text-lego-blue">@{build.author}</span></p>
                     <div className="flex items-center justify-between pt-6 border-t border-zinc-50 dark:border-zinc-900">
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-black bg-zinc-200 dark:bg-zinc-800" />)}
                           <div className="w-8 h-8 rounded-full border-2 border-white dark:border-black bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold">+12</div>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-lego-red hover:text-white transition-all text-sm font-black group">
                           <Heart size={18} className="group-hover:fill-current" /> {build.likes}
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
            
            <div className="mt-16 text-center">
               {user ? (
                 <button 
                   onClick={() => {
                     setIsShareModalOpen(true);
                   }} 
                   className="px-10 py-5 bg-lego-blue text-white font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl inline-flex items-center gap-3"
                 >
                    <Cuboid size={24} /> Fotoğraf Paylaş
                 </button>
               ) : (
                 <button 
                   onClick={() => setIsLoginModalOpen(true)} 
                   className="px-10 py-5 bg-foreground text-background font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl inline-flex items-center gap-3"
                 >
                    <User size={24} /> Kendi Yapını Paylaşmak İçin Giriş Yap
                 </button>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Base Section */}
      <section id="knowledge" className="py-24 px-6 bg-white dark:bg-black">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
               >
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-lego-blue via-lego-green to-lego-yellow">Bilgi Köşesi</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">Lego dünyasının sırları, tarihçesi ve daha iyi bir yapıcı olmak için usta ipuçları.</p>
               </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 hover:scale-105 transition-transform relative"
               >
                  {/* Hidden Secret Item 2: Silver Gear */}
                  <button
                    onClick={(e) => { e.preventDefault(); handleSecretFound("silver_gear"); }}
                    className={`absolute bottom-6 right-6 w-6 h-6 bg-zinc-300 rounded-full border-2 border-dashed border-zinc-400 shadow-[0_0_10px_rgba(212,212,216,0.8)] z-20 transition-all duration-500 ${foundSecrets.includes("silver_gear") ? "opacity-0 scale-150 pointer-events-none" : "opacity-10 hover:opacity-100 cursor-pointer"}`}
                    title="Gizli Gümüş Dişli"
                  />
                  <div className="w-14 h-14 bg-lego-red rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-lego-red/20">
                     <Cuboid size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Tarihçe</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                     1932 yılında Danimarka'da başlayan efsanevi yolculuk. Ahşap oyuncaklardan bugün bildiğimiz milyarlarca tıkırdayan plastik parçaya uzanan büyüleyici Lego tarihi.
                  </p>
                  <a href="#" className="inline-flex items-center gap-2 mt-6 text-lego-red font-bold text-sm hover:underline">Devamını Oku &rarr;</a>
               </motion.div>

               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 hover:scale-105 transition-transform"
               >
                  <div className="w-14 h-14 bg-lego-blue rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-lego-blue/20">
                     <Shield size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Parça Türleri</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                     SNOT (Studs Not On Top), Plate, Tile, Slope... Lego terminolojisi ve parçaların doğru mekanik kullanımı hakkında ihtiyacın olan her şey.
                  </p>
                  <a href="#" className="inline-flex items-center gap-2 mt-6 text-lego-blue font-bold text-sm hover:underline">Sözlüğe Git &rarr;</a>
               </motion.div>

               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 hover:scale-105 transition-transform relative overflow-hidden"
               >
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-lego-yellow/10 rounded-full blur-2xl" />
                  <div className="w-14 h-14 bg-lego-yellow rounded-2xl flex items-center justify-center text-black mb-6 shadow-lg shadow-lego-yellow/20 relative z-10">
                     <Play size={28} fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 relative z-10">Yapım İpuçları</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed relative z-10">
                     Nasıl daha sağlam duvarlar örülür? Renk paleti seçimi nasıl yapılmalı? Minifigür ölçeklendirme sırları nelerdir?
                  </p>
                  <a href="#" className="inline-flex items-center gap-2 mt-6 text-lego-yellow font-bold text-sm hover:underline hover:text-yellow-600 relative z-10">Videoları İzle &rarr;</a>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Community Banner */}
      <section className="bg-gradient-to-r from-lego-blue to-blue-900 text-white py-16 px-6">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
               <h2 className="text-3xl font-bold mb-2">Aramıza Katıl: Kendi Yapını Yükle!</h2>
               <p className="text-blue-100 max-w-lg">
                  Topluluğumuza katılıp kendi tasarımlarını sergileyebilirsin. Bu ayın teması: <strong>Minecraft Dünyası</strong>. 
                  En çok oy alan yapı usta rozetinin sahibi olacak!
               </p>
            </div>
            <button className="px-8 py-4 bg-white text-lego-blue font-bold rounded-full hover:scale-105 transition-transform shadow-xl flex-shrink-0">
               Üye Ol / Giriş Yap
            </button>
         </div>
      </section>

      {/* About & Footer */}
      <section id="about" className="py-24 px-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-8 border-white dark:border-zinc-950 shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&q=80" 
                alt="Builder" 
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              />
              {/* Lego Stud decorations */}
              <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-lego-red shadow-inner opacity-80" />
              <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-lego-blue shadow-inner opacity-80" />
              
              {/* Hidden Secret Item 3: Crystal Gem */}
              <button
                onClick={() => handleSecretFound("crystal_gem")}
                className={`absolute top-4 right-4 w-6 h-6 rotate-45 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.9)] z-20 transition-all duration-500 ${foundSecrets.includes("crystal_gem") ? "opacity-0 scale-150 pointer-events-none" : "opacity-20 hover:opacity-100 cursor-pointer"}`}
                title="Gizli Kristal"
              />
            </motion.div>
          </div>
          <div className="w-full md:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6"
            >
              Usta Yapıcı
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-zinc-600 dark:text-zinc-400 mb-6"
            >
              5 yaşımdan beri parçaları birbirine takıyorum. Basit evlerle başlayan şey, yapısal tasarım, renk teorisi ve mikro ölçekli detaylandırma için ömür boyu sürecek bir tutkuya dönüştü.
            </motion.p>

            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex gap-4" id="contact"
            >
              <a href="#" className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-lego-red hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-lego-blue hover:text-white transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                <Github size={20} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-500 border-t border-zinc-200 dark:border-zinc-900">
        <p>© {new Date().getFullYear()} ERKAM BRICK - Usta Yapıcı. The LEGO Group ile bağlantılı değildir.</p>
      </footer>
      
      {/* Project Detail Modal Container */}
      {selectedProject && (
         <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
            isFavorite={favorites.includes(selectedProject.id)}
            toggleFavorite={(e) => toggleFavorite(selectedProject.id, e)}
         />
      )}

      {/* Surprise Box Modal */}
      <AnimatePresence>
        {isSurpriseBoxOpen && (
          <SurpriseBox onClose={() => setIsSurpriseBoxOpen(false)} />
        )}
      </AnimatePresence>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Oturum Aç</h2>
                <button onClick={() => setIsLoginModalOpen(false)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex justify-center mb-8">
                 <div className="w-20 h-20 bg-lego-blue rounded-full flex items-center justify-center text-white shadow-inner">
                    <User size={40} />
                 </div>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">E-posta Adresi</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-lego-blue transition-all"
                    placeholder="ornek@erkambrick.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Şifre</label>
                  <input
                    type="password"
                    id="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-lego-blue transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full py-3 mt-4 bg-lego-blue text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95">
                  Giriş Yap
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Yeni Fotoğraf Paylaş</h2>
                <button onClick={() => setIsShareModalOpen(false)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleShare} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tasarım Adı</label>
                  <input
                    type="text"
                    required
                    value={shareName}
                    onChange={(e) => setShareName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-lego-blue transition-all"
                    placeholder="Örn: Uzay Gemisi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Kategori</label>
                  <select
                    value={shareCategory}
                    onChange={(e) => setShareCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-lego-blue transition-all"
                  >
                    {CATEGORIES.filter(c => c !== "Tümü").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Fotoğraf URL (Diğer sitelerden)</label>
                  <input
                    type="url"
                    required
                    value={shareImageUrl}
                    onChange={(e) => setShareImageUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-lego-blue transition-all"
                    placeholder="https://ornek-site.com/foto.jpg"
                  />
                </div>
                {shareImageUrl && (
                  <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 relative flex items-center justify-center">
                     <img src={shareImageUrl} alt="Önizleme" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
                     <p className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500 font-medium -z-10">Önizleme Yüklenemedi</p>
                  </div>
                )}
                <button type="submit" className="w-full py-3 mt-4 bg-lego-blue text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95">
                  Paylaş
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Game Shortcut */}
      <motion.a
        href="#games"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[60] w-14 h-14 bg-lego-red text-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white dark:border-zinc-800 hover:bg-red-600 transition-colors group px-0"
      >
        <span className="group-hover:hidden"><Play fill="currentColor" size={24} /></span>
        <span className="hidden group-hover:block font-black text-xs">OYNA!</span>
      </motion.a>

      {/* Secret Quest Tracker */}
      <div className="fixed bottom-24 right-8 z-40 flex flex-col items-end gap-2 pointer-events-none">
        {showRewardModal ? null : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 dark:bg-black/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 pointer-events-auto flex items-center gap-4 cursor-help group"
          >
            <div className="p-2 bg-lego-yellow/20 rounded-xl text-lego-yellow group-hover:scale-110 transition-transform">
              <Search size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">GİZLİ GÖREV</p>
              <p className="font-bold text-sm">Parçaları Bul: <span className={foundSecrets.length === 3 ? "text-lego-green" : "text-lego-yellow"}>{foundSecrets.length}/3</span></p>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-4 w-64 bg-zinc-900 text-white text-xs p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none">
              Siteye gizlenmiş 3 özel parçayı (Altın Tuğla, Gümüş Dişli, Kristal) bul ve Usta Kaşif ödülünü kazan! Sadece gerçek dikkatli yapıcılar bulabilir. 🔍
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-zinc-900 rotate-45" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Secret Quest Reward Modal */}
      <AnimatePresence>
        {showRewardModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-950 text-white w-full max-w-md rounded-[2.5rem] p-8 text-center border border-zinc-800 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lego-red via-lego-yellow to-lego-blue" />
              
              {/* Confetti simulation elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ y: -50, x: 150, opacity: 1 }}
                      animate={{ y: 600, x: Math.random() * 400 - 200, rotate: Math.random() * 360 }}
                      transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                      className={`absolute w-3 h-3 ${['bg-lego-red', 'bg-lego-blue', 'bg-lego-yellow', 'bg-lego-green'][i % 4]}`}
                      style={{ left: `${Math.random() * 100}%` }}
                    />
                 ))}
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6 }}
                className="text-8xl mb-6 relative z-10"
              >
                🏆
              </motion.div>
              
              <h2 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 relative z-10">USTA KAŞİF!</h2>
              <p className="text-zinc-400 mb-8 relative z-10">
                Tebrikler! Siteye gizlenmiş tüm parçaları buldun ve gerçek bir Usta Yapıcı olduğunu kanıtladın.
              </p>
              
              <div className="bg-zinc-900 rounded-2xl p-6 mb-8 border border-zinc-800 relative z-10">
                <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Açılan Özel Rozet</p>
                <div className="flex items-center justify-center gap-3">
                  <Shield className="text-lego-blue" size={24} />
                  <span className="font-bold text-lg">Kartal Gözlü Yapıcı</span>
                </div>
              </div>

              <button
                onClick={() => setShowRewardModal(false)}
                className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-colors relative z-10"
              >
                GÖREVİ TAMAMLA
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
