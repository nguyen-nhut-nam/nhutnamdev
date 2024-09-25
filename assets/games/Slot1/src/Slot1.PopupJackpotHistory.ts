import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Configs from "../../../scripts/common/Configs";
import Http from "../../../scripts/common/Http";
import Utils from "../../../scripts/common/Utils";
import GameName from "../../../scripts/enum/GameName";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupJackpotHistory extends Dialog {
    @property(cc.Label)
    lblPage: cc.Label = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    @property({ type: cc.AudioClip })
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
    @property(cc.ScrollView)
    scrollViewJackpot = null;

    private soundSlotState = null;

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();
    private _currentSelectedHistory = null;
    private _listHistory = [];
    private _listLinesWin = [];
    private _listMatrix = [];
    private mapLine = [
        [5, 6, 7, 8, 9],
        [0, 1, 2, 3, 4],
        [10, 11, 12, 13, 14],
        [5, 6, 2, 8, 9],
        [5, 6, 12, 8, 9],
        [0, 1, 7, 3, 4],
        [10, 11, 7, 13, 14],
        [0, 11, 2, 13, 4],
        [10, 1, 12, 3, 14],
        [5, 1, 12, 3, 9],
        [10, 6, 2, 8, 14],
        [0, 6, 12, 8, 4],
        [5, 11, 7, 3, 9],
        [5, 1, 7, 13, 9],
        [10, 6, 7, 8, 14],
        [0, 6, 7, 8, 4],
        [5, 11, 12, 13, 9],
        [5, 1, 2, 3, 9],
        [10, 11, 7, 3, 4],
        [0, 1, 7, 13, 14]
    ];

    private _prefix = "3_";

    show() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        super.show();

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        if (this.itemTemplate != null) this.itemTemplate.active = false;
        this.scrollViewJackpot.scrollToTop(.5);
    }

    dismiss() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        super.dismiss();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
    }

    _onShowed() {
        super._onShowed();

        this.page = 1;
        this.maxPage = 1;
        this.lblPage.string = this.page + "/" + this.maxPage;
        this.loadData();
    }

    actNextPage() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.page < this.maxPage) {
            this.page++;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadData();
            this.scrollViewJackpot.scrollToTop(.5);
        }
    }

    actPrevPage() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.page > 1) {
            this.page--;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadData();
            this.scrollViewJackpot.scrollToTop(.5);
        }
    }

    private loadData() {
        Http.get(Configs.App.API, { "c": 138, "p": this.page, "gn": GameName.LIEN_MINH}, (err, res) => {
            if (err != null) return;
            if (!res["success"]) return;

            if (this.items.length == 0) {
                for (var i = 0; i < 10; i++) {
                    let item = cc.instantiate(this.itemTemplate);
                    item.parent = this.itemTemplate.parent;
                    this.items.push(item);
                }
                this.itemTemplate.destroy();
                this.itemTemplate = null;
            }

            this.maxPage = res["totalPages"];
            this.lblPage.string = this.page + "/" + this.maxPage;
            this._listHistory = res["results"];
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if (i < res["results"].length) {
                    let itemData = res["results"][i];
                    item.getChildByName("Time").getComponent(cc.Label).string = itemData["ts"];
                    item.getChildByName("Bet").getComponent(cc.Label).string = Utils.formatNumber(itemData["bv"]);
                    item.getChildByName("Account").getComponent(cc.Label).string = itemData["nn"];
                    item.getChildByName("Win").getComponent(cc.Label).string = Utils.formatNumber(itemData["pz"]);
                    let clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = this.node;
                    clickEventHandler.component = "Slot1.PopupJackpotHistory";
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
        this.pageHistory.active = false;
        this.pageDetail.active = true;
        let sessionID = data;
        this.lblSessionID.string = `#${sessionID}`;
        this._currentSelectedHistory = this._listHistory.find(session => session.rf == sessionID);
        this._listLinesWin = this._currentSelectedHistory.lw.split(",");
        this._listMatrix = this._currentSelectedHistory.mx.split(",");
        switch (this._currentSelectedHistory.bv) {
            case 100:
                this._prefix = "1_";
                break;
            case 1000:
                this._prefix = "2_";
                break;
            case 10000:
                this._prefix = "3_";
                break;
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
        // Icon id = 0 = Jackpot => skeletonBig jackpot
        // Icon Id = 1 = Free Spin => skeletonBig free
        // Icon ID = 2 = Bonus => skeletonBig bonus
        // Icon ID = 3 = Zed => skeletonBig zed
        // Icon ID = 4 => MF => skeletonBig fortune
        // Icon ID = 5 => YS => skeletonLow yasuo
        // Icon ID = 6 => Lux => skeletonLow lux
        let sprite = nodeItem.getChildByName("sprite");
        let nodeSkeleton = nodeItem.getChildByName("skeleton");
        let skeleton = nodeSkeleton.getComponent(sp.Skeleton);
        sprite.active = false;
        switch(id) {
            case 0:
                sprite.active = false;
                nodeSkeleton.active = true;
                skeleton.setAnimation(0, "jackpot", false);
                break;
            case 1:
                sprite.active = false;
                nodeSkeleton.active = true;
                skeleton.setAnimation(0, "free", false);
                break;
            case 2:
                sprite.active = false;
                nodeSkeleton.active = true;
                skeleton.setAnimation(0, "bonus", false);
                break;
        }
        if(this._prefix.localeCompare("3_") == 0) {
            switch(id) {
                case 3:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "zed", false);
                    break;
                case 4:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "fortune", false);
                    break;
                case 5:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "yasuo", false);
                    break;
                case 6:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "lux", false);
                    break;
            }
        } else if(this._prefix.localeCompare("2_") == 0) {
            switch(id) {
                case 3:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "master yi", false);
                    break;
                case 4:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "wayne", false);
                    break;
                case 5:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "leesin", false);
                    break;
                case 6:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "janna", false);
                    break;
            }
        } else if(this._prefix.localeCompare("1_") == 0) {
            switch(id) {
                case 3:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "song dao", false);
                    break;
                case 4:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "ball", false);
                    break;
                case 5:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "fleed_footwork_rune", false);
                    break;
                case 6:
                    sprite.active = false;
                    nodeSkeleton.active = true;
                    skeleton.setAnimation(0, "health", false);
                    break;
            }
        }
    }

    actBackFromDetail() {
        this.pageHistory.active = true;
        this.pageDetail.active = false;
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
                    rolls[j].children[2 - itemRow].stopAllActions();
                    rolls[j].children[2 - itemRow].runAction(
                        cc.callFunc(() => {
                            this.runAnimationSpine(rolls[j].children[2-itemRow]);
                        }),
                    );
                }
            }));
            actions.push(cc.delayTime(1));
            actions.push(cc.callFunc(() => {
                line.active = false;
            }));
            actions.push(cc.delayTime(0.5));
        }
        if (actions.length == 0) {
            actions.push(cc.callFunc(() => {
                //fixed call cc.sequence.apply
            }))
        }
        this.linesWin.runAction(cc.sequence.apply(null, actions));
    }

    runAnimationSpine(nodeItem) {
        let nodeSkeleton = nodeItem.getChildByName("skeleton");
        let skeleton = nodeSkeleton.getComponent(sp.Skeleton);
        if(nodeSkeleton.active) {
            skeleton.setAnimation(0, skeleton.animation, false);
        }
    }
}
export default PopupJackpotHistory;