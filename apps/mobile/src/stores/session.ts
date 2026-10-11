import { create } from 'zustand';
import type { Profile, Session } from '@azquiz/contracts';
import { tokenStorage } from '../services/session/storage';
type SessionState = {
  accessToken: string | null;
  profile: Profile | null;
  ready: boolean;
  setSession: (session: Session) => Promise<void>;
  clear: () => Promise<void>;
  markReady: () => void;
};
export const useSession = create<SessionState>((set) => ({
  accessToken: null,
  profile: null,
  ready: false,
  setSession: async (session) => {
    await tokenStorage.write(session.refreshToken);
    set({ accessToken: session.accessToken, profile: session.profile, ready: true });
  },
  clear: async () => {
    await tokenStorage.clear();
    set({ accessToken: null, profile: null, ready: true });
  },
  markReady: () => set({ ready: true }),
}));
