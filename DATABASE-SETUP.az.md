# Yerli PostgreSQL database-i

Bu konfiqurasiya yalnız yerli inkişaf və sınaq üçündür. Tətbiq kodu hələ yaradılmayıb. Sual bankının hazırlanmış hissəsi ayrıca `question_bank.questions` cədvəlində saxlanır; aktual say `question-bank/progress.json` faylındadır.

PostgreSQL 18, UTF-8 və yalnız bu kompüterdən giriş istifadə olunur. Məlumatlar Docker-in `azquiz-local_postgres_data` adlı ayrıca volume-unda saxlanır. Container dayansa və yenidən açılsa, məlumatlar saxlanır. Volume ehtiyat nüsxənin əvəzi deyil.

## Serveri başlatmaq

Docker Desktop işlək vəziyyətdə olmalıdır. C:\project3 qovluğunda:

```powershell
docker compose up -d --wait postgres
```

## pgAdmin bağlantısı

pgAdmin ana səhifəsində **Add New Server** seçin.

**General** bölməsi:

| Sahə | Dəyər |
|---|---|
| Name | Azərbaycan Quiz - Lokal |

**Connection** bölməsi:

| Sahə | Dəyər |
|---|---|
| Host name/address | 127.0.0.1 |
| Port | 5432 |
| Maintenance database | quiz_az |
| Username | quiz_admin |
| Password | C:\project3\.local\postgres-password.txt faylındakı parol |

Windows-da pgAdmin 9.18 ilə `exception: access violation writing 0x0000000000000000` xətası çıxarsa, server pəncərəsində **Parameters → +** seçin, **GSS encmode** parametrini əlavə edib dəyərini **disable** qoyun və yenidən **Save** basın. Parametr artıq varsa, mövcud sətri dəyişin. Bu, pgAdmin-in məlum bağlantı xətası üçün müvəqqəti həllidir: [rəsmi xəta qeydi və həll](https://github.com/pgadmin-org/pgadmin4/issues/10428).

**Save** seçin. Solda **Servers → Azərbaycan Quiz - Lokal → Databases → quiz_az** görünməlidir. `postgres`, `template0` və `template1` PostgreSQL-in standart database-ləridir; layihə üçün `quiz_az` istifadə edilir.

Parol yalnız yerli istifadə üçündür, avtomatik yaradılıb və versiya nəzarətindən çıxarılıb. `quiz_admin` database idarəçisi üçündür. Tətbiq hazırlananda onun üçün daha məhdud səlahiyyətli ayrıca istifadəçi yaradılacaq.

## Suallara baxmaq

Solda `quiz_az` üzərində sağ klik edib **Refresh** seçin. Sonra **Schemas → question_bank → Tables → questions** yolunu açın. `questions` üzərində sağ klik → **View/Edit Data → All Rows** seçin. `review_ready` statusu son baxışa hazırlanan hissəni bildirir; bankın tam 10.000 sualla hazır olması demək deyil.

## Dayandırmaq və yenidən açmaq

```powershell
docker compose stop postgres
docker compose start postgres
```

`docker compose down --volumes` məlumatları silir. Adi dayandırmada bu əmrdən istifadə etməyin.

Konfiqurasiyadakı parol faylını dəyişmək mövcud database parolunu avtomatik dəyişmir. PostgreSQL parolu ayrıca dəyişdirilməlidir.

Rəsmi mənbələr: [PostgreSQL Docker image](https://hub.docker.com/_/postgres), [pgAdmin server bağlantısı](https://www.pgadmin.org/docs/pgadmin4/latest/server_dialog.html).
