import React, { useRef, useState } from 'react';
import { ROLES, THEME_PRESETS, WALLPAPERS, FOCUS_WINDOWS, WORKLOADS, getRole } from '../roles';

const AVATAR_EMOJIS = ['🧑', '👩', '👨', '🧔', '👱‍♀️', '🧑‍🎓', '👩‍💻', '👨‍💻', '🦸', '🧙', '🦁', '🐯', '🐼', '🦊', '🚀', '⚡', '🌟', '🎯', '👑', '🧠'];

export default function Settings({
  username,
  setUsername,
  theme,
  setTheme,
  isDark,
  setIsDark,
  exportData,
  importData,
  resetAllData,
  loadTutorialDemo,
  profile,
  setProfile,
  onReRunOnboarding
}) {
  const fileInputRef = useRef(null);
  const [activeSection, setActiveSection] = useState('profile');

  const p = profile || {};

  const updateProfile = (patch) => {
    setProfile({ ...p, ...patch });
  };

  const toggleSecondary = (id) => {
    const current = p.secondaryRoles || [];
    if (id === p.primaryRole) return;
    if (current.includes(id)) {
      updateProfile({ secondaryRoles: current.filter(r => r !== id) });
    } else if (current.length < 2) {
      updateProfile({ secondaryRoles: [...current, id] });
    }
  };

  const toggleGoal = (goal) => {
    const current = p.goals || [];
    if (current.includes(goal)) {
      updateProfile({ goals: current.filter(g => g !== goal) });
    } else if (current.length < 5) {
      updateProfile({ goals: [...current, goal] });
    }
  };

  const handleImportClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importData(parsed);
        alert('Data backup imported successfully!');
        window.location.reload();
      } catch {
        alert('Failed to parse backup file. Please make sure it is a valid JSON file exported from this app.');
      }
    };
    reader.readAsText(file);
  };

  const sectionBtn = (id, icon, label) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left text-xs font-bold transition-all ${activeSection === id ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high/30'}`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="h-full flex flex-col text-on-surface select-none">
      <div className="border-b border-outline/10 pb-3 mb-4 text-left">
        <h2 className="text-body-lg font-extrabold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">settings</span> System Settings
        </h2>
        <p className="text-[11px] text-on-surface-variant font-medium">Configure your profile, roles, appearance and local data.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <div className="md:col-span-4 space-y-1.5 border-r border-outline/5 pr-2">
          {sectionBtn('profile', 'person', 'User Profile')}
          {sectionBtn('roles', 'workspaces', 'My Roles & Goals')}
          {sectionBtn('schedule', 'schedule', 'Schedule & Focus')}
          {sectionBtn('appearance', 'palette', 'Appearance & Themes')}
          {sectionBtn('tutorial', 'school', 'Demo & Tutorial Mode')}
          {sectionBtn('database', 'database', 'Database Backups')}
        </div>

        <div className="md:col-span-8 overflow-y-auto scroll-hide pl-1 text-left min-h-0 space-y-3">

          {/* ============ PROFILE ============ */}
          {activeSection === 'profile' && (
            <div className="p-4 bg-surface-color/45 dark:bg-black/10 border border-outline/10 rounded-2xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary block">User Profile Details</h3>

              {/* Avatar picker */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">PROFILE AVATAR</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-md border-2" style={{ backgroundColor: `${getRole(p.primaryRole || 'student').accent}22`, borderColor: getRole(p.primaryRole || 'student').accent }}>
                    {p.avatar || '🧑'}
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-5 gap-1.5 max-h-[84px] overflow-y-auto scroll-hide pr-1">
                      {AVATAR_EMOJIS.map(e => (
                        <button
                          key={e}
                          onClick={() => updateProfile({ avatar: e })}
                          className={`h-8 rounded-lg text-lg flex items-center justify-center transition-all ${p.avatar === e ? 'bg-primary/15 ring-2 ring-primary' : 'hover:bg-surface-container'}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-sm">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">DISPLAY NAME</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); updateProfile({ name: e.target.value }); }}
                  className="w-full max-w-sm px-3 py-2 rounded-xl border border-outline/30 bg-surface/50 focus:outline-none focus:border-primary text-xs font-medium"
                  placeholder="e.g. Alex, Sarah..."
                />
              </div>

              <div className="space-y-sm">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">SHORT BIO</label>
                <textarea
                  value={p.bio || ''}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                  rows={2}
                  placeholder="A line about who you are and what you're building..."
                  className="w-full px-3 py-2 rounded-xl border border-outline/30 bg-surface/50 focus:outline-none focus:border-primary text-xs font-medium resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-outline/10">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Primary role</span>
                <span className="px-3 py-1.5 rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: getRole(p.primaryRole).accent }}>
                  {getRole(p.primaryRole).emoji} {getRole(p.primaryRole).name}
                </span>
                <button
                  onClick={onReRunOnboarding}
                  className="ml-auto px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary/20 transition-all active:scale-95"
                >
                  CHANGE SETUP QUESTIONS
                </button>
              </div>
            </div>
          )}

          {/* ============ ROLES & GOALS ============ */}
          {activeSection === 'roles' && (
            <div className="p-4 bg-surface-color/45 dark:bg-black/10 border border-outline/10 rounded-2xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary block">My Roles & Goals</h3>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">PRIMARY ROLE</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ROLES.map(role => (
                    <button
                      key={role.id}
                      onClick={() => updateProfile({ primaryRole: role.id })}
                      className={`p-3 rounded-xl border-2 text-left transition-all active:scale-95 ${p.primaryRole === role.id ? 'text-white' : 'hover:bg-surface-container'}`}
                      style={p.primaryRole === role.id ? { backgroundColor: role.accent, borderColor: role.accent } : {}}
                    >
                      <span className="text-lg">{role.emoji}</span>
                      <div className="text-[11px] font-extrabold mt-1">{role.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">FOCUS AREAS (UP TO 2)</label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.filter(r => r.id !== p.primaryRole).map(role => {
                    const active = (p.secondaryRoles || []).includes(role.id);
                    const full = (p.secondaryRoles || []).length >= 2;
                    return (
                      <button
                        key={role.id}
                        onClick={() => toggleSecondary(role.id)}
                        disabled={!active && full}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 disabled:opacity-40 ${active ? 'text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
                        style={active ? { backgroundColor: role.accent, borderColor: role.accent } : {}}
                      >
                        <span>{role.emoji}</span> {role.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-outline/10">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">FEATURED GOALS (UP TO 5)</label>
                <div className="flex flex-wrap gap-2">
                  {getRole(p.primaryRole).goals.map(goal => {
                    const active = (p.goals || []).includes(goal);
                    return (
                      <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-bold border text-left transition-all active:scale-95 ${active ? 'text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
                        style={active ? { backgroundColor: getRole(p.primaryRole).accent, borderColor: getRole(p.primaryRole).accent } : {}}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-on-surface-variant italic">These appear as your featured goals on the dashboard.</p>
              </div>
            </div>
          )}

          {/* ============ SCHEDULE ============ */}
          {activeSection === 'schedule' && (
            <div className="p-4 bg-surface-color/45 dark:bg-black/10 border border-outline/10 rounded-2xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary block">Schedule & Focus</h3>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">TYPICAL WAKE TIME</label>
                <input
                  type="time"
                  value={p.wakeTime || '06:30'}
                  onChange={(e) => updateProfile({ wakeTime: e.target.value })}
                  className="w-full max-w-sm px-3 py-2 rounded-xl border border-outline/30 bg-surface/50 focus:outline-none focus:border-primary text-xs font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">PEAK FOCUS WINDOW</label>
                <div className="flex flex-wrap gap-2">
                  {FOCUS_WINDOWS.map(w => (
                    <button
                      key={w}
                      onClick={() => updateProfile({ focusWindow: w })}
                      className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${p.focusWindow === w ? 'text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
                      style={p.focusWindow === w ? { backgroundColor: getRole(p.primaryRole).accent, borderColor: getRole(p.primaryRole).accent } : {}}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">WORKLOAD LEVEL</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {WORKLOADS.map(w => (
                    <button
                      key={w.id}
                      onClick={() => updateProfile({ workload: w.id })}
                      className={`p-3 rounded-2xl border text-left transition-all ${p.workload === w.id ? 'text-white' : 'text-on-surface hover:bg-surface-container'}`}
                      style={p.workload === w.id ? { backgroundColor: getRole(p.primaryRole).accent, borderColor: getRole(p.primaryRole).accent } : {}}
                    >
                      <div className="font-extrabold text-[12px]">{w.label}</div>
                      <div className={`text-[10px] font-medium mt-0.5 ${p.workload === w.id ? 'text-white/80' : 'text-on-surface-variant'}`}>{w.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 text-[11px] font-medium text-on-surface-variant leading-relaxed">
                These answers shape your daily focus recommendations across the suite.
              </div>
            </div>
          )}

          {/* ============ APPEARANCE ============ */}
          {activeSection === 'appearance' && (
            <div className="p-4 bg-surface-color/45 dark:bg-black/10 border border-outline/10 rounded-2xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary block">System Appearance</h3>

              <div className="space-y-sm">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">COLOR WORLD (12 THEMES)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {THEME_PRESETS.map(preset => {
                    const isActive = theme === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => { setTheme(preset.id); updateProfile({ theme: preset.id }); }}
                        className={`px-3 py-2 rounded-xl flex items-center gap-2 font-bold text-[11px] text-white transition-all active:scale-95 border-2 ${isActive ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-surface border-white/60' : 'border-transparent hover:opacity-95'}`}
                        style={{ backgroundColor: preset.accent }}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isActive ? 'check_circle' : 'palette'}
                        </span>
                        {preset.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-sm pt-3 border-t border-outline/10">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">DARK/LIGHT STYLE</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setIsDark(false); updateProfile({ isDark: false }); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all ${!isDark ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">light_mode</span>
                    LIGHT MODE
                  </button>
                  <button
                    onClick={() => { setIsDark(true); updateProfile({ isDark: true }); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all ${isDark ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">dark_mode</span>
                    DARK MODE
                  </button>
                </div>
              </div>

              <div className="space-y-sm pt-3 border-t border-outline/10">
                <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">DESKTOP WALLPAPER</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {WALLPAPERS.map(w => (
                    <button
                      key={w.id}
                      onClick={() => updateProfile({ wallpaper: w.id })}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${p.wallpaper === w.id ? 'border-primary shadow-md' : 'border-transparent hover:opacity-85'}`}
                    >
                      <img src={w.path} alt={w.name} className="w-full h-full object-cover" />
                      {p.wallpaper === w.id && (
                        <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow bg-black/20">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ TUTORIAL ============ */}
          {activeSection === 'tutorial' && (
            <div className="p-4 bg-surface-color/45 dark:bg-black/10 border border-outline/10 rounded-2xl space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary block">Tutorial Mode</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                Need to explore with mock datasets? Click below to populate tasks, habits, and subject syllabi with sample info immediately.
              </p>
              <button
                onClick={() => { loadTutorialDemo(); alert('Tutorial demo data preloaded successfully!'); window.location.reload(); }}
                className="px-4 py-2 bg-gradient-to-r from-primary to-tertiary text-white text-xs font-bold rounded-xl active:scale-95 hover:opacity-95 transition-all shadow-sm"
              >
                LOAD TUTORIAL DEMO DATA
              </button>
            </div>
          )}

          {/* ============ DATABASE ============ */}
          {activeSection === 'database' && (
            <div className="p-4 bg-surface-color/45 dark:bg-black/10 border border-outline/10 rounded-2xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary block">Local Database Controls</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                All data is strictly stored inside your local browser storage. No information leaves your machine.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={exportData} className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  EXPORT BACKUP (JSON)
                </button>
                <button onClick={handleImportClick} className="px-3.5 py-1.5 bg-secondary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  IMPORT BACKUP (JSON)
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
              </div>
              <div className="pt-3 border-t border-outline/10">
                <h4 className="text-[11px] font-bold text-error block mb-1 uppercase tracking-wider">Danger Zone</h4>
                <p className="text-[10px] text-on-surface-variant mb-2">Resets the app back to initial blank slate, wiping out tasks, habits, subjects, and records.</p>
                <button onClick={resetAllData} className="px-4 py-2 bg-error/10 hover:bg-error/20 text-error text-xs font-bold rounded-xl active:scale-95 transition-all">
                  RESET ALL APP DATA
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
