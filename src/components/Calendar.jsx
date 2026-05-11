// frontend/src/components/Calendar.jsx
import { useState, useMemo } from 'react';
import DateCell from './DateCell.jsx';

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

const toDateStr = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const todayStr = () => {
  const t = new Date();
  return toDateStr(t.getFullYear(), t.getMonth(), t.getDate());
};

export default function Calendar({ getDots, getHighlight, onToggle }) {
  const [view, setView] = useState(() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() };
  });

  const today = todayStr();

  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const last = new Date(view.year, view.month + 1, 0);
    const firstDow = (first.getDay() + 6) % 7;
    const total = firstDow + last.getDate();
    const rows = Math.ceil(total / 7);
    const arr = [];
    for (let i = 0; i < rows * 7; i++) {
      const d = i - firstDow + 1;
      if (d < 1 || d > last.getDate()) {
        arr.push({ blank: true, key: `b-${i}` });
      } else {
        const dateStr = toDateStr(view.year, view.month, d);
        arr.push({ key: dateStr, day: d, dateStr });
      }
    }
    return arr;
  }, [view]);

  const prev = () => setView((v) => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const next = () => setView((v) => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });

  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-3 font-receipt text-sm tracking-wider">
        <button onClick={prev} className="px-2 hover:text-stamp transition-colors" type="button" aria-label="이전 달">◀</button>
        <span className="text-ink">
          {view.year}<span className="text-ink-faint mx-1">/</span>{String(view.month + 1).padStart(2, '0')}
        </span>
        <button onClick={next} className="px-2 hover:text-stamp transition-colors" type="button" aria-label="다음 달">▶</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[9px] tracking-[0.2em] text-ink-faint text-center mb-1 font-receipt">
        {WEEKDAYS.map((w) => <div key={w}>{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c) =>
          c.blank
            ? <div key={c.key} />
            : <DateCell
                key={c.key}
                day={c.day}
                dateStr={c.dateStr}
                dots={getDots?.(c.dateStr) ?? []}
                highlight={getHighlight?.(c.dateStr) ?? false}
                isToday={c.dateStr === today}
                onClick={onToggle}
              />
        )}
      </div>
    </div>
  );
}
