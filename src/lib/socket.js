// frontend/src/lib/socket.js
import { io } from 'socket.io-client';

let currentSocket = null;

export const connectSocket = (token) => {
  if (currentSocket) currentSocket.disconnect();
  currentSocket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });
  return currentSocket;
};

export const getSocket = () => currentSocket;

export const disconnectSocket = () => {
  if (currentSocket) {
    currentSocket.disconnect();
    currentSocket = null;
  }
};

export const emitRoomSubscribe = (roomId, profileId) =>
  new Promise((resolve) => {
    const s = currentSocket;
    if (!s) return resolve({ ok: false, code: 'NO_SOCKET' });
    s.emit('room:subscribe', { roomId, profileId }, resolve);
  });

export const emitDateToggle = (profileId, date) => {
  currentSocket?.emit('date:toggle', { profileId, date });
};
