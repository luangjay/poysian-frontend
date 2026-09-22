import { type ReactNode } from "react";

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
      <div className="grid gap-1.5">
        <Heading id={id} className="text-xl font-semibold tracking-tight">
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
