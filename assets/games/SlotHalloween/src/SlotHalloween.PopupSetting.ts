import Dialog from "../../../scripts/common/Dialog";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import UIToggleSlider from "../../../scripts/common/game/UIToggleSlider";
import PopupJackpotHistory from "./SlotHalloween.PopupJackpotHistory";
import SlotHalloweenSlotHalloweenController from "./SlotHalloween.SlotHalloweenController";
import PopupHistory from "./SlotHalloween.PopupHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupSetting extends Dialog {

    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property(cc.Button)
    btnClose = null;
    @property(cc.Prefab)
    prefabJackpotHistory = null;
    @property(cc.Prefab)
    prefabHistory = null;
    @property(UIToggleSlider)
    isSoundEffect = null;
    @property(UIToggleSlider)
    isBgMusic = null;

    start() {
        this.isSoundEffect.initStart(GameConfigManager.getInstance().enableSound);
        this.isSoundEffect.onValueChange = this.onChangeSoundEffect.bind(this);
        this.isBgMusic.initStart(GameConfigManager.getInstance().enableBackgroundMusic);
        this.isBgMusic.onValueChange = this.onChangeBgMusic.bind(this);
    }

    onChangeSoundEffect(enable) {
        GameConfigManager.getInstance().setEnableSound(enable);
        if(enable) {
            cc.audioEngine.playEffect(this.soundClick, false);
        }
    }

    onChangeBgMusic(enable) {
        GameConfigManager.getInstance().setEnableBgMusic(enable);
        if(enable) {
            SlotHalloweenSlotHalloweenController.getInstance().playAudioSourceMain();
        } else {
            SlotHalloweenSlotHalloweenController.getInstance().muteAllAudioSource();
        }
    }

    show() {
        super.show();
        this.btnClose.interactable = true;
    }

    dismiss() {
        this.btnClose.interactable = false;
        super.dismiss();
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
export default PopupSetting;