"""Static topic-specific figures. Run before editorial review; source files remain unchanged."""
import json, math, copy,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'lib/practice/alevel-topics'
BANK={p.stem:json.loads(p.read_text()) for p in ROOT.glob('*.json') if p.stem!='manifest'}
def sc(x='Quantity',y='Price',xm=100,ym=100):return dict(xLabel=x,yLabel=y,xMax=xm,yMax=ym,curves=[],points=[],guides=[],regions=[],annotations=[],caption='Schematic; labeled numbers specify quantitative values.')
def curve(s,label,points,style='primary'):
 s['curves'].append(dict(id='c'+str(len(s['curves'])),label=label,style=style,points=[dict(x=x,y=y) for x,y in points]))
def line(s,label,a,b,style='primary'):
 lo=0;hi=s['xMax']*.94;low=s.get('yMin',0);high=s['yMax']*.94
 if b:
  ends=sorted([(low-a)/b,(high-a)/b]);lo=max(lo,ends[0]);hi=min(hi,ends[1])
 curve(s,label,[(lo,a+b*lo),(hi,a+b*hi)],style)
def mark(s,label,x,y,xl=None,yl=None):
 s['points'].append(dict(id='p'+str(len(s['points'])),label=label,x=x,y=y))
 if xl is not None or yl is not None:s['guides'].append(dict(id='g'+str(len(s['guides'])),x=x,y=y,**({'xLabel':str(xl)} if xl is not None else {}),**({'yLabel':str(yl)} if yl is not None else {})))
def note(s,text,x,y):s['annotations'].append(dict(id='n'+str(len(s['annotations'])),text=text,x=x,y=y))
def region(s,points,fill='dwl',label=None):s['regions'].append(dict(id='r'+str(len(s['regions'])),fill=fill,points=[dict(x=x,y=y) for x,y in points],**({'label':label} if label else {})))
def put(slug,ids,*scenes):
 for i in ([ids] if isinstance(ids,int) else ids):
  q=BANK[slug][i-1];assert q['graphRequired'],(slug,i);q['graphScenes']=copy.deepcopy(list(scenes))
def sample(s,label,fn,lo=0,hi=90,style='primary'):
 curve(s,label,[(x,fn(x)) for x in [lo+(hi-lo)*i/60 for i in range(61)] if s.get('yMin',0)<=fn(x)<=s['yMax']],style)
def ppc(x=80,y=80,straight=False,label='PPC1',s=None,style='primary'):
 s=s or sc('Good X','Good Y',x*1.5,y*1.5)
 sample(s,label,lambda q:y*(1-q/x) if straight else y*math.sqrt(max(0,1-(q/x)**2)),hi=x,style=style);return s
def market(d=0,ss=0,macro=False,k=1,labels=True):
 s=sc('Real output' if macro else 'Quantity','Price level' if macro else 'Price',140,140)
 D='AD' if macro else 'D';S='SRAS' if macro else 'S';a=50-50*k
 line(s,D+'1' if d else D,100,-1);line(s,S+'1' if ss else S,a,k,'secondary')
 if d:line(s,D+'2',100+d,-1,'tertiary')
 if ss:line(s,S+'2',a-k*ss,k,'tertiary')
 if labels:
  mark(s,'E1' if d or ss else 'E',50,50,'Y1' if macro else 'Q1','P1')
  if d or ss:
   x=(100+d-a+k*ss)/(1+k);mark(s,'E2',x,100+d-x,'Y2' if macro else 'Q2','P2')
 return s
def shift(label='D',delta=0,k=-1):
 s=sc(xm=140,ym=140);line(s,label+'1' if delta else label,50-50*k,k)
 if delta:line(s,label+'2',50-50*k-k*delta,k,'secondary')
 return s
# Unit 1 production possibilities.
for i in [12,21,36,52,55,73,75,80,91]:
 vals={12:(80,80,80,110),21:(80,80,55,80),36:(70,80,110,80),52:(90,80,60,80),55:(70,80,110,80),73:(70,100,110,70),75:(80,160,120,160),80:(90,90,180,90),91:(50,100,100,100)}[i]
 x,y,nx,ny=vals;s=sc('Manufactured goods' if i in [12,55] else ('Crops' if i==21 else 'Good X'),'Agricultural goods' if i==12 else ('Services' if i in [21,55] else 'Good Y'),max(x,nx)*1.35,max(y,ny)*1.35)
 ppc(x,y,i in [75,80,91],s=s);ppc(nx,ny,i in [75,80,91],label='PPC2',s=s,style='secondary')
 if i==52:mark(s,'J',0,80);mark(s,'K',90,0);mark(s,'L',60,0)
 if i==91:mark(s,'',40,60,'40','60')
 put('1-5',i,s)
for i in [39,48,74]:
 s=ppc();ppc(110,110,label='PPC2',s=s,style='secondary');mark(s,'R' if i==39 else ('B' if i==74 else 'C'),80,75 if i==39 else (math.sqrt(110**2-80**2) if i==74 else 100))
 if i==74:mark(s,'A',30,30)
 put('1-5',i,s)
s=ppc();mark(s,'A',20,math.sqrt(80**2-20**2));mark(s,'D',70,math.sqrt(80**2-70**2));mark(s,'B',30,25);mark(s,'C',80,80);put('1-5',51,s)
s=ppc(60,120,True);mark(s,'',60,0,'60');mark(s,'',0,120,None,'120');put('1-5',35,s)
s=ppc(100,200,True);mark(s,'',40,120,'40','120');mark(s,'',100,0,'100');mark(s,'',0,200,None,'200');put('1-5',58,s)
s=ppc();mark(s,'A',75,math.sqrt(80**2-75**2));mark(s,'B',25,math.sqrt(80**2-25**2));put('1-5',65,s)
s=sc('Good X','Good Y');curve(s,'PPC',[(0,90),(20,86),(40,80),(65,50),(80,20),(84,0)]);mark(s,'P',40,50,'40','50');mark(s,'A',65,50,'65');mark(s,'B',40,80,None,'80');put('1-5',79,s)
s=ppc();mark(s,'P',40,35);mark(s,'Q',40,math.sqrt(80**2-40**2));put('1-5',97,s)
# Demand/supply and elasticities.
for ids,label,k,delta in [([9,39,54,55,64,73,84,98],'D',-1,20),([10,40],'D',-1,-20),([14,41,65,78],'S',1,20),([15,42,85],'S',1,-20),([20,21,24,43,44],'D',-1,0)]:
 for i in ids:
  ll,kk=('S',1) if i in [21,44] else (label,k);s=shift(ll,delta,kk)
  if i in [20,21,43,44,98]:
   names=('A','B');coords=(30,65) if kk<0 and i!=98 else ((65,30) if kk<0 else (30,65))
   for name,x in zip(names,coords):mark(s,name,x+(delta if name=='B' and i==98 else 0),50+kk*(x-50))
  put('2-1',i,s)
for i in [21,22,51,52]:
 s=sc();curve(s,'D',[(50,0),(50,90)] if i in [21,51] else [(0,50),(90,50)])
 if i==51:mark(s,'',50,30,'Q','P1');mark(s,'',50,70,None,'P2')
 if i==52:mark(s,'',0,70,'0','P2');mark(s,'',80,50,None,'P1')
 put('2-2',i,s)
for i in [53,54,76,78]:
 s=sc();curve(s,'D',[(0,90),(90,0)])
 pts={53:[('A',20),('B',45),('C',70)],54:[('U',20),('L',70)],76:[('W',20),('Z',70)],78:[('M',45)]}[i]
 for l,x in pts:mark(s,l,x,90-x)
 put('2-2',i,s)
for i in [7,23,38,39,40,41,80,81]:
 s=sc(y='Price');kind='vertical' if i==7 else ('origin' if i in [23,38] else ('q' if i in [39,81] else ('p' if i in [40,80] else 'horizontal')))
 if kind=='vertical':curve(s,'S',[(50,0),(50,90)])
 elif kind=='horizontal':curve(s,'S',[(0,50),(90,50)])
 else:line(s,'S',0 if kind=='origin' else (-20 if kind=='q' else 20),1)
 if i in [23,38]:
  mark(s,'A',30,30,'Q1','P1');mark(s,'B',65,65,'Q2','P2')
 put('2-3',i,s)
