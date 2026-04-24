import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { codexChatUIConfig } from '@/providers/codex/ui/CodexChatUIConfig';

describe('CodexChatUIConfig', () => {
  let tempCodexHome: string;
  const originalCodexHome = process.env.CODEX_HOME;

  beforeEach(() => {
    tempCodexHome = fs.mkdtempSync(path.join(os.tmpdir(), 'codexian-models-'));
    process.env.CODEX_HOME = tempCodexHome;
  });

  afterEach(() => {
    if (originalCodexHome === undefined) {
      delete process.env.CODEX_HOME;
    } else {
      process.env.CODEX_HOME = originalCodexHome;
    }
    fs.rmSync(tempCodexHome, { recursive: true, force: true });
  });

  function writeModelCache(): void {
    fs.writeFileSync(path.join(tempCodexHome, 'models_cache.json'), JSON.stringify({
      models: [
        {
          slug: 'gpt-5.4',
          display_name: 'gpt-5.4',
          description: 'Strong model for everyday coding.',
          visibility: 'list',
          priority: -1,
          additional_speed_tiers: ['fast'],
        },
        {
          slug: 'gpt-5.5',
          display_name: 'GPT-5.5',
          description: 'Frontier model for complex coding, research, and real-world work.',
          visibility: 'list',
          priority: 0,
          additional_speed_tiers: ['fast'],
        },
        {
          slug: 'codex-auto-review',
          display_name: 'Codex Auto Review',
          visibility: 'hide',
          priority: 29,
        },
      ],
    }));
  }

  describe('getModelOptions', () => {
    it('should return default models when no env vars', () => {
      const options = codexChatUIConfig.getModelOptions({});
      expect(options).toHaveLength(5);
      expect(options.map(o => o.value)).toContain('gpt-5.5');
      expect(options.map(o => o.value)).toContain('gpt-5.4');
      expect(options.map(o => o.value)).toContain('gpt-5.4-mini');
    });

    it('should include visible models from the local Codex model cache', () => {
      writeModelCache();
      const options = codexChatUIConfig.getModelOptions({});
      expect(options.map(o => o.value)).toContain('gpt-5.5');
      expect(options.map(o => o.value)).not.toContain('codex-auto-review');
      expect(options.find(o => o.value === 'gpt-5.5')?.description).toBe(
        'Frontier model for complex coding, research, and real-world work.',
      );
    });

    it('should prepend the model from Codex config', () => {
      fs.writeFileSync(path.join(tempCodexHome, 'config.toml'), 'model = "gpt-5.5"\n');
      const options = codexChatUIConfig.getModelOptions({});
      expect(options[0]).toMatchObject({
        value: 'gpt-5.5',
        description: 'Codex config',
      });
    });

    it('should prepend custom model from OPENAI_MODEL env var', () => {
      const options = codexChatUIConfig.getModelOptions({
        environmentVariables: 'OPENAI_MODEL=my-custom-model',
      });
      expect(options[0].value).toBe('my-custom-model');
      expect(options[0].description).toBe('Custom (env)');
      expect(options.length).toBe(6);
    });

    it('should not duplicate when OPENAI_MODEL matches a default model', () => {
      const options = codexChatUIConfig.getModelOptions({
        environmentVariables: 'OPENAI_MODEL=gpt-5.4',
      });
      expect(options.filter(option => option.value === 'gpt-5.4')).toHaveLength(1);
    });
  });

  describe('isAdaptiveReasoningModel', () => {
    it('should return true for all models', () => {
      expect(codexChatUIConfig.isAdaptiveReasoningModel('gpt-5.4')).toBe(true);
      expect(codexChatUIConfig.isAdaptiveReasoningModel('unknown-model')).toBe(true);
    });
  });

  describe('getReasoningOptions', () => {
    it('should return effort levels', () => {
      const options = codexChatUIConfig.getReasoningOptions('gpt-5.4');
      expect(options).toHaveLength(4);
      expect(options.map(o => o.value)).toEqual(['low', 'medium', 'high', 'xhigh']);
    });
  });

  describe('getDefaultReasoningValue', () => {
    it('should return medium for all models', () => {
      expect(codexChatUIConfig.getDefaultReasoningValue('gpt-5.4')).toBe('medium');
    });
  });

  describe('getContextWindowSize', () => {
    it('should return 200000 for all models', () => {
      expect(codexChatUIConfig.getContextWindowSize('gpt-5.4')).toBe(200_000);
    });
  });

  describe('isDefaultModel', () => {
    it('should return true for built-in models', () => {
      expect(codexChatUIConfig.isDefaultModel('gpt-5.5')).toBe(true);
      expect(codexChatUIConfig.isDefaultModel('gpt-5.4')).toBe(true);
      expect(codexChatUIConfig.isDefaultModel('gpt-5.4-mini')).toBe(true);
    });

    it('should return false for custom models', () => {
      expect(codexChatUIConfig.isDefaultModel('my-custom-model')).toBe(false);
    });
  });

  describe('normalizeModelVariant', () => {
    it('should return model as-is', () => {
      expect(codexChatUIConfig.normalizeModelVariant('gpt-5.4', {})).toBe('gpt-5.4');
      expect(codexChatUIConfig.normalizeModelVariant('custom', {})).toBe('custom');
    });
  });

  describe('getCustomModelIds', () => {
    it('should return custom model from env', () => {
      const ids = codexChatUIConfig.getCustomModelIds({ OPENAI_MODEL: 'my-model' });
      expect(ids.has('my-model')).toBe(true);
    });

    it('should not include default models', () => {
      const ids = codexChatUIConfig.getCustomModelIds({ OPENAI_MODEL: 'gpt-5.4' });
      expect(ids.size).toBe(0);
    });

    it('should return empty set when no OPENAI_MODEL', () => {
      const ids = codexChatUIConfig.getCustomModelIds({});
      expect(ids.size).toBe(0);
    });
  });

  describe('getServiceTierToggle', () => {
    it('should expose fast mode for models with a fast tier in the Codex catalog', () => {
      writeModelCache();
      expect(codexChatUIConfig.getServiceTierToggle?.({ model: 'gpt-5.5' })).not.toBeNull();
    });

    it('should hide fast mode for models without a fast tier', () => {
      writeModelCache();
      expect(codexChatUIConfig.getServiceTierToggle?.({ model: 'gpt-5.4-mini' })).toBeNull();
    });
  });

  describe('getPermissionModeToggle', () => {
    it('should return yolo/safe toggle config with plan mode', () => {
      const toggle = codexChatUIConfig.getPermissionModeToggle!();
      expect(toggle).toEqual({
        inactiveValue: 'normal',
        inactiveLabel: 'Safe',
        activeValue: 'yolo',
        activeLabel: 'YOLO',
        planValue: 'plan',
        planLabel: 'Plan',
      });
    });
  });
});
