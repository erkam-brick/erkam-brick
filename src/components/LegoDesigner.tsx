"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Trash2, RotateCw, Save, ChevronDown, X, ZoomIn, ZoomOut,
  Layers, Palette, Package, Trees, Wrench, Star, Grid3X3
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type LegoPart = {
  id: string;
  name: string;
  category: "City" | "Classic" | "Creator" | "Technic" | "Doğa";
  w: number; // grid columns
  h: number; // grid rows
  shape: "rect" | "round" | "slope" | "slope-inv" | "arch" | "leaf" | "tree" | "gear" | "pin" | "beam" | "wedge";
  icon: string;
  defaultColor: string;
  studPattern?: "full" | "edge" | "none"; // stud rendering hint
};

type PlacedBrick = {
  uid: string;
  partId: string;
  x: number; // grid column (0-indexed)
  y: number; // grid row (0-indexed)
  layer: number; // Z layer
  color: string;
  rotation: number; // 0 | 90 | 180 | 270
};

// ─── LEGO Color Palette ────────────────────────────────────────────────────────
const LEGO_COLORS: { name: string; hex: string }[] = [
  { name: "Kırmızı", hex: "#CC0000" },
  { name: "Mavi", hex: "#006CB7" },
  { name: "Sarı", hex: "#F5CD2F" },
  { name: "Yeşil", hex: "#237841" },
  { name: "Açık Yeşil", hex: "#4DBB3A" },
  { name: "Turuncu", hex: "#FE8A18" },
  { name: "Mor", hex: "#9C4DC1" },
  { name: "Pembe", hex: "#FC97AC" },
  { name: "Açık Mavi", hex: "#9FC3E0" },
  { name: "Gök Mavisi", hex: "#0099CD" },
  { name: "Koyu Gri", hex: "#595D60" },
  { name: "Açık Gri", hex: "#AFB5C7" },
  { name: "Beyaz", hex: "#FFFFFF" },
  { name: "Siyah", hex: "#1A1A1A" },
  { name: "Kahverengi", hex: "#5F3109" },
  { name: "Açık Kahve", hex: "#AA7D55" },
  { name: "Krem", hex: "#F2E4BC" },
  { name: "Koyu Kırmızı", hex: "#8B0000" },
  { name: "Altın", hex: "#D4AF37" },
  { name: "Gümüş", hex: "#A8A9AD" },
  { name: "Şeffaf Mavi", hex: "#73C9E7" },
  { name: "Şeffaf Kırmızı", hex: "#F9695A" },
  { name: "Lime", hex: "#A5CA18" },
  { name: "Teal", hex: "#008E9B" },
];

