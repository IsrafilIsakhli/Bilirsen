import Constants from 'expo-constants';
import type { z } from 'zod';
import { errorSchema, sessionSchema } from '@azquiz/contracts';
import { useSession } from '../../stores/session';
import { tokenStorage } from '../session/storage';

const host = Constants.expoConfig?.hostUri?.split(':')[0];
export const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? (host ? `http://${host}:3000/v1` : null);
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 0,
  ) {
    super(message);
  }
}
let refreshFlight: Promise<void> | null = null;
export async function renewSession(): Promise<void> {
  if (refreshFlight) return refreshFlight;
  refreshFlight = (async () => {
    const refreshToken = await tokenStorage.read();
    if (!refreshToken) throw new ApiError('session_expired', 'Yenidən daxil ol.', 401);
    try {
      const session = await request('/auth/refresh', sessionSchema, {
        method: 'POST',
        body: { refreshToken },
        authenticated: false,
      });
      await useSession.getState().setSession(session);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) await useSession.getState().clear();
      throw error;
    }
  })().finally(() => {
    refreshFlight = null;
  });
  return refreshFlight;
}
export async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  options: { method?: 'GET' | 'POST'; body?: unknown; authenticated?: boolean } = {},
  refreshed = false,
): Promise<T> {
  if (!apiUrl) throw new ApiError('missing_configuration', 'Server ünvanı qurulmayıb.');
  const authenticated = options.authenticated !== false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let response: Response;
  try {
    const token = useSession.getState().accessToken;
    response = await fetch(`${apiUrl}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(
      'network_error',
      'Serverə qoşulmaq olmadı. Telefon və kompüterin eyni Wi-Fi şəbəkəsində olduğunu yoxla.',
    );
  } finally {
    clearTimeout(timeout);
  }
  if (response.status === 401 && authenticated && !refreshed) {
    await renewSession();
    return request(path, schema, options, true);
  }
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError('invalid_response', 'Serverdən düzgün cavab alınmadı.', response.status);
  }
  if (!response.ok) {
    const error = errorSchema.safeParse(payload);
    throw new ApiError(
      error.success ? error.data.code : 'request_failed',
      error.success ? error.data.message : 'Sorğu tamamlanmadı.',
      response.status,
    );
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success)
    throw new ApiError('invalid_response', 'Server məlumatının formatı uyğun deyil.');
  return parsed.data;
}
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Gözlənilməyən xəta baş verdi.';
}
