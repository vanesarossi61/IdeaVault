"""
IdeaVault Pipeline - Shared Configuration, Constants & Utilities
"""

import os
import json
import logging
import hashlib
from pathlib import Path
from datetime import datetime, timezone
from typing import Any, Optional

from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Load .env from project root
# ---------------------------------------------------------------------------
_PROJECT_ROOT = Path(__file__).resolve().parent
load_dotenv(_PROJECT_ROOT / ".env")

# ---------------------------------------------------------------------------
# API Credentials
# ---------------------------------------------------------------------------
REDDIT_CLIENT_ID: str = os.getenv("REDDIT_CLIENT_ID", "")
REDDIT_CLIENT_SECRET: str = os.getenv("REDDIT_CLIENT_SECRET", "")
REDDIT_USER_AGENT: str = os.getenv(
    "REDDIT_USER_AGENT", "IdeaVault/1.0 (by /u/ideavault_bot)"
)

PRODUCTHUNT_TOKEN: str = os.getenv("PRODUCTHUNT_TOKEN", "")

SERPAPI_KEY: str = os.getenv("SERPAPI_KEY", "")
SEARCHAPI_KEY: str = os.getenv("SEARCHAPI_KEY", "")

APIFY_TOKEN: str = os.getenv("APIFY_TOKEN", "")

OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL: str = "gpt-4o"

DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///data/ideavault.db")

# ---------------------------------------------------------------------------
# Reddit Subreddits to Scan
# ---------------------------------------------------------------------------
REDDIT_SUBREDDITS: list[str] = [
    "SideProject",
    "Entrepreneur",
    "SaaS",
    "startups",
    "Lightbulb",
    "AppIdeas",
    "InternetIsBeautiful",
    "indiehackers",
]

# ---------------------------------------------------------------------------
# Scoring Thresholds
# ---------------------------------------------------------------------------
REDDIT_MIN_SCORE: int = 10
HN_MIN_POINTS: int = 15
PH_MIN_VOTES: int = 50

# ---------------------------------------------------------------------------
# Trend Niches for Google Trends
# ---------------------------------------------------------------------------
TRENDS_NICHES: list[str] = [
    "AI tools",
    "SaaS",
    "no-code",
    "developer tools",
    "fintech",
    "healthtech",
    "edtech",
    "e-commerce",
    "marketplace",
    "automation",
    "productivity",
    "remote work",
    "creator economy",
    "web3",
    "cybersecurity",
    "climate tech",
    "proptech",
    "legaltech",
    "HR tech",
    "foodtech",
]

# ---------------------------------------------------------------------------
# Data Paths
# ---------------------------------------------------------------------------
DATA_DIR: Path = _PROJECT_ROOT / "data"
RAW_DIR: Path = DATA_DIR / "raw"
PROCESSED_DIR: Path = DATA_DIR / "processed"
OUTPUT_DIR: Path = DATA_DIR / "output"

for _d in (RAW_DIR, PROCESSED_DIR, OUTPUT_DIR):
    _d.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Idea Card Schema (for validation)
# ---------------------------------------------------------------------------
IDEA_CARD_SCHEMA: dict[str, Any] = {
    "required_fields": [
        "title",
        "problem",
        "solution",
        "plan",
        "revenue_model",
        "scores",
        "tags",
        "keywords",
        "why_now",
        "community_signals",
        "complexity",
        "tech_stack",
        "category",
    ],
    "score_fields": ["opportunity", "pain_points", "builder_confidence", "timing"],
    "valid_complexities": ["low", "medium", "high"],
    "score_range": (1, 10),
}

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
_LOG_FORMAT = "%(asctime)s | %(name)-24s | %(levelname)-7s | %(message)s"
_LOG_DATE_FMT = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(level=logging.INFO, format=_LOG_FORMAT, datefmt=_LOG_DATE_FMT)


def get_logger(name: str) -> logging.Logger:
    """Return a named logger with consistent formatting."""
    logger = logging.getLogger(name)
    return logger


# ---------------------------------------------------------------------------
# Utility Functions
# ---------------------------------------------------------------------------

def now_utc() -> datetime:
    """Return the current UTC datetime (timezone-aware)."""
    return datetime.now(timezone.utc)


