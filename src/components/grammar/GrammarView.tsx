import React, { useState, useEffect } from 'react';
import {
  BookOpenCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  RotateCcw,
  Languages,
  Check,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { GrammarLesson } from '../../types';

export const GrammarView: React.FC = () => {
  const {
    grammarLessons,
    completeGrammarLesson,
    selectedGrammarLessonId,
    setSelectedGrammarLessonId,
  } = useLearning();

  // Active Category filter
  const [activeCategory, setActiveCategory] = useState<'all' | 'basic' | 'tenses' | 'structure' | 'advanced'>('all');

  // Currently viewing lesson
  const [activeLesson, setActiveLesson] = useState<GrammarLesson>(() => {
    if (selectedGrammarLessonId) {
      const found = grammarLessons.find((l) => l.id === selectedGrammarLessonId);
      if (found) return found;
    }
    return grammarLessons[0];
  });

  useEffect(() => {
    if (selectedGrammarLessonId) {
      const found = grammarLessons.find((l) => l.id === selectedGrammarLessonId);
      if (found) {
        setActiveLesson(found);
      }
    }
  }, [selectedGrammarLessonId, grammarLessons]);

  // Exercise interaction state
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [arrangedWords, setArrangedWords] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lessonScore, setLessonScore] = useState<number | null>(null);

  // Reset exercises when lesson changes
  useEffect(() => {
    setUserAnswers({});
    setArrangedWords({});
    setIsSubmitted(false);
    setLessonScore(null);
  }, [activeLesson.id]);

  const filteredLessons = grammarLessons.filter((l) =>
    activeCategory === 'all' ? true : l.category === activeCategory
  );

  const handleSelectOption = (exerciseId: string, option: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [exerciseId]: option }));
  };

  const handleToggleWordArrange = (exerciseId: string, word: string) => {
    if (isSubmitted) return;
    setArrangedWords((prev) => {
      const current = prev[exerciseId] || [];
      const exists = current.includes(word);
      const updated = exists ? current.filter((w) => w !== word) : [...current, word];
      // update user answer as joined string
      setUserAnswers((u) => ({ ...u, [exerciseId]: updated.join(' ') }));
      return { ...prev, [exerciseId]: updated };
    });
  };

  const handleSubmitLessonExercises = () => {
    let correct = 0;
    activeLesson.exercises.forEach((ex) => {
      const ans = (userAnswers[ex.id] || '').trim().toLowerCase();
      const target = ex.correctAnswer.trim().toLowerCase();
      if (ans === target) {
        correct++;
      }
    });

    const percentage = Math.round((correct / activeLesson.exercises.length) * 100);
    setLessonScore(percentage);
    setIsSubmitted(true);
    completeGrammarLesson(activeLesson.id, percentage);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Grammar Categories Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-[#E9E5DA] shadow-2xs">
        {[
          { id: 'all', label: 'All Topics' },
          { id: 'basic', label: '1. Basic Grammar' },
          { id: 'tenses', label: '2. Tenses' },
          { id: 'structure', label: '3. Sentence Structure' },
          { id: 'advanced', label: '4. Advanced Grammar' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#546B41] text-white shadow-2xs'
                : 'text-[#263124] hover:bg-[#FFF8EC]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Selected Lesson Material & Exercises */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Lesson Detail Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E5DA] shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DA]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFF8EC] text-[#546B41] border border-[#DCCCAC]">
                  {activeLesson.categoryLabel}
                </span>
                <span className="text-xs font-bold text-[#77796F]">
                  Level: {activeLesson.difficulty}
                </span>
              </div>
              {activeLesson.isCompleted && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed ({activeLesson.bestScore}%)
                </span>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#263124] tracking-tight">
                {activeLesson.title}
              </h2>

              {/* Bilingual Explanations */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/60">
                  <span className="text-xs font-bold text-[#546B41] flex items-center gap-1.5 mb-1">
                    <Languages className="w-3.5 h-3.5" />
                    <span>Penjelasan (Bahasa Indonesia)</span>
                  </span>
                  <p className="text-xs text-[#263124] leading-relaxed">
                    {activeLesson.explanationId}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E9E5DA]">
                  <span className="text-xs font-bold text-[#77796F] flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>English Explanation</span>
                  </span>
                  <p className="text-xs text-[#263124] leading-relaxed">
                    {activeLesson.explanationEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Sentence Formula / Structure */}
            <div className="p-4 rounded-xl bg-[#546B41]/10 border border-[#546B41]/30">
              <span className="text-xs font-bold text-[#546B41] uppercase tracking-wider block mb-1">
                Grammar Structure & Formula:
              </span>
              <code className="text-sm font-bold text-[#263124] font-mono block">
                {activeLesson.formula}
              </code>
            </div>

            {/* Examples Sections */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#263124]">Sentence Examples</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Positive Examples */}
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <span className="font-bold text-emerald-800 block mb-2">Positive (+)</span>
                  <ul className="space-y-2 text-[#263124]">
                    {activeLesson.positiveExamples.map((ex, i) => (
                      <li key={i} className="leading-snug">• {ex}</li>
                    ))}
                  </ul>
                </div>

                {/* Negative Examples */}
                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
                  <span className="font-bold text-rose-700 block mb-2">Negative (-)</span>
                  <ul className="space-y-2 text-[#263124]">
                    {activeLesson.negativeExamples.map((ex, i) => (
                      <li key={i} className="leading-snug">• {ex}</li>
                    ))}
                  </ul>
                </div>

                {/* Question Examples */}
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                  <span className="font-bold text-amber-800 block mb-2">Questions (?)</span>
                  <ul className="space-y-2 text-[#263124]">
                    {activeLesson.questionExamples.map((ex, i) => (
                      <li key={i} className="leading-snug">• {ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="p-4 rounded-xl bg-white border border-[#E9E5DA] space-y-3">
              <span className="font-bold text-xs text-[#546B41] uppercase tracking-wider block">
                Common Mistakes & How to Avoid Them
              </span>
              {activeLesson.commonMistakes.map((m, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#FFF8EC]/60 border border-[#DCCCAC] text-xs space-y-1">
                  <div className="flex items-center gap-2 text-rose-600 line-through">
                    <span>✗ {m.incorrect}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <span>✓ {m.correct}</span>
                  </div>
                  <p className="text-[#77796F] text-[11px] pt-1 border-t border-[#E9E5DA]">
                    <strong>Note: </strong>{m.explanation}
                  </p>
                </div>
              ))}
            </div>

            {/* Practical Usage in Daily Conversations */}
            <div className="p-4 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC] text-xs text-[#263124]">
              <strong className="text-[#546B41] block mb-1">Everyday Practical Context:</strong>
              <p className="text-[#77796F] leading-relaxed">{activeLesson.practicalUsage}</p>
            </div>
          </div>

          {/* Interactive Lesson Exercises */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E5DA] shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DA]">
              <div>
                <h3 className="font-bold text-base text-[#263124]">Interactive Practice Exercises</h3>
                <p className="text-xs text-[#77796F]">
                  Test your mastery of {activeLesson.title} to lock in your progress score.
                </p>
              </div>
              {lessonScore !== null && (
                <span className="px-3.5 py-1.5 rounded-full bg-[#546B41] text-white text-xs font-bold">
                  Score: {lessonScore}%
                </span>
              )}
            </div>

            <div className="space-y-6">
              {activeLesson.exercises.map((ex, idx) => {
                const currentAns = userAnswers[ex.id] || '';
                const isCorrect = isSubmitted && currentAns.trim().toLowerCase() === ex.correctAnswer.trim().toLowerCase();
                const isWrong = isSubmitted && !isCorrect;

                return (
                  <div key={ex.id} className="p-4 rounded-xl bg-[#FFF8EC]/40 border border-[#E9E5DA] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#546B41]">
                        Exercise {idx + 1} ({ex.type.replace('-', ' ')})
                      </span>
                      {isSubmitted && (
                        <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-[#263124]">{ex.question}</p>

                    {/* Exercise Type 1: Sentence Arrangement Word Blocks */}
                    {ex.type === 'sentence-arrange' && ex.arrangeWords && (
                      <div className="space-y-3">
                        {/* Assembled sentence preview */}
                        <div className="min-h-11 p-2.5 rounded-xl bg-white border border-[#DCCCAC] flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#546B41]">
                          {(arrangedWords[ex.id] || []).length > 0 ? (
                            (arrangedWords[ex.id] || []).map((w, wIdx) => (
                              <span
                                key={wIdx}
                                className="px-2.5 py-1 rounded-lg bg-[#546B41] text-white shadow-2xs"
                              >
                                {w}
                              </span>
                            ))
                          ) : (
                            <span className="text-[#77796F] italic font-normal">
                              Click word blocks below in the correct order...
                            </span>
                          )}
                        </div>

                        {/* Word bank blocks */}
                        <div className="flex flex-wrap gap-2">
                          {ex.arrangeWords.map((word) => {
                            const isPicked = (arrangedWords[ex.id] || []).includes(word);
                            return (
                              <button
                                key={word}
                                disabled={isSubmitted}
                                onClick={() => handleToggleWordArrange(ex.id, word)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  isPicked
                                    ? 'bg-[#E9E5DA] text-[#77796F] border-transparent opacity-60'
                                    : 'bg-white hover:bg-[#FFF8EC] text-[#263124] border-[#E9E5DA] shadow-2xs'
                                }`}
                              >
                                {word}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Exercise Type 2: Multiple Choice & Fill-Blank Options */}
                    {ex.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ex.options.map((opt) => {
                          const isSelected = userAnswers[ex.id] === opt;
                          let btnStyle = 'bg-white hover:bg-[#FFF8EC] border-[#E9E5DA] text-[#263124]';

                          if (isSelected) {
                            btnStyle = 'bg-[#546B41] text-white border-[#546B41] font-bold';
                          }
                          if (isSubmitted) {
                            if (opt === ex.correctAnswer) {
                              btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                            } else if (isSelected && isWrong) {
                              btnStyle = 'bg-rose-100 text-rose-900 border-rose-300 line-through';
                            }
                          }

                          return (
                            <button
                              key={opt}
                              disabled={isSubmitted}
                              onClick={() => handleSelectOption(ex.id, opt)}
                              className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanations after submit */}
                    {isSubmitted && (
                      <div className="p-3 rounded-lg bg-white border border-[#DCCCAC] text-xs text-[#77796F]">
                        <strong className="text-[#263124] block mb-0.5">Explanation:</strong>
                        <p>{ex.explanationId}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit / Reset Actions */}
            <div className="pt-4 border-t border-[#E9E5DA] flex items-center justify-end gap-3">
              {isSubmitted ? (
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setUserAnswers({});
                    setArrangedWords({});
                    setLessonScore(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#546B41] hover:bg-[#3F5230] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-2xs"
                >
                  Try Exercises Again
                </button>
              ) : (
                <button
                  onClick={handleSubmitLessonExercises}
                  disabled={Object.keys(userAnswers).length < activeLesson.exercises.length}
                  className="px-6 py-2.5 rounded-xl bg-[#546B41] hover:bg-[#3F5230] text-white font-bold text-xs sm:text-sm disabled:opacity-50 transition-all cursor-pointer shadow-2xs"
                >
                  Grade My Answers
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Lessons List Drawer */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs">
            <h4 className="font-bold text-sm text-[#263124] mb-3">All Grammar Lessons</h4>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredLessons.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLesson(l)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    l.id === activeLesson.id
                      ? 'bg-[#546B41] text-white border-[#546B41] font-bold shadow-2xs'
                      : 'bg-white hover:bg-[#FFF8EC] border-[#E9E5DA] text-[#263124]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{l.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        l.id === activeLesson.id ? 'bg-white/20 text-white' : 'bg-[#FFF8EC] text-[#546B41]'
                      }`}
                    >
                      {l.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] opacity-80 mt-1 font-normal">
                    <span>{l.categoryLabel}</span>
                    {l.isCompleted && <span>✓ {l.bestScore}%</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
