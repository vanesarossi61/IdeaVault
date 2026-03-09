#!/usr/bin/env python3
"""
IdeaVault Pipeline - Main Orchestrator

Usage:
    python run_pipeline.py --full              # Run entire pipeline
    python run_pipeline.py --scrape            # Run all scrapers
    python run_pipeline.py --scrape-reddit     # Run Reddit scraper only
    python run_pipeline.py --scrape-hn         # Run HN scraper only
    python run_pipeline.py --scrape-ph         # Run Product Hunt scraper only
    python run_pipeline.py --scrape-trends     # Run Google Trends scraper only
    python run_pipeline.py --scrape-flippa     # Run Flippa scraper only
    python run_pipeline.py --generate          # Run idea generator
    python run_pipeline.py --dedup             # Run dedup + scoring
    python run_pipeline.py --pick-daily        # Run daily picker

Combine flags as needed:
    python run_pipeline.py --scrape --generate --dedup
"""

import argparse
import asyncio
import sys
import time
from pathlib import Path

# Ensure project root is on the path
sys.path.insert(0, str(Path(__file__).resolve().parent))

import config

log = config.get_logger("run_pipeline")


# ---------------------------------------------------------------------------
# Timing helper
# ---------------------------------------------------------------------------

class StepTimer:
    """Context manager that logs elapsed time for a pipeline step."""

    def __init__(self, step_name: str):
        self.step_name = step_name
        self.start: float = 0

    def __enter__(self):
        self.start = time.monotonic()
        log.info("=== START: %s ===", self.step_name)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.monotonic() - self.start
        status = "DONE" if exc_type is None else "FAILED"
        log.info(
            "=== %s: %s (%.1fs) ===", status, self.step_name, elapsed
        )
        # Don't suppress exceptions
        return False


# ---------------------------------------------------------------------------
# Scraper runners (async -> sync bridge)
# ---------------------------------------------------------------------------

async def _run_scraper(name: str, coro_func) -> bool:
    """Run a single async scraper, catching errors."""
    try:
        with StepTimer(f"Scraper: {name}"):
            results = await coro_func()
            log.info("  %s returned %d items", name, len(results) if results else 0)
        return True
    except Exception as exc:
        log.error("  %s FAILED: %s", name, exc, exc_info=True)
        return False


async def run_all_scrapers() -> dict[str, bool]:
    """Run all 5 scrapers sequentially; continue if one fails."""
    from scrapers.reddit_scraper import main as reddit_main
    from scrapers.hackernews_scraper import main as hn_main
    from scrapers.producthunt_scraper import main as ph_main
    from scrapers.trends_scraper import main as trends_main
    from scrapers.flippa_scraper import main as flippa_main

    scrapers = [
        ("Reddit", reddit_main),
        ("HackerNews", hn_main),
        ("ProductHunt", ph_main),
        ("GoogleTrends", trends_main),
        ("Flippa", flippa_main),
    ]

    results: dict[str, bool] = {}
    for name, func in scrapers:
        results[name] = await _run_scraper(name, func)
    return results


async def run_single_scraper(name: str) -> bool:
    """Run a single scraper by name."""
    scraper_map = {
        "reddit": ("Reddit", None),
        "hn": ("HackerNews", None),
        "ph": ("ProductHunt", None),
        "trends": ("GoogleTrends", None),
        "flippa": ("Flippa", None),
    }

    # Lazy imports to avoid loading all scrapers unnecessarily
    if name == "reddit":
        from scrapers.reddit_scraper import main as func
        display = "Reddit"
    elif name == "hn":
        from scrapers.hackernews_scraper import main as func
        display = "HackerNews"
    elif name == "ph":
        from scrapers.producthunt_scraper import main as func
        display = "ProductHunt"
    elif name == "trends":
        from scrapers.trends_scraper import main as func
        display = "GoogleTrends"
    elif name == "flippa":
        from scrapers.flippa_scraper import main as func
        display = "Flippa"
    else:
        log.error("Unknown scraper: %s", name)
        return False

    return await _run_scraper(display, func)


# ---------------------------------------------------------------------------
# Pipeline stage runners
# ---------------------------------------------------------------------------

def run_generator() -> bool:
    """Run the AI idea generator."""
    try:
        with StepTimer("Idea Generator"):
            from pipeline.idea_generator import main as gen_main
            ideas = gen_main()
            log.info("  Generated %d idea cards", len(ideas) if ideas else 0)
        return True
    except Exception as exc:
        log.error("  Idea Generator FAILED: %s", exc, exc_info=True)
        return False


