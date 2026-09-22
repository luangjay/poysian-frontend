import { type ReactNode } from "react";
import Image from "next/image";
import { cva } from "class-variance-authority";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import {
  type Hero,
  type SkillOrder,
  type TargetFormation,
  type Team,
} from "./_data";

export const gameUiAssetBaseUrl = "http://127.0.0.1:9000/game-ui";
export const heroRarityFrameSrc = `${gameUiAssetBaseUrl}/Atl_UI-List_SPBG01.png`;
export const itemGradeFrameSrc = `${gameUiAssetBaseUrl}/Item_GradeBG01.png`;
export const universalRoleIconSrc = `${gameUiAssetBaseUrl}/RoleIcon_05.png`;
/** StatIcon_09 is the game's winged boot; see SpeedIcon for why it is a mask. */
const speedIconMaskSrc = `${gameUiAssetBaseUrl}/Tex_StatIcon_09_Duotone.png`;

export const heroRoleIconByRole: Record<string, string> = {
  โจมตี: `${gameUiAssetBaseUrl}/RoleIcon_01.png`,
  เวท: `${gameUiAssetBaseUrl}/RoleIcon_02.png`,
  ป้องกัน: `${gameUiAssetBaseUrl}/RoleIcon_03.png`,
  สนับสนุน: `${gameUiAssetBaseUrl}/RoleIcon_04.png`,
  สมดุล: universalRoleIconSrc,
};

const heroRarityBackgroundSrcByRarity: Record<Hero["rarity"], string> = {
  gray: `${gameUiAssetBaseUrl}/Item_GradeBG00.png`,
  blue: `${gameUiAssetBaseUrl}/Item_GradeBG01.png`,
  green: `${gameUiAssetBaseUrl}/Item_GradeBG02.png`,
  purple: `${gameUiAssetBaseUrl}/Item_GradeBG03.png`,
  gold: `${gameUiAssetBaseUrl}/Item_GradeBG04.png`,
};

/**
 * The tile, plus the two pieces of furniture that have to stay in proportion
 * to it. `sm` is the route's one small size — the speed order's hover card and
 * the counter page's "กำลังแก้ทีมนี้" line both take it, so there is a single
 * number to turn when either looks wrong — and at 3.5rem it lands on the same
 * furniture `row` already uses at that width. On the 72px portrait the role
 * icon is 18px and the row badge 14px, a quarter and a fifth, so a tile that
 * shrinks on its own just grows its own furniture. `row` is the counter list's tile — 56px until the row has the
 * space for a full one — and each variant carries that same step.
 */
const heroPortraitVariants = cva(
  "grid min-w-0 shrink-0 justify-items-center gap-0.5 text-center",
  {
    variants: {
      size: {
        sm: "w-14",
        md: "w-18",
        row: "w-14 md:w-18",
        lineup: "w-16 sm:w-18",
      },
    },
    defaultVariants: { size: "md" },
  }
);

const heroRoleIconVariants = cva(
  "absolute bottom-0.5 left-0.5 z-30 drop-shadow-sm select-none",
  {
    variants: {
      size: {
        sm: "size-3.5",
        md: "size-4.5",
        row: "size-3.5 md:size-4.5",
        lineup: "size-4 sm:size-4.5",
      },
    },
    defaultVariants: { size: "md" },
  }
);

/**
 * Filled rather than tinted: a 9px letter at 70% on a card background was thin
 * to read. White, not a theme token — the disc is red or blue in both themes,
 * so a foreground that followed the theme would invert against a background
 * that does not.
 */
const heroRowBadgeVariants = cva(
  "absolute right-0.5 bottom-1 z-30 grid place-items-center rounded-full border border-white leading-none font-bold text-white shadow-sm",
  {
    variants: {
      size: {
        sm: "size-3 text-[8px]",
        md: "size-3.5 text-[10px]",
        row: "size-3 text-[8px] md:size-3.5 md:text-[10px]",
        lineup: "size-3 text-[8px] sm:size-3.5 sm:text-[10px]",
      },
      row: { back: "bg-red", front: "bg-blue" },
    },
    defaultVariants: { size: "md" },
  }
);

