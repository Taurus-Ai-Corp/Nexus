"""
Web scraping module for conference data extraction
"""

from .conference_detector import ConferenceDetector
from .parallel_crawler import ParallelConferenceCrawler, crawl_single_conference
from .platform_adapters import (
    BaseConferenceAdapter,
    GenericAdapter,
    SchedAdapter,
    SessionizeAdapter,
    get_platform_adapter,
)

__all__ = [
    'ConferenceDetector',
    'BaseConferenceAdapter',
    'SchedAdapter',
    'SessionizeAdapter',
    'GenericAdapter',
    'get_platform_adapter',
    'ParallelConferenceCrawler',
    'crawl_single_conference'
]
