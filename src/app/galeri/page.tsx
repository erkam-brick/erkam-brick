"use client";

import { motion } from "framer-motion";
import { Search, Heart, Clock, Cuboid } from "lucide-react";
import { useState, useMemo } from "react";
import { PROJECTS, CATEGORIES } from "../../data/projects";
import Navbar from "../../components/Navbar";

export default function GaleriPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "Tümü" || project.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground">
      <Navbar />
      <div className="pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header + Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold tracking-tight mb-3 flex items-center gap-3"
              >
                Başyapıt Galerisi
                <span className="text-xl text-zinc-400 font-medium bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full">
                  {filteredProjects.length} Yapı
                </span>
              </motion.h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                Kendi Lego tasarımlarımın koleksiyonu.
              </p>
            </div>
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

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((category) => (
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

          {/* Grid or Empty State */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-700">
              <Cuboid size={52} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Yapı Bulunamadı</h3>
              <p className="text-zinc-500 mb-6">
                {PROJECTS.length === 0
                  ? "Henüz çalışma eklenmedi. Yakında burada harika yapılar olacak!"
                  : "Aramanızla eşleşen model bulunamadı."}
              </p>
              {PROJECTS.length > 0 && (
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("Tümü"); }}
                  className="px-6 py-2 bg-lego-blue text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                  Aramayı Temizle
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${project.color}`}>
                      {project.difficulty} Seviye
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(project.id, e)}
                      className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white hover:bg-zinc-50 transition-colors ${favorites.includes(project.id) ? "text-lego-red" : "text-zinc-400 hover:text-lego-red"}`}
                    >
                      <Heart size={20} fill={favorites.includes(project.id) ? "currentColor" : "none"} />
                    </button>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-xs font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 text-sm mb-4 flex-grow">
                      {project.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
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
          )}
        </div>
      </div>
    </div>
  );
}
