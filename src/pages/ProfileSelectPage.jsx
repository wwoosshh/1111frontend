// frontend/src/pages/ProfileSelectPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
import ProfileBadge from '../components/ProfileBadge.jsx';
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
    if (roomError) {
      nav('/rooms', { replace: true });
    }
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
      <p className="text-center text-xs text-brand-ink/60">{room?.name || '방'}</p>
      <h2 className="text-center font-semibold mt-1 mb-4">프로필 선택</h2>
      <p className="text-center text-xs text-brand-ink/60 mb-3">
        들어가고 싶은 프로필을 누르거나, 새 프로필을 추가하세요.
      </p>
      <div className="grid grid-cols-3 gap-3 px-2">
        {profiles.map((p) => (
          <ProfileBadge key={p.id} name={p.name} color={p.color} onClick={() => select(p)} />
        ))}
        <button type="button" onClick={() => setAdding((v) => !v)} className="flex flex-col items-center gap-1">
          <div className="w-14 h-14 rounded-md border-2 border-dashed border-brand-accent/50 flex items-center justify-center text-xl">+</div>
          <span className="text-xs">프로필 추가</span>
        </button>
      </div>
      {adding && (
        <form onSubmit={submitNew} className="mt-5 flex flex-col gap-2 px-2">
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={20}
            placeholder="이름" className="px-3 py-2 rounded border border-brand-accent/30" />
          <div className="flex gap-2 flex-wrap">
            {PALETTE.map((c) => (
              <button type="button" key={c} onClick={() => setColor(c)}
                className={`w-7 h-7 rounded ${color === c ? 'ring-2 ring-brand-accent' : ''}`}
                style={{ background: c }} />
            ))}
          </div>
          {err && <p className="text-xs text-red-600">{err}</p>}
          <button disabled={submitting} className="mt-2 px-4 py-1.5 bg-brand text-white rounded">
            {submitting ? '추가 중...' : '추가하고 들어가기'}
          </button>
        </form>
      )}
      <div className="flex gap-2 mt-5 justify-center">
        <button type="button" onClick={() => nav('/rooms')} className="px-4 py-1.5 border border-brand text-brand rounded text-sm">뒤로</button>
      </div>
    </PageShell>
  );
}
