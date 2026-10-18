"""Author question figures from reviewed source specifications, never infer shifts at runtime."""
import json, math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'lib/practice/topics'
AUTHORED={}
def c(label,points,style='primary'):
 return dict(id=label,label=label,style=style,points=[dict(x=x,y=y) for x,y in points])
def pt(label,x,y):return dict(id=label,label=label,x=x,y=y)
def g(label,x,y,xl=None,yl=None):
 d=dict(id=label,x=x,y=y)
 if xl is not None:d['xLabel']=str(xl)
 if yl is not None:d['yLabel']=str(yl)
 return d
def scene(x='Real GDP',y='Price level',xm=100,ym=100):
 return dict(xLabel=x,yLabel=y,xMax=xm,yMax=ym,curves=[],points=[],guides=[],caption='Schematic; not to scale')
def line(s,label,x,y,slope,style='primary'):
 # Clip lines to the plotted range so curve labels remain inside the SVG.
 lo=max(.07*s['xMax'], x+(.08*s['yMax']-y)/slope) if slope>0 else max(.07*s['xMax'],x+(.9*s['yMax']-y)/slope)
 hi=min(.9*s['xMax'],x+(.9*s['yMax']-y)/slope) if slope>0 else min(.9*s['xMax'],x+(.08*s['yMax']-y)/slope)
 s['curves'].append(c(label,[(lo,y+slope*(lo-x)),(hi,y+slope*(hi-x))],style))
def vertical(s,label,x,style='tertiary'):
 s['curves'].append(c(label,[(x,.08*s['yMax']),(x,.9*s['yMax'])],style))
def mark(s,label,x,y,xl=None,yl=None):
 s['points'].append(pt(label,x,y))
 if xl is not None or yl is not None:s['guides'].append(g(label,x,y,xl,yl))
def put(slug,id,*scenes):AUTHORED[(slug,id)]=list(scenes)
def market(x='Quantity',y='Price',dshift=0,sshift=0,probe=None):
 s=scene(x,y);line(s,'D₁',50,50,-1);line(s,'S₁',50,50,1,'secondary');mark(s,'E₁',50,50,'Q₁','P₁' if y=='Price' else 'r₁')
 if dshift:line(s,'D₂',50+dshift,50,-1,'tertiary')
 if sshift:line(s,'S₂',50+sshift,50,1,'tertiary')
 if dshift or sshift:
  xx=50+(dshift+sshift)/2; yy=50+(dshift-sshift)/2;mark(s,'E₂',xx,yy,'Q₂','P₂' if y=='Price' else 'r₂')
 if probe is not None:
  mark(s,'',100-probe,probe,'Qd','P*');s['guides'].append(g('supply-probe',probe,probe,'Qs'))
 return s
# Single-curve movements and shifts in demand / supply.
def single(label,slope,shift=0,points=None,x='Quantity',y='Price',xm=100,ym=100):
 s=scene(x,y,xm,ym);line(s,label+'₁',xm*.5,ym*.5,slope)
 if shift:line(s,label+'₂',xm*.5+shift,ym*.5,slope,'secondary')
 for label,xx,yy in points or []:mark(s,label,xx,yy)
 return s
put('1-4',32,single('D',-1,points=[('A',30,70),('B',70,30)]))
for id,shift in [(35,20),(45,20),(69,-20)]:put('1-4',id,single('D',-1,shift))
put('1-4',99,single('D',-1,20,x='Quantity — Economy A'),single('D',-1,-20,x='Quantity — Economy B'))
put('1-5',25,single('S',1,-20));put('1-5',32,single('S',1,points=[('A',30,30),('B',70,70)]));put('1-5',35,single('S',1,20,x='Quantity of corn'))
s=single('S',1,20);s['guides']=[g('s1',40,40,'Q₁','P*'),g('s2',60,40,'Q₂')];put('1-5',45,s)
put('1-6',17,market(dshift=20));put('1-6',18,market(sshift=-20));put('1-6',40,market(probe=70))
# Production possibility frontiers: separate intercept changes retain the source pivots.
def ppc(x,y,a=75,b=75,a2=None,b2=None,marks=None):
 s=scene(x,y,max(a,a2 or a)*1.25,max(b,b2 or b)*1.25)
 def frontier(label,aa,bb,style):
  s['curves'].append(c(label,[(aa*math.sin(t*math.pi/2/40),bb*math.cos(t*math.pi/2/40)) for t in range(41)],style))
 frontier('PPC₁',a,b,'primary')
 if a2 is not None:frontier('PPC₂',a2,b2,'secondary')
 for label,xx,yy in marks or []:mark(s,label,xx,yy)
 return s
put('1-2',38,ppc('Wheat','Cloth',a2=50,b2=75));put('1-2',43,ppc('Manufactured goods','Healthcare services',a2=75,b2=100));put('1-2',54,ppc('Consumer goods','Capital goods',a2=100,b2=75));put('1-2',74,ppc('Good A','Good B',a2=95,b2=95));put('1-2',76,ppc('Food','Manufactured goods',a2=100,b2=55));put('1-2',80,ppc('Consumer goods','Capital goods',a2=100,b2=100,marks=[('P₁',25,math.sqrt(75**2-25**2)),('P₂',70,math.sqrt(75**2-70**2))]));put('1-2',86,ppc('Consumer goods','Investment goods',marks=[('Actual GDP',30,30)]))
s=ppc('Good A','Good B',180,90);s['curves'][0]['label']='Country Y';s['curves'].append(c('Country X',[(0,90),(180,0)],'secondary'));mark(s,'X',90,45,'90','45');put('1-2',95,s)
put('1-2',97,ppc('Consumer goods','Capital goods',a2=75,b2=150));put('1-2',100,ppc('Consumer goods','Capital goods',a2=100,b2=100,marks=[('K',25,math.sqrt(75**2-25**2)),('C',70,math.sqrt(75**2-70**2))]))
# Aggregate demand single-curve source figures (including intentionally incorrect student graphs).
for id,shift in [(33,20),(37,-20),(64,20)]:put('3-1',id,single('AD',-1,shift,x='Real GDP',y='Price level'))
put('3-1',34,single('AD',-1,x='Real GDP',y='Price level'))
put('3-1',35,single('AD',-1,points=[('A',30,70),('B',70,30)],x='Real GDP',y='Price level'))
s=single('AD',-2,points=[('A',15,110),('B',18,90)],x='Real GDP (trillions)',y='Price level',xm=30,ym=200);s['curves']=[];line(s,'AD',15,110,-20/3);s['guides']=[g('a',15,110,'15','110'),g('b',18,90,'18','90')];put('3-1',63,s)
for id in [36,72,74,82,89,96,98]:
 s=scene('Real GDP','Price level',100,160);line(s,'AD₁',45,100,-1.5)
 if id in [36,74,82,89]:line(s,'AD₂',65,100,-1.5,'secondary')
 if id in [96,98]:line(s,'AD₂',30,100,-1.5,'secondary')
 if id==36:s['guides']=[g('one',45,100,'Y₁','100'),g('two',65,100,'Y₂')]
 if id==72:mark(s,'A',45,100,None,'100');mark(s,'B',45-20/1.5,120,None,'120')
 if id==74:mark(s,'A',35,115,None,'115');mark(s,'B',65-5/1.5,105,None,'105')
 if id==82:mark(s,'A',45,100);mark(s,'B',55,115)
 if id==89:mark(s,'B',75,85);mark(s,'C',55,115)
 if id==96:mark(s,'A',30,122.5);mark(s,'C',60,55)
 if id==98:mark(s,'A',20,115);mark(s,'B',50,70)
 put('3-1',id,s)
