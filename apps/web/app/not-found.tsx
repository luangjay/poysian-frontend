import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@workspace/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";

/**
 * `/design` calls `notFound()` for an unknown target or counter, which until
 * now fell through to the framework default. The mark comes from `public/`
 * rather than the asset server: a 404 has to render even when that is down.
 */
export default function NotFound() {
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
          <EmptyTitle>ไม่พบหน้านี้</EmptyTitle>
          <EmptyDescription>
            ลิงก์อาจหมดอายุ หรือทีมนี้ถูกลบไปแล้ว
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/design"
          >
            กลับไปดูทีมเป้าหมาย
          </Link>
        </EmptyContent>
      </Empty>
    </main>
  );
}
