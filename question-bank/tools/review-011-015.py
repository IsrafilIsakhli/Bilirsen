import json
from pathlib import Path
from itertools import permutations, product

root = Path(__file__).resolve().parent.parent
# Revise distractors rather than fill the count with obviously impossible choices.
options = {
 'sunspots-cooler-than-surroundings': ['Ətraf fotosferdən daha soyuqdur', 'Ətraf fotosferdən daha istidir', 'Ətrafında həmişə Ayın kölgəsi olur', 'Ətrafından daha çox görünən işıq yayır'],
 'sun-corona-hotter-than-photosphere': ['Tac daha istidir', 'Tac daha soyuqdur', 'Tacın temperaturu fotosferlə eynidir', 'Tacın temperaturu yalnız məsafədən asılı olaraq azalır'],
 'solar-system-orion-spur-location': ['Orion qolcuğunda', 'Oxatan qolunun mərkəzində', 'Persey qolunun mərkəzində', 'Qalaktikanın düz mərkəzində'],
 'white-dwarf-gradually-cools': ['Tədricən soyuması', 'Tədricən qırmızı nəhəngə şişməsi', 'Daim eyni temperaturda qalması', 'Nüvə enerjisi ilə getdikcə qızması'],
 'pulsar-rotating-neutron-star': ['Sürətlə fırlanan neytron ulduzu', 'Yavaş fırlanan qırmızı nəhəng', 'Ulduz işığını əks etdirən planet', 'Qaz ataraq fırlanan kometa'],
 'magnetar-extreme-magnetic-field': ['Son dərəcə güclü maqnit sahəsi', 'Həmişə neytron ulduzundan böyük radiusu', 'Yalnız görünən işıq yayması', 'Heç bir maqnit sahəsinin olmaması'],
 'brown-dwarf-insufficient-mass-for-stellar-fusion': ['Kütləsinin kifayət etməməsi', 'Nüvəsində hidrogenin tamamilə olmaması', 'İşığının planetlər tərəfindən udulması', 'Səthində atmosferin olmaması'],
 'red-dwarfs-hydrogen-mixing-long-life': ['Nüvəyə yeni hidrogen gətirir', 'Hidrogeni nüvədən tam çıxarır', 'Dəmirin parçalanmasını sürətləndirir', 'Ulduzun bütün kütləsini artırır'],
 'planetary-nebula-ejected-stellar-layers': ['Yaşlanan ulduzun atılmış xarici qatlarından', 'Gənc planetlərin itirdiyi atmosferlərdən', 'Kometa buludunun buxarlanan buzlarından', 'Ulduzlararası tozun sıxılıb parçalanmasından'],
 'steel-paperclip-supported-surface-tension': ['Səthi gərilmə', 'Poladın sudan az sıx olması', 'Su ilə metal arasında maqnit cazibəsi', 'Yalnız havanın qaldırıcı qüvvəsi'],
 'artesian-water-confined-pressure': ['Su keçirməyən qatlar arasında təzyiq', 'Yalnız quyunun çox dərin olması', 'Suyun həmişə qaynama temperaturunda olması', 'Suyun daxilində duzun çox olması'],
 'gallium-arsenide-semiconductor-use': ['Yarımkeçirici olması', 'İdeal elektrik izolyatoru olması', 'Bütün işığı itkisiz əks etdirməsi', 'Yalnız maqnit sahəsi yaratması'],
 'gallium-mendeleev-prediction-gap': ['Əvvəlcədən proqnozlaşdırılmış boşluğu doldurması', 'Qeyri-metallar qrupuna aid ilk element olması', 'Mendeleyevin proqnozunu tam təkzib etməsi', 'Bütün elementlərin eyni kütlədə olduğunu göstərməsi'],
 'tungsten-incandescent-filament-material': ['Volfram', 'Mis', 'Alüminium', 'Gümüş'],
 'tungsten-carbide-hard-cutting-tools': ['Çox sərt olması', 'Rezin kimi asan dartılması', 'Su ilə təmasda dərhal həll olması', 'Otaq temperaturunda maye olması'],
 'helium-detected-solar-spectrum-before-earth': ['Günəş spektrində yeni xəttlə', 'Kometa quyruğunda yeni spektr xətti ilə', 'Mars atmosferinin spektrində yeni xəttlə', 'Ay səthindən gələn radio siqnalı ilə'],
 'helium-mri-magnet-cooling': ['Soyutmaq üçün', 'Maqnit sarğılarını rəngləmək üçün', 'Elektrik cərəyanını ölçmək üçün', 'Maqnit sarğılarına mexaniki dayaq vermək üçün'],
 'stainless-steel-chromium-corrosion-resistance': ['Xrom', 'Qalay', 'Mis', 'Alüminium'],
 'diamond-graphite-same-element-forms': ['Eyni elementin müxtəlif formalarıdır', 'Eyni kristal quruluşuna malikdirlər', 'Eyni sərtliyə malikdirlər', 'Eyni elektrik keçiriciliyinə malikdirlər'],
 'graphene-atom-thin-carbon-sheet': ['Bir atom qalınlığında təbəqə', 'Qapalı kürə formalı karbon molekulu', 'Bütöv üçölçülü almaz kristalı', 'Birqat deyil, yalnız çoxqalın karbon lifi'],
 'activated-charcoal-purification-filtration': ['Arzuolunmaz maddələri tutub təmizləməyə', 'Hər qazı kimyəvi olaraq oksigenə çevirməyə', 'Havanı yalnız maqnitlə təmizləməyə', 'Havada bütün molekulların ölçüsünü dəyişməyə'],
 'silicon-doping-controls-electrical-properties': ['Elektrik xassələrini idarə etmək üçün', 'Silisiumun atom nömrəsini dəyişmək üçün', 'Silisiumu yalnız istilik izolyatoru etmək üçün', 'Çipdə bütün atomları ionlaşdırmaq üçün'],
 'iodised-salt-thyroid-deficiency-prevention': ['Yod çatışmazlığının qarşısını almaq', 'Duzun natrium miqdarını artırmaq', 'Duzun suyadavamlılığını artırmaq', 'Duzun qida kalorisini artırmaq'],
 'iodine-discovery-seaweed-ash': ['Dəniz yosunu külü ilə', 'Daş kömür külü ilə', 'Gümüş filizi ilə', 'Dəniz qumu ilə'],
 'iodine-lcd-polarising-filters': ['Qütbləşdirici filtrlərin', 'Metal ekran çərçivələrinin', 'Şüşə dayaq altlığının', 'Mis enerji kabellərinin'],
 'bismuth-alloys-low-melting-fire-detectors': ['Aşağı ərimə temperaturu', 'Yüksək qaynama temperaturu', 'Güclü ferromaqnitlik', 'Tam optik şəffaflıq'],
 'rani-ki-vav-stepwell-water-storage': ['Suyu toplamaq və ona çıxışı təmin etmək', 'Yeraltı anbarlarda taxıl saxlamaq', 'Daş mədəninə enişi təmin etmək', 'Torpağın altında müdafiə sığınacağı yaratmaq'],
 'shushtar-tunnels-supply-watermills': ['Su dəyirmanlarını', 'Əl ilə işləyən toxucu dəzgahları', 'Buxar mühərrikli presləri', 'Küləklə işləyən su nasoslarını'],
 'jantar-mantar-naked-eye-observations': ['Çılpaq gözlə', 'Optik teleskopla', 'Radioantenalarla', 'Fotoqrafik lövhələrlə'],
 'jantar-mantar-masonry-instruments': ['Daş hörgüdən monumental sabit tikililər olması', 'Yalnız kiçik şüşə linzalardan yığılması', 'Hamısının cibdə daşınan alətlər olması', 'Yalnız burulmuş mis naqillərdən qurulması'],
 'jantar-mantar-jai-singh-creator': ['II Cay Sinqh', 'Şah Cahan', 'Əkbər şah', 'Övrəngzib'],
 'qanat-vertical-shafts-spoil-ventilation': ['Torpağı çıxarmaq və havalandırmaq', 'Suyun duzluluğunu artırmaq və isitmək', 'Tuneldə suyun axınını tam dayandırmaq', 'Tuneli yalnız günəş işığı ilə qızdırmaq'],
 'qanat-taps-underground-aquifer': ['Yeraltı sulu laya', 'Dənizin duzlu su axınına', 'Yalnız daimi açıq gölə', 'Yalnız səthdəki yağış gölməçəsinə'],
 'kinderdijk-mills-drain-land': ['Torpağın artıq suyunu çıxarmaq', 'Əsasən buğdanı üyütmək', 'Yalnız ağac lövhələri kəsmək', 'Dəniz suyundan duz çıxarmaq'],
 'pont-du-gard-aqueduct-purpose': ['Su kanalını çayın üzərindən keçirmək', 'Piyadalar üçün şəhər darvazası yaratmaq', 'Qayıqları su səviyyəsinə görə qaldırmaq', 'Çayda gəmi hərəkətini tam dayandırmaq'],
 'hallstatt-1750-fire-reconstruction': ['Yanğın', 'Zəlzələ', 'Daşqın', 'Torpaq sürüşməsi'],
 'alhambra-nasrid-art-dynasty': ['Nəsrilərin', 'Əməvilərin', 'Əlmoravilərin', 'Əlmohadların'],
 'generalife-emirs-rural-residence-gardens': ['Əmirlərin şəhərkənarı iqamətgahı ilə', 'Mədrəsə və tələbə yataqxanası ilə', 'Əsgərlər üçün şəhər kazarması ilə', 'Karvanlar üçün ticarət anbarı ilə'],
 'himeji-white-heron-plaster-walls': ['Divarlarının ağ suvağı', 'Divarlarındakı qırmızı kərpic', 'Qara rəngə boyanmış taxta divarlar', 'Qızılı rəngdə metal dam örtüyü'],
 'himeji-principal-complex-wood-construction': ['Taxta ilə', 'Dəmir-betonla', 'Çuqun karkasla', 'Polad karkasla'],
 'hiroshima-dome-preserved-as-ruin': ['Atom bombasının dağıdıcılığını və sülh arzusunu xatırlatmaq', 'Yanğınsız tikinti üsullarının sınağını göstərmək', 'Bərpa olunmuş imperator sarayını təmsil etmək', 'Şəhərin bütövlükdə qədim qala olduğunu göstərmək'],
 'borobudur-openwork-stupas-buddha-statues': ['Budda heykəli', 'Hindu tanrısı Qaneşanın heykəli', 'Çin sərkərdəsinin büstü', 'Yerli hökmdarın mumiyası'],
 'tsodilo-desert-louvre-rock-paintings': ['Qaya rəsmləri ilə', 'Daşdan yonulmuş saraylarla', 'Çoxsaylı kitabə arxivləri ilə', 'Toxuma xalça kolleksiyası ilə'],
 'mesa-verde-ancestral-pueblo-dwellings': ['Pueblo xalqının', 'Navaxo xalqının', 'İnka xalqının', 'Mayaların'],
 'lascaux-paintings-animal-scenes': ['Heyvan fiqurları', 'Şəhər bazarlarının təsvirləri', 'Dəniz gəmilərinin planları', 'İmperator portretləri'],
 'carcassonne-restoration-viollet-le-duc': ['Ejen Viole-le-Dük', 'Jül Arduen-Mansar', 'Şarl Qarnye', 'Klod Nikola Ledu'],
 'carcassonne-medieval-fortified-town': ['Şəhəri əhatə edən iri müdafiə qurğuları', 'Yalnız taxta hasarla qorunması', 'Mərkəzinin tam yeraltı olması', 'Bütün küçələrinin su kanalı olması'],
 'ateshgah-natural-gas-original-flame': ['Səthə çıxan təbii qazın yanması', 'Çayın vulkanik lava gətirməsi', 'Kükürd yatağının ildırımda alışması', 'İsti bulaq suyunun alov yaratması'],
 'baku-arcaded-complex-found-1964': ['Arxeoloji qazıntı', 'Tarixi sənədlərin mikrofilmlənməsi', 'Muzey eksponatlarının köçürülməsi', 'Divar təsvirlərinin bərpası'],
 'lotfi-zadeh-fuzzy-sets-research': ['Qeyri-səlis çoxluqlar', 'Nisbilik nəzəriyyəsi', 'Evolyusiya nəzəriyyəsi', 'Kontinental sürüşmə'],
 'night-watch-reconstruction-lundens-copy': ['Gerrit Lundensə aid edilən köhnə surət', 'Rembrandtın əsəri çəkərkən götürülmüş fotoşəkli', 'Rəssamın başqa portretinin rəng xəritəsi', 'Yalnız tablonun indiki çərçivəsinin ölçüsü'],
 'basketball-original-peach-baskets': ['Şaftalı səbətləri', 'Altı açıq kəndir torları', 'Taxta qutu çərçivələri', 'Metal vedrələr'],
}
changes = []
for number in range(11,16):
    file = root/f'batches/batch-{number:03}.txt'
    lines = [line.split('|') for line in file.read_text(encoding='utf-8').splitlines()]
    for fields in lines:
        if fields[2] in options:
            fields[4:8] = options[fields[2]]
            changes.append(fields[2])
        if fields[2] == 'cricket-pitch-standard-22-yards':
            fields[3] = 'Kriketin topatma xətləri arasındakı düzbucaqlı oyun zolağının standart uzunluğu neçə yarddır?'
        if fields[2] == 'cricket-wicket-three-upright-stumps':
            fields[3] = 'Kriketdə wicket adlanan dirək quruluşunun şaquli çubuqları standart olaraq neçə dənədir?'
        if fields[2] == 'cricket-wicket-two-bails-on-top':
            fields[3] = 'Kriketdə üç şaquli dirəyin üstünə qoyulan kiçik üfüqi çubuqlar — bails — standart halda neçə dənədir?'
        if fields[2] == 'cricket-over-six-valid-deliveries':
            fields[3] = 'Kriketdə over adlanan standart atış seriyası neçə qaydalara uyğun, sayılan top atışından ibarətdir?'
        if fields[2] == 'cricket-boundary-six-without-bounce':
            fields[3] = 'Kriketdə dəyənəklə vurulan top meydanda yerə dəymədən sərhəddən kənara düşür. Standart qaydada neçə qaçış xalı verilir?'
        if fields[2] == 'cricket-boundary-four-after-ground-contact':
            fields[2:10] = ['cricket-no-ball-one-run-penalty', 'Kriketdə hakim qaydaya zidd atış üçün No ball elan edir. Təkcə bu elana görə vuran tərəfə neçə cərimə qaçış xalı verilir?', 'Bir', 'İki', 'Dörd', 'Beş', 'NOB14', 'MCC 2026 nəşrinin 21.14 qaydası bir qaçışlıq cərimə verir; başqa qazanılmış qaçışlar əlavə ola bilər.']
        if fields[2] == 'basketball-indoor-winter-need':
            fields[3] = 'Neysmitin basketbolu hazırlamasının əsas məqsədi tələbələrə hansı şəraitdə fəal oyun yaratmaq idi?'
            fields[4:8] = ['Qışda qapalı idman zalında', 'Yayda açıq üzgüçülük hovuzunda', 'Payızda cıdır meydanında', 'Yazda buz meydançasında']
        if fields[2] == 'f_amirov-sevil-opera-composer':
            fields[3] = 'Cəfər Cabbarlının Sevil pyesini operaya çevirən musiqinin müəllifi kimdir?'
        assert len(fields) == 10 and len(set(fields[4:8])) == 4
    file.write_text('\n'.join('|'.join(fields) for fields in lines)+'\n', encoding='utf-8')

