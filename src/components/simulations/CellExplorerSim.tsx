import React, { useState } from 'react';
import { Microscope, Check, Sparkles, BookOpen } from 'lucide-react';

interface Organelle {
  id: string;
  name: string;
  role: string;
  functionDesc: string;
  foundIn: 'both' | 'plant' | 'animal';
  color: string;
}

const ORGANELLES: Organelle[] = [
  {
    id: 'nucleus',
    name: 'Nucleus & Nucleolus',
    role: 'Cellular Command Center & Genetic Storage',
    functionDesc: 'Contains the cell’s DNA organized into chromosomes and coordinates cellular growth, metabolism, and protein synthesis.',
    foundIn: 'both',
    color: '#8b5cf6',
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria (Powerhouse)',
    role: 'Aerobic Cellular Respiration & ATP Production',
    functionDesc: 'Extracts chemical energy from glucose molecules using oxygen to synthesize ATP, the biological energy currency of life.',
    foundIn: 'both',
    color: '#f97316',
  },
  {
    id: 'chloroplast',
    name: 'Chloroplast',
    role: 'Photosynthesis & Light Energy Conversion',
    functionDesc: 'Contains the green pigment chlorophyll to capture sunlight and convert carbon dioxide and water into glucose sugars (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂).',
    foundIn: 'plant',
    color: '#10b981',
  },
  {
    id: 'ribosome',
    name: 'Ribosomes',
    role: 'Protein Synthesis Factory',
    functionDesc: 'Translates messenger RNA (mRNA) genetic codes into polypeptide chains of amino acids to assemble structural and enzymatic proteins.',
    foundIn: 'both',
    color: '#3b82f6',
  },
  {
    id: 'membrane',
    name: 'Plasma / Cell Membrane',
    role: 'Selective Permeability & Boundary',
    functionDesc: 'A phospholipid bilayer embedded with transport proteins that strictly regulates what ions, nutrients, and waste enter or leave the cell.',
    foundIn: 'both',
    color: '#ec4899',
  },
  {
    id: 'cellwall',
    name: 'Cellulose Cell Wall',
    role: 'Rigid Structural Protection & Shape',
    functionDesc: 'A tough, fibrous outer wall made of cellulose polysaccharides that provides turgor support against hydrostatic osmotic pressure.',
    foundIn: 'plant',
    color: '#059669',
  },
  {
    id: 'vacuole',
    name: 'Central Vacuole',
    role: 'Turgor Pressure & Nutrient Storage',
    functionDesc: 'A massive fluid-filled organelle storing water, enzymes, and ions to maintain rigid cellular turgidity in plants.',
    foundIn: 'plant',
    color: '#06b6d4',
  },
  {
    id: 'golgi',
    name: 'Golgi Apparatus',
    role: 'Packaging, Sorting & Secretion',
    functionDesc: 'Receives proteins and lipids from the endoplasmic reticulum, modifies them with carbohydrates, and packages them into vesicles for cellular delivery.',
    foundIn: 'both',
    color: '#eab308',
  },
];

