import axios from 'axios';
import { loadSession } from './session.js';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const match = window.location.pathname.match(/\/room\/([0-9a-f-]{36})/);
  if (match) {
    const session = loadSession(match[1]);
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
  }
  return config;
});

export default api;
