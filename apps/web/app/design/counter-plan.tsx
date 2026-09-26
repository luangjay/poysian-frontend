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
 * align="end" because the cell is the right-most thing in whatever holds it —
 * the surface's variants column, the reference block's pair. Centred, a 16rem
 * card on a 4.5rem cell hangs 6rem past it either way, which in the reference
 * block means past the page's content edge. Anchoring the card's right edge to
 * the cell's opens it up and to the left, into room that exists. The speed
 * pill takes align="start" for the mirror of the same reason.
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
      align="end"
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

  // h-full so the block fills the row it is stretched over at lg. Nothing
  // inside it grows — the surplus lands under the pictures, which is where a
  // reference block can afford it.
  return (
    <Item variant="muted">
      {/* Stacked at the ends, side by side in the middle. Seating the text
          beside the pictures costs 516 — 14rem of text, a gap, and the 276 the
          pictures come to — and that is the whole rule, here and everywhere
          else on the route a team is drawn: a browse card at 300 stacks, a
          counter row at 960 does not. Under sm the block is under 516; from lg
          it is back in a 28rem track and under it again, which is what
          lg:grid-cols-none is for. Widen that track past 516 and this is the
          line to revisit.

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
      <div className="grid w-full gap-3 sm:grid-cols-[minmax(14rem,1fr)_auto] sm:gap-x-4">
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
        <div className="flex w-0 min-w-full flex-col gap-3 [overflow-wrap:anywhere] sm:col-start-1">
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
        <div className="flex flex-wrap items-start justify-between gap-3 sm:col-start-2">
          <div className="flex flex-1 flex-col items-start gap-2">
            <Lineup.Speed value={variants.speeds[0] ?? "???"} />
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
            both are placed cells and order has nothing left to say.

            gap-6 stacked, which is only below lg — a step above the gap-4 the
            counter uses between its own parts and a step below the gap-8
            between page sections. At gap-4 it matched the counter's internals
            exactly, so the target read as one more item in the plan's stack
            rather than the other half of a matchup. */}
        <div className="flex flex-col gap-6">
          {/* The target page's own split, reused rather than reinvented: a
              1fr text column and a 28rem lineup. Both pages then describe a
              team the same way, and the lineup lands back at the width it was
              tuned for — full-bleed it was 960 holding a 384 row, which is
              230px of empty surface a side, and the 28rem track puts its rows
              at 332 with none. */}
          <section
            aria-labelledby="counter-plan-title"
            className="order-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-start lg:gap-x-8"
          >
            {/* The target page's identity block, part for part: eyebrow,
                title, badges, lead. The type badge is the one fact a counter
                carries that the picture does not — heroes and pets lock for
                the rest of the war, so which type a plan spends is what a
                player is budgeting. Counters have no tags, so this row is the
                type alone, which is also the case the target page has to
                survive. */}
            <div className="flex flex-col gap-3 lg:max-w-sm">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground">
                  ทีมแก้
                </p>
                <h1
                  id="counter-plan-title"
                  className="text-2xl font-semibold tracking-tight"
                >
                  {team.title}
                </h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <TeamTypeBadge className="h-6 px-2.5 text-sm" team={team} />
                {team.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    className="h-6 rounded-md px-2.5 text-sm"
                    variant="outline"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {/* text-base from lg to fill the column beside the lineup, the
                  same step the target page's lead takes. */}
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                {team.condition}
              </p>
            </div>

            {/* The note is a caption on the artwork, not a third thing beside
                it, so it sits closer to the lineup than the lineup sits to the
                text above it. */}
            <div className="flex flex-col gap-2">
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
                      <Lineup.Speed value={variants.speeds[0] ?? "???"} />
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
                hint, so the affordance is spelled out. */}
              <p className="text-sm text-muted-foreground">
                คลิกที่ตัวละครเพื่อดูรายละเอียด
              </p>
            </div>
          </section>

          {/* Only where there are two sides to put it between. The label on
              the target block already says the same thing in words, and says
              it to a screen reader, so this is the visual half of that and
              nothing more.

              The rule is what makes it the join rather than a third column.
              justify-between spends the row's leftover on the gutters, so the
              mark sits about 78px from either block — far enough to belong to
              neither. It fades out at both ends instead of ruling the full
              height: the pairing needs anchoring, not a partition, and a
              gradient that dissolves is the lineup's own hero rail again.

              Stacked it is the same element turned ninety degrees, between the
              target and the plan. Reading order already puts them in sequence
              there, but sequence is not opposition, and a stacked reader
              otherwise never gets the framing the side-by-side one does.

              self-stretch over row 2, which is the lineup's row. The target is
              stretched over that same row, so the two blocks span exactly the
              same band and the mark lands centred on both.

              The explicit order is because the target is placed last in source
              — the counter owns the h1 and leads — while stacked it has to
              come first, with the mark between the two. */}
          <div aria-hidden="true" className="order-2 flex items-center gap-3">
            <span className="h-px flex-1 bg-linear-to-r from-transparent to-border" />
            <span className="text-xs font-medium tracking-[0.25em] text-muted-foreground uppercase">
              VS
            </span>
            <span className="h-px flex-1 bg-linear-to-r from-border to-transparent" />
          </div>

          <div className="order-1 w-full">
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
