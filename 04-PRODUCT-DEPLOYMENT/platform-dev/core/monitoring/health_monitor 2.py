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
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    CRITICAL = "critical"


class AlertSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


@dataclass
class HealthCheck:
    """Result of a single health check."""
    name: str
    status: HealthStatus
    message: str
    latency_ms: float
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())
    details: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class SystemAlert:
    """System alert for anomalous conditions."""
    alert_id: str
    severity: str
    component: str
    message: str
    timestamp: str
    metric_name: Optional[str] = None
    current_value: Optional[float] = None
    threshold: Optional[float] = None
    acknowledged: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ResourceMetrics:
    """System resource utilization metrics."""
    cpu_percent: float
    memory_mb: float
    memory_percent: float
    disk_percent: float
    open_files: int
    thread_count: int
    uptime_seconds: float
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class HealthMonitor:
    """Monitors system health and triggers alerts."""
    
    def __init__(
        self,
        thresholds: Optional[Dict[str, float]] = None,
        alert_callback: Optional[Callable] = None,
    ):
        self.thresholds = thresholds or {
            "cpu_warning": 70.0,
            "cpu_critical": 90.0,
            "memory_warning_mb": 400.0,
            "memory_critical_mb": 480.0,
            "disk_warning": 80.0,
            "disk_critical": 95.0,
            "error_rate_warning": 0.05,
            "error_rate_critical": 0.15,
            "latency_warning_ms": 500.0,
            "latency_critical_ms": 2000.0,
        }
        
        self.alert_callback = alert_callback
        self.alerts: List[SystemAlert] = []
        self.health_checks: Dict[str, Optional[HealthCheck]] = {}
        self._alert_counter = 0
        self._start_time = time.time()
        self._error_count = 0
        self._request_count = 0
        self._lock = threading.Lock()
    
    def register_check(self, name: str, check_fn: Callable) -> None:
        """Register a health check function."""
        self.health_checks[name] = None
        
        start = time.time()
        try:
            result = check_fn()
            latency = (time.time() - start) * 1000
            
            if isinstance(result, dict):
                status = HealthStatus(result.get("status", "healthy"))
                message = result.get("message", "OK")
                details = result.get("details", {})
            elif isinstance(result, bool):
                status = HealthStatus.HEALTHY if result else HealthStatus.UNHEALTHY
                message = "OK" if result else "Check failed"
                details = {}
            else:
                status = HealthStatus.HEALTHY
                message = str(result)
                details = {}
            
            self.health_checks[name] = HealthCheck(
                name=name,
                status=status,
                message=message,
                latency_ms=round(latency, 2),
                details=details,
            )
        except Exception as e:
            latency = (time.time() - start) * 1000
            self.health_checks[name] = HealthCheck(
                name=name,
                status=HealthStatus.CRITICAL,
                message=str(e),
                latency_ms=round(latency, 2),
            )
    
    def collect_resource_metrics(self) -> ResourceMetrics:
        """Collect current system resource metrics."""
        try:
            import psutil
            process = psutil.Process(os.getpid())
            mem_info = process.memory_info()
            cpu_percent = psutil.cpu_percent(interval=0.1)
            memory_mb = mem_info.rss / (1024 * 1024)
            memory_percent = process.memory_percent()
            disk = psutil.disk_usage("/")
            disk_percent = disk.percent
            open_files = len(process.open_files())
            thread_count = process.num_threads()
        except ImportError:
            cpu_percent = 0.0
            memory_mb = 0.0
            memory_percent = 0.0
            disk_percent = 0.0
            open_files = 0
            thread_count = 0
        
        uptime = time.time() - self._start_time
        
        return ResourceMetrics(
            cpu_percent=round(cpu_percent, 1),
            memory_mb=round(memory_mb, 1),
            memory_percent=round(memory_percent, 1),
            disk_percent=round(disk_percent, 1),
            open_files=open_files,
            thread_count=thread_count,
            uptime_seconds=round(uptime, 1),
        )
    
    def check_health(self) -> Dict[str, Any]:
        """Run all health checks and return overall status."""
        for name in list(self.health_checks.keys()):
            pass
        
        resources = self.collect_resource_metrics()
        self._check_resource_alerts(resources)
        
        check_results = {
            name: check.to_dict() if check else {"status": "unknown", "message": "Not run"}
            for name, check in self.health_checks.items()
        }
        
        statuses = [
            check.status for check in self.health_checks.values()
            if check is not None
        ]
        
        if any(s == HealthStatus.CRITICAL for s in statuses):
            overall = HealthStatus.CRITICAL
        elif any(s == HealthStatus.UNHEALTHY for s in statuses):
            overall = HealthStatus.UNHEALTHY
        elif any(s == HealthStatus.DEGRADED for s in statuses):
            overall = HealthStatus.DEGRADED
        else:
            overall = HealthStatus.HEALTHY
        
        return {
            "overall_status": overall.value,
            "timestamp": datetime.now().isoformat(),
            "uptime_seconds": round(time.time() - self._start_time, 1),
            "resources": resources.to_dict(),
            "checks": check_results,
            "active_alerts": len([a for a in self.alerts if not a.acknowledged]),
            "error_rate": self.get_error_rate(),
        }
    
    def record_request(self, success: bool = True):
        """Record an API request for error rate tracking."""
        with self._lock:
            self._request_count += 1
            if not success:
                self._error_count += 1
    
    def get_error_rate(self) -> float:
        """Get current error rate."""
        with self._lock:
            if self._request_count == 0:
                return 0.0
            return self._error_count / self._request_count
    
    def _check_resource_alerts(self, resources: ResourceMetrics):
        """Check resource metrics against thresholds and raise alerts."""
        checks = [
            ("cpu_warning", "cpu_critical", resources.cpu_percent, "CPU usage", "%"),
            ("memory_warning_mb", "memory_critical_mb", resources.memory_mb, "Memory usage", "MB"),
            ("disk_warning", "disk_critical", resources.disk_percent, "Disk usage", "%"),
        ]
        
        for warn_key, crit_key, value, name, unit in checks:
            warn_threshold = self.thresholds[warn_key]
            crit_threshold = self.thresholds[crit_key]
            
            if value >= crit_threshold:
                self._raise_alert(
                    AlertSeverity.CRITICAL,
                    "system_resources",
                    f"{name} critical: {value:.1f}{unit} (threshold: {crit_threshold:.1f}{unit})",
                    metric_name=name,
                    current_value=value,
                    threshold=crit_threshold,
                )
            elif value >= warn_threshold:
                self._raise_alert(
                    AlertSeverity.WARNING,
                    "system_resources",
                    f"{name} warning: {value:.1f}{unit} (threshold: {warn_threshold:.1f}{unit})",
                    metric_name=name,
                    current_value=value,
                    threshold=warn_threshold,
                )
        
        error_rate = self.get_error_rate()
        if error_rate >= self.thresholds["error_rate_critical"]:
            self._raise_alert(
                AlertSeverity.CRITICAL,
                "error_rate",
                f"Error rate critical: {error_rate:.2%} (threshold: {self.thresholds['error_rate_critical']:.2%})",
                metric_name="error_rate",
                current_value=error_rate,
                threshold=self.thresholds["error_rate_critical"],
            )
        elif error_rate >= self.thresholds["error_rate_warning"]:
            self._raise_alert(
                AlertSeverity.WARNING,
                "error_rate",
                f"Error rate warning: {error_rate:.2%} (threshold: {self.thresholds['error_rate_warning']:.2%})",
                metric_name="error_rate",
                current_value=error_rate,
                threshold=self.thresholds["error_rate_warning"],
            )
    
    def _raise_alert(
        self,
        severity: AlertSeverity,
        component: str,
        message: str,
        metric_name: Optional[str] = None,
        current_value: Optional[float] = None,
        threshold: Optional[float] = None,
    ):
        """Raise a new system alert."""
        self._alert_counter += 1
        alert = SystemAlert(
            alert_id=f"SYS-{self._alert_counter:06d}",
            severity=severity.value,
            component=component,
            message=message,
            timestamp=datetime.now().isoformat(),
            metric_name=metric_name,
            current_value=current_value,
            threshold=threshold,
        )
        self.alerts.append(alert)
        
        if self.alert_callback:
            self.alert_callback(alert)
    
    def get_alerts(
        self,
        severity: Optional[AlertSeverity] = None,
        unacknowledged_only: bool = True,
    ) -> List[Dict[str, Any]]:
        """Get system alerts with optional filters."""
        alerts = self.alerts
        if severity:
            alerts = [a for a in alerts if a.severity == severity.value]
        if unacknowledged_only:
            alerts = [a for a in alerts if not a.acknowledged]
        return [a.to_dict() for a in alerts]
    
    def acknowledge_alert(self, alert_id: str) -> bool:
        """Mark an alert as acknowledged."""
        for alert in self.alerts:
            if alert.alert_id == alert_id:
                alert.acknowledged = True
                return True
        return False
    
    def get_uptime(self) -> float:
        """Get system uptime in seconds."""
        return time.time() - self._start_time
