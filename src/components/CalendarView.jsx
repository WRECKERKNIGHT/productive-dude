import React, { useState } from 'react';

export default function CalendarView({
  tasks,
  setTasks
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // --- Calendar Date Helpers ---
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff);
    return d;
  };

  const getWeekDays = (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = getWeekDays(startOfWeek);

  const hours = Array.from({ length: 15 }, (_, i) => {
    const h = i + 7; // 7 AM to 9 PM
    const displayHour = h > 12 ? `${h - 12} PM` : h === 12 ? '12 PM' : `${h} AM`;
    const formatHour = `${h.toString().padStart(2, '0')}:00`;
    return { displayHour, formatHour };
  });

  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // --- Drag and Drop Logic ---
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, dateStr, timeSlotStr) => {
    e.preventDefault();
    setDragOverSlot(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          date: dateStr,
          dueTime: timeSlotStr
        };
      }
      return task;
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const unscheduleTask = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          dueTime: '' // Clear slot
        };
      }
      return task;
    }));
  };

  // --- Monthly View Helpers ---
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < offset; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthDays = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const nextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(next);
  };

  const prevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(prev);
  };

  // --- Tasks Filters ---
  const unscheduledTasks = tasks.filter(t => !t.completed && !t.dueTime);

  const getTaskForSlot = (dateStr, hourStr) => {
    return tasks.find(t => t.date === dateStr && t.dueTime && t.dueTime.startsWith(hourStr.substring(0, 2)));
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Calendar Controls */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-headline-lg font-bold text-primary">Time-Blocking Calendar</h2>
          <p className="text-on-surface-variant text-body-lg">
            Drag and drop tasks into specific hourly slots to manage your day.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="flex bg-surface-container rounded-xl p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'week' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              WEEKLY
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'month' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              MONTHLY
            </button>
          </div>

          <div className="flex gap-1">
            <button
              onClick={viewMode === 'week' ? prevWeek : prevMonth}
              className="p-2 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              onClick={goToToday}
              className="px-3 bg-surface-container hover:bg-surface-container-high text-xs font-bold rounded-xl active:scale-95 transition-all"
            >
              TODAY
            </button>
            <button
              onClick={viewMode === 'week' ? nextWeek : nextMonth}
              className="p-2 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Unscheduled Sidebar & Mini month (Left - Col span 3) */}
        <aside className="lg:col-span-3 space-y-md">
          <div className="flex items-center justify-between">
            <h3 className="text-headline-md font-bold text-on-surface leading-tight text-md">
              Unscheduled Tasks
            </h3>
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
              {unscheduledTasks.length} PENDING
            </span>
          </div>

          {/* Draggable Task List */}
          <div className="glass-card rounded-2xl p-md space-y-sm max-h-[460px] overflow-y-auto scroll-hide">
            {unscheduledTasks.length === 0 ? (
              <p className="text-center text-on-surface-variant italic text-xs py-6">
                No unscheduled tasks. Create tasks on the Dashboard or Capture page!
              </p>
            ) : (
              unscheduledTasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="p-3 bg-surface-container/60 dark:bg-surface-container-high/10 hover:bg-surface-container-high/40 rounded-xl border-l-4 border-primary flex items-center justify-between cursor-grab active:cursor-grabbing hover:translate-x-1 transition-all duration-200 group"
                >
                  <div className="min-w-0 pr-1">
                    <p className="font-bold text-xs text-on-surface truncate">{task.title}</p>
                    <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">{task.category}</span>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant text-[16px] group-hover:text-primary transition-colors">
                    drag_indicator
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Quick Helper Alert */}
          <div className="p-3 bg-primary-container/10 border border-primary/15 rounded-xl text-[11px] text-primary leading-normal flex items-start gap-2 shimmer-card">
            <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">info</span>
            <span>Drag a task from the list and drop it onto any slot in the 7-day schedule to block out time.</span>
          </div>
        </aside>

        {/* Calendar Timetable / Month grid (Right - Col span 9) */}
        <section className="lg:col-span-9">
          {viewMode === 'week' ? (
            /* Time blocking 7-day week schedule */
            <div className="glass-card rounded-2xl p-md overflow-x-auto scroll-hide hover:transform-none">
              <div className="min-w-[700px]">
                {/* Header Days of Week */}
                <div className="grid grid-cols-8 border-b border-outline/10 pb-2 mb-2 text-center items-center">
                  <div className="font-label-caps text-[10px] text-on-surface-variant font-bold">TIME</div>
                  {weekDays.map(day => {
                    const dateStr = day.toISOString().split('T')[0];
                    const isToday = dateStr === todayStr;

                    return (
                      <div key={dateStr} className={`py-1 rounded-lg ${isToday ? 'bg-primary/15 text-primary' : ''}`}>
                        <div className="text-[10px] font-bold text-on-surface-variant">
                          {day.toLocaleDateString([], { weekday: 'short' }).toUpperCase()}
                        </div>
                        <div className="text-[16px] font-extrabold">
                          {day.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Timetable Rows */}
                <div className="space-y-0.5 max-h-[500px] overflow-y-auto pr-1">
                  {hours.map(h => (
                    <div key={h.formatHour} className="grid grid-cols-8 items-center min-h-[50px]">
                      {/* Hour labels */}
                      <div className="text-right pr-3 font-mono text-[10px] text-on-surface-variant font-bold self-start pt-1.5">
                        {h.displayHour}
                      </div>

                      {/* Day Cells */}
                      {weekDays.map(day => {
                        const dateStr = day.toISOString().split('T')[0];
                        const scheduledTask = getTaskForSlot(dateStr, h.formatHour);
                        const isSlotOver = dragOverSlot === `${dateStr}-${h.formatHour}`;

                        return (
                          <div
                            key={`${dateStr}-${h.formatHour}`}
                            onDragOver={handleDragOver}
                            onDragEnter={() => setDragOverSlot(`${dateStr}-${h.formatHour}`)}
                            onDragLeave={() => setDragOverSlot(null)}
                            onDrop={(e) => handleDrop(e, dateStr, h.formatHour)}
                            className={`border-l border-b border-dashed border-outline/15 min-h-[46px] p-0.5 transition-all flex items-stretch ${isSlotOver ? 'drag-over-cell' : 'hover:bg-surface-container/30'}`}
                          >
                            {scheduledTask ? (
                              <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, scheduledTask.id)}
                                className="w-full bg-primary text-on-primary p-1.5 rounded-lg text-[11px] leading-snug flex flex-col justify-between hover:opacity-95 hover:scale-[1.01] active:scale-95 cursor-grab active:cursor-grabbing relative group shadow-sm transition-all"
                              >
                                <div className="min-w-0 pr-3 font-bold truncate">
                                  {scheduledTask.title}
                                </div>
                                <div className="flex justify-between items-center text-[9px] font-bold opacity-80 uppercase tracking-wider">
                                  <span>{scheduledTask.category}</span>
                                  <span>{scheduledTask.dueTime}</span>
                                </div>

                                {/* Remove time block */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    unscheduleTask(scheduledTask.id);
                                  }}
                                  className="absolute top-1 right-1 w-3.5 h-3.5 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                >
                                  ×
                                </button>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Month Grid */
            <div className="glass-card rounded-2xl p-md hover:transform-none">
              <div className="text-center font-bold text-body-lg text-primary mb-md font-headline">
                {monthNames[currentDate.getMonth()].toUpperCase()} {currentDate.getFullYear()}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-label-caps text-[10px] text-on-surface-variant font-bold border-b border-outline/10 pb-2 mb-2">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>

              <div className="grid grid-cols-7 gap-2 min-h-[350px]">
                {monthDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="bg-transparent"></div>;

                  const dateStr = day.toISOString().split('T')[0];
                  const dayTasks = tasks.filter(t => t.date === dateStr && !t.completed);
                  const isToday = dateStr === todayStr;

                  return (
                    <div
                      key={dateStr}
                      className={`glass-card p-1.5 rounded-xl flex flex-col justify-between min-h-[68px] border ${isToday ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/15'} bg-surface/30 hover:scale-102 hover:shadow-md transition-all`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${isToday ? 'bg-primary text-on-primary' : 'text-on-surface'}`}>
                          {day.getDate()}
                        </span>
                      </div>

                      {/* Day Tasks Indicator dots/badges */}
                      <div className="space-y-0.5 mt-1 overflow-hidden">
                        {dayTasks.slice(0, 2).map(t => (
                          <div key={t.id} className="text-[9px] px-1 bg-primary-container text-on-primary-container font-semibold rounded truncate leading-tight">
                            {t.dueTime ? `${t.dueTime} ` : ''}{t.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-[8px] text-on-surface-variant font-bold text-center">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
