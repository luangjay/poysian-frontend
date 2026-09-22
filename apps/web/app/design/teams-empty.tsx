import { type ReactNode } from "react";
import Image from "next/image";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { gameUiAssetBaseUrl } from "./lineup";

/**
 * Both lists on this route can come back empty, and they say so the same way:
 * the game's own idle illustration — someone waiting it out by a campfire.
 *
 * The recovery action is a child rather than a prop, because only one of the
 * two has one. A `showClearButton` would put the browse view's concern inside
 * a component the target view also uses.
 */
export function TeamsEmpty({
  children,
  description,
  title,
}: {
  children?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <Empty className="rounded-2xl border bg-card/50">
      <EmptyHeader>
        <EmptyMedia>
          <Image
            alt=""
            aria-hidden="true"
            className="size-28 select-none"
            height={256}
            sizes="112px"
            src={`${gameUiAssetBaseUrl}/Atl_UI-PopUP_01_Sprite_100.png`}
            width={256}
          />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  );
}
