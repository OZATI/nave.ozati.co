/**
 * GatewayFlow — Native 2D Canvas Flowing Stream Engine
 * High-performance 60fps organic data streams converging into the sides of the focal target (chat / prompt card)
 * Nave AI & OZATI official flow background (chat.ozati.co / nave.ozati.co)
 *
 * Supports:
 *  - Cubic Bézier convergence at target left/right edges
 *  - Interactive wave ripples on click
 *  - Glowing pulse particles emitted on keystroke/voice input (.emit(count))
 *  - Fade edges mask (fadeEdges = 0.22)
 */

const PULSE_COLORS = {
  dark: ["#5eead4", "#a78bfa", "#f472b6", "#fbbf24", "#60a5fa", "#4ade80"],
  light: ["#0d9488", "#7c3aed", "#db2777", "#d97706", "#2563eb", "#16a34a"],
};
const MAX_PULSES = 24;

const PALETTE = {
  dark: {
    bg: "transparent",
    line: "rgba(255,255,255,0.35)",
    dot: "rgba(255,255,255,0.7)",
  },
  light: {
    bg: "transparent",
    line: "rgba(26,31,42,0.4)",
    dot: "rgba(26,31,42,0.75)",
  },
};

const MIN_SIDE_ROOM = 72;
const TARGET_CORNER = 22;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const curveX = (t) =>
  1.5 * (1 - t) ** 2 * t + 2.4 * (1 - t) * t * t + t ** 3;

function remainingOffset(edge, focus) {
  const ratio = clamp(edge / focus, 0, 1);
  if (ratio >= 1) return 0;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (curveX(mid) < ratio) lo = mid;
    else hi = mid;
  }
  const t = (lo + hi) / 2;
  return (1 - t) ** 2 * (1 + 2 * t);
}

function bezier(t, p0, p1, p2, p3) {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t ** 3 * p3.x,
    y: u ** 3 * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t ** 3 * p3.y,
  };
}

