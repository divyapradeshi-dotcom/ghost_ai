# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Project APIs complete

## Current Goal

- Move to the next feature spec.

## Completed

- Design system foundation from `context/feature-specs/01-design-system.md`.
- Installed and configured shadcn/ui with Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea.
- Installed lucide-react and added shared `cn()` helper in `lib/utils.ts`.
- Mapped Ghost AI dark theme tokens in `app/globals.css` and enabled dark mode at the root layout.
- Editor chrome from `context/feature-specs/02-editor.md`.
- Added reusable editor navbar, floating project sidebar, and dialog content pattern.
- Installed the local `clerk-nextjs-patterns` skill under `.agents/skills` for Clerk + Next.js auth guidance.
- Clerk authentication wiring from `context/feature-specs/03-auth.md`.
- Added Clerk provider theming, sign-in and sign-up pages, protected `proxy.ts`, root auth redirect, and editor user menu.
- Refined the Clerk auth screen to match the screenshot direction with a 50/50 desktop split, tinted brand panel, compact feature rows, and Geist-based typography.
- Project dialogs and sidebar actions from `context/feature-specs/04-project-dialogs.md`.
- Added the editor home screen, project dialog state hook/provider, create/rename/delete dialogs, mock project sidebar actions, and mobile sidebar scrim.
- Prisma foundation from `context/feature-specs/05-prisma.md`.
- Added `Project` and `ProjectCollaborator` Prisma models, project status enum, required indexes, collaborator uniqueness, and cascade delete relation.
- Added cached Prisma client singleton in `lib/prisma.ts` with Accelerate URL support and direct PostgreSQL adapter fallback.
- Created and applied migration `20260601082548_init_project_models`, then regenerated the Prisma client.
- Project API routes from `context/feature-specs/06-project-apis.md`.
- Added backend-only project list, create, rename, and delete route handlers with Clerk authentication and Prisma owner checks.
- Added `401` responses for unauthenticated project API requests and `403` responses for non-owner rename/delete attempts.
- Updated `proxy.ts` so unauthenticated API requests return JSON `401` while protected page routes keep sign-in redirects.

- Wired the editor layout to server-side project fetching using `getEditorProjects`.
- Implemented project rename API handler (`PATCH /api/projects/[projectId]`) with owner checks and updated the `use-project-actions` hook to call the correct endpoint.
- Verified create dialog generates room ID preview and navigates to the new workspace on successful creation.
- Hardened editor project loading and shared project-access lookup so Prisma connection failures return empty/null fallbacks instead of crashing the editor route.
- Removed the redundant `getEditorProjects()` call from `app/editor/page.tsx`.
- Fixed the Liveblocks auth endpoint to return the SDK authorization body directly so `LiveblocksProvider` receives `{ token: "..." }`.
- Fixed a navbar share dialog type mismatch by only rendering `ShareDialog` when a project ID is available.

## In Progress

- None.

## Next Up

- Move to the next feature spec.

## Recent Work

- Fixed the editor route runtime failure by making the project list loader resilient to Prisma upstream connection errors and by guarding shared project access lookups.
- Verified the previous editor resilience change with targeted ESLint checks; the Liveblocks auth route type error has since been fixed.
- Fixed the Liveblocks authentication response shape in `POST /api/liveblocks-auth`; production build and full TypeScript now pass.
- Repo-wide `npm run lint` still fails on existing lint debt in collaborator routes, share dialog, and `liveblocks.config.ts` placeholder types.
- Implemented share dialog with collaborators API, owner/collaborator role management, invite/remove actions, and frontend UI.
- Enhanced Share dialog with improved visual design:
  - Prominent "Workspace Link" section with read-only URL input and copy button.
  - Dynamic copy button feedback ("✓ Copied") with status message.
  - Organized sections in visually distinct cards with proper typography and spacing.
  - Separate sections for Workspace Link, Owner info, Collaborators list, and Invite form (owner-only).
  - Color-coded status messages for invite/remove/copy actions (success/error states).
  - Improved placeholder text and labels for better UX.

- Liveblocks realtime collaboration setup (incomplete parts noted):
  - Added `liveblocks.config.ts` defining `Presence` and `UserMeta` types.
  - Added `lib/liveblocks.ts` helper that maps user IDs to deterministic cursor colors and talks to the Liveblocks REST API when `LIVEBLOCKS_SECRET` is configured.
  - Added server API `POST /api/liveblocks-auth` to mint Liveblocks room sessions for authenticated users with project access. The route:
    - requires Clerk `auth()` authentication,
    - verifies project access using `getProjectIfUserHasAccess`,
    - ensures the Liveblocks room exists, and
    - returns a session token and user metadata (`name`, `image`, `cursorColor`).
  - Remaining: ensure `LIVEBLOCKS_SECRET` is set in environment, and run `npm run build` locally to smoke-test Liveblocks integration.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Started `04-project-dialogs.md` implementation for the editor home, mock project actions, project dialogs, and mobile sidebar scrim.
- Completed `04-project-dialogs.md` implementation. Verified sidebar actions, create and rename form wiring, live slug preview, mobile scrim close behavior, lint, and TypeScript.
- Completed `05-prisma.md` implementation. Verified Prisma schema validation, TypeScript, lint, migration application, Prisma client generation, and production build.
- `npm run build` passes with a Next.js workspace-root warning caused by an additional parent lockfile at `C:\Users\divya\package-lock.json`.
- Completed `06-project-apis.md` implementation. Verified route presence for list/create/rename/delete, owner checks in rename/delete handlers, TypeScript, lint, and production build.
- `npm run build` still passes with the existing Next.js workspace-root warning caused by `C:\Users\divya\package-lock.json`.
- Re-verified after proxy API `401` handling with TypeScript, lint, and production build.
- Completed `01-design-system.md` implementation. Verified UI component imports with TypeScript, linted successfully, and checked `cn()` class merging.
- Started `02-editor.md` implementation.
- Completed `02-editor.md` implementation. Verified with lint, TypeScript, and production build.
- Wired the editor navbar and project sidebar into a reusable editor layout shell with local sidebar toggle state. Verified with lint and TypeScript.
- Added the `clerk-nextjs-patterns` skill from `clerk/skills`; `skills-lock.json` now records the installed skill source and hash.
- Started `03-auth.md` implementation for Clerk provider, auth pages, route protection, redirects, and editor user menu.
- Completed `03-auth.md` implementation. Installed `@clerk/ui`, wired Clerk's dark theme with app CSS variables, added auth routes and protected proxy, moved the editor shell to `/editor`, and verified with lint, TypeScript, and production build.
- Updated the auth page UI from screenshot feedback. Verified the refinement with lint, TypeScript, and production build.
  - Wired the editor layout to server-side projects and connected the `ProjectSidebar` to real data.
 - Added `PATCH /api/projects/[projectId]` to support renaming projects and fixed the client rename call in `hooks/use-project-actions.tsx`.
