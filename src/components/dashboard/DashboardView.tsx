import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  PlayCircle,
  Cpu,
  CheckSquare,
  Code,
  Flame,
  Award,
  Zap,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentStudent,
    videos,
    simulations,
    quizzes,
    codingProblems,
    navigateTo,
  } = useApp();

  // Next XP target (Level * 200)
  const nextLevelXp = currentStudent.level * 200;
  const currentLevelProgress = ((currentStudent.xp % 200) / 200) * 100;

  return (
    <div className="space-y-6">
      {/* Student Welcome Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Welcome back
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                {currentStudent.grade}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {currentStudent.name}
            </h1>
            <p className="text-xs text-slate-500">
              Ready to explore Science, Code, and Engineering today?
            </p>
          </div>
        </div>

        {/* Gamified stats badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 text-amber-800 font-bold text-xs mb-0.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Streak</span>
            </div>
            <span className="text-xl font-black text-amber-900 font-mono">
              {currentStudent.streakDays} Days
            </span>
          </div>

          <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-center min-w-[110px]">
            <div className="flex items-center justify-center gap-1 text-indigo-800 font-bold text-xs mb-0.5">
              <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              <span>Experience</span>
            </div>
            <span className="text-xl font-black text-indigo-900 font-mono">
              {currentStudent.xp} XP
            </span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 text-emerald-800 font-bold text-xs mb-0.5">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Level</span>
            </div>
            <span className="text-xl font-black text-emerald-900 font-mono">
              Rank {currentStudent.level}
            </span>
          </div>
        </div>
      </div>

      {/* Level XP Progress Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-700">
          <span>Level {currentStudent.level} Progress</span>
          <span className="text-indigo-600">{currentLevelProgress.toFixed(0)}% to Level {currentStudent.level + 1}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 transition-all duration-500"
            style={{ width: `${currentLevelProgress}%` }}
          />
        </div>
      </div>

      {/* Recommended Next Activities / Jump Back In */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recommended Simulation */}
        <div
          onClick={() => navigateTo('simulations', 'sim-projectile', 'science')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Simulation
              </span>
              <span className="text-[11px] font-bold text-slate-400">+35 XP</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition">
              Projectile Motion Lab
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              Explore 2D trajectory kinematics with gravity controls.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            Launch Simulation <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Recommended Quiz */}
        <div
          onClick={() => navigateTo('quizzes', 'quiz-newton', 'science')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                Knowledge Quiz
              </span>
              <span className="text-[11px] font-bold text-slate-400">+50 XP</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition">
              Newton's Laws Challenge
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              5 adaptive questions on inertia, forces, and action-reaction.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
            Start Quiz <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Recommended Coding */}
        <div
          onClick={() => navigateTo('coding', 'code-even', 'technology')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                Coding Lab
              </span>
              <span className="text-[11px] font-bold text-slate-400">+40 XP</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition">
              Even Numbers Filter
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              Write a modulo loop in JavaScript to extract even values.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
            Open Code Sandbox <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Daily Challenge shortcut */}
        <div
          onClick={() => navigateTo('challenges')}
          className="p-5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950 bg-white/40 px-2 py-0.5 rounded">
                Daily Mission
              </span>
              <span className="text-[11px] font-bold text-white/90">+75 XP</span>
            </div>
            <h3 className="text-sm font-black text-white">
              Kinetic Energy Puzzle
            </h3>
            <p className="text-xs text-amber-100 line-clamp-2">
              Solve today's brake distance scaling puzzle to maintain your streak!
            </p>
          </div>
          <span className="text-xs font-bold text-white flex items-center gap-1">
            Solve Daily <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Subject Progress Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900">
          Your Subject Mastery Progress
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(currentStudent.subjectMastery).map(([subject, pct]) => (
            <div key={subject} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold capitalize">
                <span className="text-slate-800">{subject}</span>
                <span className="text-indigo-600">{pct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <button
                onClick={() => navigateTo('simulations', undefined, subject as any)}
                className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                Explore {subject} <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
