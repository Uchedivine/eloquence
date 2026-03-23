'use client';

const lessons = [
  { id: 'filler', icon: '🚫', title: 'Filler Word Detox', desc: 'Cut the ums, uhs and likes', xp: 100 },
  { id: 'grammar', icon: '📝', title: 'Grammar in Action', desc: 'Tenses, structure and clarity', xp: 120 },
  { id: 'eloquence', icon: '✨', title: 'Eloquence Builder', desc: 'Vivid and compelling word choices', xp: 150 },
  { id: 'fluency', icon: '🌊', title: 'Fluency Flow', desc: 'Smooth transitions and pacing', xp: 150 },
  { id: 'storytelling', icon: '📖', title: 'Storytelling Mastery', desc: 'Beginning, middle and end', xp: 200 },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Dashboard({ stats, setActiveTab }) {
  const todayIndex = new Date().getDay(); // 0=Sun, adjust to Mon-first
  const todayLabel = days[(todayIndex + 6) % 7];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-bold text-white">Welcome back! 👋</h2>
        <p className="text-white/50 mt-1">Keep your streak alive  practice makes eloquent.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-violet-400">{stats.totalXP}</div>
          <div className="text-white/50 text-sm mt-1">Total XP</div>
        </div>
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-orange-400">{stats.streak}🔥</div>
          <div className="text-white/50 text-sm mt-1">Day Streak</div>
        </div>
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{stats.lessonsToday}</div>
          <div className="text-white/50 text-sm mt-1">Todays Sessions</div>
        </div>
      </div>

      {/* 7-day activity grid */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium
                ${stats.activeDays?.includes(day)
                  ? 'bg-violet-600 text-white'
                  : day === todayLabel
                  ? 'bg-white/10 text-white border border-violet-500/50'
                  : 'bg-white/5 text-white/30'
                }`}>
                {stats.activeDays?.includes(day) ? '✓' : '·'}
              </div>
              <span className="text-white/40 text-xs">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons */}
      <div>
        <h3 className="text-white font-semibold mb-4">Lessons</h3>
        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const best = stats.personalBests?.[lesson.id];
            const unlocked = i === 0 || stats.personalBests?.[lessons[i - 1].id];
            return (
              <div
                key={lesson.id}
                onClick={() => unlocked && setActiveTab('practice')}
                className={`bg-[#111118] border rounded-2xl p-4 flex items-center gap-4 transition-all
                  ${unlocked
                    ? 'border-white/10 hover:border-violet-500/50 cursor-pointer hover:bg-violet-500/5'
                    : 'border-white/5 opacity-40 cursor-not-allowed'
                  }`}
              >
                <div className="text-3xl">{lesson.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-medium">{lesson.title}</div>
                  <div className="text-white/40 text-sm">{lesson.desc}</div>
                </div>
                <div className="text-right">
                  {best ? (
                    <div className="text-green-400 font-bold">{best}%</div>
                  ) : (
                    <div className="text-white/30 text-sm">{unlocked ? 'Not done' : '🔒'}</div>
                  )}
                  <div className="text-violet-400 text-xs">{lesson.xp} XP</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}