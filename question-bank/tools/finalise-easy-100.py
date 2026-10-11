import json
from collections import Counter
from pathlib import Path

root = Path(__file__).resolve().parent.parent
questions = [json.loads(s) for s in (root/'data/questions.jsonl').read_text(encoding='utf-8').splitlines()]
previous = [json.loads(s) for s in (root/'qa/previous-1850.jsonl').read_text(encoding='utf-8').splitlines()]
assert questions[:1850] == previous
new = questions[1850:]
assert len(new) == 100 and all(q['difficulty']=='asan' for q in new)
verification = json.loads((root/'qa/xlsx-verification.json').read_text(encoding='utf-8'))
assert verification['database_payloads_match'] and verification['database_questions']==1950
old_sources = json.loads((root/'qa/previous-sources-1850.json').read_text(encoding='utf-8'))
sources = json.loads((root/'sources.json').read_text(encoding='utf-8'))
assert all(sources[k] == v for k,v in old_sources.items())

lines = ['# 100 yeni asan sual', '', 'Bütün suallar Azərbaycan dilindədir. Hər sualın dörd variantı və bir düzgün cavabı var.', '',
         'Sual bankındakı nömrələr: **AZQ-01851–AZQ-01950**. Düzgün cavablar son baxış üçün göstərilir.', '']
for i,q in enumerate(new,1):
    lines += [f'## {i}. {q["question"]}', '', f'Mövzu: {q["category"]} · {q["id"]}', '']
    lines += [f'- **{s})** {q["options"][s]}' for s in 'ABCD']
    lines += ['', f'**Düzgün cavab: {q["correctOption"]}) {q["correctAnswer"]}.**', '']
    if q['source'].get('url'):
        lines += [f'Mənbə: [{q["source"]["title"]}]({q["source"]["url"]}).', '']
    else:
        lines += [f'İzah: {q["verification"]["note"]}', '']
out = root/'outputs/01a10932-ea68-7a01-b9cb-b7de3ae9ca73/100-asan-sual.md'
out.write_text('\n'.join(lines), encoding='utf-8')
assert sum(l.startswith('## ') for l in lines) == 100
(root/'data/new-100-asan.jsonl').write_text(''.join(json.dumps(q,ensure_ascii=False)+'\n' for q in new),encoding='utf-8')
checkpoint = dict(new=100,total=1950,database=1950,remaining=8050,previous1850Unchanged=True,
                  oldSourceMetadataUnchanged=True,newByDifficulty={'asan':100,'orta':0,'çətin':0},
                  newByCategory=dict(Counter(q['category'] for q in new)),
                  newByVerification=dict(Counter(q['verification']['method'] for q in new)),
                  semanticReview='100 yeni sual məna və variantlar baxımından nəzərdən keçirilib; əvvəlki növbə sayma və ortaq qardaş suallarını təkrarlayan nümunələr çıxarılıb.',
                  readerFile=str(out),checkedAt='2026-10-05')
(root/'qa/checkpoint-1950.json').write_text(json.dumps(checkpoint,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'qa/previous-1950.jsonl').write_text((root/'data/questions.jsonl').read_text(encoding='utf-8'),encoding='utf-8')
print(json.dumps(checkpoint,ensure_ascii=False))
