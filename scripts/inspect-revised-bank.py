"""Inspect the structure of every attached question document."""
from collections import Counter
from io import BytesIO
from pathlib import Path
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding="utf-8")
source = Path(r"C:\Users\akars\Downloads\Revised Question Bank-20261010T204801Z-1-001.zip")
ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}

with zipfile.ZipFile(source) as bundle:
    for entry in sorted(bundle.namelist()):
        if not entry.endswith(".docx"):
            continue
        with zipfile.ZipFile(BytesIO(bundle.read(entry))) as doc:
            tree = ET.fromstring(doc.read("word/document.xml"))
            lines = ["".join(t.text or "" for t in p.findall(".//w:t", ns)).strip() for p in tree.findall(".//w:body//w:p", ns)]
            lines = [line for line in lines if line]
            markers = Counter()
            for line in lines:
                if re.match(r"^Question\s+\d+", line): markers["question"] += 1
                if re.match(r"^[A-E]\.\s+", line): markers["option"] += 1
                if line.startswith("Correct Answer:"): markers["answer"] += 1
                if line.startswith("Explanation:"): markers["explanation"] += 1
                if line.startswith("Graph Description:"): markers["graph"] += 1
            media = [n for n in doc.namelist() if n.startswith("word/media/")]
            print(entry.split("/")[-1], dict(markers), "media", len(media), "paragraphs", len(lines))
            print("  intro:", " | ".join(lines[:8])[:600])
            print("  last:", " | ".join(lines[-3:])[:300])
