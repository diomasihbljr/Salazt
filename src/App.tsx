import React, { useState } from 'react';
import { LearningProvider, useLearning } from './context/LearningContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { SpeakingListeningPage } from './components/speaking-listening/SpeakingListeningPage';
import { VocabularyView } from './components/vocabulary/VocabularyView';
import { GrammarView } from './components/grammar/GrammarView';
import { ProgressView } from './components/progress/ProgressView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { X, GraduationCap } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useLearning();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#263124] flex flex-col lg:flex-row font-sans selection:bg-[#99AD7A]/30">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 bottom-0 left-0 w-72 bg-white p-5 shadow-2xl flex flex-col justify-between border-r border-[#E9E5DA]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E9E5DA]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#546B41] flex items-center justify-center text-white">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg text-[#546B41]">SALAZT</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#77796F] hover:bg-[#FFF8EC]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'speaking-listening', label: 'Speaking & Listening' },
                  { id: 'vocabulary', label: 'Vocabulary' },
                  { id: 'grammar', label: 'Grammar' },
                  { id: 'progress', label: 'My Progress' },
                  { id: 'profile', label: 'Profile' },
                  { id: 'settings', label: 'Settings' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#546B41] text-white shadow-2xs'
                        : 'text-[#263124] hover:bg-[#FFF8EC]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[#77796F] text-center pt-4 border-t border-[#E9E5DA]">
              SALAZT English Platform • v1.0
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'speaking-listening' && <SpeakingListeningPage />}
          {activeTab === 'vocabulary' && <VocabularyView />}
          {activeTab === 'grammar' && <GrammarView />}
          {activeTab === 'progress' && <ProgressView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <LearningProvider>
      <AppContent />
    </LearningProvider>
  );
}
