# Yeni kompüterdə yerli quraşdırma

Bu təlimat repo yeni klonlandıqda istifadə olunur. PowerShell 7, Node.js 22.13+ və açıq Docker Desktop tələb olunur. Əmrləri layihənin kökündə işlət.

## Kitabxanalar

```powershell
npm ci
npm run generate
```

## Database-in ilk hazırlanması

Docker konfiqurasiyası `.local/postgres-password.txt` faylını tələb edir. Aşağıdakı əmr fayl yoxdursa təsadüfi parol yaradır; mövcud fayla toxunmur və parolu terminalda göstərmir.

```powershell
node -e "const fs=require('node:fs');const crypto=require('node:crypto');fs.mkdirSync('.local',{recursive:true});if(!fs.existsSync('.local/postgres-password.txt'))fs.writeFileSync('.local/postgres-password.txt',crypto.randomBytes(32).toString('hex'),{flag:'wx'});"
docker compose up -d --wait postgres
```

Tamamilə yeni database-ə mövcud hazırlama bankını daxil et:

```powershell
Get-Content -Raw -Encoding utf8 question-bank/sql/import-questions.sql | docker compose exec -T postgres psql -X -v ON_ERROR_STOP=1 -U quiz_admin -d quiz_az -q
```

İdxal yalnız boş database-in ilk quraşdırılması üçündür. Artıq sual bankı olan kompüterdə bu addımı keç. Əsas sual faylı `question-bank/data/questions.jsonl`-dir; hazırlama bankının köhnə xal sahələri tətbiqin cari oyun qaydalarını müəyyən etmir.

Sonra tətbiq sxemini və inkişaf suallarını hazırla:

```powershell
npm run db:prepare
```

Skript `app` sxemini yaradır, ayrıca məhdud runtime hesabı hazırlayır və `apps/api/.env.local` faylını yazır. Bankdan 120 sual `test_only` statusu ilə seçilir. Hazırlama bankı və Docker volume-u silinmir. Migration checksum-u uyğun gəlməsə skript dayanır.

Skript administrator əməliyyatlarını lokal container vasitəsilə yerinə yetirir; tətbiq həmin administrator hesabından istifadə etmir. Runtime konfiqurasiyası və `.local` qovluğu Git-ə daxil edilmir.

## Mobil bağlantı

```powershell
Copy-Item apps/mobile/.env.example apps/mobile/.env.local
```

Bu fayl artıq varsa onu kopyalamaq əvəzinə mövcud ünvanı yoxla. `EXPO_PUBLIC_API_URL` üçün kompüterin Wi-Fi IPv4 ünvanını yaz: məsələn, `http://192.168.0.11:3000/v1`. Bu açıq API ünvanıdır; burada parol və ya server sirri olmamalıdır.

İki ayrı terminalda:

```powershell
npm run dev:api
```

```powershell
npm run dev:mobile
```

Expo Go-da kompüterdə istifadə etdiyin Expo hesabına daxil ol. Telefon və kompüter eyni Wi-Fi şəbəkəsində olsun. `npm run phone:link` əmri QR şəkli və `output/testing/phone/BAXIS.html` səhifəsini yaradır. Ünvan dəyişəndə mobil konfiqurasiyanı yenilə və Expo-nu yenidən başlat.

Telefonun brauzerində `http://KOMPÜTERİN_IP_ÜNVANI:3000/v1/health` açılmalıdır. Açılmırsa Wi-Fi, telefonun lokal şəbəkə icazəsi və Windows-un Node üçün icazəsini yoxla. `scripts/allow-phone-local.ps1` yalnız yerli şəbəkə üçün ayrıca administrator alətidir; normal işə salma zamanı avtomatik icra edilmir.

## Mövcud məlumatlarla davam etmək

Adi başlanğıc üçün:

```powershell
docker compose up -d --wait postgres
```

Sonra API və mobil terminalları aç. Gündəlik iş üçün bankı idxal etmək, parolu yenidən yaratmaq və ya volume-u silmək lazım deyil. Database-i dayandırmaq üçün `docker compose stop postgres` kifayətdir.
