import App from "../../../scripts/common/App";
import SlotFAFSlotFAFController from "./SlotFAF.SlotFAFController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotFAFPopupChooseRoom extends cc.Component {

    @property(cc.Node)
    bgTextCuoc = null;
    @property(cc.Node)
    txtCuoc = null;

    protected start() {
        this.bgTextCuoc.x = 1500;
        this.txtCuoc.x = -1500;
        this.node.stopAllActions();
        this.node.runAction(
            cc.sequence(
                cc.delayTime(.2),
                cc.callFunc(() => {
                    this.bgTextCuoc.stopAllActions();
                    this.txtCuoc.stopAllActions();
                    this.bgTextCuoc.runAction(
                        cc.sequence(
                            cc.moveTo(.4, cc.v2(0, this.bgTextCuoc.y)),
                            cc.delayTime(1),
                            cc.moveTo(.3, cc.v2(1500, this.bgTextCuoc.y)),
                        )
                    )
                    this.txtCuoc.runAction(
                        cc.sequence(
                            cc.moveTo(.4, cc.v2(0, this.txtCuoc.y)),
                            cc.delayTime(1),
                            cc.moveTo(.3, cc.v2(-1500, this.txtCuoc.y))
                        )
                    )
                })
            )
        )
    }

    actRoomBack() {
        SlotFAFSlotFAFController._instance = null;
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

}
