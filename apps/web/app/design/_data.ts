export type Hero = {
  name: string;
  role: string;
  rarity: "gray" | "blue" | "green" | "purple" | "gold";
  row: "front" | "back";
  image?: string;
};
export const targetTeamTypes = [
  { value: "defensive", label: "ถึก" },
  { value: "offensive", label: "กายภาพ" },
  { value: "magic", label: "เวท" },
  { value: "other", label: "อื่น ๆ" },
] as const;

export type TargetTeamType = (typeof targetTeamTypes)[number]["value"];

export const targetFormations = [
  { value: "1-4", label: "1–4" },
  { value: "3-2", label: "3–2" },
  { value: "2-3", label: "2–3" },
  { value: "4-1", label: "4–1" },
] as const;

export type TargetFormation = (typeof targetFormations)[number]["value"];

/** The order the game's own picker uses. Shared so a read-only view of the
 *  scale and the picker itself cannot disagree about what the scale is. */
export const targetSpeeds = ["ปกติ", "ช้า", "เร็ว"] as const;

export type TargetSpeed = (typeof targetSpeeds)[number];

export type PetPackage =
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]
  | [string, string, string, string, string];

export type SkillOrder = {
  hero: string;
  slot: "T" | "B" | "A";
  order: number;
};

export type SkillOrderSet =
  | []
  | [SkillOrder]
  | [SkillOrder, SkillOrder]
  | [SkillOrder, SkillOrder, SkillOrder];

export type TargetVariants = {
  speeds: TargetSpeed[];
  formations: TargetFormation[];
  petPackages: PetPackage[];
};

export type Team = {
  id: string;
  title: string;
  type: string;
  targetType?: TargetTeamType;
  tags?: string[];
  heroes: Hero[];
  pet: string;
  speedOrder?: string[];
  skillOrder?: SkillOrderSet;
  variants?: TargetVariants;
  condition: string;
  counters: number;
};

/**
 * Role and portrait are facts about a hero, not about a team, so they live
 * here once — every team then only says who is in it and where they stand.
 * Passing the role per appearance meant ฮายอน carried it ten times, and a
 * role change had to be made in all ten.
 */
const heroCatalog = {
  คริส: { role: "สมดุล", image: "kris" },
  ซอรัน: { role: "เวท", image: "sunran" },
  พาลานอส: { role: "สมดุล", image: "pallanus" },
  ยอนฮี: { role: "เวท", image: "yeonhee" },
  ยุนกอน: { role: "เวท", image: "yoongun-awakened" },
  สกัลด์: { role: "เวท", image: "skuld" },
  สไปค์: { role: "สมดุล", image: "spike" },
  ฮายอน: { role: "สนับสนุน", image: "hayeon" },
  เคลลิดิส: { role: "สมดุล", image: "gelidus" },
  โดยอง: { role: "เวท", image: "dongyoung" },
  โอม๊ก: { role: "เวท", image: "omok" },
  ไอลีน: { role: "สมดุล", image: "eileene" },
} as const satisfies Record<string, { role: string; image: string }>;

/** Keying on this turns a mistyped name into a type error rather than a
 *  portrait that silently falls back to a letter. */
type HeroName = keyof typeof heroCatalog;

const hero = (name: HeroName, row: Hero["row"]): Hero => ({
  name,
  ...heroCatalog[name],
  rarity: "gold",
  row,
});

const counterVariants = (
  speed: TargetVariants["speeds"][number],
  formation: TargetFormation,
  pets: PetPackage
): TargetVariants => ({
  speeds: [speed],
  formations: [formation],
  petPackages: [pets],
});

const counterSkillOrder = (...skills: SkillOrderSet): SkillOrderSet => skills;

