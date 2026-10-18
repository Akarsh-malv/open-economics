"""Complete Unit 1 with the official Micro topic sequence.
Shared Macro material is copied; new 1.2/1.5 questions use reviewed scenarios.
"""
import json,random
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];DEST=ROOT/'lib/practice/micro-topics'
def question(prompt,correct,false,exp,ref,difficulty='Easy'):
 assert len(false)==4 and len(set([correct]+false))==5
 return dict(prompt=prompt,correctText=correct,falseTexts=false,explanation=exp,reference=ref,difficulty=difficulty,graphRequired=False,graphDescription='')
def publish(slug,bank):
 assert len(bank)==100,(slug,len(bank))
 rng=random.Random('micro-reviewed-unit-one-'+slug);labels=list('ABCDE')*20
 while True:
  rng.shuffle(labels)
  if all(len(set(labels[i:i+4]))>1 for i in range(97)):break
 for i,(q,label) in enumerate(zip(bank,labels),1):
  correct=q.pop('correctText');false=q.pop('falseTexts');rng.shuffle(false);q.update(id=i,answer=label,options=[dict(label=l,text=correct if l==label else false.pop()) for l in 'ABCDE'])
 (DEST/f'{slug}.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
# Resource allocation: the institutional arrangement and coordinating mechanism
# are separate features. Scenarios below specify both when classifying a system.
b=[]
def add(p,c,f,e):b.append(question(p,c,f,e,'MKT-1.B.1 | MKT-1.B.2'))
items=[
('Every economic system must decide','What, how, and for whom to produce',['Only how much money to print','Only which currency to adopt','Whether all wants can be satisfied','How to eliminate all trade-offs'],'Scarcity requires decisions about output, production methods, and distribution.'),
('The question “what to produce” concerns','The composition of output',['The ownership of each consumer’s income','The technique used on a production line','The identity of the final purchasers','The method of calculating inflation'],'It asks which goods and services receive scarce resources.'),
('Selecting automated equipment rather than more workers primarily answers','How to produce goods',['Who consumes the goods','Which goods are demanded','Whether resources are scarce','What the population size is'],'Production methods determine how inputs are combined.'),
('A rule assigning housing to eligible families primarily addresses','Who receives the output',['How houses are constructed','Which materials are used','Whether labor is a resource','How productivity is measured'],'Distribution determines who consumes produced goods.'),
('In a pure market model, production is coordinated mainly through','Prices and voluntary exchanges',['Mandatory central output targets','Equal division of all resources','A single national production order','The absence of consumer preferences'],'Prices connect decentralized buyers and sellers.'),
('In a command model, major output decisions are made mainly by','A central planning authority',['Independent consumers acting alone','Competing private sellers alone','A random daily lottery','Owners without a coordinating rule'],'Central planning directs the allocation of resources.'),
('A mixed economy combines','Market decisions and government roles',['Unlimited resources and finite wants','Only central commands and no markets','Only barter and no production','Equal incomes and zero opportunity cost'],'Markets and public institutions both influence allocation.'),
('Private property rights influence allocation because they establish','Who controls and may exchange resources',['That every resource is unlimited','That all goods have identical costs','That consumer wants are identical','That production needs no labor'],'Ownership rules are part of an economy’s institutional arrangements.'),
('A coordinating mechanism is the way an economy','Connects production and consumption decisions',['Counts only its population','Defines land as a resource','Measures only past weather','Creates unlimited productive capacity'],'Prices or planning connect otherwise separate allocation decisions.'),
('Which pair distinguishes institutions from coordination?','Property rights; the price mechanism',['Population size; average age','Rainfall; climate temperature','Total output; total consumption','Birth rates; migration rates'],'Ownership arrangements specify rights; prices coordinate choices.'),
('A government’s presence in an economy establishes that','Its policies can influence allocation',['All production must be centrally planned','Every firm must be publicly owned','All market prices must be abolished','Scarcity must have disappeared'],'Public policy can coexist with market coordination.'),
('An economy with central planning still faces','Scarce resources and competing uses',['Unlimited labor and unlimited capital','No choices about production methods','No need to distribute its output','No trade-offs among public projects'],'Changing institutions does not remove scarcity.'),
('A market system with abundant income still requires allocation because','Resources have alternative uses',['Money eliminates all opportunity costs','Every consumer values goods equally','All production is costless','Only poor societies face scarcity'],'Resources remain finite relative to wants.'),
('A tax changes private incentives in an economy with private firms. This illustrates','Government influence within a mixed system',['The elimination of every market','The absence of any scarcity','Only random resource allocation','The disappearance of private decisions'],'Taxes can affect decentralized decisions without replacing all markets.'),
('Changing ownership rules while keeping markets changes mainly','An institutional arrangement',['The definition of scarcity','The number of basic economic questions','The physical laws of production','The existence of opportunity cost'],'Ownership is an institution rather than a physical production constraint.'),
('Replacing voluntary market exchange with centrally assigned production changes','The coordinating mechanism',['Only the weather forecast','Only the measurement units','The scarcity of every resource to zero','Consumer wants to identical values'],'Central directives replace decentralized exchange as the decision link.'),
('An output target for more food rather than clothing answers','What goods to produce',['How to combine workers and machines','Who receives each finished item','Whether land is productive','How to count financial assets'],'The choice concerns the mix of goods produced.'),
('A delivery service choosing bicycles instead of vans answers','How services are produced',['Who owns its customers’ income','Which final customers receive every package','Whether services create utility','How national inflation is calculated'],'Transportation equipment is part of the production method.'),
('Allocating school places by residence rather than payment changes','Who receives the service',['How many teachers teach each lesson','Which textbooks printers produce','Whether education uses resources','Whether households have wants'],'Eligibility changes the distribution of school services.'),
('Which claim about market and command systems is accurate?','Both require choices under scarcity',['Only markets must distribute output','Only planning has opportunity costs','Neither chooses production techniques','Both guarantee equal incomes'],'All systems must answer the basic allocation questions.'),
('Decentralized decision-making means','Choices are made by many separate agents',['One authority assigns every output','No production decisions are necessary','All households own identical resources','Every outcome is selected by lottery'],'Households and firms can make separate choices connected through markets.'),
('A public hospital and competing private clinics can coexist in','A mixed economy',['An economy without allocation','A system without scarce labor','A society without opportunity cost','A model with no government involvement'],'Public provision and private markets can operate together.'),
('A firm responds to customers’ willingness to pay by changing its product mix. The relevant signal is','Market prices and potential revenue',['A binding national output command','Equal income for every buyer','A fixed population growth target','The number of past tax forms'],'Prices and sales incentives transmit consumer preferences.'),
('A planner decides which factories receive steel. The allocation is coordinated by','Administrative production decisions',['Voluntary bids by every purchaser','The disappearance of material scarcity','Equal prices on every finished good','Consumers’ independent purchase contracts'],'The authority directly assigns the scarce input.'),
('Markets cannot answer “for whom” without considering','Purchasing power and willingness to pay',['Only the size of public buildings','Only historical production targets','Only the weight of each product','Only the number of suppliers'],'Demand and incomes affect who purchases market output.'),
('Two societies have the same resources but different ownership and decision rules. They may have','Different allocations of those resources',['Identical allocations in every sector','No opportunity costs in either society','No need to select production methods','Unlimited output in both societies'],'Institutions and coordination can produce different allocations from the same resources.'),
('A system is called mixed because','Public and private decisions both play roles',['Each person receives the same wage','All industries produce two products','Resources cease to be scarce','Every firm has two owners'],'The term concerns economic institutions, not equal incomes or product counts.'),
('A market-oriented reform allows firms to select their own suppliers. It increases','Decentralized control over input choices',['The central assignment of every input','The physical quantity of every resource','The equality of all household income','The number of basic allocation questions'],'Supplier choice moves an input decision toward independent agents.'),
('A national plan mandates each factory’s output. Which decision is least decentralized?','The factory’s planned production quantity',['A household’s unregulated leisure choice','A buyer’s permitted choice between colors','A worker’s voluntary hobby selection','A resident’s personal reading preference'],'The production quantity is assigned by the plan rather than independently chosen.'),
('An economy can alter distribution without changing every production technique by changing','Eligibility and transfer rules',['Only the laws of physics','Only each machine’s design','Only the chemistry of inputs','Only the shape of all land'],'Distribution rules can change recipients independently of production technology.'),
('A public agency buys goods from competing private firms. Which conclusion follows?','Public decisions can use market exchange',['All private ownership has ended','Every price is a central production command','The economy no longer faces scarcity','Only barter can coordinate the purchases'],'Public procurement can combine a government buyer with private market suppliers.'),
('Which is an example of an institution rather than a resource?','A legally enforced ownership rule',['A machine used in production','An hour of labor supplied','A plot of fertile land','A stock of production materials'],'Rules governing ownership are institutions; labor, land, and equipment are resources.'),
('An allocation rule that lets buyers outbid one another relies on','Willingness and ability to pay',['Equal assignments to all people','Unchangeable production quotas','The absence of scarce output','A ban on every voluntary exchange'],'Bidding is a price-based rationing mechanism.'),
('A centrally planned economy must obtain information about','Resources, production methods, and needs',['Only the color of its currency','Only its oldest factories','Only household birthdays','Only the number of road signs'],'Planning also requires information needed to choose output and allocate inputs.'),
('The basic question “how to produce” remains relevant when','Output is supplied by a public agency',['Only private firms own machines','Only consumers pay market prices','Only exports are produced','Scarcity has completely disappeared'],'Public and private producers both choose input combinations.'),
('Why does an economic-system label not prove equal consumption?','Distribution also depends on specific institutions',['Every system guarantees identical consumption','Planning necessarily abolishes all income differences','Markets require everyone to buy equal amounts','Mixed economies prohibit transfers'],'A system label alone does not establish a particular distribution.'),
('A government sets safety standards while firms choose output and prices. This shows','Regulation can coexist with markets',['Every quantity is centrally assigned','Private decisions have entirely ended','All resources are publicly owned','Consumer preferences no longer matter'],'Regulation influences market choices without necessarily replacing their coordination.'),
('Allowing residents to own and lease workshops changes','Property rights over productive resources',['The number of basic economic questions','The existence of scarcity','The definition of total utility','The physical lifetime of every building'],'Ownership and leasing rights are institutional arrangements.'),
('A country privatizes factories but keeps mandatory output quotas. Which distinction matters?','Ownership and coordination can change separately',['Private ownership always removes every quota','All quotas eliminate scarcity','Ownership is identical to production technology','Public ownership guarantees unlimited output'],'Private ownership does not by itself establish decentralized output decisions.'),
('Changing an economy’s allocation rules can','Change how scarce resources are distributed',['Ensure that every want is fully satisfied','Remove every opportunity cost','Make every productive resource unlimited','End all choices about production'],'Institutions affect allocation; scarcity and the need to make choices remain.')]
for args in items:add(*args)
# Thirty distinct decisions; classification and allocation-question interpretation
# require different aspects of each scenario rather than cosmetic paraphrasing.
cases=[
('Independent bakeries choose bread varieties in response to customers’ purchases.','A market economy','What to produce'),
('Competing furniture makers select machines to minimize their production expenses.','A market economy','How to produce'),
('Privately owned farms sell their harvest to buyers through voluntary bids.','A market economy','Who consumes output'),
('Private publishers select which books to print using anticipated sales.','A market economy','What to produce'),
('Private couriers independently choose bicycles or vans for deliveries.','A market economy','How to produce'),
('Private concert organizers sell limited tickets to willing purchasers.','A market economy','Who consumes output'),
('Independent studios fund films according to expected ticket sales.','A market economy','What to produce'),
('Private manufacturers choose labor-intensive or automated assembly.','A market economy','How to produce'),
('Privately owned hotels allocate rooms through freely agreed rental prices.','A market economy','Who consumes output'),
('Independent growers choose crop varieties using expected sales revenue.','A market economy','What to produce'),
('A national authority assigns state factories quotas for shoes and coats.','A command economy','What to produce'),
('A central plan requires state mills to use a specified production method.','A command economy','How to produce'),
('A central authority distributes publicly produced food through assigned rations.','A command economy','Who consumes output'),
('A planning ministry chooses the number of buses built by state factories.','A command economy','What to produce'),
('A central plan assigns worker and machine combinations to state workshops.','A command economy','How to produce'),
('A state planning office assigns apartments directly to designated residents.','A command economy','Who consumes output'),
('A central production bureau directs state plants to make medical equipment.','A command economy','What to produce'),
('State factories must follow a ministry’s specified steelmaking technique.','A command economy','How to produce'),
('A national plan assigns state-produced uniforms to specified recipients.','A command economy','Who consumes output'),
('A central office determines the mix of output in publicly owned mines.','A command economy','What to produce'),
('Private firms choose goods for sale while a public agency chooses hospital services.','A mixed economy','What to produce'),
('Private utilities choose equipment subject to publicly imposed operating rules.','A mixed economy','How to produce'),
('Private shops sell food while a public voucher program changes eligible households’ purchases.','A mixed economy','Who consumes output'),
('Private builders choose housing projects while a public authority commissions shelters.','A mixed economy','What to produce'),
('Private transport firms select vehicles within government safety requirements.','A mixed economy','How to produce'),
('Private colleges charge tuition while public grants fund qualifying students.','A mixed economy','Who consumes output'),
('Private clinics choose services while government hospitals provide other care.','A mixed economy','What to produce'),
('Private food processors choose machinery subject to public sanitation requirements.','A mixed economy','How to produce'),
('Private bus operators sell tickets while government subsidies fund eligible riders.','A mixed economy','Who consumes output'),
('Private energy firms choose their product mix while a public agency supplies emergency reserves.','A mixed economy','What to produce')]
for i,(case,system,basic) in enumerate(cases):
 options=['A market economy','A command economy','A mixed economy','No allocation system','A scarcity-free economy']
 b.append(question(case+' Which economic-system model best matches the described institutions?',system,[x for x in options if x!=system],{'A market economy':'Private agents coordinate through voluntary market decisions.','A command economy':'The planning authority directly controls the specified allocation.','A mixed economy':'Public institutions and private market decisions both influence allocation.'}[system],'MKT-1.B.2','Medium'))
 options=['What to produce','How to produce','Who consumes output','Measuring aggregate inflation','Estimating population growth']
 b.append(question(case+' Which basic allocation question is directly illustrated?',basic,[x for x in options if x!=basic],{'What to produce':'The decision determines which goods or services are supplied.','How to produce':'The decision determines the input combination or production method.','Who consumes output':'The decision affects who receives or purchases the goods or services.'}[basic],'MKT-1.B.1','Medium'))
publish('1-2',b)
# Cost-benefit analysis: include implicit alternatives as well as explicit payments.
b=[]
def add5(p,c,f,e):b.append(question(p,c,f,e,'CBA-1.A | CBA-1.B'))
items=[
('Economic opportunity cost is','The value of the best forgone alternative',['The sum of every rejected possibility','Only a purchase’s posted price','The total benefits of the chosen action','Always zero for unpaid activities'],'Opportunity cost measures the best alternative sacrificed, not all alternatives added together.'),
('An explicit cost involves','A monetary payment for resources',['Only the value of unpaid time','Only satisfaction from consumption','Only a forgone use of owned property','Only a past nonmonetary benefit'],'Explicit costs are direct payments.'),
('An implicit cost includes','Forgone income from an owned resource',['Only the amount printed on a receipt','Only a firm’s cash tax payment','Only a supplier’s invoiced fee','Only a customer’s cash expenditure'],'Using a resource internally can sacrifice earnings available elsewhere.'),
('A rational cost-benefit comparison considers','Both explicit and implicit costs',['Only costs requiring a receipt','Only the alternative with highest revenue','Only the number of rejected choices','Only costs equal across all choices'],'Economic costs include payments and forgone alternatives.'),
('Total net benefit equals','Total benefit minus total cost',['Total benefit plus total cost','Total cost divided by total benefit','Total benefit multiplied by total cost','Total cost minus total benefit'],'Subtract all relevant economic costs from benefits.'),
('The best feasible alternative has','The greatest total net benefit',['The greatest expenditure regardless of benefit','The smallest cost regardless of benefit','The highest revenue regardless of cost','The largest number of inputs used'],'Maximize benefits after subtracting relevant costs.'),
('The economic cost of using an owned building includes','The rental income sacrificed',['Only rent actually paid to a landlord','Only the building’s street number','Only revenue from finished products','Only the number of neighboring buildings'],'Using owned property can forgo its rental return.'),
('An unpaid activity can have a positive economic cost because','Time has valuable alternative uses',['Every unpaid activity has a cash fee','Only paid activities create utility','Unpaid time is always unlimited','All alternative activities must be worthless'],'The absence of a fee does not eliminate opportunity cost.'),
('If two alternatives have equal benefit, the better feasible choice has','Lower relevant economic cost',['Higher relevant economic cost','Higher spending on unrelated items','More rejected alternatives','A larger historical expenditure'],'With equal benefits, lower cost gives greater net benefit.'),
('A positive net benefit means that the action’s','Benefits exceed its economic costs',['Costs exceed all its benefits','Benefits equal every alternative’s benefits','Opportunity cost is necessarily zero','Price equals the number of inputs'],'Net benefit is positive when benefit minus cost is positive.'),
('An all-or-nothing project should be evaluated using','Its total benefits and total costs',['Only its final unit’s price','Only the number of rejected projects','Only its average customer age','Only the cost of unrelated projects'],'Indivisible alternatives require comparison of whole-project net benefits.'),
('Choosing the highest-revenue project can fail because','Its costs may outweigh the revenue gain',['Revenue and costs are always identical','Economic costs exclude input payments','All projects have equal implicit costs','Revenue is never a benefit to firms'],'Different costs can change which project has the greatest net benefit.'),
('The value of time spent waiting is','An opportunity cost if other uses are valuable',['Always zero because no money changes hands','Always equal to the purchase price','Always larger than all cash expenses','Excluded from every rational decision'],'Waiting can forgo work, leisure, or other benefits.'),
('The opportunity cost of a choice among three mutually exclusive options uses','The best of the two rejected options',['Both rejected options added together','The least valuable rejected option','Only the chosen option’s gross benefit','The average value of all three options'],'Only one rejected alternative could have been selected instead.'),
('In consumer analysis, total benefit is represented by','Utility from consumption',['Total cash spending alone','Only the number of suppliers','The consumer’s wage payment to a firm','Only the good’s production cost'],'Utility describes satisfaction rather than expenditure.'),
('In a firm’s cost-benefit comparison, sales generate','Revenue as a benefit',['Opportunity cost as the only benefit','No benefits if inputs are owned','Utility measured only in consumer units','A reduction in every implicit cost'],'Revenue is the monetary benefit of selling output.'),
('Two choices with equal cash payments can have different economic costs because','Their forgone alternatives may differ',['Implicit costs must be identical','Economic costs are only cash payments','Their benefits must be equal','Opportunity costs cannot be compared'],'The value of time or owned resources sacrificed may differ.'),
('A project with larger total benefit is not necessarily preferred when','It also has sufficiently higher costs',['Its costs are lower than every rival’s','Its benefit exceeds its costs by more','Its net benefit is greatest','It uses fewer resources at equal benefit'],'Greater gross benefit alone does not establish greater net benefit.'),
('A scarce hour can be used for work or recreation. Choosing work sacrifices','The recreation opportunity',['Every future recreation activity','Only income earned from work','No benefit because leisure is unpaid','All activities done on earlier days'],'The forgone use of the hour is the relevant alternative.'),
('When comparing feasible options, economic costs should be','Measured consistently across alternatives',['Counted twice for the chosen alternative','Ignored for owned resources','Summed across incompatible alternatives','Restricted to costs equal across options'],'Consistent valuation allows meaningful net-benefit comparisons.')]
for args in items:add5(*args)
contexts=['a workshop','a weekend course','a delivery job','a garden project','a repair service','a school event','a design contract','a training program','a market stall','a tutoring job']
for i,context in enumerate(contexts):
 fee=18+3*i;hours=2+i%3;wage=11+i;foregone=hours*wage;benefit=fee+foregone+22+i
 # Four distinct calculations from each context; no dependence on another item.
 tasks=[
 (f'To undertake {context}, a person pays ${fee} and gives up {hours} hours of work paying ${wage} per hour. What is the total economic cost?',fee+foregone,[fee,foregone,fee+foregone+wage,fee+hours],f'The fee is ${fee}; forgone wages are {hours} × ${wage} = ${foregone}. Total economic cost is ${fee+foregone}.'),
 (f'Taking {context} requires {hours} hours that could earn ${wage} per hour. What is the implicit cost of those hours?',foregone,[wage,hours+wage,foregone+wage,foregone+fee],f'The alternative work earns {hours} × ${wage} = ${foregone}.'),
 (f'Benefits from {context} are worth ${benefit}. Cash costs are ${fee}, and implicit costs are ${foregone}. What is total net benefit?',benefit-fee-foregone,[benefit-fee,benefit-foregone,fee+foregone,benefit+fee+foregone],f'Subtract both costs: ${benefit} − ${fee} − ${foregone} = ${benefit-fee-foregone}.'),
 (f'{context.capitalize()} has explicit cost ${fee}, implicit cost ${foregone}, and benefit ${benefit}. At what benefit would its net benefit equal zero?',fee+foregone,[fee,foregone,benefit,benefit+fee],f'At benefit equal to total economic cost, ${fee+foregone}, net benefit is zero.')]
 for p,c,fs,e in tasks:
  fs=list(dict.fromkeys(fs));extra=1
  while len(fs)<4:
   v=c+7*extra;extra+=1
   if v!=c and v not in fs:fs.append(v)
  b.append(question(p,f'${c}',[f'${v}' for v in fs[:4]],e,'CBA-1.A.1 | CBA-1.B.1','Medium'))
# Twenty distinct feasible-choice tables; select a label rather than infer from answer length.
for i in range(20):
 values=[(70+i*4,31+i),(98+i*2,50+i*2),(65+i*3,19+i),(115+i,90+i),(83+i*2,35+i)]
 # The totals vary nonuniformly; ensure a unique optimum by checking the whole table.
 nets=[v-c for v,c in values];best=max(range(5),key=lambda j:nets[j])
 if nets.count(nets[best])>1:
  v,c=values[best];values[best]=(v+1,c);nets[best]+=1
 rows='| Option | Total benefit ($) | Total economic cost ($) |\n'+'\n'.join(f'| {chr(65+j)} | {v} | {c} |' for j,(v,c) in enumerate(values))
 kind=i%4
 if kind==0:p=f'A decision-maker evaluates five mutually exclusive proposals with the totals below. Which proposal provides the greatest net benefit?\n{rows}';correct=f'Proposal {chr(65+best)}';false=[f'Proposal {chr(65+j)}' for j in range(5) if j!=best];exp=f'Net benefits for A–E are {", ".join("$"+str(v) for v in nets)}. Proposal {chr(65+best)} is highest.'
 elif kind==1:
  j=(i+1)%5;p=f'Using this cost-benefit table, what is the net benefit of proposal {chr(65+j)}?\n{rows}';correct=f'${nets[j]}';false=[f'${x}' for x in [values[j][0],values[j][1],sum(values[j]),nets[j]+13]];exp=f'Benefit ${values[j][0]} minus economic cost ${values[j][1]} gives ${nets[j]}.'
 elif kind==2:
  j=(i+2)%5;k=(j+1)%5;gap=nets[j]-nets[k];p=f'What is proposal {chr(65+j)}’s net benefit minus proposal {chr(65+k)}’s net benefit?\n{rows}';correct=f'${gap}';false=[f'${x}' for x in [values[j][0]-values[k][0],values[j][1]-values[k][1],sum(nets[j:j+1])+nets[k],gap+11]];exp=f'The difference is ${nets[j]} − ${nets[k]} = ${gap}.'
 else:
  costgap=values[best][0]-nets[best];p=f'Proposal {chr(65+best)}’s benefit stays fixed. If its economic cost increases by $10, what is its new net benefit?\n{rows}';correct=f'${nets[best]-10}';false=[f'${x}' for x in [nets[best]+10,values[best][1]+10,values[best][0]-10,nets[best]]];exp=f'The additional cost lowers net benefit from ${nets[best]} to ${nets[best]-10}.'
 # Numerical distractors must be distinct even when totals coincidentally agree.
 false=list(dict.fromkeys(x for x in false if x!=correct));k=0
 while len(false)<4:
  k+=1;v=f'${int(correct[1:])+17*k}'
  if v not in false:false.append(v)
 b.append(question(p,correct,false,exp,'CBA-1.B.1','Hard'))
# Twenty harder comparisons explicitly include opportunity cost, constraints or
# indivisible projects rather than merely changing a number in a definition.
for i in range(10):
 rent=20+4*i;materials=18+2*i;rev=rent+materials+12+i
 p=f'A person can rent out owned equipment for ${rent}, or use it for a job earning ${rev} with materials costing ${materials}. The options are mutually exclusive. By how much does doing the job exceed renting in net benefit?'
 c=rev-materials-rent;b.append(question(p,f'${c}',[f'${v}' for v in [rev-materials,rev-rent,materials+rent,rev+rent]],f'Compared with renting, the job adds ${rev} but uses materials of ${materials} and forgoes rent of ${rent}; the advantage is ${c}.','CBA-1.A.1 | CBA-1.B.1','Hard'))
 second=45+i+(-1 if i%2==0 else 1)*(3+2*i)
 p=f'An indivisible project yields benefit ${95+3*i}, explicit cost ${30+i}, and implicit cost ${20+i}. A second feasible project has net benefit ${second}. Which choice gives greater net benefit?'
 nb=95+3*i-(30+i)-(20+i);adv=abs(nb-second)
 winner='first' if nb>second else 'second';loser='second' if winner=='first' else 'first'
 c=f'The {winner} project by ${adv}';fs=[f'The {loser} project by ${adv}',f'The {winner} project by ${nb+second}',f'The {loser} project by ${nb+second}','The projects give equal net benefit']
 b.append(question(p,c,fs,f'The first project’s net benefit is ${nb}; the second’s is ${second}. The {winner} exceeds the {loser} by ${adv}.','CBA-1.A.1 | CBA-1.B.1','Hard'))
publish('1-5',b)
# Reuse shared Macro banks and preserve their existing answer keys and figures.
for src,dst in [('1-1','1-1'),('1-2','1-3'),('1-3','1-4')]:
 data=json.loads((ROOT/f'lib/practice/topics/{src}.json').read_text())
 for q in data:q['reference']={'1-1':'MKT-1.A','1-3':'MKT-1.C','1-4':'MKT-2.A | MKT-2.B'}[dst]
 (DEST/f'{dst}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
manifest=json.loads((DEST/'manifest.json').read_text());manifest=[t for t in manifest if t['unit']!=1]
titles=['Scarcity','Resource Allocation and Economic Systems','Production Possibilities Curve','Comparative Advantage and Trade','Cost-Benefit Analysis','Marginal Analysis and Consumer Choice']
for i,title in enumerate(titles,1):
 bank=json.loads((DEST/f'1-{i}.json').read_text());manifest.append(dict(slug=f'1-{i}',number=f'1.{i}',unit=1,unitName='Basic Economic Concepts',title=title,count=len(bank),graphs=sum(q['graphRequired'] for q in bank)))
manifest.sort(key=lambda t:tuple(map(int,t['slug'].split('-'))));(DEST/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(DEST.parent/'micro-topic-imports.ts').write_text('export const microTopicImports = {\n'+''.join(f'  "{t["slug"]}": () => import("./micro-topics/{t["slug"]}.json"),\n' for t in manifest)+'} as const;\n')
print('Published six Unit 1 topics; total Micro questions',sum(t['count'] for t in manifest))
