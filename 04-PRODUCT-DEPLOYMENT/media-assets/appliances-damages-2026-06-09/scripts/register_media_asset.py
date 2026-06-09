#!/usr/bin/env python3
"""Register a media asset into the source/license tracker and iPhone identity sheet.

Example:
python3 scripts/register_media_asset.py \
  --file "/path/to/asset.jpg" \
  --category damage \
  --source-type generated \
  --license-status generated_original \
  --allowed-use commercial \
  --device-model "Apple iPhone 15 Pro" \
  --operator "TAURUS-AI"
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import mimetypes
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRACKER = ROOT / "manifests" / "source-license-tracker-2026-06-09.csv"
IDENTITY = ROOT / "metadata" / "iphone-clicked-identity" / "iphone-clicked-identity-2026-06-09.csv"

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tif", ".tiff"}
VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".avi", ".mkv", ".webm"}


def now_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def mime_type(path: Path) -> str:
    guessed = mimetypes.guess_type(str(path))[0]
    if guessed:
        return guessed
    try:
        out = subprocess.check_output(["file", "-b", "--mime-type", str(path)], text=True).strip()
        return out or "application/octet-stream"
    except Exception:
        return "application/octet-stream"


def next_asset_id(prefix: str) -> str:
    date = datetime.now(timezone.utc).strftime("%Y%m%d")
    existing = set()
    if TRACKER.exists():
        with TRACKER.open(newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                aid = row.get("asset_id", "")
                if aid.startswith(f"{prefix}-{date}-"):
                    try:
                        existing.add(int(aid.rsplit("-", 1)[1]))
                    except ValueError:
                        pass
    n = max(existing, default=0) + 1
    return f"{prefix}-{date}-{n:04d}"


def raw_destination(file: Path, source_type: str, asset_type: str) -> Path:
    if source_type == "generated":
        base = ROOT / "raw" / "generated" / ("videos" if asset_type == "video" else "images")
    elif source_type == "iphone_clicked":
        base = ROOT / "raw" / "iphone-clicked" / ("videos" if asset_type == "video" else "images")
    elif source_type == "licensed_online":
        base = ROOT / "raw" / "online" / "licensed"
    elif source_type == "reference_online":
        base = ROOT / "raw" / "online" / "reference-only"
    else:
        base = ROOT / "raw" / "online" / "reference-only"
    base.mkdir(parents=True, exist_ok=True)
    return base / file.name


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
    parser = argparse.ArgumentParser(description="Register an appliance/damage media asset.")
    parser.add_argument("--file", required=True, help="Absolute or relative path to image/video file")
    parser.add_argument("--category", required=True, choices=["appliance", "damage", "appliance_damage", "video"], help="Asset category")
    parser.add_argument("--subcategory", default="", help="Optional subcategory, e.g. washing_machine_leak")
    parser.add_argument("--source-type", required=True, choices=["generated", "iphone_clicked", "licensed_online", "reference_online", "unknown"], help="Where the asset came from")
    parser.add_argument("--source-url", default="", help="Online source URL, if any")
    parser.add_argument("--source-site", default="", help="Site name, e.g. Unsplash, Pexels, Pinterest")
    parser.add_argument("--license-name", default="pending_review", help="License name or pending_review")
    parser.add_argument("--license-url", default="", help="License URL or permission URL")
    parser.add_argument("--license-status", default="pending_review", help="License status")
    parser.add_argument("--allowed-use", default="pending", choices=["commercial", "demo", "prototype", "reference_only", "not_approved", "pending"], help="Allowed use")
    parser.add_argument("--requires-attribution", default="unknown", help="yes/no/unknown")
    parser.add_argument("--creator", default="", help="Creator or rights holder")
    parser.add_argument("--permission-contact", default="", help="Permission contact, if any")
    parser.add_argument("--device-make", default="Apple", help="Device make for iPhone clicked identity")
    parser.add_argument("--device-model", default="Apple iPhone", help="Device model for iPhone clicked identity")
    parser.add_argument("--os-version", default="", help="iOS version, if known")
    parser.add_argument("--capture-app", default="Camera", help="Capture app, if known")
    parser.add_argument("--capture-date", default="", help="Capture date, ISO preferred")
    parser.add_argument("--capture-method", default="iPhone click / user-provided identity", help="Capture method")
    parser.add_argument("--operator", default="TAURUS-AI", help="Operator/person who clicked or registered the asset")
    parser.add_argument("--gps-latitude", default="", help="Optional GPS latitude")
    parser.add_argument("--gps-longitude", default="", help="Optional GPS longitude")
    parser.add_argument("--gps-accuracy-meters", default="", help="Optional GPS accuracy")
    parser.add_argument("--copy-to-raw", action="store_true", help="Copy asset into raw folder before registering")
    parser.add_argument("--notes", default="", help="Optional notes")
    args = parser.parse_args()

    file_path = Path(args.file).expanduser().resolve()
    if not file_path.exists() or not file_path.is_file():
        raise SystemExit(f"File not found: {file_path}")

    asset_type = "video" if file_path.suffix.lower() in VIDEO_EXTS else "image"
    if file_path.suffix.lower() not in IMAGE_EXTS | VIDEO_EXTS:
        raise SystemExit(f"Unsupported file type: {file_path.suffix}")

    registered_path = file_path
    if args.copy_to_raw:
        dest = raw_destination(file_path, args.source_type, asset_type)
        if dest.resolve() != file_path.resolve():
            shutil.copy2(file_path, dest)
            registered_path = dest

    prefix = "VID-AD" if asset_type == "video" else "IMG-AD"
    asset_id = next_asset_id(prefix)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    identity = {
        "device_make": args.device_make,
        "device_model": args.device_model,
        "os_version": args.os_version,
        "capture_app": args.capture_app,
        "capture_date_utc": args.capture_date or now_utc(),
        "capture_method": args.capture_method,
        "operator_id": args.operator,
        "gps_latitude": args.gps_latitude,
        "gps_longitude": args.gps_longitude,
        "gps_accuracy_meters": args.gps_accuracy_meters,
        "metadata_source": "exif_or_user_provided",
    }

    tracker_fields, tracker_rows = read_csv(TRACKER)
    row = {
        "asset_id": asset_id,
        "asset_type": asset_type,
        "category": args.category,
        "subcategory": args.subcategory,
        "filename": registered_path.name,
        "relative_path": str(registered_path.relative_to(ROOT)),
        "iteration": "raw",
        "final_isolated_path": "",
        "source_type": args.source_type,
        "source_url": args.source_url,
        "source_site": args.source_site or args.source_url.split("//")[-1].split("/")[0] if args.source_url else "",
        "retrieved_date": now_utc(),
        "license_name": args.license_name,
        "license_url": args.license_url,
        "license_status": args.license_status,
        "allowed_use": args.allowed_use,
        "requires_attribution": args.requires_attribution,
        "creator_or_rights_holder": args.creator,
        "permission_contact": args.permission_contact,
        "online_connection_detected": "pending",
        "ai_image_detector_result": "pending",
        "reverse_image_search_result": "pending",
        "iphone_clicked_identity": json.dumps(identity, ensure_ascii=False),
        "sha256": sha256_file(registered_path),
        "file_size_bytes": str(registered_path.stat().st_size),
        "mime_type": mime_type(registered_path),
        "created_date": now_utc(),
        "approval_status": "pending",
        "notes": args.notes,
    }
    tracker_rows.append(row)
    if not tracker_fields:
        tracker_fields = list(row.keys())
    write_csv(TRACKER, tracker_fields, tracker_rows)

    identity_fields, identity_rows = read_csv(IDENTITY)
    identity_row = {
        "asset_id": asset_id,
        "filename": registered_path.name,
        "device_make": args.device_make,
        "device_model": args.device_model,
        "os_version": args.os_version,
        "capture_app": args.capture_app,
        "capture_date_utc": identity["capture_date_utc"],
        "capture_method": args.capture_method,
        "operator_id": args.operator,
        "gps_latitude": args.gps_latitude,
        "gps_longitude": args.gps_longitude,
        "gps_accuracy_meters": args.gps_accuracy_meters,
        "sha256": row["sha256"],
        "metadata_source": identity["metadata_source"],
        "notes": args.notes,
    }
    identity_rows.append(identity_row)
    if not identity_fields:
        identity_fields = list(identity_row.keys())
    write_csv(IDENTITY, identity_fields, identity_rows)

    print(json.dumps({"asset_id": asset_id, "registered_path": str(registered_path), "tracker": str(TRACKER), "identity_sheet": str(IDENTITY), "stamp": stamp}, indent=2))


if __name__ == "__main__":
    main()
