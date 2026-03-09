"""
Google Trends Scraper - via SerpApi or SearchAPI.io.

Iterates over config.TRENDS_NICHES keywords, fetches interest-over-time
data for the past 12 months, calculates growth percentages, and extracts
related queries.  Supports two providers (SerpApi preferred, SearchAPI
fallback).
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import httpx
import config

log = config.get_logger("scraper.trends")

SERPAPI_URL = "https://serpapi.com/search"
SEARCHAPI_URL = "https://www.searchapi.io/api/v1/search"


def _pick_provider() -> tuple[str, str, str]:
    """
    Determine which trends API to use.

    Returns (provider_name, base_url, api_key).
    """
    if config.SERPAPI_KEY:
        return ("serpapi", SERPAPI_URL, config.SERPAPI_KEY)
    if config.SEARCHAPI_KEY:
        return ("searchapi", SEARCHAPI_URL, config.SEARCHAPI_KEY)
    return ("", "", "")


def _calc_growth(values: list[int | float]) -> float:
    """
    Calculate growth % comparing first 30 data points vs last 30.

    Returns a float percentage (e.g. 25.5 means +25.5% growth).
    """
    if len(values) < 60:
        # Not enough data; compare first half vs second half
        mid = max(len(values) // 2, 1)
        first_half = values[:mid]
        second_half = values[mid:]
    else:
        first_half = values[:30]
        second_half = values[-30:]

    avg_first = sum(first_half) / len(first_half) if first_half else 0
    avg_second = sum(second_half) / len(second_half) if second_half else 0

    if avg_first == 0:
        return 100.0 if avg_second > 0 else 0.0
    return round(((avg_second - avg_first) / avg_first) * 100, 2)


def _parse_serpapi_response(data: dict, keyword: str) -> dict:
    """
    Parse a SerpApi Google Trends response into our standard format.
    """
    iot = data.get("interest_over_time", {})
    timeline = iot.get("timeline_data", [])

    values: list[int] = []
    for point in timeline:
        point_values = point.get("values", [])
        if point_values:
            extracted = point_values[0].get("extracted_value", 0)
            values.append(int(extracted))

    related_queries_data = data.get("related_queries", {})
    rising = related_queries_data.get("rising", [])
    top = related_queries_data.get("top", [])
    related_queries = [
        {"query": q.get("query", ""), "value": q.get("extracted_value", q.get("value", ""))}
        for q in (rising[:10] + top[:10])
    ]

    interest_by_region = data.get("interest_by_region", [])
    region_interest = [
        {"region": r.get("location", ""), "value": r.get("extracted_value", r.get("value", 0))}
        for r in interest_by_region[:10]
    ]

    return {
        "keyword": keyword,
        "search_volume": values,
        "growth_percentage": _calc_growth(values),
        "related_queries": related_queries,
        "region_interest": region_interest,
        "data_points": len(values),
    }


def _parse_searchapi_response(data: dict, keyword: str) -> dict:
    """
    Parse a SearchAPI.io Google Trends response into our standard format.
    """
    iot = data.get("interest_over_time", {})
    timeline = iot.get("timeline_data", [])

    values: list[int] = []
    for point in timeline:
        point_values = point.get("values", [])
        if point_values:
            extracted = point_values[0].get("extracted_value", 0)
            values.append(int(extracted))

    related_queries_data = data.get("related_queries", {})
    rising = related_queries_data.get("rising", [])
    top = related_queries_data.get("top", [])
    related_queries = [
        {"query": q.get("query", ""), "value": q.get("extracted_value", q.get("value", ""))}
        for q in (rising[:10] + top[:10])
    ]

    interest_by_region = data.get("interest_by_region", [])
    region_interest = [
        {"region": r.get("location", ""), "value": r.get("extracted_value", r.get("value", 0))}
        for r in interest_by_region[:10]
    ]

    return {
        "keyword": keyword,
        "search_volume": values,
        "growth_percentage": _calc_growth(values),
        "related_queries": related_queries,
        "region_interest": region_interest,
        "data_points": len(values),
    }


async def _fetch_keyword(
    client: httpx.AsyncClient,
    keyword: str,
    provider: str,
    base_url: str,
    api_key: str,
) -> dict | None:
    """
    Fetch Google Trends data for a single keyword.
    """
    params: dict = {
        "engine": "google_trends",
        "q": keyword,
        "api_key": api_key,
        "data_type": "TIMESERIES",
        "date": "today 12-m",
    }

    try:
        resp = await client.get(base_url, params=params)
        resp.raise_for_status()
        data = resp.json()
    except httpx.HTTPStatusError as exc:
        log.error(
            "Trends API error for '%s' (HTTP %d)",
            keyword,
            exc.response.status_code,
        )
        return None
    except httpx.RequestError as exc:
        log.error("Trends network error for '%s': %s", keyword, exc)
        return None

    if provider == "serpapi":
        return _parse_serpapi_response(data, keyword)
    return _parse_searchapi_response(data, keyword)


async def main() -> list[dict]:
    """Fetch Google Trends data for all configured niches and save."""
    provider, base_url, api_key = _pick_provider()
    if not provider:
        log.error(
            "Neither SERPAPI_KEY nor SEARCHAPI_KEY is set; skipping trends scraper."
        )
        return []

    log.info(
        "Starting Google Trends scraper via %s for %d niches",
        provider,
        len(config.TRENDS_NICHES),
    )

    results: list[dict] = []

    async with httpx.AsyncClient(timeout=45.0) as client:
        for keyword in config.TRENDS_NICHES:
            result = await _fetch_keyword(
                client, keyword, provider, base_url, api_key
            )
            if result:
                results.append(result)
                log.info(
                    "  '%s': growth=%.1f%%, %d data points",
                    keyword,
                    result["growth_percentage"],
                    result["data_points"],
                )

            # Rate limit: 1 request per 2 seconds
            await asyncio.sleep(2.0)

    log.info("Trends scraper finished: %d keywords processed", len(results))
    config.save_raw("trends", results)
    return results


if __name__ == "__main__":
    asyncio.run(main())
