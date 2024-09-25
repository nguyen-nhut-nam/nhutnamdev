import ItemController from "../../../scripts/common/slot/ItemController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotMaCaoItemsController extends ItemController {

    @property(cc.Boolean)
    isLSC = false;

    protected onLoad() {
        this.showAnimCallBack = this.animLadyNight.bind(this);
        if(!this.isLSC) {
            this.animWinItems(1.5);
        }
    }

    animWinItems(delayTime) {
        if(this.isWin) {
            this.node.runAction(
                cc.sequence(
                    cc.repeat(
                        cc.sequence(
                            cc.spawn(
                                cc.scaleTo(.19, .9),
                                cc.rotateTo(.19, -3)
                            ),
                            cc.spawn(
                                cc.scaleTo(.19, .9),
                                cc.rotateTo(.19, 3)
                            ),
                            cc.spawn(
                                cc.scaleTo(.19, .9),
                                cc.rotateTo(.19, -3)
                            ),
                            cc.spawn(
                                cc.scaleTo(.19, .9),
                                cc.rotateTo(.19, 0))
                        ), 2
                    ),
                    cc.callFunc(() => {
                        this.node.stopAllActions();
                        this.node.angle = 0;
                    })
                )
            )
        }
    }

    animLadyNight(delayTime, isLoop = true, itemPrefix = "1_") {
        this.animWinStart(1.5);
        if(this.isStopColumn || this.isWin && this.spinNode && this.id < 3) {
            switch (this.serverID) {
                case 0:
                    this.mapAnimWithID(2, "animation", 1, delayTime);
                    break;
                case 1:
                    this.mapAnimWithID(0, "animation", 1, delayTime);
                    break;
                case 3:
                    this.mapAnimWithID(1, "animation", 1, delayTime);
                    break;
                case 2:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    this.animWinItems(delayTime);
                    break;
                case 14:
                    this.mapAnimWithID(3, "animation", 1, delayTime);
                    break;
            }
        }
    }

    animWinStart(delayTime) {
        if(!this.isWin || !this.isStopColumn) {
            this.node.stopAllActions();
            this.spinNode.active = false;
            this.image.enabled = true;
            this.node.angle = 0;
            this.node.scale = .8;
            this.node.runAction(
                cc.repeat(
                    cc.sequence(
                        cc.repeat(
                            cc.sequence(
                                cc.rotateTo(.1, 0),
                                cc.rotateTo(.1, 0),
                                cc.rotateTo(.1, 0),
                                cc.rotateTo(.1, 0),
                            ),2
                        ),
                        cc.repeat(
                            cc.sequence(
                                cc.spawn(
                                    cc.callFunc(() => {
                                        switch (this.serverID) {
                                            case 0:
                                                this.mapAnimWithID(2, "animation", 1, delayTime);
                                                break;
                                            case 1:
                                                this.mapAnimWithID(0, "animation", 1, delayTime);
                                                break;
                                            case 3:
                                                this.mapAnimWithID(1, "animation", 1, delayTime);
                                                break;
                                            case 2:
                                            case 4:
                                            case 5:
                                            case 6:
                                            case 7:
                                            case 8:
                                            case 9:
                                            case 10:
                                            case 11:
                                            case 12:
                                            case 13:
                                                this.animWinItems(delayTime);
                                                break;
                                            case 14:
                                                this.mapAnimWithID(3, "animation", 1, delayTime);
                                                break;
                                        }
                                    }),
                                    cc.scaleTo(.5, .95)
                                ),
                                cc.scaleTo(.5, .85),
                                cc.delayTime(.5),
                            ), 2
                        ), cc.delayTime(3)
                    ),100
                )
            )
        }
    }
}
