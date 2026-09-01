import { cn } from "@workspace/ui/lib/utils";
import {
  type BattleRow,
  type DeployedHero,
  type Lineup,
} from "../_data/guild-feed";
import { HeroCard } from "./hero-card";

const stackedHeroPosition = [
  "col-start-1 row-start-1 z-10 -translate-x-1/2",
  "col-start-1 row-start-1 z-20",
  "col-start-1 row-start-1 z-30 translate-x-1/2",
];

type LineupBoardProps = {
  compact?: boolean;
  label?: string;
  lineup: Lineup;
  showPet?: boolean;
};

function LineupRow({
  heroes,
  row,
}: {
  heroes: DeployedHero[];
  row: BattleRow;
}) {
  const orderedHeroes = [...heroes].sort(
    (left, right) => left.slot - right.slot
  );
  const stacked = orderedHeroes.length === 3;

  return (
    <div className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2">
      <div
        aria-hidden="true"
        className="absolute inset-x-3 top-1/2 z-0 h-0.5 bg-primary/15"
      />
      <span aria-hidden="true" className="size-5" />
      <div
        className={cn(
          "relative z-10 flex items-center justify-center gap-2 pr-5",
          stacked ? "grid" : "flex"
        )}
      >
        {stacked
          ? orderedHeroes.map((hero, index) => (
              <HeroCard
                className={cn("absolute top-0", stackedHeroPosition[index])}
                hero={hero}
                key={hero.id}
              />
            ))
          : orderedHeroes.map((hero) => <HeroCard key={hero.id} hero={hero} />)}
      </div>
      <span className="relative z-0 flex size-5 items-center justify-center justify-self-end rounded-full border border-primary/30 bg-background text-xs font-semibold text-primary">
        {row === "back" ? "B" : "F"}
      </span>
    </div>
  );
}

export function LineupBoard({
  compact = false,
  label = "การจัดทีม",
  lineup,
  showPet = true,
}: LineupBoardProps) {
  const frontHeroes = lineup.heroes.filter((hero) => hero.row === "front");
  const backHeroes = lineup.heroes.filter((hero) => hero.row === "back");

  return (
    <section
      aria-label={label}
      className="grid overflow-hidden rounded-xl border border-primary/20 bg-primary/5"
    >
      <div
        className={
          showPet ? "grid min-w-0 sm:grid-cols-[minmax(0,1fr)_auto]" : "min-w-0"
        }
      >
        <div className="flex min-w-0 flex-col gap-2 py-2">
          <div className="order-2">
            <LineupRow heroes={frontHeroes} row="front" />
          </div>
          <div className="order-1">
            <LineupRow heroes={backHeroes} row="back" />
          </div>
        </div>
        {showPet ? (
          <aside className="flex items-center justify-center gap-1.5 border-t p-2 text-center sm:flex-col sm:border-t-0 sm:border-l">
            <div className="flex size-8 items-center justify-center rounded-lg border bg-background text-xs font-semibold shadow-sm">
              {lineup.pet.slice(0, 1).toUpperCase()}
            </div>
            <div className="grid gap-0.5">
              <span className="text-xs text-muted-foreground">สัตว์เลี้ยง</span>
              <span className="text-xs font-medium whitespace-nowrap">
                {lineup.pet}
              </span>
            </div>
          </aside>
        ) : null}
      </div>
      {compact ? null : (
        <p className="border-t bg-background/60 px-2 py-1.5 text-xs text-muted-foreground">
          ลำดับสกิล: {lineup.skillOrder.join(" → ")}
        </p>
      )}
    </section>
  );
}
