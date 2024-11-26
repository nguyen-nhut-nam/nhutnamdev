import Configs from "../../../scripts/common/Configs";
import InPacket from "../../../scripts/networks/Network.InPacket";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import ToastMessage from "../../../scripts/common/ToastMessage";
import Utils from "../../../scripts/common/Utils";
import cmd from "./TaiXiuLiveKub.Cmd";
import TaiXiuLiveKubController from "./TaiXiuLiveKub.TaiXiuLiveKubController";

const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PanelChat extends cc.Component {

        @property(cc.Node)
        itemChatTemplate: cc.Node = null;
        @property(cc.ScrollView)
        scrMessage: cc.ScrollView = null;
        @property(cc.EditBox)
        edbMessage: cc.EditBox = null;

        private minRequireToChat = 0;

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
                            this.addMessage(msgs[i]["u"], msgs[i]["m"]);
                        }
                        this.scrollToBottom();
                        break;
                    }
                    case cmd.Code.SEND_CHAT: {
                        let res = new cmd.ReceiveSendChat(data);
                        switch (res.error) {
                            case 0:
                                this.addMessage(res.nickname, res.message);
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

        addMessage(nickname: string, message: string) {
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
            let lblNickname: cc.Label = item.getChildByName("lblNickname").getComponent(cc.Label);
            lblNickname.string = `${nickname}:`;
            lblNickname.node.color = nickname == Configs.Login.Nickname ? cc.Color.WHITE.fromHEX("#00cec9") : cc.Color.WHITE.fromHEX("#fd9644");
            item.getComponent(cc.Label).string = `${lblNickname.string} ${message}`;
            item.active = true;
            item.zIndex = zIndex++;
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
            var req = new cmd.SendChat(unescape(encodeURIComponent(msg)));
            MiniGameNetworkClient.getInstance().send(req); // gửi chat này
        }

        scrollToBottom() {
            this.scrMessage.scrollToBottom(0.2);
        }

        protected onDestroy() {
            MiniGameNetworkClient.getInstance().send(new cmd.SendUnScribeChat());
        }
    }
}
export default taixiumini.PanelChat;
