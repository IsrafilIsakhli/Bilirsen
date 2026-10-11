# Bilirsən? — ekranların fərdi dizayn reviziyası

06.10.2026. Məqsəd qəbul olunmuş göy–qızılı Studio üslubunu qoruyub hər ekranı məqsədinə görə düzəltməkdir. Təkrarlanan nişan/başlıq/kart quruluşu azaldılıb, oxu ardıcıllığı və əsas əməl aydınlaşdırılıb.

## Fon və ortaq görünüş

Proyektor şüalarının sərt çoxqatlı kənarları yumşaq radial işığa çevrilib. Lampanın asqısı və gövdəsi, yuxarı səhnə quruluşu və aşağı platformanın yerləşməsi işlənib. Üst halqalar başlıqları kəsmir; döşəmə xətti ekranın aşağısında qalır. Üç təqdimat səviyyəsi var: qarşılama/qarşılaşma üçün səhnə, sual üçün zəiflədilmiş fon, formalar/profil/tarixçə üçün sakit fon. Statik SVG istifadə edilir, yeni bitmap və ya animasiya əlavə olunmur.

Kart səthləri daha sakitdir. Adi məlumat qızılı çərçivə ilə vurğulanmır. Məlumat qeydləri ayrıca kart əvəzinə ikon və mətn kimi verilir. Əsas düymələr, toxunma sahələri və serverdən gələn nəticə vəziyyətləri saxlanır. Başlıqlar əlçatanlıq üçün başlıq rolunu bildirir.

## Ekran üzrə dəyişikliklər

| Görünüş           | Fərdi iş                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| Qarşılama         | Loqo və əsas əmələ daha çox nəfəs sahəsi; üç məlumat sütununun qızılı çərçivəsi götürülüb.                       |
| Ana səhifə        | Təkrar şüar və düymə olmayan istiqamət oxları çıxarılıb. Solo əsas əməl, duel ikinci keçid olaraq qalır.         |
| Solo hazırlıq     | Nişan və tur başlığı yan-yana; üç çətinlik bir cədvəldə. Başlama düyməsi təhlükəsiz alt sahədədir.               |
| Sual              | Sakitləşdirilmiş səhnə, sual sayı və çətinlik arasında lazımsız üst yazı yoxdur.                                 |
| Cavab vəziyyəti   | Adi variantın qızılı çərçivəsi zəiflədilib, təsdiq/nəticə vəziyyətlərinin fərqi saxlanıb.                        |
| Çıxış pəncərəsi   | İkon və başlıq birlikdə; xəbərdarlıq sakit göy paneldədir. Server gözləməsi düymələri idarə edir.                |
| Tur nəticəsi      | Nəticə dairəsi ilə mətn və statistika arasında daha aydın boşluq; əlavə qeydlər ayrıca kart deyil.               |
| Rank yüksəlməsi   | Əvvəlki/yeni pillələr oxla birləşən aydın mətn nişanlarıdır.                                                     |
| Bilik pillələri   | Cari rankın təkrar kartı çıxarılıb; cari irəliləyiş ayrıca göstərilir. Yalnız cari pillə çərçivə ilə vurğulanır. |
| Duel studiyası    | Təkrar üst yazı çıxarılıb, qarşılaşma sahəsi və yarış növünün vurğuları sakitləşdirilib.                         |
| Rəqib axtarışı    | Böyük dairəvi radar əvəzinə yığcam oyunçu yeri; təkrar studiya başlığı yoxdur.                                   |
| Qarşılaşma        | Countdown ölçüsü və panel vurğusu yığcamlaşıb; uzun adlar açılır.                                                |
| Duel sualı        | Ad və hesab sahəsi elastikdir, sual fonu solo ilə eyni səviyyədədir.                                             |
| Əlavə mərhələ     | Təkrar üst başlıq çıxarılıb; bərabər hesab və üç sual əsas məzmundur.                                            |
| Duel qələbəsi     | Oyunçu hesabları və rank dəyişikliyi bir yekun paneldədir.                                                       |
| Duel məğlubiyyəti | Eyni yekun quruluş, nəticəyə uyğun rəng və ikon; əlavə qızılı panel yoxdur.                                      |
| Reytinq gözləməsi | Təkrar böyük nişan/şüar çıxarılıb. Sıralama seçimi, xidmət vəziyyəti və şəxsi rank aydın ayrılır.                |
| Dolu reytinq      | Podiumdan sonra oyunçular sətir ayırıcıları ilə göstərilir. Öz yerinin vurğusu yüngüldür.                        |
| Profil            | Avatar və ad yan-yana; hesab keçidləri bir siyahı panelindədir. Uzun ad və böyük rəqəmlər ayrıca çəkilir.        |
| Tarixçə           | İri qızılı nişan əvəzinə nəticəyə uyğun kiçik status ikonu. Filtr və nəticə sətirləri saxlanır.                  |
| Giriş             | Sola düzülən başlıq, daha kiçik nişan və formaya uyğun sakit fon.                                                |
| Qeydiyyat         | Eyni forma ritmi; sahə başlıqları oxunaqlıdır, klaviatura ilə sürüşdürmə saxlanır.                               |
| Şifrə bərpası     | Məqsədi birbaşa bildirən başlıq və bir əsas forma əməli.                                                         |
| E-poçt təsdiqi    | Sadə e-poçt məlumatı, təkrar qızılı vurğu yoxdur.                                                                |
| Hesaba keçid      | Məqsəd və qonaq nəticələrinin gələcək saxlanması aydın izah edilir; xidmət işlək təqdim olunmur.                 |
| Bağlantı          | İkinci iri offline nişanı çıxarılıb. Cari mesaj və yenidən qoşulma bir paneldədir.                               |
| Yüklənmə          | Böyük nişan və təkrar şüar əvəzinə kiçik loqo, real gözləmə göstəricisi və bir skelet paneli.                    |
| Boş tarixçə       | Məzmunun yoxluğu sadə ikon/mətn və uyğun əməl ilə göstərilir.                                                    |
| Xəta              | Təkrar böyük nişan yoxdur; xəta və yenidən yoxlama paneli əsasdır.                                               |
| Açılış            | Loqo, ad və qısa xətt arasında boşluqlar düzəldilib.                                                             |
| İkon baxışı       | Həqiqi tətbiq adı işlənir; əvvəlki loqo saxlanır.                                                                |
| Tənzimləmələr     | Böyük qızılı giriş kartı çıxarılıb, səs idarəetmələri və dinləmə ayrılır.                                        |
| Hərəkət nümunəsi  | Yığcam idarəetmə və yenilənmiş duel təqdimatı; azaldılmış hərəkət seçimi saxlanır.                               |

