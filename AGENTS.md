<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Repository map

```text
.
├── .agents/skills/              # Task-specific agent instructions
├── apps/web/                    # Deployable Next.js App Router app
│   ├── app/                     # Routes and layouts
│   ├── components/              # App-only components and providers
│   └── components.json          # shadcn entry point
├── packages/
│   ├── eslint-config/           # Compiled shared flat configs
│   ├── typescript-config/       # Shared tsconfig presets
│   └── ui/                      # Design system source package (based on shadcn)
│       ├── src/components/
│       ├── src/lib/
│       ├── src/styles/
│       └── components.json
├── skills-lock.json             # Installed skill sources and hashes
├── pnpm-workspace.yaml          # Workspace and build-script policy
└── turbo.json                   # Task graph
```

`apps/web/app`: official Next.js App Router.

`apps/*` + `packages/*`: repository Turborepo convention.

Relevant task: read matching `.agents/skills/*/SKILL.md`.

# Package roles

- `apps/web`: Next.js application code and app-local `@/*` imports.
- `packages/ui`: shadcn design system—components, UI utilities, and styles—exposed
  through `@workspace/ui/*` package exports.
- `packages/ui` exports TypeScript source; `apps/web` transpiles it.
- `packages/eslint-config` compiles TypeScript source to `dist` during install/build.

# Common tasks

```bash
pnpm dev
pnpm format
pnpm lint
pnpm typecheck
pnpm build
```

Add shadcn component:

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

Repository checks: format, lint, typecheck, build, `git diff --check`.

Generated paths: `node_modules`, `.next`, `.turbo`, `dist`, `next-env.d.ts`.
