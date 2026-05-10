export default function ProfileBadge({ name, color, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex flex-col items-center gap-1 ${active ? 'opacity-100' : 'opacity-90'}`}
    >
      <div
        className={`w-14 h-14 rounded-md border ${active ? 'ring-2 ring-brand-accent' : ''}`}
        style={{ background: color }}
      />
      <span className="text-xs">{name}</span>
    </button>
  );
}
