import Dialog from "../../../scripts/common/Dialog";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import App from "../../../scripts/common/App";
import Utils from "../../../scripts/common/Utils";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import utils from "../../../scripts/common/Utils";
import Popup from "../../../scripts/common/Popup";
import GameErrorMessage from "../../../scripts/enum/GameErrorMessage";
import ApiIDEnum from "./enum/ApiIDEnum";

const {ccclass, property} = cc._decorator;

namespace Lobby {

    @ccclass
    export class PopupRegister extends Popup {
        @property(cc.EditBox)
        edbUsername: cc.EditBox = null;
        @property(cc.EditBox)
        edbPassword: cc.EditBox = null;
        @property(cc.EditBox)
        edbNickname: cc.EditBox = null;
        @property(cc.EditBox)
        edbRePassword: cc.EditBox = null;
        @property(cc.EditBox)
        edbCodeDaily: cc.EditBox = null;

        @property([cc.SpriteFrame])
        iconCheck: cc.SpriteFrame[] = [];

        @property(cc.Sprite)
        checkUsername: cc.Sprite = null;

        @property(cc.Sprite)
        checkPassword: cc.Sprite = null;

        @property(cc.Sprite)
        reCheckPassword: cc.Sprite = null;

        @property(cc.Sprite)
        checkNickName: cc.Sprite = null;

        checkUn = false;
        checknn = false;

        protected onEnable() {
            super.onEnable();
            if(cc.sys.platform === cc.sys.MOBILE_BROWSER) {
                this.node.getChildByName('Container').rotation = -90;
            }
        }

        actionCheckUsername() {
            let username = this.edbUsername.string.trim();
            if (username && username.length >= 6) {
                let reqParams = {"c": 17, "data": username, "tp": 0};
                Http.get(Configs.App.API, reqParams, (err, res) => {
                    if (!res["success"]) {
                        App.instance.alertDialog.showMsg("Tên đăng nhập đã tồn tại.");
                        this.checkUsername.node.active = true;
                        this.checkUsername.spriteFrame = this.iconCheck[1];
                        this.checkUn = false;
                    } else {
                        this.checkUsername.node.active = true;
                        this.checkUsername.spriteFrame = this.iconCheck[0];
                        this.checkUn = true;
                    }
                });

            } else {
                this.checkUsername.node.active = true;
                this.checkUsername.spriteFrame = this.iconCheck[1];
                this.checkUn = false;
            }
        }

        actionCheckPassword() {
            let password = this.edbPassword.string;
            if (password && password.length >= 6) {
                this.checkPassword.node.active = true;
                this.checkPassword.spriteFrame = this.iconCheck[0];
            } else {
                this.checkPassword.node.active = true;
                this.checkPassword.spriteFrame = this.iconCheck[1];
            }
        }

        actionReCheckPassword() {
            let rePassword = this.edbRePassword.string;
            let password = this.edbPassword.string;
            if (rePassword && rePassword.length >= 6 && rePassword == password) {
                this.reCheckPassword.node.active = true;
                this.reCheckPassword.spriteFrame = this.iconCheck[0];
            } else {
                this.reCheckPassword.node.active = true;
                this.reCheckPassword.spriteFrame = this.iconCheck[1];
            }
        }

        actionCheckNickName() {
            let nickname = this.edbNickname.string;
            if (nickname && nickname.length > 6) {
                let reqParams = {"c": 17, "data": nickname, "tp": 1};
                Http.get(Configs.App.API, reqParams, (err, res) => {
                    if (!res["success"]) {
                        App.instance.alertDialog.showMsg("Tên nhân vật đã tồn tại.");
                        this.checkNickName.node.active = true;
                        this.checkNickName.spriteFrame = this.iconCheck[1];
                        this.checknn = false;
                    } else {
                        this.checkNickName.node.active = true;
                        this.checkNickName.spriteFrame = this.iconCheck[0];
                        this.checknn = true;
                    }
                });
            } else {
                this.checkNickName.node.active = true;
                this.checkNickName.spriteFrame = this.iconCheck[1];
                this.checknn = false;
            }
        }

        public actRegister() {
            let _this = this;
            let username = this.edbUsername.string.trim();
            let password = this.edbPassword.string.trim();
            let rePassword = this.edbRePassword.string.trim();
            let nickname = this.edbNickname.string.trim();
            let codedaily = this.edbCodeDaily.string;

            if (username.length < 6) {
                App.instance.alertDialog.showMsg(GameErrorMessage.USERNAME_NOT_ENOUGH_LENGTH);
                return;
            }

            if (password.length < 6) {
                App.instance.alertDialog.showMsg(GameErrorMessage.PASSWORD_NOT_ENOUGH_LENGTH);
                return;
            }

            if (rePassword.length < 6) {
                App.instance.alertDialog.showMsg(GameErrorMessage.PASSWORD_NOT_ENOUGH_LENGTH);
                return;
            }

            if (password != rePassword) {
                App.instance.alertDialog.showMsg(GameErrorMessage.TWO_PASSWORD_NOT_MATCH);
                return;
            }
            if (nickname.length < 6) {
                App.instance.actShowThongBao(GameErrorMessage.NICKNAME_NOT_ENOUGH_LENGTH);
                return;
            }

            if (nickname == username) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NICKNAME_MUST_BE_UNIQUE);
                return;
            }