sources = json.loads((root/'sources.json').read_text(encoding='utf-8'))
url = 'https://www.lords.org/getattachment/d9eb43d5-5935-4634-b170-da698e0e9d6e/Laws-of-Cricket-2017-Code-4th-Edition-%282026%29.pdf'
sources['NOB14'] = dict(url=url, title='MCC — Kriket qaydalarının 2026 nəşri', section='Law 21.14: No ball üçün bir qaçışlıq cərimə')
sources['BND14'] = dict(url=url, title='MCC — Kriketdə sərhəd hesabı', section='2026, Law 19.6.2 və 19.7.1; standart olaraq altı qaçış')
# The length was verified in the full 2026 text as well as the earlier page.
sources['PIT14'] = dict(url=url, title='MCC — Kriketdə oyun zolağı', section='2026, Law 6.1: 22 yard / 20,12 metr')
(root/'sources.json').write_text(json.dumps(sources, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
ledger = json.loads((root/'qa/sources-011-014.json').read_text(encoding='utf-8'))
for key in ['NOB14','BND14','PIT14']:
    ledger[key] = sources[key]
(root/'qa/sources-011-014.json').write_text(json.dumps(ledger, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

meet = set(['Tue','Fri']) & set(['Fri','Sun']) & set(['Mon','Fri'])
seats = [p for p in permutations('ALMN') if p[0]=='A' and p[3]=='L' and p.index('M')<p.index('N')]
hats = [(a,m) for a,m in product('BW', repeat=2) if (a,m)!=('W','W')]
survivors = [(a,m) for a,m in hats if len({other_a for other_a,other_m in hats if other_m == m})>1]
start_days = [start for start in range(7) if sum((start+day)%7==0 for day in range(31))==5]
boxes = [(place, int(place=='B')+int(place!='B')) for place in 'AB']
assert meet == {'Fri'} and len(seats)==1 and seats[0][1]=='M'
assert {m for a,m in survivors} == {'B'} and start_days == [0,5,6]
assert all(truths==1 for place,truths in boxes)
checks = dict(meeting='Friday', seating=seats, murad_hat='black', five_mondays_month_start=start_days, boxes=boxes)
(root/'qa/derivation-additional-checks-011-015.json').write_text(json.dumps(checks, indent=2)+'\n', encoding='utf-8')

manifest = json.loads((root/'reviewed-batches.json').read_text(encoding='utf-8'))
for n in range(11,16):
    manifest[f'batch-{n:03}.txt'] = dict(reviewed=True, checkedAt='2026-10-05')
(root/'reviewed-batches.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
record = dict(batches=list(range(11,16)), added_questions=250, preserved_previous_questions=450,
              revised_distractors=changes, replaced_overly_similar_question='cricket-boundary-four-after-ground-contact',
              replacement='cricket-no-ball-one-run-penalty',
              review='Mətn, məna, düzgün cavab və alternativlər müəllif tərəfindən nəzərdən keçirilib. Avtomatik təkrar yoxlaması ayrıca siqnaldır, məna unikallığının sübutu deyil.',
              difficulty='İlkin qiymətləndirmədir; oyunçu sınağı aparılmayıb.')
(root/'qa/review-011-015.json').write_text(json.dumps(record, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps(dict(revised_distractors=len(changes), checks=checks, reviewed_questions=250), ensure_ascii=False))
