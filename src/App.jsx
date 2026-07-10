import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import Academic from './components/Academic';
import HabitsView from './components/HabitsView';
import Capture from './components/Capture';
import Settings from './components/Settings';

export default function App() {
  const todayStr = new Date().toISOString().split('T')[0];

  // --- Date offset helper for demo data ---
  const getOffsetDateStr = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  // --- Load Initial State from LocalStorage or Default Slate ---
  const loadState = (key, defaultValue) => {
    const val = localStorage.getItem(key);
    if (val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  // Active state tracks if user has completed the landing page
  const [hasStarted, setHasStarted] = useState(() => loadState('pd_hasStarted', false));
  const [currentTab, setCurrentTab] = useState('home');
  const [username, setUsername] = useState(() => loadState('pd_username', 'User'));
  const [theme, setTheme] = useState(() => loadState('pd_theme', 'focus-blue'));
  const [isDark, setIsDark] = useState(() => loadState('pd_isDark', true)); // Default to sleek dark mode

  // Core Data States - Defaulting to TRUE clean slate (0 data)
  const [tasks, setTasks] = useState(() => loadState('pd_tasks', []));
  const [habits, setHabits] = useState(() => loadState('pd_habits', []));
  const [routines, setRoutines] = useState(() => loadState('pd_routines', []));
  const [subjects, setSubjects] = useState(() => loadState('pd_subjects', []));
  const [exams, setExams] = useState(() => loadState('pd_exams', []));
  const [gpas, setGpas] = useState(() => loadState('pd_gpas', [
    { sem: 'SEM 1', val: 0.00 },
    { sem: 'SEM 2', val: 0.00 },
    { sem: 'SEM 3', val: 0.00 },
    { sem: 'SEM 4', val: 0.00 },
    { sem: 'CURR', val: 0.00 }
  ]));
  const [gradesStats, setGradesStats] = useState(() => loadState('pd_gradesStats', { A: 0, B: 0, C: 0 }));
  const [captureInbox, setCaptureInbox] = useState(() => loadState('pd_captureInbox', []));
  const [brainDump, setBrainDump] = useState(() => {
    const val = localStorage.getItem('pd_brainDump');
    return val !== null ? val : `// Brain Dump Scratchpad\n- Double-click to start drafting...\n- Dump logs, ideas, notes immediately to sort later.`;
  });
  const [dailyLogs, setDailyLogs] = useState(() => loadState('pd_dailyLogs', {}));
  const [notifications, setNotifications] = useState(() => loadState('pd_notifications', [
    { id: 'n1', text: 'Welcome to PRODUCTIVEDUDE! You started with a clean slate. Go to Settings or click Landing page options to import tutorial data.', read: false, time: '12:00 PM' }
  ]));

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [quickAddCategory, setQuickAddCategory] = useState('Personal');
  const [quickAddDate, setQuickAddDate] = useState(todayStr);

  // --- Save states to LocalStorage ---
  useEffect(() => { localStorage.setItem('pd_hasStarted', JSON.stringify(hasStarted)); }, [hasStarted]);
  useEffect(() => { localStorage.setItem('pd_username', JSON.stringify(username)); }, [username]);
  useEffect(() => { localStorage.setItem('pd_theme', JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem('pd_isDark', JSON.stringify(isDark)); }, [isDark]);
  useEffect(() => { localStorage.setItem('pd_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('pd_habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('pd_routines', JSON.stringify(routines)); }, [routines]);
  useEffect(() => { localStorage.setItem('pd_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('pd_exams', JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem('pd_gpas', JSON.stringify(gpas)); }, [gpas]);
  useEffect(() => { localStorage.setItem('pd_gradesStats', JSON.stringify(gradesStats)); }, [gradesStats]);
  useEffect(() => { localStorage.setItem('pd_captureInbox', JSON.stringify(captureInbox)); }, [captureInbox]);
  useEffect(() => { localStorage.setItem('pd_brainDump', brainDump); }, [brainDump]);
  useEffect(() => { localStorage.setItem('pd_dailyLogs', JSON.stringify(dailyLogs)); }, [dailyLogs]);
  useEffect(() => { localStorage.setItem('pd_notifications', JSON.stringify(notifications)); }, [notifications]);

  // Apply visual theme modes to DOM elements
  useEffect(() => {
    document.documentElement.className = '';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
    if (theme && theme !== 'focus-blue') {
      document.documentElement.classList.add(theme);
    }
  }, [theme, isDark]);

  // --- Inject Tutorial Demo Data helper ---
  const loadTutorialDemo = () => {
    setUsername('Alex');
    setTasks([
      { id: 't1', title: 'Finalize Q4 Project Pitch Deck', category: 'Work', dueTime: '14:00', date: todayStr, completed: false },
      { id: 't2', title: 'Cardio HIIT Session at local gym', category: 'Health', dueTime: '17:30', date: todayStr, completed: false },
      { id: 't3', title: 'Configure Node API Gateway endpoints', category: 'Personal', dueTime: '20:00', date: todayStr, completed: false },
      { id: 't4', title: 'Prep for Calculus midterm quiz', category: 'Academic', dueTime: '09:00', date: todayStr, completed: false }
    ]);
    setHabits([
      { id: 'h1', name: 'Hydration Target', icon: 'water_drop', color: 'secondary', target: 3, unit: 'L', progress: { [todayStr]: 0 } },
      { id: 'h2', name: 'Meditation Flow', icon: 'self_improvement', color: 'tertiary', target: 15, unit: 'min', progress: { [todayStr]: 0 } },
      { id: 'h3', name: 'Read Book Pages', icon: 'book', color: 'primary', target: 20, unit: 'pages', progress: { [todayStr]: 0 } }
    ]);
    setRoutines([
      { id: 'r1', title: 'Sunday Workspace Reset', items: [
        { id: 'ri1', text: 'Wipe desk and clean keyboard keys', completed: false },
        { id: 'ri2', text: 'Map out hourly schedule block targets', completed: false },
        { id: 'ri3', text: 'Sync project branches to main branch', completed: false }
      ]},
      { id: 'r2', title: 'Morning Gym Rituals', items: [
        { id: 'ri4', text: 'Prepare pre-workout shakes', completed: false },
        { id: 'ri5', text: 'Pack fresh gear and microfiber towels', completed: false }
      ]}
    ]);
    setSubjects([
      { id: 's1', name: 'Advanced Calculus', code: 'MATH301', status: 'BEHIND', units: [
        { id: 'u1', name: 'Unit 1: Partial Derivative Gradients', completed: false },
        { id: 'u2', name: 'Unit 2: Triple Line Integrals', completed: false },
        { id: 'u3', name: 'Unit 3: Green Theorem Calculus', completed: false }
      ]},
      { id: 's2', name: 'Quantum Electrodynamics', code: 'PHYS202', status: 'BEHIND', units: [
        { id: 'u4', name: 'Unit 1: Dirac Bra-Ket States', completed: false },
        { id: 'u5', name: 'Unit 2: Klein-Gordon Wave Mechanics', completed: false }
      ]}
    ]);
    setExams([
      { id: 'e1', subject: 'Calculus', title: 'Theory Midterm Quiz', date: getOffsetDateStr(3), time: '09:00', location: 'Hall B' },
      { id: 'e2', subject: 'Quantum Physics', title: 'Written final paper exam', date: getOffsetDateStr(7), time: '14:00', location: 'Hall C' }
    ]);
    setGpas([
      { sem: 'SEM 1', val: 3.85 },
      { sem: 'SEM 2', val: 3.90 },
      { sem: 'SEM 3', val: 0.00 },
      { sem: 'SEM 4', val: 0.00 },
      { sem: 'CURR', val: 3.87 }
    ]);
    setGradesStats({ A: 12, B: 4, C: 0 });
    setCaptureInbox([
      { id: 'ci1', text: 'Call orthopedic dentist for checkup appointment slot', timestamp: '10:30 AM · Today' },
      { id: 'ci2', text: 'Purchase heavy duty wall hanging double tape rollers', timestamp: '11:15 AM · Today' }
    ]);
    setDailyLogs({
      [todayStr]: [
        { id: 'l1', text: 'Reviewed initial code architecture layout', time: '09:30 AM' }
      ]
    });
    setNotifications([
      { id: 'n-demo', text: 'Tutorial data successfully loaded! Complete tasks, log habits, and track units to explore.', read: false, time: 'Now' }
    ]);
  };

  // Triggered when entering landing page
  const handleLaunchStart = (shouldLoadDemo) => {
    if (shouldLoadDemo) {
      loadTutorialDemo();
    }
    setHasStarted(true);
  };

  // --- Smart Notification checker ---
  useEffect(() => {
    if (!hasStarted) return;
    const checkUpcomingAlerts = () => {
      const now = new Date();
      const currentAlerts = [...notifications];
      let updated = false;

      exams.forEach(ex => {
        const exDate = new Date(`${ex.date}T${ex.time || '09:00'}`);
        const diffDays = Math.ceil((exDate - now) / (1000 * 60 * 60 * 24));
        if (diffDays > 0 && diffDays <= 3) {
          const alertText = `Alert: The "${ex.subject} - ${ex.title}" exam is scheduled in ${diffDays} day(s)!`;
          if (!currentAlerts.some(n => n.text === alertText)) {
            currentAlerts.unshift({
              id: `ex-alert-${ex.id}-${diffDays}`,
              text: alertText,
              read: false,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            updated = true;
          }
        }
      });

      if (updated) {
        setNotifications(currentAlerts);
      }
    };

    checkUpcomingAlerts();
    const timer = setInterval(checkUpcomingAlerts, 60000);
    return () => clearInterval(timer);
  }, [exams, hasStarted, notifications]);

  // --- Quick adding functionality ---
  const addTask = (taskObj) => {
    const newTask = { id: Date.now().toString(), ...taskObj };
    setTasks([newTask, ...tasks]);
  };

  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (!quickAddTitle.trim()) return;

    if (currentTab === 'home' || currentTab === 'calendar') {
      addTask({
        title: quickAddTitle.trim(),
        category: quickAddCategory,
        date: quickAddDate,
        dueTime: '',
        completed: false
      });
    } else if (currentTab === 'habits') {
      const newHabit = {
        id: Date.now().toString(),
        name: quickAddTitle.trim(),
        icon: 'self_improvement',
        color: 'primary',
        target: 1,
        unit: 'times',
        progress: { [todayStr]: 0 }
      };
      setHabits([...habits, newHabit]);
    } else if (currentTab === 'academic') {
      const newSubject = {
        id: Date.now().toString(),
        name: quickAddTitle.trim(),
        code: 'SUBJ',
        status: 'ON TRACK',
        units: []
      };
      setSubjects([...subjects, newSubject]);
    } else if (currentTab === 'capture') {
      const newItem = {
        id: Date.now().toString(),
        text: quickAddTitle.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
      };
      setCaptureInbox([newItem, ...captureInbox]);
    }

    setQuickAddTitle('');
    setShowQuickAddModal(false);
  };

  // --- settings handlers ---
  const exportData = () => {
    const backup = { username, theme, isDark, tasks, habits, routines, subjects, exams, gpas, gradesStats, captureInbox, brainDump, dailyLogs, notifications };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `PRODUCTIVEDUDE_Backup_${todayStr}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const importData = (parsedState) => {
    if (parsedState.username) setUsername(parsedState.username);
    if (parsedState.theme) setTheme(parsedState.theme);
    if (parsedState.isDark !== undefined) setIsDark(parsedState.isDark);
    if (parsedState.tasks) setTasks(parsedState.tasks);
    if (parsedState.habits) setHabits(parsedState.habits);
    if (parsedState.routines) setRoutines(parsedState.routines);
    if (parsedState.subjects) setSubjects(parsedState.subjects);
    if (parsedState.exams) setExams(parsedState.exams);
    if (parsedState.gpas) setGpas(parsedState.gpas);
    if (parsedState.gradesStats) setGradesStats(parsedState.gradesStats);
    if (parsedState.captureInbox) setCaptureInbox(parsedState.captureInbox);
    if (parsedState.brainDump) setBrainDump(parsedState.brainDump);
    if (parsedState.dailyLogs) setDailyLogs(parsedState.dailyLogs);
    if (parsedState.notifications) setNotifications(parsedState.notifications);
  };

  const resetAllData = () => {
    if (confirm("Reset application back to a 0-data clean slate?")) {
      localStorage.clear();
      setTasks([]);
      setHabits([]);
      setRoutines([]);
      setSubjects([]);
      setExams([]);
      setGpas([
        { sem: 'SEM 1', val: 0 },
        { sem: 'SEM 2', val: 0 },
        { sem: 'SEM 3', val: 0 },
        { sem: 'SEM 4', val: 0 },
        { sem: 'CURR', val: 0 }
      ]);
      setGradesStats({ A: 0, B: 0, C: 0 });
      setCaptureInbox([]);
      setBrainDump('// Brain Dump Scratchpad\n- Write notes or sudden lists...');
      setDailyLogs({});
      setHasStarted(false);
      window.location.reload();
    }
  };

  if (!hasStarted) {
    return <LandingPage onStart={handleLaunchStart} />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-28">
      {/* Floating Island Header Navigation Bar */}
      <header className="fixed top-0 w-full z-40 px-4 pt-4">
        <div className="w-full max-w-5xl mx-auto rounded-2xl bg-surface/50 dark:bg-surface-container/65 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-lg flex items-center justify-between px-md py-sm">
          <div className="flex items-center gap-3">
            {/* Nav brand back to landing trigger */}
            <button
              onClick={() => {
                if(confirm("Return to home landing view? (Dashboard state remains active)")) {
                  setHasStarted(false);
                }
              }}
              className="flex items-center gap-2.5 text-left group hover:opacity-85"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center shadow-md shadow-primary/10">
                <span className="material-symbols-outlined text-white text-[16px]">bolt</span>
              </div>
              <div>
                <span className="font-headline font-extrabold text-sm tracking-tighter text-primary dark:text-white leading-none block">
                  PRODUCTIVEDUDE
                </span>
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest leading-none block mt-0.5">LIFE OS</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Alerts Dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotificationsDropdown(!showNotificationsDropdown);
                  // Mark as read
                  setNotifications(notifications.map(n => ({ ...n, read: true })));
                }}
                className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high/40 dark:hover:bg-surface-container-high/20 transition-colors relative"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                )}
              </button>

              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-3 w-80 glass-card rounded-2xl p-md z-50 space-y-sm shadow-2xl animate-fade-in text-left max-h-[360px] overflow-y-auto scroll-hide">
                  <div className="flex justify-between items-center pb-2 border-b border-outline/10">
                    <span className="font-bold text-xs text-on-surface flex items-center gap-1 uppercase tracking-wider">
                      System Logs
                    </span>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[9px] text-error font-bold uppercase hover:underline"
                    >
                      Clear Logs
                    </button>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {notifications.length === 0 ? (
                      <p className="text-center text-on-surface-variant italic text-xs py-4">No alert logs recorded.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2 bg-surface-container/60 dark:bg-surface-container-high/10 rounded-xl flex gap-2 relative group text-xs">
                          <span className="material-symbols-outlined text-[13px] text-primary flex-shrink-0 mt-0.5">info</span>
                          <div className="flex-1 text-on-surface font-medium leading-relaxed pr-3">
                            {n.text}
                            <span className="block text-[8px] text-on-surface-variant font-mono mt-1">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings button */}
            <button
              onClick={() => setCurrentTab('settings')}
              className={`p-2 rounded-xl transition-colors hover:bg-surface-container-high/40 dark:hover:bg-surface-container-high/20 ${currentTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'}`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 pt-24 px-4 max-w-5xl mx-auto w-full pb-10">
        <div key={currentTab} className="tab-transition">
          {currentTab === 'home' && (
            <Dashboard
              tasks={tasks}
              setTasks={setTasks}
              habits={habits}
              setHabits={setHabits}
              dailyLogs={dailyLogs}
              setDailyLogs={setDailyLogs}
              username={username}
            />
          )}
          {currentTab === 'calendar' && (
            <CalendarView
              tasks={tasks}
              setTasks={setTasks}
            />
          )}
          {currentTab === 'academic' && (
            <Academic
              subjects={subjects}
              setSubjects={setSubjects}
              exams={exams}
              setExams={setExams}
              gpas={gpas}
              setGpas={setGpas}
              gradesStats={gradesStats}
              setGradesStats={setGradesStats}
            />
          )}
          {currentTab === 'habits' && (
            <HabitsView
              habits={habits}
              setHabits={setHabits}
              routines={routines}
              setRoutines={setRoutines}
            />
          )}
          {currentTab === 'capture' && (
            <Capture
              captureInbox={captureInbox}
              setCaptureInbox={setCaptureInbox}
              brainDump={brainDump}
              setBrainDump={setBrainDump}
              addTask={addTask}
            />
          )}
          {currentTab === 'settings' && (
            <Settings
              username={username}
              setUsername={setUsername}
              theme={theme}
              setTheme={setTheme}
              isDark={isDark}
              setIsDark={setIsDark}
              exportData={exportData}
              importData={importData}
              resetAllData={resetAllData}
              loadTutorialDemo={loadTutorialDemo}
            />
          )}
        </div>
      </main>

      {/* Floating Plus button */}
      {currentTab !== 'settings' && (
        <button
          onClick={() => {
            setQuickAddTitle('');
            setShowQuickAddModal(true);
          }}
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-30 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold pulse-on-hover"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      )}

      {/* Contextual Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md rounded-2xl p-lg space-y-md shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-body-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                {currentTab === 'home' || currentTab === 'calendar' ? 'Quick Add Task' : currentTab === 'habits' ? 'Quick Add Habit' : currentTab === 'academic' ? 'Quick Add Subject' : 'Quick Capture Thought'}
              </h3>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-sm">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">
                  {currentTab === 'home' || currentTab === 'calendar' ? 'TASK TITLE' : currentTab === 'habits' ? 'HABIT NAME' : currentTab === 'academic' ? 'SUBJECT NAME' : 'THOUGHT CONTENT'}
                </label>
                <input
                  type="text"
                  placeholder="Type details..."
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface/50 focus:outline-none focus:border-primary text-sm"
                  required
                  autoFocus
                />
              </div>

              {(currentTab === 'home' || currentTab === 'calendar') && (
                <div className="grid grid-cols-2 gap-sm">
                  <div>
                    <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">CATEGORY</label>
                    <select
                      value={quickAddCategory}
                      onChange={(e) => setQuickAddCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface/50 text-sm focus:outline-none"
                    >
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="Health">Health</option>
                      <option value="Academic">Academic</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">DATE</label>
                    <input
                      type="date"
                      value={quickAddDate}
                      onChange={(e) => setQuickAddDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface/50 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="px-4 py-2 font-bold text-on-surface bg-surface-container hover:bg-surface-container-high rounded-xl text-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-on-primary bg-primary hover:opacity-90 rounded-xl text-sm shadow-md shadow-primary/20"
                >
                  ADD ITEM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rounded bottom navbar */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-surface/60 dark:bg-surface-container/85 backdrop-blur-xl border-t border-outline/10 shadow-lg flex justify-around items-center px-4 pb-6 pt-2">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${currentTab === 'home' ? 'bg-primary/10 text-primary scale-105 font-bold px-4' : 'text-on-surface-variant hover:bg-surface-container-high/30'}`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `\'FILL\' ${currentTab === 'home' ? 1 : 0}` }}>home</span>
          <span className="text-[10px] font-bold mt-1 font-headline">Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentTab('calendar')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${currentTab === 'calendar' ? 'bg-primary/10 text-primary scale-105 font-bold px-4' : 'text-on-surface-variant hover:bg-surface-container-high/30'}`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `\'FILL\' ${currentTab === 'calendar' ? 1 : 0}` }}>calendar_today</span>
          <span className="text-[10px] font-bold mt-1 font-headline">Calendar</span>
        </button>

        <button
          onClick={() => setCurrentTab('academic')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${currentTab === 'academic' ? 'bg-primary/10 text-primary scale-105 font-bold px-4' : 'text-on-surface-variant hover:bg-surface-container-high/30'}`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `\'FILL\' ${currentTab === 'academic' ? 1 : 0}` }}>school</span>
          <span className="text-[10px] font-bold mt-1 font-headline">Academic</span>
        </button>

        <button
          onClick={() => setCurrentTab('habits')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${currentTab === 'habits' ? 'bg-primary/10 text-primary scale-105 font-bold px-4' : 'text-on-surface-variant hover:bg-surface-container-high/30'}`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `\'FILL\' ${currentTab === 'habits' ? 1 : 0}` }}>check_circle</span>
          <span className="text-[10px] font-bold mt-1 font-headline">Habits</span>
        </button>

        <button
          onClick={() => setCurrentTab('capture')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${currentTab === 'capture' ? 'bg-primary/10 text-primary scale-105 font-bold px-4' : 'text-on-surface-variant hover:bg-surface-container-high/30'}`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `\'FILL\' ${currentTab === 'capture' ? 1 : 0}` }}>bolt</span>
          <span className="text-[10px] font-bold mt-1 font-headline">Capture</span>
        </button>
      </nav>
    </div>
  );
}
