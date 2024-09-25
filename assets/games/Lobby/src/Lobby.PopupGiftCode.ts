import Dialog from "../../../scripts/common/Dialog";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import App from "../../../scripts/common/App";
import InPacket from "../../../scripts/networks/Network.InPacket";
import cmd from "../../../scripts/common/Lobby.Cmd";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import Configs from "../../../scripts/common/Configs";
import PopupSecurityPhone from "./Lobby.PopupSecurityPhone";
import Http from "../../../scripts/common/Http";
import SPUtils from "../../../scripts/common/SPUtils";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupGiftCode extends Dialog {

    @property(cc.EditBox)
    edbCode: cc.EditBox = null;
    @property(PopupSecurityPhone)
    popupSecurityPhone: PopupSecurityPhone = null;

    start() {
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

    show() {
        super.show();
        this.edbCode.string = "";
    }

    actSubmit() {
        Http.get(Configs.App.API, { "c": 4020, "nickname": SPUtils.getNickName() }, (err, res) => {
            if (err == null) {
                if(res == '0') {
                    App.instance.alertDialog.showMsg("Vui lòng xác thực tài khoản bằng số điện thoại để thực hiện chức năng này!");
                    this.popupSecurityPhone.show();
                } else {
                    let code = this.edbCode.string.trim();
                    if (code == "") {
                        App.instance.alertDialog.showMsg("Mã quà tặng không được để trống.");
                        return;
                    }
                    App.instance.showLoading2(true);
                    MiniGameNetworkClient.getInstance().send(new cmd.ReqInsertGiftcode(code));
                }
            }
        });
    }
}
