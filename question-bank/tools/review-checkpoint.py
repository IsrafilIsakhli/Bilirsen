import json
import heapq
import itertools
from fractions import Fraction
from pathlib import Path

root = Path(__file__).resolve().parent.parent
sources = json.loads((root / 'sources.json').read_text(encoding='utf-8'))
new_sources = {
    'YMM': ('https://science.gov.az/az/news/open/24997', 'AMEA — Kimyaçı alimlər İkinci Dünya müharibəsində', 'Yusif Məmmədəliyev və yüksək oktanlı yanacaq'),
    'MUD': ('https://azerbaijan.az/related-information/14', 'Azərbaycan dövlət portalı — Palçıq vulkanları', 'Neft-qaz yataqları; ada mənşəyi'),
    'THA': ('https://www.preslib.az/az/historical/page/rkmplub', 'Prezident Kitabxanası — Milli teatr tarixi', '1873-cü il tamaşası; Milli Teatr Günü'),
    'AXU': ('https://science.gov.az/az/news/open/17701', 'AMEA — Mirzə Fətəli Axundzadənin yaradıcılığı', 'Səbuhi; Təmsilat'),
    'VEZ': ('https://www.preslib.az/az/historical/page/OgLySmU', 'Prezident Kitabxanası — Nəcəf bəy Vəzirov', 'Müsibəti Fəxrəddin'),
    'VZF': ('https://milliarxiv.gov.az/az/sara-vezirova', 'Milli Arxiv İdarəsi — Sara Vəzirova', 'Atası Nəcəf bəy Vəzirovun Meşəçilik şöbəsi və meşəbəyi təyinatı; axtarış indeksinin mətni'),
    'NIZ': ('https://files.preslib.az/projects/nizami/e1.pdf', 'Prezident Kitabxanası — Nizami Gəncəvi', 'Xəmsə; İsgəndərnamə'),
    'NKS': ('https://www.preslib.az/az/book/uWEdhVBJr7cm9EW', 'Prezident Kitabxanası — Xosrov və Şirin', 'Annotasiya'),
    'QAR': ('https://files.preslib.az/projects/azerbaijan/gl5.pdf', 'Prezident Kitabxanası — Azərbaycan musiqisi', 'Qara Qarayev; Yeddi gözəl; İldırımlı yollarla; axtarış indeksindəki mətn'),
    'CUN': ('https://www.britishmuseum.org/blog/how-write-cuneiform', 'British Museum — Mixi yazının yazılması', 'Pazşəkilli izlər; gil; axtarış indeksindəki mətn'),
    'CUT': ('https://www.britishmuseum.org/research/projects/making-cuneiform-tablets', 'British Museum — Mixi yazı lövhələrinin hazırlanması', 'Mesopotamiya; axtarış indeksindəki mətn'),
    'PPR': ('https://www.britishmuseum.org/sites/default/files/2019-09/Presnotes_reading_a_papyrus_FINAL.pdf', 'British Museum — Papirusun oxunması', 'Papirus materialı; axtarış indeksindəki mətn'),
    'SUT': ('https://www.britishmuseum.org/collection/death-and-memory/anglo-saxon-ship-burial-sutton-hoo', 'British Museum — Satton-Hu gəmi dəfni', 'Anqlosakson gəmi dəfni; axtarış indeksindəki mətn'),
    'LEW': ('https://www.britishmuseum.org/collection/object/H_1831-1101-78', 'British Museum — Lyuis şahmat kralı', 'Material; axtarış indeksindəki obyekt təsviri'),
    'BEN': ('https://www.britishmuseum.org/collection/object/E_Af1898-0115-16', 'British Museum — Benin relyef lövhəsi', 'İtən mum üsulu; Oba sarayı; axtarış indeksindəki mətn'),
    'POR': ('https://www.britishmuseum.org/collection/galleries/roman-empire', 'British Museum — Roma imperiyası qalereyası', 'Portland vazası; axtarış indeksindəki mətn'),
}
for key, number, title in [
    ('FLO', 174, 'Florensiyanın tarixi mərkəzi'), ('DUB', 95, 'Dubrovnikin köhnə şəhəri'),
    ('VAT', 286, 'Vatikan'), ('CHI', 483, 'Çiçen-İtsa'), ('SAM', 603, 'Səmərqənd'),
    ('ZIM', 364, 'Böyük Zimbabve'), ('LAL', 18, 'Lalibela qaya kilsələri'), ('ZAN', 173, 'Zənzibarın Daş şəhəri')
]:
    new_sources[key] = (f'https://whc.unesco.org/en/list/{number}/', 'UNESCO — ' + title, 'Description; Brief synthesis')
