"""
Product Hunt Scraper - GraphQL API v2.

Fetches top-ranked products, filters by minimum votes, paginates with
cursors, and saves raw results.
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import httpx
import config

log = config.get_logger("scraper.producthunt")

PH_GRAPHQL_URL = "https://api.producthunt.com/v2/api/graphql"

POSTS_QUERY = """
query GetPosts($first: Int!, $after: String) {
  posts(first: $first, after: $after, order: RANKING) {
    edges {
      cursor
      node {
        id
        name
        tagline
        description
        votesCount
        website
        url
        createdAt
        topics(first: 5) {
          edges {
            node {
              name
            }
          }
        }
        thumbnail {
          url
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
"""


def _extract_product(node: dict) -> dict:
    """Flatten a GraphQL product node into a clean dict."""
    topics_edges = node.get("topics", {}).get("edges", [])
    topics = [e["node"]["name"] for e in topics_edges if e.get("node")]
    thumbnail = node.get("thumbnail") or {}

    return {
        "id": node.get("id", ""),
        "name": node.get("name", ""),
        "tagline": node.get("tagline", ""),
        "description": node.get("description", ""),
        "votes_count": node.get("votesCount", 0),
        "website": node.get("website", ""),
        "url": node.get("url", ""),
        "created_at": node.get("createdAt", ""),
        "topics": topics,
        "thumbnail_url": thumbnail.get("url", ""),
    }


async def main() -> list[dict]:
    """Fetch Product Hunt top products and save raw data."""
    log.info("Starting Product Hunt scraper")

    if not config.PRODUCTHUNT_TOKEN:
        log.error("PRODUCTHUNT_TOKEN not set; skipping.")
        return []

    headers = {
        "Authorization": f"Bearer {config.PRODUCTHUNT_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    results: list[dict] = []
    cursor: str | None = None
    page = 0
    max_pages = 5  # safety limit: 5 pages * 50 = 250 products max

    async with httpx.AsyncClient(timeout=30.0) as client:
        while page < max_pages:
            variables: dict = {"first": 50}
            if cursor:
                variables["after"] = cursor

            payload = {"query": POSTS_QUERY, "variables": variables}

            try:
                resp = await client.post(
                    PH_GRAPHQL_URL, headers=headers, json=payload
                )
                resp.raise_for_status()
            except httpx.HTTPStatusError as exc:
                log.error("PH API error (HTTP %d): %s", exc.response.status_code, exc)
                break
            except httpx.RequestError as exc:
                log.error("PH network error: %s", exc)
                break

            body = resp.json()
            errors = body.get("errors")
            if errors:
                log.error("GraphQL errors: %s", errors)
                break

            posts_data = body.get("data", {}).get("posts", {})
            edges = posts_data.get("edges", [])
            page_info = posts_data.get("pageInfo", {})

            for edge in edges:
                node = edge.get("node", {})
                product = _extract_product(node)
                if product["votes_count"] >= config.PH_MIN_VOTES:
                    results.append(product)

            log.info(
                "PH page %d: fetched %d edges, %d total qualifying products",
                page + 1,
                len(edges),
                len(results),
            )

            if not page_info.get("hasNextPage"):
                break
            cursor = page_info.get("endCursor")
            page += 1

            # Polite delay between pages
            await asyncio.sleep(0.5)

    log.info(
        "Product Hunt scraper finished: %d products with >= %d votes",
        len(results),
        config.PH_MIN_VOTES,
    )
    config.save_raw("producthunt", results)
    return results


if __name__ == "__main__":
    asyncio.run(main())
