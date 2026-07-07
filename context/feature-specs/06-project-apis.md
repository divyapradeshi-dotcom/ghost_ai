The database schema is ready. Build the backend project API routes only.

## Routes

Create REST endpoints for:

- `GET/api/projects` ,list current user's projects
- `POST/api/projects`, create project
-  `PATCH/api/project/[projectId]`,rename project
- `DELETE /api/projects/[projectId]` delete project

## Rules

Use the authenticated Clerk user ID as `owerId`,

When creating:

- default missing project name to `Untiled Project`
- use the schema's existing ID strategy , do not add sequential IDs

Security:
- unauthenticated requests return `401`
- only the project owner can rename or delete
- non-owner mutation return `403`

Keep this backend-only. Do not wire the UI yet.

## check When Done
- route exist for list/create/rename/delete
- owner checks are enforced for rename/delete
- `401`and `403`responses are handled correctly
-  `npm run build` passes