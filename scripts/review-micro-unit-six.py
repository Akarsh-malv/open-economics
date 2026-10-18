"""Replace filler-only duplicates with independently solvable applications.
Retain first occurrence and every existing figure. No external text is executed.
"""
import json,re,random,hashlib,zipfile
from pathlib import Path
R=Path(__file__).resolve().parents[1];D=R/'lib/practice/micro-topics';log=[]
def norm(p):
 p=' '.join(p.lower().split())
 p=re.sub(r'^assume (?:other relevant factors are unchanged|the stated relationship applies(?: [^.]+)?)\. ','',p)
 p=re.sub(r'^after accounting for the relevant economic conditions[^,]*, ','',p)
 return re.sub(r' (?:in market a|in a local economy|in a national market|for a representative good|under otherwise unchanged conditions)$','',p)
def number(v):return f'{v:.2f}'
def numeric(p,c,e,unit=''):
 # Equally formatted values remove answer-length signals without padding.
 delta=max(.02 if 0<abs(c)<1 else 1,abs(c)*.2);rank=int(hashlib.sha256(p.encode()).hexdigest()[:8],16)%5
 vals=[c+offset*delta for offset in range(-rank,5-rank) if offset!=0]
 return p,unit+number(c),[unit+number(v) for v in vals],e

