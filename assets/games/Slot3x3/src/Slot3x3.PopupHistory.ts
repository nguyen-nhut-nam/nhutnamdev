import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import Utils from "../../../scripts/common/Utils";
import Dialog from "../../../scripts/common/Dialog";
import SlotSexyDanceSlotSexyDanceController from "../../SlotSexyDance/src/SlotSexyDance.SlotSexyDanceController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupHistory extends Dialog {
    @property(cc.Node)
    itemTemplate: cc.Node = null;
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
    @property([cc.SpriteFrame])
    sprFrameItems = [];
    @property(cc.Label)
    lblLineBet = null;

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();

    private _currentSelectedHistory = null;
    private _listHistory = [];
    private _listLinesWin = [];
    private _listMatrix = [];
    show() {
        super.show();

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        if (this.itemTemplate != null) this.itemTemplate.active = false;

        this.pageHistory.active = true;
        this.pageDetail.active = false;
    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
    }

    _onShowed() {
        super._onShowed();
        this.page = 1;
        this.maxPage = 1;
        this.loadData();
    }

    actNextPage() {
        if (this.page < this.maxPage) {
            this.page++;
            this.loadData();
        }
    }

    actPrevPage() {
        if (this.page > 1) {
            this.page--;
            this.loadData();
        }
    }

    showDetail() {
        App.instance.actShowThongBao("Tính năng đang tạm thời bảo trì");
    }
    private loadData() {
        Http.get(Configs.App.API, { "c": 134, "mt": Configs.App.MONEY_TYPE, "p": this.page, "un": Configs.Login.Nickname }, (err, res) => {
            if (err != null) return;
            if (res["success"]) {

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
                this._listHistory = res["results"];
                let leang = this.items.length >= 10 ? 10 :  this.items.length;
                for (let i = 0; i < leang; i++) {
                    let item = this.items[i];
                    if (i < res["results"].length) {
                        let itemData = res["results"][i];
                        console.log(itemData);
                        item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                        item.getChildByName("Session").getComponent(cc.Label).string = "#" + itemData["rf"];
                        item.getChildByName("Time").getComponent(cc.Label).string = itemData["ts"].split(" ").join("\n");
                        item.getChildByName("Bet").getComponent(cc.Label).string = Utils.formatNumber(itemData["bv"]);
                        item.getChildByName("LineBet").getComponent(cc.Label).string = itemData["lb"] == "" ? 0 : itemData["lb"].split(",").length;
                        item.getChildByName("LineWin").getComponent(cc.Label).string = itemData["lb"] == "" ? 0 : itemData["lw"].split(",").length;
                        item.getChildByName("Result").getComponent(cc.Label).string = Utils.formatNumber(itemData["pz"]);
                        let clickEventHandler = new cc.Component.EventHandler();
                        clickEventHandler.target = this.node;
                        clickEventHandler.component = "Slot3x3.PopupHistory";
                        clickEventHandler.handler = "actShowDetail";
                        clickEventHandler.customEventData = itemData["rf"];
                        item.getChildByName("detail").getComponent(cc.Button).clickEvents = [];
                        item.getChildByName("detail").getComponent(cc.Button).clickEvents.push(clickEventHandler);
                        item.active = true;
                    } else {
                        item.active = false;
                    }
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
        this._listMatrix = this._currentSelectedHistory.matrix.split(",");
        this.lblLineBet.string = this._currentSelectedHistory.lb.split(',').length;
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let roll = this.columns.children[i];
            var children = roll.children;
            this.setupIconById(children[2], parseInt(this._listMatrix[i]));
            this.setupIconById(children[1], parseInt(this._listMatrix[3 + i]));
            this.setupIconById(children[0], parseInt(this._listMatrix[6 + i]));
        }
        // this.showLineWins();
    }

    // private showLineWins() {
    //     this.linesWin.stopAllActions();
    //     var linesWin = this.lastSpinRes.linesWin.split(",");
    //     var linesWinChildren = this.linesWin.children;
    //     for (var i = 0; i < linesWinChildren.length; i++) {
    //         linesWinChildren[i].active = linesWin.indexOf("" + (i + 1)) >= 0;
    //     }
    //     var actions = [];
    //     if (this.lastSpinRes.prize > 0) {
    //         this.showWinCash(this.lastSpinRes.prize);
    //         actions.push(cc.delayTime(1.5));
    //         actions.push(cc.callFunc(function () {
    //             for (var i = 0; i < linesWinChildren.length; i++) {
    //                 linesWinChildren[i].active = false;
    //             }
    //         }));
    //     }
    //     actions.push(cc.delayTime(0.5));
    //     actions.push(cc.callFunc(() => {
    //         this.isSpined = true;
    //         if (this.isBoost || this.isAuto) {
    //             this.actSpin();
    //         } else {
    //             this.setEnabledAllButtons(true);
    //             for (var i = 0; i < this.buttonBets.length; i++) {
    //                 this.buttonBets[i].button.interactable = true;
    //             }
    //         }
    //     }));
    //     this.linesWin.runAction(cc.sequence.apply(null, actions));
    // }

    setupIconById(nodeItem, id) {
        let sprite = nodeItem.getChildByName("sprite");
        sprite.getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[id];
    }

    actBackFromDetail() {
        this.pageHistory.active = true;
        this.pageDetail.active = false;
    }
}
