import Dialog from "../../../../scripts/common/Dialog";
import Utils from "../../../../scripts/common/Utils";
import Http from "../../../../scripts/common/Http";
import Configs from "../../../../scripts/common/Configs";
import TaiXiuMiniController from "./TaiXiuMini.TaiXiuMiniController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupDetailHistory extends Dialog {
    @property(cc.Label)
    lblSession: cc.Label = null;
    @property(cc.Label)
    lblTime: cc.Label = null;
    @property(cc.Label)
    lblPage: cc.Label = null;
    @property(cc.Label)
    lblPageTai: cc.Label = null;
    @property(cc.Label)
    lblTotalBetTai: cc.Label = null;
    @property(cc.Label)
    lblTotalBetXiu: cc.Label = null;
    @property(cc.Label)
    lblRefundTai = null;
    @property(cc.Label)
    lblRefundXiu = null;

    @property([cc.SpriteFrame])
    sfDices: cc.SpriteFrame[] = new Array<cc.SpriteFrame>();
    @property(cc.Node)
    skAniTai: cc.Node = null;
    @property(cc.Node)
    skAniRaTai: cc.Node = null;
    @property(cc.Node)
    skAniXiu: cc.Node = null;
    @property(cc.Node)
    skAniRaXiu: cc.Node = null;

    @property(cc.Sprite)
    sprDice1: cc.Sprite = null;
    @property(cc.Sprite)
    sprDice2: cc.Sprite = null;
    @property(cc.Sprite)
    sprDice3: cc.Sprite = null;
    @property(cc.Label)
    resultLabel: cc.Label = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private items: cc.Node[] = [];
    private inited = false;
    private session: number = 0;
    private pageXiu: number = 1;
    private pageTai: number = 1;
    private totalPage: number = 1;
    private historiesTai = [];
    private historiesXiu = [];

    showDetail(session: number) {
        this.session = session;
        this.show();
    }

    show() {
        super.show();

        this.sprDice1.node.active = false;
        this.sprDice2.node.active = false;
        this.sprDice3.node.active = false;
        this.lblSession.string = "" + this.session;
        this.lblTime.string = "";

        if (this.inited) {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
            return;
        }
        this.itemTemplate.active = false;
        for (let i = 0; i < 5; i++) {
            let node = cc.instantiate(this.itemTemplate);
            node.parent = this.itemTemplate.parent;
            node.active = false;
            this.items.push(node);
        }
        this.inited = true;
    }

    _onShowed() {
        super._onShowed();
        this.loadData();
    }

    private loadData() {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        this.sprDice1.node.active = false;
        this.sprDice2.node.active = false;
        this.sprDice3.node.active = false;
        this.lblSession.string = "" + this.session;
        this.lblTime.string = "";
        Http.get(Configs.App.API, { "c": 102, "rid": this.session, "mt": Configs.App.MONEY_TYPE }, (err, res) => {
            if (err != null) return;
            this.historiesTai = [];
            this.historiesXiu = [];
            if (res.success && res["resultTX"] !== null) {
                for (var i = 0; i < res["transactions"].length; i++) {
                    var itemData = res["transactions"][i];
                    if (itemData["betSide"] === 1) {
                        this.historiesTai.push(itemData);
                    } else {
                        this.historiesXiu.push(itemData);
                    }
                }

                for (var i = 0; i < this.items.length; i++) {
                    this.items[i].active = false;
                }

                this.pageXiu = 1;
                this.pageTai = 1;
                this.totalPage = this.historiesXiu.length > this.historiesTai.length ? this.historiesXiu.length : this.historiesTai.length;
                this.totalPage = Math.ceil(this.totalPage / this.items.length);
                this.lblPage.string = this.pageXiu + "/" + this.totalPage;
                this.lblPageTai.string = this.pageTai + "/" + this.totalPage;

                this.lblSession.string = "#" + res["resultTX"]["referenceId"];
                let time = res["resultTX"]["timestamp"];
                let timeCut = time.slice(5, time.length) + "";
                let re = /\//gi;
                let resultT = timeCut.replace(re, "-");        
                this.lblTime.string = "(" + resultT + ")";
                this.lblTotalBetTai.string = `Tổng cược: ${Utils.formatNumber(res["resultTX"]["totalTai"])}`;
                this.lblTotalBetXiu.string = `Tổng cược: ${Utils.formatNumber(res["resultTX"]["totalXiu"])}`;
                this.lblRefundTai.string = `Trả lại: ${Utils.formatNumber(res["resultTX"]["totalRefundTai"])}`;
                this.lblRefundXiu.string = `Trả lại: ${Utils.formatNumber(res["resultTX"]["totalRefundXiu"])}`;
                this.sprDice1.spriteFrame = this.sfDices[res["resultTX"]["dice1"]];
                this.sprDice1.node.active = true;
                this.sprDice2.spriteFrame = this.sfDices[res["resultTX"]["dice2"]];
                this.sprDice2.node.active = true;
                this.sprDice3.spriteFrame = this.sfDices[res["resultTX"]["dice3"]];
                this.sprDice3.node.active = true;
                this.resultLabel.string = (res["resultTX"]["dice1"] + res["resultTX"]["dice2"] + res["resultTX"]["dice3"]) + "";
                this.resultLabel.node.active = true;

                res["resultTX"]["result"] == 1 ? this.skAniTai.active = true : this.skAniTai.active = false;
                if (res["resultTX"]["result"] == 1) {
                    this.skAniTai.active = false;
                    this.skAniRaTai.active = true;
                    this.skAniXiu.active = true;
                    this.skAniRaXiu.active = false;
                } else {

                    this.skAniTai.active = true;
                    this.skAniRaTai.active = false;
                    this.skAniXiu.active = false;
                    this.skAniRaXiu.active = true;
                }
                this.loadDataPageTai();
                this.loadDataPageXiu();
            }
        });
    }

    private loadDataPageTai() {
        for (var i = 0; i < this.items.length; i++) {
            var idx = (this.pageTai - 1) * this.items.length + i;
            var item = this.items[i];
            item.active = true;

            if (idx < this.historiesTai.length) {
                var itemData = this.historiesTai[idx];
                item.getChildByName("Time").getComponent(cc.Label).string = (itemData["inputTime"] < 10 ? "00:0" : "00:") + itemData["inputTime"];
                item.getChildByName("Account").getComponent(cc.Label).string = itemData["username"];
                // item.getChildByName("Refund").getComponent(cc.Label).string = Utils.numFormatter(itemData["refund"]) + "";
                item.getChildByName("Bet").getComponent(cc.Label).string = Utils.numFormatter(itemData["betValue"]) + "";
            } else {
                item.getChildByName("Time").getComponent(cc.Label).string = "";
                item.getChildByName("Account").getComponent(cc.Label).string = "";
                // item.getChildByName("Refund").getComponent(cc.Label).string = "";
                item.getChildByName("Bet").getComponent(cc.Label).string = "";
            }
        }
        this.lblPageTai.string = this.pageTai + "/" + this.totalPage.toString();
    }



    private loadDataPageXiu() {
        for (var i = 0; i < this.items.length; i++) {
            var idx = (this.pageXiu - 1) * this.items.length + i;
            var item = this.items[i];
            item.active = true;
            if (idx < this.historiesXiu.length) {
                var itemData = this.historiesXiu[idx];
                item.getChildByName("Time2").getComponent(cc.Label).string = (itemData["inputTime"] < 10 ? "00:0" : "00:") + itemData["inputTime"];
                item.getChildByName("Account2").getComponent(cc.Label).string = itemData["username"];
                // item.getChildByName("Refund2").getComponent(cc.Label).string = Utils.numFormatter(itemData["refund"]) + "";
                item.getChildByName("Bet2").getComponent(cc.Label).string = Utils.numFormatter(itemData["betValue"]) + "";
            } else {
                item.getChildByName("Time2").getComponent(cc.Label).string = "";
                item.getChildByName("Account2").getComponent(cc.Label).string = "";
                // item.getChildByName("Refund2").getComponent(cc.Label).string = "";
                item.getChildByName("Bet2").getComponent(cc.Label).string = "";
            }
        }
        this.lblPage.string = this.pageXiu.toString() + "/" + this.totalPage.toString();
    }

    public actNextPage() {
        //tăng page index lên
        this.pageXiu++;
        if (this.pageXiu > this.totalPage) this.pageXiu = this.totalPage;
        this.loadDataPageXiu();
    }

    public actNextPageTai() {
        this.pageTai++;
        if (this.pageTai > this.totalPage) this.pageTai = this.totalPage;
        this.loadDataPageTai();
    }

    public actPrevPage() {
        this.pageXiu--;
        if (this.pageXiu < 1) this.pageXiu = 1;
        this.loadDataPageXiu();
    }



    public actPrevPageTai() {
        this.pageTai--;
        if (this.pageTai < 1) this.pageTai = 1;
        this.loadDataPageTai();
    }

    public actNextSession() {
        this.session++;
        if (this.session > TaiXiuMiniController.instance.histories[TaiXiuMiniController.instance.histories.length - 1].session) {
            this.session = TaiXiuMiniController.instance.histories[TaiXiuMiniController.instance.histories.length - 1].session;
            return;
        }
        this.loadData();
    }

    public actPrevSession() {
        this.session--;
        this.loadData();
    }
}
