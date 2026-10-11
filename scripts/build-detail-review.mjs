import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const destination = path.join(root, 'output/testing/studio-major-2026-10-06');
const screens = [
  ['welcome', 'Qarşılama', 'existing'],
  ['home', 'Ana səhifə', 'existing'],
  ['solo-ready', 'Solo hazırlıq', 'existing'],
  ['question', 'Sual və cavab', 'existing'],
  ['result', 'Tur nəticəsi', 'existing'],
  ['rank', 'Bilik pillələri', 'existing'],
  ['duel', 'Duel studiyası', 'existing'],
  ['profile', 'Profil', 'existing'],
  ['history', 'Tarixçə', 'existing'],
  ['settings', 'Tənzimləmələr', 'existing'],
  ['login', 'Giriş', 'design'],
  ['leaderboard-full', 'Reytinq podiumu', 'design'],
];
const html = `<!doctype html><html lang="az"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bilirsən? · Ekran müqayisəsi</title><style>
*{box-sizing:border-box}body{margin:0;background:#061321;color:#f6f7fc;font:16px/1.6 system-ui,sans-serif}main{max-width:1200px;margin:auto;padding:32px 20px}h1{font-size:clamp(28px,5vw,44px);line-height:1.2;letter-spacing:-1px}h2{font-size:22px}p{color:#afc4df}a{color:#efbf69}.eyebrow{color:#efbf69;font-size:12px;letter-spacing:2px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:20px}.card{padding:18px;border:1px solid #35516c;border-radius:20px;background:#102035;margin:12px 0;min-width:0}.card img{width:100%;display:block;border-radius:12px}.note{font-size:13px}.card h2{margin-top:0}audio{width:100%}button{min-height:44px;width:100%;margin-top:12px;padding:10px;background:#193148;color:#ffdda0;font:inherit;border:1px solid #4a6b87;border-radius:12px;cursor:pointer}button:focus-visible,a:focus-visible{outline:2px solid #efbf69;outline-offset:3px}@media(max-width:380px){.grid{grid-template-columns:1fr}}
</style></head><body><main><span class="eyebrow">BİLİRSƏN? · 06.10.2026</span><h1>Studiyanın geniş yenilənməsi.</h1><p>Ana səhifə və qarşılaşma üçün xüsusi səhnə panelləri, sualda yeni dairəvi vaxt göstəricisi, profildə düzgün cavab göstəricisi və nəticədə ayrıca tur icmalı. Reytinq podiumu, rank təqdimatı və səs ayarları da yenilənib.</p><p><a href="../../design/studio-major-2026-10-06/BAXIS.html">Bütün 36 görünüşü 320 / 390 / 430 enlərdə aç →</a></p><h2>Əvvəlki və yeni görünüş</h2><p class="note">İndi yeni ekran göstərilir. Düymə ilə əvvəlki versiyanı aça bilərsən. Görüntülər sınaq məlumatları ilə çəkilib; canlı duel, hesab və rəsmi reytinq xidmətləri hələ hazır deyil.</p><div class="grid">${screens.map(([id, title, folder]) => `<section class="card" data-id="${id}" data-folder="${folder}"><h2>${title}</h2><img src="../studio-polish/${folder}/${id}-390.png" alt="${title} · yeni görünüş"><button type="button">Əvvəlki görünüşə bax</button></section>`).join('')}</div><h2>Səs sistemi saxlanılıb</h2><p>Tik–tak fonu və hər iki cavab səsi əvvəlki fayllarla eynidir. Fonun sona yaxın sürətlənməsi və susdurma davranışı saxlanılır.</p><div class="grid">${[
  ['tick', 'Tik–tak fonu · 30 san'],
  ['correct', 'Düzgün cavab · 0,85 san'],
  ['wrong', 'Yanlış cavab · 0,70 san'],
]
  .map(
    ([cue, title]) =>
      `<section class="card"><h2>${title}</h2><audio controls preload="metadata" src="../../../apps/mobile/assets/sounds/${cue}.wav"></audio></section>`,
  )
  .join(
    '',
  )}</div><p><a href="../studio-sound-v4/BAXIS.html">Fonun başlanğıcını, ortasını və sonunu dinlə →</a></p><p class="note">Expo Go-da tətbiqi yenilə. Fiziki iPhone və Android-də ayrıca yoxlama aparılmalıdır.</p></main><script>
document.querySelectorAll('[data-id]').forEach(card=>{let previous=false;card.querySelector('button').addEventListener('click',()=>{previous=!previous;const image=card.querySelector('img');image.src=(previous?'before/':'../studio-polish/')+card.dataset.folder+'/'+card.dataset.id+'-390.png';image.alt=card.querySelector('h2').textContent+(previous?' · əvvəlki görünüş':' · yeni görünüş');card.querySelector('button').textContent=previous?'Yeni görünüşə qayıt':'Əvvəlki görünüşə bax';});});
const players=Array.from(document.querySelectorAll('audio'));players.forEach((player,index)=>{player.volume=index===0?.5:.6;player.addEventListener('play',()=>players.forEach(other=>{if(other!==player)other.pause();}));});
</script></body></html>`;
await mkdir(destination, { recursive: true });
await writeFile(path.join(destination, 'BAXIS.html'), html);
console.log('Detail review: twelve screen comparisons and preserved sound previews ready.');