for i in [37,78,79]:
 scenes=[]
 kinds=['v','h','o','down'] if i==37 else (['v','h','o','p'] if i==78 else ['o','p','q','v'])
 for j,kind in enumerate(kinds):
  s=sc();s['caption']=('S'+str(j+1)) if i==78 else chr(65+j)
  if kind=='v':curve(s,'S',[(50,0),(50,90)])
  elif kind=='h':curve(s,'S',[(0,50),(90,50)])
  else:line(s,'S',0 if kind=='o' else (20 if kind=='p' else (-20 if kind=='q' else 90)),-1 if kind=='down' else 1)
  scenes.append(s)
 put('2-3',i,*scenes)
# Simultaneous shifts: two possible sizes when either result is unspecified.
for i,d,ss in [(11,20,0),(12,0,20),(13,-20,0),(14,0,-20),(15,20,20),(16,-20,-20),(17,20,-20),(18,-20,20),(34,20,0),(35,0,-20),(36,30,10),(37,-10,-30),(38,20,-20),(39,-20,20),(72,20,20),(73,20,-20),(74,-20,20)]:
 scenes=[market(d,ss)]
 if d and ss and i not in [36,37]:
  scenes=[market(d*1.5,ss*.5),market(d*.5,ss*1.5)]
  for j,s in enumerate(scenes):s['caption']='Possible shift sizes '+str(j+1)+'; magnitudes are unspecified.'
 put('2-4',i,*scenes)
s=market(20,20,labels=False);put('2-4',40,s)
for i in [65,66,68,75]:
 a=market(0,20 if i in [65,68] else -20);b=market(20,0) if i in [65,66,75] else market(0,20)
 a['caption']={65:'Air travel',66:'Rail travel',68:'Mutton',75:'Coffee'}[i];b['caption']={65:'Hotels',66:'Coaches',68:'Wool',75:'Tea'}[i];put('2-4',i,a,b)
put('2-4',67,market(20,0))
# Consumer/producer surplus: full geometry and changed areas.
def surplus(p1=50,p2=None,d=True,a=100,b=-1,other=0,xm=120,ym=120):
 s=sc(xm=xm,ym=ym);line(s,'D' if d else 'S',a,b);q1=(p1-a)/b;line(s,'P1' if p2 else 'P',p1,0,'reference');mark(s,'',q1,p1,'Q1','P1' if p2 else str(p1))
 if p2 is None:region(s,[(0,p1),(q1,p1),(0,a)],'cs' if d else 'ps')
 else:
  q2=(p2-a)/b;line(s,'P2',p2,0,'secondary');mark(s,'',q2,p2,'Q2','P2');region(s,[(0,p1),(q1,p1),(q1,p2),(0,p2)],'benefit','R');region(s,[(q1,p1),(q2,p2),(q1,p2)],'cs' if d else 'ps','T')
 return s
for i in [3,4,11,12,21,22,24,25,63,64,81,82,97,98]:
 d=i not in [4,12,22,64,82,98];p1,p2,a,b,xm,ym=50,None,100 if d else 0,-1 if d else 1,120,120
 if i in [11,63]:p2=35
 if i in [12,64]:p2=65
 if i==21:p1,a,b,xm,ym=30,50,-.5,70,65
 if i==22:p1,a,b,xm,ym=20,8,.24,80,40
 if i==81:p1,p2,a,b,xm,ym=20,15,80/3,-1/6,110,40
 if i==82:p1,p2,a,b,xm,ym=10,16,2.5,.3,70,25
 if i in [97,98]:
  s=sc();curve(s,'D' if d else 'S',[(50,0),(50,90)]);line(s,'P1',60 if d else 40,0);line(s,'P2',40 if d else 60,0,'secondary');region(s,[(0,40),(50,40),(50,60),(0,60)],'benefit');put('2-5',i,s);continue
 s=surplus(p1,p2,d,a,b,xm=xm,ym=ym)
 if i in [24,25]:line(s,'S',0,1,'secondary');s['regions'][0]['label']='A';region(s,[(0,0),(50,50),(0,50)],'ps','B');region(s,[(60,10),(85,10),(85,25)],'cost','C')
 if i==21:mark(s,'',40,30,'40','30');mark(s,'',0,50,None,'50')
 if i==22:mark(s,'',50,20,'50','20');mark(s,'',0,8,None,'8')
 if i==81:s['guides']=[];mark(s,'',40,20,'40','20');mark(s,'',70,15,'70','15')
 if i==82:s['guides']=[];mark(s,'',25,10,'25','10');mark(s,'',45,16,'45','16')
 put('2-5',i,s)
for i in [36,40,41]:
 s=market(20 if i!=41 else 0,20 if i==41 else 0);region(s,[(0,0 if i!=41 else 100),(50,50),(0,50)],'ps' if i!=41 else 'cs','A')
 if i!=36:
  region(s,[(0,50),(50,50),(50,60 if i==40 else 40),(0,60 if i==40 else 40)],'benefit','B');region(s,[(50,50),(60,60 if i==40 else 40),(50,60 if i==40 else 40)],'benefit','C')
 put('2-5',i,s)
for i in [30,31,59,60,79,80,91,92,95,96]:
 scenes=[];d=i in [30,59,79,91,96]
 for j,k in enumerate([.45,1.7]):
  s=sc(xm=140,ym=140);s['caption']='Market '+chr(65+j);line(s,'D' if d else 'S',50+50*k if d else 50-50*k,-k if d else k)
  if i in [30,31]:
   p=35 if d else 65;line(s,'P1',50,0,'reference');line(s,'P2',p,0,'secondary');q=50+(50-p)/k if d else 50+(p-50)/k;mark(s,'',50,50,'Q1','P1');mark(s,'',q,p,'Q2','P2')
  else:
   if d:line(s,'S1',0,1,'secondary');shiftamt=-20 if i in [59,79] else 20;line(s,'S2',-shiftamt,1,'tertiary');q=(50+50*k+shiftamt)/(1+k);p=q-shiftamt
   else:line(s,'D1',100,-1,'secondary');shiftamt=-20 if i==92 else 20;line(s,'D2',100+shiftamt,-1,'tertiary');q=(100+shiftamt-(50-50*k))/(1+k);p=100+shiftamt-q
   mark(s,'E1',50,50,'Q1','P1');mark(s,'E2',q,p,'Q2','P2')
   if i in [79,80]:region(s,[(0,50),(min(50,q),50),(min(50,q),p),(0,p)],'cost' if i==79 else 'benefit')
  scenes.append(s)
 put('2-5',i,*scenes)
# Reasons for intervention, without supplying the policy's outcome.
for i in [23,38,60,82,92]:
 s=market();line(s,'Pa' if i==23 else ('Ps' if i==38 else ('Pc' if i==60 else ('P*' if i==82 else 'Pf'))),35 if i in [23,60,82] else 70,0,'reference');put('3-1',i,s)
# Price controls, taxes, subsidies, buffers and information.
for i in [3,8,30,59,63,64,69,70]:
 d=20 if i in [30,69] else (-20 if i in [59,70] else 0);ss=-20 if i in [3,64] else (20 if i in [8,63] else 0);s=market(d,ss,k=2 if i==69 else (.4 if i==70 else 1))
 if i in [63,64]:
  q=60 if i==63 else 40;pb=40 if i==63 else 60;ps=60 if i==63 else 40;mark(s,'',q,ps,None,'P3');mark(s,'',q,pb,None,'P2')
 put('3-2',i,s)
for i in [14,16,18,19,47,48,49,54,66,67,83,84]:
 s=market(labels=False);p=35 if i in [14,19,49,66,83] else 70;line(s,'Pc' if p<50 else 'Pf',p,0,'reference');mark(s,'E',50,50,'Qe','Pe');mark(s,'',p,p,'Qs');mark(s,'',100-p,p,'Qd')
 if i in [18,19,54]:
  s=market(0,20 if i!=19 else -20);line(s,'PL',40,0,'reference');line(s,'PU',70,0,'reference')
 if i in [47,48]:
  s=market(labels=False);p,e=(11,9) if i==47 else (12,14);s['yLabel']='Price (scaled)';line(s,'Ceiling' if i==47 else 'Floor',50*p/e,0,'reference');mark(s,'E',50,50,None,str(e));mark(s,'',0,50*p/e,None,str(p))
 if i in [49,83,84]:
  p,qs,qd=(6,900,1500) if i==49 else ((6,700,1000) if i==83 else (10,1200,800));s=sc(xm=1800,ym=16);line(s,'D1' if i==84 else 'D',p+qd*.006,-.006);line(s,'S1' if i==83 else 'S',p-qs*.006,.006,'secondary');line(s,'Pc' if i!=84 else 'Pf',p,0,'reference');mark(s,'',qs,p,'Qs1' if i==83 else str(qs),str(p));mark(s,'',qd,p,'Qd1' if i==84 else str(qd))
  if i==83:line(s,'S2',p-900*.006,.006,'tertiary');mark(s,'',900,p,'Qs2 = 900')
  if i==84:line(s,'D2',p+1050*.006,-.006,'tertiary');mark(s,'',1050,p,'Qd2 = 1050')
 if i==66:line(s,'S2',-20,1,'tertiary')
 if i==67:line(s,'D2',120,-1,'tertiary')
 put('3-2',i,s)
