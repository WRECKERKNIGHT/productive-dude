  import React, { useState, useEffect, useRef, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import Academic from './components/Academic';
import HabitsView from './components/HabitsView';
import Capture from './components/Capture';
import Settings from './components/Settings';
import Passwords from './components/Passwords';
import Terminal from './components/Terminal';
import OnboardingWizard from './components/OnboardingWizard';
import RoleHub from './components/RoleHub';
import Pomodoro from './components/Pomodoro';
import Analytics from './components/Analytics';
import Notes from './components/Notes';
import Goals from './components/Goals';
import Music from './components/Music';
import {
  DEFAULT_PROFILE,
  buildEmptyRoleData,
  seedRoleData,
  getRole,
  APP_META
} from './roles';

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
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  // Active state tracks if user has completed the landing page
  const [hasStarted, setHasStarted] = useState(() => loadState('pd_hasStarted', false));
  const [username, setUsername] = useState(() => loadState('pd_username', 'User'));

  // Role system state (profile built by the onboarding wizard)
  const [profile, setProfile] = useState(() => ({ ...DEFAULT_PROFILE, ...loadState('pd_profile', {}) }));
  const [roleData, setRoleData] = useState(() => {
    const stored = loadState('pd_roleData', null);
    return stored ? stored : buildEmptyRoleData();
  });
  const [roleNotes, setRoleNotes] = useState(() => loadState('pd_roleNotes', []));
  const [roleGoals, setRoleGoals] = useState(() => loadState('pd_roleGoals', []));
  const [pomodoroLog, setPomodoroLog] = useState(() => loadState('pd_pomodoroLog', []));
  const [moodLog, setMoodLog] = useState(() => loadState('pd_moodLog', {}));
  const [musicTracks, setMusicTracks] = useState([]);
  const [expenses, setExpenses] = useState(() => loadState('pd_expenses', []));
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

  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [quickAddCategory, setQuickAddCategory] = useState('Personal');
  const [quickAddDate, setQuickAddDate] = useState(todayStr);

  // --- macOS Monterey System States ---
  const [brightness, setBrightness] = useState(() => loadState('pd_brightness', 1.0));
  const [volume, setVolume] = useState(() => loadState('pd_volume', 0.7));
  const [isWifiOn, setIsWifiOn] = useState(() => loadState('pd_isWifiOn', true));
  const [isBluetoothOn, setIsBluetoothOn] = useState(() => loadState('pd_isBluetoothOn', true));
  const [isAirDropOn, setIsAirDropOn] = useState(() => loadState('pd_isAirDropOn', true));
  const [isDndOn, setIsDndOn] = useState(() => loadState('pd_isDndOn', false));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState("Productive Beats - Lofi Chill");
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [lockScreenActive, setLockScreenActive] = useState(() => loadState('pd_lockScreenActive', true));
  const [lockClockFont, setLockClockFont] = useState(() => loadState('pd_lockClockFont', 'default'));
  const [lockClockWeight, setLockClockWeight] = useState(() => loadState('pd_lockClockWeight', 'bold'));
  const [lockClockColor, setLockClockColor] = useState(() => loadState('pd_lockClockColor', '#ffffff'));
  const [dragState, setDragState] = useState(null);
  const [windows, setWindows] = useState(() => loadState('pd_windows', [
    { id: 'dashboard', title: 'Dashboard App', isOpen: true, isMinimized: false, isMaximized: false, x: 120, y: 70, w: 750, h: 480, zIndex: 10 },
    { id: 'calendar', title: 'Calendar Grid', isOpen: false, isMinimized: false, isMaximized: false, x: 160, y: 110, w: 750, h: 480, zIndex: 5 },
    { id: 'academic', title: 'Academic Hub', isOpen: false, isMinimized: false, isMaximized: false, x: 200, y: 150, w: 750, h: 480, zIndex: 5 },
    { id: 'habits', title: 'Habits consistency', isOpen: false, isMinimized: false, isMaximized: false, x: 240, y: 190, w: 750, h: 480, zIndex: 5 },
    { id: 'capture', title: 'Quick Capture Inbox', isOpen: false, isMinimized: false, isMaximized: false, x: 280, y: 230, w: 750, h: 480, zIndex: 5 },
    { id: 'settings', title: 'System Settings', isOpen: false, isMinimized: false, isMaximized: false, x: 320, y: 270, w: 750, h: 480, zIndex: 5 },
    { id: 'passwords', title: 'Passwords Vault', isOpen: false, isMinimized: false, isMaximized: false, x: 180, y: 130, w: 700, h: 460, zIndex: 5 },
    { id: 'terminal', title: 'Modernized Terminal', isOpen: false, isMinimized: false, isMaximized: false, x: 220, y: 250, w: 680, h: 410, zIndex: 5 },
    { id: 'rolehub', title: 'Role Hub', isOpen: false, isMinimized: false, isMaximized: false, x: 200, y: 90, w: 780, h: 500, zIndex: 5 },
    { id: 'pomodoro', title: 'Focus Timer', isOpen: false, isMinimized: false, isMaximized: false, x: 260, y: 150, w: 460, h: 460, zIndex: 5 },
    { id: 'analytics', title: 'Analytics', isOpen: false, isMinimized: false, isMaximized: false, x: 300, y: 110, w: 760, h: 480, zIndex: 5 },
    { id: 'notes', title: 'Notes', isOpen: false, isMinimized: false, isMaximized: false, x: 240, y: 120, w: 720, h: 470, zIndex: 5 },
    { id: 'goals', title: 'Goals', isOpen: false, isMinimized: false, isMaximized: false, x: 320, y: 140, w: 720, h: 470, zIndex: 5 },
    { id: 'music', title: 'Music', isOpen: false, isMinimized: false, isMaximized: false, x: 380, y: 170, w: 520, h: 480, zIndex: 5 }
  ]));
  const [activeWindowId, setActiveWindowId] = useState('dashboard');
  const [tilingHint, setTilingHint] = useState({ x: 0, y: 0, w: 0, h: 0, visible: false });
  const [iphoneMirroringOpen, setIphoneMirroringOpen] = useState(false);
  const [stageManager, setStageManager] = useState(() => loadState('pd_stageManager', false));
  const [desktopFolders, setDesktopFolders] = useState(() => loadState('pd_desktopFolders', [
    { id: 'f1', name: 'Productivity Logs', emoji: '📂', color: '#3b82f6', targetApp: 'dashboard' },
    { id: 'f2', name: 'Academic Notes', emoji: '📚', color: '#10b981', targetApp: 'academic' },
    { id: 'f3', name: 'Terminal Shell', emoji: '⚙️', color: '#8b5cf6', targetApp: 'terminal' }
  ]));
  const [passwords, setPasswords] = useState(() => loadState('pd_passwords', [
    { id: 'p1', title: 'Google Mail', username: 'wreckerknight@gmail.com', password: 'GmailSuperSecurePassword123!', website: 'google.com', updated: '2 days ago', strength: 'Strong' },
    { id: 'p2', title: 'GitHub Repo Account', username: 'WRECKERKNIGHT', password: 'GithubTokenPersonal9876!', website: 'github.com', updated: '1 week ago', strength: 'Strong' },
    { id: 'p3', title: 'Figma Design workspace', username: 'designer_dude', password: 'creativefigmapassword', website: 'figma.com', updated: '3 weeks ago', strength: 'Medium' },
    { id: 'p4', title: 'Netflix Stream share', username: 'wrecker_family', password: '123', website: 'netflix.com', updated: '1 month ago', strength: 'Weak' }
  ]));
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [editingFolderEmoji, setEditingFolderEmoji] = useState('📂');
  const [editingFolderColor, setEditingFolderColor] = useState('#3b82f6');
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [timeStr, setTimeStr] = useState('');

  // Song playlist for skipped songs
  const lofiPlaylist = [
    "Productive Beats - Lofi Chill",
    "Focus Wave - Deep Ambient",
    "Study Session - Soft Piano",
    "Late Night Drafts - Retro Synth",
    "Habit Flow - Jazz Beats"
  ];
  const [songIndex, setSongIndex] = useState(0);

  const handleSkipSong = () => {
    const nextIdx = (songIndex + 1) % lofiPlaylist.length;
    setSongIndex(nextIdx);
    setCurrentSong(lofiPlaylist[nextIdx]);
    setIsPlaying(true);
  };

  // Live battery query
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.getBattery) {
      navigator.getBattery().then(bat => {
        setBatteryLevel(Math.round(bat.level * 100));
        setIsCharging(bat.charging);
        
        const onLevelChange = () => setBatteryLevel(Math.round(bat.level * 100));
        const onChargingChange = () => setIsCharging(bat.charging);
        
        bat.addEventListener('levelchange', onLevelChange);
        bat.addEventListener('chargingchange', onChargingChange);
        
        return () => {
          bat.removeEventListener('levelchange', onLevelChange);
          bat.removeEventListener('chargingchange', onChargingChange);
        };
      });
    }
  }, []);

  // Live clock effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const dateNum = now.getDate();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'AM' : 'PM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTimeStr(`${dayName} ${monthName} ${dateNum}   ${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

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
  useEffect(() => { localStorage.setItem('pd_brightness', JSON.stringify(brightness)); }, [brightness]);
  useEffect(() => { localStorage.setItem('pd_volume', JSON.stringify(volume)); }, [volume]);
  useEffect(() => { localStorage.setItem('pd_isWifiOn', JSON.stringify(isWifiOn)); }, [isWifiOn]);
  useEffect(() => { localStorage.setItem('pd_isBluetoothOn', JSON.stringify(isBluetoothOn)); }, [isBluetoothOn]);
  useEffect(() => { localStorage.setItem('pd_isAirDropOn', JSON.stringify(isAirDropOn)); }, [isAirDropOn]);
  useEffect(() => { localStorage.setItem('pd_isDndOn', JSON.stringify(isDndOn)); }, [isDndOn]);
  
  useEffect(() => { localStorage.setItem('pd_lockScreenActive', JSON.stringify(lockScreenActive)); }, [lockScreenActive]);
  useEffect(() => { localStorage.setItem('pd_lockClockFont', JSON.stringify(lockClockFont)); }, [lockClockFont]);
  useEffect(() => { localStorage.setItem('pd_lockClockWeight', JSON.stringify(lockClockWeight)); }, [lockClockWeight]);
  useEffect(() => { localStorage.setItem('pd_lockClockColor', JSON.stringify(lockClockColor)); }, [lockClockColor]);
  useEffect(() => { localStorage.setItem('pd_windows', JSON.stringify(windows)); }, [windows]);
  useEffect(() => { localStorage.setItem('pd_stageManager', JSON.stringify(stageManager)); }, [stageManager]);
  useEffect(() => { localStorage.setItem('pd_passwords', JSON.stringify(passwords)); }, [passwords]);
  useEffect(() => { localStorage.setItem('pd_desktopFolders', JSON.stringify(desktopFolders)); }, [desktopFolders]);
  useEffect(() => { localStorage.setItem('pd_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('pd_roleData', JSON.stringify(roleData)); }, [roleData]);
  useEffect(() => { localStorage.setItem('pd_roleNotes', JSON.stringify(roleNotes)); }, [roleNotes]);
  useEffect(() => { localStorage.setItem('pd_roleGoals', JSON.stringify(roleGoals)); }, [roleGoals]);
  useEffect(() => { localStorage.setItem('pd_pomodoroLog', JSON.stringify(pomodoroLog)); }, [pomodoroLog]);
  useEffect(() => { localStorage.setItem('pd_moodLog', JSON.stringify(moodLog)); }, [moodLog]);
  useEffect(() => { localStorage.setItem('pd_expenses', JSON.stringify(expenses)); }, [expenses]);

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
    // Electron transparent window check
    const isElectron = window.electronAPI?.isElectron || window.navigator.userAgent.toLowerCase().includes('electron');
    if (isElectron) {
      document.body.classList.add('electron-window');
    } else {
      document.body.classList.remove('electron-window');
    }
  }, [theme, isDark]);

  const makeInteractive = () => {
    window.electronAPI?.setIgnoreMouseEvents(false);
  };

  const makeClickThrough = () => {
    window.electronAPI?.setIgnoreMouseEvents(true);
  };

  useEffect(() => {
    if (lockScreenActive) {
      window.electronAPI?.setIgnoreMouseEvents(false);
    } else {
      window.electronAPI?.setIgnoreMouseEvents(true);
    }
  }, [lockScreenActive]);

  const [hudStatus, setHudStatus] = useState({ visible: false, type: 'volume', value: 0.7 });
  
  const isFirstVolume = useRef(true);
  useEffect(() => {
    if (isFirstVolume.current) {
      isFirstVolume.current = false;
      return;
    }
    setHudStatus({ visible: true, type: 'volume', value: volume });
    const timer = setTimeout(() => setHudStatus(prev => ({ ...prev, visible: false })), 1500);
    return () => clearTimeout(timer);
  }, [volume]);

  const isFirstBrightness = useRef(true);
  useEffect(() => {
    if (isFirstBrightness.current) {
      isFirstBrightness.current = false;
      return;
    }
    setHudStatus({ visible: true, type: 'brightness', value: brightness });
    const timer = setTimeout(() => setHudStatus(prev => ({ ...prev, visible: false })), 1500);
    return () => clearTimeout(timer);
  }, [brightness]);

  // Window manager keyboard shortcut Cmd + K (Spotlight search)
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  // Window Mouse listeners for Drag-and-Drop and Resize bounds
  const handleMouseDown = (id, e, mode = 'drag') => {
    e.stopPropagation();
    focusWindow(id);
    
    const win = windows.find(w => w.id === id);
    if (!win || win.isMaximized) return;

    setDragState({
      id,
      startX: e.clientX,
      startY: e.clientY,
      startWinX: win.x,
      startWinY: win.y,
      startWinW: win.w,
      startWinH: win.h,
      mode
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragState) return;
    const { id, startX, startY, startWinX, startWinY, startWinW, startWinH, mode } = dragState;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (mode === 'drag') {
      let nextX = startWinX + deltaX;
      let nextY = startWinY + deltaY;

      // snapping boundary check
      let hintConfig = { x: 0, y: 0, w: 0, h: 0, visible: false };
      if (e.clientX < 20) {
        hintConfig = { x: 0, y: 32, w: window.innerWidth / 2, h: window.innerHeight - 32, visible: true };
      } else if (e.clientX > window.innerWidth - 20) {
        hintConfig = { x: window.innerWidth / 2, y: 32, w: window.innerWidth / 2, h: window.innerHeight - 32, visible: true };
      } else if (e.clientY < 38) {
        hintConfig = { x: 0, y: 32, w: window.innerWidth, h: window.innerHeight - 32, visible: true };
      }
      setTilingHint(hintConfig);

      setWindows(prev => prev.map(w => w.id === id ? { ...w, x: nextX, y: nextY } : w));
    } else if (mode === 'resize') {
      let nextW = Math.max(350, startWinW + deltaX);
      let nextH = Math.max(200, startWinH + deltaY);
      setWindows(prev => prev.map(w => w.id === id ? { ...w, w: nextW, h: nextH } : w));
    }
  }, [dragState, setWindows]);

  const handleMouseUp = useCallback(() => {
    if (!dragState) return;
    const { id } = dragState;

    if (dragState.mode === 'drag') {
      if (tilingHint.visible) {
        setWindows(prev => prev.map(w => {
          if (w.id === id) {
            return {
              ...w,
              x: tilingHint.x,
              y: tilingHint.y,
              w: tilingHint.w,
              h: tilingHint.h,
              isMaximized: tilingHint.w === window.innerWidth && tilingHint.h === window.innerHeight - 32
            };
          }
          return w;
        }));
        setTilingHint({ x: 0, y: 0, w: 0, h: 0, visible: false });
      }
    }
    setDragState(null);
  }, [dragState, tilingHint, setWindows]);

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, handleMouseMove, handleMouseUp]);

  // Bring window to center active focus
  const focusWindow = (id) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex || 0), 10);
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false, isOpen: true } : w);
    });
  };

  const openApp = (id) => {
    focusWindow(id);
  };

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

  // Onboarding wizard complete — build profile + seed role data
  const handleOnboardingComplete = (p) => {
    const roles = [p.primaryRole, ...p.secondaryRoles].filter(Boolean);
    const nextProfile = { ...DEFAULT_PROFILE, ...p, onboarded: true };
    setProfile(nextProfile);
    setUsername(p.name || 'User');
    setTheme(p.theme);
    setIsDark(p.isDark);
    setRoleData(prev => ({
      ...buildEmptyRoleData(),
      ...prev,
      ...seedRoleData(roles)
    }));
    if (!loadState('pd_tasks', null)) {
      setTasks([
        { id: Date.now().toString() + 'a', title: 'Set up your first task', category: 'Personal', date: todayStr, dueTime: '09:00', completed: false }
      ]);
    }
    setHasStarted(true);
  };

  const handleReRunOnboarding = () => {
    setProfile(prev => ({ ...prev, onboarded: false }));
    setHasStarted(false);
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

    // Direct add task to list
    addTask({
      title: quickAddTitle.trim(),
      category: quickAddCategory,
      date: quickAddDate,
      dueTime: '',
      completed: false
    });

    setQuickAddTitle('');
    setShowQuickAddModal(false);
    focusWindow('dashboard');
  };

  // --- settings handlers ---
  const exportData = () => {
    const backup = { username, theme, isDark, tasks, habits, routines, subjects, exams, gpas, gradesStats, captureInbox, brainDump, dailyLogs, notifications, passwords, desktopFolders, profile, roleData, roleNotes, roleGoals, pomodoroLog, moodLog, expenses };
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
    if (parsedState.passwords) setPasswords(parsedState.passwords);
    if (parsedState.desktopFolders) setDesktopFolders(parsedState.desktopFolders);
    if (parsedState.profile) setProfile(parsedState.profile);
    if (parsedState.roleData) setRoleData(parsedState.roleData);
    if (parsedState.roleNotes) setRoleNotes(parsedState.roleNotes);
    if (parsedState.roleGoals) setRoleGoals(parsedState.roleGoals);
    if (parsedState.pomodoroLog) setPomodoroLog(parsedState.pomodoroLog);
    if (parsedState.moodLog) setMoodLog(parsedState.moodLog);
    if (parsedState.expenses) setExpenses(parsedState.expenses);
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
      setProfile({ ...DEFAULT_PROFILE });
      setRoleData(buildEmptyRoleData());
      setRoleNotes([]);
      setRoleGoals([]);
      setPomodoroLog([]);
      setMoodLog({});
      setExpenses([]);
      setHasStarted(false);
      window.location.reload();
    }
  };

  const handleFolderClick = (folder) => {
    setSelectedFolderId(folder.id);
    setEditingFolderName(folder.name);
    setEditingFolderEmoji(folder.emoji);
    setEditingFolderColor(folder.color);
  };

  const handleSaveFolderSettings = (e) => {
    e.preventDefault();
    if (!editingFolderName.trim()) return;
    setDesktopFolders(prev => prev.map(f => f.id === selectedFolderId ? { ...f, name: editingFolderName.trim(), emoji: editingFolderEmoji || '📂', color: editingFolderColor || '#3b82f6' } : f));
    setSelectedFolderId(null);
  };

  // Spotlight search matches
  const getSpotlightResults = () => {
    if (!spotlightQuery.trim()) return [];
    const query = spotlightQuery.toLowerCase();

    const taskResults = tasks.filter(t => t.title.toLowerCase().includes(query)).map(t => ({
      id: `task-${t.id}`,
      title: t.title,
      subtitle: `Task · Due: ${t.date} · ${t.category}`,
      icon: 'check_circle',
      action: () => {
        openApp('dashboard');
        setSpotlightOpen(false);
      }
    }));

    const passwordResults = passwords.filter(p => p.title.toLowerCase().includes(query) || p.username.toLowerCase().includes(query)).map(p => ({
      id: `pass-${p.id}`,
      title: p.title,
      subtitle: `Password · User: ${p.username} (${p.website})`,
      icon: 'vpn_key',
      action: () => {
        openApp('passwords');
        setSpotlightOpen(false);
      }
    }));

    const subjectResults = subjects.filter(s => s.name.toLowerCase().includes(query)).map(s => ({
      id: `subj-${s.id}`,
      title: s.name,
      subtitle: `Academic Subject · Code: ${s.code}`,
      icon: 'school',
      action: () => {
        openApp('academic');
        setSpotlightOpen(false);
      }
    }));

    return [...taskResults, ...passwordResults, ...subjectResults].slice(0, 5);
  };

  // Render individual floating draggable window
  const renderWindow = (win) => {
    if (!win.isOpen) return null;
    const isActive = activeWindowId === win.id;

    const style = win.isMaximized ? {
      left: 0,
      top: 32,
      width: '100vw',
      height: 'calc(100vh - 32px)',
      zIndex: win.zIndex
    } : {
      left: win.x,
      top: win.y,
      width: win.w,
      height: win.h,
      zIndex: win.zIndex
    };

    if (win.isMinimized) return null;

    return (
      <div 
        key={win.id}
        className={`window-container ${isActive ? 'window-active' : ''}`}
        style={style}
        onClick={() => focusWindow(win.id)}
        onMouseEnter={makeInteractive}
        onMouseLeave={makeClickThrough}
      >
        {/* Window Header */}
        <div 
          className="window-header flex items-center justify-between select-none"
          onMouseDown={(e) => handleMouseDown(win.id, e, 'drag')}
        >
          {/* Windows buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setWindows(prev => prev.map(w => w.id === win.id ? { ...w, isOpen: false } : w));
              }}
              className="w-3 h-3 rounded-full window-btn-close hover:scale-105 transition-transform flex items-center justify-center text-[6px] font-bold text-red-950 cursor-pointer"
            >
              ×
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setWindows(prev => prev.map(w => w.id === win.id ? { ...w, isMinimized: true } : w));
              }}
              className="w-3 h-3 rounded-full window-btn-minimize hover:scale-105 transition-transform flex items-center justify-center text-[6px] font-bold text-yellow-950 cursor-pointer"
            >
              −
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setWindows(prev => prev.map(w => w.id === win.id ? { ...w, isMaximized: !w.isMaximized } : w));
              }}
              className="w-3 h-3 rounded-full window-btn-maximize hover:scale-105 transition-transform flex items-center justify-center text-[6px] font-bold text-green-950 cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Window Title */}
          <span className="text-[10px] font-bold tracking-wider text-on-surface-variant/80 uppercase mx-auto">{win.title}</span>
          
          <div className="w-12 flex-shrink-0" />
        </div>

        {/* Window Content */}
        <div className="window-content bg-surface/40 dark:bg-black/10 flex-grow scroll-hide">
          {win.id === 'dashboard' && (
            <Dashboard
              tasks={tasks}
              setTasks={setTasks}
              habits={habits}
              setHabits={setHabits}
              dailyLogs={dailyLogs}
              setDailyLogs={setDailyLogs}
              username={username}
              profile={profile}
              roleData={roleData}
              roleGoals={roleGoals}
              openApp={openApp}
            />
          )}
          {win.id === 'calendar' && (
            <CalendarView
              tasks={tasks}
              setTasks={setTasks}
            />
          )}
          {win.id === 'academic' && (
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
          {win.id === 'habits' && (
            <HabitsView
              habits={habits}
              setHabits={setHabits}
              routines={routines}
              setRoutines={setRoutines}
            />
          )}
          {win.id === 'capture' && (
            <Capture
              captureInbox={captureInbox}
              setCaptureInbox={setCaptureInbox}
              brainDump={brainDump}
              setBrainDump={setBrainDump}
              addTask={addTask}
            />
          )}
          {win.id === 'settings' && (
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
              profile={profile}
              setProfile={setProfile}
              onReRunOnboarding={handleReRunOnboarding}
            />
          )}
          {win.id === 'passwords' && (
            <Passwords
              passwords={passwords}
              setPasswords={setPasswords}
            />
          )}
          {win.id === 'terminal' && (
            <Terminal
              username={username}
              tasks={tasks}
              theme={theme}
              setTheme={setTheme}
              isDark={isDark}
              setIsDark={setIsDark}
            />
          )}
          {win.id === 'rolehub' && (
            <RoleHub
              profile={profile}
              roleData={roleData}
              setRoleData={setRoleData}
              tasks={tasks}
              habits={habits}
              pomodoroLog={pomodoroLog}
              roleGoals={roleGoals}
              setRoleGoals={setRoleGoals}
              setPomodoroLog={setPomodoroLog}
              openApp={openApp}
            />
          )}
          {win.id === 'pomodoro' && (
            <Pomodoro
              pomodoroLog={pomodoroLog}
              setPomodoroLog={setPomodoroLog}
              openApp={openApp}
            />
          )}
          {win.id === 'analytics' && (
            <Analytics
              tasks={tasks}
              habits={habits}
              roleData={roleData}
              pomodoroLog={pomodoroLog}
              moodLog={moodLog}
              setMoodLog={setMoodLog}
              profile={profile}
              expenses={expenses}
              setExpenses={setExpenses}
            />
          )}
          {win.id === 'notes' && (
            <Notes
              roleNotes={roleNotes}
              setRoleNotes={setRoleNotes}
            />
          )}
          {win.id === 'goals' && (
            <Goals
              roleGoals={roleGoals}
              setRoleGoals={setRoleGoals}
              profile={profile}
            />
          )}
          {win.id === 'music' && (
            <Music
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentSong={currentSong}
              setCurrentSong={setCurrentSong}
              volume={volume}
            />
          )}
        </div>

        {/* Resize Handle */}
        {!win.isMaximized && (
          <div 
            className="absolute bottom-0 right-0 w-4.5 h-4.5 cursor-se-resize z-50 flex items-center justify-center"
            onMouseDown={(e) => handleMouseDown(win.id, e, 'resize')}
          >
            <span className="material-symbols-outlined text-on-surface-variant/40 text-[11px] rotate-90 select-none">drag_handle</span>
          </div>
        )}
      </div>
    );
  };

  // Determine if active window dims desktop widgets
  const anyActiveWindow = windows.some(w => w.isOpen && !w.isMinimized);

  // Role-aware dock ordering
  const baseDockApps = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_today' },
    { id: 'rolehub', label: 'Role Hub', icon: APP_META.rolehub.icon },
    { id: 'academic', label: 'Academic Hub', icon: 'school' },
    { id: 'habits', label: 'Habits', icon: 'check_circle' },
    { id: 'pomodoro', label: 'Focus Timer', icon: APP_META.pomodoro.icon },
    { id: 'analytics', label: 'Analytics', icon: APP_META.analytics.icon },
    { id: 'notes', label: 'Notes', icon: APP_META.notes.icon },
    { id: 'goals', label: 'Goals', icon: APP_META.goals.icon },
    { id: 'capture', label: 'Capture', icon: 'bolt' },
    { id: 'music', label: 'Music', icon: APP_META.music.icon },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'passwords', label: 'Passwords', icon: 'vpn_key' },
    { id: 'terminal', label: 'Terminal', icon: 'terminal' }
  ];
  const primaryRole = getRole(profile.primaryRole);
  const orderedAppIds = [...new Set([...primaryRole.dockApps, ...baseDockApps.map(a => a.id)])];
  const dockApps = orderedAppIds.map(id => baseDockApps.find(a => a.id === id)).filter(Boolean);

  if (!hasStarted) {
    if (!profile.onboarded) {
      return <OnboardingWizard onComplete={handleOnboardingComplete} />;
    }
    return <LandingPage onStart={handleLaunchStart} />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-28 pt-8 overflow-hidden relative">
      
      {/* Screen Dimming Overlay */}
      <div 
        className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-150"
        style={{ opacity: 1 - brightness }}
      />

      {/* macOS Sequoia Lock Screen */}
      {lockScreenActive && (
        <div 
          className="lock-screen-container animate-screensaver-bg flex flex-col justify-between items-center text-center cursor-pointer select-none bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('${getWallpaper(profile.wallpaper).path}')`,
            color: lockClockColor
          }}
          onClick={() => setLockScreenActive(false)}
          onMouseEnter={makeInteractive}
          onMouseLeave={makeClickThrough}
        >
          {/* Top Clock widget */}
          <div className="mt-20 space-y-2">
            <span className="text-xs uppercase tracking-widest block font-bold" style={{ color: `${lockClockColor}dd` }}>
              {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <h1 
              className={`text-[86px] leading-none tracking-tighter ${
                lockClockFont === 'serif' ? 'font-clock-serif' : 
                lockClockFont === 'rounded' ? 'font-clock-rounded' : 
                lockClockFont === 'playful' ? 'font-clock-playful' : 'font-clock-default'
              } ${
                lockClockWeight === 'extrabold' ? 'font-extrabold' : 
                lockClockWeight === 'normal' ? 'font-normal' : 
                lockClockWeight === 'medium' ? 'font-medium' : 
                lockClockWeight === 'semibold' ? 'font-semibold' : 'font-bold'
              }`}
            >
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h1>
            
            {/* Clock customizer widget on lock screen (Sequoia detail) */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="mt-6 p-4 glass-card rounded-2xl w-72 mx-auto space-y-3 shadow-lg text-left text-on-surface text-xs"
            >
              <div className="flex justify-between items-center pb-1.5 border-b border-outline/10">
                <span className="font-extrabold text-[10px] uppercase text-primary">Customize Clock</span>
                <span className="material-symbols-outlined text-[14px]">brush</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <div>
                  <label className="block text-on-surface-variant mb-0.5">TYPEFACE</label>
                  <select 
                    value={lockClockFont} 
                    onChange={(e) => setLockClockFont(e.target.value)}
                    className="w-full p-1 rounded bg-surface/50 border border-outline/10 text-on-surface"
                  >
                    <option value="default">Default</option>
                    <option value="serif">Serif</option>
                    <option value="rounded">Rounded</option>
                    <option value="playful">Playful</option>
                  </select>
                </div>
                <div>
                  <label className="block text-on-surface-variant mb-0.5">WEIGHT</label>
                  <select 
                    value={lockClockWeight} 
                    onChange={(e) => setLockClockWeight(e.target.value)}
                    className="w-full p-1 rounded bg-surface/50 border border-outline/10 text-on-surface"
                  >
                    <option value="normal">Light</option>
                    <option value="medium">Medium</option>
                    <option value="bold">Bold</option>
                    <option value="extrabold">Heavy</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">COLOR PRESET</label>
                <div className="flex gap-2">
                  {['#ffffff', '#fbbf24', '#f43f5e', '#38bdf8', '#a855f7'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setLockClockColor(c)}
                      className={`w-5 h-5 rounded-full border border-white/50 cursor-pointer`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10 text-[11px] tracking-widest font-extrabold animate-pulse uppercase" style={{ color: `${lockClockColor}bb` }}>
            Click anywhere to unlock Life OS
          </div>
        </div>
      )}

      {/* macOS Top Menu Bar */}
      <div 
        onMouseEnter={makeInteractive}
        onMouseLeave={makeClickThrough}
        className="fixed top-0 left-0 right-0 h-8 z-50 flex items-center justify-between px-4 text-xs font-semibold select-none mac-menu-bar text-on-surface"
      >
        {/* Left Side App Menus */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center hover:opacity-80 transition-opacity font-bold">
              <span className="material-symbols-outlined text-[15px] mr-1">bolt</span>
              <span className="font-extrabold text-[12px] tracking-tight">ProductiveDude</span>
            </button>
            <div className="absolute left-0 mt-1.5 w-48 glass-card rounded-lg py-1 shadow-2xl hidden group-hover:block hover:block z-50 border border-white/20 dark:border-white/5 text-left text-[11px]">
              <button 
                onClick={() => {
                  setLockScreenActive(true);
                  setShowControlCenter(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[12px]">lock</span>
                Lock Screen
              </button>
              <button 
                onClick={() => {
                  openApp('settings');
                  setShowControlCenter(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[12px]">settings</span>
                System Settings...
              </button>
              <hr className="border-outline/10 my-1" />
              <button 
                onClick={() => window.location.reload()} 
                className="w-full text-left px-3 py-1.5 hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[12px]">refresh</span>
                Restart Simulator
              </button>
              <button 
                onClick={() => setBrightness(0.2)} 
                className="w-full text-left px-3 py-1.5 hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[12px]">bedtime</span>
                Sleep Mode
              </button>
              <button 
                onClick={() => {
                  if(confirm("Shut down Life OS simulator?")) {
                    setHasStarted(false);
                  }
                }} 
                className="w-full text-left px-3 py-1.5 text-error hover:bg-error hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[12px]">power_settings_new</span>
                Shut Down...
              </button>
            </div>
          </div>

          {/* Apps shortcuts in menu bar */}
          <button onClick={() => openApp('dashboard')} className="mac-menu-bar-btn max-[500px]:hidden">Dashboard</button>
          <button onClick={() => openApp('rolehub')} className="mac-menu-bar-btn max-[560px]:hidden">Role Hub</button>
          <button onClick={() => openApp('calendar')} className="mac-menu-bar-btn max-[550px]:hidden">Calendar</button>
          <button onClick={() => openApp('academic')} className="mac-menu-bar-btn max-[600px]:hidden">Academic</button>
          <button onClick={() => openApp('pomodoro')} className="mac-menu-bar-btn max-[640px]:hidden">Focus</button>
          <button onClick={() => openApp('analytics')} className="mac-menu-bar-btn max-[700px]:hidden">Analytics</button>
          <button onClick={() => openApp('notes')} className="mac-menu-bar-btn max-[750px]:hidden">Notes</button>
          <button onClick={() => openApp('passwords')} className="mac-menu-bar-btn max-[650px]:hidden">Passwords</button>
          <button onClick={() => openApp('terminal')} className="mac-menu-bar-btn max-[700px]:hidden">Terminal</button>
        </div>

        {/* Right Side Status Icons */}
        <div className="flex items-center gap-3">
          {/* Spotlight Search Icon */}
          <span 
            className="material-symbols-outlined text-[15px] cursor-pointer hover:opacity-80 transition-opacity" 
            title="Spotlight Search (Cmd+K)"
            onClick={() => setSpotlightOpen(!spotlightOpen)}
          >
            search
          </span>

          {isDndOn && (
            <span className="material-symbols-outlined text-[14px] text-primary animate-pulse" title="Do Not Disturb active">
              do_not_disturb_on
            </span>
          )}
          
          <span 
            className="material-symbols-outlined text-[15px] cursor-pointer hover:opacity-80 transition-opacity" 
            title={isWifiOn ? "Wi-Fi Connected" : "Wi-Fi Disconnected"}
            onClick={() => setIsWifiOn(!isWifiOn)}
          >
            {isWifiOn ? "wifi" : "wifi_off"}
          </span>

          <span 
            className="material-symbols-outlined text-[15px] cursor-pointer hover:opacity-80 transition-opacity max-[400px]:hidden" 
            title={isBluetoothOn ? "Bluetooth On" : "Bluetooth Off"}
            onClick={() => setIsBluetoothOn(!isBluetoothOn)}
          >
            {isBluetoothOn ? "bluetooth" : "bluetooth_disabled"}
          </span>

          <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity" title={`${batteryLevel}% ${isCharging ? 'Charging' : 'Remaining'}`}>
            <span className="text-[10px] font-mono leading-none">{batteryLevel}%</span>
            <span className="material-symbols-outlined text-[16px] leading-none">
              {isCharging ? "battery_charging_full" : batteryLevel > 80 ? "battery_full" : batteryLevel > 40 ? "battery_5_bar" : "battery_2_bar"}
            </span>
          </div>

          {/* Control Center Toggle */}
          <button 
            onClick={() => {
              setShowControlCenter(!showControlCenter);
              setShowNotificationCenter(false);
            }}
            className={`flex items-center justify-center p-1 rounded transition-colors hover:bg-surface-container-high/40 dark:hover:bg-surface-container-high/20 ${showControlCenter ? 'bg-primary/20 text-primary' : ''}`}
          >
            <span className="material-symbols-outlined text-[15px] leading-none">instant_mix</span>
          </button>

          {/* Date & Time Widget */}
          <button 
            onClick={() => {
              setShowNotificationCenter(!showNotificationCenter);
              setShowControlCenter(false);
              setNotifications(notifications.map(n => ({ ...n, read: true })));
            }}
            className={`mac-menu-bar-btn hover:bg-surface-container-high/40 dark:hover:bg-surface-container-high/20 transition-colors flex items-center gap-1 font-mono text-[11px] py-0.5 px-2 rounded ${showNotificationCenter ? 'bg-primary/20 text-primary font-bold' : ''}`}
          >
            {timeStr || 'Loading...'}
            {notifications.some(n => !n.read) && !isDndOn && (
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* Spotlight Floating Search Overlay */}
      {spotlightOpen && (
        <div 
          onMouseEnter={makeInteractive}
          onMouseLeave={makeClickThrough}
          className="fixed inset-0 bg-black/25 z-50 flex items-start justify-center pt-24" 
          onClick={() => setSpotlightOpen(false)}
        >
          <div className="glass-card w-[520px] rounded-2xl p-4 shadow-2xl space-y-3 text-left border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-outline/10 pb-2">
              <span className="material-symbols-outlined text-primary text-[20px]">search</span>
              <input 
                type="text"
                placeholder="Search tasks, credentials, folders or type commands..."
                value={spotlightQuery}
                onChange={(e) => setSpotlightQuery(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-on-surface focus:outline-none font-medium"
                autoFocus
              />
            </div>
            
            {/* Search results */}
            <div className="space-y-1">
              {spotlightQuery.trim() === '' ? (
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider pl-1 py-1">
                  Try commands: Cmd+K, open passwords, check tasks
                </div>
              ) : getSpotlightResults().length === 0 ? (
                <div className="text-center italic text-xs text-on-surface-variant py-4">No results match your query.</div>
              ) : (
                getSpotlightResults().map(res => (
                  <button
                    key={res.id}
                    onClick={res.action}
                    className="w-full p-2 rounded-xl flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">{res.icon}</span>
                    <div className="leading-tight">
                      <span className="text-xs font-bold block text-on-surface">{res.title}</span>
                      <span className="text-[9px] text-on-surface-variant block font-medium mt-0.5">{res.subtitle}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* macOS Monterey Control Center Panel */}
      {showControlCenter && (
        <div 
          onMouseEnter={makeInteractive}
          onMouseLeave={makeClickThrough}
          className="fixed top-10 right-4 w-[330px] glass-card z-50 p-4 shadow-2xl rounded-[22px] text-on-surface animate-fade-in border border-white/20 dark:border-white/8 hover:transform-none select-none"
        >
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Toggles */}
            <div className="p-3 bg-white/20 dark:bg-black/15 border border-white/10 rounded-2xl flex flex-col gap-2.5">
              <button onClick={() => setIsWifiOn(!isWifiOn)} className="flex items-center gap-2.5 w-full text-left">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isWifiOn ? 'bg-primary text-white' : 'bg-surface-container-high/40 dark:bg-surface-container/20 text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[15px]">{isWifiOn ? "wifi" : "wifi_off"}</span>
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] font-bold block">Wi-Fi</span>
                  <span className="text-[9px] text-on-surface-variant font-medium">{isWifiOn ? "HomeNet" : "Off"}</span>
                </div>
              </button>

              <button onClick={() => setIsBluetoothOn(!isBluetoothOn)} className="flex items-center gap-2.5 w-full text-left">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isBluetoothOn ? 'bg-primary text-white' : 'bg-surface-container-high/40 dark:bg-surface-container/20 text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[15px]">{isBluetoothOn ? "bluetooth" : "bluetooth_disabled"}</span>
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] font-bold block">Bluetooth</span>
                  <span className="text-[9px] text-on-surface-variant font-medium">{isBluetoothOn ? "On" : "Off"}</span>
                </div>
              </button>

              <button onClick={() => setIsAirDropOn(!isAirDropOn)} className="flex items-center gap-2.5 w-full text-left">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isAirDropOn ? 'bg-primary text-white' : 'bg-surface-container-high/40 dark:bg-surface-container/20 text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[15px]">sensors</span>
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] font-bold block">AirDrop</span>
                  <span className="text-[9px] text-on-surface-variant font-medium">{isAirDropOn ? "Everyone" : "Off"}</span>
                </div>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsDndOn(!isDndOn)}
                className={`p-3 border rounded-2xl flex items-center gap-2.5 w-full text-left transition-all ${isDndOn ? 'bg-primary/10 border-primary/25' : 'bg-white/20 dark:bg-black/15 border-white/10'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDndOn ? 'bg-primary text-white' : 'bg-surface-container-high/40 dark:bg-surface-container/20 text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[15px]">{isDndOn ? "do_not_disturb_on" : "dark_mode"}</span>
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] font-bold block">Focus (DND)</span>
                  <span className="text-[9px] text-on-surface-variant font-medium">{isDndOn ? "Active" : "Off"}</span>
                </div>
              </button>

              {/* Stage Manager Toggle inside Control Center */}
              <button 
                onClick={() => setStageManager(!stageManager)}
                className={`p-3 border rounded-2xl flex items-center gap-2.5 w-full text-left transition-all ${stageManager ? 'bg-primary/10 border-primary/25' : 'bg-white/20 dark:bg-black/15 border-white/10'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${stageManager ? 'bg-primary text-white' : 'bg-surface-container-high/40 dark:bg-surface-container/20 text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[15px]">dashboard_customize</span>
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] font-bold block">Stage Manager</span>
                  <span className="text-[9px] text-on-surface-variant font-medium">{stageManager ? "Active" : "Off"}</span>
                </div>
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-white/20 dark:bg-black/15 border border-white/10 rounded-2xl space-y-3 mb-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">light_mode</span> DISPLAY BRIGHTNESS</span>
                <span>{Math.round(brightness * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.2" 
                max="1.0" 
                step="0.05"
                value={brightness}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setBrightness(val);
                  window.electronAPI?.setSystemBrightness(val);
                }}
                className="tahoe-slider"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    {volume === 0 ? "volume_off" : volume < 0.5 ? "volume_down" : "volume_up"}
                  </span> 
                  SOUND VOLUME
                </span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="1.0" 
                step="0.05"
                value={volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  window.electronAPI?.setSystemVolume(Math.round(val * 100));
                }}
                className="tahoe-slider"
              />
            </div>
          </div>

          <div className="p-3 bg-white/20 dark:bg-black/15 border border-white/10 rounded-2xl flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center text-white shadow-md flex-shrink-0 animate-pulse">
                <span className="material-symbols-outlined text-[18px]">music_note</span>
              </div>
              <div className="truncate text-left leading-tight">
                <span className="text-[11px] font-bold block text-on-surface truncate">{currentSong}</span>
                <span className="text-[9px] text-on-surface-variant block font-medium">Lofi Study Beats</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-surface-color/50 hover:bg-surface-color/80 flex items-center justify-center text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
              </button>
              <button 
                onClick={handleSkipSong}
                className="w-8 h-8 rounded-full bg-surface-color/50 hover:bg-surface-color/80 flex items-center justify-center text-on-surface transition-colors"
                title="Skip Track"
              >
                <span className="material-symbols-outlined text-[18px]">skip_next</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* macOS Monterey Notification Drawer */}
      <div 
        onMouseEnter={makeInteractive}
        onMouseLeave={makeClickThrough}
        className={`notification-drawer p-4 space-y-4 overflow-y-auto scroll-hide select-none flex flex-col ${showNotificationCenter ? 'open' : ''}`}
      >
        <div className="flex justify-between items-center border-b border-outline/10 pb-2">
          <span className="font-bold text-xs uppercase tracking-wider text-on-surface">Notification Center</span>
          <button onClick={() => setShowNotificationCenter(false)} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Calendar widget */}
        <div className="p-3 bg-white/25 dark:bg-black/15 border border-white/10 rounded-2xl shadow-sm text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="font-extrabold text-xs text-primary dark:text-white uppercase tracking-wider">Calendar</span>
            <span className="text-[10px] font-bold text-on-surface-variant font-mono">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-on-surface">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i} className="text-on-surface-variant">{d}</span>
            ))}
            {(() => {
              const now = new Date();
              const year = now.getFullYear();
              const month = now.getMonth();
              const firstDay = new Date(year, month, 1).getDay();
              const totalDays = new Date(year, month + 1, 0).getDate();
              const cells = [];
              for (let i = 0; i < firstDay; i++) {
                cells.push(<span key={`empty-${i}`}></span>);
              }
              for (let d = 1; d <= totalDays; d++) {
                const isToday = d === now.getDate();
                cells.push(
                  <span 
                    key={d} 
                    className={`h-5 w-5 flex items-center justify-center rounded-full mx-auto ${isToday ? 'bg-primary text-white font-extrabold shadow-sm' : 'hover:bg-surface-container-high/30'}`}
                  >
                    {d}
                  </span>
                );
              }
              return cells;
            })()}
          </div>
        </div>

        {/* Progress energy ring */}
        <div className="p-3.5 bg-white/25 dark:bg-black/15 border border-white/10 rounded-2xl shadow-sm text-left flex items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center">
            {(() => {
              const compTasks = tasks.filter(t => t.completed).length;
              const totalTasks = tasks.length;
              const pct = totalTasks ? Math.round((compTasks / totalTasks) * 100) : 0;
              const radius = 22;
              const circum = 2 * Math.PI * radius;
              const strokeOffset = circum - (pct / 100) * circum;
              return (
                <>
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r={radius} className="stroke-surface-container-high/50 dark:stroke-surface-container/20" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="28" cy="28" r={radius} 
                      className="stroke-primary progress-ring-circle" 
                      strokeWidth="6" fill="transparent" 
                      strokeDasharray={circum}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-extrabold font-mono">{pct}%</span>
                </>
              );
            })()}
          </div>
          <div className="leading-tight">
            <span className="font-extrabold text-[11px] block text-on-surface uppercase tracking-wider">Focus Progress</span>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
              {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed today
            </p>
          </div>
        </div>

        {/* Alerts list */}
        <div className="flex-grow flex flex-col min-h-0 bg-white/20 dark:bg-black/15 border border-white/10 rounded-2xl p-3 text-left">
          <div className="flex justify-between items-center border-b border-outline/10 pb-1.5 mb-2 flex-shrink-0">
            <span className="font-extrabold text-[10px] text-on-surface uppercase tracking-wider">System Alerts</span>
            <button onClick={() => setNotifications([])} className="text-[9px] text-error font-bold uppercase hover:underline">Clear Logs</button>
          </div>
          <div className="flex-1 overflow-y-auto scroll-hide space-y-2">
            {notifications.length === 0 ? (
              <p className="text-center text-on-surface-variant italic text-[11px] py-6">No alerts recorded.</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="p-2 bg-white/35 dark:bg-black/25 rounded-xl border border-white/10 flex gap-2 relative text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-primary flex-shrink-0 mt-0.5">info</span>
                  <div className="flex-1 text-on-surface font-medium leading-relaxed pr-3">
                    {n.text}
                    <span className="block text-[8px] text-on-surface-variant font-mono mt-0.5">{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sticky note */}
        <div className="p-3 bg-amber-100/75 dark:bg-yellow-950/20 border border-amber-200/50 dark:border-yellow-900/10 rounded-2xl shadow-sm text-left flex-shrink-0">
          <span className="font-extrabold text-[10px] text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">edit_note</span> Sticky Note
          </span>
          <textarea
            value={brainDump}
            onChange={(e) => setBrainDump(e.target.value)}
            className="w-full bg-transparent border-none text-[11px] text-amber-900 dark:text-amber-200 focus:outline-none resize-none h-20 font-medium leading-snug"
            placeholder="Type quick thoughts here to automatically sync..."
          />
        </div>
      </div>

      {/* Screen Window Snapping preview hint */}
      {tilingHint.visible && (
        <div 
          className="tiling-preview-hint"
          style={{
            left: tilingHint.x,
            top: tilingHint.y,
            width: tilingHint.w,
            height: tilingHint.h
          }}
        />
      )}

      {/* Stage Manager sidebar stacking */}
      {stageManager && (
        <div className="stage-manager-sidebar select-none">
          {windows.filter(w => w.isOpen && w.id !== activeWindowId).map(win => (
            <div 
              key={win.id}
              onClick={() => focusWindow(win.id)}
              className="stage-card"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">
                {win.id === 'dashboard' ? 'home' : win.id === 'calendar' ? 'calendar_today' : win.id === 'academic' ? 'school' : win.id === 'habits' ? 'check_circle' : win.id === 'capture' ? 'bolt' : win.id === 'settings' ? 'settings' : win.id === 'passwords' ? 'vpn_key' : 'terminal'}
              </span>
              <span className="text-[8px] font-bold mt-1 text-on-surface-variant truncate w-14 text-center">{win.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Floating iPhone Mirroring App Frame (Sequoia feature) */}
      {iphoneMirroringOpen && (
        <div 
          className="fixed top-12 right-24 w-[280px] h-[550px] bg-black border-4 border-[#333] rounded-[36px] shadow-2xl z-40 p-4 flex flex-col justify-between select-none border-t-[10px] border-b-[10px]"
          style={{ 
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8)',
            transform: 'perspective(1000px) rotateY(-5deg)'
          }}
        >
          {/* Dynamic Island block */}
          <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2" />

          {/* iPhone Mock UI */}
          <div className="flex-grow flex flex-col justify-between text-left text-white font-sans text-xs bg-[#121214] rounded-[24px] p-3 overflow-hidden relative">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="font-bold text-[9px] uppercase tracking-wider text-primary">iPhone Mirroring</span>
                <span className="material-symbols-outlined text-[12px] text-secondary">wifi</span>
              </div>

              {/* Stats Preview Widget */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2">
                <span className="font-extrabold text-[9px] text-on-surface-variant block uppercase tracking-wider">Mirror Tasks</span>
                <div className="space-y-1 max-h-[160px] overflow-y-auto scroll-hide">
                  {tasks.length === 0 ? (
                    <p className="text-[9px] italic opacity-60">No tasks logged.</p>
                  ) : (
                    tasks.slice(0, 3).map(t => (
                      <div key={t.id} className="flex items-center gap-1.5 text-[10px]">
                        <span className="material-symbols-outlined text-[11px] text-primary">check_box_outline_blank</span>
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Compact Quick Note widget */}
              <div className="p-2.5 bg-yellow-950/20 border border-yellow-800/10 rounded-xl space-y-1">
                <span className="font-extrabold text-[9px] text-amber-500 uppercase tracking-widest block">Note Draft</span>
                <p className="text-[10px] italic opacity-85 truncate">"{brainDump.substring(0, 60)}..."</p>
              </div>
            </div>

            {/* Back Home hint */}
            <div className="text-center text-[8px] font-bold text-on-surface-variant py-1 uppercase border-t border-white/5 pt-2">
              Connected to Alex's iPhone 16
            </div>
          </div>

          {/* iPhone close button */}
          <button 
            onClick={() => setIphoneMirroringOpen(false)}
            className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:scale-105"
            title="Close iPhone Mirroring"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Desktop Container */}
      <div className={`flex-grow relative ${stageManager ? 'pl-28' : ''}`}>
        
        {/* Interactive Desktop Widgets Grid (Dimmed when active window open) */}
        <div 
          onMouseEnter={makeInteractive}
          onMouseLeave={makeClickThrough}
          className={`desktop-widgets-grid ${anyActiveWindow && !stageManager ? 'widgets-dimmed' : ''}`}
        >
          
          {/* Widget 1: Focus SVG Progress Ring */}
          <div className="desktop-widget-item p-4 glass-card rounded-[22px] flex flex-col justify-between text-left h-36">
            <span className="font-extrabold text-[9px] text-primary dark:text-white uppercase tracking-wider block">Energy Score</span>
            <div className="flex items-center gap-4 mt-2">
              <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                {(() => {
                  const compTasks = tasks.filter(t => t.completed).length;
                  const totalTasks = tasks.length;
                  const pct = totalTasks ? Math.round((compTasks / totalTasks) * 100) : 0;
                  const radius = 24;
                  const circum = 2 * Math.PI * radius;
                  const strokeOffset = circum - (pct / 100) * circum;
                  return (
                    <>
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r={radius} className="stroke-surface-container-high/50 dark:stroke-surface-container/20" strokeWidth="6.5" fill="transparent" />
                        <circle 
                          cx="32" cy="32" r={radius} 
                          className="stroke-primary progress-ring-circle" 
                          strokeWidth="6.5" fill="transparent" 
                          strokeDasharray={circum}
                          strokeDashoffset={strokeOffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-extrabold font-mono">{pct}%</span>
                    </>
                  );
                })()}
              </div>
              <div className="leading-tight">
                <span className="text-[12px] font-bold block text-on-surface">Daily Velocity</span>
                <span className="text-[9px] text-on-surface-variant font-medium block mt-1">Focus targets checking.</span>
              </div>
            </div>
          </div>

          {/* Widget 2: Upcoming Calendar Widget */}
          <div className="desktop-widget-item p-4 glass-card rounded-[22px] text-left h-36 flex flex-col justify-between">
            <div>
              <span className="font-extrabold text-[9px] text-secondary uppercase tracking-wider block">Upcoming Events</span>
              <div className="space-y-1.5 mt-2 overflow-y-auto scroll-hide max-h-[80px]">
                {exams.length === 0 ? (
                  <p className="text-[10px] text-on-surface-variant italic">No exams scheduled.</p>
                ) : (
                  exams.slice(0, 2).map(ex => (
                    <div key={ex.id} className="text-[10px] font-semibold text-on-surface leading-tight">
                      • {ex.subject}: {ex.title}
                      <span className="block text-[8px] text-on-surface-variant font-mono mt-0.5">{ex.date} @ {ex.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Widget 3: Quick Capture note pad */}
          <div className="desktop-widget-item p-4 glass-card rounded-[22px] text-left h-36 flex flex-col justify-between">
            <span className="font-extrabold text-[9px] text-tertiary uppercase tracking-wider block">Quick Draft</span>
            <textarea
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
              className="w-full bg-transparent border-none text-[10px] text-on-surface focus:outline-none resize-none h-20 leading-relaxed mt-1"
              placeholder="Dump spontaneous thoughts..."
            />
          </div>
        </div>

        {/* Desktop folders items (Double click opens app windows) */}
        <div 
          onMouseEnter={makeInteractive}
          onMouseLeave={makeClickThrough}
          className="absolute top-10 right-10 flex flex-col gap-6 select-none z-20"
        >
          {desktopFolders.map(folder => (
            <div 
              key={folder.id}
              onDoubleClick={() => openApp(folder.targetApp)}
              onClick={() => handleFolderClick(folder)}
              className="flex flex-col items-center justify-center cursor-pointer group w-18"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-105 active:scale-95"
                style={{ backgroundColor: `${folder.color}25`, border: `1.5px solid ${folder.color}60` }}
              >
                {folder.emoji}
              </div>
              <span className="text-[10px] font-bold text-white mt-1 shadow-sm text-center truncate w-full drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]">
                {folder.name}
              </span>
            </div>
          ))}
        </div>

        {/* Windows Rendering Container */}
        {windows.map(win => renderWindow(win))}

      </div>

      {/* Folder Customization Modal (macOS customizable folders) */}
      {selectedFolderId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm rounded-[22px] p-lg space-y-md shadow-2xl text-left">
            <div className="flex justify-between items-center pb-2 border-b border-outline/10">
              <h3 className="font-headline font-bold text-body-lg text-primary flex items-center gap-1">
                <span className="material-symbols-outlined">edit_square</span> Custom Folder
              </h3>
              <button onClick={() => setSelectedFolderId(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveFolderSettings} className="space-y-sm">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">Folder Name</label>
                <input 
                  type="text"
                  value={editingFolderName}
                  onChange={(e) => setEditingFolderName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-outline/25 bg-surface-color/50 focus:outline-none focus:border-primary text-on-surface"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">Folder Emoji</label>
                  <input 
                    type="text"
                    value={editingFolderEmoji}
                    onChange={(e) => setEditingFolderEmoji(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-outline/25 bg-surface-color/50 focus:outline-none focus:border-primary text-center text-lg"
                    placeholder="📂"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">Accent Color</label>
                  <input 
                    type="color"
                    value={editingFolderColor}
                    onChange={(e) => setEditingFolderColor(e.target.value)}
                    className="w-full h-8 cursor-pointer rounded-xl bg-surface-color/50 border border-outline/25 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setSelectedFolderId(null)}
                  className="px-4 py-2 font-bold text-on-surface bg-surface-container hover:bg-surface-container-high rounded-xl text-xs"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 font-bold text-on-primary bg-primary hover:opacity-90 rounded-xl text-xs shadow-md"
                >
                  SAVE FOLDER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Plus button */}
      <button
        onClick={() => {
          setQuickAddTitle('');
          setShowQuickAddModal(true);
        }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-30 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold pulse-on-hover animate-bounce-slow"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Contextual Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md rounded-2xl p-lg space-y-md shadow-2xl">
            <div className="flex justify-between items-center text-left">
              <h3 className="font-headline font-bold text-body-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Quick Add Task
              </h3>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-sm text-left">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider font-headline">Task Title</label>
                <input
                  type="text"
                  placeholder="Type task details..."
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface/50 focus:outline-none focus:border-primary text-sm text-on-surface font-medium"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">CATEGORY</label>
                  <select
                    value={quickAddCategory}
                    onChange={(e) => setQuickAddCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface/50 text-sm focus:outline-none text-on-surface"
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
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface/50 text-sm focus:outline-none text-on-surface"
                  />
                </div>
              </div>

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

      {/* macOS Monterey / Sequoia Dock */}
      <div 
        onMouseEnter={makeInteractive}
        onMouseLeave={makeClickThrough}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 select-none"
      >
        <div className="mac-dock-container">
          
          {/* Core Apps icons */}
          {dockApps.map(app => {
            const win = windows.find(w => w.id === app.id);
            const isOpen = win?.isOpen;
            const isMinimized = win?.isMinimized;
            
            return (
              <button
                key={app.id}
                onClick={() => {
                  if (isOpen) {
                    // Toggle minimize/focus
                    if (isMinimized || activeWindowId !== app.id) {
                      focusWindow(app.id);
                    } else {
                      setWindows(prev => prev.map(w => w.id === app.id ? { ...w, isMinimized: true } : w));
                    }
                  } else {
                    setWindows(prev => prev.map(w => w.id === app.id ? { ...w, isOpen: true } : w));
                    focusWindow(app.id);
                  }
                  setShowControlCenter(false);
                  setShowNotificationCenter(false);
                }}
                className="mac-dock-item group cursor-pointer"
                title={app.label}
              >
                {/* Tooltip */}
                <span className="absolute bottom-16 bg-black/85 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
                  {app.label}
                </span>
                
                {/* Dock Icon Box */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  activeWindowId === app.id && isOpen && !isMinimized ? 
                  'bg-primary text-white shadow-md shadow-primary/20 scale-105 animate-spring-check' : 
                  'bg-white/40 dark:bg-white/10 text-on-surface-variant hover:bg-white/60 dark:hover:bg-white/15'
                }`}>
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: `'FILL' ${activeWindowId === app.id && isOpen && !isMinimized ? 1 : 0}` }}>{app.icon}</span>
                </div>
                
                {/* Active Indicator dot */}
                <div className={`w-1.5 h-1.5 bg-primary dark:bg-white rounded-full mt-1.5 transition-all duration-300 ${
                  isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`} />
              </button>
            );
          })}

          <div className="w-[1px] h-8 bg-outline/25 mx-1 align-middle self-center max-[600px]:hidden" />

          {/* iPhone Mirroring and Lock triggers (Sequoia specific apps) */}
          <button 
            onClick={() => setIphoneMirroringOpen(!iphoneMirroringOpen)}
            className="mac-dock-item group cursor-pointer max-[600px]:hidden"
            title="iPhone Mirroring"
          >
            <span className="absolute bottom-16 bg-black/85 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
              iPhone Mirroring
            </span>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              iphoneMirroringOpen ? 
              'bg-secondary text-white shadow-md' : 
              'bg-white/40 dark:bg-white/10 text-on-surface-variant hover:bg-white/60'
            }`}>
              <span className="material-symbols-outlined text-[24px]">smartphone</span>
            </div>
            <div className={`w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 transition-all duration-300 ${
              iphoneMirroringOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`} />
          </button>

          <button 
            onClick={() => setLockScreenActive(true)}
            className="mac-dock-item group cursor-pointer max-[650px]:hidden"
            title="Lock Screen"
          >
            <span className="absolute bottom-16 bg-black/85 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
              Lock Screen
            </span>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/40 dark:bg-white/10 text-on-surface-variant hover:bg-white/60">
              <span className="material-symbols-outlined text-[24px]">lock</span>
            </div>
            <div className="w-1.5 h-1.5 opacity-0 scale-50 mt-1.5" />
          </button>

        </div>
      </div>

      {/* Custom macOS-style HUD Overlay (Tahoe glass liquid effects) */}
      {hudStatus.visible && (
        <div 
          className="fixed bottom-32 left-1/2 -translate-x-1/2 w-44 p-4 rounded-[24px] border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-3 z-50 animate-fade-in pointer-events-none select-none"
          style={{
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(20px)',
            webkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            color: '#ffffff'
          }}
        >
          <span className="material-symbols-outlined text-[44px] text-white">
            {hudStatus.type === 'volume' ? (
              hudStatus.value === 0 ? 'volume_off' : hudStatus.value < 0.5 ? 'volume_down' : 'volume_up'
            ) : 'brightness_high'}
          </span>
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75"
              style={{ width: `${hudStatus.value * 100}%` }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