def author(slug,k):
 f=k%10;n=k//10;a=50+10*n;b=10+2*n;h=4+n
 if slug=='6-1':
  if f==0:return numeric(f'Marginal social benefit is {a} − Q and marginal social cost is {b} + Q. What is the efficient quantity?',(a-b)/2,'Efficiency requires MSB = MSC. Solve 2Q = '+str(a-b)+'.')
  if f==1:return numeric(f'A unit provides social benefit ${a} and imposes social cost ${b}. What is the change in total surplus from producing it?',a-b,'The change is marginal social benefit minus marginal social cost.','$')
  if f==2:return numeric(f'MSB = {a} − 2Q and MSC = {b} + 2Q. At Q = {h}, by how much does MSB exceed MSC?',a-b-4*h,'Subtract MSC from MSB at the stated quantity.','$')
  if f==3:return numeric(f'Demand is P = {a} − Q and supply is P = {b} + Q, with no externalities. What is the competitive equilibrium price?',(a+b)/2,'Set quantity demanded equal to quantity supplied; the intersection price is the average of the intercepts.','$')
  if f==4:return numeric(f'The efficient quantity is {20+n}. Actual output is {12+n}. The gap between MSB and MSC at actual output is ${h}; it falls linearly to zero at efficient output. What is deadweight loss?',8*h/2,'The loss is a triangle: one-half times the quantity gap of 8 times the marginal-value gap.','$')
  if f==5:return numeric(f'The first {h} units each generate social benefit $18 and social cost $12. What total surplus do these units create?',6*h,'Each unit contributes $6; multiply by the number of units.','$')
  if f==6:return numeric(f'A market has consumer surplus ${a*3} and producer surplus ${b*4}, with no externalities. What is total economic surplus?',a*3+b*4,'With no external effects, total surplus equals consumer surplus plus producer surplus.','$')
  if f==7:return numeric(f'An extra unit has marginal social benefit ${b} and marginal social cost ${a}. By how much does this unit reduce total surplus?',a-b,'Producing a unit with MSC above MSB reduces surplus by MSC − MSB.','$')
  if f==8:return numeric(f'MSB = {a} − Q and MSC = {b} + Q. Production is currently {h} units. How many additional units reach the efficient quantity?',(a-b)/2-h,'Find MSB = MSC and subtract the current quantity.')
  return numeric(f'At efficient output, total social benefit is ${a*8} and total social cost is ${b*9}. What is net social benefit?',a*8-b*9,'Net social benefit is total social benefit minus total social cost.','$')
 if slug=='6-2':
  if f==0:return numeric(f'A firm has marginal private cost ${b} and marginal external cost ${h}. What is marginal social cost?',b+h,'MSC = MPC + marginal external cost.','$')
  if f==1:return numeric(f'Marginal private benefit from a vaccination is ${a}; its marginal external benefit is ${h}. What is marginal social benefit?',a+h,'MSB = MPB + marginal external benefit.','$')
  if f==2:return numeric(f'Each unit of output imposes constant external damage of ${h}. What per-unit corrective tax internalizes that damage?',h,'A corrective tax equals marginal external damage at efficient output.','$')
  if f==3:return numeric(f'Education provides a constant marginal external benefit of ${h} per unit. What per-unit corrective subsidy aligns private and social benefits?',h,'The corrective subsidy equals marginal external benefit at efficient output.','$')
  if f==4:return numeric(f'MPB = {a} − Q, MPC = {b} + Q, and constant marginal external cost is ${h}. What is the socially efficient quantity?',(a-b-h)/2,'Set MPB equal to MPC plus external cost; 2Q = '+str(a-b-h)+'.')
  if f==5:return numeric(f'MPB = {a} − Q, MPC = {b} + Q, and constant marginal external benefit is ${h}. What is the socially efficient quantity?',(a+h-b)/2,'Set MPB plus external benefit equal to MPC.')
  if f==6:return numeric(f'Each of {20+n} units imposes ${h} of external damage. What is total external cost?',(20+n)*h,'Multiply damage per unit by the number of units.','$')
  if f==7:return numeric(f'Private output exceeds efficient output by {h} units. The linear MSB–MSC gap reaches ${b} at private output. What is deadweight loss?',h*b/2,'The loss is one-half times the quantity gap times the marginal-value gap.','$')
  if f==8:return numeric(f'Two firms have marginal abatement costs ${b} and ${a}. Moving one unit of abatement from the higher-cost firm to the lower-cost firm leaves total emissions unchanged. What is the cost saving?',a-b,'The same abatement is achieved at the difference in marginal costs.','$')
  return numeric(f'A buyer values a unit at ${a}, its production costs ${b}, and it imposes external damage ${h}. What net social benefit does that unit generate?',a-b-h,'Subtract both private resource cost and external damage from the benefit.','$')
 if slug=='6-3':
  if f<6:
   prices=[6+n,9+2*n,12+n];q=2+n
   task=f%3
   if f<3:
    p=f'Three residents’ marginal willingness to pay for a public good at Q = {q} is ${prices[0]}, ${prices[1]}, and ${prices[2]}. '
    if task==0:return numeric(p+'What is marginal social benefit?',sum(prices),'For a nonrival public good, vertically add individual marginal willingness to pay.','$')
    if task==1:return numeric(p+f'Marginal cost is ${sum(prices)-h}. What is the net social gain from this unit?',h,'Sum the residents’ benefits and subtract marginal cost.','$')
    return numeric(p+f'The marginal social benefit target is ${sum(prices)+h}. How much additional willingness to pay would reach that target?',h,'The required increment is the target minus the sum of the three stated benefits.','$')
   quantities=[6+n,9+2*n,12+n]
   p=f'At a price of ${q}, three consumers demand {quantities[0]}, {quantities[1]}, and {quantities[2]} units of a rival private good. '
   if task==0:return numeric(p+'What is market quantity demanded?',sum(quantities),'For a private good, horizontally add quantities demanded at the same price.')
   if task==1:return numeric(p+'What is their combined expenditure?',sum(quantities)*q,'Sum their quantities and multiply by the common price.','$')
   return numeric(p+f'One additional consumer buys {h} units at this price. What is the new market quantity demanded?',sum(quantities)+h,'Market demand is the sum of all individual quantities at the given price.')
  scenarios=[
   (f'A flood barrier protects {100+20*n} nearby households. Extra protected households do not diminish existing protection, and households cannot be excluded.','A public good'),
   (f'A subscription stream has capacity for {100+20*n} viewers without congestion. Access requires a password, and another viewer does not reduce others’ viewing.','A club good'),
   (f'An open-access lake contains {100+20*n} fish. Anyone may enter; catching a fish leaves fewer fish for others.','A common resource'),
   (f'A bakery sells {100+20*n} loaves. Sellers can withhold unpaid loaves, and consuming a loaf prevents another person from consuming it.','A private good')]
  p,c=scenarios[f-6];labels=['A public good','A club good','A common resource','A private good','A financial asset']
  # Test a different property or transition in successive sets, not only names.
  if n%3==0:return p+' Which category describes this good?',c,[x for x in labels if x!=c],'Classify the good using the stated rivalry and excludability, not its ownership.'
  nonrival=f in (6,7);excludable=f in (7,9)
  if n%3==1:
   c='Nonrival and excludable' if nonrival and excludable else 'Nonrival and nonexcludable' if nonrival else 'Rival and excludable' if excludable else 'Rival and nonexcludable';ls=['Nonrival and excludable','Nonrival and nonexcludable','Rival and excludable','Rival and nonexcludable','Neither property is specified']
   return p+' Which pair of properties is specified?',c,[x for x in ls if x!=c],'Rivalry concerns effects on others’ consumption; excludability concerns preventing access.'
  if nonrival:
   c='Its consumption becomes rival';ls=[c,'It becomes less scarce','It becomes a private good automatically','Its access must become free','Its marginal cost must become zero']
   return p+' If congestion now reduces the service available to existing users, what property changes?',c,ls[1:],'Congestion creates rivalry; it does not by itself determine access restrictions.'
  if f==9:
   c='Its access becomes nonexcludable';return p+' If sellers can no longer prevent anyone from obtaining the good, what property changes?',c,['Its consumption becomes nonrival','All opportunity costs disappear','Its supply becomes unlimited','Its access becomes more restricted'],'Removing enforceable access restrictions removes excludability without eliminating rivalry.'
  c='Its access becomes excludable';ls=[c,'Its consumption becomes nonrival','All opportunity costs disappear','Its price must remain zero','Its supply becomes unlimited']
  return p+' If enforceable permits now prevent unlicensed users from obtaining the good, what property changes?',c,ls[1:],'Effective access restrictions create excludability without removing rivalry.'
 if slug=='6-4':
  if f==0:return numeric(f'A binding price ceiling sets rent at ${a}. At this rent, quantity demanded is {80+4*n} and quantity supplied is {50+2*n}. What is the shortage?',30+2*n,'Shortage equals quantity demanded minus quantity supplied.')
  if f==1:return numeric(f'A binding price floor sets price at ${a}. Quantity supplied is {80+4*n} and quantity demanded is {50+2*n}. What is the surplus?',30+2*n,'Surplus equals quantity supplied minus quantity demanded.')
  if f==2:return numeric(f'After a per-unit tax, buyers pay ${a} and sellers receive ${a-h}. What is the tax per unit?',h,'The tax wedge is buyer price minus seller price.','$')
  if f==3:return numeric(f'A per-unit tax is ${h}; {20+n} units are sold after the tax. What is government tax revenue?',h*(20+n),'Tax revenue equals the tax rate times the post-tax quantity.','$')
  if f==4:return numeric(f'A competitive market’s price was ${a}. After a tax, buyers pay ${a+3+n} and sellers receive ${a-2-n}. What is the sellers’ burden per unit?',2+n,'The sellers’ burden is the fall in their net receipt from the original equilibrium price.','$')
  if f==5:return numeric(f'A competitive market’s price was ${a}. After a tax, buyers pay ${a+3+n} and sellers receive ${a-2-n}. What is the buyers’ burden per unit?',3+n,'The buyers’ burden is the rise above the original equilibrium price.','$')
  if f==6:return numeric(f'A subsidy pays firms ${h} per unit for each of {20+n} units sold. What is government expenditure on the subsidy?',h*(20+n),'Multiply the subsidy per unit by the subsidized quantity.','$')
  if f==7:return numeric(f'A monopoly subject to average-cost pricing sells {20+n} units at P = ATC = ${a}. What is its economic profit?',0,'Profit is (P − ATC)Q; average-cost pricing produces zero economic profit.','$')
  if f==8:return numeric(f'A natural monopoly is required to charge P = MC = ${b}. At this output, ATC is ${b+h} and quantity is {20+n}. What subsidy covers its economic loss?',h*(20+n),'The loss is (ATC − P)Q; that amount covers its deficit.','$')
  return numeric(f'A tax reduces output by {h} units. The constant tax wedge is ${b}, and demand and supply are linear. What is deadweight loss?',h*b/2,'The loss triangle is one-half times the tax wedge times the output reduction.','$')
 if f==0:return numeric(f'The poorest 20% of households receive {4+n}% of income, and the next 20% receive {8+n}%. What cumulative income share belongs to the bottom 40%?',12+2*n,'Add the income shares of the first two groups.','')
 if f==1:return numeric(f'The bottom 80% of households receive {55+n}% of income. What percentage belongs to the top 20%?',45-n,'Income shares sum to 100%; subtract the bottom group’s share.')
 if f==2:return numeric(f'The area between the equality line and Lorenz curve is {0.1+.02*n:g}; total area beneath the equality line is 0.5. What is the Gini coefficient?',(.1+.02*n)/.5,'Divide the area between the curves by the total area beneath the equality line.')
 if f==3:return numeric(f'A Lorenz curve has Gini coefficient {0.2+.04*n:g}. The area beneath the equality line is 0.5. What is the area between the curve and equality line?',(.2+.04*n)*.5,'Multiply the Gini coefficient by the area beneath the equality line.')
 if f==4:return numeric(f'A household earns ${20000+1000*n} before tax and pays ${2000+300*n} in income taxes. What is after-tax income?',18000+700*n,'Subtract income taxes from pretax income.','$')
 if f==5:return numeric(f'A household earns ${20000+1000*n} before tax, pays ${2000+300*n} in tax, and receives a ${1000+200*n} transfer. What is disposable income?',19000+900*n,'Disposable income equals pretax income minus taxes plus transfers.','$')
 if f==6:return numeric(f'A household pays ${2000+500*n} of income tax on income of $25000. What is its average tax rate as a percentage?',(2000+500*n)/250,'Divide total tax by income and multiply by 100.')
 if f==7:return numeric(f'Tax liability increases by ${200+50*n} when income rises by $1000. What marginal tax rate applies to the extra income, as a percentage?',20+5*n,'Divide the change in taxes by the change in income and multiply by 100.')
 if f==8:return numeric(f'The poverty threshold is ${20000+1000*n}. A household has income ${18000+700*n}. What transfer would bring it exactly to the threshold?',2000+300*n,'Subtract household income from the threshold.','$')
 return numeric(f'An economy has {1000+100*n} households; {int((1000+100*n)*(10+2*n)/100)} fall below its poverty threshold. What is its poverty rate as a percentage?',10+2*n,'The poverty rate is households below the threshold divided by all households, times 100.')
