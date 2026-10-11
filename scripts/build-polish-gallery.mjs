import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const destination = path.join(root, 'output/design/studio-major-2026-10-06');
const existing = [
  ['welcome', 'Qarşılama'],
  ['home', 'Ana səhifə'],
  ['solo-ready', 'Solo hazırlıq'],
  ['question', 'Sual'],
  ['answer', 'Cavabın açılması'],
  ['result', 'Tur nəticəsi'],
  ['promotion', 'Rank yüksəlməsi'],
  ['rank', 'Bilik pillələri'],
  ['duel', 'Duel studiyası'],
  ['leaderboard', 'Reytinq · gözləmə'],
  ['profile', 'Profil'],
  ['history', 'Tarixçə'],
  ['settings', 'Tənzimləmələr'],
];
const designs = [
  ['login', 'Giriş', 'account'],
  ['register', 'Qeydiyyat', 'account'],
  ['password-recovery', 'Şifrə bərpası', 'account'],
  ['email-verification', 'E-poçt təsdiqi', 'account'],
  ['guest-conversion', 'Hesaba keçid', 'account'],
  ['search', 'Rəqib axtarışı', 'duel'],
  ['faceoff', 'Qarşılaşma', 'duel'],
  ['duel-question', 'Duel sualı', 'duel'],
  ['overtime', 'Əlavə mərhələ', 'duel'],
  ['victory', 'Duel qələbəsi', 'duel'],
  ['defeat', 'Duel məğlubiyyəti', 'duel'],
  ['leaderboard-full', 'Reytinq · dolu görünüş', 'duel'],
  ['connection-lost', 'Bağlantı', 'states'],
  ['loading-state', 'Yüklənmə', 'states'],
  ['empty-history', 'Boş tarixçə', 'states'],
  ['request-error', 'Xəta', 'states'],
  ['launch-screen', 'Açılış', 'states'],
  ['app-icon', 'İkon', 'states'],
  ['motion-preview', 'Hərəkət nümunəsi', 'states'],
];
const extras = [
  ['exit', 'Çıxış pəncərəsi'],
  ['home-long-name', 'Uzun ad'],
  ['profile-long-name', 'Uzun profil adı və böyük rəqəmlər'],
  ['question-long-text', 'Uzun sual və variant'],
];
const entries = [
  ...existing.map(([id, title]) => ({
    id,
    title,
    folder: 'existing',
    group: 'existing',
    sample: true,
  })),
  ...designs.map(([id, title, group]) => ({ id, title, folder: 'design', group, sample: true })),
  ...extras.map(([id, title]) => ({ id, title, folder: 'existing', group: 'extra', sample: true })),
];
await mkdir(destination, { recursive: true });
for (const entry of entries)
  for (const width of [320, 390, 430]) {
    await access(
      path.join(root, `output/testing/studio-polish/${entry.folder}/${entry.id}-${width}.png`),
    );
  }
