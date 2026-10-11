import json, re, hashlib
from collections import Counter
from pathlib import Path

root = Path(__file__).resolve().parent.parent
drafts = root/'drafts-1000'
sources = json.loads((root/'sources.json').read_text(encoding='utf-8'))
old_sources = dict(sources)
baseline = root/'qa/previous-sources-850.json'
if not baseline.exists():
    baseline.write_text(json.dumps(old_sources, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
fixes = {
 (3,17): 'Yanma sürəti qeyri-bərabər olan ipin yarısı kəsilsə, qalan hissənin yanma vaxtı barədə nə demək olar?|İlkin vaxtın yarısı olması təmin edilmir|Mütləq yarıya enir|Mütləq ikiqat artır|Mütləq dəyişmir',
 (3,22): 'Əvvəl tərəziyə qoyulmuş eyni kütləli iki qutuya birində 3, digərində 5 eyni kütləli top əlavə olunur. Tarazlığı bərpa etmək üçün bir topu hansı qutudan hansına keçirmək lazımdır?|Beş topludan üç topluya|Üç topludan beş topluya|İstənilən qutudan digərinə iki top|Heç top keçirmək olmaz',
 (3,25): 'Dairəvi masada altı nəfər oturub. Hər kəs yalnız iki qonşusu ilə əl sıxırsa, neçə fərqli əl sıxma var?|6|12|15|3',
 (3,30): 'Bir zər atılıb və nəticənin cüt olduğu məlumdur. Nəticənin 6 olması ehtimalı nədir?|1/3|1/6|1/2|2/3',
 (3,31): 'Yarışın yekun sıralamasında A B-dən, B isə C-dən qabaqdadır. Hansı nəticə çıxır?|A C-dən qabaqdadır|C A-dan qabaqdadır|A mütləq sonuncudur|B mütləq birincidir',
 (3,39): 'Bir tam ədədi 5-ə böləndə qalıq 3 alınır. Onun ikiqatını 5-ə böləndə qalıq nə olar?|1|2|3|4',
 (3,40): 'Kitabın səhifələri 1-dən 12-yə qədər nömrələnib. Yazılışda “1” rəqəmi neçə dəfə işlənib?|5|3|4|6',
 (3,42): 'Müsbət tam ədədin son rəqəmi 5-dir. Onun kvadratının son iki rəqəmi həmişə nədir?|25|15|35|55',
 (3,46): 'Eyni anda başlayan iki dişli çarxda 12 və 18 diş var. Başlanğıcda toxunan işarəli dişlər ən az neçə diş keçidindən sonra yenə bir-birinə rast gələr?|36|6|24|72',
 (5,38): 'Eyni iki atom arasındakı rabitə üçqat olanda tək rabitəyə nisbətən adətən necə olur?|Daha qısa və möhkəm|Daha uzun və zəif|Tamamilə ionsuz cazibəsiz|Həmişə eyni uzunluqda və qüvvədə',
 (6,13): '“Ayı-pişik” adlandırılan binturong hansı fəsiləyə aiddir?|Viverridlərə|Ayıkimilərə|Pişikkimilərə|Dələkimilərə',
 (6,34): 'Yetkin tuatara əsasən günün hansı vaxtında fəaldır?|Gecə|Günorta istisində|Yalnız günəşli səhərdə|Yalnız qürubdan əvvəl',
 (6,39): 'Filin köhnələn azı dişlərini əvəz edən yeni dişlər necə irəliləyir?|Çənənin arxasından önünə|Yalnız aşağıdan yuxarı şaquli|Dişlərin ortasından iki yana|Yalnız ön tərəfdən arxaya',
 (7,28): '“Dost dar gündə tanınar” məsəli hansı keyfiyyəti önə çəkir?|Çətinlikdə sədaqəti|Yalnız var-dövləti|Həmişə tələsməyi|Rəqabətdə qalib gəlməyi',
 (8,23): 'Unicode-da eyni görünən mətnin müxtəlif simvol ardıcıllıqlarını uyğunlaşdırmağa yönələn proses necə adlanır?|Normallaşdırma|Şifrələmə|Paket marşrutlaşdırması|Yalnız şrift böyütmə',
 (8,45): 'Hibrid şifrələmə sistemində böyük mesajın əsas hissəsi adətən hansı üsulla şifrələnir?|Simmetrik şifrələmə ilə|Yalnız Base64 ilə|Yalnız açıq heşlə|Şifrələmə olmadan',
 (8,46): 'Kriptoqrafik heş funksiyası dəyişən uzunluqlu məlumatdan əsasən nə yaradır?|Sabit uzunluqlu rəqəmsal iz|İlkin məlumatın tam şifrəsiz nüsxəsi|Mütləq daha uzun video|İcra olunan proqram',
 (9,25): 'Eyni vaxt ərzində daha çox tam rəqs edən cismin hansı göstəricisi daha böyükdür?|Tezliyi|Periodu|Mütləq kütləsi|Mütləq amplitudu',
 (9,27): 'Səs mənbəyi səs sürətini keçəndə yaranan konusun səthi hansı dalğalarla əlaqəlidir?|Üst-üstə yığılan təzyiq dalğaları ilə|Yalnız işıq dalğaları ilə|Yalnız elektrik dalğaları ilə|Yalnız cazibə dalğaları ilə',
 (11,1): 'Böyük Sədd rifi Avstraliyanın hansı sahilindədir?|Şimal-şərq|Cənub-qərb|Şimal-qərb|Cənub-şərq',
 (11,4): 'Böyük Sədd rifində dəniz tısbağaları üçün mühüm sahilyanı fəaliyyət hansıdır?|Çimərliklərdə yuvalama|Ağac başında qışlama|Şirin su bulağında yumurta basma|Dağ mağarasında balalama',
 (12,44): 'Top oyunda olarkən badmintonçu raketkası və ya bədəni ilə tora toxunsa, bu nədir?|Qayda pozuntusu|Əlavə xal|Qanuni fasilə|Avtomatik yenidən servis',
 (15,20): 'Klimtin uşaqlıq ailəsində qızıl işləməsi ilə bağlı hansı peşə vardı?|Atası qızıl oyma ustası idi|Anası heykəltəraş idi|Atası gəmi kapitanı idi|Qardaşı şüşəçi idi',
 (16,1): 'Popkorn dənəsində təzyiqi artırıb qabığın partlamasına səbəb olan əsas maddə hansıdır?|Su buxarı|Karbon dioksid|Azot|Hidrogen',
 (16,2): 'Popkornun bərk xarici qabığı hansı rolu oynayır?|Buxarı bir müddət içəridə saxlayır|Dənənin bütün suyunu dərhal buraxır|Yalnız işığın keçməsini artırır|Nişastanı yağdan ayırır',
 (16,3): 'Popkornun ağ, köpükvari hissəsi əsasən nədir?|Genişlənmiş nişasta|Kristallaşmış şəkər|Bərkiyən yağ|Dənənin yalnız zülal qatı',
 (16,4): 'Tam qurumuş dənə popkorn üçün niyə problem yaradır?|Buxarlanacaq su azdır|Nişasta tam yox olur|Qabıq artıq həmişə ərimişdir|Yağ miqdarı mütləq ikiqatdır',
 (16,5): 'Xarici təzyiq azalanda popkornun genişlənməsi adətən necə ola bilər?|Daha böyük|Daha kiçik|Mütləq eyni|Tamamilə dayanmış',
 (16,7): 'Saxaroza hidroliz olunanda hansı iki sadə şəkər alınır?|Qlükoza və fruktoza|Qlükoza və qalaktoza|İki fruktoza|İki qalaktoza',
 (16,8): 'Karamelləşmə əsasən hansı maddələrin qızdırılması ilə gedir?|Şəkərlərin|Yalnız zülalların|Yalnız mineral duzların|Yalnız yağların',
 (16,9): 'Şüşəvari bərk konfetdə iri şəkər kristallarının yaranması hansı xüsusiyyəti poza bilər?|Hamar quruluşu|Mineral tərkibini|Yalnız saxaroza formulunu|Yalnız turşuluğu',
 (16,10): 'Şəkər kristalı yarananda məhlula düşən kiçik şəkər kristalı hansı rolu oynaya bilər?|Kristallaşma nüvəsi|Emulqator|Turşuluq tənzimləyicisi|Qaz mənbəyi',
 (16,11): 'Balda ən çox rast gəlinən iki şəkər hansıdır?|Fruktoza və qlükoza|Laktoza və maltoza|Riboza və qalaktoza|Saxaroza və laktoza',
 (16,12): 'Çiçək balının əsas xammalını arılar haradan toplayır?|Çiçək nektarından|Çiçək ləçəklərinin lifindən|Ağacın yalnız oduncağından|Torpaqdakı mineral duzlardan',
 (16,13): 'Bal hazırlanarkən invertaza fermenti hansı işi görür?|Saxarozanı parçalayır|Yağı qliserinə çevirir|Sellülozanı mum edir|Laktozanı sintez edir',
 (16,16): 'Qəhvə “dənəsi” bitkinin əslində hansı hissəsidir?|Toxum|Kök yumrusu|Yarpaq|Çiçək ləçəyi',
 (16,17): 'Təzə qovrulmuş qəhvədən ayrılan əsas qaz hansıdır?|Karbon dioksid|Azot|Hidrogen|Metan',
 (16,18): 'Qovrulmamış qəhvə toxumunun adi rəngi necədir?|Yaşılımtıl|Tam qara|Tünd qəhvəyi|Parlaq narıncı',
 (16,19): 'Qəhvə paketində birtərəfli klapan əsasən nəyə kömək edir?|Daxili qazın çölə çıxmasına|Havanı daim içəri vurmağa|Nəmi məcburi içəri çəkməyə|Paketin çəkisini ölçməyə',
 (16,20): 'Qəhvə və çayda olan kofein kimyəvi baxımdan hansı qrupa aiddir?|Alkaloidlərə|Disaxaridlərə|Karotinoidlərə|Mineral duzlara',
 (16,22): 'Soğan bütöv ikən az, kəsiləndə çox gözyaşardır; əsas səbəb nədir?|Hüceyrə daxilində ayrılmış maddələr qarışır|Soğan yalnız havada fotosintezə başlayır|Yağlar tam buxarlanır|Duzlar qaz halına keçir',
 (16,23): 'Soğanın gözyaşardıcı maddəsinin gözə çatmasını hansı xüsusiyyət asanlaşdırır?|Uçuculuq|Kristallaşma|Suda tam həll olmamaq|Yalnız yüksək özlülük',
 (16,26): 'Allisinin quruluşunda qoxulu birləşmələri ilə seçilən hansı element var?|Kükürd|Dəmir|Kalsium|Natrium',
 (16,27): 'Şokoladın temperlənməsi əsasən nəyi idarə edir?|Kakao yağının kristallaşmasını|Şəkərin tam karamelləşməsini|Kakaonun fermentasiya müddətini|Süd zülalının tam parçalanmasını',
 (16,29): 'Ənənəvi ağ şokolad tünd şokoladdan hansı əsas tərkib fərqi ilə seçilir?|Yağsız kakao quru maddəsi olmur|Kakao yağı olmur|Heç bir şəkər olmur|Mütləq süd maddəsi olmur',
 (16,30): 'Düzgün temperləmə şokolada əsasən hansı xüsusiyyəti verir?|Parlaqlıq və yaxşı qırılma|Yumşaq yağ kimi axıcılıq|Şəffaflıq və şüşə görünüşü|Kakao qoxusunun tam yox olması',
 (16,32): 'Yumurta sarısını ağ hissənin mərkəzində saxlayan burulmuş tellər nə adlanır?|Xalazalar|Kutikulalar|Kapillyarlar|Tozcuq boruları',
 (16,33): 'Yumurtanın hava kamerası adətən hansı ucunda yerləşir?|Küt və iri ucunda|İti ucunda|Yalnız sarının ortasında|Hər iki ucda eyni böyük kamerada',
 (16,34): 'Yumurta saxlandıqca nəm itirəndə hava kamerası adətən necə dəyişir?|Böyüyür|Kiçilir|Tam maye ilə dolur|Mütləq iki yerə bölünür',
 (16,39): 'Soda ilə sirkənin reaksiyasında su və qazla yanaşı hansı duz yaranır?|Natrium asetat|Natrium xlorid|Kalsium sulfat|Kalium nitrat',
 (16,40): 'Soda–sirkə reaksiyasında maddələrdən biri tam tükənəndə niyə məhsul yaranması dayanır?|Reaksiya üçün digər tərəf çatışmır|Qalan maddə mütləq donur|Bütün atomlar yox olur|Suyun temperaturu mütləq sıfıra enir',
 (16,41): 'Təzyiqli qazanda suyun qaynama temperaturu niyə yüksəlir?|Su üzərində təzyiq artır|Suyun formulu dəyişir|Suyun həcmi mütləq ikiqat olur|Qazan istiliyi tam udmur',
 (16,43): 'Təzyiqli qazanda yeməyin sürətli bişməsinə əsas nə kömək edir?|Daha yüksək bişmə temperaturu|Daha aşağı bişmə temperaturu|Mütləq daha az su buxarı|Qidanın kütləsinin azalması',
 (16,44): 'Təzyiqli qazanın təhlükəsizlik klapanı əsasən nəyi məhdudlaşdırır?|Həddən artıq daxili təzyiqi|Yalnız qabın temperaturunu sıfırlayır|Yeməyin duzluluğunu|Qazanın altındakı alovun rəngini',
 (16,50): 'İnsan niyə sellülozanı nişasta kimi həzm etmir?|Uyğun sellülaza fermenti yoxdur|Sellüloza karbohidrat deyil|Sellüloza yalnız yağdır|Sellülozada qlükoza vahidləri yoxdur',
 (17,46): 'Paxlalı bitki kökündə rizobium bakteriyalarının yerləşdiyi xüsusi şişkin quruluş nədir?|Kök yumrucuğu|Çiçək tozluğu|Toxum ləpəsi|Gövdə buğumarası',
 (18,11): 'UDP-ni TCP-dən ayıran rabitə modeli hansıdır?|Bağlantısız dataqram modeli|Bağlantı əsaslı bayt axını|Yalnız yerli fayl modeli|Yalnız brauzer yaddaşı modeli',
 (18,12): 'Canlı danışıqda köhnə səs hissəsini yenidən gözləməkdənsə itkiyə dözmək üçün niyə UDP seçilə bilər?|Yenidən ötürmənin gözləmə yükünü azaltmağa kömək edir|Hər paketi özü mütləq şifrələyir|Hər paketi eyni sıra ilə çatdırmağa zəmanət verir|Səsi yalnız fayl kimi saxlayır',
 (18,38): 'HTTP sıxılmasında alıcı dəstəklədiyi sıxılma üsullarını hansı sorğu başlığı ilə bildirir?|Accept-Encoding|Content-Type|Authorization|Location',
 (18,40): 'Brotli sıxılmasının HTTP-də işlənən kodlama adı hansıdır?|br|bt|brot|bl',
 (19,30): 'Galileo-nun Yupiter atmosferinə göndərdiyi ayrıca zond ilk dəfə hansı işi gördü?|Atmosferdən birbaşa ölçmələr ötürdü|Yupiterdə torpaq nümunəsi qazdı|Yupiterin səthində avtomobil sürdü|Günəşə eniş etdi',
}
fixes.update({
 (3,29): 'Ədalətli sikkənin müstəqil atışlarında ardıcıl on dəfə gerb düşüb. Növbəti atışda gerb düşmə ehtimalı nədir?|1/2|1/11|10/11|0',
 (3,38): 'Siyahıdakı hər qiymətdən eyni ədədi çıxsaq, hansı göstərici dəyişməz?|Variasiya aralığı|Ədədi orta|Median|Ən kiçik qiymət',
 (4,7): 'Portiya ilə evlənmək üçün Bassanio neçə sandıqdan düzgününü seçməlidir?|3|2|4|5',
 (9,20): 'Bernulli tənliyində sürəti ehtiva edən hədd hansı enerji ilə bağlıdır?|Kinetik|Potensial cazibə|Kimyəvi|Elastik',
 (9,5): 'Sürüşmədən diyirlənən təkərin xətti sürəti bucaq sürəti və radiusdan necə tapılır?|Bucaq sürəti ilə radiusun hasili|Bucaq sürətinin radiusa nisbəti|Radiusun bucaq sürətinə nisbəti|Bucaq sürəti ilə radiusun cəmi',
 (9,27): 'Səsdən sürətli mənbənin sürəti artdıqca, digər şərtlər sabitkən Mach konusunun bucağı necə dəyişir?|Daralır|Genişlənir|Dəyişməz qalır|Mütləq düz bucaq olur',
 (9,30): 'Səsin sadə Doppler effektində tezlik dəyişməsi əsasən hansı hərəkətlə bağlıdır?|Mənbə ilə müşahidəçinin yaxınlaşıb-uzaqlaşması|Hər ikisinin birlikdə eyni sürətlə getməsi|Yalnız mənbənin öz oxunda fırlanması|Yalnız müşahidəçinin gözünü açması',
 (12,25): 'Qolf meydançasında xüsusi hazırlanmış qumlu çökəklik necə adlanır?|Bunker|Tee sahəsi|Putting green|Klub evi',
})
distractors={
 (1,8):['Hüceyrə divarının parçalanmasına','Elektron daşıma zəncirinin dayanmasına','Xromosomların ayrılmasına'],
 (1,14):['Yalnız amin turşusu istehsalına','Yalnız işıq udulmasına','Yalnız xromosomların düzülməsinə'],
 (1,21):['Yalnız membranın böyüməsini','Yalnız hüceyrənin bölünməsini','Yalnız passiv su axınını'],
 (1,25):['Temperatur və təzyiq fərqini','İşıq intensivliyi və rütubəti','Membran sahəsi və hüceyrə yaşını'],
 (1,26):['Aktivləşmə enerjisini artırır','Reaksiyanın tarazlıq sabitini mütləq dəyişir','Yalnız son məhsulu durulaşdırır'],
 (1,28):['Yalnız elektronlarının yükləri','Amin turşularının hamısının proton sayı','Zülalın mütləq karbon sayı'],
 (1,29):['Yalnız substratın artıq məhsuluna','Yalnız fermentdən uzaq məhlula','Yalnız hüceyrədənkənar suya'],
 (1,30):['Hər dövrdə mütləq tam sərf olunur','Hər reaksiyada mütləq məhsula bağlanıb qalır','Hər dövrdə mütləq yeni amin turşusuna çevrilir'],
 (1,32):['Bir altıkarbonlu nişastaya','Üç ikikarbonlu asetata','Bir dördkarbonlu sitrata'],
 (1,35):['Piruvatı ilkin qlükozaya qaytarmaq üçün','Oksigeni birbaşa bağlamaq üçün','Bütün ATP-ni dərhal ehtiyat kimi saxlamaq üçün'],
 (1,40):['İşıq enerjisini tam olaraq nüvəyə ötürərək','Bütün udulmuş enerjini yalnız yeni xlorofilə çevirərək','Fotosintezi gecəyə keçirərək'],
 (1,41):['Xromosomlar qütblərə ayrılır','Hüceyrə sitoplazması tam bölünür','Bölünmə iyi mütləq dağılır'],
 (1,43):['DNT-nin tək nukleotidləri','Membran lipidlərinin quyruqları','Meyoz I-dəki homoloji cütlər'],
 (1,46):['Sayını ikiqat artırmaq','Bütün xromosomları itirmək','Dəst sayını dəyişməz saxlamaq'],
 (2,18):['Duzluluğu mövsümdən asılı olmayaraq sabit saxlayır','Dənizdən axını daim artırır','Göldə buxarlanmanı həmişə gücləndirir'],
 (5,49):['Enir','Dəyişmir','Mütləq eyni miqdarda azalır'],
 (8,32):['Adətən artırır','Yükü mütləq dəyişməz saxlayır','Bütün hallarda yükü tam aradan qaldırır'],
 (9,2):['Kənarın xətti sürəti','Kənarın mərkəzəyönlü təcili','Bir dövrdə kənarın getdiyi yol'],
 (9,7):['Cismin kütləsi dəyişir','Dairənin radiusu fasiləsiz böyüyür','Cismin enerjisi mütləq azalır'],
 (9,16):['Artır','Mütləq sabit qalır','Yalnız mayenin rəngi ilə dəyişir'],
 (9,18):['Kütlənin saxlanması','Elektrik yükünün saxlanması','Impuls momentinin saxlanması'],
 (9,19):['Temperatur fərqini','Elektrik potensialını','Kimyəvi tərkib fərqini'],
 (9,26):['Səsin havadakı sürəti mütləq artır','Səsin amplitudu mütləq azalır','Sirenanın həqiqi tezliyi mütləq artır'],
 (9,31):['Yalnız daha yüksək tezlikli təsadüfi səs yaratmaqla','Qulaqlıqdakı havanın təzyiqini həmişə azaltmaqla','Səs dalğasının sürətini artırmaqla'],
 (9,42):['Azalır','Dəyişmir','Verilən istilikdən asılı olmayaraq eyni sabit qiymətə çatır'],
 (9,44):['Temperatur həmişə sabitdir','Həcm həmişə sabitdir','Təzyiq həmişə sabitdir'],
 (9,46):['Həmişə azalır','Həmişə dəyişməzdir','Həmişə sıfıra doğru gedir'],
 (9,48):['Yalnız daha soyuq qaz','Yalnız qalın izolyasiya','Yalnız böyük daxili həcm'],
 (10,4):['Ayın səthi istiliyindən','Yalnız yay günəşinin istiliyindən','Okeanın dərinlik cərəyanından'],
 (10,5):['Yalnız müasir quşların miqrasiyasını','Yalnız indiki çayların sürətini','Yalnız dəniz duzunun kimyasını'],
 (10,7):['Şirin su','Distillə olunmuş su','Doymuş duz məhlulu'],
 (10,17):['Yalnız hərbi istehkamları','Yalnız liman anbarlarını','Yalnız kənd təsərrüfatı terraslarını'],
 (10,25):['Yalnız müdafiə divarlarının qalınlığını','Yalnız metal emalını','Yalnız astronomik müşahidəni'],
 (10,32):['2','4','5'],
 (10,33):['Yalnız mərmər heykəl qalereyaları','Yalnız labirint yollar','Yalnız quru daş həyətlər'],
 (10,34):['Rəngli kərpic şəbəkəsi','Yalnız taxta oyma','Yalnız qızıl dəri örtüyü'],
 (10,35):['Qara bazalt','Ağ qranit','Yaşıl nefrit'],
 (10,37):['Yalnız taxıl','Yalnız dəri','Yalnız məişət qabları'],
 (10,40):['Klassik mərmər memarlığı','Taxta karkas memarlığı','Tam bişmiş kərpic və şüşə memarlığı'],
 (10,41):['Yalnız hərbi müşahidə üçün','Yeraltı soyuq hava saxlamaq üçün','Qum fırtınasını daim dayandırmaq üçün'],
 (10,48):['Müasir polad ərintisi','Yalnız şüşə lif','Yalnız dəmir-beton'],
 (10,49):['Yalnız yazılı hüquqi sənəd','Yalnız divar boyası','Yalnız insan skeletinin hissəsi'],
 (11,5):['Yalnız mineral hasilatı ilə','Yalnız şirin su ehtiyatı ilə','Yalnız sahilyanı şəhərsalma ilə'],
 (11,10):['Süxurun hər saat kimyəvi tərkibini dəyişməsi','Qayanın hər gün yeni qat əmələ gətirməsi','Yalnız küləyin istiqaməti'],
 (11,14):['Yalnız fəal vulkanlar','Yalnız sönmüş vulkanlar','Yalnız palçıq vulkanları'],
 (11,18):['Sualtı ov etməsi','Yalnız ağacda yuvalaması','Tam köçəri quş olması'],
 (11,35):['Kral sarayı','Saat qülləsi','Müdafiə kazarması'],
 (13,12):['Atom nüvələrinin proton sayı','Maddənin element kimliyi','Molekulların mütləq atom sayı'],
 (13,20):['Yalnız planet orbitlərinin formasının','Yalnız qalaktikaların fırlanma istiqamətinin','Yalnız ulduzların Yerə məsafəsinin'],
 (13,46):['Barıt','TNT','Napalm'],
 (14,47):['Yalnız daşınan və qatlanan','Yalnız silindrik və üfüqi','Yalnız elektrikli və qazlı'],
 (16,40):['İstənilən artıq maddə məhsulu yenə yaradır','Qaz özü bütün sodanı yenidən yaradır','Qalan maddə digər reaktantı avtomatik əvəz edir'],
 (18,1):['Şəklin alternativ mətni','Səhifənin fon rəngi','Faylın çap miqyası'],
 (18,2):['Kukinin şəbəkə ilə göndərilməsini tam dayandırmaq','Kukinin adını şifrələmək','Kukini bütün domenlərə yaymaq'],
 (18,4):['Kukinin diskdəki sıxılmasını','Kukinin maksimum mətn uzunluğunu','Kukinin şrift ölçüsünü'],
 (18,13):['Paketin yalnız fiziki kabelini','Şəklin rəng dərinliyini','Mətnin əlifbasını'],
 (18,19):['Biri yalnız CSS, digəri yalnız DNS daşıyır','Biri server, digəri brauzer paroludur','Hər ikisi yalnız görünən mətn üçündür'],
 (18,35):['Təxminən üçdəbir azalır','Həmişə dəyişməz qalır','Təxminən iki dəfə artır'],
 (18,43):['Yalnız videonun mətnini sıxmağı','Yalnız görüntünü böyütməyi','Yalnız şəbəkə paketlərini sıralamağı'],
 (18,44):['Bəli, müvəqqəti məhdudiyyətlərdə işə yaramır','Bəli, yalnız bir ekran oxuyucusunda mümkündür','Bəli, yalnız çap sənədinə aiddir'],
 (18,45):['Yalnız faylın ötürülmə ölçüsünü','Yalnız cihazın yaddaş həcmini','Yalnız ekranın fiziki qüsurunu'],
 (18,49):['Şəklin rəng tərkibini dəyişdirə bilər','Şəbəkə portunu öz-özünə dəyişdirir','Fayl formatını mütləq çevirir'],
 (19,1):['Ay modulunun paraşüt nasazlığı','Ay avtomobilinin batareya nasazlığı','Günəş panelinin mexaniki sınması'],
 (19,24):['Teleskopun hər il yeni raketə keçirilməsini','Teleskopun Ayda sabitləşdirilməsini','Teleskopun hər orbitdə yerüstü güzgü ilə birləşməsini'],
 (19,33):['Yalnız görünən rəngini','Yalnız Yerə olan məsafəsini','Yalnız Saturnun sutkasını'],
 (19,37):['Sürətini artırmaq','Orbiti dəyişmədən sadəcə mühərriki söndürmək','Yalnız radio tezliyini azaltmaq'],
 (19,38):['Aparatın məlumatı ümumiyyətlə ötürə bilməməsi','Kameranın optik fokusunun olmaması','Yupiterin cazibəsinin gecikməsi'],
 (19,50):['Nümunənin kütləsini ölçmək həmişə mümkünsüzləşərdi','Molekulların mənşəyini araşdırmağa ehtiyac qalmazdı','Bennunun formasını Yerdən müşahidə etmək mümkün olmazdı'],
}
typos={'şəkildədədir':'şəkildədir','Ta yqa':'Tayqa','Sardin iya':'Sardiniya','Alber t':'Albert','hak imə':'hakimə','Mant ar':'Mantar','mərkəzəqaçma':'mərkəzəyönlü','Mərkəzəqaçma':'Mərkəzəyönlü','Dayanıqlı dalğada':'Durğun dalğada','dayanıqlı dalğa':'durğun dalğa','Impuls':'İmpuls'}
hard = {
3:[8,12,15,17,22,30,38,40,46],4:[1,3,4,7,9,10,13,14,15,18,19,20,23,24,25,26,27,28,29,31,32,33,34,35,37,39,41,42,43,44,45,48,49],
5:[8,9,10,15,17,18,25,30,31,32,33,34,35,38,43,45,46,47,48,50],6:[13,15,26,30,33,35,39,43,50],7:[11,12,16,20,30,34,48,50],8:[3,4,7,8,10,19,20,22,23,24,30,34,39,40,44,45,48,49,50],
9:[5,14,17,18,19,20,24,29,35,38,39,40,43,44,45,46,49],10:[10,20,25,27,29,30,32,34,35,36,37,40,42,44,46,47,48,49,50],11:[7,12,14,15,17,19,20,22,23,24,25,27,28,29,30,33,34,35,38,40,44,45,49],
12:[4,5,8,10,12,14,17,18,20,24,25,36,37,38,39,40],13:[1,4,5,6,8,9,10,12,15,16,17,19,20,23,24,28,29,30,31,32,33,34,35,39,40,44,45,47,48,50],14:[4,5,15,16,19,20,23,24,27,29,33,34,35,38,40,47,50],
15:[3,4,7,8,9,10,12,14,20,22,25,29,30,32,35,38,39,43,45,47],16:[5,9,15,20,21,24,25,28,31,32,39,49],17:[3,5,8,9,15,19,20,21,22,23,30,35,45,46],18:[2,3,4,5,7,8,14,15,19,20,22,24,25,27,28,29,30,32,37,38,40,46,47,48,49,50],
19:[2,4,5,6,7,8,10,15,19,20,23,24,25,28,29,30,33,35,38,39,40,43,44,45,47,48,49],20:[15,21,22,25,29,30,34,43,44]
}
easy = {3:[4,5,6,9,13,16,18,19,20,23,24,26,31,34,35,36,43,45,48,49,50],5:[1,4,6,21,22,24],7:[3,5,8,9,10,18,19,21,22,23,25,27,29,31,32,33,35,36,37,38,39,40,41,42,43,44,45,46,47],12:[45],14:[41],15:[18],16:[6],17:[13],18:[16,21],19:[16]}
extras = {
'T8NORMAL': ('https://www.unicode.org/reports/tr15/','Unicode — Mətnin normallaşdırılması','Normallaşdırma formaları'),
'T8STATUS404': ('https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404','MDN — 404 Not Found','Resursun tapılmaması'),
'T8STATUS200': ('https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/200','MDN — 200 OK','Uğurlu cavab'),
'NB13SANGER1958': ('https://www.nobelprize.org/uploads/2018/06/sanger-lecture.pdf','Nobel — Sangerin 1958 mühazirəsi','İnsulinin quruluşu'),
'NB13RAMANLECT': ('https://www.nobelprize.org/uploads/2018/06/raman-lecture.pdf','Nobel — Raman mühazirəsi','Molekulyar rəqslərin səpilmə spektri'),
'NB13ROGER': ('https://www.nobelprize.org/prizes/chemistry/2006/kornberg/facts/','Nobel — Rocer Kornberq','Ata və oğul Nobel laureatları'),
'NB13LIPMANN': ('https://www.nobelprize.org/uploads/2018/06/lipmann-lecture.pdf','Nobel — Lipmann mühazirəsi','Koenzim A və asil qrupları'),
'NB13PAULING54': ('https://www.nobelprize.org/prizes/chemistry/1954/summary/','Nobel — 1954 kimya mükafatı','Kimyəvi rabitə'),
'AR15KLIMTGOLD': ('https://www.belvedere.at/en/stories/why-did-gustav-klimt-use-gold','Belvedere — Klimt niyə qızıldan istifadə edirdi?','Ailə və qızıl sənətkarlığı'),
'AR15MENINASMET': ('https://www.metmuseum.org/art/collection/search/652745','Metropolitan Museum — Las Meninas təsvirinin qravürü','Mərkəzi fiqur, rəssam və güzgü'),
'FD16COFFEINE': ('https://www.acs.org/molecule-of-the-week/archive/c/caffeine.html','ACS — Kofein','Alkaloid və təbii mənbələr'),
'FD16HONEYCRYST': ('https://pubs.acs.org/doi/10.1021/acsomega.4c00570','ACS Omega — Balın kristallaşması','Qlükoza və fiziki dəyişmə'),
'FD16WHITE': ('https://pubs.acs.org/doi/10.1021/acs.jchemed.5c01134','ACS J. Chem. Educ. — Şokoladın kimyəvi tərkibi','Ağ şokolad və kakao maddələri'),
'FD16IRON': ('https://pubs.acs.org/doi/10.1021/ed085p399','ACS J. Chem. Educ. — Yumurta sarısında dəmir','Dəmirin sarıda cəmlənməsi'),
'TC18HTTPZIP': ('https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Compression','MDN — HTTP sıxılması','Kodlamanın razılaşdırılması və br'),
'USGA12BUNKER': ('https://rules.usga.org/courses/rules-for-teams-2025/lessons/play-the-course-as-you-find-it-2/topic/what-are-the-areas-of-the-course-and-how-are-they-defined/','USGA — Qolf meydançasının sahələri','Bunker və qumlu sahə'),
}
source_override={(8,13):'T8STATUS404',(8,14):'T8STATUS200',(8,23):'T8NORMAL',(12,25):'USGA12BUNKER',(13,1):'NB13SANGER1958',(13,15):'NB13RAMANLECT',(13,30):'NB13LIPMANN',(13,34):'NB13ROGER',(13,38):'NB13PAULING54',(13,39):'NB13PAULING54',(15,12):'AR15MENINASMET',(15,13):'AR15MENINASMET',(15,14):'AR15MENINASMET',(15,20):'AR15KLIMTGOLD',(16,14):'FD16HONEYCRYST',(16,15):'FD16HONEYCRYST',(16,20):'FD16COFFEINE',(16,29):'FD16WHITE',(16,35):'FD16IRON',(18,38):'TC18HTTPZIP',(18,40):'TC18HTTPZIP'}
for key,(url,title,section) in extras.items(): sources[key]={'url':url,'title':title,'section':section}
cal_solutions=[
'1,25 × 0,80 = 1; ilkin qiymət alınır.',
'Bərabər iki alış qiymətini x götürdük: satış 1,5x + 0,5x = 2x, alış da 2x-dir.',
'8 və 9 qarşılıqlı sadədir; 100-dən kiçik yeganə müsbət ortaq qat 72-dir.',
'İki ardıcıl tam ədəddən biri cütdür; hasil cütdür.',
'İki tək ədəd 2a+1 və 2b+1-dir; cəmləri 2(a+b+1) olur.',
'(n−1)+n+(n+1)=3n; cəm 3-ə bölünür.',
'Cüt ədədin kvadratı cütdür; kvadratı tək olan tam ədəd təkdir.',
'x(20−x)=100−(x−10)²; maksimum 100-dür.',
'Sahə tərəfin kvadratı ilə dəyişir: 2²=4.',
'Həcm tilin kubu ilə dəyişir: 3³=27.',
'Dairə sahəsi πr²-dir: radiusun yarıya enməsi sahəni dörddəbir edir.',
'Oxşar fiqurların sahə nisbəti tərəf nisbətinin kvadratıdır: 4:9.',
'180−35−65=80 dərəcə.',
'Düzgün altıbucaqlının daxili bucağı (6−2)×180/6=120 dərəcə.',
'Beşbucaqlının diaqonal sayı 5×(5−3)/2=5-dir.',
'2(6+x)=30 olduğundan x=9.',
'Qeyri-bərabər yanma sürətində uzunluq payı vaxt payını müəyyən etmir.',
'Qalan bir açarı bir qapıda sınamaq kifayətdir; nəticə digər uyğunluğu da müəyyən edir.',
'Hədiyyələr istiqamətlidir: 5 nəfər × 4 alıcı = 20.',
'Hər nəfər bir məktub yazır: 6×1=6.',
'Üç müstəqil ikili mövqe 2³=8 vəziyyət yaradır.',
'Əvvəl 3 və 5 top var; birini 5-dən 3-ə keçirmək 4 və 4 edir.',
'Dörd fərqli kitab üçün 4!=24 sıra var.',
'Üç nəfərdən iki nəfərlik seçim 3×2/2=3-dür.',
'Dairədə altı qonşuluq kənarı var; hər kənar bir əl sıxmadır.',
'Ağ top ehtimalı 12/(12+8)=3/5-dir.',
'Uyğun zər nəticələri 4 və 6-dır: 2/6=1/3.',
'İki zərin 36 bərabər ehtimallı cütündən 6-sında rəqəmlər eynidir: 1/6.',
'Atışlar müstəqildir; keçmiş nəticə növbəti ədalətli atışın 1/2 ehtimalını dəyişmir.',
'Cüt olduğu məlum nəticələr 2,4,6-dır; yalnız biri 6-dır, ehtimal 1/3.',
'Yekun sıralamada qabaqda olma münasibəti tranzitivdir: A>B və B>C-dən A>C.',
'Ağ çiçəklərin lalə olduğu verilməyib; bəzi lalələrin ağ olması məcburi nəticə deyil.',
'A fiqurları kvadratdır və heç bir kvadrat dairə deyil; A fiqurları da dairə deyil.',
'Yağış ⇒ yaş yol şərtinin əks müqabili: quru yol ⇒ yağış yoxdur.',
'Məntiqi VƏ yalnız hər iki qiymət doğru olduqda doğrudur.',
'İki ədədin cəmi orta qiymətin ikiqatıdır: 2×7=14.',
'Median 4-dür; 100-ün böyüdülməsi medianı dəyişmir, cəmi və ortanı dəyişir.',
'(maksimum−c)−(minimum−c)=maksimum−minimum; aralıq dəyişmir.',
'n=5k+3 olduqda 2n=10k+6=5(2k+1)+1; qalıq 1-dir.',
'1,10,11,12 yazılışlarında 1 rəqəmi 1+1+2+1=5 dəfə var.',
'Birgə saatlıq məhsuldarlıq 1/6+1/12=1/4; vaxt 4 saatdır.',
'(10k+5)²=100k(k+1)+25; son iki rəqəm 25-dir.',
'150/60=2,5 saat.',
'72×1000/3600=20 metr/saniyə.',
'7×2=14 kilometr.',
'İşarəli dişlərin birlikdə qayıtması üçün ƏKOB(12,18)=36 diş keçidi lazımdır.',
'Duz kütləsi 10 qram qalır, ümumi məhlul 200 qram olur; 10/200×100=5%.',
'50 qramın 20%-i 50×0,20=10 qramdır.',
'12/0,40=30.',
'Artım 20-dir; 20/80×100=25%.',
]
assert len(cal_solutions)==50
records=[]
for pack in range(1,21):
    file=drafts/f'pack-{pack:03}.txt'
    lines=file.read_text(encoding='utf-8').splitlines()
    row=0
    rewritten=[]
    for raw in lines:
        for old,new in typos.items(): raw=raw.replace(old,new)
        if not raw.strip(): continue
        if raw.startswith('@'):
            category, sid, url, title, section=raw[1:].split('|')
            if sid not in sources: sources[sid]={'url':url or None,'title':title,'section':section}
            if sid=='FD16I': sources[sid]['url']='https://www.acs.org/middleschoolchemistry/simulations/chapter6/lesson2.html'
            if sid=='PH9B': sources[sid]['title']=title
            rewritten.append(raw)
            continue
        row+=1
        fields=raw.split('|')
        if len(fields)==7:
            difficulty,factkey,*payload=fields
        else:
            assert len(fields)==5, (pack,row,len(fields))
            difficulty='çətin' if row in hard.get(pack,[]) else 'asan' if row in easy.get(pack,[]) else 'orta'
            factkey=f'new1000-p{pack:02}-r{row:02}'
            payload=fields
        if (pack,row) in fixes:
            payload=fixes[pack,row].split('|')
        if (pack,row) in distractors:
            payload=payload[:2]+distractors[pack,row]
        assert len(payload)==5 and len(set(payload[1:]))==4,(pack,row,payload)
        chosen_sid=source_override.get((pack,row),sid)
        if chosen_sid=='CAL': note=cal_solutions[row-1]
        elif chosen_sid=='LANG': note='Müəllif nümunəsinin mənası və qrammatik quruluşu təhlil edilib; dörd variant tutuşdurulub.'
        else: note=f'Mənbədəki {sources[chosen_sid]["section"]} mövzusu ilə tutuşdurulub; cavab və variantlar redaktə edilib.'
        records.append(dict(pack=pack,row=row,category=category,difficulty=difficulty,factKey=factkey,question=payload[0],correct=payload[1],wrong=payload[2:],sourceId=chosen_sid,note=note))
        rewritten.append('|'.join([difficulty,factkey,*payload]))
    assert row==50,(pack,row)
    # The drafts themselves remain readable and carry the reviewed difficulty and stable key.
    file.write_text('\n'.join(rewritten)+'\n',encoding='utf-8')
assert len(records)==1000
old=[json.loads(l) for l in (root/'qa/previous-850.jsonl').read_text(encoding='utf-8').splitlines()]
assert len(old)==850
assert all(sources[k]==v for k,v in json.loads(baseline.read_text(encoding='utf-8')).items()), 'Old source metadata changed'
for i in range(20):
    rows=records[i*50:(i+1)*50]
    text='\n'.join('|'.join([q['category'],q['difficulty'],q['factKey'],q['question'],q['correct'],*q['wrong'],q['sourceId'],q['note']]) for q in rows)+'\n'
    (root/'batches'/f'batch-{19+i:03}.txt').write_text(text,encoding='utf-8')
(root/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'qa/new-1000-editorial.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'newQuestions':len(records),'byDifficulty':dict(Counter(q['difficulty'] for q in records)),'newSources':len(sources)-len(old_sources),'correctedRows':len(fixes),'batches':'019–038'},ensure_ascii=False))
