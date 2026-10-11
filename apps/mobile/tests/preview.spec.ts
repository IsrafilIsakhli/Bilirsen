import { test, expect } from '@playwright/test';
import type { GameSnapshot, GameResult, Profile, Rank } from '@azquiz/contracts';
import { captureResponsive, assertTextFits } from './responsive-capture';

// Public response fixtures cover visual states independently of database contents.
// These are test-only responses; this test does not validate server game rules.
test('Studio v3 presentation and media with explicit public-response fixtures', async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.addInitScript(() => {
    const events: { source: string; duration: number; rate: number }[] = [];
    Object.defineProperty(window, 'studioPreviewAudio', { value: events });
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      return play.call(this).then(() => {
        events.push({ source: this.currentSrc, duration: this.duration, rate: this.playbackRate });
      });
    };
  });
  const rank: Rank = {
    name: 'Şagird',
    division: 'II',
    points: 172,
    progress: 72,
    span: 100,
    nextAt: 200,
  };
  const initialRank: Rank = { ...rank, division: 'III', points: 0, progress: 0, nextAt: 100 };
  const previousCompletedRank: Rank = { ...initialRank, points: 86, progress: 86 };
  const settledRank: Rank = { ...rank, points: 169, progress: 69 };
  const profile: Profile = {
    id: '00000000-0000-4000-8000-000000000001',
    displayName: 'Qonaq',
    isGuest: true,
    soloRank: rank,
    duelRank: initialRank,
    completedGames: 2,
    correctAnswers: 10,
    answeredQuestions: 12,
  };
  let gameId = '00000000-0000-4000-8000-000000000002';
  let createdGames = 100;
  const questionId = '00000000-0000-4000-8000-000000000003';
  const result: GameResult = {
    score: 0,
    maximumScore: 255,
    correct: 0,
    closedQuestions: 1,
    totalQuestions: 10,
    reason: 'abandoned',
    theoreticalDelta: -3,
    actualDelta: -3,
    previousRank: rank,
    rank: settledRank,
    finishedAt: new Date().toISOString(),
  };
  const completed: GameResult = {
    ...result,
    score: 255,
    correct: 10,
    closedQuestions: 10,
    reason: 'completed',
    theoreticalDelta: 86,
    actualDelta: 86,
    previousRank: previousCompletedRank,
    rank,
  };
  const history = [{ id: '00000000-0000-4000-8000-000000000004', mode: 'solo', result: completed }];
  let snapshot: GameSnapshot | null = null;
  let stressQuestion = false;
  let fixtureDuration = 20;
  const longQuestion =
    'Kitabxanada qədim xəritələrə baxan tədqiqatçı eyni şəhərin adının müxtəlif dövrlərdə dəyişdiyini görür. Bu dəyişiklikləri araşdırmaq üçün hansı mənbələri birgə müqayisə etmək daha məqsədəuyğundur?';
  await page.route('**/v1/**', async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    let body: unknown;
    if (path === '/v1/auth/guest')
      body = {
        accessToken: 'public-fixture-access-token-for-ui',
        refreshToken: 'public-fixture-refresh-token-for-ui',
        expiresAt: new Date(Date.now() + 900000).toISOString(),
        profile,
      };
    else if (path === '/v1/me') body = profile;
    else if (path === '/v1/me/history') body = history;
    else if (path === '/v1/games/active') body = { game: null };
    else if (path === '/v1/games/00000000-0000-4000-8000-000000000004')
      body = {
        id: '00000000-0000-4000-8000-000000000004',
        revision: 11,
        mode: 'solo',
        status: 'finished',
        serverNow: new Date().toISOString(),
        score: completed.score,
        rankDelta: completed.actualDelta,
        question: null,
        feedback: null,
        result: completed,
      } satisfies GameSnapshot;
    else if (path === '/v1/games/solo') {
      // Each new game has a unique identity, just as the server does.
      gameId = `00000000-0000-4000-8000-${String(++createdGames).padStart(12, '0')}`;
      const now = new Date().toISOString();
      snapshot = {
        id: gameId,
        revision: 0,
        mode: 'solo',
        status: 'question_open',
        serverNow: now,
        score: 0,
        rankDelta: 0,
        feedback: null,
        result: null,
        question: {
          id: questionId,
          number: 1,
          total: 10,
          text: stressQuestion
            ? longQuestion
            : 'Eyni yerdə günortadan sonra kölgən uzanmağa başlayırsa, Günəş üfüqə görə necə dəyişir?',
          difficulty: 'asan',
          openedAt: now,
          deadlineAt: new Date(Date.now() + fixtureDuration * 1000).toISOString(),
          durationSeconds: fixtureDuration,
          points: 20,
          options: [
            {
              key: 'A',
              text: stressQuestion
                ? 'Dövrün xəritələri, arxiv sənədləri və səyyahların qeydlərini bir-biri ilə müqayisə etmək'
                : 'Üfüqdən yüksəlir',
            },
            { key: 'B', text: 'Yerini dəyişmir' },
            { key: 'C', text: 'Üfüqə yaxınlaşır' },
            { key: 'D', text: 'Daha sürətli fırlanır' },
          ],
        },
      };
      body = snapshot;
    } else if (path === '/v1/games/' + gameId + '/answers' && snapshot) {
      snapshot = {
        ...snapshot,
        revision: 1,
        status: 'question_closed',
        rankDelta: -3,
        feedback: {
          selected: 'A',
          correctOption: 'C',
          correct: false,
          points: 0,
          rankDelta: -3,
          nextAt: new Date(Date.now() + 60000).toISOString(),
        },
      };
      body = snapshot;
    } else if (path === '/v1/games/' + gameId + '/leave' && snapshot) {
      snapshot = {
        ...snapshot,
        revision: 2,
        status: 'finished',
        question: null,
        feedback: null,
        result,
      };
      profile.soloRank = settledRank;
      profile.completedGames = 3;
      profile.answeredQuestions = 13;
      history.unshift({ id: gameId, mode: 'solo', result });
      body = snapshot;
    } else if (path === '/v1/games/' + gameId && snapshot)
      body = { ...snapshot, serverNow: new Date().toISOString() };
    else {
      await route.fulfill({
        status: 404,
        json: {
          code: 'FIXTURE_NOT_DEFINED',
          message: 'Bu sorğu üçün test məlumatı hazırlanmayıb.',
        },
      });
      return;
    }
    await route.fulfill({ status: 200, json: body });
  });
  const screenshot = (name: string) => captureResponsive(page, 'existing', name);
  await page.goto('/');
  await expect(page.getByText('Səhnə sənindir.')).toBeVisible();
  await screenshot('welcome');
  await page.getByRole('button', { name: 'Qonaq kimi başla' }).click();
  await expect(page.getByText('Yarışa hazırsan?')).toBeVisible();
  await screenshot('home');
  await page.getByRole('button', { name: 'Solo rankını göstər' }).click();
  await expect(page.getByText('Bilik pillələri')).toBeVisible();
  await screenshot('rank');
  await page.getByRole('button', { name: 'Geri', exact: true }).click();
  await page.getByRole('tab', { name: /Duel/ }).click();
  await expect(page.getByRole('button', { name: 'Rəqib tap · tezliklə' })).toBeDisabled();
  await screenshot('duel');
  await page.getByRole('tab', { name: /Reytinq/ }).click();
  await screenshot('leaderboard');
  await page.getByRole('tab', { name: /Profil/ }).click();
  await screenshot('profile');
  await page.getByRole('button', { name: 'Tənzimləmələr', exact: true }).click();
  await screenshot('settings');
  for (const title of [
    'Saniyə səsini dinlə',
    'Düzgün cavab səsini dinlə',
    'Səhv cavab səsini dinlə',
  ]) {
    await page.getByRole('button', { name: title }).click();
  }
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, 'studioPreviewAudio').length))
    .toBe(3);
  const audio: { source: string; duration: number }[] = await page.evaluate(() =>
    Reflect.get(window, 'studioPreviewAudio'),
  );
  for (const [cue, duration] of [
    ['tick', 30],
    ['correct', 0.85],
    ['wrong', 0.7],
  ] as const)
    expect(audio.find((event) => event.source.includes(cue + '.wav'))?.duration).toBeCloseTo(
      duration,
      2,
    );
  await page.getByRole('button', { name: 'Geri', exact: true }).click();
  await page.getByRole('tab', { name: /Ana səhifə/ }).click();
  await page.getByRole('button', { name: 'Oyuna başla', exact: true }).click();
  await screenshot('solo-ready');
  await page.getByRole('button', { name: 'Səhnəyə çıx' }).click();
  await expect(page.getByText('SUAL 1 / 10')).toBeVisible();
  await screenshot('question');
  await page.getByRole('button', { name: /^A\. / }).click();
  await expect(page.getByText('Bu dəfə alınmadı')).toBeVisible();
  await screenshot('answer');
  await page.getByRole('button', { name: 'Yarışdan çıx' }).click();
  await screenshot('exit');
  await page.getByRole('button', { name: 'Turu bağla' }).click();
  await expect(page.getByText('Tur bağlandı', { exact: true })).toBeVisible();
  await screenshot('result');
  await page.getByRole('button', { name: 'Ana səhifəyə qayıt' }).click();
  await page.getByRole('tab', { name: /Profil/ }).click();
  await page.getByRole('button', { name: 'Oyun tarixçəsi', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Yarış nəticəsi:/ })).toHaveCount(2);
  await screenshot('history');
  await page.getByRole('button', { name: 'Tamamlanan', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Yarış nəticəsi:/ })).toHaveCount(1);
  await page.getByRole('button', { name: /^Yarış nəticəsi:/ }).click();
  await expect(page.getByText('Bilik yolunda irəli!')).toBeVisible();
  await expect(page.getByText('On sual. On düzgün cavab. Mükəmməl tur!')).toBeVisible();
  await screenshot('promotion');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await screenshot('promotion-small');
  await page.getByRole('button', { name: 'Ana səhifəyə qayıt' }).click();
  await page.getByRole('tab', { name: /Profil/ }).click();
  await page.getByRole('button', { name: 'Oyun tarixçəsi', exact: true }).click();
  await page.getByRole('button', { name: 'Bağlanan', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Yarış nəticəsi:/ })).toHaveCount(1);
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await screenshot('history-small');
  // Public fixtures with a long display name, full long question/options and large counters.
  profile.displayName = 'Əbdürrəhman Məmmədov';
  profile.completedGames = 123456;
  await page.getByRole('button', { name: 'Geri', exact: true }).click();
  await page.getByRole('tab', { name: /Ana səhifə/ }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Qonaq kimi başla' }).click();
  await expect(page.getByText(profile.displayName, { exact: true })).toBeVisible();
  await screenshot('home-long-name');
  await page.getByRole('tab', { name: /Profil/ }).click();
  await expect(page.getByRole('heading', { name: profile.displayName, exact: true })).toBeVisible();
  await screenshot('profile-long-name');
  await page.getByRole('tab', { name: /Ana səhifə/ }).click();
  await page.getByRole('button', { name: 'Oyuna başla', exact: true }).click();
  stressQuestion = true;
  await page.getByRole('button', { name: 'Səhnəyə çıx' }).click();
  await expect(page.getByText(longQuestion, { exact: true })).toBeVisible();
  await screenshot('question-long-text');
  await page.setViewportSize({ width: 320, height: 740 });
  await page.evaluate(() => {
    for (const element of Array.from(document.querySelectorAll<HTMLElement>('[dir="auto"]'))) {
      const style = getComputedStyle(element);
      element.style.fontSize = parseFloat(style.fontSize) * 1.35 + 'px';
      if (style.lineHeight !== 'normal')
        element.style.lineHeight = parseFloat(style.lineHeight) * 1.35 + 'px';
    }
  });
  await assertTextFits(page);
  await page.getByRole('button', { name: /^D\. / }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: /^D\. / })).toBeVisible();
  await page.screenshot({
    path: 'output/testing/studio-polish/existing/question-large-type-320.png',
    animations: 'disabled',
  });
  await page.getByRole('button', { name: 'Yarışdan çıx' }).click();
  await page.getByRole('button', { name: 'Turu bağla' }).click();
  for (const duration of [25, 30]) {
    fixtureDuration = duration;
    await page.getByRole('button', { name: 'Yenidən oyna', exact: true }).click();
    await page.getByRole('button', { name: 'Səhnəyə çıx', exact: true }).click();
    await expect(page.getByText('SUAL 1 / 10')).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate((expected) => {
          const events: { source: string; duration: number; rate: number }[] = Reflect.get(
            window,
            'studioPreviewAudio',
          );
          return events.some(
            (event) =>
              event.source.includes('tick') &&
              Math.abs(event.duration - expected) < 0.001 &&
              event.rate === 1,
          );
        }, duration),
      )
      .toBe(true);
    await page.getByRole('button', { name: 'Yarışdan çıx', exact: true }).click();
    await page.getByRole('button', { name: 'Turu bağla', exact: true }).click();
    await expect(page.getByText('Tur bağlandı', { exact: true })).toBeVisible();
  }
  expect(errors).toEqual([]);
});
