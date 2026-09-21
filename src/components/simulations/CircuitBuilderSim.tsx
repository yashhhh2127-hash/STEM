import React, { useState } from 'react';
import { Zap, Power, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

export const CircuitBuilderSim: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [voltage, setVoltage] = useState<number>(9); // Volts
  const [resistance, setResistance] = useState<number>(220); // Ohms
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);
  const [ledRatedCurrentMA] = useState<number>(25); // 25mA safe limit

  // Ohm's Law: I = V / R (assuming LED forward voltage drop ~ 2.0V when forward-biased)
  const ledForwardVoltage = 2.0;
  const effectiveVoltage = isSwitchClosed && voltage > ledForwardVoltage ? voltage - ledForwardVoltage : 0;
  const currentAmperes = isSwitchClosed && resistance > 0 ? effectiveVoltage / resistance : 0;
  const currentMA = currentAmperes * 1000;

  // LED states
  const isBurnedOut = currentMA > ledRatedCurrentMA * 2.5;
  const isOverdriven = currentMA > ledRatedCurrentMA && !isBurnedOut;
  const isIlluminated = isSwitchClosed && currentMA > 1 && !isBurnedOut;
  const brightnessPercent = Math.min(Math.max((currentMA / ledRatedCurrentMA) * 100, 0), 100);

  const toggleSwitch = () => {
    setIsSwitchClosed((prev) => {
      const next = !prev;
      if (next && onComplete) {
        onComplete();
      }
      return next;
    });
  };

  const resetCircuit = () => {
    setVoltage(9);
    setResistance(220);
    setIsSwitchClosed(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
              Engineering Simulation
            </span>
            <span className="text-xs text-slate-400">Ohm’s Law & Electronics</span>
          </div>
          <h3 className="text-xl font-black mt-1">Interactive DC Circuit Builder</h3>
          <p className="text-xs text-slate-300">
            Connect a DC voltage source, variable resistor, switch, and LED to explore Ohm's Law (I = V / R).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetCircuit}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Schematic Diagram */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden p-4 flex items-center justify-center">
            {/* SVG Interactive Circuit Schematic */}
            <svg viewBox="0 0 500 300" className="w-full h-full max-w-lg">
              {/* Grid backdrop */}
              <defs>
                <pattern id="circuitGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.75" />
                </pattern>
                {/* Glow filter for LED */}
                <filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation={brightnessPercent / 8} result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="500" height="300" fill="url(#circuitGrid)" />

              {/* Main Circuit Loop Lines */}
              {/* Top wire (from battery to switch and resistor) */}
              <path
                d="M 100 80 L 180 80"
                stroke={isSwitchClosed ? '#38bdf8' : '#64748b'}
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M 240 80 L 400 80 L 400 130"
                stroke={isSwitchClosed ? '#38bdf8' : '#64748b'}
                strokeWidth="3"
                fill="none"
              />

              {/* Bottom wire (from LED back to battery ground) */}
              <path
                d="M 400 200 L 400 240 L 100 240 L 100 180"
                stroke={isSwitchClosed ? '#38bdf8' : '#64748b'}
                strokeWidth="3"
                fill="none"
              />

              {/* Animated Electron Dots when current flows */}
              {isIlluminated && !isBurnedOut && (
                <>
                  <circle cx="140" cy="80" r="3" fill="#facc15" className="animate-pulse" />
                  <circle cx="320" cy="80" r="3" fill="#facc15" className="animate-ping" />
                  <circle cx="400" cy="220" r="3" fill="#facc15" className="animate-pulse" />
                  <circle cx="250" cy="240" r="3" fill="#facc15" className="animate-pulse" />
                </>
              )}

              {/* BATTERY COMPONENT (Left) */}
              <g transform="translate(100, 130)">
                <rect x="-24" y="-30" width="48" height="60" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <text x="0" y="-12" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">
                  + {voltage}V
                </text>
                <text x="0" y="5" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">
                  DC
                </text>
                <text x="0" y="20" fill="#64748b" fontSize="8" textAnchor="middle">
                  BATTERY
                </text>
                <circle cx="0" cy="-30" r="4" fill="#3b82f6" />
                <circle cx="0" cy="30" r="4" fill="#64748b" />
              </g>

              {/* TOGGLE SWITCH (Top Left) */}
              <g
                transform="translate(180, 80)"
                onClick={toggleSwitch}
                className="cursor-pointer group"
              >
                <circle cx="0" cy="0" r="4" fill="#38bdf8" />
                <circle cx="60" cy="0" r="4" fill="#38bdf8" />
                {/* Switch arm */}
                <line
                  x1="0"
                  y1="0"
                  x2={isSwitchClosed ? 60 : 45}
                  y2={isSwitchClosed ? 0 : -25}
                  stroke={isSwitchClosed ? '#22c55e' : '#ef4444'}
                  strokeWidth="3.5"
                />
                <text x="30" y="-18" fill="#94a3b8" fontSize="9" textAnchor="middle" fontWeight="bold">
                  {isSwitchClosed ? 'SWITCH (CLOSED)' : 'SWITCH (OPEN - CLICK)'}
                </text>
              </g>

              {/* RESISTOR COMPONENT (Top Right) */}
              <g transform="translate(290, 80)">
                {/* Zigzag Resistor */}
                <path
                  d="M -30 0 L -20 0 L -15 -10 L -5 10 L 5 -10 L 15 10 L 20 0 L 30 0"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                />
                <text x="0" y="-16" fill="#fcd34d" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {resistance} Ω
                </text>
                <text x="0" y="24" fill="#94a3b8" fontSize="8" textAnchor="middle">
                  RESISTOR
                </text>
              </g>

              {/* LED COMPONENT (Right) */}
              <g transform="translate(400, 165)">
                {/* LED Circle & Triangle */}
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill={
                    isBurnedOut
                      ? '#450a0a'
                      : isIlluminated
                      ? `rgba(239, 68, 68, ${Math.max(brightnessPercent / 100, 0.2)})`
                      : '#1e293b'
                  }
                  stroke={isBurnedOut ? '#7f1d1d' : isIlluminated ? '#ef4444' : '#475569'}
                  strokeWidth="2"
                  filter={isIlluminated && !isBurnedOut ? 'url(#ledGlow)' : undefined}
                />
                {/* Diode Symbol Triangle */}
                <polygon
                  points="-10,-12 10,-12 0,10"
                  fill={isBurnedOut ? '#991b1b' : isIlluminated ? '#ffffff' : '#94a3b8'}
                />
                <line x1="-12" y1="10" x2="12" y2="10" stroke="#94a3b8" strokeWidth="2" />
                {/* Emission arrows */}
                {isIlluminated && !isBurnedOut && (
                  <>
                    <path d="M 16 -12 L 26 -20 M 20 -20 L 26 -20 L 26 -14" stroke="#fca5a5" strokeWidth="1.5" />
                    <path d="M 12 -4 L 22 -12 M 16 -12 L 22 -12 L 22 -6" stroke="#fca5a5" strokeWidth="1.5" />
                  </>
                )}
                <text x="0" y="38" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {isBurnedOut ? '💥 BURNED OUT!' : isIlluminated ? 'LED (ON)' : 'LED (OFF)'}
                </text>
              </g>

              {/* Multimeter Inset (Center) */}
              <g transform="translate(240, 180)">
                <rect x="-55" y="-25" width="110" height="50" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <text x="0" y="-8" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  DIGITAL AMMETER
                </text>
                <text x="0" y="14" fill="#a7f3d0" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  {currentMA.toFixed(1)} mA
                </text>
              </g>
            </svg>

            {/* Warning Banner inside canvas */}
            {isBurnedOut && (
              <div className="absolute top-3 left-3 bg-red-950/90 border border-red-700 text-red-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Excess Current Hazard! LED destroyed ({currentMA.toFixed(1)} mA &gt; 60mA limit). Increase resistance!</span>
              </div>
            )}
            {isOverdriven && (
              <div className="absolute top-3 left-3 bg-amber-950/90 border border-amber-700 text-amber-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Warning: Current exceeds 25mA rated threshold. LED will overheat.</span>
              </div>
            )}
          </div>

          {/* Measurements Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block font-medium">Circuit State</span>
              <span className={`text-sm font-bold ${isSwitchClosed ? 'text-emerald-600' : 'text-slate-500'}`}>
                {isSwitchClosed ? 'CLOSED (Active)' : 'OPEN (Broken)'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block font-medium">Loop Current (I)</span>
              <span className="text-lg font-black text-indigo-600 font-mono">{currentMA.toFixed(2)} mA</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block font-medium">LED Brightness</span>
              <span className="text-lg font-black text-emerald-600">{brightnessPercent.toFixed(0)}%</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block font-medium">Power Consumed (P)</span>
              <span className="text-lg font-black text-amber-600 font-mono">
                {((voltage * currentAmperes) * 1000).toFixed(1)} mW
              </span>
            </div>
          </div>
        </div>

        {/* Controls Column */}
        <div className="space-y-5 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Circuit Controls
          </h4>

          {/* Power Switch Button */}
          <div>
            <button
              onClick={toggleSwitch}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                isSwitchClosed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200'
              }`}
            >
              <Power className="w-4 h-4" />
              {isSwitchClosed ? 'Turn Switch OFF (Open Circuit)' : 'Turn Switch ON (Close Circuit)'}
            </button>
          </div>

          {/* Voltage slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Supply Voltage (V)</span>
              <span className="text-blue-600 font-bold">{voltage} V</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="24"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>1.5V (AA)</span>
              <span>9V (Block)</span>
              <span>24V (Industrial)</span>
            </div>
          </div>

          {/* Resistor slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Current-Limiting Resistor (R)</span>
              <span className="text-amber-600 font-bold">{resistance} Ω</span>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={resistance}
              onChange={(e) => setResistance(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>20Ω (Risky)</span>
              <span>220Ω (Standard)</span>
              <span>1000Ω (Dim)</span>
            </div>
          </div>

          {/* Ohm's Law Explanation Box */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1.5 text-slate-700">
            <span className="font-bold text-blue-900 block">Ohm's Law in Action:</span>
            <p className="font-mono text-[11px] text-blue-800">
              Current I = (V_supply - V_led) / R
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              If R is too small (e.g. &lt; 50Ω at 9V), current exceeds the safe 25mA threshold, destroying the LED junction!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
