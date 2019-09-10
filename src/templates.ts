import * as vscode from 'vscode';

export function head(stylesheet: vscode.Uri): string {
    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="${stylesheet}">
            </head>
            <body>
                <script>
                    const vscode = acquireVsCodeApi();
                    // Handle vs extension message passing
                    function handleMessageSending(messageText, messageCommand, messageArguments) {
                        vscode.postMessage({
                            command: messageCommand,
                            text: messageText,
                            args: messageArguments
                        });
                    }
                    function collapseDiv(divID) {
                        selectedDiv = document.getElementById(divID);
                        if (selectedDiv.style.display === "none") {
                            selectedDiv.style.display = "block";
                        } else {
                            selectedDiv.style.display = "none";
                        }
                    }
                </script>
                <!-- We close body tags in the rest of the templates -->
    `;
}

export function article(id: string, data: {[k: string]: any}, time: string, link: string): string {
    if (!data || data === undefined) {
        return ``;
    }

    return `
        <div id="${data.id}" class="hn-post">
            <p>${id}: <a href="${data.url}"><strong>${data.title}</strong></a> (${link})<br/>
                ${data.score} points by: ${data.by} ${time} ago | <a href="#" onclick="handleMessageSending('View comments', 'comments', ${data.id})">${data.descendants} comments</a></p>
        </div>
    `;
}

export function selfPost(id: string, data: {[k: string]: any}, time: string): string {
    if (!data || data === undefined) {
        return ``;
    }

    return `
        <div id="${data.id}" class="hn-selfpost">
            <p>${id}: <a href="#" onclick="handleMessageSending('View comments', 'comments', ${data.id})"><strong>${data.title}</strong></a><br/>
                ${data.score} points by: ${data.by} ${time} ago | <a href="#" onclick="handleMessageSending('View comments', 'comments', ${data.id})">${data.descendants} comments</a></p>
        </div>
    `;
}

export function tail() {
    return `
        </body>
        </html>
    `;
}