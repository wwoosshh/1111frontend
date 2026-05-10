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

export const emitDateToggle = (profileId, date) => {
  const s = currentSocket;
  s?.emit('date:toggle', { profileId, date });
};
