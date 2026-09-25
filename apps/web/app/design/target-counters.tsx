import { ItemGroup } from "@workspace/ui/components/item";
import { type Team } from "./_data";
import { BackLink } from "./back-link";
import { SectionHeading, TeamCount } from "./section-heading";
import { TargetSummary } from "./target-variant-dock";
import { CounterTeamRow } from "./team-card";
import { TeamsEmpty } from "./teams-empty";

/**
 * One target and the counters the guild has saved for it. The lineup leads,
 * because the shape of the thing you are up against is what you check first;
 * the counters read as a ranked list under it.
 */
export function TargetCounters({
  counters,
  target,
}: {
  counters: Team[];
  target: Team;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <BackLink href="/design" label="กลับ" />
        <TargetSummary key={target.id} team={target} />
      </div>
      <section
        aria-labelledby="saved-counters-heading"
        className="flex flex-col gap-4"
      >
        <SectionHeading
          id="saved-counters-heading"
          title="ทีมแก้ที่บันทึกไว้"
          description="เลือกทีมแก้เพื่อดูลำดับสกิลและแผนการรบ"
          aside={<TeamCount value={counters.length} />}
        />
        {counters.length ? (
          <ItemGroup>
            {counters.map((team, index) => (
              <CounterTeamRow
                key={team.id}
                rank={index + 1}
                target={target}
                team={team}
              />
            ))}
          </ItemGroup>
        ) : (
          <TeamsEmpty
            title="ยังไม่มีทีมแก้"
            description="กิลด์ยังไม่ได้บันทึกทีมแก้สำหรับเป้าหมายนี้"
          />
        )}
      </section>
    </div>
  );
}
