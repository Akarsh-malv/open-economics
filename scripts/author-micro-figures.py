"""Reviewed, static Micro figure specifications. No inference occurs in the UI."""
import json,math,copy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'lib/practice/micro-topics';BANK={p.stem:json.loads(p.read_text()) for p in ROOT.glob('*.json') if p.stem!='manifest'}
def sc(x='Quantity',y='Price',xm=100,ym=100):return dict(xLabel=x,yLabel=y,xMax=xm,yMax=ym,curves=[],points=[],guides=[],regions=[],annotations=[],caption='Schematic; only labeled numbers are quantitative')
def curve(s,label,points,style='primary'):s['curves'].append(dict(id=label,label=label,style=style,points=[dict(x=x,y=y) for x,y in points]))
def line(s,label,x,y,k,style='primary'):
 lo=0;hi=s['xMax']*.94
 if k:
  ends=sorted([(0-y)/k+x,(s['yMax']*.94-y)/k+x]);lo=max(lo,ends[0]);hi=min(hi,ends[1])
 curve(s,label,[(lo,y+k*(lo-x)),(hi,y+k*(hi-x))],style)
def mark(s,label,x,y,xl=None,yl=None):
 s['points'].append(dict(id=label or 'point'+str(len(s['points'])),label=label,x=x,y=y))
 if xl is not None or yl is not None:s['guides'].append(dict(id='guide'+str(len(s['guides'])),x=x,y=y,**({'xLabel':str(xl)} if xl is not None else {}),**({'yLabel':str(yl)} if yl is not None else {})))
def annotation(s,text,x,y):s['annotations'].append(dict(id='note'+str(len(s['annotations'])),text=text,x=x,y=y))
def region(s,points,fill='dwl',label=None):s['regions'].append(dict(id='region'+str(len(s['regions'])),fill=fill,points=[dict(x=x,y=y) for x,y in points],**({'label':label} if label else {})))
def put(slug,ids,*scenes):
 for i in ([ids] if isinstance(ids,int) else ids):
  q=BANK[slug][i-1];q['graphRequired']=True;q['graphScenes']=copy.deepcopy(list(scenes))
  if not q['graphDescription']:q['graphDescription']='; '.join((s['caption'] or '')+'. Axes: '+s['xLabel']+' and '+s['yLabel']+'. Curves: '+', '.join(c['label'] for c in s['curves']) for s in scenes)
def single(label='D',k=-1,shift=None):
 s=sc();line(s,label+'1' if shift else label,50,50,k)
 if shift:line(s,label+'2',50+shift,50,k,'secondary')
 return s
def movements(slug,i,label,k,shift=20,kind='AB'):
 s=single(label,k,shift);first=lambda x:50+k*(x-50)
 if kind=='AB':pts=[('A',30,first(30)),('B',60,first(60))]
 elif kind=='ABC':pts=[('A',30,first(30)),('B',60,first(60)),('C',60+shift,first(60))]
 elif kind=='shiftmove':pts=[('A',35,first(35)),('B',35+shift,first(35)),('C',65+shift,first(65))]
 elif kind=='shiftup':pts=[('A',35,first(35)),('B',35+shift,first(35)),('C',15+shift,first(15))]
 elif kind=='four':
  high,low=(30,60) if k<0 else (60,30)
  pts=[('A',high,first(high)),('B',low,first(low)),('C',high+shift,first(high)),('D',low+shift,first(low))]
 for name,x,y in pts:mark(s,name,x,y,None,'P1' if name in ['A','C'] and kind=='four' else None)
 put(slug,i,s)
# Demand and supply: reviewed movement/shift labels.
for slug,label,k in [('2-1','D',-1),('2-2','S',1)]:
 for i in [6,10,24]:
  s=single(label,k);s['curves'][0]['label']=label if i==6 else label+'1'
  for name,x in [('A',30),('B',65)]:mark(s,name,x,50+k*(x-50),'Q1' if name=='A' else 'Q2','P1' if name=='A' else 'P2')
  put(slug,i,s)
 for i in ([14,35] if slug=='2-1' else [17,35]):put(slug,i,single(label,k,20))
 for i in [18,48]:put(slug,i,single(label,k,-20))
 movements(slug,31,label,k,kind='ABC')
 s=single(label,k,20);mark(s,'',45,50+k*(45-50),'Q1','P');mark(s,'',65,50+k*(45-50),'Q2');put(slug,39,s)
 for i in [43,58]+([68] if slug=='2-2' else []):
  scenes=[]
  for suffix,xq in [('A',20),('B',30),('M',50)]:
   s=sc();line(s,label+suffix,xq,50,k);mark(s,'',xq,50,'Q'+suffix,'P');scenes.append(s)
  put(slug,i,*scenes)
 if slug=='2-1':
  movements(slug,53,label,k,kind='shiftmove');movements(slug,73,label,k,-20,kind='ABC')
  put(slug,68,single('DN',k,20),single('DI',k,-20))
 else:
  movements(slug,53,label,k,-20,kind='ABC');movements(slug,73,label,k,-20,kind='shiftup')
 s=single(label,k);line(s,label+'2',70,50,k*.7,'secondary');s['curves'][0]['label']=label+'1'
 for x,y,xl,yl in [(30,50+k*(30-50),'Q1','P1'),(60,50+k*(60-50),'Q2','P2')]:mark(s,'',x,y,xl,yl)
 put(slug,63,s)
 movements(slug,87,label,k,kind='four')
 for i in [93,98]:movements(slug,i,label,k,kind='shiftup' if slug=='2-1' else ('shiftmove' if i==93 else 'ABC'))
 s=sc();curve(s,label+'M',[(10,85),(35,55),(85,25)] if k<0 else [(10,15),(35,45),(85,70)]);mark(s,'K',35,55 if k<0 else 45,None,'PK');put(slug,82,s)
 if slug=='2-1':
  a=sc();line(a,'DA',35,55,-1);mark(a,'',35,55,'QA','P*')
  b=sc();curve(b,'DB',[(0,55),(70,0)]);mark(b,'',0,55,'0','P*');put(slug,78,a,b,s)
 else:put(slug,78,s)
