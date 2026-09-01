"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { type CounterTeam } from "../_data/guild-feed";
import { CounterStrategyDetails } from "./counter-strategy-details";

export function CounterStrategyDialog({ counter }: { counter: CounterTeam }) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="max-h-[calc(100svh-2rem)] max-w-5xl overflow-y-auto p-0">
        <DialogHeader className="border-b p-5 pr-12">
          <DialogTitle>รายละเอียดทีมสู้</DialogTitle>
          <DialogDescription>{counter.label}</DialogDescription>
        </DialogHeader>
        <div className="p-5">
          <CounterStrategyDetails counter={counter} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
