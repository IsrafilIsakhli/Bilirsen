import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(
    pathToFileURL(path.join(root, 'output/design/studio-major-2026-10-06/BAXIS.html')).href,
  );
  assert.equal(await page.locator('figure').count(), 36);
  for (const width of ['320', '390', '430']) {
    await page.locator('#width').selectOption(width);
    await page.locator('img').evaluateAll(async (images) => {
      for (const image of images) image.loading = 'eager';
      await Promise.all(images.map((image) => image.decode()));
    });
    assert.equal(
      await page
        .locator('img')
        .evaluateAll((images) => images.every((image) => image.naturalWidth > 0)),
      true,
    );
  }
  await page.locator('#width').selectOption('320');
  await page.locator('#group').selectOption('account');
  assert.equal(await page.locator('figure:visible').count(), 5);
  const registration = page.locator('figure[data-id="register"]');
  await registration.getByRole('button', { name: 'Alt hissəyə bax', exact: true }).click();
  assert.match(await registration.locator('img').getAttribute('src'), /320-bottom\.png$/);
  await registration.getByRole('button', { name: 'Üst hissəyə qayıt', exact: true }).click();
  await page.locator('#group').selectOption('all');
  await page.locator('#width').selectOption('390');
  await page.screenshot({
    path: path.join(root, 'output/testing/studio-polish/gallery-desktop.png'),
  });
  await page.setViewportSize({ width: 320, height: 740 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  const durations = await page.locator('audio').evaluateAll(async (players) => {
    await Promise.all(
      players.map((player) =>
        player.readyState >= 1
          ? Promise.resolve()
          : new Promise((resolve, reject) => {
              player.addEventListener('loadedmetadata', resolve, { once: true });
              player.addEventListener('error', reject, { once: true });
            }),
      ),
    );
    return players.map((player) => player.duration);
  });
  for (const [index, expected] of [30, 0.85, 0.7].entries()) {
    assert.ok(Math.abs(durations[index] - expected) < 0.001);
  }
  assert.deepEqual(errors, []);
  console.log(
    'Gallery: 36 views, three width sources, filtering, bottom views, narrow layout and three audio files passed.',
  );
} finally {
  await browser.close();
}
