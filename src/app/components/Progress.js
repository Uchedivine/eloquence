'use client';

import { useState } from 'react';

const ICONS = ['🎙️', '📚', '🧶', '🎧', '💬', '🌟', '📖', '✍️'];

export default function Progress({ stats, customPrompts, onAddPrompt, onDeletePrompt }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', prompt: '', icon: '🎙️' });

  const handleAdd = () => {
    if (!form.title.trim() || !form.prompt.trim()) return;
    onAddPrompt(form);
    setForm({ title: '', prompt: '', icon: '🎙️' });
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#2D1B14] dark:text-white">Progress 🏆</h2>
        <p className="text-[#2D1B14]/50 dark:text-white/50 mt-1">Your stats and custom prompts.</p>
      </div>

      {/* Overall stats */}
      <div className="bg-white dark:bg-[#2A1F1A] border border-[#F2E8E0] dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-[#2D1B14] dark:text-white font-semibold">Your Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#FFF5EE] dark:bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#E8637A]">{stats.totalXP}</div>
            <div className="text-[#2D1B14]/40 dark:text-white/40 text-sm mt-1">Total XP earned</div>
          </div>
          <div className="bg-[#FFF5EE] dark:bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#F4956A]">{stats.streak} 🔥</div>
            <div className="text-[#2D1B14]/40 dark:text-white/40 text-sm mt-1">Current streak</div>
          </div>
          <div className="bg-[#FFF5EE] dark:bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#E8637A]">{stats.totalSessions || 0}</div>
            <div className="text-[#2D1B14]/40 dark:text-white/40 text-sm mt-1">Total sessions</div>
          </div>
          <div className="bg-[#FFF5EE] dark:bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#F4956A]">{stats.avgScore || 0}%</div>
            <div className="text-[#2D1B14]/40 dark:text-white/40 text-sm mt-1">Average score</div>
          </div>
        </div>
      </div>

      {/* Custom prompts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#2D1B14] dark:text-white font-semibold">My Custom Prompts</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#E8637A] hover:bg-[#d4546b] text-white text-sm font-medium px-4 py-2 rounded-xl transition-all"
          >
            {showForm ? '✕ Cancel' : '+ Add Prompt'}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white dark:bg-[#2A1F1A] border border-[#E8637A]/20 rounded-2xl p-5 space-y-4 shadow-sm">
            {/* Icon picker */}
            <div>
              <label className="text-[#2D1B14]/50 dark:text-white/50 text-sm block mb-2">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setForm({ ...form, icon: ic })}
                    className={`text-2xl p-2 rounded-xl transition-all
                      ${form.icon === ic
                        ? 'bg-[#E8637A] text-white'
                        : 'bg-[#FFF5EE] dark:bg-white/5 hover:bg-[#E8637A]/10'
                      }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[#2D1B14]/50 dark:text-white/50 text-sm block mb-2">Title</label>
              <input
                type="text"
                placeholder="e.g. Books & Skeins Warmup"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[#FFF5EE] dark:bg-white/5 border border-[#F2E8E0] dark:border-white/10 rounded-xl px-4 py-3 text-[#2D1B14] dark:text-white placeholder-[#2D1B14]/20 dark:placeholder-white/20 outline-none focus:border-[#E8637A]/50 transition"
              />
            </div>

            {/* Prompt */}
            <div>
              <label className="text-[#2D1B14]/50 dark:text-white/50 text-sm block mb-2">Prompt</label>
              <textarea
                rows={3}
                placeholder="e.g. Describe the last book you finished. Cover the plot, a favourite moment, and who you'd recommend it to — without any filler words."
                value={form.prompt}
                onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                className="w-full bg-[#FFF5EE] dark:bg-white/5 border border-[#F2E8E0] dark:border-white/10 rounded-xl px-4 py-3 text-[#2D1B14] dark:text-white placeholder-[#2D1B14]/20 dark:placeholder-white/20 outline-none focus:border-[#E8637A]/50 transition resize-none"
              />
            </div>

            <button
              onClick={handleAdd}
              className="w-full py-3 bg-[#E8637A] hover:bg-[#d4546b] text-white rounded-xl font-medium transition-all"
            >
              Save Prompt ✨
            </button>
          </div>
        )}

        {/* Prompt list */}
        {customPrompts.length === 0 && !showForm ? (
          <div className="text-center py-12 text-[#2D1B14]/30 dark:text-white/30">
            <div className="text-4xl mb-3">🎙️</div>
            <p>No custom prompts yet.</p>
            <p className="text-sm mt-1">Add prompts for your Books & Skeins podcast!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {customPrompts.map((cp, i) => (
              <div key={i} className="bg-white dark:bg-[#2A1F1A] border border-[#F2E8E0] dark:border-white/10 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                <div className="text-3xl">{cp.icon}</div>
                <div className="flex-1">
                  <div className="text-[#2D1B14] dark:text-white font-medium">{cp.title}</div>
                  <div className="text-[#2D1B14]/40 dark:text-white/40 text-sm mt-1 leading-relaxed">{cp.prompt}</div>
                </div>
                <button
                  onClick={() => onDeletePrompt(i)}
                  className="text-[#2D1B14]/20 dark:text-white/20 hover:text-[#E8637A] transition text-lg mt-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}