import Dialog from "../../../scripts/common/Dialog";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Slot3x3PopupGuide extends Dialog {

    show() {
        this.endScale = 1.23;
        this.showScale = 1.27;
        super.show();
    }

    dismiss(){
        super.dismiss();
    }
}
