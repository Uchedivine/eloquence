'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Practice from './Practice';
import Progress from './Progress';

const DEFAULT_STATS = {
  totalXP: 0,
  streak: 0,
  lessonsToday: 0,
  totalSessions: 0,
  avgScore: 0,
  activeDays: [],
  personalBests: {},
  allScores: [],
  lastActiveDate: null,
};

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customPrompts, setCustomPrompts] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loaded, setLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('eloquence_stats');
      const savedPrompts = localStorage.getItem('eloquence_prompts');
      const savedDark = localStorage.getItem('eloquence_dark');
      if (savedStats) setStats(JSON.parse(savedStats));
      if (savedPrompts) setCustomPrompts(JSON.parse(savedPrompts));
      if (savedDark) setDarkMode(JSON.parse(savedDark));
    } catch (e) {
      console.error('Failed to load saved data', e);
    }
    setLoaded(true);
  }, []);

  // Dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (loaded) localStorage.setItem('eloquence_dark', JSON.stringify(darkMode));
  }, [darkMode, loaded]);

  // Streak update — dates computed outside setStats updater to avoid impure calls inside it
  useEffect(() => {
    if (!loaded) return;
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayLabel = days[(new Date().getDay() + 6) % 7];

    setStats((prev) => {
      if (prev.lastActiveDate === today) return prev;
      const wasYesterday = prev.lastActiveDate === yesterday.toDateString();
      const newStreak = wasYesterday ? prev.streak + 1 : prev.lastActiveDate ? 0 : prev.streak;
      const activeDays = prev.activeDays.includes(todayLabel)
        ? prev.activeDays
        : [...prev.activeDays, todayLabel];
      return { ...prev, streak: newStreak, lastActiveDate: today, activeDays };
    });
  }, [loaded]);

  // Persist stats
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('eloquence_stats', JSON.stringify(stats));
  }, [stats, loaded]);

  // Persist prompts
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('eloquence_prompts', JSON.stringify(customPrompts));
  }, [customPrompts, loaded]);

  const handleSessionComplete = (score) => {
    setStats((prev) => {
      const allScores = [...prev.allScores, score];
      const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
      return {
        ...prev,
        totalXP: prev.totalXP + Math.round(score),
        lessonsToday: prev.lessonsToday + 1,
        totalSessions: prev.totalSessions + 1,
        avgScore: avg,
        allScores,
      };
    });
    setActiveTab('dashboard');
  };

  const handleAddPrompt = (prompt) => setCustomPrompts((prev) => [...prev, prompt]);
  const handleDeletePrompt = (index) => setCustomPrompts((prev) => prev.filter((_, i) => i !== index));

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-[#FDFAF7] dark:bg-[#1C1410] transition-colors duration-300">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streak={stats.streak}
        darkMode={darkMode}
        toggleDark={() => setDarkMode(!darkMode)}
      />
      <main className="pt-20 px-5 max-w-2xl mx-auto pb-10">
        {activeTab === 'dashboard' && <Dashboard stats={stats} setActiveTab={setActiveTab} />}
        {activeTab === 'practice' && (
          <Practice onSessionComplete={handleSessionComplete} customPrompts={customPrompts} />
        )}
        {activeTab === 'progress' && (
          <Progress
            stats={stats}
            customPrompts={customPrompts}
            onAddPrompt={handleAddPrompt}
            onDeletePrompt={handleDeletePrompt}
          />
        )}
      </main>
    </div>
  );
}