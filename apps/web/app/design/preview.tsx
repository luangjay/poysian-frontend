"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import { Button, buttonVariants } from "@workspace/ui/components/button";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { Separator } from "@workspace/ui/components/separator";
import { Toggle } from "@workspace/ui/components/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { cn } from "@workspace/ui/lib/utils";
import {
  targetTeamTypes,
  teamVariants,
  type SkillOrder,
  type TargetTeamType,
  type Team,
} from "./_data";
import { CounterHeroTile } from "./hero-detail-dialog";
import {
  formationLabel,
  gameUiAssetBaseUrl,
  HeroPortrait,
  Lineup,
} from "./lineup";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { TargetSummary } from "./target-variant-dock";
import {
  CounterTeamMiniCard,
  TeamCard,
  TeamTypeBadge,
  teamTypeTextClass,
} from "./team-card";

/** The game's own idle illustration — someone waiting it out by a campfire. */
function EmptyStateArt() {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="mx-auto mb-4 size-28 select-none"
      height={256}
      sizes="112px"
      src={`${gameUiAssetBaseUrl}/Atl_UI-PopUP_01_Sprite_100.png`}
      width={256}
    />
  );
}

const GUILD_NAME = "PANDOARA";

function SectionHeading({
  id,
  title,
  description,
  aside,
  level = 2,
}: {
  id: string;
  title: string;
  description?: string;
  aside?: React.ReactNode;
  /** The discovery list is the page subject, so it owns the h1. */
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="grid gap-1.5">
        <Heading id={id} className="text-xl font-semibold tracking-tight">
          {title}
        </Heading>
        {description ? (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {aside}
    </div>
  );
}

/** The target, demoted to context: who you are up against, at a glance. */
function TargetReferenceStrip({ team }: { team: Team }) {
  const variants = teamVariants(team);
  const facts = [
    variants.speeds[0] ?? "ปกติ",
    formationLabel(variants.formations[0] ?? "2-3"),
    (variants.petPackages[0] ?? [team.pet]).join(" · "),
  ];

  return (
    <section
      aria-labelledby="target-reference-title"
      className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border bg-card p-4"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className={cn("text-xs font-medium", teamTypeTextClass(team))}>
          กำลังแก้ทีมนี้
        </p>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p
            id="target-reference-title"
            className="truncate font-semibold tracking-tight"
          >
            {team.title}
          </p>
          <TeamTypeBadge team={team} />
        </div>
        <p className="text-xs text-muted-foreground">{facts.join(" · ")}</p>
      </div>
      <div className="flex shrink-0 items-start gap-1">
        {team.heroes.map((hero) => (
          <HeroPortrait key={hero.name} hero={hero} size="sm" />
        ))}
      </div>
    </section>
  );
}

/** Skill order, read as a sequence rather than pills floating beside portraits. */
function PlaySequence({
  skillOrder,
  speedOrder,
}: {
  skillOrder: SkillOrder[];
  speedOrder: string[];
}) {
  const steps = [...skillOrder].sort((a, b) => a.order - b.order);

  return (
    <div className="grid gap-4 rounded-2xl border bg-card p-4">
      <div className="grid gap-1.5">
        <h2 className="font-semibold tracking-tight">ลำดับการเล่น</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          ปล่อยสกิลตามลำดับนี้ ตั้งแต่เทิร์นแรก
        </p>
      </div>
      {steps.length ? (
        <ol className="grid gap-2">
          {steps.map((step) => (
            <li
              key={`${step.hero}-${step.slot}-${step.order}`}
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-1.5"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {step.order}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {step.hero}
              </span>
              <span className="grid size-6 shrink-0 place-items-center rounded-full border bg-card text-xs font-semibold text-muted-foreground">
                {step.slot}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted-foreground">ไม่ได้ระบุลำดับสกิล</p>
      )}
      <div className="grid gap-1.5 border-t pt-3.5">
        <p className="text-xs font-medium text-muted-foreground">
          ลำดับความเร็ว
        </p>
        <p className="text-sm leading-relaxed">{speedOrder.join(" > ")}</p>
      </div>
      <p className="text-xs text-muted-foreground">โดย BelXenonZ</p>
    </div>
  );
}

/**
 * The counter is the subject of this page, not one of several choices, so it is
 * the page itself — no Card wrapper — and it gets the full measure.
 */
function CounterStrategy({ target, team }: { target: Team; team: Team }) {
  const variants = teamVariants(team);
  const selectedPets = variants.petPackages[0] ?? [team.pet];
  const selectedSpeed = variants.speeds[0] ?? "ปกติ";
  const selectedFormation = variants.formations[0] ?? "2-3";
  const speedOrder = team.speedOrder ?? team.heroes.map((hero) => hero.name);

  return (
    <section
      aria-labelledby="counter-strategy-title"
      id="counter-strategy"
      className="grid scroll-mt-(--design-header-block-size) gap-4"
    >
      <div className="grid gap-2.5">
        <p className="text-xs font-medium text-primary">ทีมแก้</p>
        <h1
          id="counter-strategy-title"
          className="text-2xl font-semibold tracking-tight"
        >
          {team.title}
        </h1>
        {team.tags?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {team.tags.map((tag) => (
              <Badge key={tag} className="rounded-md" variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          {team.condition}
        </p>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <Lineup.Surface className="max-w-none">
          <Lineup.Rows
            HeroTile={CounterHeroTile}
            loading="eager"
            sharedHeroNames={target.heroes.map((hero) => hero.name)}
            team={team}
          />
          <Lineup.Variants>
            <Lineup.Speed value={selectedSpeed} />
            <Lineup.Pets pets={selectedPets} />
            <Lineup.Formation formation={selectedFormation} />
          </Lineup.Variants>
        </Lineup.Surface>
        <PlaySequence
          skillOrder={team.skillOrder ?? []}
          speedOrder={speedOrder}
        />
      </div>
    </section>
  );
}

/**
 * A way out, not a destination — so it carries no chrome at rest and only
 * picks up a hover surface. On the target view the wrapper collapses to zero
 * height from `lg`: the link then overhangs the text column, which leaves the
 * top of the page to the lineup.
 */
function BackLink({
  className,
  href,
  label,
}: {
  className?: string;
  href: string;
  label: string;
}) {
  return (
    // `relative` is load-bearing: with `lg:h-0` the link overhangs the grid
    // that follows it, and a static box loses hit-testing to a later sibling
    // painted over it — the text column's padding was swallowing the clicks.
    <div className={cn("relative z-10 mb-6", className)}>
      <Link
        href={href}
        className={cn(
          buttonVariants({
            variant: "link",
            size: "sm",
            className: "w-fit px-0 text-muted-foreground",
          })
        )}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        {label}
      </Link>
    </div>
  );
}

function CounterTeamLink({ target, team }: { target: Team; team: Team }) {
  return (
    <Link
      href={`/design?target=${target.id}&counter=${team.id}`}
      className="group block rounded-xl outline-none"
    >
      <TeamCard
        counter
        sharedHeroNames={target.heroes.map((hero) => hero.name)}
        team={team}
      />
    </Link>
  );
}

function OtherCounterTeams({ target, teams }: { target: Team; teams: Team[] }) {
  return (
    <section aria-labelledby="other-counters-heading" className="grid gap-4">
      <Separator />
      <SectionHeading
        id="other-counters-heading"
        title="ทีมอื่น"
        description="ทีมแก้อื่นสำหรับเป้าหมายเดียวกัน"
      />
      <Carousel className="min-w-0 lg:px-10" opts={{ align: "start" }}>
        <CarouselContent className="-ml-3 p-1">
          {teams.map((team) => (
            <CarouselItem key={team.id} className="basis-60 pl-3 sm:basis-68">
              <Link
                href={`/design?target=${target.id}&counter=${team.id}`}
                className="group block h-full rounded-xl outline-none"
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
  targets,
  target,
  counters,
  counter,
}: {
  targets: Team[];
  target?: Team;
  counters: Team[];
  counter?: Team;
}) {
  const [query, setQuery] = useState("");
  const [teamTypes, setTeamTypes] = useState<TargetTeamType[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [onlyResolved, setOnlyResolved] = useState(false);
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

  function scrollToDiscovery() {
    discoveryRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    document.getElementById("target-search")?.focus({ preventScroll: true });
  }

  function clearFilters() {
    setQuery("");
    setTeamTypes([]);
    setTags([]);
    setOnlyResolved(false);
  }

  return (
    <div className="min-h-svh bg-muted/40 text-foreground [--design-header-block-size:calc(var(--design-header-content-height)+1.5rem)] [--design-header-content-height:4rem]">
      <SiteHeader
        guildName={GUILD_NAME}
        onJumpToSearch={target ? undefined : scrollToDiscovery}
        shareTitle={counter?.title ?? target?.title ?? "Poysian"}
      />

      <main className="container grid gap-8 pt-6 pb-8">
        {target ? (
          <div>
            <BackLink
              // The counter view opens on a full-width strip, so there is
              // nothing for the link to overhang — it keeps its own row there.
              className={counter ? undefined : "lg:mb-0 lg:h-0"}
              href={counter ? `/design?target=${target.id}` : "/design"}
              label={counter ? "กลับไปดูทีมแก้" : "กลับไปดูทีมเป้าหมาย"}
            />
            <div className="grid gap-8">
              {counter ? (
                <>
                  <TargetReferenceStrip team={target} />
                  <CounterStrategy target={target} team={counter} />
                  {counters.length > 1 ? (
                    <OtherCounterTeams
                      target={target}
                      teams={counters.filter((team) => team.id !== counter.id)}
                    />
                  ) : null}
                </>
              ) : (
                <>
                  <TargetSummary key={target.id} team={target} />
                  <section
                    aria-labelledby="saved-counters-heading"
                    className="grid gap-4"
                  >
                    <Separator />
                    <SectionHeading
                      id="saved-counters-heading"
                      title="ทีมแก้ที่บันทึกไว้"
                      description="เลือกทีมแก้เพื่อดูลำดับสกิลและแผนการรบ"
                      aside={
                        <span className="text-sm font-medium text-foreground tabular-nums">
                          {counters.length} ทีม
                        </span>
                      }
                    />
                    {counters.length ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {counters.map((team) => (
                          <CounterTeamLink
                            key={team.id}
                            target={target}
                            team={team}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed bg-card/50 p-8 text-center">
                        <EmptyStateArt />
                        <h3 className="font-semibold">ยังไม่มีทีมแก้</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          กิลด์ยังไม่ได้บันทึกทีมแก้สำหรับเป้าหมายนี้
                        </p>
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          </div>
        ) : (
          <section
            ref={discoveryRef}
            aria-labelledby="targets-heading"
            className="grid scroll-mt-(--design-header-block-size) gap-4"
          >
            <SectionHeading
              level={1}
              id="targets-heading"
              title="ทีมเป้าหมาย"
              description="เลือกเป้าหมายเพื่อดูทีมแก้ที่กิลด์บันทึกไว้"
              aside={
                <p
                  aria-live="polite"
                  className="text-sm font-medium text-foreground tabular-nums"
                >
                  {filtered.length} ทีม
                </p>
              }
            />

            <div className="grid gap-4 rounded-2xl border bg-card p-4">
              <InputGroup className="h-9 rounded-xl">
                <InputGroupAddon>
                  <MagnifyingGlassIcon aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  id="target-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ค้นหาด้วยชื่อตัวละคร"
                  aria-label="ค้นหาด้วยชื่อตัวละคร"
                  className="h-full text-sm"
                />
              </InputGroup>

              <div className="grid gap-3 md:flex md:items-end">
                <div className="order-2 grid min-w-0 gap-2 md:order-0 md:flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    ประเภททีม
                  </p>
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
                          className={cn(
                            "rounded-full",
                            teamType.value === "defensive" &&
                              "border-defensive/30 text-defensive hover:border-defensive/40 hover:bg-defensive/10! hover:text-defensive aria-pressed:border-transparent! aria-pressed:bg-defensive/10! aria-pressed:text-defensive!",
                            teamType.value === "offensive" &&
                              "border-offensive/30 text-offensive hover:border-offensive/40 hover:bg-offensive/10! hover:text-offensive aria-pressed:border-transparent! aria-pressed:bg-offensive/10! aria-pressed:text-offensive!",
                            teamType.value === "magic" &&
                              "border-magic/30 text-magic hover:border-magic/40 hover:bg-magic/10! hover:text-magic aria-pressed:border-transparent! aria-pressed:bg-magic/10! aria-pressed:text-magic!",
                            teamType.value === "other" &&
                              "border-universal/30 text-universal hover:border-universal/40 hover:bg-universal/10! hover:text-universal aria-pressed:border-transparent! aria-pressed:bg-universal/10! aria-pressed:text-universal!"
                          )}
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

                <div className="order-1 grid gap-2 md:order-0 md:max-w-56 md:flex-1 md:shrink-0 lg:max-w-68">
                  <p className="text-xs font-medium text-muted-foreground">
                    แท็กทีม
                  </p>
                  <Combobox
                    multiple
                    items={availableTags}
                    value={tags}
                    onValueChange={(value) => {
                      setTags(value);
                    }}
                  >
                    <ComboboxChips
                      ref={tagsAnchor}
                      className="min-h-9 rounded-xl has-data-[slot=combobox-chip]:px-2"
                    >
                      {tags.map((selectedTag) => (
                        <ComboboxChip key={selectedTag}>
                          {selectedTag}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        aria-label="ค้นหาและเลือกแท็กทีม"
                        placeholder={tags.length ? "เพิ่มแท็ก" : "ค้นหาแท็ก"}
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
            </div>

            {filtered.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((team, index) => (
                  <Link
                    key={team.id}
                    href={`/design?target=${team.id}`}
                    className="group block rounded-xl outline-none"
                  >
                    <TeamCard eagerImages={index === 0} team={team} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed bg-card/50 p-8 text-center">
                <EmptyStateArt />
                <h3 className="font-semibold">ไม่พบทีมเป้าหมาย</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  ลองลดตัวกรองหรือค้นหาด้วยชื่ออื่น
                </p>
                <Button
                  className="mt-5"
                  variant="outline"
                  onClick={clearFilters}
                >
                  ล้างตัวกรอง
                </Button>
              </div>
            )}
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
