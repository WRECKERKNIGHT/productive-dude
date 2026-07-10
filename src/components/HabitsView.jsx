import React, { useState } from 'react';

export default function HabitsView({
  habits,
  setHabits,
  routines,
  setRoutines
}) {
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitIcon, setHabitIcon] = useState('water_drop');
  const [habitColor, setHabitColor] = useState('primary');
  const [habitTarget, setHabitTarget] = useState('1');
  const [habitUnit, setHabitUnit] = useState('times');

  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [activeRoutineIdForNewItem, setActiveRoutineIdForNewItem] = useState(null);
  const [newRoutineItemText, setNewRoutineItemText] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Last 7 days helper
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString([], { weekday: 'narrow' }),
        dayNum: d.getDate()
      });
    }
    return dates;
  };
  const last7Days = getLast7Days();

  // Habit operations
  const handleCreateHabit = (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    const newHabit = {
      id: Date.now().toString(),
      name: habitName.trim(),
      icon: habitIcon,
      color: habitColor, // primary, secondary, tertiary
      target: parseFloat(habitTarget) || 1,
      unit: habitUnit,
      progress: {
        [todayStr]: 0
      }
    };

    setHabits([...habits, newHabit]);
    setShowHabitModal(false);
    setHabitName('');
    setHabitIcon('water_drop');
    setHabitColor('primary');
    setHabitTarget('1');
    setHabitUnit('times');
  };

  const updateHabitValue = (habitId, dateStr, increment) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const currentVal = habit.progress[dateStr] || 0;
        const newVal = Math.max(0, currentVal + (increment ? 1 : -1));
        return {
          ...habit,
          progress: {
            ...habit.progress,
            [dateStr]: newVal
          }
        };
      }
      return habit;
    }));
  };

  const toggleHabitCompleteDay = (habitId, dateStr) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const currentVal = habit.progress[dateStr] || 0;
        const newVal = currentVal >= habit.target ? 0 : habit.target;
        return {
          ...habit,
          progress: {
            ...habit.progress,
            [dateStr]: newVal
          }
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId) => {
    if (confirm('Delete this habit?')) {
      setHabits(habits.filter(h => h.id !== habitId));
    }
  };

  // Routine operations
  const createRoutine = (e) => {
    e.preventDefault();
    if (!newRoutineTitle.trim()) return;

    const newRoutine = {
      id: Date.now().toString(),
      title: newRoutineTitle.trim(),
      items: []
    };

    setRoutines([...routines, newRoutine]);
    setNewRoutineTitle('');
  };

  const addRoutineItem = (routineId) => {
    if (!newRoutineItemText.trim()) return;

    setRoutines(routines.map(r => {
      if (r.id === routineId) {
        return {
          ...r,
          items: [
            ...r.items,
            { id: Date.now().toString(), text: newRoutineItemText.trim(), completed: false }
          ]
        };
      }
      return r;
    }));

    setNewRoutineItemText('');
    setActiveRoutineIdForNewItem(null);
  };

  const toggleRoutineItem = (routineId, itemId) => {
    setRoutines(routines.map(r => {
      if (r.id === routineId) {
        return {
          ...r,
          items: r.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return r;
    }));
  };

  const resetRoutine = (routineId) => {
    setRoutines(routines.map(r => {
      if (r.id === routineId) {
        return {
          ...r,
          items: r.items.map(item => ({ ...item, completed: false }))
        };
      }
      return r;
    }));
  };

  const deleteRoutine = (routineId) => {
    if (confirm('Delete this routine checklist?')) {
      setRoutines(routines.filter(r => r.id !== routineId));
    }
  };

  const deleteRoutineItem = (routineId, itemId) => {
    setRoutines(routines.map(r => {
      if (r.id === routineId) {
        return {
          ...r,
          items: r.items.filter(item => item.id !== itemId)
        };
      }
      return r;
    }));
  };

  const availableIcons = [
    'water_drop', 'self_improvement', 'book', 'lightbulb',
    'fitness_center', 'code', 'bedtime', 'run_circle',
    'breakfast_dining', 'cleaning_services', 'eco'
  ];

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-headline-lg font-bold text-primary">Daily Rituals & Routines</h2>
          <p className="text-on-surface-variant text-body-lg">
            Build consistency through positive habits and repeatable checklists.
          </p>
        </div>
        <button
          onClick={() => setShowHabitModal(true)}
          className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20"
        >
          <span className="material-symbols-outlined">add</span>
          NEW HABIT
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Habits list - Left (Col span 7) */}
        <div className="lg:col-span-7 space-y-md">
          <h3 className="text-headline-md font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">check_circle</span>
            Habit Trackers
          </h3>

          <div className="space-y-md">
            {habits.length === 0 ? (
              <div className="glass-card p-lg text-center rounded-2xl italic text-on-surface-variant">
                No habits configured yet. Set up one above!
              </div>
            ) : (
              habits.map(habit => {
                const todayProgress = habit.progress[todayStr] || 0;
                const isCompletedToday = todayProgress >= habit.target;
                const pct = Math.min(100, Math.round((todayProgress / habit.target) * 100));

                let colorClass = 'text-primary';
                let bgClass = 'bg-primary-container/20';
                let strokeColor = 'var(--primary)';
                if (habit.color === 'secondary') {
                  colorClass = 'text-secondary';
                  bgClass = 'bg-secondary-container/20';
                  strokeColor = 'var(--secondary)';
                } else if (habit.color === 'tertiary') {
                  colorClass = 'text-tertiary';
                  bgClass = 'bg-tertiary-container/20';
                  strokeColor = 'var(--tertiary)';
                }

                return (
                  <div key={habit.id} className="glass-card p-md rounded-2xl flex flex-col sm:flex-row items-center gap-md relative group hover:shadow-md transition-all">
                    {/* Circle Indicator */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-surface-container-high dark:text-surface-container" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" stroke-width="8"></circle>
                        <circle
                          className="progress-ring-circle"
                          cx="50"
                          cy="50"
                          fill="transparent"
                          r="40"
                          stroke={strokeColor}
                          stroke-width="8"
                          stroke-dasharray="251.2"
                          stroke-dashoffset={251.2 - (251.2 * pct) / 100}
                          stroke-linecap="round"
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`material-symbols-outlined !text-3xl ${colorClass}`} style={{ fontVariationSettings: `\'FILL\' ${isCompletedToday ? 1 : 0}` }}>
                          {habit.icon}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <h4 className="font-bold text-body-lg text-on-surface truncate">{habit.name}</h4>
                      <p className="text-[13px] text-on-surface-variant font-medium">
                        Target: {habit.target} {habit.unit} · Current: <span className="font-bold">{todayProgress}</span>
                      </p>

                      {/* Manual Increments */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                        <button
                          onClick={() => updateHabitValue(habit.id, todayStr, false)}
                          className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <button
                          onClick={() => updateHabitValue(habit.id, todayStr, true)}
                          className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>
                    </div>

                    {/* Weekly grid check in */}
                    <div className="flex gap-2 bg-surface-container/50 dark:bg-surface-container-high/20 px-3 py-2 rounded-xl">
                      {last7Days.map(day => {
                        const dayProgress = habit.progress[day.dateStr] || 0;
                        const isDayDone = dayProgress >= habit.target;
                        const isToday = day.dateStr === todayStr;

                        let ringBorder = 'border-transparent';
                        if (isToday) ringBorder = 'ring-2 ring-primary ring-offset-2 dark:ring-offset-surface';

                        let circleBg = 'bg-surface-container-high';
                        let checkColor = 'text-outline-variant';
                        if (isDayDone) {
                          circleBg = habit.color === 'primary' ? 'bg-primary' : habit.color === 'secondary' ? 'bg-secondary' : 'bg-tertiary';
                          checkColor = 'text-white';
                        }

                        return (
                          <button
                            key={day.dateStr}
                            onClick={() => toggleHabitCompleteDay(habit.id, day.dateStr)}
                            className={`flex flex-col items-center gap-1 ${ringBorder} p-1 rounded-lg hover:bg-surface-container-high/50 active:scale-95 transition-all`}
                          >
                            <span className="text-[10px] font-bold text-on-surface-variant">{day.dayName}</span>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${circleBg} transition-all`}>
                              <span className={`material-symbols-outlined text-[14px] ${checkColor}`} style={{ fontVariationSettings: "\'FILL\' 1, \'wght\' 700" }}>
                                check
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-on-surface-variant">{day.dayNum}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Delete button (visible on hover) */}
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="absolute top-2 right-2 p-1 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Routines & Checklists - Right (Col span 5) */}
        <div className="lg:col-span-5 space-y-md">
          <h3 className="text-headline-md font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">checklist</span>
            Routine Checklists
          </h3>

          {/* New Routine creation form */}
          <form onSubmit={createRoutine} className="flex gap-2">
            <input
              type="text"
              placeholder="Create new routine (e.g. Sunday Reset)..."
              value={newRoutineTitle}
              onChange={(e) => setNewRoutineTitle(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-outline/30 bg-surface/50 focus:outline-none focus:border-primary text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-tertiary text-white font-bold rounded-xl text-sm flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
            >
              CREATE
            </button>
          </form>

          {/* Routine list */}
          <div className="space-y-md">
            {routines.length === 0 ? (
              <div className="glass-card p-md text-center rounded-2xl italic text-on-surface-variant text-sm">
                No routines configured. Create one above!
              </div>
            ) : (
              routines.map(routine => {
                const completedCount = routine.items.filter(item => item.completed).length;
                const totalCount = routine.items.length;
                const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                return (
                  <div key={routine.id} className="glass-card p-md rounded-2xl space-y-sm">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-body-lg text-on-surface">{routine.title}</h4>
                        <span className="text-[11px] font-bold text-on-surface-variant">
                          {completedCount} / {totalCount} Completed ({progressPct}%)
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => resetRoutine(routine.id)}
                          title="Reset checklist"
                          className="p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                        </button>
                        <button
                          onClick={() => deleteRoutine(routine.id)}
                          title="Delete routine"
                          className="p-1 text-on-surface-variant hover:text-error rounded hover:bg-surface-container active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {totalCount > 0 && (
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-tertiary rounded-full transition-all duration-350" style={{ width: `${progressPct}%` }}></div>
                      </div>
                    )}

                    {/* Items checklist */}
                    <div className="space-y-1.5 pt-1">
                      {routine.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between group/item">
                          <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleRoutineItem(routine.id, item.id)}
                              className="rounded border-outline/30 text-tertiary focus:ring-tertiary/20"
                            />
                            <span className={`text-[14px] font-medium transition-colors ${item.completed ? 'line-through text-on-surface-variant opacity-60' : 'text-on-surface'}`}>
                              {item.text}
                            </span>
                          </label>
                          <button
                            onClick={() => deleteRoutineItem(routine.id, item.id)}
                            className="p-1 text-outline-variant hover:text-error opacity-0 group-hover/item:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Item form */}
                    {activeRoutineIdForNewItem === routine.id ? (
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Type checklist task..."
                          value={newRoutineItemText}
                          onChange={(e) => setNewRoutineItemText(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-outline/30 bg-surface/50 text-sm focus:outline-none focus:border-tertiary"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addRoutineItem(routine.id);
                          }}
                        />
                        <button
                          onClick={() => addRoutineItem(routine.id)}
                          className="px-3 bg-tertiary text-white font-bold rounded-lg text-xs"
                        >
                          ADD
                        </button>
                        <button
                          onClick={() => setActiveRoutineIdForNewItem(null)}
                          className="px-2 text-on-surface-variant hover:text-on-surface text-xs"
                        >
                          CLOSE
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveRoutineIdForNewItem(routine.id);
                          setNewRoutineItemText('');
                        }}
                        className="w-full py-1.5 border border-dashed border-outline-variant hover:border-tertiary text-center rounded-lg text-xs font-bold text-on-surface-variant hover:text-tertiary transition-colors flex items-center justify-center gap-1 mt-2"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        ADD CHECKLIST ITEM
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Habit Creator Modal */}
      {showHabitModal && (
        <div className="fixed inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-fade-in">
          <div className="glass-card w-full max-w-md rounded-2xl p-lg space-y-md shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Create Custom Habit
              </h3>
              <button
                onClick={() => setShowHabitModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-sm">
              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-1">HABIT NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Drink Water, Study React..."
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-primary text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-[12px] font-bold text-on-surface-variant block mb-1">DAILY TARGET</label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    value={habitTarget}
                    onChange={(e) => setHabitTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-primary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-on-surface-variant block mb-1">UNIT</label>
                  <input
                    type="text"
                    placeholder="e.g. L, mins, pages"
                    value={habitUnit}
                    onChange={(e) => setHabitUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-primary text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-2">THEME COLOR</label>
                <div className="flex gap-4">
                  {['primary', 'secondary', 'tertiary'].map(color => (
                    <label key={color} className="flex items-center gap-2 cursor-pointer capitalize text-sm">
                      <input
                        type="radio"
                        name="habit-color"
                        value={color}
                        checked={habitColor === color}
                        onChange={() => setHabitColor(color)}
                        className={`text-${color} focus:ring-0`}
                      />
                      {color === 'primary' ? 'Blue' : color === 'secondary' ? 'Green' : 'Purple'}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-2">ICON</label>
                <div className="grid grid-cols-6 gap-2 max-h-24 overflow-y-auto p-1 bg-surface-container rounded-lg">
                  {availableIcons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setHabitIcon(icon)}
                      className={`p-2 rounded-lg flex items-center justify-center hover:bg-surface-container-high transition-colors ${habitIcon === icon ? 'bg-primary text-white hover:bg-primary' : 'text-on-surface-variant'}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHabitModal(false)}
                  className="px-4 py-2 font-bold text-on-surface bg-surface-container hover:bg-surface-container-high rounded-xl text-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-on-primary bg-primary hover:opacity-90 rounded-xl text-sm shadow-md shadow-primary/20"
                >
                  CREATE HABIT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
