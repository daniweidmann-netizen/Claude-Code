import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { listSeries, listVideos } from './store.js';

export function useAppData() {
  const { user } = useAuth();
  const [series, setSeries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    if (!user) return;
    try {
      const [s, v] = await Promise.all([listSeries(user.id), listVideos(user.id)]);
      setSeries(s); setVideos(v); setError('');
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [user]);
  useEffect(() => { reload(); }, [reload]);
  return { series, videos, loading, error, reload };
}
