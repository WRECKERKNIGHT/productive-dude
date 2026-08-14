import React, { useState } from 'react';
import { ROLES, getRole } from '../roles';
import RoleFeature from './RoleFeature';

export default function RoleHub({
  profile,
  roleData,
  setRoleData,
  tasks,
  habits,
  pomodoroLog,
  roleGoals,
  setRoleGoals,
  setPomodoroLog,
  openApp
}) {
  const userRoles = [profile.primaryRole, ...(profile.secondaryRoles || [])].filter(Boolean);
  const [activeRoleId, setActiveRoleId] = useState(profile.primaryRole || ROLES[0].id);
  const [goalDraft, setGoalDraft] = useState('');

  const activeRole = getRole(activeRoleId);
  const roleIds = userRoles.length ? userRoles : [ROLES[0].id];

  const setFeatureData = (featureId, updater) => {
    setRoleData(prev => {
      const current = prev[activeRoleId]?.[featureId];
      const nextVal = typeof updater === 'function' ? updater(current) : updater;
      return {
        ...prev,
        [activeRoleId]: {
          ...(prev[activeRoleId] || {}),
          [featureId]: nextVal
        }
      };
    });
  };

  const addGoal = (e) => {
    e.preventDefault();
    if (!goalDraft.trim()) return;
    setRoleGoals([...roleGoals, { id: `g-${Date.now()}`, text: goalDraft.trim(), roleId: activeRoleId, done: false }]);
    setGoalDraft('');
  };

  const toggleGoal = (id) => {
    setRoleGoals(roleGoals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const deleteGoal = (id) => {
    setRoleGoals(roleGoals.filter(g => g.id !== id));
  };

  const progress = {
    tasks: tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0,
    habits: habits.length ? Math.round((habits.filter(h => Object.values(h.progress || {}).some(v => v >= h.target)).length / habits.length) * 100) : 0,
    focus: pomodoroLog.length ? Math.round((pomodoroLog.filter(p => p.completed).length / pomodoroLog.length) * 100) : 0,
    goals: roleGoals.length ? Math.round((roleGoals.filter(g => g.done).length / roleGoals.length) * 100) : 0
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <p className="font-label-caps text-label-caps text-primary mb-1">ROLE-BASED COMMAND CENTER</p>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold">Role Hub</h1>
          <p className="text-on-surface-variant font-body-lg">
            Every role unlocks its own tools. Switch between them — data stays separate but unified.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openApp('goals')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container/60 border border-outline/10 text-[11px] font-bold hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-[15px] text-tertiary">flag</span> My Goals
          </button>
          <button
            onClick={() => openApp('pomodoro')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container/60 border border-outline/10 text-[11px] font-bold hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-[15px] text-secondary">timer</span> Focus Timer
          </button>
        </div>
      </div>

      {/* Role switcher pills */}
      <div className="flex flex-wrap gap-2">
        {roleIds.map(rid => {
          const role = getRole(rid);
          const isActive = rid === activeRoleId;
          return (
            <button
              key={rid}
              onClick={() => setActiveRoleId(rid)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-[12px] font-bold transition-all active:scale-95 ${
                isActive ? 'text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              style={isActive ? { backgroundColor: role.accent, borderColor: role.accent, boxShadow: `0 8px 20px -6px ${role.accent}66` } : {}}
            >
              <span className="text-[16px]">{role.emoji}</span>
              {role.name}
              {rid === profile.primaryRole && (
                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${isActive ? 'bg-white/25' : 'bg-primary/10 text-primary'}`}>Primary</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active role banner */}
      <div className="glass-card rounded-2xl overflow-hidden relative">
        <div className="h-24 md:h-28 relative" style={{ background: `linear-gradient(120deg, ${activeRole.accent}22, ${activeRole.accent}08)` }}>
          <img
            src={`/img/roles/${activeRole.id}.jpg`}
            alt={activeRole.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-surface/90 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg" style={{ backgroundColor: `${activeRole.accent}22`, border: `2px solid ${activeRole.accent}` }}>
                {activeRole.emoji}
              </div>
              <div>
                <h2 className="text-lg font-extrabold leading-none">{activeRole.name}</h2>
                <p className="text-[11px] text-on-surface-variant font-medium mt-1 max-w-lg leading-snug">{activeRole.tagline}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role stat chips */}
        <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-2 border-t border-outline/10">
          {[
            { label: 'Tasks', val: progress.tasks, color: 'text-primary' },
            { label: 'Habits', val: progress.habits, color: 'text-secondary' },
            { label: 'Focus', val: progress.focus, color: 'text-tertiary' },
            { label: 'Goals', val: progress.goals, color: 'text-primary' }
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <span>{s.label}</span>
                  <span className={s.color}>{s.val}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mt-1">
                  <div className={`h-full rounded-full transition-all duration-500 ${s.color.replace('text-', 'bg-')}`} style={{ width: `${s.val}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature panels */}
      <div className="space-y-md">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-md font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">widgets</span>
            {activeRole.name} Tools
          </h2>
          <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {activeRole.features.length} features
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
          {activeRole.features.map(f => (
            <RoleFeature
              key={f.id}
              feature={f}
              data={roleData[activeRoleId]?.[f.id]}
              setData={(v) => setFeatureData(f.id, v)}
            />
          ))}
        </div>
      </div>

      {/* Quick goals for this role */}
      <div className="space-y-md">
        <h2 className="text-headline-md font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">flag</span>
          {activeRole.name} Goals
        </h2>
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <form onSubmit={addGoal} className="flex gap-2">
            <input
              type="text"
              value={goalDraft}
              onChange={(e) => setGoalDraft(e.target.value)}
              placeholder={`Add a ${activeRole.name.toLowerCase()} goal...`}
              className="flex-1 px-3 py-2 rounded-xl border border-outline/25 bg-surface/50 text-[13px] focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-[11px] font-bold text-white hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: activeRole.accent }}
            >
              + ADD
            </button>
          </form>
          <div className="space-y-2">
            {roleGoals.filter(g => g.roleId === activeRoleId).length === 0 ? (
              <p className="text-center text-on-surface-variant italic text-[12px] py-3">
                No goals set for {activeRole.name}. Add one above — it will appear on the Goals app.
              </p>
            ) : (
              roleGoals.filter(g => g.roleId === activeRoleId).map(g => (
                <div key={g.id} className="group flex items-center gap-2 p-2.5 rounded-xl bg-surface/60 border border-outline/10">
                  <button
                    onClick={() => toggleGoal(g.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${g.done ? 'bg-primary border-primary' : 'border-outline-variant hover:bg-primary/10'}`}
                  >
                    {g.done && <span className="material-symbols-outlined text-white text-[13px] font-bold animate-spring-check">check</span>}
                  </button>
                  <span className={`flex-1 text-[12px] font-bold ${g.done ? 'line-through text-on-surface-variant' : ''}`}>{g.text}</span>
                  <button onClick={() => deleteGoal(g.id)} className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error transition-opacity">
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
