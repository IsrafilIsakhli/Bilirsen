# Studio dizaynı və səslər — 2026-10-06

İstifadəçinin dörd iPhone görüntüsü tətbiqin telefonda açıldığını göstərir. Bu yenilənmə seçilmiş `output/design/son-dizayn-2026-10-05/` maketlərindəki quruluşa əsaslanır.

## Görünüş

Girişdən nəticəyə qədər vahid lacivərd/qızılı studiya üslubu: yumşaq səhnə işıqları, metal haşiyəli nişanlar, qızılı avatar, yığcam rank kartları və əsas oyun seçimləri. Beş bilik pilləsi fərqli nişanlarla və cari pilləni göstərən yol xəritəsi ilə təqdim edilir. Profil həqiqi düzgün cavab faizini və solo tur sayını göstərir; duel statistikası hələ açılmayıb.

Tarixçə serverin son 20 nəticəsini göstərir və hamısı/tamamlanan/bağlanan filtrləri ilə işləyir. Nəticədə yarış xalı, solo rank dəyişikliyi və yeni pillə serverin yekun nəticəsinə əsaslanır. Hazırlıqda sual bölgüsü; oyunda kəsik künclü sual/cavab panelləri, dairəvi saniyə göstəricisi və server təsdiqindən sonra cavab təqdimatı var. Animasiya sistemin hərəkəti azaltma seçiminə əməl edir.

Canlı duel, dost otağı və rəsmi reytinq həyata keçirilməyib; ekranlar bunu açıq bildirir. Rəqib, sıralama və ya hesab statistikası uydurulmayıb.

## Səslər

Studio v3 dəqiq üç orijinal səsdən ibarətdir: saniyə (1,00 s), düzgün cavab (1,42 s), səhv cavab (1,18 s). Saniyə faylı tünd simli fon, ritmik simli vuruşlar və aşağı zərbdən ibarətdir; saniyə dəyişdikcə sual boyunca təkrarlanır. Düzgün cavab gərgin girişdən açılan major orkestr vurğusuna, səhv cavab aşağı enən nəfəsli alətlər və minor simli quyruğa keçir. Orijinal verilişdən yazı və melodiya götürülməyib. İstiqamət istifadəçinin istədiyi televiziya yarış atmosferidir.

Fayllar `scripts/generate-sounds.py` ilə əvvəlcədən hazırlanır; telefonda sintez yoxdur. Stereo PCM, 44,1 kHz, 16 bit. Ölçülmüş səviyyələr və müddətlər `apps/mobile/assets/sounds/metrics.json` daxilindədir. Saniyə səsi tətbiqdə 0,35, cavablar 0,64 səviyyəsində çalınır. Üç faylın ümumi ölçüsü təxminən 620 KiB-dir.

Expo Audio ilə çalınır. Cavab siqnalı yalnız serverin bağladığı sualdan seçilir və eyni sual üçün təkrar çalınmır. Server saatının düzəlişi bir saniyənin təkrar səslənməsinə səbəb olmur. Cavabsız vaxt bitməsinə ayrıca səs verilməyib.

Profil → Tənzimləmələr: bütün səslər və saniyə səsi ayrı açılıb-bağlanır, üç əsas səs əvvəlcədən dinlənə bilir. Telefonda seçim SecureStore-da saxlanır; brauzer sınağında yaddaşdadır. Oyun ekranında sürətli səs düyməsi də var. Tətbiq arxa plana keçəndə və ekran dəyişəndə səslər dayanır. Mikrofon icazəsi istənilmir.

## Yoxlama

Üç mobil ölçülü brauzer axını keçdi. İki axın həqiqi yerli API/PostgreSQL ilə qonaq/solo/nəticə və səhifələr/səs önbaxışı/söndürmə/açma/server cavabı siqnalı/tarixçə davranışını yoxlayır. Üçüncü axın yalnız açıq DTO sınaq məlumatları ilə uzun sualın görünüşünü, səhifələrin təqdimatını, üç həqiqi media faylını və 320 px tarixçə ölçüsünü yoxlayır; bu, server qaydalarının testi deyil və tətbiqə saxta məlumat mənbəyi əlavə etmir.

Canlı axın saniyə/düzgün/səhv fayllarının yüklənib çalınmasını, Studio v3 müddətlərini, səs səviyyəsini, səssiz vaxtda çalınmamağı və server cavabında yalnız bir siqnalı yoxlayır. Tarixçə filtrləri də yoxlanır. Canlı şəkillər: `output/testing/studio-refinement/` və `output/testing/2026-10-06/`. Ayrı təqdimat sınağının şəkilləri: `output/testing/studio-v3-preview/`.

Səsin telefondakı tonu və səviyyəsi, native SecureStore ilə seçim bərpası və telefon zəngi kimi sistem kəsilmələri avtomatik brauzer testinin əhatəsində deyil; fiziki iPhone yoxlaması qalır.

Studio v3 kodu TypeScript və ESLint yoxlamalarını, iOS/Android/web export-u keçdi. Expo Doctor 21/21 və 9 domain testi əvvəlki mərhələdə keçmişdi; bu UI yenilənməsi üçün həmin yoxlamalar və ayrıca 3 integration testi təkrar başladılmadı. Yerli Docker əvvəl açılış xətası verdi; istifadəçi Docker-i açdıqdan sonra API yenidən başladıldı. API `192.168.0.12:3000/v1/health`, Expo isə `192.168.0.12:8081` ünvanında cavab verir. iPhone-da yenilənmiş görünüş və səs tonu ayrıca yoxlanmalıdır.
