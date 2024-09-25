// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LobbyTabsListLobbyGame extends cc.Component {
    @property(cc.Label)
    lblTagGame = null;
    @property(cc.Node)
    ALL = [];
    @property(cc.Node)
    SLOT = [];
    @property(cc.Node)
    MINI = [];
    @property(cc.Node)
    LIVE = [];
    @property(cc.Node)
    CARDGAME = [];
    @property(cc.Node)
    SOXO = [];

    private onToggleCategoryGame(event) {
        if (event.node.name === 'ALL') {
            this._activeIconGame(this.ALL);
            this.lblTagGame.string = "TẤT CẢ";
        } else if (event.node.name === 'SLOT') {
            this._hideAllIconGame();
            this._activeIconGame(this.SLOT);
            this.lblTagGame.string = event.node.name;
        } else if (event.node.name === 'MINIGAME') {
            this._hideAllIconGame();
            this._activeIconGame(this.MINI);
            this.lblTagGame.string = event.node.name;
        } else if (event.node.name === 'LIVE') {
            this._hideAllIconGame();
            this._activeIconGame(this.LIVE);
            this.lblTagGame.string = event.node.name;
        } else if (event.node.name === 'SOXO') {
            this._hideAllIconGame();
            this._activeIconGame(this.SOXO);
            this.lblTagGame.string = "QUAY SỐ";
        } else if (event.node.name === 'CARD') {
            this._hideAllIconGame();
            this._activeIconGame(this.CARDGAME);
            this.lblTagGame.string = "GAME BÀI";
        }
    }

    private _hideAllIconGame() {
        for (let i = 0; i < this.ALL.length; i++) {
            if(this.ALL[i]) {
                this.ALL[i].active = false;
            }
        }
    }

    private _activeIconGame(list) {
        for (let i = 0; i < list.length; i++) {
            if(list[i]) {
                if(list[i].hasOwnProperty('_hide')) {
                    list[i].active = list[i]['_hide'];
                } else {
                    list[i].active = true;
                }
            }
        }
    }
}
