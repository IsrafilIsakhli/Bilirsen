# Backend gücləndirməsi — 01 noyabr 2026

Bu yenilənmə server tərəfinə aiddir. Mobil ekranlar, səslər, oyun vaxtları, xal/rank qaydaları və sual bankı dəyişdirilməyib. Canlı duel, qeydiyyat və rəsmi reytinq bu işlə tamamlanmış sayılmır. Database miqrasiyası tələb olunmur.

## Profilin oxunması

Profilin nəticə sayğacları artıq bütün tarixi nəticələri API yaddaşına yükləmir. PostgreSQL həmin oyunçunun nəticələrini aqreqasiya edir və serverə bir sətir qaytarır. Bu, nəticələrin şəbəkə ilə daşınmasını və Node.js yaddaşında ayrıca siyahı kimi saxlanmasını aradan qaldırır; database yenə uyğun nəticə sətirlərini oxuyur.

Rank və statistika `RepeatableRead` tranzaksiyasında eyni database görünüşündən alınır. Profil üçün ayrıca `ProfileService` və `ProfileModule` var; giriş və sessiya servisi statistik SQL-i idarə etmir. Giriş, sessiya yenilənməsi və `/me` eyni profil oxuyucusundan istifadə edir.

Sayğaclar, onların saxlanmış nəticələrdəki növləri və diapazonları yoxlanır. Natamam nəticə sayğacı və ya çatışmayan rank sətri səssizcə sıfırla əvəz edilmir. İstifadəçiyə açıq profil DTO-su ayrıca sxemlə yoxlanır. Cavabsız, lakin bağlanmış suallar əvvəlki qaydada `answeredQuestions` sayğacına daxildir.

## HTTP sərhədləri

- JSON gövdəsi maksimum **16 KiB** ola bilər. Böyük sorğu `413 / payload_too_large` alır.
- Qüsurlu JSON `400 / invalid_json` alır. Göndərilmiş gövdə xəta cavabında təkrarlanmır.
- Sıxılmış gövdələr açılmadan rədd edilir: `415 / unsupported_encoding`. Mövcud mobil sorğular adi JSON göndərir.
- Hər sorğu üçün server yeni `X-Request-Id` yaradır. Müştərinin göndərdiyi eyni adlı başlıq qəbul edilmir.
- Gözlənilməyən xətanın jurnalında yalnız hadisə adı, sorğu nömrəsi və xəta növü göstərilir; daxili xəta mesajı və SQL dəyərləri yazılmır.
- `receivedAt` JSON gövdəsi tam oxunduqdan sonra qeydə alınır. Başlıqları və ya gövdənin bir hissəsini tez göndərmək əvvəlki cavab vaxtını rezerv etmir.

Parser və vaxt middleware-lərinin sırası `configureHttp` daxilində idarə olunur. Tətbiq `bodyParser: false` ilə yaradılır ki, əvvəlcədən əlavə edilən parser bu sıranı dəyişməsin. Test serveri də eyni konfiqurasiyadan istifadə edir.

## Sessiyalar və sağlamlıq

Access və refresh tokenləri database sorğusundan əvvəl serverin yaratdığı hex formata görə yoxlanır. Token müddətləri və rotasiya qaydası dəyişməyib. Refresh oxunuşu yalnız lazım olan sütunları alır. Eyni refresh tokeninin paralel təkrar istifadəsində sessiya ailəsinin ləğvi ayrıca canlı testlə yoxlanır.

`GET /v1/health` əvvəlki kimi prosesin işlədiyini bildirir. Yeni `GET /v1/health/ready` database-ə `SELECT 1` göndərir. Uğurlu cavab:

```json
{ "status": "ok", "database": "reachable" }
```

Database sorğusu alınmasa adi təhlükəsiz `503 / server_unavailable` cavabı qaytarılır. Bu yoxlama yükdaşıma qabiliyyəti və ya istehsal mühitinə tam hazırlıq təsdiqi deyil.

## Yoxlamalar

```powershell
npm run typecheck
npm run lint
npm run format:check
npm run build -w @azquiz/api

$env:RUN_INTEGRATION='1'
try { npm test } finally { Remove-Item Env:RUN_INTEGRATION }
```

Tam paket 18 sınaqdan ibarətdir: 9 oyun qaydası, 4 HTTP sərhədi və 5 canlı API/PostgreSQL sınağı. İnteqrasiya sınaqları yalnız öz yaratdığı istifadəçilərin qeydlərini təmizləyir. Natamam nəticə yoxlaması da yalnız öz sınaq nəticəsini müvəqqəti dəyişdirir və `finally` daxilində bərpa edir.

API test faylları ayrıca strict TypeScript konfiqurasiyası ilə də yoxlanır. Vitest-in dekorator transformasiyası NestJS-in istifadə etdiyi legacy dekorator semantikasına uyğunlaşdırılıb.

Yük sınağı, istehsal yerləşdirilməsi və fiziki telefon testi bu dəyişiklik paketinə daxil deyil.
