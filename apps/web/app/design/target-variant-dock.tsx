"use client";

import { useState, type ReactNode } from "react";
import { SneakerMoveIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
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
import {
  type PetPackage,
  type TargetFormation,
  type TargetVariants,
  type Team,
} from "./_data";
import { FormationPreview, Lineup, PetChoice, withFormation } from "./lineup";
import { TeamTypeBadge } from "./team-card";

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
  side?: "top" | "bottom";
  align?: "start" | "end" | "center";
};

function VariantSelector({
  title,
  children,
  content,
  contentClassName,
  side = "bottom",
  align = "center",
}: VariantSelectorProps) {
  const [hoverCardOpen, setHoverCardOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const triggerClassName =
    "h-full w-full rounded-none px-2 py-2 text-left hover:bg-card/70";

  return (
    <>
      <div className="hidden h-full sm:block">
        <HoverCard open={hoverCardOpen} onOpenChange={setHoverCardOpen}>
          <HoverCardTrigger
            aria-label={`เลือกรูปแบบ${title}`}
            closeDelay={180}
            delay={120}
            render={<Button className={triggerClassName} variant="ghost" />}
          >
            {children}
          </HoverCardTrigger>
          <HoverCardContent
            align={align}
            className={`gap-3 p-3 ${contentClassName ?? ""}`}
            side={side}
          >
            <p className="text-sm font-medium">{title}</p>
            {content(() => setHoverCardOpen(false))}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="h-full sm:hidden">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            aria-label={`เลือกรูปแบบ${title}`}
            render={<Button className={triggerClassName} variant="ghost" />}
          >
            {children}
          </DialogTrigger>
          <DialogContent
            className="max-w-[calc(100%_-_2rem)] gap-3 p-4"
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {content(() => setDialogOpen(false))}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

type TargetVariantDockProps = {
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
    <section
      aria-label="รูปแบบทีมเป้าหมาย"
      className="grid overflow-hidden rounded-xl border bg-accent sm:grid-cols-[6.5rem_minmax(0,1fr)_7rem] sm:grid-rows-2"
    >
      <div className="col-span-3 row-start-1 min-w-0 border-b sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:border-x sm:border-b-0">
        <Lineup.Rows
          loading="eager"
          team={withFormation(team, selectedFormation)}
        />
      </div>
      <div className="col-start-1 row-start-2 min-h-24 sm:col-start-1 sm:row-start-1">
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
          <span className="flex h-full flex-col items-start justify-center gap-1">
            <SneakerMoveIcon
              aria-hidden="true"
              className="size-4 text-primary"
            />
            <span className="text-xs text-muted-foreground">ความเร็ว</span>
            <span className="text-sm font-medium">{selectedSpeed}</span>
          </span>
        </VariantSelector>
      </div>
      <div className="col-start-2 row-start-2 min-h-24 border-l sm:col-start-3 sm:row-start-1 sm:border-l-0">
        <VariantSelector
          align="end"
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
          <span className="flex h-full flex-col items-center justify-center">
            <PetChoice pets={selectedPetPackage} />
          </span>
        </VariantSelector>
      </div>
      <div className="col-start-3 row-start-2 min-h-24 border-l sm:col-start-3 sm:row-start-2 sm:border-t sm:border-l-0">
        <VariantSelector
          align="end"
          side="top"
          title="การจัดแถว"
          content={(close) => (
            <FieldSet className="gap-2">
              <FieldLegend className="sr-only">การจัดแถว</FieldLegend>
              <RadioGroup
                aria-label="เลือกการจัดแถว"
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
                    <FieldLabel key={formation} className="aspect-square">
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
          <span className="flex h-full flex-col items-center justify-center">
            <FormationPreview formation={selectedFormation} />
          </span>
        </VariantSelector>
      </div>
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
    <Card
      aria-labelledby="target-summary-title"
      className="mx-auto w-full max-w-4xl border-l-4 border-l-red [--card-spacing:--spacing(5)]"
    >
      <CardHeader className="gap-2">
        <p className="text-xs font-medium text-red">ทีมเป้าหมาย</p>
        <CardTitle
          id="target-summary-title"
          className="text-2xl font-semibold tracking-tight"
        >
          {team.title}
        </CardTitle>
        <div className="flex flex-wrap gap-1.5">
          <TeamTypeBadge team={team} />
          {team.tags?.map((tag) => (
            <Badge key={tag} className="rounded-md" variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <CardDescription className="leading-relaxed">
          {team.condition}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TargetVariantDock
          team={team}
          variants={variants}
          selectedSpeed={selectedSpeed}
          selectedFormation={selectedFormation}
          selectedPetPackage={selectedPetPackage}
          onSpeedChange={setSelectedSpeed}
          onFormationChange={setSelectedFormation}
          onPetPackageChange={setSelectedPetPackage}
        />
      </CardContent>
    </Card>
  );
}