def run_dedup() -> bool:
    """Run deduplication and scoring."""
    try:
        with StepTimer("Dedup & Scoring"):
            from pipeline.dedup_scorer import main as dedup_main
            ideas = dedup_main()
            log.info("  Database now has %d ideas", len(ideas) if ideas else 0)
        return True
    except Exception as exc:
        log.error("  Dedup & Scoring FAILED: %s", exc, exc_info=True)
        return False


def run_daily_pick() -> bool:
    """Run the daily idea picker."""
    try:
        with StepTimer("Daily Picker"):
            from pipeline.daily_picker import main as pick_main
            pick = pick_main()
            if pick:
                log.info(
                    "  Idea of the Day: '%s' (score=%.3f)",
                    pick.get("title", "?"),
                    pick.get("composite_score", 0),
                )
            else:
                log.info("  No idea picked today.")
        return True
    except Exception as exc:
        log.error("  Daily Picker FAILED: %s", exc, exc_info=True)
        return False


# ---------------------------------------------------------------------------
# Full pipeline
# ---------------------------------------------------------------------------

async def run_full_pipeline() -> None:
    """Execute the entire pipeline: scrape -> generate -> dedup -> pick."""
    overall_start = time.monotonic()
    log.info("========================================")
    log.info("  IdeaVault Full Pipeline Run")
    log.info("  Started at %s", config.now_utc().isoformat())
    log.info("========================================")

    # Stage 1: Scrape
    scrape_results = await run_all_scrapers()
    succeeded = sum(1 for v in scrape_results.values() if v)
    log.info(
        "Scraping complete: %d/%d scrapers succeeded",
        succeeded,
        len(scrape_results),
    )

    # Stage 2: Generate ideas
    run_generator()

    # Stage 3: Dedup + score
    run_dedup()

    # Stage 4: Daily pick
    run_daily_pick()

    elapsed = time.monotonic() - overall_start
    log.info("========================================")
    log.info("  Full pipeline completed in %.1fs", elapsed)
    log.info("========================================")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    """Build the CLI argument parser."""
    parser = argparse.ArgumentParser(
        description="IdeaVault Data Pipeline - discover startup ideas from community signals.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
examples:
  python run_pipeline.py --full
  python run_pipeline.py --scrape --generate
  python run_pipeline.py --scrape-reddit --scrape-hn
  python run_pipeline.py --dedup --pick-daily
""",
    )

    parser.add_argument(
        "--full",
        action="store_true",
        help="Run the entire pipeline (scrape -> generate -> dedup -> pick)",
    )

    scrape_group = parser.add_argument_group("scrapers")
    scrape_group.add_argument(
        "--scrape",
        action="store_true",
        help="Run all scrapers",
    )
    scrape_group.add_argument(
        "--scrape-reddit",
        action="store_true",
        help="Run Reddit scraper only",
    )
    scrape_group.add_argument(
        "--scrape-hn",
        action="store_true",
        help="Run HackerNews scraper only",
    )
    scrape_group.add_argument(
        "--scrape-ph",
        action="store_true",
        help="Run Product Hunt scraper only",
    )
    scrape_group.add_argument(
        "--scrape-trends",
        action="store_true",
        help="Run Google Trends scraper only",
    )
    scrape_group.add_argument(
        "--scrape-flippa",
        action="store_true",
        help="Run Flippa scraper only",
    )

    pipeline_group = parser.add_argument_group("pipeline stages")
    pipeline_group.add_argument(
        "--generate",
        action="store_true",
        help="Run AI idea generator",
    )
    pipeline_group.add_argument(
        "--dedup",
        action="store_true",
        help="Run deduplication + scoring",
    )
    pipeline_group.add_argument(
        "--pick-daily",
        action="store_true",
        help="Run daily idea picker",
    )

    return parser


async def async_main(args: argparse.Namespace) -> None:
    """Dispatch to the requested pipeline stages."""
    if args.full:
        await run_full_pipeline()
        return

    any_action = False

    # Individual scrapers
    if args.scrape:
        await run_all_scrapers()
        any_action = True
    else:
        individual_scrapers = [
            (args.scrape_reddit, "reddit"),
            (args.scrape_hn, "hn"),
            (args.scrape_ph, "ph"),
            (args.scrape_trends, "trends"),
            (args.scrape_flippa, "flippa"),
        ]
        for flag, name in individual_scrapers:
            if flag:
                await run_single_scraper(name)
                any_action = True

    # Pipeline stages
    if args.generate:
        run_generator()
        any_action = True

    if args.dedup:
        run_dedup()
        any_action = True

    if args.pick_daily:
        run_daily_pick()
        any_action = True

    if not any_action:
        log.warning("No action specified. Use --help to see options.")


def main() -> None:
    """Entry point."""
    parser = build_parser()
    args = parser.parse_args()
    asyncio.run(async_main(args))


if __name__ == "__main__":
    main()
