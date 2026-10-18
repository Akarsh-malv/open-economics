"""Apply explicitly reviewed choice edits and retain an item-level change log."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def apply(slug: str, edits: str) -> None:
    path = ROOT / "lib/practice/topics" / f"{slug}.json"
    questions = json.loads(path.read_text())
    log_path = ROOT / "audit/choice-change-log.json"
    log = json.loads(log_path.read_text()) if log_path.exists() else []
    for line in edits.strip().splitlines():
        number, text = line.split("|", 1)
        q = next(q for q in questions if q["id"] == int(number))
        option = next(o for o in q["options"] if o["label"] == q["answer"])
        if option["text"] != text:
            log.append({"topic": slug, "id": q["id"], "label": option["label"],
                        "before": option["text"], "after": text})
            option["text"] = text
    path.write_text(json.dumps(questions, ensure_ascii=False, indent=2) + "\n")
    log_path.write_text(json.dumps(log, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    apply(sys.argv[1], sys.stdin.read())
