export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FAF1E4',
          deep: '#F0E5D0',
          edge: '#E3D2B0',
        },
        ink: {
          DEFAULT: '#2A1F1A',
          soft: '#5A4538',
          faint: '#8B7259',
        },
        stamp: {
          DEFAULT: '#C8463A',
          deep: '#9E2E26',
          ghost: '#E89A92',
        },
        seal: '#1E5A6F',
        room: 'var(--room-theme)',
        roomSoft: 'var(--room-theme-soft)',
        // Keep brand-* aliases for any leftover usages — they now point at the new tokens
        brand: {
          DEFAULT: '#C8463A',
          bg: '#FAF1E4',
          card: '#FAF1E4',
          ink: '#2A1F1A',
          accent: '#C8463A',
        },
      },
      fontFamily: {
        display: ['"DotGothic16"', 'monospace'],
        receipt: ['"Courier Prime"', '"Courier New"', 'monospace'],
        body: ['"Gowun Dodum"', 'system-ui', 'sans-serif'],
        script: ['"Caveat"', 'cursive'],
      },
      maxWidth: {
        phone: '420px',
      },
      backgroundImage: {
        'paper-noise':
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.10  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        'paper-grain':
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'><filter id='g'><feTurbulence type='turbulence' baseFrequency='0.7' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.2  0 0 0 0 0.14  0 0 0 0 0.10  0 0 0 0.04 0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>\")",
      },
      boxShadow: {
        paper: '0 1px 0 rgba(90,69,56,0.15), 0 4px 14px -6px rgba(90,69,56,0.35), 0 24px 38px -22px rgba(42,31,26,0.45)',
        stamp: '0 0 0 2px var(--room-theme, #C8463A), 0 6px 0 rgba(0,0,0,0.06)',
      },
      keyframes: {
        printIn: {
          '0%': { clipPath: 'inset(0 0 100% 0)', transform: 'translateY(-8px)' },
          '100%': { clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)' },
        },
        idleSway: {
          '0%, 100%': { transform: 'rotate(-0.25deg) translateY(0)' },
          '50%': { transform: 'rotate(0.25deg) translateY(-1px)' },
        },
        inkBloom: {
          '0%': { transform: 'scale(0)', opacity: '0.7' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        stampDrop: {
          '0%': { transform: 'translateY(-180px) rotate(-25deg) scale(2.1)', opacity: '0' },
          '60%': { transform: 'translateY(8px) rotate(-12deg) scale(1.08)', opacity: '1' },
          '75%': { transform: 'translateY(-4px) rotate(-13deg) scale(0.98)', opacity: '1' },
          '100%': { transform: 'translateY(0) rotate(-12deg) scale(1)', opacity: '1' },
        },
        shake: {
          '0%,100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-2px,1px)' },
          '40%': { transform: 'translate(2px,-1px)' },
          '60%': { transform: 'translate(-1px,2px)' },
          '80%': { transform: 'translate(1px,-2px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        printing: {
          '0%': { opacity: '0.3' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.3' },
        },
      },
      animation: {
        'print-in': 'printIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'idle-sway': 'idleSway 8s ease-in-out infinite',
        'ink-bloom': 'inkBloom 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'stamp-drop': 'stampDrop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'shake': 'shake 0.45s ease-in-out both',
        'fade-up': 'fadeUp 0.4s ease-out both',
        'printing': 'printing 1.1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
