import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';

/** Refresh only the queries belonging to the visible screen. */
export function useScreenRefresh(queryKeys: readonly QueryKey[]) {
  const client = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const focused = useRef(false);
  const flight = useRef<Promise<void> | null>(null);
  const refresh = useCallback(() => {
    if (flight.current) return flight.current;
    setRefreshing(true);
    flight.current = Promise.all(
      queryKeys.map((queryKey) => client.invalidateQueries({ queryKey }, { cancelRefetch: false })),
    )
      .then(() => undefined)
      .finally(() => {
        flight.current = null;
        if (focused.current) setRefreshing(false);
      });
    return flight.current;
  }, [client, queryKeys]);
  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      setRefreshing(false);
      // Initial requests are already started by useQuery.
      if (queryKeys.some((key) => client.getQueryState(key)?.dataUpdatedAt)) void refresh();
      return () => {
        focused.current = false;
      };
    }, [client, queryKeys, refresh]),
  );
  return {
    refreshing,
    onRefresh: () => {
      void refresh();
    },
  };
}