// ─── Part Library ─────────────────────────────────────────────────────────────
const PARTS: LegoPart[] = [
  // ── City / Classic ──
  { id: "brick-1x1", name: "1×1 Tuğla", category: "Classic", w: 1, h: 1, shape: "rect", icon: "🧱", defaultColor: "#CC0000" },
  { id: "brick-1x2", name: "1×2 Tuğla", category: "Classic", w: 2, h: 1, shape: "rect", icon: "🧱", defaultColor: "#CC0000" },
  { id: "brick-2x2", name: "2×2 Tuğla", category: "Classic", w: 2, h: 2, shape: "rect", icon: "🧱", defaultColor: "#CC0000" },
  { id: "brick-2x4", name: "2×4 Tuğla", category: "Classic", w: 4, h: 2, shape: "rect", icon: "🧱", defaultColor: "#0055BF" },
  { id: "brick-1x4", name: "1×4 Tuğla", category: "Classic", w: 4, h: 1, shape: "rect", icon: "🧱", defaultColor: "#0055BF" },
  { id: "brick-1x6", name: "1×6 Tuğla", category: "Classic", w: 6, h: 1, shape: "rect", icon: "🧱", defaultColor: "#237841" },
  { id: "brick-1x8", name: "1×8 Tuğla", category: "Classic", w: 8, h: 1, shape: "rect", icon: "🧱", defaultColor: "#237841" },
  { id: "brick-2x6", name: "2×6 Tuğla", category: "Classic", w: 6, h: 2, shape: "rect", icon: "🧱", defaultColor: "#F5CD2F" },
  { id: "brick-4x4", name: "4×4 Tuğla", category: "Classic", w: 4, h: 4, shape: "rect", icon: "🧱", defaultColor: "#9C4DC1" },
  { id: "plate-1x1", name: "1×1 Plaka", category: "Classic", w: 1, h: 1, shape: "rect", icon: "▬", defaultColor: "#F5CD2F" },
  { id: "plate-1x2", name: "1×2 Plaka", category: "Classic", w: 2, h: 1, shape: "rect", icon: "▬", defaultColor: "#F5CD2F" },
  { id: "plate-2x2", name: "2×2 Plaka", category: "Classic", w: 2, h: 2, shape: "rect", icon: "▬", defaultColor: "#0055BF" },
  { id: "plate-2x4", name: "2×4 Plaka", category: "Classic", w: 4, h: 2, shape: "rect", icon: "▬", defaultColor: "#0055BF" },
  { id: "plate-4x4", name: "4×4 Plaka", category: "Classic", w: 4, h: 4, shape: "rect", icon: "▬", defaultColor: "#CC0000" },
  { id: "slope-1x1", name: "1×1 Eğim", category: "Classic", w: 1, h: 1, shape: "slope", icon: "◤", defaultColor: "#595D60" },
  { id: "slope-2x1", name: "2×1 Eğim", category: "Classic", w: 2, h: 1, shape: "slope", icon: "◤", defaultColor: "#595D60" },
  { id: "slope-2x2", name: "2×2 Eğim", category: "Classic", w: 2, h: 2, shape: "slope", icon: "◤", defaultColor: "#AFB5C7" },
  { id: "wedge-2x2", name: "2×2 Kama", category: "Classic", w: 2, h: 2, shape: "wedge", icon: "◢", defaultColor: "#AFB5C7" },
  { id: "cone-1x1", name: "1×1 Koni", category: "Classic", w: 1, h: 1, shape: "round", icon: "▲", defaultColor: "#CC0000" },
  { id: "cylinder-1x1", name: "1×1 Silindir", category: "Classic", w: 1, h: 1, shape: "round", icon: "⬤", defaultColor: "#AFB5C7" },
  { id: "tile-1x1", name: "1×1 Düz Karo", category: "Classic", w: 1, h: 1, shape: "rect", icon: "◻", defaultColor: "#FFFFFF", studPattern: "none" },
  { id: "tile-1x2", name: "1×2 Düz Karo", category: "Classic", w: 2, h: 1, shape: "rect", icon: "▭", defaultColor: "#FFFFFF", studPattern: "none" },
  { id: "tile-2x2", name: "2×2 Düz Karo", category: "Classic", w: 2, h: 2, shape: "rect", icon: "□", defaultColor: "#FFFFFF", studPattern: "none" },
  // ── City ──
  { id: "door-frame", name: "Kapı Çerçevesi", category: "City", w: 2, h: 3, shape: "arch", icon: "🚪", defaultColor: "#AFB5C7" },
  { id: "window-1x2", name: "Pencere 1×2", category: "City", w: 2, h: 2, shape: "rect", icon: "🪟", defaultColor: "#73C9E7" },
  { id: "road-plate", name: "Yol Plakası 4×4", category: "City", w: 4, h: 4, shape: "rect", icon: "🛣️", defaultColor: "#595D60", studPattern: "none" },
  { id: "fence-1x4", name: "Çit 1×4", category: "City", w: 4, h: 1, shape: "rect", icon: "🚧", defaultColor: "#FFFFFF" },
  { id: "sign-1x2", name: "Tabela 1×2", category: "City", w: 2, h: 1, shape: "rect", icon: "🪧", defaultColor: "#F5CD2F" },
  { id: "stair-2x4", name: "Merdiven 2×4", category: "City", w: 4, h: 2, shape: "slope", icon: "🪜", defaultColor: "#AFB5C7" },
  { id: "arch-1x5", name: "Kemer 1×5", category: "City", w: 5, h: 2, shape: "arch", icon: "🌉", defaultColor: "#AFB5C7" },
  { id: "baseplate-8x8", name: "Taban 8×8", category: "City", w: 8, h: 8, shape: "rect", icon: "⬛", defaultColor: "#237841", studPattern: "none" },
  // ── Creator ──
  { id: "round-2x2", name: "Yuvarlak 2×2", category: "Creator", w: 2, h: 2, shape: "round", icon: "⭕", defaultColor: "#FE8A18" },
  { id: "round-4x4", name: "Yuvarlak 4×4", category: "Creator", w: 4, h: 4, shape: "round", icon: "⭕", defaultColor: "#9C4DC1" },
  { id: "arch-2x2", name: "Kemerli Kapı 2×2", category: "Creator", w: 2, h: 3, shape: "arch", icon: "🏛️", defaultColor: "#F2E4BC" },
  { id: "turret-2x2", name: "Kule Taban 2×2", category: "Creator", w: 2, h: 2, shape: "round", icon: "🏰", defaultColor: "#AFB5C7" },
  { id: "flag-1x2", name: "Bayrak 1×2", category: "Creator", w: 2, h: 1, shape: "slope", icon: "🚩", defaultColor: "#CC0000" },
  { id: "inv-slope-2x2", name: "Ters Eğim 2×2", category: "Creator", w: 2, h: 2, shape: "slope-inv", icon: "◣", defaultColor: "#595D60" },
  { id: "hex-2x2", name: "Altıgen 2×2", category: "Creator", w: 2, h: 2, shape: "round", icon: "⬡", defaultColor: "#F5CD2F" },
  // ── Technic ──
  { id: "beam-1x5", name: "Kiriş 1×5", category: "Technic", w: 5, h: 1, shape: "beam", icon: "━", defaultColor: "#595D60" },
  { id: "beam-1x9", name: "Kiriş 1×9", category: "Technic", w: 9, h: 1, shape: "beam", icon: "━━", defaultColor: "#595D60" },
  { id: "beam-1x13", name: "Kiriş 1×13", category: "Technic", w: 13, h: 1, shape: "beam", icon: "━━━", defaultColor: "#595D60" },
  { id: "beam-l-shape", name: "L Kiriş", category: "Technic", w: 5, h: 3, shape: "beam", icon: "⌐", defaultColor: "#595D60" },
  { id: "gear-8t", name: "Dişli 8T", category: "Technic", w: 2, h: 2, shape: "gear", icon: "⚙️", defaultColor: "#595D60" },
  { id: "gear-24t", name: "Dişli 24T", category: "Technic", w: 4, h: 4, shape: "gear", icon: "⚙️", defaultColor: "#AFB5C7" },
  { id: "pin-1", name: "Pin", category: "Technic", w: 1, h: 1, shape: "pin", icon: "📌", defaultColor: "#595D60" },
  { id: "pin-long", name: "Uzun Pin", category: "Technic", w: 2, h: 1, shape: "pin", icon: "📌", defaultColor: "#AFB5C7" },
  { id: "axle-4", name: "Eksen 4L", category: "Technic", w: 4, h: 1, shape: "pin", icon: "⚊", defaultColor: "#595D60" },
  { id: "axle-8", name: "Eksen 8L", category: "Technic", w: 8, h: 1, shape: "pin", icon: "⚊⚊", defaultColor: "#595D60" },
  { id: "motor-l", name: "L Motor", category: "Technic", w: 4, h: 4, shape: "rect", icon: "🔋", defaultColor: "#FE8A18" },
  { id: "tech-panel-5x7", name: "Panel 5×7", category: "Technic", w: 5, h: 7, shape: "rect", icon: "📋", defaultColor: "#AFB5C7", studPattern: "edge" },
  // ── Doğa ──
  { id: "tree-trunk", name: "Ağaç Gövdesi", category: "Doğa", w: 1, h: 1, shape: "tree", icon: "🪵", defaultColor: "#5F3109" },
  { id: "leaf-round-lg", name: "Büyük Yaprak", category: "Doğa", w: 4, h: 4, shape: "leaf", icon: "🌿", defaultColor: "#237841" },
  { id: "leaf-round-sm", name: "Küçük Yaprak", category: "Doğa", w: 2, h: 2, shape: "leaf", icon: "🍃", defaultColor: "#4DBB3A" },
  { id: "flower", name: "Çiçek", category: "Doğa", w: 1, h: 1, shape: "round", icon: "🌸", defaultColor: "#FC97AC" },
  { id: "cactus", name: "Kaktüs", category: "Doğa", w: 2, h: 3, shape: "tree", icon: "🌵", defaultColor: "#4DBB3A" },
  { id: "rock-1x2", name: "Kaya 1×2", category: "Doğa", w: 2, h: 1, shape: "round", icon: "🪨", defaultColor: "#AFB5C7" },
  { id: "rock-2x2", name: "Kaya 2×2", category: "Doğa", w: 2, h: 2, shape: "round", icon: "🪨", defaultColor: "#595D60" },
  { id: "grass-4x4", name: "Çim 4×4", category: "Doğa", w: 4, h: 4, shape: "rect", icon: "🌱", defaultColor: "#4DBB3A", studPattern: "none" },
  { id: "water-4x4", name: "Su 4×4", category: "Doğa", w: 4, h: 4, shape: "rect", icon: "💧", defaultColor: "#73C9E7", studPattern: "none" },
  { id: "sand-2x4", name: "Kum 2×4", category: "Doğa", w: 4, h: 2, shape: "rect", icon: "🏜️", defaultColor: "#D4AF37", studPattern: "none" },
];