s=sc(xm=120,ym=16);line(s,'D',14,-.08);line(s,'S1',3,.1,'secondary');line(s,'S2',5,.1,'tertiary');mark(s,'E1',50,8,None,'8');mark(s,'',60-20/9,9.2,None,'9.2');mark(s,'',60-20/9,7.2,None,'7.2');put('3-2',31,s)
for i in [34,35,40]:
 s=sc();curve(s,'D',[(50,0),(50,90)] if i!=35 else [(0,50),(90,50)]);line(s,'S1',0,1,'secondary');line(s,'S2',-20 if i==40 else 20,1,'tertiary');mark(s,'',50,50,'Q1','P1');q=50 if i!=35 else 30;mark(s,'',q,30 if i==40 else (50 if i==35 else 70),'Q2','P2');put('3-2',i,s)
s=sc('Pre-tax income','After-tax income');line(s,'No tax',0,1,'reference');line(s,'Before',0,.8);curve(s,'After',[(0,0),(40,32),(90,52)],'secondary');put('3-3',65,s)
s=market(k=1);s['xLabel']='Labour';s['yLabel']='Wage';line(s,'Minimum wage',70,0,'tertiary');mark(s,'',30,70,'Ld');mark(s,'',70,70,'Ls');put('3-3',92,s)
# Aggregate-demand/supply panels: individually stored after resolving the model and shifts.
for slug,bank in BANK.items():
 for q in bank:
  if not q['graphRequired'] or q.get('graphScenes'):continue
  desc=q['graphDescription'];t=desc.lower();i=q['id']
  if not (slug=='4-3' or 'price level' in t or 'general price' in t or 'ad/as' in t or 'ad-as' in t or 'ad/ as' in t):continue
  if not ('ad' in t or 'aggregate' in t or 'lras' in t):continue
  # LRAS-only identification/capacity panels.
  if 'lras' in t and ('only' in t or 'no ' in t or 'not required' in t or 'current output' in t or 'weak' in t or 'timing' in t or 'year 1' in t or slug=='5-4' and i in [2,22,32,50,62,68,69,75,97,100] or slug=='5-1' and i in [41,68]):
   s=sc('Real output','Price level',140,140);curve(s,'LRAS1',[(70,0),(70,125)]);curve(s,'LRAS2',[(100,0),(100,125)],'secondary');mark(s,'',70,0,'Y1');mark(s,'',100,0,'Y2')
   if 'weak' in t or 'current' in t:mark(s,'Current output',40,0,'Y')
   if 'timing' in t or 'year 1' in t:
    a=market(20,0,True);a['caption']='Initial demand effect';s['caption']='Later capacity effect';put(slug,i,a,s)
   else:put(slug,i,s)
   continue
  dr=bool(re.search(r'ad\w*[^.;\n]{0,45}(?:shift(?:s|ing)?|moves?) (?:to the )?right',t) or re.search(r'rightward (?:shift of )?ad',t));dl=bool(re.search(r'ad\w*[^.;\n]{0,45}(?:shift(?:s|ing)?|moves?) (?:to the )?left',t) or re.search(r'leftward (?:shift of )?ad',t))
  sr=bool(re.search(r'(?:sras|as|aggregate supply)[12]?[^.;\n]{0,35}shift(?:s|ing)? (?:to the )?right',t));sl=bool(re.search(r'(?:sras|as|aggregate supply)[12]?[^.;\n]{0,35}shift(?:s|ing)? (?:to the )?left',t))
  # Explicit source groups eliminate ambiguous extraction around 'AD1 lies right of AD2'.
  if slug=='4-3':
   if i in [30,42,55,56,57,96,97]:dr=True
   if i==60:dl=True
   if i in [58,66,81]:sl=True
   if i in [59,67,82]:sr=True
   if i in [66,68,81]:dr=True
   if i in [67,69,82]:dl=True
   if i==68:sr=True
   if i==69:sl=True
  if slug=='6-4':
   dr=i in [46,64,65,76,92];dl=i in [47,66,67,75];sl=i in [64,65,76];sr=i in [66,67,75,93]
  if slug=='6-5' and i==67:dl=True
  d=20 if dr else (-20 if dl else 0);ss=20 if sr else (-20 if sl else 0)
  k=.2 if any(w in t for w in ['relatively flat','relatively elastic','highly elastic','substantial spare','horizontal segment']) else (4 if any(w in t for w in ['steep','close to capacity','near capacity','nearly vertical']) else 1)
  s=market(d,ss,True,k)
  if 'keynesian' in t or 'horizontal section' in t or 'vertical section' in t or 'vertical part' in t or slug=='4-3' and i in [27,53,54,56,57,97]:
   s=sc('Real output','Price level',140,140);curve(s,'AS',[(0,25),(50,25),(75,38),(90,60),(100,90),(100,125)],'secondary')
   if d:
    a=60 if 'horizontal' in t or 'highly elastic' in t or i in [56,97] else (190 if 'vertical' in t else 130)
    if a==60:line(s,'AD1',60,-1);line(s,'AD2',60+d,-1,'tertiary');mark(s,'E1',35,25,'Y1','P1');mark(s,'E2',35+d,25,'Y2','P2')
    elif a==190:line(s,'AD1',190,-1);line(s,'AD2',190+d,-1,'tertiary');mark(s,'E1',100,90,'Yf','P1');mark(s,'E2',100,90+d,None,'P2')
    else:line(s,'AD1',130,-1);line(s,'AD2',130+d,-1,'tertiary')
   mark(s,'',100,0,'Yf')
  elif ('vertical lras' in t or 'vertical LRAS' in desc or slug=='4-3' and i in [55,96]) and not ss:
   s=sc('Real output','Price level',140,140);curve(s,'LRAS',[(70,0),(70,125)],'secondary');line(s,'AD1',120,-1);line(s,'AD2',140,-1,'tertiary');mark(s,'E1',70,50,'Yf','P1');mark(s,'E2',70,70,None,'P2')
  if 'lras1' in t and not any(c['label'].startswith('LRAS') for c in s['curves']):
   curve(s,'LRAS1',[(50,0),(50,125)],'reference');curve(s,'LRAS2',[(70,0),(70,125)],'muted')
  if any(w in t for w in ['full-employment output','full-employment level','full employment','capacity marker','capacity points']) and not any(c['label'].startswith('LRAS') for c in s['curves']):mark(s,'',100,0,'Yf')
  if slug=='4-3' and i in [13,17,22,28,41,89]:
   s=sc('Real output','Price level');label='SRAS' if i in [22,28] else 'AD';line(s,label,0 if label=='SRAS' else 100,1 if label=='SRAS' else -1)
   if i in [17,28,41]:
    for name,x in zip(('A','B') if i==28 else ('L','M'),[30,65]):mark(s,name,x,x if label=='SRAS' else 100-x)
   if i==89:line(s,'SRAS',0,1,'secondary');mark(s,'',30,30,None,'P1');mark(s,'',70,70,None,'P2')
  if slug=='4-3' and i==26:
   scenes=[]
   for j,kind in enumerate(['v','d','h','c']):
    a=sc('Real output','Price level');a['caption']=chr(65+j)
    if kind=='v':curve(a,'LRAS',[(60,0),(60,90)])
    elif kind=='c':sample(a,'LRAS',lambda x:90*math.exp(-x/35))
    else:line(a,'LRAS',90 if kind=='d' else 50,-1 if kind=='d' else 0)
    scenes.append(a)
   put(slug,i,*scenes);continue
  if d and ss and any(w in t for w in ['unspecified','relative','depends','opposing','not specify','indeterminate','ambiguous']) and not (slug=='6-4' and i==76):
   scenes=[market(d*1.5,ss*.5,True,k),market(d*.5,ss*1.5,True,k)]
   for j,a in enumerate(scenes):a['caption']='Possible shift sizes '+str(j+1)+'; magnitudes are unspecified.'
   put(slug,i,*scenes)
  else:put(slug,i,s)
