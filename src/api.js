// API.js pulls data from the HN FireBase API.

const axios = require("axios");
const vscode = require("vscode");

let config = vscode.workspace.getConfiguration("hncode");

const web = axios.create({
   timeout: config.requestTimeout 
});

const baselink = "https://hacker-news.firebaseio.com";
const version = "v0";

function getTrending() {
    let items = {};
    return new Promise((resolve, reject) => {
        web.get(baselink + "/" + version + "/" + "topstories.json?print=pretty").then(response => {
            let promises = [];
            for (let story in response.data) {
                let promise = axios({
                    method: 'get',
                    url: getItemURL(response.data[story])
                });
                promises.push(promise);
            }
            
            Promise.all(promises).then(responses => {
                responses.forEach(response => {
                    items[response.data.id] = response.data;
                });
                resolve(items);
            });
        }).catch(error => {
            reject(error.message);
        });
    });
}

function getItemURL(id) {
    return baselink + "/" + version + "/" + "item/" + id + ".json?print=pretty";
}

module.exports = {
    getTrending,
    getItemURL
}