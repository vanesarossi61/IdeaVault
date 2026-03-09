"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  TrendingUp,
  Wrench,
  Users,
  Skull,
  Menu,
  X,
  Lightbulb,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Database", href: "/database", icon: Database },
  { label: "Graveyard", href: "/graveyard", icon: Skull },
  { label: "Trends", href: "/trends", icon: TrendingUp },
  { label: "Tools", href: "/tools", icon: Wrench },
  { label: "Hub", href: "/hub", icon: Users },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-1 flex-col border-r border-[#2a2a2a] bg-[#111111]">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 px-6 border-b border-[#2a2a2a]">
            <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">IdeaVault</span>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {sidebarLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#22c55e]/10 text-[#22c55e]"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${
                    active ? "text-[#22c55e]" : "text-[#71717a]"
                  }`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-3 py-4 border-t border-[#2a2a2a]">
            <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4">
              <p className="text-xs text-[#71717a] mb-1">Free Plan</p>
              <p className="text-sm text-white font-medium mb-3">
                3 ideas remaining
              </p>
              <Link
                href="/pricing"
                className="block w-full text-center text-sm font-medium bg-[#22c55e] text-white py-2 rounded-md hover:bg-[#16a34a] transition-colors"
              >
                Upgrade
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#111111] border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#22c55e] rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">IdeaVault</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#a1a1aa] hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-14 left-0 right-0 bg-[#111111] border-b border-[#2a2a2a] p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#22c55e]/10 text-[#22c55e]"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${
                    active ? "text-[#22c55e]" : "text-[#71717a]"
                  }`} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111111] border-t border-[#2a2a2a]">
        <div className="flex items-center justify-around h-16">
          {sidebarLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                  active ? "text-[#22c55e]" : "text-[#71717a]"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="md:pl-64">
        <div className="min-h-screen pt-14 pb-20 md:pt-0 md:pb-0">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
