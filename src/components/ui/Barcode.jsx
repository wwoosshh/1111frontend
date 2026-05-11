// frontend/src/components/ui/Barcode.jsx
// Deterministic CSS-only "barcode" generated from a seed string (e.g. room id).
export default function Barcode({ seed = '', label, className = '' }) {
  const widths = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = 0; i < 48; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    widths.push(((h >> 8) % 4) + 1);
  }
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`} aria-hidden>
      <div className="flex items-end gap-[1px] h-7">
        {widths.map((w, i) => (
          <span
            key={i}
            style={{ width: `${w}px`, height: i % 5 === 0 ? '100%' : '80%' }}
            className="bg-ink"
          />
        ))}
      </div>
      {label && (
        <div className="font-receipt text-[10px] tracking-[0.3em] text-ink-soft">{label}</div>
      )}
    </div>
  );
}
