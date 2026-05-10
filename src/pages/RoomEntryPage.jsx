import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import { loadSession, saveSession } from '../lib/session.js';
import PageShell from '../components/PageShell.jsx';

export default function RoomEntryPage() {
  const { roomId } = useParams();
  const nav = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = loadSession(roomId);
    if (session?.accessToken) {
      // Already authenticated
      nav(session.profileId ? `/room/${roomId}/calendar` : `/room/${roomId}/profile`);
    }
  }, [roomId, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post(`/api/rooms/${roomId}/auth`, { password });
      saveSession(roomId, { accessToken: res.data.accessToken });
      nav(`/room/${roomId}/profile`);
    } catch (err) {
      setError(err.response?.data?.error?.message || '입장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <h2 className="text-center mb-4">방 비밀번호</h2>
      <form onSubmit={submit} className="flex flex-col gap-3 px-2">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="w-full px-3 py-2 rounded border border-brand-accent/30 text-center" />
        {error && <p className="text-xs text-red-600 text-center">{error}</p>}
        <button type="submit" disabled={loading} className="mt-2 px-5 py-1.5 bg-brand text-white rounded">
          {loading ? '확인 중...' : '입장'}
        </button>
      </form>
    </PageShell>
  );
}
