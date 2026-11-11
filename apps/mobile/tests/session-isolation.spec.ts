import { test, expect } from '@playwright/test';
import type { Profile, Rank, Session } from '@azquiz/contracts';

test('a replacement guest receives a fresh profile after the previous session expires', async ({
  page,
}) => {
  let guest = 0;
  let profileReads = 0;
  const rank: Rank = {
    name: 'Şagird',
    division: 'III',
    points: 0,
    progress: 0,
    span: 100,
    nextAt: 100,
  };
  const profile = (): Profile => ({
    id: `00000000-0000-4000-8000-00000000000${guest}`,
    displayName: guest === 1 ? 'Sınaq Bir' : 'Sınaq İki',
    isGuest: true,
    soloRank: rank,
    duelRank: rank,
    completedGames: 0,
    correctAnswers: 0,
    answeredQuestions: 0,
  });
  await page.route('**/v1/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/v1/auth/guest') {
      guest++;
      const session: Session = {
        accessToken: `public-fixture-access-token-${guest}`,
        refreshToken: `public-fixture-refresh-token-${guest}`,
        expiresAt: new Date(Date.now() + 600000).toISOString(),
        profile: profile(),
      };
      return route.fulfill({ json: session });
    }
    if (path === '/v1/me') {
      profileReads++;
      return route.fulfill({ json: profile() });
    }
    if (path === '/v1/me/history') return route.fulfill({ json: [] });
    if (path === '/v1/games/active') return route.fulfill({ json: { game: null } });
    if (path === '/v1/games/solo' || path === '/v1/auth/refresh') {
      return route.fulfill({
        status: 401,
        json: { code: 'session_expired', message: 'Sınaq sessiyası bitdi.' },
      });
    }
    return route.fulfill({
      status: 404,
      json: { code: 'not_found', message: 'Sınaq sorğusu yoxdur.' },
    });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Qonaq kimi başla' }).click();
  await expect(page.getByText('Sınaq Bir', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Oyuna başla', exact: true }).click();
  await page.getByRole('button', { name: 'Səhnəyə çıx', exact: true }).click();
  await page.getByRole('button', { name: 'Qonaq kimi başla' }).click();
  await expect(page.getByText('Sınaq İki', { exact: true })).toBeVisible();
  await expect(page.getByText('Sınaq Bir', { exact: true })).toHaveCount(0);
  expect(guest).toBe(2);
  expect(profileReads).toBe(2);
});

test('a delayed unauthorized response reuses a token renewed by another request', async ({
  page,
}) => {
  let refreshes = 0;
  let historyReads = 0;
  let delayedUnauthorized = false;
  let releaseHistory: (() => void) | undefined;
  const refreshedProfile = new Promise<void>((resolve) => {
    releaseHistory = resolve;
  });
  const rank: Rank = {
    name: 'Şagird',
    division: 'III',
    points: 0,
    progress: 0,
    span: 100,
    nextAt: 100,
  };
  const profile: Profile = {
    id: '00000000-0000-4000-8000-000000000011',
    displayName: 'Sessiya sınağı',
    isGuest: true,
    soloRank: rank,
    duelRank: rank,
    completedGames: 0,
    correctAnswers: 0,
    answeredQuestions: 0,
  };
  const session: Session = {
    accessToken: 'public-initial-fixture-token',
    refreshToken: 'public-refresh-fixture-token',
    expiresAt: new Date(Date.now() + 600000).toISOString(),
    profile,
  };
  const unauthorized = { code: 'session_expired', message: 'Sınaq sessiyası yenilənməlidir.' };
  await page.route('**/v1/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    const initialToken =
      route.request().headers().authorization === `Bearer ${session.accessToken}`;
    if (path === '/v1/auth/guest') return route.fulfill({ json: session });
    if (path === '/v1/auth/refresh') {
      refreshes++;
      return route.fulfill({ json: { ...session, accessToken: 'public-renewed-fixture-token' } });
    }
    if (path === '/v1/me') {
      if (initialToken) return route.fulfill({ status: 401, json: unauthorized });
      releaseHistory?.();
      return route.fulfill({ json: profile });
    }
    if (path === '/v1/me/history') {
      if (initialToken) {
        await refreshedProfile;
        delayedUnauthorized = true;
        return route.fulfill({ status: 401, json: unauthorized });
      }
      historyReads++;
      return route.fulfill({ json: [] });
    }
    if (path === '/v1/games/active') return route.fulfill({ json: { game: null } });
    return route.fulfill({
      status: 404,
      json: { code: 'not_found', message: 'Sınaq sorğusu yoxdur.' },
    });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Qonaq kimi başla' }).click();
  await expect(page.getByText('Sessiya sınağı', { exact: true })).toBeVisible();
  await expect.poll(() => historyReads).toBe(1);
  expect(delayedUnauthorized).toBe(true);
  expect(refreshes).toBe(1);
});
