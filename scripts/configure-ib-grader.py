"""Extract private IB teacher references and verify them against the live student bank.
Usage: python scripts/configure-ib-grader.py /path/to/pdfs
No student-facing files are overwritten. All sources validate before guides are written.
"""
from pathlib import Path
from pypdf import PdfReader
import hashlib, json, re, sys

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1] if len(sys.argv) > 1 else '/Users/akars/Downloads')
HEADER = re.compile(r'(?m)^THE OPEN ECONOMICS PROJECT \| Topic [^\n]*\n\d+\n')
QUESTION = re.compile(r'(?ms)^Question\s+(\d+)(?:\s*\((HL)\))?\s*\n\(a\)\s*\n(.*?)\s*\[10\]\s*\n\(b\)\s*\n(.*?)\s*\[15\](?=\s*\n|$)')
GUIDE_QUESTION = re.compile(r'(?m)^Question\s+(\d+)(?:\s*\(HL\))?\s*$')

def text(pdf):
    return HEADER.sub('', '\n'.join(page.extract_text() or '' for page in PdfReader(pdf).pages))

def normalize(value):
    value = re.sub(r'(?<=\w)-\s*\n\s*(?=\w)', '-', value)
    return re.sub(r'\s+', ' ', value).strip()

def digest(pdf):
    return hashlib.sha256(pdf.read_bytes()).hexdigest()

staged, report = [], []
for entry in json.loads((root / 'lib/ib-paper-one/manifest.json').read_text()):
    slug = entry['slug']
    prefix = 'IB_Economics_Topic_' + slug.replace('-', '_')
    teacher = source / (prefix + '_Teacher_AI_Grading_Guide.pdf')
    student = source / (prefix + '_Student_Question_Bank.pdf')
    raw = text(teacher)
    students = list(QUESTION.finditer(text(student)))
    headings = list(GUIDE_QUESTION.finditer(raw))
    live = json.loads((root / f'lib/ib-paper-one/topics/{slug}.json').read_text())
    ids = [q['id'] for q in live['questions']]
    if [int(q.group(1)) for q in headings] != ids or [int(q.group(1)) for q in students] != ids:
        raise ValueError(f'{slug}: numbering mismatch')
    questions = []
    for index, (heading, source_question, question) in enumerate(zip(headings, students, live['questions'])):
        body = raw[heading.start():headings[index + 1].start() if index + 1 < len(headings) else len(raw)].strip()
        a_label = 'Part (a) - Indicative answer and marking guidance'
        b_label = 'Part (b) - Indicative answer and marking guidance'
        if body.count(a_label) != 1 or body.count(b_label) != 1:
            raise ValueError(f'{slug}/{question["id"]}: missing answer references')
        stems, a_reference = body.split(a_label)
        a_reference, b_reference = a_reference.split(b_label)
        paired = re.search(r'(?s)\(a\)\s*\[10\]\s*(.*?)\(b\)\s*\[15\]\s*(.*)', stems)
        if not paired:
            raise ValueError(f'{slug}/{question["id"]}: missing teacher question stems')
        for part, bank_group, teacher_group in [('a', 3, 1), ('b', 4, 2)]:
            if normalize(source_question.group(bank_group)) != question[part]['prompt'] or normalize(paired.group(teacher_group)) != question[part]['prompt']:
                raise ValueError(f'{slug}/{question["id"]}/{part}: teacher/student/live question mismatch')
        questions.append({'id': question['id'], 'level': question['level'], 'text': body,
            'answerReferences': {'a': a_reference.strip(), 'b': b_reference.strip()}})
    provenance = {'teacherFile': teacher.name, 'teacherSha256': digest(teacher), 'studentFile': student.name, 'studentSha256': digest(student)}
    guide = {'number': live['number'], 'title': live['title'], 'generalGuidance': raw[:headings[0].start()].strip(), 'source': provenance, 'questions': questions}
    staged.append((root / f'lib/ib-paper-one/grading-guides/{slug}.json', guide))
    report.append({'topic': slug, 'questions': len(questions), **provenance})
for destination, guide in staged:
    destination.write_text(json.dumps(guide, ensure_ascii=False, indent=2) + '\n')
audit = root / 'audit/ib-grader'
audit.mkdir(parents=True, exist_ok=True)
(audit / 'source-import.json').write_text(json.dumps({'topics': len(staged), 'questionPairs': sum(r['questions'] for r in report), 'sources': report}, indent=2) + '\n')
print(f'Validated and extracted {len(staged)} teacher guides and {sum(r["questions"] for r in report)} paired answer references. Every stem matches the supplied student PDF and live bank.')
