import json
import sys
import csv
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile

root = Path(__file__).resolve().parent.parent
questions = [json.loads(line) for line in (root/'data/questions.jsonl').read_text(encoding='utf-8').splitlines()]
previous = [json.loads(line) for line in (root/'qa/previous-100.jsonl').read_text(encoding='utf-8').splitlines()]
assert questions[:len(previous)] == previous, 'Previously delivered questions changed'
checkpoint = root/'qa/previous-450.jsonl'
if checkpoint.exists():
    previous_checkpoint = [json.loads(line) for line in checkpoint.read_text(encoding='utf-8').splitlines()]
    assert len(previous_checkpoint) == 450
    assert questions[:450] == previous_checkpoint, 'Previously delivered 450 questions changed'
assert len(questions) == len({q['factKey'] for q in questions}) == len({q['contentHash'] for q in questions})
checkpoint_750 = root/'qa/previous-750.jsonl'
if checkpoint_750.exists():
    previous_750 = [json.loads(line) for line in checkpoint_750.read_text(encoding='utf-8').splitlines()]
    assert len(previous_750) == 750
    assert questions[:750] == previous_750, 'Previously delivered 750 questions changed'
assert all(q['options'][q['correctOption']] == q['correctAnswer'] for q in questions)
checkpoint_850 = root/'qa/previous-850.jsonl'
if checkpoint_850.exists():
    previous_850 = [json.loads(line) for line in checkpoint_850.read_text(encoding='utf-8').splitlines()]
    assert len(previous_850) == 850
    assert questions[:850] == previous_850, 'Previously delivered 850 questions changed'
assert all(q['status'] == 'review_ready' and q['language'] == 'az' for q in questions)
checkpoint_1850 = root/'qa/previous-1850.jsonl'
if checkpoint_1850.exists():
    previous_1850 = [json.loads(line) for line in checkpoint_1850.read_text(encoding='utf-8').splitlines()]
    assert len(previous_1850) == 1850
    assert questions[:1850] == previous_1850, 'Previously delivered 1850 questions changed'
    assert len(questions[1850:]) == 100
    assert all(q['difficulty']=='asan' for q in questions[1850:])
assert all(len(set(q['options'].values())) == 4 for q in questions)
csv_rows = list(csv.reader((root/'data/questions.csv').open(encoding='utf-8-sig', newline='')))
assert len(csv_rows) == len(questions)+1
expected = [[q['id'], q['question'], *[q['options'][s] for s in 'ABCD'], q['correctOption'],
             q['difficulty'], q['category'], q['source']['title'], q['source'].get('url') or ('Dil nümunəsinin təhlili' if q['sourceId']=='LANG' else 'Hesablama'),
             q['verification']['note']] for q in questions]
assert csv_rows[1:] == expected
file = root/'outputs/01a10932-ea68-7a01-b9cb-b7de3ae9ca73/sual-banki.xlsx'
ns = {'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with ZipFile(file) as z:
    strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        strings = [''.join(item.itertext()) for item in ET.fromstring(z.read('xl/sharedStrings.xml'))]
    sheet = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
    rows = []
    for row in sheet.findall('s:sheetData/s:row', ns):
        values = []
        for cell in row:
            v = cell.find('s:v', ns)
            value = '' if v is None else v.text
            if cell.get('t') == 's':
                value = strings[int(value)]
            elif cell.get('t') == 'inlineStr':
                value = ''.join(cell.find('s:is', ns).itertext())
            values.append(value)
        rows.append(values)
    assert rows[1:] == expected, 'Workbook differs from canonical questions'
    pane = sheet.find('s:sheetViews/s:sheetView/s:pane', ns)
    assert pane.attrib.get('xSplit') == '2' and pane.attrib.get('ySplit') == '1'
    tables = [f for f in z.namelist() if f.startswith('xl/tables/') and f.endswith('.xml')]
    assert len(tables) == 1
    table = ET.fromstring(z.read(tables[0]))
    assert table.attrib['ref'] == f'A1:L{len(questions)+1}'
    assert table.find('s:autoFilter', ns) is not None
results = dict(xlsx_questions=len(questions), all_twelve_columns_match=True,
               csv_matches=True, previous_questions_unchanged=len(previous), frozen_pane=pane.attrib,
               table_range=table.attrib['ref'], filter_present=True)
if checkpoint.exists():
    results['previous_checkpoint_unchanged'] = 450
if checkpoint_750.exists():
    results['previous_750_unchanged'] = 750
if checkpoint_850.exists():
    results['previous_850_unchanged'] = 850
if checkpoint_1850.exists():
    results['previous_1850_unchanged'] = 1850
    results['new_easy_questions'] = 100
db_file = root/'qa/database-payloads.json'
if '--database' in sys.argv:
    database = json.loads(db_file.read_text(encoding='utf-8-sig'))
    assert database == questions, 'Database differs from canonical questions'
    results['database_questions'] = len(database)
    results['database_payloads_match'] = True
(root/'qa/xlsx-verification.json').write_text(json.dumps(results, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps(results, ensure_ascii=False))