# Demand elasticity: endpoints and revenue rectangles.
def linear_demand(points,rectangles=False,xm=100,ym=100):
 s=sc(xm=xm,ym=ym);curve(s,'D',[(0,ym*.9),(xm*.9,0)])
 for label,x,y in points:
  mark(s,label,x,y,('Q'+label if xm==100 else str(x)),('P'+label if ym==100 else '$'+str(y)))
  if rectangles:region(s,[(0,0),(x,0),(x,y),(0,y)],'revenue')
 return s
for i in [10,58,63,82,93]:put('2-3',i,linear_demand([('A',20,70),('B',45,45),('C',70,20)],i==63))
for i in [31,43,73]:put('2-3',i,linear_demand([('A',15,75),('B',25,65),('C',65,25),('D',75,15)]))
put('2-3',48,linear_demand([('A',10,80),('B',30,60),('C',60,30),('D',80,10)]));put('2-3',39,linear_demand([('A',20,70)]))
for i in [24,53]:put('2-3',i,linear_demand([('A',20,70),('B',40,50)],True))
put('2-3',35,linear_demand([('A',40,50),('B',20,70)],True));put('2-3',68,linear_demand([('A',20,70),('B',60,30),('C',75,15)]))
for i,pts in [(78,[('A',2,8),('B',6,4)]),(98,[('A',2,8),('B',8,2)])]:
 s=linear_demand(pts,True,100/9,100/9);s['curves'][0]['points']=[dict(x=0,y=10),dict(x=10,y=0)];s['caption']='Price × quantity rectangles; values stated in question';put('2-3',i,s)
for slug,label,ids in [('2-3','D',[17]),('2-4','S',[10])]:
 s=sc();curve(s,label,[(45,10),(45,85)]);mark(s,'A',45,30,'Q','P1');mark(s,'B',45,70,None,'P2');put(slug,ids,s)
s=sc();curve(s,'D',[(10,45),(85,45)]);mark(s,'A',30,45,'Q1','P');mark(s,'B',70,45,'Q2');put('2-3',18,s)
s=sc();curve(s,'D1',[(45,10),(45,85)]);curve(s,'D2',[(10,35),(85,35)],'secondary');mark(s,'',45,35,'Q1','P1');mark(s,'',45,70,None,'P2');put('2-3',87,s)
# Supply elasticity and short-/long-run comparisons.
for slug,i,lab,k in [('2-3',6,'D',-1),('2-4',6,'S',1),('2-4',31,'S',1),('2-4',58,'S',1),('2-4',68,'S',1),('2-4',82,'S',1)]:
 s=sc();names=('SSR','SLR') if i in [31,58] else (lab+'1',lab+'2')
 line(s,names[0],40,35,k*1.7);line(s,names[1],40,35,k*.55,'secondary');mark(s,'A',40,35,'Q1','P1');y2=55 if k>0 else 20
 for n,slope in enumerate([k*1.7,k*.55]):mark(s,'',40+(y2-35)/slope,y2,'Q2' if n==0 else 'Q3','P2' if n==0 else None)
 put(slug,i,s)
s=sc();curve(s,'S1',[(45,10),(45,85)]);curve(s,'S2',[(10,45),(85,45)],'secondary');mark(s,'A',45,25);mark(s,'B',45,70);mark(s,'C',20,45);mark(s,'D',75,45);put('2-4',17,s)
for i,pts,xm,ym in [(18,[('A',20,4),('B',40,8)],55,11),(39,[('A',30,6),('B',50,10)],65,13),(63,[('A',15,3),('B',45,9)],60,12),(78,[('A',40,8),('B',50,12)],65,16),(93,[('A',20,6),('B',60,10)],80,14)]:
 s=sc(xm=xm,ym=ym);a,b=pts;line(s,'S',a[1],a[2],(b[2]-a[2])/(b[1]-a[1]))
 for l,x,y in pts:mark(s,l,x,y,str(x),'$'+str(y))
 put('2-4',i,s)
s=single('S',1);mark(s,'A',30,30);mark(s,'B',60,60);annotation(s,'Price +10%; quantity +20%',38,85);put('2-4',24,s)
s=sc();line(s,'S1',30,30,2);line(s,'S2',30,30,.5,'secondary');annotation(s,'Price +12%; S1 quantity +6%',8,90);annotation(s,'S2 quantity +24%',10,80);put('2-4',35,s)
s=sc();curve(s,'SA',[(0,25),(70,95)]);curve(s,'SB',[(25,0),(95,70)],'secondary');mark(s,'A',35,60);mark(s,'B',60,35);put('2-4',43,s)
for i in [48,53,73,98]:
 s=sc();curve(s,'S',[(10,10),(30,20),(50,35),(65,55),(70,90)]);curve(s,'Qmax',[(72,0),(72,95)],'reference')
 for l,x,y in [('A',15,12.5),('B',30,20),('C',65,55),('D',70,90)]:mark(s,l,x,y)
 if i==53:annotation(s,'A→B: P +10%, Q +16%',5,88);annotation(s,'C→D: P +10%, Q +5%',5,78)
 if i==73:annotation(s,'A→B: P +15%, Q +30%',5,88);annotation(s,'C→D: P +12%, Q +6%',5,78)
 if i==98:annotation(s,'A→B near capacity: P +20%, Q +8%',5,85)
 put('2-4',i,s)
