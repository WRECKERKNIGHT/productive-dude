import React, { useMemo, useState } from 'react';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function Analytics({
  tasks,
  habits,
  roleData,
  pomodoroLog,
  moodLog,
  setMoodLog,
  profile,
  expenses,
  setExpenses
}) {
  const [expenseDraft, setExpenseDraft] = useState({ label: '', amount: '', category: 'Personal' });
  const [tab, setTab] = useState('overview');

  const todayStr = new Date().toISOString().split('T')[0];

  const weekTaskData = useMemo(() => {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayTasks = tasks.filter(t => t.date === key);
      const done = dayTasks.filter(t => t.completed).length;
      out.push({ date: key, done, total: dayTasks.length, label: DAYS[d.getDay()] });
    }
    return out;
  }, [tasks]);

  const weekPomodoro = useMemo(() => {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const mins = pomodoroLog.filter(p => p.completed && p.date === key).reduce((a, p) => a + p.minutes, 0);
      out.push({ date: key, mins, label: DAYS[d.getDay()] });
    }
    return out;
  }, [pomodoroLog]);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.completed).length;
  const taskRate = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const habitRate = habits.length ? Math.round((habits.filter(h => Object.values(h.progress || {}).some(v => v >= h.target)).length / habits.length) * 100) : 0;
  const focusMins = pomodoroLog.filter(p => p.completed).reduce((a, p) => a + p.minutes, 0);
  const maxTaskDay = Math.max(1, ...weekTaskData.map(d => d.total));
  const maxPomoDay = Math.max(1, ...weekPomodoro.map(d => d.mins));

  const moods = [
    { v: 1, emoji: '😞', label: 'Rough' },
    { v: 2, emoji: '😕', label: 'Low' },
    { v: 3, emoji: '😐', label: 'Okay' },
    { v: 4, emoji: '🙂', label: 'Good' },
    { v: 5, emoji: '😄', label: 'Great' }
  ];

  const setMood = (v) => {
    setMoodLog({ ...moodLog, [todayStr]: v });
  };

  const weekMoods = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    weekMoods.push({ date: key, v: moodLog[key], label: DAYS[d.getDay()] });
  }

  const addExpense = (e) => {
    e.preventDefault();
    if (!expenseDraft.label.trim() || !expenseDraft.amount) return;
    const entry = {
      id: `exp-${Date.now()}`,
      label: expenseDraft.label.trim(),
      amount: Number(expenseDraft.amount),
      category: expenseDraft.category,
      date: todayStr
    };
    setExpenses([entry, ...(expenses || [])]);
    setExpenseDraft({ label: '', amount: '', category: 'Personal' });
  };

  const deleteExpense = (id) => {
    setExpenses((expenses || []).filter(e => e.id !== id));
  };

  const totalSpent = (expenses || []).reduce((a, e) => a + e.amount, 0);

  return (
    <div className="space-y-md animate-fade-in">
      <div>
        <p className="font-label-caps text-label-caps text-primary mb-1">PERFORMANCE INTELLIGENCE</p>
        <h2 className="text-headline-md font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">monitoring</span>
          Analytics
        </h2>
        <p className="text-on-surface-variant text-[13px]">Track momentum, moods, focus, and money in one clean view.</p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="glass-card p-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
            <span className="text-[9px] font-mono font-bold text-on-surface-variant">{doneTasks}/{totalTasks}</span>
          </div>
          <div className="text-[20px] font-extrabold font-mono mt-1">{taskRate}%</div>
          <div className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant mt-0.5">Tasks Done</div>
        </div>
        <div className="glass-card p-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[16px] text-secondary">fitness_center</span>
            <span className="text-[9px] font-mono font-bold text-on-surface-variant">{habits.length}</span>
          </div>
          <div className="text-[20px] font-extrabold font-mono mt-1">{habitRate}%</div>
          <div className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant mt-0.5">Habits Met</div>
        </div>
        <div className="glass-card p-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[16px] text-tertiary">timer</span>
            <span className="text-[9px] font-mono font-bold text-on-surface-variant">{pomodoroLog.filter(p => p.completed).length}</span>
          </div>
          <div className="text-[20px] font-extrabold font-mono mt-1">{focusMins}m</div>
          <div className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant mt-0.5">Focus Time</div>
        </div>
        <div className="glass-card p-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[16px] text-primary">savings</span>
            <span className="text-[9px] font-mono font-bold text-on-surface-variant">{(expenses || []).length}</span>
          </div>
          <div className="text-[20px] font-extrabold font-mono mt-1">${totalSpent.toFixed(0)}</div>
          <div className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant mt-0.5">Tracked Spend</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ id: 'overview', label: 'Overview', icon: 'dashboard' }, { id: 'mood', label: 'Mood', icon: 'mood' }, { id: 'money', label: 'Money', icon: 'savings' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all active:scale-95 ${
              tab === t.id ? 'bg-primary text-white border-primary' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          {/* Task chart */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-primary">bar_chart</span> Task Completion — Last 7 Days
              </h3>
            </div>
            <div className="flex items-end gap-2 h-32">
              {weekTaskData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[8px] font-mono text-on-surface-variant">{d.done}/{d.total}</span>
                  <div className="w-full rounded-t-lg bg-surface-container-high dark:bg-surface-container relative flex items-end justify-center overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-tertiary rounded-t-lg transition-all duration-500"
                      style={{ height: `${(d.total / maxTaskDay) * 100}%`, minHeight: d.total > 0 ? 6 : 2 }}
                    >
                      <div className="w-full bg-white/40" style={{ height: d.total ? `${(d.done / d.total) * 100}%` : 0 }} />
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono font-bold ${d.date === todayStr ? 'text-primary' : 'text-on-surface-variant'}`}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pomodoro chart */}
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[15px] text-secondary">timeline</span> Focus Minutes — Last 7 Days
            </h3>
            <div className="flex items-end gap-2 h-24">
              {weekPomodoro.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg bg-surface-container-high dark:bg-surface-container flex items-end justify-center overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-secondary to-tertiary rounded-t-lg transition-all duration-500"
                      style={{ height: `${(d.mins / maxPomoDay) * 100}%`, minHeight: d.mins > 0 ? 5 : 2 }}
                    />
                  </div>
                  <span className="text-[8px] font-mono font-bold text-on-surface-variant">{d.mins}m</span>
                  <span className={`text-[9px] font-mono font-bold ${d.date === todayStr ? 'text-secondary' : 'text-on-surface-variant'}`}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Role feature snapshot */}
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[15px] text-tertiary">workspaces</span> Role Feature Snapshot
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto scroll-hide">
              {Object.entries(roleData).map(([roleId, features]) => {
                const count = Object.entries(features || {}).reduce((a, [fid, data]) => {
                  if (Array.isArray(data)) return a + data.length;
                  if (data && typeof data === 'object') return a + Object.keys(data).length;
                  return a;
                }, 0);
                return (
                  <div key={roleId} className="p-3 rounded-xl bg-surface/60 border border-outline/10">
                    <div className="text-[11px] font-extrabold capitalize">{roleId}</div>
                    <div className="text-[9px] text-on-surface-variant font-medium mt-0.5">
                      {Object.keys(features || {}).length} tools · {count} entries logged
                    </div>
                  </div>
                );
              })}
              {Object.keys(roleData).length === 0 && (
                <p className="col-span-2 text-center text-on-surface-variant italic text-[11px] py-3">No role data yet. Complete onboarding to unlock role tools.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'mood' && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider mb-3">How are you feeling today?</h3>
            <div className="flex gap-2">
              {moods.map(m => (
                <button
                  key={m.v}
                  onClick={() => setMood(m.v)}
                  className={`flex-1 p-3 rounded-2xl border-2 text-center transition-all active:scale-95 ${
                    moodLog[todayStr] === m.v ? 'bg-primary/10 border-primary' : 'border-outline/10 hover:bg-surface-container'
                  }`}
                >
                  <div className="text-[22px]">{m.emoji}</div>
                  <div className="text-[9px] font-bold text-on-surface-variant mt-1">{m.label}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider mb-3">Mood Week</h3>
            <div className="grid grid-cols-7 gap-2">
              {weekMoods.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[18px] border-2 transition-all ${
                    d.v ? 'bg-surface-container/60 border-primary/30' : 'bg-surface-container/30 border-outline/10 opacity-40'
                  }`}>
                    {d.v ? moods[d.v - 1].emoji : '—'}
                  </div>
                  <span className={`text-[9px] font-mono font-bold ${d.date === todayStr ? 'text-primary' : 'text-on-surface-variant'}`}>{d.label}</span>
                </div>
              ))}
            </div>
            {!moodLog[todayStr] && (
              <p className="text-center text-[10px] text-on-surface-variant italic mt-3">Tap a mood above to start your streak.</p>
            )}
          </div>
        </div>
      )}

      {tab === 'money' && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider mb-3">Log an expense</h3>
            <form onSubmit={addExpense} className="flex flex-wrap gap-2">
              <input
                type="text"
                value={expenseDraft.label}
                onChange={(e) => setExpenseDraft({ ...expenseDraft, label: e.target.value })}
                placeholder="Expense label"
                className="flex-1 min-w-[120px] px-3 py-2 rounded-xl border border-outline/25 bg-surface/50 text-[12px] focus:outline-none focus:border-primary"
              />
              <input
                type="number"
                step="0.01"
                value={expenseDraft.amount}
                onChange={(e) => setExpenseDraft({ ...expenseDraft, amount: e.target.value })}
                placeholder="Amount"
                className="w-24 px-3 py-2 rounded-xl border border-outline/25 bg-surface/50 text-[12px] focus:outline-none focus:border-primary"
              />
              <select
                value={expenseDraft.category}
                onChange={(e) => setExpenseDraft({ ...expenseDraft, category: e.target.value })}
                className="px-3 py-2 rounded-xl border border-outline/25 bg-surface/50 text-[12px] focus:outline-none"
              >
                {['Personal', 'Work', 'Health', 'Academic', 'Food', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
              <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white text-[11px] font-bold hover:opacity-90 active:scale-95 transition-all">
                + ADD
              </button>
            </form>
          </div>
          <div className="glass-card rounded-2xl p-4 space-y-2 max-h-[320px] overflow-y-auto scroll-hide">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider">Recent expenses</h3>
              <span className="text-[10px] font-mono font-bold text-primary">${totalSpent.toFixed(2)} total</span>
            </div>
            {(expenses || []).length === 0 ? (
              <p className="text-center text-on-surface-variant italic text-[11px] py-4">No expenses logged yet.</p>
            ) : (
              (expenses || []).map(e => (
                <div key={e.id} className="group flex items-center gap-2 p-2.5 rounded-xl bg-surface/60 border border-outline/10">
                  <span className="material-symbols-outlined text-[15px] text-tertiary">receipt_long</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold block truncate">{e.label}</span>
                    <span className="text-[8px] text-on-surface-variant font-mono">{e.category} · {e.date}</span>
                  </div>
                  <span className="text-[12px] font-mono font-extrabold">${e.amount.toFixed(2)}</span>
                  <button onClick={() => deleteExpense(e.id)} className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error transition-opacity">
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
