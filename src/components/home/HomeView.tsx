import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Atom,
  Compass,
  Flame,
  Search,
  Sparkles,
  PlayCircle,
  CheckSquare,
  Code,
  ArrowRight,
  Zap,
  CheckCircle2,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    navigateTo,
    setSearchModalOpen,
    videos,
    simulations,
    quizzes,
    codingProblems,
    activities,
  } = useApp();

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Clean & Spacious Platform Hero Section */}
      <section className="relative overflow-hidden pt-4 pb-8 sm:py-12 text-center max-w-4xl mx-auto">
        {/* Subtle Ambient Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Open Interactive Learning Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            SCIENCE,TECHNOLOGY, ENGINEERING & MATHEMATICS
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Interactive visual simulations, in-browser coding challenges, and adaptive quizzes. Built for genuine conceptual mastery with zero fees.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 max-w-xl mx-auto">
            <button
              onClick={() => navigateTo('videos')}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Watch Free Video Lessons</span>
            </button>

            <button
              onClick={() => navigateTo('simulations')}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-xl text-sm transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Interactive Simulations</span>
            </button>
          </div>

          {/* Access tiers pill banner */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-2 px-4 rounded-2xl bg-slate-100/90 border border-slate-200/90 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span><strong>Free Open Access:</strong> Video Lessons & Tools Hub</span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span><strong>Free Account Unlocks:</strong> Simulations, Coding Lab & Quizzes</span>
            </span>
          </div>

          {/* Quick Search Bar Trigger */}
          <div className="pt-2 max-w-xl mx-auto">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl shadow-xs text-xs sm:text-sm text-slate-400 hover:text-slate-600 flex items-center justify-between transition group"
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
                <span>Search topics (e.g. Projectile Kinematics, Ohm's Law, Python loops)...</span>
              </span>
              <kbd className="hidden sm:inline bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </section>

      {/* Clean Platform Metrics Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 text-center shadow-xs">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{simulations.length}</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Interactive Labs</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 text-center shadow-xs">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{videos.length}</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Video Lessons</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 text-center shadow-xs">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{quizzes.length}</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Adaptive Quizzes</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 text-center shadow-xs">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{codingProblems.length}</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Code Problems</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 text-center shadow-xs col-span-2 sm:col-span-1">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{activities.length}</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">STEM Projects</span>
        </div>
      </section>

      {/* The Four Pillars of STEM: Decongested Clean Cards */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/60 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Curriculum Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              The Four Pillars of STEM
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Choose a domain to start visual experiments and practice core concepts immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Science Card */}
          <div
            onClick={() => navigateTo('simulations', undefined, 'science')}
            className="group cursor-pointer p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition">
                <Atom className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Science
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Physics kinematics, Bohr atomic orbitals, photosynthesis, and animal & plant cellular biology.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 pt-2">
              Launch Science Labs <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Mathematics Card */}
          <div
            onClick={() => navigateTo('simulations', 'sim-graphing', 'mathematics')}
            className="group cursor-pointer p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Mathematics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Coordinate geometry, quadratic parabola transforms, and dynamic trigonometric wave visualizers.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 pt-2">
              Open 2D Grapher <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Technology Card */}
          <div
            onClick={() => navigateTo('coding', undefined, 'technology')}
            className="group cursor-pointer p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Technology
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Algorithmic problem solving, loop structures, conditionals, and real-time JavaScript execution.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 pt-2">
              Start Coding Lab <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Engineering Card */}
          <div
            onClick={() => navigateTo('simulations', 'sim-circuits', 'engineering')}
            className="group cursor-pointer p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Engineering
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                DC electrical circuit design, Ohm's law, robotic arm kinematics, and hands-on maker experiments.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 pt-2">
              Build DC Circuits <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </section>

      {/* Featured Interactive Simulation Spotlight - Clean Light Studio Card */}
      <section className="p-6 sm:p-10 bg-white rounded-3xl border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Laboratory</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            DC Circuit Builder & Ohm's Law Simulation
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            Experiment with voltage sources, current-limiting resistors, and light-emitting diodes safely in your browser. Watch real-time electron flow and understand foundational electrical principles before touching physical components.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold text-slate-700">Live Ammeter Current Readout</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold text-slate-700">Burnout Safety Warnings</span>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap gap-3">
            <button
              onClick={() => navigateTo('simulations', 'sim-circuits', 'engineering')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition shadow-xs flex items-center gap-2"
            >
              <span>Launch Circuit Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('quizzes', 'quiz-circuits', 'engineering')}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold rounded-xl text-sm transition"
            >
              Take Practice Quiz
            </button>
          </div>
        </div>

        {/* Clean Interactive Graphic Box */}
        <div
          onClick={() => navigateTo('simulations', 'sim-circuits', 'engineering')}
          className="lg:col-span-5 p-8 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 text-center cursor-pointer transition group flex flex-col items-center justify-center space-y-3 min-h-[240px]"
        >
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition duration-200">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Launch Live Workspace
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Click to open the interactive canvas with sliders for Voltage (V) and Resistance (Ω).
            </p>
          </div>
        </div>
      </section>

      {/* Suggested Paths Strip - Decongested Clean Cards */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Learning Roadmaps
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Structured Tracks by Grade Level
            </h2>
          </div>
          <button
            onClick={() => navigateTo('paths')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
          >
            View All Curricula <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            onClick={() => navigateTo('paths')}
            className="p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition cursor-pointer space-y-3"
          >
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
              Ages 10–13 • Middle School
            </span>
            <h4 className="text-base font-bold text-slate-900">
              Junior Scientist Foundation
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Living cells, atomic structure, kitchen chemistry, and everyday physical forces in nature.
            </p>
          </div>

          <div
            onClick={() => navigateTo('paths')}
            className="p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition cursor-pointer space-y-3"
          >
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-100">
              Ages 12–16 • Secondary
            </span>
            <h4 className="text-base font-bold text-slate-900">
              Future Coder & Logic Thinker
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Algorithmic logic, control loops, conditional branching, and 2D coordinate geometry.
            </p>
          </div>

          <div
            onClick={() => navigateTo('paths')}
            className="p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition cursor-pointer space-y-3"
          >
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 border border-purple-100">
              Ages 14–18 • Junior College
            </span>
            <h4 className="text-base font-bold text-slate-900">
              Physics & Robotics Kinematics
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              2D projectile kinematics, DC circuit design, and mechanical multi-joint degrees of freedom.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
