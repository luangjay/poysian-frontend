import { Badge } from "@workspace/ui/components/badge";
import { Item, ItemGroup, ItemHeader } from "@workspace/ui/components/item";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import {
  teamVariants,
  type Hero,
  type TargetFormation,
  type Team,
} from "./_data";
import { BackLink } from "./back-link";
import { CounterHeroTile } from "./hero-detail-dialog";
import {
  formationLabel,
  FormationPreview,
  HeroPortrait,
  Lineup,
  PetChoice,
} from "./lineup";
import { SectionHeading } from "./section-heading";
import { CounterTeamRow, TeamHeroRail, TeamTypeBadge } from "./team-card";
import { VariantPopover } from "./variant-popover";

/**
 * The pet and formation cells, defined once because the target reference and
 * the lineup under it both show them and both have to open the same way — the
 * pet cell especially, since a package's alternatives exist nowhere else on
 * the page. The formation's name lives in the popover rather than under the
 * sprite: a caption reading "หน้า 4 / หลัง 1" was wider than the art it
 * labelled and broke the rhythm of a row of tightly-captioned portraits.
 */
function PetCell({ pets, size }: { pets: string[]; size?: "default" | "sm" }) {
  return (
    <VariantPopover
      content={<PetChoice pets={pets} />}
      title="สัตว์เลี้ยง"
      triggerLabel="ดูสัตว์เลี้ยงทั้งหมด"
    >
      <Lineup.Pets pets={pets} size={size} />
    </VariantPopover>
  );
}

function FormationCell({
  formation,
  size,
}: {
  formation: TargetFormation;
  size?: "default" | "sm";
}) {
  return (
    <VariantPopover
      align="end"
      content={
        <div className="grid justify-items-center gap-2">
          <FormationPreview formation={formation} />
          <p className="text-sm font-medium">{formationLabel(formation)}</p>
        </div>
      }
      title="แผนการรบ"
      triggerLabel="ดูแผนการรบ"
    >
      <Lineup.Formation formation={formation} size={size} />
    </VariantPopover>
  );
}

/**
 * The target: pictures on the left, words on the right. The speed pill leads
 * the picture column because that is where it sits on the lineup surface
 * below, which makes this read as a miniature of it — and because pictures
 * lead here while text leads on the target page, the two do not open on the
 * same shape.
 *
 * The label lives inside the surface rather than floating above it, which is
 * what ItemHeader is for — it takes a line of its own and leaves the two
 * columns the line below.
 *
 * What keeps it from reading as one of the counters further down is not its
 * shape but what a list item has and this does not: no rank, no arrow, no
 * link, and a muted fill instead of a card. Anatomy says "a team"; those four
 * say "pick me".
 *
 * Source order is the stacked order — name first, then the roster — with the
 * columns placed explicitly from sm, so neither reading compromises for the
 * other.
 */
function TargetReference({ team }: { team: Team }) {
  const variants = teamVariants(team);
  const formation = variants.formations[0] ?? "2-3";

  return (
    <Item variant="muted">
      <ItemHeader>
        <p className="text-xs font-medium text-muted-foreground">
          กำลังแก้ทีมนี้
        </p>
      </ItemHeader>
      <div className="grid w-full gap-x-6 gap-y-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <div className="grid gap-1.5 sm:col-start-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="truncate font-medium" title={team.title}>
              {team.title}
            </p>
            <TeamTypeBadge team={team} />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {team.condition}
          </p>
        </div>

        {/* One row: the speed it moves at, then who is in it, then how it
            stands. The heroes and their pet sit together because the pet is
            part of the roster; the rail's own px-3 is what sets that group
            apart, so the gaps either side of it can stay even. */}
        <div className="flex flex-wrap items-center gap-4 sm:col-start-1 sm:row-start-1">
          <Lineup.Speed value={variants.speeds[0] ?? "ปกติ"} />
          <div className="flex items-center gap-4">
            <TeamHeroRail team={team} />
            <PetCell pets={variants.petPackages[0] ?? [team.pet]} size="sm" />
          </div>
          <FormationCell formation={formation} size="sm" />
        </div>
      </div>
    </Item>
  );
}

/**
 * Who moves first, as faces rather than a sentence. The hover card is 16rem so
 * it takes the small tile; the dialog has a phone's width to spend, so it takes
 * the full one. The caret sits half a portrait down less half a line of text,
 * which is why the offset differs between the two.
 */
