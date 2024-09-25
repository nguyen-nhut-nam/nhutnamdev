import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import GameErrorMessage from "../../../scripts/enum/GameErrorMessage";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupSelectLine extends Dialog {
    @property(cc.Node)
    buttonsLine: cc.Node = null;
    @property(cc.Button)
    btnClose: cc.Button = null;

    @property([cc.SpriteFrame])
    sprInActive = [];
    @property([cc.SpriteFrame])
    sprActive = [];

    onSelectedChanged: (lines: Array<number>) => void = null;
    private readonly SELECTED = "selected";

    start() {
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = true;
            node.on("click", () => {
                node[this.SELECTED] = !node[this.SELECTED];
                node.getComponent(cc.Sprite).spriteFrame = node[this.SELECTED] ? this.sprActive[i] : this.sprInActive[i];
                if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
                this.btnClose.interactable = this.getSelectedLines().length > 0;
            });
        }
    }

    actSelectAll() {
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = true;
            node.getComponent(cc.Sprite).spriteFrame = node[this.SELECTED] ? this.sprActive[i] : this.sprInActive[i];
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
        this.btnClose.interactable = true;
    }

    actSelectEven() {
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = i % 2 != 0;
            node.getComponent(cc.Sprite).spriteFrame = node[this.SELECTED] ? this.sprActive[i] : this.sprInActive[i];
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
        this.btnClose.interactable = true;
    }

    actSelectOdd() {
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = i % 2 == 0;
            node.getComponent(cc.Sprite).spriteFrame = node[this.SELECTED] ? this.sprActive[i] : this.sprInActive[i];
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
        this.btnClose.interactable = true;
    }

    actDeselectAll() {
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = false;
            node.getComponent(cc.Sprite).spriteFrame = node[this.SELECTED] ? this.sprActive[i] : this.sprInActive[i];
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
    }

    private getSelectedLines() {
        let lines = new Array<number>();
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            if (typeof node[this.SELECTED] == "undefined" || node[this.SELECTED]) {
                lines.push(i + 1);
            }
        }
        return lines;
    }

    dismiss() {
        if (this.getSelectedLines().length > 0) {
            super.dismiss();
        } else {
            App.instance.actShowThongBao(GameErrorMessage.NOT_SELECT_LINES);
            return;
        }
    }
}
export default PopupSelectLine;