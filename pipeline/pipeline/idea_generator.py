"""
Idea Generator - AI processing: raw signals --> idea cards.

Loads raw data from all 5 sources, groups signals by theme using keyword
matching, sends grouped signals to OpenAI GPT-4o for structured idea-card
generation, validates outputs, and saves processed results.
"""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from openai import OpenAI
import config

log = config.get_logger("pipeline.idea_generator")

# ---------------------------------------------------------------------------
# System prompt for GPT-4o
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are an expert startup analyst. Given raw market signals from Reddit, HackerNews, Product Hunt, Google Trends, and Flippa, generate a structured startup idea card.

Output ONLY valid JSON with this exact structure:
{
  "title": "Short catchy title for the idea",
  "problem": "2-3 sentences describing the real pain point, citing specific community signals",
  "solution": "2-3 sentences describing the proposed solution",
  "plan": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."],
  "revenue_model": "Primary monetization strategy with pricing suggestion",
  "scores": {
    "opportunity": 8,
    "pain_points": 7,
    "builder_confidence": 6,
    "timing": 9
  },
  "tags": ["saas", "ai-tools", "productivity"],
  "keywords": ["keyword1", "keyword2"],
  "why_now": "Why this opportunity exists RIGHT NOW",
  "community_signals": [
    {"source": "reddit", "url": "https://...", "metric": "Score: 245", "snippet": "..."}
  ],
  "complexity": "low|medium|high",
  "tech_stack": ["Next.js", "PostgreSQL", "Stripe"],
  "category": "SaaS"
}

Scoring guide:
- opportunity (1-10): market size and demand signals strength
- pain_points (1-10): community frustration level / intensity of need
- builder_confidence (1-10): technical feasibility for a solo/small team
- timing (1-10): trend growth and market readiness

