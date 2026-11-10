import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { ListeningLesson } from '../../types';
import { speakEnglish, stopSpeaking } from '../../utils/audio';

export const ListeningView: React.FC = () => {
  const {
    listeningLessons,
    completeListeningLesson,
    selectedListeningLessonId,
    setSelectedListeningLessonId,
  } = useLearning();

  const [activeLesson, setActiveLesson] = useState<ListeningLesson>(() => {
    if (selectedListeningLessonId) {
      const found = listeningLessons.find((l) => l.id === selectedListeningLessonId);
      if (found) return found;
    }
    return listeningLessons[0];
  });

  useEffect(() => {
    if (selectedListeningLessonId) {
      const found = listeningLessons.find((l) => l.id === selectedListeningLessonId);
      if (found) {
        setActiveLesson(found);
      }
    }
  }, [selectedListeningLessonId, listeningLessons]);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Exercises and Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Reset quiz when lesson changes
  useEffect(() => {
    stopSpeaking();
    setIsPlaying(false);
    setCurrentTime(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizScore(null);
    setShowTranscript(false);
  }, [activeLesson.id]);

  // Audio simulation timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= activeLesson.durationSeconds) {
            setIsPlaying(false);
            stopSpeaking();
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, activeLesson.durationSeconds]);

  const togglePlayAudio = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakEnglish(activeLesson.audioScript, {
        rate: playbackSpeed,
        onEnd: () => {
          setIsPlaying(false);
          setCurrentTime(0);
        },
      });
    }
  };

  const handleReplay = () => {
    stopSpeaking();
    setCurrentTime(0);
    setIsPlaying(true);
    speakEnglish(activeLesson.audioScript, {
      rate: playbackSpeed,
      onEnd: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
    });
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      // Re-trigger with new rate
      speakEnglish(activeLesson.audioScript, {
        rate: speed,
        onEnd: () => setIsPlaying(false),
      });
    }
  };

  const handleSelectOption = (exerciseId: string, option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: option }));
  };

  const handleSubmitQuiz = () => {
    const totalQuestions = activeLesson.exercises.length;
    let correctCount = 0;

    activeLesson.exercises.forEach((ex) => {
      if (selectedAnswers[ex.id] === ex.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    setQuizScore(scorePercent);
    setIsSubmitted(true);
    completeListeningLesson(activeLesson.id, scorePercent);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="space-y-6">
      {/* Level Selection Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E9E5DA] pb-3">
        {(['Beginner', 'Elementary', 'Intermediate', 'Advanced'] as const).map((lvl) => {
          const matching = listeningLessons.filter((l) => l.level === lvl);
          return (
            <div key={lvl} className="flex items-center gap-1.5">
              {matching.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLesson(l)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeLesson.id === l.id
                      ? 'bg-[#546B41] text-white shadow-2xs'
                      : 'bg-white text-[#263124] hover:bg-[#FFF8EC] border border-[#E9E5DA]'
                  }`}
                >
                  {l.level}: {l.title.split(' ')[0]}...
                </button>
              ))}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Audio Player & Exercises */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Audio Player Card */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E9E5DA] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#546B41] uppercase tracking-wider">
                {activeLesson.level} Listening Practice
              </span>
              <span className="text-xs font-semibold text-[#77796F] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#99AD7A]" />
                {activeLesson.duration}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#263124]">{activeLesson.title}</h3>
            <p className="text-xs text-[#77796F] mt-1">Scenario: {activeLesson.scenario}</p>

            {/* Audio Wave & Progress Bar */}
            <div className="mt-6 p-5 rounded-2xl bg-[#FFF8EC] border border-[#DCCCAC]/60">
              <div className="flex items-center justify-between text-xs font-bold text-[#546B41] mb-2">
                <span>{formatSeconds(currentTime)}</span>
                <span>{formatSeconds(activeLesson.durationSeconds)}</span>
              </div>

              {/* Seek / Progress Bar */}
              <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[#DCCCAC]/40 p-0.5">
                <div
                  className="h-full bg-[#546B41] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (currentTime / (activeLesson.durationSeconds || 1)) * 100
                    )}%`,
                  }}
                />
              </div>

              {/* Audio Controls */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayAudio}
                    className="w-12 h-12 rounded-full bg-[#546B41] hover:bg-[#3F5230] text-white flex items-center justify-center shadow-sm transition-all cursor-pointer"
                    aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <button
                    onClick={handleReplay}
                    className="p-2.5 rounded-xl bg-white hover:bg-[#DCCCAC]/30 text-[#263124] border border-[#DCCCAC]/60 transition-colors"
                    title="Replay from start"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Speed Controls */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#DCCCAC]/60">
                  {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        playbackSpeed === speed
                          ? 'bg-[#546B41] text-white'
                          : 'text-[#77796F] hover:text-[#263124]'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Transcript Disclosure */}
            <div className="mt-5 pt-4 border-t border-[#E9E5DA]">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#546B41] hover:underline cursor-pointer"
              >
                {showTranscript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showTranscript ? 'Hide Audio Transcript' : 'Reveal Audio Transcript & Translation'}</span>
              </button>

              {showTranscript && (
                <div className="mt-3 p-4 rounded-xl bg-[#FFF8EC]/60 border border-[#DCCCAC] text-xs space-y-3 animate-in fade-in">
                  <div>
                    <span className="font-bold text-[#546B41] block mb-1">English Dialogue:</span>
                    <p className="text-[#263124] leading-relaxed italic">{activeLesson.audioScript}</p>
                  </div>
                  <div className="border-t border-[#E9E5DA] pt-2">
                    <span className="font-bold text-[#77796F] block mb-1">Terjemahan Bahasa Indonesia:</span>
                    <p className="text-[#77796F] leading-relaxed">{activeLesson.transcriptId}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Listening Comprehension Exercises */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DA]">
              <div>
                <h4 className="font-bold text-base text-[#263124]">Comprehension Exercises</h4>
                <p className="text-xs text-[#77796F]">
                  Answer following questions based on the audio conversation
                </p>
              </div>
              {quizScore !== null && (
                <span className="px-3 py-1 rounded-full bg-[#546B41] text-white text-xs font-bold">
                  Score: {quizScore}%
                </span>
              )}
            </div>

            <div className="space-y-6">
              {activeLesson.exercises.map((ex, idx) => {
                const isAnswered = Boolean(selectedAnswers[ex.id]);
                const isCorrect = isSubmitted && selectedAnswers[ex.id] === ex.correctAnswer;
                const isWrong = isSubmitted && selectedAnswers[ex.id] !== ex.correctAnswer;

                return (
                  <div key={ex.id} className="p-4 rounded-xl bg-[#FFF8EC]/40 border border-[#E9E5DA] space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-bold text-[#546B41]">
                        Question {idx + 1} ({ex.type.replace('-', ' ')})
                      </span>
                      {isSubmitted && (
                        <span>
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="w-4 h-4" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                              <XCircle className="w-4 h-4" /> Incorrect
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-[#263124]">{ex.question}</p>

                    {/* Options */}
                    <div className="space-y-2">
                      {ex.options?.map((opt) => {
                        const isSelected = selectedAnswers[ex.id] === opt;
                        let optionStyle = 'bg-white hover:bg-[#FFF8EC] border-[#E9E5DA] text-[#263124]';

                        if (isSelected) {
                          optionStyle = 'bg-[#546B41] text-white border-[#546B41] font-bold';
                        }
                        if (isSubmitted) {
                          if (opt === ex.correctAnswer) {
                            optionStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                          } else if (isSelected && isWrong) {
                            optionStyle = 'bg-rose-100 text-rose-900 border-rose-300 line-through';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(ex.id, opt)}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {isSelected && <Check className="w-4 h-4 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submission */}
                    {isSubmitted && (
                      <div className="p-3 rounded-lg bg-white border border-[#DCCCAC] text-xs text-[#77796F]">
                        <strong className="text-[#263124] block mb-0.5">Explanation:</strong>
                        {ex.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit / Retake Buttons */}
            <div className="pt-4 border-t border-[#E9E5DA] flex items-center justify-end gap-3">
              {isSubmitted ? (
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedAnswers({});
                    setQuizScore(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#546B41] hover:bg-[#3F5230] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-2xs"
                >
                  Retake Exercise
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < activeLesson.exercises.length}
                  className="px-6 py-2.5 rounded-xl bg-[#546B41] hover:bg-[#3F5230] text-white font-bold text-xs sm:text-sm disabled:opacity-50 transition-all cursor-pointer shadow-2xs"
                >
                  Submit Answers
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Lessons Drawer */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs">
            <h4 className="font-bold text-sm text-[#263124] mb-3">All Listening Lessons</h4>
            <div className="space-y-2">
              {listeningLessons.map((l) => (
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
                      {l.level}
                    </span>
                  </div>
                  <span className="text-[11px] opacity-80 block mt-1 font-normal">{l.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
