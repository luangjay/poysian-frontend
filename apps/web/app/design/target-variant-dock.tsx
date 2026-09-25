"use client";

import { useState } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@workspace/ui/components/field";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";
import {
  targetSpeeds,
  type PetPackage,
  type TargetFormation,
  type TargetVariants,
  type Team,
} from "./_data";
import {
  formationLabel,
  FormationPreview,
  Lineup,
  PetChoice,
  withFormation,
} from "./lineup";
import { TeamTypeBadge } from "./team-card";
import { VariantPopover } from "./variant-popover";

/** The order the game's own picker uses, which is also the sprite order. */
const formationOptions: TargetFormation[] = ["3-2", "2-3", "4-1", "1-4"];

/**
 * A tinted fill alone is easy to miss across four options, so the game marks
 * its choice with a corner check as well. FieldLabel names its own group, and
 * the checked state lives on the radio it wraps.
 */
/**
 * Dismissal hangs off a pointer release, never off the value. Arrow keys move
 * a radio group's selection, and Base UI's focus handler reaches that by
 * calling `inputRef.click()` — so closing on either the change or the click
 * would fire on the first arrow press and strand the options past it. A
 * synthesised click dispatches no pointer events, and a touch that turns into
 * a scroll ends in `pointercancel`, so only a real press gets through. The
 * value applies the moment it changes either way; this only decides when the
 * surface goes away.
 */
function SelectedMark() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-1.5 left-1.5 z-10 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity group-has-data-checked/field-label:opacity-100"
    >
      <CheckIcon weight="bold" />
    </span>
  );
}

/** Art-forward option card: the sprite fills the frame, the label sits in a
 *  bar along the bottom edge — the anatomy the game's own picker uses. */
const optionCard =
  "relative overflow-hidden has-data-checked:border-primary *:data-[slot=field]:p-0";
const optionCaption =
  "w-full bg-muted px-2 py-1.5 text-center text-xs leading-tight font-medium";

type TargetVariantDockProps = {
  className?: string;
  team: Team;
  variants: TargetVariants;
  selectedSpeed: TargetVariants["speeds"][number];
  selectedFormation: TargetFormation;
  selectedPetPackage: PetPackage;
  onSpeedChange: (speed: TargetVariants["speeds"][number]) => void;
  onFormationChange: (formation: TargetFormation) => void;
  onPetPackageChange: (pets: PetPackage) => void;
};

