import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Award,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Download,
  ShieldCheck,
  Trophy,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { BADGES_LIST } from '../../data/initialData';

export const ChallengesView: React.FC = () => {
  const { currentStudent, addXp, addToast, navigateTo } = useApp();

  const [dailyAnswer, setDailyAnswer] = useState<string>('');
  const [dailySubmitted, setDailySubmitted] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Daily Challenge
  const dailyChallenge = {
    title: 'Kinetic Energy vs Velocity Tradeoff',
    subject: 'Physics',
    difficulty: 'Intermediate',
    xp: 75,
    scenario:
      'A car traveling at 30 km/h requires 10 meters of stopping distance under emergency braking. If the vehicle doubles its speed to 60 km/h on the same asphalt surface, how many meters will the stopping distance become, assuming constant braking force?',
    options: ['20 meters', '30 meters', '40 meters (Proportional to v²)', '15 meters'],
    correctOption: 2,
    explanation:
      'Kinetic Energy formula is KE = 0.5 · m · v². When speed doubles (2×), kinetic energy quadruples (2² = 4×). Because Work done by friction W = F · d must equal KE, the stopping distance quadruples from 10m to 40m!',
  };

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleDailySubmit = () => {
    if (selectedOption === null) return;
    setDailySubmitted(true);
    if (selectedOption === dailyChallenge.correctOption) {
      addXp(dailyChallenge.xp);
      addToast({
        id: Date.now().toString(),
        type: 'xp',
        title: 'Daily Challenge Solved! ⚡',
        message: `Outstanding! You earned +${dailyChallenge.xp} XP for reasoning with kinetic energy quadratic scaling.`,
      });
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-800 via-orange-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
              STEM Arenas & Gamification
            </span>
            <span className="text-xs text-slate-300 font-medium">Daily & Weekly Missions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            STEM Challenges & Honor Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Apply multi-step analytical reasoning to real-world engineering puzzles, maintain your daily study streak, and unlock verified certificates.
          </p>
        </div>

        <div className="flex items-center gap-4 self-start md:self-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <div className="text-center">
            <span className="text-[10px] text-slate-300 uppercase font-bold block">Current Level</span>
            <span className="text-2xl font-black text-amber-400">Level {currentStudent.level}</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <span className="text-[10px] text-slate-300 uppercase font-bold block">Total XP</span>
            <span className="text-2xl font-black text-white">{currentStudent.xp}</span>
          </div>
        </div>
      </div>

      {/* Main Challenge Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Mission Card (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Daily STEM Challenge
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Refreshes every 24 hours
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                +{dailyChallenge.xp} XP
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                {dailyChallenge.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {dailyChallenge.scenario}
              </p>
            </div>

            {/* Options list */}
            <div className="space-y-2.5">
              {dailyChallenge.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === dailyChallenge.correctOption;

                let style = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50';
                if (isSelected && !dailySubmitted) {
                  style = 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20';
                } else if (dailySubmitted) {
                  if (isCorrect) {
                    style = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 font-medium';
                  } else if (isSelected && !isCorrect) {
                    style = 'border-rose-500 bg-rose-50 text-rose-900';
                  } else {
                    style = 'opacity-50 border-slate-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !dailySubmitted && setSelectedOption(idx)}
                    disabled={dailySubmitted}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${style}`}
                  >
                    <span>{opt}</span>
                    {dailySubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box on submit */}
            {dailySubmitted && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-1 ${
                  selectedOption === dailyChallenge.correctOption
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {selectedOption === dailyChallenge.correctOption
                    ? '✓ Correct Solution'
                    : 'Review the Quadratic Relationship:'}
                </div>
                <p className="text-slate-700 leading-relaxed">{dailyChallenge.explanation}</p>
              </div>
            )}

            {!dailySubmitted ? (
              <button
                onClick={handleDailySubmit}
                disabled={selectedOption === null}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-amber-200"
              >
                Submit Daily Solution
              </button>
            ) : (
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Solved for today! Keep up your streak!
              </div>
            )}
          </div>

          {/* Certificate Generation & Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Official STEM Achievement Certificate
                </h3>
                <p className="text-xs text-slate-500">
                  Issued under the Community Engagement Project by SDES College, Palghar.
                </p>
              </div>

              <button
                onClick={() => setShowCertificate(!showCertificate)}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trophy className="w-4 h-4" />
                {showCertificate ? 'Hide Certificate' : 'Preview & Print Certificate'}
              </button>
            </div>

            {showCertificate && (
              <div className="p-8 bg-gradient-to-br from-amber-50/50 via-white to-indigo-50/50 border-4 border-double border-indigo-900/40 rounded-3xl text-center space-y-5 shadow-lg max-w-2xl mx-auto my-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white mx-auto flex items-center justify-center font-bold">
                  SDES
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Sonopant Dandekar Shikshan Mandali
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Sonopant Dandekar Arts, V.S. Apte Commerce and M.H. Mehta Science College, Palghar
                  </p>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
                    Department of Information Technology • Community Engagement Project
                  </p>
                </div>

                <div className="py-2 border-y border-indigo-100">
                  <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
                    This certifies that
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {currentStudent.name}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                    has successfully demonstrated active engagement, analytical inquiry, and foundational STEM mastery on the Free Digital Learning Platform.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Achieved XP</span>
                    <strong className="text-slate-900 font-mono">{currentStudent.xp} XP</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Rank Level</span>
                    <strong className="text-indigo-600 font-mono">Level {currentStudent.level} Scholar</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Date Verified</span>
                    <strong className="text-slate-900 font-mono">{new Date().toLocaleDateString()}</strong>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-end text-left border-t border-slate-200 text-[11px] text-slate-400">
                  <div>
                    <span className="block font-bold text-slate-800">Project Mentor & Lead</span>
                    <span>Department of Information Technology</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-slate-800">Palghar, Maharashtra</span>
                    <span>Accredited Academic Initiative</span>
                  </div>
                </div>

                <button
                  onClick={handlePrintCertificate}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 mx-auto"
                >
                  <Download className="w-4 h-4" /> Print / Save as PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Badges & Honors Gallery (1 Col) */}
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                STEM Badges Gallery
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {currentStudent.badges.length} Unlocked
              </span>
            </div>

            <div className="space-y-2.5">
              {BADGES_LIST.map((badge) => {
                const unlocked = currentStudent.badges.some((b) => b.id === badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border transition flex items-start gap-3 ${
                      unlocked
                        ? 'bg-amber-50/50 border-amber-300/80 shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                        unlocked ? 'bg-amber-100 shadow-inner' : 'bg-slate-200 grayscale'
                      }`}
                    >
                      {badge.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {badge.name}
                        </h4>
                        {unlocked && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
