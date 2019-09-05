// Viewer.js creates the views for the extension, based off of templates.js

const templates = require("./templates");
const api = require("./api");

let stylesheetPath;

function createFrontView() {
    return new Promise((resolve, reject) => {
        api.getTrending().then(response => {
            let html = templates.head();
            for(let item in response) {
                html += templates.article(item, response[item]);
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