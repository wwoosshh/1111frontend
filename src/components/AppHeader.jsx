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
    <div className="flex justify-between items-center text-xs text-brand-ink/70 px-1 py-2">
      <span className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full" style={{ background: user.defaultColor }} />
        {user.displayName}
      </span>
      <button type="button" onClick={logout} className="underline">로그아웃</button>
    </div>
  );
}