Dizayn baxışının nümunə məlumat qeydi saxlanıb. Canlı duel, qeydiyyat və rəsmi reytinq xidmətləri bu işlə funksional sayılmır. API, oyun qaydaları, baza və sual bankı dəyişdirilməyib.

## Yoxlama

32 əsas və 4 əlavə görünüş 320/390/430 enlərdə çəkilib. Uzun profil adı, böyük statistika, uzun sual/variant, böyüdülmüş sual yazısı və klaviatura üçün daralmış forma sahəsi brauzer təqdimatında ayrıca yoxlanıb. Daha qısa yeni ekranlarda əvvəlki alt görüntünün səhv göstərilməməsi üçün artıq alt şəkillər yalnız bu sınağın yaradılmış şəkil qovluğunda təmizlənir. Əvvəlki ekran görüntüləri `output/testing/studio-detail-2026-10-06/before/` daxilində saxlanır.

Səs V7 dəyişdirilməyib; beş fayl əvvəlki SHA-256 izləri ilə yoxlanır. Kompüterin Wi-Fi ünvanı dəyişdiyi üçün mobil təqdimatın ictimai yerli API ünvanı və Expo Go QR kodu yenilənib. Server və baza qaydalarında dəyişiklik yoxdur.

Baxış: `output/design/studio-detail-2026-10-06/BAXIS.html`. Ekran müqayisəsi: `output/testing/studio-detail-2026-10-06/BAXIS.html`. Fiziki iPhone və Android yoxlaması ayrıca aparılmalıdır.

Yekun yoxlama nəticələri:

- Dörd tətbiq sınağı keçib: dizayn keçidləri, uzun mətnli təqdimat, səs/susdurma və yerli serverlə solo oyun/tarixçə.
- TypeScript və lint yoxlamaları keçib.
- Android, iOS və web paketlərinin ixracı keçib: `output/testing/export-studio-detail/`. Bu, mağaza yığımı və ya fiziki cihaz sınağı deyil.
- Baxış səhifəsində 36 görünüşün üç eni, filtr, alt görüntülər, 320 enli düzülüş və səs faylları yoxlanıb.
- On əvvəl/sonra müqayisəsinin şəkilləri və düymələri, dar baxış səhifəsi və səs faylları yoxlanıb.
- Beş WAV faylı `sounds-before.json` ilə tam eynidir. Səs müddəti, səviyyəsi və pik ehtiyatı yoxlaması keçib.

Expo Go bağlantısı: `exp://192.168.0.11:8081`; QR: `output/testing/phone/expo-go.png`. Kompüter və telefon eyni Wi-Fi şəbəkəsində olmalıdır. Ünvan şəbəkədən asılıdır; dəyişəndə mövcud `phone:link` əməli ilə yenilənir.
