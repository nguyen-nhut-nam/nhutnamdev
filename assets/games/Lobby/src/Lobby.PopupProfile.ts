import Dialog from "../../../scripts/common/Dialog";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import Utils from "../../../scripts/common/Utils";
import Configs from "../../../scripts/common/Configs";
import Http from "../../../scripts/common/Http";
import App from "../../../scripts/common/App";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import cmd from "../../../scripts/common/Lobby.Cmd";
import InPacket from "../../../scripts/networks/Network.InPacket";
import Tween from "../../../scripts/common/Tween";
import LobbyLobbyController from "./Lobby.LobbyController";
import ShopTabEnum from "./enum/ShopTabEnum";

var ProfileTab = cc.Enum({
    INFORMATION: "INFORMATION",
    CHANGE_PASSWORD: "CHANGE_PASSWORD",
    HISTORY: "HISTORY",
});
const { ccclass, property } = cc._decorator;

@ccclass("Lobby.PopupProfile.TabProfile")
export class TabProfile {
    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblVipPoint: cc.Label = null;
    @property(cc.Label)
    lblVipPointPercent: cc.Label = null;
    @property(cc.Label)
    lblVipName: cc.Label = null;
    @property(cc.Sprite)
    spriteAvatar: cc.Sprite = null;
}


@ccclass("Lobby.PopupProfile.TabVip")
export class TabVip {
    @property(cc.Label)
    lblVipPointName: cc.Label = null;
    @property(cc.Label)
    lblVipPoint: cc.Label = null;
    @property(cc.Label)
    lblTotalVipPoint: cc.Label = null;
    @property(cc.Label)
    lblVipPointNextLevel: cc.Label = null;
    @property(cc.Sprite)
    spriteProgressVipPoint: cc.Sprite = null;
    @property(cc.Node)
    items: cc.Node = null;
    @property(cc.Node)
    continueOTP: cc.Node = null;
    @property(cc.EditBox)
    edbOTP: cc.EditBox = null;
    @property(cc.Toggle)
    toggleAppOTP: cc.Toggle = null;

