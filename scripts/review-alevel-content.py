"""Reviewed corrections and consistent, meaning-preserving choice copy edits."""
import json,re,zipfile,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'lib/practice/alevel-topics'
changes=[];BANK={p.stem:json.loads(p.read_text()) for p in D.glob('*.json') if p.stem!='manifest'}
def edit(slug,i,field,text):
 q=BANK[slug][i-1];old=q[field]
 if old!=text:q[field]=text;changes.append(dict(topic=slug,id=i,field=field,before=old,after=text))
def option(slug,i,label,text):
 q=BANK[slug][i-1];o=next(o for o in q['options'] if o['label']==label);old=o['text']
 if old!=text:o['text']=text;changes.append(dict(topic=slug,id=i,field='option '+label,before=old,after=text))
option('4-1',72,'D','$1015 billion');option('4-1',73,'C','$720 billion')
edit('2-3',76,'prompt','A firm has a current price of $40. Its quantity supplied rises by 15% when price rises by 25%, consistent with a PES of 0.6 using initial-value percentages. What is the new price?')
edit('7-6',74,'prompt','A perfectly competitive firm has unavoidable fixed costs of $400 in the short run. If it stops production immediately and avoids all variable costs, what is its short-run loss?')
edit('6-5',99,'prompt',BANK['6-5'][98]['prompt'].replace('leftward shift','rightward shift'))
edit('6-5',99,'graphDescription',BANK['6-5'][98]['graphDescription'].replace('Supply shifts left','Supply shifts right'))
edit('7-8',72,'prompt',BANK['7-8'][71]['prompt'].replace('Using the same table','Using the table below').replace('Using the same data','Using the data below'))
# Fully state the production technology instead of assuming a preceding example.
for i in [48,75,76]:
 q=BANK['6-1'][i-1]
 prefixes={48:'A country can produce 60X or 120Y, with constant opportunity costs. It specialises in X and trades 1X for 3Y. ',75:'A country can produce 80X or 160Y, with constant opportunity costs. ',76:'A country can produce 80X or 160Y, with constant opportunity costs. It specialises in X and trades 1X for 3Y. '}
 text=q['prompt'];text=re.sub(r'^(?:For the same country, |In the same example, )','',text,flags=re.I);text=text.replace('in this example','under these conditions');edit('6-1',i,'prompt',prefixes[i]+text[0].upper()+text[1:])
# Common copy edits apply equally to every choice, never according to its answer label.
replacements=[
 ('the quantity demanded','quantity demanded'),('the quantity supplied','quantity supplied'),('the quantity consumed','consumption'),('the quantity traded','quantity traded'),
 ('the general price level','the price level'),('the level of real output','real output'),('the level of national income','national income'),('the rate of unemployment','unemployment'),('the rate of inflation','inflation'),
 ('the socially efficient level of output','socially efficient output'),('the socially efficient output','socially efficient output'),('the socially efficient quantity','socially efficient quantity'),
 ('the marginal external cost','marginal external cost'),('the marginal external benefit','marginal external benefit'),('the marginal private cost','marginal private cost'),('the marginal private benefit','marginal private benefit'),
 ('the price paid by consumers','the consumer price'),('the price received by producers','the producer price'),
 ('the production possibility curve','the PPC'),('the production possibility frontier','the PPF'),('production possibility curves','PPCs'),('long-run aggregate supply','LRAS'),('short-run aggregate supply','SRAS'),('aggregate demand','AD'),('aggregate supply','AS'),
 ('the firm’s average cost','average cost'),('the firm\'s average cost','average cost'),('the firm’s marginal cost','marginal cost'),('the firm\'s marginal cost','marginal cost'),
 ('the demand for labour','labour demand'),('the supply of labour','labour supply'),('the demand for the currency','currency demand'),('the supply of the currency','currency supply'),
 ('the domestic currency','domestic currency'),('the domestic price level','domestic prices'),('the domestic-currency price','the domestic price'),
 ('an increase in the economy\'s productive capacity or potential output','increased productive capacity'),('an increase in the economy’s productive capacity','increased productive capacity'),
 ('at the prevailing wage rate','at the prevailing wage'),('the prices of both goods are unchanged','both prices are unchanged'),
 ('a larger proportion of their income','a larger income share'),('a smaller proportion of their income','a smaller income share'),
 ('the number of people','people'),('a greater number of','more'),('a smaller number of','fewer'),
 ('in the short run','in the short run'),('over a period of time','over time'),('as a result of','from'),('in order to','to'),('due to the fact that','because'),
 ('regardless of whether','whether or not'),('the extent to which','how far'),('the possibility that','the risk that'),
 ('is most likely to','is likely to'),('would be likely to','may'),('will be likely to','may'),('can potentially','can'),('may potentially','may'),('may be able to','may'),('can be able to','can'),
 ('it is possible for','it is possible for'),('is equal to','equals'),('are equal to','equal'),('is greater than','exceeds'),('is less than','is below'),('is lower than','is below'),('is higher than','exceeds'),
 ('more than proportionately','proportionately more'),('less than proportionately','proportionately less'),


 ('the amount of','the'),('the total amount of','total'),('a situation in which','a situation where'),('the process by which','the process where'),
]
for slug,bank in BANK.items():
 for q in bank:
  for o in q['options']:
   before=o['text'];text=before
   for a,b in replacements:text=re.sub(re.escape(a),b,text,flags=re.I)
   text=re.sub(r'^The tax shifts the supply/MPC curve upward toward the MSC curve\.?$','MPC shifts upward toward MSC',text,flags=re.I)
   text=re.sub(r'^The market output (exceeds|is below) socially efficient output\.?$',r'Market output \1 the social optimum',text,flags=re.I)
   text=re.sub(r'^It shifts (outwards|inwards) in a parallel way\.?$',r'A parallel \1 shift',text,flags=re.I)
   text=re.sub(r'^It pivots (outwards|inwards) around the (Y|X)-intercept\.?$',r'An \1 pivot about the \2-intercept',text,flags=re.I)
   text=re.sub(r'\s+',' ',text).strip();text=text[0].upper()+text[1:] if text else text
   if before!=text:o['text']=text;changes.append(dict(topic=slug,id=q['id'],field='option '+o['label'],before=before,after=text))
for slug,bank in BANK.items():(D/(slug+'.json')).write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
(ROOT/'audit/alevel/content-edit-ledger.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2)+'\n')
print(len(changes),'tracked changes')
