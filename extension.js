// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const viewer = require('./src/viewer');
const api = require('./src/api');

let config = vscode.workspace.getConfiguration("hncode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.hackerNews', function () {
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

		viewer.setStylesheetPath(
			vscode.Uri.file(
				path.join(context.extensionPath, "public", "hncode.css")
			  ).with({ scheme: "vscode-resource" })
		);

		// viewer.createCommentView(8863).then(response => {
		// 	panel.webview.html = response;
		// });
		viewer.createFrontView().then(response => {
			panel.webview.html = response;
		});

		panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case "frontpage":
						viewer.createFrontView().then(response => {
							panel.webview.html = response;
						})
						break;
					case "comments":
						viewer.createCommentView(message.args).then(response => {
							panel.webview.html = response;
						});
						break;
				}
			}
		);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