    getVipPointInfo() {
        Http.get(Configs.App.API, { "c": 126, "nn": Configs.Login.Nickname }, (err, res) => {
            if (err != null) {
                return;
            }
            if (!res["success"]) {
                App.instance.alertDialog.showMsg("Lỗi kết nối, vui lòng thử lại.");
                return;
            }
            Configs.Login.VipPoint = res["vippoint"];
            Configs.Login.VipPointSave = res["vippointSave"];
            // Configs.Login.VipPoint = 5000;
            // ratioList
            for (let i = 0; i < this.items.childrenCount; i++) {
                let item = this.items.children[i];
                if (i < res["ratioList"].length) {
                    item.getChildByName("lblVipPoint").getComponent(cc.Label).string = Utils.formatNumber(Configs.Login.VipPoint);
                    item.getChildByName("lblCoin").getComponent(cc.Label).string = Utils.formatNumber(Configs.Login.VipPoint * res["ratioList"][i]);
                    item.getChildByName("btnReceive").active = res["ratioList"][i] > 0;
                    item.getChildByName("btnReceive").getComponent(cc.Button).interactable = i == Configs.Login.getVipPointIndex() && Configs.Login.VipPoint > 0;
                    item.getChildByName("btnReceive").getComponentInChildren(cc.Label).node.color = i == Configs.Login.getVipPointIndex() ? cc.Color.YELLOW : cc.Color.GRAY;
                    item.getChildByName("btnReceive").off("click");
                    item.getChildByName("btnReceive").on("click", () => {
                        App.instance.confirmDialog.show2("Bạn có chắc chắn muốn nhận thưởng vippoint\nTương ứng với cấp Vippoint hiện tại bạn nhận được :\n" + Utils.formatNumber(Configs.Login.VipPoint * res["ratioList"][i]) + " Xu", (isConfirm) => {
                            if (isConfirm) {
                                MiniGameNetworkClient.getInstance().send(new cmd.ReqExchangeVipPoint());
                            }
                        });
                    });
                    item.active = true;
                } else {
                    item.active = false;
                }
            }

            this.lblVipPointName.string = Configs.Login.getVipPointName();
            this.lblVipPoint.string = Utils.formatNumber(Configs.Login.VipPoint);
            this.lblTotalVipPoint.string = Utils.formatNumber(Configs.Login.VipPointSave);
            this.lblVipPointNextLevel.string = Utils.formatNumber(Configs.Login.getVipPointNextLevel());

            let VipPoints = [80, 800, 4500, 8600, 50000, 1000000];
            let vipPointIdx = 0;
            for (let i = VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > VipPoints[i]) {
                    vipPointIdx = i;
                    break;
                }
            }

            let vipPointNextLevel = VipPoints[0];
            for (let i = VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > VipPoints[i]) {
                    if (i == VipPoints.length - 1) {
                        vipPointNextLevel = VipPoints[i];
                        break;
                    }
                    vipPointNextLevel = VipPoints[i + 1];
                    break;
                }
            }

            let vipPointStartLevel = 0;
            for (let i = VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > VipPoints[i]) {
                    vipPointStartLevel = VipPoints[i];
                    break;
                }
            }
            console.log("Configs.Login.VipPoint: " + Configs.Login.VipPoint);
            console.log("vipPointNextLevel: " + vipPointNextLevel);
            console.log("vipPointStartLevel: " + vipPointStartLevel);
            console.log("vipPointIdx: " + vipPointIdx);
            let delta = (Configs.Login.VipPoint - vipPointStartLevel) / (vipPointNextLevel - vipPointStartLevel);
            console.log("delta: " + delta);
            this.spriteProgressVipPoint.fillRange = (vipPointIdx + 1) * (1 / 6) + delta * (1 / 6);
        });
    }


}
@ccclass
export default class PopupProfile extends Dialog {

    @property([cc.Node])
    tabContents = [];
    @property(cc.Node)
    activeDone: cc.Node = null;
    @property(cc.Node)
    noActive: cc.Node = null;
    @property(cc.Node)
    nodeInformation = null;
    @property(cc.Node)
    nodeChangePassword = null;

    private nodeActiveTab = null;
    private currentTab = ProfileTab.INFORMATION;

    static instance: PopupProfile = null;

    private tabSelectedIdx = 0;

    protected onLoad() {
        if (PopupProfile.instance === null) {
            PopupProfile.instance = this;
        }
        this.nodeActiveTab = this.nodeInformation;
        this.currentTab = ProfileTab.INFORMATION;
    }

    protected onDestroy() {
        PopupProfile.instance = null;
    }

    start() {
    }

    show() {
        super.show();
        this.tabSelectedIdx = 0;
        this.onTabChanged();
    }
    dismiss() {
        super.dismiss();
    }

    actShowAddCoin() {
        this.dismiss();
        LobbyLobbyController._instance.actCreatePopupShop(ShopTabEnum.AUTO_BANK);
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
            case ProfileTab.INFORMATION:
                this.nodeActiveTab = this.nodeInformation;
                break;
            case ProfileTab.CHANGE_PASSWORD:
                this.nodeActiveTab = this.nodeChangePassword;
                break;
            case ProfileTab.HISTORY:
                break;
        }

        this.nodeActiveTab.active = true;
        this.currentTab = tabName;
    }
    actGetOTP() {
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP());
    }

    private onTabChanged() {
        for (let i = 0; i < this.tabContents.length; i++) {
            this.tabContents[i].active = false;
            this.tabContents[i].active = i == this.tabSelectedIdx;
        }
    }

    actShowPopupTransaction() {
        LobbyLobbyController._instance.actOpenPopupTransaction();
    }

    _onDismissed() {
        super._onDismissed();
        this.node.destroy();
    }
}
