# Kod keyfiyyəti prinsipləri

İstifadəçinin əsas tələbi: oxunaqlı, səliqəli, yüksək keyfiyyətli kod. Keyfiyyət kod sətirlərinin çoxluğu ilə ölçülməyəcək.

## Yazılış və məsuliyyət

- Dəqiq adlar: dəyişən, funksiya və modulun işi adından anlaşılmalıdır.
- Funksiya bir məntiqli işi görməlidir. Böyük ekran və xidmətlər məsuliyyətlərinə görə ayrılmalıdır.
- Format vahid olmalıdır: UTF-8, LF, iki boşluq; tətbiq kodlamasında TypeScript strict, ESLint və Prettier yoxlamaları qurulacaq.
- Eyni davranış təkrar yazılmamalıdır. Ortaq kod real ehtiyac olduqda çıxarılmalıdır; ehtiyac olmayan əlavə qatlar yaradılmamalıdır.
- Şərhlər kodun özünü təkrarlamaqdan çox qərarın səbəbini izah etməlidir.

## Mobil tətbiq

Səhifə keçidləri, ekran görünüşü, server əlaqəsi və oyun vəziyyəti ayrı saxlanır. Ekranın içinə database və server xal hesabı yerləşdirilmir. Rəng, ölçü və yazı qaydaları ortaq temadan gəlir. Uzun Azərbaycan mətnləri və fərqli telefon ölçüləri nəzərə alınır.

## Server və database

Controller/gateway yalnız sorğunu alır, yoxlayır və uyğun əməliyyata ötürür. Xal, vaxt, mərhələ və qalib qaydaları oyun moduluna aiddir. Cavab və nəticənin təkrar göndərilməsi ikinci dəfə xal yaratmır. Nəticə, rank və statistika bir tranzaksiyada bağlanır.

Gələn məlumat yoxlanır, şəxsi məlumat yalnız sahibinə və səlahiyyətli əməliyyata açılır. Şifrələr və tokenlər mətn kimi saxlanmır və loga yazılmır. Database qeydi birbaşa telefona qaytarılmır.

## Xətalar və sınaqlar

Xəta səssizcə udulmur və saxta uğurlu nəticəyə çevrilmir. İstifadəçiyə aydın Azərbaycan dilində vəziyyət göstərilir; serverdə araşdırmaq üçün uyğun identifikator saxlanır.

Əsas sınaqlar xal, deadline, eyni cavabın təkrarı, ikiqat nəticə, bərabərlik mərhələsi, bağlantı bərpası, qonağın qeydiyyata çevrilməsi və server nasazlığına yönələcək. Sınaqlar real davranışı yoxlamalıdır. Hazırda yalnız qovluq quruluşu var; tətbiq sınaqları hələ yaradılmayıb.
