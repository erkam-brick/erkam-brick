"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, RefreshCw, ArrowRight } from "lucide-react";

const TECHNIC_BUILDS = [
  {
    id: "t1",
    title: "Spor Araba",
    emoji: "🏎️",
    category: "LEGO Technic",
    difficulty: "Orta",
    features: [
      "Çalışan 8 silindirli motor pistonları",
      "Gerçek süspansiyon sistemi",
      "İşlevsel direksiyon mekanizması",
      "Aerodinamik kaporta & spoiler",
    ],
    fun_fact: "Direksiyonu çevirince ön tekerlekler gerçekten yönleniyor!",
    color: "from-red-700 to-red-950",
    accent: "#EF4444",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
  },
  {
    id: "t2",
    title: "Forklift",
    emoji: "🏗️",
    category: "LEGO Technic",
    difficulty: "Kolay",
    features: [
      "Manuel olarak yükselen çatal mekanizması",
      "Dönen arka tekerlek direksiyonu",
      "Gerçekçi karşı ağırlık bloğu",
      "Geniş stabilite tabanı",
    ],
    fun_fact: "Çatalları arka taraftaki dişliyi çevirerek kaldırabilirsiniz!",
    color: "from-orange-600 to-orange-950",
    accent: "#F97316",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80",
  },
  {
    id: "t3",
    title: "Damperli Kamyon",
    emoji: "🚛",
    category: "LEGO Technic",
    difficulty: "Orta",
    features: [
      "Kalkıp inen damper kasası",
      "Mafsallı orta gövde direksiyon sistemi",
      "Devasa çift aks arka tekerlekler",
      "Ayrıntılı motor bölmesi",
    ],
    fun_fact: "Damper kasası mekanik bir kol yardımıyla kalkıp inebiliyor!",
    color: "from-yellow-600 to-amber-900",
    accent: "#F59E0B",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
  },
  {
    id: "t4",
    title: "Orman Makinesi",
    emoji: "🌲",
    category: "LEGO Technic",
    difficulty: "Usta",
    features: [
      "360° dönen sürücü kabini",
      "Hidrolik uzanan kıskac kolu",
      "Devasa arazi tekerlekleri",
      "Ayarlanabilir ağaç kesim bıçağı",
    ],
    fun_fact: "Kıskaç mekanizması 360 derece dönebilen bir dişli sistemine bağlıdır!",
    color: "from-emerald-700 to-emerald-950",
    accent: "#10B981",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
  },
  {
    id: "t5",
    title: "Jeep",
    emoji: "🚙",
    category: "LEGO Technic",
    difficulty: "Kolay",
    features: [
      "Çalışan 4x4 tahrik sistemi",
      "Bağımsız süspansiyon dört tekerlekte",
      "Ön tampon üstü çekme halatı & vinç",
      "Açılır kaput & motor detayı",
    ],
    fun_fact: "Ön tampondaki çekme halatı elle sarılabiliyor!",
    color: "from-lime-700 to-zinc-900",
    accent: "#84CC16",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
  },
  {
    id: "t6",
    title: "SUV Araba",
    emoji: "🚗",
    category: "LEGO Technic",
    difficulty: "Orta",
    features: [
      "Gerçekçi ön ve arka süspansiyon",
      "Dört tekerlekten çekiş şanzımanı",
      "Açılır kapılar & bagaj bölmesi",
      "Çalışan direksiyon mekanizması",
    ],
    fun_fact: "Kaputu açıldığında pistonların yukarı-aşağı hareketi gözlemlenebilir!",
    color: "from-blue-700 to-slate-900",
    accent: "#3B82F6",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
  },
  {
    id: "t7",
    title: "Tekerlekli Yükleyici",
    emoji: "🚜",
    category: "LEGO Technic",
    difficulty: "Usta",
    features: [
      "Mafsallı belden bükümlü şasi",
      "Kalkıp inen büyük ön kepçe",
      "Çalışan hidrolik silindir detayı",
      "Devasa arka karşı ağırlık",
    ],
    fun_fact: "Hidrolik silindirler sayesinde kepçe tonlarca yükü taklit edebilir!",
    color: "from-yellow-600 to-zinc-900",
    accent: "#F59E0B",
    image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&q=80",
  },
  {
    id: "t8",
    title: "Buldozer",
    emoji: "🚜",
    category: "LEGO Technic",
    difficulty: "Orta",
    features: [
      "Geniş paletli sürüş sistemi",
      "Ayarlanabilir ön bıçak (blade)",
      "Arka tırmık (ripper) mekanizması",
      "Gerçek palet bağlantı sistemi",
    ],
    fun_fact: "Paletlerin üzerindeki küçük tekerlekler sürtünmeyi azaltarak hareketi kolaylaştırır!",
    color: "from-yellow-600 to-yellow-950",
    accent: "#F59E0B",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
  },
  {
    id: "t9",
    title: "Kar Ezme Aracı",
    emoji: "❄️",
    category: "LEGO Technic",
    difficulty: "Kolay",
    features: [
      "Kauçuk paletli sürüş sistemi",
      "Ayarlanabilir ön kar küreği",
      "Dönen arka kar düzleştirici",
      "Yüksek zemin boşluklu şasi",
    ],
    fun_fact: "Paletler kar üzerindeki gerçek sürüş hissini taklit etmek üzere tasarlanmıştır!",
    color: "from-cyan-600 to-slate-800",
    accent: "#0EA5E9",
    image: "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=600&q=80",
  },
  {
    id: "t10",
    title: "Motosiklet",
    emoji: "🏍️",
    category: "LEGO Technic",
    difficulty: "Kolay",
    features: [
      "3 vitesli çalışan şanzıman",
      "Mekanik zincir tahrik sistemi",
      "Amortisörlü ön teleskopik maşa",
      "Görünür motor bloğu",
    ],
    fun_fact: "Zincir, tekerlek döndükçe motor pistonlarına hareket iletir!",
    color: "from-red-600 to-zinc-950",
    accent: "#EF4444",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80",
  },
  {
    id: "t11",
    title: "Çöp Kamyonu",
    emoji: "🗑️",
    category: "LEGO Technic",
    difficulty: "Orta",
    features: [
      "Yan taraftan konteyner kaldırma kolu",
      "Arka çöp sıkıştırma mekanizması",
      "Açılır arka kapı",
      "Dişli tahrikli çalışan pres",
    ],
    fun_fact: "Çöp konteynerini kamyonun içine boşaltan kol tek bir dişliyle kontrol ediliyor!",
    color: "from-green-600 to-zinc-900",
    accent: "#10B981",
    image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&q=80",
  },
  {
    id: "t12",
    title: "Mars Aracı",
    emoji: "🪐",
    category: "LEGO Technic",
    difficulty: "Usta",
    features: [
      "6 tekerlekli rocker-bogie süspansiyon",
      "Dönen araştırma kolu (arm)",
      "Güneş paneli & anten dizisi",
      "NASA Perseverance'a dayalı tasarım",
    ],
    fun_fact: "NASA'nın Perseverance uzay aracının gerçeğe uygun mekanik kopyasıdır!",
    color: "from-orange-700 to-rose-950",
    accent: "#F97316",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=80",
  },
  {
    id: "t13",
    title: "Paletli Vinç",
    emoji: "🏗️",
    category: "LEGO Technic",
    difficulty: "Usta",
    features: [
      "1.2 m uzayan kafes bom",
      "Çift halatlı çalışan vinç tamburları",
      "360° dönen üst gövde",
      "Kilitlenebilir destek ayakları",
    ],
    fun_fact: "1.2 metreye kadar uzayabilen bomu ile en yüksek Technic modellerinden biridir!",
    color: "from-yellow-500 to-neutral-900",
    accent: "#F59E0B",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&q=80",
  },
  {
    id: "t14",
    title: "Malzeme Elleçleyici",
    emoji: "🏗️",
    category: "LEGO Technic",
    difficulty: "Orta",
    features: [
      "Yükselen operatör kabini",
      "Döner hidrolik kıskaç",
      "Açılır stabilizatör ayakları",
      "Uzayan teleskopik kol",
    ],
    fun_fact: "Operatör kabini, dikey bir piston mekanizmasıyla yukarı doğru yükselmektedir!",
    color: "from-blue-600 to-slate-900",
    accent: "#3B82F6",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
  },
  {
    id: "t15",
    title: "Havaalanı Kurtarma Aracı",
    emoji: "🚒",
    category: "LEGO Technic",
    difficulty: "Orta",
    features: [
      "Çift dingilli 4 tekerlekten yönlendirme",
      "Teleskopik su bom mekanizması",
      "180° dönen su püskürtme nozulu",
      "Çalışan 4 silindirli motor",
    ],
    fun_fact: "Teleskopik bom üzerindeki su püskürtme ucu 180 derece dönebilir!",
    color: "from-red-600 to-stone-900",
    accent: "#EF4444",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80",
  },
  {
    id: "t16",
    title: "Traktör",
    emoji: "🚜",
    category: "LEGO Technic",
    difficulty: "Kolay",
    features: [
      "Çalışan arka kuyruk mili (PTO)",
      "Bağlanabilir arka aparat (pulluk/biçer)",
      "Döner ön direksiyon sistemi",
      "Büyük çaplı tarla tekerlekleri",
    ],
    fun_fact: "Traktör hareket ettikçe pulluk diskleri de bağlı dişliler sayesinde döner!",
    color: "from-green-600 to-amber-950",
    accent: "#10B981",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80",
  },
  {
    id: "t17",
    title: "Maden Kepçesi",
    emoji: "⛏️",
    category: "LEGO Technic",
    difficulty: "Usta",
    features: [
      "Dev ön yükleme kepçesi",
      "Mafsallı gövde yönlendirme",
      "Karşı ağırlıklı arka bölme",
      "Gerçekçi büyük dişli çark sistemi",
    ],
    fun_fact: "Devasa ağırlığı dengelemek için gövdenin arkasında metal karşı ağırlıklar bulunur!",
    color: "from-yellow-600 to-stone-910",
    accent: "#F59E0B",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80",
  },
  {
    id: "t18",
    title: "Arazi Aracı",
    emoji: "🏎️",
    category: "LEGO Technic",
    difficulty: "Orta",
    features: [
      "Büyük kauçuk arazi lastikleri",
      "Bağımsız dört amortisör sistemi",
      "Çalışan ön vinç mekanizması",
      "Koruyucu takla kafesi",
    ],
    fun_fact: "Araç havaya atıldığında süspansiyonlar darbeyi tamamen emebilecek kapasitededir!",
    color: "from-lime-600 to-neutral-900",
    accent: "#84CC16",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
  },
];

