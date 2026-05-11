// frontend/src/components/ReceiptFooter.jsx
export default function ReceiptFooter({
  table = '-',
  persons = '-',
  server = '-',
  name = 'THANK YOU',
  date,
}) {
  return (
    <footer className="mt-auto pt-3">
      <div className="border-t border-dashed border-ink-faint/60 mb-3" />
      <div className="grid grid-cols-4 text-[9px] tracking-[0.18em] text-ink-faint font-receipt text-center">
        <div>
          TABLE
          <div className="text-sm text-ink truncate px-1 normal-case font-body tracking-normal" title={String(table)}>
            {table}
          </div>
        </div>
        <div>
          PERSONS
          <div className="text-sm text-ink truncate px-1 font-receipt tracking-normal" title={String(persons)}>
            {persons}
          </div>
        </div>
        <div>
          SERVER
          <div className="text-sm text-ink truncate px-1 normal-case font-body tracking-normal" title={String(server)}>
            {server}
          </div>
        </div>
        <div>
          {date ? 'DATE' : 'NAME'}
          <div className="text-sm text-ink truncate px-1 font-receipt tracking-normal" title={String(date || name)}>
            {date || name}
          </div>
        </div>
      </div>
      <p className="text-center font-receipt text-[10px] tracking-[0.3em] text-ink-faint mt-3">
        THANK YOU FOR GATHERING
      </p>
    </footer>
  );
}
