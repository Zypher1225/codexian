# Codexian Agent Notes

## Project Overview

Codexian is an Obsidian desktop plugin that embeds local Codex CLI workflows in a sidebar and inline-edit flow. Codex is enabled by default and uses `codex app-server` over stdio JSON-RPC. The codebase keeps a provider-neutral architecture so provider implementations can coexist behind stable runtime and settings contracts.

## Architecture Status

- Product status: Codexian is Codex-first. The Codex provider supports send, stream, cancel, resume, history reload, fork, plan mode, image attachments, inline edit, `#` instruction mode, `$` skills, and subagents.
- App shell: `src/app/` owns shared settings defaults and plugin-level storage helpers. `src/core/` owns provider-neutral runtime, registry, tool, and type contracts.
- Provider boundary: `src/core/runtime/` and `src/core/providers/` define chat-facing contracts. `ProviderRegistry` creates runtimes and provider-owned auxiliary services. `ProviderWorkspaceRegistry` owns workspace services such as command catalogs, agent mention providers, CLI resolution, MCP managers, and provider settings tabs.
- Codex adaptor: `src/providers/codex/` owns the app-server runtime, JSON-RPC transport, prompt encoding, JSONL history reload, session tailing, settings reconciliation, skill cataloging, subagent storage, and Codex settings UI.
- Compatibility adaptor: `src/providers/claude/` remains available as an optional compatibility provider because parts of the inherited multi-provider architecture and test suite still cover it.
- Conversations: `Conversation` carries `providerId` and opaque `providerState`. Codex state stores `threadId`, `sessionFilePath`, and optional fork metadata.

## Commands

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run lint:fix
npm run test
npm run test:watch
npm run test:coverage
```

## Architecture

| Layer | Purpose | Details |
|-------|---------|---------|
| **app** | Shared defaults and plugin-level storage helpers | `defaultSettings`, `ClaudianSettingsStorage`, `SharedStorageService` |
| **core** | Provider-neutral contracts and infrastructure | `src/core/` |
| **providers/codex** | Codex app-server adaptor | JSON-RPC runtime, skills, subagents, history, settings |
| **providers/claude** | Optional compatibility adaptor | Preserved from the upstream architecture |
| **features/chat** | Main sidebar interface | Tabs, controllers, renderers, toolbar, status UI |
| **features/inline-edit** | Inline edit modal and provider-backed edit services | `InlineEditModal` plus provider-owned inline edit services |
| **features/settings** | Shared settings shell with provider tabs | General tab plus provider-owned settings renderers |
| **shared** | Reusable UI building blocks | Dropdowns, modals, mention UI, icons |
| **i18n** | Internationalization | Locale strings |
| **utils** | Cross-cutting utilities | env, path, markdown, diff, context, file-link, image, browser, canvas, session |
| **style** | Modular CSS | Compiled into `styles.css` |

## Tests

```bash
npm run test -- --selectProjects unit
npm run test -- --selectProjects integration
npm run test:coverage -- --selectProjects unit
```

Tests mirror the `src/` layout under `tests/unit/` and `tests/integration/`.

## Storage

| Path | Contents |
|------|----------|
| `.codexian/codexian-settings.json` | Shared app settings plus provider-specific configuration |
| `.codexian/sessions/*.meta.json` | Provider-neutral session metadata |
| `.codex/skills/*/SKILL.md` | Codex vault skills |
| `.agents/skills/*/SKILL.md` | Alternate Codex vault skill root |
| `.codex/agents/*.toml` | Codex vault subagent definitions |
| `~/.codex/sessions/**/*.jsonl` | Codex-native transcripts |
| `.claude/*` and `~/.claude/*` | Optional Claude compatibility provider data |

## Development Notes

- Provider-native first: prefer Codex app-server behavior over reimplementing provider features locally.
- Runtime exploration: inspect real `~/.codex/` session JSONL and app-server messages before changing event handling.
- Comments: comment why, not what. Avoid narration and redundant JSDoc.
- TDD workflow: for new behavior or bug fixes, write the failing test first in the mirrored `tests/` path, make it pass, then refactor.
- Run `npm run typecheck && npm run lint && npm run test && npm run build` after editing.
- No `console.*` in production code.
- Put non-committed notes, handoff files, and throwaway scripts in `.context/`.
