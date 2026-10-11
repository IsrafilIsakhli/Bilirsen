# Bilirsən?

Azərbaycan dilində bilik yarışı. Layihə `C:\project3` qovluğundadır; VS Code üçün `azquiz.code-workspace` faylını aç.

## İlk işləyən mərhələ — 0.1.0

Qonaq hesabı, studiya üslubunda ana səhifə, ayrı solo/duel rank göstəriciləri, rank pillələri, serverdə idarə olunan 10 suallıq solo tur, vaxtın bitməsi, cavabın yoxlanması, çıxış təsdiqi, nəticə və son 20 turun tarixçəsi işləyir. Nəticə və rank PostgreSQL-də saxlanır. Duel, qeydiyyat, e-poçt əməliyyatları və rəsmi reytinq hələ funksional deyil; ekranlarda bu göstərilir.

Əsas bankdakı 1.950 sual saxlanıb. Bu mərhələ üçün 120 sual `test_only` statusu ilə ayrıca seçilib: 24 asan, 60 orta, 36 çətin. Bu seçim ictimai yayım təsdiqi deyil. Siyahı `docs/database/test-pool.json` faylındadır.

Telefon görüntülərinə əsasən Studio ekranları maketə yaxınlaşdırılıb. İstifadəçi rəyindən sonra səslər yenidən hazırlanıb: yalnız saniyə, düzgün və yanlış cavab üçün üç orijinal Studio siqnalı var. **Profil → Tənzimləmələr** bölməsində səsləri yoxlamaq və söndürmək mümkündür; oyun ekranında da səs düyməsi var. Son yenilənmə: `docs/testing/STUDIO-YENILENME.az.md`.

## İşə salmaq

Node 22.13+ və Docker Desktop lazımdır. Kitabxanalar artıq bu kompüterdə quraşdırılıb. Yenidən qurarkən layihənin kökündə:

```powershell
npm.cmd ci
npm.cmd approve-scripts prisma @prisma/engines esbuild
npm.cmd run generate
docker compose up -d postgres
npm.cmd run db:prepare
```

`db:prepare` yalnız `app` sxemini hazırlayır. Hazırlama bankını və Docker volume-u silmir. Migration checksum-u fərqlənərsə dayanır. Administratorun parolu oxunmur: lokal container daxilində inzibatçı bağlantısı istifadə olunur. Runtime üçün ayrıca məhdud database hesabı və `apps/api/.env.local` yaradılır. Bu faylı paylaşma.

İki ayrı terminalda:

```powershell
npm.cmd run dev:api
```

```powershell
npm.cmd run dev:mobile
```

`apps/mobile/.env.local` içində `EXPO_PUBLIC_API_URL` kompüterin yerli IPv4 ünvanını göstərməlidir; məsələn `http://192.168.0.12:3000/v1`. Bu açıq API ünvanıdır, database parolu deyil. Wi-Fi dəyişərsə ünvanı yenilə və Expo-nu yenidən başlat.

## Telefonda baxmaq

Telefon və kompüter eyni Wi-Fi şəbəkəsinə qoşulsun. Expo Go-nu yenilə. Expo SDK 57 üçün iPhone-da Expo Go və kompüterdəki Expo CLI **eyni Expo hesabında** olmalıdır. [Expo-nun giriş tələbi](https://expo.dev/changelog/expo-go-57-login).

```powershell
npm.cmd run phone:link
```

`output/testing/phone/BAXIS.html` faylını açıb QR kodu iPhone kamerası ilə oxut. Android-də Expo Go-nun QR oxuducusundan istifadə edə bilərsən. İlk açılışda “Qonaq kimi başla” seç. Server və Expo işləməyə davam etməlidir.

Bağlantı problemi olarsa telefonda `http://192.168.0.12:3000/v1/health` ünvanını aç: `ok` görünməlidir. Ünvan açılmırsa Wi-Fi, tətbiqin lokal şəbəkə icazəsi və Windows-un Node üçün lokal şəbəkə icazəsini yoxla. PostgreSQL internetə və telefona açılmır.

## Kod və yoxlama

Mobil: Expo SDK 57 / React Native / strict TypeScript / Expo Router / TanStack Query / Zustand. Server: NestJS modulları / Prisma 7 / PostgreSQL. Açıq Zod müqavilələri `packages/contracts` daxilindədir. Düzgün variant açıq sual müqaviləsinə daxil edilmir.

```powershell
npm.cmd run check
```

Canlı server və database testi ayrıca işə salınır. Bu test yalnız yaratdığı sınaq istifadəçilərini təmizləyir:

```powershell
$env:RUN_INTEGRATION='1'
npm.cmd test
Remove-Item Env:RUN_INTEGRATION
npm.cmd exec -- playwright test
npm.cmd run export -w @azquiz/mobile
```

Brauzer testi quraşdırılmış Chrome-dan istifadə edir. Başqa kompüterdə `CHROME_PATH` ilə yolu dəyiş. `npm.cmd exec -w @azquiz/mobile -- expo-doctor` SDK uyğunluğunu yoxlayır.

Bu mərhələ yerli telefon sınağı üçündür. Cihaz sınağı, canlı duel, tam hesab sistemi, HTTPS, sual təsdiqi və dependency təhlükəsizlik hesabatı tamamlanmadan mağaza yayımı hazır sayılmır. Təfərrüat: `docs/testing/ILK-MERHELE.az.md`.