# PPC questions in macro/efficiency.
for slug,bank in BANK.items():
 for q in bank:
  if not q['graphRequired'] or q.get('graphScenes'):continue
  t=q['graphDescription'].lower();i=q['id']
  if 'ppc' not in t or slug=='6-1':continue
  s=ppc()
  if any(w in t for w in ['outward','ppc2','outward-shifted','outside ppc1']):ppc(110,110,label='PPC2',s=s,style='secondary')
  if any(w in t for w in ['inside','interior']):
   mark(s,'U' if slug=='7-3' and i in [13,77] else 'A',30,30);mark(s,'V' if slug=='7-3' and i==77 else 'B',math.sqrt(80**2-30**2) if 'unchanged' in t or 'directly' in t else 60,30 if 'unchanged' in t or 'directly' in t else math.sqrt(80**2-60**2))
  if slug=='7-3' and i==6:s['points']=[];mark(s,'A',60,math.sqrt(80**2-60**2));mark(s,'B',30,30);mark(s,'C',90,90)
  if slug=='7-3' and i==76:mark(s,'A',30,math.sqrt(80**2-30**2));mark(s,'B',70,math.sqrt(80**2-70**2))
  if slug=='4-4' and i==97:s['xLabel']='Consumer goods';s['yLabel']='Capital goods';mark(s,'A',70,math.sqrt(80**2-70**2));mark(s,'B',30,math.sqrt(80**2-30**2))
  put(slug,i,s)
# Trade possibility lines: fully labeled, stand-alone numerical examples.
for q in BANK['6-1']:
 if not q['graphRequired']:continue
 i=q['id'];x,y,r={20:(50,100,3),47:(60,120,3),48:(60,120,3),74:(80,160,3),75:(80,160,3),76:(80,160,3),80:(100,100,.8),81:(100,200,2),97:(70,140,2.5)}.get(i,(60,120,3))
 s=sc('Good X','Good Y',x*1.4,max(y,x*r)*1.3);ppc(x,y,True,s=s);curve(s,'Trade possibilities',[(0,x*r),(x,0)],'secondary');mark(s,'',x,0,str(x));mark(s,'',0,y,None,str(y))
 if i in [47,48,74,75,97]:
  cx=40 if i in [47,48] else 50;mark(s,'C',cx,(x-cx)*r,str(cx),str((x-cx)*r))
  if i==75:mark(s,'D',cx,y*(1-cx/x),None,str(y*(1-cx/x)))
 elif i in [42,50]:mark(s,'C',40,60)
 put('6-1',i,s)
# Exchange-rate markets and liquidity preference.
for slug,bank in BANK.items():
 for q in bank:
  if not q['graphRequired'] or q.get('graphScenes'):continue
  t=q['graphDescription'].lower();i=q['id']
  if not ('foreign-exchange' in t or 'floating currency' in t or 'currency supply' in t or 'market for currency' in t or 'liquidity' in t or 'loanable' in t):continue
  money=slug=='9-4';d=20 if 'demand shifts right' in t or 'demand shifting right' in t or 'preference shifting right' in t else (-20 if 'demand shifts left' in t else 0);ss=20 if 'supply shifts right' in t or 'supply shifting right' in t else (-20 if 'supply shifts left' in t or 'supply shifting left' in t else 0)
  if slug=='6-4':d=20 if i in [27,36,58] else (-20 if i==59 else 0);ss=20 if i in [28,37,59] else (-20 if i==58 else 0)
  if slug=='6-5':d=20 if i==68 else 0;ss=20 if i==99 else 0
  if slug=='10-2':d=-20;ss=20
  s=market(d,ss);s['xLabel']='Quantity of money' if money else 'Quantity of domestic currency';s['yLabel']='Interest rate' if money else 'Foreign currency per domestic unit'
  if money and i in [28,59,91]:
   s=sc('Quantity of money','Interest rate');curve(s,'L1' if i==59 else 'L',[(0,90),(65,20),(90,20)] if i==91 else [(0,90),(90,0)])
   curve(s,'MS1' if i in [28,91] else 'MS',[(40,0),(40,90)],'secondary')
   if i in [28,91]:curve(s,'MS2',[(75,0),(75,90)],'tertiary')
   if i==91:s['curves'][1]['points']=[dict(x=70,y=0),dict(x=70,y=90)]
   if i==59:line(s,'L2',110,-1,'tertiary')
  if slug=='11-2':
   p=70 if i in [10,51,90] else 35;line(s,'Fixed rate',p,0,'tertiary');mark(s,'',p,p,'Qs');mark(s,'',100-p,p,'Qd')
  put(slug,i,s)

# Time-series and theory curves.
for i in [3,34,35,71]:
 s=sc('Tax rate (%)','Tax revenue',110,110);sample(s,'Laffer curve',lambda x:100*(1-((x-50)/50)**2),hi=100)
 for label,x in ([('A',25),('B',30)] if i==34 else ([('A',75),('B',70)] if i==35 else ([('A',70),('B',45)] if i==71 else []))):mark(s,label,x,100*(1-((x-50)/50)**2),str(x)+'%')
 s['caption']='Illustrative relationship; the peak is not an estimated optimum.';put('10-3',i,s)
for i in [21,52,84]:
 s=sc('Real income per head','Income inequality');sample(s,'Kuznets curve',lambda x:20+65*math.sin(math.pi*x/100),hi=100)
 if i==84:mark(s,'A',25,20+65*math.sin(math.pi/4))
 put('11-3',i,s)
for i in [11,40,41,42]:
 s=sc('Population','Output per head',130,130);sample(s,'Q1',lambda x:90-((x-55)/7)**2,lo=0,hi=115);mark(s,'',55,90,'P1')
 if i==42:sample(s,'Q2',lambda x:110-((x-75)/8)**2,lo=0,hi=130,style='secondary');mark(s,'',75,110,'P2')
 if i in [40,41]:
  for label,x in zip(('A','B'),[20,35] if i==40 else [75,90]):mark(s,label,x,90-((x-55)/7)**2)
 put('11-4',i,s)
for i in [17,19,45,46,85]:
 s=sc('Cumulative population (%)','Cumulative income (%)',110,110);line(s,'Equality',0,1,'reference')
 if i!=17:
  sample(s,'A' if i in [45,85] else 'L1',lambda x:100*(x/100)**1.6,hi=100)
  if i==85:sample(s,'B',lambda x:100*(x/100)**1.6+12*math.sin(math.pi*x/100)*(x-60)/40,hi=100,style='secondary')
  else:sample(s,'B' if i==45 else 'L2',lambda x:100*(x/100)**(1.25 if i==46 else 2.5),hi=100,style='secondary')
 mark(s,'',100,100,'100%','100%');put('11-4',i,s)
for i in [47,81]:
 s=sc('Time','Current-account balance ($bn)',100,10);s['yMin']=-40;curve(s,'Balance',[(0,-20),(15,-25),(30,-28),(45,-22),(70,-10),(90,-5)]);line(s,'Zero',0,0,'reference');mark(s,'Depreciation' if i==47 else 'Devaluation',0,-20,'t0','−20');mark(s,'',30,-28,None,'−28');mark(s,'',90,-5,None,'−5');put('11-2',i,s)
for i in [53,54]:
 s=sc('Time','Exchange rate');line(s,'Upper band',75,0,'reference');line(s,'Lower band',35,0,'reference');curve(s,'Market rate',[(0,55),(25,50 if i==53 else 60),(50,40 if i==53 else 70),(70,35 if i==53 else 75),(90,40 if i==53 else 70)]);put('11-2',i,s)
