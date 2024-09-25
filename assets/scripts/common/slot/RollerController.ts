import ColumnController from "./ColumnController";
import ItemController from "./ItemController";
import {common} from "../Utils";
import Utils = common.Utils;
import MusicPlayer from "../game/MusicPlayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RollerController extends cc.Component {

    @property(cc.Prefab)
    columnPrefab = null;
    @property(cc.SpriteAtlas)
    textureAtlas = null;
    @property(cc.Integer)
    itemCount = 12;
    @property(cc.Float)
    sizeScaleOrigin = 1;
    @property(cc.Integer)
    maxCountItem = 10;
    @property(cc.Float)
    timeCount = .15;
    @property(cc.Float)
    width = 930;
    @property(cc.Boolean)
    isSyncRoll = false;

    public gameController = null;
    private columnCount = 5;
    private rowCount = 3;
    private startImageIndex = 0;
    public imagePrefix = "1_";
    public ItemSpriteFramePrefix = "symbol_";
    public ItemSpriteFrameBlurPrefix = "symbol_blur_";
    public rolling = false;
    public onRollDone: () => void = null;
    public stopping = false;
    public _listNodeColumn = [];
    public isFast = false;
    private overrideRollMaxSpeed = 0;
    private temp = 3;
    private tensionBonusFromId = 0;
    private tensionFreeFromId = 0;

    getItemSpriteFrame(name) {
        return this.textureAtlas.getSpriteFrame(this.ItemSpriteFramePrefix + name)
    }

    getItemBlurSpriteFrame(name) {
        return this.textureAtlas.getSpriteFrame(this.ItemSpriteFrameBlurPrefix + name)
    }

    randomInt(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    protected start() {
        this.manualInit();
    }

    manualInit() {
        let columnX = -this.width / 2 + this.width / this.columnCount / 2;
        for(let i = 0 ; i < this.columnCount; i++) {
            let column = cc.instantiate(this.columnPrefab);
            column.x = columnX;
            column.y = 0;
            this.node.addChild(column);
            this._listNodeColumn.push(column);
            columnX += this.width / this.columnCount;
            let columnController = column.getComponent(ColumnController);
            if(columnController) {
                columnController.columnID = i + 1;
                columnController.isLastColumn = false;
                if(this.overrideRollMaxSpeed > 0) {
                    columnController.maxSpeed = this.overrideRollMaxSpeed;
                }
            }
            if(i === this.columnCount - 1) {
                columnController.isLastColumn = true;
            }
        }
        this.setItemsRandom(false, this.imagePrefix);
    }

    setItemsRandom(isPlayingTrial = false, imagePrefix = "1_") {
        this.imagePrefix = imagePrefix;
        for(let i = 0 ; i < this.columnCount; i++) {
            this._listNodeColumn[i].getComponent(ColumnController).setItems(this.getRandomGameItem(this.itemCount), this.imagePrefix, isPlayingTrial);
        }
    }

    getRandomGameItem(itemCount) {
        let itemNameList = [];
        for(let i = 0 ; i < itemCount - this.temp; i++) {
            let randomInt = Utils.randomRangeInt(this.startImageIndex, this.maxCountItem);
            let itemName = `${this.imagePrefix}${randomInt}`;
            itemNameList.push(itemName);
        }

        for(let i = 0 ; i < this.temp; i++) {
            itemNameList.push(itemNameList[i]);
        }
        return itemNameList;
    }

    roll(_isFast) {
        this.isFast = _isFast;
        this.tensionBonusFromId = 0;
        this.tensionFreeFromId = 0;
        if(!this.rolling) {
            this.rolling = true;
            this.timeCount = .2;
            if(_isFast) {
                this.timeCount = .05;
            }
            if(this.isSyncRoll) {
                this.timeCount = 0;
            }
            let n = -1;
            this.node.stopAllActions();
            this.node.runAction(
                cc.repeat(
                    cc.sequence(
                        cc.callFunc(() => {
                            n++;
                            this.node.children[n].getComponent(ColumnController).roll(_isFast);
                            if(n === this.columnCount - 1) {
                                this.stopping = false;
                            }
                        }),
                        cc.delayTime(this.timeCount)
                    )
                , this.columnCount)
            )
        }
    }

    stop(immediately = false) {
        let self = this;
        if(immediately) {
            this.stopAndRollDone(true);
        } else {
            if(this.isSyncRoll) {
                this.timeCount = .35;
            }
            var columnIdx = 0;
            this.node.stopAllActions();
            if(this.isSyncRoll || this.isFast) {
                this.stopAndRollDone();
            } else {
                this.node.runAction(
                    cc.repeat(
                        cc.sequence(
                            cc.callFunc(() => {
                                if(columnIdx >= 2 && (columnIdx == this.tensionFreeFromId || columnIdx == this.tensionBonusFromId)) {
                                    this.node.stopAllActions();
                                    for(var delayTime = 0, o = function(columnIdx) {
                                        delayTime += 2;
                                        self._listNodeColumn[columnIdx].getComponent(ColumnController).tensionRoll(delayTime);
                                        self.activeTension(columnIdx, true);
                                        if(columnIdx === self.columnCount - 1) {
                                            self._listNodeColumn[columnIdx].getComponent(ColumnController).onRollDone = () => {
                                                self.rolling = false;
                                                self.stopping = true;
                                                if(self.onRollDone) {
                                                    self.onRollDone();
                                                }
                                                self.activeTension(columnIdx, false);
                                            }
                                        } else {
                                            self._listNodeColumn[columnIdx].getComponent(ColumnController).onRollDone = () => {
                                                self.activeTension(columnIdx, false);
                                            }
                                        }
                                    }, a = columnIdx; a < this.columnCount; a++) {
                                        o(a);
                                    }
                                } else {
                                    let columnController = this._listNodeColumn[columnIdx].getComponent(ColumnController);
                                    if(!this.isFast && this.isSyncRoll) {
                                        columnController.node.y = 0;
                                    }
                                    columnController.stop();
                                    if(columnIdx === this.columnCount - 1) {
                                        columnController.onRollDone = () => {
                                            this.rolling = false;
                                            this.stopping = true;
                                            if(this.onRollDone != null) {
                                                this.onRollDone();
                                            }
                                        }
                                    } else {
                                        columnController.onRollDone = null;
                                    }
                                    columnIdx++;
                                }
                            }),
                            cc.delayTime(this.timeCount)
                        )
                        , this.columnCount)
                )
            }
        }
    }

    stopAndRollDone(immediately = false) {
        this.node.stopAllActions();
        for (let i = 0; i < this.columnCount; i++) {
            let columnController = this._listNodeColumn[i].getComponent(ColumnController);
            if(!immediately) {
                columnController.node.y = 0;
            }
            columnController.stop(immediately);
            if(i === this.columnCount - 1) {
                columnController.onRollDone = () => {
                    this.rolling = false;
                    this.stopping = true;
                    if(this.onRollDone != null) {
                        this.onRollDone();
                    }
                }
            } else {
                columnController.onRollDone = null;
            }
        }
    }

    stopAllColumn(immediately = false) {
        this.node.stopAllActions();
        for(let i = 0 ; i < this.columnCount; i++) {
            this.node.children[i].getComponent(ColumnController).forceStop(immediately);
        }
        this.rolling = false;
        this.stopping = true;
    }

    setResult(symbolsMatrix) {
        let column = [];
        for(let i = 0; i < symbolsMatrix.length; i++) {
            let cellIndex = i % this.columnCount;
            if(column.length === cellIndex) {
                column.push([symbolsMatrix[i]]);
            } else {
                column[cellIndex].push(symbolsMatrix[i]);
            }
        }
        for(let i = 0; i < this.columnCount; i++) {
            column[i] = column[i].reverse();
            this.node.children[i].getComponent(ColumnController).setResult(column[i]);
            if(this.node.children[i].getComponent(ColumnController).isTensionBonus && this.tensionBonusFromId < 2) {
                this.tensionBonusFromId++;
                if(this.tensionBonusFromId === 2) {
                    this.tensionBonusFromId = i + 1;
                }
            }

            if(this.node.children[i].getComponent(ColumnController).isTensionFree && this.tensionFreeFromId < 2) {
                this.tensionFreeFromId++;
                if(this.tensionFreeFromId === 2) {
                    this.tensionFreeFromId = i + 1;
                }
            }
        }
    }

    hideAllAnim(color = cc.Color.WHITE) {
        for(let i = 0; i < this.columnCount; i++) {
            for(let j = 0; j < this.rowCount; j++) {
                if(this.node.children[i].getComponent(ColumnController)._listNodeItem[j].getComponent(ItemController)) {
                    let rowItem = this.node.children[i].getComponent(ColumnController)._listNodeItem[j];
                    rowItem.stopAllActions();
                    rowItem.scale = this.sizeScaleOrigin;
                    rowItem.getComponent(ItemController).hideAnimItem();
                    rowItem.getComponent(ItemController).isStopColumn = false;
                    if(rowItem.getComponent(ItemController).isChangeColor) {
                        rowItem.color = color;
                    }
                }
            }
        }
    }

    showAllAnim(delayMiliSecTime) {
        let delay = 0;
        if(delayMiliSecTime === 0) {
            delay = 100;
        } else {
            delay = delayMiliSecTime;
        }
        for(let i = 0 ; i < this.columnCount; i++) {
            for(let j = 0 ; j < this.rowCount; j++) {
                if(this.node.children[j].getComponent(ColumnController)._listNodeItem[i].getComponent(ItemController)) {
                    let rowItem = this.node.children[j].getComponent(ColumnController)._listNodeItem[i];
                    rowItem.stopAllActions();
                    rowItem.scale = this.sizeScaleOrigin;
                    rowItem.opacity = 255;
                    this.node.color = cc.Color.WHITE;
                    rowItem.getComponent(ItemController).isStopColumn = false;
                    rowItem.getComponent(ItemController).showAnimCallBack(delay, false, this.imagePrefix);
                }
            }
        }
    }

    showExpandWild(isLadyNight = false) {
        if(this.imagePrefix.localeCompare("0_") !== 0) {
            for(let i = 0 ; i < this.columnCount; i++) {
                let columnController = this._listNodeColumn[i].getComponent(ColumnController);
                if(columnController.isExpandWild) {
                    columnController.isExpandWild = false;
                    if(this.gameController && this.gameController.expWild[i]) {
                        this.gameController.expWild[i].active = true;
                        this.gameController.expWild[i].scale = 0;
                        if(isLadyNight) {
                            MusicPlayer.getInstance().playEffect("Sounds/nightclub/wild");
                        }
                        this.gameController.expWild[i].stopAllActions();
                        this.gameController.expWild[i].runAction(
                            cc.scaleTo(.25, 1).easing(cc.easeBackOut()),
                        )
                    }
                }
            }
        }
    }

    setGameController(gameController) {
        this.gameController = gameController;
    }

    applyScale() {
        for(let i = 0 ; i < this.columnCount; i++) {
            this.node.children[i].getComponent(ColumnController).setScaleAllItem(this.sizeScaleOrigin);
        }
    }

    scaleLineItems(lineDataIndex, lineData, serverID = -1) {
        for(let i = 0 ; i < 3; i++) {
            if(this.node.children[lineDataIndex].getComponent(ColumnController)._listNodeItem[i].getComponent(ItemController)) {
                let scaleItem = this.node.children[lineDataIndex].getComponent(ColumnController)._listNodeItem[i];

            }
        }
    }

    setResultFreeSpin(itemPrefix) {
        this.imagePrefix = itemPrefix;
        for(let i = 0 ; i < this.columnCount; i++) {
            this._listNodeColumn[i].getComponent(ColumnController).setResultFreeSpin(itemPrefix);
        }
    }

    activeTension(tensionRollIndex, isEnabled) {
        if(this.gameController && this.gameController.listTensionRoll[tensionRollIndex]) {
            this.gameController.listTensionRoll[tensionRollIndex].active = isEnabled;
            if(this.tensionBonusFromId >= 2) {
                this.gameController.listTensionRoll[tensionRollIndex].getComponent(sp.Skeleton).setAnimation(0, "Cam", true);
            } else if(this.tensionFreeFromId >= 2) {
                this.gameController.listTensionRoll[tensionRollIndex].getComponent(sp.Skeleton).setAnimation(0, "xanh", true);
            }
        }
    }
}
