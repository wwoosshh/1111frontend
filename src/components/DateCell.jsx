// frontend/src/components/DateCell.jsx
import { useEffect, useState } from 'react';

export default function DateCell({
  day,
  dateStr,
  dots = [],
  highlight = false,
  faded = false,
  isToday = false,
  onClick,
}) {
  const [pulse, setPulse] = useState(0);
  const prev = useState(highlight)[0];

  // Trigger bloom animation when highlight transitions to true
  useEffect(() => {
    if (highlight && !prev) setPulse((p) => p + 1);
  }, [highlight, prev]);

  const handle = () => onClick?.(dateStr);

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={dateStr}
      aria-pressed={highlight}
      className={[
        'group aspect-square relative flex flex-col items-center justify-center rounded-md',
        'font-receipt text-sm transition-colors',
        faded ? 'text-ink/30' : 'text-ink',
        highlight ? '' : 'hover:bg-paper-deep',
      ].join(' ')}
      style={highlight ? { background: 'var(--room-theme)', color: 'var(--room-theme-ink)' } : undefined}
    >
      <span className="relative z-10">{day}</span>

      {/* TODAY underline */}
      {isToday && !highlight && (
        <span
          aria-hidden
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-[2px]"
          style={{ background: 'var(--ink-faint)' }}
        />
      )}

      {/* Multi-profile dots clustered at bottom */}
      {dots.length > 0 && (
        <div className="absolute bottom-0.5 flex gap-0.5 z-10" aria-hidden>
          {dots.slice(0, 5).map((c, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full ring-[0.5px] ring-ink/15"
              style={{ background: c }}
            />
          ))}
          {dots.length > 5 && (
            <span className="text-[7px] leading-none text-ink-faint">+{dots.length - 5}</span>
          )}
        </div>
      )}

      {/* Bloom on toggle */}
      {pulse > 0 && (
        <span
          key={pulse}
          aria-hidden
          className="absolute inset-0 m-auto w-8 h-8 rounded-full animate-ink-bloom pointer-events-none"
          style={{ background: 'var(--room-theme)', opacity: 0.35 }}
        />
      )}
    </button>
  );
}
