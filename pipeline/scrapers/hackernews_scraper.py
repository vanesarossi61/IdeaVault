"""
Hacker News Scraper - Firebase API (no auth required).

Fetches Show HN stories, filters by minimum points, and saves raw results.
Uses asyncio + httpx with a concurrency semaphore for parallel fetching.
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import httpx
import config

log = config.get_logger("scraper.hackernews")

HN_BASE = "https://hacker-news.firebaseio.com/v0"
MAX_CONCURRENT = 10


async def _fetch_item(
    client: httpx.AsyncClient,
    sem: asyncio.Semaphore,
    item_id: int,
) -> dict | None:
    """Fetch a single HN item by ID, respecting the concurrency semaphore."""
    async with sem:
        try:
            resp = await client.get(f"{HN_BASE}/item/{item_id}.json")
            resp.raise_for_status()
            return resp.json()
        except (httpx.HTTPStatusError, httpx.RequestError) as exc:
            log.warning("Failed to fetch item %d: %s", item_id, exc)
            return None


def _extract_story(raw: dict) -> dict:
    """Pull the fields we care about from a raw HN item."""
    return {
        "id": raw.get("id"),
        "title": raw.get("title", ""),
        "url": raw.get("url", ""),
        "score": raw.get("score", 0),
        "descendants": raw.get("descendants", 0),
        "by": raw.get("by", ""),
        "time": raw.get("time", 0),
        "type": raw.get("type", ""),
    }


async def main() -> list[dict]:
    """Fetch Show HN stories, filter by score, and save raw data."""
    log.info("Starting Hacker News scraper")

    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Get Show HN story IDs
        resp = await client.get(f"{HN_BASE}/showstories.json")
        resp.raise_for_status()
        story_ids: list[int] = resp.json()
        log.info("Fetched %d Show HN story IDs", len(story_ids))

        # 2. Fetch each story in parallel with semaphore
        sem = asyncio.Semaphore(MAX_CONCURRENT)
        tasks = [_fetch_item(client, sem, sid) for sid in story_ids]
        raw_items = await asyncio.gather(*tasks)

    # 3. Filter and extract
    results: list[dict] = []
    for raw in raw_items:
        if raw is None:
            continue
        if raw.get("type") != "story":
            continue
        story = _extract_story(raw)
        if story["score"] >= config.HN_MIN_POINTS:
            results.append(story)

    log.info(
        "HN scraper finished: %d stories above %d points (of %d total)",
        len(results),
        config.HN_MIN_POINTS,
        len(story_ids),
    )
    config.save_raw("hackernews", results)
    return results


if __name__ == "__main__":
    asyncio.run(main())
