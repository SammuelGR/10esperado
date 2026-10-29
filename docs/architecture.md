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

## Routing

Route modules in `src/routes/` define routing configuration and connect routes to page content in `src/pages/`, keeping routing concerns separate from page implementation.

Route groups follow the access convention: `_public/` for unauthenticated users only, `_private/` for authenticated users only, and `_shared/` for both. Group-wide access rules belong in each group's `route.tsx` and apply to its child routes. Group names do not appear in URLs.

## Internationalization

Translation resources are bundled JSON files in `src/locales/pt-BR/`, separated into module namespaces. The `common` namespace holds shared interface text.