for slug,ids in [('4-5',[82,83]),('5-1',[86]),('9-2',[26,44,66,94]),('9-3',[54,85]),('10-2',[93])]:
 for i in ids:
  if slug=='5-1':
   s=sc('Year','Unemployment rate (%)',6,12);curve(s,'Unemployment',[(1,9),(2,7),(3,5),(4,4),(5,4)]);[mark(s,'',x,y,str(x),str(y)+'%') for x,y in [(1,9),(4,4),(5,4)]]
  elif slug=='4-5' and i==83:
   s=sc('Month across four years','Unemployment rate (%)',52,12);sample(s,'Unemployment',lambda x:6+3*math.cos(2*math.pi*x/12),hi=48)
   for x in [0,12,24,36]:mark(s,'',x,9,'Jan '+str(int(x/12)+1))
   for x in [6,18,30,42]:mark(s,'',x,3,'Jul '+str(int(x/12)+1))
  elif slug=='4-5':
   s=sc('Time','Unemployment rate (%)',100,15);curve(s,'Seasonally adjusted',[(0,5),(25,4),(40,6),(55,12),(70,9),(90,5)]);note(s,'Recession',42,14);note(s,'Recovery',75,13)
  elif slug=='9-2':
   s=sc('Time','Real GDP',100,140);line(s,'Potential output',50,.5,'reference');fn=lambda x:50+.5*x+20*math.sin(math.pi*(x-25)/40)
   if i==66:curve(s,'Actual output',[(0,80),(20,100),(40,95),(60,88),(90,115)]);mark(s,'A',20,100);mark(s,'B',60,88)
   else:
    sample(s,'Actual output',fn,hi=95);mark(s,'A',5,fn(5));mark(s,'B',45,fn(45))
  elif slug=='9-3' and i==54:
   s=sc('Time','Unemployment rate (%)',100,16);curve(s,'Unemployment',[(0,4),(20,4),(40,12),(60,9),(80,7),(95,7)]);line(s,'U1',4,0,'reference');line(s,'U2',7,0,'secondary')
  elif slug=='9-3':
   s=sc('Time','Index',100,160);curve(s,'Unemployment',[(0,70),(30,80),(60,100),(90,120)]);curve(s,'Vacancies',[(0,90),(30,95),(60,115),(90,145)],'secondary')
  else:
   # Two panels avoid misleading comparisons between differently scaled variables.
   s=sc('Time','Real GDP index',100,160);line(s,'Real GDP',80,.6);a=sc('Time','Current-account balance',100,30);a['yMin']=-30;curve(a,'Current account',[(0,20),(30,8),(60,-5),(90,-20)]);line(a,'Zero',0,0,'reference');put(slug,i,s,a);continue
  put(slug,i,s)
s=sc('Unemployment rate','Inflation rate');sample(s,'SRPC1',lambda x:800/(x+15),hi=90);sample(s,'SRPC2',lambda x:20+800/(x+15),hi=90,style='secondary');curve(s,'LRPC',[(45,0),(45,90)],'tertiary');put('10-2',67,s)
for i in [37,75]:
 s=market(-20,20);s['xLabel']='Quantity of domestic currency';s['yLabel']='Foreign currency per domestic unit';put('10-2',i,s)
for i,d,ss in [(68,20,0),(99,0,20)]:
 s=market(d,ss);s['xLabel']='Quantity of domestic currency';s['yLabel']='Foreign currency per domestic unit';put('6-5',i,s)
for i in [52,53,54,79]:
 s=sc('National income','Planned expenditure',220,220);line(s,'45°',0,1,'reference');a,b=(30,.6) if i in [52,53] else ((50,.6) if i==54 else (40,.75));line(s,'AE',a,b);ye=a/(1-b);mark(s,'E',ye,ye,'YE');yf=110 if i==53 else 100;mark(s,'',yf,yf,'YF')
 if i in [54,79]:mark(s,'',yf,a+b*yf,None,'AE at YF');curve(s,'',[(yf,yf),(yf,a+b*yf)],'secondary')
 if i==79:s['caption']='National income and expenditure in $ millions; expenditure gap = 15.'
 put('9-1',i,s)
# Trade welfare geometry, retaining price and quantity labels.
for slug,ids in [('6-2',[45,91]),('11-6',[53,55,57,91,92])]:
 for i in ids:
  s=sc();line(s,'D',100,-1);line(s,'S',0,1,'secondary');p1,p2=40,25;line(s,'P1',p1,0,'reference');line(s,'P2',p2,0,'tertiary')
  for label,qx,py in [('Qs1',40,40),('Qd1',60,40),('Qs2',25,25),('Qd2',75,25)]:mark(s,'',qx,py,label)
  if slug=='6-2':s['caption']='World price P2; tariff-inclusive price P1.'
  if slug=='11-6' and i in [55,57,91,92]:
   region(s,[(25,25),(40,25),(40,40)],'benefit','12' if i==91 else 'Production gain');region(s,[(60,40),(60,25),(75,25)],'benefit','18' if i==91 else 'Consumption gain')
   region(s,[(0,25),(25,25),(40,40),(0,40)],'ps','Producer loss')
   region(s,[(40,25),(60,25),(60,40),(40,40)],'revenue','Revenue loss')
  if slug=='11-6' and i in [57,92]:
   line(s,'Outsider cost',15,0,'muted');region(s,[(40,15),(60,15),(60,25),(40,25)],'cost','31' if i==92 else 'Diversion cost');s['caption']='Tariff-inclusive price P1; member price P2; outsider resource cost below P2.'
   if i==92:s['caption']+=' Efficiency gains total 24; diversion loss 31.'
  put(slug,i,s)
# Utility.
for i in [45,46,47,66,81,82]:
 s=sc('Quantity consumed','Marginal utility' if i in [45,66,81,82] else 'Total utility');
 if i in [45,66]:s['yMin']=-25;curve(s,'MU',[(0,90),(90,-20)]);mark(s,'',90*90/110,0,'Q*')
 elif i in [46,47]:
  fn=lambda x:95*(1-math.exp(-x/30));sample(s,'TU',fn)
  for l,x in [('A' if i==46 else 'Q1',35),('Q2',40)] if i==47 else [('A',35)]:mark(s,l,x,fn(x),'Q1' if x==35 else 'Q2')
 else:
  line(s,'MU',90,-1);line(s,'C1',60,0,'secondary');line(s,'C2',35,0,'tertiary');mark(s,'',30,60,'Q1');mark(s,'',55,35,'Q2')
 put('7-1',i,s)
# Externality markets, with quantity and welfare areas calculated from intersections.
for slug,ids in [('7-4',[37,38,45,46,47,48,61,62,76,77,79,80,96]),('8-1',[8,17])]:
 for i in ids:
  s=sc('Output','Marginal cost / benefit',140,140);pos=i in [38,46,62,77,17];negative_consumption=i==96;mc=30 if i in [76,80,8] or not pos and not negative_consumption else (15 if i==77 else 0);mb=30 if pos else (10 if i==76 else (-25 if negative_consumption else 0))
  line(s,'MPC = MSC' if mc==0 else 'MPC',0,1,'secondary');line(s,'MPB = MSB' if mb==0 else 'MPB',100,-1)
  if mc:line(s,'MSC',mc,1,'tertiary')
  if mb:line(s,'MSB',100+mb,-1,'tertiary')
  qs=(100+mb-mc)/2;mark(s,'',50,50,'Qm');mark(s,'',qs,mc+qs,'Qs')
  if i in [45,46,79]:region(s,[(qs,mc+qs),(50,mc+50),(50,100+mb-50)],'dwl')
  if i==47:s=sc('Output','Marginal cost');line(s,'MPC',10,.5);line(s,'MSC',20,.8,'secondary')
  if i==48:s=sc('Consumption','Marginal benefit');line(s,'MPB',80,-.7);line(s,'MSB',100,-.85,'secondary')
  if i==96:
   s=sc('Quantity','Marginal benefit / cost');line(s,'MPB',100,-.6);line(s,'MSB1',90,-.7,'secondary');line(s,'MSB2',80,-.9,'tertiary');line(s,'MPC = MSC',10,.5,'muted')
  if i==79:
   other=copy.deepcopy(s)
   for c in other['curves']:
    for p in c['points']:p['y']=50+1.3*(p['y']-50)
   for r in other['regions']:
    for p in r['points']:p['y']=50+1.3*(p['y']-50)
   other['caption']='Larger marginal welfare gap; quantities unchanged.';s['caption']='Initial welfare gap';put(slug,i,s,other);continue
  if slug=='8-1':s['caption']='Private incentives adjusted to the social optimum.'
  put(slug,i,s)
