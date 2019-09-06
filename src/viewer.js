// Viewer.js creates the views for the extension, based off of templates.js

const templates = require("./templates");
const api = require("./api");

let stylesheetPath;

function createFrontView() {
    return new Promise((resolve, reject) => {
        api.getTrending().then(response => {
            let html = templates.head(stylesheetPath);
            for (let item in response) {
                let humanTime = convertTime(response[item].time);

                let linkRe = new RegExp('\/\/([a-zA-Z\.]*)\/', 'm');
                let url = response[item].url;
                if (url) {
                    let links = url.match(linkRe);
                    url = links[1];
                }
                html += templates.article(item, response[item], humanTime, url);
            }
            html += templates.tail();
            resolve(html);
        }).catch(error => {
            reject(error.message);
        });
    });
}

function createCommentView(id) {
    return new Promise((resolve, reject) => {
        // Get the story item first.
        api.getItem(id).then(response => {
            let html = templates.head(stylesheetPath);
            let humanTime = convertTime(response.time);

            let linkRe = /\/\/([a-zA-Z\.]*)\//m;
            let links = response.url.match(linkRe);

            html += templates.commentArticle(response, humanTime, links[1]);
            html += templates.hr();
            api.getComments(response.kids, true).then(response => {
                for (let item in response) {
                    let humanTime = convertTime(response[item].time);
                    html += templates.comment(response[item], humanTime);
                }
                html += templates.tail();
                resolve(html);
            });
        }).catch(error => {
            reject(error.message);
        });
    });
}

function setStylesheetPath(path) {
    stylesheetPath = path;
}

function convertTime(createTime) {
    let humanTime;
    // HN API provides time in seconds; JS wants it in milliseconds
    let createdTime = new Date(createTime * 1000);
    // Divide back to seconds
    humanTime = (Date.now() - createdTime) / 1000;

    // Now we technically need to go from minutes up till years, checking if > every time
    // According to this: https://stackoverflow.com/questions/6665997/switch-statement-for-greater-than-less-than if statements are the fastes way
    // So we trust blessed SO
    let unit = '';

    if (humanTime > 3.154 * Math.pow(10, 7)) {
        humanTime /= 3.154 * Math.pow(10, 7);
        unit = ' years';
    } else if (humanTime > 2.592 * Math.pow(10, 6)) {
        humanTime /= 2.592 * Math.pow(10, 6);
        unit = ' months';
    } else if (humanTime > 86400) {
        humanTime /= 86400;
        unit = ' days';
    } else if (humanTime > 3600) {
        humanTime /= 3600;
        unit = ' hours';
    } else if (humanTime > 60) {
        humanTime /= 60;
        unit = ' seconds';
    }

    humanTime = Math.floor(humanTime);
    humanTime += unit;

    return humanTime;
}

module.exports = {
    createFrontView,
    createCommentView,
    convertTime,
    setStylesheetPath
}