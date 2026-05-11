// frontend/src/pages/SettingsPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
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
      <h2 className="text-center mb-4">설정</h2>
      <form onSubmit={submit} className="flex flex-col gap-3 px-2">
        <p className="text-xs text-brand-ink/60">아이디: <span className="font-mono">{user.loginId}</span></p>
        <label className="text-sm">
          표시 이름
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required maxLength={20}
            className="w-full mt-1 px-3 py-2 rounded border border-brand-accent/30" />
        </label>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-sm mr-1">기본 색상</span>
          {PALETTE.map((c) => (
            <button type="button" key={c} onClick={() => setDefaultColor(c)}
              className={`w-7 h-7 rounded ${defaultColor === c ? 'ring-2 ring-brand-accent' : ''}`}
              style={{ background: c }} />
          ))}
        </div>
        {err && <p className="text-xs text-red-600 text-center">{err}</p>}
        {msg && <p className="text-xs text-brand-ink/80 text-center">{msg}</p>}
        <div className="flex gap-2 justify-center mt-2">
          <button disabled={loading} className="px-5 py-1.5 bg-brand text-white rounded">{loading ? '저장 중...' : '저장'}</button>
          <button type="button" onClick={() => nav('/rooms')} className="px-5 py-1.5 border border-brand text-brand rounded">뒤로</button>
        </div>
      </form>
    </PageShell>
  );
}
