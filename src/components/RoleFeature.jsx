import React, { useState } from 'react';

// ---------------------------------------------------------------------------
// Generic role feature panel renderer.
// Supports three feature types driven by the role config in roles.js:
//   - list    : a checklist with configurable fields
//   - kanban  : column board where cards move left -> right
//   - counters: date-keyed incrementer (e.g. words, reps, revenue)
// ---------------------------------------------------------------------------

const FEATURE_COLORS = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/30' },
  tertiary: { bg: 'bg-tertiary/10', text: 'text-tertiary', border: 'border-tertiary/30' }
};

function ListFeature({ feature, items, setItems }) {
  const [draft, setDraft] = useState({});
  const [adding, setAdding] = useState(false);

  const emptyDraft = () => {
    const d = {};
    feature.fields.forEach(f => {
      d[f.key] = f.type === 'number' ? '' : '';
    });
    return { ...d, ...(feature.defaultNew || {}) };
  };

  const addItem = () => {
    const item = { id: `f-${Date.now()}-${Math.floor(Math.random() * 9999)}`, done: false };
    let valid = true;
    feature.fields.forEach(f => {
      const v = draft[f.key];
      if (f.type === 'number') item[f.key] = v === '' || v === null || isNaN(v) ? 0 : Number(v);
      else item[f.key] = (v || '').trim();
    });
    if (!item[feature.fields[0].key]) valid = false;
    if (!valid) return;
    setItems([item, ...items]);
    setDraft(emptyDraft());
    setAdding(false);
  };

  const toggleDone = (id) => {
    setItems(items.map(it => it.id === id ? { ...it, done: !it.done } : it));
  };

  const removeItem = (id) => {
    setItems(items.filter(it => it.id !== id));
  };

  const c = FEATURE_COLORS[feature.color] || FEATURE_COLORS.primary;
  const doneCount = items.filter(i => i.done).length;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col min-h-0">
      <div className={`px-4 py-3 border-b flex items-center justify-between ${c.bg}`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className={`material-symbols-outlined text-[18px] ${c.text}`}>{feature.icon}</span>
          <div className="min-w-0">
            <h4 className="text-[13px] font-extrabold leading-tight truncate">{feature.title}</h4>
            {feature.desc && <p className="text-[10px] text-on-surface-variant font-medium leading-snug truncate">{feature.desc}</p>}
          </div>
        </div>
        <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${c.bg} ${c.text}`}>
          {doneCount}/{items.length}
        </span>
      </div>

      <div className="p-3 space-y-2 flex-1 overflow-y-auto scroll-hide min-h-[120px] max-h-[240px]">
        {items.length === 0 && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="w-full py-6 rounded-xl border border-dashed border-outline/30 text-on-surface-variant hover:text-primary hover:border-primary/40 text-[11px] font-bold transition-all"
          >
            + Add first item
          </button>
        )}

        {items.map(it => (
          <div key={it.id} className={`group flex items-center gap-2 p-2.5 rounded-xl border transition-all ${it.done ? 'bg-surface-container/40 opacity-60' : 'bg-surface/60 border-outline/10 hover:border-outline/25'}`}>
            <button
              onClick={() => toggleDone(it.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${it.done ? `bg-primary border-primary` : 'border-outline-variant hover:bg-primary/10'}`}
            >
              {it.done && <span className="material-symbols-outlined text-white text-[13px] font-bold animate-spring-check">check</span>}
            </button>
            <div className="flex-1 min-w-0">
              <div className={`text-[12px] font-bold leading-snug ${it.done ? 'line-through text-on-surface-variant' : ''}`}>
                {it[feature.fields[0].key]}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                {feature.fields.slice(1).map(f => (
                  <span key={f.key} className="text-[9px] text-on-surface-variant font-medium font-mono">
                    {f.label}: {f.type === 'number' ? it[f.key] : (it[f.key] || '—')}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={() => removeItem(it.id)} className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error transition-opacity flex-shrink-0">
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          </div>
        ))}

        {adding && (
          <div className="p-2.5 rounded-xl border border-outline/20 bg-surface/60 space-y-2">
            {feature.fields.map(f => (
              <div key={f.key}>
                <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block mb-0.5">{f.label}</label>
                <input
                  type={f.type === 'number' ? 'number' : f.type}
                  value={draft[f.key] ?? ''}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  placeholder={f.label}
                  className="w-full px-2 py-1.5 rounded-lg border border-outline/20 bg-surface text-[12px] focus:outline-none focus:border-primary"
                />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={addItem} className={`px-3 py-1.5 text-[10px] font-bold text-white rounded-lg hover:opacity-90 active:scale-95 transition-all ${c.bg.replace('/10', '')}`}>
                + ADD
              </button>
              <button onClick={() => { setAdding(false); setDraft(emptyDraft()); }} className="px-3 py-1.5 text-[10px] font-bold text-on-surface-variant hover:bg-surface-container rounded-lg">
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanFeature({ feature, items, setItems }) {
  const [draft, setDraft] = useState('');

  const move = (id, dir) => {
    setItems(items.map(it => {
      if (it.id !== id) return it;
      const next = Math.max(0, Math.min(feature.columns.length - 1, (it.status ?? 0) + dir));
      return { ...it, status: next };
    }));
  };

  const addCard = () => {
    if (!draft.trim()) return;
    setItems([{ id: `k-${Date.now()}-${Math.floor(Math.random() * 9999)}`, title: draft.trim(), status: 0 }, ...items]);
    setDraft('');
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col min-h-0">
      <div className="px-4 py-3 border-b bg-tertiary/10 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-tertiary">{feature.icon}</span>
          <div className="min-w-0">
            <h4 className="text-[13px] font-extrabold leading-tight truncate">{feature.title}</h4>
            {feature.desc && <p className="text-[10px] text-on-surface-variant font-medium leading-snug truncate">{feature.desc}</p>}
          </div>
        </div>
        <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-tertiary/10 text-tertiary">
          {items.length} cards
        </span>
      </div>

      <div className="p-3">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCard()}
            placeholder="New card..."
            className="flex-1 px-2.5 py-1.5 rounded-lg border border-outline/20 bg-surface text-[12px] focus:outline-none focus:border-primary"
          />
          <button onClick={addCard} className="px-3 py-1.5 text-[10px] font-bold text-white bg-tertiary rounded-lg hover:opacity-90 active:scale-95 transition-all">
            + ADD
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[230px] overflow-y-auto scroll-hide pb-1">
          {feature.columns.map((col, ci) => (
            <div key={col} className="rounded-xl bg-surface-container/50 border border-outline/10 p-2 space-y-1.5 min-h-[90px]">
              <div className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                {col}
              </div>
              {items.filter(it => (it.status ?? 0) === ci).map(it => (
                <div key={it.id} className="group p-2 rounded-lg bg-surface/80 border border-outline/10 shadow-sm">
                  <p className="text-[10px] font-bold leading-snug">{it.title}</p>
                  <div className="flex gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {ci > 0 && (
                      <button onClick={() => move(it.id, -1)} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary" title="Move back">
                        ←
                      </button>
                    )}
                    {ci < feature.columns.length - 1 && (
                      <button onClick={() => move(it.id, 1)} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-secondary/10 text-secondary" title="Move forward">
                        →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CountersFeature({ feature, items, setItems }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const val = items[todayStr] || 0;
  const target = feature.target || 1;
  const pct = Math.min(100, Math.round((val / target) * 100));
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    week.push({ date: d.toISOString().split('T')[0], v: items[d.toISOString().split('T')[0]] || 0 });
  }
  const maxWeek = Math.max(1, ...week.map(w => w.v));
  const c = FEATURE_COLORS[feature.color] || FEATURE_COLORS.primary;

  const increment = () => {
    setItems({ ...items, [todayStr]: val + 1 });
  };

  const resetToday = () => {
    const next = { ...items };
    delete next[todayStr];
    setItems(next);
  };

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`material-symbols-outlined text-[18px] ${c.text}`}>{feature.icon}</span>
          <div className="min-w-0">
            <h4 className="text-[13px] font-extrabold leading-tight truncate">{feature.title}</h4>
            {feature.desc && <p className="text-[10px] text-on-surface-variant font-medium leading-snug truncate">{feature.desc}</p>}
          </div>
        </div>
        <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${c.bg} ${c.text}`}>
          {feature.counterLabel} target {feature.target}{feature.unit}
        </span>
      </div>

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
          <div className="absolute inset-0 flex items-center justify-center text-[13px] font-extrabold font-mono">{pct}%</div>
        </div>

        <div className="flex-1">
          <div className="text-[22px] font-extrabold font-mono leading-none">
            {val}<span className="text-[10px] text-on-surface-variant font-bold ml-0.5">/ {target} {feature.unit}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={increment}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-white text-[9px] font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[12px]">add</span> Log {feature.counterLabel}
            </button>
            {val > 0 && (
              <button
                onClick={resetToday}
                className="text-[8px] px-2 py-1 rounded-lg bg-surface-container/60 border border-outline/10 text-on-surface-variant hover:text-error transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-end gap-1 h-10">
        {week.map((w, i) => (
          <div key={w.date} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t bg-primary/15 overflow-hidden flex items-end justify-center">
              <div
                className="w-full bg-gradient-to-t from-primary to-secondary rounded-t transition-all duration-500"
                style={{ height: `${(w.v / maxWeek) * 100}%`, minHeight: w.v > 0 ? 4 : 0, opacity: w.v > 0 ? 0.85 : 0.3 }}
              />
            </div>
            <span className={`text-[7px] font-mono ${i === 6 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'][(new Date(w.date).getDay())]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoleFeature({ feature, data, setData }) {
  if (!feature) return null;
  if (feature.type === 'list') return <ListFeature feature={feature} items={data || []} setItems={setData} />;
  if (feature.type === 'kanban') return <KanbanFeature feature={feature} items={data || []} setItems={setData} />;
  if (feature.type === 'counters') return <CountersFeature feature={feature} items={data || {}} setItems={setData} />;
  return null;
}
