"""
Data models and storage management for conference corpus
"""

from .corpus_manager import (
    ConferenceCorpusManager,
    search_conference_talks,
    store_crawled_conference,
)

__all__ = [
    'ConferenceCorpusManager',
    'store_crawled_conference',
    'search_conference_talks'
]
