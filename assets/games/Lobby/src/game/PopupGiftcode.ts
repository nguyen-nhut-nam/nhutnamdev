import MiniGameNetworkClient from "../../../../scripts/networks/MiniGameNetworkClient";
import InPacket from "../../../../scripts/networks/Network.InPacket";
import cmd from "../../../../scripts/common/Lobby.Cmd";
import App from "../../../../scripts/common/App";
import Configs from "../../../../scripts/common/Configs";
import BroadcastReceiver from "../../../../scripts/common/BroadcastReceiver";
import LobbyLobbyController from "../Lobby.LobbyController";
import Http from "../../../../scripts/common/Http";
import GameURL from "../../../../scripts/common/game/GameURL";
import ApiIDEnum from "../enum/ApiIDEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    edbGiftCode = null;

    protected start() {
        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.INSERT_GIFTCODE: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResInsertGiftcode(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Mã Giftcode không chính xác. Vui lòng kiểm tra lại!");
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg("Mã Giftcode đã được sử dụng.");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("Để nhận giftcode vui lòng đăng ký bảo mật.");
                            break;
                        case 4:
                        case 5:
                        case 6:
                            App.instance.alertDialog.showMsg("Giftcode đã nhập không hợp lệ.");
                            break;
                        case 2:
                            Configs.Login.Coin = res.currentMoneyVin;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg("Nhận thưởng thành công.");
                            break;
                    }
                    break;
                }
            }
        }, this);
    }

    actInsertGiftCode() {
        let msgInsertCodeSuccessfully = 'Nhập Giftcode thành công.';
        let giftCode = this.edbGiftCode.string.trim();
        if (giftCode.length <= 0) {
            App.instance.alertDialog.showMsg("Mã quà tặng không được để trống.");
            return;
        }
        App.instance.showLoading2(true);
        // MiniGameNetworkClient.getInstance().send(new cmd.ReqInsertGiftcode(giftCode));
        let params = {
            "c": ApiIDEnum.INSERT_GIFT_CODE,
            "code": giftCode,
            "nickName": Configs.Login.Nickname
        };
        Http.get(Configs.App.API, params, (err, res) => {
            App.instance.showLoading2(false);
            if(err) {
                App.instance.actShowThongBao(err);
                return;
            }
            if(!res.success) {
                App.instance.actShowThongBao(res.errorCode);
                return;
            } else {
                App.instance.actShowThongBao(msgInsertCodeSuccessfully);
                this.resetAllData();
            }
        });
    }

    actGoToFanPage() {
        cc.sys.openURL(GameURL.FANPAGE);
    }

    actClosePopupGiftCode() {
        LobbyLobbyController._instance.actClosePopup(this.node);
    }

    resetAllData() {
        this.edbGiftCode.string = "";
    }
}
