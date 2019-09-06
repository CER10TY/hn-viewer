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
                // HN API provides time in seconds; JS wants it in milliseconds
                let createTime = new Date(response[item].time * 1000);
                // Multiply us up to minutes
                humanTime = (Date.now() - createTime) / (1000 * 60);
                // If we have more than 60 mins divide by 60 to get hours.
                if (humanTime > 60) {
                    humanTime = Math.floor(humanTime / 60);
                    humanTime += " hours";
                } else {
                    humanTime = Math.floor(humanTime);
                    humanTime += " minutes";
                }

                let linkRe = /\/\/([a-zA-Z\.]*)\//m;
                let links = response[item].url.match(linkRe);
                html += templates.article(item, response[item], humanTime, links[1]);
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