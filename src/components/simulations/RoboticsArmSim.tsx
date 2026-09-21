import React, { useState } from 'react';
import { Cpu, Target, RotateCcw, CheckCircle2, Award } from 'lucide-react';

export const RoboticsArmSim: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [theta1, setTheta1] = useState<number>(45); // Base shoulder angle in degrees
  const [theta2, setTheta2] = useState<number>(-30); // Elbow angle in degrees
  const [gearRatio, setGearRatio] = useState<number>(4); // 1:4 gear reduction
  const [targetHit, setTargetHit] = useState<boolean>(false);

  const L1 = 100; // Length of upper arm
  const L2 = 80;  // Length of forearm

  // Kinematic calculations
  const rad1 = (theta1 * Math.PI) / 180;
  const rad2 = ((theta1 + theta2) * Math.PI) / 180;

  const elbowX = L1 * Math.cos(rad1);
  const elbowY = L1 * Math.sin(rad1);

  const endX = elbowX + L2 * Math.cos(rad2);
  const endY = elbowY + L2 * Math.sin(rad2);

  // Target coordinates
  const targetX = 110;
  const targetY = 95;

  const distToTarget = Math.sqrt(Math.pow(endX - targetX, 2) + Math.pow(endY - targetY, 2));
  const isNearTarget = distToTarget < 15;

  // Motor torque & speed tradeoff
  const motorBaseTorqueNm = 0.5;
  const motorBaseRpm = 1200;
  const effectiveTorque = (motorBaseTorqueNm * gearRatio).toFixed(2);
  const effectiveRpm = (motorBaseRpm / gearRatio).toFixed(0);

  const checkGrab = () => {
    if (isNearTarget) {
      setTargetHit(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-xs uppercase tracking-wider">
              Robotics & Mechanical
            </span>
            <span className="text-xs text-slate-400">2-DOF Planar Arm Kinematics</span>
          </div>
          <h3 className="text-xl font-black mt-1">Robotic Arm Forward Kinematics & Gearbox</h3>
          <p className="text-xs text-slate-300">
            Control joint servo angles and planetary gear ratios. Move the robotic end-effector to hit the target point.
          </p>
        </div>

        <button
          onClick={() => {
            setTheta1(45);
            setTheta2(-30);
            setGearRatio(4);
            setTargetHit(false);
          }}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Arm Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="-150 -20 300 240" className="w-full h-full max-w-md">
              {/* Workspace Boundary reachable envelope */}
              <circle cx="0" cy="180" r={L1 + L2} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

              {/* Base Mount */}
              <rect x="-35" y="175" width="70" height="15" fill="#334155" rx="3" />
              <circle cx="0" cy="180" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="0" y="205" fill="#64748b" fontSize="9" textAnchor="middle">Base Servo (θ₁)</text>

              {/* Target Point */}
              <g transform={`translate(${targetX}, ${180 - targetY})`}>
                <circle cx="0" cy="0" r="12" fill={targetHit ? '#10b981' : '#ef4444'} fillOpacity="0.2" className="animate-ping" />
                <circle cx="0" cy="0" r="8" fill={targetHit ? '#10b981' : '#ef4444'} />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
                <text x="12" y="4" fill="#f87171" fontSize="9" fontWeight="bold">
                  {targetHit ? '✓ TARGET REACHED!' : 'Target Point'}
                </text>
              </g>

              {/* Link 1 (Shoulder to Elbow) */}
              <line
                x1="0"
                y1="180"
                x2={elbowX}
                y2={180 - elbowY}
                stroke="#6366f1"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Elbow Joint Servo */}
              <circle cx={elbowX} cy={180 - elbowY} r="10" fill="#4338ca" stroke="#a5b4fc" strokeWidth="2" />

              {/* Link 2 (Elbow to End-Effector) */}
              <line
                x1={elbowX}
                y1={180 - elbowY}
                x2={endX}
                y2={180 - endY}
                stroke="#06b6d4"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* End-Effector Gripper */}
              <g transform={`translate(${endX}, ${180 - endY}) rotate(${theta1 + theta2})`}>
                <circle cx="0" cy="0" r="6" fill="#f43f5e" />
                {/* Gripper claws */}
                <path d="M 0 -6 L 10 -10 L 14 -6" fill="none" stroke="#fda4af" strokeWidth="2" />
                <path d="M 0 6 L 10 10 L 14 6" fill="none" stroke="#fda4af" strokeWidth="2" />
              </g>
            </svg>

            {/* Target Status Inset */}
            <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
              Distance to Target: <strong className={isNearTarget ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>
                {distToTarget.toFixed(1)} mm
              </strong>
            </div>

            {isNearTarget && !targetHit && (
              <button
                onClick={checkGrab}
                className="absolute bottom-4 right-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg animate-bounce"
              >
                <Target className="w-4 h-4" /> Pick Target Object!
              </button>
            )}
          </div>

          {/* Kinematic Output Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium block">End-Effector X</span>
              <span className="text-lg font-black text-indigo-600 font-mono">{endX.toFixed(1)} mm</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium block">End-Effector Y</span>
              <span className="text-lg font-black text-cyan-600 font-mono">{endY.toFixed(1)} mm</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium block">Torque Output</span>
              <span className="text-lg font-black text-amber-600 font-mono">{effectiveTorque} N·m</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium block">Joint Max Speed</span>
              <span className="text-lg font-black text-slate-800 font-mono">{effectiveRpm} RPM</span>
            </div>
          </div>
        </div>

        {/* Kinematic & Gear Controls */}
        <div className="space-y-4 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-rose-600" />
            Servo & Gear Parameters
          </h4>

          {/* Shoulder θ1 */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Base Shoulder Angle (θ₁)</span>
              <span className="text-indigo-600 font-mono font-bold">{theta1}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              value={theta1}
              onChange={(e) => setTheta1(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Elbow θ2 */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Elbow Joint Angle (θ₂)</span>
              <span className="text-cyan-600 font-mono font-bold">{theta2}°</span>
            </div>
            <input
              type="range"
              min="-135"
              max="135"
              value={theta2}
              onChange={(e) => setTheta2(Number(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
          </div>

          {/* Gear ratio */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Gearbox Reduction Ratio</span>
              <span className="text-amber-600 font-mono font-bold">1:{gearRatio}</span>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              step="1"
              value={gearRatio}
              onChange={(e) => setGearRatio(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>1:1 (Fast / Weak)</span>
              <span>1:4</span>
              <span>1:16 (High Torque / Slow)</span>
            </div>
          </div>

          {/* Mechanical Tradeoff note */}
          <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-xs space-y-1 text-slate-700">
            <span className="font-bold text-rose-900 block">Engineering Principle:</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Mechanical gear reduction increases output torque proportionally while reducing angular velocity. Ideal for lifting heavier payloads!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
