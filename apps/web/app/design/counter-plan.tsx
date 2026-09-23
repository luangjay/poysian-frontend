import { Badge } from "@workspace/ui/components/badge";
import { Item, ItemGroup } from "@workspace/ui/components/item";
import { cn } from "@workspace/ui/lib/utils";
import { teamVariants, type Hero, type Team } from "./_data";
import { BackLink } from "./back-link";
import { CounterHeroTile } from "./hero-detail-dialog";
import { HeroPortrait, Lineup, PetChoice } from "./lineup";
import { SectionHeading } from "./section-heading";
import { CounterTeamRow, TeamHeroRail, TeamTypeBadge } from "./team-card";
import { VariantPopover } from "./variant-popover";

/**
 * Opens only when there is something behind it. A package of one pet shows the
 * same portrait in the popover that the cell already shows, so it stays a flat
 * chip — no ring, no fill, and no focusable trigger announcing a view of
 * nothing.
 *
 * The formation has no cell of its own for the same reason, one step further:
 * the compact sprite is countable at 3rem — four red pips and one blue is four
 * back and one front — and the full sprite's only extra is the game's slot
 * numbering, which nothing here uses. So it is always just art.
 */
function PetCell({ pets, size }: { pets: string[]; size?: "default" | "sm" }) {
  if (pets.length < 2) {
    return <Lineup.Pets pets={pets} size={size} />;
  }

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

/**
 * The target at a glance, for the widths where the matchup cannot be a
 * matchup. Under lg the two sides stack, and a stacked pair reads as "enemy
 * first, plan second" — 450px of the thing you are trying to beat before the
 * team that beats it. This says the same in about a fifth of the height, so
 * the plan stays above the fold and the comparison waits for the room to do
 * it properly.
 */
function TargetReference({ team }: { team: Team }) {
  const variants = teamVariants(team);

  return (
    <Item variant="muted">
      {/* Stacked at the ends, side by side in the middle. Under md there is no
          room for two columns and from lg the block is back in a 28rem
          track, where stacking is what fits again. Between them sits one band
          holding the page's full width with nothing to share it, which is
          enough to seat the text beside the pictures rather than above
          them.

          The label is a row of this grid rather than an ItemHeader beside it,
          because Item is a wrapping flex container and fit-content sizes one
          of those as if nothing wraps — a header as a second flex child got
          added to the pictures' width instead of stacking above them, and the
          block came out exactly that much too wide. One child, nothing to
          sum.

          19rem is the pictures' column because it is what the first line of
          them costs: the speed pill, a gap and the roster. A track that fits
          those exactly is what makes the pet and the formation fall to a
          second line instead of the roster falling on its own. */}
      <div className="grid w-full gap-3 md:grid-cols-[minmax(14rem,1fr)_19rem] md:gap-x-4 lg:grid-cols-none">
        <p className="text-xs font-medium text-muted-foreground md:col-span-2 lg:col-auto">
          กำลังแก้ทีมนี้
        </p>
        {/* The block is meant to end where the pictures do, and three things
            are needed for that. `w-fit` on the wrapper asks for it; `w-0
            min-w-full` stops the text counting toward the width it asks for;
            and `overflow-wrap:anywhere` is what makes that stick for Thai —
            without spaces the condition is one unbreakable run whose
            min-content is wider than the roster, and a grid item's percentage
            min-width falls back to exactly that during track sizing. */}
        <div className="grid w-0 min-w-full gap-1.5 [overflow-wrap:anywhere] md:col-start-1 lg:col-auto">
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
        {/* Two groupings out of one markup. Stacked, it is the lineup surface
            in miniature: the speed above the roster the way that surface seats
            the pill in its corner, and the team's two other facts in a column
            off to the side. In the side-by-side band the groups go `contents`
            and their four children become one wrapping row — speed, roster,
            pet, formation — which is the arrangement that pays for the height
            the two columns cost.

            justify-between only where the groups survive, because there the
            block's width is set by the condition rather than by the pictures:
            Thai has no spaces to break at, so the text's min-content is wider
            than the roster and spreading the two groups fills that width
            instead of leaving it trailing. Flattened, end instead — the second
            line lands under the roster rather than under the speed pill, which
            is the surface's own arrangement again: pill off to one side, the
            two cells below the faces. */}
        <div className="flex flex-wrap items-start justify-between gap-3 md:col-start-2 md:justify-end lg:col-auto lg:justify-between">
          <div className="flex flex-col items-start gap-2 md:contents lg:flex">
            <Lineup.Speed value={variants.speeds[0] ?? "ปกติ"} />
            <TeamHeroRail size="sm" team={team} />
          </div>
          <div className="flex flex-col gap-2 md:contents lg:flex">
            <PetCell pets={variants.petPackages[0] ?? [team.pet]} size="sm" />
            <Lineup.Formation
              formation={variants.formations[0] ?? "2-3"}
              size="sm"
            />
          </div>
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
      {/* The back link joins the grid so the target can start level with it
          rather than below everything. The target spans all three rows on the
          right, `items-start` keeping it at the top instead of stretching, so
          the left column's rows are free to size to their own content.

          Source order is the stacked order — back, target, then the counter —
          with the columns placed from lg, so the phone still meets the target
          before the plan that answers it. */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-x-8">
        <BackLink
          className="lg:col-start-1 lg:row-start-1"
          href={`/design?target=${target.id}`}
          label="กลับ"
        />

        <div className="w-fit lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:justify-self-end">
          <TargetReference team={target} />
        </div>

        {/* `lg:contents` so the section keeps its label without becoming a
            cell — its two blocks place themselves in the grid directly. */}
        <section
          aria-labelledby="counter-plan-title"
          className="grid gap-4 lg:contents"
        >
          <div className="grid gap-2.5 lg:col-start-1 lg:row-start-2">
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

          {/* The notes are a caption on the artwork, not a third thing beside
              it, so they sit closer to the lineup than the lineup sits to the
              text above it. */}
          <div className="grid gap-2 lg:col-start-1 lg:row-start-3">
            <Lineup.Surface>
              <Lineup.Rows
                HeroTile={CounterHeroTile}
                loading="eager"
                team={team}
              />
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
                  <Lineup.Formation
                    formation={variants.formations[0] ?? "2-3"}
                  />
                }
              />
            </Lineup.Surface>

            {/* The portraits open a dialog and nothing about a portrait says
                so — a hover lift answers a pointer, but touch gets no such
                hint, so the affordance is spelled out. Paired with the credit
                because both are notes about the lineup, not part of it. */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
              <p>คลิกที่ตัวละครเพื่อดูรายละเอียด</p>
              <p>
                โดย{" "}
                <span className="font-medium text-foreground">BelXenonZ</span>
              </p>
            </div>
          </div>
        </section>
      </div>

      {others.length ? (
        <OtherCounterTeams ranked={others} target={target} />
      ) : null}
    </div>
  );
}
