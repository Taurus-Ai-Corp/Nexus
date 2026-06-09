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
    name: str
    value: float
    labels: Dict[str, str] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)


class Counter:
    """Prometheus-style counter metric."""

    def __init__(self, name: str, description: str = ""):
        self.name = name
        self.description = description
        self._values: Dict[str, float] = defaultdict(float)
        self._lock = threading.Lock()

    def inc(self, value: float = 1.0, labels: Optional[Dict[str, str]] = None):
        with self._lock:
            key = self._labels_key(labels)
            self._values[key] += value

    def get_samples(self) -> List[MetricSample]:
        samples = []
        with self._lock:
            for key, value in self._values.items():
                labels = self._parse_key(key) if key else {}
                samples.append(MetricSample(
                    name=self.name,
                    value=value,
                    labels=labels,
                ))
        return samples

    def _labels_key(self, labels: Optional[Dict[str, str]]) -> str:
        if not labels:
            return ""
        return ",".join(f"{k}={v}" for k, v in sorted(labels.items()))

    def _parse_key(self, key: str) -> Dict[str, str]:
        if not key:
            return {}
        return dict(pair.split("=", 1) for pair in key.split(",") if "=" in pair)


class Gauge:
    """Prometheus-style gauge metric."""

    def __init__(self, name: str, description: str = ""):
        self.name = name
        self.description = description
        self._values: Dict[str, float] = defaultdict(float)
        self._lock = threading.Lock()

    def set(self, value: float, labels: Optional[Dict[str, str]] = None):
        with self._lock:
            key = self._labels_key(labels)
            self._values[key] = value

    def inc(self, value: float = 1.0, labels: Optional[Dict[str, str]] = None):
        with self._lock:
            key = self._labels_key(labels)
            self._values[key] += value

    def dec(self, value: float = 1.0, labels: Optional[Dict[str, str]] = None):
        with self._lock:
            key = self._labels_key(labels)
            self._values[key] -= value

    def get_samples(self) -> List[MetricSample]:
        samples = []
        with self._lock:
            for key, value in self._values.items():
                labels = self._parse_key(key) if key else {}
                samples.append(MetricSample(
                    name=self.name,
                    value=value,
                    labels=labels,
                ))
        return samples

    def _labels_key(self, labels: Optional[Dict[str, str]]) -> str:
        if not labels:
            return ""
        return ",".join(f"{k}={v}" for k, v in sorted(labels.items()))

    def _parse_key(self, key: str) -> Dict[str, str]:
        if not key:
            return {}
        return dict(pair.split("=", 1) for pair in key.split(",") if "=" in pair)


class Histogram:
    """Prometheus-style histogram metric."""

    def __init__(self, name: str, description: str = "", buckets: Optional[List[float]] = None):
        self.name = name
        self.description = description
        self.buckets = sorted(buckets or [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0])
        self._counts: Dict[str, int] = defaultdict(int)
        self._sums: Dict[str, float] = defaultdict(float)
        self._bucket_counts: Dict[str, Dict[float, int]] = defaultdict(lambda: defaultdict(int))
        self._lock = threading.Lock()

    def observe(self, value: float, labels: Optional[Dict[str, str]] = None):
        with self._lock:
            key = self._labels_key(labels)
            self._counts[key] += 1
            self._sums[key] += value
            for bucket in self.buckets:
                if value <= bucket:
                    self._bucket_counts[key][bucket] += 1

    def get_samples(self) -> List[MetricSample]:
        samples = []
        with self._lock:
            for key in self._counts:
                labels = self._parse_key(key) if key else {}
                for bucket in self.buckets:
                    bucket_labels = {**labels, "le": str(bucket)}
                    samples.append(MetricSample(
                        name=f"{self.name}_bucket",
                        value=float(self._bucket_counts[key].get(bucket, 0)),
                        labels=bucket_labels,
                    ))
                samples.append(MetricSample(
                    name=f"{self.name}_sum",
                    value=self._sums[key],
                    labels=labels,
                ))
                samples.append(MetricSample(
                    name=f"{self.name}_count",
                    value=float(self._counts[key]),
                    labels=labels,
                ))
        return samples

    def _labels_key(self, labels: Optional[Dict[str, str]]) -> str:
        if not labels:
            return ""
        return ",".join(f"{k}={v}" for k, v in sorted(labels.items()))

    def _parse_key(self, key: str) -> Dict[str, str]:
        if not key:
            return {}
        return dict(pair.split("=", 1) for pair in key.split(",") if "=" in pair)


class MetricsRegistry:
    """Central registry for all metrics."""

    def __init__(self):
        self._counters: Dict[str, Counter] = {}
        self._gauges: Dict[str, Gauge] = {}
        self._histograms: Dict[str, Histogram] = {}

    def counter(self, name: str, description: str = "") -> Counter:
        if name not in self._counters:
            self._counters[name] = Counter(name, description)
        return self._counters[name]

    def gauge(self, name: str, description: str = "") -> Gauge:
        if name not in self._gauges:
            self._gauges[name] = Gauge(name, description)
        return self._gauges[name]

    def histogram(self, name: str, description: str = "", buckets: Optional[List[float]] = None) -> Histogram:
        if name not in self._histograms:
            self._histograms[name] = Histogram(name, description, buckets)
        return self._histograms[name]

    def render_prometheus(self) -> str:
        lines = []
        for name, counter in self._counters.items():
            lines.append(f"# HELP {name} {counter.description}")
            lines.append(f"# TYPE {name} counter")
            for sample in counter.get_samples():
                labels_str = self._format_labels(sample.labels)
                lines.append(f"{name}{labels_str} {sample.value}")

        for name, gauge in self._gauges.items():
            lines.append(f"# HELP {name} {gauge.description}")
            lines.append(f"# TYPE {name} gauge")
            for sample in gauge.get_samples():
                labels_str = self._format_labels(sample.labels)
                lines.append(f"{name}{labels_str} {sample.value}")

        for name, histogram in self._histograms.items():
            lines.append(f"# HELP {name} {histogram.description}")
            lines.append(f"# TYPE {name} histogram")
            for sample in histogram.get_samples():
                labels_str = self._format_labels(sample.labels)
                lines.append(f"{sample.name}{labels_str} {sample.value}")

        return "\n".join(lines)

    def _format_labels(self, labels: Dict[str, str]) -> str:
        if not labels:
            return ""
        pairs = ",".join(f'{k}="{v}"' for k, v in sorted(labels.items()))
        return "{" + pairs + "}"

    def get_all_metrics(self) -> Dict[str, Any]:
        return {
            "counters": {
                name: [s.__dict__ for s in c.get_samples()]
                for name, c in self._counters.items()
            },
            "gauges": {
                name: [s.__dict__ for s in g.get_samples()]
                for name, g in self._gauges.items()
            },
            "histograms": {
                name: [s.__dict__ for s in h.get_samples()]
                for name, h in self._histograms.items()
            },
        }


default_registry = MetricsRegistry()


def setup_default_metrics(registry: Optional[MetricsRegistry] = None) -> MetricsRegistry:
    reg = registry or default_registry
    reg.counter("pricing_predictions_total", "Total pricing predictions")
    reg.counter("repayment_predictions_total", "Total repayment predictions")
    reg.counter("early_warnings_triggered", "Total early warnings triggered")
    reg.gauge("active_borrowers", "Number of active borrowers")
    reg.gauge("model_accuracy", "Current model prediction accuracy")
    reg.histogram("prediction_latency_seconds", "Prediction latency distribution")
    return reg
