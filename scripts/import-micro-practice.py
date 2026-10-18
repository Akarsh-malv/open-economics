"""Import the 30 supplied revised Micro PDFs. Source documents are read-only.

Extract real source tables by cell geometry rather than flattened text. Reject
incomplete questions before writing the banks. Graph descriptions are data,
not executable instructions; authored scenes are added in a separate step.
"""
from pathlib import Path
import re,json,hashlib
import pdfplumber
ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'lib/practice/micro-topics'
UNITS={2:'Supply and Demand',3:'Production, Cost, and the Perfect Competition Model',4:'Imperfect Competition',5:'Factor Markets',6:'Market Failure and the Role of Government'}

def page_text(page):
    tables=[]
    for table in page.find_tables():
        data=table.extract()
        if len(data)<3 or len(data[0])<2 or any('LEDGER' in (cell or '') for row in data for cell in row):continue
        # Correct-answer highlight boxes are not data tables.
        if not sum(sum(bool(cell) for cell in row) >= 2 for row in data)>=3:continue
        prefix=[]
        while data and sum(bool(cell) for cell in data[0])<len(data[0]):
            prefix.append(' '.join(cell for cell in data.pop(0) if cell))
        if len(data)<3:continue
        content='\n'.join(prefix+['| '+' | '.join((cell or '').replace('\n',' ') for cell in row)+' |' for row in data])
        tables.append((table.bbox,content))
    if not tables:return page.extract_text() or ''
    remaining=page.filter(lambda obj: not any(box[0]-1<=obj.get('x0',-99)<=box[2]+1 and box[1]-1<=obj.get('top',-99)<=box[3]+1 for box,_ in tables))
    lines=remaining.extract_text_lines()
    parts=[(line['top'],line['text']) for line in lines]+[(box[1],content) for box,content in tables]
    return '\n'.join(text for _,text in sorted(parts))

def parse(text,slug):
    lines=[];skipledger=False
    for line in text.splitlines():
        if re.match(r'Question \d+\b',line):skipledger=False
        if 'LEDGER' in line:skipledger=True
        if skipledger or re.match(r'(OPEN ECONOMICS PROJECT|Open Economics Project).*',line):continue
        if re.match(r'Page \d+$',line):continue
        lines.append(line)
    text='\n'.join(lines)
    title=re.search(r'Unit \d+ \| Topic [\d.]+ \| (.+)',text).group(1).strip()
    starts=list(re.finditer(r'Question (\d+)\s*(?:[—–-]\s*)?(Easy|Medium|Hard)\s*\n',text))
    assert len(starts)==100,(slug,len(starts))
    bank=[]
    for index,start in enumerate(starts):
        chunk=text[start.end():starts[index+1].start() if index<99 else len(text)]
        correct=re.search(r'Correct Answer:\s*([A-E])\b',chunk); assert correct,(slug,index)
        options=list(re.finditer(r'^([A-E])\.\s+',chunk[:correct.start()],re.M));assert [m[1] for m in options]==list('ABCDE'),(slug,index,chunk[:500])
        prompt=chunk[:options[0].start()].strip();description='';required=False
        graph=re.search(r'^Graph:\s*(None required|Required)\s*$',prompt,re.M)
        if graph:
            required=graph[1]=='Required'
            graphdesc=re.search(r'^Graph Description:\s*(.+)',prompt,re.M|re.S)
            if graphdesc:description=' '.join(graphdesc[1].split())
            prompt=prompt[:graph.start()].strip()
        exp=re.search(r'Revised Explanation:\s*(.*?)\nCED (?:Topic )?Reference:\s*(.*)',chunk[correct.end():],re.S);assert exp,(slug,index,chunk[-300:])
        explanation=' '.join(exp[1].split());reference=' '.join(exp[2].split())
        reference=re.split(r'\b(?:QA|AUDIT|Editorial|Answer key|Question Bank|Distribution):',reference)[0].strip()
        items=[{'label':m[1],'text':' '.join(chunk[m.end():options[j+1].start() if j<4 else correct.start()].split())} for j,m in enumerate(options)]
        bank.append(dict(id=int(start[1]),difficulty=start[2],prompt=prompt,options=items,answer=correct[1],explanation=explanation,reference=reference,graphDescription=description,graphRequired=required))
    assert [q['id'] for q in bank]==list(range(1,101)),slug
    return bank,title

def main():
    files=sorted(Path('/Users/akars/Downloads').glob('AP_Micro*Revised.pdf'))
    assert len(files)==30,len(files)
    parsed=[];sources=[]
    for file in files:
        slug='-'.join(re.search(r'(\d)_(\d)_',file.name).groups())
        with pdfplumber.open(file) as doc:
            text='\n'.join(page_text(page) for page in doc.pages);pages=len(doc.pages)
        bank,title=parse(text,slug);parsed.append((slug,bank,title))
        sources.append(dict(topic=slug,source=str(file),sha256=hashlib.sha256(file.read_bytes()).hexdigest(),pages=pages,questions=len(bank)))
        print(slug,len(bank),flush=True)
    DEST.mkdir(exist_ok=True);manifest=[]
    for slug,bank,title in parsed:
        (DEST/f'{slug}.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
        manifest.append(dict(slug=slug,number=slug.replace('-','.'),unit=int(slug[0]),unitName=UNITS[int(slug[0])],title=title,count=len(bank),graphs=sum(q['graphRequired'] for q in bank)))
    manifest.sort(key=lambda t:tuple(map(int,t['slug'].split('-'))))
    (DEST/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    (DEST.parent/'micro-topic-imports.ts').write_text('export const microTopicImports = {\n'+''.join(f'  "{t["slug"]}": () => import("./micro-topics/{t["slug"]}.json"),\n' for t in manifest)+'} as const;\n')
    (ROOT/'audit/micro/source-files.json').write_text(json.dumps(sources,indent=2)+'\n')
if __name__=='__main__':main()
