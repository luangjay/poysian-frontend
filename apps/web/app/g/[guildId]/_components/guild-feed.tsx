"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { type TargetSummary } from "../_data/guild-feed";
import { TeamCard } from "./team-card";

type TargetBrowserProps = {
  guildId: string;
  targets: TargetSummary[];
};

export function TargetBrowser({ guildId, targets }: TargetBrowserProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visibleTargets = useMemo(
    () =>
      targets.filter((target) => {
        const searchableText = [
          target.label,
          target.lineup.pet,
          ...target.lineup.heroes.map((hero) => hero.name),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(deferredQuery);
      }),
    [deferredQuery, targets]
  );

  return (
    <section aria-labelledby="target-list-heading">
      <div className="container grid gap-8 py-12">
        <label className="relative block">
          <span className="sr-only">ค้นหาทีมเป้าหมาย</span>
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาทีมศัตรู เช่น รูดี้ ยอนฮี เอริน"
            className="h-auto rounded-full border-transparent bg-muted px-5 py-4 pl-12 text-base shadow-none"
          />
        </label>

        <div className="flex">
          <p className="text-sm text-muted-foreground">
            ทั้งหมด {visibleTargets.length} ทีม
          </p>
        </div>

        <h1 id="target-list-heading" className="sr-only">
          ทีมเป้าหมาย
        </h1>

        {visibleTargets.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTargets.map((target) => (
              <TeamCard
                key={target.id}
                href={`/g/${guildId}/t/${target.id}`}
                team={target}
              />
            ))}
          </div>
        ) : (
          <Card className="rounded-2xl">
            <CardContent className="grid justify-items-center gap-3 py-12 text-center">
              <p>ไม่พบทีมเป้าหมายที่ตรงกับตัวกรอง</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setQuery("");
                }}
              >
                รีเซ็ตตัวกรอง
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
