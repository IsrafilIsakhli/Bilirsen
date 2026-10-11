import json
import re
from pathlib import Path
root = Path(__file__).resolve().parent.parent
verification = json.loads((root/'qa/xlsx-verification.json').read_text(encoding='utf-8'))
progress = json.loads((root/'progress.json').read_text(encoding='utf-8'))
assert verification['database_payloads_match']
assert verification['database_questions'] == progress['authored']
progress['importedToDatabase'] = verification['database_questions']
(root/'progress.json').write_text(json.dumps(progress, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
group = progress['byDifficulty']
targets = progress['difficultyTargets']
summary = f'''# Sual bankının irəliləyişi

Hədəf: **10.000**. Yazılıb: **{progress['authored']}**. Yazılmalı: **{progress['remainingToAuthor']}**.

Asan: {group['asan']}; orta: {group['orta']}; çətin: {group['çətin']}.
Hədəf bölgüsü: 2.000 asan / 5.000 orta / 3.000 çətin.

Mənbə ilə tutuşdurulan: {progress['sourceCompared']}. Həlli hesablanan: {progress['derived']}. Dil nümunəsi təhlil olunan: {progress.get('linguisticallyAnalysed',0)}.
Bazaya köçürülən və faylla tam tutuşdurulan: {progress['importedToDatabase']}.

Əvvəlki 1850 sual dəyişməyib. Son 1850 suallıq yoxlanmış hissədən sonra {progress['authored']-1850} yeni sual əlavə edilib; bu hissənin hamısı asandır.
İlk 100 sualdan sonra əlavə edilənlərin ümumi sayı: {progress['authored']-100}.

10.000 suallıq bank hələ tamamlanmayıb. Hazırlanmış hissə son baxış üçündür.
Çətinliklər ilkin redaktə qiymətləndirməsidir; oyunçu sınağı ilə ölçülməyib.
'''
(root/'IRƏLİLƏYİŞ.az.md').write_text(summary, encoding='utf-8')
readme = (root/'README.az.md').read_text(encoding='utf-8')
readme = re.sub(r'Fayllar, Excel və baza arasında (?:ilk )?\d+ qeydin.*?tutuşdurulub\. Əvvəlki \d+ sual dəyişməyib\.',
                f'Fayllar, Excel və baza arasında {progress["authored"]} qeydin bütün məlumatları tutuşdurulub. Əvvəlki 1850 sual dəyişməyib.', readme)
(root/'README.az.md').write_text(readme, encoding='utf-8')
previous = [json.loads(s) for s in (root/'qa/previous-1850.jsonl').read_text(encoding='utf-8').splitlines()]
old_by_difficulty = {k:sum(q['difficulty']==k for q in previous) for k in group}
new = {k:group[k]-old_by_difficulty[k] for k in group}
print(json.dumps({'total':progress['authored'],'new':progress['authored']-1850,'newByDifficulty':new,
                  'remaining':progress['remainingToAuthor'],'database':progress['importedToDatabase']}, ensure_ascii=False))
