"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExportIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/toast";
import { cn } from "@workspace/ui/lib/utils";

/**
 * Glass recipe from the PP keypad: a translucent fill lifted by one soft
 * downward shadow — no stroke. Figma states `0 4px 16px rgba(0,0,0,0.05)` over
 * white; derived from --foreground here so it holds in both themes.
 */
function glassShadow(detached: boolean): CSSProperties {
  // Declared in both states — going to or from `none` would snap instead of fade.
  return {
    boxShadow: detached
      ? "0 4px 16px 0 color-mix(in oklab, var(--foreground) 10%, transparent)"
      : "0 4px 16px 0 transparent",
  };
}

/**
 * The guild mascot, duotoned onto the primary ramp. It is taller than the
 * capsule on purpose: overhanging a 40px pill lets the mark read large while
 * the bar keeps a 12px inset, which is the rhythm the page body uses.
 */
export function BrandMark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      alt=""
      className={cn("w-auto shrink-0 select-none", className)}
      height={512}
      priority={priority}
      src="/brand/poysian-mark.png"
      width={512}
    />
  );
}

/** Dark mode was reachable only by the hidden "d" hotkey until now. Both icons
 *  render and CSS picks one, so there is no hydration guard to get wrong. */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      aria-label="สลับธีม"
      className="size-10 rounded-full [&_svg:not([class*='size-'])]:size-5"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      size="icon"
      title="สลับธีม (D)"
      variant="outline"
    >
      <MoonIcon aria-hidden="true" className="dark:hidden" />
      <SunIcon aria-hidden="true" className="hidden dark:block" />
    </Button>
  );
}

export function SiteHeader({
  guildName,
  onJumpToSearch,
  shareTitle,
}: {
  guildName: string;
  /** Only the discovery view has a search field to jump to. */
  onJumpToSearch?: () => void;
  /** Names the thing being shared, so the link previews as that team. */
  shareTitle: string;
}) {
  const [detached, setDetached] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const header = headerRef.current;

    if (!sentinel || !header) {
      return;
    }

    // The island has to arrive as the first content reaches the bar, not once
    // the bar has scrolled away. Waiting for the bar left a window where the
    // resting backdrop — the page's own colour — was clipping artwork with no
    // surface to explain the cut.
    //
    // That moment is the gap between the bar and the content below it, which
    // is the top padding of whatever follows the header in flow. Growing the
    // root by exactly that keeps the sentinel counted as visible until the
    // content is about to slide under.
    const content = header.nextElementSibling;
    const gap = content
      ? parseFloat(getComputedStyle(content).paddingTop)
      : header.offsetHeight;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry) {
          setDetached(!entry.isIntersecting);
        }
      },
      { rootMargin: `${gap}px 0px 0px 0px` }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  /**
   * Everything here is public, so there is no access to grant — sharing is
   * just handing over the URL. The share sheet is the honest form of that on
   * mobile, where the guild actually passes links around; elsewhere it falls
   * back to the clipboard.
   */
  async function share() {
    const url = window.location.href;
    const payload = { title: shareTitle, url };

    if (
      typeof navigator.share === "function" &&
      (typeof navigator.canShare !== "function" || navigator.canShare(payload))
    ) {
      // A dismissed sheet rejects; that is a choice, not a failure to report.
      await navigator.share(payload).catch(() => {});
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.add({ title: "คัดลอกลิงก์แล้ว", type: "success" });
    } catch {
      toast.add({ title: "คัดลอกลิงก์ไม่สำเร็จ", type: "error" });
    }
  }

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      {/* Height stays at the bar height in both states; the detached island
          overhangs it as an overlay, so nothing below ever shifts. */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 h-(--design-header-content-height)"
      >
        <div
          className={cn(
            "relative container transition-[padding-top] motion-safe:duration-200 motion-reduce:transition-none",
            detached ? "pt-3 sm:pt-5" : "pt-0"
          )}
        >
          <div
            style={glassShadow(detached)}
            className={cn(
              // The radius and the backdrop filter are always applied so the
              // island can fade in rather than pop: a filter that starts at
              // `none`, or a radius that appears with the background, snaps.
              "flex h-(--design-header-content-height) items-center justify-between gap-3 rounded-full transition-[background-color,padding,box-shadow,backdrop-filter] motion-safe:duration-200 motion-reduce:transition-none",
              detached
                ? "border bg-background/20 px-3 backdrop-blur-sm backdrop-saturate-150"
                : "bg-transparent px-0 backdrop-blur-none backdrop-saturate-100"
            )}
          >
            {/* The guild is a label, not navigation, so it sits outside the
                brand link — inside it the name inherits the button's
                font-medium and becomes clickable. Grouped left so the row's
                justify-between still reads as brand vs actions. */}
            <div className="flex min-w-0 items-center gap-2.5">
              <Link
                href="/design"
                aria-label="Poysian"
                className={cn(
                  // The variant carries the capsule, rather than the capsule
                  // being painted out by overrides: `outline` sets its dark
                  // fill through `dark:bg-input/30`, whose `:is(.dark *)`
                  // selector outranks a plain `bg-transparent`, so overriding
                  // the colours left the capsule standing in dark mode only.
                  buttonVariants({ variant: detached ? "ghost" : "outline" }),
                  // Same box in both states; swapping layout classes on detach
                  // moved the mascot and the wordmark instead of fading.
                  "h-10 min-w-0 shrink-0 gap-1 rounded-full pr-4 pl-1.5 transition-[background-color,border-color] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:duration-200 motion-reduce:transition-none"
                )}
              >
                <BrandMark priority className="h-12" />
                <span className="truncate text-base leading-5 font-semibold tracking-tight">
                  Poysian
                </span>
              </Link>
              <p className="hidden min-w-0 items-center gap-2 text-sm font-normal text-muted-foreground sm:flex">
                <span
                  aria-hidden="true"
                  className="leading-none text-muted-foreground/50"
                >
                  /
                </span>
                <span className="truncate text-sm leading-5 tracking-tight">
                  {guildName}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {onJumpToSearch ? (
                <Button
                  aria-label="ค้นหาทีม"
                  className="size-10 rounded-full [&_svg:not([class*='size-'])]:size-5"
                  onClick={onJumpToSearch}
                  size="icon"
                  title="ค้นหาทีม"
                  variant="outline"
                >
                  <MagnifyingGlassIcon aria-hidden="true" />
                </Button>
              ) : null}
              <ThemeToggle />
              <Button
                aria-label="แชร์กิลด์"
                className="h-10 rounded-full px-4 [&_svg:not([class*='size-'])]:size-5"
                onClick={() => {
                  void share();
                }}
                variant="outline"
              >
                <ExportIcon data-icon="inline-start" />
                แชร์
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