s=single('S',1,20);mark(s,'',40,40,'Q1','P');mark(s,'',60,40,'Q2');put('2-4',87,s)
# Other elasticities: quantitative line charts and signed changes.
for i,axis,label,pts,xm,ym in [(6,'Income ($thousands)','IX',[('A',40,80),('B',50,100)],65,130),(10,'Price of Y ($)','CXY',[('A',5,120),('B',10,90)],14,150),(17,'Income ($thousands)','IX',[('A',30,60),('B',45,45)],60,85),(24,'Price of Y ($)','CXY',[('A',8,50),('B',12,70)],16,90),(29,'Price of Y ($)','CXY',[('A',4,75),('B',9,75)],12,100),(93,'Income ($thousands)','IX',[('A',35,90),('B',55,90)],70,120)]:
 s=sc(axis,'Quantity of X',xm,ym);a,b=pts;curve(s,label,[(a[1],a[2]),(b[1],b[2])])
 for l,x,y in pts:mark(s,l,x,y,str(x),str(y))
 put('2-5',i,s)
def bars(labels,values,signed=False,caption=None):
 base=40 if signed else 0;scale=1 if not signed else 1;ym=max(max(values)+base+15,80) if signed else max(values)*1.3;s=sc('Category','Percent change' if signed else 'Quantity',len(values)*25+15,ym)
 if signed:curve(s,'0%',[(0,base),(s['xMax']*.9,base)],'reference')
 for n,(label,value) in enumerate(zip(labels,values)):
  x=15+n*25;curve(s,label,[(x-6,base),(x-6,base+value),(x+6,base+value),(x+6,base)],'secondary');annotation(s,('+' if value>0 and signed else '')+str(value)+('%' if signed else ''),x-5,base+value+(4 if value>=0 else -8))
 if caption:s['caption']=caption
 return s
for i,labels,values in [(21,['Income','X'],[10,20]),(38,['Price Y','X'],[10,-5]),(43,['Income','A','B'],[10,18,6]),(53,['Income','X'],[-8,12]),(58,['Price Y','X'],[-12,-18]),(68,['Price Y','X','Z'],[10,18,-6]),(73,['Income','Price Y','X'],[10,20,5]),(98,['Income','Price Y','X'],[10,20,8])]:put('2-5',i,bars(labels,values,True))
for i,label in [(34,'Income'),(48,'Price of Y')]:
 s=sc(label,'Quantity demanded');curve(s,'IA' if i==34 else 'CXY',[(20,25),(70,60)]);curve(s,'IB' if i==34 else 'CZY',[(20,65),(70,30)],'secondary')
 for l,x,y in [('A1' if i==34 else 'X1',20,25),('A2' if i==34 else 'X2',70,60),('B1' if i==34 else 'Z1',20,65),('B2' if i==34 else 'Z2',70,30)]:mark(s,l,x,y)
 put('2-5',i,s)
s=sc('Income','Quantity demanded');curve(s,'IX',[(20,20),(45,30),(70,70)]);mark(s,'A',20,20);mark(s,'B',45,30,'I*');mark(s,'C',70,70);annotation(s,'A→B: I +10%, Q +4%',5,85);annotation(s,'B→C: I +10%, Q +15%',5,75);put('2-5',63,s)
s=sc('Income','Quantity demanded');curve(s,'IX',[(20,30),(30,50),(45,65),(60,50),(75,30)]);mark(s,'A',20,30,'I1');mark(s,'B',45,65,'I2');mark(s,'C',75,30,'I3');put('2-5',78,s)
put('2-5',82,bars(['A before','A after','B before','B after'],[200,220,50,70],caption='Income rises 10% for both goods'))
put('2-5',87,bars(['A before','A after','B before','B after'],[200,220,40,60],caption='Price of Y rises 10% for both goods'))
# Equilibrium and surplus; numerical source coordinates take precedence.
def market(q=50,p=50,di=100,si=0,xm=100,ym=110,labels=True):
 s=sc(xm=xm,ym=ym);line(s,'D',q,p,-(di-p)/q);line(s,'S',q,p,(p-si)/q,'secondary');mark(s,'E',q,p,'Qe' if labels else str(q),'Pe' if labels else '$'+str(p));return s
for i in [6,10,17,29,77]:
 s=market();region(s,[(0,100),(0,50),(50,50)],'cs','Area A' if i==77 else 'Area X');region(s,[(0,0),(0,50),(50,50)],'ps','Area B' if i==77 else 'Area Y')
 if i==77:region(s,[(0,0),(50,0),(50,50),(0,50)],'revenue','Area C')
 put('2-6',i,s)
for i,q,p,d,si,xm,ym in [(21,12,10,30,0,20,40),(24,20,8,16,0,30,22),(34,15,20,40,0,25,55),(38,12,14,20,8,20,28),(44,24,21,36,6,36,48),(48,20,10,30,0,30,40),(69,16,18,30,6,24,40),(73,18,19,34,4,28,44)]:
 s=market(q,p,d,si,xm,ym,False)
 if i in [21,48]:region(s,[(0,d),(0,p),(q if i==21 else 10,p)]+([(10,20)] if i==48 else []),'cs')
 if i in [34,69]:region(s,[(0,si),(0,p),(q,p)],'ps')
 if i in [44,73]:region(s,[(0,di if False else d),(0,si),(q,p)],'benefit')
 if i in [21,38,44,73]:mark(s,'',0,d,None,'$'+str(d));mark(s,'',0,si,None,'$'+str(si))
 if i==73:s['guides'][0].pop('yLabel',None)
 put('2-6',i,s)
