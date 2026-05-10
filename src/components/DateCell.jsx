export default function DateCell({ day, dateStr, dots = [], highlight = false, faded = false, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(dateStr)}
      aria-label={dateStr}
      aria-pressed={highlight}
      className={[
        'aspect-square flex flex-col items-center justify-center rounded-md text-sm relative',
        faded ? 'text-brand-ink/30' : 'text-brand-ink',
        highlight ? 'bg-brand text-white font-semibold' : 'hover:bg-brand-bg',
      ].join(' ')}
    >
      <span>{day}</span>
      {dots.length > 0 && (
        <div className="absolute bottom-0.5 flex gap-0.5" aria-hidden="true">
          {dots.slice(0, 5).map((c, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
      )}
    </button>
  );
}