for slug in ['6-1','6-2','6-3','6-4','6-5']:
 with zipfile.ZipFile(R/'audit/micro/unit-1/micro-before-unit-1-final-audit.zip') as baseline:
  bank=json.loads(baseline.read(f'{slug}.json'))
 seen=set();indices=[]
 for i,q in enumerate(bank):
  p=norm(q['prompt'])
  if p in seen:indices.append(i)
  else:seen.add(p)
 for k,i in enumerate(indices):
  old=bank[i];p,c,fs,e=author(slug,k);assert len(set([c]+fs))==5,(slug,k,c,fs)
  bank[i]=dict(id=old['id'],difficulty='Medium',prompt=p,options=[dict(label=l,text=t) for l,t in zip('ABCDE',[c]+fs)],answer='A',explanation=e,reference=old['reference'],graphRequired=False,graphDescription='')
  log.append(dict(topic=slug,id=old['id'],oldPrompt=old['prompt'],newPrompt=p,reason='Filler-only duplicate replaced by self-contained application'))
 rng=random.Random('micro-unit-six-reviewed-'+slug);labels=list('ABCDE')*20
 while True:
  rng.shuffle(labels)
  if all(len(set(labels[i:i+4]))>1 for i in range(97)):break
 for q,l in zip(bank,labels):
  c=next(o['text'] for o in q['options'] if o['label']==q['answer']);fs=[o['text'] for o in q['options'] if o['label']!=q['answer']];rng.shuffle(fs);q['answer']=l;q['options']=[dict(label=x,text=c if x==l else fs.pop()) for x in 'ABCDE']
 (D/f'{slug}.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
manifest=json.loads((D/'manifest.json').read_text())
for t in manifest:
 if t['unit']==6:t['revision']=5
(D/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(R/'audit/micro/unit-1/semantic-replacements.json').write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n')
print('Replaced',len(log),'filler-only duplicates')