s=market();s['guides'][0]['xLabel']='Qe';s['guides'][0]['yLabel']='Pe';line(s,'Maximum price',35,0,'tertiary');mark(s,'',35,35,'Qs','Pm');mark(s,'',65,35,'Qd');put('8-1',24,s)
s=sc('Permits','Permit price');line(s,'D',100,-1);curve(s,'S0',[(65,0),(65,90)],'secondary');curve(s,'S1',[(40,0),(40,90)],'tertiary');mark(s,'',65,35,'Q0','P0');mark(s,'',40,60,'Q1','P1');put('8-1',48,s)
# Labour, monopsony and economic rent.
for i in [45,46,53,58,82,92,94]:
 s=market(20 if i==45 else 0,20 if i==46 else 0);s['xLabel']='Labour';s['yLabel']='Wage'
 if i in [53,82]:
  s=sc('Employment','Wage / marginal product');line(s,'MRP',100,-1);line(s,'S',10,.5,'secondary');line(s,'MCL',10,1,'tertiary');mark(s,'',45,32.5,'Lm','Wm');mark(s,'',60,40,'Lc','Wc')
  if i==82:line(s,'Minimum wage',37,0,'reference');mark(s,'',54,37,'Lmin');curve(s,'MCL with floor',[(0,37),(54,37),(54,64),(84,94)],'muted')
 elif i in [58,92]:
  w,a=(20,0) if i==58 else (30,10);s=sc('Labour','Wage ($)',150,45);line(s,'S',a,.2,'secondary');line(s,'Wage',w,0);mark(s,'',100,w,'100',str(w));region(s,[(0,a),(100,w),(0,w)],'ps','Economic rent');region(s,[(0,0),(100,0),(100,w),(0,a)],'cost','Transfer earnings')
 elif i==94:
  s=sc('Labour','Wage');curve(s,'S',[(50,0),(50,90)],'secondary');line(s,'D1',90,-1);line(s,'D2',110,-1,'tertiary');mark(s,'',50,40,'L','W1');mark(s,'',50,60,None,'W2');region(s,[(0,40),(50,40),(50,60),(0,60)],'ps')
 put('8-3',i,s)

# Circular flow: arrows carry actual direction and type, not an unlabeled placeholder.
for q in BANK['4-2']:
 if not q['graphRequired']:continue
 i=q['id'];s=sc('','');s['caption']='Circular flow: households, firms and relevant sectors.'
 nodes=[dict(id='h',label='Households',x=130,y=220),dict(id='f',label='Firms',x=510,y=220)]
 edges=[]
 def edge(a,b,label,kind,lane):edges.append(dict(id='e'+str(len(edges)),to=b,label=label,kind=kind,lane=lane,**{'from':a}))
 if i in [4,5,6,7,88]:
  edge('h','f','Labour' if i==88 else 'A','real',-75);edge('f','h','B','real',-30);edge('f','h','Wages' if i==88 else 'C','money',30);edge('h','f','D','money',75)
 else:
  edge('h','f','Consumer spending','money',40);edge('f','h','Factor payments','money',-40)
  if i in [18,19,57,58]:
   nodes.append(dict(id='g',label='Government',x=320,y=75));edge('h','g','T','money',-45);edge('g','f','G','money',45)
  if i in [19,56,89]:
   nodes.append(dict(id='w',label='International',x=510,y=355));edge('f','w','M','money',-35);edge('w','f','X','money',35)
  if i in [18,19]:s['caption']='Equilibrium: injections equal withdrawals. Investment I and saving S also enter or leave the flow.'
 s['diagram']=dict(nodes=nodes,edges=edges);put('4-2',i,s)
# Budget lines and indifference curves: tangencies and compensated movements.
def ic(s,label,x,y,slope=1,style='primary',lo=5,hi=95):
 # Exponential curve has exact slope -slope at the marked tangency.
 sample(s,label,lambda q:y-20*slope+20*slope*math.exp(-(q-x)/20),lo=lo,hi=hi,style=style)
for q in BANK['7-2']:
 if not q['graphRequired']:continue
 i=q['id'];s=sc('Good X','Good Y',150,150)
 if i in [11,12,13,14,48,49,50]:
  x,y=80,80;nx,ny=(110,110) if i in [11,48] else ((60,60) if i==12 else ((120,80) if i in [13,49] else ((80,60) if i==14 else (80,120))))
  curve(s,'B1',[(0,y),(x,0)]);curve(s,'B2',[(0,ny),(nx,0)],'secondary')
 elif i in [56,65,66,67,89,100]:
  # One convex I1 supports both original and compensated tangencies.
  curve(s,'B1',[(0,90),(90,0)],'reference');curve(s,'B2',[(0,90),(150,15)],'secondary');curve(s,'BC',[(0,71.25),(142.5,0)],'tertiary')
  sample(s,'I1',lambda x:60-(x-30)+(x-30)**2/60,lo=12,hi=58)
  mark(s,'E1',30,60,'X1');mark(s,'E2',45,48.75,'X2')
  x3=20 if i in [65,100] else (38 if i==67 else 65);y3=90-.5*x3;ic(s,'I2',x3,y3,.5,'secondary',lo=max(5,x3-7),hi=x3+9);mark(s,'E3',x3,y3,'X3')
  s['caption']='B1: original; B2: new price; BC: compensated budget. E1, E2 and E3 show successive choices.'
 elif i in [61,62,91]:
  curve(s,'B1',[(0,80),(80,0)],'reference');curve(s,'B2',[(0,110),(110,0)],'secondary');ic(s,'I1',40,40);x2=30 if i in [62,91] else 55;ic(s,'I2',x2,110-x2,style='secondary');mark(s,'E1',40,40,'X1','Y1');mark(s,'E2',x2,110-x2,'X2','Y2')
 elif i==77:
  curve(s,'B',[(0,120),(60,0)]);ic(s,'I1',20,80,4,lo=8,hi=42);mark(s,'A',20,80);ic(s,'I2',35,50,2,'secondary',lo=20,hi=55);mark(s,'E',35,50)
 else:
  slope=3 if i==42 else 1;xx=25 if i==42 else 40;yy=75 if i==42 else 40;intercept=yy+slope*xx;curve(s,'B',[(0,intercept),(intercept/slope,0)]);ic(s,'I2',xx,yy,slope,lo=15 if i==42 else 5,hi=55 if i==42 else 95);mark(s,'E',xx,yy)
  if i==8:ic(s,'I1',40,25,style='reference');ic(s,'I3',40,60,style='secondary')
 put('7-2',i,s)
# Average/marginal costs derived from one total-cost function.
def costs():
 s=sc('Output','Cost per unit',120,140);avc=lambda x:50-.8*x+.008*x*x;atc=lambda x:avc(x)+500/x;mc=lambda x:50-1.6*x+.024*x*x
 sample(s,'AVC',avc,lo=8,hi=100);sample(s,'ATC',atc,lo=8,hi=100,style='secondary');sample(s,'MC',mc,lo=8,hi=98,style='tertiary');return s,avc,atc,mc
