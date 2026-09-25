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
      {/* Stacked at the ends, side by side in the middle. Under sm there is
          no room for two columns and from lg the block is back in a 28rem
          track, where stacking is what fits again.

          The label rides inside the identity column rather than being an
          ItemHeader or a row of its own. As an ItemHeader it was a second flex
          child of Item, and fit-content sizes a wrapping flex container as if
          nothing wraps, so its width got added to the pictures' instead of
          stacking above them. As a row spanning both columns it cost the block
          a full row of height for eleven characters, and pushed the pictures
          down a row for nothing.

          The identity column is a flex column partly for that reason: it gets
          stretched to the pictures' height, and as a grid its auto rows took
          that surplus and spread themselves through it, which is where the
          text was getting an extra 18px a line. A flex column does not stretch
          along its main axis, so there is nothing to undo.

          The pictures' track is auto, which is the 276 they cost. A fixed
          track only ever guessed at that, and the wrong guess wrapped
          them. */}
      <div className="grid w-full gap-3 sm:grid-cols-[minmax(14rem,1fr)_auto] sm:gap-x-4 lg:grid-cols-none">
        {/* Where the block hugs — only at lg now, in the 28rem column — it
            is meant to end where the pictures do, and three things are
            needed for that. `w-fit` on the wrapper asks for it; `w-0
            min-w-full` stops the text counting toward the width it asks for;
            and `overflow-wrap:anywhere` is what makes that stick for Thai —
            without spaces the condition is one unbreakable run whose
            min-content is wider than the roster, and a grid item's percentage
            min-width falls back to exactly that during track sizing.

            Everywhere else it stretches: hugging left a short block with a
            ragged edge under a full-width lineup. Side by side the 1fr text
            track absorbs the slack and the pictures pin right by being the
            last track; stacked there is no second track, so the slack is the
            row's own and the pictures take the middle of it. */}
        <div className="flex w-0 min-w-full flex-col gap-3 [overflow-wrap:anywhere] sm:col-start-1 lg:col-auto">
          <p className="text-xs font-medium text-muted-foreground">
            กำลังแก้ทีมนี้
          </p>
          <div className="flex flex-col gap-1.5">
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
        </div>
        {/* One grouping, everywhere. It is the lineup surface
            in miniature at every width: the speed above the roster the way
            that surface seats the pill in its corner, and the team's two other
            facts in a column off to the side. A flat row of all four used to
            take over in the middle band, and it was the one arrangement that
            contradicted the surface — the only place the pill sat beside the
            faces instead of over them. Dropping it also handed that band's
            text 388px where the row had left it 238.

            The stacked band is the only one with free space to spend — the
            block fills the row there while the pictures want about 276 of it —
            and it spends it the way the surface does. justify-between puts the
            speed on one edge and the two cells on the other; the roster grows
            a flex-1 group around itself and takes the middle by auto margins,
            which is the surface's own rows exactly: pill in the corner, faces
            centred, variants hard right. Anything else read as a cluster
            adrift in a half-empty box.

            Both are inert elsewhere. Side by side and at lg the track is the
            pictures' own width, so there is no free space to grow into or
            justify. */}
        <div className="flex flex-wrap items-start justify-between gap-3 sm:col-start-2 lg:col-auto">
          <div className="flex flex-1 flex-col items-start gap-2">
            <Lineup.Speed value={variants.speeds[0] ?? "ปกติ"} />
            <TeamHeroRail className="mx-auto" size="sm" team={team} />
          </div>
          <div className="flex flex-col gap-2">
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
    <section
      aria-labelledby="other-counters-heading"
      className="flex flex-col gap-4"
    >
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
 * Both lineups are 28rem, on this page and on the target page, so a team is
 * the same size wherever you meet it. The counter's hangs a column of skill
 * slots off every portrait and still fits: the cap used to be off here on the
 * theory that those columns needed the whole width, but the whole width was
 * 708px for 450px of content, and the rows only drifted apart in it.
 *
 * What the width buys instead is the third column. The left track is capped
 * rather than fluid and the leftover is spread between the tracks, so the two
 * teams sit at the outer edges with the VS in real space between them.
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <BackLink href={`/design?target=${target.id}`} label="กลับ" />

        {/* The counter leads in source because its title is the page's h1 and
            a reference block has no business coming before it, in reading
            order or in the tab ring. `order-first` is what still lets the
            phone meet the target before the plan that answers it; from lg
            both are placed cells and order has nothing left to say. */}
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,28rem)_auto_auto] lg:justify-between lg:gap-x-8 lg:gap-y-2">
          <section
            aria-labelledby="counter-plan-title"
            className="flex flex-col gap-4 lg:contents"
          >
            <div className="flex flex-col gap-2.5 lg:col-start-1 lg:row-start-1 lg:mb-2">
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
                it, so they sit closer to the lineup than the lineup sits to
                the text above it. */}
            <div className="flex flex-col gap-2 lg:contents">
              <Lineup.Surface className="lg:col-start-1 lg:row-start-2">
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
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 text-sm text-muted-foreground lg:col-start-1 lg:row-start-3">
                <p>คลิกที่ตัวละครเพื่อดูรายละเอียด</p>
                <p>
                  โดย{" "}
                  <span className="font-medium text-foreground">BelXenonZ</span>
                </p>
              </div>
            </div>
          </section>

          {/* Only where there are two sides to put it between. The label on
              the target block already says the same thing in words, and says
              it to a screen reader, so this is the visual half of that and
              nothing more.

              Row 2 is the lineup's row, and since the target is bottom-aligned
              to the same row the two blocks occupy near enough the same band —
              centring on the row centres it on both. */}
          <span
            aria-hidden="true"
            className="hidden text-xs font-medium tracking-[0.25em] text-muted-foreground uppercase lg:col-start-2 lg:row-start-2 lg:block lg:self-center"
          >
            VS
          </span>

          <div className="order-first w-full lg:order-none lg:col-start-3 lg:row-start-1 lg:row-end-3 lg:w-fit lg:max-w-md lg:self-end">
            <TargetReference team={target} />
          </div>
        </div>
      </div>

      {others.length ? (
        <OtherCounterTeams ranked={others} target={target} />
      ) : null}
    </div>
  );
}
