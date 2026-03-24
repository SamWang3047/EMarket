"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/lib/constants";

type ProductImageProps = {
  alt: string;
  category: ProductCategory;
  className?: string;
  imageClassName?: string;
  imageUrl?: string | null;
};

function normalizeImageUrl(imageUrl?: string | null) {
  const trimmed = imageUrl?.trim();

  if (!trimmed) {
    return null;
  }

  let normalized = trimmed;

  if (normalized.startsWith("//")) {
    normalized = `https:${normalized}`;
  } else if (normalized.startsWith("http://")) {
    normalized = `https://${normalized.slice("http://".length)}`;
  }

  try {
    const url = new URL(normalized);

    if (url.hostname === "images.unsplash.com") {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      if (!url.searchParams.has("w")) {
        url.searchParams.set("w", "1200");
      }
      if (!url.searchParams.has("q")) {
        url.searchParams.set("q", "80");
      }
      return url.toString();
    }
  } catch {
    return normalized;
  }

  return normalized;
}

export function ProductImage({
  alt,
  category,
  className,
  imageClassName,
  imageUrl
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const normalizedImageUrl = useMemo(
    () => normalizeImageUrl(imageUrl),
    [imageUrl]
  );

  useEffect(() => {
    setHasError(false);
  }, [normalizedImageUrl]);

  if (normalizedImageUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={normalizedImageUrl}
        alt={alt}
        className={cn("h-full w-full object-cover", className, imageClassName)}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-between bg-[linear-gradient(145deg,rgba(255,248,238,0.98),rgba(227,208,194,0.82))] p-4 text-[var(--text)]",
        className
      )}
    >
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        <span>{CATEGORY_LABELS[category]}</span>
        <span>EMarket</span>
      </div>
      <div className="space-y-3">
        <div className="h-16 rounded-[24px] bg-white/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]" />
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">
          <div className="h-6 rounded-full bg-[rgba(35,29,25,0.14)]" />
          <div className="h-6 rounded-full bg-white/75" />
        </div>
        <p className="text-sm font-medium leading-6 text-[var(--muted)]">
          {alt}
        </p>
      </div>
    </div>
  );
}
