# Codexian

简体中文 | [English](docs/README.en.md)

![GitHub stars](https://img.shields.io/github/stars/zypher1225/codexian?style=social)
![GitHub release](https://img.shields.io/github/v/release/zypher1225/codexian)
![License](https://img.shields.io/github/license/zypher1225/codexian)

![Preview](Preview.png)

Codexian 是一个 Obsidian 桌面端插件，用来把本地 Codex CLI 嵌入到你的 vault 里。启用后，Codex 可以把当前 vault 当作工作目录，在 Obsidian 侧边栏中聊天、阅读笔记、编辑文件、搜索项目、运行终端命令、使用技能和子代理，并完成多步骤的写作、研究或开发任务。

它的目标不是再做一个普通聊天窗口，而是让 Obsidian 成为一个由 Codex 参与维护的知识库 IDE：你负责收集资料、提出问题和判断方向，Codex 负责把资料编译成 Markdown wiki、维护索引、生成输出、做健康检查。

## 功能与用法

从左侧 ribbon 图标或命令面板打开 Codexian 聊天侧边栏。你也可以选中笔记内容后使用内联编辑命令，让 Codex 直接改写当前笔记，并在应用前查看词级 diff。聊天会通过你本机已安装的 `codex` 运行，复用 Codex CLI 的登录状态、配置、MCP、技能、子代理和会话存储。

**本地 Codex CLI 运行时** - 使用 `codex app-server` 和 stdio JSON-RPC 通信，支持启动握手、流式响应、审批请求、可恢复会话等能力。

**Vault 原生工作目录** - 当前 Obsidian vault 就是 Codex 的工作目录，因此读写文件、搜索、bash 命令和多步骤任务都围绕你的笔记和项目文件执行。

**知识库 IDE 初始化** - 命令面板运行 `Codexian: 初始化知识库 IDE`，会安全创建中文知识库目录、模板、索引和 vault 内置 Codex 技能。它只创建缺失内容，遇到已有文件会跳过，不会覆盖你的旧笔记。

**内联编辑** - 选中文本或把光标放在目标位置，让 Codex 插入、改写、润色或重构内容，并在应用前查看差异。

**命令与技能** - 输入 `/` 调用当前 vault 的 Codex 技能和常用命令。Codexian 会在内部兼容 Codex CLI 的技能格式，普通用户只需要记住 `/`。

**`@mention` 上下文** - 通过 `@` 明确提及 vault 文件、外部文件、MCP 服务器和 subagents，让 Codex 带着指定上下文工作。

**Plan Mode** - 通过 `Shift+Tab` 切换计划模式，让 Codex 先探索和提出方案，再执行修改。

**MCP 与子代理** - 在 Obsidian UI 中展示和使用 Codex 管理的 MCP 工具、技能与子代理，同时保留 Codex CLI 原本的配置方式。

**多标签会话** - 支持多个聊天标签、会话元数据、fork、resume、compact，以及继续历史 Codex 会话。

## 环境要求

- 已安装并登录 [Codex CLI](https://github.com/openai/codex)。
- Obsidian v1.4.5 或更高版本。
- 仅支持桌面端 Obsidian：macOS、Linux、Windows。

安装前先确认终端里可以运行：

```bash
codex --version
```

如果还没有登录 Codex CLI，请先在终端完成登录：

```bash
codex login
```

## 安装

### 方法一：让 Codex 帮你安装

这是最适合新用户的方式。你先把 release 文件下载到本地，再让 Codex CLI 帮你找到 vault 并复制插件文件。

1. 从 [latest release](https://github.com/zypher1225/codexian/releases/latest) 下载这三个文件：
   - `main.js`
   - `manifest.json`
   - `styles.css`
2. 把三个文件放在同一个下载目录，例如：
   ```bash
   ~/Downloads/codexian-release/
   ```
3. 在终端运行下面这段命令，把 `~/Downloads/codexian-release` 改成你的实际下载目录：
   ```bash
   codex "请帮我安装 Codexian Obsidian 插件。插件文件在 ~/Downloads/codexian-release，里面应该有 main.js、manifest.json、styles.css。请先找到或询问我的 Obsidian vault 路径，然后只把这三个文件复制到 <vault>/.obsidian/plugins/codexian/。不要删除或覆盖我的笔记。复制完成后确认文件存在，并提醒我在 Obsidian 设置里关闭 Restricted mode / 安全模式，然后启用 Codexian。"
   ```
4. 重启 Obsidian。
5. 进入 `Settings -> Community plugins`。
6. 如果 `Restricted mode` / `安全模式` 处于开启状态，先关闭它。
7. 在社区插件列表中启用 `Codexian`。

这一步使用的是你电脑上的 Codex CLI，因此即使 Codexian 插件还没安装，也可以执行。

### 方法二：手动安装

如果你想完全自己操作，按下面步骤走。

1. 从 [latest release](https://github.com/zypher1225/codexian/releases/latest) 下载 `main.js`、`manifest.json` 和 `styles.css`。
2. 找到你的 Obsidian vault 路径。vault 就是包含 `.obsidian` 文件夹的那个目录。可以用终端搜索：
   ```bash
   find "$HOME" -name ".obsidian" -type d 2>/dev/null
   ```
   如果输出是：
   ```text
   /Users/you/Brain/.obsidian
   ```
   那么 vault 路径就是：
   ```text
   /Users/you/Brain
   ```
3. 复制插件文件。把下面的 `VAULT` 和 `RELEASE_DIR` 改成你的实际路径：
   ```bash
   VAULT="/Users/you/Brain"
   RELEASE_DIR="$HOME/Downloads/codexian-release"
   PLUGIN_DIR="$VAULT/.obsidian/plugins/codexian"

   mkdir -p "$PLUGIN_DIR"
   cp "$RELEASE_DIR/main.js" "$RELEASE_DIR/manifest.json" "$RELEASE_DIR/styles.css" "$PLUGIN_DIR/"
   ls -la "$PLUGIN_DIR"
   ```
4. 重启 Obsidian。
5. 进入 `Settings -> Community plugins`。
6. 关闭 `Restricted mode` / `安全模式`。
7. 启用 `Codexian`。

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

## 第一次使用：初始化知识库 IDE

启用插件后，打开 Obsidian 命令面板，运行：

```text
Codexian: 初始化知识库 IDE
```

这个命令会创建一套适合 Codexian 使用的中文知识库结构：

```text
00 收件箱/       # 网页剪藏、随手摘抄、临时想法
10 原始资料/     # 文章、论文、仓库、数据集、来源图片
20 知识库/       # Codex 编译出的概念、人物、项目、工具、方法和索引
30 输出/         # 报告、幻灯片、图表、研究问答结果
40 地图/         # Home、主题地图、研究路线
90 系统/         # 规则、模板、提示词、维护报告
资源/            # 图片、PDF、附件、导出文件
.codex/skills/   # vault 内置 Codex 技能
```

初始化命令是安全的：

- 只创建缺失目录和缺失文件。
- 已存在的文件会跳过，不会覆盖。
- 不会删除、移动或重命名你的旧笔记。
- 可以在旧 vault 中运行，但建议先备份重要资料。

初始化后先打开：

```text
40 地图/Home.md
```

然后在 Codexian 输入框里用 `/` 调用内置技能：

- `/编译知识库`：从 `00 收件箱` 和 `10 原始资料` 编译 wiki。
- `/知识库体检`：检查断链、重复、矛盾、缺失来源和待补主题。
- `/生成研究输出`：基于知识库生成报告、幻灯片、图表说明或研究输出。

初始化本身是一次性插件命令，不做成日常技能；真正高频使用的是这些 `/` 技能。

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
│   ├── settings/                # 设置界面与 provider tabs
│   └── vault-init/              # 安全初始化知识库 IDE 目录、模板和 vault 技能
├── shared/                      # 复用 UI 组件、mention dropdowns、modals
├── i18n/                        # 多语言文本
├── utils/                       # 跨模块工具
└── style/                       # 模块化 CSS，编译为 styles.css
```

Codexian 使用 `codex app-server`，而不是简单执行一次性的 shell 命令。这样可以获得更完整的流式事件、审批请求处理、可恢复线程、技能发现、子代理元数据、图片处理，以及基于 JSONL 会话文件的工具渲染。

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
