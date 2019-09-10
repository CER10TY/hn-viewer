import * as vscode from 'vscode';
import * as path from 'path';
import { appendFile } from 'fs';
import { getTrending } from './api';
import { setStylesheetPath, createFrontView, createCommentView } from './viewer';
import { create } from 'domain';

let config = vscode.workspace.getConfiguration("hncode");

export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.hackerNews', () => {
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
				}
			}
		);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
