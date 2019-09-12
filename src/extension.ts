import * as vscode from 'vscode';
import * as path from 'path';
import { setStylesheetPath, createFrontView, createCommentView } from './viewer';

export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.hackerNews', () => {

		let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("hncode");
		
		// The code you place here will be executed every time your command is executed
		let panel = vscode.window.createWebviewPanel(
			"hackernews",
			config.title,
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.file(path.join(context.extensionPath, "public"))
				]
			}
		);

		let stylesheet: vscode.Uri = vscode.Uri.file(
			path.join(context.extensionPath, "public", "hncode.css")
		).with({ scheme: "vscode-resource" });
		setStylesheetPath(stylesheet);

		createFrontView().then(response => {
			panel.webview.html = response;
		});

		panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case "frontpage":
						createFrontView().then(response => {
							panel.webview.html = response;
						});
						break;
					case "comments": 
						createCommentView(message.args).then(response => {
							panel.webview.html = response;
						});
						break;
					case "childComments":
						console.log(message);
						// We have panel.webview.html available to us
						// Maybe append
				}
			}
		);

		vscode.workspace.onDidChangeConfiguration(change => {
			if (change.affectsConfiguration("hncode")) {
				// We need to reopen if title is changed
				if (config.title !== vscode.workspace.getConfiguration("hncode").title) {
					vscode.window.showInformationMessage(
						'Reopen HNCode for Configuration Changes to take effect.',
						'Reopen'
					).then(selectedAction => {
						if (selectedAction === 'Reopen') {
							panel.dispose();
							vscode.commands.executeCommand("extension.hackerNews");
						}
					});
				}
				// Reload front view if limitations change
				if (config.limitation !== vscode.workspace.getConfiguration("hncode").limitation) {
					panel.dispose();
					vscode.commands.executeCommand("extension.hackerNews");
				}
			}
			config = vscode.workspace.getConfiguration("hncode");
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
