// frontend/src/pages/CalendarPage.jsx
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { emitDateToggle } from '../lib/socket.js';
import { useRoom } from '../hooks/useRoom.js';
import { useSocket } from '../hooks/useSocket.js';
import { useRoomStore } from '../store/roomStore.js';
import PageShell from '../components/PageShell.jsx';
import Calendar from '../components/Calendar.jsx';

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

  // If somehow we land here without a selected profile, go pick one
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
      <div className="flex justify-between items-center mb-2 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ background: me?.color || '#F4A6A6' }} />
          {me?.name}
        </span>
        <button type="button" onClick={() => nav(`/room/${roomId}/profile`)} className="underline text-brand-ink/70">
          프로필 변경
        </button>
      </div>
      <Calendar
        getDots={dotsFor}
        getHighlight={myHas}
        onToggle={handleToggle}
      />
      <div className="flex gap-2 mt-5 justify-center">
        <Link to={`/room/${roomId}/all`} className="px-4 py-1.5 bg-brand text-white rounded text-sm">모두 가능한 날 보기</Link>
        <button type="button" onClick={() => nav('/rooms')} className="px-4 py-1.5 border border-brand text-brand rounded text-sm">뒤로</button>
      </div>
    </PageShell>
  );
}
