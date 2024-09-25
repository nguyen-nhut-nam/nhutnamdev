import App from "../../../scripts/common/App";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import Configs from "../../../scripts/common/Configs";
import Dialog from "../../../scripts/common/Dialog";
import Http from "../../../scripts/common/Http";
import SPUtils from "../../../scripts/common/SPUtils";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import cmd from "../../../scripts/common/Lobby.Cmd";
import ShootFishNetworkClient from "../../../scripts/networks/ShootFishNetworkClient";
import SlotNetworkClient from "../../../scripts/networks/SlotNetworkClient";
import PopupUpdateNickname from "./PopupUpdateNickname";
import InPacket from "../../../scripts/networks/Network.InPacket";
import PopupSecurityPhone from "./Lobby.PopupSecurityPhone";
import PopupUpdatePhone from "./PopupUpdatePhone";

const {ccclass, property} = cc._decorator;


namespace Lobby {
@ccclass
export  class PopupLoginV2 extends Dialog {

    @property(cc.EditBox)
    edbUsername: cc.EditBox = null;
    @property(cc.EditBox)
    edbPassword: cc.EditBox = null;
    @property(cc.EditBox)
    edbCaptcha: cc.EditBox = null;

    @property(cc.Node)
    panelNotLogin: cc.Node = null;
    @property(cc.Node)
    panelLogined: cc.Node = null;
    @property(PopupUpdateNickname)
    popupUpdateNickname: PopupUpdateNickname = null;
    @property(PopupSecurityPhone)
    popupSecurityPhone: PopupSecurityPhone = null;
    @property(PopupUpdatePhone)
    popupUpdatePhone: PopupUpdatePhone = null;

    @property(cc.Sprite)
    spriteCaptcha: cc.Sprite = null;

    private sessionID = '';

     md52(message = '', key = ''){
        let m = CryptoJS.AES.encrypt(message, key);
          return base64.encode (m.toString());
    }

    checkVerifiedAccount(nickname){
        Http.get(Configs.App.API, { "c": 4020, "nickname": nickname }, (err, res) => {
            if (err == null) {
                if(res == '0') {
                    this.popupSecurityPhone.show();
                }
            }
        });
    }

    actLoadCaptCha() {
        App.instance.showLoading2(true);
        Http.get(Configs.App.API, {"c": 4089}, (err, res) => {
            App.instance.showLoading2(false);
            if (err != null) {
                App.instance.alertDialog.showMsg("Không thể tải Captcha. Vui lòng thử lại hoặc liên hệ CSKH");
                return;
            }
            this.sessionID = res.sessionID;
            let self = this;
            let imgElement = new Image();
            imgElement.src = 'data:image/png;base64,' + res.captcha_base64.split('\\').join('');
            imgElement.width = 160;
            console.log("imga ", imgElement);
            setTimeout(function () {
                let sprite = new cc.Texture2D();
                sprite.initWithElement(imgElement);
                sprite.handleLoadedTexture();
                let spriteFrame = new cc.SpriteFrame(sprite);
                self.spriteCaptcha.spriteFrame = spriteFrame;
            }, 10);

        });
    }

    showLogin(userName: string, password: string) {
        super.show();
        this.actLoadCaptCha();
        this.edbUsername.string = userName;
        this.edbPassword.string = password;

    }

    actLogin(): void {
        // console.log("actLogin");
        let username = this.edbUsername.string.trim();
        let password = this.edbPassword.string;
        let captcha = this.edbCaptcha.string.trim();
        if (username.length == 0) {
            App.instance.alertDialog.showMsg("Tên đăng nhập không được để trống.");
            return;
        }

        if (password.length == 0) {
            App.instance.alertDialog.showMsg("Mật khẩu không được để trống.");
            return;
        }

        if (captcha.length == 0) {
            App.instance.alertDialog.showMsg("Captcha không được để trống.");
            return;
        }
        this.popupUpdatePhone.show2(username,password, captcha, this.sessionID);
        this.dismiss();
    }


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {

    // }

    // update (dt) {}
}
}
export default Lobby.PopupLoginV2;
