// frontend/src/pages/AllAvailablePage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom.js';
import { useSocket } from '../hooks/useSocket.js';
import { useRoomStore } from '../store/roomStore.js';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
import Calendar from '../components/Calendar.jsx';

const formatDate = (raw) => {
  if (!raw) return '';
  if (typeof raw === 'string') return raw.slice(0, 10);
  const d = new Date(raw);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function AllAvailablePage() {
  const { roomId } = useParams();
  const nav = useNavigate();
  const { error: roomError } = useRoom(roomId);
  useSocket(roomId);

  const room = useRoomStore((s) => s.room);
  const profiles = useRoomStore((s) => s.profiles);
  const selections = useRoomStore((s) => s.selections);
  const [chosen, setChosen] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (roomError) nav('/rooms', { replace: true });
  }, [roomError, nav]);

  const dateToProfiles = useMemo(() => {
    const map = new Map();
    for (const s of selections) {
      if (!map.has(s.date)) map.set(s.date, new Set());
      map.get(s.date).add(s.profileId);
    }
    return map;
  }, [selections]);

  const allAvailableDates = useMemo(() => {
    if (profiles.length === 0) return new Set();
    const all = new Set();
    for (const [date, set] of dateToProfiles) {
      if (set.size === profiles.length) all.add(date);
    }
    return all;
  }, [dateToProfiles, profiles]);

  const profileColor = (id) => profiles.find((p) => p.id === id)?.color || '#999';
  const dotsFor = (date) => {
    const ids = dateToProfiles.get(date);
    if (!ids) return [];
    return [...ids].map(profileColor);
  };

  const isOwner = !!room?.isOwner;

  const confirm = async () => {
    if (!chosen) return;
    setError(''); setSubmitting(true);
    try {
      await api.post(`/api/rooms/${roomId}/confirm`, { date: chosen });
    } catch (err) {
      setError(err.response?.data?.error?.message || '확정에 실패했습니다.');
    } finally { setSubmitting(false); }
  };

  if (room?.confirmed_date) {
    return <ConfirmedView roomName={room.name} date={room.confirmed_date} profiles={profiles} />;
  }

  return (
    <PageShell>
      <p className="text-center text-sm font-semibold mb-3">모두 가능한 날짜</p>
      <Calendar
        getDots={dotsFor}
        getHighlight={(d) => allAvailableDates.has(d) || chosen === d}
        onToggle={(d) => isOwner && allAvailableDates.has(d) && setChosen(d)}
      />
      {error && <p className="text-xs text-red-600 text-center mt-3">{error}</p>}
      <div className="flex gap-2 mt-5 justify-center">
        {isOwner ? (
          <button type="button" onClick={confirm} disabled={!chosen || submitting}
            className="px-4 py-1.5 bg-brand text-white rounded text-sm disabled:opacity-40">
            {submitting ? '확정 중...' : '날짜 확정'}
          </button>
        ) : (
          <span className="text-xs text-brand-ink/60 self-center">방장만 날짜를 확정할 수 있습니다.</span>
        )}
        <button type="button" onClick={() => nav(-1)} className="px-4 py-1.5 border border-brand text-brand rounded text-sm">뒤로</button>
      </div>
    </PageShell>
  );
}

function ConfirmedView({ roomName, date, profiles }) {
  const formatted = formatDate(date);
  return (
    <PageShell headerProps={{ date: formatted }} footerProps={{ date: formatted }}>
      <p className="text-center text-sm font-semibold mb-3">{roomName}</p>
      <ul className="divide-y divide-dashed divide-brand-accent/30 px-2">
        {profiles.map((p) => (
          <li key={p.id} className="py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span>{p.name}</span>
          </li>
        ))}
      </ul>
      <p className="text-center text-2xl font-receipt mt-6 text-brand-accent">SEE YOU SOON</p>
    </PageShell>
  );
}
