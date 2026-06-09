"""
System Health Monitoring and Alerting.

Resource utilization tracking, error rate monitoring, automatic alerting
for anomalies, and system health checks.
"""

import os
import time
import threading
from typing import Dict, Any, Optional, List, Callable
from dataclasses import dataclass, field, asdict
from datetime import datetime
from enum import Enum


class HealthStatus(str, Enum):
    healthy = "healthy"
    degraded = "degraded"
    critical = "critical"
    unknown = "unknown"


class AlertSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


@dataclass
class HealthCheck:
    name: str
    status: HealthStatus = HealthStatus.unknown
    message: str = ""
    latency_ms: float = 0.0
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class SystemAlert:
    alert_id: str
    severity: AlertSeverity
    title: str
    message: str
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    acknowledged: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ResourceMetrics:
    cpu_percent: float = 0.0
    memory_percent: float = 0.0
    memory_used_mb: float = 0.0
    disk_percent: float = 0.0
    active_connections: int = 0
    requests_per_second: float = 0.0
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class HealthMonitor:
    """Monitors system health and raises alerts for anomalies."""

    def __init__(self, check_interval: int = 60, alert_threshold: int = 3):
        self.check_interval = check_interval
        self.alert_threshold = alert_threshold
        self._checks: Dict[str, Callable] = {}
        self._alerts: List[SystemAlert] = []
        self._resource_history: List[ResourceMetrics] = []
        self._request_counts: Dict[str, int] = {}
        self._error_counts: Dict[str, int] = {}
        self._start_time = time.time()
        self._lock = threading.Lock()

    def register_check(self, name: str, check_fn: Callable[[], HealthCheck]):
        self._checks[name] = check_fn

    def collect_resource_metrics(self) -> ResourceMetrics:
        try:
            cpu = os.getloadavg()[0] / (os.cpu_count() or 1) * 100
        except Exception:
            cpu = 0.0

        try:
            import psutil
            mem = psutil.virtual_memory()
            memory_percent = mem.percent
            memory_used_mb = mem.used / (1024 * 1024)
        except ImportError:
            memory_percent = 0.0
            memory_used_mb = 0.0

        try:
            disk = os.statvfs("/")
            disk_percent = (1 - disk.f_bavail / disk.f_blocks) * 100
        except Exception:
            disk_percent = 0.0

        metrics = ResourceMetrics(
            cpu_percent=round(cpu, 2),
            memory_percent=round(memory_percent, 2),
            memory_used_mb=round(memory_used_mb, 2),
            disk_percent=round(disk_percent, 2),
        )
        self._resource_history.append(metrics)
        if len(self._resource_history) > 1000:
            self._resource_history = self._resource_history[-500:]
        return metrics

    def check_health(self) -> Dict[str, Any]:
        checks = {}
        for name, check_fn in self._checks.items():
            try:
                result = check_fn()
                checks[name] = result.to_dict()
            except Exception as e:
                checks[name] = HealthCheck(
                    name=name,
                    status=HealthStatus.critical,
                    message=str(e),
                ).to_dict()

        statuses = [HealthStatus(c.get("status", "unknown")) for c in checks.values()]
        if any(s == HealthStatus.critical for s in statuses):
            overall = HealthStatus.critical
        elif any(s == HealthStatus.degraded for s in statuses):
            overall = HealthStatus.degraded
        else:
            overall = HealthStatus.healthy

        self._check_resource_alerts(self.collect_resource_metrics())

        return {
            "status": overall.value,
            "uptime_seconds": round(time.time() - self._start_time, 2),
            "checks": checks,
            "alerts": len([a for a in self._alerts if not a.acknowledged]),
        }

    def record_request(self, endpoint: str, error: bool = False):
        with self._lock:
            self._request_counts[endpoint] = self._request_counts.get(endpoint, 0) + 1
            if error:
                self._error_counts[endpoint] = self._error_counts.get(endpoint, 0) + 1

    def get_error_rate(self) -> float:
        total = sum(self._request_counts.values())
        errors = sum(self._error_counts.values())
        return errors / total if total > 0 else 0.0

    def _check_resource_alerts(self, metrics: ResourceMetrics):
        if metrics.cpu_percent > 90:
            self._raise_alert(
                AlertSeverity.high,
                "High CPU Usage",
                f"CPU at {metrics.cpu_percent}%",
                {"cpu_percent": metrics.cpu_percent},
            )
        if metrics.memory_percent > 85:
            self._raise_alert(
                AlertSeverity.high,
                "High Memory Usage",
                f"Memory at {metrics.memory_percent}%",
                {"memory_percent": metrics.memory_percent},
            )
        if metrics.disk_percent > 90:
            self._raise_alert(
                AlertSeverity.critical,
                "Disk Space Critical",
                f"Disk at {metrics.disk_percent}%",
                {"disk_percent": metrics.disk_percent},
            )

    def _raise_alert(
        self,
        severity: AlertSeverity,
        title: str,
        message: str,
        metadata: Optional[Dict] = None,
    ):
        import hashlib
        alert_id = hashlib.sha256(f"{title}:{time.time()}".encode()).hexdigest()[:12]
        alert = SystemAlert(
            alert_id=alert_id,
            severity=severity,
            title=title,
            message=message,
            metadata=metadata or {},
        )
        self._alerts.append(alert)

    def get_alerts(
        self,
        severity: Optional[AlertSeverity] = None,
        acknowledged: Optional[bool] = None,
    ) -> List[SystemAlert]:
        alerts = self._alerts
        if severity:
            alerts = [a for a in alerts if a.severity == severity]
        if acknowledged is not None:
            alerts = [a for a in alerts if a.acknowledged == acknowledged]
        return alerts

    def acknowledge_alert(self, alert_id: str):
        for alert in self._alerts:
            if alert.alert_id == alert_id:
                alert.acknowledged = True
                break

    def get_uptime(self) -> float:
        return time.time() - self._start_time
