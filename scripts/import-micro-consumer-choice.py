"""Import and review the supplied Micro 1.6 bank without touching other topics.
Source PDF remains read-only. Static figure specifications reproduce its curves.
"""
import hashlib, importlib.util, json, random, re
from pathlib import Path
import pdfplumber
ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'lib/practice/micro-topics'; AUDIT=ROOT/'audit/micro/unit-1'
SOURCE=Path('/Users/akars/Downloads/AP_Microeconomics_1_6_Marginal_Analysis_and_Consumer_Choice_Question_Bank.pdf')
spec=importlib.util.spec_from_file_location('micro_import',ROOT/'scripts/import-micro-practice.py')
parser=importlib.util.module_from_spec(spec);spec.loader.exec_module(parser)
with pdfplumber.open(SOURCE) as doc:
    text='\n'.join(parser.page_text(page) for page in doc.pages);pages=len(doc.pages)
bank,title=parser.parse(text.replace('Brief Explanation:','Revised Explanation:'),'1-6')
AUDIT.mkdir(exist_ok=True)
(AUDIT/'1-6-source-import.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
# Reviewed concise choices; retain the distinctions needed to answer correctly.
choices={1:'The extra utility from one more unit',3:'Successive units provide smaller utility gains',8:'Limited income and available goods’ prices',10:'The cost of one additional unit',16:'Future benefits versus future opportunity costs',18:'Extra utility per dollar spent',20:'More marginal utility per dollar than Y',23:'Their preferences and utility can differ',24:'Its cost exceeds the consumer’s income',25:'A constraint on available choices',27:'Remaining MB and MC are unchanged',28:'Extra units add smaller positive utility gains',29:'Irrelevant to today’s marginal decision',30:'Marginal utility per dollar is equal across goods'}
for q in bank:
    lines=q['prompt'].splitlines();prefix=[];rows=[]
    for line in lines:
        (rows if line.startswith('|') else prefix).append(line)
    q['prompt']=' '.join(' '.join(prefix).split())+('\n'+'\n'.join(rows) if rows else '')
    q['prompt']=q['prompt'].replace('Enter the price in dollars.','Choose the price in dollars.')
    for o in q['options']:
        o['text']=o['text'][0].upper()+o['text'][1:];o['text']=o['text'].rstrip('.')
        o['text']=re.sub(r'\b1 units\b','1 unit',o['text'])
        if o['label']==q['answer'] and q['id'] in choices:o['text']=choices[q['id']]
# Distinct tasks prevent exact repeated stems; numerical conditions remain visible.
bank[89]['prompt']='At which quantity in the figure would further expansion begin reducing net benefit?'
bank[90]['prompt']='At which quantity would either a small increase or a small decrease lower net benefit?'
bank[92]['prompt']='The activity is currently at Q = 7. Which change would increase net benefit?'
q=bank[92];q['answer']=next(o['label'] for o in q['options'] if o['text'].startswith('Reduce the activity'))
next(o for o in q['options'] if o['label']==q['answer'])['text']='Reduce the activity toward the MB–MC intersection'
q['explanation']='At Q = 7, MB is $14 and MC is $17. Reducing activity toward Q = 6 saves more cost than the benefit sacrificed.'
bank[93]['prompt']='At Q = 6 in the figure, which direction of adjustment moves the activity toward maximum net benefit?'
bank[95]['prompt']='Which quantity identifies the peak of the total-utility curve, ignoring monetary and time costs?'
bank[96]['prompt']='Without monetary or time costs, at which quantity would either more or less consumption lower total utility?'
# Change the interval/task for the repeated utility-graph items.
bank[98]['prompt']='Between Q = 9 and Q = 10, marginal utility is negative. What happens to total utility?'
bank[98]['answer']='A';bank[98]['options']=[dict(label=l,text=t) for l,t in zip('ABCDE',['It falls as additional units subtract utility','It stays constant because MU is falling','It rises at a decreasing rate','It rises at an increasing rate','It equals zero throughout the interval'])]
bank[98]['explanation']='Over this interval, MU = 8 − Q is negative. Each additional unit reduces total utility.'
bank[99]['prompt']='Around Q = 9, marginal utility changes from positive to negative. What happens to total utility?'
bank[99]['answer']='C';bank[99]['options']=[dict(label=l,text=t) for l,t in zip('ABCDE',['It falls throughout both adjoining ranges','It is constant throughout both adjoining ranges','It reaches a maximum and then falls','It reaches a minimum and then rises','It rises throughout both adjoining ranges'])]
bank[99]['explanation']='Total utility rises while MU is positive, reaches its maximum where MU = 0 at Q = 9, and falls when MU becomes negative.'
def scene(x,y,xmax,ymax,caption,ymin=0):
    return dict(xLabel=x,yLabel=y,xMax=xmax,yMax=ymax,**({'yMin':ymin} if ymin else {}),caption=caption,curves=[],points=[],guides=[],regions=[],annotations=[])
def curve(s,label,pts,style='primary'):
    s['curves'].append(dict(id=label,label=label,style=style,points=[dict(x=x,y=y) for x,y in pts]))
def guide(s,x,y,xlabel=None,ylabel=None):
    s['guides'].append(dict(id='g'+str(len(s['guides'])),x=x,y=y,**({'xLabel':str(xlabel)} if xlabel is not None else {}),**({'yLabel':str(ylabel)} if ylabel is not None else {})))
for q in bank[88:94]:
    optimum=q['id']-87; intercept=10+3*optimum;end=optimum+3
    s=scene('Quantity of activity','Marginal benefit / cost ($)',end+.6,intercept+2,'Marginal benefit and marginal cost')
    curve(s,'MB',[(0,intercept),(end,intercept-2*end)]);curve(s,'MC',[(0,10),(end,10+end)],'secondary')
    guide(s,optimum,10+optimum,optimum,10+optimum)
    if q['id']>=92:
        current=7 if q['id']==93 else optimum-1
        guide(s,current,intercept-2*current,current);s['points'].append(dict(id='current',label='Current',x=current,y=intercept-2*current))
    q['graphScenes']=[s];q['graphDescription']=f'The downward-sloping MB curve and upward-sloping MC curve intersect at quantity {optimum}. The horizontal axis measures activity quantity; the vertical axis measures dollars.'
for q in bank[94:]:
    peak=q['id']-91;end=peak+3
    tu=scene('Quantity consumed','Total utility',end+.5,peak*peak/2+2,'Total utility')
    curve(tu,'TU',[(i/10,peak*i/10-(i/10)**2/2) for i in range(end*10+1)])
    guide(tu,peak,peak*peak/2,peak,peak*peak/2)
    mu=scene('Quantity consumed','Marginal utility',end+.5,peak+1,'Marginal utility',-4)
    curve(mu,'MU',[(0,peak),(end,-3)],'secondary');guide(mu,peak,0,peak,'0');guide(mu,0,peak,None,peak);guide(mu,end,-3,end,'−3')
    q['graphScenes']=[tu,mu];q['graphDescription']=f'Total utility is TU = {peak}Q − Q²/2. Marginal utility is MU = {peak} − Q. Both panels label quantity {peak}, where the TU curve peaks and the MU curve crosses zero. MU is positive to its left and negative to its right.'
# Static randomized answer positions preserve grading/explanations and avoid cycles.
rng=random.Random('micro-unit-1-6-reviewed');labels=list('ABCDE')*20
while True:
    rng.shuffle(labels)
    if all(len(set(labels[i:i+4]))>1 for i in range(97)):break
for q,label in zip(bank,labels):
    correct=next(o['text'] for o in q['options'] if o['label']==q['answer']);other=[o['text'] for o in q['options'] if o['label']!=q['answer']];rng.shuffle(other)
    q['answer']=label;q['options']=[dict(label=l,text=correct if l==label else other.pop()) for l in 'ABCDE']
(DEST/'1-6.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
(AUDIT/'source-1-6.json').write_text(json.dumps(dict(topic='1-6',source=str(SOURCE),sha256=hashlib.sha256(SOURCE.read_bytes()).hexdigest(),pages=pages,questions=100),indent=2)+'\n')
print('Imported 100 consumer-choice questions, 12 figures, 18 panels')
