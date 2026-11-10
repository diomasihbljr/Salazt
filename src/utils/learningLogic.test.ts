import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLevel,
  calculateProgressPercentage,
  evaluateQuiz,
  calculateStreak,
  checkAchievements,
} from './learningLogic';

test('calculateLevel assigns correct CEFR levels based on average skill scores', () => {
  const levelA1 = calculateLevel({ speaking: 20, listening: 30, vocabulary: 25, grammar: 25 });
  assert.equal(levelA1.code, 'A1');

  const levelA2 = calculateLevel({ speaking: 40, listening: 45, vocabulary: 48, grammar: 42 });
  assert.equal(levelA2.code, 'A2');

  const levelB1 = calculateLevel({ speaking: 55, listening: 60, vocabulary: 50, grammar: 55 });
  assert.equal(levelB1.code, 'B1');

  const levelB2 = calculateLevel({ speaking: 70, listening: 75, vocabulary: 65, grammar: 70 });
  assert.equal(levelB2.code, 'B2');

  const levelC1 = calculateLevel({ speaking: 82, listening: 85, vocabulary: 80, grammar: 85 });
  assert.equal(levelC1.code, 'C1');

  const levelC2 = calculateLevel({ speaking: 95, listening: 92, vocabulary: 96, grammar: 93 });
  assert.equal(levelC2.code, 'C2');
});

test('calculateProgressPercentage computes correct percentages clamped to 0-100', () => {
  assert.equal(calculateProgressPercentage(30, 60), 50);
  assert.equal(calculateProgressPercentage(0, 50), 0);
  assert.equal(calculateProgressPercentage(75, 50), 100);
  assert.equal(calculateProgressPercentage(15, 0), 0);
});

test('evaluateQuiz computes score, passing threshold, and counts accurately', () => {
  const userAnswers = {
    q1: 'goes',
    q2: 'has eaten',
    q3: 'in',
  };
  const correctAnswers = {
    q1: 'goes',
    q2: 'ate',
    q3: 'in',
  };

  const result = evaluateQuiz(userAnswers, correctAnswers);
  assert.equal(result.total, 3);
  assert.equal(result.correctCount, 2);
  assert.equal(result.percentage, 67);
  assert.equal(result.passed, true);
});

test('calculateStreak tracks consecutive days properly', () => {
  const today = new Date().toISOString();
  assert.equal(calculateStreak(today, 5), 5);

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  assert.equal(calculateStreak(yesterday, 5), 6);

  const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
  assert.equal(calculateStreak(fourDaysAgo, 5), 1);
});

test('checkAchievements detects unlocked badges accurately', () => {
  const achievements = checkAchievements({
    lessonsCompleted: 28,
    streak: 5,
    vocabularyCount: 150,
    grammarScore: 62,
    listeningScore: 58,
    speakingScore: 45,
  });

  const firstLesson = achievements.find((a) => a.id === 'first_lesson');
  const streak7 = achievements.find((a) => a.id === 'streak_7');
  const vocab100 = achievements.find((a) => a.id === 'vocab_100');

  assert.equal(firstLesson?.unlocked, true);
  assert.equal(streak7?.unlocked, false);
  assert.equal(vocab100?.unlocked, true);
});
