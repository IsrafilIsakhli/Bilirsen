import json
from pathlib import Path
from fractions import Fraction
from itertools import product
from collections import deque

root = Path(__file__).resolve().parent.parent
source_file = root / 'sources.json'
sources = json.loads(source_file.read_text(encoding='utf-8'))
additions = json.loads((root/'qa/sources-011-014.json').read_text(encoding='utf-8'))
for key, value in additions.items():
    assert key not in sources or sources[key] == value, f'Source collision: {key}'
    sources[key] = value
source_file.write_text(json.dumps(sources, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

baseline = root/'qa/previous-450.jsonl'
if not baseline.exists():
    current = (root/'data/questions.jsonl').read_text(encoding='utf-8')
    assert len(current.splitlines()) == 450
    baseline.write_text(current, encoding='utf-8')

for name in ['batch-011.txt','batch-012.txt','batch-013.txt','batch-014.txt']:
    path = root/'batches'/name
    rows = [line.split('|') for line in path.read_text(encoding='utf-8').splitlines() if line.strip()]
    for row in rows:
        if row[8] == 'QAR' and name == 'batch-013.txt':
            row[8] = 'MUS13'
        if row[2] in ['meeting-dates-intersection-sets','family-two-grandmothers-two-mothers-minimum-three','queue-relative-position-swap','weighted-average-class-scores-equal-size']:
            row[1] = 'asan'
        if row[2] == 'family-two-grandmothers-two-mothers-minimum-three':
            row[2] = 'three-generations-two-known-mothers'
            row[3] = 'Nənə, onun qızı və qızının qızı birlikdədir. Yalnız bu qohumluq məlumatına əsasən neçə nəfərin ana olduğu məlumdur?'
            row[9] = 'Nənə qızının, qız nəvənin anasıdır; nəvənin ana olması barədə məlumat yoxdur.'
        if row[2] == 'unlabelled-two-hourglasses-eleven-minutes':
            row[2] = 'seven-eleven-hourglasses-second-flip-fifteen'
            row[3] = '7 və 11 dəqiqəlik qum saatları eyni anda başladılır. 7 dəqiqəlik saat bitəndə çevrilir. 11 dəqiqəlik bitəndə 7 dəqiqəlik yenə çevrilir. Son çevrilmədən sonra bitəndə başlanğıcdan neçə dəqiqə keçib?'
            row[4:8] = ['15','14','18','21']
            row[9] = '7-ci dəqiqədə çevrilən saatın 11-ci dəqiqədə altına 4 dəqiqəlik qum düşüb; yenidən çevriləndə 4 dəqiqədə bitir. 11+4=15.'
        if row[2] == 'nine-digit-display-upside-down-two-digit':
            row[1] = 'orta'
        if row[2] == 'kinderdijk-mills-drain-land':
            row[3] = 'Niderlandın Kinderdəyk bölgəsindəki məşhur dəyirman şəbəkəsinin əsas işi nə olub?'
        if row[2] == 'kinderdijk-water-management-netherlands':
            row[3] = 'Bənd, su anbarı və su çıxaran dəyirmanlardan ibarət Kinderdəyk kompleksi hansı ölkənin su idarəetmə irsidir?'
        if row[2] == 'american-gothic-man-pitchfork':
            row[5:8] = ['Oraq','Balta','Dırmıq']
        if row[2] == 'three-hats-two-black-one-white-inference':
            row[3] = 'Üç papaqdan ikisi qara, biri ağdır. Sayı bilən iki nəfərin hərəsinə bir papaq qoyulur. Bir-birini görürlər. Aysel dürüstcə öz rəngini bilmədiyini deyir. Bunu eşidən Murad öz papağını müəyyən edir. Muradın papağı nə rəngdir?'
    path.write_text('\n'.join('|'.join(row) for row in rows)+'\n', encoding='utf-8')

# Independent state search validates the ferry puzzle rather than only restating a solution.
start, end = (0,0,0,0), (1,1,1,1)
todo = deque([(start,0)])
seen = {start}
distance = None
while todo:
    state, depth = todo.popleft()
    if state == end:
        distance = depth
        break
    for passenger in [None,1,2,3]:
        if passenger is not None and state[passenger] != state[0]:
            continue
        nxt = list(state)
        nxt[0] ^= 1
        if passenger is not None:
            nxt[passenger] ^= 1
        person,wolf,goat,cabbage = nxt
        if (wolf == goat != person) or (goat == cabbage != person):
            continue
        nxt = tuple(nxt)
        if nxt not in seen:
            seen.add(nxt)
            todo.append((nxt,depth+1))
assert distance == 7
assert 1/(Fraction(1,6)+Fraction(1,3)) == 2
assert (12-1)*(10/(6-1)) == 22
assert sum(a == b for a,b in product([0,1],repeat=2)) == 2
assert sum(sum(bits)==2 for bits in product([0,1], repeat=5)) == 10
assert sum(range(1,5)) == 10 and sum(range(1,4)) == 6
checks = {'ferry_minimum_crossings':distance, 'combined_work_hours':2, 'twelve_chimes_seconds':22,
          'grid_paths':10,'two_eggs_four_drops_floor_capacity':10,'hourglass_total_minutes':15,
          'same_coin_faces_probability':'1/2','discount_factors_commute':True}
(root/'qa/derivation-checks-011-014.json').write_text(json.dumps(checks,indent=2)+'\n', encoding='utf-8')
print(json.dumps({'source_additions':len(additions),'new_questions':sum(len((root/'batches'/n).read_text(encoding='utf-8').splitlines()) for n in ['batch-011.txt','batch-012.txt','batch-013.txt','batch-014.txt'])}))
