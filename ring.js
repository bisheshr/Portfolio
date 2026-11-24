// Adapted from Bishesh Raut?s Letter Ring canvas sketch.
export function mountRing(canvas, playback, replay) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let W, H;
  const TAU = Math.PI * 2, LOOP = 16;
  const CHARS = "ring01{}[]<>/=+*#abcdefxyzXYZ$%&;:";
  const RING_R = 1.0, RING_T = 0.11, GEM_Y = 1.40;
  const GIRDLE_R = 0.46, TABLE_R = 0.27, TABLE_Y = 0.20, CULET_Y = -0.42, SIDES = 10;
  const FLOOR = -1.45, CAM = 5.2;

  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const easeOut = x => 1 - Math.pow(1 - x, 3);

  // ---------- build particles ----------
  const P = [];
  function addPoint(x, y, z, nx, ny, nz, kind, delay) {
    const a = rnd() * TAU, b = Math.acos(2 * rnd() - 1), r = 1.5 + rnd() * 2;
    P.push({ x, y: y - 0.3, z, nx, ny, nz, kind, delay,
             sx: r * Math.sin(b) * Math.cos(a), sy: r * Math.sin(b) * Math.sin(a), sz: r * Math.cos(b),
             ch: CHARS[Math.floor(rnd() * CHARS.length)] });
  }

  // band: grows from the bottom up both sides
  for (let i = 0; i < 1500; i++) {
    const u = rnd() * TAU, v = rnd() * TAU;
    const n = [Math.cos(v) * Math.cos(u), Math.cos(v) * Math.sin(u), Math.sin(v)];
    const fromBottom = Math.abs(((u + Math.PI / 2 + Math.PI) % TAU) - Math.PI); // 0 at bottom
    addPoint(Math.cos(u) * RING_R + n[0] * RING_T, Math.sin(u) * RING_R + n[1] * RING_T,
             n[2] * RING_T, n[0], n[1], n[2], 0, 0.1 + (fromBottom / Math.PI) * 2.6);
  }
  // prongs
  for (let k = 0; k < 4; k++) {
    const a = TAU * (k + 0.5) / 4;
    for (let i = 0; i < 50; i++) {
      const y = RING_R + rnd() * (GEM_Y + 0.06 - RING_R);
      const f = clamp((y - RING_R) / (GEM_Y - RING_R), 0.3, 1);
      const rad = (GIRDLE_R + 0.03) * f, th = rnd() * TAU;
      const n = [Math.cos(th), 0, Math.sin(th)];
      addPoint(Math.cos(a) * rad + n[0] * 0.035, y, Math.sin(a) * rad + n[2] * 0.035,
               n[0], n[1], n[2], 1, 2.8 + rnd() * 0.8);
    }
  }
  // gem
  const sub = (a, b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  function facet(a, b, c, count) {
    let n = cross(sub(b, a), sub(c, a));
    const l = Math.hypot(...n); n = n.map(v => v / l);
    const cen = [(a[0]+b[0]+c[0])/3, (a[1]+b[1]+c[1])/3, (a[2]+b[2]+c[2])/3];
    if (n[0]*cen[0] + n[1]*cen[1] + n[2]*cen[2] < 0) n = n.map(v => -v);
    for (let i = 0; i < count; i++) {
      const r1 = Math.sqrt(rnd()), r2 = rnd(), w = [1 - r1, r1 * (1 - r2), r1 * r2];
      const p = [0, 1, 2].map(j => w[0]*a[j] + w[1]*b[j] + w[2]*c[j]);
      addPoint(p[0], p[1] + GEM_Y, p[2], n[0], n[1], n[2], 2, 3.4 + rnd() * 1.2);
    }
  }
  const g = [], t = [];
  for (let i = 0; i <= SIDES; i++) {
    const a = i * TAU / SIDES;
    g.push([GIRDLE_R * Math.cos(a), 0, GIRDLE_R * Math.sin(a)]);
    t.push([TABLE_R * Math.cos(a), TABLE_Y, TABLE_R * Math.sin(a)]);
  }
  const culet = [0, CULET_Y, 0], apex = [0, TABLE_Y, 0];
  for (let i = 0; i < SIDES; i++) {
    facet(g[i], g[i+1], t[i], 22); facet(g[i+1], t[i+1], t[i], 22);
    facet(t[i], t[i+1], apex, 12); facet(g[i], g[i+1], culet, 20);
  }
  // dust that orbits the ring
  const DUST = [];
  for (let i = 0; i < 520; i++)
    DUST.push({ a: rnd() * TAU, r: 2.0 + rnd() * 0.7, w: (rnd() < 0.5 ? -1 : 1) * (0.1 + rnd() * 0.15), y: (rnd() - 0.5) * 0.06 });

  // ---------- render ----------


  function draw(T) {
    let lastFont = 0;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";

    const f = Math.min(W, H) * 1.30, cx = W / 2, cy = H * 0.51;
    const spin = Math.max(0, T - 1.5) * 0.8, tilt = 0.28;
    const cs = Math.cos(spin), sn = Math.sin(spin), ct = Math.cos(tilt), st = Math.sin(tilt);
    const L = [Math.cos(T * 1.3), 0.6, Math.sin(T * 1.3) + 1.2];
    const ll = Math.hypot(...L); L[0] /= ll; L[1] /= ll; L[2] /= ll;
    const hv = [L[0], L[1], L[2] + 1], hl = Math.hypot(...hv);
    hv[0] /= hl; hv[1] /= hl; hv[2] /= hl;

    const rot = (x, y, z) => {                      // spin on Y, then tilt on X
      const x1 = cs * x + sn * z, z1 = -sn * x + cs * z;
      return [x1, ct * y - st * z1, st * y + ct * z1];
    };

    const stars = [];

    for (let pass = 0; pass < 2; pass++) {          // pass 0 = reflection, 1 = real
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        if (pass === 0 && i % 3) continue;
        const e = easeOut(clamp((T - p.delay) / 1.1));
        if (e <= 0) continue;
        const k = 1 - e;
        const q = rot(p.x + p.sx * k, p.y + p.sy * k, p.z + p.sz * k);
        const n = rot(p.nx, p.ny, p.nz);
        let y = q[1];
        if (pass === 0) y = 2 * FLOOR - y;
        const s = f / (CAM - q[2]);
        const sxp = cx + q[0] * s, syp = cy - y * s;

        const diff = Math.max(0, n[0]*L[0] + n[1]*L[1] + n[2]*L[2]);
        const spec = Math.pow(Math.max(0, n[0]*hv[0] + n[1]*hv[1] + n[2]*hv[2]), p.kind === 2 ? 40 : 16);
        let b = 0.3 + 0.5 * diff + (p.kind === 2 ? 1.2 : 0.7) * spec;
        if (n[2] < 0) b *= 0.45;                    // back side is dimmer
        let alpha = clamp(b) * Math.min(1, e * 3) * (pass === 0 ? 0.13 : 0.95);
        if (alpha < 0.03) continue;

        const size = Math.max(4, Math.round(s * 0.085));
        if (size !== lastFont) { ctx.font = size + "px ui-monospace, Menlo, Consolas, monospace"; lastFont = size; }
        ctx.fillStyle = `rgba(${186 + spec * 69 | 0},${217 + spec * 38 | 0},${105 + spec * 150 | 0},${alpha})`;
        ctx.fillText(p.ch, sxp, syp);

        if (pass === 1) {
          if (spec > 0.6 && e > 0.95 && stars.length < 70) stars.push([sxp, syp, spec, s]);
        }
      }
    }

    // glints: little four-point stars
    ctx.lineWidth = 1;
    for (const [x, y, spec, s] of stars) {
      const len = (6 + 22 * spec) * (s / 110);
      ctx.strokeStyle = `rgba(255,255,255,${0.35 + 0.6 * spec})`;
      ctx.beginPath();
      ctx.moveTo(x - len, y); ctx.lineTo(x + len, y);
      ctx.moveTo(x, y - len); ctx.lineTo(x, y + len);
      ctx.stroke();
    }

    // orbiting dust
    if (T > 3) {
      const fade = clamp((T - 3) / 2);
      ctx.fillStyle = `rgba(162,194,88,${0.35 * fade})`;
      const dt = Math.cos(1.15), ds = Math.sin(1.15);
      for (const d of DUST) {
        const a = d.a + T * d.w;
        const x = d.r * Math.cos(a), z0 = d.r * Math.sin(a), y0 = d.y - 0.3;
        const y = dt * y0 - ds * z0, z = ds * y0 + dt * z0;
        const s = f / (CAM - z);
        ctx.fillRect(cx + x * s, cy - y * s, 1.4, 1.4);
      }
    }
  }

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let playing = !motion.matches;
  let visible = false;
  let time = 8.9;
  let lastFrame;
  let frameId;

  function tick(now) {
    frameId = undefined;
    if (lastFrame !== undefined) time = (time + Math.min(50, now - lastFrame) / 1000) % LOOP;
    lastFrame = now;
    draw(time);
    frameId = requestAnimationFrame(tick);
  }

  function syncPlayback() {
    playback.textContent = playing ? "Pause" : "Play";
    if (playing && visible && !document.hidden) {
      if (frameId === undefined) frameId = requestAnimationFrame(tick);
    } else {
      if (frameId !== undefined) cancelAnimationFrame(frameId);
      frameId = undefined;
      lastFrame = undefined;
    }
  }

  new ResizeObserver(() => {
    const { width, height } = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    W = width;
    H = height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(time);
  }).observe(canvas);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  }).observe(canvas);

  playback.addEventListener("click", () => {
    playing = !playing;
    syncPlayback();
  });
  replay.addEventListener("click", () => {
    time = 0;
    lastFrame = undefined;
    playing = true;
    syncPlayback();
  });
  motion.addEventListener("change", () => {
    if (motion.matches) {
      playing = false;
      time = 8.9;
      if (W && H) draw(time);
      syncPlayback();
    }
  });
  document.addEventListener("visibilitychange", syncPlayback);

  playback.hidden = false;
  replay.hidden = false;
  syncPlayback();
}
