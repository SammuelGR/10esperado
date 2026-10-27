# Canonical Agent Instructions

`AGENTS.md` is the canonical instruction file for AI coding agents working in this repository. Keep other agent-specific instruction files as short pointers to this file.

## Project Summary

10esperado is a web platform for creating, organizing, sharing, and taking study quizzes.

## Documentation Map

- [Architecture](docs/architecture.md): accepted technical decisions.
- [Requirements sources](docs/requirements.md): specifications and release scope in Jira and Confluence.

## Language

- Write source code, identifiers, filenames, comments, commit messages, the README, and agent documentation in English.
- Write user-facing interface text in Portuguese.

## Build and Validation Gates

Application tooling is not configured yet. Once it exists, read `package.json` for available scripts and dependency versions; record the validation commands in this section.

During development, run focused tests and checks for the affected code. Run the complete gates below before handing off the final change.

Before reporting a code change as ready:

1. Run the configured TypeScript validation.
2. Run the configured automated test suite.
3. Run the production build.
4. Run the configured lint and formatting checks.

Use an aggregate validation script when it covers these gates. Do not rerun a gate separately if the aggregate already runs it.

If configuration, dependencies, or implementation prevent a required check, report the exact blocker. Do not disable checks, skip failing tests, or loosen configuration to make a change pass. Distinguish failures introduced by the change from pre-existing failures.

## Testing Rules

- Cover business rules in service tests and user interactions in interface tests. Base coverage on the task's acceptance criteria.
- Include rejected operations and verify that they preserve existing data when required by the specification.
- Isolate persisted data between tests so results do not depend on execution order.
- Test observable behavior rather than component internals, decorative styling, or arbitrary coverage targets.
- Mock at the boundary relevant to the test. Do not mock away the business rule or persistence behavior that the test is intended to validate.
- Keep component assertions scoped to behavior owned by that component. Use integration tests when the contract spans several components or services.
- Use explicit test fixtures. Extract assertion helpers only when they remove meaningful duplication without hiding the behavior under test.

## TypeScript and React Rules

- Preserve the strictness of the active TypeScript configuration. Do not introduce `any` without a concrete untyped boundary and a locally documented reason.
- Keep runtime imports and type-only imports distinct.
- Define component props explicitly. Extract child components or helpers when branching obscures the JSX structure.
- Do not leave unused code, dead exports, or commented-out implementations.

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
