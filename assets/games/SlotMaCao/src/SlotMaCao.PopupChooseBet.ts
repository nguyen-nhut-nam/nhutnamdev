import App from "../../../scripts/common/App";
import SlotMaCaoSlotMaCaoController from "./SlotMaCao.SlotMaCaoController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotMaCaoPopupChooseBet extends cc.Component {

    actRoomBack() {
        SlotMaCaoSlotMaCaoController._instance = null;
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }
}
