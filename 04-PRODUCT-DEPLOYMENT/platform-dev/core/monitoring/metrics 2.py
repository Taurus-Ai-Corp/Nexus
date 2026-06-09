"""
Prometheus-compatible Metrics Exporter.

Exposes prediction accuracy, intervention effectiveness, ROI calculations,
system health, and resource utilization metrics in Prometheus format.
"""

import time
import threading
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from collections import defaultdict
from datetime import datetime


@dataclass
class MetricSample:
    value: float
    labels: Dict[str, str] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)


class Counter:
    """Monotonically increasing counter."""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self._value = 0.0
        self._samples: Dict[str, MetricSample] = {}
        self._lock = threading.Lock()
    
    def inc(self, value: float = 1.0, labels: Optional[Dict[str, str]] = None):
        with self._lock:
            key = self._labels_key(labels)
            if key in self._samples:
                self._samples[key] = MetricSample(
                    value=self._samples[key].value + value,
                    labels=labels or {},
                )
            else:
                self._samples[key] = MetricSample(value=value, labels=labels or {})
            self._value += value
    
    def get_samples(self) -> List[MetricSample]:
        return list(self._samples.values())
    
    def _labels_key(self, labels: Optional[Dict[str, str]]) -> str:
        if not labels:
            return "__default__"
        return ",".join(f"{k}={v}" for k, v in sorted(labels.items()))


class Gauge:
    """Value that can go up and down."""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self._samples: Dict[str, MetricSample] = {}
        self._lock = threading.Lock()
    
    def set(self, value: float, labels: Optional[Dict[str, str]] = None):
        with self._lock:
            key = self._labels_key(labels)
            self._samples[key] = MetricSample(value=value, labels=labels or {})
    
    def inc(self, value: float = 1.0, labels: Optional[Dict[str, str]] = None):
        with self._lock:
            key = self._labels_key(labels)
            current = self._samples[key].value if key in self._samples else 0
            self._samples[key] = MetricSample(value=current + value, labels=labels or {})
    
    def dec(self, value: float = 1.0, labels: Optional[Dict[str, str]] = None):
        self.inc(-value, labels)
    
    def get_samples(self) -> List[MetricSample]:
        return list(self._samples.values())
    
    def _labels_key(self, labels: Optional[Dict[str, str]]) -> str:
        if not labels:
            return "__default__"
        return ",".join(f"{k}={v}" for k, v in sorted(labels.items()))


class Histogram:
    """Tracks value distribution with configurable buckets."""
    
    DEFAULT_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
    
    def __init__(self, name: str, description: str, buckets: Optional[List[float]] = None):
        self.name = name
        self.description = description
        self.buckets = sorted(buckets or self.DEFAULT_BUCKETS)
        self._counts: Dict[str, Dict[str, int]] = defaultdict(lambda: {str(b): 0 for b in self.buckets})
        self._sums: Dict[str, float] = defaultdict(float)
        self._counts_total: Dict[str, int] = defaultdict(int)
        self._lock = threading.Lock()
    
    def observe(self, value: float, labels: Optional[Dict[str, str]] = None):
        with self._lock:
            key = self._labels_key(labels)
            self._sums[key] += value
            self._counts_total[key] += 1
            for bucket in self.buckets:
                if value <= bucket:
                    self._counts[key][str(bucket)] += 1
    
    def get_samples(self) -> List[MetricSample]:
        samples = []
        for key, bucket_counts in self._counts.items():
            labels = self._parse_key(key)
            for bucket_val, count in bucket_counts.items():
                label_with_bucket = {**labels, "le": bucket_val}
                samples.append(MetricSample(value=float(count), labels=label_with_bucket))
            
            sum_label = {**labels, "le": "+Inf"}
            samples.append(MetricSample(value=float(self._counts_total[key]), labels=sum_label))
            
            sum_sample = MetricSample(
                value=self._sums[key],
                labels={**labels, "__name_suffix": "_sum"},
            )
            samples.append(sum_sample)
            
            count_sample = MetricSample(
                value=float(self._counts_total[key]),
                labels={**labels, "__name_suffix": "_count"},
            )
            samples.append(count_sample)
        
        return samples
    
    def _labels_key(self, labels: Optional[Dict[str, str]]) -> str:
        if not labels:
            return "__default__"
        return ",".join(f"{k}={v}" for k, v in sorted(labels.items()))
    
    def _parse_key(self, key: str) -> Dict[str, str]:
        if key == "__default__":
            return {}
        return dict(pair.split("=") for pair in key.split(","))


