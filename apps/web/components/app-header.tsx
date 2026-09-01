import { type ReactNode } from "react";
import Link from "next/link";
import {
  FlowerIcon,
  MoonIcon,
  NotePencilIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@workspace/ui/components/button";

type AppHeaderComponent = {
  ({ children }: { children?: ReactNode }): ReactNode;
  GuildName: typeof GuildName;
  Actions: typeof Actions;
  ThemeButton: typeof ThemeButton;
  EditButton: typeof EditButton;
};

const AppHeader = ({ children }: { children?: ReactNode }) => {
  return (
    <header className="border-b">
      <div className="container flex items-center gap-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-semibold"
        >
          <FlowerIcon aria-hidden="true" />
          Poysian
        </Link>
        {children}
      </div>
    </header>
  );
};

function GuildName({ children }: { children: ReactNode }) {
  return (
    <span className="mr-auto text-base text-muted-foreground">{children}</span>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-1">{children}</div>;
}

function ThemeButton() {
  return (
    <Button size="icon" variant="ghost" aria-label="เปลี่ยนธีม">
      <MoonIcon data-icon="inline-start" />
    </Button>
  );
}

function EditButton() {
  return (
    <Button size="icon" variant="ghost" aria-label="แก้ไขกิลด์">
      <NotePencilIcon data-icon="inline-start" />
    </Button>
  );
}

const ComposedAppHeader = Object.assign(AppHeader, {
  GuildName,
  Actions,
  ThemeButton,
  EditButton,
}) as AppHeaderComponent;

export { ComposedAppHeader as AppHeader };