function TargetVariantDock({
  className,
  team,
  variants,
  selectedSpeed,
  selectedFormation,
  selectedPetPackage,
  onSpeedChange,
  onFormationChange,
  onPetPackageChange,
}: TargetVariantDockProps) {
  return (
    <section aria-label="รูปแบบทีมเป้าหมาย" className={className}>
      <Lineup.Surface>
        <Lineup.Rows
          loading="eager"
          team={withFormation(team, selectedFormation)}
        />
        <Lineup.Variants
          speed={
            <VariantPopover
              align="start"
              title="ความเร็ว"
              triggerLabel="เลือกรูปแบบความเร็ว"
              content={(close: () => void) => (
                <FieldSet className="min-w-0 gap-2">
                  <FieldLegend className="sr-only">ความเร็ว</FieldLegend>
                  <RadioGroup
                    aria-label="เลือกรูปแบบความเร็ว"
                    className="grid grid-cols-3 gap-2"
                    value={selectedSpeed}
                    onValueChange={(value) => {
                      if (typeof value === "string") {
                        onSpeedChange(
                          value as TargetVariants["speeds"][number]
                        );
                      }
                    }}
                  >
                    {targetSpeeds.map((speed) => {
                      const available = variants.speeds.includes(speed);
                      return (
                        <FieldLabel
                          key={speed}
                          className="relative h-full has-data-checked:border-primary"
                          onPointerUp={available ? close : undefined}
                        >
                          <Field
                            data-disabled={!available || undefined}
                            className="items-center justify-center text-center"
                          >
                            <FieldContent className="items-center justify-center">
                              <FieldTitle>{speed}</FieldTitle>
                            </FieldContent>
                            <RadioGroupItem
                              className="sr-only!"
                              disabled={!available}
                              value={speed}
                            />
                          </Field>
                          <SelectedMark />
                        </FieldLabel>
                      );
                    })}
                  </RadioGroup>
                </FieldSet>
              )}
            >
              <Lineup.Speed value={selectedSpeed} />
            </VariantPopover>
          }
          pets={
            <VariantPopover
              // Both right-column triggers sit at the surface's edge, so their
              // popups have to grow inward rather than centre on an 80px tile.
              align="end"
              // Wide enough for the companion row: 40 + 4 + 40 inside a
              // third of the card, once its padding is taken out.
              size="wide"
              title="สัตว์เลี้ยง"
              triggerLabel="เลือกรูปแบบสัตว์เลี้ยง"
              content={(close: () => void) => (
                // min-w-0: a <fieldset> carries `min-width: min-content` from
                // the UA stylesheet and preflight does not reset it, so it
                // refuses to shrink below its widest child — which pushed the
                // scrolling pet row out through the side of the dialog rather
                // than scrolling it.
                <FieldSet className="min-w-0 gap-2">
                  <FieldLegend className="sr-only">สัตว์เลี้ยง</FieldLegend>
                  {/* Two per view, the rest on a scroll. A real scrollport over
                    a carousel: arrow-keying a RadioGroup moves focus, and the
                    browser scrolls a focused option into view for free — an
                    embla track would leave focus on a slide you cannot see.
                    Base UI lays the scrollbar over the viewport's foot, so
                    the scrollport bleeds through the popup's own p-3 on three
                    sides to seat the track into the bottom corners — both
                    surfaces pad by 3 for that one number to work, and each
                    publishes its radius so the clip follows its own curve. The
                    row insets with zero-width pseudo-elements: a flex scroll
                    container drops trailing padding, and `last:` cannot be
                    trusted here because RadioGroup renders nodes past the
                    options. Each spacer earns a gap, so one value — the
                    surface's own padding, published as --popup-pad — is the
                    bleed, the gap and the inset at once: P + c + P + c + P is
                    the viewport, so the basis is 50% - 1.5P, and the third
                    card starts at exactly the far edge with no sliver.

                    The trailing spacer is a pixel wide pulled back by a
                    pixel: it has to be a real box, since the scrollable
                    overflow region discards empty rectangles and would take
                    the gap in front of it along too — but it must cost no
                    width, or two cards would overflow by that pixel and raise
                    a scrollbar with nothing to scroll. The leading one can be
                    plain zero; it only pushes layout forward.

                    pt-1 buys the focus ring its 3px inside the scrollport,
                    which clips on every side once overflow-x is set; -mt-1
                    hands that space back so the row keeps the popup's own
                    rhythm instead of sitting 4px below it. */}
                  <ScrollArea
                    className="-mx-(--popup-pad) -mt-1 -mb-(--popup-pad) overflow-hidden rounded-b-(--popup-radius)"
                    orientation="horizontal"
                  >
                    <RadioGroup
                      aria-label="เลือกสัตว์เลี้ยง"
                      className="flex gap-(--popup-pad) pt-1 pb-4 before:w-0 before:shrink-0 before:content-[''] after:-ml-px after:w-px after:shrink-0 after:content-['']"
                      value={selectedPetPackage.join("|")}
                      onValueChange={(value) => {
                        if (typeof value === "string") {
                          const pets = variants.petPackages.find(
                            (option) => option.join("|") === value
                          );
                          if (pets) {
                            onPetPackageChange(pets);
                          }
                        }
                      }}
                    >
                      {variants.petPackages.map((pets) => (
                        <FieldLabel
                          key={pets.join("|")}
                          onPointerUp={close}
                          className={cn(
                            optionCard,
                            "shrink-0 basis-[calc(50%-var(--popup-pad)*1.5)]"
                          )}
                        >
                          <Field className="h-full items-center justify-between gap-0 text-center">
                            <FieldContent className="items-center justify-center p-2.5">
                              <PetChoice pets={pets} />
                            </FieldContent>
                            {/* Always a name, so every option reads the same
                                kind of label — three names would not fit, and
                                a bare count on some options and a name on
                                others made the row incoherent. The `/N` is the
                                notation the variant tile uses. */}
                            <span className={optionCaption}>
                              {pets[0]}
                              {pets.length > 1 ? (
                                <span className="text-muted-foreground">
                                  {" "}
                                  /{pets.length}
                                </span>
                              ) : null}
                              <span className="sr-only">
                                {pets.join(" หรือ ")}
                              </span>
                            </span>
                            <RadioGroupItem
                              className="sr-only!"
                              value={pets.join("|")}
                            />
                          </Field>
                          <SelectedMark />
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                  </ScrollArea>
                </FieldSet>
              )}
            >
              <Lineup.Pets pets={selectedPetPackage} />
            </VariantPopover>
          }
          formation={
            <VariantPopover
              align="end"
              title="แผนการรบ"
              triggerLabel="เลือกรูปแบบแผนการรบ"
              content={(close: () => void) => (
                <FieldSet className="min-w-0 gap-2">
                  <FieldLegend className="sr-only">แผนการรบ</FieldLegend>
                  <RadioGroup
                    aria-label="เลือกแผนการรบ"
                    className="grid grid-cols-2 gap-2"
                    value={selectedFormation}
                    onValueChange={(value) => {
                      if (typeof value === "string") {
                        onFormationChange(value as TargetFormation);
                      }
                    }}
                  >
                    {formationOptions.map((formation) => {
                      const available = variants.formations.includes(formation);
                      return (
                        <FieldLabel
                          key={formation}
                          className={optionCard}
                          onPointerUp={available ? close : undefined}
                        >
                          {/* Field only dims a FieldTitle on its own, which
                              the speed options have and this one does not —
                              its content is a sprite and a caption bar, so the
                              whole cell carries the state instead. */}
                          <Field
                            data-disabled={!available || undefined}
                            className="h-full items-center justify-between gap-0 text-center data-disabled:opacity-50"
                          >
                            <FieldContent className="items-center justify-center p-2.5">
                              <FormationPreview formation={formation} />
                            </FieldContent>
                            <span className={optionCaption}>
                              {formationLabel(formation)}
                            </span>
                            <RadioGroupItem
                              className="sr-only!"
                              disabled={!available}
                              value={formation}
                            />
                          </Field>
                          <SelectedMark />
                        </FieldLabel>
                      );
                    })}
                  </RadioGroup>
                </FieldSet>
              )}
            >
              <Lineup.Formation formation={selectedFormation} />
            </VariantPopover>
          }
        />
      </Lineup.Surface>
    </section>
  );
}

export function TargetSummary({ team }: { team: Team }) {
  const variants: TargetVariants = team.variants ?? {
    speeds: ["ปกติ"],
    formations: ["2-3"],
    petPackages: [[team.pet]],
  };
  const [selectedSpeed, setSelectedSpeed] = useState(
    variants.speeds[0] ?? "ปกติ"
  );
  const [selectedFormation, setSelectedFormation] = useState(
    variants.formations[0] ?? "2-3"
  );
  const [selectedPetPackage, setSelectedPetPackage] = useState<PetPackage>(
    variants.petPackages[0] ?? [team.pet]
  );

  return (
    <section
      aria-labelledby="target-summary-title"
      className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-x-8"
    >
      {/* Flush left, on the same edge as the back link above it and the
          counter rows below. The identity and lineup now share the first row,
          so their top edges establish the summary together. What remains is a
          measure cap, which is the text's own business: max-w-prose while the
          section is one column, max-w-sm from lg where a ragged edge partway
          across the 1fr track is what would look unplanned. */}
      <div className="grid max-w-prose gap-3 lg:max-w-sm">
        {/* Plain, not tinted by team type: the badge below already spends
            that colour on the type, and two different facts wearing one colour
            8px apart read as one. */}
        <div className="grid gap-1">
          <p className="text-xs font-medium text-muted-foreground">
            ทีมเป้าหมาย
          </p>
          <h1
            id="target-summary-title"
            className="text-2xl font-semibold tracking-tight"
          >
            {team.title}
          </h1>
        </div>
        {/* Bigger than the card's badges: here they sit under a text-2xl
            title and beside a text-base lead, not in a dense grid. */}
        <div className="flex flex-wrap gap-2">
          <TeamTypeBadge className="h-6 px-2.5 text-sm" team={team} />
          {team.tags?.map((tag) => (
            <Badge
              key={tag}
              className="h-6 rounded-md px-2.5 text-sm"
              variant="outline"
            >
              {tag}
            </Badge>
          ))}
        </div>
        {/* text-base was chosen to fill the column beside the lineup. Stacked
            there is no column to fill, so it would just be larger. */}
        <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
          {team.condition}
        </p>
      </div>
      <TargetVariantDock
        className="lg:col-start-2 lg:row-start-1"
        team={team}
        variants={variants}
        selectedSpeed={selectedSpeed}
        selectedFormation={selectedFormation}
        selectedPetPackage={selectedPetPackage}
        onSpeedChange={setSelectedSpeed}
        onFormationChange={setSelectedFormation}
        onPetPackageChange={setSelectedPetPackage}
      />
    </section>
  );
}
