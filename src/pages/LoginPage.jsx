// frontend/src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import FieldLabel from '../components/ui/FieldLabel.jsx';
import TicketDivider from '../components/ui/TicketDivider.jsx';
import { useAuthStore } from '../store/authStore.js';

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthStore((s) => s.hydrated);
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!hydrated) hydrateFromStorage(); }, [hydrated, hydrateFromStorage]);
  useEffect(() => {
    if (hydrated && accessToken) {
      const dest = location.state?.returnTo || '/rooms';
      nav(dest, { replace: true });
    }
  }, [hydrated, accessToken, location.state, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { loginId, password });
      setAuth(res.data);
      const dest = location.state?.returnTo || '/rooms';
      nav(dest, { replace: true });
    } catch (e2) {
      setErr(e2.response?.data?.error?.message || '로그인 실패');
    } finally { setLoading(false); }
  };

  return (
    <PageShell>
      <TicketDivider>SIGN IN</TicketDivider>
      <form onSubmit={submit} className="flex flex-col gap-4 px-1 mt-2">
        <div>
          <FieldLabel>ID</FieldLabel>
          <input value={loginId} onChange={(e) => setLoginId(e.target.value)} required placeholder="아이디"
            className="input-ticket w-full text-sm" autoComplete="username" />
        </div>
        <div>
          <FieldLabel>PASSWORD</FieldLabel>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
            className="input-ticket w-full text-sm" autoComplete="current-password" />
        </div>
        {err && <p className="font-receipt text-[11px] text-stamp text-center">{err}</p>}
        <Button disabled={loading} className="mt-2 w-full">
          {loading ? 'CHECKING…' : 'ENTER'}
        </Button>
      </form>
      <p className="font-receipt text-[11px] text-center mt-5 text-ink-soft">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="underline decoration-dashed underline-offset-4 hover:text-stamp">
          회원가입
        </Link>
      </p>
    </PageShell>
  );
}
