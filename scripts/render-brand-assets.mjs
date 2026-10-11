import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const directory = path.resolve('apps/mobile/assets/brand');
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
  await page.goto(
    pathToFileURL(path.resolve('output/design/studio-tamamlama-2026-10-06/BAXIS.html')).href,
  );
  const source = await page
    .locator('#launch-screen .brand-mark')
    .evaluate((element) => element.outerHTML);
  const svg = source.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  await writeFile(path.join(directory, 'icon.svg'), svg);
  await page.setContent(
    `<style>body{margin:0;background:#061321;display:grid;place-items:center;width:1024px;height:1024px}svg{width:960px;height:960px}</style>${svg}`,
  );
  await page.screenshot({ path: path.join(directory, 'icon.png') });
  console.log('Studio icon rendered at 1024 × 1024.');
} finally {
  await browser.close();
}
