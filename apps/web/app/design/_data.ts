export type Hero = { name: string; role: string; row: "front" | "back" };
export const targetTeamTypes = [
  { value: "defensive", label: "ป้องกัน" },
  { value: "offensive", label: "โจมตี" },
  { value: "magic", label: "เวทมนตร์" },
  { value: "other", label: "อื่น ๆ" },
] as const;

export type TargetTeamType = (typeof targetTeamTypes)[number]["value"];

export const targetFormations = [
  { value: "1-4", label: "1–4", backHeroCount: 2 },
  { value: "3-2", label: "3–2", backHeroCount: 0 },
  { value: "2-3", label: "2–3", backHeroCount: 1 },
  { value: "4-1", label: "4–1", backHeroCount: 0 },
] as const;

export type TargetFormation = (typeof targetFormations)[number]["value"];

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
  speeds: Array<"เร็ว" | "ปกติ" | "ช้า">;
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

const hero = (name: string, role: string, row: Hero["row"]): Hero => ({
  name,
  role,
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
    id: "moonlight",
    title: "Yeonhee · Rosie · Rudy",
    type: "เวทมนตร์",
    targetType: "magic",
    tags: ["ยื้อ HP", "คุมสถานะ"],
    heroes: [
      hero("Yeonhee", "เวทมนตร์", "back"),
      hero("Rosie", "สนับสนุน", "back"),
      hero("Rudy", "ป้องกัน", "front"),
    ],
    pet: "Irin",
    variants: {
      speeds: ["ปกติ", "เร็ว", "ช้า"],
      formations: ["1-4", "2-3", "3-2"],
      petPackages: [
        ["Irin", "Pooki"],
        ["Pooki", "Croa", "Irin", "Windy", "Lulu"],
        ["Croa"],
      ],
    },
    condition: "ระวังการควบคุมจากแถวหลัง",
    counters: 2,
  },
  {
    id: "silent-blade",
    title: "Kagura · Evan · Karin",
    type: "ป้องกัน",
    targetType: "defensive",
    tags: ["ยื้อ HP", "สวนกลับ"],
    heroes: [
      hero("Kagura", "โจมตี", "back"),
      hero("Evan", "ป้องกัน", "front"),
      hero("Karin", "สนับสนุน", "front"),
    ],
    pet: "Croa",
    variants: {
      speeds: ["ปกติ", "เร็ว", "ช้า"],
      formations: ["2-3", "1-4", "4-1"],
      petPackages: [["Croa", "Irin"], ["Irin"], ["Pooki", "Croa"]],
    },
    condition: "มีฮีลและตัวรับความเสียหาย",
    counters: 3,
  },
  {
    id: "nightfall",
    title: "Teo · Nia · Vanessa",
    type: "โจมตี",
    targetType: "offensive",
    tags: ["เน้นความเร็ว", "ปิดงาน"],
    heroes: [
      hero("Teo", "โจมตี", "back"),
      hero("Nia", "เวทมนตร์", "front"),
      hero("Vanessa", "สนับสนุน", "front"),
    ],
    pet: "Pooki",
    variants: {
      speeds: ["เร็ว", "ช้า"],
      formations: ["1-4", "2-3"],
      petPackages: [["Pooki", "Irin"], ["Croa"]],
    },
    condition: "ตรวจสอบลำดับการออกสกิล",
    counters: 1,
  },
  {
    id: "iron-wall",
    title: "Kyle · Karma · Chancellor",
    type: "ป้องกัน",
    targetType: "defensive",
    tags: ["ยื้อ HP", "สวนกลับ"],
    heroes: [
      hero("Kyle", "โจมตี", "back"),
      hero("Karma", "สมดุล", "front"),
      hero("Chancellor", "ป้องกัน", "front"),
    ],
    pet: "Windy",
    variants: {
      speeds: ["ปกติ", "ช้า"],
      formations: ["2-3", "1-4"],
      petPackages: [["Windy", "Irin"], ["Irin"]],
    },
    condition: "ทีมรับแน่น พร้อมสวนกลับ",
    counters: 1,
  },
  {
    id: "all-in",
    title: "Shane · Eileene · Rachel",
    type: "โจมตี",
    targetType: "offensive",
    tags: ["เน้นความเร็ว", "ปิดงาน"],
    heroes: [
      hero("Shane", "โจมตี", "back"),
      hero("Eileene", "สมดุล", "back"),
      hero("Rachel", "โจมตี", "back"),
    ],
    pet: "Croa",
    variants: {
      speeds: ["เร็ว", "ช้า"],
      formations: ["3-2", "2-3"],
      petPackages: [["Croa", "Pooki", "Irin"], ["Pooki"]],
    },
    condition: "สามตัวแถวหลัง เน้นความเสียหาย",
    counters: 0,
  },
  {
    id: "daybreak",
    title: "Rudy · Karin · Rachel",
    type: "อื่น ๆ",
    targetType: "other",
    tags: ["ยื้อ HP", "คุมสถานะ"],
    heroes: [
      hero("Rudy", "ป้องกัน", "front"),
      hero("Karin", "สนับสนุน", "back"),
      hero("Rachel", "โจมตี", "back"),
    ],
    pet: "Irin",
    variants: {
      speeds: ["ปกติ", "เร็ว"],
      formations: ["2-3", "1-4"],
      petPackages: [["Irin", "Windy"], ["Windy"]],
    },
    condition: "ยื้อจังหวะด้วยฮีลและเกราะ",
    counters: 0,
  },
];