put('3-1',77,single('AD',1,x='Real GDP',y='Price level'))
s=single('D',-1,20,x='Nominal GDP',y='Price level');s['caption']='Student graph';put('3-1',92,s)
for id in [34,44]:put('3-3',id,single('SRAS',1,-20,x='Real GDP',y='Price level'))
s=single('SRAS',1,x='Real GDP',y='Price level');s['guides']=[g('one',35,35,'Y₁','PL₁'),g('two',65,65,'Y₂','PL₂')];put('3-3',36,s)
s=single('SRAS',1,20,x='Real GDP',y='Price level',points=[('X',35,35),('Y',65,65),('Z',55,35)]);s['guides']=[g('x',35,35,None,'PL₁'),g('y',65,65,None,'PL₂')];put('3-3',46,s)
s=single('SRAS',1,-20,x='Real GDP',y='Price level');line(s,'SRAS₃',70,50,1,'tertiary');put('3-3',59,s)
# AD–AS figures are specified with exact equilibrium points wherever sources give numbers.
def adas(y=50,p=100,yf=50,d=0,supply=0,initialLabel='E₁',numeric=False,second=None):
 sc=scene('Real GDP'+(' (trillions)' if numeric else ''),'Price level',max(y,yf,second[0] if second else y)*1.6,p*1.55)
 k=p/y*.5;line(sc,'AD₁',y,p,-k);line(sc,'SRAS₁',y,p,k,'secondary');vertical(sc,'LRAS',yf)
 mark(sc,initialLabel,y,p,str(y) if numeric else 'Y₁',str(p) if numeric else 'PL₁');sc['guides'].append(g('full-employment',yf,sc['yMax']*.88,str(yf) if numeric else 'Yf'))
 if d or supply:
  # Source shift sizes are qualitative, except where a new equilibrium is specified.
  yy,pp=second or (y+(d+supply)/2,p+k*(d-supply)/2)
  if d:line(sc,'AD₂',yy,pp,-k,'tertiary')
  if supply:line(sc,'SRAS₂',yy,pp,k,'muted')
  mark(sc,'E₂',yy,pp,str(yy) if numeric and second else 'Y₂',str(pp) if numeric and second else 'PL₂')
 return sc
put('3-4',34,adas());put('3-4',37,adas(20,110,20,numeric=True))
for id in [49,98]:
 sc=scene('Real GDP (trillions)','Price level',45,150);vertical(sc,'LRAS₁',25);vertical(sc,'LRAS₂',30,'secondary');sc['guides']=[g('one',25,100,'25'),g('two',30,115,'30')];
 if id==98:sc['guides'][0]['yLabel']='100';sc['guides'][1]['yLabel']='115'
 put('3-4',id,sc)
put('3-4',67,adas(40,100,50),adas(50,100,50),adas(60,100,50))
for id,y,p,yf in [(19,16,100,20),(20,24,100,20),(34,44,95,50),(35,46,125,40),(44,45,105,45)]:put('3-5',id,adas(y,p,yf,numeric=True))
# Replace unspecified price levels with symbolic labels, never invented numerical information.
for id in [19,20]:AUTHORED[('3-5',id)][0]['guides'][0]['yLabel']='PL₁'
put('3-5',37,adas(d=20));put('3-5',38,adas(d=-20));put('3-5',40,adas(40,100,50),adas(),adas(60,100,50))
put('3-5',41,adas(80,120,80,supply=-25,numeric=True));put('3-5',42,adas(30,100,30,supply=10,numeric=True));put('3-5',47,adas(40,100,50,d=20,second=(50,112.5)));put('3-5',49,adas(75,100,80,d=14,second=(82,100+7*100/75*.5),numeric=True));AUTHORED[('3-5',49)][0]['guides'][0]['yLabel']='PL₁';AUTHORED[('3-5',49)][0]['guides'][-1]['yLabel']='PL₂'
# Opposing effects with unspecified sizes require alternative panels, not a single invented outcome.
put('3-5',53,adas(40,100,50,d=25,supply=15),adas(40,100,50,d=15,supply=25));put('3-5',54,adas(70,100,70,d=10,supply=-10,numeric=True))
sc=scene('Real GDP (trillions)','Price level',120,160);line(sc,'AD',75,105,-1);line(sc,'SRAS',75,105,1,'secondary');vertical(sc,'LRAS',80);mark(sc,'E',75,105,'75','105');sc['guides'] += [g('grid1',70,100,'70','100'),g('grid2',80,110,'80','110')];put('3-5',76,sc)
for id,y,p,yf,d,supply in [(34,50,100,50,15,0),(35,60,105,60,0,-15),(37,70,110,70,0,15),(39,50,100,50,-25,0),(43,40,100,50,20,0),(54,45,100,45,0,12),(55,60,100,50,-20,0),(62,50,100,50,0,-20)]:put('3-6',id,adas(y,p,yf,d,supply,numeric=id in [34,35,37,54]))
put('3-6',41,adas(d=-20),adas(supply=20));put('3-6',46,adas(d=25,supply=-15),adas(d=15,supply=-25));put('3-6',47,adas(d=-25,supply=15),adas(d=-15,supply=25));put('3-6',48,adas(d=25,supply=15),adas(d=15,supply=25))
sc=scene('Real GDP (trillions)','Price level',120,170);line(sc,'AD₁',80,110,-1);line(sc,'SRAS₁',80,110,1,'secondary');line(sc,'SRAS₂',72,118,1,'tertiary');line(sc,'AD₂',80,126,-1,'muted');vertical(sc,'LRAS',80);mark(sc,'E₁',80,110,'80','110');mark(sc,'E₂',72,118,'72','118');mark(sc,'E₃',80,126,None,'PL₃');put('3-6',79,sc)
# Self-correction: three equilibria with each exact source point on its assigned curves.
def correction(y,p,y2,p2,p3,supplyShock=False):
 sc=scene('Real GDP (trillions)','Price level',max(y,y2)*1.5,max(p,p2,p3)*1.35);vertical(sc,'LRAS',y)
 if supplyShock:
  k=(p2-p)/(y2-y);line(sc,'AD',y,p,k);line(sc,'SRAS₁',y,p,abs(k),'secondary');line(sc,'SRAS₂',y2,p2,abs(k),'tertiary')
 else:
  k=(p2-p)/(y2-y);line(sc,'SRAS₁',y,p,k,'secondary');line(sc,'AD₁',y,p,-k);line(sc,'AD₂',y2,p2,(p3-p2)/(y-y2),'tertiary');line(sc,'SRAS₂',y,p3,k,'muted')
 mark(sc,'E₁',y,p,str(y),str(p));mark(sc,'E₂',y2,p2,str(y2),str(p2));mark(sc,'E₃',y,p3,None,str(p3) if supplyShock or (y,p,y2,p2,p3)==(80,100,90,112,120) else 'PL₃')
 return sc
