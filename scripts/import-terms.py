"""Import the owner-supplied Terms DOCX without altering its wording."""
import json, zipfile, xml.etree.ElementTree as ET
from pathlib import Path
source=Path('/Users/akars/Downloads/OEP Terms of Use [July 23].docx')
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
w='{'+ns['w']+'}'
with zipfile.ZipFile(source) as z:
 root=ET.fromstring(z.read('word/document.xml'))
 rels={r.attrib['Id']:r.attrib['Target'] for r in ET.fromstring(z.read('word/_rels/document.xml.rels'))}
 def runs(el,href=None):
  result=[]
  for child in el:
   if child.tag==w+'hyperlink':
    result.extend(runs(child,rels.get(child.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'))))
   elif child.tag==w+'r':
    bold=child.find('w:rPr/w:b',ns) is not None
    italic=child.find('w:rPr/w:i',ns) is not None
    for part in child:
     if part.tag in (w+'t',w+'br',w+'tab'):
      result.append({'text':part.text or '' if part.tag==w+'t' else '\n' if part.tag==w+'br' else '\t','bold':bold,'italic':italic,'href':href})
  return result
 paragraphs=[]
 for p in root.findall('w:body/w:p',ns):
  content=runs(p)
  if not ''.join(r['text'] for r in content).strip():continue
  sty=p.find('w:pPr/w:pStyle',ns)
  paragraphs.append({'style':sty.get(w+'val') if sty is not None else '', 'bullet':p.find('w:pPr/w:numPr',ns) is not None,'runs':content})
Path('lib/policies').mkdir(exist_ok=True)
Path('lib/policies/terms.json').write_text(json.dumps(paragraphs,ensure_ascii=False,indent=2)+'\n')
print('Imported',len(paragraphs),'paragraphs')