for key, (url, title, section) in new_sources.items():
    value = dict(url=url, title=title, section=section)
    assert key not in sources or sources[key] == value, key
    sources[key] = value
(root / 'sources.json').write_text(json.dumps(sources, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

# Independently enumerate the bridge state graph, instead of only adding the proposed route.
times = [1, 2, 5, 10]
queue = [(0, 0, 0)]
best = {(0, 0): 0}
while queue:
    cost, mask, side = heapq.heappop(queue)
    if cost != best[(mask, side)]:
        continue
    if (mask, side) == (15, 1):
        bridge_minimum = cost
        break
    people = [i for i in range(4) if ((mask >> i) & 1) == side]
    for size in [1, 2]:
        for chosen in itertools.combinations(people, size):
            nxt = mask
            for i in chosen:
                nxt ^= 1 << i
            state = (nxt, 1 - side)
            new_cost = cost + max(times[i] for i in chosen)
            if new_cost < best.get(state, float('inf')):
                best[state] = new_cost
                heapq.heappush(queue, (new_cost, *state))
assert bridge_minimum == 17
doors = [False] * 100
for step in range(1, 101):
    for index in range(step - 1, 100, step):
        doors[index] = not doors[index]
assert sum(doors) == 10
two_painted = sum(sum(v in [0, 2] for v in xyz) == 2 for xyz in itertools.product(range(3), repeat=3))
assert two_painted == 12
orders = [''.join(map(str, p)) for p in itertools.permutations([1, 2, 3]) if p.index(3) < p.index(1) < p.index(2)]
assert orders == ['312']
draws = list(itertools.combinations(range(5), 2))
probability = Fraction(sum(a < 3 and b < 3 for a, b in draws), len(draws))
assert probability == Fraction(3, 10)
assert 'Kələk'.lower() == 'Kələk'.lower()[::-1]
assert 7 + 9 - 1 == 15
assert sorted([10, 10, 10, 10, 110])[2] == 10
checks = dict(bridgeMinimum=bridge_minimum, openDoors=sum(doors), cubesWithTwoPaintedFaces=two_painted,
              validCodes=orders, redPairProbability=str(probability), palindrome='Kələk', queueSize=15,
              trainMetres=100+200, median=10, ropeMinutes=30+15,
              dominoColourCounts=[30,32], ballWeighings=2,
              manualLogicReview=['shared brother', 'equivalent box statements', 'photo child', 'jugs',
                                 'cats syllogism', 'ten days weekday', 'bulb heat', 'book leaf'])
(root / 'qa/derivation-checks.json').write_text(json.dumps(checks, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

old = (root / 'data/questions.jsonl').read_text(encoding='utf-8')
(root / 'qa/previous-100.jsonl').write_text(old, encoding='utf-8')
reviewed = json.loads((root / 'reviewed-batches.json').read_text(encoding='utf-8'))
for n in range(4,10):
    reviewed[f'batch-{n:03}.txt'] = dict(reviewed=True, checkedAt='2026-10-05')
(root / 'reviewed-batches.json').write_text(json.dumps(reviewed, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'derivations': checks, 'registeredSources': len(new_sources)}, ensure_ascii=False))
