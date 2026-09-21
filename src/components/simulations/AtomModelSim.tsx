import React, { useState } from 'react';
import { Atom, Plus, Minus, RotateCcw, AlertCircle, ShieldCheck } from 'lucide-react';

interface ElementData {
  z: number;
  symbol: string;
  name: string;
  defaultNeutrons: number;
  category: string;
}

const ELEMENTS_MAP: Record<number, ElementData> = {
  1: { z: 1, symbol: 'H', name: 'Hydrogen', defaultNeutrons: 0, category: 'Non-metal' },
  2: { z: 2, symbol: 'He', name: 'Helium', defaultNeutrons: 2, category: 'Noble Gas' },
  3: { z: 3, symbol: 'Li', name: 'Lithium', defaultNeutrons: 4, category: 'Alkali Metal' },
  4: { z: 4, symbol: 'Be', name: 'Beryllium', defaultNeutrons: 5, category: 'Alkaline Earth' },
  5: { z: 5, symbol: 'B', name: 'Boron', defaultNeutrons: 6, category: 'Metalloid' },
  6: { z: 6, symbol: 'C', name: 'Carbon', defaultNeutrons: 6, category: 'Non-metal' },
  7: { z: 7, symbol: 'N', name: 'Nitrogen', defaultNeutrons: 7, category: 'Non-metal' },
  8: { z: 8, symbol: 'O', name: 'Oxygen', defaultNeutrons: 8, category: 'Non-metal' },
  9: { z: 9, symbol: 'F', name: 'Fluorine', defaultNeutrons: 10, category: 'Halogen' },
  10: { z: 10, symbol: 'Ne', name: 'Neon', defaultNeutrons: 10, category: 'Noble Gas' },
  11: { z: 11, symbol: 'Na', name: 'Sodium', defaultNeutrons: 12, category: 'Alkali Metal' },
  12: { z: 12, symbol: 'Mg', name: 'Magnesium', defaultNeutrons: 12, category: 'Alkaline Earth' },
  13: { z: 13, symbol: 'Al', name: 'Aluminum', defaultNeutrons: 14, category: 'Post-transition' },
  14: { z: 14, symbol: 'Si', name: 'Silicon', defaultNeutrons: 14, category: 'Metalloid' },
};

