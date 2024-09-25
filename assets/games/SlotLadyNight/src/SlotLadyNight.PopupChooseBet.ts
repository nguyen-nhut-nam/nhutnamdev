import App from "../../../scripts/common/App";
import SlotLadyNightController from "./SlotLadyNight.SlotLNController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotLadyNightPopupChooseBet extends cc.Component {

    @property(cc.Node)
    nodeLoading = null;

    isStartGame = false;

    protected start() {
        this.isStartGame = true;
        this.nodeLoading.runAction(
            cc.sequence(
                cc.delayTime(1.75),
                cc.callFunc(() => {
                    this.nodeLoading.active = false;
                })
            )
        );
    }

    actRoomBack() {
        SlotLadyNightController._instance = null;
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }
}
