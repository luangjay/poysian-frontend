"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  CaretDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  CopyIcon,
  FlowerIcon,
  MagnifyingGlassIcon,
  ShieldIcon,
  SneakerMoveIcon,
  SwordIcon,
} from "@phosphor-icons/react";
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
import { Toggle } from "@workspace/ui/components/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { cn } from "@workspace/ui/lib/utils";
import {
  targetTeamTypes,
  type TargetTeamType,
  type TargetVariants,
  type Team,
} from "./_data";
import { setBannerExpandedCookie } from "./actions";
import { CounterHeroTile } from "./hero-detail-dialog";
import { FormationPreview, Lineup, PetChoice } from "./lineup";
import { TargetSummary } from "./target-variant-dock";
import { CounterTeamMiniCard, TeamCard, TeamTypeBadge } from "./team-card";

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
      className="grid scroll-mt-(--design-header-block-size) gap-5"
    >
      <div>
        <div className="flex flex-wrap gap-1.5">
          <TeamTypeBadge team={team} />
          {team.tags?.map((tag) => (
            <Badge key={tag} className="rounded-md" variant="outline">
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
          {team.condition}
        </p>
      </div>

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
          <Lineup.Rows HeroTile={CounterHeroTile} loading="eager" team={team} />
        </div>

        <section
          aria-label="สัตว์เลี้ยง"
          className="col-span-2 row-start-3 flex justify-center sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:self-center"
        >
          <PetChoice pets={selectedPets} />
        </section>
      </section>

      <p className="text-xs text-muted-foreground">โดย BelXenonZ</p>
    </section>
  );
}

function CounterTeamLink({ target, team }: { target: Team; team: Team }) {
  return (
    <Link
      href={`/design?target=${target.id}&counter=${team.id}`}
      className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <TeamCard team={team} counter />
    </Link>
  );
}

function OtherCounterTeams({ target, teams }: { target: Team; teams: Team[] }) {
  return (
    <section
      aria-labelledby="other-counters-heading"
      className="grid gap-4 border-t pt-6"
    >
      <h2 id="other-counters-heading" className="font-semibold">
        ทีมอื่น
      </h2>
      <Carousel className="min-w-0 lg:px-10" opts={{ align: "start" }}>
        <CarouselContent className="-ml-3 p-1">
          {teams.map((team) => (
            <CarouselItem
              key={team.id}
              className="basis-[15rem] pl-3 sm:basis-[17rem]"
            >
              <Link
                href={`/design?target=${target.id}&counter=${team.id}`}
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
      <header className="sticky top-0 z-50 border-b backdrop-blur-2xl">
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
            <Button
              aria-label="แชร์กิลด์"
              variant="outline"
              onClick={() => {
                void copyLink();
              }}
            >
              <CopyIcon data-icon="inline-start" />
              แชร์
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
                ค้นหา
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {target ? (
          <div className="container flex flex-col gap-4 py-8 md:min-h-[calc(100svh-var(--design-header-block-size))]">
            <Link
              href={counter ? `/design?target=${target.id}` : "/design"}
              className={cn(
                buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "w-fit px-0 text-muted-foreground",
                })
              )}
            >
              <ArrowLeftIcon data-icon="inline-start" />
              {counter ? "กลับไปดูทีมแก้" : "กลับไปดูทีมเป้าหมาย"}
            </Link>

            <div className="grid flex-1 items-start gap-8">
              <TargetSummary key={target.id} team={target} />
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
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                          ทีมแก้ที่บันทึกไว้
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                          เลือกทีมเพื่อดูรูปแบบ ลำดับสกิล และอุปกรณ์
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {counters.length} ทีม
                      </span>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
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
                    <h2 className="font-semibold">ยังไม่มีทีมแก้</h2>
                  </div>
                ) : null}
              </section>
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
                  "relative hidden overflow-hidden rounded-3xl bg-secondary transition-[padding] motion-safe:duration-200 motion-reduce:transition-none",
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
                          ค้นหาทีม แล้วเลือกทางแก้ที่กิลด์บันทึกไว้
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <ShieldIcon />
                            {targets.length} เป้าหมาย
                          </span>
                          <span className="flex items-center gap-1.5">
                            <SwordIcon />
                            {targets.reduce(
                              (sum, team) => sum + team.counters,
                              0
                            )}{" "}
                            ทีมแก้
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
                className="grid scroll-mt-28 gap-5"
              >
                <div className="flex items-end justify-between gap-4">
                  <div className="grid gap-1">
                    <h2
                      id="targets-heading"
                      className="text-xl font-semibold tracking-tight"
                    >
                      ทีมเป้าหมาย
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      เลือกทีมเพื่อดูแนวทางที่กิลด์บันทึกไว้
                    </p>
                  </div>
                  <p
                    aria-live="polite"
                    className="pt-1 text-sm text-muted-foreground"
                  >
                    {filtered.length} ทีม
                  </p>
                </div>

                <InputGroup className="h-10 rounded-2xl bg-card">
                  <InputGroupAddon>
                    <MagnifyingGlassIcon aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="target-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="ค้นหาชื่อตัวละคร"
                    aria-label="ค้นหาด้วยชื่อตัวละคร"
                    className="h-full text-sm"
                  />
                </InputGroup>

                <div className="grid gap-4 sm:flex sm:items-end">
                  <div className="order-2 grid min-w-0 gap-2 sm:order-0 sm:flex-1">
                    <p className="text-sm text-muted-foreground">ประเภททีม</p>
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

                  <div className="order-1 grid gap-2 sm:order-0 sm:max-w-76.5 sm:flex-1 sm:shrink-0">
                    <p className="text-sm text-muted-foreground">แท็กทีม</p>
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
                        className="min-h-8.5 rounded-xl bg-card"
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
              </section>
              <section className="mt-6" aria-labelledby="targets-heading">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((team, index) => (
                    <Link
                      key={team.id}
                      href={`/design?target=${team.id}`}
                      className="block rounded-xl transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:duration-150 motion-safe:hover:-translate-y-1 motion-reduce:transition-none"
                    >
                      <TeamCard eagerImages={index === 0} team={team} />
                    </Link>
                  ))}
                </div>

                {!filtered.length ? (
                  <div className="py-12 text-center">
                    <p className="mb-4 text-muted-foreground">ไม่พบทีม</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setQuery("");
                        setTeamTypes([]);
                        setTags([]);
                        setOnlyResolved(false);
                      }}
                    >
                      ล้างตัวกรอง
                    </Button>
                  </div>
                ) : null}
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
          Poysian · Pandora Guild
        </span>
        <span>ข้อมูลสมมติ</span>
      </footer>
    </div>
  );
}
