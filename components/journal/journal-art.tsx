export function JournalArt({ kind, caption }: { kind: string; caption: string }) {
  return <div className={`journal-art journal-${kind}`} aria-hidden="true"><span className="journal-shape a"/><span className="journal-shape b"/><span className="journal-shape c"/><span className="journal-shape d"/><div className="journal-art-caption">{caption}</div></div>;
}
