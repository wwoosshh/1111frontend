// frontend/src/pages/CreateRoomPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';

export default function CreateRoomPage() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await api.post('/api/rooms', { name, password, theme: 'pink' });
      nav(`/room/${res.data.roomId}/calendar`, { replace: true });
    } catch (e2) {
      setErr(e2.response?.data?.error?.message || '방 생성 실패');
    } finally { setLoading(false); }
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
          방 비밀번호 (숫자 4~8자리)
          <input value={password} onChange={(e) => setPassword(e.target.value)} required pattern="[0-9]{4,8}"
            className="w-full mt-1 px-3 py-2 rounded border border-brand-accent/30" />
        </label>
        {err && <p className="text-xs text-red-600">{err}</p>}
        <p className="text-xs text-brand-ink/60">초대할 친구에게 비밀번호와 방 링크를 공유하세요.</p>
        <div className="flex gap-2 justify-center mt-2">
          <button disabled={loading} className="px-5 py-1.5 bg-brand text-white rounded">{loading ? '생성 중...' : '만들기'}</button>
          <button type="button" onClick={() => nav('/rooms')} className="px-5 py-1.5 border border-brand text-brand rounded">취소</button>
        </div>
      </form>
    </PageShell>
  );
}
