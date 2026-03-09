"""
Daily Picker - Selects the "Idea of the Day" from the ideas database.

Selection criteria:
  1. timing score > 7
  2. composite_score in top 20%
  3. Not picked in the last 30 days
  4. Prefer diversity (different category than last 3 picks)
"""

import json
import sys
from datetime import timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import config

log = config.get_logger("pipeline.daily_picker")

IDEAS_DB_PATH = config.OUTPUT_DIR / "ideas_database.json"
HISTORY_PATH = config.OUTPUT_DIR / "daily_picks_history.json"


def _load_history() -> list[dict]:
    """Load daily picks history."""
    return config.load_json(HISTORY_PATH)


def _save_history(history: list[dict]) -> None:
    """Save daily picks history."""
    config.save_json(HISTORY_PATH, history)


def _recently_picked_slugs(history: list[dict], days: int = 30) -> set[str]:
    """Return slugs picked in the last `days` days."""
    cutoff = config.now_utc() - timedelta(days=days)
    recent: set[str] = set()
    for entry in history:
        picked_date = entry.get("featured_date", "")
        if picked_date:
            try:
                from datetime import datetime, timezone

                dt = datetime.fromisoformat(picked_date)
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                if dt >= cutoff:
                    recent.add(entry.get("slug", ""))
            except (ValueError, TypeError):
                pass
    return recent


def _last_n_categories(history: list[dict], n: int = 3) -> list[str]:
    """Return the categories of the last n picks."""
    cats: list[str] = []
    for entry in reversed(history):
        cat = entry.get("category", "")
        if cat:
            cats.append(cat)
        if len(cats) >= n:
            break
    return cats


def main() -> dict | None:
    """
    Pick the Idea of the Day and update database + history.

    Returns the selected idea dict, or None if no candidate qualifies.
    """
    log.info("Starting daily picker")

    # 1. Load data
    ideas: list[dict] = config.load_json(IDEAS_DB_PATH)
    if not ideas:
        log.warning("No ideas in database; cannot pick.")
        return None

    history = _load_history()
    recently_picked = _recently_picked_slugs(history)
    recent_categories = _last_n_categories(history)

    log.info(
        "Database: %d ideas, History: %d picks, Recently picked: %d",
        len(ideas),
        len(history),
        len(recently_picked),
    )

    # 2. Compute top-20% composite threshold
    scores = sorted(
        [i.get("composite_score", 0) for i in ideas], reverse=True
    )
    top_20_idx = max(1, len(scores) // 5)  # at least 1
    score_threshold = scores[top_20_idx - 1] if scores else 0
    log.info("Top-20%% composite threshold: %.3f", score_threshold)

    # 3. Filter candidates
    candidates: list[dict] = []
    for idea in ideas:
        slug = idea.get("slug", "")
        timing = idea.get("scores", {}).get("timing", 0)
        composite = idea.get("composite_score", 0)

        # Criterion 1: timing > 7
        if not isinstance(timing, (int, float)) or timing <= 7:
            continue

        # Criterion 2: composite in top 20%
        if composite < score_threshold:
            continue

        # Criterion 3: not recently picked
        if slug in recently_picked:
            continue

        candidates.append(idea)

    log.info("%d candidates after filtering", len(candidates))

    if not candidates:
        # Relax: drop the timing constraint
        log.info("No candidates with timing > 7; relaxing to timing > 5")
        for idea in ideas:
            slug = idea.get("slug", "")
            timing = idea.get("scores", {}).get("timing", 0)
            composite = idea.get("composite_score", 0)
            if (
                isinstance(timing, (int, float))
                and timing > 5
                and composite >= score_threshold
                and slug not in recently_picked
            ):
                candidates.append(idea)

    if not candidates:
        # Ultimate fallback: just pick the top-scored idea not recently picked
        log.info("Still no candidates; falling back to highest composite not recently picked")
        for idea in ideas:
            if idea.get("slug", "") not in recently_picked:
                candidates.append(idea)
                break

    if not candidates:
        log.warning("No eligible ideas for daily pick.")
        return None

    # 4. Prefer diversity: boost ideas with a different category
    def _diversity_key(idea: dict) -> tuple[int, float]:
        cat = idea.get("category", "")
        diversity_bonus = 1 if cat not in recent_categories else 0
        return (diversity_bonus, idea.get("composite_score", 0))

    candidates.sort(key=_diversity_key, reverse=True)
    winner = candidates[0]

    # 5. Mark as featured
    today_iso = config.now_utc().date().isoformat()
    winner["featured_date"] = config.now_utc().isoformat()

    # 6. Update history
    history_entry = {
        "slug": winner.get("slug", ""),
        "title": winner.get("title", ""),
        "category": winner.get("category", ""),
        "composite_score": winner.get("composite_score", 0),
        "featured_date": winner["featured_date"],
    }
    history.append(history_entry)
    _save_history(history)

    # 7. Update the idea in the database and save
    for i, idea in enumerate(ideas):
        if idea.get("slug") == winner.get("slug"):
            ideas[i] = winner
            break
    config.save_json(IDEAS_DB_PATH, ideas)

    log.info(
        "Daily pick: '%s' (category=%s, composite=%.3f)",
        winner.get("title", ""),
        winner.get("category", ""),
        winner.get("composite_score", 0),
    )

    return winner


if __name__ == "__main__":
    pick = main()
    if pick:
        print(json.dumps(pick, indent=2, default=str))
    else:
        print("No idea picked today.")