put('3-7',34,correction(80,100,90,112,120));put('3-7',35,correction(60,105,52,96,87));put('3-7',36,correction(70,108,62,118,108,True));put('3-7',38,correction(50,100,60,110,120));put('3-7',41,adas(94,100,100));AUTHORED[('3-7',41)][0]['guides'][0]['xLabel']='94';AUTHORED[('3-7',41)][0]['guides'][-1]['xLabel']='100';put('3-7',61,correction(80,110,70,98,86));put('3-7',62,correction(70,105,80,115,125))
for id,y,p,yf,d in [(39,70,108,70,10),(46,45,100,55,20),(50,100,110,100,25),(53,60,100,50,-20),(57,38,100,50,16),(83,100,115,100,20)]:put('3-8',id,adas(y,p,yf,d=d,numeric=id in [39,46,50,57,83]))
put('3-8',40,adas(40,100,50,d=20),adas(d=20))
for id in [41,59]:
 sc=adas();line(sc,'AD without stabilizers',25,100,-1,'muted');line(sc,'AD with stabilizers',38,100,-1,'tertiary');mark(sc,'E₂',37.5,87.5);mark(sc,'E₃',44,94);put('3-9',id,sc)
# Source exchange-rate time series.
series={18:('EUR per USD',[.8,.84,.9]),28:('USD per EUR',[1.25,1.1]),29:('JPY per USD',[100,110]),35:('USD per CAD',[.74,.75,.78]),43:('Currency B per currency A',[1,1.2,1.1]),52:('USD per CAD',[.7,.74,.72,.78]),58:('JPY per USD',[150,140,145]),66:('USD per EUR',[1.2,1.3]),75:('EUR per USD',[.75,.9]),85:('Currency B per currency A',[5,4.5,5.5]),93:('USD per GBP',[1.25,1.3,1.4]),100:('Currency X per currency Y',[2,2.4,2.1,2.6])}
for id,(label,values) in series.items():
 sc=scene('Period',label,len(values)+.5,max(values)*1.2);sc['caption']='Exchange rate by period';sc['curves']=[c('Exchange rate',list(enumerate(values,1)))];sc['guides']=[g(str(i),i,v,str(i),f'{v:.2f}' if max(values)<10 else str(v)) for i,v in enumerate(values,1)];put('6-2',id,sc)
for slug,path in [(p.stem,p) for p in ROOT.glob('*.json') if p.stem!='manifest']:
 bank=json.loads(path.read_text())
 for q in bank:
  if (slug,q['id']) in AUTHORED:q['graphScenes']=AUTHORED[(slug,q['id'])]
 path.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
print(f'Authored {len(AUTHORED)} question figures')
# Money markets and loanable funds: different interest-rate axes and supply slopes.
def money(q=50,r=50,supplyShift=0,demandShift=0,probes=None,numeric=False):
 sc=scene('Quantity of money'+(' (billions)' if numeric else ''),'Nominal interest rate'+(' (%)' if numeric else ''),q*1.7,r*2)
 k=r/q;line(sc,'MD₁',q,r,-k);vertical(sc,'MS₁',q,'secondary');mark(sc,'E₁',q,r,str(q) if numeric else 'Qs',str(r) if numeric else 'i₁')
 if demandShift:line(sc,'MD₂',q+demandShift,r,-k,'tertiary')
 if supplyShift:vertical(sc,'MS₂',q+supplyShift,'muted')
 if demandShift or supplyShift:mark(sc,'E₂',q+supplyShift,r+k*(demandShift-supplyShift),'Q₂','i₂')
 for rate,label in probes or []:
  xx=q+(r-rate)/k;sc['guides'].append(g(label,xx,rate,'Qd'+label,str(rate) if numeric else label));sc['guides'].append(g(label+'s',q,rate))
 return sc
for id in [8,12,32,36,42,50,63,72,76,80,86,93,98]:
 rates={12:[(70,'r₁')],32:[(70,'r₁'),(50,'r₂'),(30,'r₃')],36:[(70,'rA')],42:[(70,'r₁')],50:[(30,'rL')],63:[(70,'rA'),(30,'rB')],72:[(70,'rA')],76:[(85,'r₁'),(75,'r₂'),(65,'r₃')],80:[(70,'rH'),(30,'rL')],86:[(25,'rC'),(35,'rN')],93:[(70,'r₁'),(30,'r₂')],98:[(20,'rL'),(35,'rM')]}.get(id,[])
 put('4-5',id,money(probes=rates))
put('4-5',18,single('MD',-1,points=[('H',30,70),('L',70,30)],x='Quantity of money',y='Nominal interest rate'))
# Numeric money demand has its actual source slope, not a default slope.
for id,q,r,qprobe,rprobe in [(24,700,5,900,3),(28,800,6,600,8),(40,650,5,800,3),(57,850,6,550,9),(90,750,5,500,9)]:
 sc=money(q,r,numeric=True);sc['curves']=[];line(sc,'MD',q,r,(rprobe-r)/(qprobe-q));vertical(sc,'MS',q,'secondary');sc['guides'].append(g('probe',qprobe,rprobe,str(qprobe),str(rprobe)));put('4-5',id,sc)
for id,q,qp in [(46,900,650)]:
 sc=money(q,50);sc['guides'][0]['xLabel']=str(q);sc['guides'].append(g('probe',qp,50+(q-qp)*50/q,str(qp),'rH'));put('4-5',id,sc)
for id,shift in [(40,20),(41,-20)]:put('4-6',id,money(supplyShift=shift))
for id,d in [(42,20),(43,-20)]:put('4-6',id,adas(d=d))
for id,y,d in [(44,40,20),(45,60,-20),(80,40,12),(81,60,-12)]:put('4-6',id,adas(y,100,50,d=d))
for id,d in [(61,20),(62,-20),(92,20),(93,-20)]:put('4-6',id,money(supplyShift=d),adas(d=d))
def lf(d=0,s=0,probe=None):return market('Quantity of loanable funds','Real interest rate',d,s,probe)
for id,d,supply in [(31,20,0),(32,0,20),(34,0,-20),(57,20,0),(58,0,20),(69,20,-20),(75,20,20),(76,20,-20),(77,30,10),(78,10,30),(87,20,0),(88,0,-20)]:
 sc=lf(d,supply)
 if id in [58,87,88]:sc['guides'].append(g('old-rate',50+(d or supply),50,'Q₃' if id==87 else 'Q₀' if id==88 else 'Qs₂','r₁'))
 put('4-7',id,sc)
for id,probe in [(12,70),(13,30)]:put('4-7',id,lf(probe=probe))
for id,marks in [(6,[('A',70,30),('B',30,70)]),(9,[('C',30,30),('D',70,70)])]:
 sc=lf();sc['points']=[];sc['guides']=[]
 for j,(label,x,y) in enumerate(marks,1):mark(sc,label,x,y,'Q'+str(j),'r'+str(j))
 put('4-7',id,sc)
for id,qd,qs,r in [(42,700,900,8),(43,800,620,3)]:
 sc=scene('Loanable funds (billions)','Real interest rate (%)',1200,12);line(sc,'D',qd,r,-.008);line(sc,'S',qs,r,.008,'secondary');sc['guides']=[g('d',qd,r,str(qd),str(r)),g('s',qs,r,str(qs))];put('4-7',id,sc)
for id,amount,d,supply in [(93,120,120,0),(94,150,0,150)]:
 sc=scene('Loanable funds (billions)','Real interest rate',1000,100);line(sc,'D₁',500,50,-.08);line(sc,'S₁',500,50,.08,'secondary')
 line(sc,'D₂' if d else 'S₂',500+amount,50,-.08 if d else .08,'tertiary');mark(sc,'E₁',500,50,'Q₁','r₁');mark(sc,'E₂',500+amount/2,50+(.04*amount if d else -.04*amount),'Q₂','r₂');sc['guides'].append(g('probe',500+amount,50,'Q₁ + '+str(amount),'r₁'));put('4-7',id,sc)
