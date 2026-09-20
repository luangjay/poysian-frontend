"use client";

import { useState, type ReactNode } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@workspace/ui/components/field";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";
import {
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
import { TeamTypeBadge, teamTypeTextClass } from "./team-card";

const speedOptions: Array<TargetVariants["speeds"][number]> = [
  "ปกติ",
  "ช้า",
  "เร็ว",
];
/** The order the game's own picker uses, which is also the sprite order. */
const formationOptions: TargetFormation[] = ["3-2", "2-3", "4-1", "1-4"];

/**
 * A tinted fill alone is easy to miss across four options, so the game marks
 * its choice with a corner check as well. FieldLabel names its own group, and
 * the checked state lives on the radio it wraps.
 */
function SelectedMark() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-1.5 left-1.5 z-10 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity group-has-data-checked/field-label:opacity-100"
    >
      <CheckIcon className="size-2.5" weight="bold" />
    </span>
  );
}

/** Art-forward option card: the sprite fills the frame, the label sits in a
 *  bar along the bottom edge — the anatomy the game's own picker uses. */
const optionCard =
  "relative overflow-hidden has-data-checked:border-primary *:data-[slot=field]:p-0";
const optionCaption =
  "w-full bg-muted px-2 py-1.5 text-center text-xs leading-tight font-medium";

type VariantSelectorProps = {
  title: string;
  children: ReactNode;
  content: (close: () => void) => ReactNode;
  contentClassName?: string;
  dialogClassName?: string;
  align?: "start" | "end" | "center";
};

function VariantSelector({
  title,
  children,
  content,
  contentClassName,
  dialogClassName,
  align = "center",
}: VariantSelectorProps) {
  const [hoverCardOpen, setHoverCardOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (open) {
          setHoverCardOpen(false);
        }
      }}
    >
      <HoverCard open={hoverCardOpen} onOpenChange={setHoverCardOpen}>
        <HoverCardTrigger
          closeDelay={180}
          delay={120}
          render={
            <DialogTrigger
              aria-label={`เลือกรูปแบบ${title}`}
              render={
                <Button
                  // The card fills this button and owns the hover and focus
                  // states, so the button contributes geometry only.
                  className="group h-full w-full rounded-lg p-0 hover:bg-transparent focus-visible:border-transparent focus-visible:ring-0"
                  variant="ghost"
                />
              }
            />
          }
        >
          {children}
        </HoverCardTrigger>
        <HoverCardContent
          align={align}
          className={cn(
            "hidden flex-col gap-2.5 p-3 [--popup-pad:0.75rem] [--popup-radius:var(--radius-lg)] sm:flex",
            contentClassName
          )}
          side="top"
        >
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          {content(() => setHoverCardOpen(false))}
        </HoverCardContent>
      </HoverCard>
      <DialogContent
        className={cn(
          "max-w-[calc(100%-2rem)] gap-3 p-4 [--popup-pad:1rem] [--popup-radius:var(--radius-xl)] sm:max-w-md",
          dialogClassName
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content(() => setDialogOpen(false))}
      </DialogContent>
    </Dialog>
  );
}

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
        <Lineup.Variants>
          <VariantSelector
            align="start"
            dialogClassName="w-96"
            title="ความเร็ว"
            content={(close) => (
              <FieldSet className="gap-2">
                <FieldLegend className="sr-only">ความเร็ว</FieldLegend>
                <RadioGroup
                  aria-label="เลือกรูปแบบความเร็ว"
                  className="grid grid-cols-3 gap-2"
                  value={selectedSpeed}
                  onValueChange={(value) => {
                    if (typeof value === "string") {
                      onSpeedChange(value as TargetVariants["speeds"][number]);
                      close();
                    }
                  }}
                >
                  {speedOptions.map((speed) => {
                    const available = variants.speeds.includes(speed);
                    return (
                      <FieldLabel
                        key={speed}
                        className="relative h-full has-data-checked:border-primary"
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
          </VariantSelector>

          <VariantSelector
            // Wide enough for the companion row: 40 + 4 + 40 inside a
            // third of the card, once its padding is taken out.
            contentClassName="w-96"
            title="สัตว์เลี้ยง"
            content={(close) => (
              <FieldSet className="gap-2">
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
                          close();
                        }
                      }
                    }}
                  >
                    {variants.petPackages.map((pets) => (
                      <FieldLabel
                        key={pets.join("|")}
                        className={cn(
                          optionCard,
                          "shrink-0 basis-[calc(50%-var(--popup-pad)*1.5)]"
                        )}
                      >
                        <Field className="h-full items-center justify-between gap-0 text-center">
                          <FieldContent className="items-center justify-center p-2.5">
                            <PetChoice pets={pets} />
                          </FieldContent>
                          <span className={optionCaption}>
                            {pets[0]}
                            {pets.length > 1 ? (
                              <span className="text-muted-foreground">
                                {" "}
                                +{pets.length - 1}
                              </span>
                            ) : null}
                            <span className="sr-only">{pets.join(", ")}</span>
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
          </VariantSelector>

          <VariantSelector
            align="end"
            dialogClassName="w-96"
            title="แผนการรบ"
            content={(close) => (
              <FieldSet className="gap-2">
                <FieldLegend className="sr-only">แผนการรบ</FieldLegend>
                <RadioGroup
                  aria-label="เลือกแผนการรบ"
                  className="grid grid-cols-2 gap-2"
                  value={selectedFormation}
                  onValueChange={(value) => {
                    if (typeof value === "string") {
                      onFormationChange(value as TargetFormation);
                      close();
                    }
                  }}
                >
                  {formationOptions.map((formation) => {
                    const available = variants.formations.includes(formation);
                    return (
                      <FieldLabel key={formation} className={optionCard}>
                        <Field
                          data-disabled={!available || undefined}
                          className="h-full items-center justify-between gap-0 text-center"
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
          </VariantSelector>
        </Lineup.Variants>
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
    /* The column is exactly Lineup.Surface's max width, so the lineup sits
       flush with the container edge instead of floating inside a wider track. */
    <section
      aria-labelledby="target-summary-title"
      className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-8"
    >
      {/* Stacked, the title has to name the lineup before you meet it. It takes
          the surface's own max-w-md and centres as a block, so the two rows
          share both edges and every line here starts on the lineup's left edge
          — centring the text instead would leave four separately centred
          shapes with no spine. Side by side from lg, the two read at once.
          `lg:pt-9` clears the back link overhanging this column. */}
      <div className="mx-auto grid w-full max-w-md gap-2 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:max-w-none lg:pt-9">
        <p className={cn("text-xs font-medium", teamTypeTextClass(team))}>
          ทีมเป้าหมาย
        </p>
        <h1
          id="target-summary-title"
          className="text-2xl font-semibold tracking-tight"
        >
          {team.title}
        </h1>
        <div className="flex flex-wrap gap-1.5">
          <TeamTypeBadge team={team} />
          {team.tags?.map((tag) => (
            <Badge key={tag} className="rounded-md" variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {team.condition}
        </p>
      </div>
      <TargetVariantDock
        className="mx-auto w-full max-w-md lg:col-start-2 lg:row-start-1"
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
