# Store 369

A private, Bun-managed JavaScript/TypeScript monorepo for the Store 369 web and API applications, with shared packages and database tooling.

## Workspace layout

The root workspace is configured for:

- `apps/*` — application workspaces, including the web and API apps
- `packages/*` — shared workspace packages

## Requirements

- [Bun](https://bun.sh/) installed
- Node.js-compatible development environment
- Environment values configured for the app you intend to run

## Install dependencies

```bash
bun install
```

## Development

Run the API and web applications in separate terminals:

```bash
bun run dev:api
bun run dev:web
```

## Quality checks and production build

```bash
bun run typecheck
bun run test
bun run build
```

The production build runs type checks before building the API and web workspaces.

## Database workflow

The root scripts expose the following Drizzle-based workflow:

```bash
bun run db:generate
bun run db:migrate
bun run db:seed
```

Review the database configuration and migration files before running these commands against a non-development database.

## Environment configuration

Use the committed example files as a starting point:

- `.env.example`
- `.env.production.example`

Create local environment files from the examples and supply real credentials through your deployment platform's secret manager. Never commit production secrets, API keys, or database credentials.

## Notes

This repository is marked private in its package manifest. Keep it private unless its code, configuration, dependencies, and operational assumptions have been reviewed for public release.
