// frontend/src/pages/AddRoomPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';

const extractRoomId = (input) => {
  if (!input) return null;
  const trimmed = input.trim();
  const direct = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (direct.test(trimmed)) return trimmed;
  const m = trimmed.match(/\/room\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  return m ? m[1] : null;
};

export default function AddRoomPage() {
  const nav = useNavigate();
  const [link, setLink] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const roomId = extractRoomId(link);
    if (!roomId) {
      setErr('방 링크 또는 방 ID 형식이 올바르지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/api/rooms/${roomId}/join`, { password });
      nav(`/room/${roomId}/profile`, { replace: true });
    } catch (e2) {
      setErr(e2.response?.data?.error?.message || '방 입장에 실패했습니다.');
    } finally { setLoading(false); }
  };

  return (
    <PageShell>
      <h2 className="text-center mb-4">방 추가하기</h2>
      <form onSubmit={submit} className="flex flex-col gap-3 px-2">
        <label className="text-sm">
          방 링크 (또는 방 ID)
          <input value={link} onChange={(e) => setLink(e.target.value)} required
            placeholder="https://.../room/<id>/join 또는 UUID"
            className="w-full mt-1 px-3 py-2 rounded border border-brand-accent/30 text-xs" />
        </label>
        <label className="text-sm">
          비밀번호
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full mt-1 px-3 py-2 rounded border border-brand-accent/30 text-center" />
        </label>
        {err && <p className="text-xs text-red-600 text-center">{err}</p>}
        <div className="flex gap-2 justify-center mt-2">
          <button disabled={loading} className="px-5 py-1.5 bg-brand text-white rounded">{loading ? '확인 중...' : '입장'}</button>
          <button type="button" onClick={() => nav('/rooms')} className="px-5 py-1.5 border border-brand text-brand rounded">취소</button>
        </div>
      </form>
    </PageShell>
  );
}
