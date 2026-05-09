/* Hero + Stats — dynamic version
   Surprises:
   - Live spectrum/EQ bars across the hero baseline (audio-reactive feel)
   - Floating constellation of signal nodes with connection lines
   - Word-by-word scramble reveal of the headline (cycling glyphs → settle)
   - Copper shockwave ring that explodes from "Amplify" when it lands
   - Mouse-following aurora glow
   Exposes: Hero, StatsStrip, useReveal
*/

function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(e => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '-8% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  });
}

/* Glitchy scramble: cycle random glyphs then settle to target text */
function Scramble({ text, start = 0, duration = 700, className, style, accent = false }) {
  const [out, setOut] = React.useState(() => text.replace(/\S/g, '\u2003'));
  React.useEffect(() => {
    const glyphs = '01<>/[]{}=+*#%&░▒▓∿∼≈ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fps = 30;
    const totalFrames = Math.ceil(duration / (1000 / fps));
    let frame = 0;
    let raf;
    let lastTs = 0;
    const t0 = performance.now() + start;

    const tick = (ts) => {
      if (ts < t0) { raf = requestAnimationFrame(tick); return; }
      if (ts - lastTs < 1000 / fps) { raf = requestAnimationFrame(tick); return; }
      lastTs = ts;
      frame += 1;
      const progress = Math.min(1, frame / totalFrames);
      const lockBoundary = progress * (text.length + 4);
      const result = text.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < lockBoundary - 3) return ch;
        return glyphs[Math.floor(Math.random() * glyphs.length)];
      }).join('');
      setOut(result);
      if (progress >= 1) { setOut(text); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, start, duration]);
  return (
    <span className={className} style={style} data-accent={accent || undefined}>
      {out}
    </span>
  );
}

/* In-your-face mouse-reactive waveform field.
   - Headline rendered on canvas with chromatic RGB split (magenta + cyan)
   - Random letters glitch into binary/ASCII glyphs and snap back
   - Rolling scan lines + faint binary rain in the background
   - Cursor = a "decoder lens" that locally reveals clean, stable text
   - Click = full-screen glitch storm + binary cascade */
