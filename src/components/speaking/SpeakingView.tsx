import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Square,
  Volume2,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  RefreshCw,
  Send,
  MessageSquare,
  ChevronRight,
  Languages,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { SpeakingLesson, PronunciationWord, ChatMessage } from '../../types';
import { speakEnglish, stopSpeaking } from '../../utils/audio';

export const SpeakingView: React.FC = () => {
  const {
    speakingLessons,
    pronunciationWords,
    userProfile,
    completeSpeakingPractice,
    selectedSpeakingLessonId,
    setSelectedSpeakingLessonId,
  } = useLearning();

  // Sub-tabs inside Speaking: 'lessons' | 'practice' | 'pronunciation' | 'ai-tutor'
  const [subTab, setSubTab] = useState<'lessons' | 'practice' | 'pronunciation' | 'ai-tutor'>('lessons');

  // Currently selected lesson for practice
  const [activeLesson, setActiveLesson] = useState<SpeakingLesson>(() => {
    if (selectedSpeakingLessonId) {
      const found = speakingLessons.find((l) => l.id === selectedSpeakingLessonId);
      if (found) return found;
    }
    return speakingLessons[0];
  });

  useEffect(() => {
    if (selectedSpeakingLessonId) {
      const found = speakingLessons.find((l) => l.id === selectedSpeakingLessonId);
      if (found) {
        setActiveLesson(found);
        setSubTab('practice');
      }
    }
  }, [selectedSpeakingLessonId, speakingLessons]);

  // Audio Recording State for Practice
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedTranscript, setRecordedTranscript] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    fluency: string;
    pronunciation: string;
    feedback: string;
  } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Pronunciation Practice State
  const [activePronunciationWord, setActivePronunciationWord] = useState<PronunciationWord>(
    pronunciationWords[0]
  );
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [isPronunciationRecording, setIsPronunciationRecording] = useState(false);

  // AI Tutor Chat State
  const [tutorScenario, setTutorScenario] = useState('daily_conversation');
  const [enableIndonesianTutor, setEnableIndonesianTutor] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'tutor',
      text: "Hello Alex! I am your SALAZT AI Tutor. How is your day going so far? Let's practice some everyday English!",
      timestamp: '10:00 AM',
      explanationId: 'Halo Alex! Saya tutor AI SALAZT Anda. Mari berlatih percakapan bahasa Inggris!',
      suggestions: [
        "I'm having a productive day, thank you!",
        "Could we practice ordering food at a restaurant?",
        "Can you explain how to ask for directions?",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of tutor chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTutorLoading]);

  // Recording handler for Speaking Practice
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);

        // Simulated speech transcription & AI pronunciation analysis
        setRecordedTranscript(activeLesson.sampleAnswer);
        setAnalysisResult({
          score: 88,
          fluency: 'Great rhythm and smooth pauses',
          pronunciation: 'Clear vowels and accurate word stress',
          feedback:
            'Excellent sentence cadence! Try emphasizing key nouns like "conversational English" for an even more confident delivery.',
        });

        // Record progress
        completeSpeakingPractice(activeLesson.id, 88, 10);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAnalysisResult(null);
      setRecordedAudioUrl(null);
    } catch (err) {
      console.warn('Microphone permission not granted or unsupported:', err);
      // Fallback: simulate recording
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setRecordedTranscript(activeLesson.sampleAnswer);
        setAnalysisResult({
          score: 85,
          fluency: 'Good natural pace and intonation',
          pronunciation: 'Accurate consonant articulation',
          feedback: 'Well articulated response! Practice linking words smoothly for seamless flow.',
        });
        completeSpeakingPractice(activeLesson.id, 85, 8);
      }, 3500);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  // Pronunciation Practice Check
  const handleTestPronunciation = () => {
    setIsPronunciationRecording(true);
    setPronunciationScore(null);
    setTimeout(() => {
      setIsPronunciationRecording(false);
      const randomScore = Math.floor(Math.random() * 15) + 85; // 85 - 100
      setPronunciationScore(randomScore);
    }, 2200);
  };

  // Send message to AI English Tutor
  const handleSendTutorMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isTutorLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTutorLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          scenario: tutorScenario,
          level: userProfile.levelLabel,
          includeIndonesian: enableIndonesianTutor,
          history: chatMessages.slice(-4).map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      if (!res.ok) throw new Error('Failed response from tutor API');
      const data = await res.json();

      const tutorMsg: ChatMessage = {
        id: `t_${Date.now()}`,
        sender: 'tutor',
        text: data.reply || 'Great attempt! Let’s keep discussing this topic.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        correction: data.correction,
        explanationId: data.explanationId,
        suggestions: data.suggestions || ['Tell me more', 'What is another way to say this?'],
      };

      setChatMessages((prev) => [...prev, tutorMsg]);
    } catch (e) {
      console.error(e);
      // Fallback tutor response
      const fallbackMsg: ChatMessage = {
        id: `t_${Date.now()}`,
        sender: 'tutor',
        text: `That's very well expressed! Your sentence structure is clear. What else would you like to practice today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        correction: 'Tip: You can also say "In addition to that..." to expand your thought.',
        explanationId: 'Cobalah gunakan kata penghubung seperti "Furthermore" atau "Also" untuk menyambung ide.',
        suggestions: ['Could you check my pronunciation?', 'Let’s try a job interview roleplay.'],
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E9E5DA] pb-3">
        <button
          onClick={() => setSubTab('lessons')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            subTab === 'lessons'
              ? 'bg-[#546B41] text-white shadow-2xs'
              : 'bg-white text-[#263124] hover:bg-[#FFF8EC] border border-[#E9E5DA]'
          }`}
        >
          1. Speaking Lessons
        </button>

        <button
          onClick={() => setSubTab('practice')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            subTab === 'practice'
              ? 'bg-[#546B41] text-white shadow-2xs'
              : 'bg-white text-[#263124] hover:bg-[#FFF8EC] border border-[#E9E5DA]'
          }`}
        >
          2. Voice Practice & Feedback
        </button>

        <button
          onClick={() => setSubTab('pronunciation')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            subTab === 'pronunciation'
              ? 'bg-[#546B41] text-white shadow-2xs'
              : 'bg-white text-[#263124] hover:bg-[#FFF8EC] border border-[#E9E5DA]'
          }`}
        >
          3. Pronunciation Coach
        </button>

        <button
          onClick={() => setSubTab('ai-tutor')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === 'ai-tutor'
              ? 'bg-[#546B41] text-white shadow-2xs'
              : 'bg-[#FFF8EC] text-[#546B41] hover:bg-white border border-[#DCCCAC]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>4. AI English Tutor</span>
        </button>
      </div>

      {/* SUBTAB 1: SPEAKING LESSONS */}
      {subTab === 'lessons' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs">
            <h3 className="text-lg font-bold text-[#263124]">Speaking Curriculum</h3>
            <p className="text-xs text-[#77796F] mt-1">
              Select any real-life situation to start structured speech practice and voice recording.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {speakingLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl border border-[#E9E5DA] p-5 flex flex-col justify-between shadow-2xs hover:border-[#99AD7A] hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF8EC] text-[#546B41] border border-[#DCCCAC]/50">
                      {lesson.topic}
                    </span>
                    <span className="text-xs font-semibold text-[#77796F]">{lesson.duration}</span>
                  </div>

                  <h4 className="font-bold text-sm text-[#263124] leading-snug">{lesson.title}</h4>
                  <p className="text-xs text-[#77796F] mt-2 line-clamp-2 leading-relaxed">
                    {lesson.prompt}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#E9E5DA]/80">
                    <div className="text-[11px] font-semibold text-[#546B41] mb-1">Key Phrase:</div>
                    <div className="text-xs text-[#263124] italic bg-[#FFF8EC] p-2 rounded-lg border border-[#DCCCAC]/40">
                      "{lesson.keyPhrases[0]}"
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E9E5DA] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#77796F]">Level: {lesson.difficulty}</span>
                  <button
                    onClick={() => {
                      setActiveLesson(lesson);
                      setSelectedSpeakingLessonId(lesson.id);
                      setSubTab('practice');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#546B41] hover:bg-[#3F5230] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Practice Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: SPEAKING PRACTICE & VOICE RECORDING */}
      {subTab === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Active Practice Prompt & Recorder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#546B41] uppercase tracking-wider">
                  {activeLesson.topic}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF8EC] text-[#546B41] border border-[#DCCCAC]/50">
                  {activeLesson.difficulty} • {activeLesson.duration}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#263124]">{activeLesson.title}</h3>
              <p className="text-xs text-[#77796F] mt-2 leading-relaxed">{activeLesson.prompt}</p>

              {/* Conversation Prompt & Sample */}
              <div className="mt-5 space-y-3">
                <div className="p-4 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/60">
                  <div className="text-xs font-bold text-[#546B41] flex items-center gap-1.5 mb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Conversation Prompt / Question</span>
                  </div>
                  <p className="text-sm font-semibold text-[#263124]">
                    "{activeLesson.sampleQuestion}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E9E5DA]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#77796F]">Sample Native Answer</span>
                    <button
                      onClick={() => speakEnglish(activeLesson.sampleAnswer)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#546B41] hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  </div>
                  <p className="text-sm text-[#263124] leading-relaxed">
                    "{activeLesson.sampleAnswer}"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FFF8EC]/60 border border-[#DCCCAC]/40 text-xs text-[#263124] flex items-start gap-2">
                  <Languages className="w-4 h-4 text-[#546B41] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#546B41]">Indonesian Tip: </span>
                    <span className="text-[#77796F]">{activeLesson.indonesianTip}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Microphone Recording Controller Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#E9E5DA] shadow-2xs">
              <h4 className="font-bold text-sm text-[#263124] mb-3">Record Your Spoken Answer</h4>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFF8EC]/70 border border-[#DCCCAC]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-rose-600 animate-pulse hover:bg-rose-700'
                        : 'bg-[#546B41] hover:bg-[#3F5230]'
                    }`}
                    aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
                  >
                    {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  <div>
                    <div className="font-bold text-sm text-[#263124]">
                      {isRecording ? 'Recording your voice...' : 'Tap microphone to speak'}
                    </div>
                    <p className="text-xs text-[#77796F]">
                      {isRecording
                        ? 'Speak clearly into your microphone'
                        : 'Say the sample answer or your own sentence'}
                    </p>
                  </div>
                </div>

                {recordedAudioUrl && (
                  <div className="flex items-center gap-2">
                    <audio src={recordedAudioUrl} controls className="h-9 w-48 sm:w-56" />
                  </div>
                )}
              </div>

              {/* Analysis Result */}
              {analysisResult && (
                <div className="mt-5 p-5 rounded-2xl bg-white border border-[#99AD7A] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DA]">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#546B41]" />
                      <span className="font-bold text-sm text-[#263124]">Pronunciation & Speech Analysis</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#546B41] text-white text-xs font-bold">
                      Score: {analysisResult.score}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/40">
                      <span className="font-bold text-[#546B41] block mb-1">Fluency & Rhythm</span>
                      <p className="text-[#263124]">{analysisResult.fluency}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/40">
                      <span className="font-bold text-[#546B41] block mb-1">Articulation</span>
                      <p className="text-[#263124]">{analysisResult.pronunciation}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#E9E5DA]/40 text-xs">
                    <span className="font-bold text-[#263124] block mb-0.5">Tutor Feedback</span>
                    <p className="text-[#77796F] leading-relaxed">{analysisResult.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Key Vocabulary & Lesson Switcher */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs">
              <h4 className="font-bold text-sm text-[#263124] mb-3">Target Key Phrases</h4>
              <div className="space-y-2">
                {activeLesson.keyPhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/40 text-xs text-[#263124]"
                  >
                    <span className="font-semibold">{phrase}</span>
                    <button
                      onClick={() => speakEnglish(phrase)}
                      className="p-1 rounded-lg text-[#546B41] hover:bg-white transition-colors"
                      aria-label={`Listen to ${phrase}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs">
              <h4 className="font-bold text-sm text-[#263124] mb-3">Other Speaking Topics</h4>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {speakingLessons.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setActiveLesson(l);
                      setAnalysisResult(null);
                      setRecordedAudioUrl(null);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                      l.id === activeLesson.id
                        ? 'bg-[#546B41] text-white font-bold'
                        : 'hover:bg-[#FFF8EC] text-[#263124]'
                    }`}
                  >
                    <span className="truncate">{l.title}</span>
                    <span className="text-[10px] opacity-80">{l.difficulty}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PRONUNCIATION PRACTICE */}
      {subTab === 'pronunciation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E5DA] shadow-2xs text-center">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8EC] text-[#546B41] border border-[#DCCCAC] mb-3">
                {activePronunciationWord.difficulty} Challenge
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#263124] tracking-tight">
                {activePronunciationWord.word}
              </h2>

              <p className="text-base text-[#546B41] font-mono mt-1 font-semibold">
                {activePronunciationWord.phonetic}
              </p>

              <p className="text-xs text-[#77796F] mt-2">
                Meaning: <strong className="text-[#263124]">{activePronunciationWord.meaningId}</strong>
              </p>

              {/* Syllable Breakdown */}
              <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E9E5DA]/60 text-xs font-bold text-[#263124]">
                <span>Syllables:</span>
                <span className="text-[#546B41]">{activePronunciationWord.syllables}</span>
              </div>

              {/* Audio & Recording Controls */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => speakEnglish(activePronunciationWord.word)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFF8EC] hover:bg-[#DCCCAC]/30 text-[#546B41] border border-[#DCCCAC] font-bold text-sm shadow-2xs transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Native Audio</span>
                </button>

                <button
                  onClick={handleTestPronunciation}
                  disabled={isPronunciationRecording}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer ${
                    isPronunciationRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-[#546B41] hover:bg-[#3F5230] text-white'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>
                    {isPronunciationRecording ? 'Listening to your voice...' : 'Record My Pronunciation'}
                  </span>
                </button>
              </div>

              {/* Feedback tip */}
              <div className="mt-6 p-4 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/50 text-xs text-left text-[#263124]">
                <strong className="text-[#546B41] block mb-1">Pronunciation Tip:</strong>
                <p className="text-[#77796F] leading-relaxed">{activePronunciationWord.tip}</p>
              </div>

              {/* Score result */}
              {pronunciationScore !== null && (
                <div className="mt-6 p-5 rounded-xl bg-white border border-[#99AD7A] text-left animate-in fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#263124]">Pronunciation Accuracy</span>
                    <span className="text-sm font-black text-[#546B41] bg-[#FFF8EC] px-3 py-1 rounded-full border border-[#DCCCAC]">
                      {pronunciationScore}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#E9E5DA] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#546B41] rounded-full transition-all duration-500"
                      style={{ width: `${pronunciationScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#546B41] font-semibold mt-2">
                    {pronunciationScore >= 90
                      ? 'Outstanding! Your native pronunciation cadence is spot on.'
                      : 'Good effort! Listen to the sample audio once more and match the syllable stress.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Word List Picker */}
          <div className="bg-white p-5 rounded-2xl border border-[#E9E5DA] shadow-2xs">
            <h4 className="font-bold text-sm text-[#263124] mb-3">Pronunciation Word Bank</h4>
            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {pronunciationWords.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePronunciationWord(item);
                    setPronunciationScore(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    item.id === activePronunciationWord.id
                      ? 'bg-[#546B41] text-white border-[#546B41] font-bold shadow-2xs'
                      : 'bg-white hover:bg-[#FFF8EC] border-[#E9E5DA] text-[#263124]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{item.word}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        item.id === activePronunciationWord.id
                          ? 'bg-white/20 text-white'
                          : 'bg-[#FFF8EC] text-[#546B41]'
                      }`}
                    >
                      {item.difficulty}
                    </span>
                  </div>
                  <span className="text-[11px] opacity-80 block mt-0.5 font-normal">
                    {item.meaningId}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: AI CONVERSATION SIMULATION */}
      {subTab === 'ai-tutor' && (
        <div className="bg-white rounded-2xl border border-[#E9E5DA] shadow-2xs flex flex-col h-[650px] overflow-hidden">
          {/* Tutor Chat Header */}
          <div className="p-4 border-b border-[#E9E5DA] bg-[#FFF8EC]/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#546B41] flex items-center justify-center text-white shadow-2xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#263124]">SALAZT AI Tutor</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs text-[#77796F]">Patient, encouraging English practice companion</p>
              </div>
            </div>

            {/* Scenario and Indonesian Explanation Toggles */}
            <div className="flex items-center gap-2">
              <select
                value={tutorScenario}
                onChange={(e) => setTutorScenario(e.target.value)}
                className="text-xs font-semibold bg-white border border-[#DCCCAC] text-[#263124] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#546B41]"
              >
                <option value="daily_conversation">Daily Conversation</option>
                <option value="ordering_food">Ordering Food</option>
                <option value="asking_directions">Asking Directions</option>
                <option value="job_interview">Job Interview</option>
              </select>

              <button
                onClick={() => setEnableIndonesianTutor(!enableIndonesianTutor)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  enableIndonesianTutor
                    ? 'bg-[#546B41] text-white border-[#546B41]'
                    : 'bg-white text-[#77796F] border-[#E9E5DA]'
                }`}
                title="Toggle Indonesian explanations"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>Indonesian Tips: {enableIndonesianTutor ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div ref={chatScrollRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FFF8EC]/20">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                      isUser ? 'bg-[#263124]' : 'bg-[#546B41]'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[80%] sm:max-w-[70%] space-y-2`}>
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#546B41] text-white rounded-tr-none'
                          : 'bg-white text-[#263124] border border-[#E9E5DA] shadow-2xs rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p>{msg.text}</p>
                        {!isUser && (
                          <button
                            onClick={() => speakEnglish(msg.text)}
                            className="text-[#77796F] hover:text-[#546B41] p-1 shrink-0"
                            aria-label="Listen to tutor response"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <span
                        className={`text-[10px] block mt-1 ${
                          isUser ? 'text-white/70 text-right' : 'text-[#77796F]'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Tutor Grammar Corrections & Indonesian Note */}
                    {!isUser && (msg.correction || msg.explanationId) && (
                      <div className="p-3 rounded-xl bg-white border border-[#DCCCAC] text-xs space-y-1.5 shadow-2xs">
                        {msg.correction && (
                          <div className="text-[#263124]">
                            <strong className="text-[#546B41]">Gentle Tip: </strong>
                            {msg.correction}
                          </div>
                        )}
                        {enableIndonesianTutor && msg.explanationId && (
                          <div className="text-[#77796F] border-t border-[#E9E5DA] pt-1">
                            <strong className="text-[#263124]">Bahasa Indonesia: </strong>
                            {msg.explanationId}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Suggested reply buttons */}
                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendTutorMessage(sug)}
                            className="text-xs px-2.5 py-1 rounded-full bg-white hover:bg-[#FFF8EC] border border-[#DCCCAC] text-[#546B41] font-medium transition-all shadow-2xs cursor-pointer"
                          >
                            + {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTutorLoading && (
              <div className="flex items-center gap-3 text-xs text-[#77796F] italic">
                <div className="w-8 h-8 rounded-full bg-[#546B41]/10 flex items-center justify-center text-[#546B41]">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <span>SALAZT AI Tutor is thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 border-t border-[#E9E5DA] bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTutorMessage()}
              placeholder="Type your English response or question..."
              className="flex-1 text-xs sm:text-sm bg-[#FFF8EC]/40 border border-[#E9E5DA] rounded-xl px-4 py-2.5 text-[#263124] focus:outline-none focus:border-[#546B41]"
            />

            <button
              onClick={() => handleSendTutorMessage()}
              disabled={!inputMessage.trim() || isTutorLoading}
              className="p-2.5 sm:px-4 rounded-xl bg-[#546B41] hover:bg-[#3F5230] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer shadow-2xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
