import json,re,unicodedata
from pathlib import Path
root=Path(__file__).resolve().parent.parent
old=[json.loads(l) for l in (root/'qa/previous-850.jsonl').read_text(encoding='utf-8').splitlines()]
new=json.loads((root/'qa/new-1000-editorial.json').read_text(encoding='utf-8'))
for i,q in enumerate(new):q['id']=f'AZQ-{851+i:05}';q['correctAnswer']=q['correct']
allq=old+new
def norm(s):return re.sub(r'[^\w\s]',' ',unicodedata.normalize('NFKC',s).lower().replace('i̇','i')).strip()
def tokens(s):return {w for w in norm(s).split() if len(w)>3 and w not in {'hansı','əsasən','adlanır','necə','olan','nədir','neçə','hansıdır','üçün','olur','niyə','əsas','hansısa','nəyi','onun','adətən','hissəsi'}}
tok=[tokens(q['question']) for q in allq]
pairs=[]
for i in range(850,len(allq)):
    for j in range(i):
        overlap=len(tok[i]&tok[j])/max(1,len(tok[i]|tok[j]))
        same=norm(allq[i]['correctAnswer'])==norm(allq[j]['correctAnswer'])
        if overlap>=.5 or same and overlap>=.32:
            pairs.append({'ids':[allq[j]['id'],allq[i]['id']], 'packs':[allq[j].get('pack'),allq[i].get('pack')], 'rows':[allq[j].get('row'),allq[i].get('row')], 'overlap':round(overlap,3),'sameAnswer':same,'questions':[allq[j]['question'],allq[i]['question']], 'answers':[allq[j]['correctAnswer'],allq[i]['correctAnswer']]})
pairs.sort(key=lambda p:(p['sameAnswer'],p['overlap']),reverse=True)
(root/'qa/new-1000-similarity.json').write_text(json.dumps(pairs,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('CANDIDATES',len(pairs))
for p in pairs:
    print(' | '.join([str(p['packs']),str(p['rows']),str(p['overlap']),str(p['sameAnswer']),*p['questions'],*p['answers']]))
