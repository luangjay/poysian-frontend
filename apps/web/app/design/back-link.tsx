"use client";

// @phosphor-icons/react creates its size/weight context at module scope
// without a "use client" of its own, so importing an icon is what pulls a
// file into the client bundle — not anything this file does itself.
import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

/**
 * A way out, not a destination — so it carries no chrome at rest and only
 * picks up a hover surface. A bare link with no wrapper: the target view hands
 * it to the hero grid as a cell and the counter view gives it a row, so
 * neither needs a box, a collapsed height or a compensating padding.
 */
export function BackLink({
  className,
  href,
  label,
}: {
  className?: string;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: "link",
          size: "sm",
          className: "w-fit px-0 text-muted-foreground",
        }),
        className
      )}
    >
      <ArrowLeftIcon className="size-4" data-icon="inline-start" />
      {label}
    </Link>
  );
}
