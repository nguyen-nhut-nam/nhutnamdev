import Configs from "../../../scripts/common/Configs";
import InPacket from "../../../scripts/networks/Network.InPacket";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import ToastMessage from "../../../scripts/common/ToastMessage";
import Utils from "../../../scripts/common/Utils";
import cmd from "./TaiXiuLiveKub.Cmd";
import TaiXiuLiveKubController from "./TaiXiuLiveKub.TaiXiuLiveKubController";
import GameErrorMessage from "../../../scripts/enum/GameErrorMessage";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";

const { ccclass, property } = cc._decorator;

enum TYPE_CHAT {
    CHAT, TIP
}

namespace taixiukubet {
    @ccclass
    export class PanelChat extends cc.Component {

        @property(cc.Node)
        itemChatTemplate: cc.Node = null;
        @property(cc.ScrollView)
        scrMessage: cc.ScrollView = null;
        @property(cc.EditBox)
        edbMessage: cc.EditBox = null;
        @property(cc.Node)
        nodeChat = null;
        @property(cc.Node)
        nodeTip = null;
        @property(cc.Node)
        toggleContainer = null;

        private minRequireToChat = 0;
        private _tipAmount = 0;

        start() {
            MiniGameNetworkClient.getInstance().addListener((data: Uint8Array) => {
                if (!this.node.active) return;
                let inpacket = new InPacket(data);
                switch (inpacket.getCmdId()) {
                    case cmd.Code.LOG_CHAT: {
                        let res = new cmd.ReceiveLogChat(data);
                        this.minRequireToChat = res.chatMinRequired;
                        var msgs = JSON.parse(res.message);
                        for (var i = 0; i < msgs.length; i++) {
                            this.addMessage(msgs[i]["u"], msgs[i]["m"], 0, 0);
                        }
                        this.scrollToBottom();
                        break;
                    }
                    case cmd.Code.SEND_CHAT: {
                        let res = new cmd.ReceiveSendChat(data);
                        switch (res.error) {
                            case 0:
                                this.addMessage(res.nickname, res.message, res.type, res.money);
                                break;
                            case 2:
                                TaiXiuLiveKubController.instance.showToast("Bạn không có quyền Chat!");
                                break;
                            case 3:
                                TaiXiuLiveKubController.instance.showToast("Tạm thời bạn bị cấm Chat!");
                                break;
                            case 4:
                                TaiXiuLiveKubController.instance.showToast(`${ToastMessage.TAI_XIU_CHAT_TOO_LONG}`);
                                break;
                            case 5:
                                TaiXiuLiveKubController.instance.showToast(`${ToastMessage.TAI_XIU_CHAT_CHAT_FAST}`);
                                break;
                            case 6:
                                TaiXiuLiveKubController.instance.showToast(`${ToastMessage.TAI_XIU_CHAT_TOO_LONG}`);
                                break;
                            case 7:
                                TaiXiuLiveKubController.instance.showToast(`Cần tối thiểu ${Utils.formatNumber(this.minRequireToChat)} để chat`);
                                break;
                            default:
                                TaiXiuLiveKubController.instance.showToast(`${ToastMessage.TAI_XIU_CHAT_CHAT_FAST}`);
                                break;
                        }
                        // console.log(res);
                        break;
                    }
                }}, this);
            this.itemChatTemplate.active = false;
        }

        protected onEnable() {
            if(cc.sys.platform == cc.sys.DESKTOP_BROWSER) {
                this.edbMessage.focus();
            }
            this.scrMessage.content.removeAllChildren(true);
            MiniGameNetworkClient.getInstance().send(new cmd.SendScribeChat());
        }

        addMessage(nickname: string, message: string, typeMessage: number, money: number = 0) {
            let item: cc.Node = null;
            for (var i = 0; i < this.scrMessage.content.childrenCount; i++) {
                let node = this.scrMessage.content.children[i];
                if (!node.active) {
                    item = node;
                    break;
                }
            }
            if (item == null) {
                if (this.scrMessage.content.childrenCount >= 50) {
                    item = this.scrMessage.content.children[0];
                } else {
                    item = cc.instantiate(this.itemChatTemplate);
                }
            }
            var zIndex = 0;
            for (var i = 0; i < this.scrMessage.content.childrenCount; i++) {
                let node = this.scrMessage.content.children[i];
                if (node != item) {
                    node.zIndex = zIndex++;
                }
            }
            item.parent = this.scrMessage.content;
            if(typeMessage == TYPE_CHAT.CHAT) {
                let strChat = '';
                if(nickname == Configs.Login.Nickname) {
                    strChat = `<color=#00cec9>${nickname}</color>: ${message}`;
                } else {
                    strChat = `<color=#fd9644>${nickname}</color>: ${message}`;
                }

                item.getComponent(cc.RichText).string = strChat;
                item.active = true;
                item.zIndex = zIndex++;
            } else {
                let moneyTip = money;
                let strChat = `<color=#D69DFF>${nickname}</color> đã tip @GIFT@ cho dealer`;
                strChat = strChat.replace("@GIFT@", "<img src='" + moneyTip + '\' width="40%" height="40%"/>');
                item.getComponent(cc.RichText).string = strChat;
                item.active = true;
                item.zIndex = zIndex++;
                this.btnChatClick();
                this.toggleContainer.children[0].getComponent(cc.Toggle).isChecked = true;
                Configs.Login.Coin -= moneyTip;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
            }
            this.scrollToBottom();
        }

        sendChat() {
            let msg = this.edbMessage.string.trim();
            if (msg.length == 0) {
                return;
            }

            if(Configs.Login.Coin < this.minRequireToChat) {
                TaiXiuLiveKubController.instance.showToast(`Cần tối thiểu ${Utils.formatNumber(this.minRequireToChat)} để chat`);
                return;
            }
            this.edbMessage.string = "";
            let delayTime = .2;
            if(cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
                this.scheduleOnce(() => {
                    this.edbMessage.focus();
                }, delayTime);
            }
            var req = new cmd.SendChat(unescape(encodeURIComponent(msg)), TYPE_CHAT.CHAT);
            MiniGameNetworkClient.getInstance().send(req); // gửi chat này
        }

        scrollToBottom() {
            this.scrMessage.scrollToBottom(0.2);
        }

        protected onDestroy() {
            MiniGameNetworkClient.getInstance().send(new cmd.SendUnScribeChat());
        }

        onBtnTipPress(event, data) {
            this._tipAmount = parseInt(data);
            if(this._tipAmount > Configs.Login.Coin) {
                TaiXiuLiveKubController.instance.showToast(`${GameErrorMessage.NOT_ENOUGH_BALANCE}`);
                return;
            }
            let req = new cmd.SendChat("", TYPE_CHAT.TIP, this._tipAmount);
            MiniGameNetworkClient.getInstance().send(req);
        }

        btnChatClick() {
            this.nodeChat.active = true;
            this.nodeTip.active = false;
        }

        btnTipClick() {
            this.nodeChat.active = false;
            this.nodeTip.active = true;
        }
    }
}
export default taixiukubet.PanelChat;
