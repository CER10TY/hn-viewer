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
                if (promises.length >= config.limitation) {
                    break;
                }
            }
            
            Promise.all(promises).then(responses => {
                let count = 1;
                responses.forEach(response => {
                    items[count] = response.data;
                    count += 1;
                });
                resolve(items);
            }).catch(error => {
                reject(error.message);
            });
        }).catch(error => {
            reject(error.message);
        });
    });
}

function getComments(kids, isTopLevel) {
    let items = {};
    return new Promise((resolve, reject) => {
        let promises = [];
        for (let id in kids) {
            let promise = axios({
                method: 'get',
                url: getItemURL(kids[id])
            });
            promises.push(promise);
        }

        Promise.all(promises).then(responses => {
            responses.forEach(response => {
                items[response.data.id] = response.data;
            });
            resolve(items);
        }).catch(error => {
            reject(error.message);
        });
    });
}

function getItem(id) {
    return new Promise((resolve, reject) => {
        let url = getItemURL(id);
        web.get(url).then(response => {
            resolve(response.data);
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
    getComments,
    getItem,
    getItemURL
}