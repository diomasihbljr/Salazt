import React, { useState } from 'react';
import { Bell, Flame, Clock, Sparkles, CheckCircle2, ChevronRight, Menu, X } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { userProfile, setActiveTab } = useLearning();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: '5-Day Streak Active!',
      desc: 'Complete one more lesson today to keep your momentum going strong.',
      time: '2h ago',
      unread: true,
      category: 'streak',
    },
    {
      id: 2,
      title: 'Grammar Tip of the Day',
      desc: 'Remember: stative verbs (like "understand", "prefer") usually do not take -ing!',
      time: '5h ago',
      unread: false,
      category: 'grammar',
    },
    {
      id: 3,
      title: 'New AI Tutor Conversation Scenario',
      desc: 'Try our newly added scenario: "Ordering at The Green Garden Bakery".',
      time: 'Yesterday',
      unread: false,
      category: 'speaking',
    },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E9E5DA] px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Greeting and Welcome */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[#263124] hover:bg-[#FFF8EC] transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-base lg:text-lg font-bold text-[#263124] tracking-tight">
            Good morning, {userProfile.name.split(' ')[0]}!
          </h1>
          <p className="text-xs text-[#77796F] font-medium hidden sm:block">
            Ready to improve your English today?
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Daily Time Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF8EC] border border-[#DCCCAC]/60 text-xs font-semibold text-[#546B41]">
          <Clock className="w-3.5 h-3.5 text-[#546B41]" />
          <span>
            {userProfile.todayMinutes} / {userProfile.dailyGoalMinutes} mins
          </span>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8EC] border border-[#DCCCAC]/60 text-xs font-semibold text-[#263124]">
          <Flame className="w-3.5 h-3.5 text-[#546B41] fill-[#546B41]" />
          <span>{userProfile.streakDays}d Streak</span>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white hover:bg-[#FFF8EC] border border-[#E9E5DA] text-[#263124] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#77796F]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#546B41]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E9E5DA] p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DA]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#263124]">Notifications</span>
                  <span className="px-1.5 py-0.5 text-[10px] bg-[#546B41] text-white rounded-full font-semibold">
                    1 New
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg hover:bg-[#FFF8EC] text-[#77796F]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border transition-colors ${
                      n.unread ? 'bg-[#FFF8EC]/60 border-[#DCCCAC]' : 'bg-white border-[#E9E5DA]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#263124]">{n.title}</h4>
                      <span className="text-[10px] text-[#77796F] whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#77796F] mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-[#E9E5DA] flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActiveTab('speaking-listening');
                  }}
                  className="text-xs font-semibold text-[#546B41] flex items-center gap-1 hover:underline"
                >
                  Start today's lesson <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#FFF8EC] transition-colors"
          aria-label="View user profile"
        >
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-8 h-8 rounded-full object-cover border border-[#DCCCAC]"
          />
          <span className="hidden sm:inline text-xs font-bold text-[#546B41]">
            {userProfile.level}
          </span>
        </button>
      </div>
    </header>
  );
};
