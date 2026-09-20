import Image from "next/image";
import { StarIcon } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";
import { type Hero, type SkillOrder } from "./_data";
import {
  gameUiAssetBaseUrl,
  HeroPortrait,
  heroRoleIconByRole,
  itemGradeFrameSrc,
  universalRoleIconSrc,
} from "./lineup";

const defaultHeroGuidance = {
  purpose: "เติมบทบาทตามจังหวะและเงื่อนไขของทีม",
  equipment: "เซ็ตสมดุล · เพิ่มความอยู่รอด",
  note: "ปรับอุปกรณ์ตามตัวที่ต้องรับมือเป็นหลัก",
};

const heroGuidance: Record<string, typeof defaultHeroGuidance> = {
  โจมตี: {
    purpose: "เก็บความเสียหายไว้ปิดเป้าหมายตามจังหวะของทีม",
    equipment: "เซ็ตโจมตี · เพิ่มความเร็วตามที่ทีมกำหนด",
    note: "รอให้ตัวเปิดสร้างช่องก่อนใช้สกิลหลัก",
  },
  ป้องกัน: {
    purpose: "รับชุดสกิลแรก เพื่อให้ทีมมีจังหวะสวนกลับ",
    equipment: "เซ็ตป้องกัน · เพิ่มความอยู่รอด",
    note: "ยืนตำแหน่งเดิมและให้ความสำคัญกับการต้านสถานะ",
  },
  สนับสนุน: {
    purpose: "ค้ำจังหวะทีมด้วยบัฟ ฮีล หรือการควบคุม",
    equipment: "เซ็ตความเร็ว · แหวนต้านสถานะ",
    note: "ปรับความเร็วให้ต่อจากตัวเปิดของทีม",
  },
  เวท: {
    purpose: "กดดันแถวหลังและควบคุมจังหวะของเป้าหมาย",
    equipment: "เซ็ตเวท · เพิ่มความเร็วตามที่ทีมกำหนด",
    note: "ระวังตัวต้านสถานะและจังหวะสวนกลับ",
  },
  สมดุล: defaultHeroGuidance,
};

const gameReferenceStats = [
  [
    ["พลังโจมตีเวท", "4,853"],
    ["พลังป้องกัน", "1,428"],
    ["HP", "7,451"],
    ["ความเร็วโจมตี", "33"],
    ["อัตราคริติคอล", "51%"],
    ["ความเสียหายคริติคอล", "282%"],
    ["อัตราโจมตีจุดอ่อน", "50%"],
    ["อัตราบล็อก", "0%"],
  ],
  [
    ["ผลเข้าเป้า", "75%"],
    ["ต้านทานผล", "0%"],
    ["ลดความเสียหายที่ได้รับ", "0%"],
    ["เสริมความเสียหาย", "0%"],
    ["บดขยี้", "48%"],
    ["ยืดหยุ่น", "0%"],
    ["ฟื้นคืน", "0%"],
  ],
] as const;

const equipmentSlotGroups = [
  {
    label: "แหวน",
    slots: [
      { item: "Tex_ItemIcon_10451029.png", set: "SetIcon_0.png" },
      { item: "Tex_ItemIcon_10441010.png", set: "SetIcon_3.png" },
      { item: "Tex_ItemIcon_10441004.png", set: "SetIcon_7.png" },
    ],
  },
  {
    label: "เซ็ตไอเทม",
    slots: [
      { item: "Tex_ItemIcon_10265100.png", set: "SetIcon_7.png" },
      { item: "Tex_ItemIcon_10365100.png", set: "SetIcon_3.png" },
      { item: "Tex_ItemIcon_201000023.png", set: "SetIcon_0.png" },
    ],
  },
] as const;

const awakenedHeroNames = new Set(["ยุนกอน", "โดยอง", "ฮายอน"]);

