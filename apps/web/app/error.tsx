"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";

/**
 * There was no error boundary at all, so any render throw fell through to the
 * framework's own screen. `reset()` re-renders the segment, which is worth
 * offering because the data here is local — a retry can genuinely succeed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-svh place-items-center bg-muted/40 p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Image
              alt=""
              aria-hidden="true"
              className="size-28 select-none"
              height={512}
              src="/brand/poysian-mark.png"
              width={512}
            />
          </EmptyMedia>
          <EmptyTitle>เกิดข้อผิดพลาด</EmptyTitle>
          <EmptyDescription>
            ลองโหลดหน้านี้อีกครั้ง ถ้ายังไม่ได้ให้แจ้งในกิลด์
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={reset}>
            ลองอีกครั้ง
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
