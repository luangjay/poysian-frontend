"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  CaretDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  CopyIcon,
  FlowerIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  PawPrintIcon,
  ShieldIcon,
  SparkleIcon,
  SwordIcon,
} from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
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
  type Hero,
  type TargetTeamType,
  type Team,
} from "./_data";
import { setBannerExpandedCookie } from "./actions";

function HeroPortrait({ hero, className }: { hero: Hero; className?: string }) {
  return (
    <div
      className={cn(
        "grid w-16 shrink-0 justify-items-center gap-1 text-center",
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

function Lineup({ team }: { team: Team }) {
  return (
    <div
      className="grid overflow-hidden rounded-xl border bg-accent shadow-xs sm:grid-cols-[minmax(0,1fr)_auto]"
      aria-label="การจัดทีม"
    >
      <div className="grid grid-rows-2 gap-4 p-3">
        {(["front", "back"] as const).map((row) => {
          const heroes = team.heroes.filter((hero) => hero.row === row);
          const stacked = heroes.length === 3;

          return (
            <div
              key={row}
              className={cn(
                "relative flex items-center gap-2",
                row === "back" && "order-first"
              )}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 h-px bg-primary/20"
              />
              <div className="relative flex flex-1 justify-center">
                {heroes.length ? (
                  heroes.map((hero, index) => (
                    <HeroPortrait
                      key={hero.name}
                      hero={hero}
                      className={cn(stacked && index > 0 && "-ml-6")}
                    />
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    ไม่มีตัวละคร
                  </span>
                )}
              </div>
              <span
                className="relative grid size-6 place-items-center rounded-full border bg-background text-xs font-medium text-primary"
                aria-label={row === "back" ? "แถวหลัง" : "แถวหน้า"}
              >
                {row === "back" ? "B" : "F"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex min-w-0 items-center justify-center gap-1.5 border-t bg-background p-3 text-center sm:flex-col sm:gap-1 sm:border-t-0 sm:border-l sm:px-4">
        <PawPrintIcon aria-hidden="true" />
        <span className="text-xs text-muted-foreground">สัตว์เลี้ยง</span>
        <span className="max-w-full truncate text-sm font-medium">
          {team.pet}
        </span>
      </div>
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
        <Lineup team={team} />
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

function TargetSummary({ team }: { team: Team }) {
  return (
    <section aria-labelledby="target-summary-title" className="grid gap-5">
      <div>
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

      <Lineup team={team} />

      <dl className="border-y py-4 text-sm">
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

function Strategy({ team }: { team: Team }) {
  return (
    <Dialog>
      <DialogTrigger className="block w-full rounded-xl text-left transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:duration-150 motion-safe:hover:-translate-y-1 motion-reduce:transition-none">
        <TeamCard team={team} counter />
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
        lang="th"
      >
        <DialogHeader className="shrink-0 border-b px-6 py-4 pr-12 sm:px-8">
          <Badge variant="secondary">กลยุทธ์ทีมสู้</Badge>
          <DialogTitle>{team.title}</DialogTitle>
          <DialogDescription>
            ตัวอย่างแนวทางการบันทึก · ยังไม่ใช่คำแนะนำที่ทดสอบแล้ว
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid gap-6">
            <section className="grid gap-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <LightningIcon aria-hidden="true" className="text-primary" />
                เงื่อนไขสำคัญ
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {team.condition}
              </p>
            </section>

            <Lineup team={team} />

            <section className="grid gap-3">
              <h3 className="font-semibold">ลำดับสกิล</h3>
              <ol className="grid gap-2 sm:grid-cols-3">
                {team.heroes.map((hero, index) => (
                  <li
                    key={hero.name}
                    className="flex items-center gap-3 rounded-xl bg-muted p-3"
                  >
                    <span className="text-xl font-medium text-primary">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{hero.name}</p>
                      <p className="text-xs text-muted-foreground">
                        สกิล {index === 0 ? "2" : "1"}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="grid gap-3">
              <h3 className="font-semibold">รายละเอียดตัวละคร</h3>
              {team.heroes.map((hero, index) => (
                <div
                  key={hero.name}
                  className="flex items-start gap-4 rounded-xl border p-4"
                >
                  <HeroPortrait hero={hero} />
                  <dl className="grid flex-1 gap-2 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        อุปกรณ์ที่แนะนำ
                      </dt>
                      <dd>
                        {index === 0
                          ? "เซ็ตความเร็ว · แหวนต้านสถานะ"
                          : "เซ็ตป้องกัน · เพิ่มความอยู่รอด"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        หมายเหตุ
                      </dt>
                      <dd>
                        {index === 0
                          ? "ให้ความสำคัญกับการเปิดสกิลก่อน"
                          : "ปรับตามอุปกรณ์ที่มี และทดสอบก่อนใช้งานจริง"}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </section>

            <p className="text-sm text-muted-foreground">
              สัตว์เลี้ยง: {team.pet} · บันทึกโดย Mint
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DesignPreview({
  bannerExpanded: initialBannerExpanded,
  targets,
  target,
  counters,
}: {
  bannerExpanded: boolean;
  targets: Team[];
  target?: Team;
  counters: Team[];
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
    <div className="min-h-svh bg-background text-foreground" lang="th">
      <header className="sticky top-0 z-20 border-b bg-card">
        <div className="container flex h-16 items-center justify-between gap-3">
          <Link
            href="/design"
            className="flex items-center gap-2 text-xl font-semibold tracking-tight"
          >
            <FlowerIcon weight="fill" className="size-7 text-primary/50" />
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
          <div className="pointer-events-none absolute inset-x-0 top-full">
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
          <div className="container py-8 sm:py-8">
            <div className="grid items-start gap-8 lg:grid-cols-3">
              <aside className="grid gap-4 lg:sticky lg:top-24">
                <Link
                  href="/design"
                  className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <ArrowLeftIcon />
                  กลับไปทีมเป้าหมาย
                </Link>
                <TargetSummary team={target} />
              </aside>
              <section className="grid gap-6 lg:col-span-2">
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
                    ดูเงื่อนไขก่อนเลือก แล้วเปิดกลยุทธ์เพื่อจัดทีมตาม
                  </p>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  {counters.map((team) => (
                    <Strategy key={team.id} team={team} />
                  ))}
                </div>

                {!counters.length && (
                  <div className="rounded-xl border border-dashed p-8 text-center">
                    <FlowerIcon className="mx-auto mb-4 size-8 text-primary" />
                    <h2 className="font-semibold">
                      ยังไม่มีทีมแก้สำหรับทีมนี้
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      พื้นที่สำหรับแนวทางใหม่ที่กิลด์ของเราค้นพบ
                    </p>
                  </div>
                )}
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
                          <span className="text-primary">ก็มีทางไปต่อ.</span>
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
                <div className="flex flex-wrap items-end justify-between gap-4">
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
                  <div className="flex flex-wrap items-center gap-3">
                    <Toggle
                      pressed={onlyResolved}
                      onPressedChange={setOnlyResolved}
                      size="sm"
                      variant="outline"
                    >
                      เฉพาะทีมที่มีทีมแก้
                    </Toggle>
                    <p
                      aria-live="polite"
                      className="text-sm text-muted-foreground"
                    >
                      ทั้งหมด {filtered.length} ทีม
                    </p>
                  </div>
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
                    <ToggleGroup
                      multiple
                      value={teamTypes}
                      onValueChange={(values) => {
                        setTeamTypes(values as TargetTeamType[]);
                      }}
                      size="sm"
                      variant="outline"
                      className="flex w-full flex-wrap"
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
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