for slug,ids in [('7-5',[40,41,47,66,70,95]),('7-6',[48,49]),('7-3',[20,33,37,38,71,73,89,90])]:
 for i in ids:
  s,avc,atc,mc=costs()
  if slug=='7-3' and i in [37,89,90]:
   s=sc('Output','Price / marginal cost');line(s,'MC',10,.8,'secondary');line(s,'P' if i==37 else 'AR / MB',60 if i==37 else 100,0 if i==37 else -1);qe=62.5 if i==37 else 50;mark(s,'E',qe,60 if i==37 else 50,'Qe')
   if i in [89,90]:x=30 if i==89 else 70;mark(s,'',x,100-x,'Qm' if i==89 else 'Qx','Pm' if i==89 else None)
  elif slug=='7-3' and i in [20,33,71] or slug=='7-5' and i in [47,70]:
   s=sc('Output','Average cost',130,130);fn=lambda x:30+(x-60)**2/80;sample(s,'LRAC1' if i in [20,71] else ('LRAC' if i in [47,70] else 'AC'),fn,lo=0,hi=120)
   if i in [20,71]:sample(s,'LRAC2',lambda x:fn(x)-10,hi=120,style='secondary')
   if i in [33,70]:mark(s,'',30,fn(30),'Q1');mark(s,'',60,30,'Q2')
   if i==71:line(s,'P',55,0,'tertiary');mark(s,'',60,20,'Q');mark(s,'MC',60,20)
   if i==47:
    for j,x0 in enumerate([25,60,95]):sample(s,'SRAC'+str(j+1),lambda x,x0=x0:fn(x)+(x-x0)**2/35,lo=max(0,x0-30),hi=min(120,x0+30),style='secondary')
  elif slug=='7-3' and i==73:
   s=sc('Output','Price / cost',140,140);fn=lambda x:30+(x-90)**2/120;sample(s,'AC',fn,hi=125);line(s,'AR',108.125,-1,'secondary');sample(s,'MC',lambda x:fn(x)+x*(x-90)/60,lo=60,hi=115,style='tertiary');mark(s,'',85,23.125,'Qr');mark(s,'',90,30,'Minimum AC')
  else:
   if slug=='7-5' and i==40 or slug=='7-6' and i==48:mark(s,'',50,avc(50),'Shutdown' if slug=='7-6' else 'Qmin AVC')
   if slug=='7-5' and i==41:
    x=next(x/100 for x in range(5000,10000) if mc(x/100)>=atc(x/100));mark(s,'',x,atc(x),'Qmin ATC')
   if slug=='7-5' and i==66:mark(s,'',55,atc(55),'Q1');mark(s,'',55,mc(55))
   if slug=='7-5' and i==95:mark(s,'',88,mc(88),'Q')
   if slug=='7-6' and i==48:sample(s,'Short-run supply',mc,lo=50,hi=98,style='muted')
   if slug=='7-6' and i==49:
    for l,x in [('P1',65),('P2',80)]:line(s,l,mc(x),0,'reference');mark(s,'',x,mc(x),'Q1' if x==65 else 'Q2',l)
   if slug=='7-3' and i==38:line(s,'P',mc(85),0,'reference');mark(s,'',85,mc(85),'Qa');x=next(x/100 for x in range(5000,10000) if mc(x/100)>=atc(x/100));mark(s,'',x,atc(x),'Qp')
  put(slug,i,s)
# Monopoly and alternative objectives.
for slug,ids in [('7-6',[57,79,97]),('7-8',[39,40,60,65,66,73,92,93,96])]:
 for i in ids:
  s=sc('Output','Price / cost / revenue',130,130);line(s,'AR',100,-1);line(s,'MR',100,-2,'secondary');line(s,'MC',10,.5,'tertiary');qp=36;mark(s,'',qp,28,'Qp');mark(s,'',qp,64,None,'Pp')
  if i in [60,92,93] and slug=='7-8':
   s=sc('Quantity','Price');curve(s,'D',[(0,90),(90,0)]);mark(s,'M',45,45);mark(s,'U',20,70);mark(s,'L',70,20)
  elif i in [65,66,96] and slug=='7-8':
   s=sc('Quantity','Price / marginal revenue',120,130);s['yMin']=-25;curve(s,'AR',[(0,90),(50,65),(90,5)]);curve(s,'MR upper',[(0,90),(50,40)],'secondary');curve(s,'MR lower',[(50,-10),(60,-40)],'secondary');curve(s,'MR gap',[(50,40),(50,-10)],'reference');line(s,'MC1',8,.2,'tertiary')
   if i in [66,96]:line(s,'MC2',20,.2,'muted')
   mark(s,'',50,65,'Qk','Pk')
  elif slug=='7-6' and i==57:
   s=sc('Output','Cost / revenue',130,130);fn=lambda x:30+(x-70)**2/100;sample(s,'ATC',fn,lo=5,hi=125);line(s,'AR',70,-.8);line(s,'MR',70,-1.6,'secondary');sample(s,'MC',lambda x:fn(x)+x*2*(x-70)/100,lo=25,hi=110,style='tertiary');mark(s,'',30,fn(30),'Qe');mark(s,'',70,30,'Minimum ATC')
  elif slug=='7-6' and i==97:
   s=sc('Output','Cost / price',140,140);line(s,'AR',100,-1);line(s,'MR',100,-2,'secondary');sample(s,'LRAC',lambda x:20+1600/x,lo=15,hi=125,style='tertiary');line(s,'LRMC',20,0,'muted');mark(s,'',80,20,'Qe','Pe');mark(s,'',80,40,None,'AC')
  elif slug=='7-6' and i==79:mark(s,'',60,40,'Qc','Pc')
  elif i in [39,40,73]:
   mark(s,'',50,0,'Qr')
   if i==73:sample(s,'ATC',lambda x:10+.25*x+1668.75/x,lo=18,hi=100,style='muted');mark(s,'',65,35,'Qs')
  put(slug,i,s)

for i in [22,28]:
 s=sc('Real output','Price level');line(s,'SRAS',0,1)
 if i==28:mark(s,'A',30,30);mark(s,'B',65,65)
 put('4-3',i,s)
# Reviewed macro overrides: curve shifts never inferred from nearby wording.
macro_specs={
'4-4':{38:(20,0,.2),59:(0,20,1),83:(20,0,1)},
'4-5':{58:(-20,0,1),59:(-20,0,1),84:(-20,0,1),93:(-20,0,1)},
'4-6':{49:(20,0,1),50:(0,-20,1),80:(20,20,1),81:(-20,-20,1),94:(20,0,4)},
'5-1':{39:(20,0,1),40:(-20,0,1),60:(0,20,1),69:(20,0,.2),70:(-20,0,1),78:(20,0,.2),79:(-20,0,4),88:(20,0,1),89:(-20,0,4),91:(0,20,1)},
'5-2':{55:(20,0,1),56:(-20,0,1),57:(20,0,.2),58:(20,0,4),88:(-20,0,4),89:(-20,0,.2),99:(20,0,4),100:(-20,0,.2)},
'5-3':{18:(20,0,1),19:(-20,0,1),21:(20,0,1),22:(20,0,1),23:(-20,0,1),42:(20,0,.2),43:(20,0,4),45:(-20,0,.2),46:(-20,0,4),54:(20,0,1),55:(-20,0,1),81:(20,0,4),97:(-20,0,1),98:(20,0,1)},
'5-4':{23:(0,20,1),59:(0,20,1),63:(0,20,4),74:(0,20,1),76:(0,20,4),93:(0,20,1),95:(0,20,1)},
'6-4':{46:(20,0,1),47:(-20,0,1),64:(20,-20,1),65:(20,-20,1),66:(-20,20,1),67:(-20,20,1),75:(-20,20,1),76:(20,-20,1),92:(20,0,1),93:(0,20,1)},
'6-5':{67:(-20,0,1)},'10-2':{45:(20,0,4),87:(20,0,4)} }
for slug,specs in macro_specs.items():
 for i,(d,ss,k) in specs.items():
  s=market(d,ss,True,k)
  if slug=='5-1' and i in [39,69,78,88] or slug=='5-2' and i==55:mark(s,'',100,0,'Yf')
  if slug=='5-4' and i in [74,93,95]:curve(s,'LRAS1',[(50,0),(50,125)],'reference');curve(s,'LRAS2',[(60,0),(60,125)],'muted')
  if slug=='10-2' and i==87:curve(s,'LRAS',[(56,0),(56,125)],'reference')
  if d and ss and not (slug=='6-4' and i==76):
   scenes=[market(d*1.5,ss*.5,True,k),market(d*.5,ss*1.5,True,k)]
   for j,a in enumerate(scenes):a['caption']='Possible shift magnitudes '+str(j+1)
   put(slug,i,*scenes)
  else:put(slug,i,s)
for i in [56,77]:
 s=market(20,0,True);s['caption']='Export-driven demand increase';a=market(-20,0,True);a['caption']='Monetary contraction reverses the increase';
 # Reverse the labels so both panels use the original AD1/output as the final target.
 for c in a['curves']:
  if c['label']=='AD1':c['label']='AD2' if i==56 else 'AD3'
  elif c['label']=='AD2':c['label']='AD1'
 for c in s['curves']:
  if c['label']=='AD2' and i==77:c['label']='AD3'
 put('5-3',i,s,a)
for slug,ids in [('5-1',[41,68,80]),('5-4',[2,22,32,50,62,69,75,97,100])]:
 for i in ids:
  s=sc('Real output','Price level',140,140);curve(s,'LRAS1',[(70,0),(70,125)]);curve(s,'LRAS2',[(100,0),(100,125)],'secondary');mark(s,'',70,0,'Y1');mark(s,'',100,0,'Y2')
  if slug=='5-4' and i in [32,62,69,75]:mark(s,'Current output',40,0,'Y');line(s,'AD',70,-1,'reference');line(s,'SRAS',10,.5,'muted')
  put(slug,i,s)
