import json, re
from pathlib import Path
from collections import Counter, defaultdict
root=Path(__file__).resolve().parent.parent
def source(url,title,section):
    return dict(url=url,title=title,section=section)
additions={
 'AND16': source('https://www.invent.org/inductees/mary-anderson','NIHF — Meri Andersonun şüşəsiləni','Tramvay; Nyu-York; əl qolu; 1903 patent'),
 'LAM16': source('https://www.invent.org/inductees/hedy-lamarr','NIHF — Hedi Lamarrın rabitə sistemi','Aktrisa; tezlik dəyişmə; torpedo; 1942; sinxronlaşma'),
 'ANT16': source('https://www.invent.org/inductees/george-antheil','NIHF — Corc Anteyl və musiqidən rabitəyə keçid','Bəstəkar; pianonun 88 düyməsi və tezlik cədvəli'),
 'ZIP16': source('https://www.invent.org/inductees/gideon-sundback','NIHF — Gideon Sundbek və fermuar','Judsonun layihəsinin təkmilləşməsi; dişcik sayı; sürgü; zipper adı'),
 'BAK16': source('https://www.invent.org/inductees/leo-hendrik-baekeland','NIHF — Bekeland və bakelit','Bakelit ixtiraçısı'),
 'BAH16': source('https://www.sciencehistory.org/education/scientific-biographies/leo-hendrik-baekeland/','Science History Institute — Sintetik plastik və fotoqrafik kağız','İlk tam sintetik plastik; fenol-formaldehid; şellak; Velox qaz işığında'),
 'XER16': source('https://www.invent.org/inductees/chester-f-carlson','NIHF — Karlson və kseroqrafiya','Patent surətləri; elektrostatika; 1938 ilk quru surət'),
 'TRA16': source('https://www.computerhistory.org/siliconengine/invention-of-the-point-contact-transistor/','Computer History Museum — İlk nöqtə-kontaktlı tranzistor','1947; germanium; Bell Labs; iki qızıl kontakt'),
 'BAR16': source('https://www.invent.org/inductees/john-bardeen','NIHF — Bardin və tranzistor','Vakuum lampası ilə müqayisə; 1956 və 1972 fizika mükafatları'),
 'BCS16': source('https://www.nobelprize.org/prizes/physics/1972/summary/','Nobel Foundation — 1972 fizika mükafatı','Bardeen, Cooper və Schrieffer; BCS superkeçiricilik nəzəriyyəsi'),
 'KEV16': source('https://www.invent.org/inductees/stephanie-louise-kwolek','NIHF — Kvolek və Kevlar','Para-aramid polimer lifi; eyni çəki üçün poladla müqayisə'),
 'KWH16': source('https://www.sciencehistory.org/education/scientific-biographies/stephanie-l-kwolek/','Science History Institute — Kvolekin polimer məhlulları','Maye kristallı məhlulların güclü liflərə əyirilməsi'),
 'FRY16': source('https://www.invent.org/inductees/arthur-l-fry','NIHF — Art Fray və yapışqan qeydlər','Xor kitabındakı nişanlar; 1977 Press n Peel; 1980 geniş satış'),
 'SIL16': source('https://www.invent.org/inductees/spencer-silver','NIHF — Spenser Silverin yapışqanı','Akril yapışqan və xırda kürəciklər'),
 'TEF16': source('https://www.invent.org/inductees/roy-j-plunkett','NIHF — Plankett və Teflon','Soyuducu qazlar üzrə tədqiqat'),
 'TFH16': source('https://www.sciencehistory.org/education/scientific-biographies/roy-j-plunkett/','Science History Institute — Teflonun təsadüfi kəşfi','Qaz balonu; ağ toz; polimerləşmə; az sürtünmə; 1951 hədiyyə'),
 'GLU16': source('https://www.invent.org/inductees/harry-w-coover','NIHF — Kuver və super yapışqan','Sianoakrilat; optik nişangah plastiki; Eastman Kodak'),
}
sources=json.loads((root/'sources.json').read_text(encoding='utf-8'))
for key,value in additions.items():
    assert key not in sources or sources[key]==value
sources.update(additions)
(root/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'qa/sources-016.json').write_text(json.dumps(additions,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

p=root/'batches/batch-016.txt'
rows=[line.split('|') for line in p.read_text(encoding='utf-8').splitlines()]
assert len(rows)==50
for f in rows:
    if f[2]=='bcs-theory-initials-three-scientists':
        f[3]='Superkeçiriciliyin BCS nəzəriyyəsi adını hansı alim üçlüyündən alır?'
    if f[2]=='teflon-low-surface-friction-nonstick':
        f[7]='Səthində daimi ərimiş metal qatının olması'
    if f[2]=='bakelite-leo-baekeland-inventor':
        f[3]='Köhnə telefon gövdələrindən zərgərlik əşyalarına qədər işlədilmiş bakeliti hansı kimyaçı yaradıb?'
        f[4:8]=['Leo Bekeland','Roy Plankett','Harri Kuver','Çester Karlson']
    if f[2]=='lamarr-antheil-frequency-hopping-anti-jamming':
        f[5:8]=['Siqnalı tamamilə ultrasəsə çevirmək','Siqnalı yalnız tək istiqamətdə yaymaq','Radio dalğasının yayılma sürətini artırmaq']
    if f[2]=='zipper-slider-brings-two-teeth-rows-together':
        f[5:8]=['İki parçanı qızdırıb qaynaq etmək','Dişcikləri hər dəfə yenidən kəsmək','Dişcikləri maqnit sahəsi ilə saxlamaq']
    if f[2]=='postit-adhesive-tiny-microspheres':
        f[5:8]=['Uzun metal iynələrdən ibarət olması','İri duz kristallarından ibarət olması','Qapalı hava qabarcıqlarından ibarət olması']
    if f[2]=='velox-photographic-paper-artificial-gas-light':
        f[5:8]=['Şəkli heç bir işıq olmadan özü çəkməsi','Şəkli yalnız ultrabənövşəyi işıqda verməsi','Şəkli yalnız rentgen şüası ilə verməsi']
    assert len(f)==10 and f[8] in sources and len(f[3])<=320 and len(set(f[4:8]))==4
p.write_text('\n'.join('|'.join(f) for f in rows)+'\n',encoding='utf-8')

manifest=json.loads((root/'reviewed-batches.json').read_text(encoding='utf-8'))
manifest[p.name]=dict(reviewed=True,checkedAt='2026-10-05')
(root/'reviewed-batches.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
record=dict(batch=p.name,questions=50,difficulty=dict(Counter(f[1] for f in rows)),
            review='Mənbədəki faktlar, variantların unikallığı, mətnin Azərbaycan dilində olması və əvvəlki dəstələrlə məna fərqləri nəzərdən keçirilib. İxtiraçının başqa faktını soruşmaq eyni faktın tərsinə təkrarı sayılmır.',
            notes=['Post-it yapışqanının kəşf ili mənbələrdə fərqli verildiyi üçün soruşulmayıb.',
                   'Teflon və super yapışqan haqqında sağlamlıq və istifadə məsləhəti verilməyib.',
                   'Bardinin yalnız konkret 1956 və 1972 mükafatları soruşulub.',
                   'Eyni mövzulu sualların bir oyunda toplanmaması sonradan seçim mexanizmində tətbiq edilməlidir.'])
(root/'qa/review-016.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(record,ensure_ascii=False))