# Fiscal/monetary policy combinations use independently specified money-demand and supply shifts.
put('5-1',41,adas(40,100,50,d=20));put('5-1',42,adas(60,100,50,d=-20))
put('5-1',43,money(supplyShift=10,demandShift=20),money(supplyShift=20,demandShift=10));put('5-1',44,money(supplyShift=-10,demandShift=-20),money(supplyShift=-20,demandShift=-10));put('5-1',45,money(supplyShift=-20,demandShift=20));put('5-1',46,money(supplyShift=20,demandShift=-20))
for id,d in [(58,20),(59,-20)]:
 sc=adas(d=d);sc['caption']='AD returns to its initial position after the second policy';put('5-1',id,sc,money(supplyShift=-d,demandShift=d))
for id,d in [(68,20),(69,-20),(79,20),(80,-20)]:put('5-1',id,adas(d=d),money(supplyShift=d,demandShift=d))
put('5-1',87,adas(d=20),money(supplyShift=25,demandShift=10));put('5-1',88,adas(d=-20),money(supplyShift=-25,demandShift=-10));put('5-1',95,adas(40,100,50,d=20),money(supplyShift=20,demandShift=20));put('5-1',96,adas(60,100,50,d=-20),money(supplyShift=-20,demandShift=-20))
for id,d,n in [(43,20,2),(44,-20,2),(45,15,3),(46,20,2),(62,20,2),(63,-20,2),(85,15,3),(86,20,2),(87,-15,3),(88,20,2)]:
 sc=scene('Real GDP','Price level',100,150);vertical(sc,'LRAS',50)
 for i in range(n):
  pp=70+i*d;line(sc,'AD'+str(i+1),50,pp,-1,'primary' if i==0 else 'tertiary');line(sc,'SRAS'+str(i+1),50,pp,1,'secondary' if i==0 else 'muted');mark(sc,'E'+str(i+1),50,pp,'Yf' if i==0 else None,'P'+str(i+1))
 put('5-3',id,sc)
# Crowding-out graphs and the separate private-investment schedule.
for id,d in [(15,0),(16,20),(17,20),(18,20),(19,-20),(20,-20),(30,20),(41,20),(42,20),(49,20),(50,20),(67,-20)]:
 sc=lf(d)
 if id in [18,41]:sc['points'][0]['label']='A';sc['points'][1]['label']='B'
 if id==20:sc['guides'][0]['yLabel']='7';sc['guides'][1]['yLabel']='5'
 if id==17:sc['guides'].append(g('old-rate',70,50,'Qd₂','r₁'))
 if id==50:line(sc,'D₃',90,50,-1,'muted');mark(sc,'E₃',70,70,'Q₃','r₃')
 if id==49:put('5-5',id,sc,single('I',-1,points=[('A',70,30),('B',30,70)],x='Private investment',y='Real interest rate'))
 else:put('5-5',id,sc)
for id in [33,34,35,66,92,93]:
 if id==33:
  sc=scene('Loanable funds (billions)','Real interest rate (%)',900,9);line(sc,'S',500,4,1/30,'secondary');line(sc,'D₁',500,4,-1/30);line(sc,'D₂',560,6,-1/30,'tertiary');mark(sc,'E₁',500,4,'500','4');mark(sc,'E₂',560,6,'560','6');put('5-5',id,sc)
 elif id==34:
  sc=scene('Loanable funds (billions)','Real interest rate (%)',900,9);line(sc,'S',500,4,.02,'secondary');line(sc,'D₁',500,4,-.02);line(sc,'D₂',590,4,-.02,'tertiary');mark(sc,'E₁',500,4,'500','4');sc['guides'].append(g('probe',590,4,'590'));put('5-5',id,sc)
 elif id in [35,93]:
  low,high,ia,ib=(4,6,420,350) if id==35 else (3,5,460,390)
  sc=lf(20);sc['guides'][0]['yLabel']=str(low);sc['guides'][1]['yLabel']=str(high)
  inv=scene('Private investment (billions)','Real interest rate (%)',650,9);line(inv,'I',ia,low,(high-low)/(ib-ia));mark(inv,'A',ia,low,str(ia),str(low));mark(inv,'B',ib,high,str(ib),str(high));put('5-5',id,sc,inv)
 elif id==66:put('5-5',id,AUTHORED[('4-7',93)][0])
 else:
  sc=scene('Loanable funds (billions)','Real interest rate',900,100);line(sc,'S',500,40,.1,'secondary');line(sc,'D₁',500,40,-.1);line(sc,'D₂',570,47,-.1,'tertiary');mark(sc,'E₁',500,40,'500','r₁');mark(sc,'E₂',570,47,'570','r₂');sc['caption']='Government borrowing increases by $130 billion';put('5-5',id,sc)
put('5-5',74,lf(30,10),lf(10,30));put('5-5',75,lf(30,-10),lf(10,-30))
# Phillips curves: numerical coordinates and shifts are authored per source.
def phillips(u=5,u2=None,shift=0,marks=None,curvePoints=None,showLR=True):
 sc=scene('Unemployment rate (%)','Inflation rate (%)',10,10)
 sc['curves']=[c('SRPC₁',curvePoints or [(1,8),(9,1)])]
 if showLR:vertical(sc,'LRPC₁',u,'secondary');sc['guides'].append(g('natural',u,9,str(u)))
 if u2 is not None:vertical(sc,'LRPC₂',u2,'tertiary');sc['guides'].append(g('natural2',u2,9,str(u2)))
 if shift:sc['curves'].append(c('SRPC₂',[(x,y+shift) for x,y in curvePoints or [(1,6),(9,1)]],'tertiary'))
 for label,x,y in marks or []:mark(sc,label,x,y,str(x),str(y))
 return sc
