"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { activities, type ActivitySlug } from "@/lib/work/activities";
import styles from "./work.module.css";

export function ActivityPage({ slug }: { slug: ActivitySlug }) {
  const activity = activities[slug];
  return <main className={styles.activityPage}><div className={styles.wrap}><Link className={styles.backLink} href="/work#work-resources">← Our Work</Link><p className={styles.eyebrow}>{activity.eyebrow}</p><h1>{activity.title}</h1><p className={styles.activityIntro}>{activity.introduction}</p><div className={styles.activityAlignment}>COURSE ALIGNMENT <span>{activity.alignment}</span></div><div className={styles.exerciseLayout}><article className={styles.exercise}><h2>The scenario</h2><p>{activity.scenario}</p><h2>Your tasks</h2><ol>{activity.questions.map(question=><li key={question}>{question}</li>)}</ol><div className={styles.activityWriting}><label htmlFor="activity-response">Your working notes</label><textarea id="activity-response" placeholder="Write your reasoning here before revealing the worked answers." rows={7}/><small>Your notes stay in this browser tab and are not submitted.</small></div><details className={styles.answerGuide}><summary>Reveal worked answers</summary><ol>{activity.answers.map(answer=><li key={answer}>{answer}</li>)}</ol></details></article><aside className={styles.teacherNote}><p className={styles.eyebrow}>FOR EDUCATORS</p><h2>Teaching note</h2><p>{activity.teacherNote}</p><Link href="/work#work-resources">Explore another activity <ArrowRight size={15}/></Link></aside></div></div></main>;
}
