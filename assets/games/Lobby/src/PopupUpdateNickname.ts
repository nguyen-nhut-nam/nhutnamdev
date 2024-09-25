import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import SPUtils from "../../../scripts/common/SPUtils";
import GameErrorMessage from "../../../scripts/enum/GameErrorMessage";
import ApiIDEnum from "./enum/ApiIDEnum";

const { ccclass, property } = cc._decorator;

namespace Lobby {
    @ccclass
    export class PopupUpdateNickname extends Dialog {

        @property(cc.EditBox)
        edbNickname: cc.EditBox = null;

        private username: string = "";
        private password: string = "";

        protected onLoad() {
            this.username = SPUtils.getUserName();
            this.password = SPUtils.getUserPass();
        }

        public actUpdate() {
            let _this = this;
            let nickname = this.edbNickname.string.trim();

            if (nickname.length < 6) {
                App.instance.actShowThongBao(GameErrorMessage.NICKNAME_NOT_ENOUGH_LENGTH);
                return;
            }

            App.instance.showLoading2(true);
            Http.get(Configs.App.API, { "c": ApiIDEnum.UPDATE_NICKNAME, "un": _this.username, "pw": md5(_this.password), "nn": nickname }, (err, res) => {
                App.instance.showLoading2(false);
                if (err != null) {
                    App.instance.alertDialog.showMsg("Xảy ra lỗi, vui lòng thử lại sau!");
                    return;
                }
                if (!res["success"]) {
                    switch (parseInt(res["errorCode"])) {
                        case 1001:
                            App.instance.alertDialog.showMsg("Mất kết nối đến Server!");
                            break;
                        case 1005:
                            App.instance.alertDialog.showMsg("Tài khoản không tồn tại.");
                            break;
                        case 1007:
                            App.instance.alertDialog.showMsg("Mật khẩu không chính xác.");
                            break;
                        case 1109:
                            App.instance.alertDialog.showMsg("Tài khoản đã bị khóa.");
                            break;
                        case 106:
                            App.instance.alertDialog.showMsg("Tên hiển thị không hợp lệ.");
                            break;
                        case 1010:
                        case 1013:
                            App.instance.alertDialog.showMsg("Tên hiển thị đã tồn tại.");
                            break;
                        case 1011:
                            App.instance.alertDialog.showMsg("Tên hiển thị khôn được trùng với tên đăng nhập.");
                            break;
                        case 116:
                            App.instance.alertDialog.showMsg("Không chọn tên hiển thị nhạy cảm.");
                            break;
                        case 1114:
                            App.instance.alertDialog.showMsg("Hệ thống đang bảo trì. Vui lòng quay trở lại sau!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg(res["errorCode"]);
                            break;
                    }
                    return;
                }
                _this.dismiss();
                BroadcastReceiver.send(BroadcastReceiver.UPDATE_NICKNAME_SUCCESS, { "username": _this.username, "password": _this.password });
            });
        }
        _onDismissed() {
            super._onDismissed();
            this.node.destroy();
        }
    }

}
export default Lobby.PopupUpdateNickname;
