import { initializeKnowledgeBaseVault } from '@/features/vault-init/knowledgeBaseInitializer';

function createMockApp(existingPaths = new Set<string>()) {
  const created = new Set(existingPaths);
  const writes: Array<[string, string]> = [];

  return {
    app: {
      vault: {
        adapter: {
          exists: jest.fn(async (path: string) => created.has(path)),
          mkdir: jest.fn(async (path: string) => {
            created.add(path);
          }),
          write: jest.fn(async (path: string, content: string) => {
            created.add(path);
            writes.push([path, content]);
          }),
        },
      },
    } as any,
    created,
    writes,
  };
}

describe('initializeKnowledgeBaseVault', () => {
  it('creates the knowledge base folders, indexes, templates, and vault skills', async () => {
    const { app, writes } = createMockApp();

    const result = await initializeKnowledgeBaseVault(app);

    expect(result.createdFolders).toBeGreaterThan(0);
    expect(result.createdFiles).toBeGreaterThan(0);
    expect(result.skippedFiles).toBe(0);
    expect(writes.map(([path]) => path)).toEqual(expect.arrayContaining([
      '40 地图/Home.md',
      '20 知识库/索引/来源索引.md',
      '90 系统/模板/知识库文章模板.md',
      '.codex/skills/编译知识库/SKILL.md',
      '.codex/skills/知识库体检/SKILL.md',
      '.codex/skills/生成研究输出/SKILL.md',
    ]));
  });

  it('does not overwrite existing files', async () => {
    const { app, writes } = createMockApp(new Set([
      '40 地图/Home.md',
      '.codex/skills/编译知识库/SKILL.md',
    ]));

    const result = await initializeKnowledgeBaseVault(app);

    expect(result.skippedFiles).toBe(2);
    expect(writes.map(([path]) => path)).not.toContain('40 地图/Home.md');
    expect(writes.map(([path]) => path)).not.toContain('.codex/skills/编译知识库/SKILL.md');
  });
});

