import { test, expect } from '@playwright/test';
import { captureResponsive, assertTextFits } from './responsive-capture';

test('native design screens navigate, fit small widths and never submit sample account or duel data', async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  const requests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('request', (request) => {
    if (request.url().includes('/v1/')) requests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Bütün dizayn ekranlarına bax', exact: true }).click();
  await expect(page.getByText('19 ekran, bir üslub.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Giriş dizaynına bax', exact: true }).click();
  const screens = [
    ['login', 'Giriş'],
    ['register', 'Qeydiyyat'],
    ['password-recovery', 'Şifrə bərpası'],
    ['email-verification', 'E-poçt təsdiqi'],
    ['guest-conversion', 'Qonaqdan hesaba keçid'],
    ['search', 'Rəqib axtarışı'],
    ['faceoff', 'Duel başlayır'],
    ['duel-question', 'Duel sualı'],
    ['overtime', 'Əlavə mərhələ'],
    ['victory', 'Duel qələbəsi'],
    ['defeat', 'Duel məğlubiyyəti'],
    ['leaderboard-full', 'Dolu reytinq'],
    ['connection-lost', 'Bağlantı kəsilib'],
    ['loading-state', 'Yarış hazırlanır'],
    ['empty-history', 'Boş tarixçə'],
    ['request-error', 'Məlumat alınmadı'],
    ['launch-screen', 'Açılış ekranı'],
    ['app-icon', 'Tətbiq ikonu'],
    ['motion-preview', 'Duel keçidinin hərəkəti'],
  ] as const;
  for (const [index, [id, title]] of screens.entries()) {
    if (id !== 'launch-screen')
      await expect(page.getByText(title, { exact: true }).first()).toBeVisible();
    await expect(page.getByText('DİZAYN BAXIŞI · NÜMUNƏ MƏLUMATLAR')).toBeVisible();
    await captureResponsive(page, 'design', id);
    if (id === 'leaderboard-full' || id === 'faceoff' || id === 'duel-question') {
      // Stress presentation text without enabling or contacting the pending services.
      await page
        .getByText('Nərmin', { exact: true })
        .first()
        .evaluate((element) => {
          element.textContent = 'Əbdürrəhman Məmmədov';
        });
      await page
        .getByText('Rauf', { exact: true })
        .first()
        .evaluate((element) => {
          element.textContent = 'Məhəmmədəli Həsənzadə';
        });
      if (id === 'leaderboard-full') {
        await page.getByText('8.000 xal', { exact: true }).evaluate((element) => {
          element.textContent = '1.234.567 xal';
        });
        await page.getByText('5.820', { exact: true }).evaluate((element) => {
          element.textContent = '987.654';
        });
      }
      await captureResponsive(page, 'stress', id);
    }
    await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(
      page.getByRole('button', { name: 'Bütün dizayn ekranları', exact: true }),
    ).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    if (index < screens.length - 1)
      await page.getByRole('button', { name: 'Növbəti ekran', exact: true }).click();
  }
  await expect(page.getByRole('button', { name: 'Hərəkəti başlat', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Növbəti keçidi göstər', exact: true }).click();
  await expect(page.getByText('Hələ bitmədi.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Bütün dizayn ekranları', exact: true }).click();
  await page.getByRole('button', { name: 'Giriş dizaynına bax', exact: true }).click();
  const password = page.getByRole('textbox', { name: 'Şifrə', exact: true });
  await password.fill('presentation-only');
  await expect(password).toHaveAttribute('type', 'password');
  await page.getByRole('button', { name: 'Şifrəni göstər', exact: true }).click();
  await expect(password).toHaveJSProperty('type', 'text');
  await expect(
    page.getByRole('button', { name: 'Daxil ol · tezliklə', exact: true }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Şifrəni unutdun?', exact: true }).click();
  await expect(page.getByText('Şifrə bərpası', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Bütün dizayn ekranları', exact: true }).click();
  await page.getByRole('button', { name: 'Qeydiyyat dizaynına bax', exact: true }).click();
  // A short viewport simulates the space available above a keyboard in web QA.
  await page.setViewportSize({ width: 320, height: 380 });
  for (const name of ['İstifadəçi adı', 'E-poçt ünvanı', 'Şifrə', 'Şifrəni təkrar yaz']) {
    const input = page.getByRole('textbox', { name, exact: true });
    await input.scrollIntoViewIfNeeded();
    await input.focus();
    await expect(input).toBeVisible();
    await assertTextFits(page);
  }
  const submit = page.getByRole('button', { name: 'Hesab yarat · tezliklə', exact: true });
  await submit.scrollIntoViewIfNeeded();
  await expect(submit).toBeVisible();
  await expect(submit).toBeDisabled();
  await page.screenshot({
    path: 'output/testing/studio-polish/design/register-keyboard-space-320.png',
    animations: 'disabled',
  });
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
});
