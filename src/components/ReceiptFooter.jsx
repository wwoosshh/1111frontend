export default function ReceiptFooter({
  table = '-',
  persons = '-',
  server = '-',
  name = '여기모여',
  date,
}) {
  return (
    <footer className="grid grid-cols-4 text-[10px] mt-auto pt-3 border-t border-dashed border-brand-accent/40 text-brand-ink/70 text-center">
      <div>TABLE<div className="text-sm text-brand-ink truncate px-1" title={String(table)}>{table}</div></div>
      <div>PERSONS<div className="text-sm text-brand-ink truncate px-1" title={String(persons)}>{persons}</div></div>
      <div>SERVER<div className="text-sm text-brand-ink truncate px-1" title={String(server)}>{server}</div></div>
      <div>
        {date ? 'DATE' : 'NAME'}
        <div className="text-sm text-brand-ink truncate px-1" title={String(date || name)}>{date || name}</div>
      </div>
    </footer>
  );
}
