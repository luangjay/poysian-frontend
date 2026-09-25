import { type ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

/**
 * On the discovery view this is live feedback for the filters right below it,
 * so the numeral carries the weight and the unit recedes — bumping both would
 * have it competing with the heading instead of answering it.
 */
export function TeamCount({
  live = false,
  value,
}: {
  live?: boolean;
  value: number;
}) {
  return (
    <p
      aria-live={live ? "polite" : undefined}
      className="text-sm text-muted-foreground"
    >
      <span className="text-lg font-semibold text-foreground tabular-nums">
        {value}
      </span>{" "}
      ทีม
    </p>
  );
}

export function SectionHeading({
  aside,
  description,
  id,
  level = 2,
  title,
}: {
  aside?: ReactNode;
  description?: string;
  id: string;
  /** The discovery list is the page subject, so it owns the h1. */
  level?: 1 | 2;
  title: string;
}) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="flex flex-col gap-1.5">
        {/* The level is the size: an h1 is the page's subject and matches the
            target and counter titles at text-2xl, an h2 labels a list inside
            one. They were both text-xl, which left the discovery page's own
            title the same size as the card titles under it. */}
        <Heading
          id={id}
          className={cn(
            "font-semibold tracking-tight",
            level === 1 ? "text-2xl" : "text-xl"
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {aside}
    </div>
  );
}
