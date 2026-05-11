// frontend/src/pages/ProfileSelectPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
import ProfileBadge from '../components/ProfileBadge.jsx';
import Button from '../components/ui/Button.jsx';
import FieldLabel from '../components/ui/FieldLabel.jsx';
import TicketDivider from '../components/ui/TicketDivider.jsx';
import { useRoom } from '../hooks/useRoom.js';
import { useSocket } from '../hooks/useSocket.js';
import { useRoomStore } from '../store/roomStore.js';
import { useAuthStore } from '../store/authStore.js';

const PALETTE = ['#F4C1C1', '#A6D9B5', '#C5B6F0', '#F4A6A6', '#FFD89E', '#9DC8E0'];

export default function ProfileSelectPage() {
  const { roomId } = useParams();
  const nav = useNavigate();
  const { error: roomError } = useRoom(roomId);
  useSocket(roomId);

  const room = useRoomStore((s) => s.room);
  const profiles = useRoomStore((s) => s.profiles);
  const setCurrentProfile = useRoomStore((s) => s.setCurrentProfile);
  const user = useAuthStore((s) => s.user);

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [color, setColor] = useState(user?.defaultColor || PALETTE[0]);
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (roomError) nav('/rooms', { replace: true });
  }, [roomError, nav]);

  const select = (profile) => {
    setCurrentProfile(profile.id);
    nav(`/room/${roomId}/calendar`);
  };

  const submitNew = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setErr(''); setSubmitting(true);
    try {
      const res = await api.post(`/api/rooms/${roomId}/profiles`, { name, color });
      setCurrentProfile(res.data.profile.id);
      nav(`/room/${roomId}/calendar`);
    } catch (e2) {
      setErr(e2.response?.data?.error?.message || '프로필 생성 실패');
    } finally { setSubmitting(false); }
  };

  return (
    <PageShell>
      <TicketDivider>PICK A SEAT</TicketDivider>
      <p className="font-receipt text-[10px] text-ink-faint text-center tracking-[0.2em] uppercase mb-3">
        들어가고 싶은 프로필을 누르거나, 새로 만드세요
      </p>
      <div className="grid grid-cols-3 gap-y-5 gap-x-3 px-1">
        {profiles.map((p, i) => (
          <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <ProfileBadge name={p.name} color={p.color} onClick={() => select(p)} rotate={(i % 3) - 1} />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="flex flex-col items-center gap-1.5 group"
          aria-expanded={adding}
        >
          <div
            className="w-16 h-16 rounded-sm border-2 border-dashed border-ink-faint flex items-center justify-center font-display text-2xl text-ink-faint transition-transform group-hover:rotate-2 group-hover:text-stamp group-hover:border-stamp"
            style={{ background: 'rgba(255, 248, 238, 0.4)' }}
          >
            +
          </div>
          <span className="font-body text-xs text-ink-soft">새 프로필</span>
        </button>
      </div>

      {adding && (
        <form onSubmit={submitNew} className="mt-6 flex flex-col gap-3 px-1 animate-fade-up">
          <hr className="ticket-divider" />
          <div>
            <FieldLabel>PROFILE NAME</FieldLabel>
            <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={20}
              placeholder="이름" className="input-ticket w-full text-sm" />
          </div>
          <div>
            <FieldLabel>COLOR</FieldLabel>
            <div className="flex gap-2 flex-wrap mt-2">
              {PALETTE.map((c) => (
                <button type="button" key={c} onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-sm border-2 ${color === c ? 'border-ink' : 'border-transparent'}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>
          {err && <p className="font-receipt text-[11px] text-stamp text-center">{err}</p>}
          <Button disabled={submitting} className="mt-1">
            {submitting ? 'STAMPING…' : 'CREATE + ENTER'}
          </Button>
        </form>
      )}

      <div className="flex justify-center mt-6">
        <Button variant="ghost" onClick={() => nav('/rooms')}>← 방 목록으로</Button>
      </div>
    </PageShell>
  );
}
