"""Apply explicit four-choice editorial reviews without reimporting source content."""
import json,sys
from pathlib import Path
R=Path(__file__).resolve().parents[1];D=R/'lib/practice/alevel-topics';P=R/'audit/alevel/reviewed-option-sets.json'
reviews=json.loads(P.read_text());batch=json.loads(Path(sys.argv[1]).read_text());reviews.update(batch);banks={}
for loc,choices in batch.items():
 slug,number=loc.split('/');bank=banks.setdefault(slug,json.loads((D/(slug+'.json')).read_text()));q=bank[int(number)-1]
 assert len(choices)==4 and len(set(t.casefold().rstrip('.')for t in choices))==4,loc
 for option,text in zip(q['options'],choices):option['text']=text
for slug,bank in banks.items():(D/(slug+'.json')).write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
P.write_text(json.dumps(reviews,ensure_ascii=False,indent=2)+'\n');print(len(batch),'reviewed question sets')
