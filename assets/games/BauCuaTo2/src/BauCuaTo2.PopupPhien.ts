import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import Utils from "../../../scripts/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupPhien extends Dialog {
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private items = new Array<cc.Node>();

    show() {
        super.show();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        if (this.itemTemplate != null) this.itemTemplate.active = false;
    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
    }

    _onShowed() {
        super._onShowed();
    }

}
