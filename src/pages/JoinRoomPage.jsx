// frontend/src/pages/JoinRoomPage.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';

export default function JoinRoomPage() {
  const { roomId } = useParams();
  const nav = useNavigate();
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      await api.post(`/api/rooms/${roomId}/join`, { password });
      nav(`/room/${roomId}/calendar`, { replace: true });
    } catch (e2) {
      setErr(e2.response?.data?.error?.message || '입장 실패');
    } finally { setLoading(false); }
  };

  return (
    <PageShell>
      <h2 className="text-center mb-4">방 비밀번호</h2>
      <form onSubmit={submit} className="flex flex-col gap-3 px-2">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="w-full px-3 py-2 rounded border border-brand-accent/30 text-center" />
        {err && <p className="text-xs text-red-600 text-center">{err}</p>}
        <button disabled={loading} className="mt-2 px-5 py-1.5 bg-brand text-white rounded">
          {loading ? '확인 중...' : '입장'}
        </button>
      </form>
    </PageShell>
  );
}