const CATEGORIES = ["Tümü", "Classic", "City", "Creator", "Technic", "Doğa"] as const;
type CategoryFilter = typeof CATEGORIES[number];

const CATEGORY_ICONS: Record<CategoryFilter, React.ReactNode> = {
  "Tümü": <Grid3X3 size={14} />,
  "Classic": <Package size={14} />,
  "City": <Star size={14} />,
  "Creator": <Layers size={14} />,
  "Technic": <Wrench size={14} />,
  "Doğa": <Trees size={14} />,
};

// ─── Grid config ──────────────────────────────────────────────────────────────
const GRID_COLS = 32;
const GRID_ROWS = 32;
const CELL_PX = 20; // pixels per grid cell

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 11);
}

function darken(hex: string, amount = 30) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (n >> 16) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function lighten(hex: string, amount = 40) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (n >> 16) + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// ─── Brick SVG renderer ───────────────────────────────────────────────────────
function BrickSVG({
  part,
  color,
  cellPx,
  selected,
}: {
  part: LegoPart;
  color: string;
  cellPx: number;
  selected: boolean;
}) {
  const w = part.w * cellPx;
  const h = part.h * cellPx;
  const studR = cellPx * 0.28;
  const dark = darken(color, 35);
  const light = lighten(color, 45);

  const studs: React.ReactNode[] = [];
  if (part.studPattern !== "none" && part.shape !== "gear" && part.shape !== "pin" && part.shape !== "beam") {
    for (let row = 0; row < part.h; row++) {
      for (let col = 0; col < part.w; col++) {
        const cx = col * cellPx + cellPx / 2;
        const cy = row * cellPx + cellPx / 2;
        studs.push(
          <g key={`${row}-${col}`}>
            <ellipse cx={cx} cy={cy} rx={studR} ry={studR * 0.6} fill={lighten(color, 25)} stroke={dark} strokeWidth={0.5} />
            <ellipse cx={cx} cy={cy - studR * 0.15} rx={studR * 0.85} ry={studR * 0.5} fill={light} opacity={0.55} />
          </g>
        );
      }
    }
  }

  let shape: React.ReactNode;
  if (part.shape === "round" || part.shape === "leaf") {
    const rx = w / 2;
    const ry = h / 2;
    shape = (
      <>
        <ellipse cx={rx} cy={ry} rx={rx - 1} ry={ry - 1} fill={color} stroke={dark} strokeWidth={1.5} />
        <ellipse cx={rx} cy={ry - ry * 0.15} rx={rx * 0.7} ry={ry * 0.4} fill={light} opacity={0.3} />
        {studs}
      </>
    );
  } else if (part.shape === "slope") {
    shape = (
      <>
        <polygon points={`0,${h} ${w},${h} ${w},0`} fill={color} stroke={dark} strokeWidth={1.5} />
        <polygon points={`${w * 0.3},${h} ${w},${h} ${w},${h * 0.3}`} fill={light} opacity={0.2} />
      </>
    );
  } else if (part.shape === "slope-inv") {
    shape = (
      <>
        <polygon points={`0,0 ${w},0 0,${h}`} fill={color} stroke={dark} strokeWidth={1.5} />
        <polygon points={`0,0 ${w * 0.7},0 0,${h * 0.7}`} fill={light} opacity={0.2} />
      </>
    );
  } else if (part.shape === "wedge") {
    shape = (
      <>
        <polygon points={`0,${h} ${w},${h} ${w},0`} fill={color} stroke={dark} strokeWidth={1.5} />
        <polygon points={`${w * 0.05},${h * 0.95} ${w * 0.95},${h * 0.95} ${w * 0.95},${h * 0.1}`} fill={light} opacity={0.18} />
      </>
    );
  } else if (part.shape === "arch") {
    const midX = w / 2;
    shape = (
      <>
        <rect x={1} y={h / 2} width={w - 2} height={h / 2 - 1} fill={color} stroke={dark} strokeWidth={1} />
        <path d={`M1,${h / 2} A${midX - 1},${h / 2 - 1} 0 0,1 ${w - 1},${h / 2}`} fill={color} stroke={dark} strokeWidth={1.5} />
        <rect x={1} y={1} width={cellPx - 2} height={h / 2 - 1} fill={color} stroke={dark} strokeWidth={1} />
        <rect x={w - cellPx + 1} y={1} width={cellPx - 2} height={h / 2 - 1} fill={color} stroke={dark} strokeWidth={1} />
        {studs}
      </>
    );
  } else if (part.shape === "tree") {
    // brown trunk + simple tree silhouette
    shape = (
      <>
        <rect x={1} y={1} width={w - 2} height={h - 2} rx={3} fill={color} stroke={dark} strokeWidth={1.5} />
        <rect x={w * 0.25} y={1} width={w * 0.5} height={h * 0.3} fill={lighten(color, 30)} opacity={0.4} rx={2} />
        {studs}
      </>
    );
  } else if (part.shape === "gear") {
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 2;
    const teeth = part.id === "gear-8t" ? 8 : 24;
    const teethPoints: string[] = [];
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const ai = ((i + 0.5) / teeth) * Math.PI * 2;
      teethPoints.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
      teethPoints.push(`${cx + Math.cos(ai) * (r + 3)},${cy + Math.sin(ai) * (r + 3)}`);
    }
    shape = (
      <>
        <polygon points={teethPoints.join(" ")} fill={color} stroke={dark} strokeWidth={1} />
        <circle cx={cx} cy={cy} r={r * 0.5} fill={dark} />
        <circle cx={cx} cy={cy} r={r * 0.25} fill={color} />
      </>
    );
  } else if (part.shape === "pin") {
    shape = (
      <>
        <rect x={1} y={h * 0.3} width={w - 2} height={h * 0.4} rx={h * 0.2} fill={color} stroke={dark} strokeWidth={1.5} />
        <circle cx={cellPx / 2} cy={h / 2} r={h * 0.28} fill={light} />
        <circle cx={w - cellPx / 2} cy={h / 2} r={h * 0.28} fill={light} />
      </>
    );
  } else if (part.shape === "beam") {
    shape = (
      <>
        <rect x={1} y={h * 0.25} width={w - 2} height={h * 0.5} rx={2} fill={color} stroke={dark} strokeWidth={1.2} />
        {Array.from({ length: part.w }).map((_, i) => (
          <circle key={i} cx={i * cellPx + cellPx / 2} cy={h / 2} r={cellPx * 0.22} fill={dark} stroke={darken(color, 60)} strokeWidth={0.8} />
        ))}
        <rect x={2} y={h * 0.27} width={w - 4} height={h * 0.2} fill={light} opacity={0.3} rx={2} />
      </>
    );
  } else {
    // default rect
    shape = (
      <>
        <rect x={1} y={1} width={w - 2} height={h - 2} rx={2} fill={color} stroke={dark} strokeWidth={1.5} />
        {/* highlight */}
        <rect x={3} y={3} width={w - 6} height={(h - 6) * 0.35} rx={1} fill={light} opacity={0.35} />
        {/* bottom shadow */}
        <rect x={3} y={h - 4} width={w - 6} height={2} rx={1} fill={dark} opacity={0.25} />
        {studs}
      </>
    );
  }

  return (
    <svg
      width={w}
      height={h}
      style={{
        display: "block",
        filter: selected ? "drop-shadow(0 0 6px rgba(99,179,237,0.9))" : "drop-shadow(1px 2px 3px rgba(0,0,0,0.3))",
        outline: selected ? "2px solid #63B3ED" : "none",
        borderRadius: 3,
      }}
    >
      {shape}
    </svg>
  );
}

