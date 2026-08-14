import React, { useEffect, useRef, useState } from 'react';
import { ROLES, THEME_PRESETS } from '../roles';
import { clamp, easeInOut, sectionProgress, velocitySkew } from '../lib/scrollfx';

const getThemeAccent = (id) => (THEME_PRESETS.find(t => t.id === id) || THEME_PRESETS[0]).accent;

const APP_FEATURES = [
  { icon: 'check_circle', title: 'Tasks', desc: 'Daily to-do engine with categories & due times', color: 'theme-forest-green' },
  { icon: 'repeat', title: 'Habit Tracker', desc: 'Build streaks that stick with weekly grids', color: 'theme-sunset-orange' },
  { icon: 'timer', title: 'Pomodoro', desc: 'Deep-focus sprint timer with lo-fi soundscape', color: 'theme-royal-purple' },
  { icon: 'menu_book', title: 'Syllabus', desc: 'Subject planners, exams & GPA progress', color: 'theme-teal' },
  { icon: 'calendar_month', title: 'Calendar', desc: 'Timeblock every hour of your day', color: 'theme-cyber-pink' },
  { icon: 'sticky_note_2', title: 'Notes', desc: 'Role-tagged thoughts, always at hand', color: 'theme-amber-gold' },
  { icon: 'music_note', title: 'Music', desc: 'Cultivate calm with ambient vibes', color: 'theme-mint-aqua' },
  { icon: 'workspaces', title: 'Role Hub', desc: 'One workspace per career — curated', color: 'theme-navy-slate' },
  { icon: 'monitoring', title: 'Analytics', desc: 'See your momentum in beautiful charts', color: 'theme-lavender' },
  { icon: 'flag', title: 'Goals', desc: 'Break big dreams into checkable wins', color: 'theme-sweet-rose' }
];

const PILLARS = [
  {
    icon: 'event_available',
    title: 'Plan the Day',
    desc: 'Wake at your hour, timeblock the rhythm, set the daily goal from your focus window.',
    img: '/img/hero/slide-plan.jpg'
  },
  {
    icon: 'psychology',
    title: 'Focus Deeply',
    desc: 'Enter flow with Pomodoro sprints, lo-fi sound and a clean distraction-free stage.',
    img: '/img/hero/slide-focus.jpg'
  },
  {
    icon: 'emoji_events',
    title: 'Achieve Big',
    desc: 'Log wins, watch streaks and analytics bloom into the person your future self expects.',
    img: '/img/hero/slide-achieve.jpg'
  }
];

// Horizontal track-lock gallery (concept: axis flipping). Vertical scroll drives
// a pinned horizontal slide across a wider-than-viewport strip of panels.
const HORIZONTAL_PANELS = [
  { n: '01', icon: 'add_box', title: 'Capture', desc: 'Sudden thought? Snag it in the capture inbox before it escapes.', img: '/img/hero/slide-planning.jpg', accent: 'theme-forest-green' },
  { n: '02', icon: 'calendar_month', title: 'Plan', desc: 'Timeblock the day from wake time to peak focus window.', img: '/img/hero/slide-plan.jpg', accent: 'theme-sunset-orange' },
  { n: '03', icon: 'timer', title: 'Focus', desc: 'Pomodoro sprints with lo-fi ambience and zero noise.', img: '/img/hero/slide-focus.jpg', accent: 'theme-royal-purple' },
  { n: '04', icon: 'emoji_events', title: 'Achieve', desc: 'Log the win, grow the streak, watch the analytics climb.', img: '/img/hero/slide-achieve.jpg', accent: 'theme-teal' },
  { n: '05', icon: 'groups', title: 'Together', desc: 'Notes, goals and roles — one OS shared across every craft.', img: '/img/misc/team-collab.jpg', accent: 'theme-cyber-pink' },
  { n: '06', icon: 'rocket_launch', title: 'Ship', desc: 'End the day knowing exactly what you shipped.', img: '/img/misc/workspace.jpg', accent: 'theme-navy-slate' }
];

// Pinned scroll timeline: a central product "assembles" as scroll progress moves
// from 0 → 100%, mirroring Apple-style pinned frame reveals without a canvas.
const ASSEMBLY_PARTS = [
  { icon: 'bolt', label: 'Life OS core', dx: 0, dy: 0, rot: 0, size: 'text-[64px]', accent: 'theme-sweet-rose' },
  { icon: 'check_circle', label: 'Tasks', dx: -260, dy: -170, rot: -32, size: 'text-[30px]', accent: 'theme-forest-green' },
  { icon: 'local_fire_department', label: 'Habits', dx: 250, dy: -190, rot: 26, size: 'text-[30px]', accent: 'theme-sunset-orange' },
  { icon: 'timer', label: 'Focus', dx: -280, dy: 150, rot: -18, size: 'text-[30px]', accent: 'theme-royal-purple' },
  { icon: 'monitoring', label: 'Analytics', dx: 250, dy: 160, rot: 38, size: 'text-[30px]', accent: 'theme-teal' },
  { icon: 'music_note', label: 'Sound', dx: 0, dy: -250, rot: 12, size: 'text-[30px]', accent: 'theme-cyber-pink' }
];

