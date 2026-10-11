import { readFile, writeFile } from 'node:fs/promises';
import prettier from 'prettier';

const file = 'output/design/studio-tamamlama-2026-10-06/BAXIS.html';
let html = await readFile(file, 'utf8');
if (html.includes('id="completion"')) throw new Error('The complete board already exists.');
const icon = (name, size = 42) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24"><use href="#${name}"/></svg>`;
const field = (label, value) =>
  `<div class="field"><small>${label}</small><span>${value}</span></div>`;
const hero = (name, heading, text) =>
  `<div class="hero"><span class="eyebrow">BİLİK SƏHNƏSİ</span><div class="medal large">${icon(name)}</div><h1>${heading}</h1><p>${text}</p></div>`;
const footer = (label, secondary = 'Studiyaya qayıt') =>
  `<div class="bottom"><div class="cta">${label}</div><div class="cta outline">${secondary}</div></div>`;
const phone = (id, title, contents, note = 'Yeni dizayn maketi · tətbiqə əlavə edilməyib') =>
  `<article><h3 class="screen-title">${title}</h3><p class="screen-note">${note}</p><div class="phone" id="${id}"><div class="rim"></div><div class="rim floor"></div><div class="phone-content"><div class="bar">${icon('back', 21)}<b>${title}</b><span style="width:21px"></span></div>${contents}</div><div class="stamp">DİZAYN MAKETİ · FUNKSİONAL EKRAN DEYİL</div></div></article>`;
