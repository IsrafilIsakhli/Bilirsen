import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const directory = path.resolve('output/design/studio-tamamlama-2026-10-06');
await mkdir(path.join(directory, 'screens'), { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
try {
  const page = await browser.newPage({ viewport: { width: 1500, height: 1100 } });
  await page.goto(pathToFileURL(path.join(directory, 'BAXIS.html')).href);
  const phones = page.locator('.phone');
  for (const phone of await phones.all()) {
    const name = await phone.getAttribute('id');
    if (!name || !/^[a-z-]+$/.test(name)) throw new Error('Unexpected screen identity.');
    const fit = await phone
      .locator('.phone-content')
      .evaluate((element) => element.scrollHeight <= element.clientHeight);
    if (!fit) throw new Error('Content exceeds screen: ' + name);
    await phone.screenshot({ path: path.join(directory, 'screens', name + '.png') });
  }
  console.log('Captured ' + (await phones.count()) + ' design mockups. All content fits.');
} finally {
  await browser.close();
}
