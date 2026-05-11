// frontend/src/store/authStore.js
import { create } from 'zustand';

const KEY = 'noraboja:auth';

const readStorage = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeStorage = (value) => {
  if (value) localStorage.setItem(KEY, JSON.stringify(value));
  else localStorage.removeItem(KEY);
};

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  hydrated: false,

  hydrateFromStorage: () => {
    const data = readStorage();
    set({
      user: data?.user || null,
      accessToken: data?.accessToken || null,
      hydrated: true,
    });
  },

  setAuth: ({ user, accessToken }) => {
    writeStorage({ user, accessToken });
    set({ user, accessToken, hydrated: true });
  },

  clearAuth: () => {
    writeStorage(null);
    Object.keys(localStorage)
      .filter((k) => k.startsWith('noraboja:session:'))
      .forEach((k) => localStorage.removeItem(k));
    set({ user: null, accessToken: null });
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) useAuthStore.getState().hydrateFromStorage();
  });
}
