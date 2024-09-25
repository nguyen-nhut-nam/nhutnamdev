import Popup from "../../../scripts/common/Popup";
import App from "../../../scripts/common/App";
import XocDiaHonorItem from "./XocDia.HonorItem";
import GameGetLeaderBoard from "../../../scripts/common/Game.GetLeaderBoard";

const {ccclass, property} = cc._decorator;

@ccclass
export default class XocDiaPopupGuide extends Popup {

    openXocDiaLink(url) {
        cc.sys.openURL(url);
    }

    openMD5CZ() {
        this.openXocDiaLink(`https://www.md5.cz`);
    }

    openMD5Services() {
        this.openXocDiaLink(`https://www.md5.services`);
    }
}
