import { type ReactNode } from "react";
import Image from "next/image";
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

export function HeroPortrait({
  hero,
  className,
  loading = "lazy",
  shared = false,
  size = "md",
}: {
  hero: Hero;
  className?: string;
  loading?: "eager" | "lazy";
  shared?: boolean;
  size?: "sm" | "md";
}) {
  const roleIconSrc = heroRoleIconByRole[hero.role] ?? universalRoleIconSrc;
  const imageSizes = size === "sm" ? "2.75rem" : "4.5rem";
  // The portrait paints at 1.25x its frame, so it needs a source to match.
  const portraitSizes = size === "sm" ? "3.5rem" : "5.625rem";

  return (
    <div
      className={cn(
        "grid min-w-0 shrink-0 justify-items-center gap-0.5 text-center",
        size === "sm" ? "w-11" : "w-18",
        className
      )}
    >
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
          sizes={size === "sm" ? "44px" : "72px"}
          src={heroRarityFrameSrc}
          width={145}
        />
        <Image
          alt=""
          className={cn(
            "absolute bottom-0.5 left-0.5 z-30 drop-shadow-sm select-none",
            size === "sm" ? "size-3" : "bottom-0.5 size-4.5"
          )}
          height={40}
          loading={loading}
          src={roleIconSrc}
          width={40}
        />
        {shared ? (
          <span className="absolute top-1 left-1 z-30 grid size-2.5 place-items-center rounded-full bg-primary ring-2 ring-muted">
            <span className="sr-only">ตัวร่วมกับทีมเป้าหมาย</span>
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
    // The container and the grid have to be two elements: `container-type`
    // makes an element a container for its descendants, never for itself, so
    // a template switched by `@sm:` on this same node would never match — the
    // cells would move and the columns would not.
    <div
      className={cn(
        "@container grid w-full max-w-md overflow-hidden rounded-xl bg-muted p-2.5 ring-1 ring-foreground/10 [--card-spacing:--spacing(3)]",
        // Only a lineup carrying variants gets the floor; a team card's
        // surface is still sized by its rows alone.
        "has-[[data-slot=lineup-variants]]:min-h-60",
        className
      )}
    >
      <div
        className={cn(
          "grid grid-cols-2 gap-6",
          // Beside the rows once the surface can hold both; the query is on
          // the surface, not the viewport, because it is 28rem on the target
          // page and wider on the counter page.
          //
          // The column is a fixed 5rem rather than `auto`, which sized itself
          // to a third of the surface and left the tiles hollow. 12rem is the
          // rows' own floor — three overlapped w-18 tiles plus the pr-6 the
          // B/F badge needs — so an oversized column overflows visibly
          // instead of clipping portraits in silence.
          "@sm:grid-cols-[minmax(12rem,1fr)_5rem]"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function LineupRows({
  team,
  HeroTile = HeroPortrait,
  loading = "lazy",
  sharedHeroNames,
}: {
  team: Team;
  HeroTile?: (props: {
    hero: Hero;
    className?: string;
    skills?: SkillOrder[];
    loading?: "eager" | "lazy";
    shared?: boolean;
  }) => ReactNode;
  loading?: "eager" | "lazy";
  sharedHeroNames?: string[];
}) {
  return (
    <div
      // Placed by start and end, never by span: `col-span-*`/`row-span-*`
      // compile to the `grid-column`/`grid-row` shorthands, which reset the
      // matching start and hand the item back to auto-placement — which then
      // refuses to overlap the speed badge and drops the rows a row down.
      className="col-start-1 col-end-3 row-start-1 mx-auto grid min-h-0 w-full max-w-sm grid-rows-2 gap-4 self-center [--lineup-hero-label-offset:calc((1rem+0.125rem)/2)] @sm:col-end-2 @sm:row-end-3"
      aria-label="การจัดทีม"
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
                  "absolute top-1/2 right-0 grid size-5 -translate-y-1/2 place-items-center rounded-full border-2 bg-card text-xs font-bold shadow-sm",
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
                negative margin land on the same row width when both values are
                a third of the tile: 2t + t/3 === 3t - 2(t/3). The tile is
                w-18, so that third is 1.5rem — gap-6 and -ml-6. Change one and
                the rows stop lining up. */}
            <div
              className={cn(
                "relative flex min-w-0 flex-1 justify-center pr-6",
                heroes.length === 2 && "gap-6"
              )}
            >
              {heroes.map((hero, index) => (
                <HeroTile
                  key={hero.name}
                  hero={hero}
                  className={cn(stacked && index > 0 && "-ml-6")}
                  loading={loading}
                  shared={sharedHeroNames?.includes(hero.name)}
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
  formation,
  compact = false,
}: {
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
      className={cn("h-auto shrink-0 select-none", compact ? "w-10" : "w-28")}
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
    <div className="grid w-full max-w-28 shrink-0 place-items-center text-center">
      {/* A full package is five: the lead pet over two rows of two. The gaps
          are picked so that case measures exactly 10.5rem tall —
          72 + 12 + (40 + 4 + 40) — which is what the picker's cells size to. */}
      <div className="flex flex-col items-center gap-3">
        <PetPortrait pet={primaryPet} size="primary" />
        {companionPets.length ? (
          <div
            className={cn(
              "grid grid-cols-2 justify-items-center gap-1",
              companionPets.length === 1 && "grid-cols-1"
            )}
          >
            {companionPets.map((pet, index) => (
              <div
                key={pet}
                className={cn(
                  companionPets.length % 2 === 1 &&
                    index === companionPets.length - 1 &&
                    "col-span-2"
                )}
              >
                <PetPortrait pet={pet} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * One pet carries the slot and the rest become a count, the way the picker's
 * caption reads. Laying all of them out shrank every portrait to fit the
 * smallest slot; one large one stays recognisable at any package size.
 */
function PetSummary({ pets }: { pets: string[] }) {
  const [mainPet, ...companions] = pets;

  if (!mainPet) {
    return null;
  }

  return (
    <span aria-hidden="true" className="relative">
      <PetPortrait className="w-12" pet={mainPet} />
      {companions.length ? (
        // Shaped like the card's own tag overflow: a square of the badge's
        // base height, padding dropped so the digits centre themselves. The
        // radius is left alone — `rounded-4xl` already clamps to a circle at
        // this size, and a corner counter is not a tag.
        <Badge className="absolute -right-1.5 -bottom-1.5 size-5 rounded-md p-0 text-[11px] tabular-nums">
          +{companions.length}
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
        className="col-start-1 col-end-3 row-start-2 flex items-end justify-center gap-2 @sm:col-start-2 @sm:row-start-1 @sm:row-end-3 @sm:flex-col @sm:justify-end"
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

function VariantFace({
  caption,
  value,
  visual,
}: {
  caption: string;
  value: string;
  visual: ReactNode;
}) {
  return (
    <span
      className={cn(
        "flex size-20 shrink-0 flex-col items-center justify-center rounded-lg bg-card p-2",
        variantTriggerStates
      )}
    >
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

function LineupPets({ pets }: { pets: string[] }) {
  return (
    <VariantFace
      caption="สัตว์เลี้ยง"
      value={pets.join(" · ")}
      visual={<PetSummary pets={pets} />}
    />
  );
}

function LineupFormation({ formation }: { formation: TargetFormation }) {
  return (
    <VariantFace
      caption="แผนการรบ"
      value={formationLabel(formation)}
      visual={<FormationPreview compact formation={formation} />}
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
