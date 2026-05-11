// frontend/src/components/ui/Stamp.jsx
export default function Stamp({ children, color, rotate = -8, size = 'sm', className = '' }) {
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 border',
    sm: 'text-[11px] px-2 py-0.5 border-2',
    md: 'text-sm px-3 py-1 border-2',
    lg: 'text-lg px-4 py-1.5 border-[3px]',
    xl: 'text-2xl px-6 py-2 border-[4px]',
  };
  return (
    <span
      className={`inline-flex items-center justify-center font-display uppercase tracking-widest rounded-sm ${sizeClasses[size]} ${className}`}
      style={{
        color: color || 'var(--stamp)',
        borderColor: color || 'var(--stamp)',
        transform: `rotate(${rotate}deg)`,
        background: 'rgba(255, 248, 238, 0.4)',
      }}
    >
      {children}
    </span>
  );
}
