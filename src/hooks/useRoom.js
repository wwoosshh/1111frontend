import { useEffect, useState } from 'react';
import api from '../lib/api.js';
import { useRoomStore } from '../store/roomStore.js';

export const useRoom = (roomId) => {
  const setSnapshot = useRoomStore((s) => s.setSnapshot);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.get(`/api/rooms/${roomId}`)
      .then((res) => {
        if (!cancelled) {
          setSnapshot(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.error || { code: 'FETCH_FAILED', message: '방 정보를 가져오지 못했습니다.' });
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [roomId, setSnapshot]);

  return { loading, error };
};