const mark = `<svg class="brand-mark" viewBox="0 0 160 160" aria-label="Bilirsən? ikon təklifi"><defs><linearGradient id="brand-metal" x2="1" y2="1"><stop stop-color="#ffdda0"/><stop offset=".5" stop-color="#efbf69"/><stop offset="1" stop-color="#9b7030"/></linearGradient></defs><rect x="2" y="2" width="156" height="156" rx="36" fill="#0a1c30" stroke="#385f8a"/><path d="M30 55 80 26 130 55v50l-50 29-50-29Z" fill="none" stroke="url(#brand-metal)" stroke-width="2"/><path d="M61 63c0-25 40-25 40 0 0 18-21 15-21 33" fill="none" stroke="url(#brand-metal)" stroke-width="10" stroke-linecap="round"/><circle cx="80" cy="112" r="5" fill="#efbf69"/></svg>`;
const additions = [
  phone(
    'password-recovery',
    'Şifrə bərpası',
    hero(
      'lock',
      'Yoluna davam et.',
      'Hesabına bağlı e-poçtu yaz. Şifrəni yeniləmək üçün bağlantı göndərək.',
    ) +
      field('E-poçt ünvanı', 'adın@poçt.az') +
      `<div class="card"><small>Bağlantı ilə yeni şifrə təyin edəcəksən.</small></div>` +
      footer('Bərpa bağlantısı göndər', 'Girişə qayıt'),
  ),
  phone(
    'email-verification',
    'E-poçt təsdiqi',
    hero('mail', 'Bir addım qaldı.', 'Təsdiq bağlantısı üçün e-poçtunu yoxla.') +
      `<div class="card gold-edge center"><small>E-POÇT ÜNVANI</small><h3 style="margin-top:10px">nərmin@poçt.az</h3><p style="margin-top:10px">Məktubu görmürsənsə, spam qovluğuna da bax.</p></div><p class="center">Ünvan düzgün deyil? <span class="gold">Dəyiş</span></p>` +
      footer('Təsdiqi yoxla', 'Məktubu yenidən göndər'),
  ),
  phone(
    'guest-conversion',
    'Qonaqdan hesaba keçid',
    hero(
      'book',
      'Bilik yolun<br/>səninlə qalsın.',
      'Hesab yarat və növbəti yarışa öz adınla çıx.',
    ) +
      `<div class="card gold-edge"><div class="between"><b>Qonaq profilin</b><span class="chip">BU TELEFONDA</span></div><div class="rule"></div><div class="between"><small>Solo pillən</small><b>Şagird II</b></div><div class="between" style="margin-top:13px"><small>Tamamlanmış turlar</small><b>12</b></div></div><p>Hesaba keçid axınında mövcud nəticələrinin saxlanması nəzərdə tutulur.</p>` +
      footer('Hesab yarat', 'Hələlik qonaq qal'),
  ),
  phone(
    'connection-lost',
    'Bağlantı kəsilib',
    hero(
      'signal',
      'Bağlantı zəifdir.',
      'Yarışla əlaqə kəsildi. İnternetini yoxla və yenidən qoşul.',
    ) +
      `<div class="card"><div class="row">${icon('clock', 23)}<b>Vaxt serverdə davam edir</b></div><div class="rule"></div><p>Yenidən qoşulanda sualın və nəticənin cari vəziyyəti yenilənəcək.</p></div><div class="signal-bars"><i></i><i></i><i></i><i></i></div>` +
      footer('Yenidən qoşul', 'Gözlə'),
  ),
  phone(
    'loading-state',
    'Yarış hazırlanır',
    `<div class="hero" style="padding-top:50px"><span class="eyebrow">PƏRDƏ AÇILIR</span><div class="loading-emblem">${icon('book', 46)}</div><h1>Səhnə hazırlanır.</h1><p>Suallar gəlir. Bir azdan başlayırıq.</p></div><div class="skeleton-card"><i></i><i></i><i></i></div><div class="skeleton-card short"><i></i><i></i></div><div class="bottom center"><small>Yarış hazır olanda ekran avtomatik açılacaq.</small></div>`,
  ),
  phone(
    'empty-history',
    'Boş tarixçə',
    `<span class="eyebrow" style="margin-top:20px">SƏNİN BİLİK YOLUN</span><h1>Son yarışlar</h1><div class="segments"><b>Hamısı</b><span>Tamamlanan</span></div>` +
      hero(
        'flag',
        'İlk turun səni gözləyir.',
        'İlk yarışından sonra nəticələrin burada görünəcək.',
      ) +
      `<div class="card center"><small>10 sual · qarışıq mövzular<br/>Hər düzgün cavab yeni addımdır.</small></div>` +
      footer('İlk turuna başla'),
  ),
  phone(
    'request-error',
    'Məlumat alınmadı',
    hero(
      'signal',
      'Bu dəfə<br/>açılmadı.',
      'Yarış tarixçəsini yükləmək alınmadı. Bir az sonra yenidən yoxla.',
    ) +
      `<div class="card"><div class="row">${icon('flag', 23)}<b>Nəticələr göstərilə bilmir</b></div><div class="rule"></div><p>Bu ekranda nəticə və rank məlumatı yenilənməyib.</p></div>` +
      footer('Yenidən yoxla'),
  ),
  phone(
    'launch-screen',
    'Açılış ekranı',
    `<div class="launch-center">${mark}<h1>Bilirsən?</h1><span class="eyebrow">BİLİK SƏHNƏSİ</span><div class="launch-line"></div></div><div class="bottom center"><small>Hər cavab bir addım.</small></div>`,
  ),
  phone(
    'app-icon',
    'Tətbiq ikonu',
    `<div class="hero" style="padding-top:24px"><span class="eyebrow">NİŞAN TƏKLİFİ</span>${mark.replaceAll('brand-metal', 'icon-metal')}<h1>Bir sual.<br/>Minlərlə imkan.</h1><p>Sual işarəsi və studiya çərçivəsi. Kiçik ölçüdə də aydın görünən sadə forma.</p></div><div class="card"><small>ANA EKRANDA GÖRÜNÜŞ</small><div class="icon-shelf"><div class="mini-app">?<small>Bilirsən?</small></div><div class="neutral-app"></div><div class="neutral-app"></div><div class="neutral-app"></div></div></div><div class="bottom center"><small>İkon təklifidir · son ikon kimi tətbiqə qoyulmayıb.</small></div>`,
  ),
  phone(
    'motion-preview',
    'Duel keçidinin hərəkəti',
    `<div class="center" style="margin-top:24px"><span class="eyebrow">HƏRƏKƏT NÜMUNƏSİ</span><h1 style="margin-top:12px">Səhnə canlanır.</h1><p>Qarşılaşma → geri sayım → əlavə mərhələ → nəticə</p></div><div class="motion-stage"><div class="motion-frame phase-one"><div class="players"><div><div class="avatar">N</div><b>Nərmin</b></div><span class="vs">VS</span><div><div class="avatar silver">R</div><b>Rauf</b></div></div><h2>İki rəqib. Bir yarış.</h2></div><div class="motion-frame phase-two"><strong class="motion-number">3</strong><h2>Hazırsan?</h2></div><div class="motion-frame phase-three"><span class="ribbon">ƏLAVƏ MƏRHƏLƏ</span><h2>Hələ bitmədi.</h2><div class="extra"><span>1</span><span>2</span><span>3</span></div></div><div class="motion-frame phase-four"><div class="medal">${icon('trophy')}</div><h2 class="gold">Səhnə sənindir.</h2><p>Nəticə vurğusu</p></div></div><div class="card"><small>8 saniyəlik vizual nümayiş. Oyun vaxtını və ya qalibi hesablamır.</small></div><div class="bottom"><button class="cta motion-toggle" type="button" aria-pressed="false">Hərəkəti dayandır</button><small class="center">Azaldılmış hərəkət seçimi nəzərə alınır.</small></div>`,
  ),
].join('');

