import { getDefaultHiddenProviderCommands } from '../../core/providers/commands/hiddenCommands';
import { type ClaudianSettings } from '../../core/types/settings';
import { DEFAULT_CLAUDE_PROVIDER_SETTINGS } from '../../providers/claude/settings';
import { DEFAULT_CODEX_PROVIDER_SETTINGS } from '../../providers/codex/settings';

export const DEFAULT_CLAUDIAN_SETTINGS: ClaudianSettings = {
  userName: '',

  permissionMode: 'yolo',

  model: 'gpt-5.4-mini',
  thinkingBudget: 'off',
  effortLevel: 'medium',
  serviceTier: 'default',
  enableAutoTitleGeneration: true,
  titleGenerationModel: '',

  excludedTags: [],
  mediaFolder: '',
  systemPrompt: '',
  persistentExternalContextPaths: [],

  sharedEnvironmentVariables: '',
  envSnippets: [],
  customContextLimits: {},

  keyboardNavigation: {
    scrollUpKey: 'w',
    scrollDownKey: 's',
    focusInputKey: 'i',
  },

  locale: 'en',

  providerConfigs: {
    claude: { ...DEFAULT_CLAUDE_PROVIDER_SETTINGS },
    codex: { ...DEFAULT_CODEX_PROVIDER_SETTINGS, enabled: true },
  },

  settingsProvider: 'codex',
  savedProviderModel: { codex: 'gpt-5.4-mini' },
  savedProviderEffort: { codex: 'medium' },
  savedProviderServiceTier: {},
  savedProviderThinkingBudget: {},

  lastCustomModel: '',

  maxTabs: 3,
  tabBarPosition: 'input',
  enableAutoScroll: true,
  openInMainTab: false,

  hiddenProviderCommands: getDefaultHiddenProviderCommands(),
};
