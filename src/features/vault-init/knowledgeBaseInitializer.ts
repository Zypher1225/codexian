import type { App } from 'obsidian';

export interface KnowledgeBaseInitResult {
  createdFolders: number;
  createdFiles: number;
  skippedFiles: number;
}

const FOLDERS = [
  '00 收件箱',
  '00 收件箱/网页剪藏',
  '00 收件箱/随手笔记',
  '10 原始资料',
  '10 原始资料/文章',
  '10 原始资料/论文',
  '10 原始资料/代码仓库',
  '10 原始资料/数据集',
  '10 原始资料/来源图片',
  '20 知识库',
  '20 知识库/概念',
  '20 知识库/人物',
  '20 知识库/项目',
  '20 知识库/工具',
  '20 知识库/方法',
  '20 知识库/索引',
  '30 输出',
  '30 输出/报告',
  '30 输出/幻灯片',
  '30 输出/图表',
  '40 地图',
  '90 系统',
  '90 系统/提示词',
  '90 系统/模板',
  '90 系统/维护报告',
  '资源',
  '资源/图片',
  '资源/文件',
  '.codex',
  '.codex/skills',
  '.codex/skills/编译知识库',
  '.codex/skills/知识库体检',
  '.codex/skills/生成研究输出',
] as const;

