import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getCounters, targets } from "./_data";
import { bannerExpandedCookieName } from "./_preferences";
import { DesignPreview } from "./preview";

export const metadata = { title: "Poysian — คลังทีมแก้" };

export default async function DesignPage({
  searchParams,
}: {
  searchParams: Promise<{ target?: string; counter?: string }>;
}) {
  const [{ target: id, counter: counterId }, cookieStore] = await Promise.all([
    searchParams,
    cookies(),
  ]);
  const target = id ? targets.find((team) => team.id === id) : undefined;
  const counters = target ? getCounters(target) : [];
  const counter = counterId
    ? counters.find((team) => team.id === counterId)
    : undefined;
  const bannerExpanded =
    cookieStore.get(bannerExpandedCookieName)?.value !== "false";

  if ((id && !target) || (counterId && !counter)) notFound();

  return (
    <DesignPreview
      bannerExpanded={bannerExpanded}
      targets={target ? [] : targets}
      target={target}
      counters={counters}
      counter={counter}
    />
  );
}
