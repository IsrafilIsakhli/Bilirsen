# Bilirsən? — ilk tətbiq mərhələsi

## Həyata keçirilən sərhəd

Solo HTTP əmrləri ilə işləyir; mobil tətbiq aktiv oyunu 700 ms intervalla serverdən oxuyur. Socket.IO və outbox canlı duel mərhələsinə saxlanıb. Bu ilkin model bir server prosesi üçündür. Database advisory lock eyni bazaya ikinci oyun serverinin başlamasını dayandırır.

Oyun private JSON aggregate kimi saxlanır: dəyişməz sual/variant nüsxələri, qayda versiyası, cari sual və bağlanmış cavablar. Nəticə, rank ledger-i və command receipt ayrı cədvəllərdədir. Duel mərhələsində iştirakçılar, sual/cavab indeksləri və outbox genişləndiriləcək. İstifadəçi sırası hər əməliyyatda əvvəl kilidlənir; bir hesabda eyni anda bir aktiv oyun olur.

Nəticə, ledger, rank və aktiv oyunun bağlanması bir tranzaksiyadadır. Profil statistikası saxlanmış nəticələrdən hesablanır; ayrıca qeyri-atomik sayğac yoxdur. Eyni commandId üçün əvvəlki cavab qaytarılır, həmin ID ilə fərqli əmr rədd olunur. Hazır nəticənin oxunması yeni xal yaratmır.

Server yenidən başlayanda yarımçıq oyunlar `cancelled_server` olur və rank yazılmır. Database ilə scheduler əlaqəsi kəsilərsə açıq oyunlar bərpadan sonra bağlanır. Commit edilmiş nəticələr saxlanır. Telefon şəbəkədən ayrılsa serverdə vaxt davam edir; yenidən qoşulanda snapshot oxunur.

Solo `solo-1`: 2 asan + 5 orta + 3 çətin. Vaxtlar 20/25/30 saniyə, yarış xalı 20/25/30. Düzgün rank +5/+8/+12; səhv −3/−4/−5; cavabsız 0. Maksimum yarış xalı 255, hamısı düzgün solo rank artımı 86. Delta toplanıb tur bağlananda minimum 0 bir dəfə tətbiq edilir. İstifadəçi çıxışı indiyə qədər bağlanmış cavabları saxlayır.

Qonaq sessiyası 15 dəqiqə access və 30 gün refresh müddətindən istifadə edir. Opaque tokenlərin yalnız SHA-256 hash-i serverdə saxlanır. Refresh rotasiyası və köhnə tokenin təkrar istifadəsində sessiya ailəsinin ləğvi işləyir. Telefon refresh tokeni SecureStore-da, access tokeni yaddaşda saxlayır. Brauzer lokal UI sınağı üçündür; sessiya yaddaşdadır və tam yenilənəndə qonaq yenidən daxil olur.

## Yoxlamalar

İlk mərhələdə 12 domain/integration testi və 1 brauzer axını keçdi; TypeScript, ESLint, format, server build, Expo Doctor (21/21) və Android/iOS/web export tamamlandı. İstifadəçinin göndərdiyi iPhone görüntüləri tətbiqin telefonda açıldığını təsdiqləyir. Sonrakı dizayn/səs yenilənməsinin əhatəsi və yoxlamaları `STUDIO-YENILENME.az.md` sənədindədir.

- Domain: bölgü və təkrar fact qadağası, açıq sualda gizli cavabın olmaması, deadline sərhədi, təkrar cavab, cavabsız keçid, 255/86 hesabı, rank minimumu və sərhədləri, qarışdırılmış variant xəritəsi.
- Canlı PostgreSQL/API: başqa istifadəçinin oyuna girişinin rəddi, paralel eyni start/cavab/çıxış, eyni ID ilə fərqli variant, tam 10 suallıq tur, tək nəticə/ledger, timeout cəriməsizliyi, refresh replay.
- Mobil ölçülü Chrome: qonaq → ana səhifə → rank → hazırlıq → sual → cavab → çıxış → nəticə → tarixçə.
- Strict TypeScript, ESLint, server build, Expo Doctor və Android/iOS/web bundle export.

Brauzer ölçüsü fiziki iPhone/Android testi deyil. Mağaza yığımı hazırlanmayıb. Cihazda safe-area, font ölçüsü, Wi-Fi gecikməsi, arxa plana keçid və SecureStore ilə yenidən giriş ayrıca yoxlanmalıdır.

## İstehsal üçün qalanlar

Bu mərhələ lokal inkişaf üçündür: HTTP və development CORS var. Qeydiyyat, e-poçt təsdiqi/bərpa, hesab silmə, canlı duel, rəsmi reytinq, idarəçi təsdiqi və sual nəşri həyata keçirilməyib. Test sualları production seçimində istifadə olunmur.

2026-10-06 dependency auditində upstream asılılıqlar üzrə yüksək/orta xəbərdarlıqlar var. Avtomatik uyğun düzəlişlər bunları tam bağlamadı; Expo-nu köhnə SDK-ya salan `audit fix --force` işlədilmədi. Braces/node-forge, Prisma CLI-nin deepmerge-ts/mysql2 və Router-in query-string/decode-uri-component/xcode-uuid ağacları araşdırılmalıdır. Audit xəbərdarlığı konkret exploit təsdiqi deyil; hesabat bağlanmadan ictimai yayım edilmir.

Hazırlama sxeminin 1.950 sətri saxlanır; `app.question_versions` daxilində 120 `test_only` nüsxəsi var. Bu ictimai təsdiq deyil. Runtime hazırlama bankına yazmır, sual versiyalarını redaktə etmir və DDL səlahiyyəti daşımır.

Telefon sınağı üçün `Bilirsen-Local-Phone-Test` firewall qaydası yaradılıb: Node TCP 3000/8081, yerli ünvan 192.168.0.12, rəqib ünvan 192.168.0.0/24. Mövcud Node icazələri və default inbound siyasəti dəyişməyib. Bu qaydanın dar sərhədi digər əvvəlki firewall icazələrini məhdudlaşdırmır. Skript yalnız administrator kimi işləyir; mövcud qayda varsa avtomatik dəyişdirmir.
