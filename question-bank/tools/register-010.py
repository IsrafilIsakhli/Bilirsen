import json
from pathlib import Path
root = Path(__file__).resolve().parent.parent
sources = json.loads((root/'sources.json').read_text(encoding='utf-8'))
new = {
 'VFL': ('https://www.kew.org/read-and-watch/carnivorous-plants', 'Kew — Ətyeyən bitkilər', 'Qida elementləri; küpə, yapışqan və sualtı tələlər'),
 'VFS': ('https://www.kew.org/plants/venus-flytrap', 'Kew — Venera milçəktutanı', 'Tətiklənmə və təbii yayılma; axtarış indeksindəki mətn'),
 'MAN': ('https://oceanservice.noaa.gov/education/tutorial_estuaries/est07_adaptations.html', 'NOAA — Estuarilərdə yaşama uyğunlaşmaları', 'Manqrovlar'),
 'KLP': ('https://ocean.si.edu/kelp-and-kelp-forests', 'Smithsonian Ocean — Kelp və kelp meşələri', 'Macroalgae; Anatomy; Urchin barrens'),
 'OTT': ('https://nationalzoo.si.edu/news/smithsonian-study-reveals-tool-using-sea-otters-not-closely-related', 'Smithsonian — Dəniz samurlarının alət işlətməsi', 'Daşlarla qabığın açılması'),
 'EPI': ('https://www.kew.org/plants/leopard-orchid', 'Kew — Bəbir səhləbi', 'Epifitlik və hava kökləri; axtarış indeksindəki mətn'),
 'CUC': ('https://www.nhm.ac.uk/discover/news/2023/june/uk-cuckoos-unable-adjust-migrations-keep-up-climate-change.html', 'Natural History Museum — Ququ quşları', 'Yuva parazitliyi; yumurta təqlidi'),
 'CTL': ('https://pubmed.ncbi.nlm.nih.gov/23474299/', 'Vision Research, 2013 — Mürəkkəb balığının W formalı bəbəyi', 'Abstract; axtarış indeksindəki mətn'),
 'WFR': ('https://www.uaf.edu/news/archives/news-archives-2010-2021/alaska-frogs.php', 'University of Alaska Fairbanks — Meşə qurbağaları və qlükoza', 'Larson və Barnes tədqiqatının izahı'),
 'TIT': ('https://www.kew.org/read-and-watch/titan-arum-in-bloom', 'Kew — Titan arumun çiçəklənməsi', 'Sumatra; qoxu; çiçək qrupu; termal kamera'),
 'MIM': ('https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A313242-2/general-information', 'Kew — Mimosa pudica', 'Toxunuş və daxili su hərəkəti'),
 'BUT': ('https://www.nhm.ac.uk/discover/spotlight-blue-morpho.html', 'Natural History Museum — Mavi morfo', 'Structural colour'),
 'HSC': ('https://oceanservice.noaa.gov/facts/horseshoe-crab.html', 'NOAA — Qılıncquyruqlar həqiqi xərçəngdirmi?', 'Qohumluq və quyruğun funksiyası'),
 'MON2': ('https://www.nps.gov/articles/000/protecting-western-monarchs.htm', 'US National Park Service — Qərb monarxlarının qorunması', 'Nektar; yumurta yeri; tozlanma'),
 'VNI': ('https://www.kew.org/read-and-watch/vanilla-digitisation', 'Kew — Vanil və digər səhləblər', 'Vanil meyvələri; Albius; səhləb kökləri'),
 'BEE': ('https://www.sciencedirect.com/science/article/pii/S0003347221003869', 'Animal Behaviour — Bal arısının titrəmə rəqsi, 2022', 'Abstract; istiqamət və məsafə; axtarış indeksindəki mətn'),
 'BNF': ('https://www.nobelprize.org/prizes/medicine/1973/press-release/', 'Nobel komitəsi — 1973-cü il fiziologiya və tibb mükafatı', 'Karl fon Friş və arı dili'),
 'CAM': ('https://www.fao.org/4/x1700t/x1700t05.htm', 'FAO — İkihörgüclü dəvə', 'Hörgüclər və piy ehtiyatı'),
 'PEN': ('https://legacy.bas.ac.uk/about_antarctica/wildlife/birds/penguins/emperor.php', 'British Antarctic Survey — İmperator pinqvini', 'İnkubasiya; qış; sıx qrupda istilik'),
 'BAN': ('https://www.kew.org/plants/cavendish-banana', 'Kew — Kavendiş bananı', 'Nəhəng ot bitkisi; axtarış indeksindəki mətn'),
 'BAM': ('https://www.kew.org/read-and-watch/bamboo-kew-pandas', 'Kew — Bambuk haqqında', 'Poaceae ailəsi'),
 'PIN': ('https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A12322-2/general-information', 'Kew — Ananas comosus', 'Fruits; çoxlu çiçəkdən meyvə; axtarış indeksindəki mətn'),
}
for key, (url, title, section) in new.items():
    assert key not in sources, key
    sources[key] = dict(url=url, title=title, section=section)
(root/'sources.json').write_text(json.dumps(sources, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
batch = root/'batches/batch-010.txt'
text = batch.read_text(encoding='utf-8')
text = text.replace('|VFL|Təbii yayılma', '|VFS|Təbii yayılma')
text = text.replace('|VAN|', '|VNI|')
batch.write_text(text, encoding='utf-8')
reviewed = json.loads((root/'reviewed-batches.json').read_text(encoding='utf-8'))
reviewed[batch.name] = dict(reviewed=True, checkedAt='2026-10-05')
(root/'reviewed-batches.json').write_text(json.dumps(reviewed, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps({'newQuestions':len(text.splitlines()),'sourceCount':len(sources)}))
