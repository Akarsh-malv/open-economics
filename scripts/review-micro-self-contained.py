"""Reviewed corrections from the whole-Micro audit: missing data and tied optima."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'lib/practice/micro-topics'
banks={p.stem:json.loads(p.read_text()) for p in ROOT.glob('*.json') if p.stem!='manifest'}
def setprompt(slug,id,prompt):banks[slug][id-1]['prompt']=prompt
def tp(values):return '| Labor | Total product |\n'+'\n'.join(f'| {i} | {v} |' for i,v in enumerate(values))
setprompt('3-1',51,"A firm hires another worker and total product rises, but average product falls. The new worker's marginal product must be")
setprompt('3-1',73,'According to the production schedule, diminishing marginal returns begin with the\n'+tp([0,10,25,45,62,76,87,95]))
values=[0,10,24,42,58,70,78,82,80]
for id,prompt in [(81,'At which labor quantity is total product highest?'),(82,'What is the marginal product of the eighth worker?'),(83,'With which worker do diminishing marginal returns begin?')]:setprompt('3-1',id,prompt+'\n'+tp(values))
setprompt('3-3',95,'A firm has minimum LRATC of $7 at every output from 5,000 through 9,000 units. Which statement about 5,000 and 7,000 units is correct?')
setprompt('4-1',77,'At an output of 60 units, price is $32 and marginal cost is $20. What is the P − MC wedge?')
for id,prompt in {56:'A monopolist faces demand P = 40 − Q and produces 15 units. What price does it charge?',58:'A monopolist faces demand P = 60 − 3Q and produces 8 units. What price does it charge?',80:'Demand is P = 80 − Q. A monopolist produces 30 units. What is its price?',94:'A monopolist faces demand P = 100 − 2Q and produces 20 units. What is its price?',95:'A monopolist faces demand P = 100 − 2Q, produces 20 units, and has ATC = $35 at that output. What is economic profit?'}.items():setprompt('4-2',id,prompt)
schedule='| Wage | Quantity of labor demanded | Quantity of labor supplied |\n| $10 | 80 | 40 |\n| $30 | 40 | 80 |'
setprompt('5-1',78,'Using the schedule, what changes occur when the wage rises from $10 to $30?\n'+schedule)
setprompt('5-1',79,'Using the schedule, what changes occur when the wage falls from $30 to $10?\n'+schedule)
setprompt('5-4',31,'At a monopsonist’s profit-maximizing employment, the wage paid to workers is generally')
for id,prompt in {88:'A labor market has supply W = 10 + 2L and MRP = 50 − 4L. What employment equates MRP with the supply wage?',89:'Labor supply is W = 10 + 2L and MRP = 50 − 4L. What wage clears the competitive labor market?',90:'Labor supply is W = 10 + 2L, MFC = 10 + 4L, and MRP = 50 − 4L. By how much is monopsony employment below competitive employment?',91:'Labor supply is W = 10 + 2L, MFC = 10 + 4L, and MRP = 50 − 4L. By how much is the monopsony wage below the competitive wage?'}.items():setprompt('5-4',id,prompt)
# In discrete tables, a zero marginal gain creates more than one maximizing quantity.
# Ask for the largest maximizer rather than treating a smaller tied output as wrong.
for id in [34,37,41,42,45]:
 q=banks['3-5'][id-1];q['prompt']=q['prompt'].replace('What quantity maximizes profit?','What is the largest quantity that maximizes profit?')
 q['explanation']+=' The last included unit has MR = MC, so it leaves profit unchanged; this is the larger of the tied maximizing outputs.'
q=banks['5-3'][75];q['prompt']=q['prompt'].replace('how many workers maximize profit?','what is the largest number of workers that maximizes profit?');q['explanation']+=' Worker 5 adds revenue equal to the wage, so both 4 and 5 workers maximize profit; 5 is the larger maximizing employment.'
for slug,b in banks.items():(ROOT/f'{slug}.json').write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
print('Corrected missing data, conflicting production tables, and six discrete ties')
