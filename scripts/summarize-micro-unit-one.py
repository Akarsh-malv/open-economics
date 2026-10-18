"""Read-only final coverage, diff, and answer-pattern report."""
import json,re,zipfile,hashlib
from pathlib import Path
from collections import Counter
R=Path(__file__).resolve().parents[1];D=R/'lib/practice/micro-topics';A=R/'audit/micro/unit-1'
manifest=json.loads((D/'manifest.json').read_text());banks={t['slug']:json.loads((D/f'{t["slug"]}.json').read_text())for t in manifest};audit=json.loads((R/'audit/micro/question-audit-results.json').read_text());geometry=json.loads((A/'graph-geometry.json').read_text());changes=[]
with zipfile.ZipFile(A/'micro-before-unit-1-final-audit.zip') as z:
 for slug,b in banks.items():
  if f'{slug}.json' not in z.namelist():continue
  old=json.loads(z.read(f'{slug}.json'))
  for q,orig in zip(b,old):
   fields=[k for k in q if q[k]!=orig.get(k)]
   if fields:changes.append(dict(topic=slug,id=q['id'],fields=fields,before=orig,after=q))
metrics={k:round(sum(t[k+'_guess_percent']for t in audit['topics'])/len(manifest),2)for k in ['words_longest','words_shortest','characters_longest','characters_shortest']}
assert all(len({q['prompt']for q in b})==len(b)for b in banks.values())
assert all(Counter(q['answer']for q in b)==dict.fromkeys('ABCDE',20)for b in banks.values())
assert all(all(len(set(q['answer']for q in b[i:i+4]))>1 for i in range(97))for b in banks.values())
assert not audit['errors'] and not any(t['length_pattern_review']for t in audit['topics'])
summary=dict(questions=sum(len(b)for b in banks.values()),topics=len(manifest),tables=sum('|'in q['prompt']for b in banks.values()for q in b),figures=geometry['figures'],panels=geometry['panels'],structuralErrors=audit['errors'],lengthGuessScoresPercent=metrics,baselineChangedQuestions=len(changes),bankSHA256={slug:hashlib.sha256((D/f'{slug}.json').read_bytes()).hexdigest()for slug in banks})
(A/'complete-changes.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2)+'\n');(A/'final-summary.json').write_text(json.dumps(summary,indent=2)+'\n')
text=f'''# AP Micro Unit 1 implementation and final audit

Completed 12 October 2026 in the local application. This report supersedes the earlier Units 2–6 report.

## Coverage and curriculum

- **36 topics, 3,600 Micro questions**, including 600 Unit 1 questions; the app also retains 4,200 Macro questions, for 7,800 total.
- Followed the user-confirmed official Micro sequence. Shared Macro scarcity, PPC, and comparative-advantage material maps to Micro 1.1, 1.3, and 1.4, with Micro curriculum references. Added 100 questions each for Resource Allocation and Economic Systems (1.2) and Cost-Benefit Analysis (1.5).
- Imported all 100 questions from the supplied 1.6 PDF; recreated its 12 figures as 18 accessible graph panels. Preserved source extraction and SHA256 provenance; the PDF itself was not edited. Document text was treated as source material, not instructions.
- Course-specific grading and topic lookup keep Micro and Macro isolated.
- Curriculum reference: [College Board AP Microeconomics course and exam description](https://apcentral.collegeboard.org/media/pdf/ap-microeconomics-course-and-exam-description.pdf).

## Issues corrected in this pass

- Replaced **305 filler-only Unit 6 duplicates** with self-contained applications and calculations. Retained topic counts and all existing required diagrams. Numerical choices use consistent precision, varied value ranks, and shuffled positions.
- Shortened **{len(json.loads((A/'choice-edits.json').read_text()))}** reviewed answer choices, moving explanatory prose into the existing explanations. Checked for both longest- and shortest-choice cues.
- Corrected conflicting production tables in 3.1 questions 73 and 81; supplied the correct table for questions 82–83. Removed an irrelevant table from question 51.
- Restated missing data in 3.3/95, 4.1/77, 4.2/56,58,80,94,95, 5.1/78–79, and 5.4/88–91. Clarified 5.4/31 and 15 additional standalone prompts that referred to the “same” schedule or earlier data.
- In 3.5/34,37,41,42,45 and 5.3/76, a zero marginal gain makes two discrete quantities equally optimal. The revised prompts explicitly ask for the largest maximizing quantity; explanations disclose the tie.
- Reviewed and corrected new project comparisons so both projects can win by different amounts, without accidental ties. Rewrote an economic-systems question whose original alternatives all failed to eliminate scarcity.
- Removed the 1.6 source’s repeated A–E key cycle. Changed graph tasks to cover expansion, contraction, a utility maximum, and falling total utility rather than repeating the same task.
- Added graph support for a negative vertical range. Negative marginal utility remains visible below an explicit zero line rather than being clipped.
- Removed the catalog’s blanket “Easy to hard” claim, since not every topic needs artificially difficult questions.
- Revised Unit 6 uses progress revision 5; earlier Unit 6 answers are retained under their old device key and are not applied to replacement questions. Other topics retain their progress key.

## Verification

- **545 tests pass across 11 test files**: all 3,600 Micro and 4,200 Macro questions, grading for all five choices, answer privacy, topic isolation, semantic tables, figure coverage, finite coordinates, and rendering.
- TypeScript check passes.
- Whole-Micro structural audit: **zero errors**, zero extreme answer-length outliers, zero verbose-choice flags, zero exact duplicate prompts. Every topic has 20 correct answers at A–E and no run of four identical correct positions.
- Independent arithmetic checks enumerate all affordable bundles in 1.6/74–88 and all cumulative net-benefit choices in 1.6/54–63, and verify differences, TU/MU relationships, actual plotted MB/MC intersections, and 1.5 proposal tables: **67 checks pass**.
- Answer-length guessing across all Micro questions: longest by words **{metrics['words_longest']}%**, longest by characters **{metrics['characters_longest']}%**; shortest by words **{metrics['words_shortest']}%**, shortest by characters **{metrics['characters_shortest']}%**. Chance among five choices is 20%; no topic exceeds the 35% editorial review threshold. These diagnostics measure cues, not statistical proof that every possible cue has vanished.
- Browser geometry checks cover all **{geometry['panels']} panels for {geometry['figures']} figure questions**: zero text outside SVG bounds and zero overlapping text labels. Numerical graph relationships also pass targeted regression checks.
- Desktop and 390px mobile practice checks: correct and incorrect feedback, question navigation, bookmarks, restored progress, semantic data tables, and locally scrollable graphs. The mobile page width remains 390px, and the question stem renders at 16px with restrained weight and color. Full-bank rendering tests use the same text and graph components for every question.
- QA created two test attempts in the newly added 1.6 bank (74 and 95), including one bookmark, to verify persistence. Existing user progress in other topics was not reset.

Conceptual review covered edited propositions, source-PDF questions, numerical/table scenarios, and graph relationships, building on the earlier review of Units 2–6. Automated checks cannot prove that no possible conceptual or semantic issue remains. No unresolved issue was identified by these checks. This is local implementation and verification; no production deployment is claimed.

## Evidence and reproducibility

- `final-summary.json`: counts, metrics, and final bank hashes.
- `complete-changes.json`: before/after changes against the pre-audit snapshot.
- `semantic-replacements.json`, `choice-edits.json`, `standalone-wording-edits.json`: editorial records.
- `source-1-6.json`, `1-6-source-import.json`, `1-6-source-text.txt`: supplied PDF provenance and baseline.
- `independent-math-results.json` and `graph-geometry.json`: numerical and browser checks.
- `unit-one-catalog.png`, `mobile-consumer-choice.png`: browser proof.
- `../question-audit-results.json`, `../question-option-audit.csv`, `../figure-gallery.html`: complete published-bank audit and figures.

Authoring/import/revision scripts represent editorial stages and can overwrite later reviews. Preserve the reviewed banks before rerunning a stage. The audit, math-check, gallery, and summary scripts are read-only with respect to the banks.
'''
(A/'FINAL_AUDIT.md').write_text(text)
old=R/'audit/micro/FINAL_AUDIT.md';historical=R/'audit/micro/UNITS_2_TO_6_AUDIT.md'
if not historical.exists():historical.write_text(old.read_text())
old.write_text('# Latest AP Micro audit\n\nThe complete six-unit audit is in [Unit 1 and full-bank final audit](unit-1/FINAL_AUDIT.md).\n\nThe earlier 3,000-question import report is retained in [Units 2–6 audit](UNITS_2_TO_6_AUDIT.md).\n')
print(json.dumps({k:v for k,v in summary.items()if k!='bankSHA256'},indent=2))
