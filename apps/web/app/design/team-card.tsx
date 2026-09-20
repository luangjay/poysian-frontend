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
import { type Team } from "./_data";
import { Lineup } from "./lineup";

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
      className={cn(
        "rounded-full",
        team.targetType === "defensive" && "bg-defensive/10 text-defensive",
        team.targetType === "offensive" && "bg-offensive/10 text-offensive",
        team.targetType === "magic" && "bg-magic/10 text-magic",
        team.targetType === "other" && "bg-universal/10 text-universal"
      )}
      variant="default"
    >
      {team.type}
    </Badge>
  );
}

export function TeamCard({
  team,
  counter = false,
  eagerImages = false,
}: {
  team: Team;
  counter?: boolean;
  eagerImages?: boolean;
}) {
  return (
    <Card className="h-full transition-shadow [--card-spacing:--spacing(3)] motion-safe:duration-150 motion-safe:hover:shadow-md motion-reduce:transition-none">
      <CardHeader>
        <div className="flex min-w-0 gap-1.5">
          <TeamTypeBadge team={team} />
          {team.tags?.length ? (
            <>
              {team.tags.slice(0, 1).map((tag) => (
                <Badge
                  key={tag}
                  className="max-w-24 min-w-0 shrink truncate rounded-md text-muted-foreground"
                  title={tag}
                  variant="outline"
                >
                  {tag}
                </Badge>
              ))}
              {team.tags.length > 1 ? (
                <Badge
                  className="rounded-md text-muted-foreground"
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
        <Lineup.Rows loading={eagerImages ? "eager" : "lazy"} team={team} />
      </CardContent>
      <CardFooter className="mt-auto justify-end gap-2">
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
    <Card
      size="sm"
      className="h-full transition-shadow motion-safe:duration-150 motion-safe:hover:shadow-md motion-reduce:transition-none"
    >
      <CardHeader>
        <TeamTypeBadge team={team} />
        <CardTitle className="line-clamp-2">{team.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex items-center"
          aria-label={`ตัวละคร: ${team.title}`}
        >
          {team.heroes.slice(0, 3).map((hero, index) => (
            <div
              key={hero.name}
              className={cn(
                "grid size-10 place-items-center rounded-lg border bg-muted text-sm font-semibold text-primary shadow-xs",
                index > 0 && "-ml-2"
              )}
              title={hero.name}
            >
              {hero.name.slice(0, 1)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
