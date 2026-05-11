// frontend/src/components/ui/PrintingLoader.jsx
export default function PrintingLoader({ text = 'PRINTING' }) {
  return (
    <div className="flex items-center justify-center gap-1 font-receipt text-xs tracking-[0.3em] text-ink-soft animate-printing">
      <span>{text}</span>
      <span className="inline-block w-1 h-1 bg-ink-soft" />
      <span className="inline-block w-1 h-1 bg-ink-soft" style={{ animationDelay: '120ms' }} />
      <span className="inline-block w-1 h-1 bg-ink-soft" style={{ animationDelay: '240ms' }} />
    </div>
  );
}
