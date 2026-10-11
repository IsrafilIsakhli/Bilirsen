import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = await readFile(path.join(root, 'apps/mobile/.env.local'), 'utf8');
const configured = config.match(/^EXPO_PUBLIC_API_URL=(.+)$/m)?.[1];
if (!configured) throw new Error('Set EXPO_PUBLIC_API_URL in apps/mobile/.env.local first.');
const host = new URL(configured).hostname;
const expoUrl = `exp://${host}:8081`;
const out = path.join(root, 'output/testing/phone');
await mkdir(out, { recursive: true });
await QRCode.toFile(path.join(out, 'expo-go.png'), expoUrl, {
  width: 320,
  margin: 3,
  errorCorrectionLevel: 'M',
});
await writeFile(
  path.join(out, 'BAXIS.html'),
  `<!doctype html><html lang="az"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bilirsən? · Telefon sınağı</title><style>body{margin:0;background:#071522;color:#f5f7fb;font:17px system-ui;display:grid;place-items:center;min-height:100vh}main{max-width:600px;padding:32px;text-align:center}h1{font-size:48px;margin:0 0 16px;color:#efbf69}img{border-radius:12px;width:280px;max-width:100%}a{color:#efbf69}p{line-height:1.6}</style><main><h1>Bilirsən?</h1><p>Telefon və kompüter eyni Wi-Fi şəbəkəsində olsun.</p><img src="expo-go.png" alt="Expo Go ilə açmaq üçün QR kod"><p><a href="${expoUrl}">Expo Go-da aç</a></p><p>iPhone kamerası ilə QR kodu oxut.<br>Expo Go-da kompüterdəki hesabla daxil ol.</p><p><a href="http://${host}:8081">Brauzerdə sınaq</a> · <a href="http://${host}:3000/v1/health">Serveri yoxla</a></p></main></html>`,
  'utf8',
);
console.log(`Phone URL: ${expoUrl}`);
console.log('QR code saved to output/testing/phone/expo-go.png');
