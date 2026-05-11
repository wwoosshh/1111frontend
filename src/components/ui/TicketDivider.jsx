// frontend/src/components/ui/TicketDivider.jsx
export default function TicketDivider({ children, className = '' }) {
  return (
    <div className={`flex items-center gap-2 my-3 ${className}`} aria-hidden={!children}>
      <span className="flex-1 border-t border-dashed border-ink-faint/60" />
      {children && (
        <span className="font-receipt text-[10px] tracking-[0.25em] text-ink-faint uppercase">{children}</span>
      )}
      <span className="flex-1 border-t border-dashed border-ink-faint/60" />
    </div>
  );
}