for i,cs,ps in [(52,200,100),(65,90,150),(98,260,140)]:
 q=20;p=20;s=market(q,p,p+2*cs/q,p-2*ps/q,32,60,False);region(s,[(0,p+2*cs/q),(0,p),(q,p)],'cs','CS $'+str(cs));region(s,[(0,p-2*ps/q),(0,p),(q,p)],'ps','PS $'+str(ps));put('2-6',i,s)
for i,pairs,gaps in [(57,[(20,22),(20,14)],[30,30]),(81,[(20,16),(24,20)],[24,30]),(95,[(30,15),(40,12)],[20,14])]:
 scenes=[]
 for n,((q,p),gap) in enumerate(zip(pairs,gaps)):
  s=market(q,p,p+gap/2,p-gap/2,q*1.5,p+gap*.9,False);s['caption']='Market '+('A' if n==0 else 'B')+'; total-surplus intercept gap $'+str(gap);region(s,[(0,p+gap/2),(0,p-gap/2),(q,p)],'benefit');scenes.append(s)
 put('2-6',i,*scenes)
s=market(4,12,20,4,7,24,False);put('2-6',61,s)
s=sc('Units','Dollars per unit',15,28);line(s,'D',10,18,-.6);line(s,'S',10,14,.6,'secondary');mark(s,'',10,18,'10','$18');mark(s,'',10,14,None,'$14');put('2-6',85,s)
s=market(40,25,43,13,60,56);annotation(s,'CS height $18',3,48);annotation(s,'PS height $12',3,8);put('2-6',88,s)
s=market(24,20,32,8,35,42);region(s,[(0,32),(0,8),(6,11),(6,29)],'benefit');mark(s,'',6,29,'6','$29');mark(s,'',6,11,None,'$11');s['caption']='Vertical gap: $24 at Q=0; $18 at Q=6';put('2-6',92,s)
# Changes in equilibrium and shortages/surpluses.
def shifted(d=0,supply=0,kd=1,ks=1):
 s=sc(ym=115);line(s,'D1',50,50,-kd);line(s,'S1',50,50,ks,'secondary');mark(s,'E1',50,50,'Q1','P1')
 if d:line(s,'D2',50+d,50,-kd,'tertiary')
 if supply:line(s,'S2',50+supply,50,ks,'muted')
 if d or supply:
  x=(kd*(50+d)+ks*(50+supply))/(kd+ks);y=50+ks*(x-50-supply);mark(s,'E2',x,y,'Q2','P2')
 return s
def probe(s,p,label='P*',d=0,supply=0,kd=1,ks=1):
 curve(s,label,[(0,p),(s['xMax']*.92,p)],'reference');mark(s,'',50+d+(50-p)/kd,p,'Qd',label);mark(s,'',50+supply+(p-50)/ks,p,'Qs')
for i,p in [(6,30),(15,70),(32,30)]:s=shifted();probe(s,p,'P1' if p==30 else 'P2');put('2-7',i,s)
for i,d,sup in [(10,20,0),(22,0,-20),(28,0,20),(36,20,0),(40,20,20),(47,20,0),(58,-20,0),(65,20,-20),(76,30,10),(86,0,20),(93,0,-15),(96,20,-10)]:
 s=shifted(d,sup)
 if i==40:s['guides'][-1].pop('yLabel',None)
 if i==96:s['guides'][-1].pop('xLabel',None)
 if i in [36,58,93]:probe(s,50 if i!=93 else 75,'Pm' if i==93 else 'P1',d,sup)
 if i==28:region(s,[(0,100),(0,40),(60,40)],'cs')
 if i==47:region(s,[(0,0),(0,60),(60,60)],'ps')
 if i==86:region(s,[(0,40),(50,40),(50,50),(0,50)],'cs');region(s,[(50,40),(60,40),(50,50)],'benefit')
 put('2-7',i,s)
put('2-7',50,market(20,15,27,3,35,38,False),market(30,15,31,-1,45,42,False))
for i in [54,67,82]:
 scenes=[]
 for k in [.45,1.6]:scenes.append(shifted(d=20,ks=k) if i==54 else shifted(supply=20 if i==67 else -20,kd=k))
 put('2-7',i,*scenes)
s=shifted(d=20);probe(s,30,'P1');mark(s,'',90,30,'Qd2');s['guides'][-3]['xLabel']='Qd1';put('2-7',72,s)
s=shifted(d=20);region(s,[(0,100),(0,0),(50,50)],'benefit','A+B');region(s,[(50,70),(50,50),(60,60)],'benefit','C');put('2-7',61,s)
for n,(cs,ps) in enumerate([(180,140),(225,205)]):
 s=market(20,25,25+cs/10,25-ps/10,32,60);region(s,[(0,25+cs/10),(0,25),(20,25)],'cs','CS'+str(n+1)+' $'+str(cs));region(s,[(0,25-ps/10),(0,25),(20,25)],'ps','PS'+str(n+1)+' $'+str(ps))
 if n==0:a=s
 else:put('2-7',89,a,s)
