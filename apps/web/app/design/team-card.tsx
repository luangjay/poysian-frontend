import { ArrowUpRightIcon, SwordIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { type TargetTeamType, type Team } from "./_data";
import { HeroPortrait, Lineup } from "./lineup";

const teamTypeColor: Record<TargetTeamType, { badge: string; text: string }> = {
  defensive: {
    badge: "bg-defensive/10 text-defensive",
    text: "text-defensive",
  },
  offensive: {
    badge: "bg-offensive/10 text-offensive",
    text: "text-offensive",
  },
  magic: { badge: "bg-magic/10 text-magic", text: "text-magic" },
  other: { badge: "bg-universal/10 text-universal", text: "text-universal" },
};

export function teamTypeTextClass(team: Pick<Team, "targetType">) {
  return team.targetType ? teamTypeColor[team.targetType].text : "text-primary";
}

export function TeamTypeBadge({
  team,
}: {
  team: Pick<Team, "targetType" | "type">;
}) {
  if (!team.targetType) {
    return (
      <Badge className="rounded-full" variant="secondary">
        {team.type}
      </Badge>
    );
  }

  return (
    <Badge
      className={cn("rounded-full", teamTypeColor[team.targetType].badge)}
      variant="default"
    >
      {team.type}
    </Badge>
  );
}

/**
 * Selection affordance for a card inside a link. Both states lift and take a
 * shadow; only focus-visible adds a ring. A pointer already knows what it is
 * over, so the ring would be a third redundant signal there — but lift and
 * shadow alone are not a sufficient keyboard focus indicator. The ring is the
 * project default (`ring-3 ring-ring/50`, as on Button and Input).
 */
export const selectableCard = cn(
  // Tailwind v4 lifts with the `translate` property, not `transform` —
  // transitioning `transform` here animates nothing and the lift snaps.
  "transition-[translate,box-shadow] motion-safe:duration-150 motion-reduce:transition-none",
  "group-hover:shadow-md group-focus-visible:shadow-md",
  "group-focus-visible:ring-3 group-focus-visible:ring-ring/50",
  "motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-y-1"
);

export function TeamCard({
  team,
  counter = false,
  eagerImages = false,
  sharedHeroNames,
}: {
  team: Team;
  counter?: boolean;
  eagerImages?: boolean;
  sharedHeroNames?: string[];
}) {
  const sharedCount = sharedHeroNames
    ? team.heroes.filter((hero) => sharedHeroNames.includes(hero.name)).length
    : 0;

  return (
    <Card
      className={cn("h-full [--card-spacing:--spacing(3)]", selectableCard)}
    >
      <CardHeader>
        <div className="flex min-w-0 gap-1.5">
          <TeamTypeBadge team={team} />
          {team.tags?.length ? (
            <>
              {team.tags.slice(0, 1).map((tag) => (
                <Badge
                  key={tag}
                  className="max-w-24 min-w-0 shrink truncate rounded-md"
                  title={tag}
                  variant="outline"
                >
                  {tag}
                </Badge>
              ))}
              {team.tags.length > 1 ? (
                <Badge
                  className="size-5 justify-center rounded-md p-0 text-[11px] tabular-nums"
                  variant="outline"
                >
                  +{team.tags.length - 1}
                </Badge>
              ) : null}
            </>
          ) : null}
        </div>
        <CardAction>
          {counter ? (
            <SwordIcon aria-hidden="true" className="text-primary" />
          ) : (
            <span className="text-xs text-muted-foreground">
              {team.counters ? `${team.counters} ทีมแก้` : "รอทีมแก้"}
            </span>
          )}
        </CardAction>
        <CardTitle className="truncate text-lg font-semibold">
          {team.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Lineup.Surface>
          <Lineup.Rows
            loading={eagerImages ? "eager" : "lazy"}
            sharedHeroNames={sharedHeroNames}
            team={team}
          />
        </Lineup.Surface>
      </CardContent>
      <CardFooter className="mt-auto items-center justify-between gap-2">
        {sharedCount ? (
          <Badge
            className="gap-1.5 rounded-md text-muted-foreground"
            variant="outline"
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-primary"
            />
            ใช้ตัวร่วม {sharedCount}
          </Badge>
        ) : (
          <span />
        )}
        <span className="flex items-center gap-1 text-xs font-medium text-foreground">
          {counter ? "ดูกลยุทธ์" : "ดูทีมแก้"}
          <ArrowUpRightIcon aria-hidden="true" />
        </span>
      </CardFooter>
    </Card>
  );
}

export function CounterTeamMiniCard({ team }: { team: Team }) {
  return (
    <Card size="sm" className={cn("h-full", selectableCard)}>
      <CardHeader>
        <TeamTypeBadge team={team} />
        <CardTitle className="line-clamp-2">{team.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex items-start gap-1"
          aria-label={`ตัวละคร: ${team.title}`}
        >
          {team.heroes.slice(0, 3).map((hero) => (
            <HeroPortrait key={hero.name} hero={hero} size="sm" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
