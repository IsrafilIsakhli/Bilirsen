import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
source_file = root/'sources.json'
sources = json.loads(source_file.read_text(encoding='utf-8'))
backup = root/'qa/previous-sources-1850.json'
if not backup.exists():
    backup.write_text(json.dumps(sources, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
new = {
 'EZAZFLAG': ('https://president.az/az/pages/view/azerbaijan/symbols','Azərbaycan Prezidentinin rəsmi səhifəsi — Dövlət rəmzləri','Dövlət Bayrağı: rənglər, aypara, bayraq günü'),
 'EZAZBASIC': ('https://azerbaijan.travel/practical-information','Azərbaycan Turizm Bürosu — Praktik məlumat','Money; Public Transportation'),
 'EZNOVRUZ': ('https://azerbaijan.travel/bayram-ovqati-yaradan-novruz-tedbirleri','Azərbaycan Turizm Bürosu — Novruz tədbirləri','Yazın gəlişi, dörd çərşənbə və adətlər'),
 'EZPAKHLAVA': ('https://azerbaijan.travel/pakhlava','Azərbaycan Turizm Bürosu — Paxlava','Klassik paxlava resepti və romb dilimlər'),
 'EZSHEKER': ('https://azerbaijan.travel/shekerbura','Azərbaycan Turizm Bürosu — Şəkərbura','İçlik: üyüdülmüş çərəz və şəkər'),
 'EZJAPAN': ('https://web-japan.org/kidsweb/explore/basic/index.html','Yaponiya XİN / Kids Web Japan — Əsas faktlar','Capital; Unit of currency'),
 'EZJAPANFLAG': ('https://web-japan.org/kidsweb/explore/national/index.html','Yaponiya XİN / Kids Web Japan — Bayraq və himn','Hinomaru və Günəş diski'),
 'EZFUJI': ('https://web-japan.org/atlas/nature/nat06.html','Yaponiya XİN / Japan Atlas — Fudzi','Yaponiyanın ən yüksək zirvəsi'),
 'EZJAPANGEO': ('https://www.mofa.go.jp/territory/page1we_000006.html','Yaponiya Xarici İşlər Nazirliyi — Yaponiya ərazisi','Location: Şərqi Asiya'),
 'EZCANADAREG': ('https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/discover-canada/read-online/canadas-regions.html','Kanada hökuməti — Kanadanın regionları','Ottava; ABŞ ilə cənub sərhədi'),
 'EZCANADASYM': ('https://www.canada.ca/en/canadian-heritage/services/official-symbols-canada.html','Kanada hökuməti — Rəsmi rəmzlər','The national flag; The maple tree'),
 'EZCANADALANG': ('https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/discover-canada/read-online/canadian-symbols.html','Kanada hökuməti — Kanada rəmzləri','Canada’s Official Languages'),
 'EZAUSCAP': ('https://www.australia.com/en-us/facts-and-planning/about-australia/cities-states-and-territories.html','Tourism Australia — Ştatlar, ərazilər və paytaxtlar','Australian Capital Territory: Canberra'),
 'EZAUSBASIC': ('https://www.australia.com/en/facts-and-planning/about-australia/key-facts-about-australia.html','Tourism Australia — Avstraliya haqqında əsas faktlar','Cənub yarımkürəsi və əks fəsillər'),
 'EZAUSARMS': ('https://www.dfat.gov.au/sites/default/files/australia-in-brief-2021.pdf','Avstraliya XİN — Australia in Brief','Dövlət rəmzləri: gerbdə kenquru və emu'),
 'EZAUSFACT': ('https://www.dfat.gov.au/sites/default/files/our-indo-pacific-community-3-4-country-fact-files.pdf','Avstraliya XİN — Ölkə məlumatları','Australia: Geography — Tasmania'),
 'EZHEART': ('https://www.nhlbi.nih.gov/health/heart','NIH / NHLBI — Ürək necə işləyir','Ürəyin qanı pompalaması; qanın oksigen və qida daşıması'),
 'EZHEARTANAT': ('https://www.nhlbi.nih.gov/health/heart/anatomy','NIH / NHLBI — Ürəyin quruluşu','Dörd kamera'),
 'EZLUNGS': ('https://www.nhlbi.nih.gov/health/lungs/respiratory-system','NIH / NHLBI — Tənəffüs sistemi','Ağciyərlər və döş boşluğu'),
 'EZDIGEST': ('https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works','NIH / NIDDK — Həzm sistemi necə işləyir','Ağız, qida borusu, tüpürcək, mədə və nazik bağırsaq'),
 'EZINSECT': ('https://naturalhistory.si.edu/education/teaching-resources/life-science/what-insect','Smithsonian Təbiət Tarixi Muzeyi — Həşərat nədir','Ayaqlar, bədən hissələri, bığcıqlar və hörümçəklər'),
 'EZBUTTERFLY': ('https://gardens.si.edu/learn/for-educators/cultivating-habitat/butterfly-gardening/about-butterflies/','Smithsonian Gardens — Kəpənəklər haqqında','Larva: caterpillar'),
 'EZDOLPHIN': ('https://oceanservice.noaa.gov/facts/dolphin.html','NOAA — Delfinlər balıqdırmı','Məməli təsnifatı və südlə bəsləmə'),
 'EZFROG': ('https://www.nhm.ac.uk/discover/frogspawn-tadpoles-and-froglets.html','Təbiət Tarixi Muzeyi — Qurbağaların həyat dövrü','Çömçəquyruqdan qurbağaya'),
 'EZDUCK': ('https://animals.sandiegozoo.org/animal-glossary/webbed-feet','San Diego Zoo — Pərdəli ayaqlar','Barmaqlar arasındakı pərdənin üzmə funksiyası'),
 'EZBIRDFEATHER': ('https://www.nhm.ac.uk/discover/news/2025/february/origin-feathers-remains-mystery.html','Təbiət Tarixi Muzeyi — Lələklər','Müasir quşların lələkləri'),
 'EZFOG': ('https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/fog','Met Office — Duman','Havada asılı su damcıları'),
 'EZDEW': ('https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/temperature/dew','Met Office — Şeh','Səthlərdə kondensasiya olunan damcılar'),
 'EZRAINBOW': ('https://weather.metoffice.gov.uk/learn-about/weather/optical-effects/rainbows','Met Office — Göy qurşağı','Günəş işığı və su damcıları'),
 'EZWIND': ('https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/wind','Met Office — Külək','Hərəkətdə olan hava'),
 'EZHAIL': ('https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/hail','Met Office — Dolu','Buz dənələri şəklində yağıntı'),
 'EZSNOW': ('https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/snow','Met Office — Qar','Qar dənələri və buz kristalları'),
 'EZOBSERV': ('https://weather.metoffice.gov.uk/binaries/content/assets/metofficegovuk/pdf/weather/guides/10_0230_fs_17_observations.pdf','Met Office — Hava müşahidələri','Termometrlərlə temperaturun ölçülməsi'),
 'EZTHUNDER': ('https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/thunder-and-lightning','Met Office — Şimşək və göy gurultusu','Göy gurultusunun səs olması; işıq və səsin yayılma sürətləri'),
 'EZPRECIP': ('https://weather.metoffice.gov.uk/learn-about/met-office-for-schools/other-content/other-resources/what-is-precipitation','Met Office — Yağıntı nədir','Yağış: maye su damcıları'),
 'EZRAISIN': ('https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/shelf-stable-food','USDA — Uzun müddət saxlanan qidalar','Qurutma: üzümdən kişmiş'),
 'EZDAIRY': ('https://www.myplate.gov/web/eat-healthy/dairy','USDA / MyPlate — Süd məhsulları','Süd, qatıq və pendir'),
 'EZOLIVEOIL': ('https://www.internationaloliveoil.org/el-mundo-del-olivo/aceite-de-oliva/?lang=es','Beynəlxalq Zeytun Şurası — Zeytun yağları','Zeytun meyvəsindən əldə olunan yağ'),
 'EZWHEAT': ('https://www.aphis.usda.gov/ace/generally-authorized-non-propagative-plant-products','USDA / APHIS — Emal olunmuş bitki məhsulları','Wheat milled products: bulgur'),
 'EZPROTEIN': ('https://www.fao.org/world-pulses-day/news-detail/what-is-the-difference-between-legumes-and-pulses/en','FAO — Paxlalılar və quru paxla dənləri','Noxud: chickpea — legume'),
 'EZORCHESTRA': ('https://www.lso.co.uk/learn-and-discover/digital-activities-and-resources/how-to-build-an-orchestra/','London Simfonik Orkestri — Orkestr necə qurulur','Dirijor və orkestr'),
 'EZMUSICFAM': ('https://playapi.lso.co.uk/download/6/berlioz_inset_PDF.pdf','London Simfonik Orkestri — Orkestr alətləri','Strings: violin'),
 'EZFLUTE': ('https://www.yamaha.com/en/musical_instrument_guide/flute/mechanism/mechanism002.html','Yamaha — Fleytada səsin yaranması','Nəfəs axını və üfürmə'),
 'EZDRUM': ('https://www.yamaha.com/en/musical_instrument_guide/drums/mechanism/mechanism003.html','Yamaha — Nağarada səsin yaranması','Gərilmiş səthə zərbə'),
 'EZPIANO': ('https://www.yamaha.com/en/musical_instrument_guide/piano/mechanism/mechanism002.html','Yamaha — Pianoda səs mexanizmi','Klaviş, çəkic və sim'),
 'EZPORTRAIT': ('https://www.nationalgallery.org.uk/paintings/sandro-botticelli-portrait-of-a-young-man','London Milli Qalereyası — Gənc kişinin portreti','İnsanın üzü və fərdi cizgilərinin təsviri'),
 'EZSTILLLIFE': ('https://www.nationalgallery.org.uk/paintings/glossary/still-lives','London Milli Qalereyası — Natürmort','Meyvə, güllər və gündəlik əşyalar'),
 'EZSELFPORTRAIT': ('https://www.nationalgallery.org.uk/paintings/ignace-henri-theodore-fantin-latour-self-portrait','London Milli Qalereyası — Fantin-Latour, Avtoportret','Rəssamın özünü təsvir etməsi'),
 'EZSCULPTURE': ('https://www.getty.edu/education/for_teachers/curricula/sculpture/','Getty Muzeyi — Heykəltaraşlıqla tanışlıq','Üçölçülü forma'),
 'EZCOLOUR': ('https://www.getty.edu/education/teachers/building_lessons/formal_analysis.html','Getty Muzeyi — Təsviri sənətin əsasları','Color: warm red and yellow'),
 'EZEGYPTEARLY': ('https://www.britishmuseum.org/collection/galleries/early-egypt','British Museum — Erkən Misir','Nil vadisi və firon titulu'),
 'EZEGYPTTIME': ('https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt/timeline-ancient-egypt','British Museum — Qədim Misirin tarix xətti','Giza, sfinks və mumiyalama'),
 'EZCOMPUTER': ('https://support.microsoft.com/en-us/surface/models/surface-3-specs-and-features','Microsoft — Surface 3 quruluşu və hissələri','Mikrofon, dinamik, kamera, toxunma ekranı, microSD'),
 'EZFOOTBALL3': ('https://www.theifab.com/laws/latest/the-players/','IFAB — Law 3: Oyunçular','3.1 Number of players'),
 'EZFOOTBALL10': ('https://www.theifab.com/laws/latest/determining-the-outcome-of-a-match/','IFAB — Law 10: Oyunun nəticəsi','10.1 Goal scored; 10.2 Winning team'),
 'EZFOOTBALL12': ('https://www.theifab.com/laws/latest/fouls-and-misconduct/','IFAB — Law 12: Qayda pozuntuları','Sarı vərəqə: caution; qırmızı vərəqə: sending-off'),
}
for key, (url, title, section) in new.items():
    value = dict(url=url, title=title, section=section)
    assert key not in sources or sources[key] == value
    sources[key] = value
source_file.write_text(json.dumps(sources, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

questions = []
for n in (39,40):
    file = root/'batches'/f'batch-{n:03}.txt'
    lines = file.read_text(encoding='utf-8').splitlines()
    assert len(lines) == 50
    for line in lines:
        fields = line.split('|')
        assert len(fields) == 10 and fields[1] == 'asan'
        assert fields[-2] in sources
        assert len(set(fields[4:8])) == 4
        questions.append(fields)
assert len(questions) == 100

review_file = root/'reviewed-batches.json'
review = json.loads(review_file.read_text(encoding='utf-8'))
for n in (39,40):
    review[f'batch-{n:03}.txt'] = dict(reviewed=True, checkedAt='2026-10-05')
review_file.write_text(json.dumps(review, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps(dict(newQuestions=len(questions),difficulty='asan',newSources=len(new)),ensure_ascii=False))
