import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { parse as parseToml } from 'smol-toml';

import { getRuntimeEnvironmentVariables } from '../../core/providers/providerEnvironment';
import type { ProviderUIOption } from '../../core/providers/types';

interface CodexModelCatalogEntry {
  slug?: unknown;
  display_name?: unknown;
  description?: unknown;
  visibility?: unknown;
  priority?: unknown;
  additional_speed_tiers?: unknown;
}

const FALLBACK_CODEX_MODELS: ProviderUIOption[] = [
  { value: 'gpt-5.4-mini', label: 'GPT-5.4 Mini', description: 'Fast' },
  { value: 'gpt-5.5', label: 'GPT-5.5', description: 'Latest' },
  { value: 'gpt-5.4', label: 'GPT-5.4', description: 'Previous' },
  { value: 'gpt-5.3-codex', label: 'GPT-5.3 Codex' },
  { value: 'gpt-5.2', label: 'GPT-5.2' },
];

const FALLBACK_FAST_TIER_MODELS = new Set(['gpt-5.5', 'gpt-5.4']);

function getCodexHome(): string {
  return process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
}

function canReadLocalCodexState(): boolean {
  return process.env.NODE_ENV !== 'test' || Boolean(process.env.CODEX_HOME);
}

function titleCaseModelId(model: string): string {
  return model
    .split(/([-_])/)
    .map(part => (/^[a-z]+$/i.test(part) ? part.toUpperCase() : part))
    .join('')
    .replace(/-/g, '-')
    .replace(/_/, ' ');
}

function readCodexConfigModel(): string | null {
  if (!canReadLocalCodexState()) {
    return null;
  }

  try {
    const configPath = path.join(getCodexHome(), 'config.toml');
    const parsed = parseToml(fs.readFileSync(configPath, 'utf8'));
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const model = (parsed as Record<string, unknown>).model;
      return typeof model === 'string' && model.trim() ? model.trim() : null;
    }
  } catch {
    // Missing or invalid Codex config should not break the model picker.
  }
  return null;
}

function readCodexModelCatalog(): CodexModelCatalogEntry[] {
  if (!canReadLocalCodexState()) {
    return [];
  }

  try {
    const cachePath = path.join(getCodexHome(), 'models_cache.json');
    const parsed = JSON.parse(fs.readFileSync(cachePath, 'utf8')) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return [];
    }
    const models = (parsed as { models?: unknown }).models;
    return Array.isArray(models) ? models as CodexModelCatalogEntry[] : [];
  } catch {
    return [];
  }
}

function catalogEntryToOption(entry: CodexModelCatalogEntry): ProviderUIOption | null {
  if (typeof entry.slug !== 'string' || !entry.slug.trim()) {
    return null;
  }
  if (entry.visibility === 'hide') {
    return null;
  }

  const label = typeof entry.display_name === 'string' && entry.display_name.trim()
    ? entry.display_name.trim()
    : titleCaseModelId(entry.slug);
  const description = typeof entry.description === 'string' && entry.description.trim()
    ? entry.description.trim()
    : undefined;

  return { value: entry.slug.trim(), label, description };
}

function appendUnique(options: ProviderUIOption[], option: ProviderUIOption): void {
  if (!options.some(existing => existing.value === option.value)) {
    options.push(option);
  }
}

export function getCodexDefaultModelIds(): Set<string> {
  const ids = new Set(FALLBACK_CODEX_MODELS.map(model => model.value));
  for (const entry of readCodexModelCatalog()) {
    if (typeof entry.slug === 'string' && entry.slug.trim() && entry.visibility !== 'hide') {
      ids.add(entry.slug.trim());
    }
  }
  const configuredModel = readCodexConfigModel();
  if (configuredModel) {
    ids.add(configuredModel);
  }
  return ids;
}

export function getCodexModelOptions(settings: Record<string, unknown>): ProviderUIOption[] {
  const envVars = getRuntimeEnvironmentVariables(settings, 'codex');
  const options: ProviderUIOption[] = [];

  if (envVars.OPENAI_MODEL) {
    appendUnique(options, {
      value: envVars.OPENAI_MODEL,
      label: envVars.OPENAI_MODEL,
      description: 'Custom (env)',
    });
  }

  const configuredModel = readCodexConfigModel();
  if (configuredModel) {
    appendUnique(options, {
      value: configuredModel,
      label: titleCaseModelId(configuredModel),
      description: 'Codex config',
    });
  }

  for (const option of readCodexModelCatalog()
    .slice()
    .sort((a, b) => (Number(a.priority) || 0) - (Number(b.priority) || 0))
    .map(catalogEntryToOption)
    .filter((option): option is ProviderUIOption => option !== null)) {
    appendUnique(options, option);
  }

  for (const option of FALLBACK_CODEX_MODELS) {
    appendUnique(options, option);
  }

  return options;
}

export function codexModelSupportsFastServiceTier(model: string | undefined): boolean {
  if (!model) {
    return false;
  }

  for (const entry of readCodexModelCatalog()) {
    if (
      entry.slug === model
      && Array.isArray(entry.additional_speed_tiers)
      && entry.additional_speed_tiers.includes('fast')
    ) {
      return true;
    }
  }

  return FALLBACK_FAST_TIER_MODELS.has(model);
}
