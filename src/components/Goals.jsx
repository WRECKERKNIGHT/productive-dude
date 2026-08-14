import React, { useState } from 'react';
import { getRole, ROLES } from '../roles';

export default function Goals({ roleGoals, setRoleGoals, profile }) {
  const [draft, setDraft] = useState('');
  const [draftRole, setDraftRole] = useState(profile.primaryRole || ROLES[0].id);
  const [filterRole, setFilterRole] = useState('all');

  const userRoleIds = [profile.primaryRole, ...(profile.secondaryRoles || [])].filter(Boolean);
  const allRoleIds = userRoleIds.length ? userRoleIds : [ROLES[0].id];

  const addGoal = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setRoleGoals([{ id: `goal-${Date.now()}`, text: draft.trim(), roleId: draftRole, done: false, createdAt: Date.now() }, ...roleGoals]);
    setDraft('');
  };

  const toggleGoal = (id) => {
    setRoleGoals(roleGoals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const deleteGoal = (id) => {
    setRoleGoals(roleGoals.filter(g => g.id !== id));
  };

  const filtered = roleGoals
    .filter(g => filterRole === 'all' ? true : g.roleId === filterRole)
    .sort((a, b) => a.done - b.done);

  const doneCount = filtered.filter(g => g.done).length;
  const pct = filtered.length ? Math.round((doneCount / filtered.length) * 100) : 0;

  return (
    <div className="h-full flex flex-col space-y-md animate-fade-in text-left">
      <div>
        <p className="font-label-caps text-label-caps text-primary mb-1">TARGETS & AMBITIONS</p>
        <h2 className="text-headline-md font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">flag</span>
          Goals
        </h2>
        <p className="text-on-surface-variant text-[13px]">Break your ambitions into checkable milestones, organized by role.</p>
      </div>

      {/* Progress overview */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="27" className="stroke-surface-container-high dark:stroke-surface-container" strokeWidth="7" fill="transparent" />
              <circle
                cx="32" cy="32" r="27"
                className="stroke-primary progress-ring-circle"
                strokeWidth="7" fill="transparent"
                strokeDasharray={2 * Math.PI * 27}
                strokeDashoffset={(2 * Math.PI * 27) * (1 - pct / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[14px] font-extrabold font-mono">{pct}%</div>
          </div>
          <div>
            <div className="text-[14px] font-extrabold">{doneCount} of {filtered.length} goals completed</div>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Check them off as you go — progress persists locally.</p>
          </div>
        </div>
      </div>

      {/* Role filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterRole('all')}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${filterRole === 'all' ? 'bg-primary text-white border-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
        >
          All Roles
        </button>
        {allRoleIds.map(rid => (
          <button
            key={rid}
            onClick={() => setFilterRole(rid)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${filterRole === rid ? 'text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
            style={filterRole === rid ? { backgroundColor: getRole(rid).accent, borderColor: getRole(rid).accent } : {}}
          >
            {getRole(rid).emoji} {getRole(rid).name}
          </button>
        ))}
      </div>

      {/* Add goal */}
      <form onSubmit={addGoal} className="glass-card rounded-2xl p-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What do you want to achieve?"
          className="flex-1 min-w-[160px] px-3 py-2 rounded-xl border border-outline/25 bg-surface/50 text-[13px] focus:outline-none focus:border-primary"
        />
        <select
          value={draftRole}
          onChange={(e) => setDraftRole(e.target.value)}
          className="px-3 py-2 rounded-xl border border-outline/25 bg-surface/50 text-[11px] font-bold focus:outline-none"
        >
          {allRoleIds.map(rid => <option key={rid} value={rid}>{getRole(rid).emoji} {getRole(rid).name}</option>)}
        </select>
        <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white text-[11px] font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px]">add</span> ADD GOAL
        </button>
      </form>

      {/* Goals list */}
      <div className="flex-1 min-h-0 overflow-y-auto scroll-hide space-y-2 pb-1">
        {filtered.length === 0 ? (
          <div className="glass-card p-lg text-center text-on-surface-variant italic text-[12px]">
            No goals yet. Add your first milestone above.
          </div>
        ) : (
          filtered.map(g => {
            const role = getRole(g.roleId || profile.primaryRole);
            return (
              <div
                key={g.id}
                className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all ${g.done ? 'bg-surface-container/40 border-outline/10 opacity-70' : 'bg-surface/60 border-outline/10 hover:border-outline/25'}`}
                style={!g.done ? { borderLeft: `3px solid ${role.accent}` } : {}}
              >
                <button
                  onClick={() => toggleGoal(g.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${g.done ? 'bg-primary border-primary' : 'border-outline-variant hover:bg-primary/10'}`}
                >
                  {g.done && <span className="material-symbols-outlined text-white text-[15px] font-bold animate-spring-check">check</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <span className={`text-[13px] font-bold block leading-snug ${g.done ? 'line-through text-on-surface-variant' : ''}`}>{g.text}</span>
                  <span className="text-[9px] font-medium text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span>{role.emoji}</span> {role.name}
                  </span>
                </div>
                <button onClick={() => deleteGoal(g.id)} className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error transition-opacity flex-shrink-0">
                  <span className="material-symbols-outlined text-[17px]">close</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
