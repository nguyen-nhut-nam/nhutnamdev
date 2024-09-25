import App from "../../../../../scripts/common/App";
import Configs from "../../../../../scripts/common/Configs";
import Http from "../../../../../scripts/common/Http";
import ApiIDEnum from "../../enum/ApiIDEnum";
import MiniGameNetworkClient from "../../../../../scripts/networks/MiniGameNetworkClient";
import cmd from "../../../../../scripts/common/Lobby.Cmd";
import InPacket from "../../../../../scripts/networks/Network.InPacket";
import Utils from "../../../../../scripts/common/Utils";
import Tween from "../../../../../scripts/common/Tween";
import BroadcastReceiver from "../../../../../scripts/common/BroadcastReceiver";
import GameURL from "../../../../../scripts/common/game/GameURL";
import LobbyLobbyController from "../../Lobby.LobbyController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TabTelegramActive extends cc.Component {

    @property(cc.Node)
    step1 = null;
    @property(cc.Node)
    step2 = null;

    //step 1
    @property(cc.EditBox)
    edbOTP = null;
    //step 2
    @property(cc.Prefab)
    prefabPopupCancelTelegram = null;

    protected onLoad() {
        this.step1.active = true;
        this.step2.active = false;
        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inPacket = new InPacket(data);
            // console.log(inPacket.getCmdId());
            switch (inPacket.getCmdId()) {
                case cmd.Code.GET_SECURITY_INFO: {
                    let res = new cmd.ResGetSecurityInfo(data);
                    // console.log(res);
                    if(res.appSecure == 1) {
                        this.step2.active = true;
                        this.step1.active = false;
                    } else {
                        this.step2.active = false;
                        this.step1.active = true;
                    }
                    break;
                }
            }
        }, this);
    }

    protected onEnable() {
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
    }

    openLinkTelegram() {
        if(cc.sys.os == cc.sys.OS_IOS) {
            cc.sys.openURL('https://apps.apple.com/us/app/telegram-messenger/id686449807');
        } else if(cc.sys.os == cc.sys.OS_ANDROID) {
            cc.sys.openURL('https://play.google.com/store/apps/details?id=org.telegram.messenger&pli=1');
        } else {
            cc.sys.openURL('https://desktop.telegram.org/');
        }
    }

    onActiveTelegram() {
        let msgNoOTP = 'Vui lòng nhập mã OTP.';
        let msgActiveTelegramSuccessfully = 'Kích hoạt bảo mật telegram thành công.';
        let otp = this.edbOTP.string.trim();
        if(otp.length === 0) {
            App.instance.actShowThongBao(msgNoOTP);
            return;
        }

        let params = {
            "c": ApiIDEnum.VERIFY_OTP,
            "nickname": Configs.Login.Nickname,
            "otp": otp,
        }
        Http.get(Configs.App.API, params, (err, res) => {
            if(err) {
                console.log(err);
                return;
            }
            if(!res.success) {
                App.instance.actShowThongBao(res.errorCode);
                return;
            } else {
                if(res.errorCode == 'OK') {
                    App.instance.actShowThongBao(msgActiveTelegramSuccessfully);
                    this.step2.active = true;
                    this.step1.active = false;
                }
            }
        });
    }

    onChatBotTelegram() {
        cc.sys.openURL(`${GameURL.BOT_TELEGRAM}?start=${Configs.Login.Nickname}`);
    }

    onOpenCancelTelegram() {
        LobbyLobbyController._instance.actOpenPopup(this.prefabPopupCancelTelegram);
    }
}