// Design fixtures: illustrative setups, not verified game recommendations.
export function getCounters(target: Team): Team[] {
  return [
    {
      id: "opening",
      title: "เปิดก่อน แล้วปิดเกม",
      type: "ต้องเปิดก่อน",
      heroes: [
        hero("Teo", "โจมตี", "back"),
        hero("Karma", "สมดุล", "front"),
        hero("Karin", "สนับสนุน", "front"),
      ],
      pet: "Croa",
      speedOrder: ["Teo", "Karma", "Karin"],
      skillOrder: counterSkillOrder(
        { hero: "Teo", slot: "T", order: 1 },
        { hero: "Teo", slot: "B", order: 2 },
        { hero: "Teo", slot: "A", order: 3 }
      ),
      variants: counterVariants("เร็ว", "2-3", [
        "Croa",
        "Irin",
        "Windy",
        "Pooki",
        "Lulu",
      ]),
      condition: "จัดความเร็วให้ตัวเปิดได้ออกสกิลก่อน และเตรียมต้านสถานะ",
      counters: 0,
    },
    {
      id: "survive",
      title: "รับจังหวะแรก แล้วสวนกลับ",
      type: "เล่นจังหวะสวน",
      heroes: [
        hero("Rudy", "ป้องกัน", "front"),
        hero("Rachel", "โจมตี", "back"),
        hero("Karin", "สนับสนุน", "back"),
      ],
      pet: "Irin",
      speedOrder: ["Rudy", "Rachel", "Karin"],
      skillOrder: counterSkillOrder(
        { hero: "Rudy", slot: "B", order: 1 },
        { hero: "Rachel", slot: "T", order: 2 },
        { hero: "Karin", slot: "A", order: 3 }
      ),
      variants: counterVariants("ช้า", "1-4", ["Irin", "Windy"]),
      condition: "ตัวรับต้องยืนผ่านชุดสกิลแรกได้ก่อนเริ่มสวนกลับ",
      counters: 0,
    },
    {
      id: "opening2",
      title: "เปิดก่อน แล้วปิดเกม 2",
      type: "ต้องเปิดก่อน",
      heroes: [
        hero("Teo", "โจมตี", "back"),
        hero("Karma", "สมดุล", "front"),
        hero("Karin", "สนับสนุน", "front"),
      ],
      pet: "Croa",
      speedOrder: ["Teo", "Karma", "Karin"],
      skillOrder: counterSkillOrder(
        { hero: "Teo", slot: "T", order: 1 },
        { hero: "Karma", slot: "B", order: 2 },
        { hero: "Karin", slot: "A", order: 3 }
      ),
      variants: counterVariants("เร็ว", "2-3", ["Croa", "Pooki"]),
      condition: "จัดความเร็วให้ตัวเปิดได้ออกสกิลก่อน และเตรียมต้านสถานะ",
      counters: 0,
    },
    {
      id: "survive2",
      title: "รับจังหวะแรก แล้วสวนกลับ 2",
      type: "เล่นจังหวะสวน",
      heroes: [
        hero("Rudy", "ป้องกัน", "front"),
        hero("Rachel", "โจมตี", "back"),
        hero("Karin", "สนับสนุน", "back"),
      ],
      pet: "Irin",
      speedOrder: ["Rudy", "Rachel", "Karin"],
      skillOrder: counterSkillOrder(
        { hero: "Rudy", slot: "B", order: 1 },
        { hero: "Rachel", slot: "T", order: 2 },
        { hero: "Karin", slot: "A", order: 3 }
      ),
      variants: counterVariants("ช้า", "1-4", ["Irin", "Windy", "Pooki"]),
      condition: "ตัวรับต้องยืนผ่านชุดสกิลแรกได้ก่อนเริ่มสวนกลับ",
      counters: 0,
    },
  ].slice(0, target.counters);
}
