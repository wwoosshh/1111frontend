// frontend/src/pages/MyRoomsPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';

export default function MyRoomsPage() {
  const nav = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/me/rooms')
      .then((res) => setRooms(res.data.rooms))
      .catch((e) => setErr(e.response?.data?.error?.message || '목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const enterByCode = (e) => {
    e.preventDefault();
    if (!code.match(/^[0-9a-f-]{36}$/)) {
      setErr('올바른 방 코드가 아닙니다.');
      return;
    }
    nav(`/room/${code}/calendar`);
  };

  return (
    <PageShell>
      <h2 className="text-center mb-3">내 방</h2>
      {loading && <p className="text-center text-xs text-brand-ink/60">불러오는 중...</p>}
      {!loading && rooms.length === 0 && (
        <p className="text-center text-xs text-brand-ink/60">아직 가입된 방이 없습니다.</p>
      )}
      <ul className="divide-y divide-dashed divide-brand-accent/30 px-2 mt-2">
        {rooms.map((r) => (
          <li key={r.id} className="py-2">
            <Link to={`/room/${r.id}/calendar`} className="flex justify-between">
              <span>{r.name}</span>
              <span className="text-xs text-brand-ink/60">
                {r.confirmed_date ? `확정 ${String(r.confirmed_date).slice(0, 10)}` : '진행 중'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex gap-2 justify-center">
        <Link to="/room/new" className="px-4 py-1.5 bg-brand text-white rounded text-sm">새 방 만들기</Link>
      </div>
      <form onSubmit={enterByCode} className="mt-4 flex gap-2 px-2">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="방 코드(UUID)"
          className="flex-1 px-3 py-2 rounded border border-brand-accent/30 text-xs" />
        <button className="px-3 py-1.5 border border-brand text-brand rounded text-sm">입장</button>
      </form>
      {err && <p className="text-xs text-red-600 text-center mt-2">{err}</p>}
    </PageShell>
  );
}
