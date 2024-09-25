import RollerController from "./RollerController";
import ItemController from "./ItemController";
import Prefab = cc.Prefab;
import game = cc.game;
import GameConfigManager from "../game/GameConfigManager";
import MusicPlayer from "../game/MusicPlayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ColumnController extends cc.Component {

    @property(cc.Prefab)
    itemPrefab = null;
    @property(cc.Integer)
    height = 440;
    @property(cc.Integer)
    numRow = 3;
    @property(cc.Integer)
    maxSpeed = 3500;
    @property(cc.Integer)
    stopSpeed = 1500;
    @property([cc.Integer])
    listSymbolWild = [];
    @property(cc.String)
    pathStopRoll = "Sounds/nightclub/Spin-Stop";
    @property(cc.String)
    pathRollTension = "Sounds/halloween/tension";
    @property(cc.String)
    pathStopRollTension = "Sounds/halloween/tensionstop";
    @property(cc.Integer)
    distanceY = 50;
    @property(cc.Integer)
    symbolBonus = -10;
    @property(cc.Integer)
    symbolFree = -10;

    public columnID = -1;
    private isFast = false;
    public isRoll = false;
    private isStop = false;
    private isStopImmediately = false;
    private onRollDone: () => void = null;
    private imagePrefix = "1_";
    private speed = 0;
    private deltaSpeed = 80;
    private velocity = 1;
    public posYWild = 0;
    public _listNodeItem = [];
    private tempStopSpeed = 0;
    private isChange1 = false;
    private isChange2 = false;
    private isInitialize = false;
    private isClicked = false;
    public items = [];
    public isLastColumn = false;
    private isExpandWild = false;
    private totalHeight = 440;
    private isMuteColumnDone = false;
    public isTensionRolling = false;
    public isTensionBonus = false;
    public isTensionFree = false;

    protected start() {
        this.manualInit();
    }

    getRollerController() {
        return this.node.parent.getComponent(RollerController);
    }

    roll(_isFast = false) {
        if(this.speed === 0) {
            if(this.getRollerController()
                && this.getRollerController().gameController
                && this.getRollerController().gameController.expWild
                && this.getRollerController().gameController.expWild[this.columnID - 1]
            ) {
                this.posYWild = this.getRollerController().gameController.expWild[this.columnID - 1].y;
            }

            this.tempStopSpeed = this.stopSpeed;
            this.isFast = _isFast;
            this.isChange1 = false;
            this.isChange2 = false;
            this.isStop = false;
            this.isStopImmediately = false;
            this.isTensionRolling = false;
            this.isTensionBonus = false;
            this.isTensionFree = false;
            this.isClicked = false;
            this.isRoll = true;
            this.node.y = 0;
            if(_isFast) {
                this.velocity = 1.35;
                this.deltaSpeed = 100;
            } else {
                this.velocity = 1;
                this.deltaSpeed = 80;
            }
        }
    }

    forceStop(immediately = false) {
        if(immediately == true) {
            immediately = false;
        }
        this.speed = 0;
        this.isStop = true;
        this.isRoll = false;
        this.node.stopAllActions();
        this.stop();
        this.isMuteColumnDone = immediately;
        for(let i = 0 ; i < this.numRow; i++) {
            this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
        }
        this.node.y = 0;
    }

    setItem(itemID, itemPrefix) {

    }
    setResult(columnListItems) {
        if(columnListItems && !(this.items.length < columnListItems)) {
            let deltaCount = this.items.length - columnListItems.length;
            let divCount = Math.floor(this.items.length / columnListItems.length)
            if(columnListItems.length === 1) {
                divCount = 1;
            }
            for(let i = 0 ; i < columnListItems.length; i++) {
                this.items[i] = `${this.imagePrefix}${columnListItems[i]}`;
                this.items[deltaCount + i] = `${this.imagePrefix}${columnListItems[i]}`;
                if(i + divCount < deltaCount + i) {
                    this.items[i + divCount] = this.getRollerController().getRandomGameItem(this.items.length)[i];
                }
                if(this.node.children[i].getComponent(ItemController)) {
                    this.node.children[i].getComponent(ItemController).serverID = columnListItems[i];
                    if(this.listSymbolWild.indexOf(columnListItems[i]) > -1) {
                        this.isExpandWild = true;
                    }
                    if(this.symbolBonus == columnListItems[i]) {
                        this.isTensionBonus = true;
                    }

                    if(this.symbolFree == columnListItems[i]) {
                        this.isTensionFree = true;
                    }
                }
            }
        }
    }

    manualInit() {
        let columnHeight = this.height;
        let posY = -columnHeight / 2 + columnHeight / this.numRow / 2;
        for(let i = 0; i < this.items.length; i++) {
            let nodeItem = cc.instantiate(this.itemPrefab);
            nodeItem.x = 0;
            nodeItem.y = posY;
            nodeItem.getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
            nodeItem.scale = this.getRollerController().sizeScaleOrigin;
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

    protected update(dt: number) {
        if(this.isStop) {
            if(this.isRoll) {
                if(this.getRollerController().gameController
                    && this.getRollerController().gameController.expWild
                    && this.getRollerController().gameController.expWild[this.columnID - 1]
                    && this.getRollerController().gameController.expWild[this.columnID - 1].active)
                {
                    let expWild = this.getRollerController().gameController.expWild[this.columnID - 1];
                    expWild.y -= this.speed * dt * this.velocity;
                    if(expWild.y <= (-this.totalHeight + this.height) / 2) {
                        expWild.active = false;
                        expWild.y = this.posYWild;
                    }
                }
                if(this.node.y <= (-this.totalHeight + this.height) / 2 && !this.isChange2 && !this.isStopImmediately) {
                    this.isChange2 = true;
                    for(let i = 0; i < this.items.length; i++) {
                        this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
                    }
                    this.speed = this.maxSpeed - .2 * this.maxSpeed;
                }
                if(this.isStopImmediately) {
                    this.isChange2 = true;
                    this.speed = this.maxSpeed - .2 * this.maxSpeed;
                    this.node.y = 0;
                    this.velocity = 2 * this.velocity;
                    this.isStopImmediately = false;
                    for(let i = 0 ; i < this.items.length; i++) {
                        this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemBlurSpriteFrame(this.items[i]);
                    }
                }
                this.speed -= this.deltaSpeed;
                if(this.speed <= this.stopSpeed) {
                    this.speed = this.stopSpeed;
                }
                this.node.y -= this.speed * dt * this.velocity;

                if(this.node.y <= -this.totalHeight + this.height && this.speed > this.stopSpeed) {
                    this.node.y = 0;
                } else if(this.node.y <= -this.totalHeight + this.height - 50 && this.speed <= this.stopSpeed) {
                    this.node.y = -this.distanceY;
                    this.isRoll = false;
                    for(let i = 0; i < this.items.length; i++) {
                        this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
                    }
                }
            } else {
                if(this.getRollerController().gameController
                    && this.getRollerController().gameController.expWild
                    && this.getRollerController().gameController.expWild[this.columnID - 1]
                ) {
                    this.getRollerController().gameController.expWild[this.columnID - 1].y = this.posYWild;
                    this.getRollerController().gameController.expWild[this.columnID - 1].active = false;
                }
                if(this.tempStopSpeed !== 0) {
                    this.stopSpeed = this.tempStopSpeed;
                }
                this.velocity = 1;
                this.speed = 0;
                this.isStop = false;
                this.isStopImmediately = false;
                this.isClicked = false;
                this.isRoll = false;
                this.isChange1 = false;
                this.isChange2 = false;
                this.node.stopAllActions();
                this.node.runAction(
                    cc.sequence(
                        cc.moveTo(.12, cc.v2(this.node.x, 0)),
                        cc.callFunc(() => {
                            this.node.y= 0;
                            if(this.isTensionRolling && (this.isTensionFree || this.isTensionBonus)) {
                                if(GameConfigManager.getInstance().enableSound) {
                                    MusicPlayer.getInstance().playEffect(this.pathStopRollTension)
                                }
                            } else if(!this.isMuteColumnDone) {
                                if(GameConfigManager.getInstance().enableSound) {
                                    MusicPlayer.getInstance().playEffect(this.pathStopRoll);
                                }
                            }
                            if(this.onRollDone != null) {
                                this.onRollDone();
                            }
                            this.isTensionRolling = false;
                            this.isTensionBonus = false;
                            this.isTensionFree = false;
                        })
                    )
                )
            }
        } else if(this.isRoll) {
            this.speed += this.deltaSpeed;
            if(this.speed >= this.maxSpeed) {
                this.speed = this.maxSpeed;
            }
            this.node.y -= this.speed * dt * this.velocity;
            if(this.node.y <= -this.totalHeight + this.height) {
                this.node.y = 0;
                if(!this.isChange1) {
                    this.isChange1 = true;
                    for(let i = 0 ; i < this.items.length; i++) {
                        this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemBlurSpriteFrame(this.items[i]);
                    }
                }
            }

            if(this.getRollerController().isSyncRoll) {
                for(let i = 0 ; i < this.items.length; i++) {
                    this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemBlurSpriteFrame(this.items[i]);
                }
            }
            let gameController = this.getRollerController().gameController;
            if(gameController
                && gameController.expWild
                && gameController.expWild[this.columnID - 1]
                && gameController.expWild[this.columnID - 1].active)
            {
                gameController.expWild[this.columnID - 1].y -= this.speed * dt * this.velocity;
                if(gameController.expWild[this.columnID - 1].y <= (-this.totalHeight + this.height)/2) {
                    gameController.expWild[this.columnID - 1].active = false;
                    gameController.expWild[this.columnID - 1].y = this.posYWild;
                }
            }
        }
    }

    stop(isStopImme = false) {
        if(!this.isClicked || !this.isTensionRolling) {
            this.isClicked = isStopImme;
            this.isStop = true;
            this.isStopImmediately = isStopImme;
            this.isMuteColumnDone = false;
        }
    }

    setItems(listItemsName, imagePrefix = "1_", isPlayingTrial = false) {
        this.items = listItemsName;
        this.imagePrefix = imagePrefix;
        for(let i = 0 ; i < this._listNodeItem.length; i++) {
            let nodeItem = this._listNodeItem[i];
            nodeItem.getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
            if(nodeItem.getComponent(ItemController) && nodeItem.getComponent(ItemController).id < 3) {
                nodeItem.getComponent(ItemController).serverID = parseInt(this.items[i].split("_")[1]);
                nodeItem.getComponent(ItemController).isStopColumn = true;
                nodeItem.getComponent(ItemController).showAnimItem(1.5, false, false, imagePrefix);
            }
        }

    }

    setScaleAllItem(scale) {
        for(let i = 0 ; i < this._listNodeItem.length; i++) {
            this._listNodeItem[i].setScale(scale);
        }
    }

    setResultFreeSpin(itemPrefix) {
        this.imagePrefix = itemPrefix;
        for(let i = 0; i < this._listNodeItem.length; i++) {
            this.items[i] = this.imagePrefix + this.items[i].split("_")[1];
            this._listNodeItem[i].getComponent(cc.Sprite).spriteFrame = this.getRollerController().getItemSpriteFrame(this.items[i]);
            if(this._listNodeItem[i].getComponent(ItemController) && this._listNodeItem[i].getComponent(ItemController).id < 3) {
                this._listNodeItem[i].getComponent(ItemController).serverID = parseInt(this.items[i].split("_")[1]);
                this._listNodeItem[i].getComponent(ItemController).isStopColumn = true;
                this._listNodeItem[i].getComponent(ItemController).hideAnimItem();
            }
        }
    }

    tensionRoll(delayTime) {
        let self = this;
        this.isTensionRolling = true;
        this.velocity = 1.8 * this.velocity;
        this.node.runAction(
            cc.sequence(
                cc.delayTime(delayTime - 2),
                cc.callFunc(() => {
                    MusicPlayer.getInstance().playEffect(this.pathRollTension);
                }),
            )
        )

        this.node.runAction(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.callFunc(() => {
                    this.isStop = true;
                })
            )
        )
    }
}
