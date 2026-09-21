import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Users,
  Award,
  PlayCircle,
  CheckSquare,
  Flame,
  Code,
  Globe,
  TrendingUp,
  BarChart2,
  Search,
  CheckCircle2,
  X,
  FileText,
  Database,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  Server,
  LogOut,
  Check
} from 'lucide-react';
import { EducationalVideo, Quiz, STEMActivity, CodingProblem, STEMResource, SubjectCategory } from '../../types';
import { authApi, AuthUser, SystemStatus } from '../../services/api';

type AdminTab = 'analytics' | 'videos' | 'quizzes' | 'activities' | 'coding' | 'resources' | 'students' | 'users' | 'database';

export const AdminDashboardView: React.FC = () => {
  const {
    videos,
    addVideo,
    deleteVideo,
    quizzes,
    addQuiz,
    deleteQuiz,
    activities,
    addActivity,
    deleteActivity,
    codingProblems,
    addCodingProblem,
    deleteCodingProblem,
    resources,
    addResource,
    deleteResource,
    currentStudent,
    addToast,
    authUser,
    logoutAdmin,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // Registered Users (MongoDB) State
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // MongoDB Database Health State
  const [dbHealth, setDbHealth] = useState<SystemStatus['database'] | null>(null);
  const [loadingDb, setLoadingDb] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await authApi.getUsers();
      if (res.success && res.users) {
        setRegisteredUsers(res.users);
      }
    } catch {
      // offline or server not running
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchDbHealth = async () => {
    setLoadingDb(true);
    try {
      const res = await authApi.getSystemStatus();
      if (res.database) {
        setDbHealth(res.database);
      }
    } catch {
      setDbHealth(null);
    } finally {
      setLoadingDb(false);
    }
  };

  React.useEffect(() => {
    fetchDbHealth();
  }, []);

  React.useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'database') {
      fetchDbHealth();
    }
  }, [activeTab]);

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'faculty' | 'student') => {
    try {
      const res = await authApi.updateUserRole(userId, newRole);
      if (res.success) {
        setRegisteredUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        addToast('success', 'Role Updated', `User role modified to ${newRole}`);
      }
    } catch (err: any) {
      addToast('info', 'Update Notice', err.message || 'Could not update role in MongoDB');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this user from MongoDB?')) return;
    try {
      const res = await authApi.deleteUser(userId);
      if (res.success) {
        setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
        addToast('success', 'User Removed', 'User deleted from MongoDB');
      }
    } catch (err: any) {
      addToast('info', 'Delete Notice', err.message || 'Could not delete user from MongoDB');
    }
  };

  // Video Form Modal State
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoSubject, setNewVideoSubject] = useState<SubjectCategory>('science');
  const [newVideoTopic, setNewVideoTopic] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [newVideoDuration, setNewVideoDuration] = useState('10:00');
  const [newVideoAuthor, setNewVideoAuthor] = useState('SDES IT Faculty');
  const [newVideoDesc, setNewVideoDesc] = useState('');

  // Quiz Form Modal State
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizSubject, setNewQuizSubject] = useState<SubjectCategory>('science');
  const [newQuizTopic, setNewQuizTopic] = useState('');
  const [newQuizDesc, setNewQuizDesc] = useState('');

  // Activity Form Modal State
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [newActTitle, setNewActTitle] = useState('');
  const [newActSubject, setNewActSubject] = useState<SubjectCategory>('science');
  const [newActDuration, setNewActDuration] = useState('30 mins');
  const [newActObjective, setNewActObjective] = useState('');
  const [newActMaterials, setNewActMaterials] = useState('');

  // Handle Video Submit
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const video: EducationalVideo = {
      id: `vid-${Date.now()}`,
      title: newVideoTitle,
      subject: newVideoSubject,
      topic: newVideoTopic,
      duration: newVideoDuration,
      videoUrl: newVideoUrl,
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=60',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=60',
      description: newVideoDesc || 'Institutional video lesson.',
      author: newVideoAuthor,
      learningObjectives: ['Understand core concepts', 'Observe experimental demonstration'],
      keyConcepts: [newVideoTopic, 'Scientific Principles'],
      timestamps: [{ time: '0:00', title: 'Introduction' }, { time: '3:00', title: 'Demonstration' }],
      xpReward: 30,
      difficulty: 'beginner',
    };
    addVideo(video);
    setVideoModalOpen(false);
    setNewVideoTitle('');
    setNewVideoDesc('');
  };

  // Handle Quiz Submit
  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: newQuizTitle,
      subject: newQuizSubject,
      topic: newQuizTopic,
      difficulty: 'intermediate',
      xpReward: 50,
      description: newQuizDesc || 'Institutional curriculum quiz.',
      questions: [
        {
          id: 'q1',
          question: `Which fundamental principle is central to ${newQuizTopic}?`,
          options: ['Conservation of Energy', 'Boyle’s Law', 'Ohm’s Law', 'Coulomb’s Law'],
          correctAnswer: 0,
          explanation: 'Conservation of energy applies universally across physical systems.',
        },
      ],
    };
    addQuiz(quiz);
    setQuizModalOpen(false);
    setNewQuizTitle('');
    setNewQuizDesc('');
  };

  // Handle Activity Submit
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const act: STEMActivity = {
      id: `act-${Date.now()}`,
      title: newActTitle,
      subject: newActSubject,
      duration: newActDuration,
      objective: newActObjective,
      materials: newActMaterials.split(',').map((m) => m.trim()),
      steps: [
        'Assemble your household materials on a clean work surface.',
        'Follow safety guidelines and perform the preliminary reaction test.',
        'Record time, temperature, and visual observations.',
      ],
      safetyNotes: ['Adult supervision recommended for younger students.'],
      scientificPrinciple: 'Empirical chemical and physical principles in everyday materials.',
      difficulty: 'beginner',
      xpReward: 60,
    };
    addActivity(act);
    setActivityModalOpen(false);
    setNewActTitle('');
    setNewActObjective('');
    setNewActMaterials('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Department of IT CMS & Analytics
            </span>
            <span className="text-xs text-slate-300 font-medium">Administrator Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Curriculum Management & Learning Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage open educational video lectures, interactive quizzes, household experiments, coding challenges, and monitor student engagement metrics.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right flex flex-col items-end justify-between gap-2 min-w-[200px]">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Logged In Staff</span>
            <span className="text-xs font-bold text-white flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {authUser?.name || 'Faculty / Admin'}
            </span>
            <span className="text-[10px] text-amber-300 block font-mono">
              {authUser?.role?.toUpperCase() || 'ADMIN'} • {authUser?.email || 'MongoDB'}
            </span>
          </div>
          <button
            onClick={logoutAdmin}
            className="px-2.5 py-1 bg-white/10 hover:bg-rose-500/80 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition mt-1"
          >
            <LogOut className="w-3 h-3" /> Log Out
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Analytics
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Registered Users ({registeredUsers.length || (dbHealth?.userCount ?? 'DB')})
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'database'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" /> MongoDB {dbHealth?.connected ? '🟢' : '⚪'}
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PlayCircle className="w-4 h-4" /> Videos ({videos.length})
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'quizzes'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Quizzes ({quizzes.length})
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'activities'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" /> Activities ({activities.length})
        </button>

        <button
          onClick={() => setActiveTab('coding')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'coding'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Code className="w-4 h-4" /> Coding ({codingProblems.length})
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'resources'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" /> Free Tools ({resources.length})
        </button>
      </div>

      {/* Tab 1: Student Engagement Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Registered Learners
              </span>
              <div className="text-2xl font-black text-slate-900">1,248</div>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18% growth this month (Palghar Schools)
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Average Quiz Mastery
              </span>
              <div className="text-2xl font-black text-indigo-600">82.4%</div>
              <p className="text-[11px] text-slate-500">
                Based on 4,820 quiz submission logs
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Simulation Interactions
              </span>
              <div className="text-2xl font-black text-emerald-600">6,190</div>
              <p className="text-[11px] text-slate-500">
                Avg. session duration: 14.2 minutes
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Weekly Active Streak
              </span>
              <div className="text-2xl font-black text-amber-600">4.8 Days</div>
              <p className="text-[11px] text-slate-500">
                High student retention in Junior Scientist Track
              </p>
            </div>
          </div>

          {/* Survey Research Correlation Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Student Needs Survey vs. Platform Adoption Insights
              </h3>
              <p className="text-xs text-slate-500">
                Direct correlation between initial Palghar student survey requirements and current engagement analytics.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="p-3 font-bold">Survey Identified Roadblock</th>
                    <th className="p-3 font-bold">Platform Intervention Module</th>
                    <th className="p-3 font-bold">Student Engagement Rate</th>
                    <th className="p-3 font-bold">Impact Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-medium">Difficulty visualizing kinematics & Newton's laws</td>
                    <td className="p-3">Projectile Motion Simulation Lab</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">92% completion</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">High Mastery</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Unaware of free math graphing software</td>
                    <td className="p-3">2D Function Grapher & GeoGebra guides</td>
                    <td className="p-3 font-mono font-bold text-indigo-600">84% completion</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">High Mastery</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">No prior coding practice environment</td>
                    <td className="p-3">Beginner In-Browser Coding Sandbox</td>
                    <td className="p-3 font-mono font-bold text-amber-600">79% completion</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">Active Progress</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">High cost of laboratory science supplies</td>
                    <td className="p-3">Hands-on Household Maker Activities</td>
                    <td className="p-3 font-mono font-bold text-rose-600">88% completion</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">High Mastery</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Videos CMS */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Video Lectures Library ({videos.length})
            </h3>
            <button
              onClick={() => setVideoModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Video Lesson
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="p-3 font-bold">Lesson Title</th>
                    <th className="p-3 font-bold">Subject</th>
                    <th className="p-3 font-bold">Duration</th>
                    <th className="p-3 font-bold">Author/Source</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {videos.map((vid) => (
                    <tr key={vid.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">
                        {vid.title}
                      </td>
                      <td className="p-3 capitalize">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                          {vid.subject}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{vid.duration}</td>
                      <td className="p-3 text-slate-500">{vid.author}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteVideo(vid.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Lesson"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Quizzes CMS */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Diagnostic Quizzes ({quizzes.length})
            </h3>
            <button
              onClick={() => setQuizModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create New Quiz
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="p-3 font-bold">Quiz Title</th>
                    <th className="p-3 font-bold">Subject</th>
                    <th className="p-3 font-bold">Difficulty</th>
                    <th className="p-3 font-bold">Questions</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">
                        {quiz.title}
                      </td>
                      <td className="p-3 capitalize">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">
                          {quiz.subject}
                        </span>
                      </td>
                      <td className="p-3 capitalize">{quiz.difficulty}</td>
                      <td className="p-3 font-mono">{quiz.questions.length} questions</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteQuiz(quiz.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Quiz"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Practical Activities CMS */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Hands-on STEM Experiments ({activities.length})
            </h3>
            <button
              onClick={() => setActivityModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Practical Activity
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="p-3 font-bold">Activity Title</th>
                    <th className="p-3 font-bold">Subject</th>
                    <th className="p-3 font-bold">Duration</th>
                    <th className="p-3 font-bold">Materials Count</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">
                        {act.title}
                      </td>
                      <td className="p-3 capitalize">
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-medium">
                          {act.subject}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{act.duration}</td>
                      <td className="p-3 font-mono">{act.materials.length} items</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteActivity(act.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Activity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Coding Challenges CMS */}
      {activeTab === 'coding' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Coding Challenges ({codingProblems.length})
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="p-3 font-bold">Problem Title</th>
                    <th className="p-3 font-bold">Language</th>
                    <th className="p-3 font-bold">Difficulty</th>
                    <th className="p-3 font-bold">Test Cases</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {codingProblems.map((cp) => (
                    <tr key={cp.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">
                        {cp.title}
                      </td>
                      <td className="p-3 font-mono uppercase text-indigo-600">{cp.language}</td>
                      <td className="p-3 capitalize">{cp.difficulty}</td>
                      <td className="p-3 font-mono">{cp.testCases.length} cases</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteCodingProblem(cp.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Coding Problem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Resources CMS */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Vetted Free Digital Tools ({resources.length})
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="p-3 font-bold">Tool Name</th>
                    <th className="p-3 font-bold">Category</th>
                    <th className="p-3 font-bold">Age Group</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {resources.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{res.title}</td>
                      <td className="p-3 capitalize">{res.category}</td>
                      <td className="p-3">{res.ageGroup}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteResource(res.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Tool"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Registered Users (MongoDB) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Registered Users — MongoDB ({registeredUsers.length})
            </h3>
            <button
              onClick={fetchUsers}
              disabled={loadingUsers}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
              {loadingUsers ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search users by name or email…"
              className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="p-3 font-bold">Name</th>
                    <th className="p-3 font-bold">Email</th>
                    <th className="p-3 font-bold">Role</th>
                    <th className="p-3 font-bold">Provider</th>
                    <th className="p-3 font-bold">Joined</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {registeredUsers
                    .filter(
                      (u) =>
                        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearch.toLowerCase())
                    )
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          {u.name}
                        </td>
                        <td className="p-3 text-slate-500 font-mono">{u.email}</td>
                        <td className="p-3">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleUpdateRole(u.id, e.target.value as 'admin' | 'faculty' | 'student')
                            }
                            className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none"
                          >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.provider === 'google'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {u.provider === 'google' ? '🔵 Google' : '🔑 Local'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 font-mono">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Remove User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {registeredUsers.length === 0 && !loadingUsers && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-semibold">No users found in MongoDB</p>
                        <p className="text-[11px] mt-1">Make sure the backend server is running on port 5000.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: MongoDB Database Health */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">MongoDB Database Health</h3>
            <button
              onClick={fetchDbHealth}
              disabled={loadingDb}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingDb ? 'animate-spin' : ''}`} />
              {loadingDb ? 'Checking…' : 'Refresh Status'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Connection Status */}
            <div className={`p-5 rounded-2xl border shadow-xs space-y-2 ${
              dbHealth?.connected
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-center gap-2">
                <Server className={`w-5 h-5 ${dbHealth?.connected ? 'text-emerald-600' : 'text-rose-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Connection</span>
              </div>
              <div className={`text-lg font-black ${dbHealth?.connected ? 'text-emerald-700' : 'text-rose-600'}`}>
                {dbHealth == null ? '⏳ Checking…' : dbHealth.connected ? '✅ Connected' : '❌ Disconnected'}
              </div>
              {dbHealth?.host && (
                <p className="text-[11px] text-slate-500 font-mono truncate">{dbHealth.host}</p>
              )}
            </div>

            {/* User Count */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Registered Users</span>
              </div>
              <div className="text-2xl font-black text-indigo-600">
                {dbHealth?.userCount ?? '—'}
              </div>
              <p className="text-[11px] text-slate-500">Total accounts in MongoDB collection</p>
            </div>

            {/* Database Name */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Database</span>
              </div>
              <div className="text-lg font-black text-slate-800 font-mono truncate">
                {dbHealth?.dbName ?? 'stem_db'}
              </div>
              <p className="text-[11px] text-slate-500">Active Mongoose connection</p>
            </div>
          </div>

          {/* Connection Guide */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 space-y-3 text-xs">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">Backend Setup Guide</span>
            </div>
            <p className="text-slate-400 leading-relaxed">Ensure the following in your <code className="bg-slate-800 px-1 py-0.5 rounded">.env</code> file at the project root:</p>
            <pre className="bg-slate-800 rounded-xl p-4 overflow-x-auto text-emerald-300 font-mono text-[11px] leading-relaxed">
{`MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/stem_db
JWT_SECRET=your_super_secret_key
GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
PORT=5000`}
            </pre>
            <p className="text-slate-400">Then run the backend with: <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">npm run server</code></p>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Add New Video Lesson</h3>
              <button onClick={() => setVideoModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lesson Title</label>
                <input
                  type="text"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="e.g. Exploring Newton's Laws"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newVideoSubject}
                    onChange={(e) => setNewVideoSubject(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  >
                    <option value="science">Science</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="technology">Technology</option>
                    <option value="engineering">Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={newVideoTopic}
                    onChange={(e) => setNewVideoTopic(e.target.value)}
                    placeholder="e.g. Classical Mechanics"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newVideoDuration}
                    onChange={(e) => setNewVideoDuration(e.target.value)}
                    placeholder="12:30"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Author / Faculty</label>
                  <input
                    type="text"
                    value={newVideoAuthor}
                    onChange={(e) => setNewVideoAuthor(e.target.value)}
                    placeholder="Faculty Member"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Embed URL (YouTube iframe src)</label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={newVideoDesc}
                  onChange={(e) => setNewVideoDesc(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  placeholder="Summary of concepts covered..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Save Video Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {quizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Create New Quiz</h3>
              <button onClick={() => setQuizModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuiz} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quiz Title</label>
                <input
                  type="text"
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  placeholder="e.g. Thermodynamics Diagnostic"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newQuizSubject}
                    onChange={(e) => setNewQuizSubject(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  >
                    <option value="science">Science</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="technology">Technology</option>
                    <option value="engineering">Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={newQuizTopic}
                    onChange={(e) => setNewQuizTopic(e.target.value)}
                    placeholder="e.g. Heat Transfer"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={newQuizDesc}
                  onChange={(e) => setNewQuizDesc(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  placeholder="Test overview..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuizModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Save Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity Modal */}
      {activityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Add Practical Experiment</h3>
              <button onClick={() => setActivityModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Experiment Title</label>
                <input
                  type="text"
                  value={newActTitle}
                  onChange={(e) => setNewActTitle(e.target.value)}
                  placeholder="e.g. Solar Water Purification"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newActSubject}
                    onChange={(e) => setNewActSubject(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  >
                    <option value="science">Science</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="technology">Technology</option>
                    <option value="engineering">Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newActDuration}
                    onChange={(e) => setNewActDuration(e.target.value)}
                    placeholder="25 mins"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Objective</label>
                <input
                  type="text"
                  value={newActObjective}
                  onChange={(e) => setNewActObjective(e.target.value)}
                  placeholder="Observe condensation and evaporation..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Household Materials (comma separated)</label>
                <input
                  type="text"
                  value={newActMaterials}
                  onChange={(e) => setNewActMaterials(e.target.value)}
                  placeholder="Plastic bowl, cling wrap, small pebble, water"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActivityModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
