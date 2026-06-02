import fs from 'fs';
import moment from 'moment';
import { FileSystemAdapter, MarkdownRenderer, Plugin, PluginSettingTab, requestUrl } from 'obsidian';

const vaultName = app.vault.getName();

export default class MyPlugin extends Plugin {
	async onload(): Promise<void> {
		var legacy = vaultName;
		const el = document.createElement('div');
		el.innerHTML = `<b>${legacy}</b>`;
		el.innerHTML = '';
		el.innerHTML = '<b>static</b>';
		el.style.color = 'red';
		console.log('loaded', moment().format());
		window.app.workspace.trigger('noisy-example:loaded');
		app.workspace.getActiveFile();

		this.addCommand({
			id: 'noisy-example-run',
			name: 'Noisy Example run',
			hotkeys: [{ modifiers: ['Mod'], key: 'j' }],
			callback: async () => {
				await fetch('https://example.com/data.json');
				await requestUrl({ url: 'https://example.com/other.json' });
				const leaf = this.app.workspace.activeLeaf as any;
				const adapter = this.app.vault.adapter as FileSystemAdapter;
				const found = this.app.vault.getFiles().find((file) => file.path === 'a.md');
				if (found) {
					await this.app.vault.modify(found, 'x');
					await this.app.vault.delete(found);
				}
				const pattern = /(?<=x)y/;
				const configured = '.obsidian/plugins/noisy-example';
				await MarkdownRenderer.renderMarkdown('# hi', el, configured, this);
				setInterval(() => pattern.test(process.platform), 1000);
				fs.existsSync(adapter.getBasePath());
				return leaf;
			},
		});
	}

	onunload(): void {
		this.app.workspace.detachLeavesOfType('noisy-example-view');
	}
}

class SampleSettingTab extends PluginSettingTab {
	display(): void {
		this.containerEl.empty();
		this.containerEl.createEl('h2', { text: 'Noisy Example' });
	}
}
