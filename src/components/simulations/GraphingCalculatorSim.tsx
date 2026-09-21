import React, { useState, useEffect, useRef } from 'react';
import { Compass, ZoomIn, ZoomOut, RotateCcw, HelpCircle, Layers } from 'lucide-react';

type FunctionArchetype = 'quadratic' | 'linear' | 'cubic' | 'sine' | 'cosine';

export const GraphingCalculatorSim: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [archetype, setArchetype] = useState<FunctionArchetype>('quadratic');
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(0);
  const [c, setC] = useState<number>(-4);
  const [zoom, setZoom] = useState<number>(30); // pixels per unit
  const [compareSecondary, setCompareSecondary] = useState<boolean>(false);
  const [secA, setSecA] = useState<number>(-1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Evaluate function f(x)
  const evaluate = (x: number, coeffA: number, coeffB: number, coeffC: number, type: FunctionArchetype): number => {
    switch (type) {
      case 'quadratic':
        return coeffA * x * x + coeffB * x + coeffC;
      case 'linear':
        return coeffA * x + coeffC;
      case 'cubic':
        return coeffA * Math.pow(x, 3) + coeffB * x + coeffC;
      case 'sine':
        return coeffA * Math.sin(coeffB * x || x) + coeffC;
      case 'cosine':
        return coeffA * Math.cos(coeffB * x || x) + coeffC;
      default:
        return x;
    }
  };

  // Math analysis for quadratic
  let rootsText = 'None (Complex)';
  let vertexText = 'N/A';
  if (archetype === 'quadratic' && a !== 0) {
    const discriminant = b * b - 4 * a * c;
    const vx = -b / (2 * a);
    const vy = a * vx * vx + b * vx + c;
    vertexText = `(${vx.toFixed(2)}, ${vy.toFixed(2)})`;

    if (discriminant > 0) {
      const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      rootsText = `x₁ = ${r1.toFixed(2)}, x₂ = ${r2.toFixed(2)}`;
    } else if (discriminant === 0) {
      const r = -b / (2 * a);
      rootsText = `x = ${r.toFixed(2)} (Double Root)`;
    }
  }

  // Draw Graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height / 2;

    // Grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;

    // Vertical grid
    for (let x = originX % zoom; x < width; x += zoom) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    // Horizontal grid
    for (let y = originY % zoom; y < height; y += zoom) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Main Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis numbers
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    for (let i = -15; i <= 15; i++) {
      if (i === 0) continue;
      const px = originX + i * zoom;
      const py = originY - i * zoom;
      if (px > 0 && px < width) {
        ctx.fillText(i.toString(), px - 4, originY + 14);
      }
      if (py > 0 && py < height) {
        ctx.fillText(i.toString(), originX + 6, py + 3);
      }
    }

    // Draw primary function curve
    ctx.strokeStyle = '#4f46e5'; // Indigo
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let started = false;
    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - originX) / zoom;
      const mathY = evaluate(mathX, a, b, c, archetype);
      const py = originY - mathY * zoom;

      if (!Number.isFinite(py) || Math.abs(py) > height * 3) {
        started = false;
        continue;
      }

      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw secondary function curve if enabled
    if (compareSecondary) {
      ctx.strokeStyle = '#ec4899'; // Pink
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      started = false;
      for (let px = 0; px <= width; px += 2) {
        const mathX = (px - originX) / zoom;
        const mathY = evaluate(mathX, secA, b, c, archetype);
        const py = originY - mathY * zoom;

        if (!Number.isFinite(py) || Math.abs(py) > height * 3) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Roots & Vertex Markers on Quadratic
    if (archetype === 'quadratic' && a !== 0) {
      const vx = -b / (2 * a);
      const vy = a * vx * vx + b * vx + c;
      const vPx = originX + vx * zoom;
      const vPy = originY - vy * zoom;

      // Vertex point
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(vPx, vPy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Discriminant
      const disc = b * b - 4 * a * c;
      if (disc >= 0) {
        const r1 = (-b + Math.sqrt(disc)) / (2 * a);
        const r2 = (-b - Math.sqrt(disc)) / (2 * a);
        [r1, r2].forEach((r) => {
          const rPx = originX + r * zoom;
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(rPx, originY, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    if (onComplete) onComplete();
  }, [a, b, c, zoom, archetype, compareSecondary, secA, onComplete]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-wider">
              Mathematics Tool
            </span>
            <span className="text-xs text-slate-400">GeoGebra-style Visualizer</span>
          </div>
          <h3 className="text-xl font-black mt-1">2D Dynamic Function Grapher</h3>
          <p className="text-xs text-slate-300">
            Plot parabolas, straight lines, polynomials, and trigonometric waves with live parameter controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(z + 8, 60))}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 8, 15))}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setA(1);
              setB(0);
              setC(-4);
              setZoom(30);
              setCompareSecondary(false);
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
            title="Reset Graph"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Display */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full h-80 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 shadow-xs">
              Function: <strong className="text-indigo-600 font-mono">
                {archetype === 'quadratic'
                  ? `y = ${a}x² ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`
                  : archetype === 'linear'
                  ? `y = ${a}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`
                  : archetype === 'cubic'
                  ? `y = ${a}x³ + ${b}x + ${c}`
                  : `y = ${a} · ${archetype}(${b || 1}x) + ${c}`}
              </strong>
            </div>
            {compareSecondary && (
              <div className="absolute top-3 right-3 bg-pink-50 border border-pink-200 rounded-lg px-2.5 py-1 text-xs text-pink-700 font-mono">
                Compare: y = {secA}x² {c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}
              </div>
            )}
          </div>

          {/* Mathematical Properties Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 font-medium block">Roots (x-intercepts)</span>
              <span className="font-mono font-bold text-rose-600">{rootsText}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 font-medium block">Vertex Coordinate</span>
              <span className="font-mono font-bold text-emerald-600">{vertexText}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 font-medium block">Y-Intercept</span>
              <span className="font-mono font-bold text-indigo-600">(0, {c})</span>
            </div>
          </div>
        </div>

        {/* Function Controls */}
        <div className="space-y-4 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            Function Controls
          </h4>

          {/* Archetype Selector */}
          <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
            {(['quadratic', 'linear', 'cubic', 'sine', 'cosine'] as FunctionArchetype[]).map((t) => (
              <button
                key={t}
                onClick={() => setArchetype(t)}
                className={`py-1.5 px-2 rounded-lg border capitalize transition ${
                  archetype === t
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Coefficient a slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Coefficient (a)</span>
              <span className="text-indigo-600 font-mono font-bold">{a}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Coefficient b slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Coefficient (b)</span>
              <span className="text-emerald-600 font-mono font-bold">{b}</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="1"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Constant c slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Constant (c)</span>
              <span className="text-amber-600 font-mono font-bold">{c}</span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={c}
              onChange={(e) => setC(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Compare function toggle */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={compareSecondary}
                onChange={(e) => setCompareSecondary(e.target.checked)}
                className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
              />
              <span>Compare Reflection Function (Pink Dashed)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
