"""
Comprehensive Audit Trail System.

Immutable logging of all AI agent actions, user-accessible audit views,
and regulatory compliance reporting (DPDP Act 2023, RBI guidelines).
"""

import hashlib
import json
from dataclasses import asdict, dataclass, field
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any


class AuditEventType(str, Enum):
    DATA_INGESTION = "data_ingestion"
    CASH_FLOW_ANALYSIS = "cash_flow_analysis"
    RISK_ASSESSMENT = "risk_assessment"
    PRICING_DECISION = "pricing_decision"
    EARLY_WARNING = "early_warning"
    COMPLIANCE_CHECK = "compliance_check"
    REMINDER_SENT = "reminder_sent"
    CONSENT_GRANTED = "consent_granted"
    CONSENT_REVOKED = "consent_revoked"
    DATA_ACCESS = "data_access"
    DATA_EXPORT = "data_export"
    DATA_DELETION = "data_deletion"
    MODEL_TRAINING = "model_training"
    CONFIG_CHANGE = "config_change"
    AUTH_EVENT = "auth_event"
    ERROR = "error"
    SYSTEM_STARTUP = "system_startup"


@dataclass
class AuditEntry:
    event_type: str
    actor: str
    borrower_id: str | None = None
    details: dict[str, Any] = field(default_factory=dict)
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    previous_hash: str = ""
    entry_hash: str = ""
    ip_address: str | None = None

    def compute_hash(self) -> str:
        raw = json.dumps({
            "event_type": self.event_type,
            "actor": self.actor,
            "borrower_id": self.borrower_id,
            "details": self.details,
            "timestamp": self.timestamp,
            "previous_hash": self.previous_hash,
        }, sort_keys=True)
        return hashlib.sha256(raw.encode()).hexdigest()

    def __post_init__(self):
        if not self.entry_hash:
            self.entry_hash = self.compute_hash()

    def verify_integrity(self) -> bool:
        return self.entry_hash == self.compute_hash()

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class AuditTrail:
    """Immutable audit trail with SHA-256 chain verification."""

    def __init__(self, storage_path: str | None = None):
        self.entries: list[AuditEntry] = []
        self.storage_path = Path(storage_path) if storage_path else Path("audit/chain.jsonl")

    def log(
        self,
        event_type: AuditEventType,
        actor: str,
        borrower_id: str | None = None,
        details: dict[str, Any] | None = None,
        ip_address: str | None = None,
        auto_save: bool = True,
    ) -> AuditEntry:
        prev_hash = self.entries[-1].entry_hash if self.entries else "genesis"
        entry = AuditEntry(
            event_type=event_type.value if isinstance(event_type, AuditEventType) else event_type,
            actor=actor,
            borrower_id=borrower_id,
            details=details or {},
            previous_hash=prev_hash,
            ip_address=ip_address,
        )
        entry.entry_hash = entry.compute_hash()
        self.entries.append(entry)
        if auto_save:
            self.save()
        return entry

    def verify_chain(self) -> dict[str, Any]:
        if not self.entries:
            return {"valid": True, "entries": 0, "message": "Empty chain"}

        valid = True
        broken_at = None
        for i, entry in enumerate(self.entries):
            if not entry.verify_integrity():
                valid = False
                broken_at = i
                break
            if i > 0 and entry.previous_hash != self.entries[i - 1].entry_hash:
                valid = False
                broken_at = i
                break

        return {
            "valid": valid,
            "entries": len(self.entries),
            "broken_at": broken_at,
            "message": "Chain intact" if valid else f"Chain broken at entry {broken_at}",
        }

    def query(
        self,
        event_type: str | None = None,
        actor: str | None = None,
        borrower_id: str | None = None,
        start_time: str | None = None,
        end_time: str | None = None,
        limit: int = 100,
    ) -> list[AuditEntry]:
        results = self.entries
        if event_type:
            results = [e for e in results if e.event_type == event_type]
        if actor:
            results = [e for e in results if e.actor == actor]
        if borrower_id:
            results = [e for e in results if e.borrower_id == borrower_id]
        if start_time:
            results = [e for e in results if e.timestamp >= start_time]
        if end_time:
            results = [e for e in results if e.timestamp <= end_time]
        return results[:limit]

    def get_borrower_audit(self, borrower_id: str) -> list[AuditEntry]:
        return self.query(borrower_id=borrower_id)

    def get_compliance_report(
        self,
        start_date: str | None = None,
        end_date: str | None = None,
        event_types: list[str] | None = None,
    ) -> dict[str, Any]:
        entries = self.entries
        if start_date:
            entries = [e for e in entries if e.timestamp >= start_date]
        if end_date:
            entries = [e for e in entries if e.timestamp <= end_date]
        if event_types:
            entries = [e for e in entries if e.event_type in event_types]

        by_type: dict[str, int] = {}
        by_actor: dict[str, int] = {}
        for e in entries:
            by_type[e.event_type] = by_type.get(e.event_type, 0) + 1
            by_actor[e.actor] = by_actor.get(e.actor, 0) + 1

        return {
            "period": {"start": start_date, "end": end_date},
            "total_events": len(entries),
            "by_type": by_type,
            "by_actor": by_actor,
            "chain_verified": self.verify_chain()["valid"],
        }

    def save(self):
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.storage_path, "w") as f:
            for entry in self.entries:
                f.write(json.dumps(entry.to_dict()) + "\n")

    def _load_from_file(self):
        if not self.storage_path.exists():
            return
        with open(self.storage_path) as f:
            for line in f:
                line = line.strip()
                if line:
                    data = json.loads(line)
                    entry = AuditEntry(**data)
                    self.entries.append(entry)

    def get_stats(self) -> dict[str, Any]:
        by_type: dict[str, int] = {}
        by_actor: dict[str, int] = {}
        by_borrower: dict[str, int] = {}
        for e in self.entries:
            by_type[e.event_type] = by_type.get(e.event_type, 0) + 1
            by_actor[e.actor] = by_actor.get(e.actor, 0) + 1
            if e.borrower_id:
                by_borrower[e.borrower_id] = by_borrower.get(e.borrower_id, 0) + 1

        return {
            "total_entries": len(self.entries),
            "by_type": by_type,
            "by_actor": by_actor,
            "unique_borrowers": len(by_borrower),
            "chain_verified": self.verify_chain()["valid"],
        }
