export type Hero = { name: string; role: string; row: "front" | "back" };
export const targetTeamTypes = [
  { value: "defensive", label: "ป้องกัน" },
  { value: "offensive", label: "โจมตี" },
  { value: "magic", label: "เวทมนตร์" },
  { value: "other", label: "อื่น ๆ" },
] as const;

export type TargetTeamType = (typeof targetTeamTypes)[number]["value"];

export type Team = {
  id: string;
  title: string;
  type: string;
  targetType?: TargetTeamType;
  tags?: string[];
  heroes: Hero[];
  pet: string;
  condition: string;
  counters: number;
};

const hero = (name: string, role: string, row: Hero["row"]): Hero => ({
  name,
  role,
  row,
});

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
      condition: "ตัวรับต้องยืนผ่านชุดสกิลแรกได้ก่อนเริ่มสวนกลับ",
      counters: 0,
    },
  ].slice(0, target.counters);
}
