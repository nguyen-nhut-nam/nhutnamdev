import LobbyLobbyController from "../../Lobby.LobbyController";
import Popup from "../../../../../scripts/common/Popup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupSecurityTelegramGuide extends Popup {

    actClosePopupActiveTelegramGuide() {
        LobbyLobbyController._instance.actClosePopup(this.node, () => {
        });
    }
}
