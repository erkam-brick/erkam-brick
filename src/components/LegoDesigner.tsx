"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trash2, RotateCw, Save, ZoomIn, ZoomOut, Minus, Plus,
  Move, MousePointer
} from "lucide-react";

/* ──────────────────────────────────────────────
   PART TYPES  – her tip sadece 1 tane
   Kullanıcı boyutu sonradan ayarlar
────────────────────────────────────────────── */
type PartDef = {
  id: string;
  name: string;
  icon: string;
  category: string;
  defaultW: number;  // stud cinsinden genişlik
  defaultH: number;  // stud cinsinden yükseklik (derinlik, üstten bakış)
  minW: number; maxW: number;
  minH: number; maxH: number;
  shape: "brick" | "plate" | "tile" | "slope" | "beam" | "gear" | "cylinder" | "cone" | "window" | "door" | "tree" | "leaf" | "rock" | "grass" | "arch" | "wedge";
  color: string;
};

const PART_DEFS: PartDef[] = [
  // ── Tuğla & Plaka ──
  { id: "brick",    name: "Tuğla",         icon: "🧱", category: "Temel",   defaultW: 2, defaultH: 2, minW:1, maxW:16, minH:1, maxH:16, shape:"brick",    color:"#CC0000" },
  { id: "plate",    name: "Plaka",          icon: "▬",  category: "Temel",   defaultW: 2, defaultH: 2, minW:1, maxW:16, minH:1, maxH:16, shape:"plate",    color:"#006CB7" },
  { id: "tile",     name: "Karo (Düz)",     icon: "◻",  category: "Temel",   defaultW: 2, defaultH: 2, minW:1, maxW:16, minH:1, maxH:16, shape:"tile",     color:"#F5CD2F" },
  { id: "slope",    name: "Eğim",           icon: "◤",  category: "Temel",   defaultW: 2, defaultH: 2, minW:1, maxW:8,  minH:1, maxH:8,  shape:"slope",    color:"#595D60" },
  { id: "wedge",    name: "Kama",           icon: "◢",  category: "Temel",   defaultW: 2, defaultH: 2, minW:1, maxW:8,  minH:1, maxH:8,  shape:"wedge",    color:"#AFB5C7" },
  // ── Yuvarlak ──
  { id: "cylinder", name: "Silindir",       icon: "⬤",  category: "Yuvarlak",defaultW: 2, defaultH: 2, minW:1, maxW:8,  minH:1, maxH:8,  shape:"cylinder", color:"#9C4DC1" },
  { id: "cone",     name: "Koni",           icon: "▲",  category: "Yuvarlak",defaultW: 2, defaultH: 2, minW:1, maxW:8,  minH:1, maxH:8,  shape:"cone",     color:"#CC0000" },
  // ── Yapı Elemanları ──
  { id: "arch",     name: "Kemer",          icon: "🌉", category: "Yapı",    defaultW: 4, defaultH: 2, minW:2, maxW:12, minH:2, maxH:8,  shape:"arch",     color:"#F2E4BC" },
  { id: "window",   name: "Pencere",        icon: "🪟", category: "Yapı",    defaultW: 2, defaultH: 3, minW:2, maxW:6,  minH:2, maxH:6,  shape:"window",   color:"#73C9E7" },
  { id: "door",     name: "Kapı",           icon: "🚪", category: "Yapı",    defaultW: 2, defaultH: 4, minW:2, maxW:4,  minH:3, maxH:6,  shape:"door",     color:"#AA7D55" },
  // ── Technic ──
  { id: "beam",     name: "Kiriş",          icon: "━",  category: "Technic", defaultW: 5, defaultH: 1, minW:1, maxW:20, minH:1, maxH:3,  shape:"beam",     color:"#595D60" },
  { id: "gear",     name: "Dişli",          icon: "⚙️", category: "Technic", defaultW: 4, defaultH: 4, minW:2, maxW:10, minH:2, maxH:10, shape:"gear",     color:"#595D60" },
  // ── Doğa ──
  { id: "tree",     name: "Ağaç Gövdesi",  icon: "🪵", category: "Doğa",   defaultW: 1, defaultH: 1, minW:1, maxW:4,  minH:1, maxH:4,  shape:"tree",     color:"#5F3109" },
  { id: "leaf",     name: "Yaprak",         icon: "🌿", category: "Doğa",   defaultW: 4, defaultH: 4, minW:2, maxW:8,  minH:2, maxH:8,  shape:"leaf",     color:"#237841" },
  { id: "rock",     name: "Kaya",           icon: "🪨", category: "Doğa",   defaultW: 2, defaultH: 2, minW:1, maxW:6,  minH:1, maxH:6,  shape:"rock",     color:"#AFB5C7" },
  { id: "grass",    name: "Çim Plakası",    icon: "🌱", category: "Doğa",   defaultW: 4, defaultH: 4, minW:2, maxW:16, minH:2, maxH:16, shape:"grass",    color:"#4DBB3A" },
];

