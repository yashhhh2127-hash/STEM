import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  VideoLesson,
  SimulationConfig,
  Quiz,
  CodingProblem,
  STEMActivity,
  STEMChallenge,
  Badge,
  LearningPath,
  FreeResource,
  StudentProfile,
  QuizAttempt,
  CodingSubmission,
  SubjectCategory,
  AdminStats
} from '../types';
import {
  INITIAL_VIDEOS,
  INITIAL_SIMULATIONS,
  INITIAL_QUIZZES,
  INITIAL_CODING_PROBLEMS,
  INITIAL_STEM_ACTIVITIES,
  INITIAL_CHALLENGES,
  INITIAL_BADGES,
  INITIAL_LEARNING_PATHS,
  INITIAL_RESOURCES,
  INITIAL_DEMO_STUDENTS
} from '../data/initialData';
import confetti from 'canvas-confetti';
import { authApi, AuthUser, getStoredUser, clearStoredAuth } from '../services/api';

export type AppView =
  | 'home'
  | 'dashboard'
  | 'videos'
  | 'simulations'
  | 'quizzes'
  | 'coding'
  | 'activities'
  | 'challenges'
  | 'paths'
  | 'resources'
  | 'profile'
  | 'about'
  | 'privacy'
  | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'badge' | 'xp';
  title: string;
  message: string;
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  role: 'student' | 'admin';
  setRole: (role: 'student' | 'admin') => void;
  authUser: AuthUser | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  registerAdmin: (name: string, email: string, pass: string, role?: string, department?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: (payload: { credential?: string; email?: string; name?: string; picture?: string; sub?: string; role?: string }) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  logout: () => void;
  activeSubjectFilter: SubjectCategory | 'all';
  setActiveSubjectFilter: (filter: SubjectCategory | 'all') => void;
  selectedSubject?: SubjectCategory | 'all';
  setSelectedSubject: (filter?: SubjectCategory | 'all') => void;
  
  // Selection states
  selectedVideoId: string | null;
  setSelectedVideoId: (id: string | null) => void;
  selectedSimulationId: string | null;
  setSelectedSimulationId: (id: string | null) => void;
  selectedQuizId: string | null;
  setSelectedQuizId: (id: string | null) => void;
  selectedProblemId: string | null;
  setSelectedProblemId: (id: string | null) => void;
  selectedCodingId: string | null;
  setSelectedCodingId: (id: string | null) => void;
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string | null) => void;

  // Search
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data Collections
  videos: VideoLesson[];
  simulations: SimulationConfig[];
  quizzes: Quiz[];
  codingProblems: CodingProblem[];
  activities: STEMActivity[];
  challenges: STEMChallenge[];
  badges: Badge[];
  learningPaths: LearningPath[];
  resources: FreeResource[];
  students: StudentProfile[];
  currentStudent: StudentProfile;
  setCurrentStudent: React.Dispatch<React.SetStateAction<StudentProfile>>;
  setCurrentStudentId: (id: string) => void;

  // Student Actions
  awardXP: (amount: number, reason: string) => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completeVideo: (videoId: string, xp?: number) => void;
  completeSimulation: (simId: string, xp?: number) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  completeQuiz: (quizId: string, score: number, total: number, xp?: number) => void;
  recordCodingSubmission: (submission: CodingSubmission) => void;
  completeCodingProblem: (problemId: string, xp?: number) => void;
  completeActivity: (activityId: string, xp?: number) => void;
  unlockBadge: (badgeId: string) => void;
  unlockedBadgeModal: Badge | null;
  closeBadgeModal: () => void;
  switchAgeGroup: (ageGroup: StudentProfile['ageGroup']) => void;

  // Admin CMS
  addVideo: (video: any) => void;
  updateVideo: (video: VideoLesson) => void;
  deleteVideo: (id: string) => void;
  
  addSimulation: (sim: any) => void;
  updateSimulation: (sim: SimulationConfig) => void;
  deleteSimulation: (id: string) => void;
  togglePublishSimulation: (id: string) => void;

  addQuiz: (quiz: any) => void;
  updateQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;

  addCodingProblem: (problem: any) => void;
  updateCodingProblem: (problem: CodingProblem) => void;
  deleteCodingProblem: (id: string) => void;

  addActivity: (activity: any) => void;
  updateActivity: (activity: STEMActivity) => void;
  deleteActivity: (id: string) => void;

  addResource: (res: any) => void;
  deleteResource: (id: string) => void;

  toggleStudentStatus: (studentId: string) => void;

  // Analytics
  getAdminStats: () => AdminStats;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toastOrType: any, title?: string, message?: string) => void;
  dismissToast: (id: string) => void;

  // Quick Navigation Helper
  navigateTo: (view: AppView, itemId?: string, category?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/** Build a completely blank StudentProfile for a newly authenticated user */
const createFreshStudentProfile = (user: AuthUser): StudentProfile => ({
  id: `stu-${user.id}`,
  name: user.name,
  email: user.email,
  avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=120`,
  ageGroup: '13-15',
  grade: '',
  schoolName: '',
  xp: 0,
  streakDays: 0,
  completedLessons: [],
  completedVideos: [],
  completedSimulations: [],
  solvedProblems: [],
  completedCoding: [],
  completedActivities: [],
  badges: [],
  quizScores: {},
  subjectMastery: { science: 0, mathematics: 0, technology: 0, engineering: 0 },
  quizAttempts: [],
  codingSubmissions: [],
  level: 1,
  joinedDate: new Date().toISOString().split('T')[0],
  active: true,
});

/** Load or create a per-user profile stored under a user-specific localStorage key */
const loadStudentForUser = (user: AuthUser): StudentProfile => {
  const key = `stem_student_profile_${user.id}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    try { return JSON.parse(saved); } catch { /* fall through */ }
  }
  return createFreshStudentProfile(user);
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const user = getStoredUser();
    return Boolean(user && (user.role === 'admin' || user.role === 'faculty'));
  });

  useEffect(() => {
    if (getStoredUser()) {
      authApi.getMe()
        .then((res) => {
          if (res.user) {
            setAuthUser(res.user);
            const isAdmin = res.user.role === 'admin' || res.user.role === 'faculty';
            setIsAdminAuthenticated(isAdmin);
            if (isAdmin) setRole('admin');
          }
        })
        .catch(() => {
          // Token expired or server offline
        });
    }
  }, []);

  const [activeSubjectFilter, setActiveSubjectFilter] = useState<SubjectCategory | 'all'>('all');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedSimulationId, setSelectedSimulationId] = useState<string | null>('sim-projectile');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>('code-1');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // LocalStorage cached or initial with automated merge for new additions
  const [videos, setVideos] = useState<VideoLesson[]>(() => {
    const saved = localStorage.getItem('stem_videos');
    if (!saved) return INITIAL_VIDEOS;
    try {
      const parsed: VideoLesson[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((v) => v.id));
      const newItems = INITIAL_VIDEOS.filter((v) => !existingIds.has(v.id));
      return [...parsed, ...newItems];
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  const [simulations, setSimulations] = useState<SimulationConfig[]>(() => {
    const saved = localStorage.getItem('stem_simulations');
    if (!saved) return INITIAL_SIMULATIONS;
    try {
      const parsed: SimulationConfig[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((s) => s.id));
      const newItems = INITIAL_SIMULATIONS.filter((s) => !existingIds.has(s.id));
      return [...parsed, ...newItems];
    } catch {
      return INITIAL_SIMULATIONS;
    }
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('stem_quizzes');
    if (!saved) return INITIAL_QUIZZES;
    try {
      const parsed: Quiz[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((q) => q.id));
      const newItems = INITIAL_QUIZZES.filter((q) => !existingIds.has(q.id));
      return [...parsed, ...newItems];
    } catch {
      return INITIAL_QUIZZES;
    }
  });

  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>(() => {
    const saved = localStorage.getItem('stem_coding_problems');
    if (!saved) return INITIAL_CODING_PROBLEMS;
    try {
      const parsed: CodingProblem[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((p) => p.id));
      const newItems = INITIAL_CODING_PROBLEMS.filter((p) => !existingIds.has(p.id));
      return [...parsed, ...newItems];
    } catch {
      return INITIAL_CODING_PROBLEMS;
    }
  });

  const [activities, setActivities] = useState<STEMActivity[]>(() => {
    const saved = localStorage.getItem('stem_activities');
    return saved ? JSON.parse(saved) : INITIAL_STEM_ACTIVITIES;
  });

  const [challenges] = useState<STEMChallenge[]>(INITIAL_CHALLENGES);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [learningPaths] = useState<LearningPath[]>(INITIAL_LEARNING_PATHS);
  const [resources, setResources] = useState<FreeResource[]>(() => {
    const saved = localStorage.getItem('stem_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('stem_students');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_STUDENTS;
  });

  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    // If a real user is already authenticated, load their per-user profile (fresh by default)
    const storedUser = getStoredUser();
    if (storedUser) {
      return loadStudentForUser(storedUser);
    }
    // No auth → show demo profile for browsing
    return INITIAL_DEMO_STUDENTS[0];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [unlockedBadgeModal, setUnlockedBadgeModal] = useState<Badge | null>(null);

  const closeBadgeModal = () => {
    setUnlockedBadgeModal(null);
  };

  // Auto-sync storage
  useEffect(() => {
    localStorage.setItem('stem_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('stem_simulations', JSON.stringify(simulations));
  }, [simulations]);

  useEffect(() => {
    localStorage.setItem('stem_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('stem_coding_problems', JSON.stringify(codingProblems));
  }, [codingProblems]);

  useEffect(() => {
    localStorage.setItem('stem_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('stem_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('stem_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    // Persist under the generic key for backwards compat
    localStorage.setItem('stem_current_student', JSON.stringify(currentStudent));
    // Also persist under the user-specific key if a real user is logged in
    const storedUser = getStoredUser();
    if (storedUser && currentStudent.id === `stu-${storedUser.id}`) {
      localStorage.setItem(`stem_student_profile_${storedUser.id}`, JSON.stringify(currentStudent));
    }
  }, [currentStudent]);

  const addToast = (toastOrType: any, title?: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    if (typeof toastOrType === 'object' && toastOrType !== null) {
      setToasts((prev) => [...prev, { id: toastOrType.id || id, ...toastOrType }]);
    } else {
      setToasts((prev) => [...prev, { id, type: toastOrType, title: title || '', message: message || '' }]);
    }
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Student Actions
  const awardXP = (amount: number, reason: string) => {
    setCurrentStudent((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 300) + 1;
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
    addToast('xp', `+${amount} XP Earned!`, reason);

    // Check automatic badge threshold by XP
    badges.forEach((b) => {
      const alreadyHas = currentStudent.badges.some((has: any) =>
        typeof has === 'string' ? has === b.id : has?.id === b.id
      );
      if (b.xpThreshold && currentStudent.xp + amount >= b.xpThreshold && !alreadyHas) {
        unlockBadge(b.id);
      }
    });

    if (currentStudent.streakDays >= 7) {
      unlockBadge('badge-streak-champion');
    }
  };

  const addXp = (amount: number) => {
    awardXP(amount, 'STEM Challenge Progress');
  };

  const setCurrentStudentId = (id: string) => {
    const found = students.find((s) => s.id === id);
    if (found) {
      setCurrentStudent(found);
    }
  };

  const unlockBadge = (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    if (!badge) return;

    const alreadyHas = currentStudent.badges.some((has: any) =>
      typeof has === 'string' ? has === badgeId : has?.id === badgeId
    );
    if (alreadyHas) return;

    setCurrentStudent((prev) => {
      const hasPrev = prev.badges.some((has: any) =>
        typeof has === 'string' ? has === badgeId : has?.id === badgeId
      );
      if (hasPrev) return prev;
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
      };
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch {
      // safe fallback
    }

    setUnlockedBadgeModal(badge);
    addToast('badge', `Badge Unlocked: ${badge.title}!`, badge.description);
  };

  const completeLesson = (lessonId: string) => {
    if (!currentStudent.completedLessons.includes(lessonId)) {
      const updatedLessons = [...currentStudent.completedLessons, lessonId];
      setCurrentStudent((prev) => ({
        ...prev,
        completedLessons: updatedLessons,
        completedVideos: [...(prev.completedVideos || []), lessonId],
      }));
      awardXP(50, 'Completed Video Lesson');

      if (updatedLessons.length + currentStudent.completedSimulations.length >= 5) {
        unlockBadge('badge-science-explorer');
      }
    }
  };

  const completeVideo = (videoId: string, xp: number = 50) => {
    completeLesson(videoId);
  };

  const completeSimulation = (simId: string, xp: number = 100) => {
    if (!currentStudent.completedSimulations.includes(simId)) {
      const updatedSims = [...currentStudent.completedSimulations, simId];
      setCurrentStudent((prev) => ({
        ...prev,
        completedSimulations: updatedSims,
      }));
      awardXP(xp, 'Explored Interactive Simulation');

      unlockBadge('badge-first-explorer');

      if (simId === 'sim-circuit' || simId === 'sim-circuits') {
        unlockBadge('badge-circuit-builder');
      }

      if (currentStudent.completedLessons.length + updatedSims.length >= 5) {
        unlockBadge('badge-science-explorer');
      }
    }
  };

  const recordQuizAttempt = (attempt: QuizAttempt) => {
    const updatedScores = {
      ...(currentStudent.quizScores || {}),
      [attempt.quizId]: attempt.percentage,
    };

    setCurrentStudent((prev) => ({
      ...prev,
      quizAttempts: [attempt, ...prev.quizAttempts],
      quizScores: updatedScores,
    }));

    // Update Quiz stats in state
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === attempt.quizId) {
          const totalAttempts = (q.attemptsCount || 0) + 1;
          const newAvg = Math.round(((q.averageScorePercent || 0) * (q.attemptsCount || 0) + attempt.percentage) / totalAttempts);
          return {
            ...q,
            attemptsCount: totalAttempts,
            averageScorePercent: newAvg,
          };
        }
        return q;
      })
    );

    const xp = Math.round((attempt.percentage / 100) * 80) + 20;
    awardXP(xp, `Scored ${attempt.score}/${attempt.totalQuestions} (${attempt.percentage}%) on ${attempt.quizTitle}`);

    if (attempt.percentage >= 85) {
      if (attempt.subject === 'mathematics') {
        unlockBadge('badge-math-master');
      }
    }

    // Check Quiz Champion (3 or more high scoring quizzes)
    const highScores = Object.values(updatedScores).filter((s) => s >= 90);
    if (highScores.length >= 3) {
      unlockBadge('badge-quiz-champion');
    }
  };

  const completeQuiz = (quizId: string, score: number, total: number, xpReward: number = 50) => {
    const percentage = Math.round((score / total) * 100);
    const quiz = quizzes.find((q) => q.id === quizId);
    recordQuizAttempt({
      id: `qa-${Date.now()}`,
      quizId,
      quizTitle: quiz?.title || 'Quiz',
      subject: quiz?.subject || 'science',
      score,
      totalQuestions: total,
      percentage,
      completedAt: new Date().toISOString().split('T')[0],
      answers: {},
    });
  };

  const recordCodingSubmission = (submission: CodingSubmission) => {
    setCurrentStudent((prev) => {
      const updatedProblems = prev.solvedProblems.includes(submission.problemId)
        ? prev.solvedProblems
        : [...prev.solvedProblems, submission.problemId];
      return {
        ...prev,
        solvedProblems: updatedProblems,
        completedCoding: updatedProblems,
        codingSubmissions: [submission, ...prev.codingSubmissions],
      };
    });

    if (submission.status === 'Accepted') {
      awardXP(120, 'Solved Coding Problem');
      if (!currentStudent.badges.includes('badge-code-starter')) {
        unlockBadge('badge-code-starter');
      }

      // Update problem solved count
      setCodingProblems((prev) =>
        prev.map((p) => (p.id === submission.problemId ? { ...p, solvedCount: (p.solvedCount || 0) + 1 } : p))
      );
    }
  };

  const completeCodingProblem = (problemId: string, xpReward: number = 40) => {
    recordCodingSubmission({
      id: `sub-${Date.now()}`,
      problemId,
      language: 'javascript',
      code: '// solved in virtual sandbox',
      status: 'Accepted',
      passedCases: 3,
      totalCases: 3,
      submittedAt: new Date().toISOString().split('T')[0],
    });
  };

  const completeActivity = (activityId: string, xpReward: number = 80) => {
    if (!currentStudent.completedActivities.includes(activityId)) {
      setCurrentStudent((prev) => ({
        ...prev,
        completedActivities: [...prev.completedActivities, activityId],
      }));
      awardXP(xpReward, 'Completed Hands-on STEM Activity');
      if (currentStudent.completedActivities.length + 1 >= 3 && !currentStudent.badges.includes('badge-lab-innovator')) {
        unlockBadge('badge-lab-innovator');
      }
    }
  };

  const addResource = (resData: any) => {
    const newRes: FreeResource = {
      ...resData,
      id: 'res-' + Date.now(),
    };
    setResources((prev) => [newRes, ...prev]);
    addToast('success', 'Resource Added', `"${newRes.title}" added to directory`);
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    addToast('info', 'Resource Removed', 'Tool deleted from directory');
  };

  const switchAgeGroup = (ageGroup: StudentProfile['ageGroup']) => {
    setCurrentStudent((prev) => ({
      ...prev,
      ageGroup,
    }));
    addToast('info', 'Learning Level Updated', `Set content preference for ${ageGroup} years tier.`);
  };

  // Real MongoDB & Google Authentication
  const loginAdmin = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await authApi.login(email, pass);
      if (res.success && res.user) {
        setAuthUser(res.user);
        const isAdmin = res.user.role === 'admin' || res.user.role === 'faculty';
        setIsAdminAuthenticated(isAdmin);
        if (isAdmin) {
          setRole('admin');
          setCurrentView('admin');
        } else {
          setRole('student');
          setCurrentView('dashboard');
        }
        // Load the user's own profile (fresh if first login, existing if returning)
        setCurrentStudent(loadStudentForUser(res.user));
        addToast('success', `Welcome back, ${res.user.name}!`, `Authenticated as ${res.user.role.toUpperCase()}`);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Authentication failed' };
    }
  };

  const registerAdmin = async (name: string, email: string, pass: string, role: string = 'student', department?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await authApi.register({ name, email, password: pass, role, department });
      if (res.success && res.user) {
        setAuthUser(res.user);
        const isAdmin = res.user.role === 'admin' || res.user.role === 'faculty';
        setIsAdminAuthenticated(isAdmin);
        if (isAdmin) {
          setRole('admin');
          setCurrentView('admin');
        } else {
          setRole('student');
          setCurrentView('dashboard');
        }
        // Brand-new registration → always give a fresh blank profile
        const freshProfile = createFreshStudentProfile(res.user);
        setCurrentStudent(freshProfile);
        localStorage.setItem(`stem_student_profile_${res.user.id}`, JSON.stringify(freshProfile));
        addToast('success', 'Account Registered!', `Welcome to STEM Learn, ${res.user.name}`);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration error' };
    }
  };

  const loginWithGoogle = async (payload: { credential?: string; email?: string; name?: string; picture?: string; sub?: string; role?: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await authApi.googleAuth(payload);
      if (res.success && res.user) {
        setAuthUser(res.user);
        const isAdmin = res.user.role === 'admin' || res.user.role === 'faculty';
        setIsAdminAuthenticated(isAdmin);
        if (isAdmin) {
          setRole('admin');
          setCurrentView('admin');
        } else {
          setRole('student');
          setCurrentView('dashboard');
        }
        // Load or create the user's own profile (no demo data carry-over)
        setCurrentStudent(loadStudentForUser(res.user));
        addToast('success', 'Google Sign-In Successful!', `Welcome, ${res.user.name}`);
        return { success: true };
      }
      return { success: false, message: res.message || 'Google authentication failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Google sign-in error' };
    }
  };

  const logoutAdmin = () => {
    clearStoredAuth();
    setAuthUser(null);
    setIsAdminAuthenticated(false);
    setRole('student');
    setCurrentView('home');
    // Reset to the demo profile so the UI still has something to render when logged out
    setCurrentStudent(INITIAL_DEMO_STUDENTS[0]);
    localStorage.removeItem('stem_current_student');

    // Revoke Google session if Google Identity Services is loaded
    try {
      if (typeof (window as any).google !== 'undefined' && (window as any).google.accounts) {
        (window as any).google.accounts.id.disableAutoSelect();
      }
    } catch { /* ignore */ }

    addToast('info', 'Logged Out', 'You have been signed out successfully.');
  };
  const logout = logoutAdmin;

  // Navigation helper
  const navigateTo = (view: AppView, itemId?: string, category?: string) => {
    setCurrentView(view);
    if (category) {
      setActiveSubjectFilter(category as SubjectCategory);
    }
    if (view === 'videos' && itemId) setSelectedVideoId(itemId);
    if (view === 'simulations' && itemId) setSelectedSimulationId(itemId);
    if (view === 'quizzes' && itemId) setSelectedQuizId(itemId);
    if (view === 'coding' && itemId) setSelectedProblemId(itemId);
    if (view === 'activities' && itemId) setSelectedActivityId(itemId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin CMS Handlers
  const addVideo = (videoData: Omit<VideoLesson, 'id' | 'views'>) => {
    const newVideo: VideoLesson = {
      ...videoData,
      id: 'vid-' + Date.now(),
      views: 0,
    };
    setVideos((prev) => [newVideo, ...prev]);
    addToast('success', 'Video Added', `"${newVideo.title}" added to library`);
  };

  const updateVideo = (updated: VideoLesson) => {
    setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    addToast('success', 'Video Updated', `Changes to "${updated.title}" saved`);
  };

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    addToast('info', 'Video Deleted', 'Lesson removed from catalog');
  };

  const addSimulation = (simData: Omit<SimulationConfig, 'id'>) => {
    const newSim: SimulationConfig = {
      ...simData,
      id: 'sim-' + Date.now(),
    };
    setSimulations((prev) => [newSim, ...prev]);
    addToast('success', 'Simulation Created', `"${newSim.name}" published`);
  };

  const updateSimulation = (updated: SimulationConfig) => {
    setSimulations((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    addToast('success', 'Simulation Updated', 'Settings saved');
  };

  const deleteSimulation = (id: string) => {
    setSimulations((prev) => prev.filter((s) => s.id !== id));
    addToast('info', 'Simulation Removed', 'Configuration deleted');
  };

  const togglePublishSimulation = (id: string) => {
    setSimulations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, published: !s.published } : s))
    );
  };

  const addQuiz = (quizData: Omit<Quiz, 'id' | 'attemptsCount' | 'averageScorePercent'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: 'quiz-' + Date.now(),
      attemptsCount: 0,
      averageScorePercent: 0,
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    addToast('success', 'Quiz Published', `"${newQuiz.title}" created with ${newQuiz.questions.length} questions`);
  };

  const updateQuiz = (updated: Quiz) => {
    setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    addToast('success', 'Quiz Updated', 'Questions and explanations updated');
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    addToast('info', 'Quiz Deleted', 'Removed from assessments');
  };

  const addCodingProblem = (probData: Omit<CodingProblem, 'id' | 'solvedCount'>) => {
    const newProb: CodingProblem = {
      ...probData,
      id: 'code-' + Date.now(),
      solvedCount: 0,
    };
    setCodingProblems((prev) => [newProb, ...prev]);
    addToast('success', 'Problem Added', `"${newProb.title}" added to Coding Lab`);
  };

  const updateCodingProblem = (updated: CodingProblem) => {
    setCodingProblems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addToast('success', 'Problem Updated', 'Test cases and hints saved');
  };

  const deleteCodingProblem = (id: string) => {
    setCodingProblems((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Problem Deleted', 'Removed from coding lab');
  };

  const addActivity = (actData: Omit<STEMActivity, 'id'>) => {
    const newAct: STEMActivity = {
      ...actData,
      id: 'act-' + Date.now(),
    };
    setActivities((prev) => [newAct, ...prev]);
    addToast('success', 'Activity Added', `"${newAct.title}" added to practical guide`);
  };

  const updateActivity = (updated: STEMActivity) => {
    setActivities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    addToast('success', 'Activity Updated', 'Instructions and materials updated');
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    addToast('info', 'Activity Deleted', 'Experiment removed');
  };

  const toggleStudentStatus = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, active: !s.active } : s))
    );
    addToast('info', 'Student Status Updated', 'Account access permission changed');
  };

  const getAdminStats = (): AdminStats => {
    const totalStudents = students.length;
    const totalVideos = videos.length;
    const totalSimulations = simulations.length;
    const totalQuizzes = quizzes.length;
    const totalCodingProblems = codingProblems.length;
    const totalActivities = activities.length;

    // Dynamic subject distribution based on all catalog items
    const allItems = [...videos, ...simulations, ...quizzes];
    const scCount = allItems.filter((i) => i.subject === 'science').length || 1;
    const maCount = allItems.filter((i) => i.subject === 'mathematics').length || 1;
    const teCount = allItems.filter((i) => (i.subject as string) === 'technology').length || 1;
    const enCount = allItems.filter((i) => i.subject === 'engineering').length || 1;
    const total = scCount + maCount + teCount + enCount;

    const subjectEngagement = {
      science: Math.round((scCount / total) * 100),
      mathematics: Math.round((maCount / total) * 100),
      technology: Math.round((teCount / total) * 100),
      engineering: Math.round((enCount / total) * 100),
    };

    return {
      totalStudents,
      totalVideos,
      totalSimulations,
      totalQuizzes,
      totalCodingProblems,
      totalActivities,
      videoCompletionRate: 68,
      quizAverageScore: 81,
      codingSolveRate: 74,
      subjectEngagement,
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        role,
        setRole,
        authUser,
        isAdminAuthenticated,
        loginAdmin,
        registerAdmin,
        loginWithGoogle,
        logoutAdmin,
        logout,
        activeSubjectFilter,
        setActiveSubjectFilter,
        selectedSubject: activeSubjectFilter,
        setSelectedSubject: (filter?: SubjectCategory | 'all') => setActiveSubjectFilter(filter || 'all'),
        selectedVideoId,
        setSelectedVideoId,
        selectedSimulationId,
        setSelectedSimulationId,
        selectedQuizId,
        setSelectedQuizId,
        selectedProblemId,
        setSelectedProblemId,
        selectedCodingId: selectedProblemId,
        setSelectedCodingId: setSelectedProblemId,
        selectedActivityId,
        setSelectedActivityId,
        searchModalOpen,
        setSearchModalOpen,
        searchQuery,
        setSearchQuery,
        videos,
        simulations,
        quizzes,
        codingProblems,
        activities,
        challenges,
        badges,
        learningPaths,
        resources,
        students,
        currentStudent,
        setCurrentStudent,
        setCurrentStudentId,
        awardXP,
        addXp,
        completeLesson,
        completeVideo,
        completeSimulation,
        recordQuizAttempt,
        completeQuiz,
        recordCodingSubmission,
        completeCodingProblem,
        completeActivity,
        unlockBadge,
        unlockedBadgeModal,
        closeBadgeModal,
        switchAgeGroup,
        addVideo,
        updateVideo,
        deleteVideo,
        addSimulation,
        updateSimulation,
        deleteSimulation,
        togglePublishSimulation,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        addCodingProblem,
        updateCodingProblem,
        deleteCodingProblem,
        addActivity,
        updateActivity,
        deleteActivity,
        addResource,
        deleteResource,
        toggleStudentStatus,
        getAdminStats,
        toasts,
        addToast,
        dismissToast,
        navigateTo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
