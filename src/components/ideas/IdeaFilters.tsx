"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Complexity } from "@/types";

export interface FilterState {
  search: string;
  complexity?: Complexity;
  tag?: string;
  sortBy: "createdAt" | "composite" | "featuredDate";
  sortOrder: "asc" | "desc";
}

interface IdeaFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  tags?: { id: string; name: string; slug: string; _count: { ideas: number } }[];
  totalCount?: number;
}

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "composite-desc", label: "Highest Score" },
  { value: "composite-asc", label: "Lowest Score" },
  { value: "featuredDate-desc", label: "Recently Featured" },
] as const;

const COMPLEXITY_OPTIONS: { value: Complexity; label: string; color: string }[] = [
  { value: "LOW", label: "Low Complexity", color: "text-green-400" },
  { value: "MEDIUM", label: "Medium Complexity", color: "text-yellow-400" },
  { value: "HIGH", label: "High Complexity", color: "text-red-400" },
];

export function IdeaFilters({ filters, onFiltersChange, tags = [], totalCount }: IdeaFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  const currentSort = `${filters.sortBy}-${filters.sortOrder}`;
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? "Sort";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput });
  };

  const handleSearchClear = () => {
    setSearchInput("");
    onFiltersChange({ ...filters, search: "" });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [FilterState["sortBy"], FilterState["sortOrder"]];
    onFiltersChange({ ...filters, sortBy, sortOrder });
  };

  const handleComplexityChange = (complexity?: Complexity) => {
    onFiltersChange({ ...filters, complexity });
  };

  const handleTagChange = (tag?: string) => {
    onFiltersChange({ ...filters, tag });
  };

  const hasActiveFilters = filters.complexity || filters.tag || filters.search;

  const clearAllFilters = () => {
    setSearchInput("");
    onFiltersChange({
      search: "",
      complexity: undefined,
      tag: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  return (
    <div className="space-y-3">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search ideas by title, problem, or solution..."
            className="pl-9 pr-8 bg-zinc-900/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus:border-green-500/50"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </form>

        <div className="flex gap-2">
          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 min-w-[140px] justify-between"
              >
                <SortIcon className="h-3.5 w-3.5 mr-2 text-zinc-500" />
                <span className="text-xs">{currentSortLabel}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
              <DropdownMenuLabel className="text-zinc-500 text-xs">Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={cn(
                    "text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 text-xs",
                    currentSort === option.value && "text-green-400"
                  )}
                >
                  {option.label}
                  {currentSort === option.value && (
                    <CheckIcon className="h-3 w-3 ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Complexity filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800",
                  filters.complexity && "border-green-500/30 text-green-400"
                )}
              >
                <FilterIcon className="h-3.5 w-3.5 mr-2 text-zinc-500" />
                <span className="text-xs">{filters.complexity ?? "Complexity"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
              <DropdownMenuLabel className="text-zinc-500 text-xs">Complexity</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                onClick={() => handleComplexityChange(undefined)}
                className="text-zinc-300 focus:bg-zinc-800 text-xs"
              >
                All
              </DropdownMenuItem>
              {COMPLEXITY_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => handleComplexityChange(opt.value)}
                  className={cn(
                    "focus:bg-zinc-800 text-xs",
                    opt.color,
                    filters.complexity === opt.value && "bg-zinc-800"
                  )}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tags row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleTagChange(undefined)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors",
              !filters.tag
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
            )}
          >
            All Ideas
          </button>
          {tags.slice(0, 15).map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagChange(tag.slug)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors",
                filters.tag === tag.slug
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
              )}
            >
              {tag.name}
              <span className="ml-1 text-zinc-600">{tag._count.ideas}</span>
            </button>
          ))}
        </div>
      )}

      {/* Active filters + count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {totalCount !== undefined && (
            <span className="text-xs text-zinc-500">
              {totalCount} idea{totalCount !== 1 ? "s" : ""}
            </span>
          )}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline icons
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SortIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
