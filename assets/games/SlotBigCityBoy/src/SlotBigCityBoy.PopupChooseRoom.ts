import App from "../../../scripts/common/App";
import SlotBigCityBoySlotController from "./SlotBigCityBoy.SlotController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotBigCityBoyPopupChooseRoom extends cc.Component {

    @property(cc.Node)
    nodeLoading = null;

    protected start() {
        this.nodeLoading.runAction(
            cc.sequence(
                cc.callFunc(() => {
                    this.nodeLoading.active = true;
                    this.nodeLoading.opacity = 255;
                }),
                cc.delayTime(1),
                cc.fadeOut(.5),
                cc.callFunc(() => {
                    this.nodeLoading.active = false;
                })
            )
        )
    }

    actRoomBack() {
        SlotBigCityBoySlotController._instance = null;
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

}
