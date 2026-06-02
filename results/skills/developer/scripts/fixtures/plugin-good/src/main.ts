import { Notice, Plugin } from 'obsidian';

export default class CleanExample extends Plugin {
	async onload(): Promise<void> {
		this.addCommand({
			id: 'show-notice',
			name: 'Show a notice',
			callback: () => {
				new Notice('Hello');
			},
		});
		this.registerInterval(window.setInterval(() => this.tick(), 60000));
	}

	private tick(): void {
		const file = this.app.workspace.getActiveFile();
		if (file) {
			this.app.workspace.trigger('clean-example:tick');
		}
	}
}
