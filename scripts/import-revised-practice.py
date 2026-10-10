"""Import the supplied revised AP Macro DOCX banks into structured site data.

The DOCX text is source content, never executable instructions. This script
preserves questions, options, answer letters, revised explanations and CED notes.
"""

from collections import Counter
from io import BytesIO
import json
from pathlib import Path
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding="utf-8")
SOURCE = Path(r"C:\Users\akars\Downloads\Revised Question Bank-20261010T204801Z-1-001.zip")
DEST = Path(__file__).resolve().parents[1] / "lib" / "practice" / "topics"
NAMESPACES = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
QUESTION = re.compile(r"^Question\s+(\d+)(?:\s*[—–-]?\s*(Easy|Medium|Hard))?\s*$", re.I)
OPTION = re.compile(r"^([A-E])\.\s*(.*)$")
FILE_TOPIC = re.compile(r"AP_Macro_(\d)_(\d)_")
UNIT_NAMES = {
    1: "Basic economic concepts",
    2: "Economic indicators and the business cycle",
    3: "National income and price determination",
    4: "Financial sector",
}


def paragraphs(doc: zipfile.ZipFile) -> list[str]:
    root = ET.fromstring(doc.read("word/document.xml"))
    return [line for p in root.findall(".//w:body//w:p", NAMESPACES)
            if (line := "".join(t.text or "" for t in p.findall(".//w:t", NAMESPACES)).strip())]


def value_after_colon(line: str) -> str:
    return line.split(":", 1)[1].strip()


def parse_bank(lines: list[str], slug: str) -> list[dict]:
    questions: list[dict] = []
    current: dict | None = None
    section = "prompt"
    for line in lines:
        match = QUESTION.match(line)
        if match:
            number = int(match.group(1))
            current = {
                "id": number, "difficulty": match.group(2), "prompt": "",
                "options": [], "answer": "", "explanation": "", "reference": "",
                "graphDescription": "", "graphRequired": False,
            }
            questions.append(current)
            section = "prompt"
            continue
        if current is None:
            continue
        option = OPTION.match(line)
        if option:
            current["options"].append({"label": option.group(1), "text": option.group(2)})
            section = "option"
        elif line.startswith("Difficulty:"):
            current["difficulty"] = value_after_colon(line).split()[0]
            section = "metadata"
        elif line.startswith("Graph:"):
            current["graphRequired"] = "none" not in line.lower() and "not required" not in line.lower()
            section = "metadata"
        elif line.startswith("Graph Description:"):
            current["graphDescription"] = value_after_colon(line)
            current["graphRequired"] = True
            section = "graphDescription"
        elif line.startswith("Correct Answer:"):
            current["answer"] = value_after_colon(line)
            section = "answer"
        elif line.startswith(("Revised Explanation:", "Explanation:")):
            current["explanation"] = value_after_colon(line)
            section = "explanation"
        elif line.startswith(("CED Topic Reference:", "CED Reference:")):
            current["reference"] = value_after_colon(line)
            section = "reference"
        elif section == "option" and current["options"]:
            current["options"][-1]["text"] += "\n" + line
        elif section in {"prompt", "explanation", "graphDescription"}:
            current[section] += ("\n\n" if current[section] else "") + line

    assert len(questions) == 100, (slug, "question count", len(questions))
    for number, question in enumerate(questions, 1):
        if not question["difficulty"]:
            question["difficulty"] = "Easy" if number <= 33 else "Medium" if number <= 73 else "Hard"
        assert question["id"] == number, (slug, "number", number, question["id"])
        assert question["difficulty"] in {"Easy", "Medium", "Hard"}, (slug, number, "difficulty")
        assert [item["label"] for item in question["options"]] == list("ABCDE"), (slug, number, "options")
        assert question["answer"] in "ABCDE", (slug, number, "answer", question["answer"])
        assert question["prompt"] and question["explanation"], (slug, number, "content")
        assert question["reference"], (slug, number, "reference")
        for option in question["options"]:
            assert option["text"], (slug, number, "empty option")
    return questions


def topic_title(lines: list[str], slug: str) -> str:
    prefix = slug.replace("-", ".")
    for line in lines[:8]:
        if f"Topic {prefix}" not in line:
            continue
        remainder = line.split(f"Topic {prefix}", 1)[1].lstrip(" |—–-:")
        return remainder.split(" | ", 1)[0].strip(" |—–-:")
    raise ValueError(f"Missing title in {slug}")


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    manifest = []
    with zipfile.ZipFile(SOURCE) as bundle:
        files = sorted(name for name in bundle.namelist() if name.endswith(".docx"))
        for name in files:
            match = FILE_TOPIC.search(name)
            assert match, name
            unit, topic = int(match.group(1)), int(match.group(2))
            slug = f"{unit}-{topic}"
            with zipfile.ZipFile(BytesIO(bundle.read(name))) as doc:
                lines = paragraphs(doc)
                assert not [n for n in doc.namelist() if n.startswith("word/media/")], (slug, "embedded media")
            questions = parse_bank(lines, slug)
            title = topic_title(lines, slug)
            (DEST / f"{slug}.json").write_text(json.dumps(questions, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            manifest.append({"slug": slug, "number": slug.replace("-", "."), "unit": unit,
                             "unitName": UNIT_NAMES[unit], "title": title, "count": len(questions),
                             "graphs": sum(bool(q["graphRequired"]) for q in questions)})
            print(f"{slug:4}  {title[:46]:46}  {dict(Counter(q['difficulty'] for q in questions))}  graphs={manifest[-1]['graphs']}")
    assert len(manifest) == 29
    (DEST / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    imports = "\n".join(f'  "{item["slug"]}": () => import("./topics/{item["slug"]}.json"),' for item in manifest)
    (DEST.parent / "topic-imports.ts").write_text(
        "// Generated by scripts/import-revised-practice.py.\n"
        "export const topicImports = {\n" + imports + "\n} as const;\n", encoding="utf-8")
    print("Imported", len(manifest), "topics and", sum(t["count"] for t in manifest), "questions")


if __name__ == "__main__":
    main()
