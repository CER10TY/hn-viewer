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
                let unixTime = Date.now() - response[item].time;
                let date = new Date(unixTime * 1000);
                if (date.getMinutes() > 60) {
                    humanTime = date.getHours() + " hours";
                } else {
                    humanTime = date.getMinutes() + " minutes";
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