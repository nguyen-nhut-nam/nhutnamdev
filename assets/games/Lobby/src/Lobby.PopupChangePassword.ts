import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import InPacket from "../../../scripts/networks/Network.InPacket";
import cmd from "../../../scripts/common/Lobby.Cmd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupChangePassword extends cc.Component {
    @property(cc.EditBox)
    edbOldPassword: cc.EditBox = null;
    @property(cc.EditBox)
    edbNewPassword: cc.EditBox = null;
    @property(cc.EditBox)
    edbReNewPassword: cc.EditBox = null;

    start() {
        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            // console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.CHANGE_PASSWORD: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResChangePassword(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Thay đổi mật khẩu thành công.");
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg("Hệ thống đang tạm thời gián đoạn!");
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg("Chức năng này dành cho các tài khoản đã đăng ký bảo mật SMS PLUS!");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("Mật khẩu cũ không chính xác!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
            }
        }, this);
    }

    actChangePassword() {
        let oldPassword = this.edbOldPassword.string.trim();
        let newPassword = this.edbNewPassword.string.trim();
        let reNewPassword = this.edbReNewPassword.string.trim();
        if (oldPassword.length == 0) {
            App.instance.alertDialog.showMsg("Mật khẩu cũ không được để trống.");
            return;
        }
        if (newPassword.length == 0) {
            App.instance.alertDialog.showMsg("Mật khẩu mới không được để trống.");
            return;
        }
        if (reNewPassword != newPassword) {
            App.instance.alertDialog.showMsg("Hai mật khẩu mới không giống nhau.");
            return;
        }
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqChangePassword(oldPassword, newPassword));
    }
}
