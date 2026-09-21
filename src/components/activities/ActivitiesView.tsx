import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  BookOpen,
  CheckSquare,
  ShieldAlert,
  ArrowRight,
  Download
} from 'lucide-react';
import { STEMActivity, SubjectCategory } from '../../types';

export const ActivitiesView: React.FC = () => {
  const {
    activities,
    selectedActivityId,
    setSelectedActivityId,
    selectedSubject,
    setSelectedSubject,
    completeActivity,
    currentStudent,
    addToast,
  } = useApp();

  const [activeActivityId, setActiveActivityId] = useState<string>(selectedActivityId || activities[0].id);
  const activeActivity = activities.find((a) => a.id === activeActivityId) || activities[0];

  const [checkedMaterials, setCheckedMaterials] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [observationNotes, setObservationNotes] = useState<string>('');

  const isCompleted = currentStudent.completedActivities.includes(activeActivity.id);

  const toggleMaterial = (mat: string) => {
    setCheckedMaterials((prev) => ({ ...prev, [mat]: !prev[mat] }));
  };

  const toggleStep = (stepIdx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

  const handleFinishActivity = () => {
    completeActivity(activeActivity.id, activeActivity.xpReward);
  };

  const handleDownloadWorksheet = () => {
    const content =
      `STEM Practical Activity Worksheet\n` +
      `=================================\n` +
      `Experiment: ${activeActivity.title}\n` +
      `Subject: ${activeActivity.subject.toUpperCase()} | Time: ${activeActivity.duration}\n` +
      `Objective: ${activeActivity.objective}\n\n` +
      `MATERIALS NEEDED:\n${activeActivity.materials.map((m) => `[ ] ${m}`).join('\n')}\n\n` +
      `SAFETY PRECAUTIONS:\n${activeActivity.safetyNotes.map((s) => `! ${s}`).join('\n')}\n\n` +
      `STEP-BY-STEP PROCEDURE:\n${activeActivity.steps.map((st, i) => `${i + 1}. ${st}`).join('\n')}\n\n` +
      `THE SCIENTIFIC PRINCIPLE:\n${activeActivity.scientificPrinciple}\n\n` +
      `MY OBSERVATIONS:\n${observationNotes || 'Write observations here...'}\n\n` +
      `Institution: SDES Arts, Commerce & Science College, Palghar - Department of IT\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeActivity.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_worksheet.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    addToast({
      id: Date.now().toString(),
      type: 'info',
      title: 'Worksheet Downloaded',
      message: 'Take your STEM experiment sheet to the kitchen, classroom, or lab!',
    });
  };

  const filteredActivities = activities.filter((act) => {
    if (selectedSubject && selectedSubject !== 'all' && act.subject !== selectedSubject) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-900 via-pink-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30">
              Low-Cost Maker Projects
            </span>
            <span className="text-xs text-slate-300 font-medium">Household STEM Experiments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hands-on Practical STEM Activities
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Build real scientific prototypes and chemistry reactions using affordable everyday materials found at home or in standard school labs.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
          <div className="p-2.5 bg-rose-500 rounded-xl text-white font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-300 block font-medium">Activities Performed</span>
            <span className="text-lg font-black text-white">
              {currentStudent.completedActivities.length} / {activities.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter by Subject pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedSubject(undefined)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            !selectedSubject || selectedSubject === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          All Activities ({activities.length})
        </button>
        {(['science', 'mathematics', 'technology', 'engineering'] as SubjectCategory[]).map((subj) => {
          const count = activities.filter((a) => a.subject === subj).length;
          return (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                selectedSubject === subj
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {subj} ({count})
            </button>
          );
        })}
      </div>

      {/* Activity Details & Step-by-Step Lab Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Activity Blueprint & Steps (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Header & Meta */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="capitalize text-xs font-bold px-2.5 py-0.5 rounded bg-rose-50 text-rose-700">
                    {activeActivity.subject}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {activeActivity.duration}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    +{activeActivity.xpReward} XP
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {activeActivity.title}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Objective: {activeActivity.objective}
                </p>
              </div>

              <button
                onClick={handleDownloadWorksheet}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                title="Download Printable Activity Sheet"
              >
                <Download className="w-4 h-4" /> Printable Sheet
              </button>
            </div>

            {/* Safety Alerts Box */}
            <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Safety Precautions & Adult Guidance</span>
              </div>
              <ul className="text-xs text-amber-800 space-y-1 list-disc pl-4">
                {activeActivity.safetyNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>

            {/* Materials Checklist */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Required Household / School Materials:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeActivity.materials.map((mat, idx) => {
                  const isChecked = !!checkedMaterials[mat];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleMaterial(mat)}
                      className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center gap-3 transition ${
                        isChecked
                          ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900 line-through'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span>{mat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Step-by-Step Procedure:
              </h3>
              <div className="space-y-2.5">
                {activeActivity.steps.map((step, idx) => {
                  const isDone = !!completedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                        isDone
                          ? 'bg-indigo-50/50 border-indigo-200 text-indigo-950'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                          isDone ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scientific Principle Deep-Dive Box */}
            <div className="p-5 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                The Underlying Scientific Principle
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeActivity.scientificPrinciple}
              </p>
            </div>

            {/* Student Observation Journaling */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Your Laboratory Observations & Measurements:
              </label>
              <textarea
                value={observationNotes}
                onChange={(e) => setObservationNotes(e.target.value)}
                placeholder="Record what happened during the experiment: measurements, color changes, time taken, surprising results..."
                rows={3}
                className="w-full text-xs p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {/* Completion Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Complete all steps and claim +{activeActivity.xpReward} XP!
              </span>

              <button
                onClick={handleFinishActivity}
                disabled={isCompleted}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-md ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCompleted ? 'Activity Finished (XP Added)' : 'Complete & Earn 60 XP'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Catalog (1 Col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              STEM Activity Catalog ({filteredActivities.length})
            </h3>
            <span className="text-xs text-slate-400">Select to load</span>
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredActivities.map((act) => {
              const isCurrent = act.id === activeActivityId;
              const hasDone = currentStudent.completedActivities.includes(act.id);

              return (
                <button
                  key={act.id}
                  onClick={() => {
                    setActiveActivityId(act.id);
                    setSelectedActivityId(act.id);
                    setCheckedMaterials({});
                    setCompletedSteps({});
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-rose-50/80 border-rose-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-2.5 bg-rose-100 text-rose-700 rounded-lg flex-shrink-0 mt-0.5">
                    <Flame className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {act.subject}
                      </span>
                      {hasDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                      {act.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{act.duration}</span>
                      <span className="text-rose-600 font-semibold">+{act.xpReward} XP</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
