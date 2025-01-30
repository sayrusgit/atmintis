import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IList } from '@shared/types';
import { getLocalSession } from '@/lib/session';
import { $fetch } from '@/lib/fetch';

const noop = () => {};

export function useCallbackRef<T extends (...args: any[]) => any>(callback: T | undefined): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: number | { delay: number; flushOnUnmount?: boolean },
) {
  const delay = typeof options === 'number' ? options : options.delay;
  const flushOnUnmount = typeof options === 'number' ? false : options.flushOnUnmount;
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = useRef(0);

  const lastCallback = Object.assign(
    useCallback(
      (...args: Parameters<T>) => {
        window.clearTimeout(debounceTimerRef.current);
        const flush = () => {
          if (debounceTimerRef.current !== 0) {
            debounceTimerRef.current = 0;
            handleCallback(...args);
          }
        };
        lastCallback.flush = flush;
        debounceTimerRef.current = window.setTimeout(flush, delay);
      },
      [handleCallback, delay],
    ),
    { flush: noop },
  );

  useEffect(
    () => () => {
      window.clearTimeout(debounceTimerRef.current);
      if (flushOnUnmount) {
        lastCallback.flush();
      }
    },
    [lastCallback, flushOnUnmount],
  );

  return lastCallback;
}

export function useFetchLists(): [IList[] | null, Dispatch<SetStateAction<IList[] | null>>] {
  const [lists, setLists] = useState<IList[] | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      const user = await getLocalSession();

      const { data } = await $fetch<IList[]>('/lists/get-by-user/:id', {
        params: { id: user?.id },
      });

      setLists(data);
    };

    fetchLists();
  }, []);

  return [lists, setLists];
}
