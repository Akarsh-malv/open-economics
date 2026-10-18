export type PromptBlock =
  | { kind: "text"; text: string }
  | { kind: "table"; header: string[]; rows: string[][] };

/** Recognize source tables without interpreting money symbols as Markdown math. */
export function formatPrompt(text: string): PromptBlock[] {
  const lines = text.split(/\r?\n/);
  const blocks: PromptBlock[] = [];
  let prose: string[] = [];
  const flush = () => {
    const value = prose.join("\n").trim();
    if (value) blocks.push({ kind: "text", text: value });
    prose = [];
  };
  const cells = (line: string) => line.trim().replace(/^\||\|$/g, "")
    .split(line.includes("|") ? /\s*\|\s*/ : /\s{2,}/).map((cell) => cell.trim());
  for (let index = 0; index < lines.length; index++) {
    const header = cells(lines[index]);
    let nextIndex = index + 1;
    while (nextIndex < lines.length && !lines[nextIndex].trim()) nextIndex++;
    const next = lines[nextIndex];
    const pipeTable = lines[index].includes("|");
    const isSeparator = (line: string) => /^[\s|:\-]+$/.test(line) && line.includes("-");
    const looksLikeRow = (line: string) => cells(line).length === header.length && (pipeTable ? line.includes("|") : /\d/.test(line));
    if (header.length >= 2 && next && (isSeparator(next) || looksLikeRow(next))) {
      const rows: string[][] = [];
      let end = nextIndex;
      if (isSeparator(lines[end])) end++;
      while (end < lines.length) {
        if (looksLikeRow(lines[end])) rows.push(cells(lines[end++]));
        else if (!lines[end].trim() && lines[end + 1] && looksLikeRow(lines[end + 1])) end++;
        else break;
      }
      if (rows.length >= (pipeTable ? 1 : 2)) {
        flush();
        blocks.push({ kind: "table", header, rows });
        index = end - 1;
        continue;
      }
    }
    if (!lines[index].trim()) flush();
    else prose.push(lines[index]);
  }
  flush();
  return blocks;
}
