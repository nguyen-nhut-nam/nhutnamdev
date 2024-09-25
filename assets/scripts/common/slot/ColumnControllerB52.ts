import ItemController from "./ItemController";
import GameConfigManager from "../game/GameConfigManager";
import MusicPlayer from "../game/MusicPlayer";
import RollerControllerB52 from "./RollerControllerB52";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ColumnControllerB52 extends cc.Component {

    @property(cc.Integer)
    letTime = 2;
    @property(cc.Prefab)
    itemPrefab = null;
    @property(cc.Integer)
    height = 440;
    @property(cc.Float)
    rollTime1 = .09;
    @property(cc.Float)
    rollTime2 = .05;
    @property(cc.Integer)
    distanceY = 20;
    @property(cc.Integer)
    numRow = 3;
    @property(cc.Float)
    speedRoll = .75;
    @property(cc.Float)
    speedRollFast = .55;
    @property(cc.String)
    pathStopRoll = "Sounds/thantai/thantai_rollstop";
    @property([cc.Integer])
    listSymbolWild = [];
    public columnID = -1;
    public isLastColumn = false;
    private totalHeight = 440;
    private isSetResultOK = false;
    public _listNodeItem = [];
    public isExpandWild = false;
    public items = [];
    public imagePrefix = "1_"
    public isStop = false;
    public onRollDone: () => void = null;
    public isMuteColumnDone = false;

    setItems(listItemsName, imagePrefix = "1_") {
        this.items = listItemsName;
        this.imagePrefix = imagePrefix;
        for(let i = 0 ; i < this._listNodeItem.length; i++) {
            this._listNodeItem[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
            if(this._listNodeItem[i].getComponent(ItemController) && this._listNodeItem[i].getComponent(ItemController).id < 3) {
                this._listNodeItem[i].getComponent(ItemController).serverID = parseInt(this.items[i].split("_")[1]);
                this._listNodeItem[i].getComponent(ItemController).isStopColumn = true;
                this._listNodeItem[i].getComponent(ItemController).showAnimItem(1.5, false, false, this.imagePrefix);
            }
        }
    }

    setResultFreeSpin(imagePrefix) {
        this.imagePrefix = imagePrefix;
        for(let i = 0 ; i < this._listNodeItem.length; i++) {
            if(this.imagePrefix.localeCompare("0_") === 0) {
                if(!this.items[i].split("_")[1] || parseInt(this.items[i].split("_")[1]) > this.getRollerController().maxCountItem) {
                    this.items[i] = `${this.imagePrefix}2`;
                } else {
                    this.items[i] = `${this.imagePrefix}${this.items[i].split("_")[1]}`;
                }
            }
            this._listNodeItem[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
            if(this._listNodeItem[i].getComponent(ItemController) && this._listNodeItem[i].getComponent(ItemController).id < 3) {
                this._listNodeItem[i].getComponent(ItemController).serverID = parseInt(this.items[i].split("_")[1]);
                this._listNodeItem[i].getComponent(ItemController).isStopColumn = true;
                this._listNodeItem[i].getComponent(ItemController).hideAnimItem();
            }
        }
    }

    setResult(columnListItems) {
        if(!(this.items.length < columnListItems.length)) {
            let deltaCount = this.items.length - columnListItems.length;
            let divCount = Math.floor(this.items.length / columnListItems.length)
            if(columnListItems.length === 1) {
                divCount = 1;
            }
            for(let i = 0 ; i < columnListItems.length; i++) {
                if(this.getRollerController().isGameBigCityBoy) {
                    if(columnListItems[i] == 2) {
                        switch (this.columnID) {
                            case 2:
                                this.items[i] = `${this.imagePrefix}21`;
                                this.items[deltaCount + i] = `${this.imagePrefix}21`;
                                break;
                            case 3:
                                this.items[i] = `${this.imagePrefix}22`;
                                this.items[deltaCount + i] = `${this.imagePrefix}22`;
                                break;
                            case 4:
                                this.items[i] = `${this.imagePrefix}23`;
                                this.items[deltaCount + i] = `${this.imagePrefix}23`;
                                break;
                        }
                    } else {
                        this.items[i] = `${this.imagePrefix}${columnListItems[i]}`;
                        this.items[deltaCount + i] = `${this.imagePrefix}${columnListItems[i]}`;
                    }
                } else {
                    this.items[i] = `${this.imagePrefix}${columnListItems[i]}`;
                    this.items[deltaCount + i] = `${this.imagePrefix}${columnListItems[i]}`;
                }
                if(i + divCount < deltaCount + i) {
                    this.items[i + divCount] = this.getRollerController().getRandomNameItem(this.items.length, 3, this.columnID)[i];
                }
                if(this.node.children[i].getComponent(ItemController)) {
                    if(this.getRollerController().isGameBigCityBoy) {
                        if(columnListItems[i] == 2) {
                            switch (this.columnID) {
                                case 2:
                                    this.node.children[i].getComponent(ItemController).serverID = 21;
                                    break;
                                case 3:
                                    this.node.children[i].getComponent(ItemController).serverID = 22;
                                    break;
                                case 4:
                                    this.node.children[i].getComponent(ItemController).serverID = 23;
                                    break;
                            }
                        } else {
                            this.node.children[i].getComponent(ItemController).serverID = columnListItems[i];
                        }
                    } else {
                        this.node.children[i].getComponent(ItemController).serverID = columnListItems[i];
                    }
                    if(this.listSymbolWild.indexOf(columnListItems[i]) > -1) {
                        this.isExpandWild = true;
                    }
                }
            }
            this.isSetResultOK = true;
        }
    }

    protected start() {
        let columnHeight = this.height;
        let posY = -columnHeight / 2 + columnHeight / this.numRow / 2;
        for(let i = 0 ; i < this.items.length; i++) {
            let nodeItem = cc.instantiate(this.itemPrefab);
            nodeItem.x = 0;
            nodeItem.y = posY;
            nodeItem.getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
            if(i < 3 && nodeItem.getComponent(ItemController)) {
                nodeItem.getComponent(ItemController).serverID = parseInt(this.items[i].split("_")[1]);
                nodeItem.getComponent(ItemController).id = i === 0 ? 2 : i === 2 ? 0 : i;
                nodeItem.getComponent(ItemController).showAnimItem(30, false, true);
            }

            posY += columnHeight / this.numRow;
            this.node.addChild(nodeItem);
            this._listNodeItem.push(nodeItem);
        }
        this.totalHeight = columnHeight / this.numRow * this.items.length;
    }

    roll(isFast = false, e = false) {
        let speedRoll = this.speedRoll;
        if(e) {
            speedRoll = this.speedRollFast;
        } else {
            if(isFast) {
                speedRoll = this.speedRollFast;
            }
        }

        if(this.getRollerController()
            && this.getRollerController().gameController
            && this.getRollerController().gameController.expWild
            && this.getRollerController().gameController.expWild[this.columnID - 1]
        ) {
            this.getRollerController().gameController.expWild[this.columnID - 1].stopAllActions();
            this.getRollerController().gameController.expWild[this.columnID - 1].runAction(
                cc.sequence(
                    cc.moveTo(speedRoll / 2, cc.v2(this.node.x, (-this.totalHeight + this.height)/2)),
                    cc.callFunc(() => {
                        this.getRollerController().gameController.expWild[this.columnID - 1].active = false;
                    })
                )
            )
        }

        this.node.stopAllActions();
        this.node.y = 0;
        for(let i = 0 ; i < this.items.length ; i++) {
            this.node.children[i].getComponent(ItemController).hideAnimItem();
            this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemBlurSpriteFrame(this.items[i]);
        }
        let a = false;
        this.node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(speedRoll/2, cc.v2(this.node.x, (-this.totalHeight+this.height)/2)),
                    cc.callFunc(() => {
                        if(!this.isStop || a) {

                        } else {
                            a = true;
                            for(let i = this.items.length - 1; i >= this.items.length - this.numRow; i--) {
                                this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
                            }
                            this.onRollEnd(speedRoll, isFast, e);
                        }
                    }),
                    cc.moveTo(speedRoll/2, cc.v2(this.node.x, -this.totalHeight + this.height)),
                    cc.callFunc(() => {
                        this.node.y = 0;
                    })
                )
            )
        )
        this.isStop = false;
    }

    onRollEnd(speedRoll, isFast, e) {
        let letTime = this.letTime;
        if(e || isFast) {
            letTime = 2;
        }
        this.node.stopAllActions();
        this.node.runAction(
            cc.spawn(
                cc.sequence(
                    cc.delayTime(speedRoll / 2),
                    cc.callFunc(() => {
                        if(!this.isLastColumn) {
                            if(this.onRollDone) {
                                this.onRollDone();
                            }
                        }
                    })
                ),
                cc.sequence(
                    cc.moveTo(speedRoll / letTime, cc.v2(this.node.x, -this.totalHeight + this.height)),
                    cc.callFunc(() => {
                        this.node.y = 0;
                        this.node.stopAllActions();
                        if(!isFast || !this.isMuteColumnDone) {
                            MusicPlayer.getInstance().playEffect(this.pathStopRoll);
                        }
                        this.isMuteColumnDone = false;
                        for(let i =  0; i <= this.numRow; i++) {
                            if(this.node.children[i]) {
                                this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
                                if(!isFast || !e || this.node.children[i].getComponent(ItemController)) {
                                    this.node.children[i].getComponent(ItemController).isStopColumn = true;
                                    // this.node.children[i].getComponent(ItemController).showAnimItem(1.5, false, false, this.imagePrefix);
                                }
                            }
                        }
                        this.node.runAction(
                            cc.sequence(
                                cc.moveTo(this.rollTime1, cc.v2(this.node.x, this.node.y - this.distanceY)),
                                cc.moveTo(this.rollTime2, cc.v2(this.node.x, this.node.y)),
                                cc.callFunc(() => {
                                    if(this.isLastColumn) {
                                        if(this.onRollDone) {
                                            this.onRollDone();
                                        }
                                    }
                                })
                            )
                        )
                    }),

                )
            )
        )
    }

    stop() {
        this.isStop = true;
    }

    forceStop() {
        this.node.stopAllActions();
        this.stop();
        for(let i = 0 ; i < this.numRow; i++) {
            this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
        }
        this.node.y = 0;
    }

    getRollerController() {
        return this.node.parent.getComponent(RollerControllerB52);
    }
}
