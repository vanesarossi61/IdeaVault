"""
Reddit Scraper - OAuth2 client-credentials flow via httpx (async).

Scans configured subreddits for hot & top-of-week posts, filters by
minimum score, deduplicates by permalink, and saves raw results.
"""

import asyncio
import sys
from pathlib import Path

# Ensure project root is importable when running as a script
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import httpx
import config

log = config.get_logger("scraper.reddit")

# ---------------------------------------------------------------------------
# OAuth2 helpers
# ---------------------------------------------------------------------------
TOKEN_URL = "https://www.reddit.com/api/v1/access_token"
OAUTH_BASE = "https://oauth.reddit.com"


async def _get_access_token(client: httpx.AsyncClient) -> str:
    """Obtain a Reddit OAuth2 bearer token using client-credentials grant."""
    resp = await client.post(
        TOKEN_URL,
        auth=(config.REDDIT_CLIENT_ID, config.REDDIT_CLIENT_SECRET),
        data={"grant_type": "client_credentials"},
        headers={"User-Agent": config.REDDIT_USER_AGENT},
    )
    resp.raise_for_status()
    token = resp.json()["access_token"]
    log.info("Obtained Reddit access token")
    return token


# ---------------------------------------------------------------------------
# Fetching
# ---------------------------------------------------------------------------

async def _fetch_listing(
    client: httpx.AsyncClient,
    headers: dict,
    subreddit: str,
    sort: str,
    params: dict | None = None,
) -> list[dict]:
    """
    Fetch a single listing page from Reddit.

    `sort` is 'hot' or 'top'.
    """
    url = f"{OAUTH_BASE}/r/{subreddit}/{sort}.json"
    query: dict = {"limit": 100, "raw_json": 1}
    if params:
        query.update(params)

    resp = await client.get(url, headers=headers, params=query)
    if resp.status_code == 429:
        retry_after = int(resp.headers.get("Retry-After", "5"))
        log.warning("Rate-limited on r/%s/%s, sleeping %ds", subreddit, sort, retry_after)
        await asyncio.sleep(retry_after)
        resp = await client.get(url, headers=headers, params=query)
    resp.raise_for_status()

    children = resp.json().get("data", {}).get("children", [])
    return [c["data"] for c in children if c.get("kind") == "t3"]


def _extract_post(raw: dict) -> dict:
    """Pull the fields we care about from a raw Reddit post."""
    return {
        "title": raw.get("title", ""),
        "selftext": raw.get("selftext", ""),
        "score": raw.get("score", 0),
        "num_comments": raw.get("num_comments", 0),
        "subreddit": raw.get("subreddit", ""),
        "permalink": raw.get("permalink", ""),
        "created_utc": raw.get("created_utc", 0),
        "url": raw.get("url", ""),
        "author": raw.get("author", ""),
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

async def main() -> list[dict]:
    """Scrape all configured subreddits and return filtered, deduplicated posts."""
    log.info("Starting Reddit scraper for %d subreddits", len(config.REDDIT_SUBREDDITS))

    seen_permalinks: set[str] = set()
    results: list[dict] = []

    async with httpx.AsyncClient(timeout=30.0) as client:
        token = await _get_access_token(client)
        auth_headers = {
            "Authorization": f"Bearer {token}",
            "User-Agent": config.REDDIT_USER_AGENT,
        }

        for sub in config.REDDIT_SUBREDDITS:
            for sort, extra_params in [
                ("hot", None),
                ("top", {"t": "week"}),
            ]:
                try:
                    raw_posts = await _fetch_listing(
                        client, auth_headers, sub, sort, extra_params
                    )
                    log.info(
                        "r/%s/%s returned %d posts", sub, sort, len(raw_posts)
                    )
                except httpx.HTTPStatusError as exc:
                    log.error(
                        "Failed r/%s/%s: HTTP %d", sub, sort, exc.response.status_code
                    )
                    continue
                except httpx.RequestError as exc:
                    log.error("Network error r/%s/%s: %s", sub, sort, exc)
                    continue

                for raw in raw_posts:
                    post = _extract_post(raw)
                    permalink = post["permalink"]

                    if post["score"] < config.REDDIT_MIN_SCORE:
                        continue
                    if permalink in seen_permalinks:
                        continue

                    seen_permalinks.add(permalink)
                    results.append(post)

                # Rate limiting: ~1 request per second
                await asyncio.sleep(1.0)

    log.info("Reddit scraper finished: %d unique posts collected", len(results))
    config.save_raw("reddit", results)
    return results


if __name__ == "__main__":
    asyncio.run(main())