const CATEGORIES = ["Temel", "Yuvarlak", "Yapı", "Technic", "Doğa"];

/* ── Renkler ── */
const LEGO_COLORS = [
  "#CC0000","#006CB7","#F5CD2F","#237841","#4DBB3A",
  "#FE8A18","#9C4DC1","#FC97AC","#73C9E7","#0099CD",
  "#595D60","#AFB5C7","#FFFFFF","#1A1A1A","#5F3109",
  "#AA7D55","#F2E4BC","#8B0000","#D4AF37","#A8A9AD",
  "#A5CA18","#008E9B",
];

/* ── Placed brick ── */
type Brick = {
  uid: string;
  partId: string;
  x: number; y: number;   // grid position (stud units)
  w: number; h: number;   // stud units
  color: string;
  rotation: number;       // 0 | 90 | 180 | 270
  layer: number;
};

/* ── Config ── */
const CELL = 28;          // px per stud
const GRID_W = 48;
const GRID_H = 48;

/* ────── helpers ────── */
function uid() { return Math.random().toString(36).slice(2, 11); }

function darken(hex: string, amt = 40) {
  const n = parseInt(hex.replace("#",""), 16);
  return `#${[n>>16, (n>>8)&0xff, n&0xff].map(c=>Math.max(0,c-amt).toString(16).padStart(2,"0")).join("")}`;
}
function lighten(hex: string, amt = 50) {
  const n = parseInt(hex.replace("#",""), 16);
  return `#${[n>>16, (n>>8)&0xff, n&0xff].map(c=>Math.min(255,c+amt).toString(16).padStart(2,"0")).join("")}`;
}

