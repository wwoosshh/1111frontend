// frontend/src/pages/AllAvailablePage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom.js';
import { useSocket } from '../hooks/useSocket.js';
import { useRoomStore } from '../store/roomStore.js';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
import Calendar from '../components/Calendar.jsx';
import Button from '../components/ui/Button.jsx';
import TicketDivider from '../components/ui/TicketDivider.jsx';
import Stamp from '../components/ui/Stamp.jsx';

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
      <TicketDivider>ALL AVAILABLE</TicketDivider>
      <Calendar
        getDots={dotsFor}
        getHighlight={(d) => allAvailableDates.has(d) || chosen === d}
        onToggle={(d) => isOwner && allAvailableDates.has(d) && setChosen(d)}
      />
      {error && <p className="font-receipt text-[11px] text-stamp text-center mt-3">{error}</p>}
      <hr className="ticket-divider" />
      <div className="flex gap-3 mt-3 justify-center items-center">
        {isOwner ? (
          <Button onClick={confirm} disabled={!chosen || submitting}>
            {submitting ? 'STAMPING…' : 'CONFIRM DATE'}
          </Button>
        ) : (
          <span className="font-receipt text-[11px] text-ink-faint tracking-wider">
            방장만 날짜를 확정할 수 있어요
          </span>
        )}
        <Button variant="outline" onClick={() => nav(-1)}>BACK</Button>
      </div>
    </PageShell>
  );
}

function ConfettiBits({ count = 22 }) {
  // Paper-bit particles that fall around the stamp impact
  const bits = [];
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100;
    const delay = Math.random() * 600;
    const duration = 900 + Math.random() * 800;
    const size = 4 + Math.random() * 5;
    const rotate = Math.random() * 360;
    const color = ['var(--paper-edge)', 'var(--ink-faint)', 'var(--stamp)'][i % 3];
    bits.push(
      <span
        key={i}
        className="absolute top-0 will-change-transform"
        style={{
          left: `${left}%`,
          width: size,
          height: size,
          background: color,
          opacity: 0.7,
          transform: `rotate(${rotate}deg)`,
          animation: `paperBitFall ${duration}ms ${delay}ms ease-in forwards`,
        }}
      />
    );
  }
  return <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">{bits}</div>;
}

function ConfirmedView({ roomName, date, profiles }) {
  const formatted = formatDate(date);
  return <ConfirmedViewInner roomName={roomName} formatted={formatted} profiles={profiles} />;
}

function ConfirmedViewInner({ roomName, formatted, profiles }) {
  const nav = useNavigate();
  return (
    <PageShell headerProps={{ date: formatted }} footerProps={{ date: formatted }}>
      <style>{`
        @keyframes paperBitFall {
          0% { transform: translate3d(0,-20px,0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.8; }
          100% { transform: translate3d(0,420px,0) rotate(360deg); opacity: 0; }
        }
      `}</style>
      <TicketDivider>CONFIRMED</TicketDivider>
      <div className="relative animate-shake">
        <ConfettiBits />
        <div className="flex flex-col items-center py-5">
          <Stamp size="xl" rotate={-12} className="animate-stamp-drop" color="var(--stamp)">
            ✓ CONFIRMED
          </Stamp>
          <div className="mt-6 text-center">
            <div className="font-receipt text-[10px] tracking-[0.3em] text-ink-faint">DATE</div>
            <div className="font-display text-3xl text-ink mt-1">{formatted}</div>
          </div>
        </div>
      </div>
      <hr className="ticket-divider" />
      <p className="font-receipt text-[10px] tracking-[0.25em] text-ink-faint text-center uppercase">
        {roomName}
      </p>
      <ul className="grid grid-cols-2 gap-y-1.5 gap-x-3 px-2 mt-3">
        {profiles.map((p) => (
          <li key={p.id} className="flex items-center gap-2 font-body text-sm">
            <span className="w-2.5 h-2.5 rounded-full ring-1 ring-ink/15" style={{ background: p.color }} />
            <span className="truncate">{p.name}</span>
          </li>
        ))}
      </ul>
      <p className="font-script text-3xl text-stamp text-center mt-7" style={{ transform: 'rotate(-3deg)' }}>
        See you soon!
      </p>
      <div className="flex gap-3 justify-center mt-6">
        <Button onClick={() => nav('/rooms')}>BACK TO ROOMS</Button>
      </div>
    </PageShell>
  );
}
