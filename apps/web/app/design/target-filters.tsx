"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@workspace/ui/components/combobox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { Toggle } from "@workspace/ui/components/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import {
  targetTags,
  targetTeamTypes,
  type TargetTeamType,
  type Team,
} from "./_data";

export type TargetFilters = {
  onlyResolved: boolean;
  query: string;
  tags: string[];
  teamTypes: TargetTeamType[];
};

export const noTargetFilters: TargetFilters = {
  onlyResolved: false,
  query: "",
  tags: [],
  teamTypes: [],
};

/**
 * One pass over the list rather than a predicate per field, so the search term
 * is normalised once instead of once per hero of every team.
 */
export function filterTargets(targets: Team[], filters: TargetFilters) {
  const term = filters.query.trim().toLowerCase();

  return targets.filter((team) => {
    if (
      filters.teamTypes.length &&
      (team.targetType === undefined ||
        !filters.teamTypes.includes(team.targetType))
    ) {
      return false;
    }

    if (
      filters.tags.length &&
      !filters.tags.some((tag) => team.tags?.includes(tag))
    ) {
      return false;
    }

    if (filters.onlyResolved && team.counters === 0) {
      return false;
    }

    return team.heroes.some((hero) => hero.name.toLowerCase().includes(term));
  });
}

/**
 * The toggle wears the type's colour at rest so the filter row reads as the
 * same legend the cards use. `!` throughout because Toggle's own pressed and
 * hover states are what would otherwise win.
 */
const teamTypeToggleVariants = cva("rounded-full", {
  variants: {
    targetType: {
      defensive:
        "border-defensive/30 text-defensive hover:border-defensive/40 hover:bg-defensive/10! hover:text-defensive aria-pressed:border-transparent! aria-pressed:bg-defensive/10! aria-pressed:text-defensive!",
      offensive:
        "border-offensive/30 text-offensive hover:border-offensive/40 hover:bg-offensive/10! hover:text-offensive aria-pressed:border-transparent! aria-pressed:bg-offensive/10! aria-pressed:text-offensive!",
      magic:
        "border-magic/30 text-magic hover:border-magic/40 hover:bg-magic/10! hover:text-magic aria-pressed:border-transparent! aria-pressed:bg-magic/10! aria-pressed:text-magic!",
      other:
        "border-universal/30 text-universal hover:border-universal/40 hover:bg-universal/10! hover:text-universal aria-pressed:border-transparent! aria-pressed:bg-universal/10! aria-pressed:text-universal!",
    },
  },
});

/**
 * Controlled as one value rather than a handler per field: the view needs the
 * whole set to filter with and to clear in one go, so splitting it into four
 * pairs would only give both sides more to keep in step.
 */
export function TargetFilterPanel({
  filters,
  onChange,
}: {
  filters: TargetFilters;
  onChange: (filters: TargetFilters) => void;
}) {
  const tagsAnchor = useComboboxAnchor();

  return (
    <div className="grid gap-4 rounded-2xl border bg-card p-4">
      {/* The header's search button is a link to this field, so it has to
          clear the sticky header when the browser scrolls it into view. */}
      <InputGroup className="h-9 scroll-mt-(--design-header-block-size) rounded-xl">
        <InputGroupAddon>
          <MagnifyingGlassIcon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          id="target-search"
          type="search"
          value={filters.query}
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
          placeholder="ค้นหาด้วยชื่อตัวละคร"
          aria-label="ค้นหาด้วยชื่อตัวละคร"
          className="h-full text-sm"
        />
      </InputGroup>

      <div className="grid gap-3 md:flex md:items-end">
        <div className="order-2 grid min-w-0 gap-2 md:order-0 md:flex-1">
          <p className="text-xs font-medium text-muted-foreground">ประเภททีม</p>
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup
              multiple
              value={filters.teamTypes}
              onValueChange={(values) =>
                onChange({ ...filters, teamTypes: values as TargetTeamType[] })
              }
              size="sm"
              variant="outline"
              className="flex w-fit flex-wrap"
              aria-label="กรองตามประเภททีม"
            >
              {targetTeamTypes.map((teamType) => (
                <ToggleGroupItem
                  key={teamType.value}
                  value={teamType.value}
                  className={teamTypeToggleVariants({
                    targetType: teamType.value,
                  })}
                >
                  {teamType.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Toggle
              pressed={filters.onlyResolved}
              onPressedChange={(onlyResolved) =>
                onChange({ ...filters, onlyResolved })
              }
              size="sm"
              variant="outline"
            >
              เฉพาะที่มีทีมแก้
            </Toggle>
          </div>
        </div>

        <div className="order-1 grid gap-2 md:order-0 md:max-w-56 md:flex-1 md:shrink-0 lg:max-w-68">
          <p className="text-xs font-medium text-muted-foreground">แท็กทีม</p>
          <Combobox
            multiple
            items={targetTags}
            value={filters.tags}
            onValueChange={(tags) => onChange({ ...filters, tags })}
          >
            <ComboboxChips
              ref={tagsAnchor}
              className="min-h-9 rounded-xl has-data-[slot=combobox-chip]:px-2"
            >
              {filters.tags.map((selectedTag) => (
                <ComboboxChip key={selectedTag}>{selectedTag}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                aria-label="ค้นหาและเลือกแท็กทีม"
                placeholder={filters.tags.length ? "เพิ่มแท็ก" : "ค้นหาแท็ก"}
              />
            </ComboboxChips>
            <ComboboxContent anchor={tagsAnchor}>
              <ComboboxList>
                <ComboboxEmpty>ไม่พบแท็ก</ComboboxEmpty>
                <ComboboxCollection>
                  {(availableTag) => (
                    <ComboboxItem
                      key={String(availableTag)}
                      value={String(availableTag)}
                    >
                      {String(availableTag)}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
    </div>
  );
}
