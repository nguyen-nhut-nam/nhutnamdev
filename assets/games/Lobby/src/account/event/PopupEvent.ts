import LobbyLobbyController from "../../Lobby.LobbyController";
import Popup from "../../../../../scripts/common/Popup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupEvent extends Popup {

    private static _instance: PopupEvent = null;

    protected onLoad() {
        if(PopupEvent._instance == null) {
            PopupEvent._instance = this;
        }
    }

    public static getInstance() {
        return PopupEvent._instance;
    }

    actClosePopupEvent(event) {
        if(event) {
            event.currentTarget.off(cc.Node.EventType.TOUCH_END);
        }
        LobbyLobbyController._instance.actClosePopup(this.node);
    }

    protected onDestroy() {
        PopupEvent._instance = null;
    }
}