class MetricsRegistry:
    """Central registry for all Prometheus metrics."""
    
    def __init__(self):
        self._counters: Dict[str, Counter] = {}
        self._gauges: Dict[str, Gauge] = {}
        self._histograms: Dict[str, Histogram] = {}
    
    def counter(self, name: str, description: str) -> Counter:
        if name not in self._counters:
            self._counters[name] = Counter(name, description)
        return self._counters[name]
    
    def gauge(self, name: str, description: str) -> Gauge:
        if name not in self._gauges:
            self._gauges[name] = Gauge(name, description)
        return self._gauges[name]
    
    def histogram(self, name: str, description: str, buckets: Optional[List[float]] = None) -> Histogram:
        if name not in self._histograms:
            self._histograms[name] = Histogram(name, description, buckets)
        return self._histograms[name]
    
    def render_prometheus(self) -> str:
        """Render all metrics in Prometheus exposition format."""
        lines = []
        lines.append(f"# Generated at {datetime.now().isoformat()}")
        lines.append("")
        
        for name, counter in self._counters.items():
            lines.append(f"# HELP {name} {counter.description}")
            lines.append(f"# TYPE {name} counter")
            for sample in counter.get_samples():
                label_str = self._format_labels(sample.labels)
                lines.append(f"{name}{label_str} {sample.value}")
            lines.append("")
        
        for name, gauge in self._gauges.items():
            lines.append(f"# HELP {name} {gauge.description}")
            lines.append(f"# TYPE {name} gauge")
            for sample in gauge.get_samples():
                label_str = self._format_labels(sample.labels)
                lines.append(f"{name}{label_str} {sample.value}")
            lines.append("")
        
        for name, histogram in self._histograms.items():
            lines.append(f"# HELP {name} {histogram.description}")
            lines.append(f"# TYPE {name} histogram")
            for sample in histogram.get_samples():
                suffix = sample.labels.pop("__name_suffix", "")
                metric_name = f"{name}_bucket" if not suffix else f"{name}{suffix}"
                label_str = self._format_labels(sample.labels)
                lines.append(f"{metric_name}{label_str} {sample.value}")
                if suffix:
                    sample.labels["__name_suffix"] = suffix
            lines.append("")
        
        return "\n".join(lines)
    
    def _format_labels(self, labels: Dict[str, str]) -> str:
        if not labels:
            return ""
        pairs = ",".join(f'{k}="{v}"' for k, v in sorted(labels.items()))
        return f"{{{pairs}}}"
    
    def get_all_metrics(self) -> Dict[str, Any]:
        """Get all metrics as a structured dict (for dashboard API)."""
        return {
            "counters": {
                name: [s.__dict__ for s in counter.get_samples()]
                for name, counter in self._counters.items()
            },
            "gauges": {
                name: [s.__dict__ for s in gauge.get_samples()]
                for name, gauge in self._gauges.items()
            },
            "histograms": {
                name: [s.__dict__ for s in histogram.get_samples()]
                for name, histogram in self._histograms.items()
            },
        }


default_registry = MetricsRegistry()


def setup_default_metrics(registry: Optional[MetricsRegistry] = None) -> MetricsRegistry:
    """Set up the default micro-loan platform metrics."""
    reg = registry or default_registry
    
    reg.counter("ml_predictions_total", "Total number of model predictions")
    reg.counter("ml_reminders_sent_total", "Total reminders sent")
    reg.counter("ml_consent_grants_total", "Total consent grants")
    reg.counter("ml_consent_revokes_total", "Total consent revocations")
    reg.counter("ml_errors_total", "Total system errors")
    reg.counter("ml_interventions_total", "Total interventions triggered")
    
    reg.gauge("ml_active_borrowers", "Number of active borrowers")
    reg.gauge("ml_portfolio_value", "Total portfolio value in INR")
    reg.gauge("ml_collection_rate", "Current collection efficiency rate")
    reg.gauge("ml_default_rate", "Current default rate")
    reg.gauge("ml_model_accuracy", "Current model prediction accuracy")
    reg.gauge("ml_system_cpu_percent", "System CPU usage percentage")
    reg.gauge("ml_system_memory_mb", "System memory usage in MB")
    reg.gauge("ml_system_uptime_seconds", "System uptime in seconds")
    
    reg.histogram(
        "ml_prediction_latency_seconds",
        "Model prediction latency in seconds",
        buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5],
    )
    reg.histogram(
        "ml_api_request_duration_seconds",
        "API request duration in seconds",
        buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0],
    )
    
    return reg
