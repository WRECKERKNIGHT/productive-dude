import React, { useState } from 'react';

export default function Passwords({ passwords, setPasswords }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(passwords[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [revealMap, setRevealMap] = useState({});

  // Add form states
  const [newTitle, setNewTitle] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newWebsite, setNewWebsite] = useState('');

  const selectedCred = passwords.find(p => p.id === selectedId) || passwords[0] || null;

  const filteredPasswords = passwords.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.website.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'security') {
      return matchesSearch && p.strength === 'Weak';
    }
    return matchesSearch;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUsername.trim() || !newPassword.trim()) return;

    // Assess strength simple heuristic
    let strength = 'Weak';
    if (newPassword.length > 10 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) {
      strength = 'Strong';
    } else if (newPassword.length > 7) {
      strength = 'Medium';
    }

    const newCred = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      username: newUsername.trim(),
      password: newPassword,
      website: newWebsite.trim() || 'custom',
      updated: 'Just now',
      strength
    };

    const updated = [newCred, ...passwords];
    setPasswords(updated);
    setSelectedId(newCred.id);

    // Reset
    setNewTitle('');
    setNewUsername('');
    setNewPassword('');
    setNewWebsite('');
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this credential from vault?")) {
      const updated = passwords.filter(p => p.id !== id);
      setPasswords(updated);
      if (selectedId === id && updated.length > 0) {
        setSelectedId(updated[0].id);
      }
    }
  };

  const toggleReveal = (id) => {
    setRevealMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStrengthBadge = (strength) => {
    switch (strength) {
      case 'Strong':
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-secondary/15 text-secondary border border-secondary/20">STRONG</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/20">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-error/15 text-error border border-error/20">WEAK / COMPROMISED</span>;
    }
  };

  return (
    <div className="h-full flex flex-col text-on-surface select-none">
      {/* Action Header */}
      <div className="flex justify-between items-center border-b border-outline/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">vpn_key</span>
          <h2 className="font-headline font-extrabold text-body-lg">Passwords Vault</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[14px]">add</span> Add Password
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 min-h-0">
        {/* Left App Sidebar Categories (Col span 3) */}
        <div className="md:col-span-3 space-y-2 border-r border-outline/5 pr-2">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-bold transition-all ${activeCategory === 'all' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high/30'}`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">key</span> All Passwords
            </span>
            <span className="text-[10px] font-mono opacity-65">{passwords.length}</span>
          </button>
          
          <button 
            onClick={() => setActiveCategory('security')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-bold transition-all ${activeCategory === 'security' ? 'bg-error/10 text-error' : 'hover:bg-surface-container-high/30'}`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">security</span> Security Alerts
            </span>
            <span className="text-[10px] font-mono opacity-65">{passwords.filter(p => p.strength === 'Weak').length}</span>
          </button>

          {/* Quick Stats Box */}
          <div className="p-3 bg-surface-container/30 border border-outline/10 rounded-xl space-y-1.5 text-left text-[11px] font-medium text-on-surface-variant">
            <span className="font-bold text-[10px] text-on-surface uppercase tracking-wider block mb-1">Vault Status</span>
            <div className="flex justify-between">
              <span>Security Health:</span>
              <span className="font-bold text-secondary">
                {Math.round(((passwords.filter(p => p.strength !== 'Weak').length) / (passwords.length || 1)) * 100)}% Good
              </span>
            </div>
            <div className="flex justify-between">
              <span>Encryption Status:</span>
              <span className="font-bold text-primary flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">lock</span> Local AES</span>
            </div>
          </div>
        </div>

        {/* Middle Credentials List (Col span 4) */}
        <div className="md:col-span-4 flex flex-col min-h-0 border-r border-outline/5 pr-2">
          {/* Search bar */}
          <div className="relative mb-2">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-on-surface-variant text-[16px]">search</span>
            <input 
              type="text"
              placeholder="Search credentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-outline/25 bg-surface-color/50 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Scrolling Credentials */}
          <div className="flex-1 overflow-y-auto scroll-hide space-y-1.5">
            {filteredPasswords.length === 0 ? (
              <p className="text-center text-on-surface-variant italic text-[11px] py-10">No credentials found.</p>
            ) : (
              filteredPasswords.map(cred => (
                <button
                  key={cred.id}
                  onClick={() => setSelectedId(cred.id)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between border transition-all ${selectedId === cred.id ? 'bg-primary/5 border-primary/20 shadow-sm' : 'border-transparent hover:bg-surface-container-high/30'}`}
                >
                  <div className="truncate leading-tight">
                    <span className="text-[11px] font-bold text-on-surface block truncate">{cred.title}</span>
                    <span className="text-[10px] text-on-surface-variant font-mono truncate block mt-0.5">{cred.username}</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">chevron_right</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Detail Card (Col span 5) */}
        <div className="md:col-span-5 min-h-0 flex flex-col">
          {selectedCred ? (
            <div className="flex-1 flex flex-col justify-between bg-surface-color/45 dark:bg-black/10 border border-outline/10 rounded-2xl p-4 text-left">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline font-bold text-sm text-on-surface">{selectedCred.title}</h3>
                    <span className="text-[10px] text-on-surface-variant font-mono block mt-0.5">{selectedCred.website}</span>
                  </div>
                  {getStrengthBadge(selectedCred.strength)}
                </div>

                <hr className="border-outline/10" />

                {/* Details list */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Website URL</label>
                    <a href={`https://${selectedCred.website}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      {selectedCred.website} <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Username / Account</label>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container/60 border border-outline/5 text-xs font-mono">
                      <span>{selectedCred.username}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(selectedCred.username);
                          alert('Username copied!');
                        }}
                        className="text-[13px] material-symbols-outlined text-primary hover:opacity-85"
                        title="Copy Username"
                      >
                        content_copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Password</label>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container/60 border border-outline/5 text-xs font-mono">
                      <span>{revealMap[selectedCred.id] ? selectedCred.password : '••••••••••••'}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleReveal(selectedCred.id)}
                          className="text-[15px] material-symbols-outlined text-on-surface-variant hover:text-on-surface"
                          title={revealMap[selectedCred.id] ? "Hide Password" : "Show Password"}
                        >
                          {revealMap[selectedCred.id] ? "visibility" : "visibility_off"}
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(selectedCred.password);
                            alert('Password copied!');
                          }}
                          className="text-[13px] material-symbols-outlined text-primary hover:opacity-85"
                          title="Copy Password"
                        >
                          content_copy
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-on-surface-variant font-medium">
                    Updated: {selectedCred.updated}
                  </div>
                </div>
              </div>

              {/* Action footer */}
              <div className="pt-4 border-t border-outline/10 flex justify-end gap-2">
                <button
                  onClick={() => handleDelete(selectedCred.id)}
                  className="px-3.5 py-1.5 text-xs font-bold text-error bg-error/10 hover:bg-error/15 rounded-xl transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">delete</span> Delete Record
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-surface-color/45 border border-outline/10 rounded-2xl p-md text-on-surface-variant italic text-xs">
              Select a credential record to view details.
            </div>
          )}
        </div>
      </div>

      {/* Add Password Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm rounded-[22px] p-lg space-y-md shadow-2xl">
            <div className="flex justify-between items-center text-left">
              <h3 className="font-headline font-bold text-body-lg text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px]">add_moderator</span> New Credential
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-sm text-left">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">Account Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Google, GitHub, Figma..." 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-outline/25 bg-surface-color/50 focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">Username / Email</label>
                <input 
                  type="text" 
                  placeholder="Username or email address..." 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-outline/25 bg-surface-color/50 focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  placeholder="Enter login password..." 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-outline/25 bg-surface-color/50 focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">Website URL</label>
                <input 
                  type="text" 
                  placeholder="e.g. github.com (optional)" 
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-outline/25 bg-surface-color/50 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-on-surface bg-surface-container hover:bg-surface-container-high rounded-xl text-xs"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 font-bold text-on-primary bg-primary hover:opacity-90 rounded-xl text-xs shadow-md"
                >
                  SAVE PASSWORD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
