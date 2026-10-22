import { Fragment, type CSSProperties } from "react";
import styles from "./manifesto.module.css";

/** Native CSS view timelines reveal words without scripts or animation libraries. */
export function RevealWords({ text, italicFrom }: { text: string; italicFrom?: number }) {
  const tokens = text.split(/(\s+)/);
  const count = tokens.filter(token => token && !/^\s+$/.test(token)).length;
  let index = 0;
  return <span className={styles.revealText}>{tokens.map((token, key) => {
    if (!token || /^\s+$/.test(token)) return <Fragment key={key}>{token}</Fragment>;
    const wordIndex = index++;
    const start = count > 1 ? wordIndex / (count - 1) * 50 : 0;
    return <span key={key} className={`${styles.word}${italicFrom !== undefined && wordIndex >= italicFrom ? ` ${styles.wordItalic}` : ""}`} style={{ "--word-from": `${start}%`, "--word-to": `${start + 45}%` } as CSSProperties}>{token}</span>;
  })}</span>;
}
