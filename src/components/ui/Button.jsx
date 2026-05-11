// frontend/src/components/ui/Button.jsx
import { forwardRef, useRef, useState } from 'react';

const Button = forwardRef(function Button(
  { children, variant = 'stamp', as: As = 'button', className = '', onClick, ...rest },
  ref
) {
  const [splash, setSplash] = useState(null);
  const idRef = useRef(0);

  const handleClick = (e) => {
    if (rest.disabled) return;
    if (variant === 'stamp' || variant === 'outline') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++idRef.current;
      setSplash({ id, x, y });
      setTimeout(() => setSplash((s) => (s && s.id === id ? null : s)), 450);
    }
    onClick?.(e);
  };

  const cls = variant === 'stamp' ? 'btn-stamp' : variant === 'outline' ? 'btn-outline' : 'btn-ghost';

  return (
    <As
      ref={ref}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center overflow-hidden ${cls} ${className}`}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      {splash && (
        <span
          aria-hidden
          className="absolute rounded-full pointer-events-none animate-ink-bloom"
          style={{
            left: splash.x - 18,
            top: splash.y - 18,
            width: 36,
            height: 36,
            background: 'rgba(42, 31, 26, 0.18)',
          }}
        />
      )}
    </As>
  );
});

export default Button;
