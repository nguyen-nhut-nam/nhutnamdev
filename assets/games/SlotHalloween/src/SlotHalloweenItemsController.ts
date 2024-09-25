import ItemController from "../../../scripts/common/slot/ItemController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotHalloweenItemsController extends ItemController {

    protected onLoad() {

        this.showAnimCallBack = this.animItemsHalloween.bind(this);
    }

    animItemsHalloween(delayTime, isLoop = false) {
        this.animWinItems(delayTime);
        if((this.isWin || !this.isStopColumn) && this.spinNode && this.id < 3) {
            switch (this.serverID) {
                case 0:
                    this.mapAnimWithID(0, "Scatter", .9, delayTime, isLoop);
                    break;
                case 1:
                    this.mapAnimWithID(0, "Bonus", .9, delayTime, isLoop);
                    break;
                case 2:
                    this.mapAnimWithID(0, "Wild", .9, delayTime, isLoop);
                    break;
                case 3:
                    this.mapAnimWithID(0, "Jackpot", .85, delayTime, isLoop);
                    break;
                case 4:
                    this.mapAnimWithID(0, "Non", .9, delayTime, isLoop);
                    break;
                case 5:
                    this.mapAnimWithID(0, "Mo", .9, delayTime, isLoop);
                    break;
                case 6:
                    this.mapAnimWithID(0, "Zombie", .9, delayTime, isLoop);
                    break;
                case 7:
                    this.mapAnimWithID(0, "Sach", .9, delayTime, isLoop);
                    break;
                case 8:
                    this.mapAnimWithID(0, "Meo", .9, delayTime, isLoop);
                    break;
                case 9:
                    this.mapAnimWithID(0, "Noi", .9, delayTime, isLoop);
                    break;
                case 10:
                    this.mapAnimWithID(0, "DenCay", .9, delayTime, isLoop);
                    break;
            }
        }
    }

    animWinItems(delayTime, isLoop = false) {
        if(this.isWin) {
            this.node.runAction(
                cc.sequence(
                    cc.repeat(
                        cc.sequence(
                            cc.spawn(
                                cc.scaleTo(.19, 1),
                                cc.rotateTo(.19, 0)
                            ),
                            cc.spawn(
                                cc.scaleTo(.19, 1),
                                cc.rotateTo(.19, 0),
                            ),
                            cc.spawn(
                                cc.scaleTo(.19, 1),
                                cc.rotateTo(.19, 0),
                            ),
                            cc.spawn(
                                cc.scaleTo(.19, .9),
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
            this.spinNode.active = false;
            this.image.enabled = true;
            this.winItem.active = false;
            this.node.angle = 0;
            this.node.scale = .9;
            this.node.runAction(
                cc.repeat(
                    cc.sequence(
                        cc.repeat(
                            cc.sequence(
                                cc.rotateTo(.1, -1),
                                cc.rotateTo(.1, 0),
                                cc.rotateTo(.1, 1),
                                cc.rotateTo(.1, 0),
                            ),2
                        ),
                        cc.spawn(
                            cc.callFunc(() => {
                                switch (this.serverID) {
                                    case 0:
                                        this.mapAnimWithID(0, "Scatter", .9, delayTime, isLoop);
                                        break;
                                    case 1:
                                        this.mapAnimWithID(0, "Bonus", .9, delayTime, isLoop);
                                        break;
                                    case 2:
                                        this.mapAnimWithID(0, "Wild", .9, delayTime, isLoop);
                                        break;
                                    case 3:
                                        this.mapAnimWithID(0, "Jackpot", .85, delayTime, isLoop);
                                        break;
                                    case 4:
                                        this.mapAnimWithID(0, "Non", .9, delayTime, isLoop);
                                        break;
                                    case 5:
                                        this.mapAnimWithID(0, "Mo", .9, delayTime, isLoop);
                                        break;
                                    case 6:
                                        this.mapAnimWithID(0, "Zombie", .9, delayTime, isLoop);
                                        break;
                                    case 7:
                                        this.mapAnimWithID(0, "Sach", .9, delayTime, isLoop);
                                        break;
                                    case 8:
                                        this.mapAnimWithID(0, "Meo", .9, delayTime, isLoop);
                                        break;
                                    case 9:
                                        this.mapAnimWithID(0, "Noi", .9, delayTime, isLoop);
                                        break;
                                    case 10:
                                        this.mapAnimWithID(0, "DenCay", .9, delayTime, isLoop);
                                        break;
                                }
                            }),
                            cc.scaleTo(.3, 1)
                        ), cc.delayTime(3)
                    ), 100
                )
            )
        }
    }
}
