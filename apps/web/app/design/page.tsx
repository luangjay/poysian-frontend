import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getCounters, targets } from "./_data";
import { bannerExpandedCookieName } from "./_preferences";
import { DesignPreview } from "./preview";

export const metadata = { title: "Poysian — คลังทีมแก้" };

export default async function DesignPage({
  searchParams,
}: {
  searchParams: Promise<{ target?: string }>;
}) {
  const [{ target: id }, cookieStore] = await Promise.all([
    searchParams,
    cookies(),
  ]);
  const target = id ? targets.find((team) => team.id === id) : undefined;
  const bannerExpanded =
    cookieStore.get(bannerExpandedCookieName)?.value !== "false";

  if (id && !target) notFound();

  return (
    <DesignPreview
      bannerExpanded={bannerExpanded}
      targets={target ? [] : targets}
      target={target}
      counters={target ? getCounters(target) : []}
    />
  );
}
