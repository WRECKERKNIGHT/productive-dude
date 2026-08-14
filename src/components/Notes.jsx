import React, { useState } from 'react';
import { getRole } from '../roles';

export default function Notes({ roleNotes, setRoleNotes, profile }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [color, setColor] = useState('#fbbf24');
  const [pinned, setPinned] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewRole, setViewRole] = useState('all');

  const COLORS = ['#fbbf24', '#fb923c', '#34d399', '#38bdf8', '#a78bfa', '#f472b6'];

  const saveNote = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (editingId) {
      setRoleNotes(roleNotes.map(n => n.id === editingId ? { ...n, title: title.trim(), body, color, pinned } : n));
      setEditingId(null);
    } else {
      const roleId = viewRole === 'all' ? profile.primaryRole : viewRole;
      setRoleNotes([{ id: `note-${Date.now()}`, title: title.trim(), body, color, pinned, roleId, createdAt: Date.now() }, ...roleNotes]);
    }
    setTitle(''); setBody(''); setPinned(false); setColor('#fbbf24');
  };

  const startEdit = (n) => {
    setEditingId(n.id);
    setTitle(n.title);
    setBody(n.body || '');
    setColor(n.color);
    setPinned(!!n.pinned);
  };

  const deleteNote = (id) => {
    setRoleNotes(roleNotes.filter(n => n.id !== id));
  };

  const togglePin = (id) => {
    setRoleNotes(roleNotes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const filtered = roleNotes
    .filter(n => viewRole === 'all' ? true : n.roleId === viewRole)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (b.createdAt || 0) - (a.createdAt || 0));

  const roles = [profile.primaryRole, ...(profile.secondaryRoles || [])].filter(Boolean);

  return (
    <div className="h-full flex flex-col space-y-md animate-fade-in text-left">
      <div>
        <p className="font-label-caps text-label-caps text-primary mb-1">THOUGHT CAPTURE</p>
        <h2 className="text-headline-md font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">sticky_note_2</span>
          Notes
        </h2>
        <p className="text-on-surface-variant text-[13px]">Pin ideas, meeting notes, and quick thoughts. Tagged to your roles.</p>
      </div>

      {/* Role filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setViewRole('all')}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${viewRole === 'all' ? 'bg-primary text-white border-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
        >
          All Notes
        </button>
        {roles.map(rid => (
          <button
            key={rid}
            onClick={() => setViewRole(rid)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${viewRole === rid ? 'text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
            style={viewRole === rid ? { backgroundColor: getRole(rid).accent, borderColor: getRole(rid).accent } : {}}
          >
            {getRole(rid).emoji} {getRole(rid).name}
          </button>
        ))}
      </div>

      {/* New note form */}
      <form onSubmit={saveNote} className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider">{editingId ? 'Edit note' : 'New note'}</h3>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setTitle(''); setBody(''); setPinned(false); }} className="text-[10px] font-bold text-on-surface-variant hover:text-error">
              Cancel edit
            </button>
          )}
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full px-3 py-2 rounded-xl border border-outline/25 bg-surface/50 text-[13px] font-bold focus:outline-none focus:border-primary"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write something down..."
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-outline/25 bg-surface/50 text-[12px] focus:outline-none focus:border-primary resize-none"
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-all active:scale-90 ${color === c ? 'ring-2 ring-offset-2 ring-on-surface scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant cursor-pointer">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="w-3.5 h-3.5 accent-primary" />
            Pin to top
          </label>
          <button
            type="submit"
            className="ml-auto px-4 py-2 rounded-xl bg-primary text-white text-[11px] font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">{editingId ? 'save' : 'add'}</span>
            {editingId ? 'SAVE' : 'ADD NOTE'}
          </button>
        </div>
      </form>

      {/* Notes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-h-0 overflow-y-auto scroll-hide pb-1">
        {filtered.length === 0 ? (
          <div className="col-span-full glass-card p-lg text-center text-on-surface-variant italic text-[12px]">
            No notes yet. Capture your first one above.
          </div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              className={`rounded-2xl p-4 border transition-all hover:-translate-y-0.5 hover:shadow-md group ${n.pinned ? 'ring-2' : ''}`}
              style={{ backgroundColor: `${n.color}1a`, borderColor: `${n.color}55`, ['--tw-ring-color' ]: n.color }}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-[13px] font-extrabold leading-snug">{n.title}</h4>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => togglePin(n.id)} className={`p-1 rounded hover:bg-surface-container transition-colors ${n.pinned ? 'text-primary' : 'text-on-surface-variant'}`} title="Pin">
                    <span className="material-symbols-outlined text-[15px]">push_pin</span>
                  </button>
                  <button onClick={() => startEdit(n)} className="p-1 rounded hover:bg-surface-container text-on-surface-variant transition-colors" title="Edit">
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                  </button>
                  <button onClick={() => deleteNote(n.id)} className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors" title="Delete">
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </div>
              </div>
              {n.body && <p className="text-[11px] font-medium text-on-surface-variant mt-1.5 leading-relaxed whitespace-pre-wrap">{n.body}</p>}
              {n.roleId && (
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="text-[13px]">{getRole(n.roleId).emoji}</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-on-surface-variant">{getRole(n.roleId).name}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
