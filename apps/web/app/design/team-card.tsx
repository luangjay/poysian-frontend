import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@workspace/ui/components/item";
import { cn } from "@workspace/ui/lib/utils";
import { teamVariants, type Team } from "./_data";
import { HeroPortrait, Lineup, PetSummary } from "./lineup";

/**
 * A counter team has no target type, so it keeps the plain secondary badge;
 * a target is tinted by which kind of team it is.
 */
const teamTypeBadgeVariants = cva("rounded-full", {
  variants: {
    targetType: {
      defensive: "bg-defensive/10 text-defensive",
      offensive: "bg-offensive/10 text-offensive",
      magic: "bg-magic/10 text-magic",
      other: "bg-universal/10 text-universal",
    },
  },
});

export function TeamTypeBadge({
  className,
  team,
}: {
  /** For sizing only — the colour is the badge's whole job. */
  className?: string;
  team: Pick<Team, "targetType" | "type">;
}) {
  return (
    <Badge
      className={cn(
        teamTypeBadgeVariants({ targetType: team.targetType, className })
      )}
      variant={team.targetType ? "default" : "secondary"}
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

/** The lead tag, plus a count for the rest — the card and the row both show
 *  tags in a strip too narrow to hold more than one. */
function TeamTagRow({
  children,
  team,
}: {
  children?: ReactNode;
  team: Pick<Team, "tags" | "targetType" | "type">;
}) {
  const [leadTag] = team.tags ?? [];
  const extraTagCount = Math.max((team.tags?.length ?? 0) - 1, 0);

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      <TeamTypeBadge team={team} />
      {leadTag ? (
        <Badge
          className="max-w-24 min-w-0 shrink truncate rounded-md"
          title={leadTag}
          variant="outline"
        >
          {leadTag}
        </Badge>
      ) : null}
      {extraTagCount ? (
        <Badge
          className="size-5 justify-center rounded-md p-0 text-[11px] tabular-nums"
          variant="outline"
        >
          +{extraTagCount}
        </Badge>
      ) : null}
      {children}
    </div>
  );
}

/**
 * Column widths live here so the header and every row cannot drift apart —
 * the header is only worth having if it lines up with what it names.
 */
/**
 * A counter as one row of a table, after the game's own "popular teams" list:
 * rank, formation, heroes, pet, name — and the way out kept behind a rule so
 * it reads as the control and not as the last column.
 *
 * Only the name survives from the card. The condition and the tags were what
 * made the row a card with a list's job.
 */
export function CounterTeamRow({
  rank,
  target,
  team,
}: {
  rank: number;
  target: Team;
  team: Team;
}) {
  return (
    <Item
      className="gap-4 bg-card"
      render={<Link href={`/design?target=${target.id}&counter=${team.id}`} />}
      variant="outline"
    >
      {/* Everything that can wrap lives in here, so the arrow outside it
          never joins a wrapped line — it stays level with the whole card
          instead of centring on whichever line it landed on. */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
        {/* Rank, name and description are one thing: which team this is, and
          where the guild put it.

          A max, not a width: it grows with the row and stops at a measure the
          description is still readable at. The fixed w-48/w-64 it replaces was
          me stopping the text from eating the row — which pinned it to an odd
          width on wide screens for no reason a reader could see. */}
        <ItemContent className="w-full flex-none flex-row items-start gap-3 sm:w-auto sm:max-w-md sm:flex-1">
          <span className="shrink-0 text-sm leading-snug font-semibold text-muted-foreground tabular-nums">
            {rank}
          </span>
          <div className="grid min-w-0 gap-1">
            <ItemTitle>{team.title}</ItemTitle>
            <ItemDescription>{team.condition}</ItemDescription>
          </div>
        </ItemContent>

        {/* Plain elements, not ItemMedia. ItemMedia top-aligns itself the moment
          the row has a description — `group-has-data-[slot=item-description]`
          — and that rule outranks a plain `self-center`, so the pet sat at the
          top of the row no matter what was added here. These are columns, not
          an icon beside text, so the component's opinion does not apply. */}
        <div className="flex items-center gap-4 sm:ml-auto">
          {/* No width, so `px` is a real knob: it widens the group rather than
            squeezing `shrink-0` portraits, and it is how far the rail fades. */}
          <div className="relative flex shrink-0 items-center gap-2 px-3 lg:gap-3 lg:px-6">
            {/* The lineup's rail, carried into the row: it runs behind the
              portraits and fades at both ends, so the three read as one team
              rather than three loose tiles. Centred on the portraits rather
              than the tiles — the offset backs out the name label below. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-[calc(50%-0.5625rem)] h-1.5 rounded-full bg-linear-to-r from-transparent via-muted-foreground/20 to-transparent"
            />
            {team.heroes.map((hero) => (
              <HeroPortrait
                key={hero.name}
                className="w-14 lg:w-18"
                hero={hero}
                rowBadge
              />
            ))}
          </div>
          <PetSummary
            className="w-10 lg:w-12"
            pets={teamVariants(team).petPackages[0] ?? [team.pet]}
          />
        </div>
      </div>
      {/* Item centres its children, so the arrow sits at the right, level with
          the card — no positioning needed. */}
      <ItemActions>
        <ArrowUpRightIcon
          aria-hidden="true"
          className="text-muted-foreground"
        />
      </ItemActions>
    </Item>
  );
}

export function TeamCard({
  team,
  eagerImages = false,
  sharedHeroNames,
}: {
  team: Team;
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
        <TeamTagRow team={team} />
        <CardAction>
          <span className="text-xs text-muted-foreground">
            {team.counters ? `${team.counters} ทีมแก้` : "รอทีมแก้"}
          </span>
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
      <CardFooter className="mt-auto justify-between gap-2">
        {sharedCount ? (
          <Badge
            className="gap-1.5 rounded-md text-muted-foreground"
            variant="outline"
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-primary"
            />
            ใช้ตัวร่วมกัน {sharedCount}
          </Badge>
        ) : null}
        <span className="ml-auto flex items-center gap-1 text-xs font-medium text-foreground">
          ดูทีมแก้
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
          aria-label={`ตัวละคร: ${team.title}`}
          className="flex items-start gap-1"
          role="group"
        >
          {team.heroes.slice(0, 3).map((hero) => (
            <HeroPortrait key={hero.name} hero={hero} size="sm" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
