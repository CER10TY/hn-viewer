export function head(stylesheet: string) {
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