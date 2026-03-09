"""
IdeaVault Pipeline Package

Processing stages: idea generation, deduplication/scoring, daily pick.
"""

from pipeline.idea_generator import main as generate_ideas
from pipeline.dedup_scorer import main as dedup_and_score
from pipeline.daily_picker import main as pick_daily

__all__ = [
    "generate_ideas",
    "dedup_and_score",
    "pick_daily",
]
