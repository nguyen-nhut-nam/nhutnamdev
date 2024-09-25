import GameURL from "../../../../scripts/common/game/GameURL";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupSupport extends cc.Component {

    actGoToFanPage() {
        cc.sys.openURL(GameURL.FANPAGE);
    }

    actGoToLiveChat() {
        cc.sys.openURL(GameURL.LIVE_CHAT);
    }

    actGoToCommunity() {
        cc.sys.openURL(GameURL.TELEGRAM_COMMUNITY);
    }

    actCSKHTelegram() {
        cc.sys.openURL(GameURL.CSKH_TELEGRAM);
    }

    actCheckLocTelegram() {
        cc.sys.openURL(GameURL.CHECK_LOC_TELEGRAM);
    }
}
