import Dialog from "../../../scripts/common/Dialog";
import Slot1Controller from "./Slot1.Slot1Controller";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import Slot1Slot1Controller from "./Slot1.Slot1Controller";
import PopupJackpotHistory from "./Slot1.PopupJackpotHistory";
import PopupHistory from "./Slot1.PopupHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupGuide extends Dialog {
    @property(cc.Toggle)
    toggleMusic = null;
    @property(cc.Toggle)
    toggleEffect = null;
    @property(cc.Prefab)
    prefabJackpotHistory = null;
    @property(cc.Prefab)
    prefabHistory = null;

    start() {
        this.toggleMusic.isChecked = GameConfigManager.getInstance().enableBackgroundMusic == true;
        this.toggleEffect.isChecked = GameConfigManager.getInstance().enableSound == true;
    }

    show() {
        super.show();
    }

    dismiss() {
        super.dismiss();
    }

    onChangeSoundEffect() {
        GameConfigManager.getInstance().setEnableSound(this.toggleEffect.isChecked);
        if(this.toggleEffect.isChecked) {
            Slot1Slot1Controller.getInstance().playSFXClick();
        }
    }

    onChangeMusic() {
        GameConfigManager.getInstance().setEnableBgMusic(this.toggleMusic.isChecked);
        if(this.toggleMusic.isChecked) {
            Slot1Controller.getInstance().playAudioSourceMain();
        } else {
            Slot1Controller.getInstance().muteAllAudioSource();
        }
    }

    onJackpotHistoryClicked() {
        let popupJackpotHistory = cc.instantiate(this.prefabJackpotHistory);
        this.node.parent.addChild(popupJackpotHistory);
        popupJackpotHistory.getComponent(PopupJackpotHistory).show();
    }

    onHistoryClicked() {
        let popupHistory = cc.instantiate(this.prefabHistory);
        this.node.parent.addChild(popupHistory);
        popupHistory.getComponent(PopupHistory).show();
    }
}
export default PopupGuide;