const screenshots = [
  ['01-welcome', 'Qarşılama', '2026-10-06'],
  ['02-home', 'Ana səhifə', '2026-10-06'],
  ['solo-ready', 'Solo hazırlıq', 'studio-refinement'],
  ['04-question', 'Sual', '2026-10-06'],
  ['05-answer', 'Cavab', '2026-10-06'],
  ['06-result', 'Nəticə', '2026-10-06'],
  ['promotion', 'Rank yüksəlməsi · sınaq məlumatı', 'studio-v3-preview'],
  ['03-rank', 'Bilik pillələri', '2026-10-06'],
  ['duel', 'Duel studiyası · canlı oyun gözləmədə', 'studio-refinement'],
  ['leaderboard', 'Reytinq · rəsmi siyahı gözləmədə', 'studio-refinement'],
  ['profile', 'Profil', 'studio-refinement'],
  ['history', 'Tarixçə', 'studio-refinement'],
  ['settings', 'Səs ayarları', 'studio-refinement'],
];
const images = screenshots
  .map(
    ([id, title, directory]) =>
      `<figure><figcaption>${title}</figcaption><a href="../../testing/${directory}/${id}.png"><img loading="lazy" src="../../testing/${directory}/${id}.png" alt="${title}"/></a></figure>`,
  )
  .join('');