export function initGatewayFlow(canvas, options = {}) {
  if (!canvas) return null;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const {
    mode = "dark",
    speed = 1,
    density = 1,
    size = 1,
    opacity = 1,
    target = null,
    focusInset = 48,
    focusWidth = 0,
    background = "transparent",
    fadeEdges = 0.22,
    interactive = true,
  } = options;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let paths = [];
  let waves = [];
  let pulses = [];
  let pulseColor = 0;
  let raf = 0;
  let visible = true;

  const safeDensity = clamp(density, 0.25, 2.5);
  const safeSpeed = clamp(speed, 0, 3);
  const safeSize = clamp(size, 0.25, 4);
  const resolvedMode = mode === "light" ? "light" : "dark";

  // Configuração inicial de estilo do canvas
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.pointerEvents = "none";
  canvas.style.background = background ?? PALETTE[resolvedMode].bg;
  canvas.style.opacity = String(clamp(opacity, 0.05, 1));

  if (fadeEdges > 0) {
    const mask = `radial-gradient(ellipse 80% 70% at 50% 50%, #000 35%, transparent 100%)`;
    canvas.style.webkitMaskImage = mask;
    canvas.style.maskImage = mask;
  }

  const getTarget = () => (typeof target === "function" ? target() : target);

  const buildPaths = () => {
    const n = Math.max(12, Math.round(80 * safeDensity));
    paths = Array.from({ length: n }, (_, i) => ({
      isLeft: i % 2 === 0,
      startY: (i / n) * height * 1.4 - height * 0.2,
      t: Math.random(),
      speed: 0.0015 + Math.random() * 0.002,
    }));
  };

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
    height = canvas.clientHeight || canvas.parentElement?.clientHeight || 240;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildPaths();
    if (reduceMotion) draw(0);
  };

  const draw = (advance) => {
    const colors = PALETTE[resolvedMode];
    canvas.style.background = background ?? colors.bg;
    ctx.clearRect(0, 0, width, height);

    let fxL = width / 2 - focusWidth / 2;
    let fxR = width / 2 + focusWidth / 2;
    let cy = height / 2;

    const el = getTarget();
    if (el) {
      const c = canvas.getBoundingClientRect();
      const t = el.getBoundingClientRect();
      const leftEdge = t.left - c.left;
      const rightEdge = t.right - c.left;
      const topY = t.top - c.top;
      const botY = t.bottom - c.top;

      const lo = Math.max(height * 0.3, topY + TARGET_CORNER + 4);
      const hi = Math.min(height * 0.7, botY - TARGET_CORNER - 4);
      const middle = (topY + botY) / 2;
      cy = lo <= hi ? clamp(middle, lo, hi) : middle;

      if (leftEdge < MIN_SIDE_ROOM || width - rightEdge < MIN_SIDE_ROOM) {
        fxL = fxR = width / 2;
      } else {
        const reach = Math.max(cy + height * 0.2, height * 1.2 - cy);
        const allowed = Math.max(4, Math.min(cy - topY, botY - cy) - TARGET_CORNER);
        let inset = Math.min(focusInset, Math.max(0, (rightEdge - leftEdge) / 2 - 8));
        for (let i = 0; i < 12; i++) {
          const spread =
            reach *
            Math.max(
              remainingOffset(leftEdge, leftEdge + inset),
              remainingOffset(width - rightEdge, width - rightEdge + inset),
            );
          if (spread <= allowed) break;
          inset *= 0.85;
        }
        fxL = leftEdge + inset;
        fxR = rightEdge - inset;
      }
    }
    fxL = clamp(fxL, 0, width);
    fxR = clamp(fxR, 0, width);

    for (const w of waves) {
      w.radius += 15 * advance;
      w.life -= 0.015 * advance;
    }
    waves = waves.filter((w) => w.life > 0);

    const curveOf = (p) => {
      const run = p.isLeft ? fxL : width - fxR;
      return {
        p0: { x: p.isLeft ? 0 : width, y: p.startY },
        p1: { x: p.isLeft ? run * 0.5 : width - run * 0.5, y: p.startY },
        p2: { x: p.isLeft ? run * 0.8 : width - run * 0.8, y: cy },
        p3: { x: p.isLeft ? fxL : fxR, y: cy },
      };
    };

    for (const p of paths) {
      const { p0, p1, p2, p3 } = curveOf(p);

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1.2 * safeSize;
      ctx.setLineDash([1, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      p.t += p.speed * safeSpeed * advance;
      if (p.t > 1) {
        p.t = 0;
        p.startY += (Math.random() - 0.5) * 10;
      }

      const pos = bezier(p.t, p0, p1, p2, p3);
      let dx = 0;
      let dy = 0;
      for (const w of waves) {
        const ex = pos.x - w.x;
        const ey = pos.y - w.y;
        const d = Math.hypot(ex, ey);
        if (d > 0 && d < w.radius + 120 && d > w.radius - 120) {
          const f = (1 - Math.abs(d - w.radius) / 120) * w.life;
          dx += (ex / d) * f * 80;
          dy += (ey / d) * f * 80;
        }
      }
      ctx.fillStyle = colors.dot;
      ctx.fillRect(pos.x + dx - 1.5, pos.y + dy - 1.5, 3, 3);
    }

    // Pulsos coloridos por tecla/voz
    pulses = pulses.filter((pl) => pl.t < 1);
    for (const pl of pulses) {
      pl.t += pl.speed * advance;
      if (pl.t < 0) continue;
      const { p0, p1, p2, p3 } = curveOf(pl.path);
      ctx.fillStyle = pl.color;
      for (let k = 6; k >= 1; k--) {
        const tk = pl.t - k * 0.016;
        if (tk < 0) continue;
        const pt = bezier(tk, p0, p1, p2, p3);
        ctx.globalAlpha = (1 - k / 7) * 0.5;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.4 * (1 - k / 9), 0, Math.PI * 2);
        ctx.fill();
      }
      const head = bezier(Math.min(pl.t, 1), p0, p1, p2, p3);
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.shadowColor = pl.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  };

  const emit = (count = 1) => {
    if (!raf || !paths.length) return;
    const visiblePaths = paths.filter((p) => p.startY > 0 && p.startY < height);
    const pool = visiblePaths.length ? visiblePaths : paths;
    const palette = PULSE_COLORS[resolvedMode];
    const n = Math.min(Math.max(1, Math.floor(count)), 6);
    for (let i = 0; i < n; i++) {
      if (pulses.length >= MAX_PULSES) pulses.shift();
      pulses.push({
        path: pool[Math.floor(Math.random() * pool.length)],
        t: -i * 0.03,
        speed: 0.028 + Math.random() * 0.008,
        color: palette[pulseColor++ % palette.length],
      });
    }
  };

  let last = performance.now();
  const tick = (now) => {
    const advance = Math.min((now - last) / (1000 / 60), 3);
    last = now;
    draw(advance);
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (reduceMotion || raf || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const onPointerDown = (e) => {
    if (!interactive) return;
    const r = canvas.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right) return;
    if (e.clientY < r.top || e.clientY > r.bottom) return;
    if (!reduceMotion) {
      waves.push({ x: e.clientX - r.left, y: e.clientY - r.top, radius: 0, life: 1 });
    }
  };

  const onVisibility = () => (document.hidden ? stop() : start());

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? start() : stop();
  });
  intersection.observe(canvas);

  window.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("visibilitychange", onVisibility);

  resize();
  start();

  return {
    emit,
    destroy() {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}

export default initGatewayFlow;
