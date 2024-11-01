import ShopTabEnum from "../enum/ShopTabEnum";
import LobbyLobbyController from "../Lobby.LobbyController";
import Configs from "../../../../scripts/common/Configs";
import MiniGameNetworkClient from "../../../../scripts/networks/MiniGameNetworkClient";
import InPacket from "../../../../scripts/networks/Network.InPacket";
import cmd from "../../../../scripts/common/Lobby.Cmd";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupCashout extends cc.Component {

    static _instance: PopupCashout = null;
    @property(cc.Node)
    toggleContainer = null;
    @property(cc.Node)
    nodeAutoBank = null;
    @property(cc.Node)
    nodeCard = null;
    @property(cc.Node)
    nodeCoin = null;
    @property(cc.Node)
    nodeWallet = null;
    @property(cc.Node)
    nodeTransfer = null;
    @property(cc.Node)
    nodeActivePhone = null;
    @property(cc.Node)
    nodeWithdraw = null;

    private nodeActiveTab = null;
    private currentTab = "";

    protected onLoad() {
        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.GET_SECURITY_INFO: {
                    let res = new cmd.ResGetSecurityInfo(data);
                    Configs.Login.MobileSecured = res.mobileSecure == 1;
                    this.nodeActivePhone.active = !Configs.Login.MobileSecured;
                    this.nodeWithdraw.active = Configs.Login.MobileSecured;
                }
            }
        }, this);

        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
        this.nodeActiveTab = this.nodeAutoBank;
        this.currentTab = ShopTabEnum.AUTO_BANK;
        this.toggleContainer.getChildByName('TRANSFER').active = !Configs.Login.BanTransfer;
        if(PopupCashout._instance == null) {
            PopupCashout._instance = this;
        }
    }

    protected onEnable() {

        let startTab = cc.sys.localStorage.getItem('startWithdrawTab');
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
            case ShopTabEnum.CARD:
                this.nodeActiveTab = this.nodeCard;
                break;
            case ShopTabEnum.COIN:
                this.nodeActiveTab = this.nodeCoin;
                break;
            case ShopTabEnum.WALLET:
                this.nodeActiveTab = this.nodeWallet;
                break;
            case ShopTabEnum.TRANSFER:
                this.nodeActiveTab = this.nodeTransfer;
                break;
            default:
                this.nodeActiveTab = this.nodeAutoBank;
                break;
        }

        this.nodeActiveTab.active = true;
        this.currentTab = tabName;
    }

    actCloseWithdraw() {
        LobbyLobbyController._instance.actClosePopup(this.node, () => {
            PopupCashout._instance = null;
        });
    }

    actOpenCashOutTransaction() {
        LobbyLobbyController._instance.actOpenCashOutTransaction();
    }

    actOpenCashOutGuide() {
        LobbyLobbyController._instance.actOpenCashOutGuide();
    }

    openPopupSecurity() {
        LobbyLobbyController._instance.actOpenPopupSecurity();
        this.actCloseWithdraw();
    }
}
