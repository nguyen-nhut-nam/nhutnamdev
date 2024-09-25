import LobbyLobbyController from "../../Lobby.LobbyController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LobbyPopupSecurityTelegram extends cc.Component {
    @property(cc.Prefab)
    prefabPopupSecurityGuide = null;

    actClosePopupSecurity() {
        LobbyLobbyController._instance.actClosePopup(this.node, () => {
        });
    }

    actOpenSecurityGuide() {
        LobbyLobbyController._instance.actOpenPopup(this.prefabPopupSecurityGuide);
    }
}
