import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ideavault.app";

/**
 * Generate consistent metadata for any page.
 * Usage in page.tsx:
 *   export const metadata = generateMetadata({ title: "Ideas", description: "..." });
 *
 * Or use generatePageMetadata() directly in generateMetadata() for dynamic pages.
 */

interface MetaTagsConfig {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
  noIndex?: boolean;
}

export function generatePageMetadata(config: MetaTagsConfig): Metadata {
  const {
    title,
    description,
    path = "",
    image = "/og-default.png",
    type = "website",
    publishedTime,
    tags,
    noIndex = false,
  } = config;

  const fullTitle = title === "IdeaVault" ? title : `${title} | IdeaVault`;
  const url = `${BASE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  return {
    title: fullTitle,
    description,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "IdeaVault",
      type,
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: "@ideavault",
    },
    ...(tags && tags.length > 0 && {
      keywords: tags,
    }),
  };
}

/**
 * Default metadata for the entire app (use in root layout.tsx)
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "IdeaVault — Validated Business Ideas & Market Intelligence",
    template: "%s | IdeaVault",
  },
  description:
    "Discover data-validated business ideas, market trends, builder tools, and startup post-mortems. Your launchpad for the next big thing.",
  keywords: [
    "business ideas",
    "startup ideas",
    "market trends",
    "side project",
    "micro-saas",
    "indie hacker",
    "builder tools",
    "startup graveyard",
    "idea validation",
    "market research",
  ],
  authors: [{ name: "IdeaVault" }],
  creator: "IdeaVault",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "IdeaVault",
    title: "IdeaVault — Validated Business Ideas & Market Intelligence",
    description:
      "Discover data-validated business ideas, market trends, builder tools, and startup post-mortems.",
    images: [
      {
        url: `${BASE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "IdeaVault",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IdeaVault",
    description:
      "Discover data-validated business ideas, market trends, and builder tools.",
    creator: "@ideavault",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

/**
 * JSON-LD structured data for ideas (rich snippets)
 */
export function generateIdeaJsonLd(idea: {
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: idea.title,
    description: idea.description,
    url: `${BASE_URL}/ideas/${idea.slug}`,
    datePublished: idea.createdAt,
    publisher: {
      "@type": "Organization",
      name: "IdeaVault",
      url: BASE_URL,
    },
    ...(idea.tags && {
      keywords: idea.tags.join(", "),
    }),
  };
}

/**
 * JSON-LD for the website (homepage)
 */
export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "IdeaVault",
    url: BASE_URL,
    description:
      "Discover data-validated business ideas, market trends, builder tools, and startup post-mortems.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/ideas?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
