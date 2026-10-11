# Azərbaycan quiz tətbiqi — ilk işlək versiyanın planı

Tarix: 5 oktyabr 2026. Bu sənəd mobil tətbiqin hazırlanması üçün təklifdir; son dizayn və rank müzakirəsinə uyğun yenilənib. Burada təsvir olunan tətbiq və oyun serveri hələ qurulmayıb. İstifadəçinin hazırkı istəyi qaydaları və dizaynı müzakirə etməkdir; kodlamaya başlanmır.

## 1. İndi tətbiqə keçməyin səbəbi

Hazırda 1950 sual var: 205 asan, 1022 orta, 723 çətin. Fayllardakı məlumatlarla yerli PostgreSQL bazası tutuşdurulub. Bu bank ilk işlək versiyanı və kiçik istifadəçi sınağını başlatmağa imkan verir. Sualların çətinliyi hələ oyunçuların nəticələri ilə ölçülməyib.

Tətbiq sınağı bizə sual oxuma rahatlığını, vaxt limitini, oyun tempini, təkrar hissini və duel marağını qiymətləndirməyə kömək edəcək. Qalan 8050 sualı bu nəticələrə əsasən hazırlamaq daha faydalıdır. Yeni suallar ayrıca bazaya əlavə olunacaq; tətbiqi hər dəfə yenidən yayımlamaq tələb edilməyəcək.

## 2. Razılaşdırılmış oyun qaydaları

- Tətbiqin bütün oyun mətnləri Azərbaycan dilində olacaq.
- Əsas oyun 10 sualdan ibarət olacaq.
- Yalnız iki oyun rejimi olacaq: “Tək oyna” və “Duel”. Oyunçu kateqoriya seçməyəcək; suallar mövzulardan qarışıq gələcək. Bankdakı kateqoriya məlumatları daxili seçim üçün saxlanacaq.
- Düzgün cavabın yarış xalı: asan 20, orta 25, çətin 30. Səhv cavab və vaxtın bitməsi yarışda 0 xal verir.
- Solo rankı üçün qəbul edilmiş ilkin cədvəl: asan düzgün +5, səhv −3; orta düzgün +8, səhv −4; çətin düzgün +12, səhv −5. Bu cədvəl sınaqdan sonra balanslaşdırıla bilər. Rank xalı yarış xalından ayrı saxlanacaq. Vaxt bitənədək heç bir variant seçilməyibsə, yarış xalı da, solo rank dəyişikliyi də 0 olacaq; bu hal səhv cavab sayılmayacaq. Yanlış variant seçilməsi solo üçün cədvəldəki mənfi rank xalını saxlayır.
- Rank adları: Şagird → Tədqiqatçı → Alim → Müdrik → Əllamə. Hər rankda I, II, III alt pillələri olacaq; nəticəyə görə yüksəlmək və aşağı düşmək mümkündür. Alt pillələrin yüksəliş sırası üçün III → II → I təklif olunur. Xal sərhədləri hələ seçilməyib.
- Solo rankı və duel rankı ayrı olacaq. İstifadəçi duel rank hesabını seçməyi agentə həvalə edib: təsadüfi rəqiblə yekunlaşdırılmış dueldə qələbə +25, məğlubiyyət −25 duel rank xalı verəcək. Solo üçün olan sualbaşına +5/+8/+12 və mənfi cədvəl duel rankına əlavə olunmayacaq; bu, əvvəlki ümumi rank təklifinin rejimlər üzrə dəqiqləşdirilməsidir. Dueldə düzgün cavablar yenə 20/25/30 yarış xalı verir və qalibi müəyyənləşdirir. Cavabsız sual ayrıca rank cəriməsi yaratmır; bütöv duelin məğlubiyyət nəticəsi isə rankı azaldır. Rank xalı minimum 0-dan aşağı düşməyəcək.
- Cavabsız sualın vaxtı bitəndə növbəti suala avtomatik keçilir; istifadəçidən davam düyməsi tələb edilmir. Dueldə hər iki oyunçu eyni mərhələyə birlikdə keçir. Son sualdan sonra nəticə və ya bərabərlik varsa əlavə mərhələ göstərilir.
- Tək oyunda 10 sualdan sonra nəticə göstərilir və yeni yarış başlatmaq mümkündür.
- Dueldə hər iki oyunçu eyni sualları eyni ardıcıllıqla alacaq.
- Yekun xallar bərabərdirsə, əlavə 3 sual veriləcək. Bərabərlik davam etdikcə 3 suallıq əlavə mərhələ təkrarlanacaq.
- Ekranda “Bərabərlik — əlavə mərhələ” göstəriləcək.
- Cavab sürəti bərabərliyi pozan meyar olmayacaq.
- İlk versiyada kömək hüquqları olmayacaq.

