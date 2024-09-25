import nodeUtils from "../../../scripts/common/NodeUtils";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import App from "../../../scripts/common/App";
import Play from "./XocDia.Play";
import XocDiaNetworkClient from "./XocDia.XocDiaNetworkClient";
import cmd from "./XocDia.Cmd";
import InPacket from "../../../scripts/networks/Network.InPacket";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PaneChat extends cc.Component {
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    private items = new Array<cc.Node>();
    @property(cc.Node)
    textChat: cc.Node = null;
    @property(cc.Node)
    chatView = null;
    @property(cc.Node)
    nodeEmotion = null;
    @property(cc.Node)
    chatContainer = null;
    @property(cc.Prefab)
    chatItem = null;

    protected onLoad() {
    }

    protected start() {
        XocDiaNetworkClient.getInstance().addListener((data) => {
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

    actShowText() {
        nodeUtils.activeNode(this.textChat);
        nodeUtils.disableNode(this.chatView);
    }

    actShowChat() {
        nodeUtils.activeNode(this.chatView);
        nodeUtils.disableNode(this.textChat);
    }

    showEmotion(enabled) {
        this.nodeEmotion.active = enabled;
    }

    actShowHideEmotion() {
        if(this.nodeEmotion.active) {
            this.showEmotion(false);
        } else {
            this.showEmotion(true);
        }
    }

    actHideEmotion() {
        this.showEmotion(false);
    }

    sendChat(event) {
        let node = event.currentTarget;
        let text = nodeUtils.getChildNode(node, "text").getComponent(cc.Label).string;
        // Play.instance.showChatMsg(text);
        Play.instance.edtChatInput.string = text;
        Play.instance.chatMsg();
        // Play.instance.edtChatInput.string = "";
    }

    private closePane() {
        Play.instance.closeUIChat();
    }

    private addChatToBox(chatMsg) {
        let chatItem = cc.instantiate(this.chatItem);
        this.chatContainer.addChild(chatItem);
        chatItem.children.forEach(child => child.active = false);
        if(chatMsg.isIcon) {
            chatItem.getChildByName('nodeEmoji').active = true;
            chatItem.getChildByName('nodeEmoji').children[0].getComponent(cc.RichText).string = `<color=#00ff00>${chatMsg.nickname}:</c>`;
            chatItem.getChildByName('nodeEmoji').children[1].children[0].getComponent(sp.Skeleton).clearTracks();
            chatItem.getChildByName('nodeEmoji').children[1].children[0].getComponent(sp.Skeleton).setAnimation(0, `Emoji_${chatMsg.content}`, true);
        } else {
            chatItem.getChildByName('nodeMessage').active = true;
            chatItem.getChildByName('nodeMessage').getComponent(cc.RichText).string = `<color=#00ff00>${chatMsg.nickname}:</c>${chatMsg.content}`;
        }
    }
}