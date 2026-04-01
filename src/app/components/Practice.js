'use client';

import { useState, useRef } from 'react';

const lessons = [
  {
    id: 'filler',
    icon: '🚫',
    title: 'Filler Word Detox',
    prompts: [
      "Tell me about your morning routine in detail.",
      "Describe your favourite place you've ever visited.",
      "Explain what you do for work or study.",
    ],
  },
  {
    id: 'grammar',
    icon: '📝',
    title: 'Grammar in Action',
    prompts: [
      "Talk about something you did last weekend.",
      "Describe a goal you are currently working towards.",
      "Tell me about a skill you have learned recently.",
    ],
  },
  {
    id: 'eloquence',
    icon: '✨',
    title: 'Eloquence Builder',
    prompts: [
      "Describe your favourite season using vivid detail.",
      "Talk about a book or show that changed your perspective.",
      "Describe someone who inspires you and why.",
    ],
  },
  {
    id: 'fluency',
    icon: '🌊',
    title: 'Fluency Flow',
    prompts: [
      "Walk me through how you make your favourite meal.",
      "Explain a topic you know well to a complete beginner.",
      "Describe your ideal weekend from morning to night.",
    ],
  },
  {
    id: 'storytelling',
    icon: '📖',
    title: 'Storytelling Mastery',
    prompts: [
      "Tell me about a time you overcame a challenge.",
      "Share a funny or memorable moment from your life.",
      "Describe a turning point that shaped who you are.",
    ],
  },
];

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'actually', 'so', 'right', 'okay'];

function analyzeTranscript(text) {
  const words = text.toLowerCase().split(/\s+/);
  const totalWords = words.length;
  const foundFillers = [];

  FILLER_WORDS.forEach((fw) => {
    const count = words.filter((w) => w.replace(/[^a-z]/g, '') === fw).length;
    if (count > 0) foundFillers.push({ word: fw, count });
  });

  const fillerCount = foundFillers.reduce((a, b) => a + b.count, 0);
  const fillerRate = totalWords > 0 ? (fillerCount / totalWords) * 100 : 0;

  const grammarIssues = [];
  if (/\bi seen\b/i.test(text)) grammarIssues.push('"I seen" should be "I saw"');
  if (/\bthey was\b/i.test(text)) grammarIssues.push('"they was" should be "they were"');
  if (/\bwe was\b/i.test(text)) grammarIssues.push('"we was" should be "we were"');
  if (/\bi done\b/i.test(text)) grammarIssues.push('"I done" should be "I did"');

  let score = 100;
  score -= fillerRate * 3;
  score -= grammarIssues.length * 10;
  if (totalWords < 20) score -= 20;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : 'D';

  return { score, grade, totalWords, foundFillers, fillerRate: fillerRate.toFixed(1), grammarIssues };
}

