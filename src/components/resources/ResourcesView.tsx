import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Search,
  Filter,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { STEMResource } from '../../types';

export const ResourcesView: React.FC = () => {
  const { resources, navigateTo } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['all', 'simulation', 'graphing', 'electronics', 'coding', 'astronomy', 'curriculum'];

  const filtered = resources.filter((res) => {
    if (categoryFilter !== 'all' && res.category !== categoryFilter) return false;
    if (
      searchTerm &&
      !res.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !res.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !res.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-cyan-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30">
              Open Educational Resources (OER)
            </span>
            <span className="text-xs text-slate-300 font-medium">100% Free STEM Tools</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Curated Free Digital STEM Tools Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The survey conducted by the Department of IT revealed that most learners lack awareness of high-quality free tools. Here is our vetted institutional directory with guides and classroom tips.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-300 block">Verified Tools</span>
          <span className="text-3xl font-black text-white">{resources.length}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                categoryFilter === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tools (e.g., 'PhET', 'Circuits')..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
          />
        </div>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-100">
                  {res.category}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {res.ageGroup}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                  {res.description}
                </p>
              </div>

              {/* Classroom Tips / Best For Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Best For:
                </span>
                <p className="text-slate-700 font-medium">{res.bestFor}</p>
                <p className="text-[11px] text-teal-700 font-medium pt-1 border-t border-slate-200/60 mt-1">
                  💡 Tip: {res.howToUseTips}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {res.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* External Link Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Free & Open Access</span>
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer noopener"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Launch Tool</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
