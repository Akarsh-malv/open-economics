import { describe, expect, it } from "vitest";
import utility from "./alevel-topics/7-1.json";
import costs from "./alevel-topics/7-6.json";
import capacity from "./alevel-topics/5-4.json";
import earnings from "./alevel-topics/8-3.json";
import money from "./alevel-topics/9-4.json";
import income from "./alevel-topics/4-1.json";
import intervention from "./alevel-topics/3-2.json";
import { formatPrompt } from "./prompt-format";

const key = (q: { answer: string; options: {label: string; text: string}[] }) => q.options.find(o => o.label === q.answer)!.text;

describe("A-level economic ambiguities identified in the supplied audit", () => {
  it("supports exactly one national-income comparison in question 90", () => {
    const q = income[89];
    const table = formatPrompt(q.prompt).find(block => block.kind === "table")!;
    if (table.kind !== "table") throw new Error("Missing national-income table");
    const values = Object.fromEntries(table.rows.map(([name, ...cells]) => {
      const [gdp, tax, subsidy, foreign, depreciation] = cells.map(Number);
      return [name, { "GDP at basic prices": gdp-tax+subsidy, depreciation, GNI: gdp+foreign, NNI: gdp+foreign-depreciation }];
    }));
    const supported = q.options.filter(option => {
      const [, economy, metric] = option.text.match(/^Economy ([KL]) has the higher (.+)\.$/)!;
      const other = economy === "K" ? "L" : "K";
      const measure = metric as keyof typeof values.K;
      return values[economy][measure] > values[other][measure];
    });
    expect(supported.map(option => option.label)).toEqual([q.answer]);
  });

  it("calculates the unique productivity winner from the restored table", () => {
    const q = capacity[87];
    const table = formatPrompt(q.prompt).find(block => block.kind === "table")!;
    if (table.kind !== "table") throw new Error("Missing productivity table");
    const growth = table.rows.map(([name, ...cells]) => {
      const [before, workersBefore, after, workersAfter] = cells.map(cell => Number(cell.replace(/\s/g,"")));
      return {name, change: (after/workersAfter)/(before/workersBefore)-1};
    });
    const maximum = Math.max(...growth.map(row => row.change));
    expect(growth.filter(row => Math.abs(row.change-maximum)<1e-10).map(row=>row.name)).toEqual(["C"]);
    expect(key(q)).toBe("Programme C");
  });

  it("draws buffer-stock intervention prices on their actual dollar scale", () => {
    const q = intervention[53];
    expect(q.graphScenes).toHaveLength(1);
    const scene = q.graphScenes![0];
    expect(scene.curves.find(curve=>curve.label==="PL")!.points.every(point=>point.y===18)).toBe(true);
    expect(scene.curves.find(curve=>curve.label==="PU")!.points.every(point=>point.y===26)).toBe(true);
    expect(scene.points.find(point=>point.label==="E")!.y).toBe(16);
    const supplied = scene.guides.find(guide=>guide.xLabel==="Qs")!.x;
    const demanded = scene.guides.find(guide=>guide.xLabel==="Qd")!.x;
    expect(supplied-demanded).toBe(10);
    expect(key(q)).toMatch(/^Buy/);
  });
  it("has a unique total-utility maximum rather than a zero-MU tie", () => {
    const q = utility[86];
    const schedule = q.prompt.match(/are ([\d,\s-]+)\./)![1].split(",").map(Number);
    let total = 0;
    const totals = schedule.map(mu => total += mu);
    const maxima = totals.flatMap((tu, i) => tu === Math.max(...totals) ? [i + 1] : []);
    expect(maxima).toEqual([6]);
    expect(key(q)).toMatch(/sixth/);
  });

  it("makes every utility bundle calculable and identifies the best listed bundle", () => {
    const q = utility[70];
    const schedules = [...q.prompt.matchAll(/(?:units of |utilities )([\d, ]+)\./g)].map(m => m[1].split(",").map(Number));
    expect(schedules).toHaveLength(2);
    const outcomes = q.options.map(o => {
      const [x, y] = [...o.text.matchAll(/(\d+) units? of [XY]/g)].map(m => Number(m[1]));
      expect(x).toBeLessThanOrEqual(schedules[0].length);
      expect(y).toBeLessThanOrEqual(schedules[1].length);
      expect(x * 4 + y * 2).toBeLessThanOrEqual(12);
      return schedules[0].slice(0,x).reduce((a,v)=>a+v,0) + schedules[1].slice(0,y).reduce((a,v)=>a+v,0);
    });
    expect(outcomes).toEqual([76,60,80,50]);
    expect(q.options[outcomes.indexOf(Math.max(...outcomes))].label).toBe(q.answer);
  });

  it.each([75,76])("maximises discrete profit from internally consistent marginal costs: question %i", id => {
    const q = costs[id-1];
    const mc = q.prompt.split("| Marginal cost ($) |")[1].split("|").filter(x=>x.trim()).map(Number);
    let cumulative = 0;
    const tvc = [0,...mc.map(cost => cumulative += cost)];
    expect(Math.min(...tvc.slice(1).map((v,i)=>v/(i+1)))).toBe(8);
    const price = Number(q.prompt.match(/market price of \$(\d+)/)![1]);
    const contributions = tvc.map((cost,output)=>price*output-cost);
    const optimum = contributions.flatMap((v,i)=>v===Math.max(...contributions)?[i]:[]);
    expect(optimum).toEqual(id===75?[4]:[0]);
    expect(Number(key(q).match(/\d+/)![0])).toBe(optimum[0]);
  });

  it("compounds productivity and effective-worker changes", () => {
    const q = capacity[85];
    const change = 100 * (1.06 * .92 - 1);
    expect(change).toBeCloseTo(-2.48,10);
    expect(key(q)).toBe("It falls by 2.48%.");
  });

  it("integrates transfer earnings below the linear labour supply curve", () => {
    const transfer = 10*100 + .5*(30-10)*100;
    const rent = 30*100-transfer;
    const q=earnings[91];
    expect(key(q)).toBe(`Transfer earnings $${transfer}; economic rent $${rent}`);
  });

  it("distinguishes an initial outside deposit from subsequent new loans", () => {
    const q=money[76];
    expect(q.prompt).toMatch(/outside cash deposit/i);
    const deposits=24/.08;
    expect(key(q)).toBe(`$${deposits} million deposits and $${deposits-24} million lending`);
  });
});
