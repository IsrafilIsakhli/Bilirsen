import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { AppState, Platform } from 'react-native';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSession } from '../stores/session';
import { tokenStorage } from '../services/session/storage';
import { renewSession, ApiError, errorMessage } from '../services/http/client';
import { Screen, ErrorNotice, LoadingScreen } from './studio';
import { SoundProvider } from '../services/audio/sound-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => count < 1 && error instanceof ApiError && error.status === 0,
      staleTime: 15000,
    },
    mutations: { retry: false },
  },
});
export function Providers({ children }: PropsWithChildren) {
  const ready = useSession((s) => s.ready);
  const [error, setError] = useState<string | null>(null);
  async function bootstrap() {
    setError(null);
    try {
      if (await tokenStorage.read()) await renewSession();
      else useSession.getState().markReady();
    } catch (cause) {
      if (!(cause instanceof ApiError && cause.status === 401)) setError(errorMessage(cause));
    }
  }
  useEffect(() => {
    void bootstrap();
    const subscription = AppState.addEventListener('change', (state) => {
      if (Platform.OS !== 'web') focusManager.setFocused(state === 'active');
    });
    return () => subscription.remove();
  }, []);
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {error ? (
          <Screen>
            <ErrorNotice
              message={error}
              onRetry={() => {
                void bootstrap();
              }}
            />
          </Screen>
        ) : ready ? (
          <SoundProvider>{children}</SoundProvider>
        ) : (
          <LoadingScreen message="Studiyaya qoşuluruq…" />
        )}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
