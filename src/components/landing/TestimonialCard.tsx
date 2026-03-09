"use client";

import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  rating?: number;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  rating = 5,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#2a2a2a] bg-[#111111] p-6",
        "transition-all duration-300 hover:border-[#3a3a3a]",
        className
      )}
    >
      {/* Stars */}
      {rating > 0 && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={cn(
                "w-4 h-4",
                i < rating ? "text-[#facc15]" : "text-[#3a3a3a]"
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-sm text-[#d4d4d8] leading-relaxed mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img
              src={avatar}
              alt={author}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-[#22c55e]">
              {author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{author}</p>
          <p className="text-xs text-[#71717a]">{role}</p>
        </div>
      </div>
    </div>
  );
}
