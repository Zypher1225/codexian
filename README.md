# Codexian

简体中文 | [English](docs/README.en.md)

![GitHub stars](https://img.shields.io/github/stars/zypher1225/codexian?style=social)
![GitHub release](https://img.shields.io/github/v/release/zypher1225/codexian)
![License](https://img.shields.io/github/license/zypher1225/codexian)

![Preview](Preview.png)

Codexian 是一个 Obsidian 桌面端插件，用来把本地 Codex CLI 嵌入到你的 vault 里。启用后，Codex 可以把当前 vault 当作工作目录，在 Obsidian 侧边栏中聊天、阅读笔记、编辑文件、搜索项目、运行终端命令、使用 Skills 和 Subagents，并完成多步骤的写作或开发任务。

## 功能与用法

从左侧 ribbon 图标或命令面板打开 Codexian 聊天侧边栏。你也可以选中笔记内容后使用内联编辑命令，让 Codex 直接改写当前笔记，并在应用前查看词级 diff。聊天会通过你本机已安装的 `codex` 运行，复用 Codex CLI 的登录状态、配置、MCP、Skills、Subagents 和会话存储。

**本地 Codex CLI 运行时** - 使用 `codex app-server` 和 stdio JSON-RPC 通信，支持启动握手、流式响应、审批请求、可恢复会话等能力。

**Vault 原生工作目录** - 当前 Obsidian vault 就是 Codex 的工作目录，因此读写文件、搜索、bash 命令和多步骤任务都围绕你的笔记和项目文件执行。

**内联编辑** - 选中文本或把光标放在目标位置，让 Codex 插入、改写、润色或重构内容，并在应用前查看差异。

**Slash Commands 与 Skills** - 输入 `/` 或 `$` 调用可复用的 prompt 模板和 Codex Skills，支持用户级和 vault 级作用域。

**`@mention` 上下文** - 通过 `@` 明确提及 vault 文件、外部文件、MCP 服务器和 subagents，让 Codex 带着指定上下文工作。

**Plan Mode** - 通过 `Shift+Tab` 切换计划模式，让 Codex 先探索和提出方案，再执行修改。

**MCP 与 Subagents** - 在 Obsidian UI 中展示和使用 Codex 管理的 MCP 工具、Skills 与 Subagents，同时保留 Codex CLI 原本的配置方式。

**多标签会话** - 支持多个聊天标签、会话元数据、fork、resume、compact，以及继续历史 Codex 会话。

## 环境要求

- 已安装并登录 [Codex CLI](https://github.com/openai/codex)。
- Obsidian v1.4.5 或更高版本。
- 仅支持桌面端 Obsidian：macOS、Linux、Windows。

## 安装

### 推荐：从 GitHub Release 手动安装

1. 从 [latest release](https://github.com/zypher1225/codexian/releases/latest) 下载 `main.js`、`manifest.json` 和 `styles.css`。
2. 在你的 Obsidian vault 中创建插件目录，文件夹名必须是 `codexian`：
   ```bash
   /path/to/vault/.obsidian/plugins/codexian/
   ```
3. 把三个文件复制到 `codexian` 文件夹中。
4. 重启 Obsidian，进入 Settings -> Community plugins。
5. 如果 Restricted mode / 安全模式处于开启状态，先关闭它。
6. 启用 Codexian。

安装后如果打不开 Codex，请先在终端确认 `codex` 可用：

```bash
codex --version
```

### 可选：使用 BRAT 安装

1. 安装 [BRAT](https://github.com/TfTHacker/obsidian42-brat)。
2. 打开 BRAT 设置，选择 "Add Beta plugin"。
3. 输入仓库地址：
   ```text
   https://github.com/zypher1225/codexian
   ```
4. 在 Obsidian 中启用 Codexian。

### 开发者：从源码安装

```bash
cd /path/to/vault/.obsidian/plugins
git clone https://github.com/zypher1225/codexian.git
cd codexian
npm install
npm run build
```

开发时可以在 `.env.local` 中设置 `OBSIDIAN_VAULT`，然后运行：

```bash
npm run dev
```

当 `OBSIDIAN_VAULT` 指向有效 vault 时，构建产物会自动复制到 `.obsidian/plugins/codexian/`。

## Codex CLI 配置

Codexian 会默认从 `PATH` 自动查找 `codex`。如果 Obsidian 找不到 Codex CLI，可以在 Codexian 设置中填写明确路径。

| 平台 | 查询命令 | 示例路径 |
| --- | --- | --- |
| macOS/Linux | `which codex` | `/Users/you/.local/bin/codex` |
| Windows 原生 | `where.exe codex` | `C:\Users\you\AppData\Roaming\npm\codex.exe` |
| Windows WSL | 在 WSL 中执行 `which codex` | `/home/you/.local/bin/codex` |

GUI 应用拿到的 `PATH` 经常比终端少。如果 Codexian 显示 `spawn codex ENOENT`，请直接设置 Codex CLI 路径，或在 Settings -> Environment 中添加 Node/Codex 的 bin 目录。

## 隐私与数据

- **会发送到 API 的内容**：你的提示词、选中的笔记文本、附加文件/图片、工具调用输出等，具体取决于你的 Codex/OpenAI 配置。
- **本地存储**：Codexian 会在 vault 插件数据区保存插件设置和会话元数据；Codex 会话仍保存在 Codex CLI 默认的会话目录。
- **无遥测**：Codexian 不添加分析、追踪或额外遥测。

## 架构

```text
src/
├── main.ts                      # Obsidian 插件入口
├── app/                         # 默认设置与插件级存储
├── core/                        # provider-neutral runtime、registry、storage、tools、prompts
│   ├── runtime/                 # ChatRuntime 接口与审批流契约
│   ├── providers/               # Provider registry、模型路由、环境变量处理
│   ├── security/                # 审批工具
│   └── ...                      # commands、MCP、storage、tool metadata、共享类型
├── providers/
│   └── codex/                   # Codex app-server adaptor、JSON-RPC transport、JSONL history
├── features/
│   ├── chat/                    # 侧边栏聊天、tabs、renderers、rewind/fork 状态
│   ├── inline-edit/             # 内联编辑 modal 与 Codex 编辑服务
│   └── settings/                # 设置界面与 provider tabs
├── shared/                      # 复用 UI 组件、mention dropdowns、modals
├── i18n/                        # 多语言文本
├── utils/                       # 跨模块工具
└── style/                       # 模块化 CSS，编译为 styles.css
```

Codexian 使用 `codex app-server`，而不是简单执行一次性的 shell 命令。这样可以获得更完整的流式事件、审批请求处理、可恢复线程、Skills 发现、Subagents 元数据、图片处理，以及基于 JSONL 会话文件的工具渲染。

## 开发

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

## 致谢

Codexian 的架构来自优秀的 Obsidian agent 插件基础项目 [YishenTu/claudian](https://github.com/YishenTu/claudian)，并在此基础上将本地 Codex CLI 作为默认和主要 provider。

感谢 [Obsidian](https://obsidian.md) 提供插件 API，感谢 [OpenAI](https://openai.com) 提供 [Codex](https://github.com/openai/codex)。

## License

MIT
