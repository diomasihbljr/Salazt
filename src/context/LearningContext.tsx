import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  SkillProgress,
  VocabularyItem,
  GrammarLesson,
  ListeningLesson,
  SpeakingLesson,
  PronunciationWord,
  LearningHistoryEntry,
  AchievementBadge,
  NavTab,
} from '../types';
import {
  initialUserProfile,
  initialSkillProgress,
  initialVocabulary,
  initialGrammarLessons,
  initialListeningLessons,
  initialSpeakingLessons,
  initialPronunciationWords,
  initialWeeklyActivity,
  initialMonthlyProgress,
  initialAchievements,
  initialLearningHistory,
} from '../data/initialData';
import { calculateLevel, checkAchievements } from '../utils/learningLogic';

interface LearningContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  skillProgress: SkillProgress;
  vocabulary: VocabularyItem[];
  toggleVocabLearned: (id: string) => void;
  toggleVocabFavorite: (id: string) => void;
  grammarLessons: GrammarLesson[];
  completeGrammarLesson: (lessonId: string, score: number) => void;
  listeningLessons: ListeningLesson[];
  completeListeningLesson: (lessonId: string, score: number) => void;
  speakingLessons: SpeakingLesson[];
  completeSpeakingPractice: (lessonId: string, score: number, durationMins: number) => void;
  pronunciationWords: PronunciationWord[];
  weeklyActivity: Array<{ day: string; minutes: number; lessons: number }>;
  monthlyProgress: Array<{ label: string; score: number }>;
  achievements: AchievementBadge[];
  learningHistory: LearningHistoryEntry[];
  addLearningTime: (minutes: number) => void;
  resetAllData: () => void;
  // Subview quick navigation
  selectedGrammarLessonId: string | null;
  setSelectedGrammarLessonId: (id: string | null) => void;
  selectedListeningLessonId: string | null;
  setSelectedListeningLessonId: (id: string | null) => void;
  selectedSpeakingLessonId: string | null;
  setSelectedSpeakingLessonId: (id: string | null) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