function GlitchHeadline({ hostRef }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef && hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      if (!w || !h) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildCols();
    };
    const lines = ['Amplify every part', 'of your business', 'with AI.'];
    const glyphs = '01<>/[]{}=+*#%&▓▒░ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lineStates = lines.map(l => Array.from(l).map(ch => ({ glitch: 0, glitchCh: ch })));

    const colW = 22;
    let cols = [];
    const buildCols = () => {
      cols = [];
      const n = Math.ceil(w / colW);
      for (let i = 0; i < n; i++) cols.push({ y: Math.random() * h, sp: 60 + Math.random() * 220 });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let mx = -9999, my = -9999, hasCursor = false;
    let burst = 0;
    const onMove = e => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top; hasCursor = true;
    };
    const onLeave = () => { hasCursor = false; };
    const onDown = e => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      burst = 1;
      // shock-glitch every letter
      for (let i = 0; i < lineStates.length; i++)
        for (let j = 0; j < lineStates[i].length; j++)
          if (lines[i][j] !== ' ') {
            lineStates[i][j].glitch = 220 + Math.random() * 220;
            lineStates[i][j].glitchCh = glyphs[Math.floor(Math.random() * glyphs.length)];
          }
    };
    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseleave', onLeave);
    host.addEventListener('mousedown', onDown);
    host.addEventListener('touchmove', e => {
      const t = e.touches[0]; if (!t) return;
      const r = canvas.getBoundingClientRect();
      mx = t.clientX - r.left; my = t.clientY - r.top; hasCursor = true;
    }, { passive: true });

    let raf, prev = 0;
    const draw = (ts) => {
      const dt = Math.min(40, ts - prev || 16); prev = ts;
      ctx.clearRect(0, 0, w, h);

      // 1) Binary rain (cheap — only one glyph per column per frame, faded trail)
      ctx.font = '12px "JetBrains Mono", ui-monospace, monospace';
      for (let i = 0; i < cols.length; i++) {
        const c = cols[i];
        c.y += c.sp * dt / 1000;
        if (c.y > h + 80) { c.y = -40; c.sp = 60 + Math.random() * 220; }
        const trail = 12;
        for (let k = 0; k < trail; k++) {
          const yy = c.y - k * 14;
          if (yy < -20 || yy > h + 20) continue;
          const fade = (trail - k) / trail;
          const ch = glyphs[(i * 7 + k * 11 + (ts | 0) >> 5) % glyphs.length];
          if (k === 0) ctx.fillStyle = `rgba(196,154,79,${0.55 * fade})`;
          else         ctx.fillStyle = `rgba(123,157,255,${0.10 * fade})`;
          ctx.fillText(ch, i * colW + 4, yy);
        }
      }

      // 2) Rolling cyan scan band
      const scanY = (ts * 0.18) % (h + 200) - 100;
      const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      scanGrad.addColorStop(0, 'rgba(123,157,255,0)');
      scanGrad.addColorStop(0.5, 'rgba(123,157,255,0.10)');
      scanGrad.addColorStop(1, 'rgba(123,157,255,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 60, w, 120);
      // horizontal scan-line texture
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);

      // 3) Update glitch states
      for (let i = 0; i < lineStates.length; i++) {
        const ls = lineStates[i];
        for (let j = 0; j < ls.length; j++) {
          const s = ls[j];
          if (s.glitch > 0) {
            s.glitch -= dt;
            if (s.glitch <= 0) s.glitchCh = lines[i][j];
            else if (Math.random() < 0.35) s.glitchCh = glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }
      }
      // randomly seed new glitches
      for (let n = 0; n < 2; n++) {
        if (Math.random() < 0.18) {
          const li = Math.floor(Math.random() * lineStates.length);
          const ji = Math.floor(Math.random() * lineStates[li].length);
          if (lines[li][ji] !== ' ' && lines[li][ji] !== '.') {
            lineStates[li][ji].glitch = 90 + Math.random() * 220;
          }
        }
      }

      // 4) Headline render — chromatic split + glitch substitution
      const fs = Math.min(w * 0.082, 124);
      ctx.font = `500 ${fs}px "Fraunces", Georgia, serif`;
      ctx.textBaseline = 'middle';
      const lineH = fs * 1.05;
      const totalH = lines.length * lineH;
      const cy = h * 0.5;
      const startY = cy - totalH / 2 + lineH / 2;
      const xLeft = Math.max(24, w * 0.055);

      const display = lineStates.map((ls, i) =>
        ls.map((s, j) => s.glitch > 0 ? s.glitchCh : lines[i][j]).join('')
      );
      const split = 5 + 18 * burst;

      for (let i = 0; i < lines.length; i++) {
        const y = startY + i * lineH;
        const text = display[i];
        // magenta + cyan ghosts
        ctx.fillStyle = `rgba(255,72,140,${0.55 + 0.4 * burst})`;
        ctx.fillText(text, xLeft - split, y + (Math.random() - 0.5) * burst * 8);
        ctx.fillStyle = `rgba(72,200,255,${0.55 + 0.4 * burst})`;
        ctx.fillText(text, xLeft + split, y + (Math.random() - 0.5) * burst * 8);
        // crisp center
        ctx.fillStyle = i === lines.length - 1 ? '#C49A4F' : 'rgba(240,243,250,0.98)';
        ctx.fillText(text, xLeft, y);
      }

      // 5) Cursor decoder lens — clean text inside circle
      if (hasCursor) {
        const R = 110;
        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, R, 0, Math.PI * 2);
        ctx.clip();
        // dark backplate inside lens
        ctx.fillStyle = 'rgba(6,11,26,0.92)';
        ctx.fillRect(mx - R - 4, my - R - 4, R * 2 + 8, R * 2 + 8);
        // crisp un-glitched text inside lens
        for (let i = 0; i < lines.length; i++) {
          const y = startY + i * lineH;
          ctx.fillStyle = i === lines.length - 1 ? '#C49A4F' : '#FFFFFF';
          ctx.fillText(lines[i], xLeft, y);
        }
        ctx.restore();
        // copper ring + crosshair
        ctx.beginPath();
        ctx.arc(mx, my, R, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(196,154,79,0.85)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(mx, my, R + 6 + Math.sin(ts * 0.005) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(196,154,79,0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // tiny labels
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(196,154,79,0.85)';
        ctx.fillText('// DECODE', mx - R + 8, my - R + 14);
      }

      // 6) Click burst — random horizontal slice displacement
      if (burst > 0.04) {
        for (let i = 0; i < 7; i++) {
          const sy = Math.random() * h;
          const sh = 4 + Math.random() * 50;
          const sox = (Math.random() - 0.5) * 80 * burst;
          ctx.fillStyle = `rgba(196,154,79,${0.18 * burst})`;
          ctx.fillRect(sox, sy, w, sh);
        }
        ctx.fillStyle = `rgba(123,157,255,${0.05 * burst})`;
        ctx.fillRect(0, 0, w, h);
      }
      burst *= 0.92;
      if (burst < 0.02) burst = 0;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
      host.removeEventListener('mousedown', onDown);
    };
  }, [hostRef]);

  return <canvas ref={canvasRef} className="particle-headline" aria-hidden />;
}

