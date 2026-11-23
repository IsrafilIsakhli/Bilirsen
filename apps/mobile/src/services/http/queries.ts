import { useQuery } from '@tanstack/react-query';
import { profileSchema, historySchema, activeGameSchema } from '@azquiz/contracts';
import { useSession } from '../../stores/session';
import { request } from './client';
export const keys = {
  profile: ['me'] as const,
  history: ['history'] as const,
  active: ['active-game'] as const,
  game: (id: string) => ['game', id] as const,
};
export function useProfile() {
  const token = useSession((s) => s.accessToken);
  return useQuery({
    queryKey: keys.profile,
    queryFn: ({ signal }) => request('/me', profileSchema, { signal }),
    enabled: Boolean(token),
  });
}
export function useHistory() {
  const token = useSession((s) => s.accessToken);
  return useQuery({
    queryKey: keys.history,
    queryFn: ({ signal }) => request('/me/history', historySchema, { signal }),
    enabled: Boolean(token),
  });
}
export function useActiveGame() {
  const token = useSession((s) => s.accessToken);
  return useQuery({
    queryKey: keys.active,
    queryFn: async ({ signal }) => (await request('/games/active', activeGameSchema, { signal })).game,
    enabled: Boolean(token),
    staleTime: 0,
  });
}
