#!/usr/bin/env python3
"""Export all CSV tracking sheets to a single XLSX workbook.

Fallback: if openpyxl is unavailable, writes a minimal valid .xlsx using stdlib zip/xml.
"""

from __future__ import annotations

import csv
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

try:
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill
    from openpyxl.utils import get_column_letter
except Exception:
    Workbook = None
    Font = None
    PatternFill = None
    get_column_letter = None

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "exports" / "xlsx" / "media-asset-source-license-tracker-2026-06-09.xlsx"
CSV_FILES = [
    ROOT / "manifests" / "source-license-tracker-2026-06-09.csv",
    ROOT / "manifests" / "final-asset-isolation-manifest-2026-06-09.csv",
    ROOT / "manifests" / "sanitized-working-copies-2026-06-09.csv",
    ROOT / "metadata" / "iphone-clicked-identity" / "iphone-clicked-identity-2026-06-09.csv",
    ROOT / "detectors" / "source-connection-audit" / "ai-detector-source-connection-audit-2026-06-09.csv",
]


def sheet_name(path: Path) -> str:
    name = path.stem.replace("2026-06-09", "").strip("-_")
    name = name.replace("_", " ").replace("-", " ").title()
    return name[:31]


def col_letter(index: int) -> str:
    name = ""
    while index:
        index, rem = divmod(index - 1, 26)
        name = chr(65 + rem) + name
    return name


def read_csv(path: Path) -> tuple[list[str], list[list[str]]]:
    if not path.exists():
        return [], []
    with path.open(newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        rows = list(reader)
    return rows[0] if rows else [], rows[1:] if len(rows) > 1 else []


def stdlib_xlsx(path: Path, sheets: list[tuple[str, list[str], list[list[str]]]]) -> None:
    """Write a minimal valid .xlsx using shared strings."""
    files: dict[str, str] = {}
    shared_strings: list[str] = []
    sheet_types = []
    sheet_refs = []

    for idx, (name, headers, rows) in enumerate(sheets, start=1):
        r_id = f"rId{idx}"
        safe_name = escape(name[:31])
        sheet_refs.append(f'<sheet name="{safe_name}" sheetId="{idx}" r:id="{r_id}"/>')
        sheet_types.append(f'<Override PartName="/xl/worksheets/sheet{idx}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet.xml"/>')
        data_rows = [headers] + rows
        row_xml_parts = []
        for r_idx, row in enumerate(data_rows, start=1):
            cell_parts = []
            for c_idx, value in enumerate(row, start=1):
                text = str(value or "")
                if text not in shared_strings:
                    shared_strings.append(text)
                si = shared_strings.index(text)
                cell = f"{col_letter(c_idx)}{r_idx}"
                cell_parts.append(f'<c r="{cell}" t="s"><v>{si}</v></c>')
            row_xml_parts.append(f'<row r="{r_idx}">{"".join(cell_parts)}</row>')
        files[f"xl/worksheets/sheet{idx}.xml"] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' + "".join(row_xml_parts) + '</sheetData></worksheet>'

    shared = "".join(f'<si><t>{escape(s)}</t></si>' for s in shared_strings)
    files["xl/sharedStrings.xml"] = f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="{len(shared_strings)}" uniqueCount="{len(shared_strings)}">{shared}</sst>'
    files["[Content_Types].xml"] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>' + "".join(sheet_types) + '</Types>'
    files["_rels/.rels"] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'
    files["xl/workbook.xml"] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' + "".join(sheet_refs) + '</sheets></workbook>'

    path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as zf:
        for name, content in files.items():
            zf.writestr(name, content)


def main() -> None:
    sheets = [(sheet_name(path), *read_csv(path)) for path in CSV_FILES]
    OUT.parent.mkdir(parents=True, exist_ok=True)

    if Workbook is None:
        stdlib_xlsx(OUT, sheets)
        print(str(OUT))
        return

    wb = Workbook()
    default = wb.active
    wb.remove(default)

    for name, headers, rows in sheets:
        ws = wb.create_sheet(name)
        ws.append(headers)
        for row in rows:
            ws.append(row)
        ws.freeze_panes = "A2"
        for cell in ws[1]:
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = PatternFill("solid", fgColor="1F4E78")
        for idx, header in enumerate(headers, start=1):
            col = get_column_letter(idx)
            max_len = min(max([len(str(header))] + [len(str(r[idx - 1])) for r in rows[:200]]), 60)
            ws.column_dimensions[col].width = max(12, max_len + 2)
        ws.auto_filter.ref = ws.dimensions

    wb.save(OUT)
    print(str(OUT))


if __name__ == "__main__":
    main()
