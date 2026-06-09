# Media Asset Source, License, and Final Isolation System

Root: /Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/04-PRODUCT-DEPLOYMENT/media-assets/appliances-damages-2026-06-09

Purpose:
- Track realistic generated images/videos for appliances and damages.
- Track online-sourced images/videos from licensed, reference-only, or unknown sources.
- Keep final approved assets isolated by date, source status, and AI-detector/source-connection status.
- Preserve source URL, license status, allowed use, SHA-256 hash, iPhone clicked identity, and detector audit fields for every final asset.

Core rule:
- Nothing goes into final/2026-06-09 unless it has a tracker row, SHA-256 hash, source/license status, allowed-use status, iPhone clicked identity metadata, and AI-detector/source-connection audit result.
- Pinterest, Google Images, Instagram, product pages, and similar websites are reference-only unless a license, permission, or commercial-safe source is confirmed.

Folder structure:
- raw/generated/images: generated image candidates
- raw/generated/videos: generated video candidates
- raw/iphone-clicked/images: original iPhone/MacBook clicked photo candidates
- raw/iphone-clicked/videos: original iPhone/MacBook clicked video candidates
- raw/online/licensed: downloaded assets with confirmed license or permission
- raw/online/reference-only: Pinterest-style or web images used only for reference
- working/generated/images: in-progress generated assets
- working/generated/videos: in-progress generated videos
- working/iphone-clicked/images: in-progress iPhone/MacBook clicked assets
- working/iphone-clicked/videos: in-progress iPhone/MacBook clicked assets
- working/online/licensed: edited licensed assets
- working/online/reference-only: edited reference-only assets
- working/videos: general video work
- iterations/iter-001/images: first iteration image candidates
- iterations/iter-001/videos: first iteration video candidates
- iterations/iter-001/rejected: rejected assets with reason
- final/2026-06-09/images: approved final images only
- final/2026-06-09/videos: approved final videos only
- final/2026-06-09/manifests: final asset manifests
- final/2026-06-09/audit-reports: detector and source audit reports
- metadata/iphone-clicked-identity: iPhone capture identity records
- detectors/ai-image-detectors: AI detector outputs
- detectors/reverse-image-search: reverse image search outputs
- detectors/source-connection-audit: source connection audit outputs
- manifests: master CSV/XLSX tracking sheets
- exports/csv: CSV exports
- exports/xlsx: XLSX exports
- exports/reports: approval/rejection reports

Final naming convention:
- Images: IMG-AD-YYYYMMDD-NNNN__YYYYMMDDTHHMMSSZ__iPhoneIdentity__source-connection-{none|matched|pending}__final.ext
- Videos: VID-AD-YYYYMMDD-NNNN__YYYYMMDDTHHMMSSZ__iPhoneIdentity__source-connection-{none|matched|pending}__final.ext

Example:
- IMG-AD-20260609-0001__20260609T143000Z__iPhone15Pro__source-connection-none__final.jpg
- VID-AD-20260609-0001__20260609T143500Z__iPhone15Pro__source-connection-matched__final.mp4

Required fields before final approval:
- asset_id
- filename
- category
- source_type
- source_url
- license_name
- license_status
- allowed_use
- sha256
- iphone_clicked_identity
- ai_detector_result
- reverse_image_search_result
- online_connection_detected
- final_isolated_path
- approval_status

Register a new asset:
python3 /Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/04-PRODUCT-DEPLOYMENT/media-assets/appliances-damages-2026-06-09/scripts/register_media_asset.py --file "/path/to/asset.jpg" --category damage --source-type iphone_clicked --license-status original_photo --allowed-use commercial --device-model "Macbook Pro 2026" --operator "TAURUS-AI"

Export tracker sheets:
python3 /Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/04-PRODUCT-DEPLOYMENT/media-assets/appliances-damages-2026-06-09/scripts/export_xlsx.py

Scan final folder and update final manifest:
python3 /Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/04-PRODUCT-DEPLOYMENT/media-assets/appliances-damages-2026-06-09/scripts/scan_final_assets.py

License status values:
- generated_original: asset was generated internally and no online source is known
- original_photo: asset is an original iPhone/MacBook clicked photo with no online source known
- licensed_commercial: commercial use is allowed
- licensed_editorial: editorial/demo only, not commercial
- permission_granted: written permission exists
- pending_review: license not verified yet
- reference_only: use only as visual reference, not final asset
- unknown: source/license unknown, not approved for final

Allowed use values:
- commercial
- demo
- prototype
- reference_only
- not_approved
- pending

AI detector/source-connection values:
- none_detected: no online match or AI detector connection found
- matched: online source or AI detector connection found
- pending: scan not completed
- rejected: source connection found and asset was not approved