const availableBottoms = [];
for (const entry of entries)
  for (const width of [320, 390, 430]) {
    try {
      await access(
        path.join(
          root,
          `output/testing/studio-polish/${entry.folder}/${entry.id}-${width}-bottom.png`,
        ),
      );
      availableBottoms.push(`${entry.id}-${width}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
const cards = entries
  .map(
    (entry, index) =>
      `<figure data-group="${entry.group}" data-id="${entry.id}" data-folder="${entry.folder}"><figcaption><span>${String(index + 1).padStart(2, '0')}</span> ${entry.title}</figcaption><p class="note">${entry.group === 'existing' || entry.group === 'extra' ? 'Tətbiq görünüşü · sınaq məlumatları' : 'Dizayn nümunəsi · xidmət hələ açılmayıb'}</p><a class="picture" href="../../testing/studio-polish/${entry.folder}/${entry.id}-390.png"><img loading="lazy" src="../../testing/studio-polish/${entry.folder}/${entry.id}-390.png" alt="${entry.title}"></a><button class="bottom" type="button">Alt hissəyə bax</button></figure>`,
  )
  .join('\n');
const metrics = JSON.parse(
  await readFile(path.join(root, 'apps/mobile/assets/sounds/metrics.json'), 'utf8'),
);
const html = `<!doctype html><html lang="az"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bilirsən? · Cilalanmış studiya</title><style>
*{box-sizing:border-box}body{margin:0;background:#061321;color:#f6f7fc;font:16px/1.5 system-ui,sans-serif}main{max-width:1600px;margin:auto;padding:32px 24px}header{max-width:900px;padding-bottom:24px}h1{font-size:clamp(28px,4vw,44px);line-height:1.2;letter-spacing:-1px}h2{font-size:24px}p{color:#afc4df}.eyebrow{color:#efbf69;font-size:12px;letter-spacing:2px}a{color:#efbf69}nav{position:sticky;top:0;background:#081725f5;z-index:2;padding:12px 0;border-block:1px solid #27405e;display:flex;gap:12px;align-items:center;flex-wrap:wrap}button,select{min-height:44px;border:1px solid #385f8a;background:#14253a;color:#ffdda0;border-radius:10px;padding:8px 14px;font:inherit;cursor:pointer}button:disabled{color:#7d94ab;cursor:default}button:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid #efbf69;outline-offset:3px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;margin:24px 0}figure{margin:0;padding:16px;background:#0d1d2e;border:1px solid #27405e;border-radius:20px;min-width:0}figure[hidden]{display:none}figcaption{font-weight:700}figcaption span{color:#efbf69;margin-right:6px}.picture{display:block}.picture img{display:block;width:100%;height:auto;border-radius:12px}.note{font-size:12px;line-height:18px}.bottom{width:100%;margin-top:12px}.sounds{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}.sound{border:1px solid #385f8a;border-radius:20px;padding:20px;background:#102035}.sound audio{width:100%}.sound h3{margin-top:0}#count{margin-left:auto;color:#afc4df;font-size:12px}@media(max-width:600px){main{padding:24px 16px}.grid{grid-template-columns:1fr}nav{position:static}}
</style></head><body><main><header><span class="eyebrow">BİLİRSƏN? · 06.10.2026</span><h1>Bir studiya. Bütün ekranlar.</h1><p>Yeni səhnə panelləri, dairəvi vaxt göstəricisi, profil üzrə bilik göstəricisi və turun ətraflı icmalı: 13 mövcud ekran və 19 yeni dizayn görünüşü. Aşağıda çıxış pəncərəsi və uzun mətn nümunələri də var.</p><p class="note">Görüntülər mobil tətbiqin brauzer təqdimatından çəkilib. Hesab, canlı duel və rəsmi reytinq xidmətləri hələ hazır deyil. Fiziki iPhone və Android yoxlaması ayrıca aparılmalıdır.</p><a href="#sounds">Fon və cavab səslərini dinlə ↓</a></header><nav aria-label="Baxış seçimləri"><label>Telefon eni <select id="width"><option>320</option><option selected>390</option><option>430</option></select></label><label>Ekranlar <select id="group"><option value="all">Hamısı</option><option value="existing">Mövcud tətbiq</option><option value="account">Hesab</option><option value="duel">Duel və reytinq</option><option value="states">Əlavə vəziyyətlər</option><option value="extra">Uzun mətn və çıxış</option></select></label><span id="count"></span></nav><div class="grid">${cards}</div><section id="sounds"><span class="eyebrow">STUDİYA VURĞULARI</span><h2>Fon və cavab səsləri</h2><p>Tik–tak fonu saxlanılıb; sona yaxın ritm sıxlaşır. 20, 25 və 30 saniyə üçün ayrıca musiqi çalınır. Düzgün və yanlış cavab vurğuları saxlanılıb.</p><div class="sounds">${[
  ['tick', 'Sualın fonu', '30 saniyə · aydın tik–tak və gərgin fon'],
  ['correct', 'Düzgün cavab', '0,85 saniyə · isti, qərarlı vurğu'],
  ['wrong', 'Yanlış cavab', '0,70 saniyə · tünd, enən vurğu'],
]
  .map(
    ([cue, title, note]) =>
      `<article class="sound"><h3>${title}</h3><p>${note}</p><audio controls preload="metadata" src="../../../apps/mobile/assets/sounds/${cue}.wav"></audio></article>`,
  )
  .join(
    '',
  )}</div><p><a href="../../testing/studio-major-2026-10-06/BAXIS.html">Əvvəlki və yeni ekranları müqayisə et</a></p><p><a href="../../testing/studio-sound-v4/BAXIS.html">Fonun başlanğıcını, ortasını və sonunu müqayisə et</a></p><p class="note">Cavab fayllarının ölçülmüş pikləri: ${metrics.find((item) => item.cue === 'correct').peakDbFS} / ${metrics.find((item) => item.cue === 'wrong').peakDbFS} dBFS. Uyğunlaşdırılmış orta səviyyə: ${metrics.find((item) => item.cue === 'correct').rmsDbFS} / ${metrics.find((item) => item.cue === 'wrong').rmsDbFS} dBFS.</p></section></main><script>
const widths=document.getElementById('width'),group=document.getElementById('group'),cards=Array.from(document.querySelectorAll('figure')),bottoms=new Set(${JSON.stringify(availableBottoms)});
function refresh(){let count=0;cards.forEach(card=>{card.hidden=group.value!=='all'&&card.dataset.group!==group.value;if(!card.hidden)count++;card.dataset.bottom='false';const base='../../testing/studio-polish/'+card.dataset.folder+'/'+card.dataset.id+'-'+widths.value+'.png';card.querySelector('img').src=base;card.querySelector('a').href=base;const button=card.querySelector('button');button.disabled=!bottoms.has(card.dataset.id+'-'+widths.value);button.textContent=button.disabled?'Bütün məzmun görünür':'Alt hissəyə bax';});document.getElementById('count').textContent=count+' görünüş';}
cards.forEach(card=>card.querySelector('button').addEventListener('click',()=>{const bottom=card.dataset.bottom!=='true';card.dataset.bottom=String(bottom);const source='../../testing/studio-polish/'+card.dataset.folder+'/'+card.dataset.id+'-'+widths.value+(bottom?'-bottom':'')+'.png';card.querySelector('img').src=source;card.querySelector('a').href=source;card.querySelector('button').textContent=bottom?'Üst hissəyə qayıt':'Alt hissəyə bax';}));widths.addEventListener('change',refresh);group.addEventListener('change',refresh);refresh();
const players=Array.from(document.querySelectorAll('audio'));players.forEach((player,index)=>{player.volume=index===0?.50:.60;player.addEventListener('play',()=>players.forEach(other=>{if(player!==other)other.pause();}));});
</script></body></html>`;
await writeFile(path.join(destination, 'BAXIS.html'), html);
await writeFile(path.join(destination, 'screens.json'), JSON.stringify(entries, null, 2));
const currentGallery = path.join(root, 'output/design/studio-polish-2026-10-06/BAXIS.html');
await writeFile(currentGallery, html);
console.log(`Gallery ready: ${entries.length} views, three widths.`);