export default function Practice({ onSessionComplete, customPrompts = [] }) {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [tab, setTab] = useState('lessons');
  const recognitionRef = useRef(null);
  const isManuallyStoppedRef = useRef(false);
  const transcriptRef = useRef('');

  // Math.random() called inside event handler — not during render
  const startLesson = (lesson) => {
    const idx = Math.floor(Math.random() * lesson.prompts.length);
    const randomPrompt = lesson.prompts[idx];
    setSelectedLesson(lesson);
    setPrompt(randomPrompt);
    setTranscript('');
    transcriptRef.current = '';
    setFeedback(null);
  };

  const startCustomPrompt = (cp) => {
    setSelectedLesson({ id: 'custom', icon: cp.icon, title: cp.title });
    setPrompt(cp.prompt);
    setTranscript('');
    transcriptRef.current = '';
    setFeedback(null);
  };

  const toggleRecording = () => {
    if (isRecording) {
      isManuallyStoppedRef.current = true;
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    isManuallyStoppedRef.current = false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let sessionTranscript = '';

    recognition.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          sessionTranscript += e.results[i][0].transcript + ' ';
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setTranscript(transcriptRef.current + sessionTranscript + interim);
    };

    recognition.onerror = (e) => {
      console.error('Speech error:', e.error);
      if (e.error === 'not-allowed') {
        alert('Mic blocked. Go to Chrome Settings → Site Settings → Microphone and allow this site.');
        isManuallyStoppedRef.current = true;
      } else if (e.error === 'network') {
        alert('Network error. Speech recognition requires an internet connection on Android.');
        isManuallyStoppedRef.current = true;
      }
      // Don't auto-stop for other errors like 'no-speech' since onend handled it.
    };

    recognition.onend = () => {
      if (!isManuallyStoppedRef.current) {
        transcriptRef.current += sessionTranscript;
        sessionTranscript = ''; // Reset for the next silent restart
        try {
          recognition.start();
        } catch (err) {
          setIsRecording(false);
        }
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const getFeedback = () => {
    if (!transcript.trim()) return;
    const result = analyzeTranscript(transcript);
    setFeedback(result);
    onSessionComplete(result.score);
  };

  const reset = () => {
    setSelectedLesson(null);
    setTranscript('');
    transcriptRef.current = '';
    setFeedback(null);
  };

  // --- Lesson picker ---
  if (!selectedLesson) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-[#2D1B14] dark:text-white">Practice 🎯</h2>
          <p className="text-[#2D1B14]/50 dark:text-white/50 mt-1">Choose a lesson or one of your custom prompts.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {['lessons', 'custom'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${tab === t
                  ? 'bg-[#E8637A] text-white'
                  : 'bg-[#FFF5EE] dark:bg-white/5 text-[#2D1B14]/50 dark:text-white/50 hover:text-[#2D1B14] dark:hover:text-white'
                }`}
            >
              {t === 'lessons' ? '📚 Lessons' : '🎙️ My Prompts'}
            </button>
          ))}
        </div>

        {tab === 'lessons' && (
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => startLesson(lesson)}
                className="bg-[#FFF5EE] dark:bg-[#2A1F1A] border border-[#F2E8E0] dark:border-white/10 hover:border-[#E8637A]/40 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-[#E8637A]/5 transition-all"
              >
                <div className="text-3xl">{lesson.icon}</div>
                <div>
                  <div className="text-[#2D1B14] dark:text-white font-medium">{lesson.title}</div>
                  <div className="text-[#2D1B14]/40 dark:text-white/40 text-sm">{lesson.prompts.length} prompts</div>
                </div>
                <div className="ml-auto text-[#2D1B14]/30 dark:text-white/30">›</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'custom' && (
          <div className="space-y-3">
            {customPrompts.length === 0 ? (
              <div className="text-center py-16 text-[#2D1B14]/30 dark:text-white/30">
                <div className="text-4xl mb-3">🎙️</div>
                <p>No custom prompts yet.</p>
                <p className="text-sm mt-1">Add some from the Progress tab!</p>
              </div>
            ) : (
              customPrompts.map((cp, i) => (
                <div
                  key={i}
                  onClick={() => startCustomPrompt(cp)}
                  className="bg-[#FFF5EE] dark:bg-[#2A1F1A] border border-[#F2E8E0] dark:border-white/10 hover:border-[#E8637A]/40 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-[#E8637A]/5 transition-all"
                >
                  <div className="text-3xl">{cp.icon}</div>
                  <div>
                    <div className="text-[#2D1B14] dark:text-white font-medium">{cp.title}</div>
                    <div className="text-[#2D1B14]/40 dark:text-white/40 text-sm line-clamp-1">{cp.prompt}</div>
                  </div>
                  <div className="ml-auto text-[#2D1B14]/30 dark:text-white/30">›</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  // --- Recording screen ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={reset} className="text-[#2D1B14]/40 dark:text-white/40 hover:text-[#E8637A] transition text-2xl">←</button>
        <div>
          <div className="text-[#2D1B14]/50 dark:text-white/50 text-sm">{selectedLesson.icon} {selectedLesson.title}</div>
          <h2 className="text-xl font-bold text-[#2D1B14] dark:text-white">Your turn to speak</h2>
        </div>
      </div>

      {/* Prompt card */}
      <div className="bg-[#E8637A]/10 border border-[#E8637A]/20 rounded-2xl p-5">
        <div className="text-[#E8637A] text-xs font-semibold uppercase tracking-wider mb-2">Your Prompt</div>
        <p className="text-[#2D1B14] dark:text-white text-lg leading-relaxed">{prompt}</p>
      </div>

      {/* Transcript */}
      <div className="bg-[#FFF5EE] dark:bg-[#2A1F1A] border border-[#F2E8E0] dark:border-white/10 rounded-2xl p-5 min-h-32">
        <div className="text-[#2D1B14]/40 dark:text-white/40 text-xs mb-2">Live transcript</div>
        {transcript ? (
          <p className="text-[#2D1B14] dark:text-white leading-relaxed">{transcript}</p>
        ) : (
          <p className="text-[#2D1B14]/20 dark:text-white/20 italic">Start speaking — your words will appear here...</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={toggleRecording}
          className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all
            ${isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-[#E8637A] hover:bg-[#d4546b] text-white'
            }`}
        >
          {isRecording ? '⏹ Stop Recording' : '🎙️ Start Speaking'}
        </button>

        {transcript && !isRecording && (
          <button
            onClick={getFeedback}
            className="px-6 py-4 bg-[#F4956A] hover:bg-[#e0845a] text-white rounded-2xl font-bold transition-all"
          >
            Get Feedback ✨
          </button>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="bg-[#FFF5EE] dark:bg-[#2A1F1A] border border-[#F2E8E0] dark:border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className={`text-5xl font-black ${feedback.score >= 75 ? 'text-[#22C55E]' : feedback.score >= 50 ? 'text-[#F4956A]' : 'text-[#E8637A]'}`}>
              {feedback.grade}
            </div>
            <div>
              <div className="text-[#2D1B14] dark:text-white font-bold text-xl">{feedback.score}/100</div>
              <div className="text-[#2D1B14]/40 dark:text-white/40 text-sm">{feedback.totalWords} words spoken</div>
            </div>
          </div>

          {feedback.foundFillers.length > 0 && (
            <div>
              <div className="text-[#E8637A] font-semibold text-sm mb-2">🚫 Filler words detected</div>
              <div className="flex flex-wrap gap-2">
                {feedback.foundFillers.map((f) => (
                  <span key={f.word} className="bg-[#E8637A]/10 border border-[#E8637A]/20 text-[#E8637A] text-xs px-3 py-1 rounded-full">
                    &quot;{f.word}&quot; &times;{f.count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {feedback.grammarIssues.length > 0 && (
            <div>
              <div className="text-[#F4956A] font-semibold text-sm mb-2">📝 Grammar notes</div>
              <ul className="space-y-1">
                {feedback.grammarIssues.map((issue, i) => (
                  <li key={i} className="text-[#2D1B14]/60 dark:text-white/60 text-sm">• {issue}</li>
                ))}
              </ul>
            </div>
          )}

          {feedback.foundFillers.length === 0 && feedback.grammarIssues.length === 0 && (
            <div className="text-[#22C55E] font-medium">✅ Great job! No filler words or grammar issues detected.</div>
          )}

          <button
            onClick={reset}
            className="w-full py-3 bg-[#E8637A] hover:bg-[#d4546b] text-white rounded-xl font-medium transition-all"
          >
            Practice Again 🔄
          </button>
        </div>
      )}
    </div>
  );
}