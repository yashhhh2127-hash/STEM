import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  PlayCircle,
  Cpu,
  CheckSquare,
  Code,
  Flame,
  Globe,
  ArrowRight,
  Filter
} from 'lucide-react';
import { SubjectCategory } from '../../types';

export const GlobalSearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    searchQuery,
    setSearchQuery,
    videos,
    simulations,
    quizzes,
    codingProblems,
    activities,
    resources,
    navigateTo,
  } = useApp();

  const [subjectFilter, setSubjectFilter] = useState<SubjectCategory | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'simulation' | 'quiz' | 'coding' | 'activity' | 'resource'>('all');

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim() && subjectFilter === 'all' && typeFilter === 'all') {
      return [];
    }

    const q = searchQuery.toLowerCase().trim();

    const results: Array<{
      id: string;
      title: string;
      type: 'video' | 'simulation' | 'quiz' | 'coding' | 'activity' | 'resource';
      subject?: string;
      snippet: string;
      difficulty?: string;
      action: () => void;
    }> = [];

    // Search Videos
    if (typeFilter === 'all' || typeFilter === 'video') {
      videos.forEach((v) => {
        if (subjectFilter !== 'all' && v.subject !== subjectFilter) return;
        const match =
          !q ||
          v.title.toLowerCase().includes(q) ||
          v.topic.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.keyConcepts.some((c) => c.toLowerCase().includes(q));
        if (match) {
          results.push({
            id: v.id,
            title: v.title,
            type: 'video',
            subject: v.subject,
            snippet: v.description,
            difficulty: v.difficulty,
            action: () => {
              setSearchModalOpen(false);
              navigateTo('videos', v.id, v.subject);
            },
          });
        }
      });
    }

    // Search Simulations
    if (typeFilter === 'all' || typeFilter === 'simulation') {
      simulations.forEach((s) => {
        if (subjectFilter !== 'all' && s.subject !== subjectFilter) return;
        const match =
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.topic.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q);
        if (match) {
          results.push({
            id: s.id,
            title: s.name,
            type: 'simulation',
            subject: s.subject,
            snippet: s.description,
            difficulty: s.difficulty,
            action: () => {
              setSearchModalOpen(false);
              navigateTo('simulations', s.id, s.subject);
            },
          });
        }
      });
    }

    // Search Quizzes
    if (typeFilter === 'all' || typeFilter === 'quiz') {
      quizzes.forEach((quiz) => {
        if (subjectFilter !== 'all' && quiz.subject !== subjectFilter) return;
        const match =
          !q ||
          quiz.title.toLowerCase().includes(q) ||
          quiz.topic.toLowerCase().includes(q) ||
          quiz.description.toLowerCase().includes(q);
        if (match) {
          results.push({
            id: quiz.id,
            title: quiz.title,
            type: 'quiz',
            subject: quiz.subject,
            snippet: quiz.description,
            difficulty: quiz.difficulty,
            action: () => {
              setSearchModalOpen(false);
              navigateTo('quizzes', quiz.id, quiz.subject);
            },
          });
        }
      });
    }

    // Search Coding Problems
    if (typeFilter === 'all' || typeFilter === 'coding') {
      codingProblems.forEach((code) => {
        if (subjectFilter !== 'all' && code.subject !== subjectFilter) return;
        const match =
          !q ||
          code.title.toLowerCase().includes(q) ||
          code.topic.toLowerCase().includes(q) ||
          code.description.toLowerCase().includes(q);
        if (match) {
          results.push({
            id: code.id,
            title: code.title,
            type: 'coding',
            subject: code.subject,
            snippet: code.description,
            difficulty: code.difficulty,
            action: () => {
              setSearchModalOpen(false);
              navigateTo('coding', code.id, code.subject);
            },
          });
        }
      });
    }

    // Search Activities
    if (typeFilter === 'all' || typeFilter === 'activity') {
      activities.forEach((act) => {
        if (subjectFilter !== 'all' && act.subject !== subjectFilter) return;
        const match =
          !q ||
          act.title.toLowerCase().includes(q) ||
          act.objective.toLowerCase().includes(q) ||
          act.materials.some((m) => m.toLowerCase().includes(q));
        if (match) {
          results.push({
            id: act.id,
            title: act.title,
            type: 'activity',
            subject: act.subject,
            snippet: act.objective,
            difficulty: act.difficulty,
            action: () => {
              setSearchModalOpen(false);
              navigateTo('activities', act.id, act.subject);
            },
          });
        }
      });
    }

    // Search Resources
    if (typeFilter === 'all' || typeFilter === 'resource') {
      resources.forEach((res) => {
        const match =
          !q ||
          res.title.toLowerCase().includes(q) ||
          res.description.toLowerCase().includes(q) ||
          res.tags.some((t) => t.toLowerCase().includes(q));
        if (match) {
          results.push({
            id: res.id,
            title: res.title,
            type: 'resource',
            snippet: res.description,
            action: () => {
              setSearchModalOpen(false);
              navigateTo('resources');
            },
          });
        }
      });
    }

    return results;
  }, [searchQuery, subjectFilter, typeFilter, videos, simulations, quizzes, codingProblems, activities, resources, navigateTo, setSearchModalOpen]);

  if (!searchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search STEM topics (e.g., 'Newton', 'Circuits', 'Python', 'Atom', 'Cell')..."
            className="w-full text-slate-800 placeholder-slate-400 focus:outline-none text-base"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 bg-slate-100 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium"
          >
            <option value="all">All Subjects</option>
            <option value="science">Science</option>
            <option value="mathematics">Mathematics</option>
            <option value="technology">Technology</option>
            <option value="engineering">Engineering</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium"
          >
            <option value="all">All Types</option>
            <option value="video">Videos</option>
            <option value="simulation">Simulations</option>
            <option value="quiz">Quizzes</option>
            <option value="coding">Coding Lab</option>
            <option value="activity">Activities</option>
            <option value="resource">Free Resources</option>
          </select>

          <span className="ml-auto text-slate-400 font-medium">
            {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}
          </span>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-100">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-slate-600">
                {searchQuery ? `No results found for "${searchQuery}"` : 'Type a keyword to discover STEM resources'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching "Velocity", "Ohm", "Quadratic", "Factorial", "Photosynthesis", or "Arduino"
              </p>
            </div>
          ) : (
            filteredResults.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={item.action}
                className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition flex items-start gap-3 group"
              >
                <div
                  className={`p-2.5 rounded-lg flex-shrink-0 mt-0.5 ${
                    item.type === 'video'
                      ? 'bg-blue-50 text-blue-600'
                      : item.type === 'simulation'
                      ? 'bg-emerald-50 text-emerald-600'
                      : item.type === 'quiz'
                      ? 'bg-purple-50 text-purple-600'
                      : item.type === 'coding'
                      ? 'bg-amber-50 text-amber-600'
                      : item.type === 'activity'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-teal-50 text-teal-600'
                  }`}
                >
                  {item.type === 'video' && <PlayCircle className="w-5 h-5" />}
                  {item.type === 'simulation' && <Cpu className="w-5 h-5" />}
                  {item.type === 'quiz' && <CheckSquare className="w-5 h-5" />}
                  {item.type === 'coding' && <Code className="w-5 h-5" />}
                  {item.type === 'activity' && <Flame className="w-5 h-5" />}
                  {item.type === 'resource' && <Globe className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition text-sm">
                      {item.title}
                    </span>
                    <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.type}
                    </span>
                    {item.difficulty && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {item.difficulty}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.snippet}</p>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all self-center" />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
          <span>SDES Department of IT Community STEM Platform</span>
          <span>Press ESC or click outside to dismiss</span>
        </div>
      </div>
    </div>
  );
};
