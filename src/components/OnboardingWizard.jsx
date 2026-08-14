import React, { useMemo, useState } from 'react';
import { ROLES, FOCUS_WINDOWS, WORKLOADS, THEME_PRESETS, WALLPAPERS, getRole } from '../roles';

const STEP_LABELS = ['Welcome', 'Your Role', 'Goals', 'Schedule', 'Appearance'];

export default function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [primaryRole, setPrimaryRole] = useState(null);
  const [secondaryRoles, setSecondaryRoles] = useState([]);
  const [goals, setGoals] = useState([]);
  const [customGoal, setCustomGoal] = useState('');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [focusWindow, setFocusWindow] = useState('Morning');
  const [workload, setWorkload] = useState('medium');
  const [isDark, setIsDark] = useState(true);
  const [theme, setTheme] = useState('focus-blue');
  const [wallpaper, setWallpaper] = useState('wall-1');

  const selectedRoleIds = useMemo(() => [primaryRole, ...secondaryRoles].filter(Boolean), [primaryRole, secondaryRoles]);
  const roleOptions = useMemo(
    () => selectedRoleIds.map(id => getRole(id)).filter(Boolean),
    [selectedRoleIds]
  );

  const toggleSecondary = (id) => {
    if (id === primaryRole) return;
    setSecondaryRoles(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const toggleGoal = (goal) => {
    setGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : prev.length < 3 ? [...prev, goal] : prev
    );
  };

  const addCustomGoal = () => {
    if (!customGoal.trim() || goals.length >= 3) return;
    setGoals(prev => [...prev, customGoal.trim()]);
    setCustomGoal('');
  };

  const canContinue = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return !!primaryRole;
    return true;
  };

  const next = () => setStep(s => Math.min(s + 1, 4));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const finish = () => {
    onComplete({
      name: name.trim(),
      primaryRole,
      secondaryRoles,
      goals,
      wakeTime,
      focusWindow,
      workload,
      theme,
      isDark,
      wallpaper,
      onboarded: true
    });
  };

  const roleCards = (onSelect, selected, multi = false) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {ROLES.map(role => {
        const active = selected.includes(role.id);
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            className={`glass-card p-4 rounded-2xl text-left transition-all active:scale-[0.97] text-on-surface flex flex-col gap-2 ${
              active
                ? 'ring-2 shadow-md'
                : 'hover:-translate-y-0.5 hover:shadow-md opacity-90'
            }`}
            style={active ? { boxShadow: `0 8px 24px -8px ${role.accent}55`, borderColor: role.accent, outline: `2px solid ${role.accent}` } : {}}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: `${role.accent}1f` }}
            >
              {role.emoji}
            </div>
            <div>
              <div className="font-extrabold text-[13px] leading-tight">{role.name}</div>
              <div className="text-[10px] text-on-surface-variant font-medium mt-0.5 leading-snug line-clamp-2">{role.tagline}</div>
            </div>
            {active && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-white rounded-md px-2 py-0.5 self-start" style={{ backgroundColor: role.accent }}>
                {multi ? 'Added' : 'Primary role'}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background text-on-surface">
      {/* ambient glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] pointer-events-none opacity-25" style={{ backgroundColor: getRole(primaryRole)?.accent || '#2563eb' }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] pointer-events-none opacity-20" style={{ backgroundColor: getRole(primaryRole)?.accent || '#2563eb' }} />

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${getRole(primaryRole)?.accent || '#2563eb'}, #0d9488)` }}>
              <span className="material-symbols-outlined text-white text-[18px]">bolt</span>
            </div>
            <div>
              <div className="font-headline font-extrabold tracking-tight text-[15px] leading-none">PRODUCTIVEDUDE</div>
              <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">Personal Setup</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${i === step ? 'text-white' : 'text-on-surface-variant'}`} style={i === step ? { backgroundColor: getRole(primaryRole)?.accent || '#2563eb' } : {}}>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden mb-8">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / 5) * 100}%`, backgroundColor: getRole(primaryRole)?.accent || '#2563eb' }}
          />
        </div>

        {/* Card body */}
        <div className="glass-card rounded-3xl p-6 md:p-8 animate-fade-in text-left">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h1 className="font-headline font-extrabold text-2xl md:text-3xl tracking-tight">Welcome to your Life OS.</h1>
                <p className="text-on-surface-variant font-medium mt-2 text-sm md:text-[15px] leading-relaxed">
                  Before we unlock your desktop, we’ll ask a few quick questions. This lets us tailor your
                  dashboard, dock, and tools to how you actually work — no filler, no generic bloat.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">What should we call you?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && canContinue() && next()}
                  placeholder="e.g. Alex, Sarah, Jordan..."
                  autoFocus
                  className="w-full max-w-sm px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none bg-surface/60"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['I want focus + calm', 'I want to win the semester', 'I want to ship things', 'I want to get healthier'].map(p => (
                  <button
                    key={p}
                    onClick={() => setName(p)}
                    className="text-[10px] font-bold px-3 py-1.5 rounded-full border text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    “{p}”
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-headline font-extrabold text-xl tracking-tight">What do you do?</h2>
                <p className="text-on-surface-variant text-sm font-medium mt-1">
                  Pick your <span className="font-bold text-on-surface">primary role</span> — it shapes your unique features.
                </p>
              </div>
              {roleCards(id => setPrimaryRole(id), [primaryRole], false)}
              <div className="pt-2">
                <h3 className="font-bold text-[13px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">add_circle</span>
                  Add up to 2 focus areas <span className="text-on-surface-variant font-medium text-[11px]">(optional)</span>
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ROLES.filter(r => r.id !== primaryRole).map(role => {
                    const active = secondaryRoles.includes(role.id);
                    const full = secondaryRoles.length >= 2;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => toggleSecondary(role.id)}
                        disabled={!active && full}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 disabled:opacity-40 ${
                          active ? 'text-white' : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                        style={active ? { backgroundColor: role.accent, borderColor: role.accent } : {}}
                      >
                        <span>{role.emoji}</span> {role.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-headline font-extrabold text-xl tracking-tight">What are your goals?</h2>
                <p className="text-on-surface-variant text-sm font-medium mt-1">
                  Pick up to 3. We’ll feature them on your dashboard.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {roleOptions.map(role => (
                  <div key={role.id} className="w-full">
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: role.accent }}>
                      {role.emoji} {role.name}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.goals.map(goal => {
                        const active = goals.includes(goal);
                        return (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => toggleGoal(goal)}
                            className={`px-3 py-2 rounded-xl text-[11px] font-bold border text-left transition-all active:scale-95 ${
                              active ? 'text-white' : 'text-on-surface-variant hover:bg-surface-container'
                            }`}
                            style={active ? { backgroundColor: role.accent, borderColor: role.accent } : {}}
                          >
                            {goal}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="w-full pt-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomGoal()}
                      placeholder="Add a custom goal..."
                      className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium bg-surface/60"
                    />
                    <button
                      type="button"
                      onClick={addCustomGoal}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                      style={{ backgroundColor: getRole(primaryRole)?.accent }}
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-headline font-extrabold text-xl tracking-tight">How does your day flow?</h2>
                <p className="text-on-surface-variant text-sm font-medium mt-1">
                  These tune your focus recommendations and schedule suggestions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Typical wake time</label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium bg-surface/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Peak focus window</label>
                  <div className="flex flex-wrap gap-2">
                    {FOCUS_WINDOWS.map(w => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setFocusWindow(w)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                          focusWindow === w ? 'text-white' : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                        style={focusWindow === w ? { backgroundColor: getRole(primaryRole)?.accent, borderColor: getRole(primaryRole)?.accent } : {}}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">How heavy is your schedule?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {WORKLOADS.map(w => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWorkload(w.id)}
                      className={`p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                        workload === w.id ? 'text-white' : 'text-on-surface hover:bg-surface-container'
                      }`}
                      style={workload === w.id ? { backgroundColor: getRole(primaryRole)?.accent, borderColor: getRole(primaryRole)?.accent } : {}}
                    >
                      <div className="font-extrabold text-sm">{w.label}</div>
                      <div className={`text-[11px] font-medium mt-1 leading-snug ${workload === w.id ? 'text-white/80' : 'text-on-surface-variant'}`}>{w.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-headline font-extrabold text-xl tracking-tight">Make it yours.</h2>
                <p className="text-on-surface-variant text-sm font-medium mt-1">
                  Choose your look. Calm, clean, and multicolor — no neon, we promise.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Light or dark</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ d: false, n: 'Light' }, { d: true, n: 'Dark' }].map(o => (
                      <button
                        key={o.n}
                        type="button"
                        onClick={() => setIsDark(o.d)}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                          isDark === o.d ? 'text-white' : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                        style={isDark === o.d ? { backgroundColor: getRole(primaryRole)?.accent, borderColor: getRole(primaryRole)?.accent } : {}}
                      >
                        <span className={`material-symbols-outlined text-[22px] ${isDark === o.d ? '' : 'text-on-surface'}`}>{o.d ? 'dark_mode' : 'light_mode'}</span>
                        <span className="text-xs font-extrabold">{o.n} mode</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Accent color</label>
                  <div className="flex flex-wrap gap-2">
                    {THEME_PRESETS.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTheme(p.id)}
                        title={p.name}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all active:scale-90 ${
                          theme === p.id ? 'border-on-surface' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: p.accent }}
                      >
                        {theme === p.id && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Desktop wallpaper</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {WALLPAPERS.map(w => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWallpaper(w.id)}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        wallpaper === w.id ? 'border-on-surface shadow-md' : 'border-transparent hover:opacity-85'
                      }`}
                    >
                      <img src={w.path} alt={w.name} className="w-full h-full object-cover" />
                      {wallpaper === w.id && (
                        <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl border text-sm space-y-1.5 bg-surface/40">
                <div className="font-extrabold text-xs uppercase tracking-wider">Setup summary</div>
                <div className="text-[12px] text-on-surface-variant font-medium flex flex-wrap gap-x-5 gap-y-1">
                  <span><span className="font-bold text-on-surface">{name || 'You'}</span></span>
                  <span>{selectedRoleIds.map(id => getRole(id).emoji).join(' ') || '—'}</span>
                  <span>{selectedRoleIds.map(id => getRole(id).name).join(' + ') || 'No role yet'}</span>
                  <span>Wakes {wakeTime} · {focusWindow} focus</span>
                  <span>Goal{goals.length !== 1 ? 's' : ''}: {goals.length || 'none set'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-6 mt-2 border-t">
            <button
              onClick={back}
              disabled={step === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container disabled:opacity-0 transition-all"
            >
              ← BACK
            </button>
            {step < 4 ? (
              <button
                onClick={next}
                disabled={!canContinue()}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-40 transition-all shadow-md active:scale-95"
                style={{ backgroundColor: getRole(primaryRole)?.accent }}
              >
                CONTINUE →
              </button>
            ) : (
              <button
                onClick={finish}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95"
                style={{ backgroundColor: getRole(primaryRole)?.accent }}
              >
                <span className="material-symbols-outlined text-[16px] align-text-bottom mr-1">bolt</span>
                ENTER LIFE OS
              </button>
            )}
          </div>
        </div>

        <div className="text-center text-[10px] text-on-surface-variant font-semibold uppercase tracking-widest mt-5">
          Local-first · Zero tracking · Everything stays on this device
        </div>
      </div>
    </div>
  );
}