def _timestamp_slug() -> str:
    """Return a filesystem-safe UTC timestamp string."""
    return now_utc().strftime("%Y%m%d_%H%M%S")


def save_raw(source: str, data: list[dict] | dict) -> Path:
    """
    Persist raw scraper output to data/raw/<source>/<timestamp>.json.

    Returns the path of the saved file.
    """
    source_dir = RAW_DIR / source
    source_dir.mkdir(parents=True, exist_ok=True)
    filepath = source_dir / f"{_timestamp_slug()}.json"
    payload = {
        "source": source,
        "scraped_at": now_utc().isoformat(),
        "count": len(data) if isinstance(data, list) else 1,
        "data": data,
    }
    filepath.write_text(json.dumps(payload, indent=2, default=str), encoding="utf-8")
    get_logger("config").info("Saved raw data -> %s (%d items)", filepath, payload["count"])
    return filepath


def load_latest_raw(source: str) -> list[dict]:
    """
    Load the most recent raw JSON file for a given source.

    Returns the 'data' list (or empty list if nothing found).
    """
    source_dir = RAW_DIR / source
    if not source_dir.exists():
        get_logger("config").warning("No raw directory for source '%s'", source)
        return []

    files = sorted(source_dir.glob("*.json"), reverse=True)
    if not files:
        get_logger("config").warning("No raw files for source '%s'", source)
        return []

    latest = files[0]
    get_logger("config").info("Loading raw data <- %s", latest)
    payload = json.loads(latest.read_text(encoding="utf-8"))
    data = payload.get("data", [])
    return data if isinstance(data, list) else [data]


def save_processed(data: list[dict] | dict, filename: str) -> Path:
    """
    Save processed/intermediate data to data/processed/<filename>.
    """
    filepath = PROCESSED_DIR / filename
    filepath.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")
    count = len(data) if isinstance(data, list) else 1
    get_logger("config").info("Saved processed data -> %s (%d items)", filepath, count)
    return filepath


def load_json(filepath: Path) -> Any:
    """Load a JSON file; return empty list on missing/corrupt file."""
    if not filepath.exists():
        return []
    try:
        return json.loads(filepath.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        get_logger("config").error("Failed to load %s: %s", filepath, exc)
        return []


def save_json(filepath: Path, data: Any) -> Path:
    """Write data to a JSON file (pretty-printed)."""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    filepath.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")
    return filepath


def validate_idea_card(card: dict) -> tuple[bool, list[str]]:
    """
    Validate an idea card dict against IDEA_CARD_SCHEMA.

    Returns (is_valid, list_of_errors).
    """
    errors: list[str] = []
    schema = IDEA_CARD_SCHEMA

    # Check required top-level fields
    for field in schema["required_fields"]:
        if field not in card:
            errors.append(f"Missing required field: '{field}'")

    # Validate scores sub-object
    scores = card.get("scores", {})
    if isinstance(scores, dict):
        lo, hi = schema["score_range"]
        for sf in schema["score_fields"]:
            if sf not in scores:
                errors.append(f"Missing score field: 'scores.{sf}'")
            else:
                val = scores[sf]
                if not isinstance(val, (int, float)) or not (lo <= val <= hi):
                    errors.append(
                        f"Score 'scores.{sf}' must be a number between {lo} and {hi}, got {val}"
                    )
    else:
        errors.append("'scores' must be a dict")

    # Validate complexity
    complexity = card.get("complexity", "")
    if complexity not in schema["valid_complexities"]:
        errors.append(
            f"Invalid complexity '{complexity}'; expected one of {schema['valid_complexities']}"
        )

    # plan must be a list
    plan = card.get("plan", None)
    if plan is not None and not isinstance(plan, list):
        errors.append("'plan' must be a list of strings")

    # tags and keywords must be lists
    for list_field in ("tags", "keywords", "tech_stack", "community_signals"):
        val = card.get(list_field, None)
        if val is not None and not isinstance(val, list):
            errors.append(f"'{list_field}' must be a list")

    return (len(errors) == 0, errors)


def content_hash(text: str) -> str:
    """Return a short SHA-256 hex digest for dedup fingerprinting."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]