for id in [22,23,24,26,27,31,32,33,34,35,36,37,38,39,40,51,52,53,54,55,56,95,96,97]:
 kwargs={}
 if id==22:kwargs=dict(marks=[('E',5,4)],curvePoints=[(1,8),(5,4),(9,1)])
 if id==23:kwargs=dict(marks=[('A',4,5),('E',5,4)],curvePoints=[(1,8),(5,4),(9,1)])
 if id==24:kwargs=dict(marks=[('B',7,2),('E',5,4)],curvePoints=[(1,8),(5,4),(9,1)])
 if id==26:kwargs=dict(shift=2)
 if id==27:kwargs=dict(u2=6)
 if id==31:kwargs=dict(marks=[('E',5,4),('A',4,6)],curvePoints=[(2,8),(4,6),(5,4),(9,1)])
 if id==32:kwargs=dict(marks=[('E',5,4),('B',7,2)],curvePoints=[(1,8),(5,4),(7,2),(9,1)])
 if id in [33,53]:kwargs=dict(shift=2,curvePoints=[(1,6),(9,1)])
 if id in [34,54]:kwargs=dict(shift=-2,curvePoints=[(1,8),(9,3)])
 if id==35:kwargs=dict(u=4.5,u2=6)
 if id==36:kwargs=dict(u=6,u2=4)
 if id==37:kwargs=dict(marks=[('A',3,6.25),('B',5,4.5),('C',7,2.75)])
 if id==38:kwargs=dict(showLR=False,marks=[('A',3,6.25),('C',7,2.75)])
 if id==39:kwargs=dict(shift=3,marks=[('A',5,3),('B',5,6)],curvePoints=[(1,6),(5,3),(9,1)])
 if id==40:kwargs=dict(marks=[('A',6,3),('B',4,6)],curvePoints=[(2,8),(4,6),(6,3),(9,1)])
 if id==51:kwargs=dict(marks=[('E',5,4),('A',4,5)],curvePoints=[(1,8),(5,4),(9,1)])
 if id==52:kwargs=dict(marks=[('E',5,4),('B',7,2)],curvePoints=[(1,8),(5,4),(9,1)])
 if id==55:kwargs=dict(u2=6,marks=[('P',5,4.5)])
 if id==56:kwargs=dict(u2=4,marks=[('P',5,4.5)])
 if id==95:kwargs=dict(shift=2,marks=[('A',4,4.6),('B',5,6),('C',7,4)],curvePoints=[(1,7),(5,4),(9,0)])
 if id==96:kwargs=dict(shift=3,curvePoints=[(1,6),(5,3),(9,1)])
 if id==97:kwargs=dict(u=4,u2=6,marks=[('P',5,4.5)])
 sc=phillips(**kwargs)
 # Unspecified coordinates are schematic and carry symbols, not spurious data.
 specified={22:{'E'},23:set(),24:set(),31:{'E','A'},32:{'E','B'},39:{'A','B'},40:{'A','B'},51:set(),52:set(),55:set(),56:set(),95:set(),97:set()}.get(id,set())
 for gg in sc['guides']:
  if gg['id'] not in ['natural','natural2'] and gg['id'] not in specified:gg.pop('yLabel',None)
 if id==96:sc['guides'][0]['xLabel']='uN';sc['guides'] += [g('i1',5,3,None,'3'),g('i2',5,6,None,'6')]
 if id in [26,33,34,38,53,54]:sc['guides']=[]
 if id in [53,54]:sc['guides']=[g('first',5,3.5 if id==53 else 5.5,'u₁','π₁'),g('second',5,5.5 if id==53 else 3.5,None,'π₂')]
 put('5-2',id,sc)
put('5-2',25,phillips(showLR=False,marks=[('A',4,7),('B',7,3)],curvePoints=[(2,9),(4,7),(7,3),(9,1)]))
# Avoid invented price labels where only real-output values were supplied.
for slug,ids in [('3-5',[49]),('3-6',[54]),('3-8',[46,57])]:
 for id in ids:
  for gg in AUTHORED[(slug,id)][0]['guides']:
   if gg.get('yLabel'):gg['yLabel']='PL₁' if gg['id']=='E₁' else 'PL₂'
for (slug,id),scenes in AUTHORED.items():
 for sc in scenes:
  # Identical initial and final points need one label, not overlapping text.
  unique=[]
  for p in sc['points']:
   prev=next((v for v in unique if (v['x'],v['y'])==(p['x'],p['y'])),None)
   if prev:prev['label']+=' = '+p['label']
   else:unique.append(p)
  sc['points']=unique
for path in ROOT.glob('*.json'):
 if path.stem=='manifest':continue
 bank=json.loads(path.read_text())
 for q in bank:
  if (path.stem,q['id']) in AUTHORED:q['graphScenes']=AUTHORED[(path.stem,q['id'])]
 path.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
print(f'Authored {len(AUTHORED)} question figures in total')
# Foreign exchange: the quoted price is always foreign currency per unit of the currency traded.
def fx(base='USD',quote='EUR',d=0,s=0,rate=None,probe=None,movement=None):
 sc=market('Quantity of '+base,quote+' per '+base,d,s,probe)
 for gg in sc['guides']:
  if gg.get('yLabel'):gg['yLabel']=gg['yLabel'].replace('r','e').replace('P*','eH' if probe and probe>50 else 'eL')
 if movement:
  sc['points']=[];sc['guides']=[]
  for label,x,y in ([('A',30,70),('B',70,30)] if movement=='d' else [('A',30,30),('B',70,70)]):mark(sc,label,x,y)
 if rate is not None:
  factor=rate/50
  for cc in sc['curves']:
   for pp in cc['points']:pp['y']*=factor
  for pp in sc['points']:pp['y']*=factor
  for gg in sc['guides']:gg['y']*=factor
  sc['yMax']*=factor
  if sc['guides']:sc['guides'][0]['yLabel']=str(rate)
 return sc
fxspec={8:('USD','EUR',.9,None,None),15:('EUR','USD',None,None,'d'),22:('GBP','EUR',None,None,'s'),27:('CAD','USD',.76,70,None),32:('USD','CAD',1.34,None,None),35:('EUR','GBP',.86,30,None),38:('MXN','USD',.055,70,None),41:('USD','EUR',None,None,'d'),44:('CHF','EUR',None,None,'s'),47:('EUR','USD',1.18,30,None),50:('GBP','USD',1.35,70,None),53:('USD','EUR',None,None,None),56:('EUR','GBP',.84,None,None),59:('USD','JPY',None,None,'d'),62:('CAD','USD',.74,30,None),65:('EUR','CHF',.96,None,None),68:('GBP','EUR',1.16,70,None),71:('USD','EUR',.91,30,None),75:('EUR','USD',1.22,70,None),79:('CAD','EUR',.69,30,None),83:('GBP','JPY',None,None,None),87:('USD','CHF',.89,50*.79/.89,None),91:('EUR','CAD',None,None,None),95:('GBP','USD',1.31,70,None),99:('USD','EUR',.93,70,None)}
for id,(base,quote,rate,probe,movement) in fxspec.items():
 sc=fx(base,quote,rate=rate,probe=probe,movement=movement)
 if id in [53,83,91]:
  for p,label in [(70,'eH'),(30,'eL')]:sc['guides'] += [g(label+'d',100-p,p,'Qd'+label,label),g(label+'s',p,p,'Qs'+label)]
 if id not in [8,32,56,65] and sc['guides']:sc['guides'][0]['xLabel']='Qe'
 if id in [8,32,56,65]:sc['guides'][0]['xLabel']='50'
 if id==87:sc['guides'][1]['yLabel']='0.79'
 if sc['points'] and not movement:sc['points'][0]['label']='E₀'
 put('6-3',id,sc)
put('6-4',4,fx('CAD','USD',s=-20));put('6-4',8,fx('GBP','USD',d=-20));put('6-4',12,fx('JPY','USD',d=-20))
for id,base,quote,d,supply in [(17,'USD','EUR',20,0),(18,'EUR','USD',0,20),(35,'USD','CAD',0,-20),(36,'GBP','USD',-20,0),(60,'AUD','JPY',20,0),(61,'CHF','EUR',0,20),(70,'NZD','USD',-20,0)]:put('6-5',id,fx(base,quote,d,supply))
for id,d in [(19,-20),(20,20),(37,-20),(38,20),(62,-20),(63,20)]:put('6-5',id,adas(d=d))
for id,d,supply,ad in [(50,20,0,-20),(51,0,20,20),(78,20,0,-20),(79,0,20,20),(92,20,0,-20),(93,0,20,20)]:put('6-5',id,fx('Domestic currency','Foreign currency',d,supply),adas(d=ad))
put('6-5',87,adas(40,100,50,d=12));put('6-5',88,adas(60,100,50,d=-12))
for id,e2 in [(98,65),(99,35)]:
 # Only the exchange-rate change is specified. A line chart avoids inventing its supply/demand cause.
 sc=scene('Situation','Foreign currency per domestic currency',3,100);sc['curves']=[c('Exchange rate',[(1,50),(2,e2)])];sc['guides']=[g('one',1,50,'Initial','e₁'),g('two',2,e2,'Final','e₂')];put('6-5',id,sc,adas())
