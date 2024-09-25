import Configs from "../../../../scripts/common/Configs";
import App from "../../../../scripts/common/App";
import GameErrorMessage from "../../../../scripts/enum/GameErrorMessage";
import ShopTabEnum from "../enum/ShopTabEnum";
import LobbyLobbyController from "../Lobby.LobbyController";
import PopupEvent from "../account/event/PopupEvent";
import GameURL from "../../../../scripts/common/game/GameURL";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TabFirstCharge extends cc.Component {

    actOpenChargeMoMo() {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
            return;
        }
        PopupEvent.getInstance().actClosePopupEvent(null);
        LobbyLobbyController._instance.actCreatePopupShop(ShopTabEnum.WALLET);
    }

    actOpenChargeCard() {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
            return;
        }
        PopupEvent.getInstance().actClosePopupEvent(null);
        LobbyLobbyController._instance.actCreatePopupShop(ShopTabEnum.CARD);
    }

    actOpenChargeBank() {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
            return;
        }
        PopupEvent.getInstance().actClosePopupEvent(null);
        LobbyLobbyController._instance.actCreatePopupShop(ShopTabEnum.AUTO_BANK);
    }

    actOpenCSKHTelegram() {
        cc.sys.openURL(GameURL.CSKH_TELEGRAM);
    }
}
