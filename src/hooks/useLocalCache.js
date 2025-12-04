import { useCallback } from "react";

export function useLocalCache(key, ttlSeconds = 3600) {

  const setCache = useCallback((value) => {
    const payload = { ts: Date.now(), value };
    localStorage.setItem(key, JSON.stringify(payload));
  }, [key]);

  const getCache = useCallback(() => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      const { ts, value } = JSON.parse(raw);

      if ((Date.now() - ts) / 1000 > ttlSeconds) {
        localStorage.removeItem(key);
        return null;
      }

      return value;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }, [key, ttlSeconds]);

  return { getCache, setCache };
}
