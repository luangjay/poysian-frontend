"use client";

import { useState, type ReactNode } from "react";
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
import { cn } from "@workspace/ui/lib/utils";
import {
  type PetPackage,
  type TargetFormation,
  type TargetVariants,
  type Team,
} from "./_data";
import { FormationPreview, Lineup, PetChoice, withFormation } from "./lineup";
import { TeamTypeBadge, teamTypeTextClass } from "./team-card";

const speedOptions: Array<TargetVariants["speeds"][number]> = [
  "ปกติ",
  "ช้า",
  "เร็ว",
];
const formationOptions: TargetFormation[] = ["1-4", "2-3", "3-2", "4-1"];

type VariantSelectorProps = {
  title: string;
  children: ReactNode;
  content: (close: () => void) => ReactNode;
  contentClassName?: string;
  align?: "start" | "end" | "center";
};

function VariantSelector({
  title,
  children,
  content,
  contentClassName,
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
            "hidden flex-col gap-2.5 p-3 sm:flex",
            contentClassName
          )}
          side="top"
        >
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          {content(() => setHoverCardOpen(false))}
        </HoverCardContent>
      </HoverCard>
      <DialogContent
        className="max-w-[calc(100%_-_2rem)] gap-3 p-4 sm:max-w-md"
        showCloseButton={false}
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
                      <FieldLabel key={speed} className="h-full">
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
            contentClassName="w-80"
            title="สัตว์เลี้ยง"
            content={(close) => (
              <FieldSet className="gap-2">
                <FieldLegend className="sr-only">สัตว์เลี้ยง</FieldLegend>
                <RadioGroup
                  aria-label="เลือกสัตว์เลี้ยง"
                  className="grid grid-cols-3 gap-2"
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
                    <FieldLabel key={pets.join("|")} className="min-h-32">
                      <Field className="h-full items-center justify-center text-center">
                        <FieldContent className="items-center justify-center">
                          <PetChoice pets={pets} />
                        </FieldContent>
                        <RadioGroupItem
                          className="sr-only!"
                          value={pets.join("|")}
                        />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </FieldSet>
            )}
          >
            <Lineup.Pets pets={selectedPetPackage} />
          </VariantSelector>

          <VariantSelector
            align="end"
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
                      <FieldLabel key={formation}>
                        <Field
                          data-disabled={!available || undefined}
                          className="h-full items-center justify-center text-center"
                        >
                          <FieldContent className="items-center justify-center">
                            <FormationPreview formation={formation} />
                          </FieldContent>
                          <RadioGroupItem
                            className="sr-only!"
                            disabled={!available}
                            value={formation}
                          />
                        </Field>
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
