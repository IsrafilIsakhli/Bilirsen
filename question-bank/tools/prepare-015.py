import json
from pathlib import Path
from fractions import Fraction
from itertools import product

root = Path(__file__).resolve().parent.parent
def src(url, title, section):
    return dict(url=url, title=title, section=section)
additions = {
    'EQ15': src('https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes', 'USGS — Zəlzələlərin elmi', 'Episentr; ön təkan; intensivlik; P–S vaxtı; üç stansiya'),
    'INT15': src('https://pubs.usgs.gov/gip/interior/index.html', 'USGS — Yerin daxili quruluşu', 'S dalğaları; mantiya həcmi; daxili və xarici nüvə'),
    'IGN15': src('https://www.usgs.gov/faqs/what-are-igneous-rocks?page=0', 'USGS — Maqmatik süxurlar', 'Yavaş və sürətli soyuma; iri kristallar; vulkanik şüşə; maqma və lava'),
    'PUM15': src('https://www.usgs.gov/news/volcano-watch-rocks-float-briefly-where-lava-meets-sea', 'USGS — Vulkanik daşların üzməsi', 'Suyun tez nüfuz etmədiyi qaz boşluqları və sıxlıq'),
    'LIQ15': src('https://www.usgs.gov/programs/earthquake-hazards/new-madrid-seismic-zone', 'USGS — Torpağın mayeləşməsi', 'Liquefaction: doymuş qumda məsamə suyu təzyiqi'),
    'SAF15': src('https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A30001783-2/general-information', 'Kew — Zəfəranın alındığı hissə', 'Uses: Crocus sativus ağızcıqları'),
    'CIN15': src('https://spices.res.in/products/spices/cinnamon.html', 'ICAR-IISR — Darçın', 'Qurudulmuş daxili qabıq və qıvrılmış çubuqlar'),
    'CLO15': src('https://www.indianspices.com/node/24.html', 'Spices Board — Mixək', 'Description: qurudulmuş açılmamış çiçək qönçəsi'),
    'NUT15': src('https://www.indianspices.com/indianspices/spice-catalog/nutmeg-mace.html', 'Spices Board — Muskat və masis', 'Arillus və toxum ləpəsi; adətən ayrı erkək və dişi ağaclar'),
    'PEP15': src('https://ebooks.inflibnet.ac.in/ftp07/chapter/150/', 'INFLIBNET — Qara və ağ istiotun hazırlanması', 'Pepper products: ağ istiotda perikarpın çıxarılması'),
    'GIN15': src('https://spices.res.in/crops/ginger', 'ICAR-IISR — Zəncəfil', 'İstifadə edilən yeraltı hissə rizomdur'),
    'TUR15': src('https://www.efsa.europa.eu/en/topics/topic/food-colours', 'EFSA — Qida rəngləndiriciləri', 'Cədvəl: E100 — kurkumin; sarıkök mənşəyi ICAR-IISR turmeric səhifəsi ilə də tutuşdurulub'),
    'ARCH15': src('https://australian.museum/learn/animals/fishes/sevenspot-archerfish-toxotes-chatareus/', 'Australian Museum — Oxatan balıq', 'Su şırnağı ilə ov; dil və ağız tavanındakı yiv'),
    'AXO15': src('https://www.nhm.ac.uk/discover/axolotls-amphibians-that-never-grow-up.html', 'Natural History Museum — Aksolotl', 'Bərpa; neoteniya; Soçimilko; vəhşi fərdlərin rəngi'),
    'LYR15': src('https://www.environment.nsw.gov.au/topics/animals-and-plants/native-animals/native-animal-facts/birds/lyrebirds', 'NSW Environment — Liraquşları', 'Səs təqlidi; quyruq; nümayiş təpəciyi; yer örtüyündə qida axtarışı'),
    'PAN15': src('https://animals.sandiegozoo.org/animals/tree-pangolin', 'San Diego Zoo — Panqolin', 'Keratin; dişsiz ağız və mədə; malay dilində ad'),
    'SLO15': src('https://nationalzoo.si.edu/animals/news/why-are-sloths-so-slow-and-other-sloth-facts', 'Smithsonian — Tənbəl heyvanın xüsusiyyətləri', 'Tükdə yosun; maddələr mübadiləsi; üzmək'),
    'LEA15': src('https://stri.si.edu/story/blind-spots', 'Smithsonian Tropical Research Institute — Qarışqaların göbələk bağları', 'Yarpaq parçaları göbələk yetişdirmək üçün substratdır'),
    'BEI15': src('https://www.nationalzoo.si.edu/animals/beaver?qt-learn_more_about_the_animal=2', 'Smithsonian — Qunduzun diş minası', 'Dəmirin möhkəmləndirici rolu və narıncı rəng'),
    'BEA15': src('https://nationalzoo.si.edu/animals/beaver', 'Smithsonian — Qunduz', 'Quyruq siqnalı; sualtı girişli yuva; xüsusi ikili dırnaq'),
    'FLY15': src('https://australian.museum/learn/animals/fishes/a-flyingfish-cheilopogon-sp/', 'Australian Museum — Uçan balıq', 'Süzmə; böyümüş üzgəclər; quyruğun alt payı'),
    'NAU15': src('https://ocean.si.edu/ocean-life/invertebrates/octopuses-squids-and-relatives', 'Smithsonian Ocean — Başıayaqlılar və nautilus', 'Nautilusun sinfi və kameralı qabığın üzmə qabiliyyətində rolu'),
}
sources = json.loads((root/'sources.json').read_text(encoding='utf-8'))
for key, value in additions.items():
    assert key not in sources or sources[key] == value, f'Source collision: {key}'
