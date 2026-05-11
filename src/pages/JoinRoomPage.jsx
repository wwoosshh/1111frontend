// frontend/src/pages/JoinRoomPage.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import FieldLabel from '../components/ui/FieldLabel.jsx';
import TicketDivider from '../components/ui/TicketDivider.jsx';

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
      nav(`/room/${roomId}/profile`, { replace: true });
    } catch (e2) {
      setErr(e2.response?.data?.error?.message || '입장 실패');
    } finally { setLoading(false); }
  };

  return (
    <PageShell>
      <TicketDivider>ROOM PASSWORD</TicketDivider>
      <form onSubmit={submit} className="flex flex-col gap-4 px-1 mt-2">
        <div>
          <FieldLabel>PASSWORD</FieldLabel>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="input-ticket w-full text-center text-lg" placeholder="••••" />
        </div>
        {err && <p className="font-receipt text-[11px] text-stamp text-center">{err}</p>}
        <Button disabled={loading} className="mt-2 w-full">
          {loading ? 'CHECKING…' : 'ENTER'}
        </Button>
      </form>
    </PageShell>
  );
}
