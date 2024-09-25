import Dialog from "../../../scripts/common/Dialog";
import SlotPopupBase from "../../../scripts/common/SlotPopupBase";
import Slot1Controller from "./Slot1.Slot1Controller";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupGuide extends cc.Component {
    @property(cc.Sprite)
    sprTitle = null;
    @property([cc.SpriteFrame])
    title = [];
    @property([cc.Node])
    pages: cc.Node[] = [];
    @property(cc.Node)
    btnNext: cc.Node = null;
    @property(cc.Node)
    btnPrev: cc.Node = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property(cc.PageView)
    pageView = null;
    @property(cc.SpriteAtlas)
    gameAtlas = null;
    @property([cc.Node])
    listNodeItem = [];

    private page = 0;

    private soundSlotState = null;
    private itemPrefix = "symbol_";
    start() {
    }


    onLoad() {
        this.setupIconGuide(Slot1Controller._instance.betIdx);
        this.page = 0;
        this.btnNext.active = true;
        this.btnPrev.active = false;
        this.pageView.scrollToPage(0,0);
    }

    actNext() {
        if (this.page < this.pages.length - 1) {
            this.page++;
        }
        this.sprTitle.spriteFrame = this.title[this.page];
        this.pageView.scrollToPage((this.pageView.getCurrentPageIndex() + 1), 1);
        if (this.page == this.pages.length - 1) {
            this.btnNext.active = false;
        }
        this.btnPrev.active = true;
    }

    actPrev() {
        if (this.page > 0) {
            this.page--;
        }
        this.sprTitle.spriteFrame = this.title[this.page];
        this.pageView.scrollToPage((this.pageView.getCurrentPageIndex() -1), 1);
        if (this.page == 0) {
            this.btnPrev.active = false;
        }
        this.btnNext.active = true;
    }

    private reloadData() {
        for (let i = 0; i < this.pages.length; i++) {
            this.pages[i].active = i == this.page;
            this.sprTitle.spriteFrame = this.title[this.page];
        }
    }

    dismiss() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        let container = this.node.getChildByName('Container');
        container.scale = 1;
        container.runAction(
            cc.sequence(
                cc.scaleTo(0.1, 1.1),
                cc.scaleTo(0.25, 0),
                cc.callFunc(() => {
                    this.node.destroy();
                })
            )
        );
    }

    setupIconGuide(betIdx) {
        switch (betIdx) {
            case 0:
                this.itemPrefix = "symbol_1_";
                break;
            case 1:
                this.itemPrefix = "symbol_2_";
                break;
            case 3:
                this.itemPrefix = "symbol_3_";
                break;
        }
        for(let i = 0 ; i < this.listNodeItem.length; i++) {
            this.listNodeItem[i].getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame(`${this.itemPrefix}${i + 3}`);
        }
    }
}
export default PopupGuide;