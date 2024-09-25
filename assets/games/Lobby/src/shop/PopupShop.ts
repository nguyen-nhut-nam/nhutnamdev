import ShopTabEnum from "../enum/ShopTabEnum";
import LobbyLobbyController from "../Lobby.LobbyController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupShop extends cc.Component {
    @property(cc.Node)
    toggleContainer = null;
    @property(cc.Node)
    nodeAutoBank = null;
    @property(cc.Node)
    nodeWallet = null;
    @property(cc.Node)
    nodeCoin = null;
    @property(cc.Node)
    nodeCard = null;
    @property(cc.Node)
    nodeGiftCode = null;

    private nodeActiveTab = null;
    private currentTab = "";
    public static _instance = null;

    protected onLoad() {
        this.nodeActiveTab = this.nodeAutoBank;
        this.currentTab = ShopTabEnum.AUTO_BANK;
        PopupShop._instance = this;
    }

    protected onEnable() {

        let startTab = cc.sys.localStorage.getItem('startChargeTab');
        if(!startTab) {
            startTab = ShopTabEnum.AUTO_BANK;
        }
        this.toggleContainer.getChildByName(startTab).getComponent(cc.Toggle).isChecked = true;
        cc.director.getScheduler().schedule(() => {
            this.activeTab(startTab);
        }, this, 0, 0, 0.3, false);
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
            case ShopTabEnum.WALLET:
                this.nodeActiveTab = this.nodeWallet;
                break;
            case ShopTabEnum.COIN:
                this.nodeActiveTab = this.nodeCoin;
                break;
            case ShopTabEnum.CARD:
                this.nodeActiveTab = this.nodeCard;
                break;
            case ShopTabEnum.GIFTCODE:
                this.nodeActiveTab = this.nodeGiftCode;
                break;
            default:
                this.nodeActiveTab = this.nodeAutoBank;
                break;
        }

        this.nodeActiveTab.active = true;
        this.currentTab = tabName;
    }

    actCloseShop(event) {
        if(event) {
            event.currentTarget.off(cc.Node.EventType.TOUCH_END);
        }
        this.node.getChildByName('Container').runAction(
            cc.sequence(
                cc.scaleTo(.06, 1.2),
                cc.scaleTo(.27, 0),
                cc.callFunc(() => {
                    this.node.destroy();
                    PopupShop._instance = null;
                })
            )
        )
    }

    actOpenChargeTransaction() {
        LobbyLobbyController._instance.actOpenChargeTransaction();
    }

    actOpenChargeGuide() {
        LobbyLobbyController._instance.actOpenChargeGuide();
    }
}
