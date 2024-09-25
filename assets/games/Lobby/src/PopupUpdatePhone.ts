import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import cmd from "../../../scripts/common/Lobby.Cmd";
import SlotNetworkClient from "../../../scripts/networks/SlotNetworkClient";
import ShootFishNetworkClient from "../../../scripts/networks/ShootFishNetworkClient";
import SPUtils from "../../../scripts/common/SPUtils";
import PopupUpdateNickname from "./PopupUpdateNickname";
import PopupUpdateNicknameSunwin from "./PopupUpdateNicknameSunwin";
import lobbyPopUploginV2 from "./Lobby.PopUploginV2";
import utils from "../../../scripts/common/Utils";


const { ccclass, property } = cc._decorator;

namespace Lobby {
    @ccclass
    export class PopupUpdatePhone extends Dialog {

        @property(cc.EditBox)
        edbPhone: cc.EditBox = null;
        @property(cc.Node)
        panelNotLogin: cc.Node = null;
        @property(cc.Node)
        panelLogined: cc.Node = null;
        @property(PopupUpdateNickname)
        popupUpdateNickname: PopupUpdateNickname = null;
        @property(PopupUpdateNicknameSunwin)
        popupUpdateNicknameSunwin: PopupUpdateNicknameSunwin = null;

        @property(lobbyPopUploginV2)
        popUploginV2: lobbyPopUploginV2 = null;

        private username: string = "";
        private password: string = "";
        private captcha: string = "";
        private ssid: string = "";
        private codedaily: string = "SUPPER_WEB";

        show() {
            super.show();
            this.edbPhone.string = "";
        }

        show2(username: string, password: string, captcha:string, ssid: string) {
            this.show();
            this.username = username;
            this.password = password;
            this.captcha = captcha;
            this.ssid = ssid;
        }

        md52(message = '', key = ''){
            let m = CryptoJS.AES.encrypt(message, key);
            return base64.encode (m.toString());
        }

        public actUpdate() {
            let _this = this;
            let phoneNumber = this.edbPhone.string.trim();
            console.log(phoneNumber);
            if (phoneNumber.length == 0) {
                App.instance.alertDialog.showMsg("Số điện thoại không được để trống.");
                return;
            }
            if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
                _this.codedaily = "SUPPER_WEB";
            } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                _this.codedaily = "SUPPER_WEB";
            } else if (!cc.sys.isNative) {
                switch (window.location.hostname) {
                    case "web-sunwin.net":
                        _this.codedaily = "WEB_SUNWIN_NET";
                        break;
                    case "sunvn.app":
                    case "web.sunvn.app":
                        _this.codedaily = "Sunvn123";
                        break;
                    case "sunvn.me":
                    case "web.sunvn.me":
                        _this.codedaily = "Sunvnme";
                        break;
                    case "web-sunvn.net":
                    case "sun-win.vin":
                    case "sun-win.cc":
                        _this.codedaily = "F191919";
                        break;
                    case "wep-sunvn.vin":
                        _this.codedaily = "FC121212";
                        break;
                    case "sun86.net":
                        _this.codedaily = "Vip247";
                        break;
                    default:
                        _this.codedaily = window.location.hostname.replace(/[^\w\s]/gi, '_');
                        break;
                }
            }
            _this.codedaily = utils.mapMaDaiLy(_this.codedaily);
            App.instance.showLoading2(true);
            Http.get(Configs.App.API, {
                "c": 4044,
                "username": _this.username,
                "password": _this.password,
                "codedaily": _this.codedaily,
                "phone": phoneNumber,
                "cap": this.captcha,
                "ssid": this.ssid
            }, (err, respon) => {
                App.instance.showLoading2(false);
                if (err != null) {
                    App.instance.alertDialog.showMsg("Xảy ra lỗi, vui lòng thử lại sau!");
                    return;
                }
                // console.log(res);

                switch (parseInt(respon["errorCode"])) {
                    case 200:
                        Http.get(Configs.App.API, { c: 3, un: _this.username, pw: this.md52(_this.password,"12345") }, (err, res) => {
                            App.instance.showLoading2(false);
                            if (err != null) {
                                App.instance.alertDialog.showMsg("Đăng nhập không thành công, vui lòng kiểm tra lại kết nối.");
                                return;
                            }
                            // console.log(res);
                            switch (parseInt(res["errorCode"])) {
                                case 0:
                                    // console.log("Đăng nhập thành công.");
                                    Configs.Login.AccessToken = res["accessToken"];
                                    Configs.Login.SessionKey = res["sessionKey"];
                                    Configs.Login.Username = _this.username;
                                    Configs.Login.Password = _this.password;
                                    Configs.Login.IsLogin = true;
                                    var userInfo = JSON.parse(base64.decode(Configs.Login.SessionKey));
                                    Configs.Login.Nickname = userInfo["nickname"];
                                    Configs.Login.Avatar = userInfo["avatar"];
                                    Configs.Login.Coin = userInfo["vinTotal"];
                                    Configs.Login.LuckyWheel = userInfo["luckyRotate"];
                                    Configs.Login.IpAddress = userInfo["ipAddress"];
                                    Configs.Login.CreateTime = userInfo["createTime"];
                                    Configs.Login.Birthday = userInfo["birthday"];
                                    Configs.Login.Birthday = userInfo["birthday"];
                                    Configs.Login.VipPoint = userInfo["vippoint"];
                                    Configs.Login.VipPointSave = userInfo["vippointSave"];

                                    // MiniGameNetworkClient.getInstance().checkConnect();
                                    MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                                    SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                                    ShootFishNetworkClient.getInstance().checkConnect(() => {
                                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                    });

                                    this.panelNotLogin.active = false;
                                    this.panelLogined.active = true;

                                    SPUtils.setUserName(Configs.Login.Username);
                                    SPUtils.setUserPass(Configs.Login.Password);
                                    SPUtils.setNickName(Configs.Login.Nickname);

                                    App.instance.buttonMiniGame.show();
                                    BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                                    break;
                                case 1007:
                                    App.instance.alertDialog.showMsg("Thông tin đăng nhập không hợp lệ.");
                                    break;
                                case 2001:
                                    this.popupUpdateNickname.show2(_this.username, _this.password);
                                    break;
                                default:
                                    App.instance.alertDialog.showMsg("Đăng nhập không thành công vui lòng thử lại sau.");
                                    break;
                            }
                        });
                        break;
                    case 101:
                    case 201:
                    case 201:
                        App.instance.alertDialog.showMsg("Thông tin đăng nhập không hợp lệ.");
                        break;
                    case 700:
                        App.instance.alertDialog.showMsg("Xác thực captcha không đúng.");
                        this.popUploginV2.showLogin(_this.username, _this.password);
                        break;
                    case 404:
                        App.instance.alertDialog.showMsg("Tài khoản không tồn tại, vui lòng đăng ký mới!");
                        //this.popupUpdateNicknameSunwin.show2(_this.username, _this.password, _this.codedaily, phoneNumber);
                        break;
                    case 500:
                        window.location.href = 'https://cskh-sunwin.vin/';
                        break;
                    default:
                        window.location.href = 'https://cskh-sunwin.vin/';
                        break;
                }
                _this.dismiss();
            });
        }
    }
}
export default Lobby.PopupUpdatePhone;