s=sc(xm=95,ym=65);line(s,'D',40,40,-.5);line(s,'S',70,40,.5,'secondary');curve(s,'Pm',[(0,40),(90,40)],'reference');mark(s,'',40,40,'40','Pm');mark(s,'',70,40,'70');mark(s,'E',55,32.5);put('2-7',99,s)
# Intervention: transparent wedges, traded quantities, and shaded loss/revenue.
def intervention(tax=20,subsidy=False,buyer=False,kd=1,ks=1):
 s=shifted(kd=kd,ks=ks);s['points'][0]['label']='E';s['curves'][0]['label']='D';s['curves'][1]['label']='S';s['guides'][0].update(xLabel='Qe',yLabel='Pe')
 sign=-1 if subsidy else 1;x=50-sign*tax/(kd+ks);pb=50-kd*(x-50);ps=pb-sign*tax
 if buyer:line(s,'Dt',50,50-tax,-kd,'tertiary')
 else:line(s,'Ss' if subsidy else 'St',50,50+sign*tax,ks,'tertiary')
 mark(s,'',x,pb,'Qs' if subsidy else 'Qt','Pb');mark(s,'',x,ps,None,'Ps')
 region(s,[(0,pb),(x,pb),(x,ps),(0,ps)],'cost' if subsidy else 'revenue')
 region(s,[(x,50-kd*(x-50)),(x,50+ks*(x-50)),(50,50)],'dwl');return s
for i in [15,22,27,51,61]:put('2-8',i,intervention())
for i in [46,92]:put('2-8',i,intervention(subsidy=True))
put('2-8',85,intervention(buyer=True))
for i,p in [(6,30),(10,70),(36,30),(57,30),(88,70)]:
 s=shifted();probe(s,p,'Pc' if p<50 else 'Pf')
 if i==57:s=sc();line(s,'D',50,50,-1);line(s,'S',50,50,1,'secondary');curve(s,'Qq',[(30,0),(30,95)],'reference');mark(s,'',30,70,'Qq','Pb');mark(s,'',30,30,None,'Ps')
 if i in [36,57]:region(s,[(30,70),(30,30),(50,50)],'dwl','DWL')
 put('2-8',i,s)
for i in [32,66]:s=shifted(d=-35);probe(s,35 if i==32 else 40,'Pc' if i==32 else 'Pf',d=-35);put('2-8',i,s)
s=shifted(supply=-20);probe(s,30,'Pc',supply=-20);mark(s,'',30,30,'Qs1');s['guides'][-2]['xLabel']='Qs2';put('2-8',72,s)
s=shifted();probe(s,25,'Pc1');probe(s,40,'Pc2');put('2-8',76,s)
for i in [54,82]:put('2-8',i,intervention(kd=.5,ks=.5),intervention(kd=1.5,ks=1.5))
put('2-8',97,intervention(kd=1.8),intervention(kd=.5))
s=intervention();s['xMax']=130;s['yMax']=24;s['curves']=[];line(s,'D',90,12,-1/6);line(s,'S',90,12,1/9,'secondary');line(s,'St',72,15,1/9,'tertiary');s['points']=[];s['guides']=[];mark(s,'E',90,12,'90','$12');mark(s,'',72,15,'72','$15');mark(s,'',72,10,None,'$10');s['regions']=[];region(s,[(0,15),(72,15),(72,10),(0,10)],'revenue');region(s,[(72,15),(72,10),(90,12)],'dwl');put('2-8',41,s)
s=intervention();s['caption']='Tax $6; revenue $360; deadweight loss $45';s['annotations']=[];annotation(s,'Revenue $360',10,35);annotation(s,'DWL $45',55,25);put('2-8',51,s)
s=shifted();probe(s,25,'Pf');probe(s,75,'Pc');put('2-8',99,s)
# Trade: explicit import/export and tariff quantities.
def trade(tariff=False,export=False,generic=False):
 s=sc(xm=14,ym=10);line(s,'D',10,3,-1);line(s,'S',2,3,1,'secondary');curve(s,'Pw',[(0,3),(13,3)],'reference');mark(s,'',2,3,'Qs0 = 2','$3');mark(s,'',10,3,'Qd0 = 10')
 if tariff:curve(s,'Pw+t',[(0,5),(13,5)],'tertiary');mark(s,'',4,5,'Qs1 = 4','$5');mark(s,'',8,5,'Qd1 = 8');region(s,[(4,3),(8,3),(8,5),(4,5)],'revenue');region(s,[(2,3),(4,3),(4,5)],'dwl');region(s,[(8,3),(10,3),(8,5)],'dwl')
 if generic:
  s=sc(xm=12,ym=12);line(s,'D',9 if not export else 3,4 if not export else 8,-1);line(s,'S',3 if not export else 7,4 if not export else 8,1,'secondary');curve(s,'Pw',[(0,4 if not export else 8),(11,4 if not export else 8)],'reference');mark(s,'',3,4 if not export else 8,'Qs = 3' if not export else 'Qd = 3','Pw');mark(s,'',9 if not export else 7,4 if not export else 8,'Qd = 9' if not export else 'Qs = 7')
 return s
