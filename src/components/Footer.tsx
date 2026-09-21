import React from 'react';
import { useApp } from '../context/AppContext';
import { Atom, Compass, Cpu, Wrench, Shield, BookOpen, ExternalLink, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, navigateTo } = useApp();

  return (
    <footer className="bg-white text-slate-600 pt-12 pb-24 md:pb-12 border-t border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 pb-12 border-b border-slate-100">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                STEM<span className="text-indigo-600">Learn</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              An open-access digital learning platform engineered to make Science, Technology, Engineering, and Mathematics intuitive and engaging through hands-on simulations.
            </p>

            <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50/70 py-1.5 px-3 rounded-lg border border-indigo-100 w-fit font-medium">
              <span>Zero cost • No account required • Open to all</span>
            </div>
          </div>

          {/* Four Pillars */}
          <div className="space-y-3">
            <h4 className="text-slate-900 text-xs font-bold uppercase tracking-wider">
              Disciplines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('simulations', undefined, 'science')}
                  className="hover:text-indigo-600 transition flex items-center gap-1.5"
                >
                  <Atom className="w-3.5 h-3.5 text-emerald-500" /> Science (Physics & Bio)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('simulations', undefined, 'mathematics')}
                  className="hover:text-indigo-600 transition flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-500" /> Mathematics & Graphs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('coding', undefined, 'technology')}
                  className="hover:text-indigo-600 transition flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" /> Technology & Coding
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('activities', undefined, 'engineering')}
                  className="hover:text-indigo-600 transition flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-500" /> Engineering & Circuits
                </button>
              </li>
            </ul>
          </div>

          {/* Learning Modules */}
          <div className="space-y-3">
            <h4 className="text-slate-900 text-xs font-bold uppercase tracking-wider">
              Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('simulations')} className="hover:text-indigo-600 transition">
                  Interactive Simulations
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('coding')} className="hover:text-indigo-600 transition">
                  Coding Practice Sandbox
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('quizzes')} className="hover:text-indigo-600 transition">
                  Concept Mastery Quizzes
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('videos')} className="hover:text-indigo-600 transition">
                  Video Lessons Library
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('activities')} className="hover:text-indigo-600 transition">
                  Hands-on STEM Maker Projects
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div className="space-y-3">
            <h4 className="text-slate-900 text-xs font-bold uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('paths')} className="hover:text-indigo-600 transition">
                  Grade Learning Tracks
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('resources')} className="hover:text-indigo-600 transition">
                  Free Digital Tools Index
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('about')} className="hover:text-indigo-600 transition">
                  Pedagogical Framework
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('privacy')} className="hover:text-indigo-600 transition">
                  Student Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Note */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} STEMLearn. Built with open-source digital education tools.
          </p>
          <p className="text-slate-500">
            Interactive STEM Learning for curious minds.
          </p>
        </div>
      </div>
    </footer>
  );
};
