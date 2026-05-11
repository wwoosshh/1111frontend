// frontend/src/pages/SignupPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import FieldLabel from '../components/ui/FieldLabel.jsx';
import TicketDivider from '../components/ui/TicketDivider.jsx';
import { useAuthStore } from '../store/authStore.js';

const PALETTE = ['#F4C1C1', '#A6D9B5', '#C5B6F0', '#F4A6A6', '#FFD89E', '#9DC8E0'];

export default function SignupPage() {
  const nav = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [defaultColor, setDefaultColor] = useState(PALETTE[0]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await api.post('/api/auth/signup', { loginId, password, displayName, defaultColor });
      setAuth(res.data);
      nav('/rooms', { replace: true });
    } catch (e2) {
      setErr(e2.response?.data?.error?.message || '가입 실패');
    } finally { setLoading(false); }
  };

  return (
    <PageShell>
      <TicketDivider>SIGN UP</TicketDivider>
      <form onSubmit={submit} className="flex flex-col gap-4 px-1 mt-2">
        <div>
          <FieldLabel hint="영문/숫자 4~20">ID</FieldLabel>
          <input value={loginId} onChange={(e) => setLoginId(e.target.value)} required pattern="[a-zA-Z0-9_]{4,20}"
            className="input-ticket w-full text-sm" autoComplete="username" />
        </div>
        <div>
          <FieldLabel hint="8자 이상">PASSWORD</FieldLabel>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
            className="input-ticket w-full text-sm" autoComplete="new-password" />
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
        <Button disabled={loading} className="mt-2 w-full">
          {loading ? 'PRINTING…' : 'CREATE ACCOUNT'}
        </Button>
      </form>
      <p className="font-receipt text-[11px] text-center mt-5 text-ink-soft">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="underline decoration-dashed underline-offset-4 hover:text-stamp">
          로그인
        </Link>
      </p>
    </PageShell>
  );
}