for i in [37,38,39,97]:put('2-9',i,trade(generic=True))
for i in [40,98]:put('2-9',i,trade(export=True,generic=True))
for i in [47,48,49,50,51,52,94,95,96]:put('2-9',i,trade(tariff=True))
# Source Unit 3.1 total product: increasing, diminishing, then negative MP.
s=sc('Labor','Total product');curve(s,'TP',[(0,0),(10,5),(20,18),(30,38),(40,57),(50,69),(60,76),(70,78),(80,72),(90,60)])
for label,x,y in [('A',20,18),('B',50,69),('C',75,75)]:mark(s,label,x,y)
put('3-1',[q['id'] for q in BANK['3-1'] if q['graphRequired']],s)
# Market failure, public-good vertical summation, natural monopoly and Lorenz curves.
def efficient():
 s=sc('Quantity','Marginal benefit / cost');line(s,'MSB',50,50,-.8);line(s,'MSC',50,50,.8,'secondary');mark(s,'',50,50,'Qs');mark(s,'',30,66,'Qm');region(s,[(30,66),(30,34),(50,50)],'dwl','DWL');return s
def external(positive=False):
 s=sc('Quantity','Marginal benefit / cost');line(s,'MPB' if positive else 'MPB = MSB',50,50,-.8);line(s,'MPC = MSC' if positive else 'MPC',50,50,.8,'secondary')
 if positive:line(s,'MSB',50,74,-.8,'tertiary');mark(s,'',50,50,'Qm');mark(s,'',65,62,'Qs');region(s,[(50,50),(50,74),(65,62)],'dwl')
 else:line(s,'MSC',50,74,.8,'tertiary');mark(s,'',50,50,'Qm');mark(s,'',35,62,'Qs');region(s,[(35,62),(50,50),(50,74)],'dwl')
 return s
s=sc('Public-good quantity','Marginal benefit / cost');curve(s,'MB A',[(0,50),(80,10)]);curve(s,'MB B',[(0,35),(80,5)],'secondary');curve(s,'SMB',[(0,85),(80,15)],'tertiary');line(s,'MC',45,45.625,.7,'muted');mark(s,'',45,45.625,'Qs');public=s
s=sc('Households (cumulative %)','Income (cumulative %)',110,110);curve(s,'Equality',[(0,0),(100,100)],'reference');curve(s,'L1',[(i,100*(i/100)**1.7) for i in range(0,101,5)]);curve(s,'L2',[(i,100*(i/100)**2.7) for i in range(0,101,5)],'secondary');mark(s,'',100,100,'100%','100%');lorenz=s
s=sc('Quantity','Price / revenue / cost',100,120);curve(s,'D',[(0,100),(95,5)]);curve(s,'MR',[(0,100),(50,0)],'secondary');curve(s,'MC',[(0,20),(95,20)],'tertiary');curve(s,'ATC',[(10,80),(20,50),(30,40),(40,35),(60,30),(80,27.5)],'muted');mark(s,'',40,60,'Qm','Pm');mark(s,'',40,20);mark(s,'',80,20,'Qmc','Pmc');qac=(80+math.sqrt(80**2-2400))/2;mark(s,'',qac,100-qac,'Qac','Pac');natural=s
for slug,factory in [('6-1',efficient),('6-2',None),('6-3',lambda:public),('6-4',lambda:natural),('6-5',lambda:lorenz)]:
 for q in BANK[slug]:
  if q['graphRequired']:put(slug,q['id'],external('MPB lies below MSB' in q['graphDescription']) if slug=='6-2' else factory())
# Exact numerical and percentage specifications after schematic families.
s=sc();curve(s,'S',[(10,25),(40,40),(48,44),(90,65)]);mark(s,'A',40,40,'Q1','P1');mark(s,'B',48,44,'Q2','P2');annotation(s,'Price +10%; quantity +20%',5,85);put('2-4',24,s)
s=sc();line(s,'S1',50,50,2);line(s,'S2',50,50,.5,'secondary');mark(s,'A',50,50,'Q1','P1');mark(s,'',53,56,'Q2','P2');mark(s,'',62,56,'Q3');annotation(s,'P +12%; S1 Q +6%; S2 Q +24%',5,90);put('2-4',35,s)
for i,pts,notes in [(53,[('A',20,20),('B',23.2,22),('C',65,60),('D',68.25,66)],['A→B: P +10%, Q +16%','C→D: P +10%, Q +5%']),(73,[('A',20,20),('B',26,23),('C',65,60),('D',68.9,67.2)],['A→B: P +15%, Q +30%','C→D: P +12%, Q +6%'])]:
 s=sc();curve(s,'S',[(10,16)]+[(x,y) for _,x,y in pts]+[(72,90)])
 for l,x,y in pts:mark(s,l,x,y)
 for n,note in enumerate(notes):annotation(s,note,4,90-n*10)
 put('2-4',i,s)
s=sc();curve(s,'S',[(10,10),(30,20),(50,35),(65,55),(70.2,66),(72,92)]);curve(s,'Qmax',[(73,0),(73,95)],'reference');mark(s,'A',65,55);mark(s,'B',70.2,66);annotation(s,'A→B: P +20%, Q +8%',4,88);put('2-4',98,s)
s=sc('Income','Quantity of X',65,155);curve(s,'IX',[(36,96),(40,100),(44,104),(48.4,119.6),(52,137)]);mark(s,'A',40,100);mark(s,'B',44,104,'I*');mark(s,'C',48.4,119.6);s['caption']='Each income interval rises 10%; quantity rises 4% then 15%';put('2-5',63,s)
a=market(20,22,34,4,32,48,False);b=market(20,14,34,4,32,48,False)
for s in [a,b]:region(s,[(0,34),(0,4),(20,s['points'][0]['y'])],'benefit');s['caption']='Quantity 20; demand–supply intercept gap $30'
put('2-6',57,a,b)
a=market(20,20,32,8,35,44,False);b=market(30,20,36,8,45,48,False)
for s in [a,b]:region(s,[(0,s['curves'][0]['points'][0]['y']),(0,20),(s['points'][0]['x'],20)],'cs')
put('2-7',50,a,b)
s=sc(xm=110,ym=42);line(s,'D',75,20,-.2);line(s,'S',75,20,.2,'secondary');line(s,'St',75,26,.2,'tertiary');mark(s,'E',75,20,'Qe');mark(s,'',60,23,'Qt','Pb');mark(s,'',60,17,None,'Ps');region(s,[(0,23),(60,23),(60,17),(0,17)],'revenue','Revenue $360');region(s,[(60,23),(60,17),(75,20)],'dwl','DWL $45');s['caption']='Per-unit tax $6';put('2-8',51,s)

