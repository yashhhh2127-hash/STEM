import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Award, Sparkles, Orbit, Compass, Zap, AlertCircle } from 'lucide-react';

interface GravityOrbitSimProps {
  onComplete?: () => void;
}

export const GravityOrbitSim: React.FC<GravityOrbitSimProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation parameters
  const [sunMass, setSunMass] = useState<number>(1000); // arbitrary gravity units
  const [initialDistance, setInitialDistance] = useState<number>(140); // pixels
  const [initialSpeed, setInitialSpeed] = useState<number>(2.7); // px/step
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  // Physics state
  const stateRef = useRef({
    x: 140,
    y: 0,
    vx: 0,
    vy: 2.7,
    trail: [] as Array<{ x: number; y: number }>,
    status: 'Stable Orbit' as 'Stable Orbit' | 'Elliptical' | 'Escaping' | 'Sun Collision',
    orbitsCount: 0,
    lastAngle: 0,
    totalAngleTraveled: 0,
  });

  // Reset function
  const resetSim = (dist = initialDistance, speed = initialSpeed) => {
    stateRef.current = {
      x: dist,
      y: 0,
      vx: 0,
      vy: speed,
      trail: [],
      status: 'Stable Orbit',
      orbitsCount: 0,
      lastAngle: 0,
      totalAngleTraveled: 0,
    };
  };

  useEffect(() => {
    resetSim(initialDistance, initialSpeed);
  }, [initialDistance, initialSpeed, sunMass]);

  // Main animation loop
  useEffect(() => {
    let animId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const state = stateRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (isPlaying && state.status !== 'Sun Collision') {
        // Physics update (Sub-stepping for numerical stability)
        const subSteps = 4;
        const dt = 1 / subSteps;

        for (let i = 0; i < subSteps; i++) {
          const r = Math.hypot(state.x, state.y);

          // Check sun collision (radius 20)
          if (r < 22) {
            state.status = 'Sun Collision';
            break;
          }

          // Gravitational acceleration: a = GM / r^2, directed towards origin
          const G = 1;
          const a = (G * sunMass) / (r * r);
          const ax = -a * (state.x / r);
          const ay = -a * (state.y / r);

          state.vx += ax * dt;
          state.vy += ay * dt;
          state.x += state.vx * dt;
          state.y += state.vy * dt;

          // Track angle and completed orbits
          const currentAngle = Math.atan2(state.y, state.x);
          let diff = currentAngle - state.lastAngle;
          if (diff < -Math.PI) diff += 2 * Math.PI;
          if (diff > Math.PI) diff -= 2 * Math.PI;
          state.totalAngleTraveled += Math.abs(diff);
          state.lastAngle = currentAngle;

          // If planet traveled 2pi rad, count orbit
          if (state.totalAngleTraveled >= (state.orbitsCount + 1) * 2 * Math.PI) {
            state.orbitsCount++;
            if (state.orbitsCount >= 2 && !hasCompleted) {
              setHasCompleted(true);
              if (onComplete) onComplete();
            }
          }
        }

        // Check if escaped screen boundaries
        const rCurrent = Math.hypot(state.x, state.y);
        if (rCurrent > Math.max(canvas.width, canvas.height)) {
          state.status = 'Escaping';
        } else if (state.status !== 'Sun Collision') {
          const speed = Math.hypot(state.vx, state.vy);
          const circularSpeed = Math.sqrt((1 * sunMass) / rCurrent);
          if (Math.abs(speed - circularSpeed) < 0.3) {
            state.status = 'Stable Orbit';
          } else {
            state.status = 'Elliptical';
          }
        }

        // Push trail
        state.trail.push({ x: state.x, y: state.y });
        if (state.trail.length > 220) {
          state.trail.shift();
        }
      }

      // ── Rendering ──
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let s = 0; s < 45; s++) {
        const sx = ((s * 97) % canvas.width);
        const sy = ((s * 131) % canvas.height);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw orbit distance circle guide
      ctx.beginPath();
      ctx.arc(centerX, centerY, initialDistance, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw planet trail
      if (state.trail.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < state.trail.length; i++) {
          const pt = state.trail[i];
          const px = centerX + pt.x;
          const py = centerY + pt.y;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw central star (Sun) with corona glow
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 35);
      sunGradient.addColorStop(0, '#fef08a');
      sunGradient.addColorStop(0.3, '#f59e0b');
      sunGradient.addColorStop(0.8, 'rgba(245, 158, 11, 0.2)');
      sunGradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
      ctx.fill();

      // Solid Sun core
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 16, 0, 2 * Math.PI);
      ctx.fill();

      // Draw planet
      const planetX = centerX + state.x;
      const planetY = centerY + state.y;

      // Planet glow
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.beginPath();
      ctx.arc(planetX, planetY, 12, 0, 2 * Math.PI);
      ctx.fill();

      // Planet body
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(planetX, planetY, 7, 0, 2 * Math.PI);
      ctx.fill();

      // Velocity Vector arrow
      ctx.beginPath();
      ctx.moveTo(planetX, planetY);
      ctx.lineTo(planetX + state.vx * 12, planetY + state.vy * 12);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.stroke();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, sunMass, initialDistance, initialSpeed, onComplete, hasCompleted]);

  // Theoretical calculated speed for circular orbit: v = sqrt(GM / r)
  const theoreticalCircSpeed = Math.sqrt((1 * sunMass) / initialDistance).toFixed(2);
  const orbitalPeriod = (2 * Math.PI * Math.sqrt(Math.pow(initialDistance, 3) / sunMass)).toFixed(0);

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 text-white shadow-xl space-y-5">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Orbit className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              Gravity & Planetary Orbital Mechanics
            </h3>
            <p className="text-xs text-slate-400">
              Manipulate solar mass and tangential velocity to explore Newton's Law of Gravitation & Keplerian trajectories.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasCompleted && (
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Lab Completed (+100 XP)
            </span>
          )}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            onClick={() => resetSim()}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#090d16] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={680}
          height={380}
          className="w-full max-h-[380px] object-contain"
        />

        {/* Real-time HUD overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 text-[11px] space-y-1">
          <div className="flex items-center gap-2 text-slate-300">
            <span>Status:</span>
            <span
              className={`font-bold ${
                stateRef.current.status === 'Stable Orbit'
                  ? 'text-emerald-400'
                  : stateRef.current.status === 'Sun Collision'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {stateRef.current.status}
            </span>
          </div>
          <div className="text-slate-400">
            Orbits Completed: <span className="font-mono text-white font-bold">{stateRef.current.orbitsCount}</span>
          </div>
          <div className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Velocity Vector (Green)
          </div>
        </div>
      </div>

      {/* Control Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Sun Mass Slider */}
        <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Sun Mass (M)</span>
            <span className="font-mono text-amber-400 font-bold">{sunMass} kg*</span>
          </div>
          <input
            type="range"
            min="400"
            max="2000"
            step="50"
            value={sunMass}
            onChange={(e) => setSunMass(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">Heavier star increases inward pull F = GMm/r².</p>
        </div>

        {/* Orbital Distance Slider */}
        <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Orbital Radius (r)</span>
            <span className="font-mono text-indigo-400 font-bold">{initialDistance} px</span>
          </div>
          <input
            type="range"
            min="70"
            max="220"
            step="5"
            value={initialDistance}
            onChange={(e) => setInitialDistance(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">Distance from center of gravity.</p>
        </div>

        {/* Launch Velocity Slider */}
        <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Tangential Velocity (v)</span>
            <span className="font-mono text-emerald-400 font-bold">{initialSpeed.toFixed(2)} px/s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.05"
            value={initialSpeed}
            onChange={(e) => setInitialSpeed(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Target circular speed:</span>
            <span className="text-emerald-400 font-bold font-mono">{theoreticalCircSpeed} px/s</span>
          </div>
        </div>
      </div>

      {/* Physics Insights & Formulas */}
      <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-indigo-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Kepler's Third Law & Circular Velocity
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            For a stable circular orbit, centripetal acceleration equals gravity: <code className="bg-indigo-900/80 px-1 py-0.5 rounded text-indigo-200 font-mono">v_circ = √(GM / r)</code>. Match tangential velocity to achieve circular equilibrium!
          </p>
        </div>
        <div className="bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-700/60 text-right flex-shrink-0">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Period (T)</span>
          <span className="font-mono text-sm font-bold text-amber-400">{orbitalPeriod} steps</span>
        </div>
      </div>
    </div>
  );
};
