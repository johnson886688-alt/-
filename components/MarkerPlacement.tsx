import React, { useState, useEffect } from 'react';
import { MarkerPoint } from '../types';
import { CheckCircle } from 'lucide-react';

interface Props {
  onComplete: () => void;
  isExamMode: boolean;
}

// Generating 53 points for a more realistic setup
const generate53Points = (): MarkerPoint[] => {
  const points: MarkerPoint[] = [
    // Head (5)
    { id: 'lfhd', x: 45, y: 8, label: '前左额', placed: false },
    { id: 'rfhd', x: 55, y: 8, label: '前右额', placed: false },
    { id: 'lbhd', x: 43, y: 6, label: '后左头', placed: false },
    { id: 'rbhd', x: 57, y: 6, label: '后右头', placed: false },
    { id: 'top', x: 50, y: 5, label: '头顶', placed: false },
    // Torso (Spine/Chest/Pelvis) (10)
    { id: 'c7', x: 50, y: 18, label: 'C7颈椎', placed: false },
    { id: 'clav', x: 50, y: 20, label: '锁骨', placed: false },
    { id: 'strn', x: 50, y: 28, label: '胸骨', placed: false },
    { id: 't10', x: 50, y: 35, label: 'T10脊椎', placed: false },
    { id: 'lsho', x: 38, y: 18, label: '左肩', placed: false },
    { id: 'rsho', x: 62, y: 18, label: '右肩', placed: false },
    { id: 'lasi', x: 45, y: 52, label: '左髋前', placed: false },
    { id: 'rasi', x: 55, y: 52, label: '右髋前', placed: false },
    { id: 'lpsi', x: 43, y: 54, label: '左髋后', placed: false },
    { id: 'rpsi', x: 57, y: 54, label: '右髋后', placed: false },
    // Left Arm (7)
    { id: 'lupa', x: 30, y: 28, label: '左大臂', placed: false },
    { id: 'lelb', x: 25, y: 35, label: '左肘', placed: false },
    { id: 'lfrm', x: 22, y: 42, label: '左前臂', placed: false },
    { id: 'lwri_a', x: 18, y: 48, label: '左腕A', placed: false },
    { id: 'lwri_b', x: 22, y: 48, label: '左腕B', placed: false },
    { id: 'lhand', x: 15, y: 52, label: '左手背', placed: false },
    { id: 'lfing', x: 12, y: 55, label: '左手指', placed: false },
    // Right Arm (7)
    { id: 'rupa', x: 70, y: 28, label: '右大臂', placed: false },
    { id: 'relb', x: 75, y: 35, label: '右肘', placed: false },
    { id: 'rfrm', x: 78, y: 42, label: '右前臂', placed: false },
    { id: 'rwri_a', x: 82, y: 48, label: '右腕A', placed: false },
    { id: 'rwri_b', x: 78, y: 48, label: '右腕B', placed: false },
    { id: 'rhand', x: 85, y: 52, label: '右手背', placed: false },
    { id: 'rfing', x: 88, y: 55, label: '右手指', placed: false },
    // Left Leg (12)
    { id: 'lthigh1', x: 42, y: 60, label: '左大腿上', placed: false },
    { id: 'lthigh2', x: 40, y: 65, label: '左大腿下', placed: false },
    { id: 'lknee', x: 40, y: 72, label: '左膝', placed: false },
    { id: 'ltib1', x: 40, y: 80, label: '左小腿上', placed: false },
    { id: 'ltib2', x: 38, y: 85, label: '左小腿下', placed: false },
    { id: 'lank', x: 40, y: 92, label: '左踝', placed: false },
    { id: 'lheel', x: 38, y: 94, label: '左跟', placed: false },
    { id: 'ltoe', x: 36, y: 96, label: '左尖', placed: false },
    // Right Leg (12) - Simulating mirror
    { id: 'rthigh1', x: 58, y: 60, label: '右大腿上', placed: false },
    { id: 'rthigh2', x: 60, y: 65, label: '右大腿下', placed: false },
    { id: 'rknee', x: 60, y: 72, label: '右膝', placed: false },
    { id: 'rtib1', x: 60, y: 80, label: '右小腿上', placed: false },
    { id: 'rtib2', x: 62, y: 85, label: '右小腿下', placed: false },
    { id: 'rank', x: 60, y: 92, label: '右踝', placed: false },
    { id: 'rheel', x: 62, y: 94, label: '右跟', placed: false },
    { id: 'rtoe', x: 64, y: 96, label: '右尖', placed: false },
  ];
  return points;
};

const MarkerPlacement: React.FC<Props> = ({ onComplete, isExamMode }) => {
  const [points, setPoints] = useState<MarkerPoint[]>(generate53Points());
  const [activeZone, setActiveZone] = useState<string | null>(null);
  
  const handlePointClick = (id: string) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, placed: true } : p));
  };

  const allPlaced = points.every(p => p.placed);
  const placedCount = points.filter(p => p.placed).length;

  useEffect(() => {
    if (allPlaced) {
      setTimeout(onComplete, 1500);
    }
  }, [allPlaced, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <div className="absolute top-4 bg-slate-800/90 p-4 rounded-xl backdrop-blur text-sm border border-slate-700 shadow-xl z-10">
        {allPlaced ? (
          <span className="text-green-400 font-bold flex items-center gap-2 text-lg">
            <CheckCircle size={24}/> 53点标记完成！
          </span>
        ) : (
          <div className="flex flex-col items-center">
             <span className="text-blue-300 font-bold text-lg mb-1">请点击身体部位粘贴标记点</span>
             <span className="text-slate-400 text-xs">
               进度: <span className="text-white font-mono text-lg mx-1">{placedCount}</span> / 53
             </span>
          </div>
        )}
      </div>

      <div className="relative w-[500px] h-[700px] bg-slate-900/50 rounded-3xl border border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Abstract Body Shape */}
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 absolute inset-0 pointer-events-none">
           {/* Head */}
           <circle cx="50" cy="8" r="5" fill="currentColor" className="text-slate-500" />
           {/* Torso */}
           <path d="M40 18 L60 18 L55 52 L45 52 Z" fill="currentColor" className="text-slate-500" />
           {/* Arms */}
           <path d="M38 18 L25 35 L18 48" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-500" />
           <path d="M62 18 L75 35 L82 48" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-500" />
           {/* Legs */}
           <path d="M45 52 L40 72 L40 92" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-500" />
           <path d="M55 52 L60 72 L60 92" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-500" />
        </svg>

        {points.map((point) => (
          <button
            key={point.id}
            onClick={() => handlePointClick(point.id)}
            disabled={point.placed}
            onMouseEnter={() => setActiveZone(point.label)}
            onMouseLeave={() => setActiveZone(null)}
            className={`absolute w-4 h-4 -ml-2 -mt-2 rounded-full flex items-center justify-center transition-all duration-200 z-10
              ${point.placed 
                ? 'bg-green-500 scale-100 shadow-[0_0_8px_rgba(34,197,94,0.6)]' 
                : 'bg-white/10 hover:bg-blue-500 hover:scale-150 border border-white/40'
              }`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            title={point.label}
          >
            {point.placed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </button>
        ))}

        {/* Hover Label */}
        {activeZone && !allPlaced && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-xs pointer-events-none">
            {activeZone}
          </div>
        )}
      </div>
      
      {!allPlaced && isExamMode && (
          <div className="absolute bottom-8 text-slate-500 text-xs animate-pulse">
              考核模式：请准确点击所有解剖学标记位置
          </div>
      )}
    </div>
  );
};

export default MarkerPlacement;