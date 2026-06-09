"""
Comprehensive Audit Trail System.

Immutable logging of all AI agent actions, user-accessible audit views,
and regulatory compliance reporting (DPDP Act 2023, RBI guidelines).
"""

import json
import hashlib
import time
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field, asdict
from datetime import datetime, timedelta
from pathlib import Path
from enum import Enum


class AuditEventType(str, Enum):
    DATA_ACCESS = "data_access"
    MODEL_PREDICTION = "model_prediction"
    PRICING_DECISION = "pricing_decision"
    REMINDER_SENT = "reminder_sent"
    COMPLIANCE_CHECK = "compliance_check"
    CONSENT_GRANTED = "consent_granted"
    CONSENT_REVOKED = "consent_revoked"
    DATA_EXPORT = "data_export"
    DATA_DELETION = "data_deletion"
    SYSTEM_CONFIG_CHANGE = "system_config_change"
    AUTHENTICATION = "authentication"
    ERROR = "error"


@dataclass
class AuditEntry:
    """A single immutable audit log entry."""
    entry_id: str
    event_type: str
    timestamp: str
    actor_id: str
    actor_type: str
    borrower_id: Optional[str]
    action: str
    details: Dict[str, Any]
    previous_hash: str
    entry_hash: str = ""
    
    def compute_hash(self) -> str:
        content = json.dumps({
            "entry_id": self.entry_id,
            "event_type": self.event_type,
            "timestamp": self.timestamp,
            "actor_id": self.actor_id,
            "action": self.action,
            "details": self.details,
            "previous_hash": self.previous_hash,
        }, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()
    
    def __post_init__(self):
        if not self.entry_hash:
            self.entry_hash = self.compute_hash()
    
    def verify_integrity(self) -> bool:
        return self.compute_hash() == self.entry_hash
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class AuditTrail:
    """Immutable audit trail with chain-of-custody verification."""
    
    def __init__(self, storage_path: Optional[str] = None):
        self.entries: List[AuditEntry] = []
        self.storage_path = storage_path
        self._entry_counter = 0
        self._last_hash = "genesis"
        
        if storage_path and Path(storage_path).exists():
            self._load_from_file(storage_path)
    
    def log(
        self,
        event_type: AuditEventType,
        actor_id: str,
        actor_type: str,
        action: str,
        borrower_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
    ) -> AuditEntry:
        """Append a new immutable entry to the audit trail."""
        self._entry_counter += 1
        entry_id = f"AUD-{self._entry_counter:08d}"
        
        entry = AuditEntry(
            entry_id=entry_id,
            event_type=event_type.value,
            timestamp=datetime.now().isoformat(),
            actor_id=actor_id,
            actor_type=actor_type,
            borrower_id=borrower_id,
            action=action,
            details=details or {},
            previous_hash=self._last_hash,
        )
        
        entry.entry_hash = entry.compute_hash()
        self.entries.append(entry)
        self._last_hash = entry.entry_hash
        
        return entry
    
    def verify_chain(self) -> Dict[str, Any]:
        """Verify the integrity of the entire audit chain."""
        if not self.entries:
            return {"valid": True, "entries_checked": 0, "message": "Empty audit trail"}
        
        expected_prev = "genesis"
        broken_entries = []
        
        for i, entry in enumerate(self.entries):
            if entry.previous_hash != expected_prev:
                broken_entries.append({
                    "entry_id": entry.entry_id,
                    "expected_prev": expected_prev,
                    "actual_prev": entry.previous_hash,
                })
            
            if not entry.verify_integrity():
                broken_entries.append({
                    "entry_id": entry.entry_id,
                    "issue": "hash_mismatch",
                })
            
            expected_prev = entry.entry_hash
        
        return {
            "valid": len(broken_entries) == 0,
            "entries_checked": len(self.entries),
            "broken_entries": broken_entries,
            "message": "Audit chain verified" if not broken_entries else f"{len(broken_entries)} integrity violations found",
        }
    
    def query(
        self,
        event_type: Optional[AuditEventType] = None,
        borrower_id: Optional[str] = None,
        actor_id: Optional[str] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:
        """Query audit entries with filters."""
        results = []
        
        for entry in self.entries:
            if event_type and entry.event_type != event_type.value:
                continue
            if borrower_id and entry.borrower_id != borrower_id:
                continue
            if actor_id and entry.actor_id != actor_id:
                continue
            if start_time and entry.timestamp < start_time:
                continue
            if end_time and entry.timestamp > end_time:
                continue
            
            results.append(entry.to_dict())
            if len(results) >= limit:
                break
        
        return results
    
    def get_borrower_audit(self, borrower_id: str) -> List[Dict[str, Any]]:
        """Get full audit history for a specific borrower (DPDP data principal right)."""
        return self.query(borrower_id=borrower_id, limit=10000)
    
    def get_compliance_report(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate a regulatory compliance report."""
        entries = self.query(start_time=start_date, end_time=end_date, limit=100000)
        
        event_counts = {}
        for e in entries:
            et = e["event_type"]
            event_counts[et] = event_counts.get(et, 0) + 1
        
        consent_grants = event_counts.get("consent_granted", 0)
        consent_revokes = event_counts.get("consent_revoked", 0)
        data_accesses = event_counts.get("data_access", 0)
        predictions = event_counts.get("model_prediction", 0)
        errors = event_counts.get("error", 0)
        
        return {
            "report_generated_at": datetime.now().isoformat(),
            "period": {"start": start_date, "end": end_date},
            "total_events": len(entries),
            "event_breakdown": event_counts,
            "consent_metrics": {
                "grants": consent_grants,
                "revocations": consent_revokes,
                "active_consent_ratio": round(
                    (consent_grants - consent_revokes) / max(consent_grants, 1), 4
                ),
            },
            "data_access_count": data_accesses,
            "prediction_count": predictions,
            "error_count": errors,
            "error_rate": round(errors / max(len(entries), 1), 4),
            "chain_integrity": self.verify_chain(),
        }
    
    def save(self, path: Optional[str] = None) -> str:
        """Persist audit trail to file."""
        target = path or self.storage_path
        if not target:
            raise ValueError("No storage path specified")
        
        Path(target).parent.mkdir(parents=True, exist_ok=True)
        data = {
            "entries": [e.to_dict() for e in self.entries],
            "last_hash": self._last_hash,
            "entry_counter": self._entry_counter,
            "saved_at": datetime.now().isoformat(),
        }
        with open(target, "w") as f:
            json.dump(data, f, indent=2)
        return target
    
    def _load_from_file(self, path: str) -> None:
        """Load audit trail from file."""
        with open(path) as f:
            data = json.load(f)
        
        self._entry_counter = data.get("entry_counter", 0)
        self._last_hash = data.get("last_hash", "genesis")
        
        for entry_data in data.get("entries", []):
            entry = AuditEntry(**entry_data)
            self.entries.append(entry)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get audit trail statistics."""
        return {
            "total_entries": len(self.entries),
            "unique_borrowers": len(set(e.borrower_id for e in self.entries if e.borrower_id)),
            "unique_actors": len(set(e.actor_id for e in self.entries)),
            "event_types": list(set(e.event_type for e in self.entries)),
            "first_entry": self.entries[0].timestamp if self.entries else None,
            "last_entry": self.entries[-1].timestamp if self.entries else None,
        }
