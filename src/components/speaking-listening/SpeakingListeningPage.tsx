import React, { useState } from 'react';
import { Mic, Headphones } from 'lucide-react';
import { SpeakingView } from '../speaking/SpeakingView';
import { ListeningView } from '../listening/ListeningView';

export const SpeakingListeningPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'speaking' | 'listening'>('speaking');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Main Mode Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-[#E9E5DA] shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#263124] tracking-tight">
            Speaking & Listening Studio
          </h2>
          <p className="text-xs text-[#77796F]">
            Practice oral conversations, native pronunciation, and audio comprehension
          </p>
        </div>

        <div className="flex items-center p-1 bg-[#FFF8EC] rounded-xl border border-[#DCCCAC]/60">
          <button
            onClick={() => setActiveMode('speaking')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'speaking'
                ? 'bg-[#546B41] text-white shadow-2xs'
                : 'text-[#77796F] hover:text-[#263124]'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>A. Speaking</span>
          </button>

          <button
            onClick={() => setActiveMode('listening')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'listening'
                ? 'bg-[#546B41] text-white shadow-2xs'
                : 'text-[#77796F] hover:text-[#263124]'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>B. Listening</span>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {activeMode === 'speaking' ? <SpeakingView /> : <ListeningView />}
    </div>
  );
};
