"""
Flippa Scraper - via Apify web-scraper actor (primary) with direct
httpx fallback.

Launches an Apify actor run against Flippa search pages, polls until
complete, and fetches the dataset.  Falls back to direct Flippa search
API scraping if Apify is unavailable.
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import httpx
import config

log = config.get_logger("scraper.flippa")

APIFY_RUN_URL = "https://api.apify.com/v2/acts/apify~web-scraper/runs"
APIFY_DATASET_URL = "https://api.apify.com/v2/datasets/{dataset_id}/items"

FLIPPA_SEARCH_URLS = [
    "https://flippa.com/search?filter%5Bproperty_type%5D=website&filter%5Bstatus%5D=open&sort_alias=most_active",
    "https://flippa.com/search?filter%5Bproperty_type%5D=saas&filter%5Bstatus%5D=open&sort_alias=most_active",
    "https://flippa.com/search?filter%5Bproperty_type%5D=ecommerce&filter%5Bstatus%5D=open&sort_alias=most_active",
    "https://flippa.com/search?filter%5Bproperty_type%5D=app&filter%5Bstatus%5D=open&sort_alias=most_active",
]

APIFY_PAGE_FUNCTION = """
async function pageFunction(context) {
    const { page, request } = context;
    const results = [];
    const cards = await page.$$('.ListingCard, .listing-card, [data-testid="listing-card"]');
    for (const card of cards) {
        const title = await card.$eval(
            '.ListingCard__title, .listing-card__title, h3, h2',
            el => el?.textContent?.trim() || ''
        ).catch(() => '');
        const price = await card.$eval(
            '.ListingCard__price, .listing-card__price, [data-testid="price"]',
            el => el?.textContent?.trim() || ''
        ).catch(() => '');
        const revenue = await card.$eval(
            '.ListingCard__revenue, [data-testid="revenue"]',
            el => el?.textContent?.trim() || ''
        ).catch(() => '');
        const profit = await card.$eval(
            '.ListingCard__profit, [data-testid="profit"]',
            el => el?.textContent?.trim() || ''
        ).catch(() => '');
        const listingType = await card.$eval(
            '.ListingCard__type, .listing-card__type, [data-testid="type"]',
            el => el?.textContent?.trim() || ''
        ).catch(() => '');
        const link = await card.$eval(
            'a[href*="/"]',
            el => el?.href || ''
        ).catch(() => '');
        const industry = await card.$eval(
            '.ListingCard__industry, [data-testid="industry"]',
            el => el?.textContent?.trim() || ''
        ).catch(() => '');
        const age = await card.$eval(
            '.ListingCard__age, [data-testid="age"]',
            el => el?.textContent?.trim() || ''
        ).catch(() => '');
        if (title) {
            results.push({
                title,
                asking_price: price,
                monthly_revenue: revenue,
                monthly_profit: profit,
                listing_type: listingType,
                url: link,
                industry,
                age_text: age,
                source_url: request.url,
            });
        }
    }
    return results;
}
"""


def _parse_money(text: str) -> float | None:
    """Parse a money string like '$1,234' or '$12K' into a float."""
    if not text:
        return None
    cleaned = text.replace("$", "").replace(",", "").strip()
    multiplier = 1.0
    lower = cleaned.lower()
    if lower.endswith("k"):
        multiplier = 1_000
        cleaned = cleaned[:-1]
    elif lower.endswith("m"):
        multiplier = 1_000_000
        cleaned = cleaned[:-1]
    try:
        return float(cleaned) * multiplier
    except ValueError:
        return None


def _parse_age_months(text: str) -> int | None:
    """Parse age text like '2 years' or '8 months' into months."""
    if not text:
        return None
    lower = text.lower().strip()
    parts = lower.split()
    if len(parts) < 2:
        return None
    try:
        num = int(parts[0])
    except ValueError:
        return None
    unit = parts[1]
    if "year" in unit:
        return num * 12
    if "month" in unit:
        return num
    return num


def _normalize_listing(raw: dict) -> dict:
    """Normalize a raw Flippa listing into a clean dict."""
    return {
        "title": raw.get("title", ""),
        "listing_type": raw.get("listing_type", ""),
        "monthly_revenue": _parse_money(raw.get("monthly_revenue", "")),
        "asking_price": _parse_money(raw.get("asking_price", "")),
        "monthly_profit": _parse_money(raw.get("monthly_profit", "")),
        "industry": raw.get("industry", ""),
        "age_months": _parse_age_months(raw.get("age_text", "")),
        "url": raw.get("url", ""),
    }


# ---------------------------------------------------------------------------
# Apify-based scraping
# ---------------------------------------------------------------------------

async def _run_apify(client: httpx.AsyncClient) -> list[dict]:
    """
    Launch the Apify web-scraper actor against Flippa, wait for results.
    """
    start_urls = [{"url": u} for u in FLIPPA_SEARCH_URLS]
    actor_input = {
        "startUrls": start_urls,
        "pageFunction": APIFY_PAGE_FUNCTION,
        "proxyConfiguration": {"useApifyProxy": True},
        "maxConcurrency": 3,
        "maxPagesPerCrawl": 20,
    }

    # Start the actor run
    resp = await client.post(
        APIFY_RUN_URL,
        params={"token": config.APIFY_TOKEN},
        json=actor_input,
        timeout=30.0,
    )
    resp.raise_for_status()
    run_data = resp.json().get("data", {})
    run_id = run_data.get("id")
    dataset_id = run_data.get("defaultDatasetId")
    log.info("Apify run started: run_id=%s, dataset_id=%s", run_id, dataset_id)

    if not run_id or not dataset_id:
        log.error("Apify run response missing id/dataset: %s", run_data)
        return []

    # Poll until finished (max 5 minutes)
    status_url = f"https://api.apify.com/v2/actor-runs/{run_id}"
    for attempt in range(30):
        await asyncio.sleep(10)
        status_resp = await client.get(
            status_url, params={"token": config.APIFY_TOKEN}, timeout=15.0
        )
        status_resp.raise_for_status()
        status = status_resp.json().get("data", {}).get("status", "")
        log.info("  Apify run status: %s (poll %d/30)", status, attempt + 1)
        if status in ("SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"):
            break

    if status != "SUCCEEDED":
        log.error("Apify run did not succeed: status=%s", status)
        return []

    # Fetch dataset items
    dataset_url = APIFY_DATASET_URL.format(dataset_id=dataset_id)
    items_resp = await client.get(
        dataset_url,
        params={"token": config.APIFY_TOKEN, "format": "json"},
        timeout=30.0,
    )
    items_resp.raise_for_status()
    raw_items = items_resp.json()

    # Flatten: each page returns a list, so we may have list-of-lists
    results: list[dict] = []
    for item in raw_items:
        if isinstance(item, list):
            results.extend(item)
        elif isinstance(item, dict):
            results.append(item)

    return results


# ---------------------------------------------------------------------------
# Direct fallback scraping
# ---------------------------------------------------------------------------

FLIPPA_API_SEARCH = "https://flippa.com/api/v3/listings"


async def _scrape_direct(client: httpx.AsyncClient) -> list[dict]:
    """
    Fallback: attempt to use Flippa's internal API directly.
    """
    results: list[dict] = []
    property_types = ["website", "saas_app", "ecommerce", "android_app", "ios_app"]

    for prop_type in property_types:
        params = {
            "filter[property_type]": prop_type,
            "filter[status]": "open",
            "sort_alias": "most_active",
            "page[size]": 50,
            "page[number]": 1,
        }
        try:
            resp = await client.get(
                FLIPPA_API_SEARCH,
                params=params,
                headers={
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0 (compatible; IdeaVault/1.0)",
                },
                timeout=20.0,
            )
            if resp.status_code == 200:
                data = resp.json()
                listings = data.get("data", [])
                for listing in listings:
                    attrs = listing.get("attributes", listing)
                    results.append({
                        "title": attrs.get("title", attrs.get("name", "")),
                        "listing_type": attrs.get("property_type", prop_type),
                        "monthly_revenue": str(attrs.get("average_monthly_revenue", "")),
                        "asking_price": str(attrs.get("buy_it_now_price", attrs.get("current_price", ""))),
                        "monthly_profit": str(attrs.get("average_monthly_profit", "")),
                        "industry": attrs.get("industry", ""),
                        "age_text": str(attrs.get("site_age", "")),
                        "url": f"https://flippa.com{attrs.get('url', '')}"
                        if attrs.get("url", "").startswith("/")
                        else attrs.get("url", ""),
                    })
                log.info("  Direct API for '%s': %d listings", prop_type, len(listings))
            else:
                log.warning(
                    "  Direct API for '%s' returned HTTP %d",
                    prop_type,
                    resp.status_code,
                )
        except (httpx.HTTPStatusError, httpx.RequestError) as exc:
            log.warning("  Direct API for '%s' failed: %s", prop_type, exc)

        await asyncio.sleep(1.0)

    return results


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

async def main() -> list[dict]:
    """Scrape Flippa listings via Apify (primary) or direct API (fallback)."""
    log.info("Starting Flippa scraper")

    raw_listings: list[dict] = []

    async with httpx.AsyncClient() as client:
        # Try Apify first
        if config.APIFY_TOKEN:
            try:
                raw_listings = await _run_apify(client)
                log.info("Apify returned %d raw listings", len(raw_listings))
            except Exception as exc:
                log.error("Apify scraping failed, trying direct: %s", exc)
                raw_listings = []

        # Fallback to direct scraping
        if not raw_listings:
            log.info("Falling back to direct Flippa API scraping")
            raw_listings = await _scrape_direct(client)

    # Normalize all listings
    results = [_normalize_listing(r) for r in raw_listings]
    # Filter out empty titles
    results = [r for r in results if r["title"]]

    log.info("Flippa scraper finished: %d listings collected", len(results))
    config.save_raw("flippa", results)
    return results


if __name__ == "__main__":
    asyncio.run(main())