const FILES: Array<{ path: string; content: string }> = [
  {
    path: '00 收件箱/README.md',
    content: `# 00 收件箱

这里放临时摄入材料：网页剪藏、随手摘抄、未分类想法、临时截图、未经判断是否值得长期保留的内容。

规则：

- 可以很乱，但不要长期堆积。
- Web Clipper、手机快速记录、临时复制内容优先进入这里。
- Codexian 编译时会判断哪些内容应该进入 \`10 原始资料\`，哪些应该直接转为 \`20 知识库\` 候选概念。
`,
  },
  {
    path: '10 原始资料/README.md',
    content: `# 10 原始资料

这里放原始资料。它是证据层，不是整理后的观点层。

子目录：

- \`文章/\`：文章、博客、网页正文。
- \`论文/\`：论文、白皮书、报告。
- \`代码仓库/\`：GitHub repo 摘要、源码阅读笔记、README 快照。
- \`数据集/\`：数据集说明、CSV、JSON、导出结果。
- \`来源图片/\`：与资料绑定的原始图片、截图、图表。

规则：

- 尽量保留 source、created、author、published 等 frontmatter。
- 原始资料文件不追求漂亮，追求可追溯。
- LLM 可以补 metadata、摘要和处理状态，但不要随意改写原始正文。
`,
  },
  {
    path: '20 知识库/README.md',
    content: `# 20 知识库

这里是 LLM 根据 \`00 收件箱\` 和 \`10 原始资料\` 编译出来的知识库。

知识库是观点层和概念层，不是原文堆放区。

子目录：

- \`概念/\`：概念、术语、理论。
- \`人物/\`：人物、作者、团队。
- \`项目/\`：项目、产品、开源仓库、研究方向。
- \`工具/\`：工具、框架、软件、服务。
- \`方法/\`：方法论、流程、实践范式。
- \`索引/\`：全局索引、概念索引、来源索引、开放问题。
`,
  },
  {
    path: '20 知识库/索引/来源索引.md',
    content: `# 来源索引

这里记录 \`00 收件箱\` 和 \`10 原始资料\` 中资料的处理状态。

| 来源 | 类型 | 状态 | 关键主题 | 知识库链接 | 备注 |
| --- | --- | --- | --- | --- | --- |

## 状态说明

- \`new\`：尚未处理。
- \`summarized\`：已提炼为摘要或可复用线索。
- \`compiled\`：已进入知识库。
- \`needs-review\`：需要人工判断或补充来源。
- \`archived\`：暂不处理。
`,
  },
  {
    path: '20 知识库/索引/概念索引.md',
    content: `# 概念索引

这里记录 \`20 知识库\` 中已经沉淀的概念、方法、人物、项目和工具。

| 概念 | 类型 | 简述 | 关联页面 | 来源 |
| --- | --- | --- | --- | --- |
`,
  },
  {
    path: '20 知识库/索引/开放问题.md',
    content: `# 开放问题

这里记录等待研究、需要验证、值得继续追问的问题。

| 问题 | 背景 | 优先级 | 相关页面 | 状态 |
| --- | --- | --- | --- | --- |
`,
  },
  {
    path: '30 输出/README.md',
    content: `# 30 输出

这里保存你把 Codexian 当作“大脑”之后产生的输出。

输出是“使用知识库后的产物”，不是原始资料，也不是知识库的稳定概念页。

适合放：

- \`报告/\`：研究报告、问答长文、分析结论。
- \`幻灯片/\`：Marp 或 Markdown 幻灯片。
- \`图表/\`：Mermaid、matplotlib、截图、结构图。

重要输出如果长期有价值，可以让 Codexian 再“回流”到 \`20 知识库\`。
`,
  },
  {
    path: '40 地图/README.md',
    content: `# 40 地图

地图是知识库的导航层，也就是 Obsidian 社区常说的 MOC（内容地图）。

它解决的问题不是“存资料”，而是：

- 从哪里开始看？
- 一个研究主题有哪些核心概念？
- 哪些资料、概念、输出属于同一条研究路线？
- 下一步应该问什么？

你可以把 \`40 地图/Home.md\` 当作整个 vault 的仪表盘。
`,
  },
  {
    path: '40 地图/Home.md',
    content: `# Brain Home

这是这个 vault 的入口页。这里不是普通笔记本，而是一个由人类摄入资料、由 LLM 编译维护的知识库 IDE。

## 工作流

1. 把临时资料放进 [[00 收件箱/README|00 收件箱]]。
2. 把值得长期保留的原始资料放进 [[10 原始资料/README|10 原始资料]]。
3. 让 Codexian 用 \`/编译知识库\` 把资料编译进 [[20 知识库/README|20 知识库]]。
4. 用 [[30 输出/README|30 输出]] 保存每次研究、问答、报告、幻灯片和图表。
5. 用 [[40 地图/README|40 地图]] 维护主题地图、研究路线和入口页。
6. 用 [[90 系统/README|90 系统]] 保存规则、模板、提示词和健康检查报告。

## 核心索引

- [[20 知识库/索引/来源索引|来源索引]]
- [[20 知识库/索引/概念索引|概念索引]]
- [[20 知识库/索引/开放问题|开放问题]]
- [[90 系统/wiki-rules|知识库规则]]

## 常用 Codexian 技能

- \`/编译知识库\`：从 \`00 收件箱\` 和 \`10 原始资料\` 编译知识库。
- \`/知识库体检\`：检查断链、重复、矛盾、缺失来源和待补主题。
- \`/生成研究输出\`：基于知识库生成报告、幻灯片、图表说明或研究输出。
`,
  },
  {
    path: '90 系统/README.md',
    content: `# 90 系统

这里放给 LLM 和知识库维护流程看的系统资料。

它不是知识内容本身，而是“如何维护知识库”的规则层。

子目录：

- \`提示词/\`：可复用提示词。
- \`模板/\`：知识库、来源、报告模板。
- \`维护报告/\`：健康检查报告、整理日志、迁移报告。

Codexian 技能放在 \`.codex/skills/\`，不放在这里。这里放的是人类可读的规则、模板和操作说明。
`,
  },
  {
    path: '90 系统/wiki-rules.md',
    content: `# 知识库规则

Codexian 维护这个 vault 时必须遵守这些规则。

## 目录边界

- \`00 收件箱/\`：临时材料，可以移动、归档、标记处理状态。
- \`10 原始资料/\`：原始资料层，默认不要改写正文，只补 metadata、摘要和处理状态。
- \`20 知识库/\`：正式知识层，可以创建和更新。
- \`30 输出/\`：研究输出层，可以创建报告、幻灯片、图表说明。
- \`40 地图/\`：导航层，可以创建和更新主题地图。
- \`90 系统/\`：规则、模板、检查报告，不要当作知识正文。
- \`资源/\`：附件层，存图片、PDF、导出文件等资源。

## 写作规则

- 不确定的内容必须标注“待验证”。
- 每个事实性断言尽量链接到原始来源。
- 每个知识库页面至少包含“定义 / 背景 / 关联概念 / 来源 / 待验证问题”。
- 不要把原始资料正文整段复制进知识库，除非是短引用。
- 新建页面时优先使用 \`90 系统/模板/\` 中的模板。

## 链接规则

- 知识库页面之间使用 Obsidian 双链。
- 每篇来源资料必须在 \`20 知识库/索引/来源索引.md\` 中有状态记录。
- 新概念必须在 \`20 知识库/索引/概念索引.md\` 中登记。
- 发现新问题时追加到 \`20 知识库/索引/开放问题.md\`。
`,
  },
  {
    path: '90 系统/模板/知识库文章模板.md',
    content: `---
type: wiki
status: draft
created:
updated:
tags: []
---

# 标题

## 定义

## 背景

## 关键观点

## 关联概念

## 来源

## 待验证问题
`,
  },
  {
    path: '90 系统/模板/来源笔记模板.md',
    content: `---
type: source
status: new
created:
source:
author:
published:
tags: []
---

# 标题

## 摘要

## 关键摘录

## 可沉淀概念

## 处理记录
`,
  },
  {
    path: '90 系统/模板/研究输出模板.md',
    content: `---
type: output
status: draft
created:
question:
tags: []
---

# 标题

## 问题

## 结论

## 依据

## 可回流到知识库的内容

## 后续问题
`,
  },
  {
    path: '.codex/skills/编译知识库/SKILL.md',
    content: `---
name: 编译知识库
description: "把 00 收件箱 和 10 原始资料 编译成 20 知识库，并维护索引。"
---

你是这个 Obsidian vault 的知识库编译助手。目标是把 \`00 收件箱/\` 和 \`10 原始资料/\` 中的新资料，增量编译到 \`20 知识库/\`、\`40 地图/\` 和索引文件中。

执行流程：

1. 读取 \`90 系统/wiki-rules.md\`，遵守目录边界和写作规则。
2. 扫描 \`00 收件箱/\` 和 \`10 原始资料/\`，识别新资料、未处理资料和明显重复资料。
3. 更新 \`20 知识库/索引/来源索引.md\`。
4. 为值得沉淀的概念创建或更新 \`20 知识库/概念/\`、\`20 知识库/工具/\`、\`20 知识库/方法/\` 等页面。
5. 更新 \`20 知识库/索引/概念索引.md\`。
6. 把发现的开放问题追加到 \`20 知识库/索引/开放问题.md\`。
7. 在 \`90 系统/维护报告/\` 写一份本次编译报告，文件名使用日期和主题。

约束：

- 不要大段改写 \`10 原始资料/\` 原文。
- 不确定的内容标注“待验证”。
- 每个新知识库页面必须写来源。
- 输出要落盘为 Markdown 文件，不要只在聊天中回答。
`,
  },
  {
    path: '.codex/skills/知识库体检/SKILL.md',
    content: `---
name: 知识库体检
description: "检查知识库的断链、重复概念、来源不足、矛盾和索引缺失。"
---

你是这个 Obsidian vault 的知识库体检助手。目标是找出知识库的结构问题、事实问题和下一步维护任务。

检查范围：

- \`20 知识库/\`
- \`40 地图/\`
- \`20 知识库/索引/来源索引.md\`
- \`20 知识库/索引/概念索引.md\`
- \`20 知识库/索引/开放问题.md\`

输出：

- 在 \`90 系统/维护报告/\` 创建一份健康检查报告。
- 报告必须包含：严重问题、建议修复、可自动修复项、需要人工判断项、下一步问题清单。
- 不要直接大规模改知识库；除非是安全的小修复，例如补索引、修明显路径链接。
`,
  },
  {
    path: '.codex/skills/生成研究输出/SKILL.md',
    content: `---
name: 生成研究输出
description: "基于知识库生成报告、幻灯片或图表说明，并保存到 30 输出。"
---

你是这个 Obsidian vault 的研究输出助手。目标是根据用户的问题，读取 \`20 知识库/\`、\`10 原始资料/\` 和已有 \`30 输出/\`，生成一个可在 Obsidian 中直接阅读的输出文件。

执行流程：

1. 先澄清用户要的输出类型：报告、幻灯片、图表说明、对比表、路线图、决策备忘录。
2. 优先读取 \`20 知识库/索引/\`，再读取相关知识库页面，最后才回到原始来源。
3. 生成 Markdown 文件，保存到：
   - 报告：\`30 输出/报告/\`
   - 幻灯片：\`30 输出/幻灯片/\`
   - 图表说明：\`30 输出/图表/\`
4. 输出末尾加入“可回流到知识库的内容”和“后续问题”。
5. 如果产生了长期有效的新概念，建议但不要自动大规模改写知识库，除非用户明确要求回流。

约束：

- 不要只在聊天中回答，必须创建或更新输出文件。
- 引用事实时链接到相关知识库页面或原始来源。
- 不确定结论标注“待验证”。
`,
  },
];

async function ensureFolder(app: App, folder: string): Promise<boolean> {
  if (await app.vault.adapter.exists(folder)) {
    return false;
  }

  const parts = folder.split('/').filter(Boolean);
  let current = '';
  let created = false;

  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    if (!(await app.vault.adapter.exists(current))) {
      await app.vault.adapter.mkdir(current);
      created = true;
    }
  }

  return created;
}

export async function initializeKnowledgeBaseVault(app: App): Promise<KnowledgeBaseInitResult> {
  let createdFolders = 0;
  let createdFiles = 0;
  let skippedFiles = 0;

  for (const folder of FOLDERS) {
    if (await ensureFolder(app, folder)) {
      createdFolders += 1;
    }
  }

  for (const file of FILES) {
    if (await app.vault.adapter.exists(file.path)) {
      skippedFiles += 1;
      continue;
    }
    const parent = file.path.slice(0, file.path.lastIndexOf('/'));
    if (parent) {
      await ensureFolder(app, parent);
    }
    await app.vault.adapter.write(file.path, file.content);
    createdFiles += 1;
  }

  return { createdFolders, createdFiles, skippedFiles };
}

