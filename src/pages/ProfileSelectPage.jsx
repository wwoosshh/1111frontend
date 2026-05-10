import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import { clearSession, loadSession, saveSession } from '../lib/session.js';
import PageShell from '../components/PageShell.jsx';
import ProfileBadge from '../components/ProfileBadge.jsx';
import { useRoom } from '../hooks/useRoom.js';
import { useSocket } from '../hooks/useSocket.js';
import { useRoomStore } from '../store/roomStore.js';

const PALETTE = ['#F4C1C1', '#A6D9B5', '#C5B6F0', '#F4A6A6', '#FFD89E', '#9DC8E0'];

export default function ProfileSelectPage() {
  const { roomId } = useParams();
  const nav = useNavigate();
  const { error: roomError } = useRoom(roomId);
  useSocket(roomId);
  const profiles = useRoomStore((s) => s.profiles);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PALETTE[0]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const s = loadSession(roomId);
    if (!s?.accessToken) nav(`/room/${roomId}`);
  }, [roomId, nav]);

  useEffect(() => {
    if (roomError) {
      clearSession(roomId);
      nav(`/room/${roomId}`);
    }
  }, [roomError, roomId, nav]);

  const select = (profile) => {
    saveSession(roomId, { profileId: profile.id });
    nav(`/room/${roomId}/calendar`);
  };

  const submitNew = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post(`/api/rooms/${roomId}/profiles`, { name, color });
      saveSession(roomId, { profileId: res.data.profile.id });
      nav(`/room/${roomId}/calendar`);
    } catch (err) {
      setError(err.response?.data?.error?.message || '프로필 생성 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <p className="text-center text-xs text-brand-ink/60">여기모여</p>
      <h2 className="text-center font-semibold mt-1 mb-4">프로필 선택</h2>
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
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button disabled={submitting} className="mt-2 px-4 py-1.5 bg-brand text-white rounded">
            {submitting ? '추가 중...' : '추가'}
          </button>
        </form>
      )}
    </PageShell>
  );
}
