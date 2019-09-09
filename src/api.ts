import * as rm from 'typed-rest-client/RestClient';
import * as vscode from 'vscode';

let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("hncode");

const baselink: string = "https://hacker-news.firebaseio.com/";
const version: string = "v0";
let rest: rm.RestClient = new rm.RestClient('hn', baselink);

export async function getTrending (): Promise<Object> {
    return new Promise<Object>(async (resolve, reject) => {
        let items: {[k: string]: any} = {};
        let tops: rm.IRestResponse<Array<String>> = await rest.get<Array<String>>(version + '/topstories.json?print=pretty');
        let count: number = 0;
        
        if (tops.statusCode === 200 && tops.result) {
            tops.result.forEach(async element => {
                let story: rm.IRestResponse<JSON> = await rest.get<JSON>(version + '/item/' + element + '.json?print=pretty');
                items[count] = story;
            });
            resolve(items);
            console.log(items);
        } else {
            reject(tops.statusCode);
        }
    });
}

function getItemURL (id: string): string {
    return baselink + "/" + version + "/" + "item/" + id + ".json?print=pretty";
}