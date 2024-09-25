import ColumnControllerB52 from "./ColumnControllerB52";
import {common} from "../Utils";
import Utils = common.Utils;
import ColumnController from "./ColumnController";
import MusicPlayer from "../game/MusicPlayer";
import ItemController from "./ItemController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RollerControllerB52 extends cc.Component {

    @property(cc.Prefab)
    columnPrefab = null;
    @property(cc.SpriteAtlas)
    textureAtlas = null;
    @property(cc.Integer)
    maxCountItem = 10;
    @property(cc.Integer)
    width = 930;
    @property(cc.Integer)
    itemCount = 12;
    @property(cc.String)
    ItemSpriteFramePrefix = "symbol_";
    @property(cc.String)
    ImageSpriteBlurFramePrefix = "symbol_blur_";
    @property(cc.Float)
    sizeScaleOrigin = 1;
    @property(cc.String)
    pathStopRoll = "Sounds/FAF/roll_stop";
    @property(cc.Boolean)
    isGameBigCityBoy = false;

    private columnCount = 5;
    private rowCount = 3;
    private startImageIndex = 0;
    public imagePrefix = "1_";
    public onRollDone: () => void = null;
    public stopping = false;
    public _listNodeColumn = [];
    public gameController = null;
    public rolling = false;
    public isStopImmediately = false;
    private isCheaetName = false;

    protected start() {
        let columnX = -this.width / 2 + this.width / this.columnCount / 2;
        for(let i = 0 ; i < this.columnCount; i++) {
            let column = cc.instantiate(this.columnPrefab);
            column.x = columnX;
            column.y = 0;
            this.node.addChild(column);
            this._listNodeColumn.push(column);
            columnX += this.width / this.columnCount;
            let columnController = column.getComponent(ColumnControllerB52);
            if(ColumnControllerB52) {
                columnController.columnID = i + 1;
                columnController.isLastColumn = false;
            }
            if(i === this.columnCount - 1) {
                columnController.isLastColumn = true;
            }
        }
        this.setItemsRandom(false, this.imagePrefix);
    }

    setItemsRandom(t = false, imagePrefix = "1_") {
        this.imagePrefix = imagePrefix;
        for(let i = 0 ; i < this.columnCount; i++) {
            let columnController = this._listNodeColumn[i].getComponent(ColumnControllerB52);
            columnController.setItems(this.getRandomNameItem(this.itemCount, columnController.numRow, columnController.columnID), this.imagePrefix);
        }
    }

    setGameController(gameController) {
        this.gameController = gameController;
    }

    setResultFreeSpin(imagePrefix) {
        this.imagePrefix = imagePrefix;
        for(let i = 0 ; i < this.columnCount; i++) {
            this._listNodeColumn[i].getComponent(ColumnControllerB52).setResultFreeSpin(this.imagePrefix);
        }
    }

    showExpandWild() {
        if(this.imagePrefix.localeCompare("0_") !== 0) {
            for(let i = 0 ; i < this.columnCount; i++) {
                let columnController = this._listNodeColumn[i].getComponent(ColumnControllerB52);
                if(columnController.isExpandWild) {
                    columnController.isExpandWild = false;
                    if(this.gameController && this.gameController.expWild[i]) {
                        this.gameController.expWild[i].active = true;
                        this.gameController.expWild[i].scale = 0;
                        this.gameController.expWild[i].y = 0;
                        this.gameController.expWild[i].stopAllActions();
                        this.gameController.expWild[i].runAction(
                            cc.scaleTo(.25, 1).easing(cc.easeBackOut())
                        )
                    }
                }
            }
        }
    }

    getRandomNameItem(itemCount, numRow = 3, columnID = 0) {
        let itemNameList = [];
        while(itemNameList.length < itemCount - numRow) {
            let randomIDItem = Utils.randomRangeInt(this.startImageIndex, this.maxCountItem);
            let itemName = "";
            if(columnID == 1 || columnID == 5) {
                do {
                    randomIDItem = Utils.randomRangeInt(this.startImageIndex, this.maxCountItem);
                } while(randomIDItem == 2)
            }
            if(this.isGameBigCityBoy) {
                if(randomIDItem == 2) {
                    if(this.imagePrefix.localeCompare("0_") !== 0) {
                        switch (columnID) {
                            case 2:
                                itemName = `${this.imagePrefix}21`;
                                break;
                            case 3:
                                itemName = `${this.imagePrefix}22`;
                                break;
                            case 4:
                                itemName = `${this.imagePrefix}23`;
                                break;
                        }
                    }
                } else {
                    itemName = `${this.imagePrefix}${randomIDItem}`;
                }
            } else {
                itemName = `${this.imagePrefix}${randomIDItem}`;
            }
            itemNameList.push(itemName);
        }
        for(let i = 0 ; i < numRow; i++) {
            itemNameList.push(itemNameList[i]);
        }
        return itemNameList;
    }

    getItemSpriteFrame(name) {
        return this.textureAtlas.getSpriteFrame(this.ItemSpriteFramePrefix + name)
    }

    getItemBlurSpriteFrame(name) {
        return this.textureAtlas.getSpriteFrame(this.ImageSpriteBlurFramePrefix + name)
    }

    roll(isFast = false, e = false) {
        for(let i = 0 ; i < this.columnCount; i++) {
            this.node.children[i].getComponent(ColumnControllerB52).roll(isFast, e);
        }
        this.rolling = true;
    }

    stop(isFast = false) {
        let isColumnHasRunningActions = false;
        if(!this.stopping) {
            for( let i = 0 ; i < this.columnCount; i++) {
                if(this.node.children[i].getNumberOfRunningActions() > 0) {
                    isColumnHasRunningActions = true;
                    break;
                }
            }
            if(isColumnHasRunningActions) {
                this.stopping = true;
                if(isFast) {
                    // MusicPlayer.getInstance().playEffect(this.pathStopRoll);
                    for(let i = 0 ; i < this.columnCount; i++) {
                        if(i === this.columnCount - 1) {
                            this.node.children[i].getComponent(ColumnControllerB52).onRollDone = () => {
                                this.rolling = false;
                                this.stopping = false;
                                if(this.onRollDone != null) {
                                    this.onRollDone();
                                }
                            }
                        } else {
                            this.node.children[i].getComponent(ColumnControllerB52).onRollDone = () => {};
                        }
                        this.node.children[i].getComponent(ColumnControllerB52).stop();
                    }
                } else {
                    let columnIndex = 0;
                    for(let i = 0 ; i < this.columnCount; i++) {
                        this.node.children[i].getComponent(ColumnControllerB52).onRollDone = () => {
                            if(columnIndex < this.columnCount - 1) {
                                columnIndex++;
                                this.node.children[columnIndex].getComponent(ColumnControllerB52).stop();
                            } else {
                                if(columnIndex == this.columnCount -1) {
                                    this.rolling = false;
                                    this.stopping = false;
                                    if(this.onRollDone != null) {
                                        this.onRollDone();
                                        if(MusicPlayer.getInstance().loopEffectId !== -1) {
                                            cc.audioEngine.stopEffect(MusicPlayer.getInstance().loopEffectId);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.node.children[0].getComponent(ColumnControllerB52).stop();
                }
            } else {
                if(this.onRollDone != null) {
                    this.onRollDone();
                }
            }
        }
    }

    stopImmediately() {
        if(!this.isStopImmediately) {
            this.isStopImmediately = true;
            for(let i = 0 ; i < this.columnCount; i++) {
                let columnController = this.node.children[i].getComponent(ColumnControllerB52);
                columnController.isMuteColumnDone = true;
                if(i == this.columnCount - 1) {
                    columnController.onRollDone = () => {
                        this.rolling = false;
                        this.stopping = false;
                        this.isStopImmediately = false;
                        if(this.onRollDone) {
                            this.onRollDone();
                            MusicPlayer.getInstance().playEffect(this.pathStopRoll);
                        }
                    }
                } else {
                    columnController.onRollDone = null;
                }
                if(columnController.isStop) {
                    columnController.stop();
                }
            }
        }
    }

    stopAllColumn() {
        for(let i = 0 ; i < this.columnCount; i++) {
            this.node.children[i].getComponent(ColumnControllerB52).forceStop();
        }
        this.rolling = false;
        this.stopping = false;
        this.isStopImmediately = false;
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
            this.node.children[i].getComponent(ColumnControllerB52).setResult(column[i]);
        }
    }

    scaleLineItems(lineDataIndex, itemID) {
        for(let i = 0 ; i < 3; i++) {
            if(this.node.children[lineDataIndex].getComponent(ColumnControllerB52)._listNodeItem[i].getComponent(ItemController)) {
                let scaleItem = this.node.children[lineDataIndex].getComponent(ColumnControllerB52)._listNodeItem[i];
                if(scaleItem.getComponent(ItemController).id === itemID) {
                    scaleItem.opacity = 255;
                    scaleItem.scale = this.sizeScaleOrigin;
                    scaleItem.getComponent(ItemController).showAnimItem(1.5, true, false, this.imagePrefix);
                }
            }
        }
    }

    showAllAnim(delay) {
        for(let i = 0 ; i < this.columnCount; i++) {
            for(let j = 0 ; j < 3; j++) {
                if(this.node.children[j].getComponent(ColumnControllerB52)._listNodeItem[i].getComponent(ItemController)) {
                    let rowItem = this.node.children[j].getComponent(ColumnControllerB52)._listNodeItem[i];
                    rowItem.stopAllActions();
                    rowItem.scale = this.sizeScaleOrigin;
                    rowItem.opacity = 255;
                    rowItem.getComponent(ItemController).isStopColumn = false;
                    rowItem.getComponent(ItemController).showAnimCallBack(delay, false, this.imagePrefix);
                }
            }
        }
    }

    hideAllAnim() {
        for(let i = 0; i < this.columnCount; i++) {
            for(let j = 0; j < 3; j++) {
                if(this.node.children[i].getComponent(ColumnControllerB52)._listNodeItem[j].getComponent(ItemController)) {
                    let rowItem = this.node.children[i].getComponent(ColumnControllerB52)._listNodeItem[j];
                    rowItem.stopAllActions();
                    rowItem.scale = this.sizeScaleOrigin;
                    rowItem.getComponent(ItemController).hideAnimItem();
                    rowItem.getComponent(ItemController).isStopColumn = false;
                }
            }
        }
    }
}
