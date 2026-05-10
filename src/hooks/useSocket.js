import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '../lib/socket.js';
import { useRoomStore } from '../store/roomStore.js';
import { loadSession } from '../lib/session.js';

export const useSocket = (roomId) => {
  // Read token fresh inside effect; rerun if it changes (e.g., after auth)
  const session = roomId ? loadSession(roomId) : null;
  const token = session?.accessToken;
  const profileId = session?.profileId;

  useEffect(() => {
    if (!roomId || !token) return;

    const sock = connectSocket(token);

    sock.on('connect', () => {
      if (profileId) sock.emit('profile:join', { profileId });
    });

    sock.on('profile:created', ({ profile }) => useRoomStore.getState().addProfile(profile));
    sock.on('profile:deleted', ({ profileId: pid }) => useRoomStore.getState().removeProfile(pid));
    sock.on('date:updated', (evt) => useRoomStore.getState().applyDateChange(evt));
    sock.on('room:confirmed', ({ confirmedDate }) => useRoomStore.getState().setConfirmedDate(confirmedDate));
    sock.on('room:unconfirmed', () => useRoomStore.getState().setConfirmedDate(null));
    sock.on('presence:update', ({ activeProfileIds }) => useRoomStore.getState().setActiveProfileIds(activeProfileIds));

    return () => disconnectSocket();
  }, [roomId, token, profileId]);
};