const CITY_BUILDS = [
  {
    id: "c1",
    title: "Kamyon",
    emoji: "🚚",
    category: "LEGO City",
    difficulty: "Kolay",
    features: [
      "Açılır arka kargo kapısı",
      "Takılıp çıkarılabilir kargo paketleri",
      "El arabası aksesuarı",
      "Detaylı sürücü kamarası",
    ],
    fun_fact: "Kamyonun kasasında kargoları kilitleyen küçük bölmeler vardır!",
    color: "from-blue-500 to-blue-700",
    accent: "#3B82F6",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
  },
  {
    id: "c2",
    title: "Traktör",
    emoji: "🚜",
    category: "LEGO City",
    difficulty: "Kolay",
    features: [
      "Büyük çaplı arka çiftlik tekerlekleri",
      "Saman balyası & hasat aksesuarları",
      "Çiftçi minifigürü dahil",
      "Açık kabin sürüş yeri",
    ],
    fun_fact: "Sete lezzetli görünen iki adet LEGO balkabağı dahildir!",
    color: "from-green-500 to-green-700",
    accent: "#10B981",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80",
  },
  {
    id: "c3",
    title: "Villa",
    emoji: "🏡",
    category: "LEGO City",
    difficulty: "Orta",
    features: [
      "Güneş panelli modern çatı",
      "Elektrikli araç şarj istasyonu",
      "Açılır katlar & döşenmiş odalar",
      "Bahçe & yüzme havuzu alanı",
    ],
    fun_fact: "Villanın bahçesinde sevimli bir LEGO golden retriever köpeği yaşar!",
    color: "from-emerald-500 to-teal-700",
    accent: "#10B981",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  },
  {
    id: "c4",
    title: "Havuz",
    emoji: "🏊",
    category: "LEGO City",
    difficulty: "Kolay",
    features: [
      "Çalışan plastik kaydırak",
      "Güneş şemsiyesi & şezlonglar",
      "Dondurma standı aksesuarı",
      "Can simidi & kurtarma kulesi",
    ],
    fun_fact: "Tramplenden atlama tahtası esnek plastik parçadan yapılmıştır!",
    color: "from-sky-400 to-blue-600",
    accent: "#0EA5E9",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80",
  },
  {
    id: "c5",
    title: "İtfaiye Kamyonu",
    emoji: "🚒",
    category: "LEGO City",
    difficulty: "Kolay",
    features: [
      "Uzatılabilir & dönen yangın merdiveni",
      "Su hortumu & basınçlı tabanca",
      "Işıklı siren aksesuarı",
      "İtfaiyeci minifigürleri dahil",
    ],
    fun_fact: "Merdiven kendi ekseni etrafında 360 derece dönebilir ve 25 cm uzayabilir!",
    color: "from-red-500 to-red-700",
    accent: "#EF4444",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80",
  },
  {
    id: "c6",
    title: "Kamyonet",
    emoji: "🛻",
    category: "LEGO City",
    difficulty: "Kolay",
    features: [
      "Aşağı açılan arka kapak",
      "Tavan macera ekipman taşıyıcısı",
      "Sörf tahtası & kamp ekipmanı",
      "Çekme kancası (tow hitch)",
    ],
    fun_fact: "Arka kapağı tamamen aşağıya doğru açılabilen mekanizmaya sahiptir!",
    color: "from-orange-500 to-amber-600",
    accent: "#F97316",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
  },
  {
    id: "c7",
    title: "Taksi",
    emoji: "🚕",
    category: "LEGO City",
    difficulty: "Kolay",
    features: [
      "Klasik sarı taksi rengi",
      "Tavan reklam ve ışık tabelası",
      "Bagaj taşıma raf aksesuarı",
      "Taksi şoförü minifigürü",
    ],
    fun_fact: "Sürücü minifigürünün elinde bir adet kahve bardağı bulunur!",
    color: "from-yellow-400 to-amber-500",
    accent: "#F59E0B",
    image: "https://images.unsplash.com/photo-1492664738948-2ec93a5c0942?w=600&q=80",
  },
  {
    id: "c8",
    title: "Sahil Güvenlik Aracı",
    emoji: "🛥️",
    category: "LEGO City",
    difficulty: "Kolay",
    features: [
      "Su üzerinde yüzebilen kurtarma botu",
      "Römorklu sahil jipi",
      "Can yelekleri & şamandıra",
      "Sahil güvenlik minifigürleri",
    ],
    fun_fact: "Sahil güvenlik botu su üzerinde gerçekten yüzebilmektedir!",
    color: "from-sky-500 to-indigo-700",
    accent: "#3B82F6",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
  },
  {
    id: "c9",
    title: "Süper Araba",
    emoji: "🏎️",
    category: "LEGO City",
    difficulty: "Kolay",
    features: [
      "Değiştirilebilir jant kapakları",
      "Büyük arka rüzgarlık (spoiler)",
      "Alçak gövde & spor süspansiyon",
      "2 kapılı yarış koltuğu kamarası",
    ],
    fun_fact: "Jant kapakları isteğe göre değiştirilebilir iki farklı tasarımla gelir!",
    color: "from-violet-500 to-purple-800",
    accent: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
  },
  {
    id: "c10",
    title: "Tren İstasyonu",
    emoji: "🚉",
    category: "LEGO City",
    difficulty: "Orta",
    features: [
      "Detaylı bilet gişesi & bekleme salonu",
      "Kahve dükkanı & satış standı",
      "Yolcu peronları & ray geçiş köprüsü",
      "Kalkış/varış tabelası çıkartmaları",
    ],
    fun_fact: "İstasyon panosunda LEGO City tren saatlerini gösteren detaylı çıkartmalar vardır!",
    color: "from-slate-500 to-slate-800",
    accent: "#6B7280",
    image: "https://images.unsplash.com/photo-1474487548417-781cb6d646d8?w=600&q=80",
  },
  {
    id: "c11",
    title: "Dağ Bisikleti",
    emoji: "🚲",
    category: "LEGO City",
    difficulty: "Kolay",
    features: [
      "Kalın dişli arazi lastikleri",
      "Bisiklet kaskı & koruyucu diz kapağı",
      "Kamp ateşi & çadır aksesuarı",
      "Minifigür ile uyumlu kavrama tutacakları",
    ],
    fun_fact: "Bisiklet iskeleti minifigürlerin elleriyle tam kavrayabileceği ölçüdedir!",
    color: "from-lime-500 to-emerald-700",
    accent: "#84CC16",
    image: "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=600&q=80",
  },
  {
    id: "c12",
    title: "Minibüs",
    emoji: "🚐",
    category: "LEGO City",
    difficulty: "Kolay",
    features: [
      "Sürgülü yan kapı",
      "Tavan bagaj & ekipman taşıyıcısı",
      "Minyatür lavabo & kahve makinesi",
      "Katlanabilir arka koltuklar",
    ],
    fun_fact: "İçerisinde küçük bir lavabo ve minyatür kahve makinesi mevcuttur!",
    color: "from-yellow-500 to-orange-600",
    accent: "#F59E0B",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
  },
  {
    id: "c13",
    title: "Araç Yıkama",
    emoji: "🧼",
    category: "LEGO City",
    difficulty: "Kolay",
    features: [
      "Dönen köpük fırçaları",
      "Kurutma fanı mekanizması",
      "Su püskürtme nozulları",
      "Araç içinden geçiş rampa sistemi",
    ],
    fun_fact: "Fırçalar, araç içinden geçtikçe tekerleklerin sürtünmesiyle otomatik olarak döner!",
    color: "from-blue-400 to-indigo-600",
    accent: "#3B82F6",
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80",
  },
  {
    id: "c14",
    title: "F1 Garajı",
    emoji: "🏎️",
    category: "LEGO City",
    difficulty: "Orta",
    features: [
      "Pit stop krikosu & lastik değişim seti",
      "Bilgisayar ekranları & strateji masası",
      "Takım pit ekibi minifigürleri",
      "Yarış arabasını havaya kaldırma krikosu",
    ],
    fun_fact: "Pit stop krikosu yardımıyla yarış arabasını gerçekten havaya kaldırabilirsiniz!",
    color: "from-red-500 to-stone-800",
    accent: "#EF4444",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80",
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
  const [phase, setPhase] = useState<"select-category" | "idle" | "shaking" | "opening" | "revealed">("select-category");
  const [selectedCategory, setSelectedCategory] = useState<"Technic" | "City" | null>(null);
  const [currentBuild, setCurrentBuild] = useState<any>(null);
  const [spinCount, setSpinCount] = useState(0);

  const handleSelectCategory = (category: "Technic" | "City") => {
    setSelectedCategory(category);
    setPhase("idle");
  };

  const handleOpenBox = () => {
    if (phase === "shaking" || phase === "opening" || !selectedCategory) return;
    setPhase("shaking");

    setTimeout(() => {
      setPhase("opening");
      const list = selectedCategory === "Technic" ? TECHNIC_BUILDS : CITY_BUILDS;
      const random = list[Math.floor(Math.random() * list.length)];
      setCurrentBuild(random);
      setTimeout(() => setPhase("revealed"), 600);
    }, 1200);
  };

  const handleTryAgain = () => {
    setPhase("select-category");
    setSelectedCategory(null);
    setCurrentBuild(null);
    setSpinCount((c) => c + 1);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col border border-zinc-200 dark:border-zinc-800"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-colors shadow border border-zinc-200/50 dark:border-zinc-700/50"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center flex-shrink-0">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Sürpriz Kutu</p>
          <h2 className="text-3xl font-black tracking-tight">🎁 Kutu Aç!</h2>
          <p className="text-sm text-zinc-500 mt-1">
            {phase === "select-category"
              ? "Başlamak için bir LEGO kategorisi seçin"
              : "Şansına ne çıkacağını görmek için kutuyu aç!"}
          </p>
        </div>

        <div className="overflow-y-auto flex-1 pb-6">
          <AnimatePresence mode="wait">
            {phase === "select-category" ? (
              /* Category Selection Phase */
              <motion.div
                key="select-category-phase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col gap-4 px-8 py-4"
              >
                {/* Technic Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectCategory("Technic")}
                  className="relative group overflow-hidden rounded-[2rem] p-6 bg-gradient-to-br from-zinc-800 to-zinc-950 text-white border border-zinc-700 hover:border-zinc-500 shadow-lg cursor-pointer transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-colors duration-300" />
                  <div className="flex items-start gap-4">
                    <span className="text-5xl select-none filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">⚙️</span>
                    <div>
                      <h3 className="text-xl font-black tracking-tight flex items-center gap-1.5">
                        LEGO Technic
                        <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mt-0.5">Mühendislik & Mekanik</p>
                      <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                        Çalışan motor pistonları, gelişmiş vites kutuları, süspansiyon sistemleri ve karmaşık iş makineleriyle dolu dünyayı keşfet.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* City Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectCategory("City")}
                  className="relative group overflow-hidden rounded-[2rem] p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-zinc-900 dark:to-blue-950/20 text-zinc-900 dark:text-white border border-blue-200 dark:border-blue-950/50 hover:border-blue-400 dark:hover:border-blue-900 shadow-lg cursor-pointer transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors duration-300" />
                  <div className="flex items-start gap-4">
                    <span className="text-5xl select-none filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">🏙️</span>
                    <div>
                      <h3 className="text-xl font-black tracking-tight flex items-center gap-1.5">
                        LEGO City
                        <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mt-0.5">Şehir Hayatı & Macera</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-300 mt-3 leading-relaxed">
                        İtfaiye istasyonları, süper arabalar, taksiler, trenler, lüks villalar ve şehir sokaklarındaki macera dolu günlük yaşamı tasarla.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : phase !== "revealed" ? (
              /* Box Phase */
              <motion.div
                key="box-phase"
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex flex-col items-center px-8 py-6"
              >
                {/* Selected Category Label */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      selectedCategory === "Technic"
                        ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    }`}
                  >
                    {selectedCategory === "Technic" ? "⚙️ LEGO Technic Seçildi" : "🏙️ LEGO City Seçildi"}
                  </span>
                </div>

                {/* The Box */}
                <div className="relative flex items-center justify-center mb-8 select-none">
                  <motion.div
                    animate={
                      phase === "shaking"
                        ? { scale: [1, 1.3, 1, 1.4, 1], opacity: [0.4, 0.8, 0.4, 0.9, 0.4] }
                        : { opacity: 0.2 }
                    }
                    transition={{ duration: 1, repeat: phase === "shaking" ? Infinity : 0 }}
                    className={`absolute w-48 h-48 rounded-full blur-3xl ${
                      selectedCategory === "Technic" ? "bg-red-500/40" : "bg-blue-500/40"
                    }`}
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-5 text-white font-black text-xl rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${
                    selectedCategory === "Technic"
                      ? "bg-gradient-to-r from-red-600 to-red-800 shadow-red-500/20"
                      : "bg-gradient-to-r from-blue-600 to-blue-800 shadow-blue-500/20"
                  }`}
                >
                  {phase === "idle" && <><span>🎁</span> KUTUYU AÇ!</>}
                  {phase === "shaking" && <><span className="animate-bounce">⏳</span> Açılıyor...</>}
                  {phase === "opening" && <><span>🎊</span> Sürpriz!</>}
                </motion.button>

                <button
                  onClick={handleTryAgain}
                  disabled={phase === "shaking" || phase === "opening"}
                  className="w-full mt-3 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  ⬅️ Kategori Değiştir
                </button>
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
                  <div className={`absolute inset-0 bg-gradient-to-t ${currentBuild.color} opacity-60`} />
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
                </div>

                {/* Details */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="px-7 py-5"
                >
                  {/* Feature List */}
                  <div className="mb-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">🔩 Özellikler</p>
                    <ul className="flex flex-col gap-2">
                      {currentBuild.features.map((feat: string, i: number) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.08 }}
                          className="flex items-center gap-2.5 text-sm text-zinc-700 dark:text-zinc-300 font-medium"
                        >
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: currentBuild.accent }}
                          />
                          {feat}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Fun fact */}
                  <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3 mb-5">
                    <span className="text-xl flex-shrink-0">💡</span>
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">{currentBuild.fun_fact}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleTryAgain}
                      className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 font-black rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      <RefreshCw size={16} /> Tekrar Dene
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 bg-foreground text-background font-black rounded-2xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink size={16} /> Kapat
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
