import ShopTabEnum from "../enum/ShopTabEnum";
import LobbyLobbyController from "../Lobby.LobbyController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupCashoutGuide extends cc.Component {
    @property(cc.Node)
    nodeAutoBank = null;
    @property(cc.Node)
    nodeCard = null;
    @property(cc.Node)
    nodeCoin = null;
    @property(cc.Node)
    nodeWallet = null;

    private nodeActiveTab = null;
    private currentTab = "";

    protected onLoad() {
        this.nodeActiveTab = this.nodeAutoBank;
        this.currentTab = ShopTabEnum.AUTO_BANK;
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
            case ShopTabEnum.AUTO_BANK:
                this.nodeActiveTab = this.nodeAutoBank;
                break;
            case ShopTabEnum.CARD:
                this.nodeActiveTab = this.nodeCard;
                break;
            case ShopTabEnum.COIN:
                this.nodeActiveTab = this.nodeCoin;
                break;
            case ShopTabEnum.WALLET:
                this.nodeActiveTab = this.nodeWallet;
                break;
            default:
                this.nodeActiveTab = this.nodeAutoBank;
        }

        this.nodeActiveTab.active = true;
        this.currentTab = tabName;
    }

    actCloseGuide(event) {
        event.currentTarget.off(cc.Node.EventType.TOUCH_END);
        LobbyLobbyController._instance.actClosePopup(this.node);
    }
}
