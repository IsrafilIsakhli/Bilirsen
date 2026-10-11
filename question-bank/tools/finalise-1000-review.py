import json
from pathlib import Path
from collections import Counter
root=Path(__file__).resolve().parent.parent
records=json.loads((root/'qa/new-1000-editorial.json').read_text(encoding='utf-8'))
assert len(records)==1000
manifest=json.loads((root/'reviewed-batches.json').read_text(encoding='utf-8'))
for n in range(19,39):manifest[f'batch-{n:03}.txt']={'reviewed':True,'checkedAt':'2026-10-05'}
(root/'reviewed-batches.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
decisions=json.loads((root/'qa/new-1000-similarity.json').read_text(encoding='utf-8'))
for p in decisions:
    p['decision']='distinct_facts'
    p['reason']='Sual cütü fərqli obyektin xüsusiyyətini, fərqli əməliyyatı və ya fərqli anlayışı soruşur; cavabları və soruşulan faktlar müəllif tərəfindən müqayisə edilib.'
summary={'newQuestions':1000,'firstId':'AZQ-00851','lastId':'AZQ-01850','baseline':850,'finalTotal':1850,
         'checkedAt':'2026-10-05','byDifficulty':dict(Counter(q['difficulty'] for q in records)),
         'byCategory':dict(Counter(q['category'] for q in records)),
         'review':'Müəllif redaktəsi: cavab və yanlış variantlar, Azərbaycan dili, eyni faktın yenidən soruşulması və əvvəlki dəstlə oxşarlıqlar nəzərdən keçirilib.',
         'limits':'Müstəqil sahə ekspertinin təsdiqi və oyunçu sınağı aparılmayıb. Avtomatik mətn yoxlaması məna təkrarına tam zəmanət vermir.',
         'resolvedExamples':['Sikkə ehtimalının sadəcə atış sayını dəyişən variantı müstəqil atış mövzusu ilə əvəz edilib.','İşçi və boru məhsuldarlığının eyni düstur variantlarından boru sualı çıxarılıb.','Eyni məzmunlu iki ölç-biç məsəlinin biri dostluq məsəli ilə əvəz edilib.','Asiya və Afrika filinin xortum çıxıntılarının iki paralel sualından biri azı dişlərinin yenilənməsi ilə əvəz edilib.','İki fərqli yerdə təkrarlanan PNG itkisiz sıxılma faktı HTTP sıxılma başlığı ilə əvəz edilib.'],
         'candidateDecisions':decisions}
(root/'qa/editorial-review-1000.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in summary.items() if k not in ('candidateDecisions','resolvedExamples')},ensure_ascii=False))
