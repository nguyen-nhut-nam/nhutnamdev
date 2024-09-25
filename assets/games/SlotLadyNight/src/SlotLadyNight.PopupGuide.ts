import Dialog from "../../../scripts/common/Dialog";
import SlotPopupBase from "../../../scripts/common/SlotPopupBase";

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

    private page = 0;

    private soundSlotState = null;

    start() {
    }


    onLoad() {
        if (this.canPlaySound()) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.page = 0;
        this.btnNext.active = true;
        this.btnPrev.active = false;
        this.pageView.scrollToPage(0,0);
    }

    actNext() {
        if (this.page < this.pages.length - 1) {
            this.page++;
        }
        this.setupTitleGuide(this.page);
        // this.reloadData();
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
        if (this.canPlaySound()) {
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

    canPlaySound() {
        var soundSave = cc.sys.localStorage.getItem("sound_Slot_1");
        if (soundSave != null) {
            this.soundSlotState = parseInt(soundSave);
        } else {
            this.soundSlotState = 1;
        }

        if (this.soundSlotState == 1) {
            return true;
        } else {
            return false;
        }
    }

    setupTitleGuide(page) {
        if(page === 0 || page === this.pages.length - 1) {
            this.sprTitle.spriteFrame = this.title[0];
        }
        if(page === 1) {
            this.sprTitle.spriteFrame = this.title[1];
        }
        if(page === 2) {
            this.sprTitle.spriteFrame = this.title[2];
        }
    }
}
export default PopupGuide;