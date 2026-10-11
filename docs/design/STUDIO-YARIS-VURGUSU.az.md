# Bilirsən? — yarış vurğusu və sakit təqdimat

06.10.2026. Göy–qızılı Studio üslubu saxlanılır. Bu reviziyada əsas əməl, informasiya ardıcıllığı və ekranların bir-birinə uyğunluğu üzərində işlənib.

## Dəyişikliklər

- Ana səhifədə solo yarış əsas paneldir. Ranklar aşağıda yığcam göstərilir; duel və son nəticə daha sakit keçidlərdir. Məlumat və düymə olmayan bəzəklər azaldılıb.
- Rank kartının yığcam variantı yalnız ana səhifədə istifadə olunur; profildə daha geniş rank təqdimatı qalır. İrəliləyiş xətti incəldilib. Rank məlumatı yenə serverdən gəlir.
- Səhnədə sərt üçbucaq şüaları yumşaq, istiqamətli radial işıqla əvəz olunub. Yan konstruksiya və lampalar qalır, mərkəz mətn üçün sakitdir. Fon statikdir.
- Adi panellərin əlavə daxili konturları və kölgəsi çıxarılıb. Əsas düymənin qızılı tonu və yazı ağırlığı yumşaldılıb. Başlıq, düymə və köməkçi mətn arasında vurğu fərqi artırılıb.
- Qarşılamada tətbiqin mövcud nişanı işlənir. Böyük adın ölçüsü və ağırlığı azaldılıb.
- Duelin qarşılaşma təqdimatı ayrıca kart çərçivəsindən çıxarılıb. Ranklı duel və dost otağı eyni seçim panelindədir. Gələcək xidmət statusu və deaktiv düymələr saxlanır.
- Formalardakı dairəvi medal əvəzinə sakit ikon istifadə olunur. Formanın sahələri, şifrə idarəetməsi və klaviatura davranışı saxlanır.
- Profil statistikasında ikonların əlavə fonu və kart çərçivələri çıxarılıb. Tarixçədə status yazıları normal registrdədir və qeydlərin səthi daha sakitdir.
- Nəticə dairəsinin əlavə halqaları və parıltısı azaldılıb; düzgün cavab sayı əsas vurğudur. Sual və cavabların seçilmiş studiya çərçivəsi saxlanır.

Oyun vaxtları, xal və rank qaydaları, API, sual bankı və baza dəyişdirilməyib. Beş səs faylı əvvəlki SHA-256 izləri ilə tam eynidir. Hesab, canlı duel və rəsmi reytinq bu dizayn işi ilə funksional sayılmır.

## Yoxlama və baxış

32 əsas və 4 əlavə görünüş 320/390/430 enlərdə çəkilib və alt hissələrinə qədər yoxlanıb. Uzun ad, böyük statistika, çoxsətirli sual/variant, böyüdülmüş sual yazısı və klaviatura üçün daralmış forma sahəsi brauzer təqdimatında yoxlanıb. Bütün ekranlar altı vizual baxış vərəqində nəzərdən keçirilib.

Dörd tətbiq sınağı keçib. TypeScript, lint, səs yoxlaması və Android/iOS/web paket ixracı keçib. Paketlər `output/testing/export-studio-finesse/` daxilindədir; fiziki iPhone/Android və mağaza yığımı bu yoxlamaya daxil deyil.

- Bütün ekranlar: `output/design/studio-finesse-2026-10-06/BAXIS.html`.
- Əvvəl/sonra müqayisəsi: `output/testing/studio-finesse-2026-10-06/BAXIS.html`.
- Bu reviziyadan əvvəlki şəkillər: `output/testing/studio-finesse-2026-10-06/before/`.
- Səs izləri: `output/testing/studio-finesse-2026-10-06/sounds-before.json`.

Fiziki cihazda görünüş, təhlükəsiz boşluqlar və toxunma davranışı ayrıca təsdiqlənməlidir. Yerli API və Expo Go bağlantısının yenilənməsi üçün mövcud `phone:link` əməli istifadə olunur.
