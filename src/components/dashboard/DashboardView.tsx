import React from 'react';
import {
  Clock,
  BookOpen,
  Flame,
  BookA,
  Play,
  ArrowRight,
  Mic,
  Headphones,
  BookOpenCheck,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const DashboardView: React.FC = () => {
  const {
    userProfile,
    skillProgress,
    weeklyActivity,
    setActiveTab,
    setSelectedGrammarLessonId,
    setSelectedListeningLessonId,
    setSelectedSpeakingLessonId,
  } = useLearning();

  const dailyGoalPercent = Math.min(
    100,
    Math.round((userProfile.todayMinutes / userProfile.dailyGoalMinutes) * 100)
  );

  const maxWeeklyMinutes = Math.max(...weeklyActivity.map((w) => w.minutes), 50);

  const recommendedLessons = [
    {
      id: 'rec_spk',
      category: 'Speaking',
      categoryType: 'speaking-listening',
      icon: Mic,
      title: 'Daily Conversation & Catching Up',
      description: 'Practice natural greetings, conversational pacing, and voice recordings with audio feedback.',
      difficulty: 'A2',
      duration: '15 mins',
      action: () => {
        setSelectedSpeakingLessonId('spk_1');
        setActiveTab('speaking-listening');
      },
    },
    {
      id: 'rec_list',
      category: 'Listening',
      categoryType: 'speaking-listening',
      icon: Headphones,
      title: 'A Friendly Meetup at the Botanical Park',
      description: 'Train your ear with clear dialogue audio, speed controls, and interactive comprehension tests.',
      difficulty: 'A1',
      duration: '12 mins',
      action: () => {
        setSelectedListeningLessonId('list_1');
        setActiveTab('speaking-listening');
      },
    },
    {
      id: 'rec_vocab',
      category: 'Vocabulary',
      categoryType: 'vocabulary',
      icon: BookA,
      title: 'Work & Career Essential Flashcards',
      description: 'Master high-frequency business and productivity vocabulary with 3D flip cards and audio phonetics.',
      difficulty: 'A2-B1',
      duration: '10 mins',
      action: () => {
        setActiveTab('vocabulary');
      },
    },
    {
      id: 'rec_gram',
      category: 'Grammar',
      categoryType: 'grammar',
      icon: BookOpenCheck,
      title: 'Present Continuous Tense in Action',
      description: 'Learn formulas, positive and negative examples, common mistakes, and interactive sentence arrangements.',
      difficulty: 'A2',
      duration: '14 mins',
      action: () => {
        setSelectedGrammarLessonId('g_present_continuous');
        setActiveTab('grammar');
      },
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Main Welcome Hero Card */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#546B41] to-[#3F5230] text-white p-6 sm:p-8 shadow-sm">
        {/* Subtle decorative circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-48 h-48 rounded-full bg-[#99AD7A]/20 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#FFF8EC] text-xs font-semibold backdrop-blur-xs mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#DCCCAC]" />
            <span>Current Level: {userProfile.levelLabel}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFF8EC]">
            Your English Journey Starts Here
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#FFF8EC]/85 font-normal leading-relaxed">
            Keep learning and make steady progress every day. Practice speech pronunciation, expand vocabulary, and engage in real-life dialogue simulations.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedSpeakingLessonId('spk_1');
                setActiveTab('speaking-listening');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFF8EC] text-[#546B41] font-bold text-sm shadow-sm hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-[#546B41]" />
              <span>Continue Learning</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF8EC] font-semibold text-sm transition-colors cursor-pointer border border-white/15"
            >
              <TrendingUp className="w-4 h-4" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </section>

      {/* Daily Statistics Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Learning Hours */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs hover:border-[#DCCCAC] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#77796F]">Total Learning</span>
            <div className="w-8 h-8 rounded-lg bg-[#546B41]/10 flex items-center justify-center text-[#546B41]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#263124]">{userProfile.totalHours} hrs</div>
            <p className="text-[11px] text-[#77796F] mt-0.5">Recorded study time</p>
          </div>
        </div>

        {/* Lessons Completed */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs hover:border-[#DCCCAC] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#77796F]">Lessons Completed</span>
            <div className="w-8 h-8 rounded-lg bg-[#99AD7A]/20 flex items-center justify-center text-[#546B41]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#263124]">{userProfile.lessonsCompleted}</div>
            <p className="text-[11px] text-[#77796F] mt-0.5">+3 lessons this week</p>
          </div>
        </div>

        {/* Current Learning Streak */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs hover:border-[#DCCCAC] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#77796F]">Current Streak</span>
            <div className="w-8 h-8 rounded-lg bg-[#546B41]/10 flex items-center justify-center text-[#546B41]">
              <Flame className="w-4 h-4 fill-[#546B41]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#263124]">{userProfile.streakDays} Days</div>
            <p className="text-[11px] text-[#546B41] font-semibold mt-0.5">Personal best streak!</p>
          </div>
        </div>

        {/* Total Vocabulary Learned */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs hover:border-[#DCCCAC] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#77796F]">Vocabulary Learned</span>
            <div className="w-8 h-8 rounded-lg bg-[#DCCCAC]/50 flex items-center justify-center text-[#546B41]">
              <BookA className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#263124]">{userProfile.vocabularyCount} words</div>
            <p className="text-[11px] text-[#77796F] mt-0.5">{skillProgress.vocabularyMastered} mastered</p>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Daily Goal & Continue Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Goal Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#263124]">Daily Learning Goal</h3>
            <span className="text-xs font-bold text-[#546B41] bg-[#FFF8EC] px-2.5 py-1 rounded-full border border-[#DCCCAC]/50">
              {dailyGoalPercent}%
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline justify-between text-xs text-[#77796F] mb-1.5">
              <span>Progress today</span>
              <span className="font-semibold text-[#263124]">
                {userProfile.todayMinutes} / {userProfile.dailyGoalMinutes} mins
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-3 bg-[#E9E5DA]/60 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-[#546B41] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${dailyGoalPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/50 flex items-start gap-2.5 text-xs text-[#263124]">
            <CheckCircle2 className="w-4 h-4 text-[#546B41] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#263124]">Almost there!</p>
              <p className="text-[11px] text-[#77796F] mt-0.5">
                Complete 10 more minutes today to lock in your 5-day streak.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#546B41]">
                Latest Unfinished Lesson
              </span>
              <span className="text-xs font-semibold text-[#77796F]">In Progress</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold bg-[#DCCCAC]/40 text-[#546B41] rounded-md mb-1.5">
                  Grammar • Tenses
                </span>
                <h4 className="text-lg font-bold text-[#263124]">
                  Present Continuous Tense Masterclass
                </h4>
                <p className="text-xs text-[#77796F] mt-1">
                  Master actions happening right now and practical everyday conversations.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedGrammarLessonId('g_present_continuous');
                  setActiveTab('grammar');
                }}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#546B41] hover:bg-[#3F5230] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E9E5DA]">
            <div className="flex items-center justify-between text-xs text-[#77796F] mb-1.5">
              <span>Lesson Completion</span>
              <span className="font-bold text-[#546B41]">65% • Est. 5 mins left</span>
            </div>
            <div className="w-full h-2 bg-[#E9E5DA] rounded-full overflow-hidden">
              <div className="h-full bg-[#99AD7A] rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Activity Overview Bar Chart */}
      <section className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-[#263124]">Weekly Learning Activity</h3>
            <p className="text-xs text-[#77796F]">Daily study minutes across this week</p>
          </div>
          <span className="text-xs font-semibold text-[#546B41] bg-[#FFF8EC] px-3 py-1 rounded-full border border-[#DCCCAC]/50">
            Total: {weeklyActivity.reduce((acc, curr) => acc + curr.minutes, 0)} mins
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-[#E9E5DA]">
          {weeklyActivity.map((dayData, idx) => {
            const heightPercent = Math.max(12, Math.round((dayData.minutes / maxWeeklyMinutes) * 100));
            const isToday = idx === weeklyActivity.length - 1;

            return (
              <div key={dayData.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-semibold text-[#77796F] opacity-0 group-hover:opacity-100 transition-opacity">
                  {dayData.minutes}m
                </span>
                <div className="w-full max-w-[42px] bg-[#FFF8EC] rounded-t-xl overflow-hidden flex items-end h-32 p-1 border border-[#E9E5DA]/50">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isToday ? 'bg-[#546B41]' : 'bg-[#99AD7A] group-hover:bg-[#546B41]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isToday ? 'text-[#546B41] font-bold' : 'text-[#77796F]'
                  }`}
                >
                  {dayData.day}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommended Lessons Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#263124]">Recommended Lessons</h3>
            <p className="text-xs text-[#77796F]">Handpicked exercises matching your A2 level</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedLessons.map((lesson) => {
            const Icon = lesson.icon;
            return (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl border border-[#E9E5DA] p-5 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#99AD7A] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/60 flex items-center justify-center text-[#546B41]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9E5DA]/70 text-[#263124]">
                      {lesson.difficulty}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-[#546B41] uppercase tracking-wide">
                    {lesson.category}
                  </span>
                  <h4 className="font-bold text-sm text-[#263124] mt-0.5 leading-snug">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-[#77796F] mt-2 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E9E5DA] flex items-center justify-between">
                  <span className="text-xs text-[#77796F] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#99AD7A]" />
                    {lesson.duration}
                  </span>
                  <button
                    onClick={lesson.action}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#546B41] hover:text-[#3F5230] group cursor-pointer"
                  >
                    <span>Start</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