Sual vaxtları asan üçün 20, orta üçün 25, çətin üçün 30 saniyə, əsas yarışın bölgüsü isə 2 asan + 5 orta + 3 çətin olacaq. Son müzakirənin 3-cü bəndində bu təklifə əlavə olaraq cavabsız sualın cəriməsiz keçilməsi bildirilib. Bu bölgüdə maksimum yarış xalı 255-dir. Mövcud sual bankının xal sahəsi hazırda 10/20/30-dur; qəbul edilən yarış xalı 20/25/30-dur, bank hələ dəyişdirilməyib. Vaxtla xal ayrı parametrlər olacaq.

Duel zamanı düzgün cavab iki oyunçu da cavab verəndən və ya vaxt bitəndən sonra açıqlanacaq. Bu, bir oyunçunun cavabını görüb digərinin seçim etməsinin qarşısını alır. İnternet kəsilib bərpa olunanda oyun əvvəlki vəziyyətdən davam edəcək; artıq keçmiş vaxt geri qaytarılmayacaq.

## 3. İlk versiyanın əhatəsi

İlk versiyada qeydiyyat və giriş, ana səhifə, solo oyun, duel, rəqib tapma, nəticə, rank/reytinq, profil və əsas statistika nəzərdə tutulur. Kateqoriya seçimi çıxarılıb. Qonaq kimi giriş olacaq; adi qeydiyyat e-poçt, şifrə və istifadəçi adı ilə aparılacaq. Qonaq həmin müvəqqəti hesabla oynaya və rank irəliləyişini görə bilər; rəsmi reytinqdə görünmək qeydiyyatdan sonra açılır. Qonaq hesabı qeydiyyata çevriləndə onun serverdə saxlanmış nəticələri və iki rankı həmin hesaba ötürülür, ikinci dəfə xal verilmir. Başqa artıq mövcud hesaba giriş nəticələri avtomatik birləşdirmir. Profil düzgün cavab faizini, solo oyunları, duel qələbə və məğlubiyyətlərini göstərəcək.

Dueldə yaxın duel ranklı oyunçular qarşılaşdırılacaq. Otaq kodu ilə dostla oynamaq olacaq. Dost dueli yarış xalı və oyun nəticəsi verir, solo və duel ranklarına təsir etmir; otağa daxil olmamışdan bu aydın göstəriləcək. Rəqib tapılmadıqda axtarışın bitmə müddəti hələ seçilməyib; boş axtarış heç bir rank dəyişikliyi yaratmayacaq. Bot qarşılaşması real istifadəçi dueli kimi təqdim edilməyəcək.

İlk buraxılışdan sonra gündəlik tapşırıqlar, mövsümlər, nailiyyətlər, dost siyahısı, şəhər üzrə reytinq və istifadəçinin sual göndərməsi əlavə edilə bilər. ELO/MMR sistemi ayrıca rəqabət göstəricisi kimi qiymətləndiriləcək; XP ilə eyniləşdirilməyəcək.

## 4. Texnologiya seçimi

| Hissə | Təklif | Səbəb |
|---|---|---|
| Mobil tətbiq | Expo + React Native + TypeScript | İstifadəçinin Expo Go ilə iPhone-da ilkin sınaq seçiminə uyğun ortaq Android/iOS layihəsi; Studiya görünüşü bu texnologiya ilə qurulacaq |
| Oyun serveri | NestJS və TypeScript | Giriş, oyun qaydaları, statistika və canlı əlaqəni bir layihədə təşkil etmək |
| Canlı duel əlaqəsi | WebSocket, Socket.IO adapteri ilə | Oyun vəziyyətini və yeni sualları iki telefona ötürmək |
| Məlumat bazası | Mövcud PostgreSQL | Hazırlanmış sualları və gələcək istifadəçi/oyun məlumatlarını saxlamaq |

