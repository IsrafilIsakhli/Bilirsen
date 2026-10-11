# Bilirsən? — aydın tik–tak və veriliş atmosferi

06.10.2026. İstifadəçi tik–takın əvvəlki yumşaltmada itdiyini bildirdi və bütün ekranlarda daha güclü studiya atmosferi istədi.

## Musiqi V7

Fonun içində iki fərqli tembrli, növbələşən tik və tak vurğusu var. Qısa başlanğıc, daha aydın saat rezonansı və zəif bas gövdəsi istifadə olunur. Harmonik fon saxlanır; əvvəlki dissonant qat və saturasiya geri qaytarılmayıb. Ritm ortadan sonra sıxlaşır. 20/25/30 saniyə üçün ayrıca hazırlanmış fayllar 1 sürətlə çalınır, canlı sürət və pitch emalı yoxdur. Fon səviyyəsi 50%, cavablar 60%-dir.

WAV fayllarından ayrıca ölçülən saat vurğuları hər müddətdə 74–75-dir. İlk dörddəbirdə 9, son dörddəbirdə 32–33 vurğu aşkar edilir. Ölçü telefonun subyektiv eşitmə testini əvəz etmir. Fon pikləri −6,02 dBFS-dir. Düzgün/yanlış cavab faylları dəyişməyib.

Səslər açıq və saniyə səsi aktiv olduqda, serverin açıq sualında ritm deadline-a uyğun başlayır/davam edir. Seçim göndəriləndə, çıxış pəncərəsində, bağlantı problemində və tətbiq arxa plana keçəndə dayanır. Cavab siqnalı yalnız server təsdiqindən sonra bir dəfə çalınır. Oyun vaxtları və qaydalar dəyişmir.

## Görünüş

- Ortaq SVG fonda dörd proyektor, iki soyuq və iki zəif isti şüa, yan panellərdə incə işıq xətləri, üst səhnə konstruksiyası və elliptik döşəmə platforması var. Mətn mərkəzində tünd örtük saxlanır. Fon statikdir və azaldılmış hərəkət seçiminə əlavə yük yaratmır.
- Bütün ekranlarda kartların səthləri və çərçivələri eyni üslubda yeniləndi. Bölmə başlıqları sakit işıq xətti ilə ayrılır. Geri və oyun idarəetmələri 44 ölçülü çərçivəli düymələrdir. Seçilən filtrlər sakit göy fonda qızılı yazı ilə göstərilir.
- Ana səhifədə solo oyunun əsas düyməsi aydın vurğulanır, duel ikinci keçid olaraq qalır. Rank kartlarında həqiqi rank nişanları işlənir.
- Sualın xal və vaxt göstəriciləri vahid paneldədir. Sual və cavab çərçivələri öz faktiki ölçülərinə görə çəkilir: uzun mətn çərçivənin bucaqlarını dartmır. Gözləyən seçimdə kiçik gözləmə işarəsi var. Düzgün/yanlış vəziyyətlər yalnız server nəticəsindən təqdim olunur.
- Nəticə medalyonunun metal çərçivəsi və daxili səthi yeniləndi; yarış xalı və rank dəyişikliyi daha aydın ayrılır. Statistik rəqəmlər uzun olduqda ölçüləri uyğunlaşır.
- Profil və reytinq başlıqları, podium səthləri, tarixçə/formalar və bütün 19 dizayn nümunəsi ortaq görünüş yeniləməsini alır. Nümunə məlumat qeydi və funksional olmayan hesab/duel düymələri saxlanıb.

## Yoxlama

TypeScript və lint keçdi. Dörd brauzer axını keçdi: tətbiqin yerli server ilə solo davranışı, səs və mute/davam, açıq DTO məlumatları ilə uzun mətn/25–30 saniyəlik fon sınağı və 19 təqdimat ekranı. 32 əsas və 3 əlavə görünüş 320/390/430 enlərdə çəkilib; mətn sərhədləri sürüşdürmə boyu yoxlanıb. Cavab səsi və vaxt/rank qaydaları dəyişmir.

Baxış: `output/design/studio-broadcast-2026-10-06/BAXIS.html`. Əvvəlki/yeni görünüş və fon müqayisəsi: `output/testing/studio-broadcast-2026-10-06/BAXIS.html`. Əvvəlki V6 fonu və altı əvvəlki ekran görüntüsü həmin qovluqdakı `before/` daxilində saxlanır. Fiziki iPhone/Android-də səs, sistem yazı ölçüsü və ekran təhlükəsiz kənarları ayrıca yoxlanmalıdır.

API, baza miqrasiyası, sual bankı və oyun qaydaları dəyişdirilməyib. Canlı duel, qeydiyyat və rəsmi reytinq bu dizayn işi ilə funksional sayılmır.

Yekun: Android/iOS/web export-u `output/testing/export-studio-broadcast/` daxilində uğurla tamamlandı. Baxış yoxlaması 35 görünüşün üç ölçüdə açılmasını, altı əvvəlki/yeni görüntü keçidini, dörd müqayisə fonunu və ayrı dinləmə səhifəsində 20/25/30 saniyəlik faylların 1 sürətlə, ortadan davam və dayandırma davranışını təsdiqlədi.
