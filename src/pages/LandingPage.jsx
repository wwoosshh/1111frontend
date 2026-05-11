// frontend/src/pages/LandingPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

export default function LandingPage() {
  const nav = useNavigate();
  const { accessToken, hydrated, hydrateFromStorage } = useAuthStore();
  useEffect(() => { if (!hydrated) hydrateFromStorage(); }, [hydrated, hydrateFromStorage]);
  useEffect(() => {
    if (!hydrated) return;
    nav(accessToken ? '/rooms' : '/login', { replace: true });
  }, [hydrated, accessToken, nav]);
  return null;
}
