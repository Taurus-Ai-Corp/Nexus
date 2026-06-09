#!/usr/bin/env python3
"""Scan final isolated assets and refresh the final asset isolation manifest."""

from __future__ import annotations

import csv
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FINAL = ROOT / "final" / "2026-06-09"
TRACKER = ROOT / "manifests" / "source-license-tracker-2026-06-09.csv"
MANIFEST = FINAL / "manifests" / "final-asset-isolation-manifest-2026-06-09.csv"
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tif", ".tiff"}
VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".avi", ".mkv", ".webm"}


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    if not path.exists():
        return [], []
    with path.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return reader.fieldnames or [], list(reader)


def write_csv(path: Path, fieldnames: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    tracker_fields, tracker_rows = read_csv(TRACKER)
    by_hash = {r.get("sha256", ""): r for r in tracker_rows if r.get("sha256")}
    rows = []
    for path in sorted(FINAL.glob("**/*")):
        if not path.is_file() or path.suffix.lower() not in IMAGE_EXTS | VIDEO_EXTS:
            continue
        asset_type = "video" if path.suffix.lower() in VIDEO_EXTS else "image"
        tracker = by_hash.get(sha256_file(path), {})
        identity = tracker.get("iphone_clicked_identity", "")
        try:
            identity_obj = json.loads(identity) if identity else {}
        except json.JSONDecodeError:
            identity_obj = {}
        rows.append({
            "asset_id": tracker.get("asset_id", path.stem.split("__")[0]),
            "asset_type": asset_type,
            "category": tracker.get("category", ""),
            "filename": path.name,
            "final_relative_path": str(path.relative_to(ROOT)),
            "final_isolated_path": str(path),
            "source_url": tracker.get("source_url", ""),
            "source_type": tracker.get("source_type", ""),
            "license_status": tracker.get("license_status", ""),
            "allowed_use": tracker.get("allowed_use", ""),
            "iphone_clicked_identity": json.dumps(identity_obj, ensure_ascii=False) if identity_obj else "",
            "sha256": sha256_file(path),
            "date_stamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "isolation_status": "isolated_final",
            "ai_detector_connection": tracker.get("ai_image_detector_result", "pending"),
            "reverse_image_search_connection": tracker.get("reverse_image_search_result", "pending"),
            "approval_status": tracker.get("approval_status", "pending"),
            "notes": tracker.get("notes", ""),
        })

    fieldnames = [
        "asset_id", "asset_type", "category", "filename", "final_relative_path", "final_isolated_path",
        "source_url", "source_type", "license_status", "allowed_use", "iphone_clicked_identity",
        "sha256", "date_stamp", "isolation_status", "ai_detector_connection", "reverse_image_search_connection",
        "approval_status", "notes",
    ]
    write_csv(MANIFEST, fieldnames, rows)
    print(json.dumps({"manifest": str(MANIFEST), "final_asset_count": len(rows)}, indent=2))


if __name__ == "__main__":
    main()
