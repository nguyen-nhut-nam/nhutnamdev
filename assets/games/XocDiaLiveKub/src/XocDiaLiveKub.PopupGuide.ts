import Popup from "../../../scripts/common/Popup";
import App from "../../../scripts/common/App";
import XocDiaLiveKubHonorItem from "./XocDiaLiveKub.HonorItem";
import GameGetLeaderBoard from "../../../scripts/common/Game.GetLeaderBoard";
import XocDiaLiveKubController from "./XocDiaLiveKub.XocDiaController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class XocDiaLiveKubPopupGuide extends Popup {

    runActionClose() {
        super.runActionClose(XocDiaLiveKubController.getInstance().toggleLiveStreamVideo(true));
    }
}
