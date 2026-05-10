import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { clearSession, loadSession } from '../lib/session.js';
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

  const profiles = useRoomStore((s) => s.profiles);
  const selections = useRoomStore((s) => s.selections);

  const session = loadSession(roomId);
  const myProfileId = session?.profileId;

  useEffect(() => {
    if (!session?.accessToken) {
      nav(`/room/${roomId}`);
    } else if (!myProfileId) {
      nav(`/room/${roomId}/profile`);
    }
  }, [roomId, nav, session?.accessToken, myProfileId]);

  useEffect(() => {
    if (roomError) {
      clearSession(roomId);
      nav(`/room/${roomId}`);
    }
  }, [roomError, roomId, nav]);

  const me = profiles.find((p) => p.id === myProfileId);
  const myColor = me?.color || '#F4A6A6';

  const myDates = useMemo(
    () => new Set(selections.filter((s) => s.profileId === myProfileId).map((s) => s.date)),
    [selections, myProfileId]
  );

  const handleToggle = (dateStr) => {
    if (!myProfileId) return;
    emitDateToggle(myProfileId, dateStr);
  };

  return (
    <PageShell footerProps={{ name: me?.name || '나' }}>
      <p className="text-xs text-brand-ink/70 mb-2 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full" style={{ background: myColor }} />
        {me?.name}
      </p>
      <Calendar
        getDots={(d) => (myDates.has(d) ? [myColor] : [])}
        getHighlight={(d) => myDates.has(d)}
        onToggle={handleToggle}
      />
      <div className="flex gap-2 mt-5 justify-center">
        <Link to={`/room/${roomId}/all`} className="px-4 py-1.5 bg-brand text-white rounded text-sm">저장</Link>
        <button type="button" onClick={() => nav(-1)} className="px-4 py-1.5 border border-brand text-brand rounded text-sm">뒤로</button>
      </div>
    </PageShell>
  );
}
