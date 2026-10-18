"""Balance answer positions without altering choice text or question IDs.

Already-balanced banks are left alone. A stable per-topic seed keeps edits
reproducible; explanations refer to concepts rather than choice letters.
"""
import json
import random
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LABELS = "ABCDE"


def balance():
    changes = []
    for path in sorted((ROOT / "lib/practice/topics").glob("*.json")):
        if path.stem == "manifest":
            continue
        questions = json.loads(path.read_text())
        target = {label: len(questions) // 5 for label in LABELS}
        if Counter(q["answer"] for q in questions) == target:
            continue
        if len(questions) % 5:
            raise ValueError(f"{path.stem}: bank size must be divisible by five")
        rng = random.Random(f"ap-macro-answer-positions-v4:{path.stem}")
        positions = list(LABELS) * (len(questions) // 5)
        while True:
            rng.shuffle(positions)
            if all(len(set(positions[i:i + 4])) > 1 for i in range(len(positions) - 3)):
                break
        for question, position in zip(questions, positions):
            original = question["answer"]
            correct = next(o["text"] for o in question["options"] if o["label"] == original)
            distractors = [o["text"] for o in question["options"] if o["label"] != original]
            rng.shuffle(distractors)
            texts = iter(distractors)
            question["options"] = [
                {"label": label, "text": correct if label == position else next(texts)}
                for label in LABELS
            ]
            question["answer"] = position
            changes.append({"topic": path.stem, "question": question["id"],
                            "before": original, "after": position})
        path.write_text(json.dumps(questions, ensure_ascii=False, indent=2) + "\n")
    (ROOT / "audit/answer-position-changes.json").write_text(
        json.dumps(changes, ensure_ascii=False, indent=2) + "\n")
    print(f"Balanced {len(changes)} questions; correct choice text preserved")


if __name__ == "__main__":
    balance()
