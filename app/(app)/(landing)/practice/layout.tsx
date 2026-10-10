import type { ReactNode } from "react";
import "./practice.css";

export default function PracticeLayout({ children }: { children: ReactNode }) {
  return <div className="practice-shell">{children}</div>;
}