            if (nickname.length >= 6) {
                let reqParams = {"c": ApiIDEnum.CHECK_NICKNAME_VALID, "data": nickname, "tp": 1};
                Http.get(Configs.App.API, reqParams, (err, res) => {
                    if (!res["success"]) {
                        App.instance.alertDialog.showMsg("Tên nhân vật đã tồn tại.");
                        return;
                    } else {
                        let reqParams = {
                            "c": ApiIDEnum.USER_REGISTER,
                            "un": username,
                            "pw": md5(password),
                            "nn": nickname,
                            "cp": "1",
                            "cid": "1"
                        };
                        App.instance.showLoading2(true);
                        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
                            reqParams["utm_source"] = "IOS";
                            reqParams["utm_medium"] = "IOS";
                            reqParams["utm_term"] = "IOS";
                            reqParams["utm_content"] = "IOS";
                            reqParams["utm_campaign"] = "IOS";
                            reqParams["code_daily"] = 'SUPPER_WEB';
                        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                            reqParams["utm_source"] = "ANDROID";
                            reqParams["utm_medium"] = "ANDROID";
                            reqParams["utm_term"] = "ANDROID";
                            reqParams["utm_content"] = "ANDROID";
                            reqParams["utm_campaign"] = "ANDROID";
                            reqParams["code_daily"] = 'sunwin_chinh';
                        } else if (!cc.sys.isNative) {
                            let url = new URL(window.location.href);
                            let codedl = url.searchParams.get("dl");
                            if (codedl != null && codedl.length > 5 && codedl.length < 20) {
                                codedaily = url.searchParams.get("dl");
                            } else {
                                switch (window.location.hostname) {
                                    default:
                                        codedaily = window.location.hostname.replace(/[^\w\s]/gi, '_');
                                        break;
                                }
                            }
                            reqParams["code_daily"] = codedaily;
                        }
                        reqParams["code_daily"] = utils.mapMaDaiLy(reqParams["code_daily"]);

                        Http.get(Configs.App.API, reqParams, (err, res) => {
                            App.instance.showLoading2(false);
                            if (err != null) {
                                App.instance.alertDialog.showMsg(err);
                                return;
                            }
                            if (!res["success"]) {
                                switch (parseInt(res["errorCode"])) {
                                    case 1001:
                                        App.instance.alertDialog.showMsg("Kết nối mạng không ổn định, vui lòng thử lại sau.");
                                        return;
                                    case 101:
                                        App.instance.alertDialog.showMsg("Tên đăng nhập không hợp lệ.");
                                        return;
                                    case 1006:
                                        App.instance.alertDialog.showMsg("Tài khoản đã tồn tại.");
                                        return;
                                    case 102:
                                        App.instance.alertDialog.showMsg("Mật khẩu không hợp lệ.");
                                        return;
                                    case 108:
                                        App.instance.alertDialog.showMsg("Mật khẩu không được trùng với tên đăng nhập.");
                                        return;
                                    case 115:
                                        App.instance.alertDialog.showMsg("Mã xác nhận không chính xác.");
                                        return;
                                    case 1114:
                                        App.instance.alertDialog.showMsg("Hệ thống đang bảo trì. Vui lòng quay trở lại sau!");
                                        return;
                                    default:
                                        App.instance.alertDialog.showMsg(res["errorCode"]);
                                        return;
                                }
                            } else {
                                Http.get(Configs.App.API, {
                                    "c": ApiIDEnum.UPDATE_NICKNAME,
                                    "un": username,
                                    "pw": md5(password),
                                    "nn": nickname
                                }, (err, response) => {
                                    App.instance.showLoading2(false);
                                    if (err != null) {
                                        App.instance.alertDialog.showMsg(err);
                                        return;
                                    }
                                    if (!response["success"]) {
                                        switch (parseInt(response["errorCode"])) {
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
                                                App.instance.alertDialog.showMsg(response["errorCode"]);
                                                break;
                                        }
                                        return;
                                    }
                                    this.runActionClose();
                                    _this.scheduleOnce(() => {
                                        _this.node.destroy();
                                    }, .5);
                                    BroadcastReceiver.send(BroadcastReceiver.UPDATE_NICKNAME_SUCCESS, {
                                        "username": username,
                                        "password": password
                                    });
                                });
                            }
                        });
                    }
                });
            }
        }
    }
}
export default Lobby.PopupRegister;
