// frontend/src/hooks/useSocket.js
import { useEffect } from 'react';
import { connectSocket, disconnectSocket, emitRoomSubscribe } from '../lib/socket.js';
import { useRoomStore } from '../store/roomStore.js';
import { useAuthStore } from '../store/authStore.js';

export const useSocket = (roomId) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const currentProfileId = useRoomStore((s) => s.currentProfileId);

  useEffect(() => {
    if (!roomId || !accessToken) return;

    const sock = connectSocket(accessToken);

    const subscribe = () => emitRoomSubscribe(roomId, currentProfileId);
    sock.on('connect', subscribe);

    sock.on('profile:created', ({ profile }) => useRoomStore.getState().addProfile(profile));
    sock.on('profile:deleted', ({ profileId: pid }) => useRoomStore.getState().removeProfile(pid));
    sock.on('date:updated', (evt) => useRoomStore.getState().applyDateChange(evt));
    sock.on('room:confirmed', ({ confirmedDate }) => useRoomStore.getState().setConfirmedDate(confirmedDate));
    sock.on('room:unconfirmed', () => useRoomStore.getState().setConfirmedDate(null));
    sock.on('presence:update', ({ activeProfileIds }) => useRoomStore.getState().setActiveProfileIds(activeProfileIds));

    return () => disconnectSocket();
  }, [roomId, accessToken, currentProfileId]);
};
