import Popup from "../../../../scripts/common/Popup";
import GameURL from "../../../../scripts/common/game/GameURL";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends Popup {

    @property(cc.Node)
    btnCSKHTele = null;
    @property(cc.Node)
    btnCSKHLiveChat = null;
    @property(cc.SpriteFrame)
    sprCSKHTeleActive = null;
    @property(cc.SpriteFrame)
    sprCSKHTeleInActive = null;
    @property(cc.SpriteFrame)
    sprCSKHLiveChatActive = null;
    @property(cc.SpriteFrame)
    sprCSKHLiveChatInActive = null;

    protected onLoad() {
        super.onLoad();
        this.btnCSKHTele.getComponent(cc.Sprite).spriteFrame = GameURL.CSKH_TELEGRAM.length == 0 ? this.sprCSKHTeleInActive : this.sprCSKHTeleActive;
        this.btnCSKHTele.getComponent(cc.Button).interactable = GameURL.CSKH_TELEGRAM.length != 0;
        this.btnCSKHLiveChat.getComponent(cc.Sprite).spriteFrame = GameURL.LIVE_CHAT.length == 0 ? this.sprCSKHLiveChatInActive : this.sprCSKHLiveChatActive;
        this.btnCSKHLiveChat.getComponent(cc.Button).interactable = GameURL.LIVE_CHAT.length != 0;
    }

    actGoToLiveChat() {
        cc.sys.openURL(GameURL.LIVE_CHAT);
    }

    actCSKHTelegram() {
        cc.sys.openURL(GameURL.CSKH_TELEGRAM);
    }
}
