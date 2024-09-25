import nodeUtils from "../../../scripts/common/NodeUtils";
import BauCuaController from "./BauCuaTo2.BauCuaController";
import InPacket from "../../../scripts/networks/Network.InPacket";
import BauCuaTo2NetworkClient from "../../../scripts/networks/BauCuaTo2NetworkClient";
import cmd from "./BauCuaTo2.Cmd";

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
        BauCuaTo2NetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.CHAT_ROOM:{
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

    actShowHideEmotion() {
        if(this.nodeEmotion.active) {
            this.showEmotion(false);
        } else {
            this.showEmotion(true);
        }
    }

    showEmotion(enabled) {
        this.nodeEmotion.active = enabled;
    }

    actHideEmotion() {
        this.showEmotion(false);
    }

    sendChat(event) {
        let node = event.currentTarget;
        let text = nodeUtils.getChildNode(node, "text").getComponent(cc.Label).string;
        BauCuaController.instance.edtChatInput.string = text;
        BauCuaController.instance.chatMsg();
    }

    private closePane() {
        BauCuaController.instance.closeUIChat();
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