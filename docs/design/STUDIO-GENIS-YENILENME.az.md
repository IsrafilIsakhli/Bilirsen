# Bilirsən? — geniş təqdimat yeniləməsi

06.10.2026. Qəbul edilmiş göy–qızılı studiya dizaynı əsasında ekranların məlumat quruluşu və qarşılıqlı işləməsi yenilənib. Oyun qaydaları, bank və server xidmətləri dəyişdirilməyib.

## Əsas dəyişikliklər

| Hissə           | Yeniləmə                                                                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ana səhifə      | Xüsusi səhnə paneli, davam edən yarış üçün uyğun başlıq, son nəticədə faktiki rank dəyişikliyi. Sual sayı nəticənin məlumatından alınır.                                                                |
| Oyun            | Qalan vaxt böyük rəqəm və dairəvi irəliləyişlə göstərilir; hesab ayrıca oxunur. Sual və cavab çərçivələri, yazı və seçim hərfləri yenilənib. Vaxt və nəticə yenə serverə bağlıdır.                      |
| Cavab vəziyyəti | Gözləmə/nəticə izahının boşluğu və rank yazısının oxunaqlılığı artırılıb. Bir dəfə çalınan cavab səsi saxlanıb.                                                                                         |
| Nəticə          | Böyük telefonlarda nişan və nəticə başlığı yan-yana, dar telefonlarda üst-üstə yerləşir. Yeni tur icmalı düzgün cavab və bağlanmış sual sayını ayrıca göstərir. Yanlış/cavabsız sayları təxmin edilmir. |
| Profil          | Üç kiçik statistika kartı əvəzinə düzgün cavab faizi, tur sayı və bağlanmış suallar vahid göstəricidədir. Boş hesab üçün ayrıca izah var. Duel göstəricilərinin gələcək xidmət olduğu yazılır.          |
| Hesab keçidləri | Tarixçə və ayarlar ortaq toxunma sətirlərindədir; uzun yazı açılır və basma vəziyyəti görünür.                                                                                                          |
| Duel studiyası  | İki oyunçunun yeri xüsusi səhnə panelindədir. Canlı xidmət statusu, deaktiv düymələr və ayrı rank saxlanır.                                                                                             |
| Bilik pillələri | Cari nişan, rank adı və xal səhnə panelindədir; aşağıdakı pillə yolu daha tez görünür.                                                                                                                  |
| Reytinq         | Şəxsi rank rəsmi siyahmanın gözləmə izahından əvvəl göstərilir. Dolu reytinq nümunəsində podium səhnə panelinə yerləşdirilib, siyahıda xal sütunu adlandırılıb.                                         |
| Səs ayarları    | Üç dinləmə əməli izahlı sətirlərdədir. İşlək “Dinləməni dayandır” düyməsi əlavə edilib. Mövcud səs faylları dəyişdirilməyib.                                                                            |

Yeni ortaq `StagePanel` yalnız səhnə təqdimatlarında, `ActionRow` isə həqiqi keçid və dinləmə əməli üçün işlənir. Yeni komponentlər və təqdimat DTO-ları serverdə oyun qaydaları hesablamır. Faiz və icmal serverin göndərdiyi sayların vizual təqdimatıdır.

## Yoxlamalar

- Dörd mövcud tətbiq sınağı keçib. Səs sınağı yeni dayandırma əməlindən sonra bütün pleyerlərin dayanmasını da yoxlayır.
- Nəticə və rankın son düzülüşündən sonra təqdimat sınağı yenidən keçib.
- TypeScript və lint keçib; Android, iOS və web paket ixracı `output/testing/export-studio-major/` daxilindədir.
- 32 əsas və 4 əlavə görünüş 320/390/430 enlərdə, uzun mətn və böyük rəqəmlərlə yoxlanıb. Şəkillər altı baxış vərəqində nəzərdən keçirilib. Sürüşdürmə, forma sahələrinə çatmaq və böyük sual yazısı brauzer təqdimatında yoxlanır.
- Beş səs faylının SHA-256 izləri əvvəlki versiya ilə müqayisə olunur. Oyun vaxtı, səs müddəti və cavab vurğusunun server təsdiqindən sonra çalınması saxlanır.

Bütün görünüşlər: `output/design/studio-major-2026-10-06/BAXIS.html`. On iki əvvəl/sonra müqayisəsi: `output/testing/studio-major-2026-10-06/BAXIS.html`. Əvvəlki şəkillər həmin qovluğun `before/` hissəsindədir.

Hesab, canlı duel və rəsmi reytinq xidmətləri bu işlə tamamlanmış sayılmır. Fiziki iPhone/Android və mağaza yığımı yoxlanmayıb. Yerli xidmətlər Expo Go yoxlaması üçün saxlanılır.
