export default function ReceiptFooter({
  table = 'My',
  persons = '4',
  server = '7',
  name = '여기모여',
  date,
}) {
  return (
    <footer className="grid grid-cols-4 text-[10px] mt-auto pt-3 border-t border-dashed border-brand-accent/40 text-brand-ink/70 text-center">
      <div>TABLE<div className="text-sm text-brand-ink">{table}</div></div>
      <div>PERSONS<div className="text-sm text-brand-ink">{persons}</div></div>
      <div>SERVER<div className="text-sm text-brand-ink">{server}</div></div>
      <div>{date ? 'DATE' : 'NAME'}<div className="text-sm text-brand-ink">{date || name}</div></div>
    </footer>
  );
}
