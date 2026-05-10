import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import { saveSession } from '../lib/session.js';
import PageShell from '../components/PageShell.jsx';

export default function CreateRoomPage() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/rooms', { name, password, theme: 'pink' });
      saveSession(res.data.roomId, { accessToken: res.data.accessToken });
      nav(`/room/${res.data.roomId}/profile`);
    } catch (err) {
      setError(err.response?.data?.error?.message || '방 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <h2 className="text-center mb-4">방 만들기</h2>
      <form onSubmit={submit} className="flex flex-col gap-3 px-2">
        <label className="text-sm">
          이름
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={50}
            className="w-full mt-1 px-3 py-2 rounded border border-brand-accent/30" />
        </label>
        <label className="text-sm">
          암호 (숫자 4~8자리)
          <input value={password} onChange={(e) => setPassword(e.target.value)} required pattern="[0-9]{4,8}"
            className="w-full mt-1 px-3 py-2 rounded border border-brand-accent/30" />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <p className="text-xs text-brand-ink/60">비밀번호는 친구에게 공유해 주세요.</p>
        <div className="flex gap-2 justify-center mt-2">
          <button type="submit" disabled={loading}
            className="px-5 py-1.5 bg-brand text-white rounded">{loading ? '생성 중...' : '만들기'}</button>
          <button type="button" onClick={() => nav('/')} className="px-5 py-1.5 border border-brand text-brand rounded">취소</button>
        </div>
      </form>
    </PageShell>
  );
}