/* ────── SVG Brick Renderer ────── */
function BrickSVG({ partId, w, h, color, selected }: {
  partId: string; w: number; h: number; color: string; selected: boolean;
}) {
  const pw = w * CELL;
  const ph = h * CELL;
  const def = PART_DEFS.find(p => p.id === partId);
  const shape = def?.shape ?? "brick";
  const dk = darken(color, 40);
  const lt = lighten(color, 55);
  const studR = CELL * 0.30;

  /* stud grid for rect shapes */
  const studs: React.ReactNode[] = [];
  if (!["tile","beam","gear","grass","rock"].includes(shape)) {
    const cols = Math.max(1, w);
    const rows = Math.max(1, h);
    for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
      const cx = c*CELL + CELL/2;
      const cy = r*CELL + CELL/2;
      studs.push(
        <g key={`${r}-${c}`}>
          <ellipse cx={cx} cy={cy} rx={studR} ry={studR*0.6} fill={lighten(color,20)} stroke={dk} strokeWidth={0.5}/>
          <ellipse cx={cx} cy={cy-studR*0.12} rx={studR*0.7} ry={studR*0.4} fill={lt} opacity={0.5}/>
        </g>
      );
    }
  }

  let body: React.ReactNode;

  if (shape === "brick" || shape === "plate" || shape === "tile") {
    const thick = shape === "plate" ? 0.65 : 1.0;
    body = <>
      <rect x={1} y={1} width={pw-2} height={ph-2} rx={3} fill={color} stroke={dk} strokeWidth={1.5}/>
      <rect x={3} y={3} width={pw-6} height={(ph-6)*0.32} rx={2} fill={lt} opacity={0.35}/>
      <rect x={3} y={ph-5} width={pw-6} height={3} rx={1} fill={dk} opacity={0.2}/>
      {shape !== "tile" && studs}
    </>;
  } else if (shape === "slope") {
    body = <>
      <polygon points={`1,${ph-1} ${pw-1},${ph-1} ${pw-1},1`} fill={color} stroke={dk} strokeWidth={1.5}/>
      <polygon points={`${pw*0.6},${ph*0.85} ${pw-3},${ph-3} ${pw-3},${ph*0.15}`} fill={lt} opacity={0.22}/>
    </>;
  } else if (shape === "wedge") {
    body = <>
      <polygon points={`1,1 ${pw-1},1 1,${ph-1}`} fill={color} stroke={dk} strokeWidth={1.5}/>
      <polygon points={`3,3 ${pw*0.5},3 3,${ph*0.5}`} fill={lt} opacity={0.22}/>
    </>;
  } else if (shape === "cylinder") {
    const rx = pw/2 - 2, ry = ph/2 - 2;
    body = <>
      <ellipse cx={pw/2} cy={ph/2} rx={rx} ry={ry} fill={color} stroke={dk} strokeWidth={1.5}/>
      <ellipse cx={pw/2} cy={ph/2 - ry*0.15} rx={rx*0.65} ry={ry*0.35} fill={lt} opacity={0.35}/>
      {studs}
    </>;
  } else if (shape === "cone") {
    body = <>
      <polygon points={`${pw/2},2 ${pw-2},${ph-2} 2,${ph-2}`} fill={color} stroke={dk} strokeWidth={1.5}/>
      <polygon points={`${pw/2},5 ${pw*0.7},${ph-5} ${pw*0.3},${ph-5}`} fill={lt} opacity={0.22}/>
    </>;
  } else if (shape === "arch") {
    const mid = pw/2;
    body = <>
      <rect x={1} y={ph*0.45} width={pw-2} height={ph*0.55-1} fill={color} stroke={dk} strokeWidth={1}/>
      <path d={`M2,${ph*0.45} A${mid-2},${ph*0.45-1} 0 0,1 ${pw-2},${ph*0.45}`} fill={color} stroke={dk} strokeWidth={1.5}/>
      <rect x={1} y={1} width={CELL*1.2} height={ph*0.45} fill={color} stroke={dk} strokeWidth={1}/>
      <rect x={pw-CELL*1.2-1} y={1} width={CELL*1.2} height={ph*0.45} fill={color} stroke={dk} strokeWidth={1}/>
      {studs}
    </>;
  } else if (shape === "window") {
    body = <>
      <rect x={1} y={1} width={pw-2} height={ph-2} rx={2} fill={color} stroke={dk} strokeWidth={1.5}/>
      <rect x={CELL*0.4} y={CELL*0.4} width={pw-CELL*0.8} height={ph-CELL*0.8} rx={2} fill="#73C9E7" opacity={0.7} stroke={dk} strokeWidth={1}/>
      <line x1={pw/2} y1={CELL*0.4} x2={pw/2} y2={ph-CELL*0.4} stroke={dk} strokeWidth={1.5}/>
      <line x1={CELL*0.4} y1={ph/2} x2={pw-CELL*0.4} y2={ph/2} stroke={dk} strokeWidth={1.5}/>
    </>;
  } else if (shape === "door") {
    const arch = ph * 0.45;
    body = <>
      <rect x={1} y={arch} width={pw-2} height={ph-arch-1} fill={color} stroke={dk} strokeWidth={1}/>
      <path d={`M2,${arch} A${pw/2-2},${arch} 0 0,1 ${pw-2},${arch}`} fill={color} stroke={dk} strokeWidth={1.5}/>
      <rect x={2} y={arch+2} width={pw-4} height={ph-arch-4} fill={darken(color,15)} opacity={0.35}/>
      <circle cx={pw-CELL*0.6} cy={(ph+arch)/2} r={3} fill={dk}/>
    </>;
  } else if (shape === "beam") {
    body = <>
      <rect x={1} y={ph*0.2} width={pw-2} height={ph*0.6} rx={3} fill={color} stroke={dk} strokeWidth={1.5}/>
      <rect x={3} y={ph*0.23} width={pw-6} height={ph*0.22} rx={2} fill={lt} opacity={0.3}/>
      {Array.from({length: w}).map((_,i) => (
        <circle key={i} cx={i*CELL + CELL/2} cy={ph/2} r={CELL*0.25} fill={dk} stroke={darken(color,60)} strokeWidth={0.8}/>
      ))}
    </>;
  } else if (shape === "gear") {
    const cx = pw/2, cy = ph/2;
    const R = Math.min(pw,ph)/2 - 3;
    const teeth = Math.max(6, Math.round(w*3));
    const pts: string[] = [];
    for (let i=0; i<teeth; i++) {
      const a0 = (i/teeth)*Math.PI*2;
      const a1 = ((i+0.5)/teeth)*Math.PI*2;
      pts.push(`${cx+Math.cos(a0)*R},${cy+Math.sin(a0)*R}`);
      pts.push(`${cx+Math.cos(a1)*(R+4)},${cy+Math.sin(a1)*(R+4)}`);
    }
    body = <>
      <polygon points={pts.join(" ")} fill={color} stroke={dk} strokeWidth={1}/>
      <circle cx={cx} cy={cy} r={R*0.45} fill={dk}/>
      <circle cx={cx} cy={cy} r={R*0.22} fill={lt}/>
    </>;
  } else if (shape === "tree") {
    body = <>
      <rect x={pw*0.25} y={1} width={pw*0.5} height={ph-2} rx={4} fill={color} stroke={dk} strokeWidth={1.5}/>
      <rect x={pw*0.3} y={3} width={pw*0.3} height={ph*0.4} rx={2} fill={lt} opacity={0.3}/>
      {studs}
    </>;
  } else if (shape === "leaf") {
    const rx = pw/2-2, ry = ph/2-2;
    body = <>
      <ellipse cx={pw/2} cy={ph/2} rx={rx} ry={ry} fill={color} stroke={dk} strokeWidth={1.5}/>
      <ellipse cx={pw/2} cy={ph/2 - ry*0.15} rx={rx*0.5} ry={ry*0.3} fill={lt} opacity={0.4}/>
      <line x1={pw/2} y1={ph*0.2} x2={pw/2} y2={ph*0.8} stroke={dk} strokeWidth={1} opacity={0.4}/>
    </>;
  } else if (shape === "rock") {
    const pts = `${pw*0.15},${ph*0.8} ${pw*0.05},${ph*0.45} ${pw*0.25},${ph*0.1} ${pw*0.6},${ph*0.05} ${pw*0.92},${ph*0.35} ${pw*0.88},${ph*0.75} ${pw*0.55},${ph*0.95}`;
    body = <>
      <polygon points={pts} fill={color} stroke={dk} strokeWidth={1.5}/>
      <polygon points={`${pw*0.25},${ph*0.18} ${pw*0.55},${ph*0.08} ${pw*0.75},${ph*0.25} ${pw*0.4},${ph*0.35}`} fill={lt} opacity={0.25}/>
    </>;
  } else if (shape === "grass") {
    body = <>
      <rect x={1} y={1} width={pw-2} height={ph-2} rx={2} fill={color} stroke={dk} strokeWidth={1.5}/>
      {Array.from({length: Math.floor(w*h/2)}).map((_,i)=> {
        const gx = (i % w) * CELL + CELL*0.3 + Math.random()*CELL*0.4;
        const gy = Math.floor(i/w)*CELL + CELL*0.2;
        return <line key={i} x1={gx} y1={gy+CELL*0.5} x2={gx} y2={gy} stroke={darken(color,20)} strokeWidth={1.5}/>;
      })}
    </>;
  } else {
    body = <rect x={1} y={1} width={pw-2} height={ph-2} rx={3} fill={color} stroke={dk} strokeWidth={1.5}/>;
  }

  return (
    <svg width={pw} height={ph} style={{display:"block", overflow:"visible",
      filter: selected
        ? "drop-shadow(0 0 8px rgba(59,130,246,0.9)) drop-shadow(0 0 3px #3b82f6)"
        : "drop-shadow(1px 2px 4px rgba(0,0,0,0.35))"
    }}>
      {body}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
export default function LegoDesigner() {
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [selectedId, setSelectedId] = useState<string|null>(null);
  const [activeDef, setActiveDef] = useState<PartDef>(PART_DEFS[0]);
  const [activeColor, setActiveColor] = useState("#CC0000");
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState<"place"|"move">("place");
  const [savedMsg, setSavedMsg] = useState<string|null>(null);
  const [catFilter, setCatFilter] = useState<string>("Temel");

  // Ghost preview while hovering in place mode
  const [ghost, setGhost] = useState<{x:number,y:number}|null>(null);

  // Dragging state
  const dragRef = useRef<{uid:string, startMouseX:number, startMouseY:number, startBrickX:number, startBrickY:number}|null>(null);

  const workspaceRef = useRef<HTMLDivElement>(null);

  const selectedBrick = bricks.find(b=>b.uid===selectedId) ?? null;
  const selectedDef = selectedBrick ? PART_DEFS.find(p=>p.id===selectedBrick.partId) : null;

  /* ── layer helper ── */
  const getLayer = useCallback((x:number,y:number,w:number,h:number, excludeUid?:string) => {
    let max = 0;
    for (const b of bricks) {
      if (b.uid===excludeUid) continue;
      const bW = b.rotation%180===0 ? b.w : b.h;
      const bH = b.rotation%180===0 ? b.h : b.w;
      if (b.x < x+w && b.x+bW > x && b.y < y+h && b.y+bH > y)
        max = Math.max(max, b.layer+1);
    }
    return max;
  }, [bricks]);

  /* ── client pos → grid cell ── */
  const clientToCell = useCallback((clientX:number, clientY:number) => {
    if (!workspaceRef.current) return null;
    const rect = workspaceRef.current.getBoundingClientRect();
    const px = (clientX - rect.left) / zoom;
    const py = (clientY - rect.top) / zoom;
    return {
      x: Math.max(0, Math.min(GRID_W-1, Math.floor(px/CELL))),
      y: Math.max(0, Math.min(GRID_H-1, Math.floor(py/CELL)))
    };
  },[zoom]);

  /* ── Place brick ── */
  const placeBrick = useCallback((clientX:number, clientY:number) => {
    const cell = clientToCell(clientX, clientY);
    if (!cell) return;
    const w = activeDef.defaultW;
    const h = activeDef.defaultH;
    const x = Math.min(cell.x, GRID_W-w);
    const y = Math.min(cell.y, GRID_H-h);
    const layer = getLayer(x,y,w,h);
    const b: Brick = { uid:uid(), partId:activeDef.id, x, y, w, h, color:activeColor, rotation:0, layer };
    setBricks(prev=>[...prev, b]);
    setSelectedId(b.uid);
  },[activeDef, activeColor, clientToCell, getLayer]);

  /* ── Workspace mouse events ── */
  const onWorkspaceMouseMove = useCallback((e:React.MouseEvent) => {
    if (tool==="place") {
      const cell = clientToCell(e.clientX, e.clientY);
      if (cell) setGhost(cell);
    }
    if (tool==="move" && dragRef.current) {
      const dx = e.clientX - dragRef.current.startMouseX;
      const dy = e.clientY - dragRef.current.startMouseY;
      const dcx = Math.round(dx/CELL/zoom);
      const dcy = Math.round(dy/CELL/zoom);
      const newX = Math.max(0, Math.min(GRID_W-1, dragRef.current.startBrickX + dcx));
      const newY = Math.max(0, Math.min(GRID_H-1, dragRef.current.startBrickY + dcy));
      setBricks(prev=>prev.map(b=>b.uid===dragRef.current!.uid ? {...b, x:newX, y:newY} : b));
    }
  },[tool, clientToCell, zoom]);

  const onWorkspaceMouseLeave = () => setGhost(null);

  const onWorkspaceClick = useCallback((e:React.MouseEvent) => {
    if (tool==="place" && !dragRef.current) {
      placeBrick(e.clientX, e.clientY);
    } else if (tool==="move") {
      setSelectedId(null);
    }
  },[tool, placeBrick]);

  const onWorkspaceMouseUp = useCallback(() => {
    dragRef.current = null;
  },[]);

  const onBrickMouseDown = useCallback((e:React.MouseEvent, b:Brick) => {
    e.stopPropagation();
    setSelectedId(b.uid);
    if (tool==="move") {
      dragRef.current = { uid:b.uid, startMouseX:e.clientX, startMouseY:e.clientY, startBrickX:b.x, startBrickY:b.y };
    }
  },[tool]);

  /* ── Selected brick operations ── */
  const deleteSelected = () => {
    setBricks(prev=>prev.filter(b=>b.uid!==selectedId));
    setSelectedId(null);
  };
  const rotateSelected = () => {
    setBricks(prev=>prev.map(b=>b.uid===selectedId ? {...b, rotation:(b.rotation+90)%360, w:b.h, h:b.w} : b));
  };
  const changeW = (delta:number) => {
    if (!selectedBrick || !selectedDef) return;
    const nw = Math.max(selectedDef.minW, Math.min(selectedDef.maxW, selectedBrick.w+delta));
    setBricks(prev=>prev.map(b=>b.uid===selectedId ? {...b, w:nw} : b));
  };
  const changeH = (delta:number) => {
    if (!selectedBrick || !selectedDef) return;
    const nh = Math.max(selectedDef.minH, Math.min(selectedDef.maxH, selectedBrick.h+delta));
    setBricks(prev=>prev.map(b=>b.uid===selectedId ? {...b, h:nh} : b));
  };
  const changeColor = (hex:string) => {
    setActiveColor(hex);
    if (selectedId) setBricks(prev=>prev.map(b=>b.uid===selectedId ? {...b, color:hex} : b));
  };

  const saveDesign = () => {
    try {
      const saves = JSON.parse(localStorage.getItem("lego_designer_v2")||"[]");
      saves.push({id:Date.now(), bricks, ts:new Date().toISOString()});
      localStorage.setItem("lego_designer_v2", JSON.stringify(saves));
      setSavedMsg("✅ Kaydedildi!");
    } catch { setSavedMsg("❌ Hata"); }
    setTimeout(()=>setSavedMsg(null), 2000);
  };

  /* ── Keyboard shortcuts ── */
  useEffect(()=>{
    const fn = (e:KeyboardEvent) => {
      if (["INPUT","TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key==="Delete"||e.key==="Backspace") deleteSelected();
      if (e.key==="r"||e.key==="R") rotateSelected();
      if (e.key==="Escape") setSelectedId(null);
      if (e.key==="p"||e.key==="P") setTool("place");
      if (e.key==="m"||e.key==="M") setTool("move");
    };
    window.addEventListener("keydown", fn);
    return ()=>window.removeEventListener("keydown", fn);
  });

  const filteredDefs = PART_DEFS.filter(p=>p.category===catFilter);
  const sorted = [...bricks].sort((a,b)=>a.layer-b.layer);

  // Ghost display W/H (may be rotated)
  const ghostW = activeDef.defaultW;
  const ghostH = activeDef.defaultH;

  return (
    <div className="flex flex-col bg-zinc-900 text-white" style={{height:"calc(100vh - 80px)", minHeight:600}}>

      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between px-5 py-3 bg-zinc-950 border-b border-zinc-800 gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧱</span>
          <div>
            <h2 className="font-black text-lg leading-none">LEGO Tasarımcı</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">{bricks.length} parça · P: yerleştir · M: taşı · R: döndür · Del: sil</p>
          </div>
        </div>

        {/* Tool selector */}
        <div className="flex bg-zinc-800 p-1 rounded-xl gap-1">
          <button onClick={()=>setTool("place")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tool==="place" ? "bg-lego-red text-white shadow" : "text-zinc-400 hover:text-white"}`}>
            <MousePointer size={15}/> Yerleştir
          </button>
          <button onClick={()=>setTool("move")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tool==="move" ? "bg-blue-600 text-white shadow" : "text-zinc-400 hover:text-white"}`}>
            <Move size={15}/> Taşı
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-2">
          <button onClick={()=>setZoom(z=>Math.max(0.4,z-0.2))} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"><ZoomOut size={16}/></button>
          <span className="text-sm font-mono w-10 text-center text-zinc-300">{Math.round(zoom*100)}%</span>
          <button onClick={()=>setZoom(z=>Math.min(2.5,z+0.2))} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"><ZoomIn size={16}/></button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {savedMsg && <span className="text-sm font-bold px-3 py-2 bg-zinc-800 rounded-lg">{savedMsg}</span>}
          <button onClick={saveDesign} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors">
            <Save size={15}/> Kaydet
          </button>
          <button onClick={()=>{setBricks([]);setSelectedId(null);}} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-red-900/50 text-red-400 font-bold rounded-xl text-sm transition-colors">
            <Trash2 size={15}/> Temizle
          </button>
        </div>
      </div>

      {/* ─── Main Layout ─── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ══ LEFT: Part Library ══ */}
        <div className="w-52 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col">
          {/* Category tabs */}
          <div className="flex flex-col gap-0.5 p-2 border-b border-zinc-800">
            {CATEGORIES.map(cat=>(
              <button key={cat} onClick={()=>setCatFilter(cat)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-bold transition-all ${catFilter===cat ? "bg-lego-red text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Part list */}
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {filteredDefs.map(def=>(
              <button key={def.id} onClick={()=>{ setActiveDef(def); setTool("place"); }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                  activeDef.id===def.id && tool==="place"
                    ? "bg-lego-red/20 border-2 border-lego-red text-white"
                    : "border-2 border-transparent bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300"
                }`}>
                {/* Mini preview */}
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-zinc-900 rounded-lg overflow-hidden">
                  <BrickSVG
                    partId={def.id}
                    w={Math.min(def.defaultW,2)}
                    h={Math.min(def.defaultH,2)}
                    color={def.color}
                    selected={false}
                  />
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">{def.name}</div>
                  <div className="text-[10px] text-zinc-500">{def.defaultW}×{def.defaultH} stud</div>
                </div>
              </button>
            ))}
          </div>

          {/* Active part info */}
          {tool==="place" && (
            <div className="p-3 border-t border-zinc-800 bg-zinc-900">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Yerleştirilecek</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg" style={{backgroundColor:activeColor, border:`2px solid ${darken(activeColor,30)}`}}/>
                <div>
                  <div className="text-xs font-bold">{activeDef.name}</div>
                  <div className="text-[10px] text-zinc-400">{activeDef.defaultW}×{activeDef.defaultH}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══ CENTER: Workspace ══ */}
        <div className="flex-1 overflow-auto bg-zinc-700 relative"
          style={{cursor: tool==="place" ? "crosshair" : "default"}}>
          <div
            ref={workspaceRef}
            style={{
              width: GRID_W*CELL,
              height: GRID_H*CELL,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              position: "relative",
              flexShrink: 0,
            }}
            onClick={onWorkspaceClick}
            onMouseMove={onWorkspaceMouseMove}
            onMouseLeave={onWorkspaceMouseLeave}
            onMouseUp={onWorkspaceMouseUp}
          >
            {/* ── Baseplate ── */}
            <div style={{
              position:"absolute", inset:0,
              backgroundColor:"#2B6E3A",
              backgroundImage:`
                radial-gradient(circle at ${CELL*0.5}px ${CELL*0.5}px, rgba(255,255,255,0.20) 28%, transparent 30%),
                linear-gradient(rgba(0,0,0,0.10) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.10) 1px, transparent 1px)
              `,
              backgroundSize:`${CELL}px ${CELL}px`,
              boxShadow:"inset 0 0 60px rgba(0,0,0,0.4)",
            }}/>

            {/* ── Grid lines (coordinates every 8) ── */}
            <svg style={{position:"absolute",inset:0,pointerEvents:"none"}} width={GRID_W*CELL} height={GRID_H*CELL}>
              {Array.from({length:Math.floor(GRID_W/8)+1}).map((_,i)=>(
                <g key={i}>
                  <line x1={i*8*CELL} y1={0} x2={i*8*CELL} y2={GRID_H*CELL} stroke="rgba(255,255,255,0.12)" strokeWidth={1}/>
                  <text x={i*8*CELL+3} y={12} fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace">{i*8}</text>
                </g>
              ))}
              {Array.from({length:Math.floor(GRID_H/8)+1}).map((_,i)=>(
                <g key={i}>
                  <line x1={0} y1={i*8*CELL} x2={GRID_W*CELL} y2={i*8*CELL} stroke="rgba(255,255,255,0.12)" strokeWidth={1}/>
                  {i>0 && <text x={3} y={i*8*CELL+11} fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace">{i*8}</text>}
                </g>
              ))}
            </svg>

            {/* ── Ghost preview ── */}
            {tool==="place" && ghost && (
              <div style={{
                position:"absolute",
                left: Math.min(ghost.x, GRID_W-ghostW)*CELL,
                top: Math.min(ghost.y, GRID_H-ghostH)*CELL,
                width: ghostW*CELL, height: ghostH*CELL,
                opacity:0.5, pointerEvents:"none", zIndex:999,
              }}>
                <BrickSVG partId={activeDef.id} w={ghostW} h={ghostH} color={activeColor} selected={false}/>
              </div>
            )}

            {/* ── Placed Bricks ── */}
            {sorted.map(b=>{
              const dispW = b.rotation%180===0 ? b.w : b.h;
              const dispH = b.rotation%180===0 ? b.h : b.w;
              return (
                <div key={b.uid}
                  style={{
                    position:"absolute",
                    left: b.x*CELL, top: b.y*CELL,
                    width: dispW*CELL, height: dispH*CELL,
                    zIndex: b.layer*10 + (selectedId===b.uid ? 1000 : 0),
                    cursor: tool==="move" ? "grab" : "pointer",
                    transform: `translateY(${-b.layer*2}px)`,
                  }}
                  onMouseDown={e=>onBrickMouseDown(e,b)}
                  onClick={e=>{e.stopPropagation(); setSelectedId(b.uid);}}
                >
                  <BrickSVG
                    partId={b.partId}
                    w={dispW} h={dispH}
                    color={b.color}
                    selected={selectedId===b.uid}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ RIGHT: Properties ══ */}
        <div className="w-56 flex-shrink-0 bg-zinc-950 border-l border-zinc-800 flex flex-col overflow-y-auto">

          {/* Selected piece controls */}
          {selectedBrick && selectedDef ? (
            <>
              <div className="p-4 border-b border-zinc-800">
                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Seçili Parça</div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                    <BrickSVG partId={selectedBrick.partId} w={Math.min(selectedBrick.w,2)} h={Math.min(selectedBrick.h,2)} color={selectedBrick.color} selected={false}/>
                  </div>
                  <div>
                    <div className="text-sm font-bold">{selectedDef.name}</div>
                    <div className="text-[10px] text-zinc-400">{selectedDef.category}</div>
                  </div>
                </div>

                {/* Width control */}
                <div className="mb-3">
                  <div className="text-[10px] font-bold text-zinc-400 mb-1.5 flex justify-between">
                    <span>GENİŞLİK</span>
                    <span className="text-white font-black">{selectedBrick.w} stud</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>changeW(-1)} disabled={selectedBrick.w<=selectedDef.minW}
                      className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center disabled:opacity-30 transition-colors font-bold">
                      <Minus size={14}/>
                    </button>
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-lego-red rounded-full transition-all"
                        style={{width:`${((selectedBrick.w-selectedDef.minW)/(selectedDef.maxW-selectedDef.minW))*100}%`}}/>
                    </div>
                    <button onClick={()=>changeW(+1)} disabled={selectedBrick.w>=selectedDef.maxW}
                      className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center disabled:opacity-30 transition-colors font-bold">
                      <Plus size={14}/>
                    </button>
                  </div>
                </div>

                {/* Height control */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-zinc-400 mb-1.5 flex justify-between">
                    <span>DERİNLİK</span>
                    <span className="text-white font-black">{selectedBrick.h} stud</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>changeH(-1)} disabled={selectedBrick.h<=selectedDef.minH}
                      className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center disabled:opacity-30 transition-colors font-bold">
                      <Minus size={14}/>
                    </button>
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all"
                        style={{width:`${((selectedBrick.h-selectedDef.minH)/(selectedDef.maxH-selectedDef.minH))*100}%`}}/>
                    </div>
                    <button onClick={()=>changeH(+1)} disabled={selectedBrick.h>=selectedDef.maxH}
                      className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center disabled:opacity-30 transition-colors font-bold">
                      <Plus size={14}/>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button onClick={rotateSelected}
                    className="flex items-center gap-2 w-full px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-bold transition-colors">
                    <RotateCw size={14}/> Döndür (R)
                  </button>
                  <button onClick={deleteSelected}
                    className="flex items-center gap-2 w-full px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-xl text-sm font-bold transition-colors">
                    <Trash2 size={14}/> Sil (Del)
                  </button>
                </div>

                {/* Info */}
                <div className="mt-4 grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="bg-zinc-900 rounded-lg p-2 text-center">
                    <div className="text-zinc-500 font-bold">Konum</div>
                    <div className="font-black text-zinc-200">{selectedBrick.x},{selectedBrick.y}</div>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-2 text-center">
                    <div className="text-zinc-500 font-bold">Katman</div>
                    <div className="font-black text-zinc-200">{selectedBrick.layer}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 border-b border-zinc-800 text-center text-zinc-600">
              <div className="text-4xl mb-2 mt-4">👆</div>
              <p className="text-xs font-medium">Bir parçaya tıklayarak özelliklerini düzenle</p>
            </div>
          )}

          {/* Color Picker */}
          <div className="p-4">
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Renk</div>
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {LEGO_COLORS.map(hex=>(
                <button key={hex} onClick={()=>changeColor(hex)} title={hex}
                  className={`aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                    activeColor===hex ? "border-white scale-110 shadow-lg" : "border-transparent"
                  }`}
                  style={{backgroundColor:hex}}/>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-2">
              <div className="w-5 h-5 rounded-md flex-shrink-0" style={{backgroundColor:activeColor, border:`1px solid ${darken(activeColor,30)}`}}/>
              <span className="text-xs font-mono text-zinc-400">{activeColor.toUpperCase()}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-auto p-4 border-t border-zinc-800">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-900 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-lego-red">{bricks.length}</div>
                <div className="text-[10px] text-zinc-500 font-bold">Parça</div>
              </div>
              <div className="bg-zinc-900 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-blue-400">
                  {bricks.length ? Math.max(...bricks.map(b=>b.layer))+1 : 0}
                </div>
                <div className="text-[10px] text-zinc-500 font-bold">Katman</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