export function HeroPortrait({
  hero,
  className,
  loading = "lazy",
  rowBadge = false,
  size = "md",
}: {
  hero: Hero;
  className?: string;
  loading?: "eager" | "lazy";
  /** Front or back, marked on the portrait — for lists with no row rails. */
  rowBadge?: boolean;
  size?: "sm" | "md" | "row" | "lineup";
}) {
  const roleIconSrc = heroRoleIconByRole[hero.role] ?? universalRoleIconSrc;
  // A `row` tile is 56px only under md, where asking for the 72px source
  // costs a tier at most — not worth a third hint.
  const imageSizes = size === "sm" ? "3.5rem" : "4.5rem";
  // The portrait paints at 1.25x its frame, so it needs a source to match.
  const portraitSizes = size === "sm" ? "4.375rem" : "5.625rem";

  return (
    <div className={cn(heroPortraitVariants({ size, className }))}>
      <div className="relative isolate z-0 grid aspect-square w-full place-items-center overflow-hidden rounded-tl-xl rounded-tr-xs rounded-br-xl rounded-bl-xs border bg-muted shadow-lg">
        <div className="absolute inset-0.5 overflow-hidden rounded-[inherit]">
          <Image
            fill
            alt=""
            className="object-fill select-none"
            loading={loading}
            sizes={imageSizes}
            src={heroRarityBackgroundSrcByRarity[hero.rarity]}
          />
          {hero.image ? (
            <Image
              fill
              alt=""
              className="z-10 scale-125 object-cover select-none"
              loading={loading}
              sizes={portraitSizes}
              src={`http://127.0.0.1:9000/heroes/${hero.image}.png`}
            />
          ) : (
            <span
              aria-hidden="true"
              className="relative z-10 grid size-full place-items-center text-2xl font-semibold text-primary"
            >
              {hero.name.slice(0, 1)}
            </span>
          )}
        </div>
        <Image
          alt=""
          className="pointer-events-none absolute top-0 right-0 z-20 h-auto w-full select-none"
          height={128}
          loading={loading}
          sizes={size === "sm" ? "56px" : "72px"}
          src={heroRarityFrameSrc}
          width={145}
        />
        <Image
          alt=""
          className={heroRoleIconVariants({ size })}
          height={40}
          loading={loading}
          src={roleIconSrc}
          width={40}
        />
        {rowBadge ? (
          <span className={heroRowBadgeVariants({ size, row: hero.row })}>
            <span className="sr-only">
              {hero.row === "back" ? "แถวหลัง" : "แถวหน้า"}
            </span>
            <span aria-hidden="true">{hero.row === "back" ? "B" : "F"}</span>
          </span>
        ) : null}
      </div>
      <span
        className="w-full min-w-0 truncate text-xs font-medium"
        title={hero.name}
      >
        {hero.name}
      </span>
    </div>
  );
}

function LineupSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // No max width: the surface fills whatever cell it is given, and the
        // host is the only thing that knows how wide that should be — a card
        // hands it the card, the target page hands it a 28rem grid track.
        // Capping here left a team card with an empty strip beside its own
        // lineup on any screen wider than the cap.
        "grid w-full gap-4 overflow-hidden rounded-xl bg-muted p-2.5 ring-1 ring-foreground/10 [--card-spacing:--spacing(3)]",
        // Only a lineup carrying variants gets the floor; a team card's
        // surface is still sized by its rows alone.
        "has-[[data-slot=lineup-variants]]:min-h-60",
        // One column unless there is a second thing to put in it — a team
        // card has no variants at any width, so it stays a single column and
        // its rails run the full surface.
        //
        // The column is a fixed 5rem rather than `auto`, which sized itself
        // to a third of the surface and left the tiles hollow. 12rem is the
        // rows' own floor — three overlapped w-18 tiles plus the pr-6 the
        // B/F badge needs — so an oversized column overflows visibly instead
        // of clipping portraits in silence.
        //
        // Under sm the whole lineup steps down a size, because fitting and
        // having room are not the same thing: at the 360px floor the full-size
        // one spent 288 of the 308 available and read as wall to wall. The
        // small step spends 176 + 16 + 64, which leaves the rows somewhere to
        // breathe. Each floor is its own tile's row width plus the pr the B/F
        // badge needs: 2(4rem) + 1.5rem + 1.25rem, and 2(4.5rem) + 3rem.
        "has-[[data-slot=lineup-variants]]:grid-cols-[minmax(11rem,1fr)_4rem]",
        "sm:gap-6 sm:has-[[data-slot=lineup-variants]]:grid-cols-[minmax(12rem,1fr)_4.5rem]",
        className
      )}
    >
      {children}
    </div>
  );
}

