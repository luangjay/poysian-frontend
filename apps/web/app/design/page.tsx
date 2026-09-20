import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getCounters, targets } from "./_data";
import { DesignPreview } from "./preview";

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
    <DesignPreview
      targets={target ? [] : targets}
      target={target}
      counters={counters}
      counter={counter}
    />
  );
}
