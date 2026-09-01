import Link from "next/link";
import { PushPinSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { type CounterTeam } from "../_data/guild-feed";
import { LineupBoard } from "./lineup-board";

type CounterTeamBrowserProps = {
  counters: CounterTeam[];
  guildId: string;
  targetId: string;
};

export function CounterTeamBrowser({
  counters,
  guildId,
  targetId,
}: CounterTeamBrowserProps) {
  return (
    <section aria-labelledby="counter-list-heading" className="grid gap-6">
      <div className="flex items-center gap-2">
        <PushPinSimpleIcon aria-hidden="true" className="text-primary" />
        <h2 id="counter-list-heading" className="text-xl font-semibold">
          ทีมที่ใช้ต่อสู้ได้
        </h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {counters.map((counter) => (
          <Link
            key={counter.id}
            href={`/g/${guildId}/t/${targetId}/c/${counter.id}`}
            className="block"
          >
            <Card className="h-full cursor-pointer rounded-2xl shadow-sm transition-transform motion-safe:duration-150 motion-safe:hover:-translate-y-1">
              <CardHeader className="flex-row items-center justify-between gap-3">
                <CardDescription className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-foreground">
                  ทีมสู้
                </CardDescription>
                <CardTitle className="text-sm text-muted-foreground">
                  แผนการเล่น
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LineupBoard
                  compact
                  label="การจัดทีมสู้"
                  lineup={counter.lineup}
                />
              </CardContent>
              <CardFooter className="justify-between text-sm text-muted-foreground">
                <span>{counter.note}</span>
                <span className="shrink-0">ดูเพิ่ม →</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
