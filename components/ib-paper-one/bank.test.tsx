import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { ibTopicData } from "@/lib/ib-paper-one/topic-data";
import { IbPaperOneBank } from "./bank";

vi.mock("./bank.module.css", () => ({ default: {} }));

afterEach(() => vi.unstubAllEnvs());

it("shows the grading submission control in production with instructions for empty answers", () => {
  vi.stubEnv("NODE_ENV", "production");
  const html = renderToStaticMarkup(
    <IbPaperOneBank topic={ibTopicData["1-1"]} slug="1-1" />,
  );
  const document = new DOMParser().parseFromString(html, "text/html");
  const button = Array.from(document.querySelectorAll("button")).find(
    (element) => element.textContent === "Submit for grading",
  );
  expect(button).toBeDefined();
  expect(button?.disabled).toBe(true);
  expect(document.body.textContent).toContain("Complete both parts to submit for grading.");
});
