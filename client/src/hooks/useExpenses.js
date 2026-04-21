import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/expenses?${params}`);
      setExpenses(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { expenses, loading, error, refetch: fetch };
}

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/expenses/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { stats, loading, refetch: fetch };
}
