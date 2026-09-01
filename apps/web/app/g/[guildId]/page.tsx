import { AppHeader } from "@/components/app-header";
import { TargetBrowser } from "./_components/guild-feed";
import { getGuildTargets } from "./_data/guild-feed";

export default async function GuildHomePage({
  params,
}: PageProps<"/g/[guildId]">) {
  const { guildId } = await params;
  const { guild, targets } = getGuildTargets(guildId);

  return (
    <main className="min-h-svh">
      <AppHeader>
        <AppHeader.GuildName>{guild.name}</AppHeader.GuildName>
        <AppHeader.Actions>
          <AppHeader.ThemeButton />
          <AppHeader.EditButton />
        </AppHeader.Actions>
      </AppHeader>

      <TargetBrowser guildId={guild.slug} targets={targets} />
    </main>
  );
}
