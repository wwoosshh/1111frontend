// frontend/src/pages/CalendarPage.jsx
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emitDateToggle } from '../lib/socket.js';
import { useRoom } from '../hooks/useRoom.js';
import { useSocket } from '../hooks/useSocket.js';
import { useRoomStore } from '../store/roomStore.js';
import PageShell from '../components/PageShell.jsx';
import Calendar from '../components/Calendar.jsx';
import Button from '../components/ui/Button.jsx';
import TicketDivider from '../components/ui/TicketDivider.jsx';

export default function CalendarPage() {
  const { roomId } = useParams();
  const nav = useNavigate();
  const { error: roomError } = useRoom(roomId);
  useSocket(roomId);

  const room = useRoomStore((s) => s.room);
  const profiles = useRoomStore((s) => s.profiles);
  const selections = useRoomStore((s) => s.selections);
  const currentProfileId = useRoomStore((s) => s.currentProfileId);

  useEffect(() => {
    if (roomError) nav('/rooms', { replace: true });
  }, [roomError, nav]);

  useEffect(() => {
    if (room && !currentProfileId) {
      nav(`/room/${roomId}/profile`, { replace: true });
    }
  }, [room, currentProfileId, roomId, nav]);

  const me = profiles.find((p) => p.id === currentProfileId);

  const dateToProfiles = useMemo(() => {
    const map = new Map();
    for (const s of selections) {
      if (!map.has(s.date)) map.set(s.date, new Set());
      map.get(s.date).add(s.profileId);
    }
    return map;
  }, [selections]);

  const profileColor = (id) => profiles.find((p) => p.id === id)?.color || '#999';
  const dotsFor = (date) => {
    const ids = dateToProfiles.get(date);
    if (!ids) return [];
    return [...ids].map(profileColor);
  };

  const myHas = (date) => {
    const ids = dateToProfiles.get(date);
    return !!(ids && currentProfileId && ids.has(currentProfileId));
  };

  const handleToggle = (dateStr) => {
    if (!currentProfileId) return;
    emitDateToggle(currentProfileId, dateStr);
  };

  return (
    <PageShell>
      <TicketDivider>DATE PICKER</TicketDivider>
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-1.5 font-body text-sm text-ink">
          <span className="w-2.5 h-2.5 rounded-full ring-1 ring-ink/15" style={{ background: me?.color || '#F4A6A6' }} />
          {me?.name}
        </div>
        <button type="button" onClick={() => nav(`/room/${roomId}/profile`)} className="btn-ghost">
          프로필 변경
        </button>
      </div>
      <Calendar
        getDots={dotsFor}
        getHighlight={myHas}
        onToggle={handleToggle}
      />
      <hr className="ticket-divider" />
      <div className="flex gap-3 justify-center mt-3">
        <Button onClick={() => nav(`/room/${roomId}/all`)}>ALL AVAILABLE</Button>
        <Button variant="outline" onClick={() => nav('/rooms')}>BACK</Button>
      </div>
    </PageShell>
  );
}
