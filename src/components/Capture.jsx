import React, { useState } from 'react';

export default function Capture({
  captureInbox,
  setCaptureInbox,
  brainDump,
  setBrainDump,
  addTask
}) {
  const [quickInput, setQuickInput] = useState('');
  const [activeSortItem, setActiveSortItem] = useState(null);
  const [sortTitle, setSortTitle] = useState('');
  const [sortCategory, setSortCategory] = useState('Personal');
  const [sortDate, setSortDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortTime, setSortTime] = useState('12:00');

  const handleCapture = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      text: quickInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
    };
    setCaptureInbox([newItem, ...captureInbox]);
    setQuickInput('');
  };

  const deleteInboxItem = (id) => {
    setCaptureInbox(captureInbox.filter(item => item.id !== id));
  };

  const startSort = (item) => {
    setActiveSortItem(item);
    setSortTitle(item.text);
  };

  const saveSortedItem = () => {
    if (!sortTitle.trim()) return;
    addTask({
      title: sortTitle,
      category: sortCategory,
      date: sortDate,
      dueTime: sortTime,
      completed: false
    });
    deleteInboxItem(activeSortItem.id);
    setActiveSortItem(null);
  };

  return (
    <div className="space-y-lg animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Quick Capture Inbox */}
        <div className="lg:col-span-5 space-y-md">
          <div>
            <h2 className="text-headline-md font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">bolt</span>
              Quick Capture Inbox
            </h2>
            <p className="text-on-surface-variant text-[14px]">
              Frictionless, one-click inbox to dump thoughts immediately. Sort them into tasks later.
            </p>
          </div>

          {/* Dump Input Box */}
          <form onSubmit={handleCapture} className="flex gap-2">
            <input
              type="text"
              placeholder="Dump a thought, reminder, or task..."
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-outline/30 bg-surface/50 dark:bg-surface-container/30 focus:outline-none focus:border-primary text-body-md"
            />
            <button
              type="submit"
              className="px-5 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </form>

          {/* Inbox items */}
          <div className="space-y-sm max-h-[480px] overflow-y-auto pr-1 scroll-hide">
            {captureInbox.length === 0 ? (
              <div className="glass-card p-lg text-center rounded-xl text-on-surface-variant italic">
                <span className="material-symbols-outlined !text-4xl text-outline-variant block mb-2">inbox</span>
                Inbox is clean. Capture thoughts above!
              </div>
            ) : (
              captureInbox.map(item => (
                <div key={item.id} className="glass-card p-md rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:shadow-md transition-all">
                  <div className="flex-1">
                    <p className="text-body-md text-on-surface font-medium leading-relaxed">{item.text}</p>
                    <span className="text-[11px] text-on-surface-variant font-mono">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startSort(item)}
                      className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold text-primary bg-primary/10 hover:bg-primary/25 rounded-lg active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">drive_file_move</span>
                      SORT
                    </button>
                    <button
                      onClick={() => deleteInboxItem(item.id)}
                      className="p-1.5 text-error bg-error/10 hover:bg-error/20 rounded-lg active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Brain Dump / Scratchpad */}
        <div className="lg:col-span-7 space-y-md">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-headline-md font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">edit_note</span>
                Brain Dump / Scratchpad
              </h2>
              <p className="text-on-surface-variant text-[14px]">
                Completely unstructured digital notepad for rough drafts, messy ideas, or formatting.
              </p>
            </div>
            <span className="text-[11px] bg-secondary-container/20 text-secondary px-2.5 py-1 rounded-full font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              AUTO-SAVED
            </span>
          </div>

          <div className="glass-card rounded-2xl p-md h-[495px] flex flex-col">
            <textarea
              className="flex-1 w-full bg-transparent text-on-surface font-mono text-[14px] leading-relaxed resize-none focus:outline-none p-2 border-0 focus:ring-0 focus:ring-offset-0"
              placeholder="// Start writing everything on your mind here...
// No organization, just raw text.
// Bullet points, copy-pasted details, scratch ideas."
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sort Modal */}
      {activeSortItem && (
        <div className="fixed inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="glass-card w-full max-w-md rounded-2xl p-lg space-y-md animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">drive_file_move</span>
                Sort Inbox Item
              </h3>
              <button
                onClick={() => setActiveSortItem(null)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-sm">
              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-1">TASK TITLE</label>
                <input
                  type="text"
                  value={sortTitle}
                  onChange={(e) => setSortTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-primary text-body-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-[12px] font-bold text-on-surface-variant block mb-1">CATEGORY</label>
                  <select
                    value={sortCategory}
                    onChange={(e) => setSortCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-primary text-body-md"
                  >
                    <option value="Work">Work</option>
                    <option value="Health">Health</option>
                    <option value="Personal">Personal</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>

                <div>
                  <label className="text-[12px] font-bold text-on-surface-variant block mb-1">DUE DATE</label>
                  <input
                    type="date"
                    value={sortDate}
                    onChange={(e) => setSortDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-primary text-body-md"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-1">DUE TIME</label>
                <input
                  type="time"
                  value={sortTime}
                  onChange={(e) => setSortTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-primary text-body-md"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveSortItem(null)}
                className="px-4 py-2 font-bold text-on-surface bg-surface-container hover:bg-surface-container-high rounded-xl active:scale-95 transition-all text-sm"
              >
                CANCEL
              </button>
              <button
                onClick={saveSortedItem}
                className="px-4 py-2 font-bold text-on-primary bg-primary hover:opacity-90 rounded-xl active:scale-95 transition-all text-sm shadow-md shadow-primary/20"
              >
                CREATE TASK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