function SpeedOrder({
  heroes,
  size = "md",
}: {
  heroes: Hero[];
  size?: "sm" | "md";
}) {
  return (
    <ol className="flex items-start justify-center gap-1.5">
      {heroes.map((hero, index) => (
        <li key={hero.name} className="flex items-start gap-1.5">
          {index ? (
            <span
              aria-hidden="true"
              className={cn(
                "text-sm text-muted-foreground",
                size === "sm" ? "mt-4" : "mt-6"
              )}
            >
              &gt;
            </span>
          ) : null}
          <HeroPortrait hero={hero} size={size} />
        </li>
      ))}
    </ol>
  );
}

/**
 * The same rows the target page listed, minus this one — and carrying the rank
 * they had there, so a number means the same team on both pages. A carousel of
 * a third card shape used to live here, which hid entries behind a horizontal
 * scroll and gave one object three silhouettes across the route.
 */
function OtherCounterTeams({
  ranked,
  target,
}: {
  ranked: { rank: number; team: Team }[];
  target: Team;
}) {
  return (
    <section aria-labelledby="other-counters-heading" className="grid gap-4">
      <Separator />
      <SectionHeading
        id="other-counters-heading"
        title="ทีมอื่น"
        description="ทีมแก้อื่นสำหรับเป้าหมายเดียวกัน"
      />
      <ItemGroup>
        {ranked.map(({ rank, team }) => (
          <CounterTeamRow
            key={team.id}
            rank={rank}
            target={target}
            team={team}
          />
        ))}
      </ItemGroup>
    </section>
  );
}

/**
 * A plan, not a profile — which is why it does not borrow the target page's
 * two-column header. That page splits because its lineup shares the row with
 * text; here the lineup is the answer, and it hangs a column of skill slots
 * off every portrait, so it wants the whole width rather than a 28rem track
 * that squeezes those columns into the gaps between heroes.
 *
 * The skill order lives there too, which is why no list of it follows below:
 * numbering the slots on the portraits already says who casts what and when,
 * and repeating it as rows was the same three facts said twice.
 */
export function CounterPlan({
  counters,
  target,
  team,
}: {
  counters: Team[];
  target: Team;
  team: Team;
}) {
  const variants = teamVariants(team);
  const pets = variants.petPackages[0] ?? [team.pet];
  const speedOrder = team.speedOrder ?? team.heroes.map((hero) => hero.name);
  // flatMap rather than find + a type guard: a name with no hero behind it
  // simply contributes nothing instead of a hole to filter out later.
  const speedLineup = speedOrder.flatMap((name) =>
    team.heroes.filter((hero) => hero.name === name)
  );
  const others = counters
    .map((counter, index) => ({ rank: index + 1, team: counter }))
    .filter((entry) => entry.team.id !== team.id);

  return (
    <div className="grid gap-8">
      <section aria-labelledby="counter-plan-title" className="grid gap-4">
        <BackLink href={`/design?target=${target.id}`} label="กลับ" />
        <TargetReference team={target} />

        <div className="grid gap-2.5">
          <h1
            id="counter-plan-title"
            className="text-2xl font-semibold tracking-tight"
          >
            {team.title}
          </h1>
          {team.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {team.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="h-6 rounded-md px-2.5 text-sm"
                  variant="outline"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {team.condition}
          </p>
        </div>

        {/* The lineup's own size, not the page's. Uncapped it stretched to the
            container on a desktop and left the rows stranded as a 24rem island
            with the variant strip pinned a screen away; 32rem is rows + gap +
            strip + padding, so the rail meets the strip with nothing between. */}
        <Lineup.Surface>
          <Lineup.Rows HeroTile={CounterHeroTile} loading="eager" team={team} />
          {/* Read-only, but the same hover-or-dialog surface the target
              page's pickers use — a cell that opens is a cell that opens,
              whether or not there is anything to choose. */}
          <Lineup.Variants
            speed={
              <VariantPopover
                align="start"
                content={<SpeedOrder heroes={speedLineup} size="sm" />}
                dialogContent={<SpeedOrder heroes={speedLineup} />}
                title="ลำดับความเร็ว"
                triggerLabel="ดูลำดับความเร็ว"
              >
                <Lineup.Speed value={variants.speeds[0] ?? "ปกติ"} />
              </VariantPopover>
            }
            pets={<PetCell pets={pets} />}
            formation={
              <FormationCell formation={variants.formations[0] ?? "2-3"} />
            }
          />
        </Lineup.Surface>

        {/* The speed order moved into the strip's own cell, so what is left
            under the artwork is who worked this out. */}
        <p className="text-sm text-muted-foreground">
          โดย <span className="font-medium text-foreground">BelXenonZ</span>
        </p>
      </section>

      {others.length ? (
        <OtherCounterTeams ranked={others} target={target} />
      ) : null}
    </div>
  );
}
