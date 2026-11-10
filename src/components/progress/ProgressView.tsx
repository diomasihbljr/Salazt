import React, { useState } from 'react';
import {
  TrendingUp,
  Mic,
  Headphones,
  BookA,
  BookOpenCheck,
  Award,
  Flame,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  Filter,
  BarChart3,
  Search,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const ProgressView: React.FC = () => {
  const {
    userProfile,
    skillProgress,
    weeklyActivity,
    monthlyProgress,
    achievements,
    learningHistory,
  } = useLearning();

  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>('All');
  const [historySearch, setHistorySearch] = useState<string>('');

  const skillCards = [
    {
      id: 'spk',
      title: 'Speaking Progress',
      score: skillProgress.speaking,
      completedText: `${skillProgress.speakingLessons} sessions completed`,
      comparison: '+6% vs last week',
      icon: Mic,
      color: '#546B41',
    },
    {
      id: 'list',
      title: 'Listening Progress',
      score: skillProgress.listening,
      completedText: `${skillProgress.listeningLessons} audios completed`,
      comparison: '+8% vs last week',
      icon: Headphones,
      color: '#546B41',
    },
    {
      id: 'voc',
      title: 'Vocabulary Progress',
      score: skillProgress.vocabulary,
      completedText: `${userProfile.vocabularyCount} words learned`,
      comparison: '+12% vs last week',
      icon: BookA,
      color: '#546B41',
    },
    {
      id: 'gram',
      title: 'Grammar Progress',
      score: skillProgress.grammar,
      completedText: `${skillProgress.grammarLessons} topics completed`,
      comparison: '+5% vs last week',
      icon: BookOpenCheck,
      color: '#546B41',
    },
  ];

  const filteredHistory = learningHistory.filter((item) => {
    const matchCategory = historyCategoryFilter === 'All' || item.category === historyCategoryFilter;
    const matchSearch = item.title.toLowerCase().includes(historySearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const maxWeeklyMins = Math.max(...weeklyActivity.map((w) => w.minutes), 45);

  return (
    <div className="space-y-6 pb-12">
      {/* CEFR Level Assessment Hero */}
      <section className="bg-gradient-to-r from-[#546B41] to-[#3F5230] text-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#DCCCAC]" />
              <span>CEFR Assessment Standard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8EC]">
              Overall English Level: {userProfile.levelLabel}
            </h2>
            <p className="text-xs sm:text-sm text-[#FFF8EC]/85 max-w-xl leading-relaxed">
              Calculated dynamically from your actual lesson scores and speech analyses. You can comfortably understand everyday phrases and are progressing toward independent conversational fluency (B1).
            </p>
          </div>

          {/* CEFR Milestone Progression Tracker */}
          <div className="bg-white/10 p-4 rounded-xl border border-white/15 backdrop-blur-xs flex items-center gap-2 sm:gap-3">
            {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map((lvl) => {
              const isCurrent = userProfile.level === lvl;
              const isPast =
                (['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(lvl) <
                  ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(userProfile.level));

              return (
                <div key={lvl} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs transition-all ${
                      isCurrent
                        ? 'bg-[#FFF8EC] text-[#546B41] scale-110 ring-2 ring-[#DCCCAC]'
                        : isPast
                        ? 'bg-white/30 text-white'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {lvl}
                  </div>
                  <span className="text-[10px] mt-1 font-semibold text-white/80">
                    {isCurrent ? 'Current' : lvl}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main 4 Skill Progress Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skillCards.map((skill) => {
          const Icon = skill.icon;
          return (
            <div
              key={skill.id}
              className="bg-white rounded-2xl border border-[#E9E5DA] p-5 shadow-2xs space-y-4 hover:border-[#99AD7A] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/60 flex items-center justify-center text-[#546B41]">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#546B41] bg-[#FFF8EC] px-2.5 py-0.5 rounded-full border border-[#DCCCAC]/50">
                  {skill.score}% Proficiency
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#263124]">{skill.title}</h3>
                <p className="text-xs text-[#77796F] mt-0.5">{skill.completedText}</p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="w-full h-2.5 bg-[#E9E5DA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#546B41] rounded-full transition-all duration-500"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 block mt-1.5">
                  {skill.comparison}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Analytics Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Learning Activity */}
        <div className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#263124]">Weekly Learning Minutes</h3>
              <p className="text-xs text-[#77796F]">Daily study duration breakdown</p>
            </div>
            <span className="text-xs font-semibold text-[#546B41] bg-[#FFF8EC] px-3 py-1 rounded-full border border-[#DCCCAC]/50">
              Avg: 30m / day
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-[#E9E5DA]">
            {weeklyActivity.map((dayData, idx) => {
              const heightPercent = Math.max(15, Math.round((dayData.minutes / maxWeeklyMins) * 100));
              const isToday = idx === weeklyActivity.length - 1;
              return (
                <div key={dayData.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-semibold text-[#77796F]">{dayData.minutes}m</span>
                  <div className="w-full max-w-[38px] bg-[#FFF8EC] rounded-t-xl overflow-hidden flex items-end h-28 p-1 border border-[#E9E5DA]/50">
                    <div
                      className={`w-full rounded-lg transition-all ${
                        isToday ? 'bg-[#546B41]' : 'bg-[#99AD7A]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${isToday ? 'text-[#546B41] font-bold' : 'text-[#77796F]'}`}>
                    {dayData.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Monthly Progress Growth */}
        <div className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#263124]">Monthly Progress Trajectory</h3>
              <p className="text-xs text-[#77796F]">Overall mastery progression over 4 weeks</p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              +20% Growth
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {monthlyProgress.map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#263124]">{m.label}</span>
                  <span className="font-bold text-[#546B41]">{m.score}% Overall Score</span>
                </div>
                <div className="w-full h-2.5 bg-[#E9E5DA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#99AD7A] to-[#546B41] rounded-full transition-all duration-500"
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skill Comparison Breakdown */}
      <section className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs">
        <h3 className="font-bold text-sm text-[#263124] mb-1">Skill Comparison Breakdown</h3>
        <p className="text-xs text-[#77796F] mb-4">Comparing competencies across all four pillars</p>

        <div className="space-y-3">
          {[
            { label: 'Vocabulary & Idioms', value: skillProgress.vocabulary, target: 80 },
            { label: 'Listening Comprehension', value: skillProgress.listening, target: 75 },
            { label: 'Grammar & Accuracy', value: skillProgress.grammar, target: 75 },
            { label: 'Speaking & Pronunciation', value: skillProgress.speaking, target: 70 },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-[#FFF8EC]/60 border border-[#E9E5DA]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#263124]">{item.label}</span>
                <span className="font-bold text-[#546B41]">
                  {item.value}% (B1 Target: {item.target}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#E9E5DA] rounded-full overflow-hidden">
                <div className="h-full bg-[#546B41] rounded-full" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievement Badges Section */}
      <section className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-[#263124]">Badges & Achievements</h3>
            <p className="text-xs text-[#77796F]">Milestones unlocked as you study consistently</p>
          </div>
          <span className="text-xs font-bold text-[#546B41] bg-[#FFF8EC] px-3 py-1 rounded-full border border-[#DCCCAC]">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                badge.unlocked
                  ? 'bg-white border-[#99AD7A] shadow-2xs'
                  : 'bg-[#FFF8EC]/30 border-[#E9E5DA] opacity-60'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  badge.unlocked
                    ? 'bg-[#546B41] text-white shadow-2xs'
                    : 'bg-[#E9E5DA] text-[#77796F]'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#263124]">{badge.title}</h4>
                  {badge.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-[#77796F] mt-0.5 leading-relaxed">{badge.description}</p>
                <span className="text-[10px] font-semibold text-[#546B41] block mt-1">
                  {badge.unlocked ? `Unlocked: ${badge.unlockedAt}` : badge.progressText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning History Log Table */}
      <section className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-[#263124]">Learning Activity History</h3>
            <p className="text-xs text-[#77796F]">Log of all completed lessons, practices, and tests</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={historyCategoryFilter}
              onChange={(e) => setHistoryCategoryFilter(e.target.value)}
              className="text-xs font-semibold bg-[#FFF8EC] border border-[#DCCCAC] rounded-xl px-3 py-1.5 text-[#263124]"
            >
              <option value="All">All Categories</option>
              <option value="Speaking">Speaking</option>
              <option value="Listening">Listening</option>
              <option value="Vocabulary">Vocabulary</option>
              <option value="Grammar">Grammar</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E9E5DA] text-[#77796F] font-semibold">
                <th className="py-2.5 px-3">Lesson / Activity</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Date Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E5DA]/60">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[#FFF8EC]/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#263124]">{item.title}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF8EC] text-[#546B41] font-bold border border-[#DCCCAC]/50">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        item.score >= 80 ? 'text-emerald-700' : 'text-[#263124]'
                      }`}
                    >
                      {item.score}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#77796F]">{item.durationMinutes} mins</td>
                  <td className="py-3 px-3 text-[#77796F]">{item.completedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
