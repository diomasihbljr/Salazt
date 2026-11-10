import React, { useState } from 'react';
import {
  User,
  Mail,
  Award,
  Calendar,
  Clock,
  BookOpen,
  Flame,
  BookA,
  Edit3,
  Camera,
  Check,
  X,
  Target,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const ProfileView: React.FC = () => {
  const { userProfile, updateUserProfile, skillProgress } = useLearning();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name,
    username: userProfile.username,
    email: userProfile.email,
    learningGoal: userProfile.learningGoal,
    dailyGoalMinutes: userProfile.dailyGoalMinutes,
    preferredLearningTime: userProfile.preferredLearningTime,
    preferredDifficulty: userProfile.preferredDifficulty,
    avatarUrl: userProfile.avatarUrl,
  });

  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      learningGoal: formData.learningGoal,
      dailyGoalMinutes: Number(formData.dailyGoalMinutes),
      preferredLearningTime: formData.preferredLearningTime,
      preferredDifficulty: formData.preferredDifficulty,
      avatarUrl: formData.avatarUrl,
    });
    setIsEditing(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Success notification banner */}
      {showSuccessToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center justify-between text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and learning preferences updated successfully!</span>
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Header Card */}
      <section className="bg-white rounded-2xl border border-[#E9E5DA] p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-[#DCCCAC] shadow-2xs"
            />
            <button
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-[#546B41] text-white hover:bg-[#3F5230] shadow-sm transition-all cursor-pointer"
              aria-label="Change Avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-[#263124] tracking-tight">
                  {userProfile.name}
                </h2>
                <p className="text-xs text-[#77796F] font-medium">@{userProfile.username}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFF8EC] hover:bg-[#DCCCAC]/40 text-[#546B41] border border-[#DCCCAC] text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3 text-xs text-[#77796F]">
              <span className="flex items-center gap-1.5 font-semibold text-[#546B41] bg-[#FFF8EC] px-3 py-1 rounded-full border border-[#DCCCAC]/50">
                <Award className="w-3.5 h-3.5" />
                {userProfile.levelLabel}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#99AD7A]" />
                {userProfile.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#99AD7A]" />
                Member since {userProfile.memberSince}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Learning Statistics */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#E9E5DA] shadow-2xs text-center">
          <Clock className="w-4 h-4 text-[#546B41] mx-auto mb-1" />
          <div className="text-xl font-bold text-[#263124]">{userProfile.totalHours} hrs</div>
          <p className="text-[10px] text-[#77796F]">Total Learning</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E9E5DA] shadow-2xs text-center">
          <BookOpen className="w-4 h-4 text-[#546B41] mx-auto mb-1" />
          <div className="text-xl font-bold text-[#263124]">{userProfile.lessonsCompleted}</div>
          <p className="text-[10px] text-[#77796F]">Lessons Done</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E9E5DA] shadow-2xs text-center">
          <BookA className="w-4 h-4 text-[#546B41] mx-auto mb-1" />
          <div className="text-xl font-bold text-[#263124]">{userProfile.vocabularyCount}</div>
          <p className="text-[10px] text-[#77796F]">Vocabulary</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E9E5DA] shadow-2xs text-center">
          <Flame className="w-4 h-4 text-[#546B41] fill-[#546B41] mx-auto mb-1" />
          <div className="text-xl font-bold text-[#263124]">{userProfile.streakDays} Days</div>
          <p className="text-[10px] text-[#77796F]">Current Streak</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E9E5DA] shadow-2xs text-center col-span-2 lg:col-span-1">
          <Sparkles className="w-4 h-4 text-[#546B41] mx-auto mb-1" />
          <div className="text-xl font-bold text-[#263124]">92%</div>
          <p className="text-[10px] text-[#77796F]">Average Quiz</p>
        </div>
      </section>

      {/* Learning Preferences & Goals Details */}
      <section className="bg-white rounded-2xl border border-[#E9E5DA] p-6 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-[#263124] border-b border-[#E9E5DA] pb-3">
          Learning Goals & Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#FFF8EC]/60 border border-[#E9E5DA]">
            <span className="font-bold text-[#546B41] block mb-1">Primary Learning Goal:</span>
            <p className="text-[#263124] font-medium leading-relaxed">{userProfile.learningGoal}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF8EC]/60 border border-[#E9E5DA]">
            <span className="font-bold text-[#546B41] block mb-1">Daily Target & Time:</span>
            <p className="text-[#263124] font-medium">
              {userProfile.dailyGoalMinutes} mins / day • {userProfile.preferredLearningTime}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF8EC]/60 border border-[#E9E5DA]">
            <span className="font-bold text-[#546B41] block mb-1">Target Proficiency:</span>
            <p className="text-[#263124] font-medium">{userProfile.preferredDifficulty}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF8EC]/60 border border-[#E9E5DA]">
            <span className="font-bold text-[#546B41] block mb-1">Explanations & Support:</span>
            <p className="text-[#263124] font-medium">
              Bilingual support enabled (English with Bahasa Indonesia clarifications)
            </p>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E9E5DA] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DA] mb-4">
              <h3 className="font-bold text-base text-[#263124]">Edit Profile & Preferences</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg hover:bg-[#FFF8EC] text-[#77796F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Avatar Selector */}
              <div>
                <label className="font-bold text-[#263124] block mb-2">Choose Avatar:</label>
                <div className="flex items-center gap-3">
                  {sampleAvatars.map((url, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: url }))}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        formData.avatarUrl === url
                          ? 'border-[#546B41] ring-2 ring-[#546B41]/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Avatar option" className="w-12 h-12 object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#263124] block mb-1">Full Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-[#FFF8EC]/40 border border-[#E9E5DA] rounded-xl px-3 py-2 text-[#263124] focus:outline-none focus:border-[#546B41]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#263124] block mb-1">Username:</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="w-full bg-[#FFF8EC]/40 border border-[#E9E5DA] rounded-xl px-3 py-2 text-[#263124] focus:outline-none focus:border-[#546B41]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="font-bold text-[#263124] block mb-1">Email Address:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-[#FFF8EC]/40 border border-[#E9E5DA] rounded-xl px-3 py-2 text-[#263124] focus:outline-none focus:border-[#546B41]"
                />
              </div>

              {/* Learning Goal */}
              <div>
                <label className="font-bold text-[#263124] block mb-1">Primary Learning Goal:</label>
                <input
                  type="text"
                  value={formData.learningGoal}
                  onChange={(e) => setFormData({ ...formData, learningGoal: e.target.value })}
                  className="w-full bg-[#FFF8EC]/40 border border-[#E9E5DA] rounded-xl px-3 py-2 text-[#263124] focus:outline-none focus:border-[#546B41]"
                />
              </div>

              {/* Daily Target & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#263124] block mb-1">Daily Target (mins):</label>
                  <select
                    value={formData.dailyGoalMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, dailyGoalMinutes: Number(e.target.value) })
                    }
                    className="w-full bg-[#FFF8EC]/40 border border-[#E9E5DA] rounded-xl px-3 py-2 text-[#263124] focus:outline-none focus:border-[#546B41]"
                  >
                    <option value={15}>15 minutes (Casual)</option>
                    <option value={30}>30 minutes (Recommended)</option>
                    <option value={45}>45 minutes (Accelerated)</option>
                    <option value={60}>60 minutes (Intensive)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#263124] block mb-1">Preferred Time:</label>
                  <select
                    value={formData.preferredLearningTime}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredLearningTime: e.target.value })
                    }
                    className="w-full bg-[#FFF8EC]/40 border border-[#E9E5DA] rounded-xl px-3 py-2 text-[#263124] focus:outline-none focus:border-[#546B41]"
                  >
                    <option value="Morning (07:30 - 08:30)">Morning (07:30 - 08:30)</option>
                    <option value="Afternoon (12:30 - 13:30)">Afternoon (12:30 - 13:30)</option>
                    <option value="Evening (19:30 - 20:30)">Evening (19:30 - 20:30)</option>
                  </select>
                </div>
              </div>

              {/* Save & Cancel Buttons */}
              <div className="pt-4 border-t border-[#E9E5DA] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-[#E9E5DA] text-[#77796F] font-bold hover:bg-[#FFF8EC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#546B41] hover:bg-[#3F5230] text-white font-bold cursor-pointer shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
