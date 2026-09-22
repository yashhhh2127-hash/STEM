import React, { useState, useEffect, useRef } from 'react';
import { Award, Sparkles, Zap, Sun, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';

interface OpticsRefractionSimProps {
  onComplete?: () => void;
}

interface Medium {
  name: string;
  n: number;
  color: string;
}

const MEDIA: Record<string, Medium> = {
  air: { name: 'Air (Vacuum)', n: 1.0, color: 'rgba(255, 255, 255, 0.03)' },
  water: { name: 'Water', n: 1.333, color: 'rgba(56, 189, 248, 0.15)' },
  glass: { name: 'Crown Glass', n: 1.52, color: 'rgba(168, 85, 247, 0.20)' },
  diamond: { name: 'Dense Diamond', n: 2.42, color: 'rgba(236, 72, 153, 0.25)' },
};

export const OpticsRefractionSim: React.FC<OpticsRefractionSimProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [medium1Key, setMedium1Key] = useState<string>('air');
  const [medium2Key, setMedium2Key] = useState<string>('water');
  const [incidentAngleDeg, setIncidentAngleDeg] = useState<number>(45);
  const [laserColor, setLaserColor] = useState<string>('#ef4444'); // Red laser
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  const n1 = MEDIA[medium1Key].n;
  const n2 = MEDIA[medium2Key].n;

  // Calculate critical angle if n1 > n2
  const isTirPossible = n1 > n2;
  const criticalAngleDeg = isTirPossible ? (Math.asin(n2 / n1) * (180 / Math.PI)) : null;

  // Calculate refracted angle using Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
  const theta1Rad = (incidentAngleDeg * Math.PI) / 180;
  const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;
  const isTotalInternalReflection = sinTheta2 > 1.0;
  const theta2Deg = isTotalInternalReflection ? null : Math.asin(sinTheta2) * (180 / Math.PI);

  // Trigger complete milestone if played with variables
  useEffect(() => {
    if (!hasCompleted && (isTotalInternalReflection || (incidentAngleDeg !== 45 && medium1Key !== medium2Key))) {
      setHasCompleted(true);
      if (onComplete) onComplete();
    }
  }, [incidentAngleDeg, medium1Key, medium2Key, isTotalInternalReflection, hasCompleted, onComplete]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const midY = H / 2;
    const midX = W / 2;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Draw Medium 1 (top half)
    ctx.fillStyle = MEDIA[medium1Key].color;
    ctx.fillRect(0, 0, W, midY);

    // Draw Medium 2 (bottom half)
    ctx.fillStyle = MEDIA[medium2Key].color;
    ctx.fillRect(0, midY, W, midY);

    // Boundary interface line
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(W, midY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Normal line (dashed, perpendicular to interface)
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(midX, 20);
    ctx.lineTo(midX, H - 20);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Ray length
    const rayLen = 180;

    // Incident ray (comes from top-left into origin (midX, midY))
    // Angle measured from the normal line (vertical)
    const incX = midX - rayLen * Math.sin(theta1Rad);
    const incY = midY - rayLen * Math.cos(theta1Rad);

    // Draw Laser Source emitter box
    ctx.save();
    ctx.translate(incX, incY);
    ctx.rotate(theta1Rad);
    ctx.fillStyle = '#334155';
    ctx.fillRect(-12, -24, 24, 24);
    ctx.fillStyle = laserColor;
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();

    // Draw Incident Ray
    ctx.beginPath();
    ctx.moveTo(incX, incY);
    ctx.lineTo(midX, midY);
    ctx.strokeStyle = laserColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = laserColor;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    // Draw Reflected Ray (Law of reflection: angle of reflection = angle of incidence)
    // Reflected ray heads upward into top-right quadrant
    const refX = midX + rayLen * Math.sin(theta1Rad);
    const refY = midY - rayLen * Math.cos(theta1Rad);

    // Reflected ray opacity depends on whether TIR occurred
    const refAlpha = isTotalInternalReflection ? 1.0 : 0.4;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(refX, refY);
    ctx.strokeStyle = isTotalInternalReflection ? laserColor : `rgba(239, 68, 68, ${refAlpha})`;
    ctx.lineWidth = isTotalInternalReflection ? 3 : 1.5;
    if (isTotalInternalReflection) {
      ctx.shadowColor = laserColor;
      ctx.shadowBlur = 12;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Refracted Ray (if not TIR)
    if (!isTotalInternalReflection && theta2Deg !== null) {
      const theta2Rad = (theta2Deg * Math.PI) / 180;
      const refrX = midX + rayLen * Math.sin(theta2Rad);
      const refrY = midY + rayLen * Math.cos(theta2Rad);

      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(refrX, refrY);
      ctx.strokeStyle = laserColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = laserColor;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Arc for refraction angle θ2
      ctx.beginPath();
      ctx.arc(midX, midY, 40, Math.PI / 2, Math.PI / 2 - theta2Rad, true);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Arc for incident angle θ1
    ctx.beginPath();
    ctx.arc(midX, midY, 40, -Math.PI / 2, -Math.PI / 2 - theta1Rad, true);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Text labels on canvas
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`θ₁ = ${incidentAngleDeg}°`, midX - 65, midY - 48);

    if (!isTotalInternalReflection && theta2Deg !== null) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`θ₂ = ${theta2Deg.toFixed(1)}°`, midX + 15, midY + 45);
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('TOTAL INTERNAL REFLECTION (TIR)', midX - 110, midY + 50);
    }

    // Normal line label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px sans-serif';
    ctx.fillText('Normal (90°)', midX + 8, 35);
  }, [medium1Key, medium2Key, incidentAngleDeg, laserColor, isTotalInternalReflection, theta2Deg, theta1Rad]);

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 text-white shadow-xl space-y-5">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Sun className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              Optics, Snell's Law & Refraction Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Direct a coherent laser across optical interfaces to measure refraction angles and observe Total Internal Reflection.
            </p>
          </div>
        </div>

        {hasCompleted && (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-center">
            <Award className="w-4 h-4" /> Lab Completed (+100 XP)
          </span>
        )}
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={680}
          height={380}
          className="w-full max-h-[380px] object-contain"
        />

        {/* Medium indicators inside canvas */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
          <span className="text-slate-400">Medium 1: </span>
          <span className="font-bold text-amber-400">{MEDIA[medium1Key].name} (n₁ = {n1})</span>
        </div>

        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
          <span className="text-slate-400">Medium 2: </span>
          <span className="font-bold text-sky-400">{MEDIA[medium2Key].name} (n₂ = {n2})</span>
        </div>

        {/* Critical Angle Badge */}
        {criticalAngleDeg && (
          <div className="absolute top-3 right-3 bg-indigo-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-700/60 text-xs">
            <span className="text-indigo-300">Critical Angle (θc): </span>
            <span className="font-bold font-mono text-white">{criticalAngleDeg.toFixed(1)}°</span>
          </div>
        )}
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Incident Angle Slider */}
        <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Incident Angle (θ₁)</span>
            <span className="font-mono text-amber-400 font-bold">{incidentAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="85"
            step="1"
            value={incidentAngleDeg}
            onChange={(e) => setIncidentAngleDeg(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0° (Perpendicular)</span>
            <span>85° (Grazing)</span>
          </div>
        </div>

        {/* Medium 1 Selection */}
        <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Incident Medium (Top)
          </label>
          <select
            value={medium1Key}
            onChange={(e) => setMedium1Key(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {Object.entries(MEDIA).map(([k, v]) => (
              <option key={k} value={k}>
                {v.name} (n = {v.n})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400">Select starting substance.</p>
        </div>

        {/* Medium 2 Selection */}
        <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Refracting Medium (Bottom)
          </label>
          <select
            value={medium2Key}
            onChange={(e) => setMedium2Key(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {Object.entries(MEDIA).map(([k, v]) => (
              <option key={k} value={k}>
                {v.name} (n = {v.n})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400">Select receiving substance.</p>
        </div>
      </div>

      {/* Live Snell Formula Callout */}
      <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Snell's Law Equation
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            <code className="bg-slate-900 px-2 py-0.5 rounded text-indigo-300 font-mono">
              n₁ · sin(θ₁) = n₂ · sin(θ₂)
            </code>
            {' → '}
            <span className="font-mono text-slate-200">
              {n1} · sin({incidentAngleDeg}°) = {n2} · {isTotalInternalReflection ? 'TIR' : `sin(${theta2Deg?.toFixed(1)}°)`}
            </span>
          </p>
        </div>

        <div className="bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-700/60 text-right flex-shrink-0">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Refracted Angle (θ₂)</span>
          <span className="font-mono text-sm font-bold text-sky-400">
            {isTotalInternalReflection ? 'No Ray (100% Reflected)' : `${theta2Deg?.toFixed(1)}°`}
          </span>
        </div>
      </div>
    </div>
  );
};
