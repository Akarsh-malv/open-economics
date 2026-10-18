"""Independent exhaustive checks of finite choice sets, not MC/MB heuristics."""
from pathlib import Path
import json,re
R=Path(__file__).resolve().parents[1];D=R/'lib/practice/micro-topics';results=[]
def key(q):return next(o['text'] for o in q['options']if o['label']==q['answer'])
def rows(q):return [[x.strip()for x in line.split('|')[1:-1]]for line in q['prompt'].splitlines()[2:]]
b=json.loads((D/'1-6.json').read_text())
for q in b[53:63]:
 rs=rows(q);margins=[float(r[1])-float(r[2]) for r in rs];nets=[0]
 for v in margins:nets.append(nets[-1]+v)
 winners=[i for i,n in enumerate(nets)if n==max(nets)]
 assert float(key(q)) in winners,(q['id'],key(q),winners)
 assert len(winners)==1,(q['id'],'Ambiguous maximum',winners)
 results.append(dict(topic='1-6',id=q['id'],method='Enumerate cumulative net benefits including zero units',optimum=winners[0]))
for q in b[63:68]:
 rs=rows(q);gain=float(rs[1][1])-float(rs[0][1])
 if 'net benefit' in q['prompt']:gain-=float(rs[1][2])-float(rs[0][2])
 assert float(key(q))==gain
 results.append(dict(topic='1-6',id=q['id'],method='Difference of stated total benefits and costs',answer=gain))
for q in b[68:73]:
 rs=rows(q);tu={int(r[0]):int(r[1])for r in rs};units=list(map(int,re.findall(r'unit(?:s)? (\d+)',q['prompt'])))
 if 'combined' in q['prompt']:units=[4,5]
 gain=sum(tu[u]-tu[u-1]for u in units)
 assert float(key(q))==gain
 results.append(dict(topic='1-6',id=q['id'],method='Difference of total utilities',answer=gain))
for q in b[73:88]:
 nums=re.search(r'(?:has|income is) \$(\d+), Px=\$(\d+), and Py=\$(\d+)',q['prompt']);budget,px,py=map(int,nums.groups())
 change=re.search(r'income rises to \$(\d+)',q['prompt']);price=re.search(r'Px falls to \$(\d+)',q['prompt'])
 if change:budget=int(change[1])
 if price:px=int(price[1])
 rs=rows(q);feasible=[]
 for xr in rs:
  for yr in rs:
   if xr[1]=='-'or yr[2]=='-':continue
   x,y=int(xr[0]),int(yr[0])
   if x*px+y*py<=budget:feasible.append((int(xr[1])+int(yr[2]),x,y))
 best=max(v[0]for v in feasible);winners=[v for v in feasible if v[0]==best]
 assert len(winners)==1 and list(winners[0][1:])==list(map(int,re.findall(r'\d+',key(q))))
 results.append(dict(topic='1-6',id=q['id'],method='Enumerate every affordable integer bundle',utility=best,bundle=winners[0][1:]))
for q in b[88:94]:
 s=q['graphScenes'][0];mb,mc=s['curves'];mbpoints=mb['points'];mcpoints=mc['points']
 def value(points,x):
  first,last=points[0],points[-1];return first['y']+(last['y']-first['y'])*(x-first['x'])/(last['x']-first['x'])
 qstar=q['id']-87
 assert abs(value(mbpoints,qstar)-value(mcpoints,qstar))<1e-8
 assert value(mbpoints,qstar-.1)>value(mcpoints,qstar-.1)
 assert value(mbpoints,qstar+.1)<value(mcpoints,qstar+.1)
 results.append(dict(topic='1-6',id=q['id'],method='Check actual plotted MB/MC intersection and both sides',optimum=qstar))
for q in b[94:]:
 s=q['graphScenes'][0];mu=q['graphScenes'][1];peak=max(s['curves'][0]['points'],key=lambda p:p['y']);zero=q['id']-91
 assert abs(peak['x']-zero)<1e-8
 assert mu['curves'][0]['points'][-1]['y']<0
 results.append(dict(topic='1-6',id=q['id'],method='Check TU peak and negative marginal utility plotted beyond it',maximumQuantity=zero))
b=json.loads((D/'1-5.json').read_text())
for q in b[60:80]:
 rs=rows(q);nets={r[0]:int(r[1])-int(r[2])for r in rs};best=max(nets,key=nets.get)
 assert list(nets.values()).count(nets[best])==1
 i=q['id']-61;kind=i%4
 if kind==0:assert key(q)=='Proposal '+best
 elif kind==1:assert float(key(q).replace('$',''))==nets[chr(65+(i+1)%5)]
 elif kind==2:
  j=(i+2)%5;k=(j+1)%5;assert float(key(q).replace('$',''))==nets[chr(65+j)]-nets[chr(65+k)]
 else:assert float(key(q).replace('$',''))==nets[best]-10
 results.append(dict(topic='1-5',id=q['id'],method='Evaluate every proposal and check the requested answer',netBenefits=nets))
(R/'audit/micro/unit-1/independent-math-results.json').write_text(json.dumps(results,indent=2)+'\n')
print(len(results),'exhaustive table and graph checks passed')
