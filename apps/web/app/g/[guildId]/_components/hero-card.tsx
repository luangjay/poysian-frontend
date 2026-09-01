import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { type DeployedHero } from "../_data/guild-feed";

type HeroCardProps = {
  hero: Pick<DeployedHero, "name">;
} & React.ComponentProps<"div">;

export function HeroCard({ hero, className, ...props }: HeroCardProps) {
  const initials = hero.name
    .split(" ")
    .map((part) => part.slice(0, 1))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "grid w-16 min-w-0 justify-items-center gap-1 text-center",
        className
      )}
      {...props}
    >
      <div className="flex size-16 items-center justify-center rounded-xl border bg-background text-lg font-semibold shadow-sm">
        {initials}
      </div>
      <span className="w-full truncate text-xs font-medium">{hero.name}</span>
    </div>
  );
}
