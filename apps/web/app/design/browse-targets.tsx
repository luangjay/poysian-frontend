"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { type Team } from "./_data";
import { SectionHeading, TeamCount } from "./section-heading";
import {
  filterTargets,
  noTargetFilters,
  TargetFilterPanel,
  type TargetFilters,
} from "./target-filters";
import { TeamCard } from "./team-card";
import { TeamsEmpty } from "./teams-empty";

/**
 * The discovery view: every target the guild tracks, narrowed by the panel
 * above it. The only stateful view on the route — the two detail views render
 * from the URL alone.
 */
export function BrowseTargets({ targets }: { targets: Team[] }) {
  const [filters, setFilters] = useState<TargetFilters>(noTargetFilters);
  const matches = filterTargets(targets, filters);

  return (
    <section
      aria-labelledby="targets-heading"
      className="flex scroll-mt-(--design-header-block-size) flex-col gap-6"
    >
      <SectionHeading
        level={1}
        id="targets-heading"
        title="ทีมเป้าหมาย"
        description="เลือกเป้าหมายเพื่อดูทีมแก้ที่กิลด์บันทึกไว้"
        aside={<TeamCount live value={matches.length} />}
      />

      <TargetFilterPanel filters={filters} onChange={setFilters} />

      {matches.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((team, index) => (
            <Link
              key={team.id}
              href={`/design?target=${team.id}`}
              className="group block rounded-xl outline-none"
            >
              <TeamCard eagerImages={index === 0} team={team} />
            </Link>
          ))}
        </div>
      ) : (
        <TeamsEmpty
          title="ไม่พบทีมเป้าหมาย"
          description="ลองลดตัวกรองหรือค้นหาด้วยชื่ออื่น"
        >
          <Button variant="outline" onClick={() => setFilters(noTargetFilters)}>
            ล้างตัวกรอง
          </Button>
        </TeamsEmpty>
      )}
    </section>
  );
}
