#!/usr/bin/env python3
"""
Training Job Monitor
Track fine-tuning job progress and metrics
"""

import json
import logging
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class JobStatus:
    """Training job status"""
    job_id: str
    status: str  # pending, running, completed, failed, cancelled
    progress: float  # 0-100
    created_at: str
    updated_at: str
    model: str | None = None
    training_file: str | None = None
    validation_file: str | None = None
    hyperparameters: dict[str, Any] | None = None
    metrics: dict[str, Any] | None = None
    error: str | None = None
    estimated_cost: float | None = None
    actual_cost: float | None = None


class TrainingMonitor:
    """Monitor fine-tuning training jobs"""

    def __init__(self, storage_path: str | None = None):
        """Initialize training monitor"""
        if storage_path is None:
            storage_path = Path(__file__).parent.parent / "monitoring" / "jobs"
        else:
            storage_path = Path(storage_path)

        self.storage_path = storage_path
        self.storage_path.mkdir(parents=True, exist_ok=True)
        self.jobs: dict[str, JobStatus] = {}
        self._load_jobs()

    def _load_jobs(self):
        """Load jobs from storage"""
        jobs_file = self.storage_path / "jobs.json"
        if jobs_file.exists():
            try:
                with open(jobs_file) as f:
                    data = json.load(f)
                    for job_id, job_data in data.items():
                        self.jobs[job_id] = JobStatus(**job_data)
                logger.info(f"Loaded {len(self.jobs)} jobs from storage")
            except Exception as e:
                logger.warning(f"Could not load jobs: {e}")

    def _save_jobs(self):
        """Save jobs to storage"""
        jobs_file = self.storage_path / "jobs.json"
        data = {
            job_id: asdict(job)
            for job_id, job in self.jobs.items()
        }
        with open(jobs_file, 'w') as f:
            json.dump(data, f, indent=2)

    def create_job(
        self,
        job_id: str,
        model: str,
        training_file: str,
        validation_file: str | None = None,
        hyperparameters: dict[str, Any] | None = None,
        estimated_cost: float | None = None
    ) -> JobStatus:
        """Create a new training job"""
        job = JobStatus(
            job_id=job_id,
            status="pending",
            progress=0.0,
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat(),
            model=model,
            training_file=training_file,
            validation_file=validation_file,
            hyperparameters=hyperparameters or {},
            estimated_cost=estimated_cost
        )

        self.jobs[job_id] = job
        self._save_jobs()
        logger.info(f"Created job: {job_id}")
        return job

    def update_job_status(
        self,
        job_id: str,
        status: str | None = None,
        progress: float | None = None,
        metrics: dict[str, Any] | None = None,
        error: str | None = None,
        actual_cost: float | None = None
    ):
        """Update job status"""
        if job_id not in self.jobs:
            logger.warning(f"Job not found: {job_id}")
            return

        job = self.jobs[job_id]

        if status:
            job.status = status
        if progress is not None:
            job.progress = progress
        if metrics:
            job.metrics = metrics
        if error:
            job.error = error
        if actual_cost is not None:
            job.actual_cost = actual_cost

        job.updated_at = datetime.now().isoformat()
        self._save_jobs()
        logger.info(f"Updated job {job_id}: status={job.status}, progress={job.progress}%")

    def get_job_status(self, job_id: str) -> JobStatus | None:
        """Get job status"""
        return self.jobs.get(job_id)

    def list_jobs(
        self,
        status: str | None = None,
        limit: int = 10
    ) -> list[JobStatus]:
        """List jobs, optionally filtered by status"""
        jobs = list(self.jobs.values())

        if status:
            jobs = [j for j in jobs if j.status == status]

        # Sort by created_at (newest first)
        jobs.sort(key=lambda x: x.created_at, reverse=True)

        return jobs[:limit]

    def get_job_metrics(self, job_id: str) -> dict[str, Any] | None:
        """Get job metrics"""
        job = self.jobs.get(job_id)
        if job:
            return {
                "status": job.status,
                "progress": job.progress,
                "metrics": job.metrics,
                "estimated_cost": job.estimated_cost,
                "actual_cost": job.actual_cost,
                "created_at": job.created_at,
                "updated_at": job.updated_at
            }
        return None

    def get_summary(self) -> dict[str, Any]:
        """Get summary of all jobs"""
        total_jobs = len(self.jobs)
        status_counts = {}
        total_estimated_cost = 0.0
        total_actual_cost = 0.0

        for job in self.jobs.values():
            status_counts[job.status] = status_counts.get(job.status, 0) + 1
            if job.estimated_cost:
                total_estimated_cost += job.estimated_cost
            if job.actual_cost:
                total_actual_cost += job.actual_cost

        return {
            "total_jobs": total_jobs,
            "status_counts": status_counts,
            "total_estimated_cost": total_estimated_cost,
            "total_actual_cost": total_actual_cost,
            "cost_difference": total_actual_cost - total_estimated_cost
        }


def main():
    """Main entry point for CLI"""
    import argparse

    parser = argparse.ArgumentParser(description="Monitor fine-tuning jobs")
    parser.add_argument(
        '--job-id',
        type=str,
        help='Job ID to check'
    )
    parser.add_argument(
        '--list',
        action='store_true',
        help='List all jobs'
    )
    parser.add_argument(
        '--status',
        type=str,
        choices=['pending', 'running', 'completed', 'failed', 'cancelled'],
        help='Filter by status'
    )
    parser.add_argument(
        '--summary',
        action='store_true',
        help='Show summary'
    )

    args = parser.parse_args()

    monitor = TrainingMonitor()

    if args.summary:
        summary = monitor.get_summary()
        print("\nTraining Jobs Summary:")
        print(f"  Total Jobs: {summary['total_jobs']}")
        print("  Status Breakdown:")
        for status, count in summary['status_counts'].items():
            print(f"    {status}: {count}")
        print(f"  Estimated Cost: ${summary['total_estimated_cost']:.2f}")
        print(f"  Actual Cost: ${summary['total_actual_cost']:.2f}")
        print()

    elif args.job_id:
        job = monitor.get_job_status(args.job_id)
        if job:
            print(f"\nJob: {job.job_id}")
            print(f"  Status: {job.status}")
            print(f"  Progress: {job.progress}%")
            print(f"  Model: {job.model}")
            print(f"  Created: {job.created_at}")
            print(f"  Updated: {job.updated_at}")
            if job.metrics:
                print(f"  Metrics: {json.dumps(job.metrics, indent=2)}")
            if job.error:
                print(f"  Error: {job.error}")
            print()
        else:
            print(f"Job not found: {args.job_id}")

    elif args.list:
        jobs = monitor.list_jobs(status=args.status)
        print(f"\nJobs ({len(jobs)}):")
        for job in jobs:
            print(f"  {job.job_id}: {job.status} ({job.progress}%) - {job.model}")
        print()

    else:
        parser.print_help()


if __name__ == '__main__':
    main()


