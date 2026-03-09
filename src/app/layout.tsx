import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/client";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "IdeaVault - AI-Powered Startup Idea Discovery",
    template: "%s | IdeaVault",
  },
  description:
    "Discover, validate, and track startup ideas powered by AI scoring, trend analysis, and community signals. Find your next big idea.",
  keywords: [
    "startup ideas",
    "AI scoring",
    "trend analysis",
    "idea validation",
    "entrepreneurship",
    "side projects",
    "SaaS ideas",
  ],
  authors: [{ name: "Vane Rossi" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ideavault.app",
    title: "IdeaVault - AI-Powered Startup Idea Discovery",
    description:
      "Discover, validate, and track startup ideas powered by AI scoring and trend analysis.",
    siteName: "IdeaVault",
  },
  twitter: {
    card: "summary_large_image",
    title: "IdeaVault - AI-Powered Startup Idea Discovery",
    description:
      "Discover, validate, and track startup ideas powered by AI scoring and trend analysis.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0a0a0a] text-white`}
      >
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
