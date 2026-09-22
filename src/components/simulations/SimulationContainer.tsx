import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectileMotionSim } from './ProjectileMotionSim';
import { CircuitBuilderSim } from './CircuitBuilderSim';
import { GraphingCalculatorSim } from './GraphingCalculatorSim';
import { AtomModelSim } from './AtomModelSim';
import { CellExplorerSim } from './CellExplorerSim';
import { RoboticsArmSim } from './RoboticsArmSim';
import { GravityOrbitSim } from './GravityOrbitSim';
import { OpticsRefractionSim } from './OpticsRefractionSim';
import {
  Cpu,
  Atom,
  Compass,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles,
  PlayCircle,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { SubjectCategory } from '../../types';

export const SimulationContainer: React.FC = () => {
  const {
    simulations,
    selectedSimulationId,
    setSelectedSimulationId,
    selectedSubject,
    setSelectedSubject,
    completeSimulation,
    currentStudent,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(selectedSimulationId || 'sim-projectile');
  const [completedSims, setCompletedSims] = useState<string[]>(currentStudent.completedSimulations || []);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const activeSim = simulations.find((s) => s.id === activeTab) || simulations[0];

  const handleSimCompleted = (simId: string) => {
    if (!completedSims.includes(simId)) {
      setCompletedSims((prev) => [...prev, simId]);
      completeSimulation(simId, activeSim.xpReward);
    }
  };

  const filteredSimulations = simulations.filter((s) => {
    if (selectedSubject && selectedSubject !== 'all' && s.subject !== selectedSubject) {
      return false;
    }
    return true;
  });

  return (
    <div className={`space-y-4 sm:space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-100 p-3 sm:p-6 overflow-y-auto' : ''}`}>
      {/* Clean Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100">
              Visual Experiments
            </span>
            <span className="text-xs text-slate-500 font-medium">
              PhET & GeoGebra Inspired
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Interactive STEM Simulations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Move sliders, adjust variables, and observe mathematical relationships and scientific laws in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex-shrink-0">
          <div className="p-2 bg-emerald-500 rounded-lg text-white font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Completed Labs</span>
            <span className="text-base sm:text-lg font-black text-slate-900">
              {completedSims.length} / {simulations.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter by Subject pills - Horizontal swipeable on mobile */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1 flex-1">
          <button
            onClick={() => setSelectedSubject(undefined)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 ${
              !selectedSubject || selectedSubject === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Subjects
          </button>
          {(['science', 'mathematics', 'technology', 'engineering'] as SubjectCategory[]).map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition flex items-center gap-1.5 flex-shrink-0 ${
                selectedSubject === subj
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {subj === 'science' && <Atom className="w-3.5 h-3.5 text-emerald-500" />}
              {subj === 'mathematics' && <Compass className="w-3.5 h-3.5 text-blue-500" />}
              {subj === 'technology' && <Cpu className="w-3.5 h-3.5 text-amber-500" />}
              {subj === 'engineering' && <Flame className="w-3.5 h-3.5 text-rose-500" />}
              {subj}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="px-2.5 sm:px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition flex-shrink-0"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span className="hidden sm:inline">{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
        </button>
      </div>

      {/* Simulation Selector - Horizontal swipe carousel on mobile, Grid on desktop */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 sm:grid sm:grid-cols-3 lg:grid-cols-6">
        {filteredSimulations.map((sim) => {
          const isActive = activeTab === sim.id;
          const isDone = completedSims.includes(sim.id);

          return (
            <button
              key={sim.id}
              onClick={() => {
                setActiveTab(sim.id);
                setSelectedSimulationId(sim.id);
              }}
              className={`min-w-[145px] sm:min-w-0 flex-shrink-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-left border transition relative flex flex-col justify-between active:scale-[0.98] ${
                isActive
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {sim.subject}
                  </span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />}
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                  {sim.name}
                </h4>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-500">
                <span>+{sim.xpReward} XP</span>
                <span className="capitalize text-indigo-600 font-bold">{sim.difficulty}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Simulation Viewport */}
      <div>
        {activeTab === 'sim-projectile' && (
          <ProjectileMotionSim onComplete={() => handleSimCompleted('sim-projectile')} />
        )}
        {(activeTab === 'sim-circuit' || activeTab === 'sim-circuits') && (
          <CircuitBuilderSim onComplete={() => handleSimCompleted(activeTab)} />
        )}
        {(activeTab === 'sim-grapher' || activeTab === 'sim-graphing') && (
          <GraphingCalculatorSim onComplete={() => handleSimCompleted(activeTab)} />
        )}
        {activeTab === 'sim-atom' && (
          <AtomModelSim onComplete={() => handleSimCompleted('sim-atom')} />
        )}
        {activeTab === 'sim-cell' && (
          <CellExplorerSim onComplete={() => handleSimCompleted('sim-cell')} />
        )}
        {activeTab === 'sim-robotics' && (
          <RoboticsArmSim onComplete={() => handleSimCompleted('sim-robotics')} />
        )}
        {(activeTab === 'sim-gravity' || activeTab === 'sim-orbit') && (
          <GravityOrbitSim onComplete={() => handleSimCompleted(activeTab)} />
        )}
        {(activeTab === 'sim-optics' || activeTab === 'sim-waves') && (
          <OpticsRefractionSim onComplete={() => handleSimCompleted(activeTab)} />
        )}
      </div>

      {/* Pedagogical Learning Context & Next Steps Card */}
      <div className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Learning Objectives
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {activeSim.description}
          </p>
          <div className="flex items-center gap-2 pt-1 sm:pt-2">
            <span className="text-[11px] font-bold text-slate-500">Subject:</span>
            <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
              {activeSim.subject}
            </span>
            <span className="text-[11px] font-bold text-slate-500 ml-2">Estimated:</span>
            <span className="text-xs font-semibold text-slate-700">10-15 mins</span>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> What to Observe
          </div>
          <ul className="text-xs text-slate-600 space-y-1 sm:space-y-1.5 list-disc pl-4">
            <li>Change one variable at a time (scientific method).</li>
            <li>Note how proportional or inverse relationships manifest visually.</li>
            <li>Formulate a hypothesis before sliding controls to maximum.</li>
          </ul>
        </div>

        <div className="space-y-2 sm:space-y-3 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Continue Learning Path</span>
            <p className="text-xs text-slate-500 mt-0.5">
              Reinforce this simulation with related video explanations or an adaptive quiz!
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {activeSim.relatedVideoId && (
              <button
                onClick={() => navigateTo('videos', activeSim.relatedVideoId, activeSim.subject)}
                className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-between transition active:scale-[0.99]"
              >
                <span className="flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4 text-blue-600" /> Watch Video Lesson
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
            {activeSim.relatedQuizId && (
              <button
                onClick={() => navigateTo('quizzes', activeSim.relatedQuizId, activeSim.subject)}
                className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-between transition shadow-xs active:scale-[0.99]"
              >
                <span>Take Quick Quiz (+50 XP)</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-200" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
