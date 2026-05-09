/* ampl-ai logo + animated waveform components
   Exposes: Logo, BrandLockup, AmplifyWave, ScrollCue
*/

function Logo({ size = 36, animated = false }) {
  // Disc with stylised lowercase "a" + copper amplitude dot
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`disc-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#102145" />
          <stop offset="100%" stopColor="#0A1428" />
        </linearGradient>
        <linearGradient id={`stroke-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(196,154,79,0.55)" />
          <stop offset="55%" stopColor="rgba(123,157,255,0.35)" />
          <stop offset="100%" stopColor="rgba(196,154,79,0)" />
        </linearGradient>
      </defs>

      {/* outer disc */}
      <circle
        cx="32" cy="32" r="30.5"
        fill={`url(#disc-${id})`}
        stroke={`url(#stroke-${id})`}
        strokeWidth="1"
        style={animated ? { transformOrigin: '32px 32px', animation: 'logo-disc 600ms cubic-bezier(0.22,1,0.36,1) both' } : undefined}
      />

      {/* lowercase 'a' as text */}
      <text
        x="32" y="44.5"
        textAnchor="middle"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="400"
        fontSize="38"
        fill="#F4F6FB"
        letterSpacing="-1"
        style={animated ? { animation: 'logo-letter 700ms cubic-bezier(0.22,1,0.36,1) 200ms both' } : undefined}
      >a</text>

      {/* amplitude waveform under the letter */}
      <path
        d="M 14 50 Q 20 46, 26 50 T 38 50 T 50 50"
        stroke="#7B9DFF"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
        pathLength="100"
        strokeDasharray="100"
        style={animated ? {
          strokeDashoffset: 0,
          animation: 'logo-wave 900ms cubic-bezier(0.22,1,0.36,1) 350ms both'
        } : undefined}
      />

      {/* copper pulse dot */}
      <circle
        cx="50" cy="20" r="3.4"
        fill="#C49A4F"
        style={animated ? { transformOrigin: '50px 20px', animation: 'logo-dot 500ms cubic-bezier(0.22,1,0.36,1) 600ms both, logo-dot-pulse 2.6s ease-in-out 1.2s infinite' } : undefined}
      />
    </svg>
  );
}

function BrandLockup({ size = 'md', tone = 'light', clickable = false, onClick }) {
  // tone: 'light' (cream text on dark bg) | 'dark' (navy text on cream bg)
  const sizes = {
    sm: { logo: 28, name: 18, by: 9 },
    md: { logo: 36, name: 22, by: 10.5 },
    lg: { logo: 56, name: 36, by: 12 },
  };
  const s = sizes[size] || sizes.md;
  const nameColor = tone === 'dark' ? '#0F2A4A' : '#F4F6FB';
  const byColor = tone === 'dark' ? 'rgba(15,42,74,0.55)' : 'rgba(232,236,245,0.55)';

  return (
    <div
      className="nav-brand"
      onClick={onClick}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
    >
      <Logo size={s.logo} animated={false} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: s.name, letterSpacing: '-0.015em',
          color: nameColor, lineHeight: 1, fontWeight: 400
        }}>
          ampl<span style={{ color: '#C49A4F' }}>·</span>ai
        </span>
        <span style={{
          fontSize: s.by, letterSpacing: '0.08em',
          color: byColor, lineHeight: 1, fontWeight: 400
        }}>
          by dalsson<span style={{ color: '#C49A4F' }}>.</span>
        </span>
      </div>
    </div>
  );
}

/* Animated wave that draws under the word "Amplify" then loops a subtle ripple */
function AmplifyWave() {
  return (
    <svg
      className="wave"
      viewBox="0 0 600 14"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C49A4F" stopOpacity="0" />
          <stop offset="20%" stopColor="#C49A4F" />
          <stop offset="80%" stopColor="#7B9DFF" />
          <stop offset="100%" stopColor="#7B9DFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M 0 7 Q 30 1, 60 7 T 120 7 T 180 7 T 240 7 T 300 7 T 360 7 T 420 7 T 480 7 T 540 7 T 600 7"
        stroke="url(#wave-grad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        pathLength="100"
        strokeDasharray="100 100"
        style={{
          strokeDashoffset: 100,
          animation: 'wave-draw 1.4s cubic-bezier(0.22,1,0.36,1) 1.6s forwards'
        }}
      />
    </svg>
  );
}

function ScrollCue() {
  return (
    <span className="scroll-cue">
      <span className="line"></span>
      <span>scroll</span>
    </span>
  );
}

/* Inject keyframes used by the SVG logo + amplify wave */
(function injectLogoKeyframes() {
  if (document.getElementById('__ampl_kf')) return;
  const s = document.createElement('style');
  s.id = '__ampl_kf';
  s.textContent = `
    @keyframes logo-disc { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes logo-letter { from { transform: translateY(6px); opacity: 0; } to { transform: none; opacity: 1; } }
    @keyframes logo-wave { from { stroke-dashoffset: 100; opacity: 0; } to { stroke-dashoffset: 0; opacity: 0.55; } }
    @keyframes logo-dot { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes logo-dot-pulse {
      0%,100% { filter: drop-shadow(0 0 4px rgba(196,154,79,0.4)); }
      50%     { filter: drop-shadow(0 0 10px rgba(196,154,79,0.9)); }
    }
    @keyframes wave-draw { to { stroke-dashoffset: 0; } }
  `;
  document.head.appendChild(s);
})();

Object.assign(window, { Logo, BrandLockup, AmplifyWave, ScrollCue });