for id,ra,rb in [(4,6,3),(31,5.5,3.5)]:
 panels=[]
 for country,rate in [('A',ra),('B',rb)]:
  sc=lf();sc['xLabel']='Loanable funds — Country '+country;sc['yLabel']='Real interest rate (%)';sc['guides'][0]['yLabel']=str(rate);panels.append(sc)
 put('6-6',id,*panels)
for id in [8,27,39,70]:put('6-6',id,fx(d=20))
for id in [12,24,35,69]:put('6-6',id,lf(s=20))
for id in [16,51,62]:put('6-6',id,fx(s=20))
for id in [20,44,72]:put('6-6',id,lf(s=20),fx(d=20))
for id in [48,59]:put('6-6',id,lf(s=-20))
for id in [55,80]:put('6-6',id,fx(d=20),fx('EUR','USD',s=20))
for id in [66,76,87]:
 a=lf(s=20);a['xLabel']='Loanable funds — Country A';b=lf(s=-20);b['xLabel']='Loanable funds — Country B'
 if id==87:
  # Different initial rates converge; ordinate heights share one scale across these two panels.
  for sc,offset in [(a,15),(b,-15)]:
   for cc in sc['curves']:
    for pp in cc['points']:pp['y']+=offset
   for pp in sc['points']:pp['y']+=offset
   for gg in sc['guides']:gg['y']+=offset
   sc['yMax']=120
 put('6-6',id,a,b)
put('6-6',83,money(supplyShift=20),fx(s=20));put('6-6',91,fx(d=30,s=10),fx(d=10,s=30));put('6-6',95,money(supplyShift=20),fx(s=20),lf(s=-20));put('6-6',100,money(supplyShift=-20),fx(d=20),lf(s=20))
# Data charts use the actual observations, with no invented intermediate values.
def timechart(series,x='Period',y='Index',labels=None):
 maxx=max(p[0] for _,pts in series for p in pts);maxy=max(p[1] for _,pts in series for p in pts)
 sc=scene(x,y,maxx+.5,maxy*1.2);sc['caption']='Values shown are the supplied observations'
 for i,(name,pts) in enumerate(series):
  sc['curves'].append(c(name,pts,['primary','secondary','tertiary'][i%3]))
  for j,(xx,yy) in enumerate(pts):sc['guides'].append(g(name+str(j),xx,yy,(labels or {}).get(xx,str(xx)),str(yy)))
 return sc
def apf(shift=False,marks=None):
 sc=scene('Employment','Real output');pts=[(x,80*math.sqrt(x/90)) for x in range(5,91,5)];sc['curves']=[c('APF₁',pts)]
 if shift:sc['curves'].append(c('APF₂',[(x,y+15) for x,y in pts],'secondary'))
 for label,x,y in marks or []:mark(sc,label,x,y)
 return sc
def barseries(groups,categories,y='Index',numeric=True):
 sc=scene('Category',y,len(categories)*(len(groups)+1)+1,max(v for _,vals in groups for v in vals)*1.25);sc['caption']='Outlined bars compare the supplied categories'
 for i,(name,values) in enumerate(groups):
  for j,v in enumerate(values):
   xx=j*(len(groups)+1)+1+i;sc['curves'].append(c(name+' '+categories[j],[(xx-.25,0),(xx-.25,v),(xx+.25,v),(xx+.25,0)],'primary' if i==0 else 'secondary'))
   sc['guides'].append(g(str(i)+'-'+str(j),xx,v,None,str(v) if numeric else None))
 # The direct bar labels identify each category and group; axes carry no arbitrary numbers.
 return sc
put('5-6',4,barseries([('Period 1',[40000]),('Period 2',[44000])],['Real GDP per capita'],'Real GDP per capita'))
put('5-6',8,barseries([('A',[120,100]),('B',[150,150])],['Real output','Employment']))
for id in [19,42]:put('5-6',id,apf(marks=[('A',25,80*math.sqrt(25/90)),('B',70,80*math.sqrt(70/90))]))
put('5-6',27,timechart([('Real GDP per capita',[(1,50000),(2,52500)])],y='Real GDP per capita',labels={1:'2025',2:'2026'}))
for id,output,pop in [(33,120,110),(38,116,123),(65,115,105),(76,116,123),(92,94,90)]:
 a,b=('Real GDP','Population') if id in [33,38] else ('Real output','Employment') if id in [65,92] else ('Output per worker','Capital per worker')
 put('5-6',id,timechart([(a,[(1,100),(3 if id==33 else 2,output)]),(b,[(1,100),(3 if id==33 else 2,pop)])],y='Index (initial period = 100)'))
sc=apf();sc['xLabel']='Capital per worker';sc['yLabel']='Output per worker';mark(sc,'A',25,80*math.sqrt(25/90));mark(sc,'B',70,80*math.sqrt(70/90));put('5-6',47,sc)
put('5-6',52,barseries([('A',[50,50,50]),('B',[70,70,70])],['Physical capital','Human capital','Real output'],'Relative level (schematic)',False))
for id in [57,81,82]:
 sc=apf(True);xx=45;mark(sc,'A',xx,80*math.sqrt(xx/90));xx=70 if id==82 else 45;mark(sc,'B',xx,80*math.sqrt(xx/90)+15);put('5-6',id,sc)
sc=scene('Human capital per worker','Real output per worker');sc['curves']=[];sc['points']=[pt('',x,y) for x,y in [(15,22),(25,25),(40,45),(50,42),(65,68),(80,75)]];sc['caption']='Schematic positive association; no numerical observations supplied';put('5-6',61,sc)
put('5-6',72,timechart([('Real GDP',list(enumerate([100,108,119,132],1))),('Population',list(enumerate([100,105,110,116],1)))],y='Index (Year 1 = 100)'))
put('5-6',98,barseries([('Year 1',[100,100,100]),('Year 2',[112,108,115])],['Physical capital','Human capital','Real output'],'Index (Year 1 = 100)'))
# Growth diagrams. Unspecified simultaneous shifts show two possible price outcomes.
for id in [8,33,42,81]:put('5-7',id,ppc('Capital goods','Consumer goods',a2=95,b2=95))
for id in [14,38,65]:
 sc=scene();vertical(sc,'LRAS₁',40);vertical(sc,'LRAS₂',60,'secondary');sc['guides']=[g('one',40,90,'Yf₁'),g('two',60,90,'Yf₂')];put('5-7',id,sc)
for id in [22,74,92]:
 panels=[]
 for d,supply in [(30,10),(10,30)]:
  sc=adas(d=d,supply=supply);sc['curves']=[cc for cc in sc['curves'] if cc['label']!='LRAS'];vertical(sc,'LRAS₁',50);vertical(sc,'LRAS₂',70,'muted');sc['guides']=[gg for gg in sc['guides'] if gg['id']!='full-employment'];sc['guides'] +=[g('full1',50,140,'Yf₁'),g('full2',70,140,'Yf₂')];panels.append(sc)
 put('5-7',id,*panels)
