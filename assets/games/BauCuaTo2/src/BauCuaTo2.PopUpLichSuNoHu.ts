import Dialog from "../../../scripts/common/Dialog";
import Utils from "../../../scripts/common/Utils";
import nodeUtils from "../../../scripts/common/NodeUtils";
import utils from "../../../scripts/common/Utils";


const {ccclass, property} = cc._decorator;

@ccclass
export default class PopUpLichSuNoHu extends Dialog {
    @property([cc.Label])
    rate: cc.Label[] = [];

    @property(cc.Node)
    itemTemplate: cc.Node = null

    @property(cc.Node)
    parent: cc.Node = null;
    @property(cc.SpriteFrame)
    listIcon: cc.SpriteFrame[] = [];

    @property(cc.Node)
    showJackpot: cc.Node = null;
    @property(cc.Node)
    nodeListJackpot = null;
    @property(cc.Node)
    nodeDetailJackpot = null;

    //detail jackpot history
    @property(cc.Sprite)
    sprPot = null;
    @property(cc.Label)
    lblJackpotTotal = null;
    @property(cc.Label)
    lblDate = null;
    @property(cc.Label)
    lblTime = null;
    @property(cc.Label)
    lblTotalUsersWinJackpot = null;
    @property(cc.Node)
    nodeUserDetail = null;
    @property(cc.Node)
    nodeUserContainer = null;

    private itemsChild = new Array<cc.Node>();

    private page: number = 0;

    private currPage = 1;
    listData = [];
    liztRate = [];

    setData(listDataIn, liztRate) {
        console.log("listDataIn ", listDataIn);
        console.log("liztRate ", liztRate);
        this.listData = listDataIn.sort((session1, session2) => session2.session - session1.session);
        this.liztRate = liztRate;
    }

    protected start() {
        for (let i = 0; i < 20; i++) {
            let item = cc.instantiate(this.itemTemplate);
            item.parent = this.parent;
            item.name = i.toString();
            nodeUtils.disableNode(item);
        }
        this.itemTemplate.removeFromParent(true);
        this.itemTemplate = null;

    }

    _onShowed() {
        super._onShowed();
        this.loadData();
        this.nodeListJackpot.active = true;
        this.nodeDetailJackpot.active = false;
    }

    show() {
        this.page = this.listData.length - 1;
        super.show();
    }

    loadData() {
        this.setRateJackpot();
        for (let i = 0; i < 20; i++) {
            let index = i;
            let item = this.parent.children[i];
            if (index > this.listData.length - 1) {
                nodeUtils.disableNode(item)
            } else {
                nodeUtils.activeNode(this.parent.children[i]);
                item.getChildByName("time").getComponent(cc.Label).string = this.listData[index]["time"].split(" ").join("\n");
                item.getChildByName("jackpot").getComponent(cc.Label).string = Utils.formatNumber(this.listData[index]["totalMoney"]);
                let id = this.listData[index]["potId"];
                item.getChildByName("icon1").getComponent(cc.Sprite).spriteFrame = this.listIcon[id];
                item.getChildByName("icon2").getComponent(cc.Sprite).spriteFrame = this.listIcon[id];
                item.getChildByName("icon3").getComponent(cc.Sprite).spriteFrame = this.listIcon[id];
                let clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "BauCuaTo2.PopUpLichSuNoHu";
                clickEventHandler.handler = "actShowDetail";
                clickEventHandler.customEventData = this.listData[index].session.toString();
                item.getChildByName('list').getComponent(cc.Button).clickEvents.push(clickEventHandler);
            }
        }
    }

    setRateJackpot() {
        let totalJackpot = 0;
        this.liztRate.forEach(rate => totalJackpot += rate);
        this.liztRate.forEach((rate, index) => {
            this.rate[index].string = `${(rate / totalJackpot * 100).toFixed(0)}%`;
        })
    }

    actShowDetail(event, data) {
        this.nodeListJackpot.active = false;
        this.nodeDetailJackpot.active = true;
        this.nodeUserContainer.removeAllChildren(true);
        let selectedSession = this.listData.find((session) => session.session == data);
        let id = selectedSession["potId"];
        this.sprPot.spriteFrame = this.listIcon[id];
        let dateTime = selectedSession.time.split(" ");
        this.lblDate.string = dateTime[0];
        this.lblTime.string = dateTime[1];
        this.lblJackpotTotal.string = Utils.formatNumber(selectedSession.totalMoney);
        this.lblTotalUsersWinJackpot.string = selectedSession.listUser.length;
        let listJackpotUserDesc = selectedSession.listUser.sort((user1, user2) => user2.moneyWin - user1.moneyWin);
        console.log(listJackpotUserDesc);
        selectedSession.listUser.forEach((user, index) => {
            let userDetail = cc.instantiate(this.nodeUserDetail);
            userDetail.getChildByName('rank').getComponent(cc.Label).string = index + 1;
            userDetail.getChildByName('account').getComponent(cc.Label).string = user.userName;
            userDetail.getChildByName('win').getComponent(cc.Label).string = Utils.numFormatter(user.moneyWin, 2);
            this.nodeUserContainer.addChild(userDetail);
        })
    }

    private removeAllChild() {
        this.parent.removeAllChildren();
        for (let i = 0; i < this.itemsChild.length; i++) {
            this.itemsChild[i].active = false;
        }
    }

    actNext() {
        if (this.currPage >= this.listData.length) {
            console.log("trang cuoi roi");
        } else {
            this.currPage++;
        }
        this.loadData();
    }

    private moneyToK(money: number): string {
        if (money <= 0) return "0";
        if (money < 1000) {
            return Utils.formatNumber(money);
        }
        if (money < 1000000) {
            money = parseInt((money / 1000).toString());
            return Utils.formatNumber(money) + "K";
        }
        if (money >= 1000000) {
            money = parseInt((money / 1000000).toString());
            return Utils.formatNumber(money) + "M";
        }
    }

    dismiss() {
        super.dismiss();
        this.nodeListJackpot.active = true;
        this.nodeDetailJackpot.active = false;
    }

    actCloseDetailJackpot() {
        this.nodeListJackpot.active = true;
        this.nodeDetailJackpot.active = false;
    }
}