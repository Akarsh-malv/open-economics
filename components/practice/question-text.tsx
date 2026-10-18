import { formatPrompt } from "@/lib/practice/prompt-format";

export function QuestionText({ text }: { text: string }) {
  return formatPrompt(text).map((block, index) => block.kind === "table" ? (
    <div key={`${index}-${block.header.join("-")}`}>
    <div className="practice-data-scroll" tabIndex={0} role="region" aria-label="Question data table">
      <table className="practice-data-table">
        <thead><tr>{block.header.map((cell, column) => <th key={column} scope="col">{cell}</th>)}</tr></thead>
        <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>
          {row.map((cell, column) => column === 0
            ? <th key={column} scope="row">{cell}</th>
            : <td key={column}>{cell}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    <p className="practice-data-scroll-hint">Swipe horizontally if the table extends beyond the screen.</p>
    </div>
  ) : <p key={`${index}-${block.text.slice(0, 30)}`}>{block.text}</p>);
}
