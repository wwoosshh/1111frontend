export default function ReceiptHeader({ table = '-', persons = '-', server = '-', date = '-' }) {
  return (
    <header className="text-center pt-6 pb-3 border-b border-dashed border-brand-accent/40">
      <h1 className="font-receipt text-3xl tracking-tight text-brand-accent">여기모여</h1>
      <div className="grid grid-cols-4 text-[10px] mt-3 text-brand-ink/70">
        <div>TABLE<div className="text-base text-brand-ink truncate px-1" title={String(table)}>{table}</div></div>
        <div>PERSONS<div className="text-base text-brand-ink truncate px-1" title={String(persons)}>{persons}</div></div>
        <div>SERVER<div className="text-base text-brand-ink truncate px-1" title={String(server)}>{server}</div></div>
        <div>DATE<div className="text-base text-brand-ink truncate px-1" title={String(date)}>{date}</div></div>
      </div>
    </header>
  );
}
