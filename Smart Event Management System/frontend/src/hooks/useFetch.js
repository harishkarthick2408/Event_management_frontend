import { useState, useCallback } from 'react';

/**
 * Generic fetch hook with loading, error, and data states.
 * Since this app uses mock data, this simulates async fetch behaviour.
 */
const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise((res) => setTimeout(res, 300));
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

export default useFetch;
