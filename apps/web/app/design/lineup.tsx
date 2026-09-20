import { type ReactNode } from "react";
import Image from "next/image";
import { SneakerMoveIcon } from "@phosphor-icons/react";
import { Separator } from "@workspace/ui/components/separator";
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

  return (
    <div
      className={cn(
        "grid min-w-0 shrink-0 justify-items-center gap-0.5 text-center",
        size === "sm" ? "w-11" : "w-18",
        className
      )}
    >
      <div className="relative isolate z-0 grid aspect-[0.8] w-full place-items-center overflow-hidden rounded-tl-xl rounded-tr-xs rounded-br-xl rounded-bl-xs border bg-muted shadow-lg">
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
              className="z-10 object-cover select-none"
              loading={loading}
              sizes={imageSizes}
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
            "absolute left-0.5 z-30 drop-shadow-sm select-none",
            size === "sm" ? "bottom-1 size-3" : "bottom-2.5 size-4.5"
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
    <div
      className={cn(
        "grid w-full max-w-md overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10 [--card-spacing:--spacing(3)]",
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
      className="mx-auto grid min-h-0 w-full max-w-sm grid-rows-2 gap-1 p-2.5 [--lineup-hero-label-offset:calc((1rem+0.125rem)/2)]"
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
            <div
              className={cn(
                "relative flex min-w-0 flex-1 justify-center pr-6",
                heroes.length === 2 && "gap-10"
              )}
            >
              {heroes.map((hero, index) => (
                <HeroTile
                  key={hero.name}
                  hero={hero}
                  className={cn(stacked && index > 0 && "-ml-4")}
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

  return `หน้า ${frontCount} · หลัง ${backCount}`;
}

export function FormationPreview({
  formation,
  compact = false,
}: {
  formation: TargetFormation;
  compact?: boolean;
}) {
  const [backCount, frontCount] = formationRows[formation];
  const dots = (
    <>
      <div className="flex justify-center gap-1">
        {Array.from({ length: backCount }, (_, index) => (
          <span
            key={index}
            className={cn(
              "rounded-full bg-red/60",
              compact ? "size-1.5" : "size-2"
            )}
          />
        ))}
      </div>
      <div className="flex justify-center gap-1">
        {Array.from({ length: frontCount }, (_, index) => (
          <span
            key={index}
            className={cn(
              "rounded-full bg-blue/60",
              compact ? "size-1.5" : "size-2"
            )}
          />
        ))}
      </div>
    </>
  );

  if (compact) {
    return (
      <div
        aria-hidden="true"
        className="flex shrink-0 flex-col justify-center gap-1"
      >
        {dots}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div
        aria-hidden="true"
        className="flex size-14 flex-col justify-center gap-1.5 rounded-full bg-linear-to-br from-primary/20 to-muted px-2 shadow-xs"
      >
        {dots}
      </div>
      <span className="text-xs whitespace-nowrap text-muted-foreground">
        {formationLabel(formation)}
      </span>
    </div>
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
  pet,
  size = "secondary",
}: {
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
          ? "w-14 rounded-tl-lg rounded-tr-xs rounded-br-lg rounded-bl-xs shadow-md"
          : "rounded-tr-px rounded-bl-px w-7 rounded-tl-sm rounded-br-sm shadow-sm"
      )}
    >
      <div
        className={cn(
          "absolute overflow-hidden rounded-[inherit]",
          size === "primary" ? "inset-0.5" : "inset-px"
        )}
      >
        <Image
          fill
          alt=""
          className="object-cover select-none"
          sizes={size === "primary" ? "56px" : "28px"}
          src={heroRarityBackgroundSrcByRarity.gold}
        />
        {image ? (
          <Image
            fill
            alt=""
            className="z-10 origin-bottom scale-125 object-cover select-none"
            sizes={size === "primary" ? "56px" : "28px"}
            src={`http://127.0.0.1:9000/pets/${image}.png`}
          />
        ) : null}
      </div>
      <Image
        alt=""
        className="pointer-events-none absolute top-0 right-0 z-20 h-auto w-full select-none"
        height={128}
        sizes={size === "primary" ? "56px" : "28px"}
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
      <div className="flex flex-col items-center gap-1.5">
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
        <span className="sr-only">{pets.join(", ")}</span>
      </div>
    </div>
  );
}

function PetStrip({ pets }: { pets: string[] }) {
  return (
    <div aria-hidden="true" className="flex shrink-0">
      {pets.slice(0, 3).map((pet, index) => (
        <div key={pet} className={cn(index > 0 && "-ml-1.5")}>
          <PetPortrait pet={pet} />
        </div>
      ))}
    </div>
  );
}

/** The strip of variant cells that closes a lineup surface. */
function LineupVariants({ children }: { children: ReactNode }) {
  return (
    <>
      <Separator />
      <div className="grid grid-cols-3 divide-x">{children}</div>
    </>
  );
}

/**
 * Shared shell for a variant cell: a visual that names the facet, and the
 * current value. The caption stays for screen readers only — the shoe, the pet
 * portraits and the formation dots already say which cell is which.
 */
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
    <span className="flex h-full w-full min-w-0 flex-col items-center justify-center gap-1 px-2 py-2">
      {visual}
      <span className="grid max-w-full min-w-0 text-center">
        <span className="sr-only">{caption}</span>
        <span className="truncate text-xs leading-tight font-medium">
          {value}
        </span>
      </span>
    </span>
  );
}

function LineupSpeed({ value }: { value: string }) {
  return (
    <VariantFace
      caption="ความเร็ว"
      value={value}
      visual={
        <SneakerMoveIcon
          aria-hidden="true"
          className="size-5 shrink-0 text-primary"
        />
      }
    />
  );
}

function LineupPets({ pets }: { pets: string[] }) {
  return (
    <VariantFace
      caption="สัตว์เลี้ยง"
      value={pets.join(" · ")}
      visual={<PetStrip pets={pets} />}
    />
  );
}

function LineupFormation({ formation }: { formation: TargetFormation }) {
  return (
    <VariantFace
      caption="การจัดแถว"
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
