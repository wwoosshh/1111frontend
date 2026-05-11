// frontend/src/components/ui/FieldLabel.jsx
export default function FieldLabel({ children, hint, className = '' }) {
  return (
    <div className={`flex items-baseline justify-between ${className}`}>
      <span className="label-caps">{children}</span>
      {hint && <span className="font-receipt text-[10px] text-ink-faint">{hint}</span>}
    </div>
  );
}
