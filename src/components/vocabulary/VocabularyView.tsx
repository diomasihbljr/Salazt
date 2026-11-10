import React, { useState, useMemo } from 'react';
import {
  BookA,
  Sparkles,
  Search,
  Star,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  HelpCircle,
  Award,
  Check,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { VocabularyItem } from '../../types';
import { speakEnglish } from '../../utils/audio';

export const VocabularyView: React.FC = () => {
  const {
    vocabulary,
    userProfile,
    skillProgress,
    toggleVocabLearned,
    toggleVocabFavorite,
    addLearningTime,
  } = useLearning();

  // Mode: 'cards' | 'flashcards' | 'quiz'
  const [viewMode, setViewMode] = useState<'cards' | 'flashcards' | 'quiz'>('cards');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Categories list
  const categories = [
    'All',
    'Daily Conversation',
    'Education',
    'Business',
    'Travel',
    'Food & Drinks',
    'Technology',
    'Health',
    'Entertainment',
    'Work & Career',
  ];

  // Filtered vocabulary list
  const filteredVocabulary = useMemo(() => {
    return vocabulary.filter((item) => {
      const matchSearch =
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.exampleEn.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
      const matchFavorite = !showFavoritesOnly || item.isFavorite;

      return matchSearch && matchCategory && matchDifficulty && matchFavorite;
    });
  }, [vocabulary, searchQuery, selectedCategory, selectedDifficulty, showFavoritesOnly]);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>(() =>
    filteredVocabulary.map((_, i) => i)
  );

  const activeFlashcard: VocabularyItem | undefined =
    filteredVocabulary[shuffledIndices[flashcardIndex] ?? flashcardIndex] || filteredVocabulary[0];

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % filteredVocabulary.length);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + filteredVocabulary.length) % filteredVocabulary.length);
  };

  const handleShuffleFlashcards = () => {
    setIsFlipped(false);
    const indices = filteredVocabulary.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
    setFlashcardIndex(0);
  };

  // Quiz state
  const [quizQuestions] = useState([
    {
      id: 'vq_1',
      type: 'multiple-choice',
      prompt: 'What is the correct English word for "Menyelesaikan / Mencapai sesuatu yang ditargetkan"?',
      options: ['Accomplish', 'Comprehend', 'Negotiate', 'Delicious'],
      correct: 'Accomplish',
      explanation: '"Accomplish" means to finish something successfully or achieve a specific goal.',
    },
    {
      id: 'vq_2',
      type: 'match-meaning',
      prompt: 'Match the word "Itinerary" with its correct Indonesian meaning:',
      options: ['Rencana jadwal perjalanan wisata', 'Minuman hangat berkafein', 'Batas waktu pengumpulan', 'Kekebalan tubuh'],
      correct: 'Rencana jadwal perjalanan wisata',
      explanation: '"Itinerary" adalah rencana rinci rute dan jadwal perjalanan.',
    },
    {
      id: 'vq_3',
      type: 'fill-blank',
      prompt: 'Fill in the blank: "Taking short breaks every hour significantly boosts cognitive ____."',
      options: ['productivity', 'algorithm', 'destination', 'beverage'],
      correct: 'productivity',
      explanation: 'Cognitive productivity (produktivitas berpikir) is enhanced by regular short rests.',
    },
    {
      id: 'vq_4',
      type: 'translate',
      prompt: 'Translate to English: "Rasa terima kasih yang tulus"',
      options: ['Sincere gratitude', 'Creative passion', 'Polite manner', 'Natural curriculum'],
      correct: 'Sincere gratitude',
      explanation: '"Gratitude" = rasa syukur/terima kasih. "Sincere" = tulus.',
    },
  ]);

  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleSubmitQuiz = () => {
    let correct = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) correct++;
    });
    const percentage = Math.round((correct / quizQuestions.length) * 100);
    setQuizScore(percentage);
    setIsQuizSubmitted(true);
    addLearningTime(10);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* SECTION A: VOCABULARY DASHBOARD */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Words Learned */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs">
          <div className="flex items-center justify-between text-[#77796F] text-xs font-semibold">
            <span>Total Words Learned</span>
            <div className="w-8 h-8 rounded-lg bg-[#546B41]/10 text-[#546B41] flex items-center justify-center">
              <BookA className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-[#263124]">
            {userProfile.vocabularyCount}
          </div>
          <p className="text-[11px] text-[#77796F] mt-0.5">Tracked in personal lexicon</p>
        </div>

        {/* Words Mastered */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs">
          <div className="flex items-center justify-between text-[#77796F] text-xs font-semibold">
            <span>Words Mastered</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-[#263124]">
            {skillProgress.vocabularyMastered}
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">High recall accuracy</p>
        </div>

        {/* Practicing */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs">
          <div className="flex items-center justify-between text-[#77796F] text-xs font-semibold">
            <span>Currently Practicing</span>
            <div className="w-8 h-8 rounded-lg bg-[#DCCCAC]/50 text-[#546B41] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-[#263124]">
            {userProfile.vocabularyCount - skillProgress.vocabularyMastered}
          </div>
          <p className="text-[11px] text-[#77796F] mt-0.5">In active spaced repetition</p>
        </div>

        {/* Daily Goal */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs">
          <div className="flex items-center justify-between text-[#77796F] text-xs font-semibold">
            <span>Daily Vocab Goal</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF8EC] text-[#546B41] border border-[#DCCCAC]">
              7 / 10
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-[#263124]">10 words/day</div>
          <div className="w-full h-2 bg-[#E9E5DA] rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-[#546B41] rounded-full" style={{ width: '70%' }} />
          </div>
        </div>
      </section>

      {/* View Switcher: Cards vs Flashcards vs Quiz */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-2xl border border-[#E9E5DA] shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-[#546B41] text-white shadow-2xs'
                : 'text-[#263124] hover:bg-[#FFF8EC]'
            }`}
          >
            Vocabulary Cards ({filteredVocabulary.length})
          </button>

          <button
            onClick={() => setViewMode('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'flashcards'
                ? 'bg-[#546B41] text-white shadow-2xs'
                : 'text-[#263124] hover:bg-[#FFF8EC]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Interactive Flashcards</span>
          </button>

          <button
            onClick={() => setViewMode('quiz')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'quiz'
                ? 'bg-[#546B41] text-white shadow-2xs'
                : 'text-[#263124] hover:bg-[#FFF8EC]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Vocabulary Quiz</span>
          </button>
        </div>

        {/* Favorites Filter Shortcut */}
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            showFavoritesOnly
              ? 'bg-[#546B41] text-white border-[#546B41]'
              : 'bg-white text-[#77796F] border-[#E9E5DA] hover:bg-[#FFF8EC]'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-white' : ''}`} />
          <span>Favorites Only</span>
        </button>
      </div>

      {/* SECTION B & F: SEARCH & CATEGORY FILTERS */}
      {viewMode === 'cards' && (
        <section className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77796F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vocabulary by English word, Indonesian translation, or sentence..."
              className="w-full bg-white border border-[#E9E5DA] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#263124] focus:outline-none focus:border-[#546B41] shadow-2xs"
            />
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#546B41] text-white shadow-2xs'
                    : 'bg-white text-[#77796F] hover:bg-[#FFF8EC] border border-[#E9E5DA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* SECTION C: VOCABULARY CARDS LIST */}
      {viewMode === 'cards' && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocabulary.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E9E5DA] p-5 shadow-2xs flex flex-col justify-between hover:border-[#99AD7A] hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-[#263124]">{item.word}</h4>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#FFF8EC] text-[#546B41] border border-[#DCCCAC]/50">
                        {item.partOfSpeech}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#546B41] font-semibold">{item.phonetic}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speakEnglish(item.word)}
                      className="p-1.5 rounded-lg text-[#546B41] hover:bg-[#FFF8EC] transition-colors"
                      title="Listen audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleVocabFavorite(item.id)}
                      className="p-1.5 rounded-lg text-[#77796F] hover:bg-[#FFF8EC] transition-colors"
                      title="Favorite"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          item.isFavorite ? 'fill-[#546B41] text-[#546B41]' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Indonesian Translation */}
                <div className="p-2.5 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/50 text-xs text-[#263124] font-semibold mb-3">
                  {item.translationId}
                </div>

                {/* Example sentence */}
                <div className="space-y-1 text-xs">
                  <div className="text-[#263124] leading-relaxed">
                    <strong className="text-[#546B41]">EN: </strong>"{item.exampleEn}"
                  </div>
                  <div className="text-[#77796F] leading-relaxed italic">
                    <strong className="text-[#77796F]">ID: </strong>"{item.exampleId}"
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-[#E9E5DA] flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E9E5DA]/60 text-[#263124]">
                  {item.category}
                </span>

                <button
                  onClick={() => toggleVocabLearned(item.id)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.isLearned
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-white hover:bg-[#FFF8EC] text-[#77796F] border border-[#E9E5DA]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.isLearned ? 'Learned' : 'Mark Learned'}</span>
                </button>
              </div>
            </div>
          ))}

          {filteredVocabulary.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-[#E9E5DA]">
              <BookA className="w-10 h-10 text-[#DCCCAC] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#263124]">No vocabulary found</p>
              <p className="text-xs text-[#77796F] mt-1">Try resetting your search query or filters.</p>
            </div>
          )}
        </section>
      )}

      {/* SECTION D: INTERACTIVE 3D FLASHCARDS */}
      {viewMode === 'flashcards' && activeFlashcard && (
        <section className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-[#77796F]">
            <span>
              Card {flashcardIndex + 1} of {filteredVocabulary.length}
            </span>
            <span className="font-semibold text-[#546B41]">Click anywhere on card to flip</span>
          </div>

          {/* 3D Flip Flashcard */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 w-full h-80 cursor-pointer select-none"
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform rounded-3xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front Side */}
              <div className="absolute inset-0 backface-hidden bg-white border-2 border-[#DCCCAC] rounded-3xl p-8 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFF8EC] text-[#546B41] border border-[#DCCCAC]">
                    {activeFlashcard.category}
                  </span>
                  <span className="text-xs font-bold text-[#77796F] uppercase">
                    {activeFlashcard.difficulty}
                  </span>
                </div>

                <div className="text-center my-auto space-y-2">
                  <h3 className="text-4xl font-black text-[#263124] tracking-tight">
                    {activeFlashcard.word}
                  </h3>
                  <p className="text-base font-mono font-semibold text-[#546B41]">
                    {activeFlashcard.phonetic}
                  </p>
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#E9E5DA]/60 text-[#263124]">
                    {activeFlashcard.partOfSpeech}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#77796F]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakEnglish(activeFlashcard.word);
                    }}
                    className="p-2 rounded-xl bg-[#FFF8EC] text-[#546B41] hover:bg-[#DCCCAC]/40"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="italic">Tap to reveal meaning ↻</span>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#FFF8EC] border-2 border-[#546B41] rounded-3xl p-8 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#546B41]">Indonesian Translation</span>
                  <span className="text-xs font-bold text-[#77796F]">{activeFlashcard.word}</span>
                </div>

                <div className="text-center my-auto space-y-3">
                  <h3 className="text-3xl font-extrabold text-[#546B41]">
                    {activeFlashcard.translationId}
                  </h3>
                  <div className="p-3 bg-white rounded-xl border border-[#DCCCAC] text-xs text-left text-[#263124] space-y-1">
                    <p className="font-medium">"{activeFlashcard.exampleEn}"</p>
                    <p className="text-[#77796F] italic">"{activeFlashcard.exampleId}"</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#77796F]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVocabFavorite(activeFlashcard.id);
                    }}
                    className="p-2 rounded-xl bg-white text-[#546B41] hover:bg-[#FFF8EC]"
                  >
                    <Star
                      className={`w-4 h-4 ${activeFlashcard.isFavorite ? 'fill-[#546B41]' : ''}`}
                    />
                  </button>
                  <span className="italic">Tap to flip back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              onClick={handlePrevFlashcard}
              className="p-3 rounded-xl bg-white border border-[#E9E5DA] hover:bg-[#FFF8EC] text-[#263124] font-bold text-xs transition-all shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffleFlashcards}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#E9E5DA] hover:bg-[#FFF8EC] text-xs font-bold text-[#263124] transition-all cursor-pointer shadow-2xs"
              >
                <Shuffle className="w-4 h-4 text-[#546B41]" />
                <span>Shuffle</span>
              </button>

              <button
                onClick={() => toggleVocabLearned(activeFlashcard.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  activeFlashcard.isLearned
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#546B41] text-white hover:bg-[#3F5230]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeFlashcard.isLearned ? 'Learned ✓' : 'Mark Learned'}</span>
              </button>
            </div>

            <button
              onClick={handleNextFlashcard}
              className="p-3 rounded-xl bg-white border border-[#E9E5DA] hover:bg-[#FFF8EC] text-[#263124] font-bold text-xs transition-all shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      )}

      {/* SECTION E: VOCABULARY QUIZ */}
      {viewMode === 'quiz' && (
        <section className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E5DA] shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DA]">
            <div>
              <h3 className="font-bold text-lg text-[#263124]">Vocabulary Mastery Quiz</h3>
              <p className="text-xs text-[#77796F]">
                Test your understanding across multiple choice, translation, and fill-in-the-blanks.
              </p>
            </div>
            {quizScore !== null && (
              <span className="px-3.5 py-1.5 rounded-full bg-[#546B41] text-white text-xs font-bold">
                Score: {quizScore}%
              </span>
            )}
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, idx) => {
              const isCorrect = isQuizSubmitted && quizAnswers[q.id] === q.correct;
              const isWrong = isQuizSubmitted && quizAnswers[q.id] !== q.correct;

              return (
                <div key={q.id} className="p-4 rounded-xl bg-[#FFF8EC]/40 border border-[#E9E5DA] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#546B41]">
                      Question {idx + 1} ({q.type.replace('-', ' ')})
                    </span>
                    {isQuizSubmitted && (
                      <span
                        className={`text-xs font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}
                      >
                        {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-[#263124]">{q.prompt}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const isSelected = quizAnswers[q.id] === opt;
                      let btnStyle = 'bg-white hover:bg-[#FFF8EC] border-[#E9E5DA] text-[#263124]';

                      if (isSelected) {
                        btnStyle = 'bg-[#546B41] text-white border-[#546B41] font-bold';
                      }
                      if (isQuizSubmitted) {
                        if (opt === q.correct) {
                          btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                        } else if (isSelected && isWrong) {
                          btnStyle = 'bg-rose-100 text-rose-900 border-rose-300 line-through';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={isQuizSubmitted}
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                          className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isQuizSubmitted && (
                    <div className="p-3 rounded-lg bg-white border border-[#DCCCAC] text-xs text-[#77796F]">
                      <strong className="text-[#263124] block mb-0.5">Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E9E5DA] flex items-center justify-end gap-3">
            {isQuizSubmitted ? (
              <button
                onClick={() => {
                  setIsQuizSubmitted(false);
                  setQuizAnswers({});
                  setQuizScore(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#546B41] hover:bg-[#3F5230] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-2xs"
              >
                Try Again
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                className="px-6 py-2.5 rounded-xl bg-[#546B41] hover:bg-[#3F5230] text-white font-bold text-xs sm:text-sm disabled:opacity-50 transition-all cursor-pointer shadow-2xs"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