const ASSEMBLY_STEPS = [
  { title: 'Pick your role', desc: 'Claim your craft from 14 real careers.', start: 0.0, end: 0.33 },
  { title: 'Load your tools', desc: 'Features snap into place around your Life OS.', start: 0.33, end: 0.66 },
  { title: 'Enter Life OS', desc: 'Your dashboard, dock and analytics come online.', start: 0.66, end: 1.0 }
];

// Clip-path reveal: a tiny circular photo expands to fill the screen while the
// headline unmasks line-by-line, like text being written live by light.
const REVEAL_LINES = [
  { text: 'One app.', accent: false },
  { text: 'Every role.', accent: false },
  { text: 'Your rules.', accent: true }
];

// 2.5D depth parallax: layered stock photography where each plane reacts to both
// scroll position (parallax) and scroll velocity (smear), faking real focal depth.
const DEPTH_LAYERS = [
  { img: '/img/misc/workspace.jpg', factor: 14, scale: 1.22, speed: 1 },
  { img: '/img/misc/team-collab.jpg', factor: 30, scale: 1.18, speed: 2 },
  { img: '/img/hero/slide-planning.jpg', factor: 52, scale: 1.24, speed: 3 }
];

// Kinetic typography: the hero headline behaves like elastic material. Fast
// scroll stretches words horizontally + skews them; momentum decay pulls them
// back to rest, while a slow scroll parallax drifts the whole lockup upward.
const KINETIC_LINE_1 = ['Reclaim', 'your', 'focus,'];
const KINETIC_LINE_2 = ['master', 'your', 'craft.'];

