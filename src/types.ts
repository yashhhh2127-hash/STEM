export type SubjectCategory = 'science' | 'mathematics' | 'technology' | 'engineering';

export type AgeGroup = '10-12' | '13-15' | '16-18' | '18+';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'beginner' | 'intermediate' | 'advanced';

export interface Subject {
  id: string;
  name: string;
  category: SubjectCategory;
  description: string;
  iconName: string;
  accentColor: string;
  topicCount: number;
  topics: string[];
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // Embed or realistic preview stream
  thumbnailUrl: string;
  thumbnail?: string;
  author?: string;
  xpReward?: number;
  subject: SubjectCategory;
  topic: string;
  difficulty: DifficultyLevel;
  ageGroup?: AgeGroup;
  duration: string; // e.g., "12 mins"
  learningObjectives: string[];
  keyConcepts: string[];
  importantFormulas?: string[];
  notes?: string;
  timestamps?: { time: string; title: string }[];
  relatedSimulationId?: string;
  relatedQuizId?: string;
  practiceQuizId?: string;
  nextLessonId?: string;
  views?: number;
}

export type EducationalVideo = VideoLesson;

export interface SimulationConfig {
  id: string;
  name: string;
  subject: SubjectCategory;
  topic: string;
  difficulty: DifficultyLevel;
  ageGroup?: AgeGroup;
  description: string;
  instructions: string[];
  type: 'projectile' | 'circuit' | 'grapher' | 'atom' | 'cell' | 'robotics' | 'gravity' | 'optics';
  published?: boolean;
  xpReward?: number;
  relatedVideoId?: string;
  relatedQuizId?: string;
}

export type QuestionType = 'mcq' | 'multiple-select' | 'true-false' | 'match' | 'conceptual';

export interface QuizQuestion {
  id: string;
  type?: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number | string | string[] | boolean; // Option index or option string
  explanation: string;
  diagramUrl?: string;
  hint?: string;
  matchPairs?: { left: string; right: string }[];
}

export interface Quiz {
  id: string;
  title: string;
  subject: SubjectCategory;
  topic: string;
  difficulty: DifficultyLevel;
  ageGroup?: AgeGroup;
  description: string;
  timeLimitMinutes?: number;
  questions: QuizQuestion[];
  published?: boolean;
  attemptsCount?: number;
  averageScorePercent?: number;
  relatedTopicOrVideo?: string;
  relatedSimulationId?: string;
  xpReward?: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: SubjectCategory;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  answers: Record<string, any>;
}

export interface CodingTestCase {
  input: string;
  expectedOutput: string;
  isPublic?: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  subject: 'technology' | 'engineering' | 'mathematics';
  topic: string;
  difficulty: DifficultyLevel;
  language: 'python' | 'javascript' | 'c' | 'cpp' | 'java';
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  exampleInput?: string;
  exampleOutput?: string;
  starterCode: string | Record<string, string>;
  testCases: CodingTestCase[];
  hint?: string;
  hints?: string[];
  solutionExplanation?: string;
  solvedCount?: number;
  xpReward?: number;
}

export interface CodingSubmission {
  id: string;
  problemId: string;
  language: string;
  code: string;
  status: 'Accepted' | 'Failed' | 'Runtime Error';
  passedCases: number;
  totalCases: number;
  submittedAt: string;
}

export interface STEMActivity {
  id: string;
  title: string;
  subject: SubjectCategory;
  difficulty: DifficultyLevel;
  estimatedTime?: string;
  duration?: string;
  objective: string;
  materials: string[];
  steps: string[];
  safetyNotes: string[];
  observationGuide?: string;
  scientificResult?: string;
  scientificPrinciple?: string;
  published?: boolean;
  xpReward?: number;
}

export interface STEMChallenge {
  id: string;
  title: string;
  category: SubjectCategory;
  type: 'equation' | 'circuit' | 'trajectory' | 'molecule' | 'debug';
  description: string;
  xpReward: number;
  badgeRewardId?: string;
  timeSeconds?: number;
  challengeData: any;
}

export interface Badge {
  id: string;
  title: string;
  name?: string;
  description: string;
  icon: string;
  category: 'simulation' | 'coding' | 'quiz' | 'streak' | 'general';
  xpThreshold?: number;
  unlockedAt?: string;
}

export interface LearningPathItem {
  id: string;
  title: string;
  type: 'video' | 'simulation' | 'quiz' | 'coding' | 'activity';
  referenceId?: string;
  targetId?: string;
  completed?: boolean;
  description?: string;
  xp?: number;
}

export interface LearningPath {
  id: string;
  title: string;
  subject?: SubjectCategory;
  difficulty?: DifficultyLevel;
  description: string;
  estimatedHours: number;
  targetAge?: string;
  certificateName?: string;
  items?: LearningPathItem[];
  steps?: LearningPathItem[];
}

export interface FreeResource {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  provider?: string;
  tags: string[];
  isFeatured?: boolean;
  ageGroup?: string;
  bestFor?: string;
  howToUseTips?: string;
}

export type STEMResource = FreeResource;

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  ageGroup: AgeGroup;
  grade?: string;
  schoolName: string;
  xp: number;
  streakDays: number;
  completedLessons: string[]; // lesson or video ids
  completedVideos: string[];
  completedSimulations: string[];
  solvedProblems: string[];
  completedCoding: string[];
  completedActivities: string[];
  badges: any[]; // badge ids or Badge objects
  quizAttempts: QuizAttempt[];
  quizScores: Record<string, number>;
  codingSubmissions: CodingSubmission[];
  subjectMastery: Record<string, number>;
  level: number;
  joinedDate: string;
  active: boolean;
}

export interface AdminStats {
  totalStudents: number;
  totalVideos: number;
  totalSimulations: number;
  totalQuizzes: number;
  totalCodingProblems: number;
  totalActivities: number;
  videoCompletionRate: number;
  quizAverageScore: number;
  codingSolveRate: number;
  subjectEngagement: {
    science: number;
    mathematics: number;
    technology: number;
    engineering: number;
  };
}