Important rules:
1. Every score must be an integer between 1 and 10.
2. complexity must be exactly "low", "medium", or "high".
3. community_signals must include real URLs/data from the provided signals.
4. Be specific and actionable - no generic advice.
5. Output ONLY the JSON object, no markdown fences or extra text."""

# ---------------------------------------------------------------------------
# Theme / topic grouping
# ---------------------------------------------------------------------------

THEME_KEYWORDS: dict[str, list[str]] = {
    "ai-tools": ["ai", "gpt", "llm", "machine learning", "artificial intelligence", "chatbot", "copilot", "openai", "claude", "gemini"],
    "saas": ["saas", "subscription", "b2b", "software as a service", "recurring revenue", "mrr", "arr"],
    "no-code": ["no-code", "nocode", "low-code", "lowcode", "drag and drop", "visual builder", "zapier", "bubble", "webflow"],
    "developer-tools": ["developer", "dev tool", "api", "sdk", "cli", "open source", "github", "devops", "ci/cd", "infrastructure"],
    "fintech": ["fintech", "payment", "banking", "crypto", "defi", "wallet", "trading", "investment", "stripe", "finance"],
    "healthtech": ["health", "medical", "telemedicine", "wellness", "mental health", "fitness", "healthcare", "patient"],
    "edtech": ["education", "learning", "course", "tutoring", "edtech", "student", "teacher", "e-learning"],
    "e-commerce": ["ecommerce", "e-commerce", "shopify", "store", "retail", "dropshipping", "marketplace", "amazon"],
    "productivity": ["productivity", "task", "project management", "workflow", "automation", "notion", "calendar", "time tracking"],
    "remote-work": ["remote", "work from home", "wfh", "distributed", "async", "collaboration", "virtual office"],
    "creator-economy": ["creator", "content", "newsletter", "podcast", "youtube", "influencer", "monetize", "audience"],
    "cybersecurity": ["security", "cybersecurity", "privacy", "encryption", "vpn", "authentication", "identity"],
    "climate-tech": ["climate", "sustainability", "green", "carbon", "renewable", "energy", "environment"],
    "proptech": ["real estate", "property", "proptech", "rental", "housing", "mortgage", "tenant"],
    "marketplace": ["marketplace", "platform", "two-sided", "matching", "gig economy", "freelance"],
    "automation": ["automation", "automate", "bot", "rpa", "workflow", "integration", "scraping"],
}


def _text_for_signal(signal: dict, source: str) -> str:
    """Extract searchable text from a signal depending on its source."""
    parts: list[str] = []
    if source == "reddit":
        parts = [signal.get("title", ""), signal.get("selftext", "")]
    elif source == "hackernews":
        parts = [signal.get("title", "")]
    elif source == "producthunt":
        parts = [
            signal.get("name", ""),
            signal.get("tagline", ""),
            signal.get("description", ""),
        ]
    elif source == "trends":
        parts = [signal.get("keyword", "")]
        for rq in signal.get("related_queries", []):
            parts.append(rq.get("query", ""))
    elif source == "flippa":
        parts = [signal.get("title", ""), signal.get("listing_type", ""), signal.get("industry", "")]
    return " ".join(parts).lower()


def _signal_url(signal: dict, source: str) -> str:
    """Best URL for a signal."""
    if source == "reddit":
        plink = signal.get("permalink", "")
        return f"https://reddit.com{plink}" if plink else ""
    if source == "hackernews":
        sid = signal.get("id", "")
        return f"https://news.ycombinator.com/item?id={sid}" if sid else signal.get("url", "")
    if source == "producthunt":
        return signal.get("url", signal.get("website", ""))
    if source == "flippa":
        return signal.get("url", "")
    return ""


def _signal_metric(signal: dict, source: str) -> str:
    """Human-readable metric string."""
    if source == "reddit":
        return f"Score: {signal.get('score', 0)}, Comments: {signal.get('num_comments', 0)}"
    if source == "hackernews":
        return f"Points: {signal.get('score', 0)}, Comments: {signal.get('descendants', 0)}"
    if source == "producthunt":
        return f"Votes: {signal.get('votes_count', 0)}"
    if source == "trends":
        return f"Growth: {signal.get('growth_percentage', 0)}%"
    if source == "flippa":
        rev = signal.get("monthly_revenue")
        price = signal.get("asking_price")
        return f"Revenue: ${rev}/mo, Price: ${price}" if rev else "Listed on Flippa"
    return ""


def _snippet(signal: dict, source: str) -> str:
    """Short snippet for community_signals."""
    if source == "reddit":
        text = signal.get("selftext", signal.get("title", ""))
    elif source == "hackernews":
        text = signal.get("title", "")
    elif source == "producthunt":
        text = signal.get("tagline", signal.get("description", ""))
    elif source == "trends":
        text = signal.get("keyword", "")
    elif source == "flippa":
        text = signal.get("title", "")
    else:
        text = ""
    return text[:200]


def group_signals(
    all_signals: dict[str, list[dict]],
) -> dict[str, list[dict]]:
    """
    Group signals from all sources by theme using keyword matching.

    Returns {theme: [list of (source, signal) tuples]}.
    """
    groups: dict[str, list[dict]] = defaultdict(list)
    unmatched: list[dict] = []

    for source, signals in all_signals.items():
        for signal in signals:
            text = _text_for_signal(signal, source)
            matched = False
            for theme, keywords in THEME_KEYWORDS.items():
                for kw in keywords:
                    if kw in text:
                        groups[theme].append({"source": source, "signal": signal})
                        matched = True
                        break
                if matched:
                    break
            if not matched:
                unmatched.append({"source": source, "signal": signal})

    # Put unmatched into a generic group if there are enough
    if unmatched:
        groups["general-opportunities"] = unmatched

    log.info(
        "Grouped signals into %d themes (%d unmatched -> general)",
        len(groups),
        len(unmatched),
    )
    return groups


# ---------------------------------------------------------------------------
# OpenAI idea generation
# ---------------------------------------------------------------------------

def _build_user_prompt(theme: str, signal_group: list[dict]) -> str:
    """Build the user prompt for a signal group."""
    lines = [f"Theme: {theme}\n\nMarket signals:\n"]
    for i, entry in enumerate(signal_group[:20], 1):  # cap at 20 signals per group
        src = entry["source"]
        sig = entry["signal"]
        url = _signal_url(sig, src)
        metric = _signal_metric(sig, src)
        snip = _snippet(sig, src)
        lines.append(f"{i}. [{src.upper()}] {snip}")
        if url:
            lines.append(f"   URL: {url}")
        if metric:
            lines.append(f"   Metric: {metric}")
        lines.append("")
    lines.append(
        "\nBased on these signals, generate ONE actionable startup idea card. "
        "Include the actual URLs and metrics from the signals above in community_signals."
    )
    return "\n".join(lines)


def _generate_idea_card(
    client: OpenAI,
    theme: str,
    signal_group: list[dict],
) -> dict | None:
    """Call GPT-4o to generate a single idea card from a signal group."""
    user_prompt = _build_user_prompt(theme, signal_group)

    try:
        response = client.chat.completions.create(
            model=config.OPENAI_MODEL,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=2000,
        )
        content = response.choices[0].message.content
        if not content:
            log.warning("Empty response for theme '%s'", theme)
            return None

        card = json.loads(content)
        return card

    except json.JSONDecodeError as exc:
        log.error("JSON parse error for theme '%s': %s", theme, exc)
        return None
    except Exception as exc:
        log.error("OpenAI API error for theme '%s': %s", theme, exc)
        return None


def _enrich_card(card: dict, theme: str) -> dict:
    """Add metadata fields to a generated card."""
    card["theme"] = theme
    card["generated_at"] = config.now_utc().isoformat()
    card["content_hash"] = config.content_hash(
        card.get("title", "") + card.get("problem", "")
    )
    return card


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> list[dict]:
    """Load all raw data, group by theme, generate idea cards, validate, and save."""
    log.info("Starting idea generator")

    # 1. Load raw data from all sources
    all_signals: dict[str, list[dict]] = {
        "reddit": config.load_latest_raw("reddit"),
        "hackernews": config.load_latest_raw("hackernews"),
        "producthunt": config.load_latest_raw("producthunt"),
        "trends": config.load_latest_raw("trends"),
        "flippa": config.load_latest_raw("flippa"),
    }

    total_signals = sum(len(v) for v in all_signals.values())
    log.info(
        "Loaded signals: reddit=%d, hn=%d, ph=%d, trends=%d, flippa=%d (total=%d)",
        len(all_signals["reddit"]),
        len(all_signals["hackernews"]),
        len(all_signals["producthunt"]),
        len(all_signals["trends"]),
        len(all_signals["flippa"]),
        total_signals,
    )

    if total_signals == 0:
        log.warning("No raw signals found. Run scrapers first.")
        return []

    # 2. Group by theme
    groups = group_signals(all_signals)

    # 3. Generate idea cards via OpenAI
    if not config.OPENAI_API_KEY:
        log.error("OPENAI_API_KEY not set; cannot generate ideas.")
        return []

    client = OpenAI(api_key=config.OPENAI_API_KEY)
    ideas: list[dict] = []
    failed = 0

    for theme, signal_group in groups.items():
        if len(signal_group) < 2:
            log.info("Skipping theme '%s' (only %d signal)", theme, len(signal_group))
            continue

        log.info(
            "Generating idea for theme '%s' (%d signals)",
            theme,
            len(signal_group),
        )
        card = _generate_idea_card(client, theme, signal_group)

        if card is None:
            failed += 1
            continue

        card = _enrich_card(card, theme)

        # 4. Validate
        is_valid, errors = config.validate_idea_card(card)
        if is_valid:
            ideas.append(card)
            log.info("  -> '%s' (valid)", card.get("title", "untitled"))
        else:
            log.warning(
                "  -> '%s' failed validation: %s",
                card.get("title", "untitled"),
                errors,
            )
            # Still keep it but flag it
            card["_validation_errors"] = errors
            ideas.append(card)

    log.info(
        "Idea generation complete: %d ideas generated, %d API failures",
        len(ideas),
        failed,
    )

    # 5. Save
    if ideas:
        config.save_processed(ideas, "generated_ideas.json")

    return ideas


if __name__ == "__main__":
    main()
