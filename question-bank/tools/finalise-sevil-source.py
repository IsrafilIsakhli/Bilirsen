import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
sources=json.loads((root/'sources.json').read_text(encoding='utf-8'))
sources['SEV13']={'url':'https://bakucity.preslib.az/az/page/uI8phRgYsb','title':'Prezident Kitabxanası — Cəfər Cabbarlı və Sevil','section':'Sevil pyesinin motivləri əsasında Fikrət Əmirovun operası'}
(root/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
ledger=json.loads((root/'qa/sources-011-014.json').read_text(encoding='utf-8'))
ledger['SEV13']=sources['SEV13']
(root/'qa/sources-011-014.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
p=root/'batches/batch-013.txt'
rows=[line.split('|') for line in p.read_text(encoding='utf-8').splitlines()]
for f in rows:
    if f[2]=='f_amirov-sevil-opera-composer':
        f[8]='SEV13'
        f[9]='Prezident Kitabxanası Cabbarlının Sevil pyesinin motivləri əsasında F.Əmirovun opera yazdığını bildirir.'
p.write_text('\n'.join('|'.join(f) for f in rows)+'\n',encoding='utf-8')
