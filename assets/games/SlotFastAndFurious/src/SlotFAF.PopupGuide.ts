import Dialog from "../../../scripts/common/Dialog";
import SlotFAFSlotFAFController from "./SlotFAF.SlotFAFController";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupGuide extends cc.Component {
    @property(cc.Sprite)
    sprTitle = null;
    @property([cc.SpriteFrame])
    spriteFrameTitle = [];
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

    @property([cc.Sprite])
    sprGuide = [];
    @property(cc.SpriteAtlas)
    spriteAtlasGuide = null;

    private page = 0;

    private soundSlotState = null;

    start() {
    }

    setupIconGuide() {
        let symbolPrefix = `symbol_${SlotFAFSlotFAFController.getInstance().betIdx + 1}_`;
        for(let i = 0; i < this.sprGuide.length; i++) {
            this.sprGuide[i].spriteFrame = this.spriteAtlasGuide.getSpriteFrame(`${symbolPrefix}${parseInt(this.sprGuide[i].node.name)+2}`);
        }
    }

    protected onLoad() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.page = 0;
        this.setupIconGuide();
        this.btnPrev.active = false;
        this.btnNext.active = true;
        this.pageView.scrollToPage(0,0);
    }

    actNext() {
        if (this.page < this.pages.length - 1) {
            this.page++;
        }
        this.setupTitleGuide(this.page);
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
        this.setupTitleGuide(this.page);
        if (this.page == 0) {
            this.btnPrev.active = false;
        }
        this.btnNext.active = true;
        this.pageView.scrollToPage((this.pageView.getCurrentPageIndex() -1), 1);
    }

    private reloadData() {
        for (let i = 0; i < this.pages.length; i++) {
            this.pages[i].active = i == this.page;
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

    setupTitleGuide(page) {
        switch (page) {
            case 0:
            case 1:
                this.sprTitle.spriteFrame = this.spriteFrameTitle[0];
                break;
            case 2:
                this.sprTitle.spriteFrame = this.spriteFrameTitle[1];
                break;
            case 3:
                this.sprTitle.spriteFrame = this.spriteFrameTitle[2];
                break;
        }
    }
}
export default PopupGuide;