export const CellExplorerSim: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [cellType, setCellType] = useState<'animal' | 'plant'>('animal');
  const [selectedOrganelle, setSelectedOrganelle] = useState<Organelle>(ORGANELLES[0]);
  const [exploredOrganelles, setExploredOrganelles] = useState<string[]>(['nucleus']);

  const handleSelect = (org: Organelle) => {
    setSelectedOrganelle(org);
    if (!exploredOrganelles.includes(org.id)) {
      const updated = [...exploredOrganelles, org.id];
      setExploredOrganelles(updated);
      if (updated.length >= 5 && onComplete) {
        onComplete();
      }
    }
  };

  const isPlant = cellType === 'plant';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              Biology Simulation
            </span>
            <span className="text-xs text-slate-400">Cellular Anatomy</span>
          </div>
          <h3 className="text-xl font-black mt-1">Interactive Eukaryotic Cell Explorer</h3>
          <p className="text-xs text-slate-300">
            Compare plant and animal cells. Click organelles in the cross-section to explore biochemical functions.
          </p>
        </div>

        {/* Plant vs Animal Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700">
          <button
            onClick={() => setCellType('animal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              cellType === 'animal'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Animal Cell
          </button>
          <button
            onClick={() => setCellType('plant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              cellType === 'plant'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Plant Cell
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cell Graphic Viewport */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="0 0 500 320" className="w-full h-full max-w-lg">
              {/* Outer Cell Boundary */}
              {isPlant ? (
                // Plant Cell (Rectangular / Hexagonal with Cell Wall)
                <g>
                  <polygon
                    points="60,40 440,30 460,280 40,290"
                    fill="#064e3b"
                    stroke="#10b981"
                    strokeWidth="8"
                    onClick={() => handleSelect(ORGANELLES.find((o) => o.id === 'cellwall')!)}
                    className="cursor-pointer hover:opacity-90"
                  />
                  <polygon
                    points="70,50 430,42 448,270 52,278"
                    fill="#022c22"
                    stroke="#34d399"
                    strokeWidth="3"
                    onClick={() => handleSelect(ORGANELLES.find((o) => o.id === 'membrane')!)}
                    className="cursor-pointer hover:opacity-90"
                  />
                  {/* Plant Large Central Vacuole */}
                  <ellipse
                    cx="320"
                    cy="160"
                    rx="90"
                    ry="65"
                    fill="#0891b2"
                    fillOpacity="0.4"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    onClick={() => handleSelect(ORGANELLES.find((o) => o.id === 'vacuole')!)}
                    className="cursor-pointer hover:brightness-125"
                  />
                  <text x="320" y="165" fill="#cffafe" fontSize="10" textAnchor="middle" fontWeight="bold">
                    Central Vacuole
                  </text>
                  {/* Plant Chloroplasts */}
                  <g
                    transform="translate(130, 80)"
                    onClick={() => handleSelect(ORGANELLES.find((o) => o.id === 'chloroplast')!)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <ellipse cx="0" cy="0" rx="22" ry="14" fill="#047857" stroke="#34d399" strokeWidth="2" />
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#a7f3d0" strokeWidth="2" />
                  </g>
                  <g
                    transform="translate(120, 240)"
                    onClick={() => handleSelect(ORGANELLES.find((o) => o.id === 'chloroplast')!)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <ellipse cx="0" cy="0" rx="22" ry="14" fill="#047857" stroke="#34d399" strokeWidth="2" />
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#a7f3d0" strokeWidth="2" />
                  </g>
                </g>
              ) : (
                // Animal Cell (Irregular rounded circle)
                <g>
                  <path
                    d="M 80,160 C 70,70 180,30 260,40 C 370,50 440,110 430,200 C 420,280 320,300 220,290 C 130,280 90,230 80,160 Z"
                    fill="#1e1b4b"
                    stroke="#ec4899"
                    strokeWidth="4"
                    onClick={() => handleSelect(ORGANELLES.find((o) => o.id === 'membrane')!)}
                    className="cursor-pointer hover:opacity-90"
                  />
                </g>
              )}

              {/* NUCLEUS (Present in Both) */}
              <g
                transform={isPlant ? 'translate(190, 160)' : 'translate(220, 150)'}
                onClick={() => handleSelect(ORGANELLES.find((o) => o.id === 'nucleus')!)}
                className="cursor-pointer group hover:scale-105 transition-transform"
              >
                <circle cx="0" cy="0" r="44" fill="#5b21b6" stroke="#c084fc" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="16" fill="#3b0764" />
                <text x="0" y="4" fill="#f3e8ff" fontSize="10" textAnchor="middle" fontWeight="bold">
                  Nucleus
                </text>
              </g>

              {/* MITOCHONDRIA (Present in Both) */}
              <g
                transform={isPlant ? 'translate(100, 150)' : 'translate(120, 110)'}
                onClick={() => handleSelect(ORGANELLES.find((o) => o.id === 'mitochondria')!)}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <ellipse cx="0" cy="0" rx="26" ry="15" fill="#c2410c" stroke="#fb923c" strokeWidth="2" transform="rotate(-25)" />
                <path d="M -12 -5 Q 0 5 12 -5" fill="none" stroke="#ffedd5" strokeWidth="1.5" />
                <text x="0" y="24" fill="#fed7aa" fontSize="8" textAnchor="middle">
                  Mitochondria
                </text>
              </g>

              {/* GOLGI APPARATUS */}
              <g
                transform={isPlant ? 'translate(250, 80)' : 'translate(340, 120)'}
                onClick={() => handleSelect(ORGANELLES.find((o) => o.id === 'golgi')!)}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <path d="M -20 -8 Q 0 -2 20 -8 M -24 0 Q 0 6 24 0 M -20 8 Q 0 14 20 8" fill="none" stroke="#facc15" strokeWidth="3" />
                <text x="0" y="24" fill="#fef08a" fontSize="8" textAnchor="middle">
                  Golgi
                </text>
              </g>

              {/* RIBOSOME DOTS */}
              <g onClick={() => handleSelect(ORGANELLES.find((o) => o.id === 'ribosome')!)} className="cursor-pointer">
                <circle cx="160" cy="100" r="3" fill="#60a5fa" />
                <circle cx="175" cy="110" r="3" fill="#60a5fa" />
                <circle cx="280" cy="220" r="3" fill="#60a5fa" />
                <circle cx="295" cy="235" r="3" fill="#60a5fa" />
                <circle cx="360" cy="190" r="3" fill="#60a5fa" />
              </g>
            </svg>

            {/* Inset Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-slate-300">
              Active Mode: <strong className="text-white capitalize">{cellType} Cell</strong> (Click any organelle)
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span>Explored {exploredOrganelles.length} of {ORGANELLES.length} structures</span>
            <div className="flex gap-1">
              {ORGANELLES.map((org) => (
                <div
                  key={org.id}
                  className={`w-3 h-3 rounded-full ${
                    exploredOrganelles.includes(org.id) ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                  title={org.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Organelle Inspector Card */}
        <div className="space-y-4 bg-slate-50/70 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                Organelle Focus
              </span>
              <span className="text-[10px] text-slate-400">
                {selectedOrganelle.foundIn === 'both' ? 'Both Plants & Animals' : 'Plants Only'}
              </span>
            </div>

            <h4 className="text-lg font-black text-slate-900 leading-tight">
              {selectedOrganelle.name}
            </h4>
            <p className="text-xs font-semibold text-indigo-600 mt-0.5">
              {selectedOrganelle.role}
            </p>

            <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Biological Function:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedOrganelle.functionDesc}
              </p>
            </div>
          </div>

          {/* Quick organelle quick-select list */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">Browse All Organelles:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {ORGANELLES.map((org) => {
                const isSelected = selectedOrganelle.id === org.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => handleSelect(org)}
                    className={`text-left p-2 rounded-lg text-xs font-semibold border transition truncate ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {org.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
