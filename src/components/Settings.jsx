import React, { useRef } from 'react';

export default function Settings({
  username,
  setUsername,
  theme,
  setTheme,
  isDark,
  setIsDark,
  exportData,
  importData,
  resetAllData,
  loadTutorialDemo
}) {
  const fileInputRef = useRef(null);

  const themePresets = [
    { id: 'focus-blue', name: 'Focus Blue', color: 'bg-[#004ac6]' },
    { id: 'theme-forest-green', name: 'Forest Green', color: 'bg-[#166534]' },
    { id: 'theme-sunset-orange', name: 'Sunset Orange', color: 'bg-[#ea580c]' },
    { id: 'theme-royal-purple', name: 'Royal Purple', color: 'bg-[#7e22ce]' },
    { id: 'theme-sweet-rose', name: 'Sweet Rose', color: 'bg-[#be185d]' }
  ];

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importData(parsed);
        alert('Data backup imported successfully!');
        window.location.reload();
      } catch (err) {
        alert('Failed to parse backup file. Please make sure it is a valid JSON file exported from this app.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-lg animate-fade-in max-w-2xl mx-auto">
      {/* Page Title */}
      <div>
        <h2 className="text-headline-lg font-bold text-primary">System Settings</h2>
        <p className="text-on-surface-variant text-body-lg">
          Configure application themes, manage data backups, and customize your user profile.
        </p>
      </div>

      <div className="space-y-md">
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-md space-y-sm">
          <h3 className="text-body-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            User Profile
          </h3>
          
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">YOUR GREETING NAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full max-w-sm px-3 py-2 rounded-xl border border-outline/30 bg-surface/50 focus:outline-none focus:border-primary text-sm"
              placeholder="e.g. Alex, Sarah..."
            />
          </div>
        </div>

        {/* Aesthetic Customization */}
        <div className="glass-card rounded-2xl p-md space-y-md">
          <h3 className="text-body-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">palette</span>
            Aesthetic Themes
          </h3>

          {/* Preset Grid */}
          <div className="space-y-sm">
            <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">COLOR PRESET</label>
            <div className="flex flex-wrap gap-sm">
              {themePresets.map(preset => {
                const isActive = theme === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setTheme(preset.id)}
                    className={`px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm text-white transition-all active:scale-95 shadow-sm border-2 ${preset.color} ${isActive ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-surface border-white/50' : 'border-transparent hover:opacity-90'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isActive ? 'check_circle' : 'palette'}
                    </span>
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="space-y-sm pt-2 border-t border-outline/10">
            <label className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">APPEARANCE MODE</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDark(false)}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-all ${!isDark ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
              >
                <span className="material-symbols-outlined text-[18px]">light_mode</span>
                LIGHT MODE
              </button>
              <button
                onClick={() => setIsDark(true)}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-all ${isDark ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
              >
                <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                DARK MODE
              </button>
            </div>
          </div>
        </div>

        {/* Tutorial / Onboarding Loader */}
        <div className="glass-card rounded-2xl p-md space-y-sm">
          <h3 className="text-body-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">school</span>
            Tutorial / Demo Mode
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Need to explore with mock datasets? Click below to populate tasks, habits, and subject syllabi with sample info immediately.
          </p>
          <button
            onClick={() => {
              loadTutorialDemo();
              alert('Tutorial demo data preloaded successfully!');
              window.location.reload();
            }}
            className="px-4 py-2 bg-gradient-to-r from-primary to-tertiary text-white text-xs font-bold rounded-xl active:scale-95 hover:opacity-95 transition-all shadow-md shadow-primary/10"
          >
            LOAD TUTORIAL DEMO DATA
          </button>
        </div>

        {/* Data Management */}
        <div className="glass-card rounded-2xl p-md space-y-md">
          <h3 className="text-body-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">database</span>
            Local Database Management
          </h3>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            All data in PRODUCTIVEDUDE is strictly stored inside your local browser storage (`localStorage`). No information leaves your machine. To backup or move your data, export it below.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={exportData}
              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              EXPORT BACKUP (JSON)
            </button>
            
            <button
              onClick={handleImportClick}
              className="px-4 py-2 bg-secondary text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-secondary/20"
            >
              <span className="material-symbols-outlined text-[18px]">upload</span>
              IMPORT BACKUP (JSON)
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          <div className="pt-4 border-t border-outline/10">
            <h4 className="text-xs font-bold text-error block mb-1">DANGER ZONE</h4>
            <p className="text-[11px] text-on-surface-variant mb-2">Resets the app back to initial blank slate, wiping out tasks, habits, subjects, and records.</p>
            <button
              onClick={resetAllData}
              className="px-4 py-2 bg-error/10 hover:bg-error/20 text-error text-xs font-bold rounded-xl active:scale-95 transition-all"
            >
              RESET ALL APP DATA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
