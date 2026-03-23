'use client';

import { useState, useEffect } from 'react';

const navItems = [
  { icon: '📊', label: 'Dashboard', id: 'dashboard' },
  { icon: '🎯', label: 'Practice', id: 'practice' },
  { icon: '🏆', label: 'Progress', id: 'progress' },
];

export default function Navbar({ activeTab, setActiveTab, streak, darkMode, toggleDark }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFAF7] dark:bg-[#1C1410] border-b border-[#F2E8E0] dark:border-white/10 h-16 flex items-center justify-between px-5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🎙️</span>
          <span className="text-lg font-bold text-[#2D1B14] dark:text-white">Eloquence</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Streak badge */}
          <div className="flex items-center gap-1 bg-[#FFF5EE] dark:bg-[#F4956A]/10 border border-[#F4956A]/30 rounded-full px-3 py-1">
            <span>🔥</span>
            <span className="text-[#F4956A] font-bold text-sm">{streak} day streak</span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FFF5EE] dark:bg-white/5 text-lg transition-all hover:scale-110"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[#FFF5EE] dark:hover:bg-white/5 transition"
          >
            <span className={`block w-6 h-0.5 bg-[#2D1B14] dark:bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#2D1B14] dark:bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#2D1B14] dark:bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setMenuOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`fixed top-16 right-0 z-50 w-64 h-[calc(100vh-4rem)] bg-[#FDFAF7] dark:bg-[#1C1410] border-l border-[#F2E8E0] dark:border-white/10 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left w-full
                ${activeTab === item.id
                  ? 'bg-[#E8637A] text-white'
                  : 'text-[#2D1B14]/60 dark:text-white/60 hover:bg-[#FFF5EE] dark:hover:bg-white/5 hover:text-[#2D1B14] dark:hover:text-white'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}