function HeroDetailTile({
  hero,
  className,
  loading,
  shared,
}: {
  hero: Hero;
  className?: string;
  loading?: "eager" | "lazy";
  shared?: boolean;
}) {
  const guidance = heroGuidance[hero.role] ?? defaultHeroGuidance;
  const roleIconSrc = heroRoleIconByRole[hero.role] ?? universalRoleIconSrc;
  const isAwakened = awakenedHeroNames.has(hero.name);

  return (
    <Dialog>
      <DialogTrigger
        aria-label={`ดูรายละเอียด ${hero.name}`}
        className={cn(
          "rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
      >
        <HeroPortrait hero={hero} loading={loading} shared={shared} />
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] gap-5 overflow-y-auto p-5 sm:max-w-3xl">
        <DialogHeader className="gap-4 pr-8">
          <div className="flex items-center gap-4">
            <HeroPortrait
              className="w-24 [&>span:last-child]:hidden"
              hero={hero}
            />
            <div className="grid min-w-0 gap-2">
              <DialogTitle className="text-2xl leading-tight font-semibold tracking-tight">
                {hero.name}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Image
                  alt={`ประเภท ${hero.role}`}
                  className="size-6 select-none"
                  height={40}
                  src={roleIconSrc}
                  width={40}
                />
                <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background">
                  LV.30 +5
                </span>
                <span
                  aria-label={isAwakened ? "ปลุกพลังแล้ว" : "ยังไม่ปลุกพลัง"}
                  className={cn(
                    "flex -space-x-1",
                    isAwakened ? "text-universal" : "text-support"
                  )}
                >
                  {Array.from({ length: 6 }, (_, index) => (
                    <StarIcon key={index} aria-hidden="true" weight="fill" />
                  ))}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="grid items-start gap-4 lg:grid-cols-2">
          {gameReferenceStats.map((column, columnIndex) => (
            <dl
              key={columnIndex}
              className="overflow-hidden rounded-xl border bg-muted/40"
            >
              {column.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b px-3 py-2 text-sm last:border-b-0"
                >
                  <dt className="whitespace-nowrap text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="shrink-0 font-medium tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          ))}
        </div>
        <section className="grid overflow-hidden rounded-xl border sm:h-40 sm:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)]">
          <div className="grid content-center gap-3 bg-muted/30 p-4 sm:border-r">
            {equipmentSlotGroups.map((group) => (
              <div
                key={group.label}
                className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-3"
              >
                <span className="text-sm font-medium whitespace-nowrap">
                  {group.label}
                </span>
                <div className="flex gap-2">
                  {group.slots.map((slot) => (
                    <span
                      key={slot.item}
                      aria-label={`${group.label} ที่เลือกไว้`}
                      className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted shadow-sm"
                    >
                      <Image
                        fill
                        alt=""
                        className="object-fill select-none"
                        sizes="48px"
                        src={itemGradeFrameSrc}
                      />
                      <Image
                        fill
                        alt=""
                        className="z-10 object-contain p-1 select-none"
                        sizes="48px"
                        src={`${gameUiAssetBaseUrl}/${slot.item}`}
                      />
                      <Image
                        alt=""
                        className="absolute right-0.5 bottom-0.5 z-20 size-4 drop-shadow-sm select-none"
                        height={64}
                        src={`${gameUiAssetBaseUrl}/${slot.set}`}
                        width={64}
                      />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="min-h-0 overflow-y-auto p-4 text-sm leading-relaxed">
            <p>{guidance.purpose}</p>
            <p className="mt-3">
              <span className="font-medium">แนวทาง: </span>
              {guidance.note}
            </p>
            <p className="mt-3">
              <span className="font-medium">แนะนำ: </span>
              {guidance.equipment}
            </p>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}

export function CounterHeroTile({
  hero,
  className,
  skills = [],
  loading,
  shared,
}: {
  hero: Hero;
  className?: string;
  skills?: SkillOrder[];
  loading?: "eager" | "lazy";
  shared?: boolean;
}) {
  const skillBySlot = new Map(skills.map((skill) => [skill.slot, skill]));

  return (
    <div className={cn("relative w-18 shrink-0", className)}>
      <HeroDetailTile hero={hero} loading={loading} shared={shared} />
      {skills.length ? (
        <ol
          aria-label={`ลำดับสกิล ${hero.name}`}
          className="absolute top-0 bottom-0 left-full z-10 ml-1"
        >
          {(["B", "T", "A"] as const).map((slot) => {
            const skill = skillBySlot.get(slot);

            return (
              <li
                key={slot}
                className={cn(
                  "absolute left-0 -translate-y-1/2",
                  slot === "B" &&
                    "top-[calc(50%-var(--lineup-hero-label-offset)+1.5rem)]",
                  slot === "T" &&
                    "top-[calc(50%-var(--lineup-hero-label-offset))]",
                  slot === "A" &&
                    "top-[calc(50%-var(--lineup-hero-label-offset)-1.5rem)]"
                )}
              >
                <span
                  className={cn(
                    "relative grid size-5 place-items-center rounded-full text-xs font-semibold shadow-sm",
                    slot === "A" &&
                      "after:pointer-events-none after:absolute after:inset-0.5 after:rounded-full after:border",
                    slot === "A" &&
                      skill &&
                      "border border-primary-foreground/70 after:border-primary-foreground/70",
                    slot === "A" && !skill && "after:border-border",
                    skill
                      ? "bg-primary text-primary-foreground"
                      : "border bg-card text-muted-foreground"
                  )}
                >
                  {skill?.order ?? slot}
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
