import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Configs from "../../../scripts/common/Configs";
import Http from "../../../scripts/common/Http";
import Utils from "../../../scripts/common/Utils";
import GameName from "../../../scripts/enum/GameName";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class PopupJackpotHistory extends Dialog {
    @property(cc.Label)
    lblPage: cc.Label = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    @property({type: cc.AudioClip})
    soundClick: cc.AudioClip = null;
    @property(cc.Node)
    pageHistory = null;
    @property(cc.Node)
    pageDetail = null;
    @property(cc.Node)
    columns = null;
    @property(cc.Node)
    linesWin = null;
    @property(cc.Label)
    lblSessionID = null;
    @property(cc.SpriteAtlas)
    spriteAtlasIcon = null;
    @property(cc.Node)
    columnWild = null;
    @property([sp.SkeletonData])
    listAnimFB = [];

    private soundSlotState = null;

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();
    private _currentSelectedHistory = null;
    private _listHistory = [];
    private _listLinesWin = [];
    private _listMatrix = [];

    private readonly mapLine = [
        [5, 6, 7, 8, 9],//1
        [0, 1, 2, 3, 4],//2
        [10, 11, 12, 13, 14],//3
        [10, 6, 2, 8, 14],//4
        [0, 6, 12, 8, 4],//5
        [5, 1, 2, 3, 9],//6
        [5, 11, 12, 13, 9],//7
        [0, 1, 7, 13, 14],//8
        [10, 11, 7, 3, 4],//9
        [5, 11, 7, 3, 9],//10
        [5, 1, 7, 13, 9],//11
        [0, 6, 7, 8, 4],//12
        [10, 6, 7, 8, 14],//13
        [0, 6, 2, 8, 4],//14
        [10, 6, 12, 8, 14],//15
        [5, 6, 2, 8, 9],//16
        [5, 6, 12, 8, 9],//17
        [0, 1, 12, 3, 4],//18
        [10, 11, 2, 13, 14],//19
        [0, 11, 12, 13, 4],//20
        [10, 1, 2, 3, 14],//21
        [5, 1, 12, 3, 9],//22
        [5, 11, 2, 13, 9],//23
        [0, 11, 2, 13, 4],//24
        [10, 1, 12, 3, 14]//25
    ];

    private _itemPrefix = "0_";
    private readonly wildItemId = 2;
    private columnsWild = [];

    show() {
        if (this.canPlaySound()) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        super.show();

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        if (this.itemTemplate != null) this.itemTemplate.active = false;
    }

    dismiss() {
        if (this.canPlaySound()) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        super.dismiss();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        this.node.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.node.destroy();
                })
            )
        )
    }

    _onShowed() {
        super._onShowed();

        this.page = 1;
        this.maxPage = 1;
        this.lblPage.string = String(this.page);
        this.loadData();
        this.pageHistory.active = true;
        this.pageDetail.active = false;
    }

    actNextPage() {
        if (this.canPlaySound()) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.page < this.maxPage) {
            this.page++;
            this.lblPage.string = String(this.page);
            this.loadData();
        }
    }

    actPrevPage() {
        if (this.canPlaySound()) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.page > 1) {
            this.page--;
            this.lblPage.string = String(this.page);
            this.loadData();
        }
    }

    private loadData() {
        Http.get(Configs.App.API, {"c": 138, "p": this.page, "gn": GameName.BONG_LAI_CAC}, (err, res) => {
            if (err != null) return;
            if (!res["success"]) return;

            if (this.items.length == 0) {
                for (var i = 0; i < 10; i++) {
                    let item = cc.instantiate(this.itemTemplate);
                    item.parent = this.itemTemplate.parent;
                    item.active = false;
                    this.items.push(item);
                }
                this.itemTemplate.destroy();
                this.itemTemplate = null;
            }

            this.maxPage = res["totalPages"];
            this.lblPage.string = String(this.page);
            this._listHistory = res["results"];
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if (i < res["results"].length) {
                    let itemData = res["results"][i];
                    item.getChildByName("Time").getComponent(cc.Label).string = itemData["ts"].split(" ").join("\n");
                    item.getChildByName("Bet").getComponent(cc.Label).string = Utils.formatNumber(itemData["bv"]);
                    item.getChildByName("Account").getComponent(cc.Label).string = itemData["nn"];
                    item.getChildByName("Win").getComponent(cc.Label).string = Utils.formatNumber(itemData["pz"]);
                    let clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = this.node;
                    clickEventHandler.component = "SlotBLC.PopupJackpotHistory";
                    clickEventHandler.handler = "actShowDetail";
                    clickEventHandler.customEventData = itemData["rf"];
                    item.getChildByName("Detail").getComponent(cc.Button).clickEvents = [];
                    item.getChildByName("Detail").getComponent(cc.Button).clickEvents.push(clickEventHandler);
                    item.active = true;
                } else {
                    item.active = false;
                }
            }
        });
    }

    actShowDetail(event, data) {
        this.stopShowLinesWin();
        this.pageHistory.active = false;
        this.pageDetail.active = true;
        let sessionID = data;
        this.lblSessionID.string = `#${sessionID}`;
        this._currentSelectedHistory = this._listHistory.find(session => session.rf == sessionID);
        this._listLinesWin = this._currentSelectedHistory.lw.split(",");
        this._listMatrix = this._currentSelectedHistory.mx.split(",");
        this._itemPrefix = "1_";
        this.columnsWild = [];
        for (let j = 0; j < this._listMatrix.length; j++) {
            if (parseInt(this._listMatrix[j]) == this.wildItemId) {
                let c = j % 5;
                if (this.columnsWild.indexOf(c) == -1) this.columnsWild.push(c);
            }
        }
        for(let i = 0 ; i < this.columnWild.childrenCount - 1; i++) {
            this.columnWild.children[i].active = false;
        }
        for(let i = 0 ; i < this.columnsWild.length; i++) {
            this.columnWild.children[this.columnsWild[i]].active = true;
        }

        for (let i = 0; i < this.columns.childrenCount; i++) {
            let roll = this.columns.children[i];
            var children = roll.children;
            this.setupIconById(children[2], parseInt(this._listMatrix[i]));
            this.setupIconById(children[1], parseInt(this._listMatrix[5 + i]));
            this.setupIconById(children[0], parseInt(this._listMatrix[10 + i]));
        }
        this.showLineWins();
    }

    setupIconById(nodeItem, id) {
        let sprite = nodeItem.getChildByName("sprite");
        let nodeSkeleton = nodeItem.getChildByName("skeleton");
        let skeleton = nodeSkeleton.getComponent(sp.Skeleton);
        sprite.active = false;
        switch(id) {
            case 3:
                sprite.active = false;
                nodeSkeleton.active = true;
                skeleton.skeletonData = this.listAnimFB[0];
                skeleton.setAnimation(0, 'animation', true);
                break;
            default:
                sprite.active = true;
                nodeSkeleton.active = false;
                sprite.getComponent(cc.Sprite).spriteFrame = this.spriteAtlasIcon.getSpriteFrame(`symbol_${this._itemPrefix}${id}`);
        }
    }

    canPlaySound() {
        return GameConfigManager.getInstance().enableSound;
    }

    private showLineWins() {
        this.linesWin.stopAllActions();
        this._listLinesWin = Utils.removeDups(this._listLinesWin);
        for (let i = 0; i < this._listLinesWin.length; i++) {
            if (this._listLinesWin[i] == "0") {
                this._listLinesWin.splice(i, 1);
                i--;
            }
        }
        if(this._listLinesWin[0] == '') {
            return;
        }
        let linesWinChildren = this.linesWin.children;
        let rolls = this.columns.children;
        let actions = [];
        for (let i = 0; i < linesWinChildren.length; i++) {
            linesWinChildren[i].active = this._listLinesWin.indexOf("" + (i + 1)) >= 0;
        }
        actions.push(cc.delayTime(1.5));
        actions.push(cc.callFunc(function () {
            for (let i = 0; i < linesWinChildren.length; i++) {
                linesWinChildren[i].active = false;
            }
        }));
        actions.push(cc.delayTime(1));
        for (let i = 0; i < this._listLinesWin.length; i++) {
            let lineIdx = parseInt(this._listLinesWin[i]) - 1;
            let line = linesWinChildren[lineIdx];
            actions.push(cc.callFunc(() => {
                // console.log("================: " + lineIdx);
                line.active = true;
                line.opacity = 0;
                line.runAction(
                    cc.sequence(
                        cc.fadeIn(0.5),
                        cc.delayTime(0.5),
                        cc.fadeOut(0.5),
                    )
                );
                let mLine = this.mapLine[lineIdx];
                for (let j = 0; j < 5; j++) {
                    let itemRow = parseInt((mLine[j] / 5).toString());
                    if(!this.columnWild.children[j].active) {
                        rolls[j].children[2 - itemRow].getChildByName('khung_ketqua').active = true;
                        rolls[j].children[2 - itemRow].stopAllActions();
                        rolls[j].children[2 - itemRow].runAction(
                            cc.callFunc(() => {
                                this.runAnimationSpine(rolls[j].children[2-itemRow]);
                            }),
                        );
                    }
                }
            }));
            actions.push(cc.delayTime(2));
            actions.push(cc.callFunc(() => {
                line.active = false;
                for(let i = 0; i < 5 ; i++) {
                    rolls[i].children.forEach(child => child.children[2].active = false);
                }
            }));
            actions.push(cc.delayTime(1));
        }
        if (actions.length == 0) {
            actions.push(cc.callFunc(() => {
                //fixed call cc.sequence.apply
            }))
        }
        this.linesWin.runAction(cc.sequence.apply(null, actions));
    }

    runAnimationSpine(nodeItem) {
        let nodeSkeletonBig = nodeItem.getChildByName("skeleton");
        let skeletonBig = nodeSkeletonBig.getComponent(sp.Skeleton);
        if(nodeSkeletonBig.active) {
            skeletonBig.setAnimation(0, skeletonBig.animation, false);
        }
    }

    private stopShowLinesWin() {
        this.linesWin.stopAllActions();
        for (var i = 0; i < this.linesWin.childrenCount; i++) {
            this.linesWin.children[i].active = false;
        }
        for (var i = 0; i < this.columnWild.childrenCount; i++) {
            this.columnWild.children[i].active = false;
        }
        this.stopAllItemEffect();
    }

    private stopAllItemEffect() {
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let children = this.columns.children[i].children;
            children[0].stopAllActions();
            children[1].stopAllActions();
            children[2].stopAllActions();

            children[0].runAction(cc.scaleTo(0.1, 1));
            children[1].runAction(cc.scaleTo(0.1, 1));
            children[2].runAction(cc.scaleTo(0.1, 1));
        }
    }

    actBackFromDetail() {
        this.pageHistory.active = true;
        this.pageDetail.active = false;
    }
}

export default PopupJackpotHistory;