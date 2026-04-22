import { Notice, setIcon } from 'obsidian';

import type {
  AppAgentManager,
  AppPluginManager,
} from '../../../core/providers/types';
import type { PluginInfo } from '../../../core/types';

export interface PluginSettingsManagerDeps {
  pluginManager: AppPluginManager;
  agentManager: Pick<AppAgentManager, 'loadAgents'>;
  restartTabs: () => Promise<void>;
}

export class PluginSettingsManager {
  private containerEl: HTMLElement;
  private pluginManager: AppPluginManager;
  private agentManager: Pick<AppAgentManager, 'loadAgents'>;
  private restartTabs: () => Promise<void>;

  constructor(containerEl: HTMLElement, deps: PluginSettingsManagerDeps) {
    this.containerEl = containerEl;
    this.pluginManager = deps.pluginManager;
    this.agentManager = deps.agentManager;
    this.restartTabs = deps.restartTabs;
    this.render();
  }

  private render() {
    this.containerEl.empty();

    const headerEl = this.containerEl.createDiv({ cls: 'codexian-plugin-header' });
    headerEl.createSpan({ text: 'Claude Code Plugins', cls: 'codexian-plugin-label' });

    const refreshBtn = headerEl.createEl('button', {
      cls: 'codexian-settings-action-btn',
      attr: { 'aria-label': 'Refresh' },
    });
    setIcon(refreshBtn, 'refresh-cw');
    refreshBtn.addEventListener('click', () => this.refreshPlugins());

    const plugins = this.pluginManager.getPlugins();

    if (plugins.length === 0) {
      const emptyEl = this.containerEl.createDiv({ cls: 'codexian-plugin-empty' });
      emptyEl.setText('No Claude Code plugins found. Enable plugins via the Claude CLI.');
      return;
    }

    const projectPlugins = plugins.filter(p => p.scope === 'project');
    const userPlugins = plugins.filter(p => p.scope === 'user');

    const listEl = this.containerEl.createDiv({ cls: 'codexian-plugin-list' });

    if (projectPlugins.length > 0) {
      const sectionHeader = listEl.createDiv({ cls: 'codexian-plugin-section-header' });
      sectionHeader.setText('Project Plugins');

      for (const plugin of projectPlugins) {
        this.renderPluginItem(listEl, plugin);
      }
    }

    if (userPlugins.length > 0) {
      const sectionHeader = listEl.createDiv({ cls: 'codexian-plugin-section-header' });
      sectionHeader.setText('User Plugins');

      for (const plugin of userPlugins) {
        this.renderPluginItem(listEl, plugin);
      }
    }
  }

  private renderPluginItem(listEl: HTMLElement, plugin: PluginInfo) {
    const itemEl = listEl.createDiv({ cls: 'codexian-plugin-item' });
    if (!plugin.enabled) {
      itemEl.addClass('codexian-plugin-item-disabled');
    }

    const statusEl = itemEl.createDiv({ cls: 'codexian-plugin-status' });
    if (plugin.enabled) {
      statusEl.addClass('codexian-plugin-status-enabled');
    } else {
      statusEl.addClass('codexian-plugin-status-disabled');
    }

    const infoEl = itemEl.createDiv({ cls: 'codexian-plugin-info' });

    const nameRow = infoEl.createDiv({ cls: 'codexian-plugin-name-row' });

    const nameEl = nameRow.createSpan({ cls: 'codexian-plugin-name' });
    nameEl.setText(plugin.name);

    const actionsEl = itemEl.createDiv({ cls: 'codexian-plugin-actions' });

    const toggleBtn = actionsEl.createEl('button', {
      cls: 'codexian-plugin-action-btn',
      attr: { 'aria-label': plugin.enabled ? 'Disable' : 'Enable' },
    });
    setIcon(toggleBtn, plugin.enabled ? 'toggle-right' : 'toggle-left');
    toggleBtn.addEventListener('click', () => this.togglePlugin(plugin.id));
  }

  private async togglePlugin(pluginId: string) {
    const plugin = this.pluginManager.getPlugins().find(p => p.id === pluginId);
    const wasEnabled = plugin?.enabled ?? false;

    try {
      await this.pluginManager.togglePlugin(pluginId);
      await this.agentManager.loadAgents();

      try {
        await this.restartTabs();
      } catch {
        new Notice('Plugin toggled, but some tabs failed to restart.');
      }

      new Notice(`Plugin "${pluginId}" ${wasEnabled ? 'disabled' : 'enabled'}`);
    } catch (err) {
      await this.pluginManager.togglePlugin(pluginId);
      const message = err instanceof Error ? err.message : 'Unknown error';
      new Notice(`Failed to toggle plugin: ${message}`);
    } finally {
      this.render();
    }
  }

  private async refreshPlugins() {
    try {
      await this.pluginManager.loadPlugins();
      await this.agentManager.loadAgents();

      new Notice('Plugin list refreshed');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      new Notice(`Failed to refresh plugins: ${message}`);
    } finally {
      this.render();
    }
  }

  public refresh() {
    this.render();
  }
}
