"use client";

import { useState, type ReactNode } from "react";
import { cva } from "class-variance-authority";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";

/**
 * One cell of a lineup's variant strip, and what it has to say for itself.
 *
 * Hover reveals on a pointer, tap opens a dialog on touch — the same surface
 * either way, so the target page's pickers and the counter page's read-only
 * detail behave identically and the cells are learnable in one place.
 *
 * `content` takes a node or a function of `close`. A picker needs the close so
 * a choice can dismiss the surface; a read-only cell has nothing to dismiss,
 * and a node is what a server component can pass across the boundary at all.
 *
 * Neither surface states a width it does not need. DialogContent already
 * ships `w-full` and a 24rem cap, and the only thing added back is the `min()`
 * that makes that cap apply below sm too: upstream lifts it there so a dialog
 * can act like a sheet, but a strip of options has one right width and a
 * 607px one at 639px only spreads three words across a screen.
 *
 * `dialogContent` exists because the two surfaces are not the same size: the
 * hover card is a fixed 16rem beside the cell, the dialog is most of a phone.
 * A cell that wants to spend that room differently says so; one that does not
 * says nothing and gets the same content in both.
 *
 * A cell whose surface has to be wider says which size it is, rather than
 * being handed a class to paste onto the card: the width is a property of the
 * popover, not a detail of the caller's markup, and a prop that forwards a
 * className lets a caller reach past the component into a part of it.

 */
/** `wide` is for a cell whose surface is a gallery rather than a few options —
 *  the pet packages need a third one visible to read as a list. */
const hoverCardVariants = cva(
  "hidden flex-col gap-2.5 p-3 [--popup-pad:0.75rem] [--popup-radius:var(--radius-lg)] sm:flex",
  {
    variants: {
      size: { default: "", wide: "w-96" },
    },
    defaultVariants: { size: "default" },
  }
);

export function VariantPopover({
  align = "center",
  children,
  content,
  dialogContent,
  size,
  title,
  triggerLabel,
}: {
  align?: "start" | "end" | "center";
  children: ReactNode;
  content: ReactNode | ((close: () => void) => ReactNode);
  dialogContent?: ReactNode | ((close: () => void) => ReactNode);
  size?: "default" | "wide";
  title: string;
  triggerLabel: string;
}) {
  const [hoverCardOpen, setHoverCardOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const render = (
    source: ReactNode | ((close: () => void) => ReactNode),
    close: () => void
  ) => (typeof source === "function" ? source(close) : source);

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
              aria-label={triggerLabel}
              render={
                <Button
                  // The cell inside owns every state and, now that it is a
                  // fixed square, its size too — `h-full` here resolved
                  // against the stack's full height and gave each trigger the
                  // whole column. `h-auto` undoes the size variant's h-8.
                  className="group h-auto w-auto rounded-lg p-0 hover:bg-transparent focus-visible:border-transparent focus-visible:ring-0"
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
          className={hoverCardVariants({ size })}
          side="top"
        >
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          {render(content, () => setHoverCardOpen(false))}
        </HoverCardContent>
      </HoverCard>
      <DialogContent className="max-w-[min(100%-2rem,24rem)] gap-3 [--popup-pad:1rem] [--popup-radius:var(--radius-xl)]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {render(dialogContent ?? content, () => setDialogOpen(false))}
      </DialogContent>
    </Dialog>
  );
}
