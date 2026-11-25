# 369 Store (`website`)

> 🚧 **Early work in progress** — the shared TypeScript package for a planned Persian e-commerce site. The API and web apps are not in this repository yet.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Bun workspaces](https://img.shields.io/badge/Bun-workspaces-000000?logo=bun&logoColor=white)
![Status](https://img.shields.io/badge/status-early%20WIP-orange)

## Overview

This repository is the start of a monorepo (`store-369`) for an Iran-focused online store. Right now it contains the workspace configuration, environment templates, and a shared library with money, validation and Persian-calendar helpers.

The root `package.json` already references `apps/api` and `apps/web` (dev, build, migrate and seed scripts), but **those apps have not been committed**, so the scripts will not run yet. `packages/shared/src/index.ts` also re-exports `./slugs` and `./order-status`, which are not in the repository yet.

## What's here

**`packages/shared`** (`@store369/shared`):

- **Money** (`money.ts`) — amounts stored as integer **Rial**, explicit Rial ⇄ Toman conversion, thousands grouping, Persian-digit formatting, and Zod schemas
- **Validators** (`validators.ts`) — Iranian mobile numbers (`09…`, `+98…`), 10-digit postal codes, landline numbers, with normalizers and Zod schemas
- **Jalali calendar** (`jalali.ts`) — a TypeScript port of the `jalaali-js` algorithm (MIT, by Behrang Norouzi) for Gregorian ⇄ Jalali conversion

**Configuration templates** — `.env.example` and `.env.production.example` describe the intended setup: PostgreSQL, session cookies, admin bootstrap, uploads, a payment gateway that stays **disabled** until real merchant credentials exist, and Toman/Rial display currency.

## Tech Stack (planned, per config)

- TypeScript 5 · Bun workspaces
- Zod (validation)
- Drizzle Kit + PostgreSQL (referenced in scripts and env)
- Vitest (test runner)

## Getting Started

Only the shared package can be type-checked today:

```bash
git clone https://github.com/aghorbani84/website.git
cd website
bun install
bun run --cwd packages/shared typecheck
```

> The type check is expected to report the two missing modules above until they are added.

## Project Structure

```text
website/
├── package.json             # Bun workspaces: apps/*, packages/*
├── tsconfig.base.json
├── .env.example
├── .env.production.example
└── packages/
    └── shared/
        └── src/
            ├── index.ts
            ├── money.ts
            ├── validators.ts
            └── jalali.ts
```

## License

No license file has been added yet, so all rights are reserved by default.

## Author

Built by [@aghorbani84](https://github.com/aghorbani84).