sources.update(additions)
(root/'sources.json').write_text(json.dumps(sources, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
(root/'qa/sources-015.json').write_text(json.dumps(additions, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

batch = root/'batches/batch-015.txt'
lines = [line.split('|') for line in batch.read_text(encoding='utf-8').splitlines()]
assert len(lines) == 50
polish = {
    'igneous-intrusive-slow-large-crystals': ['Kristalların böyüməyə daha çox vaxtı olur', 'Yavaş soyuma kristalların böyüməsini dayandırır', 'Yalnız yüksək təzyiq kristalların ölçüsünü müəyyən edir', 'Maqmadakı bütün minerallar eyni ölçüdə qalır'],
    'pumice-floating-closed-gas-voids': ['İçində suyun tez dolmadığı qaz boşluqlarının olması', 'Bütün minerallarının sudan yüngül olması', 'Dəniz suyunda dərhal həll olması', 'Maqnit sahəsinin onu suyun üstündə saxlaması'],
    'archerfish-water-jet-knocks-insects': ['Ağzından su şırnağı atıb onu suya salır', 'Elektrik impulsu ilə onu iflic edir', 'Yapışqan dilini budağa qədər uzadır', 'Suyun altından çox güclü səs buraxır'],
    'archerfish-tongue-palate-tube': ['Ağız tavanındakı yivə sıxılaraq boru yaradır', 'Suyu qəlsəmə yarığına yönəldir', 'Suyu udma borusunda saxlayır', 'Suyu burun dəliklərinə ötürür'],
    'axolotl-regeneration-limbs': ['İtirdiyi ətrafları yenidən böyütməsi', 'Bədən temperaturunu daim sabit saxlaması', 'Quruya çıxdıqda qabıq əmələ gətirməsi', 'Suda oksigen olmadan daimi yaşaması'],
    'superb-lyrebird-courtship-earth-mound': ['Torpağı eşələyib kiçik təpəcik düzəldir', 'Budaqlardan hündür tağlı keçid qurur', 'Qayalarda dimdiyi ilə dairəvi oyuq açır', 'Yarpaqlardan su üzərində sal düzəldir'],
    'sloth-fur-algae-camouflage': ['Tükdə yaşayan yosunlar', 'Heyvanın özünün yaşıl piqmenti', 'Yarpaqlardan xəzə hopmuş şirə', 'Yalnız işıqdan yaranan rəng illüziyası'],
    'sloth-slow-metabolism-energy-economy': ['Az kalorili pəhriz və yavaş metabolizm enerji qənaəti tələb edir', 'Yarpaq pəhrizi əzələləri daim qıcolma vəziyyətində saxlayır', 'Yüksək kalorili pəhriz heyvanın çox hərəkətinə imkan vermir', 'Yarpaq yemək məməlilərdə maddələr mübadiləsini sürətləndirir'],
    'leafcutter-ants-fungus-farming': ['Qidalandıqları göbələyi yetişdirmək üçün', 'Yuvalarını yarpaqların xlorofili ilə işıqlandırmaq üçün', 'Yarpaqdan yalnız içməli su süzmək üçün', 'Yarpağı yeyərək əsasən liflə qidalanmaq üçün'],
    'beaver-hind-foot-double-nail-grooming': ['Xəzini darayıb təmizləməyə', 'Dişlərini yonub qısaltmağa', 'Quyruqdakı pulcuqları qoparmağa', 'Yuvanın divarını deşməyə'],
    'flyingfish-glides-not-powered-flight': ['Üzgəclərini açıb süzür, qanad çalaraq uçmur', 'Havada üzgəclərini fasiləsiz qanad kimi çalır', 'Havada yalnız quyruğun fırlanması ilə hərəkət edir', 'Bütün uçuş boyunca su şırnağı ilə irəliləyir'],
    'nautilus-shell-chambers-buoyancy': ['Üzmə qabiliyyətini və suda qalma səviyyəsini tənzimləməyə', 'Yumurtaları ayrı bölmələrdə saxlamağa', 'Ovunu uzun müddət kamerada həzm etməyə', 'Su axınını süzüb qida hissəciklərini toplamağa'],
}
for fields in lines:
    if fields[2] in polish:
        fields[4:8] = polish[fields[2]]
    if fields[2] == 'father-son-age-three-now-two-after-twelve':
        fields[3] = 'Atanın yaşı indi oğlunun yaşının üç qatıdır. 12 il sonra atanın yaşı oğlunun yaşının iki qatı olacaq. Oğul indi neçə yaşındadır?'
    assert len(fields) == 10 and fields[8] in sources and len(fields[3]) <= 320
batch.write_text('\n'.join('|'.join(fields) for fields in lines)+'\n', encoding='utf-8')

# Independently enumerate the three new derivations.
monty = []
for gift in range(3):
    for first in range(3):
        possible_open = [door for door in range(3) if door != first and door != gift]
        for opened in possible_open:
            switched = next(door for door in range(3) if door not in (first, opened))
            monty.append((Fraction(1, 9*len(possible_open)), switched == gift))
switch_probability = sum(weight for weight, won in monty if won)
dice = sum(a+b == 7 for a,b in product(range(1,7), repeat=2))
age = [x for x in range(1,101) if 3*x+12 == 2*(x+12)]
assert switch_probability == Fraction(2,3) and dice == 6 and age == [12]
checks = dict(monty_switch_probability=str(switch_probability), dice_favourable=dice, dice_total=36, son_age=age[0])
(root/'qa/derivation-checks-015.json').write_text(json.dumps(checks, indent=2)+'\n', encoding='utf-8')
print(json.dumps(dict(newQuestions=50, newSources=len(additions), checks=checks), ensure_ascii=False))
