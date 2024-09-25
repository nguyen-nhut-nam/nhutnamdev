import Http from "./Http";
import Configs from "./Configs";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameGetLeaderBoard extends cc.Component {

    public static instance: GameGetLeaderBoard = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    public static getInstance(): GameGetLeaderBoard {
        if (this.instance == null) {
            this.instance = new GameGetLeaderBoard();
        }
        return this.instance;
    }

    public getGameLeaderBoard(gameName, dateType, cb) {
        let params = {
            "c": 4108, "boardName": gameName, "pageIndex": 1, "pageSize": 10, type: dateType
        };
        Http.get(Configs.App.API, params, (err, json) => {
            if(err == null) {
                cb(json);
            } else {
                cb(err);
            }
        })
    }

}