/* In-your-face mouse-reactive waveform field.
   - Massive, glowing layered sine waves filling the entire hero
   - Page-load JOLT: a copper shockwave sweeps left→right on first paint
   - Cursor = magnetic gravity well that DRAMATICALLY bends every wave
   - Click = explosive particle burst + huge expanding ring
   - Idle "breathing" so it never feels static */
function WaveField({ hostRef }) {
  const canvasRef = React.useRef(null);
  const stateRef = React.useRef({
    mx: 0.5, my: 0.5,
    tx: 0.5, ty: 0.5,
    active: 0, targetActive: 0,
    ripples: [],
    particles: [],
    intro: 0, // 0..1 progress of intro jolt
    t0: 0,
  });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef && hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      if (w === 0 || h === 0) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('resize', resize);

    const burstParticles = (x, y, count = 36, base = 1) => {
      const s = stateRef.current;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = (3 + Math.random() * 6) * base;
        s.particles.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0,
          max: 700 + Math.random() * 700,
          copper: Math.random() < 0.55,
          size: 1 + Math.random() * 2.5,
        });
      }
      if (s.particles.length > 220) s.particles.splice(0, s.particles.length - 220);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      stateRef.current.tx = (e.clientX - r.left) / r.width;
      stateRef.current.ty = (e.clientY - r.top)  / r.height;
      stateRef.current.targetActive = 1;
    };
    const onLeave = () => { stateRef.current.targetActive = 0; };
    const onDown = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      stateRef.current.ripples.push({ x: x / r.width, y: y / r.height, t: 0, big: true });
      if (stateRef.current.ripples.length > 6) stateRef.current.ripples.shift();
      burstParticles(x, y, 48, 1.2);
    };
    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseleave', onLeave);
    host.addEventListener('mousedown', onDown);
    host.addEventListener('touchmove', (e) => {
      const t = e.touches[0]; if (!t) return;
      const r = canvas.getBoundingClientRect();
      stateRef.current.tx = (t.clientX - r.left) / r.width;
      stateRef.current.ty = (t.clientY - r.top)  / r.height;
      stateRef.current.targetActive = 1;
    }, { passive: true });
    host.addEventListener('touchend', onLeave);

    let raf;
    // Big, glowing layers spread across the full hero height
    const layers = [
      { phase: 0,    speed: 0.00060, amp: 110, freq: 0.0030, color: 'rgba(123,157,255,', alpha: 0.55, line: 2.2, yOff: 0.50, glow: 28 },
      { phase: 1.7,  speed: 0.00045, amp: 90,  freq: 0.0044, color: 'rgba(196,154,79,',  alpha: 0.65, line: 2.0, yOff: 0.50, glow: 22 },
      { phase: 3.1,  speed: 0.00080, amp: 70,  freq: 0.0058, color: 'rgba(123,157,255,', alpha: 0.40, line: 1.6, yOff: 0.50, glow: 18 },
      { phase: 0.6,  speed: 0.00038, amp: 130, freq: 0.0022, color: 'rgba(196,154,79,',  alpha: 0.30, line: 1.4, yOff: 0.50, glow: 24 },
      { phase: 2.4,  speed: 0.00095, amp: 55,  freq: 0.0078, color: 'rgba(232,236,245,', alpha: 0.22, line: 1.2, yOff: 0.50, glow: 14 },
      { phase: 4.1,  speed: 0.00033, amp: 160, freq: 0.0018, color: 'rgba(123,157,255,', alpha: 0.18, line: 1.2, yOff: 0.50, glow: 30 },
      { phase: 5.2,  speed: 0.00055, amp: 100, freq: 0.0040, color: 'rgba(196,154,79,',  alpha: 0.32, line: 1.6, yOff: 0.50, glow: 20 },
    ];

    let prevTs = 0;

    const draw = (ts) => {
      const s = stateRef.current;
      if (!s.t0) s.t0 = ts;
      const dt = Math.min(40, ts - prevTs || 16);
      prevTs = ts;

      // intro jolt: 0..1 over ~1300ms
      const introDur = 1300;
      s.intro = Math.min(1, (ts - s.t0) / introDur);
      const introEase = 1 - Math.pow(1 - s.intro, 3); // ease-out cubic

      // ease cursor + active state
      const ease = 0.12;
      s.mx += (s.tx - s.mx) * ease;
      s.my += (s.ty - s.my) * ease;
      s.active += ((s.targetActive ?? 0) - s.active) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const cx = s.mx * w;
      const cy = s.my * h;
      const warpRadius = Math.min(w, h) * 0.65;

      // idle breathing — gently pulses amplitude even with no cursor
      const breath = 0.85 + 0.25 * Math.sin(ts * 0.0008);

      // intro shockwave parameters
      const introX = -200 + introEase * (w + 400); // sweeping wavefront x
      const introWidth = 260; // softness of the intro wave

      for (let li = 0; li < layers.length; li++) {
        const L = layers[li];
        ctx.beginPath();
        ctx.lineWidth = L.line + (1.2 * s.active);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.shadowBlur = L.glow + 10 * s.active;
        ctx.shadowColor = L.color + '0.7)';
        ctx.strokeStyle = L.color + (L.alpha * (0.85 + 0.3 * breath)) + ')';
        const baseY = h * L.yOff;
        const step = 3;
        // staggered intro reveal per layer
        const layerIntro = Math.min(1, Math.max(0, (s.intro - li * 0.05) * 1.2));
        const layerEase  = 1 - Math.pow(1 - layerIntro, 3);

        for (let x = 0; x <= w; x += step) {
          const t = ts * L.speed;
          const phase = L.phase + t;
          const sine = Math.sin(x * L.freq + phase) * L.amp * breath;
          const harm = Math.sin(x * L.freq * 2.3 + phase * 1.4) * (L.amp * 0.4);
          const harm2 = Math.sin(x * L.freq * 0.5 + phase * 0.6) * (L.amp * 0.5);

          // cursor magnetic warp — strong, wide-radius gaussian
          const dx = x - cx;
          const dist = Math.hypot(dx, baseY - cy);
          const falloff = Math.exp(-(dist * dist) / (2 * warpRadius * warpRadius));
          // pull vertical position TOWARD cursor; amp blooms with proximity
          const warp = (cy - baseY) * 0.85 * falloff * (0.4 + 0.6 * s.active);
          const ampBoost = 1 + falloff * 2.4 * (0.5 + 0.5 * s.active);

          // intro shockwave bump — a copper crest sweeping across
          const introDx = x - introX;
          const introBump = Math.exp(-(introDx * introDx) / (introWidth * introWidth)) * (1 - introEase) * 90 * (li % 2 ? -1 : 1);

          // amplitude reveal during intro
          const revealAmp = layerEase;

          const y = baseY + ((sine + harm + harm2) * ampBoost + introBump) * revealAmp + warp * revealAmp;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // reset shadow for non-glow elements
      ctx.shadowBlur = 0;

      // intro vertical wavefront — a vertical copper line sweeping with the jolt
      if (s.intro < 1) {
        const fade = 1 - introEase;
        const grd = ctx.createLinearGradient(introX - 60, 0, introX + 60, 0);
        grd.addColorStop(0, 'rgba(196,154,79,0)');
        grd.addColorStop(0.5, `rgba(196,154,79,${0.55 * fade})`);
        grd.addColorStop(1, 'rgba(196,154,79,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(introX - 60, 0, 120, h);
      }

      // Cursor magnetic field — copper halo + crosshair ring
      if (s.active > 0.01) {
        const a = s.active;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 360);
        grad.addColorStop(0,    `rgba(196,154,79,${0.32 * a})`);
        grad.addColorStop(0.35, `rgba(123,157,255,${0.16 * a})`);
        grad.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // copper core
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,154,79,${0.95 * a})`;
        ctx.shadowBlur = 24;
        ctx.shadowColor = 'rgba(196,154,79,0.9)';
        ctx.fill();
        ctx.shadowBlur = 0;

        // pulsing concentric rings around cursor
        for (let i = 0; i < 3; i++) {
          const phase = (ts * 0.0018 + i * 0.5) % 1;
          const r = phase * 90;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(196,154,79,${(1 - phase) * 0.5 * a})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Click ripples — bigger, dual-color, with bloom
      const liveR = [];
      for (const r of s.ripples) {
        r.t += dt;
        const p = Math.min(1, r.t / 1600);
        if (p < 1) liveR.push(r);
        const rx = r.x * w, ry = r.y * h;
        const maxR = Math.max(w, h) * (r.big ? 0.85 : 0.55);
        const radius = p * maxR;
        ctx.shadowBlur = 18;
        ctx.shadowColor = 'rgba(196,154,79,0.8)';
        ctx.beginPath();
        ctx.arc(rx, ry, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(196,154,79,${(1 - p) * 0.85})`;
        ctx.lineWidth = 2.4 * (1 - p) + 0.4;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(rx, ry, radius * 0.72, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(123,157,255,${(1 - p) * 0.55})`;
        ctx.lineWidth = 1.6 * (1 - p) + 0.3;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rx, ry, radius * 0.45, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${(1 - p) * 0.18})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      s.ripples = liveR;

      // Particles — with motion blur trail
      const liveP = [];
      ctx.shadowBlur = 8;
      for (const p of s.particles) {
        p.life += dt;
        if (p.life >= p.max) continue;
        // simple drag
        p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        const t = p.life / p.max;
        const alpha = (1 - t) * 0.95;
        const col = p.copper ? '196,154,79' : '123,157,255';
        ctx.shadowColor = `rgba(${col},0.9)`;
        ctx.fillStyle = `rgba(${col},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fill();
        liveP.push(p);
      }
      ctx.shadowBlur = 0;
      s.particles = liveP;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', resize);
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
      host.removeEventListener('mousedown', onDown);
    };
  }, [hostRef]);

  return <canvas ref={canvasRef} className="wave-field" aria-hidden />;
}