for id in [52,61,82,98]:
 sc=adas(d=20);sc['curves']=[cc for cc in sc['curves'] if cc['label']!='LRAS'];vertical(sc,'LRAS₁',50);vertical(sc,'LRAS₂',65,'muted');sc['guides']=[gg for gg in sc['guides'] if gg['id']!='full-employment'];sc['guides'] +=[g('one',50,140,'Yf₁'),g('two',65,140,'Yf₂')];put('5-7',id,sc)
sc=scene();vertical(sc,'LRAS₁',40);vertical(sc,'LRAS₂',60,'secondary');sc['guides']=[g('one',40,90,'Yf₁'),g('two',60,90,'Yf₂')];put('5-7',47,adas(d=20),sc)
for id in [57,76]:
 vals=([100,112],[100,95]) if id==76 else ([50,65],[50,35]);sc=timechart([('Productivity',[(1,vals[0][0]),(4,vals[0][1])]),('Participation',[(1,vals[1][0]),(4,vals[1][1])])],x='Year',y='Index' if id==76 else 'Direction of change (schematic)');
 if id==57:
  for gg in sc['guides']:gg.pop('yLabel',None)
 sc['annotations']=[dict(id='policy',x=1,y=max(vals[0]+vals[1])*1.12,text='Policy introduced')];put('5-7',id,sc)
put('5-7',72,ppc('Capital goods','Consumer goods',a2=100,b2=100,marks=[('A',30,30),('B',50,math.sqrt(75**2-50**2)),('C',60,80)]))
# Business cycle charts. Turning points refer to actual output, not maxima of the output gap.
def cycle(actual,potential,labels=None,numeric=False):
 sc=scene('Year' if numeric else 'Time','Real GDP'+(' (trillions)' if numeric else ''),max(x for x,y in actual)+.5,max(y for x,y in actual+potential)*1.2);sc['curves']=[c('Actual',actual),c('Potential',potential,'secondary')]
 for label,x,y in labels or []:mark(sc,label,x,y,str(x) if numeric else None,str(y) if numeric else None)
 return sc
put('2-7',34,cycle([(1,70),(2,48),(3,35),(5,54),(6,80),(7,85)],[(1,50),(7,62)]))
put('2-7',37,cycle([(1,70),(2,52),(3,35),(4,56),(5,80)],[(1,50),(5,58)],[('A',1,70),('B',2,52),('C',3,35),('D',4,56)]))
put('2-7',41,cycle([(1,35),(4,40),(5,58),(7,80),(8,64),(9,45)],[(1,50),(9,66)],[('Year 5',5,58),('Year 6',6,69)]))
put('2-7',54,cycle([(x,50*1.02**(x-1)+12*math.sin(2*math.pi*(x-1)/6)) for x in range(1,14)],[(x,50*1.02**(x-1)) for x in range(1,14)]))
for id in [67,72]:put('2-7',id,cycle([(1,35),(2,40),(3,54),(4,68),(5,75),(6,65)],[(1,50),(6,60)],[('X',3,54)] if id==67 else []))
put('2-7',74,cycle([(1,16),(2,21),(3,17),(4,22)],[(1,20),(2,20.5),(3,21),(4,23)],[('Trough 1',1,16),('Peak 1',2,21),('Trough 2',3,17),('Peak 2',4,22)],True));AUTHORED[('2-7',74)][0]['xLabel']='Observation';
for gg in AUTHORED[('2-7',74)][0]['guides']:gg.pop('xLabel',None)
put('2-7',90,cycle([(1,17),(3,20),(5,23),(7,20),(10,15),(12,20),(14,23),(17,20),(20,17)],[(1,20),(20,20)],numeric=True));AUTHORED[('2-7',90)][0]['guides']=[g(str(x),x,20,str(x),'20' if x==3 else None) for x in [3,7,12,17]]
put('2-7',93,cycle([(1,18),(4,15),(6,21),(9,26),(11,22),(15,18)],[(1,20),(15,22.8)],[('Trough',4,15),('Peak',9,26)],True));AUTHORED[('2-7',93)][0]['guides']=[g('up',6,21,'6'),g('down',11,22,'11')]
put('2-7',99,cycle([(1,14),(4,17),(7,14.5),(10,19)],[(x,15*1.03**(x-1)) for x in range(1,11)],[('Year 1',1,14),('Year 4',4,17),('Year 7',7,14.5),('Year 10',10,19)],True))
# Source corrections for schematic-only coordinates.
AUTHORED[('5-2',26)][0]=phillips(shift=2,curvePoints=[(1,6),(9,1)])
for pp in AUTHORED[('5-2',24)][0]['points']:
 if pp['label']=='B':pp['y']=2.5
for pp in AUTHORED[('5-2',95)][0]['points']:
 if pp['label']=='A':pp['y']=4.75
for gg in AUTHORED[('3-7',38)][0]['guides']:
 if gg.get('xLabel'):gg['xLabel']='Yf' if gg['id'] in ['E₁','E₃'] else 'Y₂'
 if gg.get('yLabel'):gg['yLabel']='PL₁' if gg['id']=='E₁' else 'PL₂' if gg['id']=='E₂' else 'PL₃'
AUTHORED[('3-7',41)][0]['guides'][0]['yLabel']='PL₁'
# All changes are idempotently written; source descriptions remain accessible figure transcripts.
for path in ROOT.glob('*.json'):
 if path.stem=='manifest':continue
 bank=json.loads(path.read_text())
 for q in bank:
  if (path.stem,q['id']) in AUTHORED:q['graphScenes']=AUTHORED[(path.stem,q['id'])]
 path.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
print(f'Authored {len(AUTHORED)} question figures in total')
# Label treatment is part of authoring: numerical series label observations directly,
# preventing near-equal values from piling up on the vertical axis.
for key,panels in AUTHORED.items():
 for sc in panels:
  if key[0]=='6-2' or key in [('5-6',27),('5-6',33),('5-6',38),('5-6',65),('5-6',72),('5-6',76),('5-6',92),('5-7',76)]:
   sc['annotations']=[];seen=set()
   for gg in sc['guides']:
    value=gg.pop('yLabel',None)
    if value and (gg['x'],gg['y']) not in seen:
     sc['annotations'].append(dict(id=gg['id'],x=gg['x'],y=gg['y'],text=value));seen.add((gg['x'],gg['y']))
  if key in [('5-6',4),('5-6',8),('5-6',52),('5-6',98)]:
   for cc in sc['curves']:
    original=cc['label'];cc['label']=original.replace('Real GDP per capita','GDP/person').replace('Physical capital','Capital').replace('Human capital','Human').replace('Real output','Output').replace('Employment','Jobs').replace('Period ','P').replace('Year ','Y')
    points=cc['points'];cc['points']=[points[0],points[3],points[2],points[1]]
   for gg in sc['guides']:
    value=gg.pop('yLabel',None)
    if value:sc.setdefault('annotations',[]).append(dict(id=gg['id'],x=gg['x'],y=gg['y'],text=value))
  if key==('3-7',36):
   sc['points']=[pt('E₁ = E₃',70,108),pt('E₂',62,118)];sc['guides']=sc['guides'][:2]
  if key==('5-2',24):
   for gg in sc['guides']:
    if gg['id']=='B':gg['y']=2.5
  if key==('5-2',95):
   for gg in sc['guides']:
    if gg['id']=='A':gg['y']=4.75
  if key==('2-7',74):sc['curves'][0]['points'].append(dict(x=4.4,y=21));sc['curves'][1]['points'].append(dict(x=4.4,y=23.2))
  if key==('2-7',93):sc['yLabel']='Real GDP';sc['caption']='Schematic between the identified turning points'
