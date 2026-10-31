import { DependencyList, useCallback, useEffect, useState } from "react";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Load data when a screen opens (and again when `deps` change).
 *
 *   const { data, loading, error, refetch } = useFetch(() => getMenu(id), [id]);
 */
export function useFetch<T>(fetcher: () => Promise<T>, deps: DependencyList): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0); // bump this to load again

  useEffect(() => {
    let cancelled = false; // set to true if this request becomes outdated

    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Cleanup: runs when deps change or the screen closes
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  return { data, loading, error, refetch };
}