import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Globe, Zap, Compass } from 'lucide-react';

interface PlanetGravity {
  name: string;
  g: number;
  color: string;
}

const PLANETS: PlanetGravity[] = [
  { name: 'Earth', g: 9.81, color: '#10b981' },
  { name: 'Moon', g: 1.62, color: '#94a3b8' },
  { name: 'Mars', g: 3.72, color: '#f97316' },
  { name: 'Jupiter', g: 24.79, color: '#8b5cf6' },
];

export const ProjectileMotionSim: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [velocity, setVelocity] = useState<number>(25); // m/s
  const [angleDeg, setAngleDeg] = useState<number>(45); // degrees
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetGravity>(PLANETS[0]);
  const [airResistance, setAirResistance] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [animationProgress, setAnimationProgress] = useState<number>(1); // 0 to 1

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Physics equations
  const g = selectedPlanet.g;
  const angleRad = (angleDeg * Math.PI) / 180;
  const vX = velocity * Math.cos(angleRad);
  const vY = velocity * Math.sin(angleRad);

  // Flight calculations
  const totalFlightTime = (2 * vY) / g;
  const maxRange = (velocity * velocity * Math.sin(2 * angleRad)) / g;
  const maxHeight = (vY * vY) / (2 * g);

  // Animation controller
  const startSimulation = () => {
    setIsSimulating(true);
    setAnimationProgress(0);
    const startTime = performance.now();
    const durationMs = Math.min(Math.max(totalFlightTime * 600, 1500), 5000);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSimulating(false);
        if (onComplete) onComplete();
      }
    };

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const resetSimulation = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setIsSimulating(false);
    setAnimationProgress(1);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Padding & axes limits
    const padX = 50;
    const padY = 40;
    const drawWidth = width - padX - 20;
    const drawHeight = height - padY - 20;

    // Determine scale based on max possible range and height
    const scaleX = drawWidth / Math.max(maxRange * 1.25, 30);
    const scaleY = drawHeight / Math.max(maxHeight * 1.4, 15);

    // Background grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 0; x <= drawWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(padX + x, 10);
      ctx.lineTo(padX + x, height - padY);
      ctx.stroke();
    }
    for (let y = 0; y <= drawHeight; y += 40) {
      ctx.beginPath();
      ctx.moveTo(padX, height - padY - y);
      ctx.lineTo(width - 20, height - padY - y);
      ctx.stroke();
    }

    // Ground plane
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(padX - 10, height - padY, drawWidth + 30, 4);

    // Origin launch base
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(padX, height - padY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Trajectory path calculation
    const steps = 120;
    ctx.beginPath();
    ctx.moveTo(padX, height - padY);

    const activeSteps = Math.floor(steps * animationProgress);
    let currentX = padX;
    let currentY = height - padY;

    for (let i = 0; i <= activeSteps; i++) {
      const t = (i / steps) * totalFlightTime;
      // Coordinates in meters
      const x = vX * t;
      const dragFactor = airResistance ? Math.exp(-0.04 * t) : 1;
      const y = Math.max(vY * t - 0.5 * g * t * t, 0) * dragFactor;

      const px = padX + x * scaleX;
      const py = height - padY - y * scaleY;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);

      if (i === activeSteps) {
        currentX = px;
        currentY = py;
      }
    }

    ctx.strokeStyle = selectedPlanet.color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dotted future path if animating
    if (animationProgress < 1) {
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      for (let i = activeSteps; i <= steps; i++) {
        const t = (i / steps) * totalFlightTime;
        const x = vX * t;
        const y = Math.max(vY * t - 0.5 * g * t * t, 0);
        const px = padX + x * scaleX;
        const py = height - padY - y * scaleY;
        if (i === activeSteps) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Projectile ball
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Initial launch angle vector indicator
    const vectorLen = 35;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padX, height - padY);
    ctx.lineTo(
      padX + vectorLen * Math.cos(angleRad),
      height - padY - vectorLen * Math.sin(angleRad)
    );
    ctx.stroke();

    // Axes tick markings
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText('0m', padX - 10, height - padY + 16);
    ctx.fillText(`${maxRange.toFixed(1)}m (Range)`, padX + maxRange * scaleX - 25, height - padY + 16);

    // Peak height marker
    const peakPx = padX + (maxRange / 2) * scaleX;
    const peakPy = height - padY - maxHeight * scaleY;
    ctx.fillStyle = '#475569';
    ctx.fillText(`Peak: ${maxHeight.toFixed(1)}m`, peakPx - 20, Math.max(peakPy - 8, 20));

    // Small dashed drop line at peak
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(peakPx, peakPy);
    ctx.lineTo(peakPx, height - padY);
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();
    ctx.setLineDash([]);
  }, [velocity, angleDeg, selectedPlanet, airResistance, animationProgress, maxRange, maxHeight, totalFlightTime, vX, vY, g, angleRad]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              Physics Simulation
            </span>
            <span className="text-xs text-slate-400">2D Kinematics</span>
          </div>
          <h3 className="text-xl font-black mt-1">Projectile Motion & Trajectory Lab</h3>
          <p className="text-xs text-slate-300">
            Manipulate initial velocity, launch angle, and gravity to observe parabolic paths in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 transition shadow-md"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            {isSimulating ? 'Launching...' : 'Launch Projectile'}
          </button>
          <button
            onClick={resetSimulation}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Canvas Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full h-80 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 shadow-xs">
              Environment: <strong className="text-slate-900">{selectedPlanet.name}</strong> (g = {selectedPlanet.g} m/s²)
            </div>
            {airResistance && (
              <div className="absolute top-3 right-3 bg-amber-100/90 text-amber-800 text-[11px] font-bold px-2 py-1 rounded">
                Air Resistance: Active
              </div>
            )}
          </div>

          {/* Real-time output metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
              <span className="text-[11px] font-medium text-slate-500 block">Total Range (Distance)</span>
              <span className="text-lg font-black text-indigo-600">{maxRange.toFixed(2)} m</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
              <span className="text-[11px] font-medium text-slate-500 block">Max Height (Peak)</span>
              <span className="text-lg font-black text-emerald-600">{maxHeight.toFixed(2)} m</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
              <span className="text-[11px] font-medium text-slate-500 block">Total Flight Time</span>
              <span className="text-lg font-black text-amber-600">{totalFlightTime.toFixed(2)} s</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
              <span className="text-[11px] font-medium text-slate-500 block">Horiz. Velocity (vX)</span>
              <span className="text-lg font-black text-slate-800">{vX.toFixed(1)} m/s</span>
            </div>
          </div>
        </div>

        {/* Interactive Controls Column */}
        <div className="space-y-5 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            Launch Parameters
          </h4>

          {/* Velocity slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Initial Velocity (v₀)</span>
              <span className="text-indigo-600 font-bold">{velocity} m/s</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={velocity}
              onChange={(e) => setVelocity(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>5 m/s</span>
              <span>25 m/s</span>
              <span>50 m/s</span>
            </div>
          </div>

          {/* Angle slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Launch Angle (θ)</span>
              <span className="text-emerald-600 font-bold">{angleDeg}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="85"
              value={angleDeg}
              onChange={(e) => setAngleDeg(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>5° (Flat)</span>
              <span>45° (Max Range)</span>
              <span>85° (Steep)</span>
            </div>
          </div>

          {/* Planetary gravity selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Gravitational Field
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PLANETS.map((planet) => (
                <button
                  key={planet.name}
                  onClick={() => setSelectedPlanet(planet)}
                  className={`p-2 rounded-lg text-xs font-semibold border text-left transition flex items-center justify-between ${
                    selectedPlanet.name === planet.name
                      ? 'border-indigo-600 bg-white text-indigo-700 shadow-xs'
                      : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                  }`}
                >
                  <span>{planet.name}</span>
                  <span className="text-[10px] text-slate-400">{planet.g}g</span>
                </button>
              ))}
            </div>
          </div>

          {/* Air resistance toggle */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={airResistance}
                onChange={(e) => setAirResistance(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Simulate Atmospheric Drag (Air Resistance)</span>
            </label>
          </div>

          {/* Key Formula Helper */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1 text-slate-700">
            <span className="font-bold text-indigo-900 block">Key Formula:</span>
            <p className="font-mono text-[11px] text-indigo-800">
              Range = (v₀² · sin(2θ)) / g
            </p>
            <p className="text-[11px] text-slate-500">
              Notice that 45° always produces maximum distance under vacuum conditions!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
