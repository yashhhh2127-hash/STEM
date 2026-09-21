import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Zap,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  RotateCcw,
  LogOut,
  Shield
} from 'lucide-react';
import { DEMO_STUDENTS } from '../../data/initialData';

export const StudentProfileView: React.FC = () => {
  const { currentStudent, setCurrentStudent, setCurrentStudentId, navigateTo, addToast, authUser, logoutAdmin } = useApp();

  const handleSwitchStudent = (studentId: string) => {
    setCurrentStudentId(studentId);
    const found = DEMO_STUDENTS.find((s) => s.id === studentId);
    if (found) {
      setCurrentStudent(found);
      addToast({
        id: Date.now().toString(),
        type: 'info',
        title: 'Switched Active Student',
        message: `Now browsing as ${found.name} (${found.grade}).`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900">
                {currentStudent.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                {currentStudent.grade}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                Level {currentStudent.level} Scholar
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Student ID: <span className="font-mono text-slate-700">{currentStudent.id}</span> • Member of Palghar Junior STEM Scholars Program
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl text-xs font-bold text-amber-800 border border-amber-200">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{currentStudent.streakDays} Day Learning Streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-xl text-xs font-bold text-indigo-800 border border-indigo-200">
                <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                <span>{currentStudent.xp} Total XP</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-800 border border-emerald-200">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{currentStudent.badges.length} Badges Earned</span>
              </div>
            </div>
          </div>

          {/* Authenticated Account Details & Actions */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center sm:text-left space-y-3 min-w-[240px]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Logged In Account:
              </span>
              <p className="text-xs font-bold text-slate-800 truncate">
                {authUser?.email || 'student@stemlearn.local'}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                  {authUser?.role || 'Student'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {authUser?.provider === 'google' ? '• Google OAuth' : '• Email / Password'}
                </span>
              </div>
            </div>

            <button
              onClick={logoutAdmin}
              className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of STEM Learn</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Breakdown & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Mastery Progress */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Subject Mastery Breakdown
          </h2>

          <div className="space-y-4">
            {Object.entries(currentStudent.subjectMastery).map(([subj, pct]) => {
              const color =
                subj === 'science'
                  ? 'from-emerald-500 to-teal-500'
                  : subj === 'mathematics'
                  ? 'from-blue-500 to-indigo-500'
                  : subj === 'technology'
                  ? 'from-amber-500 to-orange-500'
                  : 'from-rose-500 to-pink-500';

              return (
                <div key={subj} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700 capitalize">
                    <span>{subj}</span>
                    <span className="text-slate-900">{pct}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity & Milestone Counters */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Completed Curricula Summary
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-xs text-slate-500 block font-medium">Video Lessons</span>
              <span className="text-2xl font-black text-slate-900">
                {currentStudent.completedVideos.length}
              </span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-xs text-slate-500 block font-medium">Simulations Run</span>
              <span className="text-2xl font-black text-emerald-600">
                {currentStudent.completedSimulations.length}
              </span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-xs text-slate-500 block font-medium">Quizzes Passed</span>
              <span className="text-2xl font-black text-purple-600">
                {Object.keys(currentStudent.quizScores).length}
              </span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-xs text-slate-500 block font-medium">Coding Challenges</span>
              <span className="text-2xl font-black text-amber-600">
                {currentStudent.completedCoding.length}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('challenges')}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <span>View Badges & Printable Certificate</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