function LineupRows({
  team,
  HeroTile = HeroPortrait,
  loading = "lazy",
}: {
  team: Team;
  HeroTile?: (props: {
    hero: Hero;
    className?: string;
    skills?: SkillOrder[];
    loading?: "eager" | "lazy";
    size?: "lineup";
  }) => ReactNode;
  loading?: "eager" | "lazy";
}) {
  return (
    <div
      // Placed by start and end, never by span: `col-span-*`/`row-span-*`
      // compile to the `grid-column`/`grid-row` shorthands, which reset the
      // matching start and hand the item back to auto-placement — which then
      // refuses to overlap the speed badge and drops the rows a row down.
      className="col-start-1 row-start-1 mx-auto grid min-h-0 w-full max-w-sm grid-rows-2 gap-4 self-center [--lineup-hero-label-offset:calc((1rem+0.125rem)/2)]"
      aria-label="การจัดทีม"
      role="group"
    >
      {(["front", "back"] as const).map((row) => {
        const heroes = team.heroes.filter((hero) => hero.row === row);
        const stacked = heroes.length === 3;
        const tone = row === "back" ? "red" : "blue";

        return (
          <div
            key={row}
            className={cn(
              "relative flex items-center gap-2",
              row === "back" && "order-first"
            )}
          >
            <div
              className={cn(
                "absolute inset-x-0 top-[calc(50%-var(--lineup-hero-label-offset))] flex h-1.5 items-center rounded-full bg-linear-to-r from-transparent",
                tone === "red" ? "to-red/30" : "to-blue/30"
              )}
            >
              <span
                className={cn(
                  "absolute top-1/2 right-0 grid size-5 -translate-y-1/2 place-items-center rounded-full border-2 bg-card text-xs leading-none font-bold shadow-sm",
                  tone === "red"
                    ? "border-red/30 text-red/60"
                    : "border-blue/30 text-blue/60"
                )}
                aria-label={row === "back" ? "แถวหลัง" : "แถวหน้า"}
              >
                {row === "back" ? "B" : "F"}
              </span>
            </div>
            {/* Two heroes spread by a gap and three overlapped by a
                negative margin land on the same row width whenever the gap
                plus twice the overlap equals the tile: 2t + g === 3t - 2m.
                4.5rem holds with 1.5rem and 1.5rem, 4rem with 1.5rem and
                1.25rem — so the gap is the same at both sizes and only the
                overlap steps. Change a tile without re-solving that and the
                two rows stop lining up. */}
            <div
              className={cn(
                "relative flex min-w-0 flex-1 justify-center pr-5 sm:pr-6",
                heroes.length === 2 && "gap-6"
              )}
            >
              {heroes.map((hero, index) => (
                <HeroTile
                  key={hero.name}
                  hero={hero}
                  className={cn(stacked && index > 0 && "-ml-5 sm:-ml-6")}
                  size="lineup"
                  loading={loading}
                  skills={team.skillOrder?.filter(
                    (skill) => skill.hero === hero.name
                  )}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const formationRows = {
  "1-4": [1, 4],
  "2-3": [2, 3],
  "3-2": [3, 2],
  "4-1": [4, 1],
} as const satisfies Record<TargetFormation, readonly [number, number]>;

export function formationLabel(formation: TargetFormation) {
  const [backCount, frontCount] = formationRows[formation];

  return `หน้า ${frontCount} / หลัง ${backCount}`;
}

/**
 * Sprite index per formation, read off the artwork rather than guessed: red
 * pips are the back row and blue the front, which is the pairing this page
 * already uses, so the game art needs no legend. 01 is 3 back / 2 front.
 */
const formationSpriteIndex = {
  "3-2": "01",
  "2-3": "02",
  "4-1": "03",
  "1-4": "04",
} as const satisfies Record<TargetFormation, string>;

/**
 * Two cuts of the same sprite. `Deck_S` is a flat pip cluster that survives
 * being 29px tall in the variant strip; `Deck` numbers the five slots, which
 * is the detail you want while picking and cannot be read at strip size.
 */
function formationSpriteSrc(formation: TargetFormation, compact: boolean) {
  const size = compact ? "S_" : "";

  return `${gameUiAssetBaseUrl}/Atl_TeamDeck_01_Sprite_Deck_${size}${formationSpriteIndex[formation]}.png`;
}

export function FormationPreview({
  className,
  formation,
  compact = false,
}: {
  className?: string;
  formation: TargetFormation;
  compact?: boolean;
}) {
  // The sprites keep their full canvas: trimming to content would make the
  // four options jump around, since the game centres them by canvas, not bbox.
  // The picker composes its own caption bar, so this returns art either way.
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={cn(
        "h-auto shrink-0 select-none",
        compact ? "w-12" : "w-28",
        className
      )}
      height={compact ? 66 : 99}
      sizes={compact ? "40px" : "112px"}
      src={formationSpriteSrc(formation, compact)}
      width={compact ? 90 : 186}
    />
  );
}

export function withFormation(team: Team, formation: TargetFormation): Team {
  const [backCount] = formationRows[formation];

  return {
    ...team,
    heroes: team.heroes.map((hero, index) => ({
      ...hero,
      row: index < backCount ? "back" : "front",
    })),
  };
}

const legendaryPetImageByName = {
  Croa: "yorang",
  Irin: "eirin",
  Lulu: "yeonji",
  Pooki: "yu",
  Windy: "ruu",
} as const;

export function PetPortrait({
  className,
  pet,
  size = "secondary",
}: {
  className?: string;
  pet: string;
  size?: "primary" | "secondary";
}) {
  const image =
    legendaryPetImageByName[pet as keyof typeof legendaryPetImageByName];

  return (
    <div
      aria-label={pet}
      role="img"
      className={cn(
        "relative isolate z-0 grid aspect-square place-items-center overflow-hidden border bg-muted",
        size === "primary"
          ? "w-18 rounded-tl-xl rounded-tr-xs rounded-br-xl rounded-bl-xs shadow-md"
          : "w-10 rounded-tl-md rounded-tr-xs rounded-br-md rounded-bl-xs shadow-sm",
        className
      )}
    >
      <div
        className={cn(
          "absolute overflow-hidden rounded-[inherit]",
          "inset-0.5"
        )}
      >
        <Image
          fill
          alt=""
          className="object-cover select-none"
          sizes={size === "primary" ? "72px" : "40px"}
          src={heroRarityBackgroundSrcByRarity.gold}
        />
        {image ? (
          <Image
            fill
            alt=""
            className="z-10 origin-bottom scale-125 object-cover select-none"
            sizes={size === "primary" ? "72px" : "40px"}
            src={`http://127.0.0.1:9000/pets/${image}.png`}
          />
        ) : null}
      </div>
      <Image
        alt=""
        className="pointer-events-none absolute top-0 right-0 z-20 h-auto w-full select-none"
        height={128}
        sizes={size === "primary" ? "72px" : "40px"}
        src={heroRarityFrameSrc}
        width={145}
      />
    </div>
  );
}

export function PetChoice({ pets }: { pets: string[] }) {
  const [primaryPet, ...companionPets] = pets;

  if (!primaryPet) {
    return null;
  }

  return (
    // A full package is five: the lead pet over two rows of two. The gaps are
    // picked so that case measures exactly 10.5rem tall — 72 + 12 + (40 + 4 +
    // 40) — which is what the picker's cells size to.
    <div className="mx-auto grid w-full max-w-28 justify-items-center gap-3 text-center">
      <PetPortrait pet={primaryPet} size="primary" />
      {companionPets.length ? (
        <div
          className={cn(
            "grid grid-cols-2 justify-items-center gap-1",
            companionPets.length === 1 && "grid-cols-1"
          )}
        >
          {companionPets.map((pet, index) => (
            <PetPortrait
              key={pet}
              className={cn(
                companionPets.length % 2 === 1 &&
                  index === companionPets.length - 1 &&
                  "col-span-2"
              )}
              pet={pet}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * One pet carries the slot and the rest become a count, the way the picker's
 * caption reads. Laying all of them out shrank every portrait to fit the
 * smallest slot; one large one stays recognisable at any package size.
 */
/**
 * A team fields one pet, and the rest of the package are pets it could take
 * instead — so the marker counts options rather than pets on the field. `/2`
 * over `+1`: a plus reads as "and one more", where this means "of two". The
 * numerator is dropped because it is always one, and a digit that never
 * changes is not worth the width in a 20px badge.
 */
export function PetSummary({
  className,
  pets,
}: {
  className?: string;
  pets: string[];
}) {
  const [pet] = pets;

  if (!pet) {
    return null;
  }

  return (
    <span aria-hidden="true" className="relative">
      <PetPortrait className={cn("w-12", className)} pet={pet} />
      {pets.length > 1 ? (
        <Badge className="absolute -right-1.5 -bottom-1.5 rounded-md px-1 text-[11px] tabular-nums">
          /{pets.length}
        </Badge>
      ) : null}
    </span>
  );
}

/**
 * Places the three cells in the surface's own grid, so the arrangement changes
 * without the tree changing: a strip under the rows while the surface is
 * narrow, a column beside them once it is wide enough. Named slots rather than
 * children, because which cell goes where is the whole job of this component.
 */
function LineupVariants({
  formation,
  pets,
  speed,
}: {
  formation: ReactNode;
  pets: ReactNode;
  speed: ReactNode;
}) {
  return (
    <>
      {/* Shares the rows' cell and sits in the corner they leave empty — the
          heroes centre, and the rail behind it fades out at that end. */}
      <div className="z-10 col-start-1 row-start-1 self-start justify-self-start">
        {speed}
      </div>
      {/* The pair shares one cell and stacks with flex rather than taking a
          track each: as two grid items they centred in their own share of the
          rows' height, which is not a thing either of them should own. Flex
          lets them sit together, and sit at the end. */}
      <div
        data-slot="lineup-variants"
        className="col-start-2 row-start-1 flex flex-col items-end justify-end gap-2"
      >
        {pets}
        {formation}
      </div>
    </>
  );
}

/**
 * Shared shell for a variant cell: a card carrying a visual that names the
 * facet, and the current value. The caption stays for screen readers only —
 * the boot, the pet portraits and the formation pips say which cell is which.
 *
 * `showValue` drops the printed line where the art already is the value. The
 * group-* states only bite when a selectable cell wraps this in a trigger.
 */
const variantTriggerStates = cn(
  "ring-1 ring-foreground/10 transition-shadow motion-safe:duration-150 motion-reduce:transition-none",
  // Only bite when a selectable cell is wrapped in a trigger.
  "group-hover:shadow-md group-focus-visible:ring-3 group-focus-visible:ring-ring/50"
);

/**
 * Sized like a portrait, and for the same reason: the strip beside a lineup
 * and a token in a row of 3.5rem portraits are one cell at two scales, so the
 * scale is a variant rather than a class the caller pastes on. `sm` is exactly
 * a row portrait, which leaves the p-2 wrapping 2.5rem of art with no slack.
 */
const variantFaceVariants = cva(
  "flex shrink-0 flex-col items-center justify-center rounded-lg bg-card p-2",
  {
    variants: {
      size: { default: "size-16 sm:size-18", sm: "size-14" },
    },
    defaultVariants: { size: "default" },
  }
);

/** The art the face wraps, stepped with it. */
const variantArtVariants = cva("", {
  variants: {
    size: { default: "w-12", sm: "w-10" },
  },
  defaultVariants: { size: "default" },
});

type VariantSize = "default" | "sm";

function VariantFace({
  caption,
  size,
  value,
  visual,
}: {
  caption: string;
  size?: VariantSize;
  value: string;
  visual: ReactNode;
}) {
  return (
    <span className={cn(variantFaceVariants({ size }), variantTriggerStates)}>
      {visual}
      <span className="sr-only">{`${caption} ${value}`}</span>
    </span>
  );
}

/**
 * The game draws its speed stat as a winged boot, so the strip borrows it
 * rather than approximating with a sneaker. The source art is a black outline
 * around a white fill, which disappears on a dark surface and reads as a blob
 * if masked by alpha — so the asset is worn as a mask instead, which lets
 * `--primary` tint it in either theme.
 *
 * A mask's alpha doubles as opacity, so one file carries both tones: the ink
 * is opaque and the wing's interior sits at 35%, filled on its own so the
 * feathers read as the subject and the boot stays line art. The regions come
 * from flood-filling the source's enclosed whites, not from a hand-drawn path.
 */
function SpeedIcon() {
  return (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 bg-foreground"
      style={{
        maskImage: `url(${speedIconMaskSrc})`,
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "contain",
      }}
    />
  );
}

/** Flat by design: it reads as a stat pinned to the lineup, not a fourth card
 *  competing with the two that carry artwork. */
function LineupSpeed({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-full bg-card/85 px-2 py-1 backdrop-blur-sm",
        variantTriggerStates
      )}
    >
      <SpeedIcon />
      <span className="text-xs leading-none font-medium">
        <span className="sr-only">ความเร็ว </span>
        {value}
      </span>
    </span>
  );
}

function LineupPets({ pets, size }: { pets: string[]; size?: VariantSize }) {
  return (
    <VariantFace
      caption="สัตว์เลี้ยง"
      size={size}
      value={pets.join(" หรือ ")}
      visual={
        <PetSummary className={variantArtVariants({ size })} pets={pets} />
      }
    />
  );
}

function LineupFormation({
  formation,
  size,
}: {
  formation: TargetFormation;
  size?: VariantSize;
}) {
  return (
    <VariantFace
      caption="แผนการรบ"
      size={size}
      value={formationLabel(formation)}
      visual={
        <FormationPreview
          className={variantArtVariants({ size })}
          compact
          formation={formation}
        />
      }
    />
  );
}

export const Lineup = {
  Surface: LineupSurface,
  Rows: LineupRows,
  Variants: LineupVariants,
  Speed: LineupSpeed,
  Pets: LineupPets,
  Formation: LineupFormation,
};
