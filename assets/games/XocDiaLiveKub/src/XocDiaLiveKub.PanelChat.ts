import nodeUtils from "../../../scripts/common/NodeUtils";
import cmd from "./XocDiaLiveKub.Cmd";
import InPacket from "../../../scripts/networks/Network.InPacket";
import Configs from "../../../scripts/common/Configs";
import GameErrorMessage from "../../../scripts/enum/GameErrorMessage";
import XocDiaLiveKubNetworkClient from "./XocDiaLiveKub.XocDiaNetworkClient";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";

enum TYPE_CHAT {
    CHAT, TIP
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class PanelChat extends cc.Component {
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Node)
    chatContainer = null;
    @property(cc.Node)
    chatItem = null;
    @property(cc.Node)
    nodeChat = null;
    @property(cc.Node)
    nodeTip = null;
    @property(cc.Node)
    toggleContainer = null;
    @property(cc.EditBox)
    edbChatBox = null;

    private _tipAmount = 0;
    private isHideChat = false;

    protected onLoad() {
    }

    protected start() {
        XocDiaLiveKubNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.CHAT_MS_RESPONSE:{
                    let res = new cmd.ReceivedChatRoom(data);
                    this.addChatToBox(res);
                    break;
                }
            }

        }, this);
    }

    sendChat(event) {
        let node = event.currentTarget;
        let text = nodeUtils.getChildNode(node, "text").getComponent(cc.Label).string;
    }

    private addChatToBox(chatMsg) {
        let chatItem = cc.instantiate(this.chatItem);
        this.chatContainer.addChild(chatItem);
        if(this.chatContainer.childrenCount >= 50) {
            this.chatContainer.removeChild(this.chatContainer.children[0], true);
        }
        if(chatMsg.isIcon) {

        } else {
            if(chatMsg.type === TYPE_CHAT.TIP) {
                let strChat = `<color=#D69DFF>${chatMsg.nickname}</color> đã tip @GIFT@ cho dealer`;
                strChat = strChat.replace("@GIFT@", "<img src='" + chatMsg.money + '\' width="40%" height="40%"/>');
                chatItem.getComponent(cc.RichText).string = strChat;
                Configs.Login.Coin -= this._tipAmount;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
            } else {
                if(chatMsg.nickname == Configs.Login.Nickname) {
                    chatItem.getComponent(cc.RichText).string = `<color=#00cec9>${chatMsg.nickname}</color>: ${chatMsg.content}`;
                } else {
                    chatItem.getComponent(cc.RichText).string = `<color=#fd9644>${chatMsg.nickname}</color>: ${chatMsg.content}`;
                }
            }
        }
        this.btnChatClick();
        this.toggleContainer.children[0].getComponent(cc.Toggle).isChecked = true;
    }

    onBtnTipPress(event, data) {
        this._tipAmount = parseInt(data);
        if(this._tipAmount > Configs.Login.Coin) {
            this.addChatToBox(`${GameErrorMessage.NOT_ENOUGH_BALANCE}`);
            return;
        }
        XocDiaLiveKubNetworkClient.getInstance().send(new cmd.SendChatRoom(0, "", TYPE_CHAT.TIP, this._tipAmount));
    }

    btnChatClick() {
        this.nodeChat.active = true;
        this.nodeTip.active = false;
    }

    btnTipClick() {
        this.nodeChat.active = false;
        this.nodeTip.active = true;
    }

    chatMsg() {
        if (this.isHideChat) {
            return;
        }
        if (this.edbChatBox.string.trim().length > 0) {
            XocDiaLiveKubNetworkClient.getInstance().send(new cmd.SendChatRoom(0, this.edbChatBox.string, TYPE_CHAT.CHAT, 0));
            this.edbChatBox.string = "";
        }
    }
}