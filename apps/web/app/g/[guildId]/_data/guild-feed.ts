export type BattleRow = "front" | "back";

export type DeployedHero = {
  id: string;
  name: string;
  row: BattleRow;
  slot: number;
};

export type Lineup = {
  heroes: [DeployedHero, DeployedHero, DeployedHero];
  pet: string;
  skillOrder: string[];
};

export type TeamVariant = {
  petChoices: string[];
  speed: "fast" | "slow";
};

export type TargetTeam = {
  id: string;
  label: string;
  lineup: Lineup;
  variant: TeamVariant;
};

export type TargetSummary = TargetTeam & {
  counterCount: number;
};

export type HeroStrategy = {
  heroId: string;
  name: string;
  focus: string;
  gear: string[];
};

export type CounterTeam = {
  id: string;
  label: string;
  lineup: Lineup;
  heroes: [HeroStrategy, HeroStrategy, HeroStrategy];
  note: string;
};

type TargetRecord = {
  target: TargetTeam;
  counters: CounterTeam[];
};

const targetRecords: TargetRecord[] = [
  {
    target: {
      id: "rudy-yeonhee-rosie",
      label: "Rudy · Yeonhee · Rosie",
      lineup: {
        heroes: [
          { id: "rudy", name: "Rudy", row: "front", slot: 0 },
          { id: "yeonhee", name: "Yeonhee", row: "back", slot: 1 },
          { id: "rosie", name: "Rosie", row: "back", slot: 2 },
        ],
        pet: "Irin",
        skillOrder: ["Defense Prep", "Sweet Dream", "Meteor"],
      },
      variant: { speed: "fast", petChoices: ["Irin", "Pooki"] },
    },
    counters: [
      {
        id: "evan-karin-rin",
        label: "Evan · Karin · Rin",
        lineup: {
          heroes: [
            { id: "evan", name: "Evan", row: "front", slot: 0 },
            { id: "karin", name: "Karin", row: "front", slot: 1 },
            { id: "rin", name: "Rin", row: "back", slot: 1 },
          ],
          pet: "Richelle",
          skillOrder: ["Shield", "Dragon Strike", "Recovery"],
        },
        heroes: [
          {
            heroId: "evan",
            name: "Evan",
            focus: "Open with survivability before Rin takes damage.",
            gear: ["HP", "Block", "Damage reduction"],
          },
          {
            heroId: "karin",
            name: "Karin",
            focus: "Keep the front line stable through the first rotation.",
            gear: ["HP", "Cooldown recovery", "Healing"],
          },
          {
            heroId: "rin",
            name: "Rin",
            focus: "Use the back-row attack bonus for the main damage.",
            gear: ["Speed", "Attack", "Critical damage"],
          },
        ],
        note: "Rin should be the fastest hero in this counter lineup.",
      },
      {
        id: "guan-yu-pascal-yui",
        label: "Guan Yu · Pascal · Yui",
        lineup: {
          heroes: [
            { id: "guan-yu", name: "Guan Yu", row: "front", slot: 0 },
            { id: "pascal", name: "Pascal", row: "back", slot: 1 },
            { id: "yui", name: "Yui", row: "back", slot: 2 },
          ],
          pet: "Jupi",
          skillOrder: ["Giant", "Buff Remove", "Pierce"],
        },
        heroes: [
          {
            heroId: "guan-yu",
            name: "Guan Yu",
            focus: "Hold the front alone to maximize the defense bonus.",
            gear: ["HP", "Defense", "Block"],
          },
          {
            heroId: "pascal",
            name: "Pascal",
            focus: "Primary burst after the defense setup is removed.",
            gear: ["Attack", "Critical damage", "Weakness attack"],
          },
          {
            heroId: "yui",
            name: "Yui",
            focus: "Remove key buffs before Pascal's damage window.",
            gear: ["Speed", "Effect accuracy", "HP"],
          },
        ],
        note: "Use this option when the enemy setup relies heavily on linked defense.",
      },
    ],
  },
  {
    target: {
      id: "evan-karin-kagura",
      label: "Evan · Karin · Kagura",
      lineup: {
        heroes: [
          { id: "evan-defense", name: "Evan", row: "front", slot: 0 },
          { id: "karin-defense", name: "Karin", row: "front", slot: 1 },
          { id: "kagura", name: "Kagura", row: "back", slot: 1 },
        ],
        pet: "Croa",
        skillOrder: ["Barrier", "Moonlit Cut", "Recovery"],
      },
      variant: { speed: "slow", petChoices: ["Croa", "Windy"] },
    },
    counters: [
      {
        id: "guan-yu-pascal-yui-kagura",
        label: "Guan Yu · Pascal · Yui",
        lineup: {
          heroes: [
            {
              id: "guan-yu-kagura",
              name: "Guan Yu",
              row: "front",
              slot: 0,
            },
            { id: "pascal-kagura", name: "Pascal", row: "back", slot: 1 },
            { id: "yui-kagura", name: "Yui", row: "back", slot: 2 },
          ],
          pet: "Jupi",
          skillOrder: ["Giant", "Buff Remove", "Pierce"],
        },
        heroes: [
          {
            heroId: "guan-yu-kagura",
            name: "Guan Yu",
            focus: "Protect the attackers while the barrier is active.",
            gear: ["HP", "Defense", "Block"],
          },
          {
            heroId: "pascal-kagura",
            name: "Pascal",
            focus: "Convert the post-buff-removal window into a quick kill.",
            gear: ["Attack", "Critical damage", "Weakness attack"],
          },
          {
            heroId: "yui-kagura",
            name: "Yui",
            focus: "Remove barrier and shorten the enemy's buff window.",
            gear: ["Speed", "Effect accuracy", "HP"],
          },
        ],
        note: "Keep Pascal in back to take the attack increase from a two-hero back row.",
      },
    ],
  },
  {
    target: {
      id: "nia-vanessa-teo",
      label: "Nia · Vanessa · Teo",
      lineup: {
        heroes: [
          { id: "nia", name: "Nia", row: "front", slot: 0 },
          { id: "vanessa", name: "Vanessa", row: "front", slot: 1 },
          { id: "teo", name: "Teo", row: "back", slot: 0 },
        ],
        pet: "Pooki",
        skillOrder: ["Time Stop", "Stun", "Black Moon"],
      },
      variant: { speed: "fast", petChoices: ["Pooki", "Irin"] },
    },
    counters: [
      {
        id: "hellenia-spike-lubu",
        label: "Hellenia · Spike · Lu Bu",
        lineup: {
          heroes: [
            { id: "hellenia", name: "Hellenia", row: "front", slot: 1 },
            { id: "spike", name: "Spike", row: "front", slot: 2 },
            { id: "lu-bu", name: "Lu Bu", row: "back", slot: 0 },
          ],
          pet: "Dello",
          skillOrder: ["Immunity", "Frozen Field", "Sky Splitter"],
        },
        heroes: [
          {
            heroId: "hellenia",
            name: "Hellenia",
            focus: "Act before the control effects and protect the team.",
            gear: ["Speed", "HP", "Effect resistance"],
          },
          {
            heroId: "spike",
            name: "Spike",
            focus: "Layer control after immunity is active.",
            gear: ["Effect accuracy", "HP", "Defense"],
          },
          {
            heroId: "lu-bu",
            name: "Lu Bu",
            focus: "Take the solo back-row attack bonus for the finisher.",
            gear: ["Attack", "Critical damage", "Weakness attack"],
          },
        ],
        note: "The automatic order needs Hellenia's immunity to resolve first.",
      },
    ],
  },
  {
    target: {
      id: "karma-chancellor-kyle",
      label: "Karma · Chancellor · Kyle",
      lineup: {
        heroes: [
          { id: "karma", name: "Karma", row: "front", slot: 1 },
          {
            id: "chancellor",
            name: "Chancellor",
            row: "front",
            slot: 2,
          },
          { id: "kyle", name: "Kyle", row: "back", slot: 0 },
        ],
        pet: "Windy",
        skillOrder: ["Counter Stance", "Judgment", "Chain Attack"],
      },
      variant: { speed: "slow", petChoices: ["Windy", "Croa"] },
    },
    counters: [
      {
        id: "rudy-leo-melchior",
        label: "Rudy · Leo · Melchior",
        lineup: {
          heroes: [
            { id: "rudy-attack", name: "Rudy", row: "front", slot: 0 },
            { id: "leo", name: "Leo", row: "front", slot: 2 },
            { id: "melchior", name: "Melchior", row: "back", slot: 1 },
          ],
          pet: "Irin",
          skillOrder: ["Defense Prep", "Block", "Dark Burst"],
        },
        heroes: [
          {
            heroId: "rudy-attack",
            name: "Rudy",
            focus: "Anchor the front row against the opening pressure.",
            gear: ["HP", "Defense", "Block"],
          },
          {
            heroId: "leo",
            name: "Leo",
            focus: "Provide protection before Melchior's damage turn.",
            gear: ["Speed", "HP", "Effect resistance"],
          },
          {
            heroId: "melchior",
            name: "Melchior",
            focus: "Use the back-row position for the primary damage output.",
            gear: ["Attack", "Critical damage", "Weakness attack"],
          },
        ],
        note: "Tune Leo ahead of Melchior in the recorded automatic skill order.",
      },
    ],
  },
  {
    target: {
      id: "back-row-trio",
      label: "Shane · Eileene · Rachel",
      lineup: {
        heroes: [
          { id: "shane", name: "Shane", row: "back", slot: 0 },
          { id: "eileene", name: "Eileene", row: "back", slot: 1 },
          { id: "rachel", name: "Rachel", row: "back", slot: 2 },
        ],
        pet: "Pooki",
        skillOrder: ["Quick Draw", "Lightning", "Burning Edge"],
      },
      variant: { speed: "fast", petChoices: ["Pooki", "Croa"] },
    },
    counters: [],
  },
];

export type GuildTargetsPage = {
  guild: {
    slug: string;
    name: string;
  };
  targets: TargetSummary[];
};

export type TargetCountersPage = {
  guild: {
    slug: string;
    name: string;
  };
  target: TargetTeam;
  counters: CounterTeam[];
};

/** Guild home reads only target summaries, never counter-strategy details. */
export function getGuildTargets(slug: string): GuildTargetsPage {
  return {
    guild: {
      slug,
      name: slug === "rHXBvNfW" ? "7K Combo" : "Poysian Guild",
    },
    targets: targetRecords.map(({ target, counters }) => ({
      ...target,
      counterCount: counters.length,
    })),
  };
}

/** Counter page reads one target and its associated counter strategies. */
export function getTargetCounters(
  slug: string,
  targetId: string
): TargetCountersPage | undefined {
  const record = targetRecords.find(({ target }) => target.id === targetId);

  if (!record) {
    return undefined;
  }

  return {
    guild: {
      slug,
      name: slug === "rHXBvNfW" ? "7K Combo" : "Poysian Guild",
    },
    target: record.target,
    counters: record.counters,
  };
}
