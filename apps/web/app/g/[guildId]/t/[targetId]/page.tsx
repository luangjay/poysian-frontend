import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  PencilSimpleLineIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { AppHeader } from "@/components/app-header";
import { CounterTeamBrowser } from "../../_components/counter-team-browser";
import { LineupBoard } from "../../_components/lineup-board";
import { getTargetCounters } from "../../_data/guild-feed";

export default async function TargetCountersPage({
  params,
}: PageProps<"/g/[guildId]/t/[targetId]">) {
  const { guildId, targetId } = await params;
  const data = getTargetCounters(guildId, targetId);

  if (!data) {
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

      <section>
        <div className="container grid gap-1 py-10">
          <Link
            href={`/g/${data.guild.slug}`}
            className="flex w-fit items-center gap-1 text-sm text-muted-foreground"
          >
            <ArrowLeftIcon aria-hidden="true" />
            กลับ
          </Link>

          <Card className="mx-auto w-full max-w-4xl rounded-2xl border-l-4 border-l-destructive shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <PencilSimpleLineIcon aria-hidden="true" />
                ทีมเป้าหมาย
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineupBoard
                compact
                label="การจัดทีมเป้าหมาย"
                lineup={data.target.lineup}
              />
            </CardContent>
          </Card>

          <CounterTeamBrowser
            counters={data.counters}
            guildId={data.guild.slug}
            targetId={data.target.id}
          />
        </div>
      </section>
    </main>
  );
}
