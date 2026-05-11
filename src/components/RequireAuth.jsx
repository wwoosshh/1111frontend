// frontend/src/components/RequireAuth.jsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../lib/api.js';
import { useAuthStore } from '../store/authStore.js';

export default function RequireAuth({ children }) {
  const { user, accessToken, hydrated, setAuth, clearAuth, hydrateFromStorage } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!hydrated) hydrateFromStorage();
  }, [hydrated, hydrateFromStorage]);

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken) { setChecking(false); return; }
    if (user) { setChecking(false); return; }
    api.get('/api/auth/me')
      .then((res) => setAuth({ user: res.data.user, accessToken }))
      .catch(() => clearAuth())
      .finally(() => setChecking(false));
  }, [hydrated, accessToken, user, setAuth, clearAuth]);

  if (!hydrated || checking) return null;
  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ returnTo: location.pathname + location.search }} replace />;
  }
  return children;
}
