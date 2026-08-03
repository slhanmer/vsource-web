# Aptium Portal — Claude Code Context

## Project

Medical-grade client portal. Next.js / React / TypeScript frontend.
Connects to a TGA-regulated Class A medical imaging device management suite.
Take extra care — this is a regulated product.

## Stack

- Next.js, React, TypeScript
- Custom ui-kit (React component wrappers) — lives at `src/components/ui-kit`
- Jest + React Testing Library for tests
- SCSS for styling (plain, not CSS modules)
- pnpm as package manager
- `src/types/scss.d.ts` — required for SCSS module type resolution

## Branch conventions

- Never commit directly to `development`, `staging`, or `production`
- Always work on a feature branch: `simon/APT-XX-description`
- Never push to remote — Simon reviews and pushes manually

## What you can do freely

- Read any file
- Edit component and page files
- Edit feature files (except locked ones below)
- Write and run tests
- Run `pnpm` commands (install, test, build, lint)

## What requires explicit approval

- Any git operation (stage, commit, push)
- Any change to files in `src/components/ui-kit/`
- Any change to files in `src/components/security/`
- Any change to files in `src/providers/`
- Any change to files in `src/hooks/`
- Any change to files in `src/services/`
- Any change to files in `src/features/login/`
- Any change to files in `src/features/register/`
- Any change to files in `src/features/admin/`
- Any change to files in `src/features/tenant/`
- Any change to files in `src/styles/`
- Environment or config files

## Never touch

- `.env`, `.env.local`, `.env.*`
- `.github/workflows/`
- `next.config.js` / `next.config.ts` unless explicitly asked

## Project Structure & Conventions

### Features

Each feature lives in `src/features/[feature-name]/` and follows this structure:

- `[FeatureName].tsx` — main feature component(s) at the root level
- `components/` — sub-components specific to this feature
- `styles/` — scoped SCSS files, one per component (e.g. `ComponentName.scss`)
- `utils/` — feature-specific utility functions

### Naming conventions

- Components: PascalCase (e.g. `AssessmentViewer.tsx`)
- SCSS files: camelCase matching component name (e.g. `assessmentViewer.scss`)
- Utilities: camelCase
- No barrel files except `index.ts` at feature root for public exports

## Styles & Theming

### Token system (multi-tenancy)

- All SCSS variables are defined in `src/styles/_tokens.scss`
- Tokens are globally available in all SCSS files — never import them manually
- Always use tokens instead of hardcoded values (colours, spacing, shadows, fonts etc)
- Tenant-driven tokens (e.g. `$action-primary`, `$text-secondary`) are injected at runtime via CSS variables
- Never hardcode hex values or spacing — always reach for a token first

### Global styles

- `src/styles/global.scss` — base styles only, do not add feature styles here
- SCSS is plain (not CSS modules) — use descriptive class names scoped by component context

## Types

- Shared types live in `src/types/` — one file per domain (e.g. `assessmentTypes.ts`)
- Always check `src/types/` before creating new types
- Feature-specific types can be co-located if truly isolated

## Utilities

- Shared utilities live in `src/utils/`
- Always check here before writing new utility functions

## JSDoc

All exports in the following directories must have `/** */` JSDoc blocks:

- `src/components/ui-kit/` — props types/interfaces and component exports
- `src/hooks/` — hook function signatures and return values
- `src/utils/` — all exported functions
- `src/types/` — all exported types and interfaces

**When adding or modifying any file in these directories**, write or update the JSDoc as part of the same change.

**At the start of each new session**, scan these directories for any exports that are missing JSDoc and add them before starting other work.
