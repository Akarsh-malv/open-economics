import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { GraphCanvas } from "../components/graphs/graph-canvas";
import { QuestionText } from "../components/practice/question-text";
import type { PracticeQuestion } from "../lib/practice/types";
Object.assign(globalThis, { React });
const alevel = process.argv.includes("--alevel");
const micro = process.argv.includes("--micro");
const root = new URL(alevel ? "../lib/practice/alevel-topics/" : micro ? "../lib/practice/micro-topics/" : "../lib/practice/topics/", import.meta.url);
let html = "";
for (const file of readdirSync(root).filter((name) => /^\d+-\d+\.json$/.test(name)).sort()) {
  const slug = file.replace(".json", "");
  const bank = JSON.parse(readFileSync(new URL(file, root), "utf8")) as PracticeQuestion[];
  for (const question of bank.filter((item) => item.graphRequired)) {
    html += `<article id="${slug}-${question.id}"><h2>${slug} · Question ${question.id}</h2>`;
    html += renderToStaticMarkup(<QuestionText text={question.prompt} />);
    for (const [index, scene] of (question.graphScenes ?? []).entries()) {
      html += renderToStaticMarkup(<GraphCanvas scene={scene} graphId={`${slug}-${question.id}-${index}`} />);
    }
    html += "</article>";
  }
}
writeFileSync(new URL(alevel ? "../audit/alevel/figure-gallery.html" : micro ? "../audit/micro/figure-gallery.html" : "../audit/figure-gallery.html", import.meta.url), `<!doctype html><html lang="en"><meta charset="utf-8"><title>Practice figure audit</title><style>body{font:16px/1.6 Arial;color:#0b1f3a;margin:24px;background:#eef3f7}article{padding:24px;background:white;margin:24px auto;max-width:800px}svg{display:block;width:640px;height:464px;margin:20px auto}table{border-collapse:collapse}td,th{padding:8px;border:1px solid #ccc}</style><h1>${alevel ? "A-level" : micro ? "AP Micro" : "AP Macro"} question figures</h1>${html}</html>`);
