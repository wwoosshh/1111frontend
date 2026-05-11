import ReceiptHeader from './ReceiptHeader.jsx';
import ReceiptFooter from './ReceiptFooter.jsx';
import AppHeader from './AppHeader.jsx';
import { useAuthStore } from '../store/authStore.js';
import { useRoomStore } from '../store/roomStore.js';

const todayMMDD = () => {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};

export default function PageShell({ children, headerProps, footerProps }) {
  const user = useAuthStore((s) => s.user);
  const room = useRoomStore((s) => s.room);
  const profiles = useRoomStore((s) => s.profiles);
  const currentProfileId = useRoomStore((s) => s.currentProfileId);
  const currentProfile = profiles.find((p) => p.id === currentProfileId);

  const computed = {
    table: room?.name || '-',
    persons: room ? String(profiles.length) : '-',
    server: currentProfile?.name || user?.displayName || '-',
    date: todayMMDD(),
  };

  const headerFinal = { ...computed, ...(headerProps || {}) };
  const footerFinal = { ...computed, ...(footerProps || {}) };

  return (
    <div className="min-h-screen flex justify-center bg-brand-bg p-4">
      <div className="w-full max-w-phone bg-brand-card rounded-2xl shadow-md flex flex-col px-5 pb-3">
        <ReceiptHeader {...headerFinal} />
        <AppHeader />
        <main className="flex-1 py-4">{children}</main>
        <ReceiptFooter {...footerFinal} />
      </div>
    </div>
  );
}
