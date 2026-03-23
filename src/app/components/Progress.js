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
        <h2 className="text-3xl font-bold text-white">Progress 🏆</h2>
        <p className="text-white/50 mt-1">Your stats and custom prompts.</p>
      </div>

      {/* Overall stats */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-white font-semibold">Your Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-violet-400">{stats.totalXP}</div>
            <div className="text-white/40 text-sm mt-1">Total XP earned</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.streak} 🔥</div>
            <div className="text-white/40 text-sm mt-1">Current streak</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.totalSessions || 0}</div>
            <div className="text-white/40 text-sm mt-1">Total sessions</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.avgScore || 0}%</div>
            <div className="text-white/40 text-sm mt-1">Average score</div>
          </div>
        </div>
      </div>

      {/* Custom prompts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">My Custom Prompts</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all"
          >
            {showForm ? '✕ Cancel' : '+ Add Prompt'}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-[#111118] border border-violet-500/30 rounded-2xl p-5 space-y-4">
            {/* Icon picker */}
            <div>
              <label className="text-white/50 text-sm block mb-2">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setForm({ ...form, icon: ic })}
                    className={`text-2xl p-2 rounded-xl transition-all
                      ${form.icon === ic ? 'bg-violet-600' : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-white/50 text-sm block mb-2">Title</label>
              <input
                type="text"
                placeholder="e.g. Books & Skeins Warmup"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition"
              />
            </div>

            {/* Prompt */}
            <div>
              <label className="text-white/50 text-sm block mb-2">Prompt</label>
              <textarea
                rows={3}
                placeholder="e.g. Describe the last book you finished. Cover the plot, a favourite moment, and who you'd recommend it to — without any filler words."
                value={form.prompt}
                onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition resize-none"
              />
            </div>

            <button
              onClick={handleAdd}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-all"
            >
              Save Prompt ✨
            </button>
          </div>
        )}

        {/* Prompt list */}
        {customPrompts.length === 0 && !showForm ? (
          <div className="text-center py-12 text-white/30">
            <div className="text-4xl mb-3">🎙️</div>
            <p>No custom prompts yet.</p>
            <p className="text-sm mt-1">Add prompts for your Books & Skeins podcast!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {customPrompts.map((cp, i) => (
              <div key={i} className="bg-[#111118] border border-white/10 rounded-2xl p-4 flex items-start gap-4">
                <div className="text-3xl">{cp.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-medium">{cp.title}</div>
                  <div className="text-white/40 text-sm mt-1 leading-relaxed">{cp.prompt}</div>
                </div>
                <button
                  onClick={() => onDeletePrompt(i)}
                  className="text-white/20 hover:text-red-400 transition text-lg mt-1"
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