"""Validate every bank and report wording cues; no third-party dependencies.

Run: python3 scripts/audit-practice.py
Length flags require editorial review; they do not establish answer correctness.
"""
import csv
import json
import re
import statistics
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "audit"


def words(text):
    return len(re.findall(r"\S+", text))


def normalize(text):
    # Preserve signs, decimal points, percentages, and arrows: −4 and +4
    # are distinct choices, as are 0.5 and 5.
    return re.sub(r"\s+", " ", text.casefold()).strip().rstrip(".")


def audit(course="ap-macro"):
    global DEST
    bank_dir = "alevel-topics" if course == "a-level" else "micro-topics" if course == "ap-micro" else "topics"
    DEST = ROOT / "audit" / "alevel" if course == "a-level" else ROOT / "audit" / "micro" if course == "ap-micro" else ROOT / "audit"
    manifest = json.loads((ROOT / f"lib/practice/{bank_dir}/manifest.json").read_text())
    rows, summaries, errors = [], [], []
    for topic in manifest:
        slug = topic["slug"]
        bank = json.loads((ROOT / f"lib/practice/{bank_dir}/{slug}.json").read_text())
        if len(bank) != topic["count"]:
            errors.append(f"{slug}: manifest count mismatch")
        if [q["id"] for q in bank] != list(range(1, len(bank) + 1)):
            errors.append(f"{slug}: missing or duplicate IDs")
        correct_lengths, other_lengths, topic_rows = [], [], []
        for q in bank:
            location = f"{slug}/{q['id']}"
            options = q["options"]
            if [o["label"] for o in options] != list("ABCD" if course == "a-level" else "ABCDE"):
                errors.append(f"{location}: invalid option labels")
                continue
            if q["answer"] not in list("ABCD" if course == "a-level" else "ABCDE"):
                errors.append(f"{location}: invalid answer")
                continue
            if not all(q.get(field, "").strip() for field in ["prompt", "explanation", "reference"]):
                errors.append(f"{location}: missing content")
            if q["difficulty"] not in ["Easy", "Medium", "Hard"]:
                errors.append(f"{location}: invalid difficulty")
            if any(not o["text"].strip() for o in options):
                errors.append(f"{location}: empty choice")
            if len({normalize(o["text"]) for o in options}) != (4 if course == "a-level" else 5):
                errors.append(f"{location}: duplicate choices")
            chosen = next(o for o in options if o["label"] == q["answer"])
            others = [o for o in options if o != chosen]
            size, lengths = words(chosen["text"]), [words(o["text"]) for o in others]
            median = statistics.median(lengths)
            flags = []
            if size > max(lengths): flags.append("correct_unique_longest")
            if size < min(lengths): flags.append("correct_unique_shortest")
            if size >= 2 * max(1, median) and size > 15: flags.append("correct_length_outlier")
            if size * 2 <= median and median > 10: flags.append("correct_short_outlier")
            if any(words(o["text"]) > 40 for o in options): flags.append("verbose_choice")
            if any(re.search(r"(?:Wait\s*[—−-]|let me recalculate|let's check|\?\?\?)", o["text"], re.I) for o in options):
                errors.append(f"{location}: drafting text in choices")
            row = dict(topic=slug, question=q["id"], answer=q["answer"], correct_words=size,
                       distractor_median=median, difficulty=q["difficulty"], flags=";".join(flags))
            for metric, measure in [("words", words), ("characters", len)]:
                sizes = [measure(o["text"]) for o in options]
                correct_size = measure(chosen["text"])
                for direction, extreme in [("longest", max(sizes)), ("shortest", min(sizes))]:
                    row[f"{metric}_{direction}_unique"] = sizes.count(extreme) == 1
                    row[f"{metric}_{direction}_unique_correct"] = sizes.count(extreme) == 1 and correct_size == extreme
                    row[f"{metric}_{direction}_guess"] = (1 / sizes.count(extreme)) if correct_size == extreme else 0
            rows.append(row); topic_rows.append(row)
            correct_lengths.append(size); other_lengths.extend(lengths)
        summary = dict(topic=slug, count=len(bank), answer_distribution=dict(Counter(q["answer"] for q in bank)),
                       correct_mean=round(statistics.mean(correct_lengths), 2),
                       distractor_mean=round(statistics.mean(other_lengths), 2),
                       unique_longest=sum("correct_unique_longest" in row["flags"] for row in topic_rows),
                       unique_shortest=sum("correct_unique_shortest" in row["flags"] for row in topic_rows),
                       verbose_questions=sum("verbose_choice" in row["flags"] for row in topic_rows))
        for metric in ["words", "characters"]:
            for direction in ["longest", "shortest"]:
                field = f"{metric}_{direction}_guess"
                unique_rows = [r for r in topic_rows if r[f"{metric}_{direction}_unique"]]
                summary[f"{metric}_{direction}_unique_questions"] = len(unique_rows)
                summary[f"{metric}_{direction}_conditional_percent"] = round(100 * sum(r[f"{metric}_{direction}_unique_correct"] for r in unique_rows) / len(unique_rows), 2) if unique_rows else None
                summary[field + "_percent"] = round(100 * sum(r[field] for r in topic_rows) / len(topic_rows), 2)
        summary["length_pattern_review"] = any(
            summary[f"{metric}_{direction}_guess_percent"] > (15 if course == "a-level" and direction == "longest" else 35)
            for metric in ["words", "characters"] for direction in ["longest", "shortest"])
        summaries.append(summary)
    DEST.mkdir(exist_ok=True)
    with (DEST / "question-option-audit.csv").open("w", newline="") as output:
        writer = csv.DictWriter(output, fieldnames=list(rows[0])); writer.writeheader(); writer.writerows(rows)
    overall = {}
    for metric in ["words", "characters"]:
        for direction in ["longest", "shortest"]:
            unique = [r for r in rows if r[f"{metric}_{direction}_unique"]]
            overall[f"{metric}_{direction}"] = dict(unique_questions=len(unique), correct_unique=sum(r[f"{metric}_{direction}_unique_correct"] for r in unique), conditional_percent=round(100*sum(r[f"{metric}_{direction}_unique_correct"] for r in unique)/len(unique),2) if unique else None, tie_aware_guess_percent=round(100*sum(r[f"{metric}_{direction}_guess"] for r in rows)/len(rows),2))
    result = dict(questions=len(rows), overall=overall, topics=summaries, errors=errors,
                  note="Structural checks cannot verify economics, semantic duplicates, or visual layout.")
    (DEST / "question-audit-results.json").write_text(json.dumps(result, indent=2) + "\n")
    print(f"{len(rows)} questions, {len(summaries)} topics, {len(errors)} structural errors")
    for error in errors: print(error)
    print("Topics requiring length-pattern review:", ", ".join(s["topic"] for s in summaries if s["length_pattern_review"]))
    return result


if __name__ == "__main__":
    import sys
    raise SystemExit(bool(audit("a-level" if "--alevel" in sys.argv else "ap-micro" if "--micro" in sys.argv else "ap-macro")["errors"]))
