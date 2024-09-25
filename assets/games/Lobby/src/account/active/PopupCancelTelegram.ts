import Popup from "../../../../../scripts/common/Popup";
import LobbyLobbyController from "../../Lobby.LobbyController";
import GameURL from "../../../../../scripts/common/game/GameURL";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends Popup {

    actClosePopupCancelTelegram() {
        LobbyLobbyController._instance.actClosePopup(this.node, () => {
        });
    }

    actCSKHTelegram() {
        cc.sys.openURL(GameURL.CSKH_TELEGRAM);
    }
}
