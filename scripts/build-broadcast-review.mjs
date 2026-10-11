import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const screens = [
  ['welcome', 'Qarşılama'],
  ['home', 'Ana səhifə'],
  ['question', 'Sual və cavab'],
  ['result', 'Tur nəticəsi'],
  ['duel', 'Duel studiyası'],
  ['profile', 'Profil'],
];
const html = `<!doctype html><html lang="az"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bilirsən? · Yeni veriliş atmosferi</title><style>
*{box-sizing:border-box}body{margin:0;background:#061321;color:#f6f7fc;font:16px/1.6 system-ui,sans-serif}main{max-width:1200px;margin:auto;padding:32px 20px}h1{font-size:clamp(28px,5vw,44px);line-height:1.2;letter-spacing:-1px}h2{font-size:22px}p{color:#afc4df}a{color:#efbf69}.eyebrow{color:#efbf69;font-size:12px;letter-spacing:2px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:20px}.card{padding:18px;border:1px solid #385f8a;border-radius:20px;background:#102035;margin:12px 0;min-width:0}.card img{width:100%;display:block;border-radius:12px}.note{font-size:13px}.card h2{margin-top:0}audio{width:100%}button{min-height:44px;width:100%;margin-top:12px;padding:10px;background:#193148;color:#ffdda0;font:inherit;border:1px solid #4a6b87;border-radius:12px;cursor:pointer}button:focus-visible{outline:2px solid #efbf69;outline-offset:3px}@media(max-width:380px){.grid{grid-template-columns:1fr}}
</style></head><body><main><span class="eyebrow">BİLİRSƏN? · STUDİYA V7</span><h1>Tik–tak qayıtdı. Səhnə işıqları yandı.</h1><p>Dörd proyektor, səhnə platforması və yeni sual paneli ilə daha güclü veriliş atmosferi. Aydın tik–tak musiqinin içində qalır və sona yaxın sıxlaşır.</p><p><a href="../../design/studio-broadcast-2026-10-06/BAXIS.html">Bütün ekranları 320 / 390 / 430 enlərdə aç →</a></p><h2>Əsas ekranlar</h2><p class="note">İndi yeni görünüş göstərilir. Düymə ilə əvvəlki versiyanı müqayisə edə bilərsən. Şəkillər sınaq məlumatları ilə çəkilib; canlı duel və hesab xidmətləri hələ hazır deyil.</p><div class="grid">${screens.map(([id, title]) => `<section class="card" data-id="${id}"><h2>${title}</h2><img src="../studio-polish/existing/${id}-390.png" alt="${title} · yeni görünüş"><button type="button">Əvvəlki görünüşə bax</button></section>`).join('')}</div><h2>Saat ritmini müqayisə et</h2><p>Yeni fonda tik və tak növbələşir. Musiqi ayrıca 20/25/30 saniyə üçün hazırlanıb; tətbiq onu sürətləndirmir. Düzgün və yanlış cavab vurğuları saxlanıb.</p><div class="grid"><section class="card"><h2>Əvvəlki yumşaq fon · 30 san</h2><audio controls preload="metadata" src="before/tick.wav"></audio></section>${[20, 25, 30].map((duration) => `<section class="card"><h2>Yeni tik–tak · ${duration} san</h2><audio controls preload="metadata" src="../../../apps/mobile/assets/sounds/${duration === 30 ? 'tick' : 'tick-' + duration}.wav"></audio></section>`).join('')}</div><p><a href="../studio-sound-v4/BAXIS.html">Başlanğıcı, ortanı və son hissəni dinlə →</a></p><p class="note">Expo Go-da tətbiqi yenilə. Fiziki iPhone/Android-də səs və ekran davranışı ayrıca yoxlanmalıdır.</p></main><script>
document.querySelectorAll('[data-id]').forEach(card=>{let previous=false;card.querySelector('button').addEventListener('click',()=>{previous=!previous;card.querySelector('img').src=previous?'before/'+card.dataset.id+'-390.png':'../studio-polish/existing/'+card.dataset.id+'-390.png';card.querySelector('button').textContent=previous?'Yeni görünüşə qayıt':'Əvvəlki görünüşə bax';});});
const players=Array.from(document.querySelectorAll('audio'));players.forEach(player=>{player.volume=.5;player.addEventListener('play',()=>players.forEach(other=>{if(other!==player)other.pause();}));});
</script></body></html>`;
await writeFile(path.join(root, 'output/testing/studio-broadcast-2026-10-06/BAXIS.html'), html);
console.log('Broadcast review: six screen comparisons and four timer tracks ready.');
