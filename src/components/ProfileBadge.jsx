// frontend/src/components/ProfileBadge.jsx
export default function ProfileBadge({ name, color, active = false, onClick, rotate = -3 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="stamp-tile flex flex-col items-center gap-1.5 group"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div
        className="relative w-16 h-16 rounded-sm border-[3px] flex items-center justify-center transition-transform group-hover:rotate-1"
        style={{
          borderColor: color,
          background: 'rgba(255, 248, 238, 0.6)',
          boxShadow: active ? `0 0 0 2px var(--ink), 0 4px 0 ${color}` : '2px 2px 0 rgba(42, 31, 26, 0.18)',
        }}
      >
        <span
          className="font-display text-2xl"
          style={{ color, textShadow: '1px 1px 0 rgba(0,0,0,0.04)' }}
        >
          {(name || '?').slice(0, 1).toUpperCase()}
        </span>
      </div>
      <span className="font-body text-xs text-ink truncate max-w-[64px]" title={name}>{name}</span>
    </button>
  );
}
