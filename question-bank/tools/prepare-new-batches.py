import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
new_sources = {
    'JAC': ('https://collection.sciencemuseumgroup.org.uk/objects/co8405056/jacquard-hand-loom', 'Science Museum Group — Jakard əl dəzgahı', 'Kartlar və mexanizm'),
    'BAB': ('https://hsm.ox.ac.uk/imagining-ai', 'Oxford History of Science Museum — Bebbiç və Lavleys', 'Difference Engine; Analytical Engine; Ada Lovelace; Jevons'),
    'BRA': ('https://www.loc.gov/nls/services-and-resources/informational-publications/about-braille/', 'Library of Congress — Brayl yazısı', 'Definition; Louis Braille; Braille Alphabet'),
    'ATC': ('https://www.nist.gov/atomic-clocks/how-do-atomic-clocks-work', 'NIST — Atom saatları necə işləyir?', 'Oscillation; Resonance; Cesium'),
    'GPS': ('https://www.gps.gov/gps', 'GPS.gov — GPS-in quruluşu', 'Three segments; one-way signals'),
    'DAG': ('https://www.si.edu/object/photograph-louis-jacques-mande-daguerre%3Anmah_554754', 'Smithsonian — Lui Dagerin fotoşəkli', 'Collection description; axtarış indeksindəki mətn'),
    'PHO': ('https://americanhistory.si.edu/explore/exhibitions/americas-listening/online/edisons-talking-machine', 'Smithsonian — Edisonun danışan maşını', '1877; Home Phonograph; axtarış indeksindəki mətn'),
    'WBF': ('https://science.nasa.gov/mission/webb/fact-sheet/', 'NASA — Ceyms Vebb fakt vərəqi', 'Key Facts; Major Innovations'),
    'WMR': ('https://science.nasa.gov/mission/webb/webbs-mirrors/', 'NASA — Vebbin aynaları', 'Gold coating'),
    'COL': ('https://collection.sciencemuseumgroup.org.uk/objects/co8440792/valve-from-colossus-project-1940-1945', 'Science Museum Group — Kolossus vakuum lampası', 'Description'),
}
sources = json.loads((root / 'sources.json').read_text(encoding='utf-8'))
for key, (url, title, section) in new_sources.items():
    if key in sources:
        raise ValueError(f'Source ID already exists: {key}')
    sources[key] = dict(url=url, title=title, section=section)
(root / 'sources.json').write_text(json.dumps(sources, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
for file in sorted((root / 'batches').glob('batch-*.txt')):
    if int(file.stem.split('-')[1]) < 3:
        continue
    lines = []
    for line in file.read_text(encoding='utf-8').splitlines():
        fields = line.split('|')
        assert len(fields) == 10, (file.name, line)
        if file.name == 'batch-008.txt' and fields[8] == 'WEB':
            fields[8] = 'WBF'
        for col in [3, 4, 5, 6, 7, 9]:
            fields[col] = re.sub(r'(?<=[^\W\d_])(?=\d)', ' ', fields[col])
            fields[col] = re.sub(r',(?=[^\W\d_])', ', ', fields[col])
        if fields[2] == 'sound-sofar-minimum-speed':
            fields[3] = fields[3].replace('SOFAR kanalının', 'səs kanalının')
        if fields[2] == 'anglerfish-male-fusion-specific-family':
            fields[3] = 'Bəzi dərin dəniz fənərbalıqlarında kiçik erkəyin dişiyə daimi bağlandıqdan sonra aqibəti nə ola bilər?'
        if fields[2] == 'volleyball-libero-contrasting-jersey':
            fields[5] = 'Bağlayıcı oyunçu'
        if fields[2] == 'tennis-ace-untouched-serve':
            fields[7] = 'Uçuş zərbəsi'
        lines.append('|'.join(fields))
    file.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(json.dumps({'sourceCount': len(sources), 'batches': {p.name: len(p.read_text(encoding='utf-8').splitlines()) for p in sorted((root / 'batches').glob('batch-*.txt'))}}, ensure_ascii=False))
