import React, { useState } from 'react';
import {
  Settings,
  Languages,
  Bell,
  Volume2,
  Shield,
  Download,
  RotateCcw,
  LogOut,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const SettingsView: React.FC = () => {
  const { userProfile, updateUserProfile, resetAllData, setActiveTab } = useLearning();

  const [reminderTime, setReminderTime] = useState('08:00');
  const [enableDailyReminders, setEnableDailyReminders] = useState(true);
  const [enableStreakAlerts, setEnableStreakAlerts] = useState(true);
  const [enableWeeklyDigest, setEnableWeeklyDigest] = useState(true);
  const [dataExported, setDataExported] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExportData = () => {
    const data = {
      profile: userProfile,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salazt_learning_backup_${Date.now()}.json`;
    a.click();
    setDataExported(true);
    setTimeout(() => setDataExported(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs">
        <h2 className="text-xl font-bold text-[#263124]">Application Settings</h2>
        <p className="text-xs text-[#77796F] mt-1">
          Customize your learning preferences, voice models, notifications, and account settings.
        </p>
      </div>

      {/* 1. Language & Audio Preferences */}
      <section className="bg-white rounded-2xl border border-[#E9E5DA] p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E9E5DA]">
          <Languages className="w-5 h-5 text-[#546B41]" />
          <h3 className="font-bold text-sm text-[#263124]">Language & Audio Preferences</h3>
        </div>

        <div className="space-y-4 text-xs">
          {/* Indonesian Explanations Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF8EC]/60 border border-[#E9E5DA]">
            <div>
              <span className="font-bold text-[#263124] block">Bahasa Indonesia Explanations</span>
              <p className="text-[#77796F] mt-0.5">
                Show Indonesian grammar summaries and vocabulary translations side-by-side.
              </p>
            </div>
            <button
              onClick={() =>
                updateUserProfile({ enableIndonesianTips: !userProfile.enableIndonesianTips })
              }
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                userProfile.enableIndonesianTips ? 'bg-[#546B41]' : 'bg-[#E9E5DA]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  userProfile.enableIndonesianTips ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Accent Selection */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF8EC]/60 border border-[#E9E5DA]">
            <div>
              <span className="font-bold text-[#263124] block">Speech Accent Preference</span>
              <p className="text-[#77796F] mt-0.5">Select preferred default pronunciation accent.</p>
            </div>
            <select
              value={userProfile.audioAccent}
              onChange={(e) => updateUserProfile({ audioAccent: e.target.value as any })}
              className="bg-white border border-[#DCCCAC] text-[#263124] rounded-xl px-3 py-1.5 font-semibold focus:outline-none"
            >
              <option value="en-US">American English (en-US)</option>
              <option value="en-GB">British English (en-GB)</option>
            </select>
          </div>

          {/* Default Audio Speed */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF8EC]/60 border border-[#E9E5DA]">
            <div>
              <span className="font-bold text-[#263124] block">Default Speech Playback Speed</span>
              <p className="text-[#77796F] mt-0.5">Adjust how fast audio recordings and native speech play.</p>
            </div>
            <select
              value={userProfile.audioSpeed}
              onChange={(e) => updateUserProfile({ audioSpeed: Number(e.target.value) })}
              className="bg-white border border-[#DCCCAC] text-[#263124] rounded-xl px-3 py-1.5 font-semibold focus:outline-none"
            >
              <option value={0.75}>0.75x (Slow - for beginners)</option>
              <option value={1.0}>1.0x (Normal speed)</option>
              <option value={1.25}>1.25x (Fluent pace)</option>
            </select>
          </div>
        </div>
      </section>

      {/* 2. Learning Reminders & Notifications */}
      <section className="bg-white rounded-2xl border border-[#E9E5DA] p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E9E5DA]">
          <Bell className="w-5 h-5 text-[#546B41]" />
          <h3 className="font-bold text-sm text-[#263124]">Learning Reminders & Notifications</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF8EC]/60 border border-[#E9E5DA]">
            <div>
              <span className="font-bold text-[#263124] block">Daily Practice Reminder</span>
              <p className="text-[#77796F] mt-0.5">Receive a prompt to practice before streak expires.</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-white border border-[#DCCCAC] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#263124]"
              />
              <button
                onClick={() => setEnableDailyReminders(!enableDailyReminders)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  enableDailyReminders ? 'bg-[#546B41]' : 'bg-[#E9E5DA]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    enableDailyReminders ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF8EC]/60 border border-[#E9E5DA]">
            <div>
              <span className="font-bold text-[#263124] block">Streak Freeze & Warning Alerts</span>
              <p className="text-[#77796F] mt-0.5">Alert me when my streak is at risk of resetting.</p>
            </div>
            <button
              onClick={() => setEnableStreakAlerts(!enableStreakAlerts)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                enableStreakAlerts ? 'bg-[#546B41]' : 'bg-[#E9E5DA]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  enableStreakAlerts ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Data & Privacy Settings */}
      <section className="bg-white rounded-2xl border border-[#E9E5DA] p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E9E5DA]">
          <Shield className="w-5 h-5 text-[#546B41]" />
          <h3 className="font-bold text-sm text-[#263124]">Data & Privacy</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E9E5DA]">
            <div>
              <span className="font-bold text-[#263124] block">Export Learning Data</span>
              <p className="text-[#77796F] mt-0.5">Download a JSON copy of your progress and history.</p>
            </div>
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFF8EC] hover:bg-[#DCCCAC]/30 text-[#546B41] font-bold border border-[#DCCCAC] transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{dataExported ? 'Exported!' : 'Export JSON'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50/50 border border-rose-200">
            <div>
              <span className="font-bold text-rose-800 block">Reset Learning Progress</span>
              <p className="text-rose-600 mt-0.5">
                Reset vocabulary, lesson scores, and streak back to initial state.
              </p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Log Out / Switch Account */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-xs font-bold text-[#546B41] hover:underline"
        >
          ← Back to Dashboard
        </button>

        <button
          onClick={() => {
            alert('Signed out of demo session. All progress remains safely saved in your browser.');
            setActiveTab('dashboard');
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#263124] text-white hover:bg-black font-bold text-xs transition-all cursor-pointer shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E9E5DA] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-base text-[#263124]">Reset Learning Progress?</h3>
            <p className="text-xs text-[#77796F] leading-relaxed">
              This will restore all default lessons, vocabulary cards, and sample streak data. This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-[#E9E5DA] text-xs font-bold text-[#77796F] hover:bg-[#FFF8EC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs cursor-pointer"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
