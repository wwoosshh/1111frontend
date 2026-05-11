import ReceiptHeader from './ReceiptHeader.jsx';
import ReceiptFooter from './ReceiptFooter.jsx';
import AppHeader from './AppHeader.jsx';

export default function PageShell({ children, headerProps, footerProps }) {
  return (
    <div className="min-h-screen flex justify-center bg-brand-bg p-4">
      <div className="w-full max-w-phone bg-brand-card rounded-2xl shadow-md flex flex-col px-5 pb-3">
        <ReceiptHeader {...headerProps} />
        <AppHeader />
        <main className="flex-1 py-4">{children}</main>
        <ReceiptFooter {...footerProps} />
      </div>
    </div>
  );
}
