// frontend/src/components/ReceiptHeader.jsx
import Barcode from './ui/Barcode.jsx';

export default function ReceiptHeader({
  table = '-',
  persons = '-',
  server = '-',
  date = '-',
  barcodeSeed = 'noraboja-' + new Date().toISOString().slice(0, 10),
}) {
  return (
    <header className="text-center pt-7 pb-3">
      <div className="font-receipt text-[10px] tracking-[0.3em] text-ink-faint">RECEIPT NO.</div>
      <h1
        className="font-display text-[42px] leading-none mt-1 mb-3 text-ink"
        style={{ textShadow: '1px 1px 0 var(--paper-edge)' }}
      >
        여기모여
      </h1>
      <Barcode seed={barcodeSeed} className="mb-3" />
      <div className="grid grid-cols-4 text-[9px] tracking-[0.18em] mt-3 text-ink-faint font-receipt">
        <div>
          TABLE
          <div
            className="text-base text-ink truncate px-1 normal-case font-body tracking-normal"
            title={String(table)}
          >
            {table}
          </div>
        </div>
        <div>
          PERSONS
          <div className="text-base text-ink truncate px-1 font-receipt tracking-normal" title={String(persons)}>
            {persons}
          </div>
        </div>
        <div>
          SERVER
          <div
            className="text-base text-ink truncate px-1 normal-case font-body tracking-normal"
            title={String(server)}
          >
            {server}
          </div>
        </div>
        <div>
          DATE
          <div className="text-base text-ink truncate px-1 font-receipt tracking-normal" title={String(date)}>
            {date}
          </div>
        </div>
      </div>
      <div className="mt-3 border-t border-dashed border-ink-faint/60" />
    </header>
  );
}
