import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GraphCanvas } from '@/components/graphs/graph-canvas';
import bank from './micro-topics/1-6.json';
import costs from './micro-topics/1-5.json';
import { microPracticeTopics } from './topics';
import type { Scene } from '@/lib/graphs/engine';
const answer = (q: typeof bank[number]) => q.options.find(o => o.label === q.answer)!.text;
describe('Micro Unit 1 economic regressions', () => {
 it('uses Micro standards rather than placing demand and supply in Unit 1', () => {
  expect(microPracticeTopics.filter(t => t.unit === 1).map(t => t.title)).toEqual(['Scarcity','Resource Allocation and Economic Systems','Production Possibilities Curve','Comparative Advantage and Trade','Cost-Benefit Analysis','Marginal Analysis and Consumer Choice']);
 });
 it.each(bank.slice(73,88))('enumerates every affordable bundle for question $id', q => {
  const [,initialBudget,initialPx,py] = q.prompt.match(/(?:has|income is) \$(\d+), Px=\$(\d+), and Py=\$(\d+)/)!;
  const budget=q.prompt.match(/income rises to \$(\d+)/)?.[1] ?? initialBudget;
  const px=q.prompt.match(/Px falls to \$(\d+)/)?.[1] ?? initialPx;
  const rows = q.prompt.split('\n').slice(2).map(row => row.split('|').slice(1,-1).map(s => s.trim()));
  const candidates: {x:number;y:number;utility:number}[] = [];
  for (const xrow of rows) for (const yrow of rows) {
   const [x,tx] = xrow, [y,,ty] = yrow;
   if (tx==='-' || ty==='-' || Number(x)*Number(px)+Number(y)*Number(py)>Number(budget))continue;
   candidates.push({x:Number(x),y:Number(y),utility:Number(tx)+Number(ty)});
  }
  const best = Math.max(...candidates.map(c => c.utility));
  const winners = candidates.filter(c => c.utility===best);
  expect(winners).toHaveLength(1);
  const quantities = answer(q).match(/\d+/g)!.map(Number);
  expect(quantities).toEqual([winners[0].x,winners[0].y]);
 });
 it.each(costs.filter(q => q.id>=82 && q.id%2===0))('compares whole project net benefits without ties: $id', q => {
  const nums = q.prompt.match(/\$\d+/g)!.map(s => Number(s.slice(1)));
  const first = nums[0]-nums[1]-nums[2],second=nums[3];
  expect(first).not.toBe(second);
  const chosen=q.options.find(o => o.label===q.answer)!.text;
  expect(chosen).toBe(`The ${first>second?'first':'second'} project by $${Math.abs(first-second)}`);
 });
 it('preserves negative marginal utility below the zero line', () => {
  const scene = bank[94].graphScenes![1] as Scene;
  expect(scene.yMin).toBeLessThan(0);
  expect(scene.curves[0].points.at(-1)!.y).toBe(-3);
  const html=renderToStaticMarkup(<GraphCanvas scene={scene} graphId="negative-mu-regression" />);
  expect(html).toContain('−3');
  expect(html).not.toMatch(/NaN|Infinity/);
 });
});
