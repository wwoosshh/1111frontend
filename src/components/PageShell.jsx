// frontend/src/components/PageShell.jsx
import { useEffect } from 'react';
import ReceiptHeader from './ReceiptHeader.jsx';
import ReceiptFooter from './ReceiptFooter.jsx';
import AppHeader from './AppHeader.jsx';
import { useAuthStore } from '../store/authStore.js';
import { useRoomStore } from '../store/roomStore.js';

const todayMMDD = () => {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};

const hexToRgb = (hex) => {
  if (!hex || typeof hex !== 'string') return null;
  const m = hex.replace('#', '').match(/^([0-9a-f]{6})$/i);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};

// sRGB relative luminance per WCAG
const relativeLuminance = ([r, g, b]) => {
  const a = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

// Darken a hex color by mixing toward black. amount in [0,1].
const darken = (rgb, amount = 0.45) => {
  const [r, g, b] = rgb.map((c) => Math.round(c * (1 - amount)));
  return `rgb(${r}, ${g}, ${b})`;
};

const applyRoomTheme = (themeHex) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (!themeHex) {
    root.style.removeProperty('--room-theme');
    root.style.removeProperty('--room-theme-soft');
    root.style.removeProperty('--room-theme-ink');
    root.style.removeProperty('--room-theme-strong');
    return;
  }
  const rgb = hexToRgb(themeHex);
  root.style.setProperty('--room-theme', themeHex);
  if (rgb) {
    root.style.setProperty('--room-theme-soft', `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.16)`);
    // Pick dark ink for light themes, cream for dark themes (threshold 0.55 favors readability)
    const ink = relativeLuminance(rgb) > 0.55 ? '#2A1F1A' : '#FFF8EE';
    root.style.setProperty('--room-theme-ink', ink);
    // A darker variant of the theme for strokes/focus rings/etc that must remain visible on cream
    root.style.setProperty('--room-theme-strong', darken(rgb, 0.45));
  }
};

export default function PageShell({ children, headerProps, footerProps }) {
  const user = useAuthStore((s) => s.user);
  const room = useRoomStore((s) => s.room);
  const profiles = useRoomStore((s) => s.profiles);
  const currentProfileId = useRoomStore((s) => s.currentProfileId);
  const currentProfile = profiles.find((p) => p.id === currentProfileId);

  useEffect(() => {
    applyRoomTheme(room?.theme);
    return () => applyRoomTheme(null);
  }, [room?.theme]);

  const computed = {
    table: room?.name || '-',
    persons: room ? String(profiles.length) : '-',
    server: currentProfile?.name || user?.displayName || '-',
    date: todayMMDD(),
    barcodeSeed: room?.id || (user?.id || 'noraboja') + new Date().toDateString(),
  };

  const headerFinal = { ...computed, ...(headerProps || {}) };
  const footerFinal = { ...computed, ...(footerProps || {}) };

  return (
    <div className="app-bg min-h-screen flex justify-center px-4 py-6">
      <div
        className="relative w-full max-w-phone paper-surface shadow-paper animate-print-in"
        style={{ transform: 'rotate(-0.25deg)' }}
      >
        {room?.theme && (
          <span
            aria-hidden
            className="absolute top-6 bottom-6 left-0 w-[3px] z-10"
            style={{ background: room.theme, opacity: 0.85 }}
          />
        )}
        <div
          aria-hidden
          className="absolute -top-2 left-0 right-0 h-3 paper-surface perf-bottom"
        />
        <div
          aria-hidden
          className="absolute -bottom-2 left-0 right-0 h-3 paper-surface perf-top"
        />
        <div className="relative flex flex-col min-h-[600px] px-5">
          <ReceiptHeader {...headerFinal} />
          <AppHeader />
          <main className="flex-1 py-3">{children}</main>
          <ReceiptFooter {...footerFinal} />
        </div>
      </div>
    </div>
  );
}
