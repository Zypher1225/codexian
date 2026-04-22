# Codexian

![GitHub stars](https://img.shields.io/github/stars/zypher1225/codexian?style=social)
![GitHub release](https://img.shields.io/github/v/release/zypher1225/codexian)
![License](https://img.shields.io/github/license/zypher1225/codexian)

![Preview](Preview.png)

Codexian embeds the local Codex CLI inside Obsidian. Your vault becomes Codex's working directory, so the agent can read notes, edit files, search the vault, run terminal commands, use skills and subagents, and carry multi-step coding or writing workflows without leaving Obsidian.

## Features & Usage

Open the Codexian chat sidebar from the ribbon icon or command palette. Select text and use the inline edit command to revise notes with a word-level diff preview. Chat sessions run through your local `codex` installation and use the same Codex configuration, credentials, MCP setup, and session storage you already use in the CLI.

**Local Codex CLI runtime** - Uses `codex app-server` over stdio JSON-RPC, with startup handshakes, streaming turn events, approval gates, and resumable sessions.

**Vault-native agent workspace** - The active vault is the working directory for Codex, so file read/write, search, bash, and multi-step workflows operate on your notes and project files.

**Inline Edit** - Select text or start at the cursor position, then ask Codex to rewrite or insert directly in notes with a diff review before applying.

**Slash Commands & Skills** - Type `/` or `$` for reusable prompt templates and Codex skills from user and vault scopes.

**`@mention` context** - Mention vault files, external files, MCP servers, and subagents so Codex can work with explicit context.

**Plan Mode** - Toggle via `Shift+Tab` when you want Codex to explore and propose before making changes.

**MCP & Subagents** - Codexian surfaces Codex-managed MCP tools, skills, and subagents in Obsidian while leaving the underlying configuration in Codex's own CLI-managed locations.

**Multi-Tab Conversations** - Run multiple chat tabs, preserve conversation metadata, fork, resume, compact, and continue prior Codex sessions.

## Requirements

- [Codex CLI](https://github.com/openai/codex) installed and authenticated.
- Obsidian v1.4.5 or newer.
- Desktop Obsidian only: macOS, Linux, or Windows.

## Installation

### From GitHub Release

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/zypher1225/codexian/releases/latest).
2. Create this folder in your vault:
   ```bash
   /path/to/vault/.obsidian/plugins/codexian/
   ```
3. Copy the downloaded files into that folder.
4. Enable Codexian in Obsidian:
   Settings -> Community plugins -> Codexian.

### Using BRAT

1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat).
2. Open BRAT settings and choose "Add Beta plugin".
3. Enter:
   ```text
   https://github.com/zypher1225/codexian
   ```
4. Enable Codexian in Obsidian.

### From Source

```bash
cd /path/to/vault/.obsidian/plugins
git clone https://github.com/zypher1225/codexian.git
cd codexian
npm install
npm run build
```

For development, set `OBSIDIAN_VAULT` in `.env.local` and run:

```bash
npm run dev
```

Built files are copied to `.obsidian/plugins/codexian/` automatically when `OBSIDIAN_VAULT` points at a valid vault.

## Codex CLI Setup

Codexian auto-detects `codex` from `PATH`. If Obsidian cannot find it, set the explicit path in Codexian settings.

| Platform | Command | Example path |
| --- | --- | --- |
| macOS/Linux | `which codex` | `/Users/you/.local/bin/codex` |
| Windows native | `where.exe codex` | `C:\Users\you\AppData\Roaming\npm\codex.exe` |
| Windows WSL | `which codex` inside WSL | `/home/you/.local/bin/codex` |

GUI apps often receive a smaller `PATH` than your terminal. If Codexian shows `spawn codex ENOENT`, either set the CLI path directly or add your Node/Codex bin directory in Settings -> Environment.

## Privacy & Data Use

- **Sent to API**: Your prompts, selected note text, attached files/images, and tool outputs are sent according to your Codex/OpenAI configuration.
- **Local storage**: Codexian stores plugin settings and session metadata in the vault plugin data area and Codex sessions in the normal Codex CLI session store.
- **No telemetry**: Codexian does not add analytics or tracking.

## Architecture

```text
src/
├── main.ts                      # Obsidian plugin entry point
├── app/                         # Shared defaults and plugin-level storage
├── core/                        # Provider-neutral runtime, registry, storage, tools, prompts
│   ├── runtime/                 # ChatRuntime interface and approval flow contracts
│   ├── providers/               # Provider registry, model routing, environment handling
│   ├── security/                # Approval utilities
│   └── ...                      # commands, MCP, storage, tool metadata, shared types
├── providers/
│   └── codex/                   # Codex app-server adaptor, JSON-RPC transport, JSONL history
├── features/
│   ├── chat/                    # Sidebar chat, tabs, renderers, rewind/fork state
│   ├── inline-edit/             # Inline edit modal and Codex-backed edit service
│   └── settings/                # Settings UI and provider tabs
├── shared/                      # Reusable UI components, mention dropdowns, modals
├── i18n/                        # Locale strings
├── utils/                       # Cross-cutting utilities
└── style/                       # Modular CSS compiled to styles.css
```

The Codex runtime uses `codex app-server` rather than a plain one-shot shell command. That gives Codexian richer streaming events, approval request handling, resumable threads, skill discovery, subagent metadata, image handling, and JSONL-backed tool rendering.

## Development

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

## Acknowledgments

Codexian is architected from the excellent Obsidian agent-plugin foundation in [YishenTu/claudian](https://github.com/YishenTu/claudian), refocused around local Codex CLI as the default and primary provider.

Thanks to [Obsidian](https://obsidian.md) for the plugin API and [OpenAI](https://openai.com) for [Codex](https://github.com/openai/codex).

## License

MIT
