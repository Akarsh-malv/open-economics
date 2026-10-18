import json,zipfile,re
from pathlib import Path
from collections import Counter
r=Path('lib/practice/alevel-topics');d=Path('audit/alevel');z=zipfile.ZipFile(d/'source-import.zip'); banks={p.stem:json.loads(p.read_text()) for p in r.glob('*.json') if p.stem!='manifest'}
src={s:json.loads(z.read(s+'.json')) for s in banks}
def stats(bs,measure):
 n=u=c=g=0
 for b in bs.values():
  for q in b:
   n+=1; ls=[measure(o['text']) for o in q['options']];chosen=ls[ord(q['answer'])-65];m=max(ls)
   if ls.count(m)==1:u+=1;c+=chosen==m
   if chosen==m:g+=1/ls.count(m)
 return dict(unique_questions=u,correct_unique=c,conditional_percent=round(100*c/u,2),tie_aware_percent=round(100*g/n,2))
comp={name:{'source':stats(src,f),'current':stats(banks,f)} for name,f in [('words',lambda s:len(s.split())),('characters',len)]};(d/'source-current-comparison.json').write_text(json.dumps(comp,indent=2)+'\n')
changes=[];sets={};fields=Counter()
for s,b in banks.items():
 for before,after in zip(src[s],b):
  diff={k:{'before':before.get(k),'after':after.get(k)} for k in ['prompt','options','answer','explanation','reference'] if before.get(k)!=after.get(k)}
  if diff:changes.append({'question':f"{s}/{after['id']}",'changes':diff});fields.update(diff.keys())
  if 'options' in diff:sets[f"{s}/{after['id']}"]=[o['text'] for o in after['options']]
(d/'source-current-change-index.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2)+'\n');(d/'reviewed-option-sets.json').write_text(json.dumps(sets,ensure_ascii=False,indent=2)+'\n')
flags=[];trans=Counter();maxrun=0
for s,b in banks.items():
 seq=''.join(q['answer'] for q in b);runs=max(len(m.group()) for m in re.finditer(r'(.)\1*',seq));maxrun=max(maxrun,runs);motifs=[]
 for size in range(2,5):
  for start in range(len(seq)-size*4+1):
   motif=seq[start:start+size]
   if len(set(motif))>1 and seq[start:start+size*4]==motif*4:motifs.append([start+1,motif,4])
 if runs>=5 or motifs:flags.append({'topic':s,'longest_run':runs,'repeating_motifs':motifs})
 trans.update(seq[i:i+2] for i in range(len(seq)-1))
(d/'answer-sequence-audit.json').write_text(json.dumps({'flags':flags,'longest_same_letter_run':maxrun,'transitions':dict(trans)},indent=2)+'\n')
print(json.dumps({'changed_questions':len(changes),'changed_option_sets':len(sets),'fields':dict(fields),'comparison':comp,'sequence_flags':flags,'longest_run':maxrun},indent=2))
