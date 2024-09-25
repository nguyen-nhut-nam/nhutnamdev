import MiniGameNetworkClient from "../../../../scripts/networks/MiniGameNetworkClient";
import InPacket from "../../../../scripts/networks/Network.InPacket";
import cmd from "../../../../scripts/common/Lobby.Cmd";
import App from "../../../../scripts/common/App";
import Utils from "../../../../scripts/common/Utils";
import Configs from "../../../../scripts/common/Configs";
import BroadcastReceiver from "../../../../scripts/common/BroadcastReceiver";
import Dialog from "../../../../scripts/common/Dialog";
import LobbyLobbyController from "../Lobby.LobbyController";
import PopupProfile from "../Lobby.PopupProfile";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupUserInformation extends cc.Component {

    @property(cc.Sprite)
    spriteAvatar = null;
    @property(cc.Label)
    lblNickName = null;
    @property(cc.Label)
    lblUserID = null;
    @property(cc.Label)
    lblUserMoney = null;
    @property(cc.Label)
    lblUserSafe = null;
    @property(cc.Prefab)
    popupSecurity = null;
    @property(cc.Prefab)
    popupAvatar = null;
    @property(cc.Label)
    lblPhoneNumber = null;
    @property(cc.Label)
    lblSecurity = null;
    @property(cc.Node)
    nodeEditPhone = null;

    start () {
        this.lblNickName.string = Configs.Login.Nickname;
        this.lblUserID.string = `ID: ${Configs.Login.UserId}`;
        this.spriteAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            if (!this.node.active) return;
            this.lblUserMoney.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);

        BroadcastReceiver.register(BroadcastReceiver.USER_INFO_UPDATED, () => {
            if (!this.node.active) return;
            this.spriteAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
        }, this);
        //Chưa kích hoạt bảo mật
        MiniGameNetworkClient.getInstance().addListener((data) => {
            App.instance.showLoading2(false);
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.RESULT_SAFES: {
                    let res = new cmd.ResResultSafes(data);
                    switch (res.error) {
                        case 0:
                            this.lblUserSafe.string = Utils.formatNumber(res.safe);
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            break;
                        case 3:
                            this.lblUserSafe.string = Utils.formatNumber(res.safe);
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
                case cmd.Code.GET_SECURITY_INFO: {
                    let res = new cmd.ResGetSecurityInfo(data);
                    if(res.mobile.length > 0) {
                        this.lblPhoneNumber.string = `${res.mobile.slice(0,6)}******`;
                        this.nodeEditPhone.active = false;
                    } else {
                        this.lblPhoneNumber.string = `Chưa kích hoạt SĐT`;
                        this.nodeEditPhone.active = true;
                    }

                    if(res.appSecure != 0) {
                        this.lblSecurity.string = `Đã kích hoạt bảo mật`;
                    } else {
                        this.lblSecurity.string = `Chưa kích hoạt bảo mật`;
                    }
                    break;
                }
            }
        }, this);
    }

    protected onEnable() {
        this.actGetPhoneNumber();
        MiniGameNetworkClient.getInstance().send(new cmd.ReqSafes(0, 1));
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
    }

    actGetPhoneNumber() {
        MiniGameNetworkClient.getInstance().send(new cmd.ReqCheckPhone());
    }

    actLogout() {
        App.instance.confirmDialog.show3("Bạn có muốn đăng xuất khỏi tài khoản?", "ĐĂNG XUẤT", (isConfirm) => {
            if (isConfirm) {
                this.node.parent.parent.getComponent(Dialog).dismiss();
                BroadcastReceiver.send(BroadcastReceiver.USER_LOGOUT);
            }
        });
    }

    actShowAddCoin() {
        PopupProfile.instance.dismiss();
        PopupProfile.instance.node.destroy();
        LobbyLobbyController._instance.actAddCoin();
    }

    actOpenPopupSecurity(event) {
        PopupProfile.instance.dismiss();
        PopupProfile.instance.node.destroy();
        if(Configs.Login.AppSecured) {
            LobbyLobbyController._instance.actOpenPopupActiveTelegram();
        } else {
            LobbyLobbyController._instance.actOpenPopupSecurity();
        }

    }

    actOpenPopupSecurityPhone(event) {
        PopupProfile.instance.dismiss();
        PopupProfile.instance.node.destroy();
        LobbyLobbyController._instance.actOpenPopupSecurity();
    }

    actOpenPopupSafe() {
        PopupProfile.instance.dismiss();
        PopupProfile.instance.node.destroy();
        LobbyLobbyController._instance.actOpenPopupSafe();
    }

    actChooseAvatar() {
        let popupAvatar = cc.instantiate(this.popupAvatar);
        let scene = cc.director.getScene().getChildByName('Canvas');
        scene.addChild(popupAvatar);
        popupAvatar.scale = 0;
        popupAvatar.runAction(
            cc.sequence(
                cc.scaleTo(.3, 1.1),
                cc.scaleTo(.1, 1)
            )
        );
    }
}
