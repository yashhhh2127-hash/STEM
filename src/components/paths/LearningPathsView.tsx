import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Sparkles,
  PlayCircle,
  Cpu,
  CheckSquare,
  Lock,
  HelpCircle,
  Code,
  FlaskConical
} from 'lucide-react';
import { LearningPath } from '../../types';

export const LearningPathsView: React.FC = () => {
  const { learningPaths, currentStudent, navigateTo } = useApp();
  const [selectedPathId, setSelectedPathId] = useState<string>(learningPaths[0].id);

  const activePath = learningPaths.find((p) => p.id === selectedPathId) || learningPaths[0];

  const handleLaunchItem = (step: any) => {
    const targetId = step.referenceId || step.targetId;
    if (step.type === 'simulation') navigateTo('simulations', targetId);
    else if (step.type === 'video') navigateTo('videos', targetId);
    else if (step.type === 'quiz') navigateTo('quizzes', targetId);
    else if (step.type === 'coding') navigateTo('coding', targetId);
    else if (step.type === 'activity') navigateTo('activities', targetId);
    else navigateTo('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
              Guided Mastery
            </span>
            <span className="text-xs text-slate-300 font-medium">Curriculum Roadmaps</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Structured STEM Learning Paths
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Step-by-step journeys designed by the Department of IT to guide students from foundational concepts to advanced practical problem-solving.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-300 block">Available Tracks</span>
          <span className="text-3xl font-black text-white">{learningPaths.length}</span>
        </div>
      </div>

      {/* Path Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {learningPaths.map((path) => {
          const isSelected = path.id === selectedPathId;

          return (
            <button
              key={path.id}
              onClick={() => setSelectedPathId(path.id)}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {path.targetAge}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/60 px-2 py-0.5 rounded">
                    {path.estimatedHours} Hours
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {path.title}
                </h3>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
                <span>{(path.steps || path.items || []).length} Milestones</span>
                <span className="text-indigo-600 flex items-center">
                  View Track <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Path Journey Details */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Active Guided Track
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              {activePath.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activePath.description}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div className="p-2 bg-amber-500 rounded-xl text-slate-950 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Certificate Award
              </span>
              <span className="text-xs font-bold text-slate-900">
                {activePath.certificateName}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Steps Timeline */}
        {(() => {
          const activeSteps = activePath.steps || activePath.items || [];
          return (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Sequential Milestones ({activeSteps.length}):
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-100">
                {activeSteps.map((step, idx) => {
                  const isSim = step.type === 'simulation';
                  const isVideo = step.type === 'video';
                  const isQuiz = step.type === 'quiz';
                  const isCoding = step.type === 'coding';
                  const isActivity = step.type === 'activity';

                  return (
                    <div key={step.id} className="relative group">
                      {/* Timeline bullet */}
                      <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${
                            isSim ? 'bg-indigo-50 text-indigo-700' :
                            isVideo ? 'bg-teal-50 text-teal-700' :
                            isQuiz ? 'bg-amber-50 text-amber-700' :
                            isCoding ? 'bg-rose-50 text-rose-700' :
                            'bg-emerald-50 text-emerald-700'
                          }`}>
                            {isSim && <Compass className="w-5 h-5" />}
                            {isVideo && <PlayCircle className="w-5 h-5" />}
                            {isQuiz && <HelpCircle className="w-5 h-5" />}
                            {isCoding && <Code className="w-5 h-5" />}
                            {isActivity && <FlaskConical className="w-5 h-5" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Milestone {idx + 1} • {step.type}
                              </span>
                              {step.xp && (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.2 rounded">
                                  +{step.xp} XP
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                              {step.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                              {step.description || 'Complete this foundational STEM milestone to advance in the path.'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleLaunchItem(step)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm flex items-center gap-1.5 shrink-0"
                        >
                          Start Milestone <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
