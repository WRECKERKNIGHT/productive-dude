import React, { useState } from 'react';

export default function Dashboard({
  tasks,
  setTasks,
  habits,
  setHabits,
  dailyLogs,
  setDailyLogs,
  username = "Alex"
}) {
  const [newLogText, setNewLogText] = useState('');
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskCategory, setQuickTaskCategory] = useState('Personal');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter today's tasks
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const completedTodayTasks = todayTasks.filter(t => t.completed);
  const tasksPct = todayTasks.length > 0 ? Math.round((completedTodayTasks.length / todayTasks.length) * 100) : 0;

  // Filter today's habits progress
  const activeHabits = habits.length;
  const completedHabits = habits.filter(h => (h.progress[todayStr] || 0) >= h.target).length;
  const habitsPct = activeHabits > 0 ? Math.round((completedHabits / activeHabits) * 100) : 0;

  // Next up (today's scheduled tasks in chronological order)
  const nextUpTasks = tasks
    .filter(t => t.date === todayStr && t.dueTime && !t.completed)
    .sort((a, b) => a.dueTime.localeCompare(b.dueTime));

  // --- Task Operations ---
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleQuickTaskAdd = (e) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: quickTaskTitle.trim(),
      category: quickTaskCategory,
      date: todayStr,
      dueTime: '',
      completed: false
    };

    setTasks([...tasks, newTask]);
    setQuickTaskTitle('');
  };

  // Drag and drop reordering
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const todayOrdered = [...todayTasks];
    const [removed] = todayOrdered.splice(draggedIndex, 1);
    todayOrdered.splice(index, 0, removed);

    const otherTasks = tasks.filter(t => t.date !== todayStr);
    setTasks([...otherTasks, ...todayOrdered]);
    setDraggedIndex(null);
  };

  // --- Daily Log Operations ---
  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLogText.trim()) return;

    const currentLogs = dailyLogs[todayStr] || [];
    const updatedLogs = [
      ...currentLogs,
      {
        id: Date.now().toString(),
        text: newLogText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setDailyLogs({
      ...dailyLogs,
      [todayStr]: updatedLogs
    });
    setNewLogText('');
  };

  const deleteLogItem = (logId) => {
    const currentLogs = dailyLogs[todayStr] || [];
    const updatedLogs = currentLogs.filter(l => l.id !== logId);
    setDailyLogs({
      ...dailyLogs,
      [todayStr]: updatedLogs
    });
  };

  // --- Mini Habit Logging ---
  const incrementHabit = (habitId) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const val = h.progress[todayStr] || 0;
        return {
          ...h,
          progress: {
            ...h.progress,
            [todayStr]: Math.min(h.target * 2, val + 1)
          }
        };
      }
      return h;
    }));
  };

  // Date formatting
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const dateHeading = new Date().toLocaleDateString('en-US', options).toUpperCase();

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Date and Greeting */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="font-label-caps text-label-caps text-primary mb-1">{dateHeading}</p>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold">Good Morning, {username}.</h1>
          <p className="text-on-surface-variant font-body-lg">
            You have <span className="font-bold text-primary">{todayTasks.filter(t => !t.completed).length} pending tasks</span> and <span className="font-bold text-secondary">{completedHabits}/{activeHabits} habits</span> completed today.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-surface-container-high dark:bg-surface-container rounded-full px-4 py-2 shimmer-card">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
          <span className="font-label-caps text-label-caps font-bold">FOCUS STATE: ACTIVE</span>
        </div>
      </section>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Today's Focus */}
        <section className="lg:col-span-7 space-y-md">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-md font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">priority_high</span>
              Today's Focus
            </h2>
            <span className="text-[11px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
              {todayTasks.length} TASKS
            </span>
          </div>

          <div className="space-y-sm">
            {todayTasks.length === 0 ? (
              <div className="glass-card p-lg rounded-xl text-center text-on-surface-variant italic">
                All clean. No tasks scheduled for today!
              </div>
            ) : (
              todayTasks.map((task, idx) => {
                let borderTheme = 'border-primary';
                let iconName = 'code';
                if (task.category === 'Health') {
                  borderTheme = 'border-secondary';
                  iconName = 'fitness_center';
                } else if (task.category === 'Work') {
                  borderTheme = 'border-tertiary';
                  iconName = 'work';
                } else if (task.category === 'Academic') {
                  borderTheme = 'border-primary';
                  iconName = 'school';
                }

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, idx)}
                    className={`glass-card p-md rounded-xl border-t-4 ${borderTheme} flex items-center gap-md group cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${task.completed ? 'opacity-60 bg-surface-container/20' : ''}`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-primary border-primary scale-102' : 'border-outline-variant hover:bg-primary/10'}`}
                    >
                      {task.completed && (
                        <span className="material-symbols-outlined text-white text-[16px] font-bold animate-spring-check">check</span>
                      )}
                    </button>
                    
                    <div className={`flex-1 min-w-0 strikeout-line ${task.completed ? 'task-completed' : ''}`}>
                      <h3 className={`font-bold text-body-lg leading-tight truncate transition-colors ${task.completed ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                        {task.title}
                      </h3>
                      <p className="text-on-surface-variant text-[12px] font-medium uppercase tracking-wider">
                        {task.category} {task.dueTime ? `· Due ${task.dueTime}` : ''}
                      </p>
                    </div>

                    <span className="material-symbols-outlined text-outline-variant text-[20px] group-hover:text-primary transition-colors">
                      {iconName}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Task Add Input */}
          <form onSubmit={handleQuickTaskAdd} className="flex gap-2 bg-surface-container/30 p-2 rounded-xl border border-outline/10">
            <input
              type="text"
              placeholder="Quick add task for today..."
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-outline/25 bg-surface text-sm focus:outline-none focus:border-primary"
            />
            <select
              value={quickTaskCategory}
              onChange={(e) => setQuickTaskCategory(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-outline/25 bg-surface text-xs font-bold"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Health">Health</option>
              <option value="Academic">Academic</option>
            </select>
            <button
              type="submit"
              className="px-3 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all"
            >
              ADD
            </button>
          </form>
        </section>

        {/* Momentum (Progress Rings) */}
        <section className="lg:col-span-5 space-y-md">
          <h2 className="text-headline-md font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">analytics</span>
            Daily Momentum
          </h2>
          <div className="glass-card p-md rounded-xl grid grid-cols-2 gap-md h-[300px] items-center shimmer-card">
            
            {/* Task momentum circle */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-surface-container-high dark:text-surface-container" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" stroke-width="8"></circle>
                  <circle
                    className="text-primary progress-ring-circle"
                    cx="50" cy="50" fill="transparent" r="40"
                    stroke="currentColor" stroke-width="8"
                    stroke-dasharray="251.2"
                    stroke-dashoffset={251.2 - (251.2 * tasksPct) / 100}
                    stroke-linecap="round"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-headline-md font-bold text-primary transition-all duration-300">{tasksPct}%</span>
                </div>
              </div>
              <p className="font-label-caps text-label-caps font-bold text-on-surface-variant">TASKS DONE</p>
            </div>

            {/* Habit momentum circle */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-surface-container-high dark:text-surface-container" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" stroke-width="8"></circle>
                  <circle
                    className="text-secondary progress-ring-circle"
                    cx="50" cy="50" fill="transparent" r="40"
                    stroke="currentColor" stroke-width="8"
                    stroke-dasharray="251.2"
                    stroke-dashoffset={251.2 - (251.2 * habitsPct) / 100}
                    stroke-linecap="round"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-headline-md font-bold text-secondary transition-all duration-300">{habitsPct}%</span>
                </div>
              </div>
              <p className="font-label-caps text-label-caps font-bold text-on-surface-variant">HABITS DONE</p>
            </div>

            {/* Overall stats bar */}
            <div className="col-span-2 pt-2 border-t border-outline/10">
              <div className="w-full bg-surface-container-high dark:bg-surface-container h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.round((tasksPct + habitsPct) / 2)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-[12px] font-bold">
                <span className="text-on-surface-variant font-medium">Daily Energy Yield</span>
                <span className="text-primary transition-all duration-300">
                  {Math.round((tasksPct + habitsPct) / 2) >= 75 ? 'Optimal' : Math.round((tasksPct + habitsPct) / 2) >= 40 ? 'Moderate' : 'Needs Focus'}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Timeline schedule and mini rituals row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Next Up timeline */}
        <section className="lg:col-span-7 space-y-md">
          <h2 className="text-headline-md font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">calendar_month</span>
            Next Up Schedule
          </h2>
          <div className="flex overflow-x-auto gap-md pb-4 scroll-hide">
            {nextUpTasks.length === 0 ? (
              <div className="glass-card p-md rounded-xl text-center text-on-surface-variant italic min-w-full text-sm">
                No scheduled blocks remaining for today. Add times in the Calendar tab!
              </div>
            ) : (
              nextUpTasks.map(t => (
                <div key={t.id} className="min-w-[240px] max-w-[280px] glass-card p-md rounded-xl flex gap-md items-start flex-shrink-0 hover:scale-102 hover:shadow-md transition-all">
                  <div className="flex flex-col items-center">
                    <span className="font-label-caps text-[9px] font-bold text-error">BLOCK</span>
                    <div className="w-1 h-10 bg-primary/20 rounded-full mt-2 relative">
                      <div className="absolute top-0 w-full bg-primary h-1/2 rounded-full"></div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-body-lg leading-tight truncate">{t.title}</h4>
                    <p className="text-on-surface-variant text-xs font-mono mt-1">{t.dueTime}</p>
                    <div className="flex items-center gap-1 mt-2 text-primary font-bold text-[10px]">
                      <span className="material-symbols-outlined text-[14px]">label</span>
                      <span className="uppercase">{t.category}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Habits Quick Ritual Checkin */}
        <section className="lg:col-span-5 space-y-md">
          <h2 className="text-headline-md font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">check_circle</span>
            Habit Quick Log
          </h2>
          <div className="grid grid-cols-2 gap-sm">
            {habits.length === 0 ? (
              <div className="col-span-2 glass-card p-md text-center text-on-surface-variant italic text-sm">
                No habits configured. Create habits on the Habits tab!
              </div>
            ) : (
              habits.slice(0, 4).map(habit => {
                const val = habit.progress[todayStr] || 0;
                const isDone = val >= habit.target;

                let btnBg = 'bg-surface-container/50 hover:bg-surface-container-high/60 hover:scale-102';
                let iconColor = 'text-on-surface-variant';
                
                if (isDone) {
                  btnBg = habit.color === 'primary' ? 'bg-primary/10 border-primary/30 hover:bg-primary/15' : habit.color === 'secondary' ? 'bg-secondary/10 border-secondary/30 hover:bg-secondary/15' : 'bg-tertiary/10 border-tertiary/30 hover:bg-tertiary/15';
                  iconColor = habit.color === 'primary' ? 'text-primary' : habit.color === 'secondary' ? 'text-secondary' : 'text-tertiary';
                }

                return (
                  <button
                    key={habit.id}
                    onClick={() => incrementHabit(habit.id)}
                    className={`glass-card p-sm rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 border-2 border-transparent ${btnBg}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDone ? 'bg-surface' : 'bg-surface-container'} shadow-sm`}>
                      <span className={`material-symbols-outlined text-[18px] ${iconColor}`} style={{ fontVariationSettings: `\'FILL\' ${isDone ? 1 : 0}` }}>
                        {habit.icon}
                      </span>
                    </div>
                    <span className="font-label-caps text-[9px] font-bold text-on-surface-variant uppercase truncate max-w-full">{habit.name}</span>
                    <span className="text-[11px] font-bold text-on-surface">{val} / {habit.target} {habit.unit}</span>
                  </button>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Daily Logs Section */}
      <section className="space-y-md">
        <h2 className="text-headline-md font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">rate_review</span>
          Daily Log / Accomplishments Diary
        </h2>

        <div className="glass-card rounded-2xl p-md space-y-md">
          {/* Add Daily log item form */}
          <form onSubmit={handleAddLog} className="flex gap-2">
            <input
              type="text"
              placeholder="What did you accomplish today? (e.g. Worked on biology slides, finished coding login screen)..."
              value={newLogText}
              onChange={(e) => setNewLogText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-outline/30 bg-surface/50 text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">draw</span>
              LOG IT
            </button>
          </form>

          {/* List of today's logged items */}
          <div className="space-y-sm max-h-[220px] overflow-y-auto pr-1 scroll-hide">
            {(dailyLogs[todayStr] || []).length === 0 ? (
              <p className="text-center text-on-surface-variant italic text-sm py-4">
                No logs recorded for today. Keep a journal of your work above!
              </p>
            ) : (
              (dailyLogs[todayStr] || []).map(log => (
                <div key={log.id} className="p-3 bg-surface-container/60 dark:bg-surface-container-high/15 rounded-xl flex items-center justify-between group animate-fade-in hover:translate-x-0.5 transition-transform duration-250">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-medium text-on-surface leading-snug">{log.text}</p>
                    <span className="text-[10px] font-mono text-on-surface-variant font-bold">{log.time}</span>
                  </div>
                  <button
                    onClick={() => deleteLogItem(log.id)}
                    className="p-1 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
