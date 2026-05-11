// frontend/src/components/AppHeader.jsx
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import { useAuthStore } from '../store/authStore.js';

export default function AppHeader() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const nav = useNavigate();

  if (!user) return null;

  const logout = async () => {
    try { await api.post('/api/auth/logout'); } catch { /* stateless server */ }
    clearAuth();
    nav('/login', { replace: true });
  };

  return (
    <div className="flex justify-between items-center px-1 pt-2 pb-1 text-[10px] font-receipt tracking-[0.18em] text-ink-faint uppercase">
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: user.defaultColor }} />
        <span className="font-body normal-case tracking-normal text-ink">{user.displayName}</span>
      </span>
      <button type="button" onClick={logout} className="btn-ghost">로그아웃</button>
    </div>
  );
}
