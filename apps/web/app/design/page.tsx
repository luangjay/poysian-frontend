import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getCounters, targets } from "./_data";
import { BrowseTargets } from "./browse-targets";
import { CounterPlan } from "./counter-plan";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { TargetCounters } from "./target-counters";

const GUILD_NAME = "PANDOARA";

type DesignSearchParams = Promise<{ target?: string; counter?: string }>;

/**
 * Slack, LINE and the rest unfurl a pasted link from Open Graph tags, not from
 * whatever title the Web Share sheet was given — so the view has to name itself
 * in its metadata for a shared URL to read as the team it points at.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: DesignSearchParams;
}): Promise<Metadata> {
  const { target: id, counter: counterId } = await searchParams;
  const target = id ? targets.find((team) => team.id === id) : undefined;
  const counter =
    target && counterId
      ? getCounters(target).find((team) => team.id === counterId)
      : undefined;
  const subject = counter ?? target;

  const title = subject ? `${subject.title} — Poysian` : "Poysian — คลังทีมแก้";
  const description = subject?.condition ?? "คลังทีมแก้ของกิลด์ PANDOARA";

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function DesignPage({
  searchParams,
}: {
  searchParams: DesignSearchParams;
}) {
  const { target: id, counter: counterId } = await searchParams;
  const target = id ? targets.find((team) => team.id === id) : undefined;
  const counters = target ? getCounters(target) : [];
  const counter = counterId
    ? counters.find((team) => team.id === counterId)
    : undefined;

  if ((id && !target) || (counterId && !counter)) notFound();

  return (
    <div className="min-h-svh bg-muted/40 text-foreground [--design-header-block-size:calc(var(--design-header-content-height)+1.5rem)] [--design-header-content-height:4rem]">
      {/* The header puts up to four controls between the page and its content,
          and the search one only exists on the discovery view — so tabbing to
          a target means tabbing past chrome that changes shape per route. */}
      <a
        href="#content"
        className="fixed top-4 left-4 z-50 -translate-y-20 rounded-full bg-background px-4 py-2 text-sm font-medium ring-3 ring-ring/50 transition-transform focus-visible:translate-y-0 motion-reduce:transition-none"
      >
        ข้ามไปที่เนื้อหา
      </a>
      <SiteHeader
        guildName={GUILD_NAME}
        searchHref={target ? undefined : "#target-search"}
        shareTitle={counter?.title ?? target?.title ?? "Poysian"}
      />

      {/* Three views, named rather than derived: which one you get is the
          whole of what the query string decides, and it is decided here
          instead of inside a component that takes every view's props. */}
      <main id="content" className="container grid gap-8 pt-6 pb-8">
        {counter && target ? (
          <CounterPlan counters={counters} target={target} team={counter} />
        ) : target ? (
          <TargetCounters counters={counters} target={target} />
        ) : (
          <BrowseTargets targets={targets} />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
