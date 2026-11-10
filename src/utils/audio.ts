/**
 * Web Audio and Speech Synthesis helper for SALAZT English Learning App
 */

export function speakEnglish(
  text: string,
  options?: {
    rate?: number;
    accent?: 'en-US' | 'en-GB';
    onEnd?: () => void;
  }
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this environment');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options?.accent || 'en-US';
  utterance.rate = options?.rate || 1.0;
  utterance.pitch = 1.0;

  // Attempt to select an English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) => v.lang.startsWith('en') && (options?.accent ? v.lang === options.accent : true)
  );
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (options?.onEnd) {
    utterance.onend = options.onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export interface VoiceRecorderResult {
  startRecording: () => Promise<boolean>;
  stopRecording: () => Promise<{ blob: Blob; audioUrl: string } | null>;
  isRecording: boolean;
}
