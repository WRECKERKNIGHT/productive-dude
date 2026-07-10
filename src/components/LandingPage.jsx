import React, { useState } from 'react';

export default function LandingPage({ onStart }) {
  const [loadDemo, setLoadDemo] = useState(true);

  return (
    <div className="min-h-screen flex flex-col justify-between p-lg relative overflow-hidden bg-background text-on-surface animate-fade-in">
      {/* Decorative Shifting Mesh Globs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-tertiary/10 blur-[120px] pointer-events-none"></div>

      {/* Header Logobar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-10 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-[18px]">bolt</span>
          </div>
          <span className="font-headline font-extrabold text-body-lg tracking-tighter text-primary dark:text-white">
            PRODUCTIVEDUDE
          </span>
        </div>
        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/15 font-mono text-[10px] font-bold">
          V2.0 LIVE
        </div>
      </header>

      {/* Hero Section & Floating Cards */}
      <main className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-lg items-center z-10 my-auto py-10">
        
        {/* Hero Copy Text (Col span 7) */}
        <div className="lg:col-span-7 space-y-md text-left pr-4">
          <span className="px-4 py-1.5 rounded-full bg-surface-container/60 border border-outline/10 text-[11px] font-bold tracking-widest text-primary uppercase inline-block">
            SPATIAL LIFE OS
          </span>
          <h1 className="text-[42px] md:text-[56px] font-extrabold tracking-tight leading-[1.05] font-headline bg-gradient-to-r from-on-surface via-primary to-tertiary bg-clip-text text-transparent">
            Reclaim Your Focus.
          </h1>
          <p className="text-on-surface-variant text-body-lg md:text-xl font-medium max-w-lg leading-relaxed">
            The spatial productivity suite for hyper-focused minds. Master your syllabus, timeblock your calendar, build routines, and capture sudden thoughts instantly.
          </p>

          {/* Action and Settings Option */}
          <div className="space-y-sm pt-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => onStart(loadDemo)}
                className="px-8 py-4 bg-primary text-on-primary font-bold rounded-2xl text-md hover:scale-102 hover:shadow-lg hover:shadow-primary/20 active:scale-98 transition-all flex items-center gap-2 pulse-on-hover cursor-pointer"
              >
                ENTER LIFE OS
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              <label className="flex items-center gap-3 cursor-pointer p-3 bg-surface-container/30 border border-outline/10 rounded-xl hover:bg-surface-container/50 transition-colors">
                <input
                  type="checkbox"
                  checked={loadDemo}
                  onChange={(e) => setLoadDemo(e.target.checked)}
                  className="w-4 h-4 rounded border-outline/30 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-on-surface leading-none">Load Demo Tutorial Data</p>
                  <span className="text-[10px] text-on-surface-variant font-medium">Prepopulates items to test app features</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 3D Floating Mock Cards (Col span 5) */}
        <div className="lg:col-span-5 relative h-[360px] md:h-[400px] flex items-center justify-center select-none mt-10 lg:mt-0">
          
          {/* Card 1: Timeblock Calendar Grid */}
          <div className="glass-card absolute p-md rounded-2xl w-64 border-t-4 border-primary shadow-xl rotate-[-6deg] translate-y-[-70px] translate-x-[-30px] animate-float hover:z-20 transition-all hover:rotate-0 hover:scale-105">
            <div className="flex justify-between items-center mb-sm">
              <span className="text-[10px] font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">TUESDAY</span>
              <span className="material-symbols-outlined text-primary text-[16px]">calendar_today</span>
            </div>
            <h4 className="font-bold text-xs text-on-surface truncate">Prep for Calculus Exam</h4>
            <div className="flex justify-between items-center mt-3 text-[9px] font-bold text-on-surface-variant uppercase">
              <span>Academic</span>
              <span>09:00 - 10:30</span>
            </div>
          </div>

          {/* Card 2: Syllabus Progress */}
          <div className="glass-card absolute p-md rounded-2xl w-60 border-t-4 border-secondary shadow-xl rotate-[4deg] translate-y-[20px] translate-x-[40px] animate-float hover:z-20 transition-all hover:rotate-0 hover:scale-105" style={{ animationDelay: '1.2s' }}>
            <div className="flex justify-between items-center mb-sm">
              <span className="text-[10px] font-bold text-secondary font-mono bg-secondary/10 px-2 py-0.5 rounded">SYLLABUS</span>
              <span className="material-symbols-outlined text-secondary text-[16px]">menu_book</span>
            </div>
            <h4 className="font-bold text-xs text-on-surface truncate">Quantum Physics</h4>
            <div className="mt-3 space-y-1">
              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[66%]"></div>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-on-surface-variant">
                <span>COMPLETION</span>
                <span>66%</span>
              </div>
            </div>
          </div>

          {/* Card 3: Inbox Capture */}
          <div className="glass-card absolute p-md rounded-2xl w-56 border-t-4 border-tertiary shadow-xl rotate-[-2deg] translate-y-[110px] translate-x-[-60px] animate-float hover:z-20 transition-all hover:rotate-0 hover:scale-105" style={{ animationDelay: '2.5s' }}>
            <div className="flex justify-between items-center mb-xs">
              <span className="text-[10px] font-bold text-tertiary font-mono bg-tertiary/10 px-2 py-0.5 rounded">QUICK CAPTURE</span>
              <span className="material-symbols-outlined text-tertiary text-[16px]">bolt</span>
            </div>
            <p className="text-[11px] font-semibold text-on-surface italic leading-snug">"Draft strategy content for next week release deck."</p>
            <span className="text-[8px] text-on-surface-variant font-mono mt-2 block text-right">Captured 10:45 AM</span>
          </div>

        </div>

      </main>

      {/* Footer Copy */}
      <footer className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 z-10 border-t border-outline/10 pt-4 text-on-surface-variant text-[11px] font-semibold tracking-wide uppercase">
        <span>PRODUCTIVEDUDE © 2026</span>
        <div className="flex gap-4">
          <span>Local Storage Secure</span>
          <span>Zero Server Tracking</span>
        </div>
      </footer>
    </div>
  );
}
