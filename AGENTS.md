# Canonical Agent Instructions

`AGENTS.md` is the canonical instruction file for AI coding agents working in this repository. Keep other agent-specific instruction files as short pointers to this file.

## Project Summary

10esperado is a web platform for creating, organizing, sharing, and taking study quizzes.

## Documentation Map

- [Architecture](docs/architecture.md): accepted technical decisions.
- [Requirements sources](docs/requirements.md): specifications, visual references, and release scope in Jira and Confluence.

## Language

- Write source code, identifiers, filenames, comments, commit messages, the README, and agent documentation in English.
- Write user-facing interface text in Portuguese.

## Build and Validation Gates

Read `package.json` for available scripts and dependency versions.

| Command            | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Start the development server.                       |
| `npm run dev:host` | Expose the development server on the local network. |
| `npm run build`    | Check TypeScript and produce the production build.  |
| `npm run preview`  | Serve the production build locally.                 |
| `npm run lint`     | Check code with oxlint.                             |
| `npm run format`   | Format files with Prettier.                         |
| `npm run test`     | Run the automated test suite with Vitest.           |
| `npm run check`    | Run the complete validation gate.                   |

During development, run focused tests and checks for the affected code. Run the validation gate below before handing off the final change.

Before reporting a code change as ready, run:

```bash
npm run check
```

Do not rerun individual checks already covered by this gate.

If configuration, dependencies, or implementation prevent a required check, report the exact blocker. Do not disable checks, skip failing tests, or loosen configuration to make a change pass. Distinguish failures introduced by the change from pre-existing failures.

## Testing Rules

- Write tests only when they protect meaningful behavior, published content, links, or project-specific business rules.
- Do not add tests only to increase coverage numbers or assert implementation details.
- Keep tests scoped to the component responsibility:
  - Orchestrator components may mock child components and assert composition decisions.
  - Component tests should assert only the content and behavior owned by that component.
  - Content regression tests may render real component trees and use real data when the goal is to protect published content.
- Use the shared `renderWithRouter` helper from `src/test/render.tsx` when component tests need router context. Keep router mocks local to tests that isolate routing dependencies. See [Testing](docs/architecture.md#testing) for the scope of the shared test environment.
- Translation text assertions should usually target the i18n key rendered by the test mock, not the final translated copy. The goal is to verify that the correct translation key is wired into the UI.
- Use explicit fixtures for fake data. Do not mix real production content into fake fixtures unless the test is intentionally validating real content.
- Prefer clear inline assertions. Create local helpers only when they remove meaningful duplication and make the test easier to read.
- Helper names must describe exactly what is being asserted. Avoid vague names such as `expectContent` or helpers that hide the main behavior under test.
- Do not turn secondary implementation details, decorative styling, aria labels, or non-essential copy into unnecessary test contracts.

## Repository Organization

- Page content entry points belong in `src/pages/`.
- Reserve `src/components/` for reusable components shared across the application.
- Keep page-specific components close to their owning page or component, including nested subdirectories when appropriate. Do not place local components in `src/components/`.

## TypeScript and React Rules

- Preserve the strictness of the active TypeScript configuration. Do not introduce `any` without a concrete untyped boundary and a locally documented reason.
- Keep runtime imports and type-only imports distinct.
- Declare default-exported React components with `export default function ComponentName()` instead of a separate trailing export.
- Prefer small React components with explicit props types.
- Extract child components or helpers when branching obscures the JSX structure.
- Do not leave unused code, dead exports, or commented-out implementations.

## Import Rules

- The `@/*` alias maps to `src/*`.
- Use local relative imports for files in the same directory or tightly coupled nearby files.
- Use the `@/` alias when it makes cross-directory imports clearer.
- Do not rewrite imports solely for style churn.

## Linting and Formatting Rules

- Follow `.oxlintrc.json` for lint rules and `.prettierrc` for formatting.
- Keep code-quality rules in oxlint and formatting concerns in Prettier.
- In multiline JSX, separate adjacent sibling elements and expression blocks at the same indentation level with a blank line.
- Use `npm run lint -- --fix` for lint fixes and `npx prettier --check .` for read-only formatting validation; no separate scripts are needed.

## Styling Rules

- Use Tailwind CSS v4 for styling.
- Import every Lucide icon with an `Icon` suffix alias, for example `import { Menu as MenuIcon } from 'lucide-react'`.
- Import every React Simple Icons brand icon with an `Icon` suffix alias, for example `import { SiGithub as GitHubIcon } from '@icons-pack/react-simple-icons'`.
- Global CSS lives in `src/styles/globals.css`.
- Use `src/utils/cn.ts` to compose conditional Tailwind classes and resolve conflicting utilities.
- Keep global CSS limited to Tailwind imports, base element defaults, and truly global browser normalization. Do not duplicate resets already provided by Tailwind's Preflight.
- Place global element styles in `@layer base` and custom design tokens in `@theme`.
- Keep CSS declarations alphabetized inside each rule unless cascade, browser compatibility, or readability requires a different order.
- Keep Tailwind utility classes roughly alphabetized when practical, without sacrificing responsive/state grouping or readability.
- Break long `className` values across lines when they exceed the configured Prettier print width.
- Use Tailwind's `motion-safe:` variant for non-essential CSS movement such as transforms and animations; keep non-motion transitions, such as color changes, outside it.
- Do not add theme tokens, fonts, color palettes, or design-specific values until those decisions are explicitly accepted.
- Do not create component CSS files unless Tailwind utilities are insufficient for a concrete implementation.

## Workflow Rules

- Read the task's specification and inspect the affected files before editing.
- Keep changes scoped to the requested task and its acceptance criteria.
- Do not perform adjacent feature work or opportunistic refactors.
- Do not revert user changes without an explicit request.
- Do not create Git commits.
- Do not rename files, move code, or reorganize directories unless the task requires it.
- Do not mix formatting-only changes into unrelated feature work.
- Prefer direct implementations. Add shared abstractions when repeated use demonstrates a need for them.

## Decision and Dependency Policy

The stack in [Architecture](docs/architecture.md) is accepted. Undocumented product behavior, design choices, routing, storage formats, and tooling choices remain undecided. Ask before establishing a project decision in any undecided area.

Before adding a dependency, verify that:

- It addresses a requirement in the current task.
- The existing stack cannot address that requirement cleanly.
- The package is maintained and its browser runtime and bundle costs are appropriate.

Ask before introducing dependencies that establish a new project direction, such as a router, UI kit, animation system, or replacement state management library.

## Documentation Rules

- Document commands, constraints, invariants, and non-obvious technical decisions.
- For non-obvious architecture decisions, record the rationale and relevant tradeoffs in the architecture document.
- Keep standing agent instructions in this file and detailed architecture in the linked documentation.
- Keep repository documentation aligned with the implemented state and accepted decisions. Do not describe planned files or commands as available.

## Maintenance Rules

- Update affected documentation in the same change as modifications to scripts, tooling, architecture, supported runtimes, or development workflow.
- Do not version-bump, tag releases, publish, or deploy unless explicitly requested.
- Do not commit credentials, tokens, or other secrets.

## Review Expectations

- Prioritize correctness, regressions, acceptance criteria, accessibility, and missing validation.
- Report actionable findings with file and line references. Distinguish defects from recommendations.
- Report validation results and unresolved blockers. Do not mark a change ready while required gates fail unless the failure is unrelated and explicitly documented.
