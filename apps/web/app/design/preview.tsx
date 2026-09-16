"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  BirdIcon,
  CaretDownIcon,
  CaretUpIcon,
  CatIcon,
  CheckCircleIcon,
  CloudIcon,
  CopyIcon,
  FishIcon,
  FlowerIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  PawPrintIcon,
  ShieldIcon,
  SneakerMoveIcon,
  SparkleIcon,
  SwordIcon,
} from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@workspace/ui/components/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@workspace/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Toggle } from "@workspace/ui/components/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { cn } from "@workspace/ui/lib/utils";
import {
  targetFormations,
  targetTeamTypes,
  type Hero,
  type PetPackage,
  type SkillOrder,
  type TargetFormation,
  type TargetTeamType,
  type TargetVariants,
  type Team,
} from "./_data";
import { setBannerExpandedCookie } from "./actions";

function HeroPortrait({ hero, className }: { hero: Hero; className?: string }) {
  return (
    <div
      className={cn(
        "grid w-18 shrink-0 justify-items-center gap-1 text-center",
        className
      )}
    >
      <div className="relative grid aspect-192/229 w-full place-items-center overflow-hidden rounded-xl border bg-background shadow-sm">
        <SparkleIcon
          aria-hidden="true"
          className="absolute top-1 right-1 size-3 text-primary"
        />
        <span
          aria-hidden="true"
          className="text-2xl font-semibold text-primary"
        >
          {hero.name.slice(0, 1)}
        </span>
        <span className="absolute inset-x-0 bottom-0 bg-muted px-1 py-0.5 text-xs text-muted-foreground">
          {hero.role}
        </span>
      </div>
      <span className="w-full truncate text-xs font-medium" title={hero.name}>
        {hero.name}
      </span>
    </div>
  );
}

function LineupSurface({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-64 w-full justify-self-center rounded-xl border bg-accent shadow-xs">
      {children}
    </div>
  );
}

