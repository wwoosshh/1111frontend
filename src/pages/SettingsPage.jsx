// frontend/src/pages/SettingsPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import FieldLabel from '../components/ui/FieldLabel.jsx';
import TicketDivider from '../components/ui/TicketDivider.jsx';
import { useAuthStore } from '../store/authStore.js';

const PALETTE = ['#F4C1C1', '#A6D9B5', '#C5B6F0', '#F4A6A6', '#FFD89E', '#9DC8E0'];

export default function SettingsPage() {
  const nav = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [defaultColor, setDefaultColor] = useState(user?.defaultColor || PALETTE[0]);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg(''); setLoading(true);
    try {
      const res = await api.patch('/api/auth/me', { displayName, defaultColor });
      setAuth({ user: res.data.user, accessToken });
      setMsg('저장되었습니다');
    } catch (e2) {
      setErr(e2.response?.data?.error?.message || '저장 실패');
    } finally { setLoading(false); }
  };

  if (!user) return null;

  return (
    <PageShell>
      <TicketDivider>SETTINGS</TicketDivider>
      <form onSubmit={submit} className="flex flex-col gap-4 px-1 mt-2">
        <div className="flex items-baseline justify-between">
          <span className="label-caps">ID</span>
          <span className="font-receipt text-sm text-ink">{user.loginId}</span>
        </div>
        <div>
          <FieldLabel>DISPLAY NAME</FieldLabel>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required maxLength={20}
            className="input-ticket w-full text-sm" />
        </div>
        <div>
          <FieldLabel>COLOR</FieldLabel>
          <div className="flex gap-2 flex-wrap items-center mt-2">
            {PALETTE.map((c) => (
              <button type="button" key={c} onClick={() => setDefaultColor(c)}
                aria-label={`색상 ${c}`}
                className={`w-7 h-7 rounded-sm border-2 ${defaultColor === c ? 'border-ink' : 'border-transparent'}`}
                style={{ background: c }} />
            ))}
          </div>
        </div>
        {err && <p className="font-receipt text-[11px] text-stamp text-center">{err}</p>}
        {msg && <p className="font-receipt text-[11px] text-ink-soft text-center">{msg}</p>}
        <div className="flex gap-3 justify-center mt-2">
          <Button disabled={loading}>{loading ? 'SAVING…' : 'SAVE'}</Button>
          <Button type="button" variant="outline" onClick={() => nav('/rooms')}>BACK</Button>
        </div>
      </form>
    </PageShell>
  );
}