html = html.replace(/<title>[^<]+<\/title>/, '<title>Bilirsən? · Bütün dizayn bir yerdə</title>');
html = html.replace(
  /<header>[\s\S]*?<\/header>/,
  `<header><span class="eyebrow">BİLİRSƏN? · TAM DİZAYN BAXIŞI</span><h1>Bütün studiya, bir yerdə.</h1><p>13 mövcud ekran görünüşü və 19 dizayn nümunəsi. Qarşılama ekranından yarışın sonuna qədər bütün istiqamət burada birləşir. Maketlərdəki adlar, nəticələr və düymələr nümunədir; yeni funksiyalar hələ tətbiqə əlavə edilməyib.</p></header><nav class="overview-nav" aria-label="Dizayn bölmələri"><a href="#existing">Mövcud ekranlar · 13</a><a href="#planned">Hesab və duel · 9</a><a href="#completion">Qalan görünüşlər · 10</a><a href="#sounds">3 yarış səsi</a></nav>`,
);
html = html.replace(
  /<section class="current">[\s\S]*?<\/section>/,
  `<section class="current" id="existing"><h2>Mövcud tətbiqin görünüşləri</h2><p>Mobil ölçülü brauzer görüntüləridir. Rank yüksəlməsi sınaq məlumatı ilə göstərilir. Duel və rəsmi reytinq ekranları hazırlıq vəziyyətindədir.</p><div class="actual-grid">${images}</div></section>`,
);
html = html.replace('<section class="board">', '<section class="board" id="planned">');
html = html.replace(
  '</defs>',
  `<symbol id="signal" viewBox="0 0 24 24"><path d="M3 8c5-5 13-5 18 0M6 12c3-3 9-3 12 0m-8 4a3 3 0 0 1 4 0M3 3l18 18"/><circle cx="12" cy="20" r="1"/></symbol></defs>`,
);
html = html.replace(
  '</style>',
  `
html{scroll-behavior:smooth;scroll-padding-top:85px}.overview-nav{display:flex;gap:10px;flex-wrap:wrap;position:sticky;top:0;z-index:4;background:#030c16f0;padding:14px 0;border-bottom:1px solid #27405e}.overview-nav a{text-decoration:none;font-size:13px;padding:10px 13px;border:1px solid #385f8a;border-radius:8px;background:#101f32}.overview-nav a:hover{border-color:#efbf69}.current{scroll-margin-top:90px}.brand-mark{width:160px;height:160px;flex-shrink:0}.launch-center{display:flex;flex-direction:column;align-items:center;gap:23px;margin:auto 0}.launch-center h1{font-size:37px;color:#ffdda0}.launch-line{width:48px;height:2px;background:#efbf69;margin-top:16px}.icon-shelf{display:flex;justify-content:space-between;gap:13px;padding:20px 0 18px}.mini-app,.neutral-app{width:46px;height:46px;border-radius:12px;background:#16304c;border:1px solid #385f8a}.mini-app{position:relative;display:grid;place-items:center;color:#efbf69;font-size:33px;border-color:#b99352}.mini-app small{position:absolute;top:53px;font-size:9px;white-space:nowrap;color:#afc4df}.neutral-app{background:linear-gradient(140deg,#24425f,#101f32)}.signal-bars{display:flex;gap:9px;justify-content:center;align-items:end;height:62px;margin-top:16px}.signal-bars i{width:15px;border-radius:4px;background:#1b334d;height:20px}.signal-bars i:nth-child(2){height:30px}.signal-bars i:nth-child(3){height:42px}.signal-bars i:nth-child(4){height:54px}.loading-emblem{width:142px;height:142px;border:1px dashed #efbf69;border-radius:50%;display:grid;place-items:center;position:relative}.skeleton-card{border:1px solid #27405e;border-radius:18px;background:#101f32;padding:20px;display:grid;gap:15px}.skeleton-card i{height:12px;background:#223b54;border-radius:5px;display:block}.skeleton-card i:nth-child(2){width:74%}.skeleton-card i:nth-child(3){width:48%}.motion-stage{position:relative;height:290px;flex-shrink:0;overflow:hidden;border:1px solid #385f8a;background:radial-gradient(#18385b,#091829);border-radius:20px}.motion-frame{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:17px;opacity:0;animation:scene 8s infinite both}.motion-frame .players{gap:25px;padding:0}.motion-frame .avatar{width:66px;height:66px}.motion-frame h2{font-size:23px}.motion-number{font-size:94px;color:#ffdda0;line-height:1}.phase-two{animation-delay:2s}.phase-three{animation-delay:4s}.phase-four{animation-delay:6s}.motion-toggle{border:none;font:inherit;cursor:pointer;width:100%}.motion-paused .motion-frame{animation-play-state:paused}@keyframes scene{0%{opacity:0;transform:translateY(12px) scale(.98)}3%,21%{opacity:1;transform:none}25%,100%{opacity:0;transform:translateY(-8px)}}.audio-grid{display:flex;gap:20px;flex-wrap:wrap}.audio-grid div{padding:18px;border:1px solid #385f8a;background:#101f32;border-radius:15px}.audio-grid label{display:block;color:#ffdda0;margin-bottom:12px}.audio-grid audio{width:250px;max-width:100%}.section-copy{margin:12px 0 28px;max-width:800px}.overview-footer{margin:40px 0 0;border-top:1px solid #27405e;padding:22px 0;color:#afc4df;font-size:13px}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.motion-frame{animation:none;opacity:0}.phase-one{opacity:1}.motion-toggle{display:none}}@media(max-width:450px){.overview-nav{position:static}.board>article{width:100%}.audio-grid div{width:100%}}
</style>`,
);
html = html.replace(
  '</main>',
  `<section class="current" id="completion"><h2>Qalan dizaynı da əvvəlcədən gör</h2><p class="section-copy">Hesab axınları, gözləmə və xəta vəziyyətləri, açılış və ikon təklifi. Duel hərəkət nümunəsi yalnız vizual nümayişdir.</p><div class="board">${additions}</div></section><section class="current" id="sounds"><h2>Yarışın üç səsi</h2><p>Hazırda tətbiqdə olan səs nümunələri. Saniyə siqnalı tətbiqdə daha sakit səslənir.</p><div class="audio-grid">${[
    ['tick', 'Saniyə'],
    ['correct', 'Düzgün cavab'],
    ['wrong', 'Yanlış cavab'],
  ]
    .map(
      ([id, title]) =>
        `<div><label>${title}</label><audio controls preload="none" src="../../../apps/mobile/assets/sounds/${id}.wav"></audio></div>`,
    )
    .join(
      '',
    )}</div></section><p class="overview-footer">Dizayn baxışı · Yeni maketlər və ikon təklifi mobil tətbiqi dəyişmir. Son fiziki iPhone və Android yoxlaması ayrıca aparılacaq.</p></main><script>const toggle=document.querySelector('.motion-toggle');toggle.addEventListener('click',()=>{const stopped=toggle.closest('.phone').classList.toggle('motion-paused');toggle.setAttribute('aria-pressed',String(stopped));toggle.textContent=stopped?'Hərəkəti davam etdir':'Hərəkəti dayandır';});</script>`,
);
await writeFile(file, await prettier.format(html, { parser: 'html' }));
console.log('Complete design board: 13 existing views + 19 prototypes.');
