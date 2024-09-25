import ItemController from "../../../scripts/common/slot/ItemController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotBigCityBoyItemsController extends ItemController {

    @property(cc.Boolean)
    isLSC = true;

    protected onLoad() {
        this.showAnimCallBack = this.animItemsBigCityBoy.bind(this);
    }

    animItemsBigCityBoy(delayTime, isLoop = false, itemPrefix) {
        this.animWinItems(delayTime, isLoop, itemPrefix);
        if(!this.isWin || !this.isStopColumn) {
            if(itemPrefix.localeCompare("0_") !== 0) {
                this.node.runAction(
                    cc.repeat(
                        cc.sequence(
                            cc.repeat(
                                cc.sequence(
                                    cc.rotateTo(.1, -1),
                                    cc.rotateTo(.1, 0),
                                    cc.rotateTo(.1, 1),
                                    cc.rotateTo(.1, 0),
                                ), 2
                            ),
                            cc.spawn(
                                cc.callFunc(() => {
                                    if(this.spinNode && this.id < 3) {
                                        switch (this.serverID) {
                                            case 0:
                                                this.mapAnimWithID(0, "animation", 1 ,delayTime, isLoop);
                                                break;
                                            case 1:
                                                this.mapAnimWithID(1, "animation", 1 ,delayTime, isLoop);
                                                break;
                                            case 3:
                                                this.mapAnimWithID(3, "animation", 1 ,delayTime, isLoop);
                                                break;
                                            case 4:
                                                this.mapAnimWithID(4, "animation2", 1, delayTime, isLoop);
                                                break;
                                            case 5:
                                                this.mapAnimWithID(5, "animation", 1, delayTime, isLoop);
                                                break;
                                            case 6:
                                                this.mapAnimWithID(6, "animation", 1, delayTime, isLoop);
                                                break;
                                            case 7:
                                                this.mapAnimWithID(7, "animation", 1, delayTime, isLoop);
                                                break;
                                            case 8:
                                                this.mapAnimWithID(8, "animation", 1, delayTime, isLoop);
                                                break;
                                            case 9:
                                                this.mapAnimWithID(9, "animation", 1, delayTime, isLoop);
                                                break;
                                            case 10:
                                                this.mapAnimWithID(10, "animation", 1, delayTime, isLoop);
                                                break;
                                        }
                                    }
                                }),
                                cc.scaleTo(.3, 1.1)
                            ),
                            cc.scaleTo(.3, 1),
                            cc.delayTime(3)
                        ), 100
                    )
                )
            }
        }
    }

    animWinItems(delayTime, isLoop = false, itemPrefix = "1_") {
        if(this.isWin) {
            this.node.runAction(
                cc.sequence(
                    cc.repeat(
                        cc.sequence(
                            cc.spawn(
                                cc.scaleTo(.19, 1.1),
                                cc.rotateTo(.19, 0)
                            ),
                            cc.spawn(
                                cc.scaleTo(.19, 1.1),
                                cc.rotateTo(.19, 0),
                            ),
                            cc.spawn(
                                cc.scaleTo(.19, 1.1),
                                cc.rotateTo(.19, 0),
                            )
                        ), 2
                    ),
                    cc.callFunc(() => {
                        this.node.stopAllActions();
                        this.node.angle = 0;
                    })
                )
            )
        } else if(!this.isWin || !this.isStopColumn) {
            this.node.stopAllActions();
            this.spinNode.active = false;
            this.image.enabled = true;
            this.node.angle = 0;
            this.node.scale = 1;
            if(itemPrefix.localeCompare("0_") !== 0) {
                this.node.runAction(
                    cc.repeat(
                        cc.sequence(
                            cc.repeat(
                                cc.sequence(
                                    cc.rotateTo(.1, -1),
                                    cc.rotateTo(.1, 0),
                                    cc.rotateTo(.1, 1),
                                    cc.rotateTo(.1, 0),
                                ), 2
                            ),
                            cc.spawn(
                                cc.callFunc(() => {
                                    if(this.spinNode && this.id < 3) {
                                        switch (this.serverID) {
                                            case 0:
                                                this.mapAnimWithID(0, "animation", 1 ,delayTime, isLoop);
                                                break;
                                            case 1:
                                                this.mapAnimWithID(1, "animation", 1 ,delayTime, isLoop);
                                                break;
                                            case 3:
                                                this.mapAnimWithID(3, "animation", 1 ,delayTime, isLoop);
                                                break;
                                            case 4:
                                                this.mapAnimWithID(4, "animation2", 1, delayTime, isLoop);
                                                break;
                                            case 5:
                                                this.mapAnimWithID(5, "animation", 1, delayTime, isLoop);
                                                break;
                                            case 6:
                                                this.mapAnimWithID(6, "animation", 1, delayTime, isLoop);
                                                break;
                                            case 7:
                                                this.mapAnimWithID(7, "animation", 1, delayTime, isLoop);
                                                break;
                                            case 8:
                                                this.mapAnimWithID(8, "animation", 1, delayTime, isLoop);
                                                break;
                                            case 9:
                                                this.mapAnimWithID(9, "animation", 1, delayTime, isLoop);
                                                break;
                                            case 10:
                                                this.mapAnimWithID(10, "animation", 1, delayTime, isLoop);
                                                break;
                                        }
                                    }
                                }),
                                cc.scaleTo(.3, 1.1)
                            ),
                            cc.scaleTo(.3, 1),
                            cc.delayTime(3)
                        ), 100
                    )
                )
            }
        }
    }
}