İstifadəçi ilk sınaqda həm Android, həm də iOS istifadə edəcəyini, iPhone-da əvvəlcə Expo Go ilə işləmək istədiyini bildirib. Hər iki platforma ilkin sınağın əhatəsinə daxildir. Əvvəlki Flutter/Dart təklifi bu seçimə uyğun Expo/React Native/TypeScript ilə əvəz edilir. Tətbiq kodu hələ yazılmayıb, keçid hazır tətbiqin yenidən yazılması deyil, planın dəyişdirilməsidir. Oyun serveri və PostgreSQL seçimi saxlanır.

İlk sınaqda Windows-da inkişaf serveri işləyəcək, uyğun Expo Go versiyası olan iPhone və Android telefon layihəni QR kodla açacaq. Kompüter və telefonların eyni Wi-Fi şəbəkəsində olması ilkin yoldur; şəbəkə buna imkan verməzsə, inkişaf serveri üçün tunel istifadə edilə bilər. iPhone-dakı Expo Go və kompüterdəki Expo aləti eyni Expo hesabına daxil olmalıdır. Expo hesabı oyunun e-poçt/şifrə hesabından ayrıdır. Bu Expo Go sınağı üçün şəxsi Mac tələb olunmur. Mənbə: [Expo — start developing](https://docs.expo.dev/get-started/start-developing/).

Expo-nun 3 sentyabr 2026 tarixli elanına və App Store səhifəsinə görə iOS Expo Go SDK 57 ilə yenilənib. Layihənin SDK versiyası telefondakı Expo Go ilə uyğun seçiləcək; köhnə təlimatlara əsasən uyğun olmayan SDK sabitlənməyəcək. Quraşdırma mərhələsində versiyalar yenidən yoxlanacaq. Mənbələr: [Expo — iOS Expo Go yenilənməsi və giriş](https://expo.dev/changelog/expo-go-57-login), [Expo Go — App Store](https://apps.apple.com/us/app/expo-go/id982107779).

Hər iki platformada solo oyunu və ayrıca Android ↔ iPhone real duelini sınaqdan keçirmək nəzərdə tutulur. Oyun qaydaları və server nəticələri hər iki cihazda uyğun olmalıdır. Sınaq serveri hər iki telefondan əlçatan olacaq; yerli kompüterin localhost ünvanı telefonun localhost ünvanı deyil. Serveri internetə açmaq və ya xarici xidmət almaq bu plan yeniləməsinin hissəsi deyil.

Expo Go ilkin ekran və oyun axını sınağının mühitidir. Kitabxanalar onun daxilində mövcud native imkanlarla uyğun seçiləcək. Fərdi native modullar, uzaq push bildirişləri və tətbiqin həqiqi ikon/açılış davranışı üçün ayrıca development build lazım ola bilər; bunlar Expo Go-da tam yoxlanmış sayılmayacaq. Yayımdan əvvəl ayrıca tətbiq yığımı və hər iki telefonda yenidən sınaq keçiriləcək. Mənbə: [Expo — development builds FAQ](https://docs.expo.dev/develop/development-builds/faq/).

Sonrakı Android/iOS yığımları EAS Build vasitəsilə buludda hazırlana bilər; iOS yığımı Expo-nun macOS serverlərində işləyir və istifadəçinin şəxsi Mac almasını tələb etmir. Yerli iOS yığımı və iOS simulyatoru isə macOS/Xcode tələb edir. Öz iOS tətbiqimizin EAS vasitəsilə cihazlara/TestFlight-a paylanması mərhələsində Apple hesabı, imzalama və üzvlük şərtləri ayrıca qurulacaq; ilkin Expo Go sınağı həmin yayım mərhələsi deyil. Mənbələr: [Expo — EAS Build](https://docs.expo.dev/build/introduction/), [Expo — development builds](https://docs.expo.dev/develop/development-builds/introduction/), [Apple — memberships](https://developer.apple.com/support/compare-memberships/).

Başlanğıcda bir oyun serveri və bir PostgreSQL xidməti kifayətdir. Redis və çoxsaylı serverlər istifadəçi yükü tələb edəndə əlavə olunacaq. NestJS-in istifadəçi və oyun modulları ayrı olacaq, lakin başlanğıc üçün ayrı-ayrı xidmətlərə parçalanmayacaq.

Oyun serveri üçün rəsmi mənbə: [NestJS — WebSocket gateways](https://docs.nestjs.com/websockets/gateways). Mobil hissənin mənbələri yuxarıdakı Expo sənədləridir.

## 5. Dizayn istiqaməti

İstifadəçi üç vizual eskiz arasından “01 / Studiya” variantını seçib: `output/design/01-studiya-2026-10-05.png`. “Milyonçu” yarışması kimi ciddi yarışma ab-havası əsas götürülür. Şəkildəki kateqoriya bölməsi son qərara əsasən çıxarılacaq; ana səhifə rank və iki oyun rejimi ətrafında yenidən qurulacaq. Mövcud şəkil əvvəlki variantdır, yeni qaydalara uyğun yenilənmiş ekran deyil.

Oyun ekranında tünd göy fon, işıq effekti, aydın sual bloku və A/B/C/D düymələri təklif olunur. Qızılı vurğular nəticə və mərhələ hissəsini önə çıxaracaq. Düymələr baş barmaqla rahat basılacaq; Azərbaycan hərfləri və uzun mətnlər kəsilməyəcək. Rənglə yanaşı işarə və mətn də düzgün/səhv cavabı göstərəcək.

Duel ekranında iki oyunçunun adı, xal göstəricisi, sual nömrəsi və qalan vaxt görünəcək. Sualın bitməsi, əlavə mərhələ və nəticə üçün qısa keçid animasiyaları olacaq. Səs və animasiyalar ayarlardan azaldıla və ya söndürülə biləcək.

İlk dizayn baxışında üç ekran hazırlanmalıdır: ana səhifə, sual ekranı, canlı duel ekranı. Bu görünüş müəyyənləşəndən sonra nəticə, profil və digər ekranlar eyni üslubda qurulacaq.

## 6. Məlumat və təhlükəsizlik

Telefon sual bankına birbaşa qoşulmayacaq. Əlaqə belə olacaq: mobil tətbiq → oyun serveri → PostgreSQL.

Mobil tətbiqə cari sualın mətni, dörd cavab variantı, sual nömrəsi və vaxt məlumatı göndəriləcək. Düzgün cavab, mənbələr və daxili yoxlama qeydləri sual açılan anda telefona göndərilməyəcək. Bütün 1950 sualın cavabları tətbiqin içinə yerləşdirilməyəcək.

Server istifadəçinin kimliyini, oyun iştirakını, göndərilən variantı və son cavab vaxtını yoxlayacaq. Xal, XP, qalib və reytinq nəticəsini server hesablayacaq. Eyni cavabın və ya yekun nəticənin təkrar göndərilməsi ikinci dəfə xal yaratmayacaq.

Tətbiqin baza istifadəçisi mövcud idarəçi hesabından ayrı və məhdud səlahiyyətli olacaq. Parollar açıq mətn kimi saxlanmayacaq. Xarici yayımdan əvvəl şifrəli bağlantı, giriş cəhdlərinin məhdudlaşdırılması və ehtiyat nüsxə bərpası yoxlanacaq.

## 7. Baza strukturu

Mövcud `question_bank.questions` cədvəli sualların hazırlanma bankıdır və saxlanacaq. İlk sınaqda bu bankdan son baxışa hazır suallar istifadə edilə bilər. İctimai yayımdan əvvəl ayrıca yayım təsdiqi və təsdiqlənmiş sual versiyası saxlanmalıdır.

| Yeni məlumat qrupu | Saxlanacaq əsas məlumat |
|---|---|
| İstifadəçilər və giriş sessiyaları | Hesab, istifadəçi adı, təhlükəsiz giriş məlumatları |
| Profil | Avatar, XP, səviyyə |
| Kateqoriyalar və oyun sualları | Kateqoriya, sual versiyası, istifadə üçün təsdiq |
| Oyunlar | Rejim, mərhələ, vəziyyət, başlanğıc və son |
| Oyun iştirakçıları | İki duel iştirakçısı və ya solo oyunçu |
| Oyunda verilən suallar | Ardıcıllıq, sualın sabit nüsxəsi, variant sırası, son vaxt |
| Cavablar | Seçilmiş variant, serverin qəbul vaxtı, düzgünlük və xal |
| Nəticə və XP əməliyyatları | Yekun nəticə, təkrar yazılmadan qorunan XP artımı |
| Statistika | Düzgün cavab faizi, qələbələr, məğlubiyyətlər |
| Sual şikayətləri | İstifadəçinin bildirdiyi yanlışlıq və baxış vəziyyəti |

Oyun başladıqdan sonra sual redaktə edilərsə, həmin oyunun saxlanmış sual nüsxəsi dəyişməyəcək. Bir iştirakçı eyni oyun sualına yalnız bir cavab qeydi yarada biləcək.

## 8. Server əlaqələri və canlı oyun

Adi server sorğuları giriş, profil, solo oyunun başlanması, cavabın göndərilməsi, oyun tarixçəsi və reytinq üçün istifadə olunacaq. Təklif olunan qruplar: `/auth`, `/me`, `/solo`, `/matches`, `/leaderboard`, `/question-reports`. Oyunçu üçün kateqoriya seçimi əlaqəsi nəzərdə tutulmur.

Canlı duelin hadisələri rəqib axtarışına qoşulmaq/çıxmaq, otaq yaratmaq/qoşulmaq, oyuna hazır olmaq, sualı açmaq, cavabı qəbul etmək, sualı yekunlaşdırmaq, əlavə mərhələni başlatmaq və nəticəni göndərməkdən ibarət olacaq.

Oyun vəziyyətləri: rəqib gözlənilir → oyunçular hazırdır → geri sayım → sual açıqdır → sual yekunlaşır → növbəti sual və ya əlavə mərhələ → oyun bitib.

Server hər sual üçün vahid son vaxt saxlayacaq. Telefon sadəcə həmin vaxta görə geri sayımı göstərəcək. Cavab göndərildikdən sonra istifadəçi bağlantını itirsə, yenidən qoşulanda serverdən cari vəziyyəti alacaq.

İstifadəçi bağlantı/çıxış qaydasını müəyyənləşdirməyi agentə həvalə edib. İlk sınaq üçün qərar:

- Duel serverdə başlayandan sonra bağlantı kəsilərsə, oyun üzrə cəmi 20 saniyə yenidən qoşulma vaxtı verilir. Sual saatı və qarşılaşma dayanmır. Təkrar kəsilmələr həmin büdcədən istifadə edir; hər dəfə yeni 20 saniyə verilmir.
- Bu müddətdə geri qayıdan oyunçu cari sual, hesab və qalan vaxtla davam edir. Artıq qəbul edilmiş cavab silinmir, keçmiş sual yenidən cavablandırılmır. Müddət bitdikdə bağlantısı kəsilən iştirakçı texniki məğlub sayılır; tək qalan rəqibə süni düzgün cavab və əlavə sual xalı verilmir.
- İstifadəçi “Oyundan çıx” seçərsə, məğlubiyyət barədə aydın xəbərdarlıq və təsdiq göstərilir. Təsdiqlənmiş çıxış adi duel məğlubiyyəti kimi hesablanır, ayrıca daha böyük cərimə əlavə edilmir. Tətbiqin qəfil bağlanması isə əvvəlcə bağlantı kəsilməsi qaydasına düşür.
- Oyun serverdə başlamayıbsa, axtarışdan və otaqdan çıxmağa cərimə yoxdur.
- Server nasazlığına görə yekunlaşdırıla bilməyən duel ləğv edilir; həmin oyuna aid yarış nəticəsi, rank artımı/azalması və qələbə/məğlubiyyət statistikası yazılmır. Qismən xal da saxlanmır. Nəticə bir dəfə yekunlaşdırılır; sonradan bərpa olunan bağlantı ikinci nəticə yaratmır.
- Hər iki oyunçu çıxarsa və ya geri qoşulma müddətini aşarsa, pulsuz qələbə verilmir. Server işləkdirsə, nəticə hər iki iştirakçı üçün texniki məğlubiyyət və hərəsinə −25 duel rank xalı kimi qeydə alınır. Minimum rank xalı 0-dır. Dost dueli ranka təsir etmir. Server nasazlığı ilə yarımçıq qalan oyunlar bu cəriməyə daxil deyil.
- Solo oyunda bağlantı kəsiləndə keçmiş sualı yenidən açmaqla səhv cavabı silmək mümkün olmayacaq. Serverdə qəbul edilmiş cavablar və vaxtlar saxlanır. İstifadəçi oyunu bağlayarsa, tamamlanmış sualların rank dəyişikliyi saxlanır, verilməmiş/cavabsız suallardan rank çıxılmır. Server nasazlığına görə ləğv edilən solo oyun ranka təsir etmir. Bu qayda mənfi nəticəni oyunu bağlamaqla ləğv etməyin qarşısını alır.

20 saniyə bağlantı büdcəsi sınaq nəticələrinə görə tənzimlənə bilər. Adi məğlubiyyət və texniki məğlubiyyət hərəsi −25 duel rank xalı verir; rəqibin qələbəsi +25-dir. Bərabərlikdə əlavə mərhələ davam etdiyi müddətdə duel rankı yazılmır; əlavə suallar ayrıca rank qazandırmır. Yalnız yekun nəticə bir dəfə hesablanır. Hər oyunçunun yeni rankı əvvəlki rank xalı ilə dəyişikliyin cəminin ən azı 0-a bərabər saxlanması ilə tapılır.

## 9. Sualların seçilməsi və sonradan artırılması

Hər oyunda eyni sual təkrarlanmayacaq. Suallar müxtəlif kateqoriyalardan seçiləcək. Eyni obyekt haqqında fərqli sualların bir oyunda yığılmaması üçün əlavə mövzu işarələri lazım olacaq; mövcud kateqoriya sahəsi bu işi təkbaşına tam həll etmir.

Bankda orta və çətin suallar çoxdur. Sınaq oyunlarının bölgüsü bunu nəzərə almalıdır; 205 asan sualdan böyük sayda asan oyun yaratmaq təkrar hissini tez artırar. İlk oyunların sual tərkibi sınaq nəticəsinə görə tənzimlənəcək.

Yeni sual yolu: müəllif hazırlayır → mənbə/həll yoxlanır → təkrar yoxlanır → istifadəçi son baxış edir → yayım üçün təsdiqlənir. Gələcək avtomatik hazırlama və istifadəçi sualları eyni təsdiq yolundan keçəcək. Sınaq nəticələri sualın cavab faizini və cavab müddətini ölçərək çətinlik düzəlişinə kömək edəcək.

## 10. Hazırlama mərhələləri və tamamlanma meyarları

1. **Üç əsas ekranın dizaynı.** Ana səhifə, sual və duel ekranları eyni vizual üslubda; uzun Azərbaycan mətnləri və kiçik telefon ölçüsü yoxlanmış olmalıdır.
2. **Mobil layihə və server əsası.** Expo Go-da Android və iPhone üzərində açılan layihə, təhlükəsiz giriş və mövcud sual bankına server bağlantısı olmalıdır. SDK və kitabxanalar Expo Go ilə uyğun, oyun serveri hər iki telefondan əlçatan olmalıdır. Bu mərhələ ayrıca App Store/Google Play tətbiq yığımı hesab edilmir.
3. **Tam solo oyun.** İstifadəçi 10 sualı cavablandırmalı; nəticə və statistika serverdə düzgün saxlanmalı; vaxtı bitmiş və iki dəfə göndərilmiş cavab yoxlanmalıdır.
4. **Real iki telefon arasında duel.** Android və iPhone arasında eyni suallar və variantlar, vahid vaxt, qəbul edilmiş cavabın bərpası, 3 suallıq təkrarlanan əlavə mərhələ işləməlidir. Bir telefonda iki ekran göstərilməsi bu mərhələnin sınağını əvəz etmir.
5. **Profil, reytinq və sınaq buraxılışı.** Nəticələr profilə və reytinqə uyğun düşməli; ikiqat XP yazılması və yarımçıq oyundan yanlış məğlubiyyət yaranması yoxlanmalıdır.
6. **Sınaq nəticələrinə əsasən düzəliş və bankın artırılması.** Sonra qalan suallar hazırlanacaq və yayım planı tamamlanacaq.

Əsas ilk nəticə: Android və iPhone-da açılan, mövcud suallardan istifadə edən, 10 suallıq solo oyunu və iki platforma arasında real dueli başdan sona işlədən versiya.

## 11. Kodlamadan əvvəl açıq qalan qərarlar

- Rank sərhədləri üçün aşağıdakı nümunə təqdim edilib; hələ istifadəçi tərəfindən yekun cədvəl kimi qəbul edilməyib. Duel rankının nəticəyə görə hesablanması istifadəçinin həvaləsi ilə seçilib. Solo/duel ayrılığı və alt pillələrin olması qəbul edilib.
- E-poçt təsdiqi və şifrə bərpasının ekranları. Qonağın qeydiyyatdan sonra rəsmi reytinqə daxil olması, nəticələrinin həmin hesaba saxlanması və dost duellərinin ranka təsir etməməsi qəbul edilib.
- Onlayn/offlayn əhatə: ranka təsir edən solo oyunun server yoxlaması; internet olmadan məşqin olub-olmaması. Bu məşq ayrıca oyun rejimi kimi avtomatik əlavə edilmir.
- Əlavə 3 sualın çətinlik bölgüsü. Əsas 10 sualın bölgüsü və vaxtları müəyyənləşdirilib. Variant seçilməyən sualın rank cəriməsi yoxdur.
- Rəqib axtarışının gözləmə həddi. Yaxın duel rankına görə seçim və otaq kodu qəbul edilib. Eyni oyunda fərqli oyunçu ranklarına görə fərqli sual verilməyəcək.
- Bağlantı/çıxış qaydası və məğlubiyyətin −25 duel rank xalı yuxarıda müəyyənləşdirilib.
- Hər iki platformanın ilk sınağı və iPhone-da Expo Go seçimi qəbul edilib. Mobil texnologiya Expo/React Native/TypeScript olacaq; şəxsi Mac ilkin Expo Go sınağı üçün maneə deyil. Quraşdırmada Expo hesabı, cihaz SDK uyğunluğu və serverə şəbəkə çıxışı yoxlanacaq. Sualların təsdiqi/şikayət baxışı üçün idarəçi prosesi və sonrakı yayımda server yerləşdirməsi də hazırlanmalıdır.

Əlavə ilkin seçimlər: ranklı solo və duel onlayn işləsin; əlavə 3 sual 2 orta + 1 çətin olsun; rəqib axtarışı 60 saniyədə nəticə verməzsə, yenidən axtarmaq və solo oynamaq təklif edilsin. Bunlar əvvəlki cavabda təqdim edilmiş ilkin plan seçimləridir, ayrıca təsdiqlənmiş tələb kimi göstərilmir.

Bu siyahı qərarların tamamlandığını göstərmir. Söhbətdə qəbul edilən seçimlər plana əlavə olunacaq; tətbiq, baza strukturu və sual bankına dəyişiklik ayrıca hazırlama mərhələsində ediləcək.

## 12. Növbəti müzakirə və dizayn addımı

Rank xal sərhədlərinin aşağıdakı nümunəsi müzakirə ediləcək. Qonaq/rəsmi reytinq və dost duelinin ranka təsir etməməsi artıq qəbul edilib. Sonra kateqoriyasız Studiya ana səhifəsi, iki ayrı rank göstəricisi, nəticə/rank yüksəlişi və giriş ekranları vizual olaraq hazırlanacaq. Kodlamaya istifadəçi həmin mərhələyə keçmək istəyəndə başlanacaq.

## 13. Orta temp üçün rank pillələri — nümunə təklif

İstifadəçi hər alt pillə üçün 0–100 xal göstəricisi və çox asan/çətin olmayan sistem istəyir. Təklif: başlanğıc alt pillələr 100 real rank xalı tələb etsin; yuxarı ranklarda tələb artsın. Ekrandakı irəliləyiş çubuğu 0–100% göstərsin. Faiz real rank xalı kimi təqdim edilməsin; məsələn, Alim pilləsində +40 rank xalı 200 xallıq pillənin 20%-nə bərabərdir. Hər iki rejim eyni pillə adları/sərhədlərindən istifadə edə bilər, lakin ayrı xal və oyun tarixçəsi saxlayır.

| Rank | III başlanğıcı | II başlanğıcı | I başlanğıcı | Bu rankda növbəti alt pilləyə tələb |
|---|---:|---:|---:|---:|
| Şagird | 0 | 100 | 200 | 100 |
| Tədqiqatçı | 300 | 450 | 600 | 150 |
| Alim | 750 | 950 | 1150 | 200 |
| Müdrik | 1350 | 1600 | 1850 | 250 |
| Əllamə | 2100 | 2400 | 2700 | 300; I son pillədir |

Yüksəliş III → II → I → növbəti rankın III pilləsi istiqamətindədir. Yuxarı ranka keçəndə artıq xal itmir. Xal sərhəddən aşağı düşəndə uyğun əvvəlki pillə göstərilir; minimum xal 0, başlanğıc Şagird III-dür. Əllamə I-dən sonra yeni pillə açılmır; ümumi rank xalı artıb azala bilər, ekranda növbəti pillə çubuğu əvəzinə son rank və ümumi xal göstərilir.

Solo nümunəsi: 2 asan düzgün, 4 orta düzgün/1 orta səhv, 1 çətin düzgün/2 çətin səhv — 7 düzgün cavab, 170 yarış xalı, +40 solo rank xalı. Eyni nəticəni təkrar göstərən oyunçu 100 xallıq pilləni sıfırdan 3 oyunda, 200 xallıq pilləni 5 oyunda, 300 xallıq pilləni 8 oyunda keçir. Bu, hesablama nümunəsidir, real oyunçu tempi proqnozu deyil. Hər yarışda bütün sualları cavablandırmaq şərti ilə 7 düzgün cavabın rank artımı çətinlik bölgüsündən asılı olaraq +35…+58, 10 düzgün cavabın artımı +86-dır. Cavabsız sualların rank təsiri 0 olaraq qalır.

Duel nümunəsi: bərabər ranklı təsadüfi rəqiblərə qarşı +25 qələbə/−25 məğlubiyyət seçilib; qalibin yüksəlişi nəticəni göstərir. Sıfırdan 4 qələbə 100 rank xalı verir. 3 qələbə və 1 məğlubiyyət, minimum 0 sərhədinə toxunulmadıqda, +50 xaldır. Hər dueldə əvvəl sual cavablarından yarış xalı hesablanır; duel bitəndə ayrıca bir dəfə rank dəyişikliyi tətbiq olunur. Bu modelin solo ilə eyni sürətdə yüksəliş verdiyi iddia edilmir; hər ikisinin tempi real sınaqda ayrıca qiymətləndiriləcək.

Cədvəl ilkin balans təklifidir. İstifadəçi tərəfindən qəbuldan və sınaqdan əvvəl bazaya və tətbiqə tətbiq edilmir.

## 14. Tamamlanmış studiya dizayn baxışı — 6 oktyabr 2026

İstifadəçi əvvəlki göy-qızılı studiya üslubunu saxlayıb; alternativ sadə dizaynı rədd edib və ona aid fayllar silinib. Qalan əsas və köməkçi ekranların vizual nümunələri hazırlanıb. Yekun baxış qovluğu: `output/design/son-dizayn-2026-10-05`. `BAXIS.html` bütün şəkilləri ardıcıl göstərir; 14 lövhədə 41 ekran və vəziyyət var. Dəst giriş/bərpa, ana səhifə və ayrı ranklar, solo, duel/otaq/əlavə mərhələ/nəticə, profil/tarixçə, tənzimləmələr, sual bildirişi, dəstək, reytinq və bağlantı/çıxış/rank dəyişməsi vəziyyətlərini əhatə edir.

Şəkillər daxili imagegen aləti ilə hazırlanıb, tətbiq kodu yazılmayıb. Solo nəticəsi 40 + 100 + 30 = 170 yarış xalı və +40 solo rank xalı olaraq düzəldilib. İstifadəçi adları, hesab və statistika nümunədir; fərqli nəticə şəkilləri ayrı nümunə oyunları göstərir. Qalan ekranların yekun istifadəçi baxışı hələ gözlənilir. Məxfilik/şərtlər mətnləri və hesab silmə axını yayım hazırlığında ayrıca işlənəcək.
