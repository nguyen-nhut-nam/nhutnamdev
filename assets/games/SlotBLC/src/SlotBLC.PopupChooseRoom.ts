import App from "../../../scripts/common/App";
import SlotBLCSlotBLCController from "./SlotBLC.SlotBLCController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotBLCPopupChooseRoom extends cc.Component {

    actRoomBack() {
        SlotBLCSlotBLCController._instance = null;
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

}
