// This JS file provides all HTML templates for use with HNCode.

function head(stylesheet) {
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
                    function handleMessageSending(messageText, messageCommand) {
                        vscode.postMessage({
                            command: messageCommand,
                            text: messageText
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
    `
}

function article(id, data, time) {
    if (!data || data === undefined) {
        return ``;
    }

    return `
    <div id="${data.id}" class="hn-post">
        <p>${id}: <a href="${data.url}"><strong>${data.title}</strong></a><br/>
            ${data.score} points by: ${data.by} ${time} ago | ${data.descendants} comments</p>
    </div>
`;
}

function tail() {
    return `
        </body>
        </html>
    `
}

module.exports = {
    head,
    article,
    tail
}