function Hero({ setPage }) {
  const heroRef = React.useRef(null);
  const glowRef = React.useRef(null);

  // Mouse-following glow
  React.useEffect(() => {
    const el = heroRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.setProperty('--mx', x + '%');
      glow.style.setProperty('--my', y + '%');
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="hero hero-dynamic" ref={heroRef} data-screen-label="Home — hero">
      <div className="hero-bg">
        <div className="grid"></div>
        <div className="aurora"></div>
        <GlitchHeadline hostRef={heroRef} />
      </div>

      <div className="container hero-inner">
        <div className="eyebrow hero-eyebrow" style={{ animation: 'word-rise 600ms var(--ease-out) 80ms both' }}>
          Malmö · serving Europe
        </div>

        <h1 className="hero-headline hero-headline-hidden" aria-label="Amplify every part of your business with AI">
          <span className="hl-row">Amplify every part</span>
          <span className="hl-row">of your business</span>
          <span className="hl-row">with <span data-accent>AI</span><span className="pulse-dot"></span></span>
        </h1>

        <p className="hero-lead">
          We help mid-market companies save time, cut costs, and grow revenue by
          integrating AI into daily workflows. We don't just advise — we build,
          deploy, and maintain.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => setPage('Contact')}>
            Book a free AI audit
          </button>
          <button className="btn btn-ghost" onClick={() => setPage('Services')}>
            See what we do <span style={{ color: 'var(--brand-copper)' }}>→</span>
          </button>
        </div>
      </div>

      <div className="hero-meta">
        <div className="container">
          <span className="meta-l">// 50–500 employees · 90-day ROI · independent</span>
          <ScrollCue />
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const items = [
    { n: '80', u: '%',    l: 'of operational work automated' },
    { n: '3',  u: '×',    l: 'faster than traditional consulting' },
    { n: '90', u: 'days', l: 'to measurable ROI' },
  ];
  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {items.map((s, i) => (
            <div key={i} className={'stat reveal reveal-' + (i + 1)}>
              <div className="n">
                {s.u === 'days' ? <>&lt;&nbsp;{s.n}<span className="u">&nbsp;{s.u}</span></> : <>{s.n}<span className="u">{s.u}</span></>}
              </div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, StatsStrip, useReveal });
