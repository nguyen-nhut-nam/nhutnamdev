import App from "../../../scripts/common/App";
import SlotSexyDanceSlotSexyDanceController from "./SlotSexyDance.SlotSexyDanceController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotSexyDancePopupChooseRoom extends cc.Component {

    actRoomBack() {
        SlotSexyDanceSlotSexyDanceController._instance = null;
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

}
