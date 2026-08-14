import React, { useState, useEffect, useRef } from 'react';
import { THEME_PRESETS } from '../roles';

const THEME_IDS = THEME_PRESETS.map(t => t.id);

export default function Terminal({ username, tasks, theme, setTheme, isDark, setIsDark }) {
  const [history, setHistory] = useState([
    { text: 'PRODUCTIVEDUDE Life OS v2.0 - Secure Shell [Secure]', type: 'system' },
    { text: 'Type "help" to list available shell controls or "neofetch" for system telemetry.', type: 'system' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when history updates
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input on terminal area click
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setCmdHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Prompt line copy
    const promptLine = `productive-dude@life-os ~ % ${trimmed}`;
    let newOutputs = [{ text: promptLine, type: 'prompt' }];

    switch (command) {
      case 'help':
        newOutputs.push({
          text: `Available commands:
  help       - Display this command manual
  ls         - List simulated directories and apps
  neofetch   - Display system telemetry and system details
  tasks      - List active and completed productivity tasks
  whoami     - Output current username
  date       - Output current calendar timestamp
  theme      - View or change visual UI theme (e.g. "theme royal-purple", "theme dark")
  cat info   - Display project info and specifications
  clear      - Clear terminal logs history`,
          type: 'output'
        });
        break;

      case 'ls':
        newOutputs.push({
          text: `Applications/
  Dashboard.app    Academic.app    Capture.app
  Calendar.app     Habits.app      Settings.app
  Passwords.app    Terminal.app

Files/
  Syllabus_Reset.sh    Calendar_Matrix.xlsx    brain_dump.txt`,
          type: 'output'
        });
        break;

      case 'neofetch':
      case 'about':
        newOutputs.push({
          text: `               ,g,            OS: macOS Sequoia Simulator (v26.0)
             ,g$$$g,          Host: ProductiveDude LifeOS
           ,g$$$$$$$g,        Kernel: Gemini 3.5 Flash (Medium)
         ,g$$$$$$$$$$$g,      Uptime: 2h 45m
       ,g$$$$$P""Y$$$$$g,     Packages: Vite 8.1.0, Tailwind v4
      g$$$$$P      Y$$$$$b    Shell: zsh (Powerline terminal)
     $$$$$$          $$$$$$   Resolution: 1920x1080 (Spatial)
     $$$$$$          $$$$$$   DE: Liquid Glass (Tahoe)
     Y$$$$$b        g$$$$$P   Theme: ${theme} (${isDark ? 'Dark' : 'Light'})
      g$$$$$b,    ,d$$$$$P    Terminal: Modernized GPU Term
       "g$$$$$$$$$$$$$P"      Terminal Font: JetBrains Mono
         "g$$$$$$$$$P"        CPU: Apple M4 Max
           "g$$$$$P"          Memory: 16 GB (Unified)
             "gP"             Disk: 512 GB SSD (Local Storage Secure)`,
          type: 'output'
        });
        break;

      case 'whoami':
        newOutputs.push({ text: username, type: 'output' });
        break;

      case 'date':
        newOutputs.push({ text: new Date().toString(), type: 'output' });
        break;

      case 'tasks':
        if (tasks.length === 0) {
          newOutputs.push({ text: 'No tasks registered in the registry.', type: 'output' });
        } else {
          const taskList = tasks.map((t, idx) => 
            `[${t.completed ? 'x' : ' '}] ${idx + 1}. ${t.title} (${t.category}) - Due: ${t.date}`
          ).join('\n');
          newOutputs.push({ text: `Total Tasks registered: ${tasks.length}\n\n${taskList}`, type: 'output' });
        }
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'cat':
        if (args[0] === 'info') {
          newOutputs.push({
            text: `PRODUCTIVEDUDE LIFE OS (v2.0)
Developed by team Antigravity.
Technology Stack: React 19 + Tailwind CSS v4 + Vite + local state sync.
Storage architecture: Isolated Web LocalStorage, 100% telemetry secure.
Glass Material: Tahoe Liquid Refraction blur(28px).`,
            type: 'output'
          });
        } else if (args[0] === 'brain_dump.txt') {
          newOutputs.push({ text: `Initializing brain dump viewer...`, type: 'output' });
        } else {
          newOutputs.push({ text: `Usage: cat [file_name] (e.g. cat info)`, type: 'error' });
        }
        break;

      case 'theme':
        if (!args[0]) {
          newOutputs.push({ text: `Current theme: ${theme}. Mode: ${isDark ? 'Dark' : 'Light'}.\nUse "theme <name>" to change. Options: ${THEME_IDS.join(', ')}, dark, light`, type: 'output' });
        } else {
          const target = args[0].toLowerCase();
          if (target === 'dark') {
            setIsDark(true);
            newOutputs.push({ text: 'Switched to Sleek Dark Mode.', type: 'success' });
          } else if (target === 'light') {
            setIsDark(false);
            newOutputs.push({ text: 'Switched to Clean Light Mode.', type: 'success' });
          } else if (THEME_IDS.includes(target)) {
            setTheme(target);
            newOutputs.push({ text: `Theme visual preset changed to: ${target}`, type: 'success' });
          } else if (target === 'green') {
            setTheme('theme-forest-green');
            newOutputs.push({ text: `Theme preset changed to: theme-forest-green`, type: 'success' });
          } else if (target === 'orange') {
            setTheme('theme-sunset-orange');
            newOutputs.push({ text: `Theme preset changed to: theme-sunset-orange`, type: 'success' });
          } else if (target === 'purple') {
            setTheme('theme-royal-purple');
            newOutputs.push({ text: `Theme preset changed to: theme-royal-purple`, type: 'success' });
          } else if (target === 'rose') {
            setTheme('theme-sweet-rose');
            newOutputs.push({ text: `Theme preset changed to: theme-sweet-rose`, type: 'success' });
          } else if (target === 'blue') {
            setTheme('focus-blue');
            newOutputs.push({ text: `Theme preset changed to: focus-blue`, type: 'success' });
          } else {
            newOutputs.push({ text: `Invalid theme preset. Available presets: ${THEME_IDS.join(', ')}, dark, light`, type: 'error' });
          }
        }
        break;

      default:
        newOutputs.push({ text: `zsh: command not found: ${command}. Type "help" to list available commands.`, type: 'error' });
    }

    setHistory(prev => [...prev, ...newOutputs]);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col h-full bg-[#0d0f17] rounded-xl text-left font-mono text-xs overflow-hidden select-text border border-white/5 shadow-2xl relative"
      onClick={handleTerminalClick}
    >
      {/* Powerline Terminal Screen Header */}
      <div className="bg-[#181a24] px-4 py-2 border-b border-[#2d3142] flex justify-between items-center select-none flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[10px] font-bold text-[#a0a5c0] tracking-wider uppercase font-sans">productive-dude — zsh</span>
        <div className="w-12" /> {/* spacing */}
      </div>

      {/* Terminal History Container */}
      <div className="flex-1 p-3 overflow-y-auto scroll-hide space-y-1.5 scroll-smooth">
        {history.map((log, idx) => {
          let colorClass = 'text-[#ccd6f6]';
          if (log.type === 'prompt') {
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="bg-primary text-white px-2 py-0.5 rounded-l text-[10px] font-bold">zsh</span>
                <span className="bg-[#2d3142] text-[#ccd6f6] px-2 py-0.5 rounded-r text-[10px] font-bold">~</span>
                <span className="text-[#a6e22e] font-bold">{log.text.substring(log.text.indexOf('%') + 1)}</span>
              </div>
            );
          }
          if (log.type === 'system') colorClass = 'text-on-surface-variant/80';
          if (log.type === 'error') colorClass = 'text-error font-bold';
          if (log.type === 'success') colorClass = 'text-secondary font-bold';
          
          return (
            <pre key={idx} className={`whitespace-pre-wrap leading-relaxed ${colorClass}`}>
              {log.text}
            </pre>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Input prompt line */}
      <div className="p-3 bg-[#0d0f17] border-t border-[#1b1e2c] flex items-center gap-2 flex-shrink-0 select-none">
        <div className="flex items-center">
          <span className="bg-primary text-white px-2 py-0.5 rounded-l text-[10px] font-bold">zsh</span>
          <span className="bg-[#2d3142] text-[#ccd6f6] px-2 py-0.5 rounded-r text-[10px] font-bold">~</span>
          <span className="text-[#a6e22e] font-bold ml-2">%</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none text-[#a6e22e] focus:outline-none font-bold"
          autoFocus
          placeholder="Type command..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
