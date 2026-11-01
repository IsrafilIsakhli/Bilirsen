# Oyun və bağlantı dayanıqlılığı — 02 noyabr 2026

Bu dəyişiklik oyun vaxtlarını, xal/rank qaydalarını, qəbul edilmiş dizaynı və sual bankını dəyişmir. Yeni database miqrasiyası və əlavə paket yoxdur. Qeydiyyat, canlı duel və rəsmi reytinq əvvəlki mərhələdə qalır.

## Scheduler xətalarının təcridi

Bir oyunun keçidi uğursuz olarsa həmin tranzaksiya geri qaytarılır. Scheduler istifadəçi kilidi altında yalnız həmin aktiv oyunu `cancelled_server` edir; nəticə və rank ledger yazmır. Eyni paketdəki digər oyunların işlənməsi davam edir. Jurnalda yalnız hadisə, oyun ID-si və xəta növü saxlanır.

Vaxtı çatmış oyunlar `dueAt`, sonra ID üzrə işlənir. Beləliklə 100 oyunluq paket əvvəl ən çox gözləyən qeydlərdən başlayır. Ləğv edilmiş oyunlar yeni tur üçün son sualların hesablanmasından çıxarılır; zədələnmiş köhnə vəziyyət yeni turun başlamasını bloklamır.

Ümumi database kəsilməsi və ya ləğv yazısının uğursuzluğu yenə scheduler-in ümumi bərpa yoluna keçir. Server restartı zamanı aktiv oyunların ləğvi də saxlanır. Bu paket restartdan sonra avtomatik davam və çoxprosesli oyun serveri dəstəyi əlavə etmir.

## Sual seçimi

Əvvəl yalnız bank ID-si, fakt açarı, çətinlik və mövzu oxunur. Son turlara üstünlük verməmə və mövzu müxtəlifliyi qaydaları ilə 2 asan, 5 orta, 3 çətin sual seçilir. Yalnız seçilmiş 10 sualın mətni, variantları və cavab açarı ikinci sorğuda alınır. Production status filtri hər iki sorğuda tətbiq edilir.

Tam bankın mətnləri və variantları hər turda Node.js yaddaşına daşınmır. Namizədlərin metadata siyahısı yenə tam oxunur; bu, tam indeksli/təsadüfi database seçimi və ya yük testi əvəzi deyil. Mətn və düzgün cavabın variant qarışdırılmasından sonra uyğunluğu saxlanır; çatışmayan sual xətası nümunə məlumatla gizlədilmir.

## Mobil HTTP və sorğu davranışı

HTTP nəqli ayrıca `fetch-json.ts` modulundadır. 10 saniyəlik vaxt limiti həm bağlantını, həm başlıqları, həm də cavab gövdəsinin tam alınmasını əhatə edir. Başlıqlar gəlib gövdə yarımçıq qalsa da sorğu dayandırılır. Pozulmuş JSON və şəbəkə kəsilməsi fərqli xəta kodları alır. Şəbəkə mesajları artıq kompüterlə eyni Wi-Fi tələb olunduğunu demir.

Solo ekranı fokusdan çıxanda dövri sorğular deaktiv olur. Tətbiq arxa planda sorğu göndərmir, ön plana qayıdanda server vəziyyətini yenidən oxuyur. Sağlam bağlantıda interval 700 ms, sorğu xətası zamanı 3 saniyədir. Server vaxt və nəticə üçün yeganə həqiqət mənbəyidir.

## Yoxlamalar və məhdudiyyətlər

Avtomatik paketdə 28 sınaq var:

- 10 oyun qaydası və sual seçimi sınağı;
- 3 scheduler sınağı: bir oyunun xətası, ümumi kəsilmə sonrası bağlanma və üst-üstə düşməyən timer paketləri;
- 4 HTTP sərhəd sınağı;
- 5 mobil HTTP sınağı: status/JSON, gec başlıqlar, gec gövdə, qüsurlu JSON və yarımçıq bağlantı;
- 6 canlı API/PostgreSQL sınağı, o cümlədən zədələnmiş oyunla paralel sağlam oyun və yeni turun başlanması.

Bu iş zamanı **22 sınaq keçdi, 6 canlı sınaq işlədilmədi**: yerli Docker Desktop `dockerInference` bağlantısının açılış xətası ilə bağlanır. Scheduler sınaqları saxta timer və dəyişdirilmiş I/O ilə real xidmət sinfini işlədir; canlı PostgreSQL tranzaksiyası təsdiqi sayılmır.

Strict TypeScript (API sınaqları daxil), ESLint, Prettier yoxlaması, API yığımı və Android/iOS/web paket ixracı uğurla tamamlandı. Hazırlama bankına və mövcud database məlumatlarına dəyişiklik edilmədi.

Database/API işlədikdən sonra tam paket ayrıca keçirilməlidir:

```powershell
$env:RUN_INTEGRATION='1'
try { npm test } finally { Remove-Item Env:RUN_INTEGRATION }
```

Fiziki iPhone/Android-də arxa plana keçid, Expo şəbəkə nəqli və bağlantı bərpası bu işdə yoxlanmayıb. Paket ixracı da mağaza yığımı və ya cihaz sınağı deyil.
