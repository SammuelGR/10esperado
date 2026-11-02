# Architecture

## Stack

| Area                 | Decision                       |
| -------------------- | ------------------------------ |
| Application          | React + Vite + TypeScript      |
| Routing              | TanStack Router (file-based)   |
| State                | Context API and hooks          |
| Persistence          | `localStorage`                 |
| Styling              | Tailwind CSS v4                |
| Internationalization | i18next + react-i18next        |
| Automated testing    | Vitest + React Testing Library |
| Package manager      | npm                            |
| Linting              | oxlint                         |
| Formatting           | Prettier                       |
| Deployment           | Vercel                         |

## Application Boundaries

The project is frontend-only. No backend will be implemented.

## Validation, State, and Services

Zod schemas validate and normalize form input before application operations.

Use a context when multiple components or pages need to share and update the same state. Contexts coordinate operations, enforce business rules—including authentication and ownership checks—and update shared state after persistence succeeds. Services receive validated data and explicit identifiers, execute persistence operations, and return their results.

Queries derived from shared state should use that state rather than read storage again. Keep view-specific filters and selections local to their owning components.

## Persisted Dates

Persisted timestamps use ISO 8601 strings in UTC. Reading JSON from localStorage preserves this string representation; convert timestamps to Date objects when needed for date operations or display.

## Routing

Route modules in `src/routes/` define routing configuration and connect routes to page content in `src/pages/`, keeping routing concerns separate from page implementation.

Route groups follow the access convention: `_public/` for unauthenticated users only, `_private/` for authenticated users only, and `_shared/` for both. Group-wide access rules belong in each group's `route.tsx` and apply to its child routes. Group names do not appear in URLs.

## Internationalization

Translation resources are bundled JSON files in `src/locales/pt-BR/`, separated into module namespaces. The `common` namespace holds shared interface text.

## Testing

Shared test support belongs in `src/test/`. Global setup handles environment defaults and cleanup; reusable render helpers provide the contexts required by the component under test. Each render creates an independent environment to prevent state leaking between tests.

Component tests that need router context use `renderWithRouter` from `src/test/render.tsx`. It supplies an in-memory router without loading application routes, layouts, or access rules. This supports rendering real links and consuming router context while keeping assertions focused on the component's responsibility. Tests of navigation flows require explicit test routes; isolated tests of routing orchestration may mock router dependencies locally.

Business dependencies and scenario data remain explicit in each test. Shared setup should not supply authentication results or application behavior that could conceal missing test preparation.
