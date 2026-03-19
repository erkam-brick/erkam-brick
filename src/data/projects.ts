export type Project = {
  id: number;
  title: string;
  category: string;
  pieces: string;
  color: string;
  image: string;
  difficulty: "Kolay" | "Orta" | "Usta";
  buildTime: string;
  description: string;
  piecesNumber: number;
  badge?: string; // optional special badge e.g. "Powered UP"
};

export type Motor = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string;
  speed: string;
  torque: string;
  compatible: string;
};

export const POWERED_UP_MOTORS: Motor[] = [
  {
    id: 1,
    title: "Large Motor",
    subtitle: "88013",
    description:
      "LEGO Powered UP Large Motor. Yüksek tork kapasitesiyle büyük yapıları hareket ettirmek için ideal. Technic setlerinde sıkça kullanılan bu motor, güçlü ve güvenilir performansıyla öne çıkar.",
    color: "from-gray-700 to-gray-900",
    icon: "⚫",
    speed: "185 RPM",
    torque: "30 N·cm",
    compatible: "Technic, Boost",
  },
  {
    id: 2,
    title: "Büyük Açılı Motor",
    subtitle: "45602",
    description:
      "360° hassas açı kontrolü ile donatılmış, Technic ve SPIKE Prime setleriyle tam uyumlu güçlü bir motor. Robotik projelerde hassas hareket kontrolü sağlar.",
    color: "from-lego-red to-red-900",
    icon: "🔴",
    speed: "175 RPM",
    torque: "25 N·cm",
    compatible: "Technic, SPIKE",
  },
  {
    id: 3,
    title: "Işık",
    subtitle: "88005",
    description:
      "LEGO Powered UP LED Işık modülü. Yapılarınıza aydınlatma efekti ekleyin. Parlaklık ayarı yapılabilir, farklı renk seçenekleriyle yaratıcı projelerinizi canlandırın.",
    color: "from-lego-yellow to-amber-600",
    icon: "💡",
    speed: "—",
    torque: "—",
    compatible: "Tüm PU Hub",
  },
  {
    id: 4,
    title: "Renk ve Mesafe Sensörü",
    subtitle: "88007",
    description:
      "Renkleri algılayan ve mesafe ölçen akıllı sensör. Robotik projelerde çevre algılama, çizgi takibi ve nesne tespiti gibi görevler için vazgeçilmez bir bileşen.",
    color: "from-lego-green to-emerald-800",
    icon: "🟢",
    speed: "—",
    torque: "—",
    compatible: "Technic, SPIKE",
  },
];


export const PROJECTS: Project[] = [];

export const CATEGORIES = [
  "Tümü",
  "Minecraft",
  "Şehir",
  "Technic",
  "Technic-City",
  "Powered UP",
];

