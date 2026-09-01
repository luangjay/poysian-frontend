import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { AppHeader } from "@/components/app-header";
import { CounterStrategyDetails } from "../../../../_components/counter-strategy-details";
import { getTargetCounters } from "../../../../_data/guild-feed";

export default async function CounterStrategyPage({
  params,
}: PageProps<"/g/[guildId]/t/[targetId]/c/[counterId]">) {
  const { guildId, targetId, counterId } = await params;
  const data = getTargetCounters(guildId, targetId);
  const counter = data?.counters.find(
    (candidate) => candidate.id === counterId
  );

  if (!data || !counter) {
    notFound();
  }

  return (
    <main className="min-h-svh">
      <AppHeader>
        <AppHeader.GuildName>{data.guild.name}</AppHeader.GuildName>
        <AppHeader.Actions>
          <AppHeader.ThemeButton />
          <AppHeader.EditButton />
        </AppHeader.Actions>
      </AppHeader>

      <section className="container grid gap-6 py-10">
        <Link
          href={`/g/${data.guild.slug}/t/${data.target.id}`}
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground"
        >
          <ArrowLeftIcon aria-hidden="true" />
          กลับ
        </Link>
        <div className="grid gap-2">
          <h1 className="text-2xl font-semibold">รายละเอียดทีมสู้</h1>
          <p className="text-muted-foreground">{counter.label}</p>
        </div>
        <CounterStrategyDetails counter={counter} />
      </section>
    </main>
  );
}
