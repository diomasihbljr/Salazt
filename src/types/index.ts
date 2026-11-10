export type NavTab = 
  | 'dashboard' 
  | 'speaking-listening' 
  | 'vocabulary' 
  | 'grammar' 
  | 'progress' 
  | 'profile' 
  | 'settings';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  level: CefrLevel;
  levelLabel: string;
  memberSince: string;
  dailyGoalMinutes: number;
  todayMinutes: number;
  totalHours: number;
  lessonsCompleted: number;
  streakDays: number;
  vocabularyCount: number;
  preferredLearningTime: string;
  learningGoal: string;
  preferredDifficulty: string;
  enableIndonesianTips: boolean;
  audioSpeed: number;
  audioAccent: 'en-US' | 'en-GB';
}

export interface SkillProgress {
  speaking: number; // 0 - 100
  listening: number;
  vocabulary: number;
  grammar: number;
  speakingLessons: number;
  listeningLessons: number;
  vocabularyMastered: number;
  grammarLessons: number;
}

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'idiom';
  translationId: string;
  exampleEn: string;
  exampleId: string;
  category: string;
  difficulty: CefrLevel;
  isLearned: boolean;
  isFavorite: boolean;
  notes?: string;
}

export interface GrammarExercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'sentence-arrange' | 'error-correction';
  question: string;
  options?: string[];
  arrangeWords?: string[];
  correctAnswer: string;
  explanationId: string;
  explanationEn: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  category: 'basic' | 'tenses' | 'structure' | 'advanced';
  categoryLabel: string;
  difficulty: CefrLevel;
  explanationId: string;
  explanationEn: string;
  formula: string;
  positiveExamples: string[];
  negativeExamples: string[];
  questionExamples: string[];
  commonMistakes: Array<{
    incorrect: string;
    correct: string;
    explanation: string;
  }>;
  practicalUsage: string;
  exercises: GrammarExercise[];
  isCompleted?: boolean;
  bestScore?: number;
}

export interface ListeningExercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false' | 'identify-phrase';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ListeningLesson {
  id: string;
  title: string;
  level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced';
  duration: string;
  durationSeconds: number;
  audioUrl?: string;
  audioScript: string;
  transcriptId: string;
  scenario: string;
  exercises: ListeningExercise[];
  isCompleted?: boolean;
}

export interface SpeakingLesson {
  id: string;
  title: string;
  topic: string;
  difficulty: CefrLevel;
  duration: string;
  prompt: string;
  sampleQuestion: string;
  sampleAnswer: string;
  keyPhrases: string[];
  indonesianTip: string;
}

export interface PronunciationWord {
  id: string;
  word: string;
  phonetic: string;
  meaningId: string;
  syllables: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  tip: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  correction?: string;
  explanationId?: string;
  suggestions?: string[];
}

export interface LearningHistoryEntry {
  id: string;
  title: string;
  category: 'Speaking' | 'Listening' | 'Vocabulary' | 'Grammar';
  score: number;
  durationMinutes: number;
  completedAt: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressText?: string;
}
