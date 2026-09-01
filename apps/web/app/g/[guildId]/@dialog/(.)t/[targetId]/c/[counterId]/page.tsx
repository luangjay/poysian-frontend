import { notFound } from "next/navigation";
import { CounterStrategyDialog } from "../../../../../_components/counter-strategy-dialog";
import { getTargetCounters } from "../../../../../_data/guild-feed";

export default async function InterceptedCounterStrategyPage({
  params,
}: {
  params: Promise<{ guildId: string; targetId: string; counterId: string }>;
}) {
  const { guildId, targetId, counterId } = await params;
  const data = getTargetCounters(guildId, targetId);
  const counter = data?.counters.find(
    (candidate) => candidate.id === counterId
  );

  if (!counter) {
    notFound();
  }

  return <CounterStrategyDialog counter={counter} />;
}