for slug,i in [('5-4',84),('10-2',53),('10-3',86),('6-5',88)]:
 scenes=[]
 for a1,a2 in ([(100,130)] if i==53 else ([(100,100)] if i in [86,88] else [(100,115),(100,145)])):
  s=sc('Real output','Price level',140,140);curve(s,'LRAS1',[(50,0),(50,125)],'secondary');curve(s,'LRAS2',[(90 if i==53 else 75,0),(90 if i==53 else 75,125)],'tertiary');line(s,'AD1',a1,-1)
  if a2!=a1:line(s,'AD2',a2,-1,'reference')
  else:s['curves'][-1]['label']='AD'
  mark(s,'E1',50,50,'Y1','P1');x=90 if i==53 else 75;mark(s,'E2',x,a2-x,'Y2','P2');scenes.append(s)
 put(slug,i,*scenes)
# Flat and vertical AS segments are distinct cases.
for slug,ids in [('5-2',[86,87]),('5-3',[82,83,84,85])]:
 for i in ids:
  flat=i in [86,82,84];d=-20 if i in [82,83] else 20;s=sc('Real output','Price level',140,140)
  if flat:line(s,'AS',35,0,'secondary');line(s,'AD1',90,-1);line(s,'AD2',90+d,-1,'tertiary');mark(s,'E1',55,35,'Y1','P1');mark(s,'E2',55+d,35,'Y2','P2')
  else:curve(s,'AS',[(70,0),(70,125)],'secondary');line(s,'AD1',120,-1);line(s,'AD2',120+d,-1,'tertiary');mark(s,'E1',70,50,'Yf','P1');mark(s,'E2',70,50+d,None,'P2')
  put(slug,i,s)
a=market(20,0,True,.2);a['caption']='Economy Y: spare capacity';b=market(20,0,True,4);b['caption']='Economy X: near capacity';put('4-6',51,a,b)
a=market(0,-20,True);a['caption']='Cost-push';b=market(20,0,True);b['caption']='Demand-pull';put('4-6',95,a,b)
# Remaining macro classifications and ambiguous simultaneous shifts.
for i,d,ss in [(66,20,-20),(67,-20,20),(68,20,20),(69,-20,-20),(81,20,-20),(82,-20,20)]:
 scenes=[market(d*1.5,ss*.5,True),market(d*.5,ss*1.5,True)]
 for j,s in enumerate(scenes):
  s['caption']='Possible shift magnitudes '+str(j+1)
  if i in [81,82]:s['points'][0]['label']='X'
 put('4-3',i,*scenes)
for i in [56,57,97]:
 s=sc('Real output','Price level',140,140);curve(s,'LRAS',[(0,25),(50,25),(75,38),(90,60),(100,90),(100,125)],'secondary');a=60 if i in [56,97] else 130;line(s,'AD1',a,-1);line(s,'AD2',a+20,-1,'tertiary');mark(s,'',100,0,'Yf');put('4-3',i,s)
s=sc('Real output','Price level');line(s,'AD1',90,-1);line(s,'AD2',110,-1,'secondary');put('4-3',42,s)
# Quantitative/directional corrections from the figure audit.
s=BANK['1-5'][38]['graphScenes'][0];s['points'][0]['y']=math.sqrt(110**2-80**2)
s=sc('Good X','Good Y',200,120);ppc(70,80,s=s);ppc(140,80,label='PPC2',s=s,style='secondary');put('1-5',36,s)
put('2-4',40,market(20,-20,labels=False))
for i in [59,60,79,80,91,92,95,96]:
 q=BANK['2-5'][i-1];q['graphScenes'].reverse()
 for j,s in enumerate(q['graphScenes']):
  s['caption']='Market '+chr(65+j)
  if i==95:
   for c in s['curves']:
    if c['label']=='S':c['label']='S'+str(j+1)
  if i==96:
   for c in s['curves']:
    if c['label']=='D':c['label']='D'+str(j+1)
for i in [30,31]:
 for j,s in enumerate(BANK['2-5'][i-1]['graphScenes']):s['caption']='Market '+('X' if j==0 else 'Y')
for i in [18,19,54]:
 s=market(0,40 if i!=19 else -60);line(s,'PL',40,0,'reference');line(s,'PU',70,0,'reference')
 if i==54:
  s=sc('Quantity','Price ($)',80,35);line(s,'D',32,-.4);line(s,'S',0,.4,'secondary');line(s,'PL',18,0,'reference');line(s,'PU',26,0,'reference')
  mark(s,'E',40,16,'Qe','16');mark(s,'',35,18,'Qd');mark(s,'',45,18,'Qs')
  s['caption']='PL = $18; PU = $26. At PL, the authority purchases Qs − Qd.'
 put('3-2',i,s)
s=sc('Quantity','Price ($)',90,24);line(s,'D',20,-.24);line(s,'S1',0,.16,'secondary');line(s,'S2',2,.16,'tertiary');mark(s,'E1',50,8,'Q1','8');mark(s,'E2',45,9.2,'Q2','9.20');mark(s,'',45,7.2,None,'7.20');put('3-2',31,s)
for i in [55,57,91,92]:
 s=BANK['11-6'][i-1]['graphScenes'][0]
 labels={'Production gain':'B','Consumption gain':'D','Producer loss':'A','Revenue loss':'C','Diversion cost':'E'}
 for r in s['regions']:
  if r.get('label') in labels:r['label']=labels[r['label']]
 s['caption']='Welfare areas: '+('B + D = 24; E = 31' if i==92 else ('B = 12; D = 18' if i==91 else 'A, B, C, D'+('; E: diversion cost' if i==57 else '')))
for i in [56,65,66,67,89,100]:BANK['7-2'][i-1]['graphScenes'][0]['caption']='B1: original · B2: new price · BC: compensated'
# Curve points must stay within the intended panel, including negative MR.
for i in [65,66,96]:
 s=BANK['7-8'][i-1]['graphScenes'][0]
 for c in s['curves']:
  if c['label']=='MR lower':c['points']=[dict(x=50,y=-10),dict(x=55,y=-25)]

s=sc('Output','Marginal cost / benefit',140,180);line(s,'MSC',19.5,1.3);line(s,'MSB',110.5,-1.3,'secondary');mark(s,'',35,65,'Qs');mark(s,'',50,45.5,'Qm');region(s,[(35,65),(50,84.5),(50,45.5)],'dwl');s['caption']='Larger marginal welfare gap; quantities unchanged.';BANK['7-4'][78]['graphScenes'][1]=s
# Match all price and curve symbols explicitly referenced in the question text.
for i in [23,38,60,82,92]:
 scene=BANK['3-1'][i-1]['graphScenes'][0];scene['guides'][0]['xLabel']='Qe';scene['guides'][0]['yLabel']='Pe'
for i in [20,21]:
 scene=BANK['2-1'][i-1]['graphScenes'][0]
 for n,point in enumerate(scene['points']):
  scene['guides'].append(dict(id='g'+str(n),x=point['x'],y=point['y'],xLabel='Q'+str(n+1),yLabel='P'+str(n+1)))
for i,coords in [(64,[(30,70),(80,40)]),(65,[(30,30),(80,60)])]:
 scene=BANK['2-1'][i-1]['graphScenes'][0]
 for n,(x,y) in enumerate(coords):mark(scene,'A' if n==0 else 'B',x,y,'Q'+str(n+1),'P'+str(n+1))
for i in [69,93]:
 for curve0 in BANK['5-4'][i-1]['graphScenes'][0]['curves']:
  if curve0['label']=='AD':curve0['label']='AD1'
for i in [45,91]:
 scene=sc();line(scene,'D',100,-1);line(scene,'S',0,1,'secondary');line(scene,'Pw',25,0,'reference');line(scene,'Pw+t' if i==45 else 'Pt',40,0,'tertiary')
 for name,x,y in [('Qs1',25,25),('Qd1',75,25),('Qs2',40,40),('Qd2',60,40)]:mark(scene,'',x,y,name)
 scene['caption']='World price Pw; tariff-inclusive price '+('Pw+t.' if i==45 else 'Pt.')
 put('6-2',i,scene)

# Save authored scenes; unmatched questions remain visibly detectable in the audit.
for slug,bank in BANK.items():(ROOT/(slug+'.json')).write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
print('Authored',sum(bool(q.get('graphScenes')) for b in BANK.values() for q in b),'of',sum(q['graphRequired'] for b in BANK.values() for q in b),'figures')