# Sources 3–5 refer to figures without marking them required; supply those figures.
def cost_scene(fixed=20,variable_shift=0):
 s=sc('Output','Cost per unit',14,55);xs=[.8+i*.2 for i in range(62)]
 for label,fn,style in [('AVC',lambda q:10-q+.1*q*q+variable_shift,'secondary'),('ATC',lambda q:10-q+.1*q*q+fixed/q+variable_shift,'primary'),('MC',lambda q:10-2*q+.3*q*q+variable_shift,'tertiary')]:curve(s,label,[(q,fn(q)) for q in xs])
 return s
for i in [62,63]:put('3-2',i,cost_scene())
s=cost_scene();xs=[.8+i*.2 for i in range(62)];s['curves'][1]['label']='ATC1';curve(s,'ATC2',[(q,10-q+.1*q*q+35/q) for q in xs],'reference');put('3-2',85,s)
put('3-2',86,cost_scene(),cost_scene(variable_shift=6))
for i,x in [(95,3),(96,10)]:s=cost_scene();mark(s,'',x,10-2*x+.3*x*x,'Q1' if i==95 else 'Q2');put('3-2',i,s)
s=sc('Output','Total cost',12,160);curve(s,'TC',[(x,20+8*x+.2*x*x) for x in range(11)]);curve(s,'TVC',[(x,8*x+.2*x*x) for x in range(11)],'secondary');line(s,'TFC',0,20,0,'tertiary');put('3-2',[60,61],s)
s=sc('Output','Revenue / cost',10,26);curve(s,'MR',[(0,20),(10,0)]);line(s,'MC',0,10,0,'secondary');mark(s,'',5,10,'5');mark(s,'',3,14,'3');mark(s,'',7,10,'7');put('3-5',[95,96,97],s)
def competitive(p=16,q=6,f=36,a=4,k=1):
 s=sc('Firm output','Price / cost',12,38);xs=[1.3+i*.15 for i in range(65)];curve(s,'ATC',[(x,f/x+a+k*x) for x in xs]);curve(s,'AVC',[(x,a+k*x) for x in xs],'secondary');line(s,'MC',0,a,2*k,'tertiary');line(s,'P = MR',0,p,0,'reference');mark(s,'',q,p,str(q),'$'+str(p));return s
put('3-7',[85,86],competitive())
put('3-7',83,competitive(17,6,6,5,1));put('3-7',84,competitive(7.5,3,15,4.5,.5))
# Firm-demand comparisons, allocative efficiency, and concrete entry-barrier exhibits.
a=single('Firm A demand',0);b=single('Firm B demand',-1);put('4-1',[20,84],a,b)
s=single('D',-1);mark(s,'A',30,70);mark(s,'B',65,35);put('4-1',[21,60],s)
s=bars(['Industry X','Industry Y','Industry Z'],[5,35,80],caption='Start-up-cost index; higher values indicate greater initial cost');put('4-1',[23,61,89],s)
s=bars(['Firm A','Others'],[100,0],caption='Share of essential input controlled (%)');put('4-1',[24,62,90],s)
s=sc('Output','Marginal benefit / cost');line(s,'D = MB',50,50,-1);line(s,'MC',50,50,.4,'secondary');mark(s,'X',30,70);mark(s,'Y',50,50,'Qefficient');put('4-1',[22,44,45,63,64,78,79,91],s)
# A natural-monopoly curve conveys declining average cost, not invented rankings.
BANK['4-2'][66]['prompt']='A government grants one firm the sole legal right to supply a market. Which barrier protects this monopoly?'
def monopoly(pint=100,mc=20,atc=40,qm=40):
 s=sc('Output','Price / revenue / cost',110,125);curve(s,'D',[(0,pint),(100,0)]);curve(s,'MR',[(0,pint),(50,0)],'secondary');line(s,'MC',0,mc,0,'tertiary');curve(s,'ATC',[(x,mc+(atc-mc)*qm/x) for x in [max(10,(atc-mc)*qm/(s['yMax']*.94-mc))+i*.6 for i in range(115)] if x<100],'muted');mark(s,'',qm,pint-qm,'Qm','Pm');mark(s,'',pint-mc,mc,'Qe');region(s,[(qm,pint-qm),(qm,mc),(pint-mc,mc)],'dwl');return s
