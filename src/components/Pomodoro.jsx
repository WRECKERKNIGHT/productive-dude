import React, { useEffect, useRef, useState } from 'react';

const MODES = [
  { id: 'focus', label: 'Focus', minutes: 25, color: 'text-primary', ring: '#2563eb', emoji: '🎯' },
  { id: 'short', label: 'Short Break', minutes: 5, color: 'text-secondary', ring: '#10b981', emoji: '☕' },
  { id: 'long', label: 'Long Break', minutes: 15, color: 'text-tertiary', ring: '#8b5cf6', emoji: '🌿' }
];

export default function Pomodoro({ pomodoroLog, setPomodoroLog, openApp }) {
  const [modeIdx, setModeIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(MODES[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(1);
  const intervalRef = useRef(null);

  const mode = MODES[modeIdx];
  const total = mode.minutes * 60;
  const pct = ((total - secondsLeft) / total) * 100;
  const circum = 2 * Math.PI * 120;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const handleComplete = () => {
    const entry = {
      id: `pomo-${Date.now()}`,
      mode: mode.id,
      label: mode.label,
      minutes: mode.minutes,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completed: true
    };
    setPomodoroLog([entry, ...pomodoroLog]);
    setModeIdx(modeIdx === 0 ? (round % 4 === 0 ? 2 : 1) : 0);
    if (modeIdx === 0) setRound(r => r + 1);
  };

  const switchMode = (i) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setModeIdx(i);
    setSecondsLeft(MODES[i].minutes * 60);
  };

  const toggle = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(mode.minutes * 60);
    }
    setRunning(r => !r);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSecondsLeft(mode.minutes * 60);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const todayPomos = pomodoroLog.filter(p => p.completed && p.date === new Date().toISOString().split('T')[0]);
  const totalFocusMin = pomodoroLog.filter(p => p.completed && p.mode === 'focus').reduce((a, p) => a + p.minutes, 0);

  return (
    <div className="h-full flex flex-col space-y-md animate-fade-in text-left">
      <div>
        <p className="font-label-caps text-label-caps text-primary mb-1">DEEP WORK ENGINE</p>
        <h2 className="text-headline-md font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">timer</span>
          Focus Timer
        </h2>
        <p className="text-on-surface-variant text-[13px]">Pomodoro cycles: 25 min focus, 5 min break, 15 min long break after 4 rounds.</p>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-[210px] h-[210px] flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="120" className="stroke-surface-container-high dark:stroke-surface-container" strokeWidth="12" fill="transparent" />
            <circle
              cx="130" cy="130" r="120"
              stroke={mode.ring}
              strokeWidth="12" fill="transparent"
              strokeDasharray={circum}
              strokeDashoffset={circum - (pct / 100) * circum}
              strokeLinecap="round"
              className="progress-ring-circle"
              style={{ filter: `drop-shadow(0 0 8px ${mode.ring}66)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl mb-1">{mode.emoji}</span>
            <span className="text-[38px] font-extrabold font-mono leading-none">{mm}:{ss}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${mode.color}`}>{mode.label}</span>
            <span className="text-[9px] text-on-surface-variant font-mono mt-0.5">Round {round}</span>
          </div>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex justify-center gap-2">
        {MODES.map((m, i) => (
          <button
            key={m.id}
            onClick={() => switchMode(i)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all active:scale-95 ${
              modeIdx === i ? 'text-white' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
            style={modeIdx === i ? { backgroundColor: m.ring, borderColor: m.ring } : {}}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-[12px] font-extrabold shadow-md hover:opacity-90 active:scale-95 transition-all"
          style={{ backgroundColor: mode.ring }}
        >
          <span className="material-symbols-outlined text-[20px]">{running ? 'pause' : 'play_arrow'}</span>
          {running ? 'PAUSE' : secondsLeft === 0 ? 'RESTART' : 'START'}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-surface-container/60 border border-outline/10 text-[11px] font-bold text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span> RESET
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-card p-3 rounded-2xl text-center">
          <div className="text-[18px] font-extrabold font-mono text-primary">{todayPomos.length}</div>
          <div className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Sessions Today</div>
        </div>
        <div className="glass-card p-3 rounded-2xl text-center">
          <div className="text-[18px] font-extrabold font-mono text-secondary">{totalFocusMin} min</div>
          <div className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Total Focus</div>
        </div>
        <div className="glass-card p-3 rounded-2xl text-center">
          <div className="text-[18px] font-extrabold font-mono text-tertiary">{pomodoroLog.filter(p => p.completed).length}</div>
          <div className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">All Sessions</div>
        </div>
      </div>

      {/* Session log */}
      <div className="glass-card rounded-2xl p-3 flex-1 min-h-0 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-secondary">history</span> Session Log
          </h3>
          <span className="text-[9px] text-on-surface-variant font-mono">{pomodoroLog.length} entries</span>
        </div>
        <div className="flex-1 overflow-y-auto scroll-hide space-y-1.5 min-h-[60px]">
          {pomodoroLog.length === 0 ? (
            <p className="text-center text-on-surface-variant italic text-[11px] py-4">No sessions yet. Complete a focus round to log it.</p>
          ) : (
            pomodoroLog.slice(0, 12).map(p => (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-surface/60 border border-outline/10">
                <span className="text-[14px]">{MODES.find(m => m.id === p.mode)?.emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold block truncate">{p.label}</span>
                  <span className="text-[8px] text-on-surface-variant font-mono">{p.date} · {p.time}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-on-surface-variant">{p.minutes} min</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
