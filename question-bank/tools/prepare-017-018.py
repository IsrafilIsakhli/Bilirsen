import json
from pathlib import Path
from collections import Counter
from fractions import Fraction
from itertools import permutations
from functools import lru_cache

root = Path(__file__).resolve().parent.parent
new_sources = [
 ('THE17','https://whc.unesco.org/en/list/87/','UNESCO — Qədim Teb','Amon; Nilin iki sahili; Karnak və Luksor; nekropollar'),
 ('MAM17','https://whc.unesco.org/en/list/150/','UNESCO — Mamont mağarası','Kentukki; əhəngdaşı; ən uzun mağara sistemi'),
 ('BLE17','https://whc.unesco.org/en/list/425/','UNESCO — Blenheym sarayı','Con Çörçill; Lanselot Braun; Oksford yaxınlığı'),
 ('PER17','https://whc.unesco.org/en/list/114/','UNESCO — Persepol','Əhəmənilər; I Dara; yarı təbii, yarı süni terras'),
 ('SER17','https://whc.unesco.org/en/list/156/','UNESCO — Serengeti','Savanna; otlaq və su axtarışı; sürüləri izləyən yırtıcılar'),
 ('KAH17','https://whc.unesco.org/en/list/137/','UNESCO — Kahuzi-Bieqa Milli Parkı','Sönmüş vulkanlar; şərq düzənlik qorillası; Konqo DR'),
 ('BAM17','https://whc.unesco.org/en/list/208/','UNESCO — Bamiyan vadisi','Əfqanıstan; qaya oyuqları; Qandhara məktəbi'),
 ('SYD17','https://whc.unesco.org/en/list/166/','UNESCO — Sidney Opera Teatrı','Utzon; qabıqvari dam; limana uzanan yarımada'),
 ('TIT17','https://science.nasa.gov/saturn/moons/titan/facts/','NASA — Titan haqqında faktlar','Metan və etan; azot atmosferi; karbohidrogen qum dənələri'),
 ('ENC17','https://science.nasa.gov/saturn/moons/enceladus/','NASA — Enselad','Buz və su şırnaqları; E halqası; pələng zolaqları'),
 ('IO17','https://science.nasa.gov/jupiter/moons/io/','NASA — İo','Vulkanik aktivlik; cazibə dartışması; Voyacer 1'),
 ('GAN17','https://science.nasa.gov/jupiter/moons/ganymede/','NASA — Qanimed','Öz maqnit sahəsi; Merkuridən böyük ölçü; dəmir nüvə'),
 ('SVP17','https://www.preslib.az/az/book/1VBti28NBDJeuM8','Prezident Kitabxanası — Səməd Vurğunun dramları','Vaqif; Fərhad və Şirin; İnsan — kitab annotasiyası'),
 ('SVB17','https://science.gov.az/az/forms/skonchavshiesya-deystvitelnyie-chlenyi/3435','AMEA — Səməd Vurğunun bioqrafiyası','Vəkilov soyadı; Qazaxın Yuxarı Salahlı kəndi'),
 ('MC17','https://anl.az/el/Kitab/2017/12/2014-2250.pdf','Milli Kitabxana — Mir Cəlalın bioqrafik məlumatı','İndekslənmiş bioqrafik hissə: ilk roman Dirilən adam; Bir gəncin manifesti'),
 ('MCS17','https://www.anl.az/down/meqale/525/2017/iyul/550980.htm','Milli Kitabxana — Mir Cəlalın satirik yaradıcılığı','İclas qurusu — satirik-yumoristik əsərlər siyahısı'),
 ('ARN17','https://www.nationalgallery.org.uk/paintings/jan-van-eyck-the-arnolfini-portrait','National Gallery — Arnolfini portreti','Qabarıq güzgüdə iki əlavə fiqur; imza; bahalı portağallar'),
 ('HOP17','https://archive.artic.edu/hopper/artwork/111628?from=193530','Çikaqo İncəsənət İnstitutu — Gecə quşları','Edvard Hopper; girişin göstərilməməsi; üç müştəri'),
 ('MTS18','https://www.nhm.ac.uk/discover/mantis-shrimps.html','Natural History Museum — Mantis krevetləri','Xərçəngkimilər; kavitasiya; müstəqil göz hərəkəti'),
 ('NMR18','https://www.nationalzoo.si.edu/animals/naked-mole-rat','Smithsonian — Çılpaq köstəbək siçanı','Kəsici diş arxasında dodaqlar; kraliça; istilik üçün yığışma'),
 ('OKA18','https://animals.sandiegozoo.org/animals/okapi','San Diego Zoo — Okapi','Zürafə ilə qohumluq; tutucu dil; suyu sürüşdürən yağlı xəz'),
 ('PFR18','https://www.nationalzoo.si.edu/animals/poison-frogs','Smithsonian — Zəhərli ox qurbağaları','Qida ilə toksiklik əlaqəsi; balalara yumurta; yapışqan dil'),
 ('WOM18','https://australiazoo.com.au/wildlife/our-animals/common-wombat/','Australia Zoo — Vombat','Arxaya açılan kisə; arxa qığırdaq lövhə; gecə otlama'),
 ('YEA18','https://annex.exploratorium.edu/cooking/bread/bread_science.html','Exploratorium — Çörəyin elmi','Birhüceyrəli maya; karbon qazı; qabartma tozundan fərq'),
 ('GLU18','https://annex.exploratorium.edu/cooking/bread/activity-gluten.html','Exploratorium — Qlütenin quruluşu','Qaz saxlama; yağın qlüten inkişafına maneəsi'),
 ('MAI18','https://cen.acs.org/articles/90/i40/Maillard-Reaction-Turns-100.html','ACS — Mayyar reaksiyası','Şəkərlə amin qruplarının reaksiyası; rəng və ətir'),
 ('MAC18','https://www.acs.org/acs-webinars/library/tasty-culinary-chemistry.html','ACS — Mətbəx kimyası','Şəkərin karamelləşməsi ilə Mayyar reaksiyasının ayrı proseslər olması'),
 ('EMU18','https://www.chem.ucla.edu/~harding/IGOC/E/emulsion.html','UCLA — Emulsiya lüğəti','Mayonez suda yağ emulsiya nümunəsidir'),
 ('EMX18','https://annex.exploratorium.edu/cooking/eggs/hollandaise-pop.html','Exploratorium — Emulqatorun fəaliyyəti','Lesitin; molekulun susevər və yağsevər hissələri'),
 ('SAB18','https://www.anl.az/down/m.e.sabir.pdf','Milli Kitabxana — Mirzə Ələkbər Sabir','Hophopnamə — şeir toplusu; bioqrafik giriş'),
 ('SAH18','https://anl.az/down/teqvim-2017.pdf','Milli Kitabxana — 2017 ədəbiyyat təqvimi','Sabir bölməsi: Hop-hop imzası; vəfatdan sonrakı nəşr'),
 ('SAP18','https://www.anl.az/el/s/mes_h1.pdf','Milli Kitabxana — Hophopnamə nəşr qeydləri','Abbas Səhhətin müqəddiməsi — nəşrin izah hissəsi'),
 ('ANA18','https://www.qanun.az/huseyn-cavid-2356','Qanun nəşriyyatı — Hüseyn Cavidin Ana əsəri','Səlma; Qanpolad; Muradın ana evinə sığınması'),
 ('OPP18','https://www.moma.org/collection/works/80997?sov_referrer=theme','MoMA — Meret Oppenheymin Obyekt əsəri','Xəzli çay dəsti; sürrealizm; Pikasso ilə söhbət'),
 ('SEU18','https://archive.artic.edu/irvingpennarchives/pointillism/','Çikaqo İncəsənət İnstitutu — Puantilizm','Söra; rəng nöqtələri; La-Qrand-Jatt Sena adası'),
 ('SNO18','https://wpbsa.com/wp-content/uploads/2198_WPBSA-Rulebook-2024-25.pdf','WPBSA — Snukerin rəsmi qaydaları','Section 2 Rule 8; Section 3 Rule 1: breyk, top qiymətləri, ardıcıllıq'),
 ('HOC18','https://www.fih.hockey/static-assets/pdf/fih-Rules-of-hockey-2026-final.pdf','FIH — Otüstü hokkey qaydaları, 2026','2.1; 8.1; 9.5: oyunçu sayı, qol dairəsi, dəyənəyin arxası'),
]

