import LobbyLobbyController from "../../Lobby.LobbyController";
import Popup from "../../../../../scripts/common/Popup";
import ShopTabEnum from "../../enum/ShopTabEnum";
import EventTabEnum from "../../enum/EventTabEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupEvent extends Popup {

    @property(cc.Node)
    nodeEventCharge = null;
    @property(cc.Node)
    nodeRuleChargeWithdraw = null;

    private static _instance: PopupEvent = null;

    private nodeActiveTab = null;
    private currentTab = "";

    protected onLoad() {
        if(PopupEvent._instance == null) {
            PopupEvent._instance = this;
        }

        this.nodeActiveTab = this.nodeEventCharge;
        this.currentTab = ShopTabEnum.AUTO_BANK;
        this.activeTab(this.currentTab);
    }

    public static getInstance() {
        return PopupEvent._instance;
    }

    actClosePopupEvent(event) {
        if(event) {
            event.currentTarget.off(cc.Node.EventType.TOUCH_END);
        }
        LobbyLobbyController._instance.actClosePopup(this.node);
    }

    protected onDestroy() {
        PopupEvent._instance = null;
    }

    changeTabClick(event, data) {
        if(data.toString() === this.currentTab) {
            return;
        }
        this.activeTab(data.toString());
    }

    activeTab(tabName) {
        this.nodeActiveTab.active = false;

        switch (tabName) {
            case EventTabEnum.CHARGE_EVENT:
                this.nodeActiveTab = this.nodeEventCharge;
                break;
            case EventTabEnum.CHARGE_WITHDRAW_RULE:
                this.nodeActiveTab = this.nodeRuleChargeWithdraw;
                break;
            default:
                this.nodeActiveTab = this.nodeEventCharge;
                break;
        }

        this.nodeActiveTab.active = true;
        this.currentTab = tabName;
    }

}
