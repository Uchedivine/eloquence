'use client';

import { useState } from 'react';

const navItems = [
  { icon: '📊', label: 'Dashboard', id: 'dashboard' },
  { icon: '🎯', label: 'Practice', id: 'practice' },
  { icon: '🏆', label: 'Progress', id: 'progress' },
];

export default function Navbar({ activeTab, setActiveTab, streak }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#111118] border-b border-white/10 h-16 flex items-center justify-between px-5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🎙️</span>
          <span className="text-lg font-bold text-white">Eloquence</span>
        </div>

        {/* Right side — streak + hamburger */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
            <span>🔥</span>
            <span className="text-orange-400 font-bold text-sm">{streak} day streak</span>
          </div>

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Slide-out menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-out drawer */}
      <div className={`fixed top-16 right-0 z-50 w-64 h-[calc(100vh-4rem)] bg-[#111118] border-l border-white/10 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left w-full
                ${activeTab === item.id
                  ? 'bg-violet-600 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
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