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
    return new Promise((resolve, reject) => {
        web.get(baselink + "/" + version + "/" + "topstories.json?print=pretty").then(response => {
            resolve(response);
        }).catch(error => {
            reject(error.message)
        })
    });
}

function getItem(id) {
    return new Promise((resolve, reject) => {
        web.get(baselink + "/" + version + "/" + "item/" + id + ".json?print=pretty").then(response => {
            resolve(response);
        }).catch(error => {
            reject(error.message)
        });
    })
}

module.exports = {
    getTrending
}