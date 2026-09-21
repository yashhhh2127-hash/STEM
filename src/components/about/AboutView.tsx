import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building,
  GraduationCap
} from 'lucide-react';
import { PROJECT_DETAILS } from '../../data/initialData';

export const AboutView: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Institutional Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" /> Academic Community Engagement Project
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
          {PROJECT_DETAILS.title}
        </h1>

        <div className="pt-2 text-xs sm:text-sm text-slate-300 space-y-1">
          <p className="font-semibold text-white">
            {PROJECT_DETAILS.institution}
          </p>
          <p className="text-teal-300 font-medium">
            {PROJECT_DETAILS.department}
          </p>
          <p className="text-slate-400">
            Palghar, Maharashtra, India
          </p>
        </div>
      </div>

      {/* Research & Survey Basis Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Research Foundation & Survey Methodology</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          From Student Survey to Digital Learning Ecosystem
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          This platform is not a static survey form; rather, it is the direct pedagogical answer to comprehensive field research conducted among secondary and junior-college students in Palghar district. The student survey identified key educational roadblocks:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <span className="font-bold text-rose-700 block">Identified Challenge 1:</span>
            <strong className="text-slate-900 text-sm block">Abstract Scientific Phenomena</strong>
            <p className="text-slate-600 leading-relaxed">
              Concepts like electric current flow, atomic orbital filling, and 2D kinematic trajectories are difficult to grasp from 2D textbook drawings alone.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <span className="font-bold text-rose-700 block">Identified Challenge 2:</span>
            <strong className="text-slate-900 text-sm block">Awareness of Free Digital Tools</strong>
            <p className="text-slate-600 leading-relaxed">
              Over 78% of surveyed students were unaware of free, high-quality open educational resources (such as PhET, GeoGebra, and Tinkercad).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <span className="font-bold text-rose-700 block">Identified Challenge 3:</span>
            <strong className="text-slate-900 text-sm block">Lack of Safe Coding Practice</strong>
            <p className="text-slate-600 leading-relaxed">
              Beginner students lack local software installations to write code and test algorithmic logic with immediate feedback.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <span className="font-bold text-rose-700 block">Identified Challenge 4:</span>
            <strong className="text-slate-900 text-sm block">Affordable Practical Science</strong>
            <p className="text-slate-600 leading-relaxed">
              High laboratory equipment costs limit hands-on experiments at home. Students expressed high interest in low-cost household science maker projects.
            </p>
          </div>
        </div>
      </div>

      {/* The 5-Step Pedagogical Model */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          The Pedagogical Model: {PROJECT_DETAILS.motto}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-1">
            <span className="text-xs font-bold text-blue-800 uppercase block">Step 1</span>
            <strong className="text-base font-black text-slate-900 block">Learn</strong>
            <p className="text-[11px] text-slate-600">Video lessons, concept maps, and core principles.</p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase block">Step 2</span>
            <strong className="text-base font-black text-slate-900 block">Explore</strong>
            <p className="text-[11px] text-slate-600">Interactive simulations with variable controls.</p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-1">
            <span className="text-xs font-bold text-amber-800 uppercase block">Step 3</span>
            <strong className="text-base font-black text-slate-900 block">Practice</strong>
            <p className="text-[11px] text-slate-600">Browser coding lab and household maker projects.</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-1">
            <span className="text-xs font-bold text-purple-800 uppercase block">Step 4</span>
            <strong className="text-base font-black text-slate-900 block">Test</strong>
            <p className="text-[11px] text-slate-600">Adaptive diagnostic quizzes with instant feedback.</p>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 space-y-1">
            <span className="text-xs font-bold text-rose-800 uppercase block">Step 5</span>
            <strong className="text-base font-black text-slate-900 block">Improve</strong>
            <p className="text-[11px] text-slate-600">Gamified streaks, daily challenges, and badges.</p>
          </div>
        </div>
      </div>

      {/* Institutional Mission & Academic Integrity */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Building className="w-5 h-5 text-teal-400" />
          SDES College Community Engagement Commitment
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The Department of Information Technology at Sonopant Dandekar College, Palghar, is committed to bridging the digital divide in STEM education. By leveraging modern web standards, free open educational resources, and interactive simulations, we ensure that every student has access to world-class learning tools regardless of institutional laboratory constraints.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
          <span>Official Project Document: AY 2025-26</span>
          <span>•</span>
          <span>Department of Information Technology</span>
          <span>•</span>
          <button
            onClick={() => navigateTo('privacy')}
            className="text-teal-400 hover:underline"
          >
            Academic Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};