# Shared numerical rate scales in country comparisons.
for id in [4,31]:
 for sc,rate in zip(AUTHORED[('6-6',id)], [6,3] if id==4 else [5.5,3.5]):
  sc['yMax']=9;sc['curves']=[];line(sc,'D',50,rate,-.06);line(sc,'S',50,rate,.06,'secondary');sc['points']=[pt('E',50,rate)];sc['guides']=[g('equilibrium',50,rate,'Qe',str(rate))]
for id,r1,r2 in [(20,7,5),(35,4,6),(93,3,5)]:
 sc=scene('Quantity of loanable funds','Real interest rate (%)',100,10);xx=60 if r2>r1 else 40; slope=(r2-r1)/(xx-50)
 line(sc,'S',50,r1,slope,'secondary');line(sc,'D₁',50,r1,-slope);line(sc,'D₂',xx,r2,-slope,'tertiary');mark(sc,'E₁',50,r1,'Q₁',str(r1));mark(sc,'E₂',xx,r2,'Q₂',str(r2))
 if id==20:AUTHORED[('5-5',id)]=[sc]
 else:AUTHORED[('5-5',id)][0]=sc
for path in ROOT.glob('*.json'):
 if path.stem=='manifest':continue
 bank=json.loads(path.read_text())
 for q in bank:
  if (path.stem,q['id']) in AUTHORED:q['graphScenes']=AUTHORED[(path.stem,q['id'])]
 path.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
for i,p in enumerate(AUTHORED[('5-6',61)][0]['points']):p['id']='observation-'+str(i)
for sc,initial,shift in [(AUTHORED[('6-6',87)][0],65,20),(AUTHORED[('6-6',87)][1],35,-20)]:
 sc['yMax']=100;sc['curves']=[];line(sc,'D₁',50,initial,-1);line(sc,'S₁',50,initial,1,'secondary');line(sc,'S₂',50+shift,initial,1,'tertiary');sc['points']=[pt('E₁',50,initial),pt('E₂',50+shift/2,initial-shift/2)];sc['guides']=[g('one',50,initial,'Q₁','r₁'),g('two',50+shift/2,initial-shift/2,'Q₂','r₂')]
for path in ROOT.glob('*.json'):
 if path.stem=='manifest':continue
 bank=json.loads(path.read_text())
 for q in bank:
  if (path.stem,q['id']) in AUTHORED:q['graphScenes']=AUTHORED[(path.stem,q['id'])]
 path.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
# Final reconciliation uses question wording as well as the figure transcripts.
sc=scene('Real GDP (trillions)','Price level',30,200);line(sc,'AD',15,110,-20/3);mark(sc,'A',18,90,'18','90');mark(sc,'B',15,110,'15','110');AUTHORED[('3-1',63)]=[sc]
sc=scene('Real GDP','Price level',100,180);line(sc,'AD',30,120,-1);mark(sc,'A',30,120,'Y_A','120');mark(sc,'B',45,105,'Y_B','105');AUTHORED[('3-1',35)]=[sc]
for gg in AUTHORED[('1-6',40)][0]['guides']:
 if gg['id']=='E₁':gg['yLabel']='P*';gg['xLabel']='Q*'
 elif gg.get('yLabel'):gg['yLabel']='P₁'
for key,panels in AUTHORED.items():
 if key[0]=='4-5':
  sc=panels[0]
  for pp in sc['points']:
   if pp['label']=='E₁':pp['label']='E'
  for gg in sc['guides']:
   if gg['id']=='E₁':gg['yLabel']=gg.get('yLabel','').replace('i₁','rE')
  if key[1]==32:
   sc['guides']=[gg for gg in sc['guides'] if gg['id'] not in ['r₂','r₂s']];sc['guides'][0]['yLabel']='r₂'
  if key[1]==36:mark(sc,'A',50,70,None,'rA')
  if key[1]==18:sc['guides']=[g('h',30,70,'QH','rH'),g('l',70,30,'QL','rL')]
  if key[1] in [28,57]:sc['guides'].append(g('supply-at-probe',800 if key[1]==28 else 850,8 if key[1]==28 else 9))
  if key[1]==24:sc['guides'].append(g('other-point',500,7,'500','7'))
 if key in [('4-7',12),('4-7',13)]:
  sc=panels[0];sc['points'][0]['label']='E';sc['guides'][0]['yLabel']='rE';sc['guides'][1]['yLabel']='rH' if key[1]==12 else 'rL'
 if key[0]=='5-6' and key[1] in [19,42,57,81,82]:
  for cc in panels[0]['curves']:cc['label']=cc['label'].replace('APF','F')
 if key[0]=='6-3':
  for cc in panels[0]['curves']:cc['label']=cc['label'].replace('D₁','D').replace('S₁','S')
for id,probe in [(38,72),(62,28),(99,72)]:
 base,quote,rate,_,_=fxspec[id];sc=fx(base,quote,rate=rate,probe=probe);sc['curves'][0]['label']='D';sc['curves'][1]['label']='S';sc['points'][0]['label']='E₀';sc['guides'][0]['xLabel']='Qe';sc['guides'][1]['xLabel']='28' if probe>50 else '72';sc['guides'][2]['xLabel']='72' if probe>50 else '28';AUTHORED[('6-3',id)]=[sc]
sc=timechart([('Real GDP per capita',[(1,40000),(2,44000)])],y='Real GDP per capita');mark(sc,'A',1,40000);mark(sc,'B',2,44000);AUTHORED[('5-6',4)]=[sc]
for id in [52,61,82,98]:
 panels=[]
 for yf,p2 in [(60,110),(70,90)]:
  sc=scene('Real GDP','Price level',100,150);line(sc,'AD₁',50,100,-1);line(sc,'AD₂',yf,p2,-1,'secondary');vertical(sc,'LRAS₁',50);vertical(sc,'LRAS₂',yf,'muted');mark(sc,'E₁',50,100,'Yf₁','PL₁');mark(sc,'E₂',yf,p2,'Yf₂','PL₂');sc['caption']='Possible higher long-run price' if p2>100 else 'Possible lower long-run price';panels.append(sc)
 AUTHORED[('5-7',id)]=panels
for id,d in [(58,20),(59,-20)]:
 sc=adas(d=d);sc['curves'][0]['label']='AD₀ = AD₂';sc['curves'][-1]['label']='AD₁';sc['points'][0]['label']='E₀ = E₂';sc['points'][1]['label']='E₁';sc['caption']='Final output and price level return to their initial levels'
 mm=money(supplyShift=-d);line(mm,'MD₁ (temporary)',50+d,50,-1,'tertiary');mm['curves'][0]['label']='MD₀ = MD₂';mm['points'][0]['label']='E₀';mm['points'][0]['id']='E₀';mm['points'][1]['label']='E₂';mm['points'][1]['id']='E₂';mark(mm,'E₁',50,50+d);mm['caption']='Temporary income effect reverses; money supply remains changed';AUTHORED[('5-1',id)]=[sc,mm]
for path in ROOT.glob('*.json'):
 if path.stem=='manifest':continue
 bank=json.loads(path.read_text())
 for q in bank:
  if (path.stem,q['id']) in AUTHORED:q['graphScenes']=AUTHORED[(path.stem,q['id'])]
 path.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
