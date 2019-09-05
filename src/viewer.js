// Viewer.js creates the views for the extension, based off of templates.js

const templates = require("./templates");
const api = require("./api");

let stylesheetPath;

function createFrontView() {
    return new Promise((resolve) => {
        api.getTrending().then(response => {
            let html = templates.head(stylesheetPath);
            for(let item in response) {
                let humanTime;
                let createTime = new Date(response[item].time * 1000);
                humanTime = (Date.now() - createTime) / (1000 * 60);
                if (humanTime > 60) {
                    humanTime = Math.floor(humanTime / 60);
                    humanTime += " hours";
                } else {
                    humanTime = Math.floor(humanTime);
                    humanTime += " minutes";
                }

                html += templates.article(item, response[item], humanTime);
            }
            html += templates.tail();
            resolve(html);
        });
    });
}

function setStylesheetPath(path) {
    stylesheetPath = path;
}

module.exports = {
    createFrontView,
    setStylesheetPath
}