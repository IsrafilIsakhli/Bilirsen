import { test, expect } from '@playwright/test';
const isTimer = (event: { source: string }) => /tick(?:-(?:20|25))?\.wav/.test(event.source);
type Playback = {
  source: string;
  volume: number;
  duration: number;
  rate: number;
  position: number;
};
test('Studio pages, sound previews, mute and server answer sound work together', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.addInitScript(() => {
    const events: {
      source: string;
      volume: number;
      duration: number;
      rate: number;
      position: number;
    }[] = [];
    Object.defineProperty(window, 'studioAudioEvents', { value: events });
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      return play.call(this).then(() => {
        events.push({
          source: this.currentSrc,
          volume: this.volume,
          duration: this.duration,
          rate: this.playbackRate,
          position: this.currentTime,
        });
      });
    };
  });
  const events = () => page.evaluate(() => Reflect.get(window, 'studioAudioEvents') as Playback[]);
  await page.goto('/');
  await page.getByRole('button', { name: 'Qonaq kimi başla' }).click();
  await expect(page.getByText('Yarışa hazırsan?')).toBeVisible();
  await page.getByRole('tab', { name: /Duel/ }).click();
  await expect(page.getByRole('button', { name: 'Rəqib tap · tezliklə' })).toBeDisabled();
  await page.screenshot({
    animations: 'disabled',
    path: 'output/testing/studio-refinement/duel.png',
  });
  await page.getByRole('tab', { name: /Reytinq/ }).click();
  await page.getByRole('button', { name: 'Duel reytinqi', exact: true }).click();
  await expect(page.getByText('Duel rankı canlı yarış açıldıqdan sonra dəyişəcək.')).toBeVisible();
  await page.screenshot({
    animations: 'disabled',
    path: 'output/testing/studio-refinement/leaderboard.png',
  });
  await page.getByRole('tab', { name: /Profil/ }).click();
  await page.screenshot({
    animations: 'disabled',
    path: 'output/testing/studio-refinement/profile.png',
  });
  await page.getByRole('button', { name: 'Oyun tarixçəsi', exact: true }).click();
  await expect(page.getByText('İlk nəticən burada görünəcək')).toBeVisible();
  await page.getByRole('button', { name: 'Geri', exact: true }).click();
  await page.getByRole('button', { name: 'Tənzimləmələr', exact: true }).click();
  await page.getByRole('button', { name: 'Düzgün cavab səsini dinlə' }).click();
  await expect
    .poll(
      async () => (await events()).filter((event) => event.source.includes('correct.wav')).length,
    )
    .toBe(1);
  await page.getByRole('button', { name: 'Səhv cavab səsini dinlə' }).click();
  await expect
    .poll(async () => (await events()).filter((event) => event.source.includes('wrong.wav')).length)
    .toBe(1);
  await page.getByRole('button', { name: 'Saniyə səsini dinlə' }).click();
  await expect.poll(async () => (await events()).filter(isTimer).length).toBe(1);
  await page.getByRole('button', { name: 'Dinləməni dayandır', exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        Array.from(document.querySelectorAll('audio')).every((player) => player.paused),
      ),
    )
    .toBe(true);
  await page.screenshot({
    animations: 'disabled',
    path: 'output/testing/studio-refinement/settings.png',
  });
  await page.getByRole('switch', { name: 'Yarış səsləri', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Düzgün cavab səsini dinlə' })).toBeDisabled();
  await page.getByRole('button', { name: 'Geri', exact: true }).click();
  await page.getByRole('tab', { name: /Ana səhifə/ }).click();
  await page.getByRole('button', { name: 'Oyuna başla', exact: true }).click();
  await page.screenshot({
    animations: 'disabled',
    path: 'output/testing/studio-refinement/solo-ready.png',
  });
  await page.getByRole('button', { name: 'Səhnəyə çıx' }).click();
  await expect(page.getByText('SUAL 1 / 10')).toBeVisible();
  const mutedCount = (await events()).length;
  await page.waitForTimeout(2200);
  expect((await events()).length).toBe(mutedCount);
  await page.getByRole('button', { name: 'Səsi aç', exact: true }).click();
  await expect.poll(async () => (await events()).length).toBeGreaterThan(mutedCount);
  const timerStarts = (await events()).filter(isTimer).length;
  const liveTimer = (await events()).filter(isTimer).at(-1);
  expect(liveTimer?.rate).toBe(1);
  expect([20, 25, 30]).toContain(liveTimer?.duration);
  expect(liveTimer?.position).toBeGreaterThan(0); // Unmuting resumes the elapsed phase, not the beginning.
  await page.waitForTimeout(2400);
  expect((await events()).filter(isTimer).length).toBe(timerStarts);
  await page.getByRole('button', { name: 'Yarışdan çıx', exact: true }).click();
  await page.waitForTimeout(1100);
  expect((await events()).filter(isTimer).length).toBe(timerStarts);
  await page.getByRole('button', { name: 'Oyuna davam et', exact: true }).click();
  await expect.poll(async () => (await events()).filter(isTimer).length).toBe(timerStarts + 1);
  const beforeAnswer = (await events()).filter((event) =>
    /correct.wav|wrong.wav/.test(event.source),
  ).length;
  await page.getByRole('button', { name: /^A\. / }).click();
  await expect(page.getByText(/Düzgün!|Bu dəfə alınmadı/)).toBeVisible();
  const wasCorrect = await page.getByText(/Düzgün!/).isVisible();
  await expect
    .poll(
      async () =>
        (await events()).filter((event) => /correct.wav|wrong.wav/.test(event.source)).length,
    )
    .toBe(beforeAnswer + 1);
  const answerCues = (await events()).filter((event) => /correct.wav|wrong.wav/.test(event.source));
  expect(answerCues.at(-1)?.source).toContain(wasCorrect ? 'correct.wav' : 'wrong.wav');
  await expect(page.getByText('SUAL 2 / 10')).toBeVisible();
  await expect.poll(async () => (await events()).filter(isTimer).length).toBe(timerStarts + 2);
  expect((await events()).filter(isTimer).at(-1)?.position).toBeLessThan(1.5);
  expect(
    (await events()).filter((event) => /correct.wav|wrong.wav/.test(event.source)).length,
  ).toBe(beforeAnswer + 1);
  await page.getByRole('button', { name: 'Yarışdan çıx' }).click();
  await page.getByRole('button', { name: 'Turu bağla' }).click();
  await expect(page.getByText('Tur bağlandı', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Ana səhifəyə qayıt' }).click();
  await page.getByRole('tab', { name: /Profil/ }).click();
  await page.getByRole('button', { name: 'Oyun tarixçəsi', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Yarış nəticəsi:/ })).toBeVisible();
  await page.getByRole('button', { name: 'Tamamlanan', exact: true }).click();
  await expect(page.getByText('Bu bölmədə hələ nəticə yoxdur')).toBeVisible();
  await page.getByRole('button', { name: 'Bağlanan', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Yarış nəticəsi:/ })).toHaveCount(1);
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({
    animations: 'disabled',
    path: 'output/testing/studio-refinement/history.png',
  });
  expect((await events()).every((event) => event.duration > 0 && event.volume <= 0.65)).toBe(true);
  const previewEvents = await events();
  expect(previewEvents.find(isTimer)?.duration).toBeCloseTo(30, 2);
  expect(previewEvents.find((event) => event.source.includes('correct.wav'))?.duration).toBeCloseTo(
    0.85,
    2,
  );
  expect(previewEvents.find((event) => event.source.includes('wrong.wav'))?.duration).toBeCloseTo(
    0.7,
    2,
  );
  expect(errors).toEqual([]);
});