export const targets: Team[] = [
  {
    id: "slow-yun-gon-formula",
    title: "เวทช้ายุนกอนตามสูตร",
    type: "เวท",
    targetType: "magic",
    tags: ["วัดเลือด", "คุมสถานะ"],
    heroes: [
      hero("ยอนฮี", "back"),
      hero("ยุนกอน", "back"),
      hero("ฮายอน", "front"),
    ],
    pet: "Pooki",
    variants: {
      speeds: ["ปกติ", "เร็ว", "ช้า"],
      formations: ["1-4", "2-3", "3-2"],
      petPackages: [
        ["Pooki", "Irin"],
        ["Pooki", "Croa", "Irin", "Windy", "Lulu"],
        ["Croa"],
      ],
    },
    condition: "ยืนช้า คุมจังหวะ และยื้อให้ยุนกอนออกสกิลตามสูตร",
    counters: 4,
  },
  {
    id: "omik-magic",
    title: "เวทโอม๊ก",
    type: "เวท",
    targetType: "magic",
    tags: ["คุมสถานะ", "วัดเลือด"],
    heroes: [
      hero("ยุนกอน", "back"),
      hero("โอม๊ก", "front"),
      hero("ฮายอน", "front"),
    ],
    pet: "Pooki",
    variants: {
      speeds: ["ช้า", "ปกติ"],
      formations: ["1-4", "2-3"],
      petPackages: [["Pooki", "Irin"], ["Irin"]],
    },
    condition: "โอม๊กคุมสนาม ขณะที่ฮายอนยืนรับความเสียหาย",
    counters: 1,
  },
  {
    id: "yun-gon-dyong",
    title: "ยุนกอนโดยองปิดเกม",
    type: "โจมตี",
    targetType: "offensive",
    tags: ["ปิดงาน", "เน้นความเร็ว"],
    heroes: [
      hero("ยุนกอน", "back"),
      hero("โดยอง", "back"),
      hero("ฮายอน", "front"),
    ],
    pet: "Pooki",
    variants: {
      speeds: ["เร็ว", "ปกติ"],
      formations: ["1-4", "2-3"],
      petPackages: [
        ["Pooki", "Irin"],
        ["Croa", "Pooki"],
      ],
    },
    condition: "เร่งโดยองให้ปิดเกมหลังยุนกอนเปิดจังหวะ",
    counters: 2,
  },
  {
    id: "hayon-magic",
    title: "เวทฮายอน",
    type: "เวท",
    targetType: "magic",
    tags: ["คุมสถานะ", "เน้นความเร็ว"],
    heroes: [
      hero("ยอนฮี", "back"),
      hero("ยุนกอน", "back"),
      hero("โดยอง", "back"),
    ],
    pet: "Irin",
    variants: {
      speeds: ["เร็ว", "ปกติ", "ช้า"],
      formations: ["3-2", "2-3", "1-4"],
      petPackages: [
        ["Irin", "Pooki"],
        ["Pooki", "Croa", "Irin"],
      ],
    },
    condition: "เวทสามตัวแถวหลัง กดดันต่อเนื่องตั้งแต่เทิร์นแรก",
    counters: 11,
  },
  {
    id: "fast-skald",
    title: "เวทไวสกัลด์",
    type: "ป้องกัน",
    targetType: "defensive",
    tags: ["สวนกลับ", "วัดเลือด"],
    heroes: [
      hero("ยุนกอน", "back"),
      hero("สกัลด์", "front"),
      hero("โดยอง", "front"),
    ],
    pet: "Irin",
    variants: {
      speeds: ["เร็ว", "ปกติ"],
      formations: ["2-3", "1-4"],
      petPackages: [["Irin", "Pooki", "Windy"], ["Pooki"]],
    },
    condition: "สกัลด์ยืนรับก่อน แล้วโดยองสวนกลับด้วยความเร็วสูง",
    counters: 6,
  },
  {
    id: "omik-dyong-control",
    title: "โอม๊กโดยองคุมเกม",
    type: "อื่น ๆ",
    targetType: "other",
    tags: ["คุมสถานะ", "ปิดงาน"],
    heroes: [
      hero("ยุนกอน", "back"),
      hero("โดยอง", "front"),
      hero("โอม๊ก", "front"),
    ],
    pet: "Croa",
    variants: {
      speeds: ["ปกติ", "เร็ว"],
      formations: ["2-3", "1-4", "4-1"],
      petPackages: [
        ["Croa", "Irin", "Pooki"],
        ["Irin", "Croa"],
      ],
    },
    condition: "โอม๊กล็อกจังหวะให้โดยองปิดเป้าหมายที่อ่อนแอ",
    counters: 3,
  },
  {
    id: "kris-pallanus-rush",
    title: "คริสพาลานอสบุกเร็ว",
    type: "กายภาพ",
    targetType: "offensive",
    tags: ["เน้นความเร็ว", "ปิดงาน"],
    heroes: [
      hero("คริส", "back"),
      hero("พาลานอส", "front"),
      hero("สกัลด์", "front"),
    ],
    pet: "Windy",
    variants: {
      speeds: ["เร็ว"],
      formations: ["2-3", "1-4"],
      petPackages: [["Windy", "Lulu"], ["Windy"]],
    },
    condition: "บุกเร็วตั้งแต่เทิร์นแรก ยังไม่มีใครในกิลด์บันทึกทีมแก้ไว้",
    counters: 0,
  },
];

