"""Import the supplied IB Paper 1 student banks and teacher guides.

Run with: python scripts/import-ib-paper-one.py /path/to/pdf-directory
Requires pypdf. Fails on missing pairs, duplicate numbering or mismatched guides.
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path
from pypdf import PdfReader

source = Path(sys.argv[1] if len(sys.argv) > 1 else '/Users/akars/Downloads')
root = Path(__file__).resolve().parents[1]
student_dir = root / 'lib/ib-paper-one/topics'
guide_dir = root / 'lib/ib-paper-one/grading-guides'
student_dir.mkdir(parents=True, exist_ok=True)
guide_dir.mkdir(parents=True, exist_ok=True)

HEADER = re.compile(r'(?m)^THE OPEN ECONOMICS PROJECT \| Topic [^\n]*\n\d+\n')
QUESTION = re.compile(r'(?ms)^Question\s+(\d+)(?:\s*\((HL)\))?\s*\n\(a\)\s*\n(.*?)\s*\[10\]\s*\n\(b\)\s*\n(.*?)\s*\[15\](?=\s*\n|$)')
GUIDE_QUESTION = re.compile(r'(?m)^Question\s+(\d+)(?:\s*\(HL\))?\s*$')

def pdf_text(path: Path) -> str:
    return '\n'.join((page.extract_text() or '') for page in PdfReader(path).pages)

def clean_text(text: str) -> str:
    text = HEADER.sub('', text)
    text = re.sub(r'(?<=\w)-\s*\n\s*(?=\w)', '-', text)
    # Preserve punctuation, numerical content, and paragraph breaks; join visual line wraps.
    return re.sub(r'\s+', ' ', text).strip()

manifest = []
for bank in sorted(source.glob('IB_Economics_Topic_*_Student_Question_Bank.pdf'), key=lambda p: tuple(map(int, re.search(r'Topic_(\d+)_(\d+)', p.name).groups()))):
    unit, section = map(int, re.search(r'Topic_(\d+)_(\d+)', bank.name).groups())
    number = f'{unit}.{section}'
    slug = f'{unit}-{section}'
    guide = source / bank.name.replace('Student_Question_Bank', 'Teacher_AI_Grading_Guide')
    if not guide.exists():
        raise RuntimeError(f'Missing guide: {guide.name}')
    student = HEADER.sub('', pdf_text(bank))
    raw_guide = HEADER.sub('', pdf_text(guide))
    title_match = re.search(r'IB Economics - Topic\s+' + re.escape(number) + r':\s*(.*?)\s*Paper 1-style topic practice', student, re.S)
    count_match = re.search(r'(?m)^(\d+) complete questions', student)
    if not title_match or not count_match:
        raise RuntimeError(f'Missing student heading or count: {bank.name}')
    title = clean_text(title_match.group(1))
    expected = int(count_match.group(1))
    matches = list(QUESTION.finditer(student))
    ids = [int(match.group(1)) for match in matches]
    if ids != list(range(1, expected + 1)):
        raise RuntimeError(f'Question count or numbering mismatch: {bank.name}: {ids}')
    guide_matches = list(GUIDE_QUESTION.finditer(raw_guide))
    guide_ids = [int(match.group(1)) for match in guide_matches]
    if guide_ids != ids:
        raise RuntimeError(f'Guide mismatch: {guide.name}: {guide_ids}')
    questions = []
    guide_questions = []
    for index, (match, guide_match) in enumerate(zip(matches, guide_matches)):
        qid = int(match.group(1))
        part_a = clean_text(match.group(3))
        part_b = clean_text(match.group(4))
        guide_body = raw_guide[guide_match.start() : (guide_matches[index + 1].start() if index + 1 < len(guide_matches) else len(raw_guide))].strip()
        if not part_a or not part_b or 'Part (a)' not in guide_body or 'Part (b)' not in guide_body:
            raise RuntimeError(f'Incomplete pair or guide: Topic {number}, Question {qid}')
        guide_head = guide_body.splitlines()
        difficulty = next((word for word in ('Easy', 'Medium', 'Hard') if word in (guide_head[1] if len(guide_head) > 1 else '')), None)
        level = 'HL' if match.group(2) else 'SL/HL'
        questions.append({'id': qid, 'level': level, 'difficulty': difficulty, 'a': {'prompt': part_a, 'marks': 10}, 'b': {'prompt': part_b, 'marks': 15}})
        guide_questions.append({'id': qid, 'level': level, 'text': guide_body})
    (student_dir / f'{slug}.json').write_text(json.dumps({'number': number, 'title': title, 'count': expected, 'questions': questions}, ensure_ascii=False, indent=2) + '\n')
    (guide_dir / f'{slug}.json').write_text(json.dumps({'number': number, 'title': title, 'generalGuidance': raw_guide[:guide_matches[0].start()].strip(), 'questions': guide_questions}, ensure_ascii=False, indent=2) + '\n')
    manifest.append({'slug': slug, 'number': number, 'unit': unit, 'unitName': {1: 'Introduction to economics', 2: 'Microeconomics', 3: 'Macroeconomics', 4: 'The global economy'}[unit], 'title': title, 'count': expected, 'hlCount': sum(q['level'] == 'HL' for q in questions)})
(root / 'lib/ib-paper-one/manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
imports = [f'import topic{i} from "./topics/{entry["slug"]}.json";' for i, entry in enumerate(manifest)]
entries = [f'  "{entry["slug"]}": topic{i},' for i, entry in enumerate(manifest)]
(root / 'lib/ib-paper-one/topic-data.ts').write_text('\n'.join(imports) + '\nexport const ibTopicData: Record<string, IbTopic> = {\n' + '\n'.join(entries) + '\n};\n' + '''import type { IbTopic } from "./types";''' + '\n')
print(f'Imported {len(manifest)} topics, {sum(topic["count"] for topic in manifest)} question pairs, and matching guides.')
