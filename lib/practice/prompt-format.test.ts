import { describe, expect, it } from "vitest";
import { formatPrompt } from "./prompt-format";

describe("question data formatting", () => {
  it("renders an explicit pipe table with a single data row", () => {
    expect(formatPrompt("| Characteristic | YED | XED |\n| Target | negative | positive |")).toEqual([
      { kind: "table", header: ["Characteristic", "YED", "XED"], rows: [["Target", "negative", "positive"]] },
    ]);
  });
  it("renders a balance sheet without losing currency signs or empty cells", () => {
    expect(formatPrompt("Use this balance sheet.\n\n| Assets | Amount | Liabilities | Amount |\n| --- | --- | --- | --- |\n| Reserves | $55,000 | Deposits | $250,000 |\n| Loans | $195,000 | — | — |")).toEqual([
      { kind: "text", text: "Use this balance sheet." },
      { kind: "table", header: ["Assets", "Amount", "Liabilities", "Amount"], rows: [["Reserves", "$55,000", "Deposits", "$250,000"], ["Loans", "$195,000", "—", "—"]] },
    ]);
  });
  it("recognizes aligned numeric source tables and preserves the following question", () => {
    expect(formatPrompt("Year  Real GDP  CPI\n1  $15T  100\n2  $16T  110\n\nWhat changed?")).toEqual([
      { kind: "table", header: ["Year", "Real GDP", "CPI"], rows: [["1", "$15T", "100"], ["2", "$16T", "110"]] },
      { kind: "text", text: "What changed?" },
    ]);
  });
  it("keeps unknown amounts and blank-separated table rows", () => {
    expect(formatPrompt("| Account | Balance |\n\n| Current | ? |\n\n| Financial | $40 |\n\nFind the missing balance.")).toEqual([
      { kind: "table", header: ["Account", "Balance"], rows: [["Current", "?"], ["Financial", "$40"]] },
      { kind: "text", text: "Find the missing balance." },
    ]);
  });
  it("does not interpret prices or incidental spacing as a table", () => {
    expect(formatPrompt("A bond costs $100.  Its payment is $5.\nWhat is the yield?")).toEqual([
      { kind: "text", text: "A bond costs $100.  Its payment is $5.\nWhat is the yield?" },
    ]);
  });
});
