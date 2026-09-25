import React, { useState } from 'react';
import { Activity, Flame, Shield, CheckCircle2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export const BodyMap = ({ onSelectRegion }) => {
  const [activeRegion, setActiveRegion] = useState('All');
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const regions = [
    { id: 'All', label: 'All Regions', desc: 'View Full Database' },
    { id: 'Head', label: 'Head & Brain', desc: 'Migraine, Aura, Tension' },
    { id: 'Chest', label: 'Chest & Lungs', desc: 'CAD, Asthma, Hypertension' },
    { id: 'Abdomen', label: 'Abdomen & Gut', desc: 'Gastritis, Appendicitis' },
    { id: 'Limbs', label: 'Limbs & Joints', desc: 'Osteoarthritis, Eczema' },
    { id: 'General', label: 'Systemic / Whole Body', desc: 'Diabetes, GAD, Fever' }
  ];

  const handleRegionClick = async (regionId) => {
    setActiveRegion(regionId);
    try {
      const res = await axiosClient.get(`/diseases/region/${regionId}`);
      if (res.data.success) {
        onSelectRegion(res.data.data, regionId);
      }
    } catch (e) {
      console.error('Region fetch error', e);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-8 rounded-3xl bg-slate-900/60 border border-white/10 glass-card">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Info & Selector Buttons */}
        <div className="flex-1 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>Anatomical Region Filter</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interactive Body Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Click on any body region to instantly isolate associated medical conditions, organ symptoms, and targeted treatment plans.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {regions.map((reg) => {
              const isActive = activeRegion === reg.id;
              const isHovered = hoveredRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => handleRegionClick(reg.id)}
                  onMouseEnter={() => setHoveredRegion(reg.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-white glow-cyan'
                      : isHovered
                      ? 'bg-slate-800 border-cyan-500/50 text-cyan-200'
                      : 'bg-slate-950/80 border-white/10 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold block">{reg.label}</span>
                  <span className="text-[10px] text-slate-500 mt-1 truncate">{reg.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Interactive SVG Silhouette graphic */}
        <div className="relative w-64 h-80 flex items-center justify-center bg-slate-950/90 rounded-2xl border border-cyan-500/20 p-4 glow-cyan overflow-hidden">
          
          <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-lg">
            {/* Outline Glow Effect */}
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* HEAD ZONE */}
            <g
              onClick={() => handleRegionClick('Head')}
              onMouseEnter={() => setHoveredRegion('Head')}
              onMouseLeave={() => setHoveredRegion(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <circle
                cx="100"
                cy="42"
                r="24"
                className={`transition-colors ${
                  activeRegion === 'Head' || hoveredRegion === 'Head'
                    ? 'fill-cyan-500/60 stroke-cyan-300 stroke-2'
                    : 'fill-slate-800/80 stroke-slate-600'
                }`}
              />
              <text x="100" y="46" textAnchor="middle" className="fill-white text-[10px] font-bold pointer-events-none">
                HEAD
              </text>
            </g>

            {/* CHEST ZONE */}
            <g
              onClick={() => handleRegionClick('Chest')}
              onMouseEnter={() => setHoveredRegion('Chest')}
              onMouseLeave={() => setHoveredRegion(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <path
                d="M 70,75 L 130,75 L 125,130 L 75,130 Z"
                className={`transition-colors ${
                  activeRegion === 'Chest' || hoveredRegion === 'Chest'
                    ? 'fill-cyan-500/60 stroke-cyan-300 stroke-2'
                    : 'fill-slate-800/80 stroke-slate-600'
                }`}
              />
              <text x="100" y="105" textAnchor="middle" className="fill-white text-[10px] font-bold pointer-events-none">
                CHEST
              </text>
            </g>

            {/* ABDOMEN ZONE */}
            <g
              onClick={() => handleRegionClick('Abdomen')}
              onMouseEnter={() => setHoveredRegion('Abdomen')}
              onMouseLeave={() => setHoveredRegion(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <path
                d="M 75,135 L 125,135 L 120,185 L 80,185 Z"
                className={`transition-colors ${
                  activeRegion === 'Abdomen' || hoveredRegion === 'Abdomen'
                    ? 'fill-cyan-500/60 stroke-cyan-300 stroke-2'
                    : 'fill-slate-800/80 stroke-slate-600'
                }`}
              />
              <text x="100" y="162" textAnchor="middle" className="fill-white text-[10px] font-bold pointer-events-none">
                GUT
              </text>
            </g>

            {/* LIMBS ZONE (Arms & Legs) */}
            <g
              onClick={() => handleRegionClick('Limbs')}
              onMouseEnter={() => setHoveredRegion('Limbs')}
              onMouseLeave={() => setHoveredRegion(null)}
              className="cursor-pointer transition-all duration-300"
            >
              {/* Left Arm */}
              <rect x="45" y="78" width="20" height="95" rx="8" className={`transition-colors ${
                activeRegion === 'Limbs' || hoveredRegion === 'Limbs' ? 'fill-cyan-500/60 stroke-cyan-300' : 'fill-slate-800/80 stroke-slate-600'
              }`} />
              {/* Right Arm */}
              <rect x="135" y="78" width="20" height="95" rx="8" className={`transition-colors ${
                activeRegion === 'Limbs' || hoveredRegion === 'Limbs' ? 'fill-cyan-500/60 stroke-cyan-300' : 'fill-slate-800/80 stroke-slate-600'
              }`} />
              {/* Legs */}
              <rect x="75" y="192" width="22" height="110" rx="10" className={`transition-colors ${
                activeRegion === 'Limbs' || hoveredRegion === 'Limbs' ? 'fill-cyan-500/60 stroke-cyan-300' : 'fill-slate-800/80 stroke-slate-600'
              }`} />
              <rect x="103" y="192" width="22" height="110" rx="10" className={`transition-colors ${
                activeRegion === 'Limbs' || hoveredRegion === 'Limbs' ? 'fill-cyan-500/60 stroke-cyan-300' : 'fill-slate-800/80 stroke-slate-600'
              }`} />
              <text x="100" y="250" textAnchor="middle" className="fill-white text-[10px] font-bold pointer-events-none">
                LIMBS
              </text>
            </g>
          </svg>

          {/* Glowing Target Badge */}
          <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-[11px] text-cyan-400 font-bold text-center">
            Active: {activeRegion} Region
          </div>
        </div>

      </div>
    </div>
  );
};
