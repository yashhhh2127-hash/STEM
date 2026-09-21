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
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('stem_admin_auth') === 'true';
  });

  const [activeSubjectFilter, setActiveSubjectFilter] = useState<SubjectCategory | 'all'>('all');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedSimulationId, setSelectedSimulationId] = useState<string | null>('sim-projectile');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>('code-1');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // LocalStorage cached or initial
  const [videos, setVideos] = useState<VideoLesson[]>(() => {
    const saved = localStorage.getItem('stem_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [simulations, setSimulations] = useState<SimulationConfig[]>(() => {
    const saved = localStorage.getItem('stem_simulations');
    return saved ? JSON.parse(saved) : INITIAL_SIMULATIONS;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('stem_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>(() => {
    const saved = localStorage.getItem('stem_coding_problems');
    return saved ? JSON.parse(saved) : INITIAL_CODING_PROBLEMS;
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
    const saved = localStorage.getItem('stem_current_student');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_STUDENTS[0];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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
    localStorage.setItem('stem_current_student', JSON.stringify(currentStudent));
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

    // Check automatic badge threshold
    badges.forEach((b) => {
      if (b.xpThreshold && currentStudent.xp + amount >= b.xpThreshold && !currentStudent.badges.includes(b.id)) {
        unlockBadge(b.id);
      }
    });
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
    if (!badge || currentStudent.badges.includes(badgeId)) return;

    setCurrentStudent((prev) => ({
      ...prev,
      badges: [...prev.badges, badgeId],
    }));

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch {
      // safe fallback
    }

    addToast('badge', `Badge Unlocked: ${badge.title}!`, badge.description);
  };

  const completeLesson = (lessonId: string) => {
    if (!currentStudent.completedLessons.includes(lessonId)) {
      setCurrentStudent((prev) => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        completedVideos: [...(prev.completedVideos || []), lessonId],
      }));
      awardXP(50, 'Completed Video Lesson');
    }
  };

  const completeVideo = (videoId: string, xp: number = 50) => {
    completeLesson(videoId);
  };

  const completeSimulation = (simId: string, xp: number = 100) => {
    if (!currentStudent.completedSimulations.includes(simId)) {
      setCurrentStudent((prev) => ({
        ...prev,
        completedSimulations: [...prev.completedSimulations, simId],
      }));
      awardXP(xp, 'Explored Interactive Simulation');
      if (!currentStudent.badges.includes('badge-first-explorer')) {
        unlockBadge('badge-first-explorer');
      }
    }
  };

  const recordQuizAttempt = (attempt: QuizAttempt) => {
    setCurrentStudent((prev) => ({
      ...prev,
      quizAttempts: [attempt, ...prev.quizAttempts],
      quizScores: {
        ...(prev.quizScores || {}),
        [attempt.quizId]: attempt.percentage,
      },
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
      if (attempt.subject === 'mathematics' && !currentStudent.badges.includes('badge-math-master')) {
        unlockBadge('badge-math-master');
      }
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

  // Admin Auth
  const loginAdmin = (email: string, pass: string) => {
    // Standard secure demo authentication check
    if (email.trim().toLowerCase() === 'admin@palghar.edu' && pass === 'admin123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('stem_admin_auth', 'true');
      setRole('admin');
      setCurrentView('admin');
      addToast('success', 'Admin Authenticated', 'Welcome to SDES IT Dept Admin Portal');
      return true;
    }
    // Also allow single-click convenience demo authorization if user passes "demo"
    if (email === 'demo' && pass === 'demo') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('stem_admin_auth', 'true');
      setRole('admin');
      setCurrentView('admin');
      addToast('success', 'Admin Authenticated', 'Logged in as IT Department Coordinator');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('stem_admin_auth');
    setRole('student');
    setCurrentView('home');
    addToast('info', 'Logged Out', 'Returned to Student Mode');
  };

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
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
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
