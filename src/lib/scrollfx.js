// Scroll choreography math shared across the landing deck sections.
// Each concept maps scroll progress (and live velocity) onto transforms —
// these helpers keep that mapping consistent and DRY.

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

export const lerp = (a, b, t) => a + (b - a) * t;

// Smoothstep easing (Hermite) — buttery acceleration/deceleration.
export const easeInOut = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

// Progress (0 → 1) of a pinned section through the scroll container.
export const sectionProgress = (engine, section, viewportHeight) => {
  const sectionTop = section.offsetTop;
  const travel = section.offsetHeight - viewportHeight;
  return travel > 0 ? clamp((engine.scroll - sectionTop) / travel, 0, 1) : 0;
};

// Cached section measurement — avoid per-frame layout reads (offsetTop/offsetHeight).
export const measureSection = (section, viewportHeight) => ({
  top: section.offsetTop,
  travel: Math.max(section.offsetHeight - viewportHeight, 1)
});

export const sectionProgressCached = (engine, m) =>
  clamp((engine.scroll - m.top) / m.travel, 0, 1);

// Live scroll velocity (px/frame) exposed by the lerp engine.
export const scrollVelocity = (engine) => engine.velocity;

// Velocity-shaped skew (for axis-flip / kinetic distortion), settling at 0.
export const velocitySkew = (velocity, strength = 4, cap = 14) =>
  clamp(velocity * strength, -cap, cap);
