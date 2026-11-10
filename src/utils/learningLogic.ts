export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LevelInfo {
  code: CefrLevel;
  label: string;
  description: string;
}

export function calculateLevel(scores: {
  speaking: number;
  listening: number;
  vocabulary: number;
  grammar: number;
}): LevelInfo {
  const avg = (scores.speaking + scores.listening + scores.vocabulary + scores.grammar) / 4;

  if (avg >= 90) {
    return {
      code: 'C2',
      label: 'C2 - Proficient',
      description: 'Can understand with ease virtually everything heard or read, and express spontaneously and fluently.',
    };
  }
  if (avg >= 80) {
    return {
      code: 'C1',
      label: 'C1 - Advanced',
      description: 'Can express ideas fluently and spontaneously without much obvious searching for expressions.',
    };
  }
  if (avg >= 65) {
    return {
      code: 'B2',
      label: 'B2 - Upper Intermediate',
      description: 'Can interact with a degree of fluency and spontaneity with native speakers without strain.',
    };
  }
  if (avg >= 50) {
    return {
      code: 'B1',
      label: 'B1 - Intermediate',
      description: 'Can understand the main points of clear standard input on familiar matters regularly encountered.',
    };
  }
  if (avg >= 35) {
    return {
      code: 'A2',
      label: 'A2 - Elementary',
      description: 'Can understand sentences and frequently used expressions related to areas of most immediate relevance.',
    };
  }
  return {
    code: 'A1',
    label: 'A1 - Beginner',
    description: 'Can understand and use familiar everyday expressions and very basic phrases.',
  };
}

export function calculateProgressPercentage(current: number, target: number): number {
  if (target <= 0) return 0;
  const ratio = (current / target) * 100;
  return Math.min(100, Math.max(0, Math.round(ratio)));
}

export function evaluateQuiz(
  userAnswers: Record<string, string>,
  correctAnswers: Record<string, string>
): { score: number; percentage: number; passed: boolean; correctCount: number; total: number } {
  const keys = Object.keys(correctAnswers);
  if (keys.length === 0) {
    return { score: 100, percentage: 100, passed: true, correctCount: 0, total: 0 };
  }

  let correct = 0;
  for (const key of keys) {
    const user = (userAnswers[key] || '').trim().toLowerCase();
    const target = (correctAnswers[key] || '').trim().toLowerCase();
    if (user === target) {
      correct++;
    }
  }

  const percentage = Math.round((correct / keys.length) * 100);
  return {
    score: percentage,
    percentage,
    passed: percentage >= 60,
    correctCount: correct,
    total: keys.length,
  };
}

export function calculateStreak(lastActiveIso: string, currentStreak: number): number {
  if (!lastActiveIso) return 1;

  const lastDate = new Date(lastActiveIso);
  const today = new Date();

  // Normalize to UTC dates to avoid time difference bugs
  const lastUtc = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  const diffDays = Math.floor((todayUtc - lastUtc) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return currentStreak; // already practiced today
  } else if (diffDays === 1) {
    return currentStreak + 1; // streak maintained
  } else {
    return 1; // streak reset
  }
}

export function checkAchievements(stats: {
  lessonsCompleted: number;
  streak: number;
  vocabularyCount: number;
  grammarScore: number;
  listeningScore: number;
  speakingScore: number;
}): Array<{ id: string; title: string; unlocked: boolean }> {
  return [
    {
      id: 'first_lesson',
      title: 'First Lesson Completed',
      unlocked: stats.lessonsCompleted >= 1,
    },
    {
      id: 'streak_7',
      title: '7-Day Learning Streak',
      unlocked: stats.streak >= 7,
    },
    {
      id: 'vocab_100',
      title: '100 Words Learned',
      unlocked: stats.vocabularyCount >= 100,
    },
    {
      id: 'grammar_beginner',
      title: 'Grammar Beginner',
      unlocked: stats.grammarScore >= 50,
    },
    {
      id: 'listening_explorer',
      title: 'Listening Explorer',
      unlocked: stats.listeningScore >= 50,
    },
    {
      id: 'speaking_starter',
      title: 'Speaking Starter',
      unlocked: stats.speakingScore >= 50,
    },
  ];
}
