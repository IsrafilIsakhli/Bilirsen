# Bilirsən? — fon və duel səhifəsinin yenilənməsi

Sonrakı tik–tak və bütün ekran yeniləməsi [STUDIO-VERILIS.az.md](STUDIO-VERILIS.az.md) daxilindədir. Bu sənəd əvvəlki V6 mərhələsini təsvir edir.

06.10.2026. İstifadəçi əvvəl saxlanmış fondakı yüngül pozulmanın düzəldilməsini ayrıca istədi; bu dəfə fonun yenilənməsi açıq şəkildə tapşırılıb. Əvvəlki cilalama hesabatındakı «fon dəyişməyib» qeydi həmin əvvəlki mərhələyə aiddir.

## Səs

Köhnə fonda sona yaxın əlavə edilən yaxın tezlikli dissonans, saturasiya və telefonda 1,2/1,5 sürətlə çalınma yüngül kobudluğa səbəb ola bilərdi. Bunlar ehtimal olunan səbəblərdir; cihazda səbəb ayrıca ölçülməyib.

Yeni V6 fonda dissonant qat çıxarılıb, vuruşun başlanğıcı yumşaldılıb, yüksək tezliklər sakitləşdirilib və saturasiya çıxarılıb. 20/25/30 saniyə üçün üç ayrıca fayl hazırlanıb. Tətbiq onları 1 sürətlə çalır; canlı sürət və pitch emalı yoxdur. Ritmin ortadan sona sıxlaşması, server deadline-ına uyğun davam, mute və bir dəfə cavab vurğusu saxlanır.

Fon pikləri −6,02 dBFS-dir. Düzgün/yanlış V5 faylları əvvəlki fayl izləri ilə eynidir. Əvvəlki musiqi və fayl izləri `output/testing/studio-atmosphere-2026-10-06/audio-before/` daxilində saxlanıb. Üç tam fon faylı tətbiqin audio həcmini təxminən 12,87 MiB-ə artırır.

## Görünüş

Ortaq statik fonda iri mərkəzi halqalar əvəzinə sakit divar panelləri, incə üst səhnə quruluşu, yumşaq çoxqatlı proyektor şüaları, mərkəzdə mətn üçün tünd sahə və aşağıda zəif döşəmə əksi var. Yerli SVG komponentidir; bitmap və əlavə animasiya yükü yoxdur. Göy–qızılı palitra saxlanıb.

Duel studiyası qarşılaşma kartı, ayrıca duel rankı və yarış növlərinə bölünüb. Avatarlar yığcamlaşıb; qələbə/məğlubiyyət xalı eyni sətirdə göstərilir. Dost otaqları sadə kartdadır, təkrarlanan izahlar azaldılıb. «Tezliklə» və deaktiv düymələr canlı duel funksiyasının hazır olmadığını bildirir.

## Yoxlama

320/390/430 ölçülərdə ekranların görünüşü, uzun mətnlər və formalar yoxlanıb. Səs sınaqları ayrıca 20/25/30 fayllarını 1 sürətlə çalmağı, dayandırma/davam və server cavabının bir dəfə çalınmasını yoxlayır. Android/iOS/web export-u `output/testing/export-studio-atmosphere/` daxilindədir. Bu, fiziki cihaz testi deyil.

Yekun baxış `output/design/studio-polish-2026-10-06/BAXIS.html`, səs müqayisəsi `output/testing/studio-atmosphere-2026-10-06/BAXIS.html` daxilindədir. Fiziki telefonda musiqinin subyektiv keyfiyyəti istifadəçi ilə yoxlanmalıdır. API, baza, sual bankı, oyun vaxtları və rank qaydaları dəyişdirilməyib.

Cari yeniləmənin yekun nəticəsi: TypeScript və ESLint keçdi; dörd brauzer axını keçdi. Əlavə audio/baxış yoxlamaları beş faylın müddət və piklərini, saxlanan cavab izlərini, 35 görünüşün üç enini, 20/25/30 saniyəlik seçimi, 1 çalınma sürətini və ortadan davam/dayandırmanı təsdiqlədi. Android/iOS/web export-u uğurla tamamlandı.