export const AtomModelSim: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [protons, setProtons] = useState<number>(6); // Carbon default
  const [neutrons, setNeutrons] = useState<number>(6);
  const [electrons, setElectrons] = useState<number>(6);

  const massNumber = protons + neutrons;
  const netCharge = protons - electrons;

  const currentElement = ELEMENTS_MAP[protons] || {
    z: protons,
    symbol: '??',
    name: 'Transuranic / Unstable',
    defaultNeutrons: protons,
    category: 'Exotic Element',
  };

  // Electron shells (K max 2, L max 8, M max 8 for first 18 elements)
  const shellK = Math.min(electrons, 2);
  const shellL = Math.min(Math.max(electrons - 2, 0), 8);
  const shellM = Math.min(Math.max(electrons - 10, 0), 8);

  const isStable = Math.abs(neutrons - protons) <= (protons <= 6 ? 1 : 2);

  const resetAtom = () => {
    setProtons(6);
    setNeutrons(6);
    setElectrons(6);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-xs uppercase tracking-wider">
              Chemistry Simulation
            </span>
            <span className="text-xs text-slate-400">Subatomic Physics</span>
          </div>
          <h3 className="text-xl font-black mt-1">Interactive Bohr Atom Model</h3>
          <p className="text-xs text-slate-300">
            Build chemical atoms by adding protons, neutrons, and electrons. Observe orbital shell filling and valence reactivity.
          </p>
        </div>

        <button
          onClick={resetAtom}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" /> Reset to Carbon
        </button>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Atom Bohr Diagram */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="0 0 400 320" className="w-full h-full max-w-md">
              <defs>
                <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
                </radialGradient>
              </defs>

              {/* Orbital Rings */}
              {/* K Shell */}
              <circle cx="200" cy="160" r="55" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="200" y="100" fill="#64748b" fontSize="8" textAnchor="middle">K Shell (Max 2)</text>

              {/* L Shell */}
              {electrons > 2 && (
                <>
                  <circle cx="200" cy="160" r="95" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="200" y="60" fill="#64748b" fontSize="8" textAnchor="middle">L Shell (Max 8)</text>
                </>
              )}

              {/* M Shell */}
              {electrons > 10 && (
                <>
                  <circle cx="200" cy="160" r="135" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="200" y="20" fill="#64748b" fontSize="8" textAnchor="middle">M Shell (Valence)</text>
                </>
              )}

              {/* Central Nucleus */}
              <circle cx="200" cy="160" r="28" fill="url(#nucleusGlow)" />
              {/* Protons & Neutrons clusters */}
              <g transform="translate(200, 160)">
                <text x="0" y="-4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {protons}p⁺ / {neutrons}n⁰
                </text>
                <text x="0" y="10" fill="#fde68a" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Nucleus
                </text>
              </g>

              {/* Electrons on K shell */}
              {Array.from({ length: shellK }).map((_, i) => {
                const angle = (i * (2 * Math.PI)) / Math.max(shellK, 1);
                const x = 200 + 55 * Math.cos(angle);
                const y = 160 + 55 * Math.sin(angle);
                return (
                  <circle key={`k-${i}`} cx={x} cy={y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                );
              })}

              {/* Electrons on L shell */}
              {Array.from({ length: shellL }).map((_, i) => {
                const angle = (i * (2 * Math.PI)) / Math.max(shellL, 1);
                const x = 200 + 95 * Math.cos(angle);
                const y = 160 + 95 * Math.sin(angle);
                return (
                  <circle key={`l-${i}`} cx={x} cy={y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                );
              })}

              {/* Electrons on M shell */}
              {Array.from({ length: shellM }).map((_, i) => {
                const angle = (i * (2 * Math.PI)) / Math.max(shellM, 1);
                const x = 200 + 135 * Math.cos(angle);
                const y = 160 + 135 * Math.sin(angle);
                return (
                  <circle key={`m-${i}`} cx={x} cy={y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                );
              })}
            </svg>

            {/* Element Periodic Card Inset */}
            <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 p-3 rounded-xl text-center min-w-[90px] shadow-lg">
              <span className="text-[10px] text-slate-400 block font-mono">Z = {protons}</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{currentElement.symbol}</span>
              <span className="text-[11px] font-bold text-white block truncate">{currentElement.name}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Mass: {massNumber}</span>
            </div>
          </div>

          {/* Atomic Identity Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium block">Atomic Number (Z)</span>
              <span className="text-lg font-black text-indigo-600">{protons}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium block">Mass Number (A)</span>
              <span className="text-lg font-black text-amber-600">{massNumber}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium block">Net Charge</span>
              <span
                className={`text-lg font-black ${
                  netCharge === 0 ? 'text-emerald-600' : netCharge > 0 ? 'text-rose-600' : 'text-blue-600'
                }`}
              >
                {netCharge > 0 ? `+${netCharge} (Cation)` : netCharge < 0 ? `${netCharge} (Anion)` : '0 (Neutral)'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium block">Nuclear Stability</span>
              <span className={`text-xs font-bold ${isStable ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isStable ? '✓ Stable Isotope' : '⚠ Radioactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Subatomic Controls Column */}
        <div className="space-y-4 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Atom className="w-4 h-4 text-teal-600" />
            Subatomic Particle Controls
          </h4>

          {/* Protons control */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-rose-700">Protons (p⁺)</span>
              <span className="text-sm font-mono font-bold text-slate-900">{protons}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setProtons((p) => Math.max(p - 1, 1))}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setProtons((p) => Math.min(p + 1, 14))}
                className="flex-1 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold text-sm flex items-center justify-center shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Neutrons control */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-700">Neutrons (n⁰)</span>
              <span className="text-sm font-mono font-bold text-slate-900">{neutrons}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNeutrons((n) => Math.max(n - 1, 0))}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setNeutrons((n) => Math.min(n + 1, 16))}
                className="flex-1 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold text-sm flex items-center justify-center shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Electrons control */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-sky-700">Electrons (e⁻)</span>
              <span className="text-sm font-mono font-bold text-slate-900">{electrons}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setElectrons((e) => Math.max(e - 1, 0))}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setElectrons((e) => Math.min(e + 1, 14))}
                className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold text-sm flex items-center justify-center shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Shell Capacity Guide */}
          <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-xs space-y-1 text-slate-700">
            <span className="font-bold text-teal-900 block">Electron Shell Filling:</span>
            <div className="flex justify-between text-[11px] font-mono text-teal-800">
              <span>K: {shellK}/2</span>
              <span>L: {shellL}/8</span>
              <span>M: {shellM}/8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