// ─── Part Card (sidebar) ──────────────────────────────────────────────────────
function PartCard({ part, selected, onSelect }: { part: LegoPart; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      title={part.name}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all cursor-pointer text-center hover:scale-105 active:scale-95 ${
        selected
          ? "border-lego-blue bg-lego-blue/10 shadow-md"
          : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
      }`}
    >
      <div className="w-10 h-10 flex items-center justify-center text-2xl leading-none">
        <BrickSVG
          part={part}
          color={part.defaultColor}
          cellPx={Math.min(20, Math.floor(40 / Math.max(part.w, part.h)))}
          selected={false}
        />
      </div>
      <span className="text-[10px] font-bold leading-tight text-zinc-600 dark:text-zinc-300 line-clamp-2">{part.name}</span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LegoDesigner() {
  const [placed, setPlaced] = useState<PlacedBrick[]>([]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [activePart, setActivePart] = useState<LegoPart>(PARTS[3]); // 2×4 default
  const [activeColor, setActiveColor] = useState(LEGO_COLORS[0].hex);
  const [category, setCategory] = useState<CategoryFilter>("Tümü");
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(1);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [showColors, setShowColors] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Derived
  const filteredParts = PARTS.filter((p) => {
    const catOk = category === "Tümü" || p.category === category;
    const searchOk = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    return catOk && searchOk;
  });

  // Selected brick
  const selectedBrick = placed.find((b) => b.uid === selectedUid) ?? null;
  const selectedPart = selectedBrick ? PARTS.find((p) => p.id === selectedBrick.partId) : null;

  // Compute top layer at a cell (for stacking)
  const topLayerAt = useCallback(
    (x: number, y: number, partW: number, partH: number) => {
      let max = 0;
      for (const b of placed) {
        const bp = PARTS.find((p) => p.id === b.partId);
        if (!bp) continue;
        const bW = b.rotation % 180 === 0 ? bp.w : bp.h;
        const bH = b.rotation % 180 === 0 ? bp.h : bp.w;
        // Check overlap
        if (b.x < x + partW && b.x + bW > x && b.y < y + partH && b.y + bH > y) {
          max = Math.max(max, b.layer + 1);
        }
      }
      return max;
    },
    [placed]
  );

  // Place brick on grid click
  const handleGridClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / zoom;
      const py = (e.clientY - rect.top) / zoom;
      const col = Math.floor(px / CELL_PX);
      const row = Math.floor(py / CELL_PX);
      if (col < 0 || row < 0 || col >= GRID_COLS || row >= GRID_ROWS) return;

      const partW = activePart.w;
      const partH = activePart.h;
      const x = Math.min(col, GRID_COLS - partW);
      const y = Math.min(row, GRID_ROWS - partH);
      const layer = topLayerAt(x, y, partW, partH);

      const newBrick: PlacedBrick = {
        uid: uid(),
        partId: activePart.id,
        x,
        y,
        layer,
        color: activeColor,
        rotation: 0,
      };
      setPlaced((prev) => [...prev, newBrick]);
      setSelectedUid(newBrick.uid);
    },
    [activePart, activeColor, topLayerAt, zoom]
  );

  const deleteSelected = () => {
    setPlaced((prev) => prev.filter((b) => b.uid !== selectedUid));
    setSelectedUid(null);
  };

  const rotateSelected = () => {
    setPlaced((prev) =>
      prev.map((b) => (b.uid === selectedUid ? { ...b, rotation: (b.rotation + 90) % 360 } : b))
    );
  };

  const changeSelectedColor = (hex: string) => {
    setPlaced((prev) => prev.map((b) => (b.uid === selectedUid ? { ...b, color: hex } : b)));
  };

  const clearAll = () => {
    setPlaced([]);
    setSelectedUid(null);
  };

  const saveDesign = () => {
    try {
      const key = "lego_designer_saves";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push({ id: Date.now(), placed, timestamp: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
      setSavedMsg("✅ Tasarım kaydedildi!");
    } catch {
      setSavedMsg("❌ Kaydetme hatası");
    }
    setTimeout(() => setSavedMsg(null), 2500);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") deleteSelected();
      if (e.key === "r" || e.key === "R") rotateSelected();
      if (e.key === "Escape") setSelectedUid(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // Sort placed by layer then y then x for correct rendering
  const sortedPlaced = [...placed].sort((a, b) => a.layer - b.layer || a.y - b.y || a.x - b.x);

  return (
    <div className="flex flex-col h-full min-h-[700px] gap-0">
      {/* ── Header Bar ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-lego-red rounded-xl flex items-center justify-center text-white shadow-lg">
            🧱
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">LEGO Tasarımcı</h2>
            <p className="text-xs text-zinc-500 font-medium">
              {placed.length} parça yerleştirildi · Tıkla yerleştir · R döndür · Del sil
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            title="Uzaklaştır"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-sm font-bold text-zinc-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            title="Yakınlaştır"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={saveDesign}
            className="flex items-center gap-2 px-4 py-2 bg-lego-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            <Save size={16} /> Kaydet
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-lego-red font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Trash2 size={16} /> Temizle
          </button>
        </div>
      </div>

      {/* ── Save message toast ── */}
      <AnimatePresence>
        {savedMsg && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-6 py-3 rounded-full font-bold shadow-xl"
          >
            {savedMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT PANEL: Part Library ── */}
        <div className="w-64 flex-shrink-0 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Parça ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-lego-blue transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-200 dark:border-zinc-800">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  category === cat
                    ? "bg-lego-red text-white shadow"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {CATEGORY_ICONS[cat]}
                {cat}
              </button>
            ))}
          </div>

          {/* Part count */}
          <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            {filteredParts.length} parça
          </div>

          {/* Parts Grid */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-3 gap-1.5">
              {filteredParts.map((part) => (
                <PartCard
                  key={part.id}
                  part={part}
                  selected={activePart.id === part.id}
                  onSelect={() => setActivePart(part)}
                />
              ))}
              {filteredParts.length === 0 && (
                <div className="col-span-3 text-center py-10 text-zinc-400">
                  <Search size={24} className="mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-medium">Parça bulunamadı</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Part Info */}
          {activePart && (
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-sm"
                  style={{ backgroundColor: activeColor + "33", border: `2px solid ${activeColor}` }}
                >
                  {activePart.icon}
                </div>
                <div>
                  <p className="text-xs font-black">{activePart.name}</p>
                  <p className="text-[10px] text-zinc-400">{activePart.w}×{activePart.h} · {activePart.category}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── CENTER: Workspace ── */}
        <div className="flex-1 overflow-auto bg-zinc-300 dark:bg-zinc-800 relative" id="lego-workspace">
          {/* LEGO Baseplate */}
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: GRID_COLS * CELL_PX,
              height: GRID_ROWS * CELL_PX,
              position: "relative",
              cursor: "crosshair",
            }}
            ref={gridRef}
            onClick={handleGridClick}
          >
            {/* Baseplate background */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#2B7A3D",
                backgroundImage: `
                  radial-gradient(circle at ${CELL_PX / 2}px ${CELL_PX / 2}px, rgba(255,255,255,0.18) 30%, transparent 32%),
                  linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)
                `,
                backgroundSize: `${CELL_PX}px ${CELL_PX}px`,
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.25)",
              }}
            />

            {/* Stud dots overlay */}
            <svg
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
              width={GRID_COLS * CELL_PX}
              height={GRID_ROWS * CELL_PX}
            >
              {Array.from({ length: GRID_ROWS }).map((_, row) =>
                Array.from({ length: GRID_COLS }).map((_, col) => (
                  <g key={`${row}-${col}`}>
                    <ellipse
                      cx={col * CELL_PX + CELL_PX / 2}
                      cy={row * CELL_PX + CELL_PX / 2}
                      rx={CELL_PX * 0.28}
                      ry={CELL_PX * 0.17}
                      fill="rgba(255,255,255,0.22)"
                    />
                    <ellipse
                      cx={col * CELL_PX + CELL_PX / 2 - 1}
                      cy={row * CELL_PX + CELL_PX / 2 - 1}
                      rx={CELL_PX * 0.15}
                      ry={CELL_PX * 0.09}
                      fill="rgba(255,255,255,0.35)"
                    />
                  </g>
                ))
              )}
            </svg>

            {/* Placed bricks */}
            {sortedPlaced.map((brick) => {
              const part = PARTS.find((p) => p.id === brick.partId);
              if (!part) return null;
              const isRotated = brick.rotation === 90 || brick.rotation === 270;
              const dispW = isRotated ? part.h : part.w;
              const dispH = isRotated ? part.w : part.h;
              const elevPx = brick.layer * 3;
              return (
                <div
                  key={brick.uid}
                  style={{
                    position: "absolute",
                    left: brick.x * CELL_PX,
                    top: brick.y * CELL_PX - elevPx,
                    width: dispW * CELL_PX,
                    height: dispH * CELL_PX,
                    zIndex: brick.layer * 10 + (selectedUid === brick.uid ? 999 : 0),
                    transform: `rotate(${brick.rotation}deg)`,
                    transformOrigin: "center center",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUid(brick.uid === selectedUid ? null : brick.uid);
                  }}
                >
                  <BrickSVG
                    part={{ ...part, w: dispW, h: dispH }}
                    color={brick.color}
                    cellPx={CELL_PX}
                    selected={selectedUid === brick.uid}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL: Properties ── */}
        <div className="w-56 flex-shrink-0 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-1.5">
              <Palette size={12} /> Renk Seçici
            </h3>
            <div className="grid grid-cols-4 gap-1.5">
              {LEGO_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    setActiveColor(c.hex);
                    if (selectedUid) changeSelectedColor(c.hex);
                  }}
                  title={c.name}
                  className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 shadow-sm ${
                    activeColor === c.hex ? "border-zinc-800 dark:border-white scale-110 shadow-md" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md border border-zinc-200 shadow-sm" style={{ backgroundColor: activeColor }} />
              <span className="text-xs font-mono text-zinc-500">{activeColor}</span>
            </div>
          </div>

          {/* Selected brick controls */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-1.5">
              <Wrench size={12} /> Araçlar
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={rotateSelected}
                disabled={!selectedUid}
                className="flex items-center gap-2 w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <RotateCw size={15} /> Döndür (R)
              </button>
              <button
                onClick={deleteSelected}
                disabled={!selectedUid}
                className="flex items-center gap-2 w-full px-3 py-2 bg-red-50 dark:bg-red-900/20 text-lego-red rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 size={15} /> Sil (Del)
              </button>
            </div>
          </div>

          {/* Selection info */}
          <div className="p-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-1.5">
              <Layers size={12} /> Seçili Parça
            </h3>
            {selectedBrick && selectedPart ? (
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg shadow-sm flex-shrink-0"
                    style={{ backgroundColor: selectedBrick.color, border: `2px solid ${darken(selectedBrick.color, 30)}` }}
                  />
                  <div>
                    <p className="text-xs font-bold leading-tight">{selectedPart.name}</p>
                    <p className="text-[10px] text-zinc-400">{selectedPart.category}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] font-bold text-zinc-500">
                  <span>Konum: {selectedBrick.x},{selectedBrick.y}</span>
                  <span>Katman: {selectedBrick.layer}</span>
                  <span>Döndürme: {selectedBrick.rotation}°</span>
                  <span>Boyut: {selectedPart.w}×{selectedPart.h}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-zinc-400 py-4">
                <div className="text-3xl mb-1">👆</div>
                <p className="text-[11px]">Düzenlemek için bir parçaya tıkla</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
              <Grid3X3 size={12} /> İstatistikler
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-2 text-center">
                <p className="text-lg font-black text-lego-red">{placed.length}</p>
                <p className="text-[10px] text-zinc-500 font-bold">Parça</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-2 text-center">
                <p className="text-lg font-black text-lego-blue">
                  {Math.max(0, ...placed.map((b) => b.layer)) + (placed.length ? 1 : 0)}
                </p>
                <p className="text-[10px] text-zinc-500 font-bold">Katman</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyboard shortcuts hint ── */}
      <div className="px-6 py-2 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-6 text-[11px] text-zinc-500 font-medium">
        <span>💡 <strong>Tıkla</strong>: Parça ekle</span>
        <span>· <strong>R</strong>: Döndür</span>
        <span>· <strong>Del</strong>: Sil</span>
        <span>· <strong>Esc</strong>: Seçimi kaldır</span>
        <span>· <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">Kaydır</kbd>: Zemin gez</span>
      </div>
    </div>
  );
}
