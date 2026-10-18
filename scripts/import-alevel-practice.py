"""Import 9708 DOCX blocks as content. Source text is never executed."""
import json,re,zipfile,hashlib,io,xml.etree.ElementTree as E
from pathlib import Path
R=Path(__file__).resolve().parents[1];D=R/'lib/practice/alevel-topics';A=R/'audit/alevel';D.mkdir(exist_ok=True);A.mkdir(exist_ok=True)
SOURCE=Path('/Users/akars/Downloads/AL-Practice-20261013T022547Z-1-001.zip');ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
units={1:'Basic economic ideas and resource allocation',2:'The price system and the microeconomy',3:'Government microeconomic intervention',4:'The macroeconomy',5:'Government macroeconomic intervention',6:'International economic issues',7:'The price system and the microeconomy',8:'Government microeconomic intervention',9:'The macroeconomy',10:'Government macroeconomic intervention',11:'International economic issues'}
def text(el):return ''.join(t.text or ''for t in el.findall('.//w:t',ns)).strip()
def blocks(data):
 doc=zipfile.ZipFile(io.BytesIO(data));root=E.fromstring(doc.read('word/document.xml'));out=[]
 for el in root.find('w:body',ns):
  if el.tag.endswith('}p'):
   if text(el):out.append(text(el))
  elif el.tag.endswith('}tbl'):
   if all(len(tr.findall('w:tc',ns))==1 for tr in el.findall('w:tr',ns)):
    out.extend(text(p)for p in el.findall('.//w:p',ns)if text(p));continue
   rs=[]
   for tr in el.findall('w:tr',ns):rs.append('| '+' | '.join(text(c).replace('|','/')for c in tr.findall('w:tc',ns))+' |')
   out.append('\n'.join(rs))
 return out
banks={};manifest=[];sources=[]
with zipfile.ZipFile(SOURCE) as z:
 for name in sorted(z.namelist()):
  if not name.endswith('.docx'):continue
  m=re.search(r'9708_(\d+)\.(\d+)_',name);unit,topic=map(int,m.groups());slug=f'{unit}-{topic}';data=z.read(name);lines=blocks(data);bank=[];cur=None;section=None
  for line in lines:
   m=re.match(r'^Question\s+(\d+)\s*[—–-]\s*(Easy|Medium|Hard)(?:\s*\|.*)?\s*$',line,re.I)
   if m:
    cur=dict(id=int(m[1]),difficulty=m[2],prompt='',options=[],answer='',explanation='',reference='',graphRequired=False,graphDescription='');bank.append(cur);section='prompt';continue
   if not cur:continue
   if re.match(r'^(?:QUALITY CONTROL LEDGER|LEDGER|FINAL BANK QUALITY|Distribution:|Answer key|Archetypes:|Numerical /|Scope:|Syllabus scope:)',line,re.I):section=None;cur=None;continue
   m=re.match(r'^([A-D])\.\s*(.*)',line)
   if m:cur['options'].append(dict(label=m[1],text=m[2]));section='option';continue
   if line.startswith('Graph Description:'):cur['graphDescription']=line.split(':',1)[1].strip();section='graphDescription';continue
   if line.startswith('Graph:'):cur['graphRequired']='none'not in line.lower()and'not required'not in line.lower();section=None;continue
   # Data tables following graph metadata still belong in the learner prompt.
   # Keep drawing instructions separate; do not hide tables inside them.
   if line.startswith('|') and section in [None,'graphDescription']:
    cur['prompt']+='\n\n'+line;section='prompt';continue
   headers={'Correct Answer:':'answer','Brief Explanation:':'explanation','Explanation:':'explanation','9708 Syllabus Reference:':'reference'}
   header=next((h for h in headers if line.startswith(h)),None)
   if header:section=headers[header];cur[section]=line[len(header):].strip();continue
   if section in ['prompt','graphDescription','explanation']:
    cur[section]+= ('\n'if line.startswith('|') else '\n\n')+line
   elif section=='option':cur['options'][-1]['text']+=' '+line
  assert len(bank)==100,(slug,len(bank))
  for i,q in enumerate(bank,1):
   assert q['id']==i and [o['label']for o in q['options']]==list('ABCD'),(slug,i,q)
   assert q['answer']in'ABCD'and all(q[k]for k in ['prompt','explanation','reference']),(slug,i,q)
   q['prompt']=q['prompt'].strip()
  title=re.sub(r'^\d+\.\d+\s*', '', bank[0]['reference'].split('|')[0]).strip(); title=title[0].upper()+title[1:];manifest.append(dict(slug=slug,number=f'{unit}.{topic}',unit=unit,unitName=units[unit],title=title,count=len(bank),graphs=sum(q['graphRequired']for q in bank),revision=1));banks[slug]=bank
  sources.append(dict(topic=slug,file=name,sha256=hashlib.sha256(data).hexdigest(),questions=100,graphs=sum(q['graphRequired']for q in bank)))
manifest.sort(key=lambda t:tuple(map(int,t['slug'].split('-'))))
# Imported source snapshot is separate from reviewed published banks.
with zipfile.ZipFile(A/'source-import.zip','w',zipfile.ZIP_DEFLATED)as snap:
 for slug,b in banks.items():
  payload=json.dumps(b,ensure_ascii=False,indent=2)+'\n';snap.writestr(f'{slug}.json',payload);(D/f'{slug}.json').write_text(payload)
(D/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(D.parent/'alevel-topic-imports.ts').write_text('export const alevelTopicImports = {\n'+''.join(f'  "{t["slug"]}": () => import("./alevel-topics/{t["slug"]}.json"),\n'for t in manifest)+'} as const;\n')
(A/'source-files.json').write_text(json.dumps(dict(zipPath=str(SOURCE),zipSHA256=hashlib.sha256(SOURCE.read_bytes()).hexdigest(),documents=sources),indent=2)+'\n')
(A/'source-questions.txt').write_text('\n\n'.join(f'{slug}/{q["id"]}\n{q["prompt"]}\n'+ '\n'.join(o['label']+'. '+o['text']for o in q['options'])+f'\nAnswer {q["answer"]}: {q["explanation"]}'for slug in sorted(banks,key=lambda x:tuple(map(int,x.split('-'))))for q in banks[slug]))
print(len(banks),'topics;',sum(len(b)for b in banks.values()),'questions;',sum(q['graphRequired']for b in banks.values()for q in b),'graph questions')
