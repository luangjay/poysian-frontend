import { cva } from "class-variance-authority";
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
 * A win rate alone would rank 2/3 above 8/12, so the sample gates the scale:
 * under four attempts nothing is claimed beyond "not enough yet". The rate is
 * spent on the band rather than shown, because 7/8 invites arithmetic the
 * reader should not have to do while a war clock is running — what they need
 * is whether to spend one of three to five attacks on this.
 */
const confidenceSteps = 4;

function teamConfidence(wins: number, attempts: number) {
  // Nothing lit rather than one bar lit: too few tries is not a bad record,
  // and a red bar would report one.
  if (attempts < 4) return { level: 0, label: "ยังไม่รู้" } as const;
  const rate = wins / attempts;
  if (rate >= 0.85) return { level: 4, label: "ชัวร์ป้าบ" } as const;
  if (rate >= 0.7) return { level: 3, label: "เอาอยู่" } as const;
  if (rate >= 0.55) return { level: 2, label: "ลุ้นๆ" } as const;
  return { level: 1, label: "YOLO" } as const;
}

/**
 * The scale climbs red, yellow, green, blue — the same primitives the row
 * badges already spend, with yellow mixed from the two it sits between. Colour
 * is what makes a filled bar legible without counting it; the outline says how
 * far the scale goes, the hue says where on it you are.
 */
const confidenceBarVariants = cva("h-2 w-5 rounded-full", {
  variants: {
    level: {
      0: "bg-muted-foreground/20",
      1: "bg-red",
      2: "bg-yellow",
      3: "bg-green",
      4: "bg-blue",
    },
  },
  defaultVariants: { level: 0 },
});

/**
 * The bars carry it and the word says it, so the bars are decorative — a
 * reader on a screen reader gets the same sentence without them.
 */
function ConfidenceMeter({
  attempts,
  wins,
}: {
  attempts: number;
  wins: number;
}) {
  const { level, label } = teamConfidence(wins, attempts);

  // Stacked with the word first: the column is a rail of text — title, badge,
  // lead, caution all begin with words — and a shape at the start of a line
  // breaks that edge. Below, the bars read as a summary of the word above
  // them rather than a decoration beside it.
  return (
    <div className="flex flex-col items-start gap-1.5">
      <p className="text-sm">
        <span className="text-muted-foreground">ความมั่นใจ</span>{" "}
        <span className="font-medium">{label}</span>
      </p>
      {/* The track is drawn, not implied. Bare segments only read as a scale
          while some are empty — at four of four they are just an opaque bar,
          with nothing to say the scale ended there. An outline around the
          whole run gives the full state an edge to reach, so it reads as
          filled rather than merely dark. Border, not ring: ring is this
          project's elevation and focus mark. */}
      <span
        aria-hidden="true"
        className="flex gap-0.5 rounded-full border p-0.5"
      >
        {Array.from({ length: confidenceSteps }, (_, index) => (
          <span
            key={index}
            className={confidenceBarVariants({
              level: index < level ? level : 0,
            })}
          />
        ))}
      </span>
    </div>
  );
}

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
      {/* Stacked below sm, side by side above it. Seating the text
          beside the pictures costs 516 — 14rem of text, a gap, and the 276 the
          pictures come to — and that is the whole rule, here and everywhere
          else on the route a team is drawn: a browse card at 300 stacks, a
          counter row at 960 does not. From lg the full-width reference divides
          evenly, capping identity at half while leaving the other half to the
          lineup.

          One container for the text and the pictures, not a surface around
          each: the reference is a single quoted thing, and bg-muted is this
          codebase's recessed fill generally rather than an artwork-only one.
          Nesting a second surface inside it only restated the block.

          The label rides inside the identity column rather than being an
          ItemHeader or a row of its own. As an ItemHeader it was a second flex
          child of Item, and fit-content sizes a wrapping flex container as if
          nothing wraps, so its width got added to the pictures' instead of
          stacking above them. As a row spanning both columns it cost a full
          row of height for eleven characters.

          The identity column is a flex column partly for that reason: it gets
          stretched to the pictures' height, and as a grid its auto rows took
          that surplus and spread themselves through it, which is where the
          text was getting an extra 18px a line. A flex column does not stretch
          along its main axis, so there is nothing to undo.

          From sm the pictures keep their intrinsic width and pin right. The
          identity grows into the room they leave, but stops at half, so extra
          room becomes the gutter between them rather than inflating either
          side. Below sm they stack because neither half can preserve the
          portraits at a useful size. The Item itself still spans the page: the
          cap belongs to the identity, not to the reference surface around both
          parts. */}
      <div className="grid w-full gap-3 sm:flex sm:items-start sm:justify-between sm:gap-0">
        {/* `w-0 min-w-full` stops an unbroken Thai sentence from contributing
            a wider min-content size than the track it was given;
            `overflow-wrap:anywhere` is what lets the text honour that width. */}
        <div className="flex w-0 min-w-full flex-col gap-3 [overflow-wrap:anywhere] sm:w-auto sm:max-w-[50%] sm:min-w-0 sm:flex-1 sm:pr-4">
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
            <p className="max-h-[2.5lh] overflow-y-auto [mask-image:linear-gradient(to_bottom,#000_calc(100%_-_0.4lh),calc(100%_-_0.34lh),transparent)] pr-2 pb-[0.5lh] text-sm leading-relaxed text-muted-foreground">
              {team.condition}
            </p>
          </div>
        </div>
        {/* The compact lineup is 300px wide: a 232px hero rail, 12px gap, and
            56px variant stack. At the supported 360px viewport, the container
            and Item padding leave 304px, so this stays on one row everywhere. */}
        <div className="flex items-start justify-between gap-3 sm:ml-auto sm:w-fit sm:max-w-none sm:shrink-0 sm:justify-start sm:self-center">
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
              {/* Eyebrow, title and badges are one thing — what this team is
                  — so they group tighter than they sit from the lead and the
                  meter under them. Evenly spaced, the five parts read as five
                  facts rather than identity, description, record. */}
              <div className="flex flex-col gap-2">
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
              </div>
              {/* Three lines, then it scrolls — a write-up runs from one line
                  to six depending on who left it, and six of them pushed the
                  meter half a block down the column.

                  max-height, not height, and so not ScrollArea: that
                  component's viewport is `size-full`, which resolves against
                  an auto-height root and leaves nothing to scroll, so capping
                  it means giving it a fixed height — and a fixed height on a
                  one-line write-up is two lines of blank with nothing to
                  explain them. The styled scrollbar is not worth that.

                  lh is the line box, so three of them is three lines at
                  whichever size the breakpoint has landed on. The extra
                  0.75rem is a faded peek at the next line; equal bottom
                  padding lets the final line scroll completely above it. */}
              <p className="max-h-[3.5lh] overflow-y-auto [mask-image:linear-gradient(to_bottom,#000_calc(100%_-_0.4lh),calc(100%_-_0.34lh),transparent)] pr-2 pb-[0.5lh] text-sm leading-relaxed text-muted-foreground lg:text-base">
                {team.condition}
              </p>
              {team.attempts ? (
                <ConfidenceMeter
                  attempts={team.attempts}
                  wins={team.wins ?? 0}
                />
              ) : null}
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
