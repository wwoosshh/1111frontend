// frontend/src/pages/AddRoomPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import FieldLabel from '../components/ui/FieldLabel.jsx';
import TicketDivider from '../components/ui/TicketDivider.jsx';

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
      <TicketDivider>JOIN ROOM</TicketDivider>
      <form onSubmit={submit} className="flex flex-col gap-4 px-1 mt-2">
        <div>
          <FieldLabel>INVITE LINK</FieldLabel>
          <input value={link} onChange={(e) => setLink(e.target.value)} required
            placeholder=".../room/<id>/join 또는 UUID"
            className="input-ticket w-full text-xs" />
        </div>
        <div>
          <FieldLabel>ROOM PASSWORD</FieldLabel>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="input-ticket w-full text-sm text-center" placeholder="••••" />
        </div>
        {err && <p className="font-receipt text-[11px] text-stamp text-center">{err}</p>}
        <div className="flex gap-3 justify-center mt-2">
          <Button disabled={loading}>{loading ? 'CHECKING…' : 'ENTER'}</Button>
          <Button type="button" variant="outline" onClick={() => nav('/rooms')}>CANCEL</Button>
        </div>
      </form>
    </PageShell>
  );
}