const STORAGE_KEY = 'salazt_learning_state_v1';

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Active lesson modals / subviews
  const [selectedGrammarLessonId, setSelectedGrammarLessonId] = useState<string | null>(null);
  const [selectedListeningLessonId, setSelectedListeningLessonId] = useState<string | null>(null);
  const [selectedSpeakingLessonId, setSelectedSpeakingLessonId] = useState<string | null>(null);

  // Core state with LocalStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
      return saved ? JSON.parse(saved) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  });

  const [skillProgress, setSkillProgress] = useState<SkillProgress>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_skills`);
      return saved ? JSON.parse(saved) : initialSkillProgress;
    } catch {
      return initialSkillProgress;
    }
  });

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_vocab`);
      return saved ? JSON.parse(saved) : initialVocabulary;
    } catch {
      return initialVocabulary;
    }
  });

  const [grammarLessons, setGrammarLessons] = useState<GrammarLesson[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_grammar`);
      return saved ? JSON.parse(saved) : initialGrammarLessons;
    } catch {
      return initialGrammarLessons;
    }
  });

  const [listeningLessons, setListeningLessons] = useState<ListeningLesson[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_listening`);
      return saved ? JSON.parse(saved) : initialListeningLessons;
    } catch {
      return initialListeningLessons;
    }
  });

  const [speakingLessons] = useState<SpeakingLesson[]>(initialSpeakingLessons);
  const [pronunciationWords] = useState<PronunciationWord[]>(initialPronunciationWords);

  const [weeklyActivity, setWeeklyActivity] = useState<Array<{ day: string; minutes: number; lessons: number }>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_weekly`);
      return saved ? JSON.parse(saved) : initialWeeklyActivity;
    } catch {
      return initialWeeklyActivity;
    }
  });

  const [monthlyProgress] = useState(initialMonthlyProgress);

  const [achievements, setAchievements] = useState<AchievementBadge[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_achievements`);
      return saved ? JSON.parse(saved) : initialAchievements;
    } catch {
      return initialAchievements;
    }
  });

  const [learningHistory, setLearningHistory] = useState<LearningHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_history`);
      return saved ? JSON.parse(saved) : initialLearningHistory;
    } catch {
      return initialLearningHistory;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(userProfile));
      localStorage.setItem(`${STORAGE_KEY}_skills`, JSON.stringify(skillProgress));
      localStorage.setItem(`${STORAGE_KEY}_vocab`, JSON.stringify(vocabulary));
      localStorage.setItem(`${STORAGE_KEY}_grammar`, JSON.stringify(grammarLessons));
      localStorage.setItem(`${STORAGE_KEY}_listening`, JSON.stringify(listeningLessons));
      localStorage.setItem(`${STORAGE_KEY}_weekly`, JSON.stringify(weeklyActivity));
      localStorage.setItem(`${STORAGE_KEY}_achievements`, JSON.stringify(achievements));
      localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify(learningHistory));
    } catch (e) {
      console.error('Failed to sync to local storage', e);
    }
  }, [userProfile, skillProgress, vocabulary, grammarLessons, listeningLessons, weeklyActivity, achievements, learningHistory]);

  // Recalculate CEFR level whenever skills change
  useEffect(() => {
    const calculated = calculateLevel(skillProgress);
    if (userProfile.level !== calculated.code || userProfile.levelLabel !== calculated.label) {
      setUserProfile((prev) => ({
        ...prev,
        level: calculated.code,
        levelLabel: calculated.label,
      }));
    }
  }, [skillProgress]);

  // Check achievements dynamically
  useEffect(() => {
    const checks = checkAchievements({
      lessonsCompleted: userProfile.lessonsCompleted,
      streak: userProfile.streakDays,
      vocabularyCount: userProfile.vocabularyCount,
      grammarScore: skillProgress.grammar,
      listeningScore: skillProgress.listening,
      speakingScore: skillProgress.speaking,
    });

    setAchievements((prev) =>
      prev.map((badge) => {
        const check = checks.find((c) => c.id === badge.id);
        if (check && check.unlocked && !badge.unlocked) {
          return {
            ...badge,
            unlocked: true,
            unlockedAt: 'Just now',
          };
        }
        return badge;
      })
    );
  }, [userProfile.lessonsCompleted, userProfile.streakDays, userProfile.vocabularyCount, skillProgress]);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const addLearningTime = (mins: number) => {
    setUserProfile((prev) => ({
      ...prev,
      todayMinutes: prev.todayMinutes + mins,
      totalHours: Number((prev.totalHours + mins / 60).toFixed(1)),
    }));
    setWeeklyActivity((prev) => {
      const copy = [...prev];
      if (copy.length > 0) {
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          minutes: copy[copy.length - 1].minutes + mins,
          lessons: copy[copy.length - 1].lessons + 1,
        };
      }
      return copy;
    });
  };

  const toggleVocabLearned = (id: string) => {
    setVocabulary((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isLearned: !item.isLearned } : item
      );
      const learnedCount = updated.filter((v) => v.isLearned).length;
      setUserProfile((u) => ({
        ...u,
        vocabularyCount: 150 + (learnedCount - 12),
      }));
      setSkillProgress((s) => ({
        ...s,
        vocabulary: Math.min(100, Math.round((learnedCount / updated.length) * 100)),
        vocabularyMastered: 95 + (learnedCount - 12),
      }));
      return updated;
    });
  };

  const toggleVocabFavorite = (id: string) => {
    setVocabulary((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const completeGrammarLesson = (lessonId: string, score: number) => {
    setGrammarLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId
          ? {
              ...l,
              isCompleted: true,
              bestScore: Math.max(l.bestScore || 0, score),
            }
          : l
      )
    );

    const lesson = grammarLessons.find((l) => l.id === lessonId);
    const lessonTitle = lesson ? lesson.title : 'Grammar Practice';

    // Record history
    const newEntry: LearningHistoryEntry = {
      id: `hist_${Date.now()}`,
      title: lessonTitle,
      category: 'Grammar',
      score,
      durationMinutes: 15,
      completedAt: 'Just now',
    };
    setLearningHistory((prev) => [newEntry, ...prev]);

    // Update stats
    setUserProfile((prev) => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
    }));
    addLearningTime(15);

    // Update grammar skill
    setSkillProgress((prev) => ({
      ...prev,
      grammar: Math.min(100, Math.round((prev.grammar * 0.85) + (score * 0.15))),
      grammarLessons: prev.grammarLessons + 1,
    }));
  };

  const completeListeningLesson = (lessonId: string, score: number) => {
    setListeningLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, isCompleted: true } : l))
    );

    const lesson = listeningLessons.find((l) => l.id === lessonId);
    const lessonTitle = lesson ? lesson.title : 'Listening Exercise';

    const newEntry: LearningHistoryEntry = {
      id: `hist_${Date.now()}`,
      title: lessonTitle,
      category: 'Listening',
      score,
      durationMinutes: 12,
      completedAt: 'Just now',
    };
    setLearningHistory((prev) => [newEntry, ...prev]);

    setUserProfile((prev) => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
    }));
    addLearningTime(12);

    setSkillProgress((prev) => ({
      ...prev,
      listening: Math.min(100, Math.round((prev.listening * 0.85) + (score * 0.15))),
      listeningLessons: prev.listeningLessons + 1,
    }));
  };

  const completeSpeakingPractice = (lessonId: string, score: number, durationMins: number) => {
    const lesson = speakingLessons.find((l) => l.id === lessonId);
    const lessonTitle = lesson ? lesson.title : 'Speaking Practice';

    const newEntry: LearningHistoryEntry = {
      id: `hist_${Date.now()}`,
      title: lessonTitle,
      category: 'Speaking',
      score,
      durationMinutes: durationMins,
      completedAt: 'Just now',
    };
    setLearningHistory((prev) => [newEntry, ...prev]);

    setUserProfile((prev) => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
    }));
    addLearningTime(durationMins);

    setSkillProgress((prev) => ({
      ...prev,
      speaking: Math.min(100, Math.round((prev.speaking * 0.85) + (score * 0.15))),
      speakingLessons: prev.speakingLessons + 1,
    }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setUserProfile(initialUserProfile);
    setSkillProgress(initialSkillProgress);
    setVocabulary(initialVocabulary);
    setGrammarLessons(initialGrammarLessons);
    setListeningLessons(initialListeningLessons);
    setWeeklyActivity(initialWeeklyActivity);
    setAchievements(initialAchievements);
    setLearningHistory(initialLearningHistory);
  };

  return (
    <LearningContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        updateUserProfile,
        skillProgress,
        vocabulary,
        toggleVocabLearned,
        toggleVocabFavorite,
        grammarLessons,
        completeGrammarLesson,
        listeningLessons,
        completeListeningLesson,
        speakingLessons,
        completeSpeakingPractice,
        pronunciationWords,
        weeklyActivity,
        monthlyProgress,
        achievements,
        learningHistory,
        addLearningTime,
        resetAllData,
        selectedGrammarLessonId,
        setSelectedGrammarLessonId,
        selectedListeningLessonId,
        setSelectedListeningLessonId,
        selectedSpeakingLessonId,
        setSelectedSpeakingLessonId,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
