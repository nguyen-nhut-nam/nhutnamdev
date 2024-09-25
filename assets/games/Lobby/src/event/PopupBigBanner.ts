import LobbyLobbyController from "../Lobby.LobbyController";
import Configs from "../../../../scripts/common/Configs";
import App from "../../../../scripts/common/App";
import GameErrorMessage from "../../../../scripts/enum/GameErrorMessage";
import PopupEvent from "../account/event/PopupEvent";
import ShopTabEnum from "../enum/ShopTabEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupBigBanner extends cc.Component {

    actClosePopupBigBanner(event) {
        if(event) {
            event.currentTarget.off(cc.Node.EventType.TOUCH_END);
        }
        LobbyLobbyController._instance.actClosePopup(this.node);
    }

    actOpenChargeMoMo() {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
            return;
        }
        LobbyLobbyController._instance.actClosePopup(this.node);
        LobbyLobbyController._instance.actCreatePopupShop(ShopTabEnum.WALLET);
    }

    actOpenChargeCard() {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
            return;
        }
        LobbyLobbyController._instance.actClosePopup(this.node);
        LobbyLobbyController._instance.actCreatePopupShop(ShopTabEnum.CARD);
    }

    actOpenChargeBank() {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
            return;
        }
        LobbyLobbyController._instance.actClosePopup(this.node);
        LobbyLobbyController._instance.actCreatePopupShop(ShopTabEnum.AUTO_BANK);
    }

    actOpenPopupEvent() {
        LobbyLobbyController._instance.actClosePopup(this.node);
        LobbyLobbyController._instance.actOpenPopupEvent();
    }
}