function LineupRows({
  team,
  HeroTile = HeroPortrait,
}: {
  team: Team;
  HeroTile?: (props: {
    hero: Hero;
    className?: string;
    skills?: SkillOrder[];
  }) => ReactNode;
}) {
  return (
    <div
      className="mx-auto grid min-h-0 w-full max-w-sm grid-rows-2 gap-4 p-3 [--lineup-hero-label-offset:calc((1rem+0.25rem)/2)]"
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

const Lineup = {
  Surface: LineupSurface,
  Rows: LineupRows,
};

const formationRows = {
  "1-4": [1, 4],
  "2-3": [2, 3],
  "3-2": [3, 2],
  "4-1": [4, 1],
} as const satisfies Record<TargetFormation, readonly [number, number]>;

function FormationPreview({ formation }: { formation: TargetFormation }) {
  const [backCount, frontCount] = formationRows[formation];

  return (
    <div
      aria-label={`การจัดแถว ${formation}`}
      role="img"
      className="flex size-14 flex-col justify-center gap-1.5 rounded-lg bg-linear-to-br from-primary/20 via-muted to-accent px-2 shadow-xs"
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
  );
}

function withFormation(team: Team, formation: TargetFormation): Team {
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

const petIconByName = {
  Croa: BirdIcon,
  Irin: CatIcon,
  Lulu: FishIcon,
  Pooki: PawPrintIcon,
  Windy: CloudIcon,
} as const;

function PetPortrait({
  pet,
  size = "secondary",
}: {
  pet: string;
  size?: "primary" | "secondary";
}) {
  const Icon = petIconByName[pet as keyof typeof petIconByName] ?? PawPrintIcon;

  return (
    <div
      aria-label={pet}
      role="img"
      className={cn(
        "grid aspect-square place-items-center overflow-hidden rounded-lg border bg-linear-to-br from-primary/20 via-muted to-accent shadow-xs",
        size === "primary" ? "w-14" : "w-7"
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn("text-primary", size === "primary" ? "size-7" : "size-4")}
      />
    </div>
  );
}

function PetChoice({ pets }: { pets: string[] }) {
  const [primaryPet, ...companionPets] = pets;

  if (!primaryPet) {
    return null;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1.5 text-center">
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
  );
}

function TeamCard({
  team,
  counter = false,
}: {
  team: Team;
  counter?: boolean;
}) {
  return (
    <Card
      size="sm"
      className="h-full transition-shadow motion-safe:duration-150 motion-safe:hover:shadow-md motion-reduce:transition-none"
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 gap-1.5">
            <Badge variant="secondary">{team.type}</Badge>
            {team.tags?.slice(0, 1).map((tag) => (
              <Badge
                key={tag}
                className="max-w-24 min-w-0 shrink truncate"
                title={tag}
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
            {team.tags && team.tags.length > 1 ? (
              <Badge variant="outline">+{team.tags.length - 1}</Badge>
            ) : null}
          </div>
          {counter ? (
            <SwordIcon aria-hidden="true" className="text-primary" />
          ) : (
            <span className="text-xs text-muted-foreground">
              {team.counters ? `${team.counters} ทีมแก้` : "รอทีมแก้"}
            </span>
          )}
        </div>
        <CardTitle className="truncate">{team.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <Lineup.Surface> */}
        <Lineup.Rows team={team} />
        {/* </Lineup.Surface> */}
      </CardContent>
      <CardFooter className="mt-auto justify-end gap-2">
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          {counter ? "ดูกลยุทธ์" : "ดูทีมแก้"}
          <ArrowUpRightIcon aria-hidden="true" />
        </span>
      </CardFooter>
    </Card>
  );
}

type VariantConfigurationProps = {
  variants: TargetVariants;
  selectedSpeed: TargetVariants["speeds"][number];
  selectedFormation: TargetFormation;
  selectedPetPackage: PetPackage;
  onSpeedChange: (speed: TargetVariants["speeds"][number]) => void;
  onFormationChange: (formation: TargetFormation) => void;
  onPetPackageChange: (pets: PetPackage) => void;
};

function VariantConfiguration({
  variants,
  selectedSpeed,
  selectedFormation,
  selectedPetPackage,
  onSpeedChange,
  onFormationChange,
  onPetPackageChange,
}: VariantConfigurationProps) {
  return (
    <FieldSet className="gap-6">
      <FieldLegend>รูปแบบทีมที่บันทึกไว้</FieldLegend>
      <p className="text-sm text-muted-foreground">
        เลือกได้เฉพาะชุดที่กิลด์บันทึกไว้
      </p>

      <div className="grid gap-3">
        <p className="text-sm font-medium">ความเร็ว</p>
        <RadioGroup
          aria-label="เลือกรูปแบบความเร็ว"
          className="grid grid-cols-3 gap-2"
          value={selectedSpeed}
          onValueChange={(value) => {
            if (typeof value === "string") {
              onSpeedChange(value as TargetVariants["speeds"][number]);
            }
          }}
        >
          {variants.speeds.map((speed) => (
            <FieldLabel key={speed} className="h-full">
              <Field orientation="horizontal" className="items-center">
                <FieldContent>
                  <FieldTitle>{speed}</FieldTitle>
                </FieldContent>
                <RadioGroupItem value={speed} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </div>

      <div className="grid gap-3">
        <p className="text-sm font-medium">การจัดแถว</p>
        <RadioGroup
          aria-label="เลือกการจัดแถว"
          className="grid grid-cols-4 gap-2"
          value={selectedFormation}
          onValueChange={(value) => {
            if (typeof value === "string") {
              onFormationChange(value as TargetFormation);
            }
          }}
        >
          {targetFormations.map((formation) => {
            const available = variants.formations.includes(formation.value);

            return (
              <FieldLabel
                key={formation.value}
                className="aspect-square h-auto"
              >
                <Field className="h-full items-center justify-center text-center">
                  <FieldContent>
                    <FieldTitle>{formation.label}</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem
                    className="sr-only"
                    disabled={!available}
                    value={formation.value}
                  />
                </Field>
              </FieldLabel>
            );
          })}
        </RadioGroup>
      </div>

      <div className="grid gap-3">
        <p className="text-sm font-medium">สัตว์เลี้ยง</p>
        <RadioGroup
          aria-label="เลือกสัตว์เลี้ยง"
          className="grid grid-cols-2 gap-2"
          value={selectedPetPackage.join("|")}
          onValueChange={(value) => {
            if (typeof value === "string") {
              const petPackage = variants.petPackages.find(
                (pets) => pets.join("|") === value
              );

              if (petPackage) {
                onPetPackageChange(petPackage);
              }
            }
          }}
        >
          {variants.petPackages.map((pets) => (
            <FieldLabel key={pets.join("|")} className="aspect-square h-auto">
              <Field className="h-full items-center justify-center">
                <FieldContent className="items-center text-center">
                  <PetChoice pets={pets} />
                </FieldContent>
                <RadioGroupItem className="sr-only" value={pets.join("|")} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </div>
    </FieldSet>
  );
}

function TargetSummary({ team }: { team: Team }) {
  const defaultVariants: TargetVariants = {
    speeds: ["ปกติ"],
    formations: ["2-3"],
    petPackages: [[team.pet]],
  };
  const variants = team.variants ?? defaultVariants;
  const defaultSpeed = variants.speeds[0] ?? "ปกติ";
  const defaultFormation = variants.formations[0] ?? "2-3";
  const defaultPetPackage = variants.petPackages[0] ?? [team.pet];
  const [selectedSpeed, setSelectedSpeed] = useState(defaultSpeed);
  const [selectedFormation, setSelectedFormation] = useState(defaultFormation);
  const [selectedPetPackage, setSelectedPetPackage] =
    useState(defaultPetPackage);
  const selectedTeam = withFormation(team, selectedFormation);
  const selectedPetLabel = selectedPetPackage.length
    ? `${selectedPetPackage[0]}${
        selectedPetPackage.length > 1
          ? ` +${selectedPetPackage.length - 1}`
          : ""
      }`
    : "ไม่ระบุ";
  const configuration = (
    <VariantConfiguration
      variants={variants}
      selectedSpeed={selectedSpeed}
      selectedFormation={selectedFormation}
      selectedPetPackage={selectedPetPackage}
      onSpeedChange={setSelectedSpeed}
      onFormationChange={setSelectedFormation}
      onPetPackageChange={setSelectedPetPackage}
    />
  );

  return (
    <section aria-labelledby="target-summary-title" className="grid gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-primary">ทีมที่ต้องการบุก</p>
          <h2
            id="target-summary-title"
            className="mt-2 text-xl font-semibold tracking-tight"
          >
            {team.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {team.condition}
          </p>
        </div>

        <div className="hidden shrink-0 lg:block">
          <Popover>
            <PopoverTrigger render={<Button size="sm" variant="outline" />}>
              เลือกรูปแบบ
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="max-h-[min(36rem,var(--available-height))] w-96 overflow-y-auto p-4"
            >
              <PopoverHeader>
                <PopoverTitle>เลือกรูปแบบ</PopoverTitle>
                <PopoverDescription>
                  ปรับความเร็ว การจัดแถว และสัตว์เลี้ยงแยกกัน
                </PopoverDescription>
              </PopoverHeader>
              {configuration}
            </PopoverContent>
          </Popover>
        </div>

        <div className="shrink-0 lg:hidden">
          <Drawer showSwipeHandle>
            <DrawerTrigger render={<Button size="sm" variant="outline" />}>
              เลือกรูปแบบ
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="mx-auto w-full sm:max-w-2xl">
                <DrawerTitle>เลือกรูปแบบ</DrawerTitle>
                <DrawerDescription>
                  ปรับความเร็ว การจัดแถว และสัตว์เลี้ยงแยกกัน
                </DrawerDescription>
              </DrawerHeader>
              <div className="min-h-0 flex-1 overflow-y-auto p-4 pt-6">
                <div className="mx-auto w-full sm:max-w-2xl">
                  {configuration}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <Lineup.Surface>
        <Lineup.Rows team={selectedTeam} />
      </Lineup.Surface>

      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">รูปแบบที่เลือก:</span>{" "}
        {selectedSpeed} · {selectedFormation} · {selectedPetLabel}
      </p>

      <dl className="border-y py-4 text-sm lg:border-b-0">
        <div>
          <dt className="text-xs text-muted-foreground">ประเภททีม</dt>
          <dd className="mt-1 font-medium">{team.type}</dd>
        </div>
        {team.tags?.length ? (
          <div className="mt-4">
            <dt className="text-xs text-muted-foreground">แท็กทีม</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {team.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

const defaultHeroGuidance = {
  purpose: "เติมบทบาทตามจังหวะและเงื่อนไขของทีม",
  equipment: "เซ็ตสมดุล · เพิ่มความอยู่รอด",
  note: "ปรับอุปกรณ์ตามตัวที่ต้องรับมือเป็นหลัก",
};

const heroGuidance: Record<string, typeof defaultHeroGuidance> = {
  โจมตี: {
    purpose: "เก็บความเสียหายไว้ปิดเป้าหมายตามจังหวะของทีม",
    equipment: "เซ็ตโจมตี · เพิ่มความเร็วตามที่ทีมกำหนด",
    note: "รอให้ตัวเปิดสร้างช่องก่อนใช้สกิลหลัก",
  },
  ป้องกัน: {
    purpose: "รับชุดสกิลแรก เพื่อให้ทีมมีจังหวะสวนกลับ",
    equipment: "เซ็ตป้องกัน · เพิ่มความอยู่รอด",
    note: "ยืนตำแหน่งเดิมและให้ความสำคัญกับการต้านสถานะ",
  },
  สนับสนุน: {
    purpose: "ค้ำจังหวะทีมด้วยบัฟ ฮีล หรือการควบคุม",
    equipment: "เซ็ตความเร็ว · แหวนต้านสถานะ",
    note: "ปรับความเร็วให้ต่อจากตัวเปิดของทีม",
  },
  เวทมนตร์: {
    purpose: "กดดันแถวหลังและควบคุมจังหวะของเป้าหมาย",
    equipment: "เซ็ตเวทมนตร์ · เพิ่มความเร็วตามที่ทีมกำหนด",
    note: "ระวังตัวต้านสถานะและจังหวะสวนกลับ",
  },
  สมดุล: defaultHeroGuidance,
};

function HeroDetailTile({
  hero,
  className,
}: {
  hero: Hero;
  className?: string;
}) {
  const guidance = heroGuidance[hero.role] ?? defaultHeroGuidance;

  return (
    <Dialog>
      <DialogTrigger
        aria-label={`ดูรายละเอียด ${hero.name}`}
        className={cn(
          "rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
      >
        <HeroPortrait hero={hero} />
      </DialogTrigger>
      <DialogContent className="max-w-md p-5" lang="th">
        <DialogHeader className="pr-8">
          <div className="flex items-center gap-4">
            <HeroPortrait hero={hero} />
            <div className="grid gap-1">
              <Badge className="w-fit" variant="secondary">
                {hero.role}
              </Badge>
              <DialogTitle>{hero.name}</DialogTitle>
            </div>
          </div>
          <DialogDescription>{guidance.purpose}</DialogDescription>
        </DialogHeader>
        <dl className="grid gap-4 border-y py-4 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">อุปกรณ์ที่แนะนำ</dt>
            <dd className="mt-1 font-medium">{guidance.equipment}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">หมายเหตุ</dt>
            <dd className="mt-1 leading-relaxed">{guidance.note}</dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}

function CounterHeroTile({
  hero,
  className,
  skills = [],
}: {
  hero: Hero;
  className?: string;
  skills?: SkillOrder[];
}) {
  const skillBySlot = new Map(skills.map((skill) => [skill.slot, skill]));

  return (
    <div className={cn("relative w-18 shrink-0", className)}>
      <HeroDetailTile hero={hero} />
      {skills.length ? (
        <ol
          aria-label={`ลำดับสกิล ${hero.name}`}
          className="absolute top-0 bottom-0 left-full z-10 ml-1"
        >
          {(["B", "T", "A"] as const).map((slot) => {
            const skill = skillBySlot.get(slot);

            return (
              <li
                key={slot}
                className={cn(
                  "absolute left-0 -translate-y-1/2",
                  slot === "B" &&
                    "top-[calc(50%-var(--lineup-hero-label-offset)+1.5rem)]",
                  slot === "T" &&
                    "top-[calc(50%-var(--lineup-hero-label-offset))]",
                  slot === "A" &&
                    "top-[calc(50%-var(--lineup-hero-label-offset)-1.5rem)]"
                )}
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full text-[10px] font-semibold shadow-sm",
                    skill
                      ? "bg-foreground text-background"
                      : "border bg-card text-muted-foreground"
                  )}
                >
                  {skill?.order ?? slot}
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}

function CounterStrategy({ team }: { team: Team }) {
  const variants: TargetVariants = team.variants ?? {
    speeds: ["ปกติ"],
    formations: ["2-3"],
    petPackages: [[team.pet]],
  };
  const selectedPets = variants.petPackages[0] ?? [team.pet];
  const selectedSpeed = variants.speeds[0] ?? "ปกติ";
  const selectedFormation = variants.formations[0] ?? "2-3";
  const speedOrder = team.speedOrder ?? team.heroes.map((hero) => hero.name);

  return (
    <section
      id="counter-strategy"
      aria-labelledby="counter-strategy-title"
      className="grid scroll-mt-(--design-header-block-size) gap-4"
    >
      <div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{team.type}</Badge>
          {team.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <h1
          id="counter-strategy-title"
          className="mt-3 text-3xl font-semibold tracking-tight"
        >
          {team.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          กดตัวละครเพื่อดูอุปกรณ์และข้อควรระวัง
        </p>
      </div>

      <section className="grid gap-2">
        <h2 className="flex items-center gap-2 font-semibold">
          <LightningIcon aria-hidden="true" className="text-primary" />
          เงื่อนไขสำคัญ
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {team.condition}
        </p>
      </section>

      <section className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-4 sm:grid-cols-[7rem_minmax(18rem,1fr)_7rem] sm:grid-rows-2 sm:gap-4">
        <section
          aria-label="ความเร็ว"
          className="col-start-2 row-start-1 flex flex-col gap-2 border-l pl-3 sm:col-start-1 sm:row-start-1 sm:self-start sm:border-l-0 sm:pl-0"
        >
          <SneakerMoveIcon aria-hidden="true" className="size-5 text-primary" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-primary">{selectedSpeed}</p>
            <p className="text-xs leading-snug text-muted-foreground">
              {speedOrder.join(" > ")}
            </p>
          </div>
        </section>

        <section
          aria-label="การจัดแถว"
          className="col-start-1 row-start-1 flex justify-start sm:col-start-3 sm:row-start-2 sm:justify-center sm:self-start sm:border-t sm:pt-3"
        >
          <FormationPreview formation={selectedFormation} />
        </section>

        <div className="col-span-2 row-start-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:self-center">
          <Lineup.Rows HeroTile={CounterHeroTile} team={team} />
        </div>

        <section
          aria-label="สัตว์เลี้ยง"
          className="col-span-2 row-start-3 flex justify-center sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:self-center"
        >
          <PetChoice pets={selectedPets} />
        </section>
      </section>

      <p className="text-sm text-muted-foreground">บันทึกโดย BelXenonZ</p>
    </section>
  );
}

function CounterTeamLink({ target, team }: { target: Team; team: Team }) {
  return (
    <Link
      href={`/design?target=${target.id}&counter=${team.id}#counter-strategy`}
      className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <TeamCard team={team} counter />
    </Link>
  );
}

function CounterTeamMiniCard({ team }: { team: Team }) {
  return (
    <Card
      size="sm"
      className="h-full transition-shadow motion-safe:duration-150 motion-safe:hover:shadow-md motion-reduce:transition-none"
    >
      <CardHeader>
        <Badge className="w-fit" variant="secondary">
          {team.type}
        </Badge>
        <CardTitle className="line-clamp-2">{team.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
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
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {team.condition}
        </p>
      </CardContent>
    </Card>
  );
}

function OtherCounterTeams({ target, teams }: { target: Team; teams: Team[] }) {
  return (
    <section
      aria-labelledby="other-counters-heading"
      className="grid gap-4 border-t pt-6"
    >
      <h2 id="other-counters-heading" className="font-semibold">
        ทีมแก้อื่น
      </h2>
      <Carousel className="min-w-0 lg:px-10" opts={{ align: "start" }}>
        <CarouselContent className="-ml-3 p-1">
          {teams.map((team) => (
            <CarouselItem
              key={team.id}
              className="basis-[15rem] pl-3 sm:basis-[17rem]"
            >
              <Link
                href={`/design?target=${target.id}&counter=${team.id}#counter-strategy`}
                className="block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <CounterTeamMiniCard team={team} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 hidden lg:inline-flex" />
        <CarouselNext className="right-1 hidden lg:inline-flex" />
      </Carousel>
    </section>
  );
}

export function DesignPreview({
  bannerExpanded: initialBannerExpanded,
  targets,
  target,
  counters,
  counter,
}: {
  bannerExpanded: boolean;
  targets: Team[];
  target?: Team;
  counters: Team[];
  counter?: Team;
}) {
  const [query, setQuery] = useState("");
  const [teamTypes, setTeamTypes] = useState<TargetTeamType[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [onlyResolved, setOnlyResolved] = useState(false);
  const [bannerExpanded, setBannerExpanded] = useState(initialBannerExpanded);
  const [copied, setCopied] = useState("");
  const [showBackToDiscovery, setShowBackToDiscovery] = useState(false);
  const discoveryRef = useRef<HTMLElement>(null);
  const tagsAnchor = useComboboxAnchor();

  const availableTags = Array.from(
    new Set(targets.flatMap((team) => team.tags ?? []))
  );

  const filtered = targets.filter(
    (team) =>
      (!teamTypes.length ||
        (team.targetType !== undefined &&
          teamTypes.includes(team.targetType))) &&
      (!tags.length || tags.some((tag) => team.tags?.includes(tag))) &&
      (!onlyResolved || team.counters > 0) &&
      team.heroes.some((hero) =>
        hero.name.toLowerCase().includes(query.trim().toLowerCase())
      )
  );

  useEffect(() => {
    const discovery = discoveryRef.current;

    if (target || !discovery) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry) {
          setShowBackToDiscovery(!entry.isIntersecting);
        }
      },
      { threshold: 0 }
    );

    observer.observe(discovery);

    return () => {
      observer.disconnect();
    };
  }, [target]);

  function scrollToDiscovery() {
    discoveryRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  async function toggleBanner() {
    const nextExpanded = !bannerExpanded;

    setBannerExpanded(nextExpanded);

    try {
      await setBannerExpandedCookie(nextExpanded);
    } catch {
      setBannerExpanded(!nextExpanded);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied("คัดลอกลิงก์แล้ว");
    } catch {
      setCopied("คัดลอก URL จากแถบที่อยู่ได้เลย");
    }
  }

  return (
    <div
      className="min-h-svh bg-background text-foreground [--design-header-block-size:calc(var(--design-header-content-height)+1px)] [--design-header-content-height:4rem]"
      lang="th"
    >
      <header className="sticky top-0 z-20 border-b backdrop-blur-2xl">
        <div className="container flex h-(--design-header-content-height) items-center justify-between gap-3">
          <Link
            href="/design"
            className="flex items-center gap-2 text-xl font-semibold tracking-tight"
          >
            <FlowerIcon className="size-7 text-primary" />
            Poysian
            <span className="ml-2 hidden border-l pl-4 text-sm font-normal tracking-normal text-muted-foreground sm:inline">
              Pandora Guild
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              พื้นที่เล็ก ๆ ของทีมเรา
            </span>
            <Button
              variant="outline"
              onClick={() => {
                void copyLink();
              }}
            >
              <CopyIcon data-icon="inline-start" />
              แชร์กิลด์
            </Button>
          </div>
        </div>
        {!target && showBackToDiscovery && (
          <div className="pointer-events-none absolute inset-x-0 top-full motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-top-2">
            <div className="container flex justify-center pt-3">
              <Button
                className="pointer-events-auto shadow-lg"
                onClick={scrollToDiscovery}
              >
                <ArrowUpIcon data-icon="inline-start" />
                กลับไปค้นหา
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {target ? (
          <div className="container py-8 sm:py-8 lg:py-0">
            <div className="grid items-start gap-8 lg:min-h-[calc(100svh-var(--design-header-block-size))] lg:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-(--design-header-block-size) lg:self-start lg:pt-8">
                <aside className="grid gap-4">
                  <Link
                    href="/design"
                    className={cn(
                      buttonVariants({
                        variant: "link",
                        size: "sm",
                        className:
                          "inline-flex w-fit items-center gap-2 px-0 text-muted-foreground",
                      })
                    )}
                  >
                    <ArrowLeftIcon />
                    กลับ
                  </Link>
                  <TargetSummary key={target.id} team={target} />
                </aside>
              </div>
              <div className="lg:pt-8">
                <section className="grid gap-6">
                  {counter ? (
                    <>
                      <CounterStrategy team={counter} />
                      {counters.length > 1 ? (
                        <OtherCounterTeams
                          target={target}
                          teams={counters.filter(
                            (team) => team.id !== counter.id
                          )}
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs font-medium text-primary">
                          เลือกแนวทางที่เหมาะกับคุณ
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                          ทีมแก้ที่บันทึกไว้{" "}
                          <span className="text-muted-foreground">
                            ({counters.length})
                          </span>
                        </h1>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          เลือกทีมแก้เพื่อดูเงื่อนไขและรายละเอียดตัวละคร
                        </p>
                      </div>

                      <div className="grid gap-5 xl:grid-cols-2">
                        {counters.map((team) => (
                          <CounterTeamLink
                            key={team.id}
                            target={target}
                            team={team}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {!counters.length ? (
                    <div className="rounded-xl border border-dashed p-8 text-center">
                      <FlowerIcon className="mx-auto mb-4 size-8 text-primary" />
                      <h2 className="font-semibold">
                        ยังไม่มีทีมแก้สำหรับทีมนี้
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        พื้นที่สำหรับแนวทางใหม่ที่กิลด์ของเราค้นพบ
                      </p>
                    </div>
                  ) : null}
                </section>
              </div>
            </div>

            <p role="status" className="mt-4 text-sm text-primary">
              {copied && (
                <>
                  <CheckCircleIcon className="mr-1 inline" />
                  {copied}
                </>
              )}
            </p>
          </div>
        ) : (
          <>
            <div className="container py-8 sm:py-8">
              <section
                className={cn(
                  "relative overflow-hidden rounded-3xl bg-secondary transition-[padding] motion-safe:duration-200 motion-reduce:transition-none",
                  bannerExpanded ? "p-7 sm:p-10" : "p-3 sm:p-4"
                )}
              >
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <FlowerIcon aria-hidden="true" weight="fill" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold tracking-tight">
                          Poysian
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          คู่มือทีมของ Pandora
                        </p>
                      </div>
                    </div>
                    <Button
                      aria-controls="guild-introduction"
                      aria-expanded={bannerExpanded}
                      onClick={() => void toggleBanner()}
                      size="sm"
                      variant="ghost"
                    >
                      {bannerExpanded ? "ย่อ" : "ขยาย"}
                      {bannerExpanded ? (
                        <CaretUpIcon data-icon="inline-end" />
                      ) : (
                        <CaretDownIcon data-icon="inline-end" />
                      )}
                    </Button>
                  </div>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] motion-safe:duration-200 motion-reduce:transition-none",
                      bannerExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                    id="guild-introduction"
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="max-w-xl pt-6">
                        <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">
                          เจอทีมไหน
                          <br />
                          <span className="text-primary">ก็มีทางไปต่อ</span>
                        </h1>
                        <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                          รวมทีมเป้าหมายและแนวทางแก้จากเพื่อนในกิลด์
                          <br className="hidden sm:block" />
                          ค้นหาทีมที่เจอ แล้วเลือกกลยุทธ์ที่เหมาะกับคุณ
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <ShieldIcon />
                            {targets.length} ทีมเป้าหมาย
                          </span>
                          <span className="flex items-center gap-1.5">
                            <SwordIcon />
                            {targets.reduce(
                              (sum, team) => sum + team.counters,
                              0
                            )}{" "}
                            แนวทางแก้
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <FlowerIcon
                  weight="thin"
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -right-12 -bottom-20 size-80 rotate-12 text-primary/10 transition-opacity motion-safe:duration-200 motion-reduce:transition-none sm:right-6 sm:-bottom-16 sm:size-96",
                    bannerExpanded ? "opacity-100" : "opacity-0"
                  )}
                />
              </section>

              <section
                ref={discoveryRef}
                aria-labelledby="targets-heading"
                className="mt-8 grid scroll-mt-28 gap-6"
              >
                <div>
                  <p className="text-xs font-medium text-primary">
                    เริ่มจากทีมที่คุณเจอ
                  </p>
                  <h2
                    id="targets-heading"
                    className="mt-2 text-2xl font-semibold"
                  >
                    ทีมเป้าหมาย
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    เลือกทีมที่พบ แล้วดูแนวทางบุกที่กิลด์บันทึกไว้
                  </p>
                </div>

                <InputGroup className="h-10 rounded-xl bg-card">
                  <InputGroupAddon>
                    <MagnifyingGlassIcon aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="target-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="ค้นหาด้วยชื่อตัวละคร เช่น Yeonhee หรือ Rudy"
                    aria-label="ค้นหาด้วยชื่อตัวละคร"
                    className="h-full text-sm"
                  />
                </InputGroup>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,20rem)] lg:items-end">
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">ประเภททีม</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <ToggleGroup
                        multiple
                        value={teamTypes}
                        onValueChange={(values) => {
                          setTeamTypes(values as TargetTeamType[]);
                        }}
                        size="sm"
                        variant="outline"
                        className="flex w-fit flex-wrap"
                        aria-label="กรองตามประเภททีม"
                      >
                        {targetTeamTypes.map((teamType) => (
                          <ToggleGroupItem
                            key={teamType.value}
                            value={teamType.value}
                          >
                            {teamType.label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                      <Toggle
                        pressed={onlyResolved}
                        onPressedChange={setOnlyResolved}
                        size="sm"
                        variant="outline"
                      >
                        เฉพาะที่มีทีมแก้
                      </Toggle>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <p className="text-sm font-medium">แท็กของทีม</p>
                    <Combobox
                      multiple
                      items={availableTags}
                      value={tags}
                      onValueChange={(value) => {
                        setTags(value);
                      }}
                    >
                      <ComboboxChips ref={tagsAnchor} className="bg-card">
                        {tags.map((selectedTag) => (
                          <ComboboxChip key={selectedTag}>
                            {selectedTag}
                          </ComboboxChip>
                        ))}
                        <ComboboxChipsInput
                          aria-label="ค้นหาและเลือกแท็กทีม"
                          placeholder={
                            tags.length ? "เพิ่มแท็ก" : "ค้นหาหรือเลือกแท็ก"
                          }
                        />
                      </ComboboxChips>
                      <ComboboxContent anchor={tagsAnchor}>
                        <ComboboxList>
                          <ComboboxEmpty>ไม่พบแท็ก</ComboboxEmpty>
                          <ComboboxCollection>
                            {(availableTag) => (
                              <ComboboxItem
                                key={String(availableTag)}
                                value={String(availableTag)}
                              >
                                {String(availableTag)}
                              </ComboboxItem>
                            )}
                          </ComboboxCollection>
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                </div>
              </section>
              <section className="mt-8" aria-labelledby="targets-heading">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="text-sm font-medium">ทีมเป้าหมายที่พบ</p>
                  <p
                    aria-live="polite"
                    className="text-sm text-muted-foreground"
                  >
                    ทั้งหมด {filtered.length} ทีม
                  </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((team) => (
                    <Link
                      key={team.id}
                      href={`/design?target=${team.id}`}
                      className="block rounded-xl transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:duration-150 motion-safe:hover:-translate-y-1 motion-reduce:transition-none"
                    >
                      <TeamCard team={team} />
                    </Link>
                  ))}
                </div>

                {!filtered.length && (
                  <div className="py-12 text-center">
                    <p className="mb-4 text-muted-foreground">
                      ไม่พบทีม ลองค้นหาด้วยชื่ออื่น
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setQuery("");
                        setTeamTypes([]);
                        setTags([]);
                        setOnlyResolved(false);
                      }}
                    >
                      ล้างการค้นหา
                    </Button>
                  </div>
                )}
              </section>

              <section className="mt-10 flex items-start gap-4 rounded-xl border border-dashed p-6">
                <SparkleIcon className="mt-1 size-6 shrink-0 text-primary" />
                <div>
                  <h2 className="text-sm font-semibold">
                    ทุกแนวทาง เริ่มจากคนในกิลด์
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    เก็บวิธีที่ได้ผล บอกเงื่อนไขที่สำคัญ
                    แล้วส่งต่อให้เพื่อนใช้ต่อได้
                  </p>
                </div>
              </section>

              <p role="status" className="mt-4 text-sm text-primary">
                {copied && (
                  <>
                    <CheckCircleIcon className="mr-1 inline" />
                    {copied}
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </main>

      <footer className="container flex flex-wrap items-center justify-between gap-3 border-t py-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <FlowerIcon />
          Poysian · เติบโตไปด้วยกัน
        </span>
        <span>ตัวอย่างการออกแบบ · ข้อมูลทีมสมมติ</span>
      </footer>
    </div>
  );
}
