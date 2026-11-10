import React from 'react';
import {
  LayoutDashboard,
  Mic,
  BookA,
  BookOpenCheck,
  TrendingUp,
  User,
  Settings,
  Flame,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { NavTab } from '../../types';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, userProfile } = useLearning();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'speaking-listening', label: 'Speaking & Listening', icon: Mic, badge: 'AI Tutor' },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookA },
    { id: 'grammar', label: 'Grammar', icon: BookOpenCheck },
    { id: 'progress', label: 'My Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E9E5DA] h-screen sticky top-0 z-30 select-none">
        {/* Logo and Brand Header */}
        <div className="p-6 pb-4 border-b border-[#E9E5DA]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#546B41] flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-[#546B41]">SALAZT</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide bg-[#DCCCAC]/40 text-[#546B41] rounded">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-[#77796F] font-medium leading-tight">Learn English, Grow Every Day</p>
            </div>
          </div>
        </div>

        {/* Daily Streak Banner */}
        <div className="mx-4 my-3 p-3 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#546B41]/10 flex items-center justify-center text-[#546B41]">
              <Flame className="w-4 h-4 fill-[#546B41]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#263124]">{userProfile.streakDays}-Day Streak</div>
              <div className="text-[10px] text-[#77796F]">Keep practicing today</div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#546B41] bg-white px-2 py-0.5 rounded-full border border-[#DCCCAC]/40 shadow-2xs">
            {userProfile.level}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#546B41] text-white shadow-sm font-semibold'
                    : 'text-[#263124] hover:bg-[#FFF8EC] hover:text-[#546B41]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#77796F]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#DCCCAC]/50 text-[#546B41]'
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Mini Footer */}
        <div className="p-4 border-t border-[#E9E5DA] bg-[#FFF8EC]/40">
          <button
            onClick={() => setActiveTab('profile')}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors text-left"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-9 h-9 rounded-full object-cover border border-[#DCCCAC]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#263124] truncate">{userProfile.name}</p>
              <p className="text-[11px] text-[#77796F] truncate">{userProfile.levelLabel}</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E9E5DA] z-40 px-2 py-2 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#546B41] font-bold' : 'text-[#77796F]'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-[#546B41]/10 scale-105' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#546B41]' : 'text-[#77796F]'}`} />
              </div>
              <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'profile' || activeTab === 'settings' ? 'text-[#546B41] font-bold' : 'text-[#77796F]'
          }`}
        >
          <div
            className={`p-1 rounded-lg ${
              activeTab === 'profile' || activeTab === 'settings' ? 'bg-[#546B41]/10' : ''
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
