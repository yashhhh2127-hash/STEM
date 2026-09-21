import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  Lock,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Globe,
  Cpu,
  CheckSquare,
  Code,
  Flame,
  Zap,
  Compass,
  ShieldCheck,
  User,
  GraduationCap
} from 'lucide-react';

interface AuthRequiredGateProps {
  view: AppView;
  onOpenLogin: () => void;
}

const VIEW_METADATA: Record<
  string,
  {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    perks: string[];
  }
> = {
  simulations: {
    title: 'Interactive STEM Simulations',
    description:
      'Run physics kinematics, manipulate atomic orbital variables, and simulate live electric circuits with real-time graphs.',
    icon: <Cpu className="w-8 h-8 text-indigo-600" />,
    color: 'from-indigo-500/20 to-purple-500/20',
    perks: [
      'Interactive variable sliders & real-time math solvers',
      'Download experimental data plots & trajectory notes',
      'Earn Simulation Explorer milestone badges',
    ],
  },
  quizzes: {
    title: 'Adaptive STEM Quizzes & Tests',
    description:
      'Test your understanding with timed conceptual questions, step-by-step explanations, and difficulty progression.',
    icon: <CheckSquare className="w-8 h-8 text-emerald-600" />,
    color: 'from-emerald-500/20 to-teal-500/20',
    perks: [
      'Automated grading and detailed step-by-step solutions',
      'XP rewards for high scores and perfect rounds',
      'Track subject mastery across Science, Math & Tech',
    ],
  },
  coding: {
    title: 'In-Browser Coding Sandbox',
    description:
      'Practice algorithmic problem solving with live JavaScript execution, built-in test suites, and sample test cases.',
    icon: <Code className="w-8 h-8 text-blue-600" />,
    color: 'from-blue-500/20 to-indigo-500/20',
    perks: [
      'Built-in sandbox with real-time console output',
      'Automated test runner and edge-case evaluation',
      'Earn Coding Scholar badges as you solve problems',
    ],
  },
  activities: {
    title: 'Hands-on Practical STEM Activities',
    description:
      'Complete DIY science projects, engineering experiments, and guided lab protocols with real-world materials.',
    icon: <Flame className="w-8 h-8 text-rose-600" />,
    color: 'from-rose-500/20 to-orange-500/20',
    perks: [
      'Curated step-by-step lab procedures & safety guides',
      'Track completed experiments in your student profile',
      'Hands-on Maker achievements and certification',
    ],
  },
  challenges: {
    title: 'Weekly STEM Competitions & Challenges',
    description:
      'Compete with fellow scholars on weekly multidisciplinary STEM problem sets and climb the campus leaderboard.',
    icon: <Zap className="w-8 h-8 text-amber-600" />,
    color: 'from-amber-500/20 to-yellow-500/20',
    perks: [
      'Weekly refreshed challenge problems',
      'Bonus XP and exclusive scholar badges',
      'Palghar district learning community ranking',
    ],
  },
  dashboard: {
    title: 'Student Progress & Analytics Dashboard',
    description:
      'Monitor your learning streak, view accumulated XP, inspect badge unlocks, and analyze subject mastery breakdown.',
    icon: <Compass className="w-8 h-8 text-indigo-600" />,
    color: 'from-indigo-500/20 to-sky-500/20',
    perks: [
      'Continuous streak counter and XP tracker',
      'Subject mastery percentages for Science, Math & Tech',
      'Curriculum milestones and personalized recommendations',
    ],
  },
  profile: {
    title: 'Student Learning Profile & Scholar ID',
    description:
      'Manage your Palghar Junior STEM Scholars account, personalized grade level, and verified achievement credentials.',
    icon: <GraduationCap className="w-8 h-8 text-purple-600" />,
    color: 'from-purple-500/20 to-indigo-500/20',
    perks: [
      'Official Scholar ID and digital badge showcase',
      'Account settings & Google OAuth synchronization',
      'Exportable certificates of milestone completion',
    ],
  },
  admin: {
    title: 'Faculty & Admin Management Portal',
    description:
      'Manage video curriculum, author new interactive quizzes, track student engagement, and oversee STEM lab content.',
    icon: <ShieldCheck className="w-8 h-8 text-amber-600" />,
    color: 'from-amber-500/20 to-rose-500/20',
    perks: [
      'Create and update video lectures & quiz sets',
      'Real-time student enrollment analytics and metrics',
      'Role-based permissions with MongoDB backend',
    ],
  },
};

export const AuthRequiredGate: React.FC<AuthRequiredGateProps> = ({
  view,
  onOpenLogin,
}) => {
  const { navigateTo } = useApp();

  const metadata = VIEW_METADATA[view] || {
    title: 'Sign In to Unlock Full Access',
    description: 'This interactive tool requires a free student or faculty account to track your progress and results.',
    icon: <Lock className="w-8 h-8 text-indigo-600" />,
    color: 'from-indigo-500/20 to-purple-500/20',
    perks: [
      '100% Free student & faculty accounts',
      'Save your experiments, quiz scores, and coding progress',
      'One-click instant Google Sign-In popup',
    ],
  };

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative">
        {/* Decorative ambient gradient backdrop */}
        <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-r ${metadata.color} pointer-events-none`}></div>

        <div className="relative p-6 sm:p-10 space-y-6">
          {/* Header icon and badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200/60 flex items-center justify-center flex-shrink-0">
                {metadata.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                    <Lock className="w-3 h-3 text-amber-600" /> Account Required
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    100% Free
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  {metadata.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {metadata.description}
          </p>

          {/* Perks checklist */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              What you unlock with a free account:
            </p>
            <ul className="space-y-2">
              {metadata.perks.map((perk, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                    ✓
                  </div>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Call to action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenLogin}
              className="flex-1 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Sign In / Create Free Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={() => navigateTo('videos')}
              className="py-3.5 px-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-slate-500" />
              <span>Browse Free Video Lessons</span>
            </button>
          </div>

          {/* Free services footer notice */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              💡 Free open access available for <strong>Video Lessons</strong> & <strong>Tools Hub</strong> without logging in.
            </span>
            <button
              onClick={() => navigateTo('resources')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Explore Free Tools Hub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
