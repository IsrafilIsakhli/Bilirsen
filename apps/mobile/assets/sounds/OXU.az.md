# Bilirsən? — Studio səsləri V7

06.10.2026. Tik–tak əvvəlki yumşaltmadan sonra zəif eşidildiyi üçün yenidən aydınlaşdırıldı. İki növbələşən qısa saat vurğusu, sakit harmonik musiqi və sona doğru sıxlaşan ritm var. Saturasiya və dissonant qat tətbiq edilmir. Bunlar ayrıca sintez edilmiş orijinal tembrlərdir; veriliş yazısı istifadə olunmur.

- `tick-20.wav`: asan sual üçün 20 saniyə.
- `tick-25.wav`: orta sual üçün 25 saniyə.
- `tick.wav`: çətin sual və dinləmə nümunəsi üçün 30 saniyə.
- `correct.wav`: dəyişməyən V5 müsbət vurğu, 0,85 saniyə.
- `wrong.wav`: dəyişməyən V5 enən vurğu, təxminən 0,70 saniyə.

Bütün fayllar 44,1 kHz stereo 16-bit PCM-dir. Cəmi təxminən 12,87 MiB. Fon pikləri −6,02 dBFS-dir. RMS 30/20/25 fayllarında −27,18 / −26,75 / −27,37 dBFS-dir. Cavab pikləri −3,10 / −4,11, RMS −18,65 dBFS olaraq qalır. Fayllarda aşkar edilən tik–tak sayı 74–75, ilk dörddəbirdə 9, son dörddəbirdə 32–33-dür.

Serverin sual müddətinə uyğun fayl həmişə 1 sürətlə çalınır; canlı time-stretch və pitch correction yoxdur. Fon səviyyəsi 50%, cavablar 60%-dir. Səs açılan zaman serverin qalan vaxtına uyğun hissədən başlayır. Seçim göndərilməsi, çıxış pəncərəsi, bağlantı problemi, vaxtın bitməsi və tətbiqin arxa plana keçməsi fonu dayandırır. Sual boyunca hər saniyə restart etmir. Cavab siqnalı yalnız server feedback-i ilə bir dəfə çalınır. Cavabsız timeout yanlış cavab siqnalı yaratmır.

`python scripts/generate-timer-sounds.py` yalnız fonları yaradır və cavab fayllarının dəyişmədiyini yoxlayır. `python scripts/generate-sounds.py --verdicts-only` yalnız cavabları yeniləyir, fonları saxlayır. `node scripts/verify-studio-audio.mjs` WAV ölçülərini, saat vurğularının mövcudluğunu və sona doğru sıxlaşmasını ayrıca ölçür. Cari 30 saniyəlik fonun SHA-256 izi: `0ea8fbdece94cf7649b817d9b85eea19a4f6a3bdfe7a3cbb91e575ece1867ee1`.

Əvvəlki V6 faylları `output/testing/studio-broadcast-2026-10-06/before/`, daha köhnə V4 fon `output/testing/studio-atmosphere-2026-10-06/audio-before/` daxilində saxlanır. Dinləmə səhifəsi tarixi qovluq altında yenilənib: `output/testing/studio-sound-v4/BAXIS.html`; ayrı 20/25/30 faylları açır. Müqayisə `output/testing/studio-broadcast-2026-10-06/BAXIS.html` daxilindədir. Fiziki telefonda eşidilən keyfiyyət ayrıca yoxlanmalıdır.
