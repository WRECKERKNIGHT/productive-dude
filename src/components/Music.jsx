import React, { useState } from 'react';

const TRACKS = [
  { id: 't1', title: 'Productive Beats', artist: 'Lofi Chill', duration: '3:24', mood: 'Focus', color: '#2563eb' },
  { id: 't2', title: 'Focus Wave', artist: 'Deep Ambient', duration: '4:02', mood: 'Focus', color: '#0ea5e9' },
  { id: 't3', title: 'Study Session', artist: 'Soft Piano', duration: '2:58', mood: 'Calm', color: '#10b981' },
  { id: 't4', title: 'Late Night Drafts', artist: 'Retro Synth', duration: '3:41', mood: 'Night', color: '#8b5cf6' },
  { id: 't5', title: 'Habit Flow', artist: 'Jazz Beats', duration: '3:12', mood: 'Chill', color: '#f59e0b' },
  { id: 't6', title: 'Deep Work Motions', artist: 'Ambient Lab', duration: '5:15', mood: 'Deep', color: '#ef4444' },
  { id: 't7', title: 'Morning Light', artist: 'Acoustic Day', duration: '2:47', mood: 'Morning', color: '#22c55e' },
  { id: 't8', title: 'Midnight Coding', artist: 'Pixel Beats', duration: '4:30', mood: 'Night', color: '#6366f1' }
];

export default function Music({ isPlaying, setIsPlaying, currentSong, setCurrentSong, volume }) {
  const [index, setIndex] = useState(() => {
    const cur = TRACKS.findIndex(t => t.title === currentSong);
    return cur >= 0 ? cur : 0;
  });

  const track = TRACKS[index];

  const play = (i) => {
    setIndex(i);
    setCurrentSong(TRACKS[i].title);
    setIsPlaying(true);
  };

  const next = () => {
    const i = (index + 1) % TRACKS.length;
    play(i);
  };

  const prev = () => {
    const i = (index - 1 + TRACKS.length) % TRACKS.length;
    play(i);
  };

  const togglePlay = () => {
    if (!isPlaying) {
      setCurrentSong(track.title);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="h-full flex flex-col space-y-md animate-fade-in text-left">
      <div>
        <p className="font-label-caps text-label-caps text-primary mb-1">AMBIENT SOUNDSCAPES</p>
        <h2 className="text-headline-md font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">music_note</span>
          Music
        </h2>
        <p className="text-on-surface-variant text-[13px]">Curated lofi and ambient beats to keep your focus locked in.</p>
      </div>

      {/* Now playing */}
      <div className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3">
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center text-[44px] shadow-lg relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${track.color}33, ${track.color}11)`, border: `2px solid ${track.color}55` }}
        >
          <div
            className={`absolute inset-0 flex items-end justify-center pb-3 ${isPlaying ? '' : 'hidden'}`}
            style={{ color: track.color }}
          >
            <div className="flex items-end gap-1">
              {[0, 1, 2, 3, 4].map(i => (
                <span key={i} className="w-1.5 rounded-full music-bar" style={{ animationDelay: `${i * 0.12}s`, backgroundColor: track.color }} />
              ))}
            </div>
          </div>
          <span className={isPlaying ? 'opacity-0' : ''}>🎵</span>
        </div>
        <div className="text-center">
          <h3 className="text-[15px] font-extrabold">{track.title}</h3>
          <p className="text-[11px] text-on-surface-variant font-medium">{track.artist} · {track.mood} vibes</p>
        </div>

        {/* Progress bar (simulated) */}
        <div className="w-full max-w-xs h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${isPlaying ? '' : 'w-[12%]'}`}
            style={{ width: isPlaying ? '46%' : '12%', background: `linear-gradient(90deg, ${track.color}, #8b5cf6)` }}
          />
        </div>
        <div className="w-full max-w-xs flex justify-between text-[8px] font-mono text-on-surface-variant">
          <span>{isPlaying ? '1:32' : '0:00'}</span>
          <span>{track.duration}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={prev} className="w-9 h-9 rounded-full bg-surface-container/60 hover:bg-surface-container flex items-center justify-center text-on-surface transition-all active:scale-90" title="Previous">
            <span className="material-symbols-outlined text-[18px]">skip_previous</span>
          </button>
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg hover:opacity-90 active:scale-95 transition-all"
            style={{ background: `linear-gradient(135deg, ${track.color}, #8b5cf6)` }}
            title="Play / Pause"
          >
            <span className="material-symbols-outlined text-[26px]">{isPlaying ? 'pause' : 'play_arrow'}</span>
          </button>
          <button onClick={next} className="w-9 h-9 rounded-full bg-surface-container/60 hover:bg-surface-container flex items-center justify-center text-on-surface transition-all active:scale-90" title="Next">
            <span className="material-symbols-outlined text-[18px]">skip_next</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full max-w-xs">
          <span className="material-symbols-outlined text-[15px] text-on-surface-variant">{volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}</span>
          <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.round(volume * 100)}%`, backgroundColor: track.color }} />
          </div>
          <span className="text-[9px] font-mono text-on-surface-variant">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      {/* Playlist */}
      <div className="glass-card rounded-2xl p-3 flex-1 min-h-0 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-secondary">queue_music</span> Playlist
          </h3>
          <span className="text-[9px] text-on-surface-variant font-mono">{TRACKS.length} tracks</span>
        </div>
        <div className="flex-1 overflow-y-auto scroll-hide space-y-1.5 min-h-[60px]">
          {TRACKS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => i === index && isPlaying ? setIsPlaying(false) : play(i)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all active:scale-[0.99] ${
                i === index ? 'bg-primary/10 border-primary/25' : 'border-outline/10 hover:bg-surface-container/60'
              }`}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-[15px]"
                style={{ backgroundColor: `${t.color}22`, border: `1px solid ${t.color}44` }}
              >
                {i === index && isPlaying ? (
                  <span className="material-symbols-outlined text-[15px]" style={{ color: t.color }}>graphic_eq</span>
                ) : (
                  <span className="material-symbols-outlined text-[15px]" style={{ color: t.color }}>music_note</span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span className={`text-[12px] font-bold block truncate ${i === index ? 'text-primary' : ''}`}>{t.title}</span>
                <span className="text-[9px] text-on-surface-variant font-medium block">{t.artist} · {t.mood}</span>
              </div>
              <span className="text-[9px] font-mono text-on-surface-variant flex-shrink-0">{t.duration}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
