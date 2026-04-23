# Codexian

[简体中文](../README.md) | English

![GitHub stars](https://img.shields.io/github/stars/zypher1225/codexian?style=social)
![GitHub release](https://img.shields.io/github/v/release/zypher1225/codexian)
![License](https://img.shields.io/github/license/zypher1225/codexian)

![Preview](../Preview.png)

Codexian embeds the local Codex CLI inside Obsidian. Your vault becomes Codex's working directory, so the agent can read notes, edit files, search the vault, run terminal commands, use skills and subagents, and carry multi-step writing, research, or development workflows without leaving Obsidian.

The Chinese README is the primary guide for now. This page mirrors the essential installation and usage flow.

## Features

**Local Codex CLI runtime** - Uses `codex app-server` over stdio JSON-RPC, with startup handshakes, streaming turn events, approval gates, and resumable sessions.

**Vault-native workspace** - The active vault is the working directory for Codex, so file read/write, search, bash, and multi-step workflows operate on your notes and project files.

**Knowledge base IDE initialization** - Run `Codexian: 初始化知识库 IDE` from the Obsidian command palette to create a safe starter structure, templates, indexes, and vault-local Codex skills. Existing files are skipped, not overwritten.

**Inline Edit** - Select text or start at the cursor position, then ask Codex to rewrite or insert directly in notes with a diff review before applying.

**Commands & Skills** - Type `/` to invoke vault-local Codex skills and common commands.

**`@mention` context** - Mention vault files, external files, MCP servers, and subagents so Codex can work with explicit context.

## Requirements

- [Codex CLI](https://github.com/openai/codex) installed and authenticated.
- Obsidian v1.4.5 or newer.
- Desktop Obsidian only: macOS, Linux, or Windows.

Verify Codex first:

```bash
codex --version
```

If needed, authenticate:

```bash
codex login
```

## Installation

### Recommended: ask Codex CLI to install it

1. Download these three files from the [latest release](https://github.com/zypher1225/codexian/releases/latest):
   - `main.js`
   - `manifest.json`
   - `styles.css`
2. Put them in one local folder, for example:
   ```bash
   ~/Downloads/codexian-release/
   ```
3. Run this in your terminal and adjust the download folder if needed:
   ```bash
   codex "Please install the Codexian Obsidian plugin for me. The plugin files are in ~/Downloads/codexian-release and should include main.js, manifest.json, and styles.css. First find or ask for my Obsidian vault path, then copy only these three files into <vault>/.obsidian/plugins/codexian/. Do not delete or overwrite my notes. After copying, verify the files exist and remind me to turn off Restricted mode in Obsidian Settings -> Community plugins, then enable Codexian."
   ```
4. Restart Obsidian.
5. Open `Settings -> Community plugins`.
6. Turn off `Restricted mode` if it is enabled.
7. Enable `Codexian`.

### Manual install

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/zypher1225/codexian/releases/latest).
2. Find your vault path. The vault is the folder that contains `.obsidian`:
   ```bash
   find "$HOME" -name ".obsidian" -type d 2>/dev/null
   ```
3. Copy the files. Change `VAULT` and `RELEASE_DIR` to your paths:
   ```bash
   VAULT="/Users/you/Brain"
   RELEASE_DIR="$HOME/Downloads/codexian-release"
   PLUGIN_DIR="$VAULT/.obsidian/plugins/codexian"

   mkdir -p "$PLUGIN_DIR"
   cp "$RELEASE_DIR/main.js" "$RELEASE_DIR/manifest.json" "$RELEASE_DIR/styles.css" "$PLUGIN_DIR/"
   ls -la "$PLUGIN_DIR"
   ```
4. Restart Obsidian.
5. Open `Settings -> Community plugins`.
6. Turn off `Restricted mode`.
7. Enable `Codexian`.

## First Run

After enabling the plugin, open the Obsidian command palette and run:

```text
Codexian: 初始化知识库 IDE
```

This creates:

```text
00 收件箱/       # inbox, clips, temporary notes
10 原始资料/     # raw articles, papers, repos, datasets, source images
20 知识库/       # compiled wiki
30 输出/         # reports, slides, charts, research outputs
40 地图/         # home page and maps of content
90 系统/         # rules, templates, prompts, maintenance reports
资源/            # images, PDFs, attachments
.codex/skills/   # vault-local Codex skills
```

Open `40 地图/Home.md`, then use `/` in Codexian to run:

- `/编译知识库`
- `/知识库体检`
- `/生成研究输出`

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
