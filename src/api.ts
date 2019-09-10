import * as rm from 'typed-rest-client/RestClient';
import * as vscode from 'vscode';

let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("hncode");

const baselink: string = "https://hacker-news.firebaseio.com/";
const version: string = "v0";
let rest: rm.RestClient = new rm.RestClient('hn', baselink);

export async function getTrending (): Promise<{[k: string]: any}> {
    return new Promise<Object>(async (resolve, reject) => {
        let items: {[k: string]: any} = {};
        let tops: rm.IRestResponse<Array<String>> = await rest.get<Array<String>>(version + '/topstories.json?print=pretty');
        let count: number = 1;
        let promises: Array<Promise<JSON>> = [];
        
        if (tops.statusCode === 200 && tops.result) {
            for (let item in tops.result) {
                let fetch: Promise<JSON> = new Promise(async (resolve, reject) => {
                    if (tops.result) {
                       let story: rm.IRestResponse<JSON> = await rest.get<JSON>(version + '/item/' + tops.result[item] + '.json?print=pretty');
                       if (story.result) {
                           resolve(story.result);
                       } else {
                           reject();
                       }
                    } 
                });
                promises.push(fetch);
                if (promises.length > config.limitation) {
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
            });
        } else {
            reject(tops.statusCode);
        }
    });
}

function getItemURL (id: string): string {
    return baselink + "/" + version + "/" + "item/" + id + ".json?print=pretty";
}