export default function LandingPage({ onStart }) {
  const [loadDemo, setLoadDemo] = useState(true);
  const rootRef = useRef(null);
  const engineRef = useRef({ scroll: 0, max: 0, velocity: 0 });
  const horizontalRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  const assemblyRef = useRef(null);
  const assemblyStageRef = useRef(null);
  const clipRef = useRef(null);
  const clipCircleRef = useRef(null);
  const parallaxRef = useRef(null);
  const parallaxLayersRef = useRef([]);
  const heroParallaxRef = useRef(null);
  const heroWordsRef = useRef([]);

  // Kinetic typography: elastic word stretch + skew driven by scroll velocity,
  // with a slow upward drift from the hero's own scroll progress.
  useEffect(() => {
    const root = rootRef.current;
    const wrapper = heroParallaxRef.current;
    const words = heroWordsRef.current;
    if (!root || !wrapper || words.length === 0) return;

    const smooth = { x: 0, skew: 0 };
    let raf = 0;

    const tick = () => {
      const { scroll, velocity } = engineRef.current;
      const heroP = Math.min(Math.max(scroll / Math.max(root.clientHeight, 1), 0), 1);

      const targetX = Math.min(Math.abs(velocity) * 0.055, 0.42);
      const targetSkew = Math.max(Math.min(velocity * 1.2, 12), -12);
      smooth.x += (targetX - smooth.x) * 0.09;
      smooth.skew += (targetSkew - smooth.skew) * 0.09;

      words.forEach((w, i) => {
        const lag = Math.max(0, smooth.x - i * 0.012);
        w.style.transform = `scaleX(${1 + lag}) skewX(${smooth.skew * 0.6}deg)`;
      });

      wrapper.style.transform = `translate3d(0, ${heroP * -70}px, 0)`;
      wrapper.style.opacity = `${1 - heroP * 0.6}`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  // 2.5D depth parallax: three photo planes drift at different rates and smear
  // with scroll velocity, settling back into place when motion stops.
  useEffect(() => {
    const root = rootRef.current;
    const section = parallaxRef.current;
    if (!root || !section) return;

    let raf = 0;

    const tick = () => {
      const { velocity } = engineRef.current;
      const p = sectionProgress(engineRef.current, section, root.clientHeight);
      const center = p - 0.5;

      parallaxLayersRef.current.forEach((el, i) => {
        if (!el) return;
        const layer = DEPTH_LAYERS[i];
        const base = center * -layer.factor;
        const nudge = layer.speed * velocity * 1.4;
        const smear = Math.abs(velocity) * 0.25;
        el.style.transform = `translate3d(0, ${base + nudge}px, 0) scale(${layer.scale})`;
        el.style.filter = `blur(${Math.min(smear, 6)}px) saturate(${1 + Math.min(Math.abs(velocity) * 0.01, 0.2)})`;
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  // Velocity-safe clip-path reveal: circle diameter + per-line insets are driven
  // directly by scroll progress of the pinned section.
  useEffect(() => {
    const root = rootRef.current;
    const section = clipRef.current;
    const circle = clipCircleRef.current;
    if (!root || !section || !circle) return;

    const lines = Array.from(circle.querySelectorAll('.tm-line'));

    let raf = 0;

    const tick = () => {
      const p = sectionProgress(engineRef.current, section, root.clientHeight);
      const ease = easeInOut(p);

      circle.style.clipPath = `circle(${5 + ease * 115}% at 50% 50%)`;
      circle.style.opacity = ease > 0.01 ? 1 : 0;

      lines.forEach((line, i) => {
        const start = i / lines.length;
        const end = (i + 1) / lines.length;
        const local = clamp((p - start) / (end - start), 0, 1);
        const reveal = easeInOut(local);
        line.style.clipPath = `inset(0 0 ${(1 - reveal) * 100}% 0)`;
        line.style.transform = `translateY(${(1 - reveal) * -18}px)`;
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  // Pinned scroll timeline: assembly parts converge + stage rotates on scroll
  // progress; milestone text panels crossfade at thresholds.
  useEffect(() => {
    const root = rootRef.current;
    const section = assemblyRef.current;
    const stage = assemblyStageRef.current;
    if (!root || !section || !stage) return;

    const parts = Array.from(stage.querySelectorAll('.tm-part'));
    const panels = Array.from(stage.querySelectorAll('.tm-panel'));
    const bar = stage.querySelector('.tm-bar');
    const counter = stage.querySelector('.tm-counter');

    let raf = 0;
    let lastP = -1;

    const tick = () => {
      const { velocity } = engineRef.current;
      const p = sectionProgress(engineRef.current, section, root.clientHeight);
      const ease = easeInOut(p);
      const settle = Math.abs(p - lastP) < 0.001 && Math.abs(velocity) < 0.2;
      lastP = p;

      parts.forEach((part, i) => {
        const cfg = ASSEMBLY_PARTS[i];
        const sx = (1 - ease) * cfg.dx;
        const sy = (1 - ease) * cfg.dy;
        const rot = (1 - ease) * cfg.rot;
        const back = (1 - ease) * 60;
        const scale = 0.55 + 0.45 * ease;
        part.style.transform = `translate(${sx}px, ${sy}px) rotate(${rot}deg) rotateY(${back}deg) scale(${scale})`;
        part.style.opacity = ease > 0.02 ? Math.min(1, ease * 4) : 0;
      });

      const spin = settle ? lastP * 360 : ease * 360;
      stage.style.transform = `rotateX(${ease * -8}deg) rotateY(${spin}deg)`;
      stage.style.filter = settle ? 'none' : `blur(${(1 - ease) * 2}px)`;

      if (bar) bar.style.transform = `scaleY(${ease})`;
      if (counter) counter.textContent = `${Math.round(ease * 100)}%`;

      panels.forEach((panel) => {
        const step = ASSEMBLY_STEPS[Number(panel.dataset.i)];
        const local = (p - step.start) / (step.end - step.start);
        const show = Math.min(Math.max(local, 0), 1);
        panel.style.opacity = show;
        panel.style.transform = `translateY(${(1 - show) * 24}px)`;
        panel.style.visibility = show > 0 ? 'visible' : 'hidden';
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  // Horizontal track lock: vertical scroll maps to horizontal travel across the
  // pinned gallery, with a velocity skew that settles back to zero when stopped.
  useEffect(() => {
    const root = rootRef.current;
    const section = horizontalRef.current;
    const track = horizontalTrackRef.current;
    if (!root || !section || !track) return;

    let raf = 0;
    let range = 0;

    const measure = () => {
      const viewport = root.clientWidth;
      range = Math.max(track.scrollWidth - viewport, 1);
    };
    measure();
    window.addEventListener('resize', measure);

    const tick = () => {
      const { velocity } = engineRef.current;
      const p = sectionProgress(engineRef.current, section, root.clientHeight);
      const skew = velocitySkew(velocity);
      track.style.transform = `translate3d(${-p * range}px, 0, 0) skewX(${skew}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Smooth inertia & momentum scrolling (lerp physics).
  // Wheel input drives a virtual target; a requestAnimationFrame loop eases the
  // actual scrollTop toward it every frame, producing weightful momentum and a
  // live velocity value (px/frame) consumed by velocity-based FX across the deck.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let target = root.scrollTop;
    let current = root.scrollTop;
    let raf = 0;
    let last = performance.now();
    let smoothVel = 0;

    const maxScroll = () => root.scrollHeight - root.clientHeight;

    const apply = (delta) => {
      const max = maxScroll();
      const atTop = target <= 0 && delta < 0;
      const atBottom = target >= max && delta > 0;
      const d = (atTop || atBottom) ? delta * 0.22 : delta; // edge resistance
      target = Math.min(Math.max(target + d, 0), max);
    };

    const onWheel = (e) => {
      e.preventDefault();
      apply(e.deltaY);
    };

    const onKey = (e) => {
      const page = root.clientHeight;
      const half = page * 0.5;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (isTyping) return;
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          e.preventDefault();
          apply(e.key === 'ArrowDown' ? half : -half);
          break;
        case 'PageDown':
        case 'PageUp':
        case ' ':
          e.preventDefault();
          apply(e.key === 'PageUp' ? -page : page);
          break;
        case 'Home':
          e.preventDefault();
          target = 0;
          break;
        case 'End':
          e.preventDefault();
          target = maxScroll();
          break;
        default:
          break;
      }
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const prev = current;
      const ease = 1 - Math.pow(0.001, dt);
      current += (target - current) * ease;
      const vel = dt > 0 ? (current - prev) / dt / 60 : 0;
      smoothVel += (vel - smoothVel) * 0.12;
      root.scrollTop = current;
      engineRef.current.scroll = current;
      engineRef.current.max = maxScroll();
      engineRef.current.velocity = smoothVel;
      if (Math.abs(target - current) < 0.05) {
        current = target;
        root.scrollTop = target;
        smoothVel *= 0.92;
        engineRef.current.velocity = smoothVel;
      }
      raf = requestAnimationFrame(tick);
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    raf = requestAnimationFrame(tick);

    engineRef.current.goto = (y) => {
      target = Math.min(Math.max(y, 0), maxScroll());
    };
    engineRef.current.gotoSlide = (i) => {
      const slides = root.querySelectorAll('.scroll-snap-child');
      if (slides[i]) target = slides[i].offsetTop;
    };

    return () => {
      root.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Reveal-on-scroll choreography for the whole scroll-snap deck
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Track the active slide on the progress rail (driven by the lerp engine)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const slides = root.querySelectorAll('.scroll-snap-child');
    const rails = root.querySelectorAll('.slide-rail button');
    const counter = root.querySelector('.slide-rail .rail-counter');
    if (slides.length === 0) return;
    const total = slides.length;

    let raf = 0;
    const tick = () => {
      const idx = clamp(Math.round(engineRef.current.scroll / Math.max(root.clientHeight, 1)), 0, total - 1);
      rails.forEach((btn, i) => btn.classList.toggle('active', i === idx));
      if (counter) counter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 3D tilt on toon-cards
  const handleTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateY(${x * 12}deg) rotateX(${y * -12}deg) translateZ(18px)`;
  };
  const resetTilt = (e) => {
    e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
  };

  const scrollToSlide = (i) => {
    engineRef.current.gotoSlide?.(i);
  };

  const careers = [...ROLES, ...ROLES];

  return (
    <div ref={rootRef} className="scroll-snap-y h-screen bg-background text-on-surface select-none" style={{ scrollSnapType: 'none' }}>
      <div className="slide-rail" style={{ color: 'var(--primary)' }}>
        {['Home', 'Careers', 'Axis Flip', 'Assembly', 'Reveal', 'Depth', 'Method', 'Suite', 'Enter'].map((label, i) => (
          <button key={label} onClick={() => scrollToSlide(i)} title={label} aria-label={label} />
        ))}
        <div className="rail-counter mt-2 px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] font-extrabold text-center">01 / 09</div>
      </div>

      {/* ===================== SLIDE 1 — HERO ===================== */}
      <section className="scroll-snap-child flex flex-col justify-between overflow-hidden">
        <img
          src="/img/hero/slide-focus.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center shadow-md shadow-primary/30">
              <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <span className="font-headline font-extrabold text-xl tracking-tighter text-white">
              PRODUCTIVEDUDE
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white font-mono text-[10px] font-bold tracking-widest">
            V2.0 · LIFE OS
          </div>
        </header>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-10">
          <div className="lg:col-span-7 text-left">
            <div className="reveal flex items-center gap-2 mb-5">
              <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/25 text-[11px] font-bold tracking-[0.25em] text-white uppercase">
                The Spatial Life Operating System
              </span>
            </div>
            <div ref={heroParallaxRef} className="will-change-transform">
              <h1 className="reveal reveal-delay-1 font-classic text-[54px] md:text-[76px] leading-[1.02] text-white">
                <span className="block whitespace-nowrap">
                  {KINETIC_LINE_1.map((w) => (
                    <span key={w} ref={(el) => { if (el) heroWordsRef.current.push(el); }} className="inline-block will-change-transform">
                      {w}&nbsp;
                    </span>
                  ))}
                </span>
                <span className="block whitespace-nowrap italic" style={{ color: 'var(--primary)' }}>
                  {KINETIC_LINE_2.map((w) => (
                    <span key={w} ref={(el) => { if (el) heroWordsRef.current.push(el); }} className="inline-block will-change-transform">
                      {w}&nbsp;
                    </span>
                  ))}
                </span>
              </h1>
            </div>
            <p className="reveal reveal-delay-2 mt-6 text-white/80 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              A curated personal OS that grows with your career — planner, syllabus, habits,
              Pomodoro, notes and analytics in one beautifully themed workspace.
            </p>

            <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-9">
              <button
                onClick={() => onStart(loadDemo)}
                className="toon-btn px-9 py-4 bg-primary text-white font-extrabold rounded-2xl text-md shadow-hard-lg flex items-center gap-2 hover:scale-102 hover:shadow-primary/30 active:scale-98 transition-all cursor-pointer"
              >
                ENTER LIFE OS
                <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
              </button>
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl hover:bg-white/15 transition-colors">
                <input
                  type="checkbox"
                  checked={loadDemo}
                  onChange={(e) => setLoadDemo(e.target.checked)}
                  className="w-4 h-4 rounded border-white/40 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-none">Load Demo Tutorial Data</p>
                  <span className="text-[10px] text-white/60 font-medium">Prepopulates items to test app features</span>
                </div>
              </label>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[380px] hidden md:block">
            <div
              className="toon-card absolute p-4 rounded-2xl w-64 border-t-4 border-primary shadow-hard-lg bg-white/95 rotate-[-6deg] translate-x-[-10px] translate-y-[0px] tilt-3d"
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">FOCUS SPRINT</span>
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
              </div>
              <div className="text-[34px] font-extrabold text-on-surface tabular-nums">24:32</div>
              <div className="mt-1 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[82%]"></div>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-on-surface-variant uppercase mt-1">
                <span>Deep work</span>
                <span>82%</span>
              </div>
            </div>
            <div
              className="toon-card absolute p-4 rounded-2xl w-60 border-t-4 border-secondary shadow-hard bg-white/95 rotate-[4deg] translate-x-[150px] translate-y-[120px] tilt-3d"
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              style={{ animationDelay: '1.2s' }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-secondary font-mono bg-secondary/10 px-2 py-0.5 rounded">HABIT STREAK</span>
                <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </div>
              <div className="flex gap-1 mt-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={d + i} className={`flex-1 h-8 rounded-md flex items-center justify-center text-[10px] font-bold ${i < 5 ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                    {d}
                  </div>
                ))}
              </div>
              <div className="text-[9px] font-bold text-on-surface-variant uppercase mt-2">5-day streak · on fire</div>
            </div>
            <div
              className="toon-card absolute p-4 rounded-2xl w-52 border-t-4 border-tertiary shadow-hard bg-white/95 rotate-[-2deg] translate-x-[180px] translate-y-[-30px] tilt-3d"
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-tertiary font-mono bg-tertiary/10 px-2 py-0.5 rounded">DAILY WIN</span>
                <span className="material-symbols-outlined text-tertiary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              </div>
              <p className="text-[11px] font-semibold text-on-surface italic leading-snug">"Shipped the release deck before lunch."</p>
              <span className="text-[8px] text-on-surface-variant font-mono mt-2 block text-right">Logged 09:12 AM</span>
            </div>
            <div className="absolute top-10 right-8 w-24 h-24 rounded-full blob deco-bounce" style={{ backgroundColor: 'var(--tertiary)', opacity: 0.7 }} />
            <div className="absolute bottom-8 left-2 w-16 h-16 rounded-full blob" style={{ backgroundColor: 'var(--primary)', opacity: 0.6 }} />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-6 flex items-center justify-center">
          <span className="scroll-mouse" />
        </div>
      </section>

      {/* ===================== SLIDE 2 — CAREER ICONS ===================== */}
      <section className="scroll-snap-child flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 dots-pattern opacity-40" />
        <div className="orb orb-float top-[-10%] left-[-10%] w-[45vw] h-[45vw]" style={{ backgroundColor: 'var(--primary)' }} />
        <div className="orb orb-float bottom-[-15%] right-[-10%] w-[40vw] h-[40vw]" style={{ backgroundColor: 'var(--tertiary)', animationDelay: '-6s' }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
          <span className="reveal px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-[0.25em] uppercase inline-block">
            One OS, Every Craft
          </span>
          <h2 className="reveal reveal-delay-1 font-classic text-[40px] md:text-[58px] mt-4">
            Built for <span className="italic" style={{ color: 'var(--primary)' }}>14 real careers.</span>
          </h2>
          <p className="reveal reveal-delay-2 text-on-surface-variant text-lg font-medium max-w-2xl mx-auto mt-4 leading-relaxed">
            From student to surgeon, chef to founder — each role ships with its own curated
            features, tools and sample plans.
          </p>
        </div>

        <div className="reveal reveal-delay-3 marquee-mask mt-12 w-full overflow-hidden">
          <div className="marquee-track">
            {careers.map((role, i) => (
              <div
                key={role.id + i}
                className="toon-card shrink-0 w-40 p-4 rounded-2xl text-center"
                style={{ backgroundColor: `${role.accent}14`, borderColor: `${role.accent}55` }}
              >
                <img
                  src={role.image}
                  alt={role.name}
                  className="w-14 h-14 mx-auto rounded-full object-cover border-2 mb-2"
                  style={{ borderColor: role.accent }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="text-2xl">{role.emoji}</div>
                <div className="text-[11px] font-extrabold mt-1" style={{ color: role.accent }}>{role.name}</div>
                <div className="text-[9px] text-on-surface-variant font-medium capitalize mt-0.5">{role.tagline}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal reveal-delay-4 relative z-10 mt-10 flex flex-wrap justify-center gap-3 px-6">
          {ROLES.slice(0, 6).map((role, i) => (
            <span key={role.id} className="sticker px-3 py-1.5 rounded-xl text-[11px] font-extrabold text-white shadow-hard" style={{ backgroundColor: role.accent, transform: `rotate(${(i % 3) - 1}deg)` }}>
              {role.emoji} {role.name}
            </span>
          ))}
        </div>
      </section>

      {/* ===================== SLIDE — HORIZONTAL TRACK LOCK ===================== */}
      <section ref={horizontalRef} className="relative" style={{ height: '320vh' }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 stripes-pattern opacity-20" />
          <div className="orb orb-float top-[-20%] right-[-10%] w-[40vw] h-[40vw]" style={{ backgroundColor: 'var(--primary)' }} />

          <div className="relative z-10 px-6 pb-8 max-w-6xl mx-auto w-full flex items-end justify-between">
            <div>
              <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-[0.25em] uppercase inline-block">
                Axis Flip · Horizontal Track
              </span>
              <h2 className="reveal reveal-delay-1 font-classic text-[36px] md:text-[52px] mt-4">
                The whole day, <span className="italic" style={{ color: 'var(--primary)' }}>sideways.</span>
              </h2>
            </div>
            <span className="hidden md:block font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Vertical scroll → horizontal journey
            </span>
          </div>

          <div ref={horizontalTrackRef} className="relative z-10 flex items-center gap-5 pl-[6vw] will-change-transform">
            {HORIZONTAL_PANELS.map((panel) => (
              <div
                key={panel.n}
                className="toon-card shrink-0 w-[70vw] md:w-[440px] rounded-3xl overflow-hidden shadow-hard"
                style={{ borderColor: getThemeAccent(panel.accent) }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={panel.img} alt={panel.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-4 left-4 font-mono text-[13px] font-extrabold text-white/80">{panel.n}</div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: getThemeAccent(panel.accent) }}>
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{panel.icon}</span>
                    </span>
                    <h3 className="font-headline font-extrabold text-white text-xl">{panel.title}</h3>
                  </div>
                </div>
                <div className="p-5 bg-white/95 dark:bg-black/30 text-left">
                  <p className="text-[12px] text-on-surface-variant font-medium leading-relaxed">{panel.desc}</p>
                </div>
              </div>
            ))}
            <div className="shrink-0 px-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-[42px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SLIDE — PINNED SCROLL TIMELINE ===================== */}
      <section ref={assemblyRef} className="relative" style={{ height: '320vh' }}>
        <div ref={assemblyStageRef} className="sticky top-0 h-screen flex items-center justify-center overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 dots-pattern opacity-30" />
          <div className="orb orb-float top-[-15%] left-[-10%] w-[38vw] h-[38vw]" style={{ backgroundColor: 'var(--secondary)' }} />
          <div className="orb orb-float bottom-[-20%] right-[-8%] w-[42vw] h-[42vw]" style={{ backgroundColor: 'var(--primary)', animationDelay: '-7s' }} />

          {/* Progress column */}
          <div className="absolute left-5 md:left-10 top-1/2 -translate-y-1/2 z-20 flex items-center gap-3">
            <div className="w-1 h-40 md:h-56 bg-surface-container rounded-full overflow-hidden relative">
              <div className="tm-bar absolute inset-0 bg-primary origin-top" style={{ transform: 'scaleY(0)' }} />
            </div>
            <div className="text-left">
              <div className="tm-counter font-mono text-[22px] md:text-[30px] font-extrabold text-primary tabular-nums">0%</div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Assembling</div>
            </div>
          </div>

          {/* Assembly stage */}
          <div className="relative z-10 w-[300px] h-[300px] md:w-[380px] md:h-[380px]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/25" style={{ animation: 'spin-slow 30s linear infinite' }} />
            <div className="absolute inset-8 rounded-full border border-secondary/20" />

            {ASSEMBLY_PARTS.map((part) => (
              <div
                key={part.label}
                className={`tm-part absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className="toon-card flex flex-col items-center justify-center gap-1 rounded-2xl shadow-hard px-4 py-3"
                  style={{ borderColor: getThemeAccent(part.accent), width: '110px' }}
                >
                  <span className={`material-symbols-outlined ${part.size}`} style={{ color: getThemeAccent(part.accent), fontVariationSettings: "'FILL' 1" }}>
                    {part.icon}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-on-surface-variant">{part.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Milestone panels */}
          <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-2xl">
            {ASSEMBLY_STEPS.map((step, i) => (
              <div
                key={step.title}
                data-i={i}
                className="tm-panel absolute inset-x-0 toon-card rounded-2xl p-4 md:p-5 shadow-hard bg-white/95 dark:bg-black/40 text-center"
                style={{ opacity: 0, visibility: 'hidden' }}
              >
                <div className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                  {String(i + 1).padStart(2, '0')} / {String(ASSEMBLY_STEPS.length).padStart(2, '0')}
                </div>
                <div className="font-headline font-extrabold text-lg md:text-xl">{step.title}</div>
                <div className="text-[11px] text-on-surface-variant font-medium mt-1">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SLIDE — CLIP-PATH CIRCLE REVEAL ===================== */}
      <section ref={clipRef} className="relative" style={{ height: '240vh' }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-background" />

          <div ref={clipCircleRef} className="absolute inset-0" style={{ clipPath: 'circle(5% at 50% 50%)', opacity: 0 }}>
            <img src="/img/hero/slide-team.jpg" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
          </div>

          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
            <span className="tm-line reveal px-4 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/30 text-white text-[11px] font-bold tracking-[0.25em] uppercase inline-block">
              Revealed By Scroll
            </span>
            <h2 className="font-classic text-[44px] md:text-[72px] leading-[1.06] mt-6 text-white" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.4)' }}>
              {REVEAL_LINES.map((line) => (
                <span key={line.text} className="tm-line block will-change-transform">
                  <span className={line.accent ? 'italic' : ''} style={line.accent ? { color: 'var(--primary)' } : {}}>
                    {line.text}
                  </span>
                </span>
              ))}
            </h2>
            <p className="tm-line mt-6 text-white/75 text-lg font-medium max-w-lg mx-auto leading-relaxed">
              Scroll keeps moving — the circle opens, the words arrive, the promise lands.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== SLIDE — 2.5D DEPTH PARALLAX ===================== */}
      <section ref={parallaxRef} className="relative" style={{ height: '260vh' }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 grid-pattern opacity-25" />

          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-left order-2 lg:order-1">
              <span className="reveal px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-bold tracking-[0.25em] uppercase inline-block">
                2.5D Depth Parallax
              </span>
              <h2 className="reveal reveal-delay-1 font-classic text-[40px] md:text-[54px] mt-4">
                Photos with <span className="italic" style={{ color: 'var(--secondary)' }}>real depth.</span>
              </h2>
              <p className="reveal reveal-delay-2 text-on-surface-variant text-base md:text-lg font-medium mt-4 leading-relaxed">
                Each layer of the scene drifts at its own pace, and blurs with your scroll
                momentum — flattening the moment you stop. No WebGL required.
              </p>
              <div className="reveal reveal-delay-3 flex flex-wrap gap-3 mt-6">
                {['Scroll parallax', 'Velocity smear', 'Zero shaders'].map((chip, i) => (
                  <span key={chip} className="sticker px-3 py-1.5 rounded-xl text-[10px] font-extrabold text-white shadow-hard" style={{ backgroundColor: 'var(--secondary)', transform: `rotate(${(i % 3) - 1}deg)` }}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative order-1 lg:order-2 rounded-3xl overflow-hidden shadow-hard-lg toon-card" style={{ height: 'min(70vh, 480px)' }}>
              {DEPTH_LAYERS.map((layer, i) => (
                <img
                  key={layer.img}
                  ref={(el) => { parallaxLayersRef.current[i] = el; }}
                  src={layer.img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover will-change-transform"
                  style={{ scale: layer.scale }}
                />
              ))}
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 2px var(--secondary)', borderRadius: 'inherit' }} />
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur text-white text-[10px] font-bold font-mono uppercase tracking-widest">
                3 planes · {DEPTH_LAYERS.length} depth layers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SLIDE 3 — THE METHOD ===================== */}
      <section className="scroll-snap-child flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-10">
          <div className="text-center mb-10">
            <span className="reveal px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-bold tracking-[0.25em] uppercase inline-block">
              The Productive Method
            </span>
            <h2 className="reveal reveal-delay-1 font-classic text-[40px] md:text-[54px] mt-4">
              Plan. <span className="italic" style={{ color: 'var(--secondary)' }}>Focus.</span> Achieve.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                className={`toon-card reveal reveal-delay-${i + 1} rounded-3xl overflow-hidden bg-surface-container-high/60 shadow-hard tilt-3d`}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: 'var(--secondary)' }}>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{p.icon}</span>
                    </span>
                    <h3 className="font-headline font-extrabold text-white text-lg">{p.title}</h3>
                  </div>
                </div>
                <div className="p-5 text-left">
                  <p className="text-[12px] text-on-surface-variant font-medium leading-relaxed">{p.desc}</p>
                  <div className="mt-3 h-1.5 w-24 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--secondary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SLIDE 4 — THE SUITE ===================== */}
      <section className="scroll-snap-child flex flex-col justify-center overflow-hidden">
        <img src="/img/hero/slide-books.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-10">
          <div className="text-center mb-10">
            <span className="reveal px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-[0.25em] uppercase inline-block">
              Everything Included
            </span>
            <h2 className="reveal reveal-delay-1 font-classic text-[40px] md:text-[54px] mt-4">
              A <span className="italic" style={{ color: 'var(--primary)' }}>whole suite</span> in your pocket.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {APP_FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`toon-card reveal reveal-delay-${(i % 5) + 1} p-4 rounded-2xl text-left hover:-translate-y-1`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md mb-2"
                  style={{ backgroundColor: getThemeAccent(f.color) }}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                </div>
                <div className="text-[12px] font-extrabold">{f.title}</div>
                <div className="text-[10px] text-on-surface-variant font-medium leading-snug mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SLIDE 5 — FINAL CTA ===================== */}
      <section className="scroll-snap-child flex flex-col justify-between overflow-hidden">
        <img src="/img/misc/workspace.jpg" alt="" className="absolute inset-0 w-full h-full object-cover kenburns" />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center shadow-lg shadow-primary/40 mb-6">
            <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <h2 className="reveal font-classic text-[40px] md:text-[60px] text-white leading-[1.08]">
            Your future self is<br />
            <span className="italic" style={{ color: 'var(--primary)' }}>already focusing.</span>
          </h2>
          <p className="reveal reveal-delay-1 text-white/70 text-lg font-medium max-w-lg mt-5 leading-relaxed">
            Step into the OS. Answer 7 quick questions, claim your role, and start building the
            day your goals deserve.
          </p>
          <button
            onClick={() => onStart(loadDemo)}
            className="reveal reveal-delay-2 toon-btn px-10 py-4 bg-primary text-white font-extrabold rounded-2xl text-lg shadow-hard-lg hover:scale-102 hover:shadow-primary/40 active:scale-98 transition-all cursor-pointer mt-8 flex items-center gap-2"
          >
            START YOUR LIFE OS
            <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
          </button>
          <label className="reveal reveal-delay-3 flex items-center gap-3 cursor-pointer p-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl hover:bg-white/15 transition-colors mt-4">
            <input
              type="checkbox"
              checked={loadDemo}
              onChange={(e) => setLoadDemo(e.target.checked)}
              className="w-4 h-4 rounded border-white/40 text-primary focus:ring-primary/20 cursor-pointer"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-none">Load Demo Tutorial Data</p>
              <span className="text-[10px] text-white/60 font-medium">Prepopulates items to test app features</span>
            </div>
          </label>
        </div>

        <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-white/15 text-white/50 text-[11px] font-semibold tracking-wide uppercase">
          <span>PRODUCTIVEDUDE © 2026</span>
          <div className="flex gap-4">
            <span>Local Storage Secure</span>
            <span>Zero Server Tracking</span>
          </div>
        </footer>
      </section>
    </div>
  );
}
