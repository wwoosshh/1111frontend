// frontend/src/hooks/useRoom.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import { useRoomStore } from '../store/roomStore.js';

export const useRoom = (roomId) => {
  const setSnapshot = useRoomStore((s) => s.setSnapshot);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.get(`/api/rooms/${roomId}`)
      .then((res) => {
        if (cancelled) return;
        setSnapshot(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        const code = err.response?.data?.error?.code;
        if (err.response?.status === 403 && code === 'NOT_A_MEMBER') {
          nav(`/room/${roomId}/join`, { replace: true });
          return;
        }
        setError(err.response?.data?.error || { code: 'FETCH_FAILED', message: '방 정보를 가져오지 못했습니다.' });
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [roomId, setSnapshot, nav]);

  return { loading, error };
};
