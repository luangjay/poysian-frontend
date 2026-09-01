import { type CounterTeam } from "../_data/guild-feed";
import { LineupBoard } from "./lineup-board";

type CounterStrategyDetailsProps = {
  counter: CounterTeam;
};

function StrategyHero({ hero }: { hero: CounterTeam["heroes"][number] }) {
  const initials = hero.name
    .split(" ")
    .map((part) => part.slice(0, 1))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid gap-3 border-b p-4 last:border-b-0 sm:grid-cols-[auto_minmax(0,1fr)]">
      <div className="flex items-center gap-3">
        <div className="flex size-13 shrink-0 items-center justify-center rounded-xl border bg-muted text-sm font-semibold shadow-sm">
          {initials}
        </div>
        <div className="grid gap-1">
          <span className="font-medium">{hero.name}</span>
          <span className="text-xs text-muted-foreground">
            อุปกรณ์: {hero.gear.join(" · ")}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{hero.focus}</p>
    </div>
  );
}

export function CounterStrategyDetails({
  counter,
}: CounterStrategyDetailsProps) {
  return (
    <div className="grid gap-6">
      <section className="grid gap-3">
        <div className="grid gap-1">
          <h3 className="text-sm font-medium">กลยุทธ์ทีม</h3>
          <span className="w-fit rounded-full bg-muted px-3 py-1 text-sm font-semibold">
            ทีมสู้
          </span>
        </div>
        <LineupBoard label="การจัดทีมสู้ที่เลือก" lineup={counter.lineup} />
      </section>

      <section className="grid gap-3">
        <h3 className="text-sm font-medium">รายละเอียดตัวละคร</h3>
        <div className="overflow-hidden rounded-xl border">
          {counter.heroes.map((hero) => (
            <StrategyHero key={hero.heroId} hero={hero} />
          ))}
        </div>
      </section>

      <section className="grid gap-1 rounded-xl border p-4">
        <h3 className="text-sm font-medium">คำแนะนำ</h3>
        <p className="text-sm text-muted-foreground">{counter.note}</p>
      </section>
    </div>
  );
}
