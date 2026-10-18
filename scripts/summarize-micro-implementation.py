"""Record the final reviewed bank against the preserved source import.
Does not edit questions or source PDFs. Run after audit-practice.py --micro.
"""
import collections, hashlib, json, re, zipfile
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'audit/micro'
BANKS = ROOT / 'lib/practice/micro-topics'
archive = zipfile.ZipFile(DEST / 'before-editing.zip')
changes, duplicates, runs = [], [], []
counts = collections.Counter()
figures = panels = tables = 0
for path in sorted(BANKS.glob('*.json')):
    if path.stem == 'manifest':
        continue
    bank = json.loads(path.read_text())
    source = json.loads(archive.read(next(name for name in archive.namelist() if name.endswith(path.name))))
    prompts = collections.defaultdict(list)
    for before, after in zip(source, bank):
        fields = [field for field in after if before.get(field) != after.get(field)]
        if fields:
            changes.append(dict(topic=path.stem, question=after['id'], fields=fields, before=before, after=after))
            counts.update(fields)
        prompts[re.sub(r'\s+', ' ', after['prompt'].lower()).strip()].append(after['id'])
        figures += after['graphRequired']
        panels += len(after.get('graphScenes', [])) if after['graphRequired'] else 0
        tables += bool(re.search(r'^\|', after['prompt'], re.M))
    duplicates.extend(dict(topic=path.stem, questions=ids) for ids in prompts.values() if len(ids) > 1)
    for start in range(len(bank) - 3):
        if len({q['answer'] for q in bank[start:start + 4]}) == 1:
            runs.append(dict(topic=path.stem, start=start + 1))
sources = json.loads((DEST / 'source-files.json').read_text())
assert all(hashlib.sha256(Path(source['source']).read_bytes()).hexdigest() == source['sha256'] for source in sources)
summary = dict(sources=len(sources), source_questions=sum(s['questions'] for s in sources), sources_unchanged=True,
               questions_changed=len(changes), changed_fields=dict(counts), exact_duplicate_prompts=duplicates,
               repeated_answer_runs_of_four=runs, figure_questions=figures, figure_panels=panels, table_questions=tables)
(DEST / 'complete-question-changes.json').write_text(json.dumps(changes, ensure_ascii=False, indent=2) + '\n')
(DEST / 'implementation-summary.json').write_text(json.dumps(summary, indent=2) + '\n')
print(json.dumps(summary, indent=2))
