// frontend/src/pages/CreateRoomPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import FieldLabel from '../components/ui/FieldLabel.jsx';
import TicketDivider from '../components/ui/TicketDivider.jsx';

const THEMES = ['#FCE4E4', '#E4F4E0', '#E4E4FC', '#FFF4D9', '#E0F0F8', '#F8E0F0'];

export default function CreateRoomPage() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState(THEMES[0]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await api.post('/api/rooms', { name, password, theme });
      nav(`/room/${res.data.roomId}/profile`, { replace: true });
    } catch (e2) {
      setErr(e2.response?.data?.error?.message || '방 생성 실패');
    } finally { setLoading(false); }
  };

  return (
    <PageShell>
      <TicketDivider>NEW ROOM</TicketDivider>
      <form onSubmit={submit} className="flex flex-col gap-4 px-1 mt-2">
        <div>
          <FieldLabel>NAME</FieldLabel>
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={50}
            className="input-ticket w-full text-sm" placeholder="방 이름" />
        </div>
        <div>
          <FieldLabel hint="숫자 4~8">ROOM PASSWORD</FieldLabel>
          <input value={password} onChange={(e) => setPassword(e.target.value)} required pattern="[0-9]{4,8}"
            className="input-ticket w-full text-sm" placeholder="••••" />
        </div>
        <div>
          <FieldLabel>THEME</FieldLabel>
          <div className="flex gap-2 flex-wrap items-center mt-2">
            {THEMES.map((c) => (
              <button type="button" key={c} onClick={() => setTheme(c)}
                aria-label={`테마 ${c}`}
                className={`w-9 h-9 rounded-sm border-2 transition-transform ${theme === c ? 'border-ink scale-110' : 'border-transparent'}`}
                style={{ background: c }} />
            ))}
          </div>
        </div>
        {err && <p className="font-receipt text-[11px] text-stamp text-center">{err}</p>}
        <p className="font-receipt text-[10px] text-ink-faint text-center mt-1">
          초대할 친구에게 방 링크와 비밀번호를 공유하세요.
        </p>
        <div className="flex gap-3 justify-center mt-2">
          <Button disabled={loading}>{loading ? 'PRINTING…' : 'CREATE'}</Button>
          <Button type="button" variant="outline" onClick={() => nav('/rooms')}>CANCEL</Button>
        </div>
      </form>
    </PageShell>
  );
}