// Design fixtures: illustrative setups, not verified game recommendations.
const counterFixtures: Team[] = [
  {
    id: "omik-opener",
    title: "เวทโอม๊กเปิดก่อน",
    type: "ทีมแก้",
    heroes: [
      hero("ยุนกอน", "back"),
      hero("โอม๊ก", "front"),
      hero("โดยอง", "front"),
    ],
    pet: "Irin",
    speedOrder: ["โอม๊ก", "ยุนกอน", "โดยอง"],
    skillOrder: counterSkillOrder(
      { hero: "โอม๊ก", slot: "B", order: 1 },
      { hero: "ยุนกอน", slot: "T", order: 2 },
      { hero: "ยุนกอน", slot: "B", order: 3 }
    ),
    variants: counterVariants("เร็ว", "1-4", ["Irin", "Pooki"]),
    condition: "ให้โอม๊กเปิดก่อน แล้วโดยองตามเก็บเป้าหมายที่ถูกคุม",
    counters: 0,
  },
  {
    id: "uju-chris-slow",
    title: "เวทช้าฮายอนคริส",
    type: "ทีมแก้",
    heroes: [
      hero("ซอรัน", "back"),
      hero("ฮายอน", "front"),
      hero("คริส", "front"),
    ],
    pet: "Lulu",
    speedOrder: ["ฮายอน", "ซอรัน", "คริส"],
    skillOrder: counterSkillOrder(
      { hero: "ฮายอน", slot: "B", order: 1 },
      { hero: "ซอรัน", slot: "T", order: 2 },
      { hero: "คริส", slot: "A", order: 3 }
    ),
    variants: counterVariants("ช้า", "1-4", ["Lulu"]),
    condition: "ฮายอนต้องผ่านชุดแรกก่อน แล้วคริสค่อยสวนกลับ",
    counters: 0,
  },
  {
    id: "uju-palanos",
    title: "เวทฮายอนพาลานอส",
    type: "ทีมแก้",
    heroes: [
      hero("ฮายอน", "back"),
      hero("พาลานอส", "back"),
      hero("ไอลีน", "front"),
    ],
    pet: "Pooki",
    speedOrder: ["พาลานอส", "ไอลีน", "ฮายอน"],
    skillOrder: counterSkillOrder(
      { hero: "พาลานอส", slot: "B", order: 1 },
      { hero: "ไอลีน", slot: "T", order: 2 },
      { hero: "ฮายอน", slot: "A", order: 3 }
    ),
    variants: counterVariants("ปกติ", "4-1", ["Pooki", "Irin"]),
    condition: "ฮายอนยืนค้ำให้พาลานอสมีจังหวะกดดันต่อเนื่อง",
    counters: 0,
  },
  {
    id: "spike-kledis",
    title: "เวทสไปค์เคลลิดิส",
    type: "ทีมแก้",
    heroes: [
      hero("สไปค์", "back"),
      hero("เคลลิดิส", "front"),
      hero("ฮายอน", "front"),
    ],
    pet: "Croa",
    speedOrder: ["สไปค์", "เคลลิดิส", "ฮายอน"],
    skillOrder: counterSkillOrder(
      { hero: "สไปค์", slot: "T", order: 1 },
      { hero: "เคลลิดิส", slot: "B", order: 2 },
      { hero: "ฮายอน", slot: "A", order: 3 }
    ),
    variants: counterVariants("ปกติ", "2-3", ["Croa"]),
    condition: "ให้สไปค์คุมก่อน เคลลิดิสจึงตามปิดจังหวะ",
    counters: 0,
  },
  {
    id: "slow-yun-gon-control",
    title: "เวทช้ายุนกอนคุมเกม",
    type: "ทีมแก้",
    heroes: [
      hero("ยุนกอน", "back"),
      hero("ฮายอน", "front"),
      hero("โอม๊ก", "front"),
    ],
    pet: "Irin",
    speedOrder: ["ฮายอน", "ยุนกอน", "โอม๊ก"],
    skillOrder: counterSkillOrder(
      { hero: "ฮายอน", slot: "B", order: 1 },
      { hero: "ยุนกอน", slot: "T", order: 2 },
      { hero: "โอม๊ก", slot: "A", order: 3 }
    ),
    variants: counterVariants("ช้า", "2-3", ["Irin", "Windy"]),
    condition: "ชนะด้วยการคุมยาว ไม่จำเป็นต้องรีบเปิดเทิร์นแรก",
    counters: 0,
  },
  {
    id: "fast-skald-finish",
    title: "เวทไวสกัลด์ปิดเกม",
    type: "ทีมแก้",
    heroes: [
      hero("สกัลด์", "back"),
      hero("โดยอง", "front"),
      hero("โอม๊ก", "front"),
    ],
    pet: "Pooki",
    speedOrder: ["โอม๊ก", "โดยอง", "สกัลด์"],
    skillOrder: counterSkillOrder(
      { hero: "โอม๊ก", slot: "T", order: 1 },
      { hero: "โดยอง", slot: "B", order: 2 },
      { hero: "โดยอง", slot: "A", order: 3 }
    ),
    variants: counterVariants("เร็ว", "2-3", ["Pooki", "Croa", "Irin"]),
    condition: "เร่งโอม๊กและโดยองให้ปิดก่อนทีมเป้าหมายตั้งตัว",
    counters: 0,
  },
  {
    id: "omik-counterplay",
    title: "เวทโอม๊กกันสวน",
    type: "ทีมแก้",
    heroes: [
      hero("โอม๊ก", "back"),
      hero("ฮายอน", "front"),
      hero("ยุนกอน", "front"),
    ],
    pet: "Croa",
    speedOrder: ["ยุนกอน", "โอม๊ก", "ฮายอน"],
    skillOrder: counterSkillOrder(
      { hero: "ยุนกอน", slot: "B", order: 1 },
      { hero: "โอม๊ก", slot: "T", order: 2 },
      { hero: "ฮายอน", slot: "A", order: 3 }
    ),
    variants: counterVariants("ปกติ", "1-4", ["Croa", "Pooki"]),
    condition: "เก็บสกิลหลักไว้หลังทีมรับผ่านจังหวะแรก",
    counters: 0,
  },
  {
    id: "hayon-backline",
    title: "เวทยอนฮีทะลุหลัง",
    type: "ทีมแก้",
    heroes: [
      hero("ยอนฮี", "back"),
      hero("โดยอง", "back"),
      hero("ฮายอน", "front"),
    ],
    pet: "Lulu",
    speedOrder: ["ยอนฮี", "โดยอง", "ฮายอน"],
    skillOrder: counterSkillOrder(
      { hero: "ยอนฮี", slot: "T", order: 1 },
      { hero: "โดยอง", slot: "B", order: 2 },
      { hero: "ฮายอน", slot: "A", order: 3 }
    ),
    variants: counterVariants("เร็ว", "3-2", ["Lulu", "Irin"]),
    condition: "เจาะตัวคุมแถวหลัง ก่อนปล่อยโดยองปิดงาน",
    counters: 0,
  },
  {
    id: "uju-frontline",
    title: "เวทฮายอนรับหน้า",
    type: "ทีมแก้",
    heroes: [
      hero("ยุนกอน", "back"),
      hero("ฮายอน", "front"),
      hero("สกัลด์", "front"),
    ],
    pet: "Irin",
    speedOrder: ["ฮายอน", "สกัลด์", "ยุนกอน"],
    skillOrder: counterSkillOrder(
      { hero: "ฮายอน", slot: "B", order: 1 },
      { hero: "สกัลด์", slot: "T", order: 2 },
      { hero: "ยุนกอน", slot: "A", order: 3 }
    ),
    variants: counterVariants("ช้า", "1-4", ["Irin", "Pooki", "Windy"]),
    condition: "ฮายอนกับสกัลด์รับดาเมจก่อน แล้วค่อยยุนกอนพลิกจังหวะ",
    counters: 0,
  },
  {
    id: "slow-long-game",
    title: "เวทช้ายืนยาว",
    type: "ทีมแก้",
    heroes: [
      hero("ยุนกอน", "back"),
      hero("โอม๊ก", "front"),
      hero("สกัลด์", "front"),
    ],
    pet: "Windy",
    speedOrder: ["สกัลด์", "ยุนกอน", "โอม๊ก"],
    skillOrder: counterSkillOrder(
      { hero: "สกัลด์", slot: "B", order: 1 },
      { hero: "ยุนกอน", slot: "T", order: 2 },
      { hero: "โอม๊ก", slot: "A", order: 3 }
    ),
    variants: counterVariants("ช้า", "2-3", ["Windy", "Irin"]),
    condition: "เน้นยืนรอดและบีบให้คู่ต่อสู้หมดจังหวะก่อน",
    counters: 0,
  },
  {
    id: "three-backline",
    title: "เวทสามแถวหลัง",
    type: "ทีมแก้",
    heroes: [
      hero("ยอนฮี", "back"),
      hero("ยุนกอน", "back"),
      hero("โอม๊ก", "back"),
    ],
    pet: "Pooki",
    speedOrder: ["ยุนกอน", "ยอนฮี", "โอม๊ก"],
    skillOrder: counterSkillOrder(
      { hero: "ยุนกอน", slot: "B", order: 1 },
      { hero: "ยอนฮี", slot: "T", order: 2 },
      { hero: "โอม๊ก", slot: "A", order: 3 }
    ),
    variants: counterVariants("เร็ว", "3-2", ["Pooki", "Croa", "Irin"]),
    condition: "ใช้เมื่อมั่นใจว่าแถวหลังปลอดภัยและเปิดเกมได้ก่อน",
    counters: 0,
  },
];

/** Every tag any target carries, derived once — the filter panel offers the
 *  dataset's tags, which do not change with what is on screen. */
export const targetTags = Array.from(
  new Set(targets.flatMap((team) => team.tags ?? []))
);

export function teamVariants(team: Team): TargetVariants {
  return (
    team.variants ?? {
      speeds: ["ปกติ"],
      formations: ["2-3"],
      petPackages: [[team.pet]],
    }
  );
}

export function getCounters(target: Team): Team[] {
  return counterFixtures.slice(0, target.counters);
}
