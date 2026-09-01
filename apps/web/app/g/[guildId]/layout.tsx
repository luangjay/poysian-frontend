import { type ReactNode } from "react";

export default function GuildLayout({
  children,
  dialog,
}: {
  children: ReactNode;
  dialog: ReactNode;
}) {
  return (
    <>
      {children}
      {dialog}
    </>
  );
}
