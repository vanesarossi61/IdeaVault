"""
IdeaVault Scrapers Package

Each scraper module exposes an async `main()` that fetches data from its
source and persists results via config.save_raw().
"""

from scrapers.reddit_scraper import main as scrape_reddit
from scrapers.hackernews_scraper import main as scrape_hackernews
from scrapers.producthunt_scraper import main as scrape_producthunt
from scrapers.trends_scraper import main as scrape_trends
from scrapers.flippa_scraper import main as scrape_flippa

__all__ = [
    "scrape_reddit",
    "scrape_hackernews",
    "scrape_producthunt",
    "scrape_trends",
    "scrape_flippa",
]
