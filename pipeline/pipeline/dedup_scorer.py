"""
Deduplication & Scoring - Merges new ideas with the existing database,
deduplicates via TF-IDF cosine similarity, and computes composite scores.
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from slugify import slugify

import config

log = config.get_logger("pipeline.dedup_scorer")

# Similarity thresholds
DUPLICATE_THRESHOLD = 0.85
MERGE_THRESHOLD = 0.70

# Composite score weights
WEIGHTS = {
    "opportunity": 0.30,
    "pain_points": 0.25,
    "timing": 0.25,
    "builder_confidence": 0.20,
}

IDEAS_DB_PATH = config.OUTPUT_DIR / "ideas_database.json"


# ---------------------------------------------------------------------------
# Text preparation
# ---------------------------------------------------------------------------

def _idea_text(idea: dict) -> str:
    """Combine title + problem into a single string for similarity."""
    return f"{idea.get('title', '')} {idea.get('problem', '')}"


# ---------------------------------------------------------------------------
# Composite score
# ---------------------------------------------------------------------------

def compute_composite(scores: dict) -> float:
    """Weighted composite from the four score dimensions."""
    total = 0.0
    for field, weight in WEIGHTS.items():
        val = scores.get(field, 5)
        if not isinstance(val, (int, float)):
            val = 5
        total += val * weight
    return round(total, 3)


# ---------------------------------------------------------------------------
# Merging logic
# ---------------------------------------------------------------------------

def _merge_ideas(existing: dict, incoming: dict) -> dict:
    """
    Merge an incoming idea into an existing one (similarity between
    MERGE_THRESHOLD and DUPLICATE_THRESHOLD).

    Combines community_signals and re-averages scores.
    """
    # Merge community_signals (deduplicate by URL)
    existing_urls = {
        s.get("url", "") for s in existing.get("community_signals", [])
    }
    for sig in incoming.get("community_signals", []):
        if sig.get("url", "") not in existing_urls:
            existing.setdefault("community_signals", []).append(sig)
            existing_urls.add(sig.get("url", ""))

    # Weighted average of scores (existing gets 60% weight, incoming 40%)
    ex_scores = existing.get("scores", {})
    in_scores = incoming.get("scores", {})
    for field in WEIGHTS:
        ex_val = ex_scores.get(field, 5)
        in_val = in_scores.get(field, 5)
        if not isinstance(ex_val, (int, float)):
            ex_val = 5
        if not isinstance(in_val, (int, float)):
            in_val = 5
        ex_scores[field] = round(ex_val * 0.6 + in_val * 0.4, 1)
    existing["scores"] = ex_scores

    # Update composite
    existing["composite_score"] = compute_composite(ex_scores)

    # Merge tags and keywords (union)
    for list_field in ("tags", "keywords"):
        existing_vals = set(existing.get(list_field, []))
        incoming_vals = set(incoming.get(list_field, []))
        existing[list_field] = sorted(existing_vals | incoming_vals)

    # Bump merge count
    existing["merge_count"] = existing.get("merge_count", 1) + 1
    existing["last_updated"] = config.now_utc().isoformat()

    return existing


# ---------------------------------------------------------------------------
# Deduplication engine
# ---------------------------------------------------------------------------

def deduplicate(
    new_ideas: list[dict],
    existing_ideas: list[dict],
) -> list[dict]:
    """
    Deduplicate new_ideas against existing_ideas.

    - similarity >= DUPLICATE_THRESHOLD: drop the new idea (exact duplicate)
    - MERGE_THRESHOLD <= similarity < DUPLICATE_THRESHOLD: merge signals
    - similarity < MERGE_THRESHOLD: keep as new idea

    Returns the updated full list of ideas.
    """
    if not new_ideas:
        log.info("No new ideas to deduplicate.")
        return existing_ideas

    # Build text corpus: existing first, then new
    all_ideas = existing_ideas + new_ideas
    corpus = [_idea_text(idea) for idea in all_ideas]
    n_existing = len(existing_ideas)

    if n_existing == 0:
        # No existing ideas; everything is new
        log.info("No existing ideas; all %d new ideas are unique.", len(new_ideas))
        return new_ideas

    # TF-IDF vectorization
    vectorizer = TfidfVectorizer(
        max_features=5000,
        stop_words="english",
        ngram_range=(1, 2),
    )
    tfidf_matrix = vectorizer.fit_transform(corpus)

    existing_matrix = tfidf_matrix[:n_existing]
    new_matrix = tfidf_matrix[n_existing:]

    # Compute similarity: new vs existing
    sim_matrix = cosine_similarity(new_matrix, existing_matrix)

    duplicates = 0
    merged = 0
    added = 0

    for i, new_idea in enumerate(new_ideas):
        max_sim = float(np.max(sim_matrix[i]))
        best_match_idx = int(np.argmax(sim_matrix[i]))

        if max_sim >= DUPLICATE_THRESHOLD:
            log.info(
                "  DUPLICATE (%.2f): '%s' ~= '%s'",
                max_sim,
                new_idea.get("title", "")[:50],
                existing_ideas[best_match_idx].get("title", "")[:50],
            )
            duplicates += 1

        elif max_sim >= MERGE_THRESHOLD:
            log.info(
                "  MERGE (%.2f): '%s' into '%s'",
                max_sim,
                new_idea.get("title", "")[:50],
                existing_ideas[best_match_idx].get("title", "")[:50],
            )
            existing_ideas[best_match_idx] = _merge_ideas(
                existing_ideas[best_match_idx], new_idea
            )
            merged += 1

        else:
            existing_ideas.append(new_idea)
            added += 1

    log.info(
        "Dedup results: %d duplicates dropped, %d merged, %d new added",
        duplicates,
        merged,
        added,
    )
    return existing_ideas


# ---------------------------------------------------------------------------
# Slug generation
# ---------------------------------------------------------------------------

def _ensure_slugs(ideas: list[dict]) -> list[dict]:
    """Ensure every idea has a unique slug."""
    seen_slugs: set[str] = set()
    for idea in ideas:
        if not idea.get("slug"):
            base = slugify(idea.get("title", "untitled"), max_length=60)
            slug = base
            counter = 2
            while slug in seen_slugs:
                slug = f"{base}-{counter}"
                counter += 1
            idea["slug"] = slug
        seen_slugs.add(idea["slug"])
    return ideas


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> list[dict]:
    """
    Load generated ideas + existing database, deduplicate, score, save.
    """
    log.info("Starting dedup & scoring")

    # 1. Load newly generated ideas
    generated_path = config.PROCESSED_DIR / "generated_ideas.json"
    new_ideas: list[dict] = config.load_json(generated_path)
    log.info("Loaded %d newly generated ideas", len(new_ideas))

    # 2. Load existing database
    existing_ideas: list[dict] = config.load_json(IDEAS_DB_PATH)
    log.info("Loaded %d existing ideas from database", len(existing_ideas))

    # 3. Deduplicate
    all_ideas = deduplicate(new_ideas, existing_ideas)

    # 4. Compute / refresh composite scores
    for idea in all_ideas:
        scores = idea.get("scores", {})
        idea["composite_score"] = compute_composite(scores)

    # 5. Generate slugs
    all_ideas = _ensure_slugs(all_ideas)

    # 6. Sort by composite score descending
    all_ideas.sort(key=lambda x: x.get("composite_score", 0), reverse=True)

    # 7. Save
    config.save_json(IDEAS_DB_PATH, all_ideas)
    log.info(
        "Saved %d ideas to database (path: %s)",
        len(all_ideas),
        IDEAS_DB_PATH,
    )

    return all_ideas


if __name__ == "__main__":
    main()
