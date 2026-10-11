# Azərbaycan Quiz — sual bankı

Hədəf: 10.000 müxtəlif sual. Yenilənmiş çətinlik bölgüsü: 2.000 asan, 5.000 orta, 3.000 çətin. Bütün oyun mətnləri Azərbaycan dilindədir.

`data/questions.jsonl` əsas iş faylıdır. Hər sətir ayrıca sualdır. `batches` qovluğundakı mətnlər müəllifin hazırladığı hissələrdir; boş yerlər və avtomatik say artıran şablonlar sual kimi sayılmır. `progress.json` yalnız faktiki yazılmış suallardan hesablanır.

Bazadakı yer: `quiz_az → question_bank → questions`. Excel baxış faylı `outputs/01a10932-ea68-7a01-b9cb-b7de3ae9ca73/sual-banki.xlsx` ünvanındadır. Fayllar, Excel və baza arasında 1950 qeydin bütün məlumatları tutuşdurulub. Əvvəlki 1850 sual dəyişməyib.

Hər sualda dörd fərqli variant, bir düzgün cavab, kateqoriya, ilkin çətinlik, mənbə və soruşulan faktın açarı saxlanır. Düzgün cavabların variantlardakı mövqeləri qarışdırılır. Mənbə və daxili yoxlama qeydləri oyunçuya göstərilmir.

Eyni faktın tərsinə soruşulması da təkrar sayılır. Eyni obyekt haqqında fərqli faktlar ayrıca ola bilər, lakin onlar eyni on suallıq oyunda ardıcıl verilməməlidir. Oxşar mətnlər avtomatik namizəd kimi ayrılır və məna baxımından ayrıca yoxlanır; avtomatik yoxlama təkbaşına məna təkrarının olmadığını sübut etmir.

Mənbə yoxlaması: düzgün cavabı mənbənin göstərilən hissəsi ilə tutuşdurmaq, digər variantların da doğru olmamasını yoxlamaq, zamanla dəyişən faktları çıxarmaq. Məntiq və hesablama suallarında mənbə əvəzinə həll ayrıca saxlanır.

Çətinlik ilkin redaktə qiymətləndirməsidir. Oyunçularla sınaq aparılmayıb; sonradan düzgün cavab faizi əsasında uyğunlaşdırılacaq. `review_ready` istifadəçinin son baxışına təqdim olunan hissədir, avtomatik yayım təsdiqi deyil.

Planlaşdırılan mövzu bölgüsü:

| Mövzu | Hədəf |
|---|---:|
| Azərbaycan | 2.000 |
| Dünya və coğrafiya | 1.300 |
| Tarix və sivilizasiyalar | 1.200 |
| Elm və kosmos | 1.500 |
| Təbiət və canlılar | 1.000 |
| İncəsənət və ədəbiyyat | 1.000 |
| Texnologiya və ixtiralar | 600 |
| İdman və oyunlar | 600 |
| Gündəlik həyat | 400 |
| Məntiq və düşünmə | 400 |

Bank tam hazır olmadan 10.000 sual tamamlanmış kimi göstərilməyəcək. Yazılmış, yoxlanmış və bazaya köçürülmüş saylar ayrıca göstərilir.
