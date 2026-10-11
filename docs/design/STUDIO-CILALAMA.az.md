# Bilirsən? — studiya ekranlarının cilalanması

Sonrakı yeniləmə: istifadəçinin fonu düzəltmək istəyi ilə musiqi və duel səhifəsi yeniləndi. Aşağıdakı fonun saxlanması qeydi əvvəlki mərhələyə aiddir. Cari vəziyyət [STUDIO-FON-DUEL.az.md](STUDIO-FON-DUEL.az.md) daxilindədir.

06.10.2026. Təsdiqlənmiş göy–qızılı üslub saxlanıb. İş mobil təqdimat komponentləri, baxış səhifəsi və iki cavab səsi ilə məhdudlaşıb.

## Görünüşdə dəyişikliklər

- Ortaq boşluq və yazı ölçüləri əlavə edilib. Əsas mətn 16/24, məlumat qeydləri ən azı 12 ölçüdədir; dekorativ üst yazılar ayrıdır. Ekran kənarı 20, 360-dan dar enlərdə 16-dır.
- Mətn arxasındakı iri studiya halqaları incəldilib və zəiflədilib. Kartların kölgəsi yumşaldılıb. Əsas düymələr minimum 52, ikinci dərəcəli düymələr 48, kiçik idarəetmələr 44 × 44-dür. Uzun düymə yazısı böyüdükcə düymə də hündürləşir.
- Deaktiv düymələr sakit göy fonda oxunaqlı görünür və əlçatanlıq vəziyyətini bildirir. Aktiv sadə düymələrin mətni ayrıca vurğulanır.
- Qarşılama ekranında əsas başlanğıc önə çıxır. Ana səhifənin adı elastikdir; solo və duel keçidləri tam enlidir. Rank kartlarının nişanı və adı dar sahədə bir-birini sıxmır.
- Solo hazırlığında nişan kiçildilib, vaxt/xal sətirləri dar enlərdə çevrilir. Başlama düyməsi ayrıca təhlükəsiz alt sahədədir.
- Sual paneli yığcamlaşıb; uzun sual və variantlar tam açılır. Cavab rəngi, ikon və izah saxlanıb. Çıxış pəncərəsi daha sakit boşluqlarla düzülüb; gözləmə vəziyyəti düymələri idarə edir.
- Nəticə, rank yüksəlməsi və bilik pillələrində qeydlər böyüdülüb. Cari pillənin vəziyyəti adın altında yerləşir. Keçidlər 180–220 ms yumşaq görünmədir və sistemin azaldılmış hərəkət seçiminə əməl edir.
- Duel sual nömrəsi təqdimat məlumatından alınır. Uzun oyunçu adları kəsilmir; hesab və əlavə mərhələ yığcamlaşıb. Qələbə/məğlubiyyət eyni quruluşdan istifadə edir.
- Podium adları tam açılır, böyük rəqəmlər yoxlanır. Reytinqin gözləmə görünüşündə təkrar izahlar azaldılıb. Profil və tarixçənin qeydləri böyüdülüb; filtrlər və nəticə sətirləri dar enə uyğunlaşır.
- Hesab formalarında böyük üst boşluq azaldılıb. Klaviatura davranışı ortaq `Screen` komponentinə keçirilib; sahələr sürüşdürülə bilir. Bərpa və e-poçt düymələrinin adları yığcamlaşdırılıb.
- Bağlantı və xəta nümunələrində təkrar böyük başlıq çıxarılıb. Açılış nümunəsinin adi geri başlığı yoxdur. Mövcud ikon saxlanıb.
- Tənzimləmələrdə dinləmə seçimləri bir kartda qruplaşdırılıb. Fon və cavab vurğusunun fərqi izah edilir. Dizayn baxışının iri alt paneli bir idarəetmə sətrinə çevrilib; nümunə məlumat işarəsi qalır.

## Cavab səsləri

`correct.wav`: 0,85 saniyə, dərhal başlayan orkestr zərbəsi və qısa isti harmonik açılma. `wrong.wav`: 0,70 saniyə, eyni ağırlıqda tünd, enən vurğu. Uzun fanfar, cingilti və alarm yoxdur. Bunlar ayrıca sintez edilmiş tembrlərdir.

Ölçülmüş RMS hər ikisində −18,65 dBFS; piklər −3,10 / −4,11 dBFS. Səslərin başlanğıcı və sonu sıfıra yumşaldılıb. Cavab səsi yenə yalnız server təsdiqindən sonra bir dəfə çalınır. Cavabsız sual yanlış cavab səsi yaratmır.

Bəyəndiyin 30 saniyəlik fon dəyişməyib. Əvvəlki və sonrakı SHA-256:

`4c6bb5c70930ae12e2786ed17248a4b4b6d3824bfa252bbf9e713cbb66008e41`

Generator yalnız iki cavab faylını yeniləyə bilər. `--verdicts-only` açıq seçimdir; fon yaratmaq və ya onu yenidən yazmaq üçün giriş nöqtəsi yoxdur. Fonun sürətlənməsi, susdurulması və qalan vaxtdan davam etməsi saxlanıb.

## Yoxlama və baxış

32 əsas görünüş 320, 390 və 430 enlərdə çəkilir. Çıxış pəncərəsi və əlavə uzun mətn nümunələri də yoxlanır. Sürüşən səhifələr aşağıya qədər gəzir; yalnız sənəd eni deyil, mətnin faktiki sərhədləri də ölçülür. Uzun adlar, çoxsətirli sual/variant, böyük reytinq rəqəmi, 35% böyüdülmüş sual yazısı və klaviatura üçün daralmış forma sahəsi ayrıca sınaqdan keçir.

Yekun baxış: `output/design/studio-polish-2026-10-06/BAXIS.html`. Telefon enini və ekran qrupunu seçmək, səhifənin alt hissəsinə baxmaq və üç səsi dinləmək mümkündür. Görüntülər mobil komponentlərin web təqdimatıdır; rəsmi oyunçu məlumatı deyil.

TypeScript və ESLint keçdi. Dörd mövcud brauzer axını keçdi: iki canlı yerli solo/API axını, açıq DTO təqdimat axını və 19 dizayn görünüşünün keçidləri. Audio sınağı davamlı fonu, qalan hissədən davamı, susdurmanı və server cavabının bir dəfə çalınmasını əhatə edir. Ayrıca WAV yoxlaması fayl izini, müddəti, RMS və pik ehtiyatını ölçür.

Mövcud davranış sınaqlarında 9 test keçdi; bazaya xüsusi mühit tələb edən 3 inteqrasiya testi standart konfiqurasiyada atlanır. Canlı solo davranışı brauzer axınlarında yoxlanır. Android/iOS/web ixracı `output/testing/export-studio-polish/` daxilindədir. Bu ixrac mağaza yığımı və ya fiziki cihaz təsdiqi deyil.

Fiziki iPhone və Android-də klaviatura, təhlükəsiz kənarlar, sistem yazı miqyası və səslərin subyektiv uyğunluğu istifadəçi ilə yoxlanmalıdır. Hesab, canlı duel və rəsmi reytinq xidmətləri bu işlə işlək hesab edilmir. API, miqrasiya, oyun vaxtları, xal/rank qaydaları və sual bankı dəyişdirilməyib.

Yekun baxış səhifəsinin ayrıca sınağı 35 görünüşün üç ölçüdəki şəkillərini, qrup filtrini, üst/alt keçidini, 320 enə sığmasını və üç audio faylının açılmasını təsdiqlədi.
