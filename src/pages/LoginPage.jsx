// frontend/src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
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
      <h2 className="text-center mb-4">로그인</h2>
      <form onSubmit={submit} className="flex flex-col gap-3 px-2">
        <input value={loginId} onChange={(e) => setLoginId(e.target.value)} required placeholder="아이디"
          className="px-3 py-2 rounded border border-brand-accent/30" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="비밀번호"
          className="px-3 py-2 rounded border border-brand-accent/30" />
        {err && <p className="text-xs text-red-600 text-center">{err}</p>}
        <button disabled={loading} className="mt-2 px-5 py-1.5 bg-brand text-white rounded">
          {loading ? '확인 중...' : '로그인'}
        </button>
      </form>
      <p className="text-xs text-center mt-4 text-brand-ink/60">
        계정이 없으신가요? <Link to="/signup" className="underline">회원가입</Link>
      </p>
    </PageShell>
  );
}
