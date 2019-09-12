import * as rm from 'typed-rest-client/RestClient';
import * as vscode from 'vscode';

import { KeyMap } from './interface';

let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("hncode");

const baselink: string = "https://hacker-news.firebaseio.com/";
const version: string = "v0";
let rest: rm.RestClient = new rm.RestClient('hn', baselink);

export async function getTrending (): Promise<KeyMap> {
    return new Promise<KeyMap>(async (resolve, reject) => {
        let items: KeyMap = {};
        await rest.get<Array<String>>(version + '/topstories.json?print=pretty')
        .then(response => {
            let count: number = 1;
            let promises: Array<Promise<KeyMap>> = [];
            if (response.statusCode === 200 && response.result) {
                for (let item in response.result) {
                    let fetch: Promise<KeyMap> = new Promise(async (resolve, reject) => {
                        if (response.result) {
                        let story: rm.IRestResponse<KeyMap> = await rest.get<KeyMap>(getItemURL(response.result[item]));
                        if (story.result) {
                            resolve(story.result);
                        } else {
                            reject();
                        }
                        } 
                    });
                    promises.push(fetch);
                    if (promises.length >= vscode.workspace.getConfiguration("hncode").limitation) {
                        break;
                    }
                }

                Promise.all(promises).then(responses => {
                    responses.forEach(response => {
                        if (response) {
                            items[count] = response;
                            count += 1;
                        }
                    });
                    resolve(items);
                }).catch(error => {
                    reject(error.message);
                });
            } else {
                reject(response.statusCode);
            }
        })
        .catch(error => {
            reject(error.message);
        });
    });
}

export async function getComments (kids: Array<string>): Promise<KeyMap> {
    return new Promise<KeyMap>(async (resolve, reject) => {
        let items: KeyMap = {};
        let promises: Array<Promise<KeyMap>> = [];

        for (let item in kids) {
            let fetch: Promise<KeyMap> = new Promise(async (resolve, reject) => {
                let story: rm.IRestResponse<KeyMap> = await rest.get<KeyMap>(getItemURL(kids[item]));
                if (story.result) {
                    resolve(story.result);
                } else {
                    reject();
                }
            });
            promises.push(fetch);
        }

        Promise.all(promises).then(responses => {
            responses.forEach(async response => {
                if (response) {
                    items[response.id] = response;
                }
            });
            resolve(items);
        }).catch(error => {
            reject(error.message);
        });
    });
}

export async function getItem (id: String | string): Promise<KeyMap> {
    return new Promise<KeyMap>(async (resolve, reject) => {
        let url: string = getItemURL(id);
        let story: rm.IRestResponse<KeyMap> = await rest.get<KeyMap>(url);
        if (story.result) {
            resolve(story.result);
        } else {
            reject();
        }
    });
}

function getItemURL (id: String | string): string {
    return baselink + "/" + version + "/" + "item/" + id + ".json?print=pretty";
}