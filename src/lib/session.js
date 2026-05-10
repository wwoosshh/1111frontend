const KEY = (roomId) => `noraboja:session:${roomId}`;

export const saveSession = (roomId, patch) => {
  const existing = loadSession(roomId) || {};
  const next = { ...existing, ...patch };
  localStorage.setItem(KEY(roomId), JSON.stringify(next));
};

export const loadSession = (roomId) => {
  const raw = localStorage.getItem(KEY(roomId));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(KEY(roomId));
    return null;
  }
};

export const clearSession = (roomId) => {
  localStorage.removeItem(KEY(roomId));
};
