import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { type TeamVariant } from "../_data/guild-feed";

type TeamVariantBoardProps = {
  variant: TeamVariant;
};

export function TeamVariantBoard({ variant }: TeamVariantBoardProps) {
  return (
    <section
      aria-label="ตัวเลือกทีม"
      className="grid h-full grid-rows-[1fr_auto_1fr] overflow-hidden rounded-xl border bg-background text-center"
    >
      <div className="grid content-center gap-1 p-3">
        <span className="text-xs text-muted-foreground">ความเร็ว</span>
        <div className="flex items-center justify-center gap-1.5 text-sm">
          <span
            className={cn(
              "font-medium",
              variant.speed === "fast" && "text-primary"
            )}
          >
            เร็ว
          </span>
          <span className="text-muted-foreground">vs</span>
          <span
            className={cn(
              "font-medium",
              variant.speed === "slow" && "text-primary"
            )}
          >
            ช้า
          </span>
        </div>
      </div>
      <Separator />
      <div className="grid content-center gap-1 p-3">
        <span className="text-xs text-muted-foreground">สัตว์เลี้ยง</span>
        <span className="text-sm font-medium">
          {variant.petChoices.join(" · ")}
        </span>
      </div>
    </section>
  );
}
