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
    queryFn: () => request('/me', profileSchema),
    enabled: Boolean(token),
  });
}
export function useHistory() {
  const token = useSession((s) => s.accessToken);
  return useQuery({
    queryKey: keys.history,
    queryFn: () => request('/me/history', historySchema),
    enabled: Boolean(token),
  });
}
export function useActiveGame() {
  const token = useSession((s) => s.accessToken);
  return useQuery({
    queryKey: keys.active,
    queryFn: async () => (await request('/games/active', activeGameSchema)).game,
    enabled: Boolean(token),
    staleTime: 0,
  });
}
