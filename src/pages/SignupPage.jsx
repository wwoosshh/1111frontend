// frontend/src/pages/SignupPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
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
      <h2 className="text-center mb-4">회원가입</h2>
      <form onSubmit={submit} className="flex flex-col gap-3 px-2">
        <label className="text-sm">
          아이디 (영문/숫자 4~20자)
          <input value={loginId} onChange={(e) => setLoginId(e.target.value)} required pattern="[a-zA-Z0-9_]{4,20}"
            className="w-full mt-1 px-3 py-2 rounded border border-brand-accent/30" />
        </label>
        <label className="text-sm">
          비밀번호 (8자 이상)
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
            className="w-full mt-1 px-3 py-2 rounded border border-brand-accent/30" />
        </label>
        <label className="text-sm">
          표시 이름 (방에서 보일 이름)
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required maxLength={20}
            className="w-full mt-1 px-3 py-2 rounded border border-brand-accent/30" />
        </label>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-sm mr-1">색상</span>
          {PALETTE.map((c) => (
            <button type="button" key={c} onClick={() => setDefaultColor(c)}
              className={`w-7 h-7 rounded ${defaultColor === c ? 'ring-2 ring-brand-accent' : ''}`}
              style={{ background: c }} />
          ))}
        </div>
        {err && <p className="text-xs text-red-600 text-center">{err}</p>}
        <button disabled={loading} className="mt-2 px-5 py-1.5 bg-brand text-white rounded">
          {loading ? '생성 중...' : '가입하기'}
        </button>
      </form>
      <p className="text-xs text-center mt-4 text-brand-ink/60">
        이미 계정이 있으신가요? <Link to="/login" className="underline">로그인</Link>
      </p>
    </PageShell>
  );
}
