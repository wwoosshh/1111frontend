// frontend/src/components/ui/PaperCard.jsx
import { forwardRef } from 'react';

const PaperCard = forwardRef(function PaperCard(
  { children, className = '', ribbonColor, animate = true, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={`relative paper-surface shadow-paper ${animate ? 'animate-print-in' : ''} ${className}`}
      style={{ transform: 'rotate(-0.25deg)' }}
      {...rest}
    >
      {/* Perforated top edge */}
      <div className="absolute -top-[6px] left-0 right-0 h-3 paper-surface perf-bottom pointer-events-none" />
      {/* Perforated bottom edge */}
      <div className="absolute -bottom-[6px] left-0 right-0 h-3 paper-surface perf-top pointer-events-none" />
      {/* Ribbon stripe (room theme) on left edge */}
      {ribbonColor && (
        <div
          className="absolute top-3 bottom-3 left-0 w-[3px]"
          style={{ background: ribbonColor, opacity: 0.85 }}
          aria-hidden
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
});

export default PaperCard;
