import { type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@workspace/ui/lib/utils";
import {
  targetFormations,
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
}: {
  hero: Hero;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  const roleIconSrc = heroRoleIconByRole[hero.role] ?? universalRoleIconSrc;

  return (
    <div
      className={cn(
        "grid w-18 min-w-0 shrink-0 justify-items-center gap-1 text-center",
        className
      )}
    >
      <div className="relative isolate z-0 grid aspect-[0.8] w-full place-items-center overflow-hidden rounded-tl-xl rounded-tr-xs rounded-br-xl rounded-bl-xs border bg-muted shadow-lg">
        <div className="absolute inset-0.5 overflow-hidden rounded-[inherit]">
          <Image
            fill
            alt=""
            className="object-fill"
            loading={loading}
            sizes="4.5rem"
            src={heroRarityBackgroundSrcByRarity[hero.rarity]}
          />
          {hero.image ? (
            <Image
              fill
              alt=""
              className="z-10 object-cover"
              loading={loading}
              sizes="4.5rem"
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
          className="pointer-events-none absolute top-0 right-0 z-20 h-auto w-full"
          height={128}
          loading={loading}
          sizes="72px"
          src={heroRarityFrameSrc}
          width={145}
        />
        <Image
          alt=""
          className="absolute bottom-2.5 left-0.5 z-30 size-4.5 drop-shadow-sm"
          height={40}
          loading={loading}
          src={roleIconSrc}
          width={40}
        />
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

function LineupSurface({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-64 w-full justify-self-center rounded-xl border bg-accent px-(--card-spacing) shadow-xs [--card-spacing:--spacing(3)]">
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
  }) => ReactNode;
  loading?: "eager" | "lazy";
}) {
  return (
    <div
      className="mx-auto grid min-h-0 w-full max-w-sm grid-rows-2 gap-5 p-3 [--lineup-hero-label-offset:calc((1rem+0.25rem)/2)]"
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

export const Lineup = {
  Surface: LineupSurface,
  Rows: LineupRows,
};

const formationRows = {
  "1-4": [1, 4],
  "2-3": [2, 3],
  "3-2": [3, 2],
  "4-1": [4, 1],
} as const satisfies Record<TargetFormation, readonly [number, number]>;

export function FormationPreview({
  formation,
}: {
  formation: TargetFormation;
}) {
  const [backCount, frontCount] = formationRows[formation];

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div
        aria-hidden="true"
        className="flex size-14 flex-col justify-center gap-1.5 rounded-full bg-linear-to-br from-primary/20 via-muted to-accent px-2 shadow-xs"
      >
        <div className="flex justify-center gap-1">
          {Array.from({ length: backCount }, (_, index) => (
            <span key={index} className="size-2 rounded-full bg-red/60" />
          ))}
        </div>
        <div className="flex justify-center gap-1">
          {Array.from({ length: frontCount }, (_, index) => (
            <span key={index} className="size-2 rounded-full bg-blue/60" />
          ))}
        </div>
      </div>
      <span className="text-[11px] whitespace-nowrap text-muted-foreground">
        หน้า {frontCount} · หลัง {backCount}
      </span>
    </div>
  );
}

export function withFormation(team: Team, formation: TargetFormation): Team {
  const backCount =
    targetFormations.find((option) => option.value === formation)
      ?.backHeroCount ?? 0;

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

function PetPortrait({
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
          className="object-cover"
          sizes={size === "primary" ? "56px" : "28px"}
          src={heroRarityBackgroundSrcByRarity.gold}
        />
        {image ? (
          <Image
            fill
            alt=""
            className="z-10 origin-bottom scale-125 object-cover"
            sizes={size === "primary" ? "56px" : "28px"}
            src={`http://127.0.0.1:9000/pets/${image}.png`}
          />
        ) : null}
      </div>
      <Image
        alt=""
        className="pointer-events-none absolute top-0 right-0 z-20 h-auto w-full"
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
    <div className="grid h-32 w-full max-w-28 shrink-0 place-items-center text-center">
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
