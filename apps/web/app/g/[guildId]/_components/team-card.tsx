import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { type TargetSummary } from "../_data/guild-feed";
import { LineupBoard } from "./lineup-board";
import { TeamVariantBoard } from "./team-variant-board";

type TeamCardProps = {
  href: string;
  team: TargetSummary;
};

export function TeamCard({ href, team }: TeamCardProps) {
  return (
    <Link href={href} className="block">
      <Card
        size="sm"
        className="h-full rounded-2xl shadow-sm transition-transform motion-safe:duration-150 motion-safe:hover:-translate-y-1"
      >
        <CardHeader className="items-center justify-between gap-2">
          <CardTitle>ทีมเป้าหมาย</CardTitle>
          <CardDescription>{team.counterCount} ทีมแก้</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
            <LineupBoard
              compact
              label="การจัดทีมเป้าหมาย"
              lineup={team.lineup}
              showPet={false}
            />
            <TeamVariantBoard variant={team.variant} />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          ดูเพิ่ม&nbsp;
          <CaretRightIcon aria-hidden="true" />
        </CardFooter>
      </Card>
    </Link>
  );
}