for i in [18,19,20,21,28,29,44,45,83,99]:put('4-2',i,monopoly())
for i in [11,22,52,92]:put('4-2',i,natural)
for i in [31,63]:put('4-2',i,monopoly(atc=75))
s=sc('Output','Price / revenue / cost',9,35);curve(s,'D',[(0,30),(9,12)]);curve(s,'MR',[(0,30),(7.5,0)],'secondary');line(s,'MC',0,10,0,'tertiary');line(s,'ATC',0,10,0,'muted');mark(s,'',5,20,'5','$20');region(s,[(0,10),(5,10),(5,20),(0,20)],'revenue');put('4-2',43,s)
# Perfect price discrimination reaches D=MC; single pricing uses MR=MC.
single_price=monopoly();single_price['caption']='Single-price monopoly'
s=monopoly();s['caption']='Perfect price discrimination';s['guides'][-1]['xLabel']='Qpd';s['regions']=[];region(s,[(0,100),(0,20),(80,20)],'ps')
s['curves']=[c for c in s['curves'] if c['label']!='MR'];s['curves'][0]['label']='D = MR';s['points']=s['points'][1:];s['guides']=s['guides'][1:]
for i in [12,13,14,15,20,21,54,55,56,57,60,61,62,63,91,92,93,95]:put('4-3',i,single_price,s)
put('4-3',[11,94],bars(['Buyer A','Buyer B','Buyer C'],[30,20,10],caption='Prices charged for the same item ($); costs of serving buyers are equal'))
# Monopolistic competition: consistent cost, demand, and marginal revenue curves.
def mono_comp(intercept=20):
 s=sc('Output','Price / revenue / cost',10,40);xs=[1+i*.1 for i in range(75)];curve(s,'ATC',[(x,32/x+4+x) for x in xs]);line(s,'MC',0,4,2,'secondary');curve(s,'D',[(0,intercept),(9,intercept-9)],'tertiary');line(s,'MR',0,intercept,-2,'muted');q=(intercept-4)/4;mark(s,'',q,intercept-q,'Qlr' if intercept==20 else 'Q*','P*');mark(s,'',math.sqrt(32),4+2*math.sqrt(32),'Qmin ATC');return s
for i in [22,23,24,25,43,44,62,63,80,82,83,98]:put('4-4',i,mono_comp())
for i in [20,51]:put('4-4',i,mono_comp(24))
for i in [21,52]:put('4-4',i,mono_comp(16))
for i in [26,49,64,87]:put('4-4',i,mono_comp(24),mono_comp(20))
for i in [27,50,65,88]:put('4-4',i,mono_comp(16),mono_comp(20))
# Labor-market source schedules: D has (40,30),(60,20),(80,10); S reverses them.
s=sc('Labor','Wage ($)',110,45);curve(s,'Demand',[(20,40),(100,0)]);curve(s,'Supply',[(20,0),(100,40)],'secondary');mark(s,'A',80,10,'80','$10');mark(s,'B',40,30,'40','$30');mark(s,'C',40,10);mark(s,'D',80,30);mark(s,'E',60,20,'60','$20')
for i in [20,21,22,23,24,25,26,27,44,45,46,47,48,49,56,57,89,90,91,92]:put('5-1',i,s)
# These questions ask axis identities: showing labeled axes would reveal the answer.
for i in [67,68]:BANK['5-1'][i-1]['prompt']=BANK['5-1'][i-1]['prompt'].replace('A graph shows','A standard labor-market diagram has')
for i in [17,18,19,20,21,22,23,24,25,26,46,47,48,49,50,51,60,61,62,88,89]:
 q=BANK['5-2'][i-1]
 d=20 if i in [17,21,22,46,50,88] else -20 if i in [18,47,51,89] else 0
 sup=20 if i in [19,23,24,48,60,61] else -20 if i in [20,25,26,49,62] else 0
 s=shifted(d,sup);s['xLabel']='Labor';s['yLabel']='Wage';s['curves'][0]['label']='LD1';s['curves'][1]['label']='LS1'
 if len(s['curves'])>2:s['curves'][2]['label']='LD2' if d else 'LS2'
 put('5-2',i,s)
def comp_factor(wage=20):
 s=sc('Labor','Wage / MRP / MFC',14,65);curve(s,'MRP',[(0,50),(12,2)]);line(s,'Wage = MFC',0,wage,0,'secondary');mark(s,'', (50-wage)/4,wage,'L*','W');return s
for i in [16,17,62,97]:put('5-3',i,comp_factor())
for i in [64,94]:put('5-3',i,comp_factor(20),comp_factor(12))
put('5-3',65,comp_factor(20),comp_factor(28))
def monopsony():
 s=sc('Labor','Wage / MRP / MFC',11,65);line(s,'Supply',0,10,2);line(s,'MFC',0,10,4,'secondary');line(s,'MRP',0,50,-4,'tertiary');mark(s,'',5,30,'Lm = 5','$30');mark(s,'',5,20,None,'Wm = $20');mark(s,'',20/3,70/3,'Lc','Wc');return s
for i in [8,9,10,11,12,24,54,55,56,57,58,59,97]:put('5-4',i,monopsony())
put('5-4',22,bars(['Worker 1','Worker 2','Worker 3'],[12,16,20],caption='Illustrative marginal factor cost ($)'))
put('5-4',23,comp_factor(),monopsony())

# Resolve the supply sequence with all points inside the positive quadrant.
s=single('S',1,-20)
for l,x,y in [('A',65,65),('B',45,65),('C',25,45)]:mark(s,l,x,y)
put('2-2',73,s)
# Nonparallel shifts: quantity differences vary with price.
s=sc();line(s,'S1',50,50,1);line(s,'S2',70,50,.7,'secondary');mark(s,'',40,40,'Q1','P');mark(s,'',70-10/.7,40,'Q2');put('2-2',39,s)
# Serialize after all specifications are assembled; no runtime diagram guessing.
for slug,bank in BANK.items(): (ROOT/f'{slug}.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
print('Authored',sum(q['graphRequired'] for b in BANK.values() for q in b),'question figures')
