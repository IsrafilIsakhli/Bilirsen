import { test, expect } from '@playwright/test';
test('guest enters the Studio, plays, abandons and sees persisted history', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByText('Səhnə sənindir.')).toBeVisible();
  await page.screenshot({
    animations: 'disabled',
    path: 'output/testing/2026-10-06/01-welcome.png',
  });
  await page.getByRole('button', { name: 'Qonaq kimi başla' }).click();
  await expect(page.getByText('Yarışa hazırsan?')).toBeVisible();
  await page.screenshot({ animations: 'disabled', path: 'output/testing/2026-10-06/02-home.png' });
  await page.getByRole('button', { name: 'Solo rankını göstər' }).click();
  await expect(page.getByText('Solo rank qaydaları')).toBeVisible();
  await page.screenshot({ animations: 'disabled', path: 'output/testing/2026-10-06/03-rank.png' });
  await page.getByRole('button', { name: 'Geri', exact: true }).click();
  await page.getByRole('button', { name: 'Oyuna başla', exact: true }).click();
  await page.getByRole('button', { name: 'Səhnəyə çıx' }).click();
  await expect(page.getByText('SUAL 1 / 10')).toBeVisible();
  await page.screenshot({
    animations: 'disabled',
    path: 'output/testing/2026-10-06/04-question.png',
  });
  await page.getByRole('button', { name: /^A\. / }).click();
  await expect(page.getByText(/Düzgün!|Bu dəfə alınmadı/)).toBeVisible();
  await page.screenshot({
    animations: 'disabled',
    path: 'output/testing/2026-10-06/05-answer.png',
  });
  await expect(page.getByText('SUAL 2 / 10')).toBeVisible();
  await page.getByRole('button', { name: 'Yarışdan çıx' }).click();
  await page.getByRole('button', { name: 'Turu bağla' }).click();
  await expect(page.getByText('Tur bağlandı', { exact: true })).toBeVisible();
  await page.screenshot({
    animations: 'disabled',
    path: 'output/testing/2026-10-06/06-result.png',
  });
  await page.getByRole('button', { name: 'Ana səhifəyə qayıt' }).click();
  await expect(page.getByRole('button', { name: /Son nəticə/ }).last()).toBeVisible();
  expect(errors).toEqual([]);
});