sources_path = root/'sources.json'
sources = json.loads(sources_path.read_text(encoding='utf-8'))
for key, url, title, section in new_sources:
    value = dict(url=url, title=title, section=section)
    assert key not in sources or sources[key] == value, key
    sources[key] = value
sources_path.write_text(json.dumps(sources, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

replacements = {
 'Kəpəb iliti ləqəbi ilə tanınan bağ memarı':'bağ memarı',
 'verən, bağ memarı':'verən məşhur bağ memarı',
 '|Amonun|Poseydonun|Apollonun|Mardukun|':'|Amonun|Ptahın|Horusun|Setin|',
 'Sö ranın':'Söranın', 'Jorj Sö ra':'Jorj Söra', 'Pu antilizm':'Puantilizm',
 'Sö ra;':'Söra;',
 'heyvanları':'heyvanları',
 'Dəniz suyunu şirin suya çevirməsi ilə|Zərbə zamanı uzun zəhərli iynə atması ilə|Ətrafdakı suyu maqnitlə çəkməsi ilə':'Suda yayılan zəhərli ifrazatı ilə|Zərbədən sonra ova dolanan uzun qolları ilə|Ovu özünə çəkən güclü su axını ilə',
 'Başdan ayrılaraq üzə bilir|Yalnız ağız açıq olanda hərəkət edir':'Yalnız baş dönəndə istiqamət dəyişir|Yalnız bədən şaquli olanda hərəkət edir',
 'Qidanı tükləri arasında gizlətmək|Balalara uçmağı öyrətmək|Tuneldəki işığı artırmaq':'Qidanı növbə ilə bölüşmək|Tunelin divarını sıxlaşdırmaq|Ərazi sərhədini işarələmək',
 'Balası ananın quyruğunu yesin deyə|Bala yalnız arxaya baxa bildiyi üçün|Kisə bədənə hava toplasın deyə':'Qaçanda hava müqavimətini azaltsın deyə|Balaya daha çox günəş işığı düşsün deyə|Kisə həmişə su ilə dolu qalsın deyə',
 'Bütün suyu dərhal buxarlandırmaq|Mayaya günəş işığı vermək|Duz kristallarını maqnitlə toplamaq':'Mayalanma üçün əsas şəkəri istehsal etmək|Xəmirə turş dad verən maddəni yaratmaq|Pişirmədən xəmirin bütün suyunu çıxarmaq',
 'Qlüteni tamamilə şəkərə çevirir|Qlüten zəncirlərini həmişə ikiqat uzadır|Un zülallarını dəmirə çevirir':'Mayanın buraxdığı qazı birbaşa zülala çevirir|Qlüten torunun daha möhkəm qurulmasını sürətləndirir|Un zülallarının suyu daha çox tutmasını təmin edir',
 'Hər iki hissəsinin yalnız havaya meyilli olması|Bütün molekullarının bərk kristal yaratması|Suyu tamamilə qaz halına çevirməsi':'Bütün molekulun yalnız yağa meyilli olması|Bütün molekulun yalnız suya meyilli olması|Yağ damcılarının iri təbəqədə birləşməsini sürətləndirməsi',
 'İki qabdakı yad mayenin miqdarı bərabərdir':'Süd qabındakı qəhvə ilə qəhvə qabındakı süd bərabərdir',
 'Nəticə yalnız qarışdırma vaxtından asılıdır':'Nəticə yalnız ilk qaşığın həcmindən asılıdır',
}
for filename in ['batch-017.txt','batch-018.txt']:
    p = root/'batches'/filename
    text = p.read_text(encoding='utf-8')
    for a, b in replacements.items():
        text = text.replace(a, b)
    p.write_text(text, encoding='utf-8')

# Independent derivations for the five reasoning questions and the snooker score.
@lru_cache(None)
def final_colours(red, blue):
    if red+blue == 1:
        return frozenset(['qırmızı' if red else 'mavi'])
    results = set()
    if red >= 2:
        results.update(final_colours(red-2, blue+1))
    if blue >= 2:
        results.update(final_colours(red, blue-1))
    if red and blue:
        results.update(final_colours(red, blue-1))
    return frozenset(results)
assert final_colours(5, 6) == {'qırmızı'}
letter_permutations = list(permutations(range(3)))
derangements = sum(all(i != p[i] for i in range(3)) for p in letter_permutations)
assert Fraction(derangements, len(letter_permutations)) == Fraction(1,3)
volume, spoon = Fraction(100), Fraction(10)
coffee_left_in_milk = spoon-spoon*spoon/(volume+spoon)
milk_in_coffee = spoon*volume/(volume+spoon)
assert coffee_left_in_milk == milk_in_coffee
assert 15*8+sum(range(2,8)) == 147
assert 6*4-1 == 23
assert round(100/(2*3.14)) == 16

new_rows = []
for filename in ['batch-017.txt','batch-018.txt']:
    rows = [line.split('|') for line in (root/'batches'/filename).read_text(encoding='utf-8').splitlines() if line.strip()]
    assert len(rows) == 50, (filename, len(rows))
    assert all(len(row)==10 and all(row) and row[8] in sources for row in rows)
    new_rows.extend(rows)
assert len({row[2] for row in new_rows}) == 100
review = dict(checkedAt='2026-10-05', newQuestions=100,
             newByDifficulty=dict(Counter(row[1] for row in new_rows)),
             newByCategory=dict(Counter(row[0] for row in new_rows)),
             notes=[
               'Əvvəlki 750 sualın mövzu və fakt açarları ilə müqayisə edildi. Eyni faktın tərsinə soruşulmasına yol verilmədi.',
               'Çətinlik ilkin redaktə qiymətləndirməsidir; oyunçu sınağı aparılmayıb.',
               'Göz reseptorları sayı, qorilla populyasiyası, mağara uzunluğu və mübahisəli müəllif identifikasiyası kimi dəyişən və ya qeyri-müəyyən iddialar soruşulmadı.',
               'Oppenheym əsərində xəzin hansı heyvana aidliyi soruşulmadı; muzey materiallarında sonradan dəyişən identifikasiyaya əsaslanılmadı.',
               'Saturn peykləri haqqında həyatın mövcudluğu iddia edilmir. Qanimed müqayisəsi diametrə aiddir.',
               'Sabirin doğum gününə dair mənbə uyğunsuzluğu səbəbindən tarix sualı yazılmadı.',
               'Mir Cəlal və Sabir PDF mətnlərinin kitabxana tərəfindən indekslənmiş hissələri istifadə edildi; tam PDF yüklənməsi təsdiqlənmir.',
               'Beş məntiq həlli ayrıca hesablandı; daş oyununun bütün mümkün son rəngləri rekursiv yoxlandı.',
               'Otüstü hokkey üçün qüvvədə olan mart 2026 qaydası istifadə edildi; noyabrda qüvvəyə minəcək mətn əvəzləyici seçilmədi.'
             ])
(root/'qa/review-017-018.json').write_text(json.dumps(review, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
(root/'qa/sources-017-018.json').write_text(json.dumps({key:sources[key] for key,*_ in new_sources}, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
(root/'qa/derivation-checks-017-018.json').write_text(json.dumps(dict(chocolate_breaks=23, rope_radius_cm=100/(2*3.14), possible_final_stones=list(final_colours(5,6)), coffee_and_milk_equal=coffee_left_in_milk==milk_in_coffee, derangements=derangements, permutations=len(letter_permutations), snooker_break=147), ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
manifest_path = root/'reviewed-batches.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
for filename in ['batch-017.txt','batch-018.txt']:
    manifest[filename] = dict(reviewed=True, checkedAt='2026-10-05')
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps(review, ensure_ascii=False))
